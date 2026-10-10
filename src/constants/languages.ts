export interface LanguageEntry {
  id: string;
  name: string; // Native name
  englishName: string;
  dialect?: string;
  flag: string;
  speakers?: string;
  searchAliases: string[];
  region: string;
}

export const TARGET_LANGUAGES: LanguageEntry[] = [
  { id: 'es', name: 'Español', englishName: 'Spanish', dialect: 'LatAm', flag: '🇪🇸', speakers: '500M+ native speakers', searchAliases: ['spanish', 'espanol'], region: 'Americas' },
  { id: 'ja', name: '日本語', englishName: 'Japanese', dialect: 'JLPT N5-N1', flag: '🇯🇵', speakers: 'Kanji & Kana synthesis', searchAliases: ['japanese', 'nihongo'], region: 'Asian' },
  { id: 'bn', name: 'বাংলা', englishName: 'Bengali', dialect: 'South Asia', flag: '🇧🇩', speakers: 'Eastern Indo-Aryan', searchAliases: ['bengali', 'bangla'], region: 'Asian' },
  { id: 'fr', name: 'Français', englishName: 'French', dialect: 'European', flag: '🇫🇷', speakers: 'Standard Parisian', searchAliases: ['french', 'francais'], region: 'European' },
  { id: 'zh', name: '中文', englishName: 'Chinese', dialect: 'Mandarin', flag: '🇨🇳', speakers: '1B+ speakers', searchAliases: ['chinese', 'mandarin', 'zhongwen'], region: 'Asian' },
  { id: 'ko', name: '한국어', englishName: 'Korean', dialect: 'Seoul', flag: '🇰🇷', speakers: 'Koreanic', searchAliases: ['korean', 'hangugeo'], region: 'Asian' },
  { id: 'ar', name: 'العربية', englishName: 'Arabic', dialect: 'MSA', flag: '🇸🇦', speakers: 'Afroasiatic', searchAliases: ['arabic', 'arab', 'al-arabiyyah'], region: 'Middle East' },
  { id: 'hi', name: 'हिन्दी', englishName: 'Hindi', dialect: 'Standard', flag: '🇮🇳', speakers: 'Indo-Aryan', searchAliases: ['hindi'], region: 'Asian' },
  { id: 'de', name: 'Deutsch', englishName: 'German', dialect: 'Standard', flag: '🇩🇪', speakers: 'West Germanic', searchAliases: ['german', 'deutsch'], region: 'European' },
  { id: 'it', name: 'Italiano', englishName: 'Italian', dialect: 'Standard', flag: '🇮🇹', speakers: 'Romance', searchAliases: ['italian', 'italiano'], region: 'European' },
  { id: 'pt', name: 'Português', englishName: 'Portuguese', dialect: 'Brazil', flag: '🇧🇷', speakers: 'Romance', searchAliases: ['portuguese', 'portugues'], region: 'Americas' },
  { id: 'ru', name: 'Русский', englishName: 'Russian', dialect: 'Standard', flag: '🇷🇺', speakers: 'East Slavic', searchAliases: ['russian', 'russkiy'], region: 'European' },
  { id: 'tr', name: 'Türkçe', englishName: 'Turkish', dialect: 'Standard', flag: '🇹🇷', speakers: 'Oghuz', searchAliases: ['turkish', 'turkce'], region: 'Middle East' },
];

export const INTERFACE_LANGUAGES = ['English (US)', 'বাংলা', 'Español', 'Français', '日本語', 'العربية'];
export const REGION_FILTERS = ['All Regions', 'Popular', 'Americas', 'European', 'Asian', 'Middle East', 'African'];
