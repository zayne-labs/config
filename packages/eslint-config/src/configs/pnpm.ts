import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { interopDefault } from "@/utils";

export async function pnpm(
	options: ExtractOptions<OptionsConfig["pnpm"]> = {}
): Promise<TypedFlatConfigItem[]> {
	const { overrides } = options;

	const [eslintPluginPnpm, yamlParser, jsoncParser] = await Promise.all([
		interopDefault(import("eslint-plugin-pnpm")),
		interopDefault(import("yaml-eslint-parser")),
		interopDefault(import("jsonc-eslint-parser")),
	]);

	return [
		{
			files: ["package.json", "**/package.json"],

			languageOptions: {
				parser: jsoncParser,
			},

			name: "zayne/pnpm/package-json",

			plugins: {
				pnpm: eslintPluginPnpm,
			},
			rules: {
				"pnpm/json-enforce-catalog": "error",
				"pnpm/json-prefer-workspace-settings": "error",
				"pnpm/json-valid-catalog": "error",

				...overrides?.json,
			},
		},

		{
			files: ["pnpm-workspace.yaml"],

			languageOptions: {
				parser: yamlParser,
			},

			name: "zayne/pnpm/pnpm-workspace-yaml",

			plugins: {
				pnpm: eslintPluginPnpm,
			},
			rules: {
				"pnpm/yaml-no-duplicate-catalog-item": "error",
				"pnpm/yaml-no-unused-catalog-item": "error",

				...overrides?.yaml,
			},
		},
	];
}
