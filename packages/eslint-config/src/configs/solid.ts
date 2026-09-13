import { deepCompare, omitKeys } from "@zayne-labs/toolkit-core";
import { GLOB_JS, GLOB_JSX, GLOB_TS, GLOB_TSX } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils";

const solid = async (
	options: ExtractOptions<OptionsConfig["solid"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const {
		files = [GLOB_JS, GLOB_JSX],
		filesTypeAware = [GLOB_TS, GLOB_TSX],
		overrides,
		typescript = true,
	} = options;

	await ensurePackages(["eslint-plugin-solid"]);

	const eslintPluginSolid = await interopDefault(import("eslint-plugin-solid"));

	const recommendedRules = eslintPluginSolid.configs["flat/recommended"]
		.rules as TypedFlatConfigItem["rules"];

	const recommendedTypeScriptRules =
		typescript ?
			(eslintPluginSolid.configs["flat/typescript"].rules as TypedFlatConfigItem["rules"])
		:	undefined;

	const recommendedTypeScriptSpecificRules =
		recommendedTypeScriptRules ?
			omitKeys(
				recommendedTypeScriptRules,
				Object.entries(recommendedTypeScriptRules).flatMap(([ruleName, ruleConfig]) =>
					deepCompare(recommendedRules?.[ruleName], ruleConfig) ? [ruleName] : []
				)
			)
		:	undefined;

	const allFiles = [...files, ...filesTypeAware];

	return [
		{
			name: "zayne/solid/setup",

			plugins: {
				solid: eslintPluginSolid,
			},
		},

		{
			files: allFiles,

			name: "zayne/solid/recommended",

			rules: recommendedRules,
		},

		...((typescript ?
			[
				{
					files: filesTypeAware,

					name: "zayne/solid/recommended-typescript",

					rules: recommendedTypeScriptSpecificRules,
				},
			]
		:	[]) satisfies TypedFlatConfigItem[]),

		{
			files: allFiles,

			name: "zayne/solid/rules",

			rules: {
				"solid/no-innerhtml": ["error", { allowStatic: true }],
				"solid/style-prop": ["error", { styleProps: ["style", "css"] }],

				...overrides,
			},
		},
	];
};

export { solid };
