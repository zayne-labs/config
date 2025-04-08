import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import * as p from "@clack/prompts";
import c from "ansis";
import { version } from "../../../package.json";
import { dependenciesMap } from "../constants";
import { versionsMap } from "../constants-generated";
import type { PromptResult } from "../types";

export async function updatePackageJson(result: PromptResult): Promise<void> {
	const cwd = process.cwd();

	const pathPackageJSON = path.join(cwd, "package.json");

	p.log.step(c.cyan`Bumping @zayne-labs/eslint-config to v${version}`);

	const pkgContent = await fsp.readFile(pathPackageJSON, "utf8");
	const pkg = JSON.parse(pkgContent) as Record<string, Record<string, string | undefined> | undefined>;

	pkg.devDependencies ??= {};
	pkg.devDependencies["@zayne-labs/eslint-config"] = `^${version}`;
	pkg.devDependencies.eslint ??= versionsMap.eslint;

	const addedPackages: string[] = [];

	for (const framework of result.frameworks) {
		const deps = dependenciesMap[framework];

		// eslint-disable-next-line ts-eslint/no-unnecessary-condition -- Allow
		if (!deps) continue;

		deps.forEach((f) => {
			// eslint-disable-next-line ts-eslint/no-non-null-assertion -- Allow
			pkg.devDependencies![f] = versionsMap[f as keyof typeof versionsMap];
			addedPackages.push(f);
		});
	}

	if (addedPackages.length > 0) {
		p.note(c.dim(addedPackages.join(", ")), "Added packages");
	}

	await fsp.writeFile(pathPackageJSON, JSON.stringify(pkg, null, 2));

	p.log.success(c.green`Changes wrote to package.json`);
}
