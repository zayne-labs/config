import { defineConfig, type Options } from "tsdown";

const isDevMode = process.env.NODE_ENV === "development";

const sharedOptions = {
	clean: true, // clean up dist folder,
	dts: { newContext: true }, // generate d.ts, // generate d.ts
	entry: ["src/index.ts", "src/cli/index.ts"],
	format: ["esm"],
	platform: "node",
	sourcemap: !isDevMode,
	target: "esnext",
	treeshake: true,
	tsconfig: "tsconfig.json",
} satisfies Options;

const config = defineConfig({
	...sharedOptions,
	name: "ESM",
	outDir: "./dist",
});

export default config;
