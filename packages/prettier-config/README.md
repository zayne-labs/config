# @zayne-labs/prettier-config

Shared Prettier configuration used across Zayne Labs projects.

## Installation

```bash
pnpm add -D @zayne-labs/prettier-config
```

## Usage

The package exports two configurations:

- `baseConfig`: Basic Prettier configuration
- `configWithTailwind`: Extended configuration with Tailwind CSS support (includes plugins)

In your `.prettierrc.js` | `.prettierrc.mjs` | `prettier.config.js` | `prettier.config.mjs`:

```js
import { baseConfig } from '@zayne-labs/prettier-config';

// Use base config
export default baseConfig;

// You can extend the base config with additional options
export default {
  ...baseConfig,
  // Add your custom options here
};
```

```js
import { configWithTailwind } from '@zayne-labs/prettier-config';

// OR use Tailwind config
export default configWithTailwind;

// You can extend the Tailwind config with additional options
export default {
  ...configWithTailwind,
  // Add your custom options here
};
```

### Base Configuration

The base configuration includes:

```js
{
  experimentalOperatorPosition: "start",
  jsxSingleQuote: false,
  printWidth: 107,
  singleQuote: false,
  tabWidth: 3,
  trailingComma: "es5",
  useTabs: true
}
```

### Tailwind Configuration

The Tailwind configuration extends the base config and adds support for:

- Tailwind CSS class sorting
- Class merging utilities
- Custom attributes and functions for class management

## License

MIT © Zayne Labs
