import { supabase } from '../../utils/supabase';
import { 
  CoachScenario, 
  CoachSession, 
  CoachMessage, 
  SendMessageRequest, 
  SendMessageSchema, 
  SendMessageResponse, 
  SessionSettings, 
  VocabularyItem,
  CoachSessionStats
} from './types';
import { speechService } from './speechService';
import { getStoredPuterToken, callPuterChatCompletion, PuterChatMessage } from '../puter';

class CoachService {
  private inFlightRequests = new Set<string>();

  /**
   * Retrieves all active coach scenarios
   */
  public async getScenarios(): Promise<CoachScenario[]> {
    try {
      const { data, error } = await supabase
        .from('coach_scenarios')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.warn('Failed to load coach scenarios from DB:', error.message);
        return this.getDefaultScenarios();
      }

      if (data && data.length > 0) {
        return data as CoachScenario[];
      }
      return this.getDefaultScenarios();
    } catch {
      return this.getDefaultScenarios();
    }
  }

  /**
   * Loads a specific scenario by ID or returns default
   */
  public async getScenarioById(id?: string): Promise<CoachScenario> {
    const defaultScenario = this.getDefaultScenarios()[0];
    if (!id) return defaultScenario;

    try {
      const { data } = await supabase
        .from('coach_scenarios')
        .select('*')
        .eq('id', id)
        .single();

      if (data) return data as CoachScenario;
    } catch {}

    return defaultScenario;
  }

  /**
   * Creates or restores an active coach session
   */
  public async createOrGetSession(
    userId: string,
    scenarioId?: string,
    targetLanguage: string = 'English',
    proficiencyLevel: string = 'A2-B1',
    settings?: Partial<SessionSettings>
  ): Promise<CoachSession> {
    const scenario = await this.getScenarioById(scenarioId);

    // Look for existing active session for this scenario and user
    const { data: existing } = await supabase
      .from('coach_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('scenario_id', scenario.id)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing) {
      return {
        ...(existing as CoachSession),
        scenario,
      };
    }

    // Create new session
    const newSessionData = {
      user_id: userId,
      scenario_id: scenario.id,
      target_language: targetLanguage,
      proficiency_level: proficiencyLevel,
      status: 'active' as const,
      settings: {
        targetLanguage,
        nativeLanguage: settings?.nativeLanguage || 'Bengali',
        proficiencyLevel,
        conversationTopic: scenario.category || 'Restaurant',
        aiCharacter: scenario.ai_role,
        voiceRate: 1.0,
        translationPreference: true,
        pronunciationAssessment: true,
        correctionIntensity: 'balanced' as const,
        autoplayAudio: false,
        ...settings,
      },
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: created, error } = await supabase
      .from('coach_sessions')
      .insert(newSessionData)
      .select('*')
      .single();

    if (error || !created) {
      throw new Error(`Failed to create coach session: ${error?.message || 'Database error'}`);
    }

    // Initialize stats
    try {
      await supabase.from('coach_session_stats').insert({
        session_id: created.id,
        user_id: userId,
        total_messages: 0,
        practice_duration_seconds: 0,
        vocabulary_count: 0,
      });
    } catch {}

    return {
      ...(created as CoachSession),
      scenario,
    };
  }

  /**
   * Fetches messages for a given session
   */
  public async getSessionMessages(sessionId: string): Promise<CoachMessage[]> {
    const { data, error } = await supabase
      .from('coach_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Failed to fetch session messages:', error.message);
      return [];
    }

    return (data || []).map(m => ({
      ...m,
      pronunciation_guide: m.provider_metadata?.pronunciation_guide,
      bilingual_vocabulary: m.provider_metadata?.bilingual_vocabulary,
      suggested_replies: m.provider_metadata?.suggested_replies,
      suggested_replies_detailed: m.provider_metadata?.suggested_replies_detailed,
      pronunciation_details: m.provider_metadata?.pronunciation_details,
    })) as CoachMessage[];
  }

  /**
   * Authenticated chat message sending endpoint with full roleplay and teaching logic
   */
  public async sendMessage(
    sessionId: string,
    rawPayload: SendMessageRequest
  ): Promise<SendMessageResponse> {
    // 1. Validate request schema with Zod
    const payload = SendMessageSchema.parse(rawPayload);

    // 2. Prevent duplicate/in-flight submissions
    const lockKey = `${sessionId}_${payload.idempotencyKey || payload.content.trim()}`;
    if (this.inFlightRequests.has(lockKey)) {
      throw new Error('Message submission already in progress. Please wait.');
    }
    this.inFlightRequests.add(lockKey);

    try {
      // 3. Verify user and session ownership
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr || !user) {
        throw new Error('Authentication required. Please sign in to continue.');
      }

      // Check idempotency in database
      if (payload.idempotencyKey) {
        const { data: existingMsg } = await supabase
          .from('coach_messages')
          .select('*')
          .eq('session_id', sessionId)
          .eq('idempotency_key', payload.idempotencyKey)
          .maybeSingle();

        if (existingMsg) {
          const history = await this.getSessionMessages(sessionId);
          const aiReply = history.find(m => m.role === 'assistant' && new Date(m.created_at) > new Date(existingMsg.created_at));
          return {
            userMessage: existingMsg as CoachMessage,
            aiMessage: aiReply || existingMsg as CoachMessage,
            suggestedResponses: aiReply?.suggested_replies || [],
          };
        }
      }

      // 4. Load session & scenario context
      const { data: sessionData, error: sessionErr } = await supabase
        .from('coach_sessions')
        .select('*, coach_scenarios(*)')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      if (sessionErr || !sessionData) {
        throw new Error('Coach session not found or permission denied.');
      }

      const scenario = sessionData.coach_scenarios || (await this.getScenarioById(sessionData.scenario_id));

      // 5. Evaluate pronunciation if inputType is voice
      let pronunciationScore: number | null = null;
      let pronunciationDetails: any = null;

      if (payload.inputType === 'voice') {
        const evalResult = speechService.evaluatePronunciation(
          payload.content,
          scenario?.suggested_responses?.[0]
        );
        pronunciationScore = evalResult.accuracyScore;
        pronunciationDetails = evalResult;
      }

      // 6. Persist user message
      const userMessageInsert = {
        session_id: sessionId,
        user_id: user.id,
        role: 'user' as const,
        content: payload.content.trim(),
        input_type: payload.inputType,
        pronunciation_score: pronunciationScore,
        idempotency_key: payload.idempotencyKey || null,
        provider_metadata: pronunciationDetails ? { pronunciation_details: pronunciationDetails } : {},
        created_at: new Date().toISOString(),
      };

      const { data: savedUserMsg, error: userMsgErr } = await supabase
        .from('coach_messages')
        .insert(userMessageInsert)
        .select('*')
        .single();

      if (userMsgErr || !savedUserMsg) {
        throw new Error(`Failed to save user message: ${userMsgErr?.message}`);
      }

      // 7. Load recent conversation history for prompt
      const { data: recentHistory } = await supabase
        .from('coach_messages')
        .select('role, content')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(8);

      const conversationHistory = (recentHistory || [])
        .reverse()
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      // 8. Construct expert roleplay / bilingual tutor system prompt
      const targetLang = sessionData.target_language || 'Spanish';
      const userLevel = sessionData.proficiency_level || 'A1';
      const nativeLang = sessionData.settings?.nativeLanguage || 'Bengali';
      const learningMode = sessionData.settings?.learningMode || (userLevel.startsWith('A1') ? 'bilingual_tutor' : 'dual_immersion');
      const aiRole = scenario.ai_role || 'Waiter / Server';
      const userRole = scenario.user_role || 'Customer';
      const scenarioTitle = scenario.title || 'Ordering at a Diner & Bistro';

      let systemPrompt = '';
      if (learningMode === 'bilingual_tutor') {
        systemPrompt = `You are an expert, patient, and engaging Bilingual AI Language Tutor teaching ${targetLang} to a native ${nativeLang} speaker.
The student is at level ${userLevel} (Beginner). Topic/Context: "${scenarioTitle}".

Core Teaching Pedagogy & Rules:
1. Primary Instructional Language: You MUST write your explanations, conversational guidance, and questions in ${nativeLang} (বাংলা).
2. Teach Step-by-Step: Introduce 1 or 2 high-frequency words or short sentences in ${targetLang} (e.g. Spanish) per turn directly related to "${scenarioTitle}".
3. Always explain:
   - What the word/phrase means in ${nativeLang} (e.g. "স্প্যানিশে বই-কে বলে 'el libro' (এল লিব্রো)")
   - How to pronounce it phonetically in ${nativeLang} script
4. Ask the student an encouraging question or invite them to repeat or respond using the phrase.
5. End your message with these exact structured tags on separate lines:
[PRONUNCIATION: <Phonetic pronunciation guide of the target words written in ${nativeLang} script>]
[TRANSLATION: <Clear Bengali translation/summary of your message>]
[VOCABULARY: word1="meaning in ${nativeLang}|phonetic in ${nativeLang}" | word2="meaning in ${nativeLang}|phonetic in ${nativeLang}"]
[SUGGESTIONS: "target phrase 1 | meaning in ${nativeLang} | phonetic in ${nativeLang}" | "target phrase 2 | meaning in ${nativeLang} | phonetic in ${nativeLang}" | "target phrase 3 | meaning in ${nativeLang} | phonetic in ${nativeLang}"]
If the learner made an error: [CORRECTION: original="..." | better="..." | note="Explanation in ${nativeLang}"]`;
      } else {
        systemPrompt = `You are an expert AI Language Coach roleplaying as a ${aiRole} in the scenario "${scenarioTitle}".
The user is roleplaying as a ${userRole}.
Target Learning Language: ${targetLang}
Learner CEFR Level: ${userLevel}
Learner's Native/Explanation Language: ${nativeLang}

Roleplay & Dual-Immersion Directives:
1. Stay in character as ${aiRole}. Reply conversationally in natural ${targetLang} in 2-3 sentences max suited for ${userLevel}.
2. Keep dialogue engaging by asking a relevant follow-up question.
3. End your message with these exact structured tags on separate lines:
[PRONUNCIATION: <Phonetic pronunciation guide in ${nativeLang} script>]
[TRANSLATION: <Complete translation in ${nativeLang}>]
[VOCABULARY: word1="meaning in ${nativeLang}|phonetic in ${nativeLang}" | word2="meaning in ${nativeLang}|phonetic in ${nativeLang}"]
[SUGGESTIONS: "target phrase 1 | meaning in ${nativeLang} | phonetic in ${nativeLang}" | "target phrase 2 | meaning in ${nativeLang} | phonetic in ${nativeLang}" | "target phrase 3 | meaning in ${nativeLang} | phonetic in ${nativeLang}"]
If the learner made an error: [CORRECTION: original="..." | better="..." | note="Explanation in ${nativeLang}"]`;
      }

      // 9. Call AI provider
      const aiResponse = await this.callAIProvider(
        user.id,
        systemPrompt,
        conversationHistory,
        payload.content.trim(),
        targetLang,
        nativeLang,
        learningMode
      );

      // 10. Persist AI message
      const aiMessageInsert = {
        session_id: sessionId,
        user_id: user.id,
        role: 'assistant' as const,
        content: aiResponse.replyText,
        input_type: 'text' as const,
        translation: aiResponse.translation || null,
        correction: aiResponse.correction || null,
        explanation: aiResponse.explanation || null,
        provider_metadata: {
          pronunciation_guide: aiResponse.pronunciationGuide || null,
          bilingual_vocabulary: aiResponse.vocabulary || [],
          suggested_replies: aiResponse.suggestedReplies,
          suggested_replies_detailed: aiResponse.suggestedRepliesDetailed || [],
          model: aiResponse.model || 'puter-gpt-4o-mini',
        },
        created_at: new Date().toISOString(),
      };

      const { data: savedAiMsg, error: aiMsgErr } = await supabase
        .from('coach_messages')
        .insert(aiMessageInsert)
        .select('*')
        .single();

      if (aiMsgErr || !savedAiMsg) {
        throw new Error(`Failed to save AI response: ${aiMsgErr?.message}`);
      }

      // 11. Update session statistics
      try {
        await supabase.rpc('increment_coach_stats', {
          p_session_id: sessionId,
          p_user_id: user.id,
        });
      } catch {
        // Fallback direct update
        await supabase
          .from('coach_session_stats')
          .update({
            total_messages: (recentHistory?.length || 0) + 2,
            practice_duration_seconds: Math.round((Date.now() - new Date(sessionData.started_at).getTime()) / 1000),
          })
          .eq('session_id', sessionId);
      }

      return {
        userMessage: {
          ...(savedUserMsg as CoachMessage),
          pronunciation_details: pronunciationDetails,
        },
        aiMessage: {
          ...(savedAiMsg as CoachMessage),
          pronunciation_guide: aiResponse.pronunciationGuide,
          bilingual_vocabulary: aiResponse.vocabulary,
          suggested_replies: aiResponse.suggestedReplies,
          suggested_replies_detailed: aiResponse.suggestedRepliesDetailed,
        },
        suggestedResponses: aiResponse.suggestedReplies,
        suggestedResponsesDetailed: aiResponse.suggestedRepliesDetailed,
      };

    } finally {
      this.inFlightRequests.delete(lockKey);
    }
  }

  /**
   * Translates a message on demand
   */
  public async translateMessage(messageId: string, targetLanguage: string): Promise<string> {
    const { data: msg } = await supabase
      .from('coach_messages')
      .select('content, translation')
      .eq('id', messageId)
      .single();

    if (!msg) throw new Error('Message not found');
    if (msg.translation) return msg.translation;

    const { data: { user } } = await supabase.auth.getUser();
    const token = await getStoredPuterToken(user?.id);

    let translated = '';
    if (token) {
      try {
        const res = await callPuterChatCompletion(token, [
          { role: 'system', content: `Translate the following text into ${targetLanguage}. Return only the translation, no extra commentary.` },
          { role: 'user', content: msg.content }
        ]);
        translated = res.text.trim();
      } catch {}
    }

    if (!translated) {
      translated = `[Translated to ${targetLanguage}]: ${msg.content}`;
    }

    // Cache translation in DB
    await supabase
      .from('coach_messages')
      .update({ translation: translated })
      .eq('id', messageId);

    return translated;
  }

  /**
   * Saves a vocabulary item for the user
   */
  public async saveVocabulary(
    userId: string,
    word: string,
    translation: string,
    contextSentence?: string,
    language: string = 'en'
  ): Promise<VocabularyItem> {
    const { data, error } = await supabase
      .from('coach_vocabulary')
      .insert({
        user_id: userId,
        word: word.trim(),
        translation: translation.trim(),
        context_sentence: contextSentence || null,
        language,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return data as VocabularyItem;
  }

  /**
   * Retrieves user saved vocabulary list
   */
  public async getVocabulary(userId: string): Promise<VocabularyItem[]> {
    const { data } = await supabase
      .from('coach_vocabulary')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return (data || []) as VocabularyItem[];
  }

  /**
   * Fetches session stats
   */
  public async getSessionStats(sessionId: string): Promise<CoachSessionStats | null> {
    const { data } = await supabase
      .from('coach_session_stats')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    return data as CoachSessionStats | null;
  }

  /**
   * Internal AI provider call routing with robust fallbacks
   */
  private async callAIProvider(
    userId: string,
    systemPrompt: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    userMessage: string,
    targetLang: string = 'Spanish',
    nativeLang: string = 'Bengali',
    learningMode: string = 'bilingual_tutor'
  ): Promise<{
    replyText: string;
    pronunciationGuide?: string;
    translation?: string;
    vocabulary?: Array<{ word: string; meaning: string; phonetic: string }>;
    correction?: string;
    explanation?: string;
    suggestedReplies: string[];
    suggestedRepliesDetailed?: Array<{ target: string; native: string; phonetic: string }>;
    model?: string;
  }> {
    const token = await getStoredPuterToken(userId);
    const messages: PuterChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: userMessage }
    ];

    let rawText = '';
    let usedModel = 'gpt-4o-mini';

    if (token) {
      try {
        const completion = await callPuterChatCompletion(token, messages, 'gpt-4o-mini');
        rawText = completion.text;
      } catch (err: any) {
        console.warn('Puter AI error, using fallback:', err.message);
      }
    }

    if (!rawText) {
      // Natural contextual fallback if provider network is unavailable
      rawText = this.generateOfflineFallbackReply(userMessage, targetLang, nativeLang, learningMode);
    }

    // Parse structured tags
    let cleanReply = rawText;
    let pronunciationGuide: string | undefined = undefined;
    let translation: string | undefined = undefined;
    const vocabulary: Array<{ word: string; meaning: string; phonetic: string }> = [];
    let correction: string | undefined = undefined;
    let explanation: string | undefined = undefined;
    let suggestedReplies: string[] = [];
    const suggestedRepliesDetailed: Array<{ target: string; native: string; phonetic: string }> = [];

    // Pronunciation tag: [PRONUNCIATION: ...]
    const pronMatch = cleanReply.match(/\[PRONUNCIATION:\s*([^\]]+)\]/i);
    if (pronMatch) {
      cleanReply = cleanReply.replace(pronMatch[0], '').trim();
      pronunciationGuide = pronMatch[1].trim();
    }

    // Translation tag: [TRANSLATION: ...]
    const transMatch = cleanReply.match(/\[TRANSLATION:\s*([^\]]+)\]/i);
    if (transMatch) {
      cleanReply = cleanReply.replace(transMatch[0], '').trim();
      translation = transMatch[1].trim();
    }

    // Vocabulary tag: [VOCABULARY: word1="meaning|phonetic" | word2="meaning|phonetic"]
    const vocabMatch = cleanReply.match(/\[VOCABULARY:\s*([^\]]+)\]/i);
    if (vocabMatch) {
      cleanReply = cleanReply.replace(vocabMatch[0], '').trim();
      const matches = Array.from(vocabMatch[1].matchAll(/([a-zA-Z\u00C0-\u024F\u0980-\u09FF\s]+)\s*=\s*"([^"]+)"/g));
      for (const kv of matches) {
        const word = kv[1].trim();
        const [meaning, phonetic] = kv[2].split('|').map(s => s.trim());
        if (word && meaning) {
          vocabulary.push({ word, meaning, phonetic: phonetic || '' });
        }
      }
    }

    // Correction match: [CORRECTION: original="..." | better="..." | note="..."]
    const corrMatch = cleanReply.match(/\[CORRECTION:\s*original="([^"]*)"\s*\|\s*better="([^"]*)"\s*\|\s*note="([^"]*)"\]/i);
    if (corrMatch) {
      cleanReply = cleanReply.replace(corrMatch[0], '').trim();
      correction = corrMatch[2];
      explanation = corrMatch[3];
    }

    // Suggestions match: [SUGGESTIONS: "target | meaning | phonetic" | ...]
    const sugMatch = cleanReply.match(/\[SUGGESTIONS:\s*([^\]]+)\]/i);
    if (sugMatch) {
      cleanReply = cleanReply.replace(sugMatch[0], '').trim();
      const matches = Array.from(sugMatch[1].matchAll(/"([^"]+)"/g)).map(m => m[1]);
      for (const opt of matches) {
        const parts = opt.split('|').map(s => s.trim());
        if (parts.length >= 3) {
          suggestedReplies.push(parts[0]);
          suggestedRepliesDetailed.push({
            target: parts[0],
            native: parts[1],
            phonetic: parts[2]
          });
        } else if (parts.length === 2) {
          suggestedReplies.push(parts[0]);
          suggestedRepliesDetailed.push({
            target: parts[0],
            native: parts[1],
            phonetic: ''
          });
        } else {
          suggestedReplies.push(opt);
          suggestedRepliesDetailed.push({
            target: opt,
            native: '',
            phonetic: ''
          });
        }
      }
    }

    if (suggestedReplies.length === 0) {
      if (learningMode === 'bilingual_tutor') {
        suggestedReplies = ["¡Hola!", "Quiero un café", "Un libro, por favor"];
        suggestedRepliesDetailed.push(
          { target: "¡Hola!", native: "হ্যালো", phonetic: "ওলা" },
          { target: "Quiero un café", native: "আমি একটি কফি চাই", phonetic: "কিয়েরো উন কাফে" },
          { target: "Un libro, por favor", native: "একটি বই, দয়া করে", phonetic: "উন লিব্রো, পর ফাভোর" }
        );
      } else {
        suggestedReplies = ["¿Puedo ver el menú?", "Un café con leche, por favor", "Gracias, estoy listo"];
        suggestedRepliesDetailed.push(
          { target: "¿Puedo ver el menú?", native: "আমি কি মেনু দেখতে পারি?", phonetic: "পুয়েদো বের এল মেনু?" },
          { target: "Un café con leche, por favor", native: "দুধ কফি দিন, দয়া করে", phonetic: "উন কাফে কন লেচে, পর ফাভোর" },
          { target: "Gracias, estoy listo", native: "ধন্যবাদ, আমি প্রস্তুত", phonetic: "গ্রাসিয়াস, এস্তই লিস্তো" }
        );
      }
    }

    return {
      replyText: cleanReply,
      pronunciationGuide,
      translation,
      vocabulary,
      correction,
      explanation,
      suggestedReplies,
      suggestedRepliesDetailed,
      model: usedModel,
    };
  }

  private generateOfflineFallbackReply(
    userMessage: string,
    targetLang: string = 'Spanish',
    nativeLang: string = 'Bengali',
    learningMode: string = 'bilingual_tutor'
  ): string {
    const isSpanish = targetLang.toLowerCase().includes('span') || targetLang.toLowerCase().includes('es');

    if (learningMode === 'bilingual_tutor') {
      if (isSpanish) {
        return `¡Hola! স্প্যানিশ ভাষা শেখার ক্লাসে আপনাকে স্বাগতম।

আজকে আমরা খুব প্রয়োজনীয় কিছু শব্দ ও বাক্য শিখব:
1. স্প্যানিশে শুভেচ্ছা বা হ্যালো বলতে বলে **¡Hola!** (উচ্চারণ: **ওলা**)।
2. আর 'একটি বই'-কে স্প্যানিশে বলে **un libro** (উচ্চারণ: **উন লিব্রো**)।
3. রেস্তোরাঁয় 'একটি কফি চাই' বলতে হলে বলবেন **Quiero un café** (উচ্চারণ: **কিয়েরো উন কাফে**)।

এবার আপনি বলুন তো: ¡Hola!
[PRONUNCIATION: ওলা! • উন লিব্রো • কিয়েরো উন কাফে]
[TRANSLATION: হ্যালো! স্প্যানিশ ক্লাসে স্বাগতম। বই = libro, কফি = café।]
[VOCABULARY: Hola="হ্যালো|ওলা" | libro="বই|লিব্রো" | café="কফি|কাফে"]
[SUGGESTIONS: "¡Hola! | হ্যালো | ওলা" | "Quiero un café | আমি একটি কফি চাই | কিয়েরো উন কাফে" | "Un libro, por favor | একটি বই, দয়া করে | উন লিব্রো, পর ফাভোর"]`;
      }

      return `Welcome! আজ আমরা নতুন কিছু শব্দ শিখব।
ইংরেজি 'বই' হলো **a book**। আর কফি চাইতে বললে বলবেন **I would like a coffee, please**।
এবার আপনি চেষ্টা করে দেখুন!
[PRONUNCIATION: আ বুক • আই উড লাইক আ কফি]
[TRANSLATION: স্বাগতম! আজ আমরা বই এবং কফি চাওয়া শিখব।]
[VOCABULARY: book="বই|বুক" | coffee="কফি|কফি" | please="দয়া করে|প্লিজ"]
[SUGGESTIONS: "Hello! | হ্যালো | হেলো" | "I would like a coffee | আমি একটি কফি চাই | আই উড লাইক আ কফি" | "Can I have a book? | আমি কি একটি বই পেতে পারি? | ক্যান আই হ্যাভ আ বুক?"]`;
    }

    // Dual immersion roleplay fallback
    if (isSpanish) {
      return `¡Buenas tardes! Bienvenido a nuestro restaurante. ¿Le gustaría ver el menú o prefiere comenzar con un café?
[PRONUNCIATION: বুয়েনাস তারদেস! বিয়েম্বেনিদো আ নুয়েস্ত্রো রেস্তোরান্তে]
[TRANSLATION: শুভ অপরাহ্ন! আমাদের রেস্তোরাঁয় স্বাগতম। আপনি কি মেনু দেখতে চান নাকি এক কাপ কফি দিয়ে শুরু করবেন?]
[VOCABULARY: menú="মেনু|মেনু" | café="কফি|কাফে" | por favor="দয়া করে|পর ফাভোর"]
[SUGGESTIONS: "¿Puedo ver el menú? | আমি কি মেনু দেখতে পারি? | পুয়েদো বের এল মেনু?" | "Un café con leche, por favor | এক কাপ দুধ কফি, দয়া করে | উন কাফে কন লেচে, পর ফাভোর" | "Gracias, estoy listo | ধন্যবাদ, আমি প্রস্তুত | গ্রাসিয়াস, এস্তই লিস্তো"]`;
    }

    return `Certainly! Welcome to our bistro. Would you like to start with a fresh coffee or take a look at our daily specials?
[PRONUNCIATION: সার্টেইনলি! ওয়েলকাম টু আওয়ার বিস্ট্রো]
[TRANSLATION: নিশ্চয়ই! আমাদের রেস্তোরাঁয় স্বাগতম। আপনি কি কফি দিয়ে শুরু করবেন নাকি আজকের স্পেশাল মেনু দেখবেন?]
[VOCABULARY: menu="মেনু|মেনু" | coffee="কফি|কফি" | specials="বিশেষ খাবার|স্পেশালস"]
[SUGGESTIONS: "Can I have the menu? | আমি কি মেনু পেতে পারি? | ক্যান আই হ্যাভ দ্য মেনু?" | "I'll have a coffee | আমি কফি নিব | আইল হ্যাভ আ কফি" | "What do you recommend? | আপনি কী সাজেস্ট করেন? | হোয়াট ডু ইউ রেকমেন্ড?"]`;
  }

  private getDefaultScenarios(): CoachScenario[] {
    return [
      {
        id: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
        title: 'Ordering at a Diner & Bistro',
        description: 'Practice ordering food and drinks, asking about the menu specials, and handling the check in a bustling bistro.',
        category: 'Dining',
        target_language: 'all',
        ai_role: 'Waiter / Server',
        user_role: 'Customer',
        proficiency_levels: ['A2', 'B1'],
        suggested_responses: ["Can I have the menu?", "I'll have a coffee.", "No, thank you, that is all."],
        is_active: true,
      },
      {
        id: 'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e',
        title: 'Checking into a Boutique Hotel',
        description: 'Communicate with the front desk concierge, confirm room amenities, ask for local tips, and check in smoothly.',
        category: 'Travel',
        target_language: 'all',
        ai_role: 'Front Desk Concierge',
        user_role: 'Hotel Guest',
        proficiency_levels: ['A2', 'B1', 'B2'],
        suggested_responses: ["I have a reservation under my name.", "What time is breakfast served?", "Can I request a late checkout?"],
        is_active: true,
      },
      {
        id: 'c3d4e5f6-a1b2-4c3d-ae4f-5a6b7c8d9e0f',
        title: 'Asking for Street Directions',
        description: 'Navigate an unfamiliar neighborhood by asking a friendly local for directions to nearby landmarks.',
        category: 'City Life',
        target_language: 'all',
        ai_role: 'Friendly Local Passerby',
        user_role: 'Lost Traveler',
        proficiency_levels: ['A1', 'A2'],
        suggested_responses: ["Excuse me, where is the nearest station?", "How far is the museum from here?", "Is there a pharmacy nearby?"],
        is_active: true,
      }
    ];
  }
}

export const coachService = new CoachService();
