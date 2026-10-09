module.exports = {
  extends: ['expo'],
  ignorePatterns: ['/dist/*', '/.expo/*'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-fallthrough': 'error',
  },
};
