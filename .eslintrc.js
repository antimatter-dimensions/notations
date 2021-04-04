module.exports = {
  "env": {
    "es6": true
  },
  "extends": [
    "eslint:all",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/all"
  ],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "ignorePatterns": ["spec/**/*.js", "docs/**/*.js", ".eslintrc.js", "jest.config.js"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "tsconfigRootDir": __dirname,
    "project": "./tsconfig.json"
  },
  "rules": {
    "capitalized-comments": [
      "error",
      "always",
      {
        "ignoreConsecutiveComments": true
      }
    ],
    "dot-location": [
      "error",
      "property"
    ],
    "function-call-argument-newline": [
      "error",
      "consistent"
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "lines-between-class-members": [
      "error",
      "always",
      {
        "exceptAfterSingleLine": true
      }
    ],
    "max-len": [
      "warn",
      {
        "code": 120,
        "comments": 120
      }
    ],
    "multiline-comment-style": [
      "error",
      "separate-lines"
    ],
    "multiline-ternary": [
      "error",
      "always-multiline"
    ],
    "no-underscore-dangle": [
      "error",
      {
        "allowAfterThis": true
      }
    ],
    "one-var": [
      "error",
      "never"
    ],
    "padded-blocks": [
      "error",
      "never"
    ],
    "quote-props": [
      "error",
      "as-needed"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    "space-before-function-paren": [
      "error",
      "never"
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true,
        "allowTypedFunctionExpressions": true,
        "allowHigherOrderFunctions": true
      }
    ],
    "@typescript-eslint/indent": [
      "error",
      2
    ],
    "@typescript-eslint/no-type-alias": [
      "error",
      {
        "allowAliases": "in-unions-and-intersections"
      }
    ],

    // Disabled rules
    "array-element-newline": "off",
    "class-methods-use-this": "off",
    "curly": "off",
    "func-style": "off",
    "id-length": "off",
    "init-declarations": "off",
    "max-lines-per-function": "off",
    "max-statements": "off",
    "no-confusing-arrow": "off",
    "no-continue": "off",
    "no-mixed-operators": "off",
    "no-param-reassign": "off",
    "no-plusplus": "off",
    "no-ternary": "off",
    "no-undefined": "off",
    "prefer-destructuring": "off",
    "prefer-named-capture-group": "off",
    "require-unicode-regexp": "off",
    "sort-keys": "off",
    "sort-imports": "off",
    "@typescript-eslint/class-literal-property-style": "off",
    "@typescript-eslint/member-ordering": "off",
    "@typescript-eslint/no-magic-numbers": "off",
    "@typescript-eslint/object-curly-spacing": "off",
    "@typescript-eslint/prefer-readonly-parameter-types": "off",
    "@typescript-eslint/space-before-function-paren": "off"
  }
};
