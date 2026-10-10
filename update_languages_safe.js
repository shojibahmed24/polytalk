const fs = require('fs');

let content = fs.readFileSync('app/(app)/languages.tsx', 'utf8');

// Use precise replacements without breaking JSX tags
content = content.replace(
  "import { getTargetLanguage",
  "import { useTranslation } from '@/utils/i18n';\nimport { getTargetLanguage"
);

content = content.replace(
  "const [isSaving, setIsSaving] = useState(false);",
  "const [isSaving, setIsSaving] = useState(false);\n  const { t, setLang } = useTranslation();"
);

content = content.replace(
  "setSelectedInterface(lang)",
  "setSelectedInterface(lang); setLang(lang)"
);

// We'll replace exact strings inside Text tags
content = content.replace(/>Choose Your Languages<\/Text>/g, ">{t('choose_your_languages')}</Text>");
content = content.replace(/>Make PolyTalk yours\.<\/Text>/g, ">{t('make_polytalk_yours')}</Text>");
content = content.replace(/>App Interface<\/Text>/g, ">{t('app_interface')}</Text>");
content = content.replace(/>System menus & coach guidance<\/Text>/g, ">{t('system_menus')}</Text>");
content = content.replace(/>Default<\/Text>/g, ">{t('default')}</Text>");
content = content.replace(/>Target Language<\/Text>/g, ">{t('target_language')}</Text>");
content = content.replace(/>Choose the tongue your synthetic tutor adapts to\.<\/Text>/g, ">{t('choose_tongue')}</Text>");
content = content.replace(/placeholder="Search languages & dialects\.\.\."/g, "placeholder={t('search_placeholder')}");
content = content.replace(/>Search Results<\/Text>/g, ">{t('search_results')}</Text>");
content = content.replace(/>Popular & Recommended<\/Text>/g, ">{t('popular_recommended')}</Text>");
content = content.replace(/>Continue<\/Text>/g, ">{t('continue')}</Text>");
content = content.replace(/No languages found matching/g, "{t('no_languages_found')}");
content = content.replace(/>Multi-Dialect Adaptive Model<\/Text>/g, ">{t('multi_dialect')}</Text>");
content = content.replace(/>PolyTalk continuously tunes pronunciation scoring to your preferred regional accent\.<\/Text>/g, ">{t('multi_dialect_desc')}</Text>");
content = content.replace(/>AI Tutor<\/Text>/g, ">{t('ai_tutor')}</Text>");
content = content.replace(/>Active<\/Text>/g, ">{t('active')}</Text>");
content = content.replace(/Primary Target/g, "{t('primary_target')}");
content = content.replace(/Available/g, "{t('available')}");

fs.writeFileSync('app/(app)/languages.tsx', content, 'utf8');
