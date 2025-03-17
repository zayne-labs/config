import { isObject, resolveOptions } from "@/utils";
import { assert } from "@zayne-labs/toolkit-type-helpers";
import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import {
	comments,
	gitIgnores,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	node,
	perfectionist,
	react,
	solid,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	tailwindcss,
	tanstack,
	toml,
	typescript,
	unicorn,
	vue,
	yaml,
} from "./configs";
import { jsx } from "./configs/jsx";
import { defaultPluginRenameMap } from "./constants";
import type { Awaitable, ConfigNames, OptionsConfig, Prettify, TypedFlatConfigItem } from "./types";

const ReactPackages = ["react", "react-dom"];

/**
 * @description Construct an array of ESLint flat config items.
 * @param options
 *  The options for generating the ESLint configurations.
 * @param userConfigs
 *  The extra user configurations to be merged with the generated configurations.
 * @returns
 *  The merged ESLint configurations.
 */
export const zayne = (
	options: OptionsConfig & Prettify<Pick<TypedFlatConfigItem, "ignores">> = {},
	userConfigs: Array<
		Awaitable<FlatConfigComposer | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]>
	> = []
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> => {
	const {
		autoRenamePlugins = true,
		componentExts = [],
		componentExtsTypeAware = [],
		type = "app",
		withDefaults = true,
		...restOfOptions
	} = options;

	// == These configs are too needful to be turned off with a single switch, plus won't harm things much
	const enableGitignore = restOfOptions.gitignore ?? true;
	const enableJsx = restOfOptions.jsx ?? true;

	// == These ones won't matter if they are all turned off at once
	const enableComments = restOfOptions.comments ?? withDefaults;
	const enableImports = restOfOptions.imports ?? withDefaults;
	const enableJsdoc = restOfOptions.jsdoc ?? withDefaults;
	const enableJsonc = restOfOptions.jsonc ?? withDefaults;
	const enableNode = restOfOptions.node ?? withDefaults;
	const enablePerfectionist = restOfOptions.perfectionist ?? withDefaults;
	// prettier-ignore
	const enableReact = restOfOptions.react ?? (withDefaults && ReactPackages.some((pkg) => isPackageExists(pkg)));
	const enableStylistic = restOfOptions.stylistic ?? withDefaults;
	const enableToml = restOfOptions.toml ?? withDefaults;
	const enableTypeScript = restOfOptions.typescript ?? (withDefaults && isPackageExists("typescript"));
	const enableUnicorn = restOfOptions.unicorn ?? withDefaults;
	const enableYaml = restOfOptions.yaml ?? withDefaults;

	const isStylistic = Boolean(enableStylistic);

	const tsconfigPath =
		isObject(enableTypeScript) && "tsconfigPath" in enableTypeScript
			? enableTypeScript.tsconfigPath
			: null;

	const isTypeAware = Boolean(tsconfigPath);

	const configs: Array<Awaitable<TypedFlatConfigItem[]>> = [];

	// == Base configs
	configs.push(ignores(restOfOptions.ignores), javascript(restOfOptions.javascript));

	if (enableJsx) {
		configs.push(jsx());
	}

	if (enableStylistic) {
		configs.push(stylistic({ jsx: enableJsx, ...resolveOptions(enableStylistic) }));
	}

	if (enableComments) {
		configs.push(comments({ type, ...resolveOptions(enableComments) }));
	}

	if (enableGitignore) {
		configs.push(gitIgnores(resolveOptions(enableGitignore)));
	}

	if (enableImports) {
		configs.push(
			imports({ stylistic: isStylistic, typescript: isTypeAware, ...resolveOptions(enableImports) })
		);
	}

	if (enableNode) {
		configs.push(node({ type, ...resolveOptions(enableNode) }));
	}

	if (enablePerfectionist) {
		configs.push(perfectionist(resolveOptions(enablePerfectionist)));
	}

	if (enableUnicorn) {
		configs.push(unicorn({ type, ...resolveOptions(enableUnicorn) }));
	}

	if (enableJsdoc) {
		configs.push(jsdoc({ stylistic: isStylistic, ...resolveOptions(enableJsdoc) }));
	}

	if (enableJsonc) {
		configs.push(
			jsonc({ stylistic: isStylistic, ...resolveOptions(enableJsonc) }),
			sortPackageJson(),
			sortTsconfig()
		);
	}

	if (restOfOptions.vue) {
		componentExts.push("vue");
		componentExtsTypeAware.push("vue");
	}

	if (enableTypeScript) {
		configs.push(
			typescript({
				componentExts,
				componentExtsTypeAware,
				stylistic: isStylistic,
				...resolveOptions(enableTypeScript),
			})
		);
	}

	if (restOfOptions.tailwindcss) {
		configs.push(tailwindcss(resolveOptions(restOfOptions.tailwindcss)));
	}

	if (restOfOptions.tanstack) {
		configs.push(tanstack(resolveOptions(restOfOptions.tanstack)));
	}

	if (enableToml) {
		configs.push(
			toml({
				stylistic: isStylistic,
				...resolveOptions(enableToml),
			})
		);
	}

	if (enableYaml) {
		configs.push(
			yaml({
				stylistic: isStylistic,
				...resolveOptions(enableYaml),
			})
		);
	}

	if (enableReact) {
		configs.push(react({ typescript: isTypeAware, ...resolveOptions(enableReact) }));
	}

	if (restOfOptions.vue) {
		configs.push(
			vue({ stylistic: isStylistic, typescript: isTypeAware, ...resolveOptions(restOfOptions.vue) })
		);
	}

	if (restOfOptions.solid) {
		configs.push(solid({ typescript: isTypeAware, ...resolveOptions(restOfOptions.solid) }));
	}

	assert(
		!("files" in restOfOptions),
		`[@zayne-labs/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second config array instead.`
	);

	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

	composer = composer.append(...configs, ...(userConfigs as never[]));

	if (autoRenamePlugins) {
		composer = composer.renamePlugins(defaultPluginRenameMap);
	}

	return composer;
};
