const fs = require('fs');

let content = fs.readFileSync('app/(tabs)/index.tsx', 'utf8');

// Import useTranslation
if (!content.includes('import { useTranslation }')) {
  content = content.replace(
    "import { getTargetLanguage } from '@/utils/languageStorage';",
    "import { getTargetLanguage } from '@/utils/languageStorage';\nimport { useTranslation } from '@/utils/i18n';"
  );
}

// Add the hook to the component
content = content.replace(
  "const [selectedTarget, setSelectedTarget] = useState('es');",
  "const [selectedTarget, setSelectedTarget] = useState('es');\n  const { t } = useTranslation();"
);

// Replace hardcoded strings
content = content.replace(
  /"Good morning,"/g,
  "{t('good_morning')}"
);
content = content.replace(
  /"Ready for your next conversation\?"/g,
  "{t('ready_for_conversation')}"
);

// We should also replace the bottom tabs labels, but those are defined in app/(tabs)/_layout.tsx
// I will also modify _layout.tsx.

fs.writeFileSync('app/(tabs)/index.tsx', content, 'utf8');
