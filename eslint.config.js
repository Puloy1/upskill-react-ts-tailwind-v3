import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
  { ignores: ["dist", "coverage", "node_modules"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { "react-hooks": reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,

      // Day 1 onward: `any` is the thing the curriculum is trying to remove.
      "@typescript-eslint/no-explicit-any": "error",

      /* ------------------------------------------------------------------
         Day 5 adds the architecture rule here. It is commented out until
         then, because on Day 1 there are no features to protect and a rule
         that fires on nothing teaches nothing.

      "no-restricted-imports": ["error", {
        patterns: [{
          group: ["@/features/*"],
          message: "entities and shared must not import features",
        }],
      }],
      ------------------------------------------------------------------ */
    },
  },
);
