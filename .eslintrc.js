module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2019: true,
    node: true,
  },
  extends: "eslint:recommended",
  ignorePatterns: ["*.min.js", "*.ejs"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {},
};
