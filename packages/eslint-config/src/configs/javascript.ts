import globals from "globals";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils";

const javascript = async (
	options: ExtractOptions<OptionsConfig["javascript"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { isInEditor = true, overrides } = options;

	const eslintJs = await interopDefault(import("@eslint/js"));

	return [
		{
			languageOptions: {
				ecmaVersion: "latest",

				globals: {
					...globals.browser,
					...globals.es2022,
					...globals.node,
					document: "readonly",
					navigator: "readonly",
					window: "readonly",
				},

				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					ecmaVersion: "latest",
					sourceType: "module",
				},

				sourceType: "module",
			},

			linterOptions: {
				reportUnusedDisableDirectives: true,
			},

			name: "zayne/js-eslint/setup",
		},

		{
			...eslintJs.configs.recommended,

			name: "zayne/js-eslint/recommended",
		},

		{
			name: "zayne/js-eslint/rules",

			rules: {
				"accessor-pairs": ["error", { enforceForClassMembers: true, setWithoutGet: true }],
				"array-callback-return": ["error", { allowImplicit: true }],
				"block-scoped-var": "error",
				"class-methods-use-this": "error",
				complexity: ["warn", 50],
				curly: ["error", "multi-line"],
				"default-case": ["error", { commentPattern: "^no default$" }],
				"default-case-last": "error",
				"default-param-last": "error",
				"dot-notation": ["error", { allowKeywords: true }],
				eqeqeq: ["error", "always", { null: "ignore" }],
				"grouped-accessor-pairs": "error",
				"logical-assignment-operators": "warn",
				"max-depth": ["warn", 2],
				"max-params": "warn",
				"new-cap": ["error", { capIsNew: false, newIsCap: true, properties: true }],
				"no-alert": "warn",
				"no-array-constructor": "error",
				"no-await-in-loop": "error",
				"no-caller": "error",
				"no-cond-assign": ["error", "always"],
				"no-console": ["error", { allow: ["warn", "error", "info", "trace"] }],
				"no-constructor-return": "error",
				"no-else-return": ["error", { allowElseIf: false }],
				"no-eval": ["error", { allowIndirect: true }],
				"no-extend-native": "error",
				"no-extra-bind": "error",
				"no-implicit-coercion": "warn",
				"no-iterator": "error",
				"no-labels": ["error", { allowLoop: false, allowSwitch: false }],
				"no-lone-blocks": "error",
				"no-lonely-if": "warn",
				"no-loop-func": "error",
				"no-multi-str": "error",
				"no-new": "error",
				"no-new-func": "error",
				"no-new-wrappers": "error",
				"no-octal-escape": "error",
				"no-param-reassign": [
					"error",
					{
						ignorePropertyModificationsFor: [
							"acc", // for reduce accumulators
							"accumulator", // for reduce accumulators
							"e", // for e.returnvalue
							"ctx", // for Koa routing
							"context", // for Koa routing
							"req", // for Express requests
							"request", // for Express requests
							"res", // for Express responses
							"response", // for Express responses
							"$scope", // for Angular 1 scopes
							"staticContext", // for ReactRouter context
						],
						props: true,
					},
				],
				"no-proto": "error",
				"no-restricted-exports": [
					"error",
					{
						restrictedNamedExports: [
							"default", // use `export default` to provide a default export
							"then", // this will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
						],
					},
				],
				"no-restricted-globals": [
					"error",
					{
						message:
							"Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite",
						name: "isFinite",
					},
					{
						message:
							"Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan",
						name: "isNaN",
					},
					{ message: "Use `globalThis` instead.", name: "global" },
					{ message: "Use `globalThis` instead.", name: "self" },
				],
				"no-restricted-imports": ["off", { paths: [], patterns: [] }],
				"no-restricted-properties": [
					"error",
					{
						message: "arguments.callee is deprecated",
						object: "arguments",
						property: "callee",
					},
					{
						message: "Please use Number.isFinite instead",
						object: "global",
						property: "isFinite",
					},
					{
						message: "Please use Number.isFinite instead",
						object: "self",
						property: "isFinite",
					},
					{
						message: "Please use Number.isFinite instead",
						object: "window",
						property: "isFinite",
					},
					{
						message: "Please use Number.isNaN instead",
						object: "global",
						property: "isNaN",
					},
					{
						message: "Please use Number.isNaN instead",
						object: "self",
						property: "isNaN",
					},
					{
						message: "Please use Number.isNaN instead",
						object: "window",
						property: "isNaN",
					},
					{
						message: "Use the exponentiation operator (**) instead.",
						object: "Math",
						property: "pow",
					},
					{
						message: "Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.",
						property: "__proto__",
					},
					{ message: "Use `Object.defineProperty` instead.", property: "__defineGetter__" },
					{ message: "Use `Object.defineProperty` instead.", property: "__defineSetter__" },
					{ message: "Use `Object.getOwnPropertyDescriptor` instead.", property: "__lookupGetter__" },
					{ message: "Use `Object.getOwnPropertyDescriptor` instead.", property: "__lookupSetter__" },
				],
				"no-restricted-syntax": [
					"error",
					"ForInStatement",
					"LabeledStatement",
					"WithStatement",
					"TSEnumDeclaration[const=true]",
					"TSExportAssignment",
				],
				"no-return-assign": ["error", "except-parens"],
				"no-script-url": "error",
				"no-self-compare": "error",
				"no-sequences": "error",
				"no-template-curly-in-string": "error",
				"no-throw-literal": "error",
				"no-undef-init": "error",
				"no-unmodified-loop-condition": "error",
				"no-unneeded-ternary": ["warn", { defaultAssignment: false }],
				"no-unreachable-loop": "error",
				"no-unused-expressions": [
					"error",
					{
						allowShortCircuit: true,
						allowTaggedTemplates: true,
						allowTernary: true,
					},
				],
				"no-unused-vars": [
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
				"no-useless-call": "error",
				"no-useless-computed-key": "error",
				"no-useless-concat": "error",
				"no-useless-constructor": "error",
				"no-useless-rename": [
					"error",
					{ ignoreDestructuring: false, ignoreExport: false, ignoreImport: false },
				],
				"no-useless-return": "error",
				"no-var": "error",
				"object-shorthand": ["error", "always", { avoidQuotes: true, ignoreConstructors: false }],
				"one-var": ["error", { initialized: "never" }],
				"operator-assignment": "warn",
				"prefer-arrow-callback": [
					"error",
					{
						allowNamedFunctions: false,
						allowUnboundThis: true,
					},
				],
				"prefer-const": [
					isInEditor ? "warn" : "error",
					{
						destructuring: "all",
						ignoreReadBeforeAssign: true,
					},
				],
				"prefer-exponentiation-operator": "error",
				"prefer-object-has-own": "error",
				"prefer-object-spread": "warn",
				"prefer-promise-reject-errors": "error",
				"prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
				"prefer-rest-params": "error",
				"prefer-spread": "error",
				"prefer-template": "error",
				"preserve-caught-error": ["error", { requireCatchParameter: true }],
				radix: "error",
				"require-atomic-updates": "error",
				"symbol-description": "error",
				"unicode-bom": ["error", "never"],
				"use-isnan": ["error", { enforceForIndexOf: true }],
				"valid-typeof": ["error", { requireStringLiterals: true }],
				"vars-on-top": "error",
				yoda: ["error", "never"],

				...overrides,
			},
		},
	];
};

export { javascript };
