import tseslint from "@electron-toolkit/eslint-config-ts";
import config from "@package/eslint-config";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig(
    {
        ignores: ["**/node_modules", "**/dist", "**/out", "*.config.mjs", "src/renderer/src/components/ui/**"],
    },
    ...config,
    tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginReact.configs.flat.recommended,
    eslintPluginReact.configs.flat["jsx-runtime"],
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
            sourceType: "module",
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        settings: {
            react: {
                version: "detect",
            },
        },
    },
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "react-hooks": eslintPluginReactHooks,
            "react-refresh": eslintPluginReactRefresh,
        },
        rules: {
            ...eslintPluginReactRefresh.configs.vite.rules,
            ...eslintPluginReactHooks.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-argument": "warn",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
        },
    },
);
