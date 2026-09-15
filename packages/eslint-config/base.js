import babelParser from "@babel/eslint-parser";
import js from "@eslint/js";
import onlyWarn from "eslint-plugin-only-warn";
import turboPlugin from "eslint-plugin-turbo";

/** @type {import('eslint').Linter.Config[]} */
export const config = [
    js.configs.recommended,
    {
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    presets: [import.meta.resolve("@babel/preset-typescript")],
                },
            },
        },
        plugins: {
            turbo: turboPlugin,
        },
        rules: {
            "turbo/no-undeclared-env-vars": "off",
        },
    },
    {
        plugins: {
            onlyWarn,
        },
    },
    {
        ignores: ["dist/**", ".next/**", "build/**", ".expo/**", "node_modules/**"],
    },
];

export default config;
