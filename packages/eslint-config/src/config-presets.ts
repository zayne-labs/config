import type { OptionsConfig } from "./types";

export const CONFIG_PRESET_FULL_ON: OptionsConfig = {
	astro: true,
	comments: true,
	depend: true,
	expo: true,
	imports: true,
	jsdoc: true,
	jsonc: true,
	jsx: {
		a11y: true,
	},
	markdown: true,
	node: {
		security: true,
	},
	perfectionist: true,
	pnpm: {
		catalogs: true,
		json: true,
		sort: true,
		yaml: true,
	},
	react: {
		compiler: true,
		nextjs: true,
		refresh: true,
		youMightNotNeedAnEffect: true,
	},
	solid: true,
	stylistic: true,
	tailwindcssBetter: true,
	tanstack: {
		query: true,
		router: true,
	},
	toml: true,
	typescript: {
		erasableOnly: true,
	},
	unicorn: true,
	vue: {
		a11y: true,
	},
	yaml: true,
};
