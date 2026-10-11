import { supabase } from '../utils/supabase';
import { 
  getStoredPuterToken, 
  callPuterChatCompletion, 
  clearPuterToken, 
  PuterChatMessage 
} from './puter';

export interface PedagogicalFeedback {
  type: string;
  xp: number;
  originalHtml: string;
  betterHtml: string;
  explanation: string;
}

export interface AIResponse {
  reply: string;
  pedagogical?: PedagogicalFeedback;
  suggestedReplies?: string[];
  error?: string;
  unavailable?: boolean;
  needsPuterAuth?: boolean;
}

export interface AIChatContext {
  targetLanguage?: string;
  difficulty?: string;
  interfaceLanguage?: string;
  userId?: string | null;
}

export interface GrammarCorrectionResult {
  original: string;
  better: string;
  explanations: string[];
  examples: Array<{ incorrect: string; correct: string }>;
  xpAwarded: number;
  error?: string;
  needsPuterAuth?: boolean;
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  error?: string;
  needsPuterAuth?: boolean;
}

// In-flight request tracking to prevent accidental duplicate submissions
const activeRequests = new Set<string>();

/**
 * Resolves current user ID from Supabase if not explicitly passed
 */
async function resolveUserId(explicitUserId?: string | null): Promise<string | null> {
  if (explicitUserId) return explicitUserId;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

/**
 * Validates Puter authorization for user.
 */
async function getValidatedPuterToken(userId: string | null): Promise<{ token: string | null; error?: string }> {
  const puterToken = await getStoredPuterToken(userId);
  if (!puterToken) {
    return {
      token: null,
      error: 'Puter account not connected. Please connect your Puter account in Settings to use AI features.',
    };
  }
  return { token: puterToken };
}

/**
 * Central Puter AI Service: Handles conversation replies & pedagogical grammar tips.
 */
export async function requestAIResponse(
  conversationId: string,
  messageText: string,
  context?: AIChatContext
): Promise<AIResponse> {
  const requestKey = `chat_${conversationId}_${messageText.trim()}`;
  if (activeRequests.has(requestKey)) {
    return {
      reply: '',
      error: 'Request already in progress. Please wait.',
      unavailable: true,
    };
  }

  activeRequests.add(requestKey);

  try {
    const userId = await resolveUserId(context?.userId);
    const { token, error: authError } = await getValidatedPuterToken(userId);

    if (!token) {
      return {
        reply: '',
        error: authError || 'Puter account not connected.',
        unavailable: true,
        needsPuterAuth: true,
      };
    }

    let targetLang = context?.targetLanguage || 'Spanish';
    let difficulty = context?.difficulty || 'B2';
    const explanationLang = context?.interfaceLanguage || 'English';

    // Retrieve conversation history from Supabase if available
    const recentMessages: PuterChatMessage[] = [];
    if (conversationId) {
      try {
        const { data: conv } = await supabase
          .from('conversations')
          .select('target_language, difficulty')
          .eq('id', conversationId)
          .single();
        if (conv) {
          targetLang = conv.target_language || targetLang;
          difficulty = conv.difficulty || difficulty;
        }

        const { data: history } = await supabase
          .from('messages')
          .select('role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false })
          .limit(6);

        if (history && history.length > 0) {
          const ordered = [...history].reverse();
          for (const m of ordered) {
            recentMessages.push({
              role: m.role === 'assistant' ? 'assistant' : 'user',
              content: m.content,
            });
          }
        }
      } catch {}
    }

    const systemPrompt = `You are an expert, encouraging language coach in PolyTalk.
Target Learning Language: ${targetLang}
Target CEFR Level: ${difficulty}
Learner's Explanation Language: ${explanationLang}

Requirements:
1. Respond naturally to the user in ${targetLang} (2 to 3 sentences).
2. Keep the dialogue interactive and appropriate for ${difficulty} level.
3. If the user's message contains any grammar, vocabulary, or phrasing errors, provide a helpful correction in ${explanationLang} at the very end in this exact tag format:
[CORRECTION: original="..." | better="..." | note="..."]
Do not invent errors if the user's message is grammatically fine.
4. Also suggest 2 short relevant responses the learner could say next in this exact format:
[SUGGESTIONS: "option 1" | "option 2"]`;

    const messagesToSend: PuterChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...recentMessages,
      { role: 'user', content: messageText },
    ];

    const { text } = await callPuterChatCompletion(token, messagesToSend, 'gpt-4o-mini');

    let cleanReply = text;
    let pedagogical: PedagogicalFeedback | undefined = undefined;
    let suggestedReplies: string[] | undefined = undefined;

    // Parse suggestions tag
    const suggestionsMatch = text.match(/\[SUGGESTIONS:\s*"([^"]+)"\s*\|\s*"([^"]+)"\]/i);
    if (suggestionsMatch) {
      cleanReply = cleanReply.replace(suggestionsMatch[0], '').trim();
      suggestedReplies = [suggestionsMatch[1], suggestionsMatch[2]];
    }

    // Parse correction tag
    const correctionMatch = cleanReply.match(/\[CORRECTION:\s*original="([^"]+)"\s*\|\s*better="([^"]+)"\s*\|\s*note="([^"]+)"\]/i);
    if (correctionMatch) {
      cleanReply = cleanReply.replace(correctionMatch[0], '').trim();
      pedagogical = {
        type: 'Grammar & Politeness Tip',
        xp: 15,
        originalHtml: correctionMatch[1],
        betterHtml: correctionMatch[2],
        explanation: correctionMatch[3],
      };
    }

    return {
      reply: cleanReply,
      pedagogical,
      suggestedReplies,
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Could not reach Puter AI service.';
    console.warn('Puter AI request error:', errorMsg);

    if (errorMsg.includes('expired') || errorMsg.includes('401')) {
      const userId = await resolveUserId(context?.userId);
      await clearPuterToken(userId);
      return {
        reply: '',
        error: 'Your Puter session has expired. Please reconnect in Settings.',
        unavailable: true,
        needsPuterAuth: true,
      };
    }

    return {
      reply: '',
      error: errorMsg,
      unavailable: true,
    };
  } finally {
    activeRequests.delete(requestKey);
  }
}

/**
 * Central Puter AI Service: Dedicated grammar correction analysis (S007).
 */
export async function requestGrammarCorrection(
  text: string,
  context?: { targetLanguage?: string; interfaceLanguage?: string; userId?: string | null }
): Promise<GrammarCorrectionResult> {
  const userId = await resolveUserId(context?.userId);
  const { token, error: authError } = await getValidatedPuterToken(userId);

  if (!token) {
    return {
      original: text,
      better: text,
      explanations: [authError || 'Please connect your Puter account in Settings.'],
      examples: [],
      xpAwarded: 0,
      error: authError,
      needsPuterAuth: true,
    };
  }

  const targetLang = context?.targetLanguage || 'English';
  const explanationLang = context?.interfaceLanguage || 'English';

  const systemPrompt = `You are a linguistics and grammar coach in PolyTalk.
Analyze the following sentence in ${targetLang} and provide an improved, natural, and polite version.
Explain the grammar rules in ${explanationLang}.

Return your response in pure JSON format with this exact structure:
{
  "original": "${text}",
  "better": "improved sentence here",
  "explanations": ["explanation point 1", "explanation point 2"],
  "examples": [
    { "incorrect": "wrong example", "correct": "correct example" },
    { "incorrect": "wrong example 2", "correct": "correct example 2" }
  ],
  "xp": 20
}`;

  try {
    const { text: aiOutput } = await callPuterChatCompletion(
      token,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please review: "${text}"` }
      ],
      'gpt-4o-mini'
    );

    // Parse JSON safely
    const jsonStart = aiOutput.indexOf('{');
    const jsonEnd = aiOutput.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const parsed = JSON.parse(aiOutput.slice(jsonStart, jsonEnd + 1));
      return {
        original: parsed.original || text,
        better: parsed.better || text,
        explanations: Array.isArray(parsed.explanations) ? parsed.explanations : [],
        examples: Array.isArray(parsed.examples) ? parsed.examples : [],
        xpAwarded: parsed.xp || 20,
      };
    }

    return {
      original: text,
      better: aiOutput.trim(),
      explanations: ['Refined for natural conversational fluency.'],
      examples: [],
      xpAwarded: 15,
    };
  } catch (err: any) {
    return {
      original: text,
      better: text,
      explanations: [err?.message || 'Grammar analysis temporarily unavailable.'],
      examples: [],
      xpAwarded: 0,
      error: err?.message,
    };
  }
}

/**
 * Central Puter AI Service: Translation.
 */
export async function requestTranslation(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'Auto',
  userId?: string | null
): Promise<TranslationResult> {
  const resolvedUid = await resolveUserId(userId);
  const { token, error: authError } = await getValidatedPuterToken(resolvedUid);

  if (!token) {
    return {
      translatedText: text,
      sourceLanguage,
      targetLanguage,
      error: authError,
      needsPuterAuth: true,
    };
  }

  try {
    const { text: result } = await callPuterChatCompletion(
      token,
      [
        {
          role: 'system',
          content: `Translate the following text accurately into ${targetLanguage}. Return ONLY the direct translation without quotes or conversational filler.`,
        },
        { role: 'user', content: text },
      ],
      'gpt-4o-mini'
    );

    return {
      translatedText: result.trim(),
      sourceLanguage,
      targetLanguage,
    };
  } catch (err: any) {
    return {
      translatedText: text,
      sourceLanguage,
      targetLanguage,
      error: err?.message || 'Translation failed',
    };
  }
}
