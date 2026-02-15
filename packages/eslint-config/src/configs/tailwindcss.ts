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
		interopDefault(import("eslint-plugin-better-tailwindcss/api/defaults")),
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
					...tailwindCssBetterSettings,

					attributes: [
						...defaults.getDefaultAttributes(),
						...zayneDefaultSettings.attributes,
						...(tailwindCssBetterSettings?.attributes ?? []),
					],

					callees: [
						...defaults.getDefaultCallees(),
						...zayneDefaultSettings.callees,
						...(tailwindCssBetterSettings?.callees ?? []),
					],

					entryPoint: tailwindCssBetterSettings?.entryPoint ?? `${process.cwd()}/tailwind.css`,
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

/**
 * @description tailwindcss v4 is not supported yet
 * @deprecated until `eslint-plugin-tailwindcss` supports tailwindcss v4
 */
// export const tailwindcss = async (
// 	options: ExtractOptions<OptionsConfig["tailwindcss"]> = {}
// ): Promise<TypedFlatConfigItem[]> => {
// 	const { overrides, settings: tailwindCssSettings } = options;

// 	await ensurePackages(["eslint-plugin-tailwindcss"]);

// 	const eslintPluginTailwindCss = await interopDefault(import("eslint-plugin-tailwindcss"));

// 	return [
// 		{
// 			name: "zayne/tailwindcss/setup",
// 			plugins: {
// 				tailwindcss: eslintPluginTailwindCss,
// 			},
// 			settings: {
// 				tailwindcss: {
// 					callees: ["tv", "cnMerge", "cn", "cnJoin", "twMerge", "twJoin"],
// 					classRegex: "^class(Name|Names)?$",
// 					cssFiles: [],
// 					removeDuplicates: false, // Turned off cuz prettier already handles this via plugin
// 					...tailwindCssSettings,
// 				},
// 			},
// 		},

// 		{
// 			name: "zayne/tailwindcss/recommended",

// 			rules: eslintPluginTailwindCss.configs["flat/recommended"][1]?.rules,
// 		},

// 		{
// 			name: "zayne/tailwindcss/rules",

// 			rules: {
// 				"tailwindcss/no-contradicting-classname": "off", // Turned off cuz tw intellisense already handles this
// 				"tailwindcss/no-custom-classname": [
// 					"warn",
// 					{ ignoredKeys: ["compoundVariants", "defaultVariants", "responsiveVariants"] },
// 				],

// 				...overrides,
// 			},
// 		},
// 	];
// };
