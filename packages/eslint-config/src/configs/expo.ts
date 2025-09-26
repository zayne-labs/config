import type { ExtractOptions, OptionsConfig, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault, overrideConfigs } from "../utils";

const expo = async (
	options: ExtractOptions<OptionsConfig["expo"]> = {}
): Promise<TypedFlatConfigItem[]> => {
	const { overrides } = options;

	await ensurePackages(["eslint-config-expo"]);

	const eslintConfigExpo = await interopDefault(import("eslint-config-expo/flat/utils/expo.js"));

	return [
		...overrideConfigs({
			configArray: eslintConfigExpo,
			overrides: { name: "zayne/expo/recommended" },
		}),

		{
			name: "zayne/expo/rules",

			rules: { ...overrides },
		},
	];
};

export { expo };
