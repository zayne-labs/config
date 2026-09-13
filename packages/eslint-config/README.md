# @zayne-labs/eslint-config

[![npm](https://img.shields.io/npm/v/@zayne-labs/eslint-config?color=444&label=)](https://npmjs.com/package/@zayne-labs/eslint-config)

Opinionated ESLint config with sensible defaults and zero-config setup.

- One-line setup with reasonable defaults and best practices
- Works out-of-the-box with TypeScript, JSX, Vue, JSON, YAML, TOML, Markdown, and more
- [ESLint Flat config](https://eslint.org/docs/latest/use/configure/configuration-files-new) for easy composition
- Optional framework support: [Vue](#vue), [React](#react), [Astro](#astro), [Solid](#solid), and [Expo](#expo-react-native)
- First-class integrations for [Better Tailwind CSS](#better-tailwind-css), [TanStack](#tanstack), [pnpm catalogs](#pnpm-workspaces-and-catalogs), and dependency checks
- Respects `.gitignore` by default
- Highly [customizable](#customization) when you need it
- Requires ESLint v9.5.0+ and Node.js v20+
- Interactive CLI for easy setup

Inspired by [antfu/eslint-config](https://github.com/antfu/eslint-config)

## Usage

### Quick Setup (Recommended)

Use the interactive CLI to set up your config:

```bash
pnpx @zayne-labs/eslint-config@latest
```

The CLI will guide you through:

- Framework selection (React, Vue, Solid, Astro)
- Additional integrations (Better TailwindCSS, etc.)
- Automatic dependency installation

The wizard also supports non-interactive setup:

```bash
pnpx @zayne-labs/eslint-config@latest --yes --template react --extra tailwindcss-better
```

Run it in a project that does not already have an `eslint.config.*` file. Existing legacy ESLint files are left untouched and listed for manual review after migration.

### Manual Installation

```bash
pnpm add -D eslint @zayne-labs/eslint-config
```

Create `eslint.config.js` in your project root:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne();
```

Done! Check out [customization](#customization) for more options.

<details>
<summary>Combining with legacy config</summary>

If you have existing eslintrc configs, use [`@eslint/eslintrc`](https://www.npmjs.com/package/@eslint/eslintrc) to convert them:

```js
import { FlatCompat } from "@eslint/eslintrc";
import { zayne } from "@zayne-labs/eslint-config";

const compat = new FlatCompat();

export default zayne(
	{
		ignores: [],
	},
	...compat.config({
		extends: [
			"eslint:recommended",
			// Other extends...
		],
	})
	// Other flat configs...
);
```

Note: `.eslintignore` no longer works in flat config. Use the `ignores` option instead (see [customization](#customization)).

</details>

### Package Scripts

Add these scripts to your `package.json`:

```json
{
	"scripts": {
		"lint:eslint": "eslint .",
		"lint:eslint-fix": "eslint . --fix"
	}
}
```

## IDE Support

Configure your editor to auto-fix ESLint issues on save:

<details>
<summary>VS Code</summary>

Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and add to `.vscode/settings.json`:

```json
{
	// Auto fix
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": "explicit",
		"source.organizeImports": "never"
	},

	// Enable eslint for all supported languages
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		"typescript",
		"typescriptreact",
		"vue",
		"html",
		"markdown",
		"json",
		"jsonc",
		"yaml",
		"toml",
		"xml",
		"gql",
		"graphql",
		"astro",
		"css",
		"less",
		"scss",
		"pcss",
		"postcss"
	]
}
```

</details>

<details>
<summary>Neovim</summary>

Update your configuration:

```lua
local lspconfig = require('lspconfig')
-- Enable eslint for all supported languages
lspconfig.eslint.setup(
  {
    filetypes = {
      "javascript",
      "javascriptreact",
      "javascript.jsx",
      "typescript",
      "typescriptreact",
      "typescript.tsx",
      "vue",
      "html",
      "markdown",
      "json",
      "jsonc",
      "yaml",
      "toml",
      "xml",
      "gql",
      "graphql",
      "astro",
      "css",
      "less",
      "scss",
      "pcss",
      "postcss"
    },
  }
)
```

**Format on save options:**

- Use the built-in `EslintFixAll` command with an autocmd:

   ```lua
   lspconfig.eslint.setup({
     on_attach = function(client, bufnr)
       vim.api.nvim_create_autocmd("BufWritePre", {
         buffer = bufnr,
         command = "EslintFixAll",
       })
     end,
   })
   ```

- Or use [conform.nvim](https://github.com/stevearc/conform.nvim), [none-ls](https://github.com/nvimtools/none-ls.nvim), or [nvim-lint](https://github.com/mfussenegger/nvim-lint)

</details>

## Customization

This config works out of the box with zero configuration. Customize it when needed:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	// `.eslintignore` is no longer supported in Flat config, use `ignores` instead
	// The `ignores` option in the option (first argument) is specifically treated to always be global ignores
	// And will **extend** the config's default ignores, not override them
	// You can also pass a function to modify the default ignores
	ignores: [
		"**/fixtures",
		// ...globs
	],

	// Parse the `.gitignore` file to get the ignores, on by default
	gitignore: true,

	// Project type: "app" (default), "app-strict", "lib", or "lib-strict"
	type: "app",

	// Disable all optional configs at once (keeps only essentials)
	withDefaults: false,

	// Enable stylistic formatting rules
	stylistic: true,

	// Or customize the stylistic rules
	stylistic: {
		jsx: true,
		quotes: "single", // or 'double'
	},

	// TypeScript and React are auto-detected, but can be explicit
	typescript: true,
	react: true,

	// Disable specific language support
	jsonc: false,
	yaml: false,
});
```

### Configuration Reference

The factory accepts booleans for simple enable/disable cases and option objects when an integration needs files, rule overrides, or plugin-specific settings.

| Option                                                                                                                                     | Default        | Purpose                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------ | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| `type`                                                                                                                                     | `"app"`        | Selects `"app"`, `"app-strict"`, `"lib"`, or `"lib-strict"` rule behavior.                                       |
| `withDefaults`                                                                                                                             | `true`         | Controls the standard optional baseline without disabling essential JavaScript, ignore, JSX, or command support. |
| `gitignore`                                                                                                                                | `true`         | Reads the nearest `.gitignore`; accepts the underlying flat-gitignore options.                                   |
| `typescript`                                                                                                                               | Auto-detected  | Enables TypeScript rules and optional type-aware or erasable-syntax rules.                                       |
| `react`                                                                                                                                    | Auto-detected  | Enables the React integration when React is installed.                                                           |
| `pnpm`                                                                                                                                     | Auto-detected  | Enables workspace rules when a `pnpm-workspace.yaml` is found.                                                   |
| `baseline`, `comments`, `imports`, `jsdoc`, `jsonc`, `markdown`, `node`, `perfectionist`, `regexp`, `stylistic`, `toml`, `unicorn`, `yaml` | `withDefaults` | Controls the standard integrations; Baseline defaults to widely available JS/TS compatibility warnings.          |
| `astro`, `vue`, `solid`, `expo`                                                                                                            | `false`        | Enables framework-specific parsing and rules.                                                                    |
| `depend`, `tailwindcssBetter`, `tanstack`                                                                                                  | `false`        | Enables optional dependency, Tailwind CSS, and TanStack integrations.                                            |

Most integrations accept an `overrides` object. Integrations that apply to special file types also accept `files`. TypeScript, Baseline, and React provide separate type-aware file and override options, while Solid provides a separate `filesTypeAware` scope.

[Baseline JS](https://baselinejs.vercel.app/docs/config) automatically uses type-aware checks for TypeScript files when type-aware linting is active.

### Optional Dependencies

Optional framework and integration plugins are loaded only when their feature is enabled. In an interactive terminal outside CI, the config can offer to install a missing peer dependency. In CI and non-interactive environments, install the documented peers explicitly.

### Custom Rules

Pass additional configs as extra arguments:

```ts
import { zayne } from "@zayne-labs/eslint-config";

export default zayne(
	{
		// Configures for zayne's config
	},

	// From the second arguments they are ESLint Flat Configs
	// you can have multiple configs
	{
		files: ["**/*.ts"],
		rules: {
			"@typescript-eslint/no-explicit-any": "off",
		},
	},
	{
		rules: {
			"no-console": "warn",
		},
	}
);
```

Rules from an integration can also be overridden alongside that integration. This keeps the correct file scope and parser configuration:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	react: {
		overrides: {
			"react/no-array-index-key": "off",
		},
	},
	typescript: {
		overrides: {
			"ts-eslint/consistent-type-definitions": ["error", "type"],
		},
		overridesTypeAware: {
			"ts-eslint/no-unsafe-assignment": "warn",
		},
		tsconfigPath: true,
	},
});
```

### Plugin Renaming

Plugin prefixes are normalized by default so rule names stay stable if the underlying implementation package changes:

| Prefix                 | Original plugin prefix |
| ---------------------- | ---------------------- |
| `react/*`              | `@eslint-react/*`      |
| `nextjs/*`             | `@next/next/*`         |
| `stylistic/*`          | `@stylistic/*`         |
| `tanstack-query/*`     | `@tanstack/query/*`    |
| `tanstack-router/*`    | `@tanstack/router/*`   |
| `ts-eslint/*`          | `@typescript-eslint/*` |
| `tailwindcss-better/*` | `better-tailwindcss/*` |
| `import/*`             | `import-x/*`           |
| `node/*`               | `n/*`                  |

The factory also renames matching rule prefixes in custom configs. Set `autoRenamePlugins: false` to opt out, or use the returned composer's `renamePlugins()` method to define another mapping.

### Config Composer

`zayne()` returns a [`FlatConfigComposer`](https://github.com/antfu/eslint-flat-config-utils), so configurations can be inserted or overridden by their stable `zayne/*` names:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne()
	.prepend({
		ignores: ["**/generated/**"],
	})
	.override("zayne/stylistic/rules", {
		rules: {
			"stylistic/quotes": ["error", "single"],
		},
	});
```

### Advanced Composition

Import and compose fine-grained configs directly:

<details>
<summary>Show example</summary>

**Note**: This low-level approach is for advanced use cases only. The `zayne()` factory handles option coordination automatically, so use this only if you need granular control over config composition. Not necessarily recommended

```js
import {
	astro,
	baseline,
	command,
	comments,
	depend,
	expo,
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
	regexp,
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
} from "@zayne-labs/eslint-config";
import { FlatConfigComposer } from "eslint-flat-config-utils";

export default new FlatConfigComposer().append(
	ignores(),
	javascript(),
	command(),
	typescript(),
	jsx(),
	baseline(),
	comments(),
	node(),
	jsdoc(),
	imports(),
	unicorn(),
	perfectionist(),
	regexp(),
	stylistic(),
	react(),
	vue(),
	jsonc(),
	yaml(),
	toml(),
	markdown()
);
```

</details>

See [configs](https://github.com/zayne-labs/config/tree/main/packages/eslint-config/src/configs) and [factory](https://github.com/zayne-labs/config/blob/main/packages/eslint-config/src/factory.ts) for implementation details.

> Thanks to [antfu/eslint-config](https://github.com/antfu/eslint-config) for the inspiration and reference.

## Framework & Integration Support

Enable framework-specific linting rules and integrations:

### Vue

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	vue: true,
});
```

Vue 3 and custom SFC block processing are enabled by default. Vue 2 can be selected explicitly, accessibility rules are opt-in, and SFC block processing can be disabled when it is not needed:

```js
export default zayne({
	vue: {
		a11y: true,
		sfcBlocks: false,
		vueVersion: 2,
	},
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-vue vue-eslint-parser eslint-processor-vue-blocks
# When a11y is enabled:
pnpm i -D eslint-plugin-vuejs-accessibility
```

### React

Auto-detected in most cases, or enable explicitly:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	react: {
		compiler: true,
		nextjs: true,
		refresh: true,
		youMightNotNeedAnEffect: true,
	},
});
```

The base React integration, React Compiler checks, refresh rules, and effect guidance can each be configured or disabled independently. Next.js rules are enabled only through `react.nextjs`.

Install peer dependencies (prompted automatically when running ESLint):

```bash
pnpm i -D @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-react-you-might-not-need-an-effect
# When react.nextjs is enabled:
pnpm i -D @next/eslint-plugin-next
```

#### Next.js

Next.js is supported but must be enabled explicitly. Set `nextjs: true` inside the React integration:

```js
export default zayne({
	react: {
		nextjs: true,
	},
});
```

The integration combines the plugin's recommended and Core Web Vitals rules. Its refresh configuration also permits the standard Next.js route exports. Pass an object instead when custom `files` or `overrides` are needed.

### Astro

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	astro: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-astro astro-eslint-parser
```

### Solid

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	solid: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-solid
```

### JSX Accessibility

JSX syntax is enabled by default. Accessibility rules are opt-in and work independently of the React integration:

```js
export default zayne({
	jsx: {
		a11y: true,
	},
});
```

```bash
pnpm i -D eslint-plugin-jsx-a11y
```

### Better Tailwind CSS

Uses the enhanced `eslint-plugin-better-tailwindcss` for improved class sorting and validation:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	tailwindcssBetter: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-better-tailwindcss
```

### Expo (React Native)

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	expo: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-config-expo
```

### Node Security

Node rules are enabled by default. The additional `eslint-plugin-security` rules are opt-in:

```js
export default zayne({
	node: {
		security: true,
	},
});
```

### TanStack

Support for TanStack Query and Router:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	tanstack: {
		query: true,
		router: true,
	},
});
```

Install peer dependencies:

```bash
pnpm i -D @tanstack/eslint-plugin-query @tanstack/eslint-plugin-router
```

### PNPM Workspaces and Catalogs

pnpm support is auto-detected from the nearest `pnpm-workspace.yaml`. It can validate package and workspace manifests, require catalog usage, and sort workspace YAML entries:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	pnpm: {
		catalogs: true,
		json: true,
		sort: true,
		yaml: true,
	},
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-pnpm
```

### Dependency Management

Enforce dependency rules with `eslint-plugin-depend`:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	depend: true,
});
```

Install peer dependencies:

```bash
pnpm i -D eslint-plugin-depend
```

### Command Comments

[`eslint-plugin-command`](https://github.com/antfu/eslint-plugin-command) is always available for explicit, comment-driven transformations. Place a supported triple-slash command directly above the code and run ESLint with fixes:

```ts
/// to-for-of
items.forEach((item) => {
	console.log(item);
});
```

Commands are intended as temporary codemods; their trigger comments are removed with the transformation.

## Type-Aware Rules

Type-aware linting is automatically enabled when TypeScript is detected. It uses the nearest `tsconfig.json` by default.

Only specify `tsconfigPath` when you need to:

- Point to a tsconfig in a different location
- Use multiple tsconfigs

Single custom tsconfig location:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	typescript: {
		tsconfigPath: "./config/tsconfig.json",
	},
});
```

Multiple tsconfigs:

```js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	typescript: {
		tsconfigPath: ["./tsconfig.json", "./tsconfig.node.json"],
	},
});
```

Set `tsconfigPath: true` to use the nearest project automatically. Type-aware file globs and rules can be refined with `filesTypeAware`, `ignoresTypeAware`, and `overridesTypeAware`.

Projects targeting erasable TypeScript syntax can enable the corresponding optional rules:

```js
export default zayne({
	typescript: {
		erasableOnly: true,
	},
});
```

### Editor Specific Disables

Auto-fixing for the following rules are disabled when ESLint is running in a code editor:

- [`prefer-const`](https://eslint.org/docs/rules/prefer-const)
- [`pnpm/json-enforce-catalog`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules)
- [`pnpm/json-prefer-workspace-settings`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules)
- [`pnpm/json-valid-catalog`](https://github.com/antfu/pnpm-workspace-utils/tree/main/packages/eslint-plugin-pnpm#rules)

This prevents editor autosave from applying potentially disruptive fixes while code is being refactored. Full autofix behavior is restored when ESLint runs in the terminal or through [lint-staged](#lint-staged). If you don't want this behavior, disable editor detection explicitly:

```js
// eslint.config.js
import { zayne } from "@zayne-labs/eslint-config";

export default zayne({
	isInEditor: false,
});
```

### Lint Staged

To apply safe autofixes before each commit:

```json
{
	"lint-staged": {
		"*": "eslint --fix"
	}
}
```

When ESLint runs through lint-staged or a Git hook, terminal rule behavior is preserved instead of the editor-specific non-fixable mode.

## Inspecting Config

View active rules using the [ESLint Config Inspector](https://github.com/eslint/config-inspector):

```bash
npx @eslint/config-inspector@latest
```

## Versioning

Follows [Semantic Versioning](https://semver.org/) with config-specific considerations:

**Breaking changes:**

- Node.js version requirements
- Major refactors affecting setup
- Plugin updates with significant behavior changes
- Changes affecting most codebases

**Non-breaking changes:**

- Rule additions, removals, or option changes
- Dependency updates
- Stricter linting (considered improvements)

## FAQ

### I prefer different rules

Override any rules locally using the [customization](#customization) options. For extensive changes, consider forking the repo.

## Contributing

Contributions welcome! See our [contribution guidelines](https://github.com/zayne-labs/contribute) for details.

## License

MIT © Ryan Zayne

## Credits

Inspired by [antfu/eslint-config](https://github.com/antfu/eslint-config)
