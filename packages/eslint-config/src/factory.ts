import { assert } from "@zayne-labs/toolkit-type-helpers";
import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import { isPackageExists } from "local-pkg";
import {
	astro,
	comments,
	depend,
	expo,
	gitIgnores,
	ignores,
	imports,
	javascript,
	jsdoc,
	jsonc,
	jsx,
	markdown,
	node,
	perfectionist,
	pnpm,
	react,
	solid,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	tailwindcssBetter,
	tanstack,
	toml,
	typescript,
	unicorn,
	vue,
	yaml,
} from "./configs";
import { defaultPluginRenameMap } from "./constants";
import type { Awaitable, ConfigNames, OptionsConfig, Prettify, TypedFlatConfigItem } from "./types";
import { isObject, resolveOptions } from "./utils";

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
	...userConfigs: Array<
		Awaitable<FlatConfigComposer | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]>
	>
	// eslint-disable-next-line complexity -- Ignore
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> => {
	const {
		autoRenamePlugins = true,
		componentExts = [],
		componentExtsTypeAware = [],
		ignores: userIgnores,
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
	const enablePnpmCatalogs = restOfOptions.pnpm;
	const enableJsonc = restOfOptions.jsonc ?? withDefaults;
	const enableNode = restOfOptions.node ?? withDefaults;
	const enablePerfectionist = restOfOptions.perfectionist ?? withDefaults;
	const enableReact =
		restOfOptions.react ?? (withDefaults && ReactPackages.some((pkg) => isPackageExists(pkg)));
	const enableStylistic = restOfOptions.stylistic ?? withDefaults;
	const enableToml = restOfOptions.toml ?? withDefaults;
	const enableTypeScript = restOfOptions.typescript ?? (withDefaults && isPackageExists("typescript"));
	const enableUnicorn = restOfOptions.unicorn ?? withDefaults;
	const enableYaml = restOfOptions.yaml ?? withDefaults;
	const enableMarkdown = restOfOptions.markdown ?? withDefaults;

	const isStylistic = Boolean(enableStylistic);

	const tsconfigPath =
		isObject(enableTypeScript) && "tsconfigPath" in enableTypeScript ? enableTypeScript.tsconfigPath
			// eslint-disable-next-line unicorn/no-nested-ternary -- Allow
		: enableTypeScript === true ? enableTypeScript
		: null;

	const isTypeAware = Boolean(tsconfigPath);

	const configs: Array<Awaitable<TypedFlatConfigItem[]>> = [
		// == Base configs
		ignores(userIgnores),
		javascript(restOfOptions.javascript),
	];

	if (enableGitignore) {
		configs.push(gitIgnores(resolveOptions(enableGitignore)));
	}

	// == Other configs
	if (enableJsx) {
		configs.push(jsx(resolveOptions(enableJsx)));
	}

	if (restOfOptions.vue) {
		componentExts.push("vue");

		(resolveOptions(restOfOptions.vue).typescript ?? isTypeAware) && componentExtsTypeAware.push("vue");
	}

	if (restOfOptions.astro) {
		componentExts.push("astro");

		(resolveOptions(restOfOptions.astro).typescript ?? isTypeAware)
			&& componentExtsTypeAware.push("astro");
	}

	if (enableTypeScript) {
		configs.push(
			typescript({
				componentExts,
				componentExtsTypeAware,
				isTypeAware,
				stylistic: isStylistic,
				...resolveOptions(enableTypeScript),
				tsconfigPath,
			})
		);
	}

	if (enableStylistic) {
		configs.push(stylistic({ jsx: Boolean(enableJsx), ...resolveOptions(enableStylistic) }));
	}

	if (enableComments) {
		configs.push(comments({ type, ...resolveOptions(enableComments) }));
	}

	if (enableImports) {
		configs.push(
			imports({ stylistic: isStylistic, typescript: isTypeAware, ...resolveOptions(enableImports) })
		);
	}

	if (enablePnpmCatalogs) {
		configs.push(pnpm(resolveOptions(enablePnpmCatalogs)));
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

	if (enableJsonc) {
		configs.push(
			jsonc({ stylistic: isStylistic, ...resolveOptions(enableJsonc) }),
			sortPackageJson(),
			sortTsconfig()
		);
	}

	if (enableJsdoc) {
		configs.push(jsdoc({ stylistic: isStylistic, ...resolveOptions(enableJsdoc) }));
	}

	if (enableToml) {
		configs.push(toml({ stylistic: isStylistic, ...resolveOptions(enableToml) }));
	}

	if (enableYaml) {
		configs.push(yaml({ stylistic: isStylistic, ...resolveOptions(enableYaml) }));
	}

	if (enableMarkdown) {
		configs.push(markdown({ componentExts, ...resolveOptions(enableMarkdown) }));
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

	if (restOfOptions.astro) {
		configs.push(astro({ typescript: isTypeAware, ...resolveOptions(restOfOptions.astro) }));
	}

	if (restOfOptions.expo) {
		configs.push(expo(resolveOptions(restOfOptions.expo)));
	}

	if (restOfOptions.tailwindcssBetter) {
		configs.push(tailwindcssBetter(resolveOptions(restOfOptions.tailwindcssBetter)));
	}

	if (restOfOptions.tanstack) {
		configs.push(tanstack(resolveOptions(restOfOptions.tanstack)));
	}

	if (restOfOptions.depend) {
		configs.push(depend(resolveOptions(restOfOptions.depend)));
	}

	assert(
		!("files" in restOfOptions),
		`[@zayne-labs/eslint-config]: The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second config array instead.`
	);

	const composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>()
		.append(...configs, ...(userConfigs as TypedFlatConfigItem[]))
		.renamePlugins(autoRenamePlugins ? defaultPluginRenameMap : {});

	return composer;
};
