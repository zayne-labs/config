import { defineEnumDeep } from "@zayne-labs/toolkit-type-helpers";
import c from "ansis";
import type { ExtraLibrariesOptionUnion, FrameworkOptionUnion, PromItem } from "./types";

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

export const frameworkOptions: Array<PromItem<FrameworkOptionUnion>> = [
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
];

export const frameworks: FrameworkOptionUnion[] = frameworkOptions.map(({ value }) => value);

export const extraOptions: Array<PromItem<ExtraLibrariesOptionUnion>> = [
	{
		label: c.cyan("TailwindCSS (Better)"),
		value: "tailwindcssBetter",
	},
];

export const extra = extraOptions.map(({ value }) => value);

export const dependenciesMap = defineEnumDeep({
	astro: ["eslint-plugin-astro", "astro-eslint-parser"],
	react: ["@eslint-react/eslint-plugin", "eslint-plugin-react-hooks", "eslint-plugin-react-refresh"],
	solid: ["eslint-plugin-solid"],
	svelte: ["eslint-plugin-svelte", "svelte-eslint-parser"],
	tailwindcssBetter: ["eslint-plugin-better-tailwindcss"],
	vue: ["eslint-plugin-vue", "eslint-processor-vue-blocks", "vue-eslint-parser"],
}) satisfies Record<ExtraLibrariesOptionUnion | FrameworkOptionUnion, string[]>;
