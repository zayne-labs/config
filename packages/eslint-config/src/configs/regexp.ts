import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

const regexp = async (
	options: ExtractOptions<OptionsConfig["regexp"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { level = "warn", overrides, settings: regexpSettings } = options;

	const eslintPluginRegexp = await interopDefault(import("eslint-plugin-regexp"));

	const recommendedRules = Object.fromEntries(
		Object.entries(eslintPluginRegexp.configs["flat/recommended"].rules).map(
			([ruleName, ruleConfig]) => [
				ruleName,
				level === "warn" && ruleConfig === "error" ? "warn" : ruleConfig,
			]
		)
	);

	return [
		{
			name: "zayne/regexp/setup",

			plugins: {
				regexp: eslintPluginRegexp,
			},
		},

		{
			name: "zayne/regexp/recommended",

			rules: recommendedRules,
		},

		{
			name: "zayne/regexp/rules",

			rules: {
				...overrides,
			},

			...(regexpSettings && {
				settings: {
					regexp: regexpSettings,
				},
			}),
		},
	];
};

export { regexp };
