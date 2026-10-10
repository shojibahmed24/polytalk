import { supabase } from '../utils/supabase';

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
}

export async function requestAIResponse(conversationId: string, messageText: string): Promise<AIResponse> {
  try {
    // We expect the edge function "chat" to be deployed.
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { conversation_id: conversationId, message: messageText },
    });

    if (error) {
      console.warn('Supabase edge function error:', error.message);
      return { reply: '', error: 'AI service is temporarily unavailable or not deployed.', unavailable: true };
    }

    if (data?.unavailable) {
      return { reply: '', error: data.error || 'AI Provider not configured.', unavailable: true };
    }

    return {
      reply: data.reply || '',
      pedagogical: data.pedagogical,
    };
  } catch (err: any) {
    console.warn('AI request failed:', err.message);
    return { reply: '', error: 'Could not reach AI service.', unavailable: true };
  }
}
