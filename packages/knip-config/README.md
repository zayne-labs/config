# @zayne-labs/knip-config

Shared [Knip](https://knip.dev) configuration for Zayne Labs projects, built as a factory like `@zayne-labs/prettier-config`.

## Features

- **Fully typed**: Options (including `extend`) are typed from `knip`'s own `KnipConfiguration`, so they stay in sync with your installed Knip version.
- **Opinionated base**: Shared defaults across projects, toggleable and overridable.
- **Smart merging**: Arrays (`entry`, `ignoreDependencies`, ...) are concatenated, plain objects (`rules`, `ignoreIssues`, `workspaces`, ...) are shallowly merged, everything else is overwritten.

## Installation

```bash
pnpm add -D knip @zayne-labs/knip-config
```

## Usage

```ts
// knip.config.ts
import { zayne } from "@zayne-labs/knip-config";

export default zayne({
	base: true, // Enabled by default

	// Project-specific config, merged in last (optional)
	extend: {
		entry: ["src/main.ts"],
		ignoreDependencies: ["some-package"],
		rules: { duplicates: "warn" },
	},
});
```

Then run:

```bash
pnpm knip
```

### Options

| Option   | Type                            | Default | Description                                         |
| -------- | ------------------------------- | ------- | --------------------------------------------------- |
| `base`   | `boolean \| ResolvedKnipConfig` | `true`  | Opinionated base defaults. Pass an object to merge. |
| `extend` | `ResolvedKnipConfig`            | -       | Project-specific config, merged in last.            |

### Base defaults

```ts
const baseDefaults = {
	ignoreExportsUsedInFile: { interface: true, type: true },
};
```

### Notes

- Plugins (Vite, Next.js, Vitest, ESLint, Prettier, ...) are auto-detected by Knip, so most projects only need `entry`/`project` when the defaults don't fit.
- The optional peer plugins of `@zayne-labs/eslint-config` and `@zayne-labs/prettier-config` are not reported as unused: Knip treats peer dependencies of used packages as used.
- `zayne()` returns a plain config object (Knip does not accept a bare Promise as the default export).

## License

MIT © [Zayne Labs](https://github.com/zayne-labs)
