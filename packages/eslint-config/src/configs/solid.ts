import { GLOB_SRC } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils";

const solid = async (
	options: ExtractOptions<OptionsConfig["solid"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files = [GLOB_SRC], overrides, typescript = true } = options;

	await ensurePackages(["eslint-plugin-solid"]);

	const eslintPluginSolid = await interopDefault(import("eslint-plugin-solid"));

	const recommendedSolidConfig =
		eslintPluginSolid.configs[typescript ? "flat/typescript" : "flat/recommended"];

	return [
		{
			name: "zayne/solid/setup",

			plugins: {
				solid: eslintPluginSolid,
			},
		},

		{
			files,

			name: "zayne/solid/recommended",

			rules: recommendedSolidConfig.rules,
		},

		{
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
