import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';

export default [
  js.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        React: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Attiva Prettier come errore ESLint
      'prettier/prettier': 'error',
      // Regole opzionali per React, puoi aggiungerne altre se vuoi
      'react/jsx-uses-react': 'off', // non più richiesto con React 17+
      'react/react-in-jsx-scope': 'off', // non più richiesto con React 17+
    },
  },
];
