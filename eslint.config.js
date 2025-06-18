import { zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		ignores: [
			"packages/eslint-config/dist",
			"packages/eslint-config/src/typegen.d.ts",
			"packages/eslint-config/src/types/eslint-config-types",
			"packages/tsconfig/src",
		],
		react: {
			// compiler: true,
			// nextjs: true,
		},
		solid: {
			files: ["fixtures/solid/**"],
		},
		tailwindcssBetter: true,
		tanstack: true,
		type: "lib-strict",
		typescript: {
			tsconfigPath: ["**/tsconfig.json"],
		},
		vue: true,
	},

	{
		files: ["packages/eslint-config/src/cli/**/*.ts"],
		rules: {
			"import/no-named-as-default-member": "off",
			"node/no-process-exit": "off",
			"ts-eslint/no-unsafe-assignment": "off",
			"ts-eslint/no-unsafe-call": "off",
			"ts-eslint/no-unsafe-member-access": "off",
			"ts-eslint/restrict-template-expressions": "off", // FIXME
			"unicorn/no-process-exit": "off",
		},
	},

	{
		files: ["packages/eslint-config/bin/index.js"],
		rules: {
			"node/hashbang": "off",
		},
	}
);
