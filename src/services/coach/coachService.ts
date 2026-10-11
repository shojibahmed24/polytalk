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
      suggested_replies: m.provider_metadata?.suggested_replies,
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

      // 8. Construct expert roleplay system prompt
      const targetLang = sessionData.target_language || 'English';
      const userLevel = sessionData.proficiency_level || 'A2-B1';
      const nativeLang = sessionData.settings?.nativeLanguage || 'Bengali';
      const aiRole = scenario.ai_role || 'Waiter / Server';
      const userRole = scenario.user_role || 'Customer';
      const scenarioTitle = scenario.title || 'Ordering at a Diner & Bistro';

      const systemPrompt = `You are an expert, engaging AI Language Coach roleplaying as a ${aiRole} in the scenario "${scenarioTitle}".
The user is roleplaying as a ${userRole}.
Target Learning Language: ${targetLang}
Learner CEFR Level: ${userLevel}
Learner's Explanation Language: ${nativeLang}

Roleplay & Teaching Directives:
1. Stay entirely in character as ${aiRole}. Reply conversationally in ${targetLang} in 2-3 sentences max.
2. Keep the dialogue interactive by asking an engaging follow-up question related to the scenario.
3. Keep vocabulary and complexity suited for ${userLevel}.
4. If the user's message contains mistakes in grammar, vocabulary, or polite phrasing, provide a tactful correction in ${nativeLang} in this exact tag format at the very end of your message:
[CORRECTION: original="..." | better="..." | note="..."]
Do not invent mistakes if the sentence is natural.
5. Provide exactly 3 short, natural suggested responses the user could choose next:
[SUGGESTIONS: "option 1" | "option 2" | "option 3"]
6. Never break character inside the main reply text.`;

      // 9. Call AI provider
      const aiResponse = await this.callAIProvider(
        user.id,
        systemPrompt,
        conversationHistory,
        payload.content.trim()
      );

      // 10. Persist AI message
      const aiMessageInsert = {
        session_id: sessionId,
        user_id: user.id,
        role: 'assistant' as const,
        content: aiResponse.replyText,
        input_type: 'text' as const,
        correction: aiResponse.correction || null,
        explanation: aiResponse.explanation || null,
        provider_metadata: {
          suggested_replies: aiResponse.suggestedReplies,
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
          suggested_replies: aiResponse.suggestedReplies,
        },
        suggestedResponses: aiResponse.suggestedReplies,
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
    userMessage: string
  ): Promise<{
    replyText: string;
    correction?: string;
    explanation?: string;
    suggestedReplies: string[];
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
      rawText = this.generateOfflineFallbackReply(userMessage);
    }

    // Parse structured tags
    let cleanReply = rawText;
    let correction: string | undefined = undefined;
    let explanation: string | undefined = undefined;
    let suggestedReplies: string[] = [
      "Can I have the menu?",
      "I'll have a coffee.",
      "No, thank you, that is all."
    ];

    // Correction match: [CORRECTION: original="..." | better="..." | note="..."]
    const corrMatch = cleanReply.match(/\[CORRECTION:\s*original="([^"]*)"\s*\|\s*better="([^"]*)"\s*\|\s*note="([^"]*)"\]/i);
    if (corrMatch) {
      cleanReply = cleanReply.replace(corrMatch[0], '').trim();
      correction = corrMatch[2];
      explanation = corrMatch[3];
    }

    // Suggestions match: [SUGGESTIONS: "..." | "..." | "..."]
    const sugMatch = cleanReply.match(/\[SUGGESTIONS:\s*"([^"]+)"\s*\|\s*"([^"]+)"(?:\s*\|\s*"([^"]+)")?\]/i);
    if (sugMatch) {
      cleanReply = cleanReply.replace(sugMatch[0], '').trim();
      suggestedReplies = [sugMatch[1], sugMatch[2]];
      if (sugMatch[3]) suggestedReplies.push(sugMatch[3]);
    }

    return {
      replyText: cleanReply,
      correction,
      explanation,
      suggestedReplies,
      model: usedModel,
    };
  }

  private generateOfflineFallbackReply(userMessage: string): string {
    const lower = userMessage.toLowerCase();
    if (lower.includes('menu')) {
      return `Certainly! Here is today's menu. We have wonderful daily specials on fresh pasta and seafood. Would you like to hear about our soup of the day? [SUGGESTIONS: "Yes, what is the soup?" | "I'll take a coffee first." | "Do you have vegetarian options?"]`;
    }
    if (lower.includes('coffee') || lower.includes('drink')) {
      return `Right away! Would you prefer whole milk, oat milk, or black? And would you like something light to start with? [SUGGESTIONS: "Oat milk, please." | "Just black is perfect." | "I am ready to order food."]`;
    }
    return `Of course! I would be delighted to help you with that. Take your time to settle in, and please let me know whenever you are ready. [SUGGESTIONS: "Can I have the menu?" | "I'll have a coffee." | "What do you recommend?"]`;
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
