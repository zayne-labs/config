import { defineConfig, type UserConfig } from "tsdown";

const isDevMode = process.env.NODE_ENV === "development";

const sharedOptions = {
	clean: true,
	dts: true,
	entry: ["src/index.ts", "src/constants/*.ts", "src/utils.ts", "src/cli/index.ts"],
	fixedExtension: false,
	format: ["esm"],
	platform: "node",
	sourcemap: !isDevMode,
	target: "esnext",
	treeshake: true,
	tsconfig: "tsconfig.json",
} satisfies UserConfig;

const config = defineConfig({
	...sharedOptions,
	name: "ESM",
	outDir: "./dist",
});

export default config;
