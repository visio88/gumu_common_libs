import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      semi: [2, 'always'],
      quotes: [0, 'double'],
      'comma-dangle': [0, 'always-multiline'],
      'no-console': 'off',
      'no-undef': 'error',
      'space-before-function-paren': [0],
      'n/no-callback-literal': 0,
    },
  },
  {
    ignores: ['.webpack/', 'swagger/*.js'],
    // parser: "@babel/eslint-parser",
    // "ecmaVersion": 2023
  },
];
