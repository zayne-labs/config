import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { interopDefault } from "@/utils";

const jsdoc = async (
	options: ExtractOptions<OptionsConfig["jsdoc"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, stylistic = true } = options;

	const eslintPluginJsdoc = await interopDefault(import("eslint-plugin-jsdoc"));

	return [
		{
			name: "zayne/jsdoc/rules",

			plugins: {
				jsdoc: eslintPluginJsdoc,
			},

			rules: {
				"jsdoc/check-access": "warn",
				"jsdoc/check-param-names": "warn",
				"jsdoc/check-property-names": "warn",
				"jsdoc/check-types": "warn",
				"jsdoc/empty-tags": "warn",
				"jsdoc/implements-on-classes": "warn",
				"jsdoc/no-defaults": "warn",
				"jsdoc/no-multi-asterisks": "warn",
				"jsdoc/require-description": ["warn", { descriptionStyle: "any" }],
				"jsdoc/require-param-name": "warn",
				"jsdoc/require-property": "warn",
				"jsdoc/require-property-description": "warn",
				"jsdoc/require-property-name": "warn",
				"jsdoc/require-returns-check": "warn",
				"jsdoc/require-returns-description": "warn",
				"jsdoc/require-yields-check": "warn",

				...(stylistic && {
					"jsdoc/check-alignment": "warn",
					"jsdoc/multiline-blocks": "warn",
					"jsdoc/require-description": ["warn", { descriptionStyle: "tag" }],
				}),

				...overrides,
			},
		},
	];
};

export { jsdoc };
