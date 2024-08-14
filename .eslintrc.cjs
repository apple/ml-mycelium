module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:deprecation/recommended',
    'plugin:svelte/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['import', '@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
    project: ['./tsconfig.eslint.json'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  rules: {
    eqeqeq: ['warn', 'always'],
    'no-console': ['warn', { allow: ['info', 'warn', 'error', 'time', 'timeEnd'] }],
    'no-constant-binary-expression': 'warn',
    'deprecation/deprecation': 'warn',
    '@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true }],
    '@typescript-eslint/no-unnecessary-condition': 'warn',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'import/extensions': ['warn', 'never', { json: 'always', svelte: 'always' }],
  },
};
