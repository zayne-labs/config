import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "@/types";
import { ensurePackages, interopDefault } from "@/utils";

export async function pnpm(
	options: ExtractOptions<OptionsConfig["pnpm"]> = {}
): Promise<TypedFlatConfigItem[]> {
	const { overrides } = options;

	await ensurePackages(["eslint-plugin-pnpm"]);

	const [eslintPluginPnpm, yamlParser, jsoncParser] = await Promise.all([
		interopDefault(import("eslint-plugin-pnpm")),
		interopDefault(import("yaml-eslint-parser")),
		interopDefault(import("jsonc-eslint-parser")),
	]);

	return [
		{
			name: "zayne/pnpm/setup",

			plugins: {
				pnpm: eslintPluginPnpm,
			},
		},

		{
			files: ["package.json", "**/package.json"],

			languageOptions: {
				parser: jsoncParser,
			},

			name: "zayne/pnpm/rules/package-json",

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

			name: "zayne/pnpm/rules/pnpm-workspace-yaml",

			rules: {
				"pnpm/yaml-no-duplicate-catalog-item": "error",
				"pnpm/yaml-no-unused-catalog-item": "error",

				...overrides?.yaml,
			},
		},
	];
}
