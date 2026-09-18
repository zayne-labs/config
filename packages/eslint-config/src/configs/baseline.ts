import { GLOB_ASTRO_TS, GLOB_JS, GLOB_JSX, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

const baseline = async (
	options: ExtractOptions<OptionsConfig["baseline"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const {
		available = 2025,
		files = [GLOB_JS, GLOB_JSX],
		filesTypeAware = [GLOB_TS, GLOB_TSX],
		ignores = [`${GLOB_MARKDOWN}/**`],
		ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
		level = "warn",
		overrides,
		overridesTypeAware,
		typescript = false,
	} = options;

	const eslintPluginBaseline = await interopDefault(import("eslint-plugin-baseline-js"));

	return [
		{
			name: "zayne/baseline/setup",

			plugins: {
				"baseline-js": eslintPluginBaseline,
			},
		},

		{
			files: typescript ? files : [...files, ...filesTypeAware],

			ignores,

			name: "zayne/baseline/rules",

			rules: {
				"baseline-js/use-baseline": [
					level,
					{
						available,
						includeJsBuiltins: { preset: "auto" },
						includeWebApis: { preset: "auto" },
					},
				],

				...overrides,
			},
		},

		...((typescript && overridesTypeAware ?
			[
				{
					files: filesTypeAware,

					ignores: ignoresTypeAware,

					name: "zayne/baseline/rules-type-aware",

					rules: {
						"baseline-js/use-baseline": [
							level,
							{
								available,
								includeJsBuiltins: { preset: "type-aware" },
								includeWebApis: { preset: "type-aware" },
							},
						],

						...overridesTypeAware,
					},
				},
			]
		:	[]) satisfies TypedFlatConfigItem[]),
	];
};

export { baseline };
