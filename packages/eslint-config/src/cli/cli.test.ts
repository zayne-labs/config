import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, expect, test } from "vitest";

const CLI_PATH = fileURLToPath(new URL("../../bin/index.js", import.meta.url));
const fixturePaths = new Set<string>();

const createFixture = async (packageJson: Record<string, unknown> = {}) => {
	const fixturePath = await fs.mkdtemp(path.join(os.tmpdir(), "zayne-eslint-config-cli-"));
	fixturePaths.add(fixturePath);

	await fs.writeFile(path.join(fixturePath, "package.json"), JSON.stringify(packageJson, null, 2));

	return fixturePath;
};

const runCli = (fixturePath: string, args: string[] = []) => {
	return spawnSync(process.execPath, [CLI_PATH, ...args], {
		cwd: fixturePath,
		encoding: "utf8",
		env: {
			...process.env,
			NO_COLOR: "1",
			SKIP_PROMPT: "1",
		},
	});
};

afterEach(async () => {
	await Promise.all(
		[...fixturePaths].map((fixturePath) => fs.rm(fixturePath, { force: true, recursive: true }))
	);
	fixturePaths.clear();
});

test("enables Better Tailwind when the extra is selected", async () => {
	const fixturePath = await createFixture({ type: "module" });
	const result = runCli(fixturePath, ["--yes", "--extra", "tailwindcss-better"]);
	const eslintConfig = await fs.readFile(path.join(fixturePath, "eslint.config.js"), "utf8");
	const packageJson = JSON.parse(await fs.readFile(path.join(fixturePath, "package.json"), "utf8")) as {
		devDependencies: Record<string, string>;
	};

	expect(result.status, result.stderr).toBe(0);
	expect(eslintConfig).toContain("tailwindcssBetter: true");
	expect(packageJson.devDependencies["eslint-plugin-better-tailwindcss"]).toBeDefined();
});

test("rejects unknown non-interactive options before changing files", async () => {
	const fixturePath = await createFixture();
	const result = runCli(fixturePath, ["--yes", "--extra", "tailwindcss"]);
	const packageJson = JSON.parse(await fs.readFile(path.join(fixturePath, "package.json"), "utf8"));

	expect(result.status).toBe(1);
	expect(result.stdout).toContain("Invalid CLI options");
	expect(packageJson).toEqual({});
	await expect(fs.access(path.join(fixturePath, "eslint.config.mjs"))).rejects.toThrow();
});

test("does not overwrite an existing flat config", async () => {
	const fixturePath = await createFixture();
	await fs.writeFile(path.join(fixturePath, "eslint.config.mjs"), "export default []\n");

	const result = runCli(fixturePath, ["--yes"]);
	const packageJson = JSON.parse(await fs.readFile(path.join(fixturePath, "package.json"), "utf8"));

	expect(result.status).toBe(1);
	expect(result.stdout).toContain("eslint.config.mjs already exists");
	expect(packageJson).toEqual({});
});

test("reports legacy ESLint files and configures VS Code", async () => {
	const fixturePath = await createFixture();
	await fs.writeFile(path.join(fixturePath, ".eslintrc.json"), "{}");

	const result = runCli(fixturePath, ["--yes"]);
	const vscodeSettings = await fs.readFile(path.join(fixturePath, ".vscode", "settings.json"), "utf8");

	expect(result.status, result.stderr).toBe(0);
	expect(result.stdout).toContain("remove those files manually");
	expect(result.stdout).toContain(".eslintrc.json");
	expect(vscodeSettings).toContain('"source.fixAll.eslint": "explicit"');
	expect(vscodeSettings).toContain('"source.organizeImports": "never"');
	expect(vscodeSettings).toContain('"pcss"');
});
