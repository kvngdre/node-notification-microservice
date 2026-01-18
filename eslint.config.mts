import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      // Turn off base rule in favour of TypeScript version
      "no-unused-vars": "off",
      // Configure TypeScript unused vars rule to ignore _, __, and next
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^(_|__|next)$",
          varsIgnorePattern: "^(_|__|next)$",
          caughtErrorsIgnorePattern: "^(_|__|next)$"
        }
      ]
    }
  },
  tseslint.configs.recommended,
  prettier,
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"]
  },
  {
    ignores: ["node_modules/", "dist/", "coverage/", "tsconfig.json", "eslint.config.mts"]
  }
]);
