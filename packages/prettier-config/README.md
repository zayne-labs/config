# @zayne-labs/prettier-config

Shared Prettier configuration for Zayne Labs projects.

## Installation

```bash
pnpm add -D @zayne-labs/prettier-config
```

## Usage

The package exports three configurations:

### Base Config

Basic Prettier configuration without any plugins.

```js
import { baseConfig } from "@zayne-labs/prettier-config";

export default baseConfig;
```

**Configuration in `baseConfig`:**

```js
export default {
	experimentalOperatorPosition: "start",
	experimentalTernaries: true,
	jsxSingleQuote: false,
	printWidth: 107,
	singleQuote: false,
	tabWidth: 3,
	trailingComma: "es5",
	useTabs: true,
};
```

### Tailwind Config

Extended base configuration with Tailwind CSS support. Includes plugins for class sorting, merging, and formatting.

```js
import { configWithTailwind } from "@zayne-labs/prettier-config";

export default configWithTailwind;
```

**Plugins included:**

- `prettier-plugin-tailwindcss` - Sorts Tailwind classes
- `prettier-plugin-classnames` - Formats className strings
- `prettier-plugin-merge` - Merges plugin functionality

**Default settings:**

- Custom attributes: `classNames`, `classes`
- Custom functions: `cnMerge`, `cnJoin`, `cn`, `tv`, `tw`
- Tailwind stylesheet: `./tailwind.css`

**Note:** You'll need to install the plugins separately:

```bash
pnpm add -D prettier-plugin-tailwindcss prettier-plugin-classnames prettier-plugin-merge
```

### Astro Config

Extended base configuration with Astro support.

```js
import { configWithAstro } from "@zayne-labs/prettier-config";

export default configWithAstro;
```

**Note:** You'll need to install the plugin separately:

```bash
pnpm add -D prettier-plugin-astro
```

## Extending Configurations

You can extend any configuration with your own options:

```js
import { baseConfig } from "@zayne-labs/prettier-config";

export default {
	...baseConfig,
	printWidth: 120,
	semi: true,
};
```

## License

MIT © Zayne Labs
