const fs = require('fs');

let content = fs.readFileSync('app/(app)/languages.tsx', 'utf8');

if (!content.includes('import { useTranslation }')) {
  content = content.replace(
    "import { getTargetLanguage",
    "import { useTranslation } from '@/utils/i18n';\nimport { getTargetLanguage"
  );
}

content = content.replace(
  "const [isSaving, setIsSaving] = useState(false);",
  "const [isSaving, setIsSaving] = useState(false);\n  const { t, setLang } = useTranslation();\n"
);

// We need to sync interface language selection instantly
content = content.replace(
  "setSelectedInterface(lang)",
  "setSelectedInterface(lang); setLang(lang);"
);

// Replace static text
content = content.replace(/>Choose Your Languages</g, ">{t('choose_your_languages')}<");
content = content.replace(/>Make PolyTalk yours.</g, ">{t('make_polytalk_yours')}<");
content = content.replace(/>App Interface</g, ">{t('app_interface')}<");
content = content.replace(/>System menus & coach guidance</g, ">{t('system_menus')}<");
content = content.replace(/>Default</g, ">{t('default')}<");
content = content.replace(/>Target Language</g, ">{t('target_language')}<");
content = content.replace(/>Choose the tongue your synthetic tutor adapts to.</g, ">{t('choose_tongue')}<");
content = content.replace(/placeholder="Search languages & dialects..."/g, "placeholder={t('search_placeholder')}");
content = content.replace(/>Search Results</g, ">{t('search_results')}<");
content = content.replace(/>Popular & Recommended</g, ">{t('popular_recommended')}<");
content = content.replace(/>Continue</g, ">{t('continue')}<");
content = content.replace(/No languages found matching/g, "{t('no_languages_found')}");
content = content.replace(/>Multi-Dialect Adaptive Model</g, ">{t('multi_dialect')}<");
content = content.replace(/>PolyTalk continuously tunes pronunciation scoring to your preferred regional accent.</g, ">{t('multi_dialect_desc')}<");
content = content.replace(/>AI Tutor</g, ">{t('ai_tutor')}<");
content = content.replace(/>Active</g, ">{t('active')}<");
content = content.replace(/>Primary Target/g, ">{t('primary_target')}<");
content = content.replace(/} Available/g, "} {t('available')}");

fs.writeFileSync('app/(app)/languages.tsx', content, 'utf8');
