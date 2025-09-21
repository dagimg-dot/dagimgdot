import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import astro from "eslint-plugin-astro";

export default [
  js.configs.recommended,

  ...astro.configs.recommended,

  {
    files: ["**/*.astro"],
    languageOptions: {
      globals: {
        astroHTML: "readonly",
        Astro: "readonly",
        Fragment: "readonly",
        jsx: "readonly",
        jsxs: "readonly",
        jsxDEV: "readonly",
        jsxFragment: "readonly",
        jsxFragmentDEV: "readonly",
      },
    },
  },

  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        URL: "readonly",
        Response: "readonly",
        RenderResult: "readonly",
        Render: "readonly",
        RenderedContent: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      semi: ["error", "always"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "no-undef": "off", // TypeScript handles this
    },
  },

  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
  },

  {
    ignores: [".vscode/", "dist/", "node_modules/", "public/", ".astro/"],
  },
];
