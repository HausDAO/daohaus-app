module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'standard',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-console': 'off',
    'react/prop-types': 'off',
    // 'no-unused-vars': 'error',
    'no-unused-vars': 'warn',
    'prettier/prettier': 'error',
  },
};
