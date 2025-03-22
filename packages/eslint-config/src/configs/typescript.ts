import { createOverrideRules, interopDefault, renamePluginInConfigs } from "@/utils";
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../globs";
import type {
	ExtractOptions,
	OptionsConfig,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
	TypedFlatConfigItem,
} from "../types";

type OptionsTypescript = ExtractOptions<OptionsConfig["typescript"]>;

export const typescript = async (
	options: OptionsTypescript & OptionsTypeScriptParserOptions & OptionsTypeScriptWithTypes = {}
): Promise<TypedFlatConfigItem[]> => {
	const {
		allowDefaultProjects,
		componentExts = [],
		files = [GLOB_TS, GLOB_TSX, ...componentExts.map((ext) => `**/*.${ext}`)],
		filesTypeAware = [GLOB_TS, GLOB_TSX, ...componentExts.map((ext) => `**/*.${ext}`)],
		ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
		overrides,
		overridesTypeAware,
		parserOptions,
		stylistic = true,
		tsconfigPath,
	} = options;

	const isTypeAware = Boolean(tsconfigPath);

	const tsEslint = await interopDefault(import("typescript-eslint"));

	const projectServiceObject =
		isTypeAware
		&& (allowDefaultProjects
			? {
					projectService: {
						allowDefaultProject: allowDefaultProjects,
						defaultProject: tsconfigPath,
					},
					tsconfigRootDir: process.cwd(),
				}
			: {
					project: tsconfigPath,
					tsconfigRootDir: process.cwd(),
				});

	const makeParser = (parsedFiles: string[], ignores?: string[]): TypedFlatConfigItem => ({
		files: parsedFiles,

		...(ignores && { ignores }),

		languageOptions: {
			parser: tsEslint.parser,

			parserOptions: {
				ecmaFeatures: { globalReturn: true },

				extraFileExtensions: componentExts.map((ext) => `.${ext}`),

				sourceType: "module",

				...projectServiceObject,

				...parserOptions,
			},
		},
	});

	const selectedBaseRuleSet = isTypeAware ? "strictTypeChecked" : "strict";
	const selectedStylisticRuleSet = isTypeAware ? "strictTypeChecked" : "strict";

	const typeAwareRules = {
		"ts-eslint/no-unnecessary-type-parameters": "off",
		"ts-eslint/non-nullable-type-assertion-style": "off",
		"ts-eslint/prefer-nullish-coalescing": ["error", { ignoreConditionalTests: true }],
		"ts-eslint/restrict-template-expressions": [
			"error",
			{ allowBoolean: true, allowNullish: true, allowNumber: true },
		],
		"ts-eslint/return-await": ["error", "in-try-catch"],
	} satisfies TypedFlatConfigItem["rules"];

	return [
		{
			name: `zayne/ts-eslint/${isTypeAware ? "type-aware-setup" : "setup"}`,

			...makeParser(files),
			...(isTypeAware && makeParser(filesTypeAware, ignoresTypeAware)),
		},

		...renamePluginInConfigs({
			configs: tsEslint.configs[selectedBaseRuleSet],
			overrides: {
				files,
				name: `zayne/ts-eslint/${selectedBaseRuleSet}`,
			},
			renameMap: { "@typescript-eslint": "ts-eslint" },
		}),

		...(stylistic
			? renamePluginInConfigs({
					configs: tsEslint.configs[selectedStylisticRuleSet],
					overrides: {
						files,
						name: `zayne/ts-eslint/${selectedStylisticRuleSet}`,
					},
					renameMap: { "@typescript-eslint": "ts-eslint" },
				})
			: []),

		{
			files,

			name: "zayne/ts-eslint/rules",

			rules: {
				"ts-eslint/array-type": ["error", { default: "array-simple" }],
				"ts-eslint/consistent-type-definitions": ["error", "type"],
				"ts-eslint/default-param-last": "error",
				"ts-eslint/member-ordering": "error",
				"ts-eslint/method-signature-style": ["error", "property"],
				"ts-eslint/no-confusing-void-expression": "off",
				"ts-eslint/no-empty-function": [
					"error",
					{ allow: ["arrowFunctions", "functions", "methods"] },
				],
				"ts-eslint/no-import-type-side-effects": "error",
				"ts-eslint/no-shadow": "error",
				"ts-eslint/no-unused-expressions": [
					"error",
					{
						allowShortCircuit: true,
						allowTernary: true,
					},
				],
				"ts-eslint/no-unused-vars": [
					"warn",
					{
						args: "all",
						argsIgnorePattern: "^_",
						caughtErrors: "all",
						destructuredArrayIgnorePattern: "^_",
						reportUsedIgnorePattern: true,
						vars: "all",
						varsIgnorePattern: "[iI]gnored",
					},
				],
				"ts-eslint/no-use-before-define": "off",
				"ts-eslint/no-useless-constructor": "error",
			},
		},

		createOverrideRules({ configName: "ts-eslint", files, overrides }),

		...(isTypeAware
			? [
					{
						files: filesTypeAware,
						ignores: ignoresTypeAware,
						name: "zayne/ts-eslint/rules-type-aware",
						rules: typeAwareRules,
					},
					createOverrideRules({
						files,
						name: "ts-eslint/rules-type-aware/overrides",
						overrides: overridesTypeAware,
					}),
				]
			: []),
	];
};
