import { getInterfaceLanguage } from './languageStorage';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

const translations: Record<string, Record<string, string>> = {
  'English (US)': {
    'good_morning': 'Good morning,',
    'ready_for_conversation': 'Ready for your next conversation?',
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
    'choose_tongue': 'আপনার সিন্থেটিক টিউটর যে ভাষায় কথা বলবে তা নির্বাচন করুন।',
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
  const [lang, setLang] = useState('English (US)');

  useFocusEffect(
    useCallback(() => {
      getInterfaceLanguage().then(setLang);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      getInterfaceLanguage().then(setLang);
    }, [])
  );
  
  // Keep standard useEffect for non-screen components
  useEffect(() => {
    getInterfaceLanguage().then(setLang);
  }, []);

  const t = (key: string): string => {
    const langDict = translations[lang] || translations['English (US)'];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    return translations['English (US)'][key] || key;
  };

  return { t, currentInterfaceLang: lang, setLang };
}
