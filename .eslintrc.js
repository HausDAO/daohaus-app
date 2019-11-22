module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "standard",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:react/recommended"
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["react", "prettier"],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "no-console": "warn",
    "react/prop-types": "off",
    "no-unused-vars": "error",
    "prettier/prettier": "error"
  }
};
