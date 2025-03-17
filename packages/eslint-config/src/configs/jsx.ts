import { GLOB_JSX, GLOB_TSX } from "@/globs";
import type { TypedFlatConfigItem } from "@/types";

const jsx = (): TypedFlatConfigItem[] => {
	return [
		{
			files: [GLOB_JSX, GLOB_TSX],

			languageOptions: {
				parserOptions: {
					ecmaFeatures: {
						jsx: true,
					},
				},
			},

			name: "zayne/jsx/setup",
		},
	];
};

export { jsx };
