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

/**
 * Requests an AI response using the user's connected Puter account.
 * Persists context and extracts pedagogic corrections when present.
 */
export async function requestAIResponse(
  conversationId: string,
  messageText: string,
  context?: AIChatContext
): Promise<AIResponse> {
  try {
    // 1. Resolve current user ID if not explicitly passed
    let userId = context?.userId;
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    }

    // 2. Check for Puter authorization
    const puterToken = await getStoredPuterToken(userId);
    if (!puterToken) {
      return {
        reply: '',
        error: 'Puter account not connected. Please connect your Puter account in Settings to chat with AI.',
        unavailable: true,
        needsPuterAuth: true,
      };
    }

    // 3. Retrieve conversation details & recent message history
    let targetLang = context?.targetLanguage || 'Spanish';
    let difficulty = context?.difficulty || 'B2';
    
    if (conversationId && !context?.targetLanguage) {
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
      } catch {}
    }

    // Fetch up to 8 recent messages for context
    const recentMessages: PuterChatMessage[] = [];
    if (conversationId) {
      try {
        const { data: history } = await supabase
          .from('messages')
          .select('role, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: false })
          .limit(6);

        if (history && history.length > 0) {
          // Reverse back to chronological order
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

    // 4. Construct System Prompt
    const systemPrompt = `You are a supportive, friendly AI language tutor on PolyTalk.
Target Learning Language: ${targetLang}
Target Level: ${difficulty}
Interface/Explanation Language: ${context?.interfaceLanguage || 'English'}

Instructions:
1. Respond naturally to the user in ${targetLang} to keep the conversation flowing.
2. Keep your response conversational, concise (2-4 sentences), and engaging.
3. If the user's message contains a grammar or phrasing mistake, offer a polite correction in a structured tip format at the very end like:
[CORRECTION: original="..." | better="..." | note="..."]
Only include [CORRECTION: ...] if there was an actual error.`;

    const messagesToSend: PuterChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...recentMessages,
      { role: 'user', content: messageText },
    ];

    // 5. Send to Puter OpenAI-compatible completion endpoint
    const { text } = await callPuterChatCompletion(puterToken, messagesToSend, 'gpt-4o-mini');

    // 6. Parse structured pedagogical feedback if present
    let cleanReply = text;
    let pedagogical: PedagogicalFeedback | undefined = undefined;

    const correctionMatch = text.match(/\[CORRECTION:\s*original="([^"]+)"\s*\|\s*better="([^"]+)"\s*\|\s*note="([^"]+)"\]/i);
    if (correctionMatch) {
      cleanReply = text.replace(correctionMatch[0], '').trim();
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
    };
  } catch (err: any) {
    const errorMsg = err?.message || 'Could not reach Puter AI service.';
    console.warn('AI request failed:', errorMsg);

    // If token was rejected
    if (errorMsg.includes('expired') || errorMsg.includes('401')) {
      await clearPuterToken(context?.userId);
      return {
        reply: '',
        error: 'Your Puter session has expired. Please reconnect your Puter account in Settings.',
        unavailable: true,
        needsPuterAuth: true,
      };
    }

    return {
      reply: '',
      error: errorMsg,
      unavailable: true,
    };
  }
}
