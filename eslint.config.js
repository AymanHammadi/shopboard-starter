import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
      "no-unused-vars": "warn",
    },
  },
  {
    files: ["src/**/*.js"],
    ignores: ["src/ui.js"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "document", message: "Keep DOM access in src/ui.js." },
        { name: "window", message: "Keep page interactions in src/ui.js." },
      ],
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: { globals: globals.node },
  },
];
