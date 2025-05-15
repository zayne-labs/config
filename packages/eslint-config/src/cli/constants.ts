import { defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import type { ExtraLibrariesOption, FrameworkOption, PromItem } from "./types";

import c from "ansis";

export const vscodeSettingsString = `
  // Auto fix
  // "editor.codeActionsOnSave": {
  //   "source.fixAll.eslint": "explicit",
  // },

  // Enable eslint for all supported languages
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "html",
    "markdown",
    "json",
    "json5",
    "jsonc",
    "yaml",
    "toml",
    "xml",
    "gql",
    "graphql",
    "astro",
    "svelte",
    "css",
    "less",
    "scss",
    "postcss"
  ]
`;

export const frameworkOptions: Array<PromItem<FrameworkOption>> = [
	{
		label: c.green("Vue"),
		value: "vue",
	},
	{
		label: c.cyan("React"),
		value: "react",
	},
	{
		label: c.red("Svelte"),
		value: "svelte",
	},
	{
		label: c.magenta("Astro"),
		value: "astro",
	},
	{
		label: c.cyan("Solid"),
		value: "solid",
	},
	{
		label: c.blue("Slidev"),
		value: "slidev",
	},
];

export const frameworks: FrameworkOption[] = frameworkOptions.map(({ value }) => value);

export const extraOptions: Array<PromItem<ExtraLibrariesOption>> = [
	{
		label: c.cyan("UnoCSS"),
		value: "unocss",
	},
];

export const extra: ExtraLibrariesOption[] = extraOptions.map(({ value }) => value);

export const dependenciesMap = defineEnumDeep({
	astro: ["eslint-plugin-astro", "astro-eslint-parser"],
	react: ["@eslint-react/eslint-plugin", "eslint-plugin-react-hooks", "eslint-plugin-react-refresh"],
	slidev: [],
	solid: ["eslint-plugin-solid"],
	svelte: ["eslint-plugin-svelte", "svelte-eslint-parser"],
	vue: ["eslint-plugin-vue", "eslint-processor-vue-blocks", "vue-eslint-parser"],
});
