import { interopDefault } from "@/utils";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";

export const comments = async (
	options: ExtractOptions<OptionsConfig["comments"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, type = "app" } = options;

	const eslintPluginComments = await interopDefault(
		import("@eslint-community/eslint-plugin-eslint-comments")
	);

	return [
		{
			name: "zayne/eslint-comments/rules",
			plugins: {
				"eslint-comments": eslintPluginComments,
			},

			rules: {
				"eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
				"eslint-comments/no-aggregating-enable": "error",
				"eslint-comments/no-duplicate-disable": "error",
				"eslint-comments/no-unlimited-disable": "error",
				"eslint-comments/no-unused-enable": "error",

				...(type !== "app" && {
					"eslint-comments/require-description": "warn",
				}),

				...overrides,
			},
		},
	];
};
