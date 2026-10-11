import { z } from 'zod';

export const SendMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty').max(2000),
  inputType: z.enum(['text', 'voice']).default('text'),
  language: z.string().optional().default('en'),
  idempotencyKey: z.string().optional(),
});

export type SendMessageRequest = z.infer<typeof SendMessageSchema>;

export const SessionSettingsSchema = z.object({
  targetLanguage: z.string().default('English'),
  nativeLanguage: z.string().default('Bengali'),
  proficiencyLevel: z.string().default('A2-B1'),
  learningMode: z.enum(['bilingual_tutor', 'dual_immersion']).default('bilingual_tutor'),
  conversationTopic: z.string().default('Restaurant'),
  aiCharacter: z.string().default('Waiter / Server'),
  voiceRate: z.number().min(0.5).max(1.5).default(1.0),
  translationPreference: z.boolean().default(true),
  pronunciationAssessment: z.boolean().default(true),
  correctionIntensity: z.enum(['gentle', 'balanced', 'rigorous']).default('balanced'),
  autoplayAudio: z.boolean().default(false),
});

export type SessionSettings = z.infer<typeof SessionSettingsSchema>;

export interface CoachScenario {
  id: string;
  title: string;
  description?: string;
  category: string;
  target_language: string;
  ai_role: string;
  user_role: string;
  proficiency_levels: string[];
  system_prompt?: string;
  suggested_responses: string[];
  is_active: boolean;
  created_at?: string;
}

export interface CoachSession {
  id: string;
  user_id: string;
  scenario_id?: string | null;
  target_language: string;
  proficiency_level: string;
  status: 'active' | 'completed' | 'paused';
  settings: SessionSettings;
  started_at: string;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  scenario?: CoachScenario;
}

export interface PronunciationScoreDetails {
  accuracyScore: number; // 0 - 100
  fluencyScore: number;  // 0 - 100
  completenessScore: number; // 0 - 100
  feedback: string;
  words?: Array<{ word: string; accuracy: number; errorType?: string }>;
}

export interface CoachMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  input_type: 'text' | 'voice';
  audio_path?: string | null;
  translation?: string | null;
  correction?: string | null;
  explanation?: string | null;
  pronunciation_guide?: string | null;
  bilingual_vocabulary?: Array<{ word: string; meaning: string; phonetic: string }>;
  pronunciation_score?: number | null;
  pronunciation_details?: PronunciationScoreDetails | null;
  provider_metadata?: Record<string, any>;
  idempotency_key?: string | null;
  created_at: string;
  suggested_replies?: string[];
  suggested_replies_detailed?: Array<{ target: string; native: string; phonetic: string }>;
  isSending?: boolean;
  isError?: boolean;
}

export interface CoachSessionStats {
  id: string;
  session_id: string;
  user_id: string;
  total_messages: number;
  practice_duration_seconds: number;
  vocabulary_count: number;
  completed_at?: string | null;
  created_at: string;
}

export interface VocabularyItem {
  id: string;
  user_id: string;
  word: string;
  translation: string;
  context_sentence?: string | null;
  language: string;
  created_at: string;
}

export interface SendMessageResponse {
  userMessage: CoachMessage;
  aiMessage: CoachMessage;
  suggestedResponses: string[];
  suggestedResponsesDetailed?: Array<{ target: string; native: string; phonetic: string }>;
  sessionStats?: Partial<CoachSessionStats>;
  error?: string;
}
