module.exports = {
  "env": {
    "es6": true,
    "node": true,
  },
  "parserOptions": {
    "ecmaVersion": 2020,
  },
  "extends": [
    "eslint:recommended",
  ],
  "rules": {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "max-len": ["error", {"code": 80, "tabWidth": 2}],
    "object-curly-spacing": ["error", "never"],
  },
};