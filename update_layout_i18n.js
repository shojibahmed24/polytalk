const fs = require('fs');

let content = fs.readFileSync('app/(tabs)/_layout.tsx', 'utf8');

if (!content.includes('import { useTranslation }')) {
  content = content.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { useTranslation } from '@/utils/i18n';"
  );
}

content = content.replace(
  "export default function TabLayout() {",
  "export default function TabLayout() {\n  const { t } = useTranslation();"
);

content = content.replace(/title: 'Home'/g, "title: t('home')");
content = content.replace(/title: 'Practice'/g, "title: t('practice')");
content = content.replace(/title: 'Progress'/g, "title: t('progress')");
content = content.replace(/title: 'Profile'/g, "title: t('profile')");

fs.writeFileSync('app/(tabs)/_layout.tsx', content, 'utf8');
