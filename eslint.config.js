import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { ignores: ["dist"] },
  {
    rules: {
      eqeqeq: "error",
      "no-var": "error",
      "prefer-const": "error",
    },
  },
  {
    files: ["**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: { globals: globals.node },
    rules: { "no-unused-vars": "warn" },
  },
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": true, "ts-ignore": true, "ts-nocheck": true, "ts-check": false },
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: ":matches(TSAsExpression, TSTypeAssertion)",
          message: "Narrow values with runtime checks instead of type assertions.",
        },
      ],
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["src/**/*.ts"],
    ignores: ["src/ui.ts"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "document", message: "Keep DOM access in src/ui.ts." },
        { name: "window", message: "Keep page interactions in src/ui.ts." },
      ],
    },
  },
  {
    files: ["tests/**/*.ts"],
    languageOptions: { globals: globals.node },
  },
]);
