import { getDefaultAllowedDependencies } from "@/constants/defaults";
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

	const dependRules: TypedFlatConfigItem["rules"] = {
		"depend/ban-dependencies": ["error", { allowed: getDefaultAllowedDependencies() }],
	};

	return [
		{
			name: "zayne/depend/setup",

			plugins: {
				depend: eslintPluginDepend,
			},
		},

		{
			files,

			name: "zayne/depend/rules",

			rules: {
				...dependRules,
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
				...dependRules,
				...overrides,
			},
		},
	];
};
