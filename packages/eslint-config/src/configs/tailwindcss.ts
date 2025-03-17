import type { OptionsOverrides, OptionsTailwindCSS, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault } from "@/utils";

const tailwindcss = async (
	options: OptionsOverrides & OptionsTailwindCSS = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, settings: tailwindCssSettings } = options;

	await ensurePackages(["eslint-plugin-tailwindcss"]);

	const eslintPluginTailwindCss = await interopDefault(import("eslint-plugin-tailwindcss"));

	return [
		{
			name: "zayne/tailwindcss/setup",
			plugins: {
				tailwindcss: eslintPluginTailwindCss,
			},
			settings: {
				tailwindcss: {
					callees: ["tv", "cnMerge", "cn", "cnJoin", "twMerge", "twJoin"],
					classRegex: "^class(Name|Names)?$",
					cssFiles: [],
					removeDuplicates: false, // Turned off cuz prettier already handles this via plugin
					...tailwindCssSettings,
				},
			},
		},

		{
			name: "zayne/tailwindcss/recommended",

			rules: eslintPluginTailwindCss.configs["flat/recommended"][1]?.rules,
		},

		{
			name: "zayne/tailwindcss/rules",

			rules: {
				"tailwindcss/no-contradicting-classname": "off", // Turned off cuz tw intellisense already handles this
				"tailwindcss/no-custom-classname": [
					"warn",
					{ ignoredKeys: ["compoundVariants", "defaultVariants", "responsiveVariants"] },
				],

				...overrides,
			},
		},
	];
};

export { tailwindcss };
