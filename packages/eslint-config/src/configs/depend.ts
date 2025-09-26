import { GLOB_SRC } from "@/globs";
import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils";

export const depend = async (
	options: ExtractOptions<OptionsConfig["depend"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { files = [GLOB_SRC], overrides } = options;

	await ensurePackages(["eslint-plugin-depend"]);

	const [eslintPluginDepend, jsoncParser] = await Promise.all([
		interopDefault(import("eslint-plugin-depend")),
		interopDefault(import("jsonc-eslint-parser")),
	]);

	type PossibleConfigShape = { "flat/recommended": TypedFlatConfigItem | undefined };

	return [
		{
			files,

			name: "zayne/depend/recommended",

			plugins: {
				depend: eslintPluginDepend,
			},

			rules: {
				...(eslintPluginDepend.configs as PossibleConfigShape)["flat/recommended"]?.rules,
				...overrides,
			},
		},

		{
			files: ["package.json", "**/package.json"],

			languageOptions: {
				parser: jsoncParser,
			},

			name: "zayne/depend/recommended/package-json",

			plugins: {
				depend: eslintPluginDepend,
			},

			rules: {
				...(eslintPluginDepend.configs as PossibleConfigShape)["flat/recommended"]?.rules,
				...overrides,
			},
		},
	];
};
