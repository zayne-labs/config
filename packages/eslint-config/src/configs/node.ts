import type { OptionsAppType, OptionsNode, OptionsOverrides, TypedFlatConfigItem } from "@/types";
import { interopDefault, renameRules } from "@/utils";

export const node = async (
	options: OptionsAppType & OptionsNode & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, security = false, type = "app" } = options;

	const eslintPluginNode = await interopDefault(import("eslint-plugin-n"));
	const eslintPluginSecurity = await interopDefault(import("eslint-plugin-security"));

	return [
		{
			name: "zayne/node/setup",
			plugins: {
				node: eslintPluginNode,
				...(security && { security: eslintPluginSecurity }),
			},
		},

		{
			name: "zayne/node/recommended",
			rules: {
				...renameRules(eslintPluginNode.configs["flat/recommended-module"].rules, { n: "node" }),
				...(security && eslintPluginSecurity.configs.recommended.rules),
			},
		},

		{
			name: "zayne/node/rules",

			rules: {
				"node/no-deprecated-api": "error",
				"node/no-exports-assign": "error",
				"node/no-extraneous-import": "off", // eslint-plugin-import-x handles this
				"node/no-missing-import": "off",
				"node/no-path-concat": "error",
				"node/no-unpublished-import": "off",
				"node/process-exit-as-throw": "error",

				...(type === "lib-strict"
					? {
							"node/no-unsupported-features/es-syntax": "error",
							"node/no-unsupported-features/node-builtins": "error",
						}
					: {
							"node/no-unsupported-features/es-syntax": "off",
							"node/no-unsupported-features/node-builtins": "off",
						}),

				...overrides,
			},
		},
	];
};
