import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),

  // 🔹 Configuración para FRONTEND (React)
  {
    files: ["src/**/*.{js,jsx}"], // o donde tengas tu código React
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser, // 👈 entorno navegador
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },

  // 🔹 Configuración para BACKEND (Node.js)
  {
    files: ["backend/**/*.{js,mjs,cjs}"], // 👈 ajusta esta ruta si tu backend está en otra carpeta
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.node, // 👈 ahora reconoce process, __dirname, etc.
      },
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": ["warn"],
    },
  },
]);
