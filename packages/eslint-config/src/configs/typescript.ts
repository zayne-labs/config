import { defaultPluginRenameMap } from "@/constants";
import { GLOB_ASTRO_TS, GLOB_MARKDOWN, GLOB_TS, GLOB_TSX } from "../globs";
import type {
	ExtractOptions,
	OptionsConfig,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
	TypedFlatConfigItem,
} from "../types";
import { ensurePackages, interopDefault, renameRules } from "../utils";

export const typescript = async (
	options: ExtractOptions<OptionsConfig["typescript"]>
		& OptionsTypeScriptParserOptions
		& OptionsTypeScriptWithTypes = {}
): Promise<TypedFlatConfigItem[]> => {
	const {
		allowDefaultProject,
		componentExts = [],
		componentExtsTypeAware = [],
		erasableOnly = false,
		files = [GLOB_TS, GLOB_TSX, ...componentExts.map((ext) => `**/*.${ext}`)],
		filesTypeAware = [GLOB_TS, GLOB_TSX, ...componentExtsTypeAware.map((ext) => `**/*.${ext}`)],
		ignoresTypeAware = [`${GLOB_MARKDOWN}/**`, GLOB_ASTRO_TS],
		tsconfigPath = true,
		isTypeAware = Boolean(tsconfigPath),
		overrides,
		parserOptions,
		stylistic = true,
	} = options;

	await ensurePackages([erasableOnly ? "eslint-plugin-erasable-syntax-only" : undefined]);

	const [tsEslint, eslintPluginErasableOnly] = await Promise.all([
		interopDefault(import("typescript-eslint")),
		erasableOnly ? interopDefault(import("eslint-plugin-erasable-syntax-only")) : undefined,
	]);

	const projectServiceObject =
		isTypeAware
		&& (allowDefaultProject ?
			{
				projectService: {
					allowDefaultProject,
					defaultProject: tsconfigPath,
				},
				tsconfigRootDir: process.cwd(),
			}
		:	{
				/**
				 * @default true for auto-discovery of project's tsconfig as fallback
				 * @see https://typescript-eslint.io/blog/parser-options-project-true
				 */
				project: tsconfigPath,
				tsconfigRootDir: process.cwd(),
			});

	const makeParser = (parsedFiles: string[], ignores?: string[]): TypedFlatConfigItem => ({
		files: parsedFiles,

		...(ignores && { ignores }),

		languageOptions: {
			parser: tsEslint.parser,

			parserOptions: {
				extraFileExtensions: componentExts.map((ext) => `.${ext}`),

				sourceType: "module",

				...parserOptions,

				...projectServiceObject,
			},
		},
	});

	const recommendedRules = tsEslint.configs[isTypeAware ? "strictTypeChecked" : "strict"]
		.map((config) => config.rules)
		.reduce<TypedFlatConfigItem["rules"]>((accumulator, rules) => ({ ...accumulator, ...rules }), {});

	const recommendedStylisticRules = tsEslint.configs[isTypeAware ? "stylisticTypeChecked" : "stylistic"]
		.map((config) => config.rules)
		.reduce<TypedFlatConfigItem["rules"]>((accumulator, rules) => ({ ...accumulator, ...rules }), {});

	return [
		{
			name: "zayne/ts-eslint/setup",

			plugins: {
				"ts-eslint": tsEslint.plugin,
			},
		},

		{
			name: "zayne/ts-eslint/parser",

			...makeParser(files),
		},

		...(isTypeAware ?
			[
				{
					name: "zayne/ts-eslint/parser-type-aware",

					...makeParser(filesTypeAware, ignoresTypeAware),
				},
			]
		:	[]),

		{
			files: isTypeAware ? filesTypeAware : files,

			name: `zayne/ts-eslint/recommended-${isTypeAware ? "strict-type-checked" : "strict"}`,

			rules: renameRules(recommendedRules, defaultPluginRenameMap),
		},

		{
			files: isTypeAware ? filesTypeAware : files,

			name: `zayne/ts-eslint/${isTypeAware ? "rules-type-checked" : "rules"}`,

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
				"ts-eslint/no-unnecessary-type-conversion": "error",
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
				"ts-eslint/no-useless-empty-export": "error",

				...(isTypeAware && {
					"ts-eslint/no-unnecessary-type-parameters": "off",
					"ts-eslint/non-nullable-type-assertion-style": "off",
					"ts-eslint/prefer-nullish-coalescing": ["error", { ignoreConditionalTests: true }],
					"ts-eslint/restrict-template-expressions": [
						"error",
						{ allowBoolean: true, allowNullish: true, allowNumber: true },
					],
					"ts-eslint/return-await": ["error", "in-try-catch"],
				}),

				...overrides,
			},
		},

		...(stylistic ?
			[
				{
					files: isTypeAware ? filesTypeAware : files,
					name: `zayne/ts-eslint/recommended-${isTypeAware ? "stylistic-type-checked" : "stylistic"}`,

					rules: renameRules(recommendedStylisticRules, defaultPluginRenameMap),
				},
			]
		:	[]),

		...(erasableOnly ?
			[
				{
					name: "zayne/typescript/erasable-syntax-only/recommended",

					plugins: {
						"erasable-syntax-only": eslintPluginErasableOnly,
					},

					rules: eslintPluginErasableOnly?.configs.recommended.rules as TypedFlatConfigItem["rules"],
				},
			]
		:	[]),
	];
};
