import AsyncStorage from '@react-native-async-storage/async-storage';

const TARGET_LANG_KEY = '@polytalk_target_lang';
const INTERFACE_LANG_KEY = '@polytalk_interface_lang';

export async function getTargetLanguage(): Promise<string> {
  try {
    const val = await AsyncStorage.getItem(TARGET_LANG_KEY);
    return val || 'es';
  } catch {
    return 'es';
  }
}

export async function saveTargetLanguage(langId: string): Promise<void> {
  try {
    await AsyncStorage.setItem(TARGET_LANG_KEY, langId);
    // If target language is Bengali, ensure interface language is also synced to বাংলা
    if (langId === 'bn') {
      await AsyncStorage.setItem(INTERFACE_LANG_KEY, 'বাংলা');
    }
  } catch (e) {
    console.error('Failed to save target language', e);
  }
}

export async function getInterfaceLanguage(): Promise<string> {
  try {
    const val = await AsyncStorage.getItem(INTERFACE_LANG_KEY);
    if (val && val.trim()) return val;

    // Fallback: check target language
    const target = await AsyncStorage.getItem(TARGET_LANG_KEY);
    if (target === 'bn') return 'বাংলা';
    if (target === 'es') return 'Español';
    if (target === 'ja') return '日本語';
    return 'English (US)';
  } catch {
    return 'English (US)';
  }
}

export async function saveInterfaceLanguage(lang: string): Promise<void> {
  try {
    await AsyncStorage.setItem(INTERFACE_LANG_KEY, lang);
  } catch (e) {
    console.error('Failed to save interface language', e);
  }
}
