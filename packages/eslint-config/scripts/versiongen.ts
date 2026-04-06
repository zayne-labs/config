import fsPromises from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parsePnpmWorkspaceYaml } from "pnpm-workspace-yaml";
import * as prettier from "prettier";
import { dependenciesMap } from "../src/cli/constants";

const dependencyNames = new Set(["eslint", ...Object.values(dependenciesMap).flat()]);

const workspaceFileURL = new URL("../../../pnpm-workspace.yaml", import.meta.url);

const workspaceYaml = parsePnpmWorkspaceYaml(await fsPromises.readFile(workspaceFileURL, "utf8")).toJSON();

const catalogs = Object.values({
	default: workspaceYaml.catalog ?? {},
	...workspaceYaml.catalogs,
});

const formatCode = async (content: string, filePath: string) => {
	const prettierConfig = await prettier.resolveConfig(filePath);

	return prettier.format(content, { ...prettierConfig, filepath: filePath });
};

const versionTuple = [...dependencyNames]
	.map((depName) => {
		const version = catalogs.map((catalog) => catalog[depName]).find(Boolean);

		if (!version) {
			throw new Error(`Package '${depName}' not found`);
		}

		return [depName, version] as const;
	})
	// eslint-disable-next-line unicorn/no-array-sort -- Ignore
	.sort((a, b) => a[0].localeCompare(b[0]));

const versions = Object.fromEntries(versionTuple);

const outputPath = fileURLToPath(new URL("../src/cli/constants-generated.ts", import.meta.url));

const content = `
import { defineEnum } from "@zayne-labs/toolkit-type-helpers";

export const versionsMap = defineEnum(${JSON.stringify(versions, null, 3)});
`;

await fsPromises.writeFile(outputPath, await formatCode(content, outputPath));
