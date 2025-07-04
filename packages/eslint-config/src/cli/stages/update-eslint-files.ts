/* eslint-disable max-depth  -- Allow */
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import * as p from "@clack/prompts";
import c from "ansis";
// @ts-expect-error missing types
import parse from "parse-gitignore";
import type { PromptResult } from "../types";
import { getEslintConfigContent } from "../utils";

export async function updateEslintFiles(result: PromptResult): Promise<void> {
	const cwd = process.cwd();
	const pathESLintIgnore = path.join(cwd, ".eslintignore");
	const pathPackageJSON = path.join(cwd, "package.json");

	const pkgContent = await fsp.readFile(pathPackageJSON, "utf8");
	const pkg = JSON.parse(pkgContent) as Record<string, unknown>;

	const configFileName = pkg.type === "module" ? "eslint.config.js" : "eslint.config.mjs";
	const pathFlatConfig = path.join(cwd, configFileName);

	const eslintIgnores: string[] = [];

	if (fs.existsSync(pathESLintIgnore)) {
		p.log.step(c.cyan`Migrating existing .eslintignore`);
		const content = await fsp.readFile(pathESLintIgnore, "utf8");
		const parsed = parse(content);
		const globs = parsed.globs();

		for (const glob of globs) {
			if (glob.type === "ignore") {
				eslintIgnores.push(...(glob.patterns as string[]));
			}

			if (glob.type === "unignore") {
				eslintIgnores.push(...(glob.patterns.map((pattern: string) => `!${pattern}`) as string[]));
			}
		}
	}

	const configLines: string[] = [];

	if (eslintIgnores.length > 0) {
		configLines.push(`ignores: ${JSON.stringify(eslintIgnores)},`);
	}

	for (const framework of result.frameworks) {
		configLines.push(`${framework}: true,`);
	}

	const mainConfig = configLines.map((line) => `  ${line}`).join("\n");

	const additionalConfig: string[] = [];

	const eslintConfigContent: string = getEslintConfigContent(mainConfig, additionalConfig);

	await fsp.writeFile(pathFlatConfig, eslintConfigContent);

	p.log.success(c.green`Created ${configFileName}`);
}
