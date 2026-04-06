import type { Linter } from "eslint";
import { mergeProcessors } from "eslint-merge-processors";
import { GLOB_VUE } from "../globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault, resolveOptions } from "../utils";

export const vue = async (
	options: ExtractOptions<OptionsConfig["vue"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const {
		a11y = false,
		files = [GLOB_VUE],
		overrides,
		sfcBlocks = true,
		stylistic = true,
		typescript = true,
		vueVersion = 3,
	} = options;

	await ensurePackages([
		"eslint-plugin-vue",
		"vue-eslint-parser",
		sfcBlocks ? "eslint-processor-vue-blocks" : undefined,
		a11y ? "eslint-plugin-vuejs-accessibility" : undefined,
	]);

	const [pluginVue, parserVue, processorVueBlocks, pluginVueA11y, tsEslint] = await Promise.all([
		interopDefault(import("eslint-plugin-vue")),
		interopDefault(import("vue-eslint-parser")),
		sfcBlocks ? interopDefault(import("eslint-processor-vue-blocks")) : undefined,
		a11y ? interopDefault(import("eslint-plugin-vuejs-accessibility")) : undefined,
		typescript ? interopDefault(import("typescript-eslint")) : undefined,
	]);

	return [
		{
			/**
			 * This allows Vue plugin to work with auto imports
			 * @ see https://github.com/vuejs/eslint-plugin-vue/pull/2422
			 */
			languageOptions: {
				globals: {
					computed: "readonly",
					defineEmits: "readonly",
					defineExpose: "readonly",
					defineProps: "readonly",
					onMounted: "readonly",
					onUnmounted: "readonly",
					reactive: "readonly",
					ref: "readonly",
					shallowReactive: "readonly",
					shallowRef: "readonly",
					toRef: "readonly",
					toRefs: "readonly",
					watch: "readonly",
					watchEffect: "readonly",
				},
			},

			name: "zayne/vue/setup",

			plugins: {
				vue: pluginVue,
				...(a11y && {
					"vuejs-a11y": pluginVueA11y,
				}),
			},
		},

		{
			files,

			languageOptions: {
				parser: parserVue,
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
					extraFileExtensions: [".vue"],
					sourceType: "module",
					...(typescript && { parser: tsEslint?.parser }),
				},
			},

			name: "zayne/vue/parser",

			processor:
				sfcBlocks === false ?
					(pluginVue.processors[".vue"] as Linter.Processor)
				:	mergeProcessors([
						pluginVue.processors[".vue"] as Linter.Processor,
						processorVueBlocks?.({
							...resolveOptions(sfcBlocks),
							blocks: {
								styles: true,
								...resolveOptions(sfcBlocks).blocks,
							},
						}) ?? (pluginVue.processors[".vue"] as Linter.Processor),
					]),
		},

		{
			files,

			name: "zayne/vue/recommended",

			rules: {
				...pluginVue.configs.base.rules,

				...pluginVue.configs[`flat/${vueVersion === 2 ? "vue2-" : ""}essential`].at(-1)?.rules,
				...pluginVue.configs[`flat/${vueVersion === 2 ? "vue2-" : ""}strongly-recommended`].at(-1)
					?.rules,
				...pluginVue.configs[`flat/${vueVersion === 2 ? "vue2-" : ""}recommended`].at(-1)?.rules,
			},
		},

		{
			files,

			name: "zayne/vue/rules",

			rules: {
				"vue/block-order": [
					"error",
					{
						order: ["script", "template", "style"],
					},
				],
				"vue/component-name-in-template-casing": ["error", "PascalCase"],

				"vue/component-options-name-casing": ["error", "PascalCase"],

				"vue/custom-event-name-casing": ["error", "camelCase"],
				"vue/define-macros-order": [
					"error",
					{
						order: ["defineOptions", "defineProps", "defineEmits", "defineSlots"],
					},
				],
				"vue/dot-location": ["error", "property"],
				"vue/dot-notation": ["error", { allowKeywords: true }],
				"vue/eqeqeq": ["error", "smart"],
				"vue/html-indent": "off",
				"vue/html-quotes": ["error", "double"],
				"vue/max-attributes-per-line": "off",
				"vue/multi-word-component-names": "off",
				"vue/no-dupe-keys": "off",
				"vue/no-empty-pattern": "error",
				"vue/no-irregular-whitespace": "error",
				"vue/no-loss-of-precision": "error",
				"vue/no-restricted-syntax": [
					"error",
					"DebuggerStatement",
					"LabeledStatement",
					"WithStatement",
				],
				"vue/no-restricted-v-bind": ["error", "/^v-/"],
				"vue/no-setup-props-reactivity-loss": "off",
				"vue/no-sparse-arrays": "error",
				"vue/no-unused-refs": "error",
				"vue/no-useless-v-bind": "error",
				"vue/no-v-html": "off",
				"vue/object-shorthand": [
					"error",
					"always",
					{
						avoidQuotes: true,
						ignoreConstructors: false,
					},
				],
				"vue/prefer-separate-static-class": "error",
				"vue/prefer-template": "error",
				"vue/prop-name-casing": ["error", "camelCase"],
				"vue/require-default-prop": "off",
				"vue/require-prop-types": "off",
				"vue/singleline-html-element-content-newline": "off",
				"vue/space-infix-ops": "error",
				"vue/space-unary-ops": ["error", { nonwords: false, words: true }],

				...(stylistic && {
					"vue/array-bracket-spacing": ["error", "never"],
					"vue/arrow-spacing": ["error", { after: true, before: true }],
					"vue/block-spacing": ["error", "always"],
					"vue/block-tag-newline": [
						"error",
						{
							multiline: "always",
							singleline: "always",
						},
					],
					"vue/brace-style": ["error", "stroustrup", { allowSingleLine: true }],
					"vue/comma-dangle": ["error", "always-multiline"],
					"vue/comma-spacing": ["error", { after: true, before: false }],
					"vue/comma-style": ["error", "last"],
					"vue/html-comment-content-spacing": [
						"error",
						"always",
						{
							exceptions: ["-"],
						},
					],
					"vue/key-spacing": ["error", { afterColon: true, beforeColon: false }],
					"vue/keyword-spacing": ["error", { after: true, before: true }],
					"vue/object-curly-newline": "off",
					"vue/object-curly-spacing": ["error", "always"],
					"vue/object-property-newline": ["error", { allowMultiplePropertiesPerLine: true }],
					"vue/operator-linebreak": ["error", "before"],
					"vue/padding-line-between-blocks": ["error", "always"],
					"vue/quote-props": ["error", "consistent-as-needed"],
					"vue/space-in-parens": ["error", "never"],
					"vue/template-curly-spacing": "error",
				}),

				...(a11y && {
					"vuejs-a11y/alt-text": "error",
					"vuejs-a11y/anchor-has-content": "error",
					"vuejs-a11y/anchor-is-valid": "error",
					"vuejs-a11y/aria-activedescendant-has-tabindex": "error",
					"vuejs-a11y/aria-props": "error",
					"vuejs-a11y/aria-role": "error",
					"vuejs-a11y/aria-unhandled-messages": "error",
					"vuejs-a11y/heading-has-content": "error",
					"vuejs-a11y/html-has-lang": "error",
					"vuejs-a11y/iframe-has-title": "error",
					"vuejs-a11y/img-redundant-alt": "error",
					"vuejs-a11y/label-has-for": "error",
					"vuejs-a11y/media-has-caption": "error",
					"vuejs-a11y/mouse-events-have-key-events": "error",
					"vuejs-a11y/no-access-key": "error",
					"vuejs-a11y/no-autofocus": "error",
					"vuejs-a11y/no-distracting-elements": "error",
					"vuejs-a11y/no-interactive-element-to-non-interactive-role": "error",
					"vuejs-a11y/no-noninteractive-element-interactions": "error",
					"vuejs-a11y/no-noninteractive-tabindex": "error",
					"vuejs-a11y/role-has-required-aria-props": "error",
					"vuejs-a11y/role-supports-aria-props": "error",
					"vuejs-a11y/tabindex-no-positive": "error",
				}),

				...overrides,
			},
		},

		{
			files,

			name: "zayne/vue/disables",

			rules: {
				"node/prefer-global/process": "off",
				"ts-eslint/no-unused-vars": "off",
			},
		},
	];
};
