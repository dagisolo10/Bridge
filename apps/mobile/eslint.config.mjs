import config from "@package/eslint-config";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(...config, {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
    plugins: {
        "react-hooks": reactHooks,
        "@typescript-eslint": tseslint.plugin,
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        "react-hooks/exhaustive-deps": "warn",
        "no-undef": "off",

        // Disable standard JS rule and use the TypeScript-aware rule
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
    },
});
