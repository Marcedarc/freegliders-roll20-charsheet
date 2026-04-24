import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends:
    ["js/recommended"],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        setAttrs: "readonly",
        getAttrs: "readonly",
        getSectionIDs: "readonly",
        startRoll: "readonly",
        finishRoll: "readonly",
        on: "readonly"
      }
    }
  },
]);
