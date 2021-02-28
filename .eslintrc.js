module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ["@typescript-eslint", "react"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  rules: {
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prop-types.md
    // This rule means that you do not need to declare the prop-types for a ReactJS component. These are annoying.
    "react/prop-types": "off",

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
    // This rule means that TypeScript functions must always declare a type, even when it's obvious, such as `() => 'hello'`, to avoid incorrect type returns.
    "@typescript-eslint/explicit-function-return-type": "off",

    // https://github.com/prettier/eslint-plugin-prettier
    // This disables the errors for prettier, and replaces them with warnings. `-Wall`
    "prettier/prettier": "warn",
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/explicit-module-boundary-types.md
        // This rule means you do not need to declare a type for exported functions. You can't do this without TypeScript!
        "@typescript-eslint/explicit-module-boundary-types": "off",
      },
    },
  ],
};
