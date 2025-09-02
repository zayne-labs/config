import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { interopDefault, isObject, renameRules } from "@/utils";

export const node = async (
	options: ExtractOptions<OptionsConfig["node"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides, security = false, type = "app" } = options;

	const [eslintPluginNode, eslintPluginSecurity] = await Promise.all([
		interopDefault(import("eslint-plugin-n")),
		security ? interopDefault(import("eslint-plugin-security")) : undefined,
	]);

	const config: TypedFlatConfigItem[] = [
		{
			name: "zayne/node/recommended",

			plugins: {
				node: eslintPluginNode,
			},

			rules: renameRules(eslintPluginNode.configs["flat/recommended-module"].rules, {
				n: "node",
			}),
		},

		{
			name: "zayne/node/rules",

			rules: {
				"node/no-deprecated-api": "error",
				"node/no-exports-assign": "error",
				"node/no-extraneous-import": "off", // `eslint-plugin-import-x` handles this
				"node/no-missing-import": "off",
				"node/no-path-concat": "error",
				"node/no-unpublished-import": "off",
				"node/no-unsupported-features/es-syntax": "off",
				"node/no-unsupported-features/node-builtins": "off",
				"node/process-exit-as-throw": "error",

				...(type === "app-strict" && {
					"node/no-process-env": "error",
				}),

				...(type === "lib-strict" && {
					"node/no-unsupported-features/es-syntax": "error",
					"node/no-unsupported-features/node-builtins": "error",
				}),

				...overrides,
			},
		},
	];

	if (security && eslintPluginSecurity) {
		config.push({
			name: "zayne/node/security/recommended",

			plugins: {
				security: eslintPluginSecurity,
			},

			rules: {
				...eslintPluginSecurity.configs.recommended.rules,

				...overrides,
				...(isObject(security) && security.overrides),
			},
		});
	}

	return config;
};
