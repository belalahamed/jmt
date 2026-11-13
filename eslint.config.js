const react = require("eslint-plugin-react");

module.exports = [
  {
    ignores: [".expo/**", "dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.js"],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        __DEV__: "readonly",
        alert: "readonly",
        console: "readonly",
        fetch: "readonly",
        FormData: "readonly",
        module: "readonly",
        process: "readonly",
        require: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        XMLHttpRequest: "readonly",
      },
    },
    rules: {
      "eqeqeq": "warn",
      "no-debugger": "warn",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": ["warn", { args: "none", varsIgnorePattern: "^_" }],
      "react/jsx-uses-vars": "error",
    },
  },
];
