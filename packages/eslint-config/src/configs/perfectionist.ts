import type { OptionsOverrides, TypedFlatConfigItem } from "@/types";
import { interopDefault } from "@/utils";

const perfectionist = async (options: OptionsOverrides = {}): Promise<TypedFlatConfigItem[]> => {
	const { overrides } = options;

	const eslintPluginPerfectionist = await interopDefault(import("eslint-plugin-perfectionist"));

	return [
		{
			name: "zayne/perfectionist/rules",

			plugins: {
				perfectionist: eslintPluginPerfectionist,
			},

			rules: {
				"perfectionist/sort-array-includes": [
					"warn",
					{
						order: "asc",
						type: "alphabetical",
					},
				],

				"perfectionist/sort-classes": [
					"warn",
					{
						order: "asc",
						type: "alphabetical",
					},
				],

				"perfectionist/sort-interfaces": [
					"warn",
					{
						order: "asc",
						type: "alphabetical",
					},
				],

				"perfectionist/sort-intersection-types": [
					"warn",
					{
						groups: [
							"conditional",
							"literal",
							"import",
							"intersection",
							"keyword",
							"tuple",
							"named",
							"object",
							"function",
							"operator",
							"union",
							"nullish",
						],
						order: "asc",
						type: "alphabetical",
					},
				],

				"perfectionist/sort-maps": [
					"warn",
					{
						order: "asc",
						type: "alphabetical",
					},
				],

				"perfectionist/sort-object-types": [
					"warn",
					{
						order: "asc",
						type: "alphabetical",
					},
				],

				"perfectionist/sort-objects": [
					"warn",
					{
						order: "asc",
						type: "alphabetical",
					},
				],

				"perfectionist/sort-switch-case": [
					"warn",
					{
						order: "asc",
						type: "alphabetical",
					},
				],

				"perfectionist/sort-union-types": [
					"warn",
					{
						groups: [
							"conditional",
							"literal",
							"import",
							"intersection",
							"keyword",
							"tuple",
							"named",
							"object",
							"function",
							"operator",
							"union",
							"nullish",
						],
						order: "asc",
						type: "alphabetical",
					},
				],
				"perfectionist/sort-variable-declarations": [
					"warn",
					{
						order: "asc",
						type: "alphabetical",
					},
				],
				// "perfectionist/sort-svelte-attributes": [
				// 	"warn",
				// 	{
				// 		order: "asc",
				// 		type: "alphabetical",
				// 	},
				// ],
				// "perfectionist/sort-astro-attributes": [
				// 	"warn",
				// 	{
				// 		order: "asc",
				// 		type: "alphabetical",
				// 	},
				// ],
				// "perfectionist/sort-vue-attributes": [
				// 	"warn",
				// 	{
				// 		order: "asc",
				// 		type: "alphabetical",
				// 	},
				// ],
				// "perfectionist/sort-jsx-props": [
				// 	"warn",
				// 	{
				// 		// ignorePattern: ["src"],
				// 		order: "asc",
				// 		type: "alphabetical",
				// 	},
				// ],

				...overrides,
			},
		},
	];
};

export { perfectionist };
