import { getDefaultPluginRenameMap, getDefaultTailwindcssBetterSettings } from "@/constants/defaults";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault, renameRules } from "../utils";

export const tailwindcssBetter = async (
	options: ExtractOptions<OptionsConfig["tailwindcssBetter"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, settings: tailwindCssBetterSettings } = options;

	await ensurePackages(["eslint-plugin-better-tailwindcss"]);

	const [eslintPluginBetterTailwindCss, defaults] = await Promise.all([
		interopDefault(import("eslint-plugin-better-tailwindcss")),
		interopDefault(import("eslint-plugin-better-tailwindcss/defaults")),
	]);

	const zayneDefaultSettings = getDefaultTailwindcssBetterSettings();

	return [
		{
			name: "zayne/tailwindcss-better/setup",

			plugins: {
				"tailwindcss-better": eslintPluginBetterTailwindCss,
			},

			settings: {
				"better-tailwindcss": {
					...zayneDefaultSettings,
					...tailwindCssBetterSettings,

					selectors: [
						...defaults.getDefaultSelectors(),
						...zayneDefaultSettings.selectors,
						...(tailwindCssBetterSettings?.selectors ?? []),
					],
				} satisfies typeof tailwindCssBetterSettings,
			},
		},

		{
			name: "zayne/tailwindcss-better/recommended",

			rules: renameRules(
				eslintPluginBetterTailwindCss.configs["recommended-warn"].rules,
				getDefaultPluginRenameMap()
			),
		},

		{
			name: "zayne/tailwindcss-better/rules",

			rules: {
				"tailwindcss-better/enforce-consistent-important-position": "warn",
				"tailwindcss-better/enforce-consistent-line-wrapping": "off",
				"tailwindcss-better/enforce-consistent-variable-syntax": "warn",
				"tailwindcss-better/enforce-shorthand-classes": "warn",

				...overrides,
			},
		},
	];
};
