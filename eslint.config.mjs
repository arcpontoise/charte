import js from "@eslint/js";
import globals from "globals";

export default [
  // js/menu.js is generated from src/arc-menu.js and menu.yaml
  { ignores: ["js/**", "node_modules/**", "_site/**"] },
  js.configs.recommended,
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ARC_MENU: "readonly" },
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: "error",
    },
  },
];
