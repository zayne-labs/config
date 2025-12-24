# @zayne-labs/prettier-config

Shared Prettier configuration for Zayne Labs projects, featuring a modular factory system with automatic plugin detection and refined sorting logic.

## Features

- **Modular Factory**: Easily toggle features like Tailwind, Astro, and Import Sorting.
- **Smart Import Sorting**: Distance-based sorting (URLs → Protocols → Packages → Aliases → Paths).
- **Tailwind CSS v4 Ready**: Support for `tailwindStylesheet` and advanced class sorting.
- **Auto-Installation**: Prompts to install missing plugins when needed.
- **Deduplicated Configs**: Merges arrays (plugins, overrides) intelligently without duplicates.

## Installation

```bash
pnpm add -D @zayne-labs/prettier-config
```

## Usage

The package exports a factory function `zayne` that combines disparate config segments.

```ts
// prettier.config.js
import { zayne } from "@zayne-labs/prettier-config";

export default zayne({
	base: true, // Enabled by default
	sortImports: true, // Enabled by default
	tailwindcss: true,
	astro: true,
	// ...more to come
});
```

### Options

The `zayne` factory accepts an options object as the first argument:

| Option        | Type                            | Default | Description                                    |
| ------------- | ------------------------------- | ------- | ---------------------------------------------- |
| `base`        | `boolean \| Config`             | `true`  | Opinionated base defaults.                     |
| `sortImports` | `boolean \| OptionsSortImports` | `true`  | Enables `@ianvs/prettier-plugin-sort-imports`. |
| `tailwindcss` | `boolean \| OptionsTailwindCss` | `false` | Enables Tailwind and ClassNames plugins.       |
| `astro`       | `boolean \| OptionsAstro`       | `false` | Enables `prettier-plugin-astro`.               |

### Default Import Sorting Rules

When `sortImports` is enabled (which it is by default), imports are organized by "distance" from the current file:

1. **User patterns**: Any custom patterns you pass via `importOrder` are prioritized at the top.
2. **URLs**: Remote modules (e.g., `https://esm.sh/...`).
3. **Protocols**: Built-ins and protocol imports (`node:`, `bun:`, `jsr:`, `npm:`).
4. **Packages**: Third-party modules (e.g., `react`, `lodash`).
5. **Aliases**: Local aliases like `@/`, `#`, `~`, `$`, `%`.
6. **Paths**: Relative and absolute file paths (excluding CSS).
7. **CSS**: Style files are always pushed to the absolute bottom.

### Tailwind & ClassNames Support

The Tailwind integration combines three plugins:

- `prettier-plugin-tailwindcss`: Sorts classes.
- `prettier-plugin-classnames`: Multi-line formatting & attribute support.
- `prettier-plugin-merge`: Ensures plugins work together.

**Configurable Options:**

- `customAttributes`: Additional attributes to sort classes in (e.g., `classNames`, `classes`).
- `customFunctions`: Functions to sort classes in (e.g., `cn`, `tv`, `tw`).
- `tailwindStylesheet`: Path to your CSS entry point (defaults to `./tailwind.css` for v4).
- `endPosition`: Criterion for ending class names (`absolute` or `relative`).
- `syntaxTransformation`: Auto-transform non-expression classes to expression syntax on wrap.

## Extending Configurations

The factory accepts any number of extra configuration objects as subsequent arguments:

```ts
import { zayne } from "@zayne-labs/prettier-config";

export default zayne(
	{
		tailwindcss: true,
	},
	// Extra config objects to merge
	{
		printWidth: 120,
		semi: true,
	}
);
```

## Plugin Auto-Installation

This config won't bloat your `node_modules` with plugins you don't use. When you enable a feature (like `astro` or `tailwindcss` for instance), it checks if the required plugins are installed.
If missing, it will prompt you in the terminal to auto-install them when you run `prettier --write .` cli command.

## License

MIT © [Zayne Labs](https://github.com/zayne-labs)
