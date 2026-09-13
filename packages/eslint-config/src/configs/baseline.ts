import { GLOB_ASTRO_TS, GLOB_JS, GLOB_JSX, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

const baseline = async (
	options: ExtractOptions<OptionsConfig["baseline"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const {
		available = "widely",
		env,
		files = [GLOB_JS, GLOB_JSX],
		filesTypeAware = [GLOB_TS, GLOB_TSX],
		ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
		level = "warn",
		overrides,
		overridesTypeAware,
		typescript = false,
	} = options;

	const eslintPluginBaseline = await interopDefault(import("eslint-plugin-baseline-js"));

	const recommendedRules = eslintPluginBaseline.configs.recommended({
		available,
		env,
		level,
	}).rules as TypedFlatConfigItem["rules"];

	const recommendedTypeAwareRules =
		typescript ?
			(eslintPluginBaseline.configs["recommended-ts"]({
				available,
				env,
				level,
			}).rules as TypedFlatConfigItem["rules"])
		:	undefined;

	return [
		{
			name: "zayne/baseline/setup",

			plugins: {
				"baseline-js": eslintPluginBaseline,
			},
		},

		{
			files: typescript ? files : [...files, ...filesTypeAware],

			name: "zayne/baseline/recommended",

			rules: recommendedRules,
		},

		...((typescript ?
			[
				{
					files: filesTypeAware,

					ignores: ignoresTypeAware,

					name: "zayne/baseline/recommended-type-aware",

					rules: recommendedTypeAwareRules,
				},
			]
		:	[]) satisfies TypedFlatConfigItem[]),

		{
			files: [...files, ...filesTypeAware],

			name: "zayne/baseline/rules",

			rules: {
				...overrides,
			},
		},

		...((typescript && overridesTypeAware ?
			[
				{
					files: filesTypeAware,

					ignores: ignoresTypeAware,

					name: "zayne/baseline/rules-type-aware",

					rules: overridesTypeAware,
				},
			]
		:	[]) satisfies TypedFlatConfigItem[]),
	];
};

export { baseline };
