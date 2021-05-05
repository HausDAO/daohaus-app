module.exports = {
  env: {
    es2020: true,
    node: true,
    browser: true,
  },
  // prettier should be last
  extends: [
    'eslint:recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    localStorage: true,
    fetch: true,
    window: true,
    sessionStorage: true,
    alert: true,
    document: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      globalReturn: false,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    babelOptions: {
      configFile: './babel.config.json',
    },
  },
  plugins: ['react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // default rules
    'no-console': 'off',
    'no-unused-vars': 'warn', // change to 'error' 🙏
    'no-param-reassign': 'off', // priority 1, easy
    'no-shadow': 'off', // priority 1, med
    'no-nested-ternary': 'off', // priority 2, med
    'no-restricted-globals': 'off', // priority 1, med
    'no-restricted-syntax': 'off', // priority 2, harder
    'arrow-body-style': 'off',
    'guard-for-in': 'off', // priority 2, two instances
    'max-len': 'off',
    'no-return-assign': 'off', // priority 1, easy
    'consistent-return': 'off', // priority 2, harder basically all the services
    radix: 'off', // priority 1, parseInt ??
    'no-unused-expressions': 'off', // priority 2, formatPeriods() conditional appends
    // import rules
    'import/prefer-default-export': 'off', // priority 2, med
    'import/no-named-as-default': 'off', // priority 1, easy
    'import/no-extraneous-dependencies': 'off', // priority 1, harder
    'import/no-cycle': 'off', // priority 2, harder in contexts
    // react rules
    'react/prop-types': 'off', // can stay off
    'react/jsx-props-no-spreading': 'off', // priority 3, hard
    'react/no-array-index-key': 'off', // priority 1, easy-ish
    'react/jsx-wrap-multilines': 'off', // priority 3, conflicting with prettier formatting only
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-curly-newline': 'off', // priority 2, harder conflicting with prettier
    'react/display-name': 'off',
    'jsx-quotes': ['error', 'prefer-single'], // leave
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['**/*.stories.*'],
      rules: {
        'import/no-anonymous-default-export': 'off',
      },
    },
  ],
};
