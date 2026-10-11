import { getInterfaceLanguage, getTargetLanguage } from './languageStorage';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

export function normalizeLangKey(lang: string): string {
  const l = (lang || '').toLowerCase().trim();
  if (l === 'bn' || l === 'bengali' || l === 'bangla' || l === 'বাংলা') return 'বাংলা';
  if (l === 'es' || l === 'spanish' || l === 'español' || l === 'espanol') return 'Español';
  if (l === 'ja' || l === 'japanese' || l === '日本語' || l === 'nihongo') return '日本語';
  if (l === 'fr' || l === 'french' || l === 'français' || l === 'francais') return 'Français';
  if (l === 'ar' || l === 'arabic' || l === 'العربية') return 'العربية';
  return 'English (US)';
}

const translations: Record<string, Record<string, string>> = {
  'English (US)': {
    'good_morning': 'Good morning,',
    'ready_for_conversation': 'Ready for your next conversation?',
    'your_ai_coach': 'Your AI Coach',
    'online': 'Online',
    'ready_to_speak': 'Ready to speak?',
    'ready_to_speak_desc': 'Practice real conversations and build confidence, one gentle session at a time.',
    'start_conversation': 'Start a Conversation',
    'your_progress': 'Your Progress',
    'view_details': 'View details',
    'daily_goal': '15 min daily goal',
    'daily_goal_progress': '8 of 15 min completed',
    'streak_count': '3-day streak',
    'choose_practice': 'Choose Your Practice',
    'modes_count': '3 Modes',
    'ai_conversation': 'AI Conversation',
    'interactive': 'Interactive',
    'speak_naturally': 'Speak naturally with your AI coach.',
    'grammar_vocab': 'Grammar & Vocab',
    'expand_foundation': 'Expand your language foundation.',
    'pronunciation': 'Pronunciation',
    'sound_clearer': 'Sound clearer and more confident.',
    'home': 'Home',
    'practice': 'Practice',
    'progress': 'Progress',
    'profile': 'Profile',
    'choose_your_languages': 'Choose Your Languages',
    'make_polytalk_yours': 'Make PolyTalk yours.',
    'app_interface': 'App Interface',
    'system_menus': 'System menus & coach guidance',
    'default': 'Default',
    'target_language': 'Target Language',
    'choose_tongue': 'Choose the tongue your synthetic tutor adapts to.',
    'search_placeholder': 'Search languages & dialects...',
    'search_results': 'Search Results',
    'popular_recommended': 'Popular & Recommended',
    'continue': 'Continue',
    'no_languages_found': 'No languages found matching',
    'available': 'Available',
    'multi_dialect': 'Multi-Dialect Adaptive Model',
    'multi_dialect_desc': 'PolyTalk continuously tunes pronunciation scoring to your preferred regional accent.',
    'ai_tutor': 'AI Tutor',
    'active': 'Active',
    'primary_target': 'Primary Target',
  },
  'বাংলা': {
    'good_morning': 'শুভ সকাল,',
    'ready_for_conversation': 'পরবর্তী কথোপকথনের জন্য প্রস্তুত?',
    'your_ai_coach': 'আপনার এআই কোচ',
    'online': 'অনলাইন',
    'ready_to_speak': 'কথা বলতে প্রস্তুত?',
    'ready_to_speak_desc': 'বাস্তব কথোপকথন অনুশীলন করুন এবং ধীরে ধীরে আত্মবিশ্বাস গড়ে তুলুন।',
    'start_conversation': 'কথোপকথন শুরু করুন',
    'your_progress': 'আপনার অগ্রগতি',
    'view_details': 'বিস্তারিত দেখুন',
    'daily_goal': '১৫ মিনিট দৈনিক লক্ষ্য',
    'daily_goal_progress': '১৫ মিনিটের মধ্যে ৮ মিনিট সম্পন্ন',
    'streak_count': '৩ দিনের স্ট্রিক',
    'choose_practice': 'অনুশীলনের ধরন বেছে নিন',
    'modes_count': '৩টি মোড',
    'ai_conversation': 'এআই কথোপকথন',
    'interactive': 'ইন্টারেক্টিভ',
    'speak_naturally': 'আপনার এআই কোচের সাথে স্বাভাবিকভাবে কথা বলুন।',
    'grammar_vocab': 'ব্যাকরণ ও শব্দভাণ্ডার',
    'expand_foundation': 'ভাষার দক্ষতা ও ভিত্তি প্রসারিত করুন।',
    'pronunciation': 'উচ্চারণ',
    'sound_clearer': 'আরও স্পষ্ট ও আত্মবিশ্বাসের সাথে বলুন।',
    'home': 'হোম',
    'practice': 'অনুশীলন',
    'progress': 'অগ্রগতি',
    'profile': 'প্রোফাইল',
    'choose_your_languages': 'আপনার ভাষা নির্বাচন করুন',
    'make_polytalk_yours': 'পলিটক আপনার নিজের করে নিন।',
    'app_interface': 'অ্যাপ ইন্টারফেস',
    'system_menus': 'সিস্টেম মেন্যু এবং কোচের নির্দেশনা',
    'default': 'ডিফল্ট',
    'target_language': 'লক্ষ্য ভাষা',
    'choose_tongue': 'আপনার এআই টিউটর যে ভাষায় কথা বলবে তা নির্বাচন করুন।',
    'search_placeholder': 'ভাষা এবং উপভাষা খুঁজুন...',
    'search_results': 'অনুসন্ধানের ফলাফল',
    'popular_recommended': 'জনপ্রিয় ও প্রস্তাবিত',
    'continue': 'চালিয়ে যান',
    'no_languages_found': 'এর সাথে মিল রয়েছে এমন কোনো ভাষা পাওয়া যায়নি',
    'available': 'টি উপলব্ধ',
    'multi_dialect': 'মাল্টি-ডায়ালেক্ট অ্যাডাপটিভ মডেল',
    'multi_dialect_desc': 'পলিটক আপনার উচ্চারণের স্কোরিংকে আপনার পছন্দের আঞ্চলিক উচ্চারণের সাথে খাপ খাইয়ে নেয়।',
    'ai_tutor': 'এআই টিউটর',
    'active': 'সক্রিয়',
    'primary_target': 'প্রাথমিক লক্ষ্য',
  },
  'Español': {
    'good_morning': 'Buenos días,',
    'ready_for_conversation': '¿Listo para tu próxima conversación?',
    'your_ai_coach': 'Tu Entrenador IA',
    'online': 'En línea',
    'ready_to_speak': '¿Listo para hablar?',
    'ready_to_speak_desc': 'Practica conversaciones reales y gana confianza paso a paso.',
    'start_conversation': 'Iniciar una Conversación',
    'your_progress': 'Tu Progreso',
    'view_details': 'Ver detalles',
    'daily_goal': 'Meta diaria de 15 min',
    'daily_goal_progress': '8 de 15 min completados',
    'streak_count': 'Racha de 3 días',
    'choose_practice': 'Elige tu Práctica',
    'modes_count': '3 Modos',
    'ai_conversation': 'Conversación IA',
    'interactive': 'Interactivo',
    'speak_naturally': 'Habla naturalmente con tu entrenador de IA.',
    'grammar_vocab': 'Gramática y Vocabulario',
    'expand_foundation': 'Amplía tu base lingüística.',
    'home': 'Inicio',
    'practice': 'Práctica',
    'progress': 'Progreso',
    'profile': 'Perfil',
    'choose_your_languages': 'Elige tus idiomas',
    'make_polytalk_yours': 'Haz tuyo PolyTalk.',
    'app_interface': 'Interfaz de la aplicación',
    'system_menus': 'Menús del sistema y guía del entrenador',
    'default': 'Defecto',
    'target_language': 'Idioma objetivo',
    'choose_tongue': 'Elige el idioma al que se adapta tu tutor sintético.',
    'search_placeholder': 'Buscar idiomas y dialectos...',
    'continue': 'Continuar',
  },
  '日本語': {
    'good_morning': 'おはようございます、',
    'ready_for_conversation': '次の会話の準備はできましたか？',
    'your_ai_coach': 'AIコーチ',
    'online': 'オンライン',
    'ready_to_speak': '話す準備はできましたか？',
    'ready_to_speak_desc': '実際の会話を練習し、少しずつ自信をつけましょう。',
    'start_conversation': '会話を始める',
    'your_progress': '進捗状況',
    'view_details': '詳細を見る',
    'daily_goal': '1日15分の目標',
    'daily_goal_progress': '15分中8分完了',
    'streak_count': '3日連続達成',
    'choose_practice': '練習モードを選択',
    'modes_count': '3つのモード',
    'ai_conversation': 'AI会話',
    'interactive': '対話型',
    'speak_naturally': 'AIコーチと自然に会話しましょう。',
    'grammar_vocab': '文法と語彙',
    'expand_foundation': '言語の基礎を広げましょう。',
    'home': 'ホーム',
    'practice': '練習',
    'progress': '進捗',
    'profile': 'プロフィール',
    'choose_your_languages': '言語を選択',
    'make_polytalk_yours': 'PolyTalkをあなた好みに。',
    'app_interface': 'アプリのインターフェース',
    'system_menus': 'システムメニューとコーチのガイダンス',
    'default': 'デフォルト',
    'target_language': '目標言語',
    'choose_tongue': '合成チューターが適応する言語を選択してください。',
    'search_placeholder': '言語や方言を検索...',
    'continue': '続ける',
  }
};

export function useTranslation() {
  const [lang, setLangState] = useState('English (US)');

  const refreshLang = useCallback(async () => {
    const iface = await getInterfaceLanguage();
    const target = await getTargetLanguage();
    // Normalize language key based on interface or target
    const resolved = normalizeLangKey(iface || target);
    setLangState(resolved);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshLang();
    }, [refreshLang])
  );

  useEffect(() => {
    refreshLang();
  }, [refreshLang]);

  const setLang = (newLang: string) => {
    setLangState(normalizeLangKey(newLang));
  };

  const t = (key: string): string => {
    const normalized = normalizeLangKey(lang);
    const langDict = translations[normalized] || translations['English (US)'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    return translations['English (US)']?.[key] || key;
  };

  return { t, currentInterfaceLang: lang, setLang };
}
