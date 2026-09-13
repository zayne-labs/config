/* eslint-disable ts-eslint/no-unsafe-enum-comparison -- Ignore, I don't want the enum to be bundled */
/* eslint-disable unicorn/consistent-function-scoping -- Ignore */
import eslintReactKit, { type RuleFunction } from "@eslint-react/kit";
import type { ESLintUtils } from "@typescript-eslint/utils";
import { stringifyJsx } from "./utils";

type OptionsShortHand = readonly ["always" | "never" | null];

type MessageID = "default";
type RuleWithMetaAndName = Omit<ESLintUtils.RuleWithMetaAndName<OptionsShortHand, MessageID>, "create">;

const jsxShorthandBoolean = (): RuleFunction => (context) => {
	const policy: NonNullable<OptionsShortHand[0]> = (context.options[0] as OptionsShortHand[0]) ?? "never";

	return {
		JSXAttribute: (node) => {
			const { value } = node;
			const propName = stringifyJsx(node.name);

			switch (true) {
				case policy === "always"
					&& value?.type === "JSXExpressionContainer"
					&& value.expression.type === "Literal"
					&& value.expression.value === true: {
					context.report({
						data: {
							message: `Omit attribute value for '${propName}'.`,
						},
						fix: (fixer) => fixer.removeRange([node.name.range[1], value.range[1]]),
						messageId: "default",
						node,
					});

					break;
				}
				case policy === "never" && value == null: {
					context.report({
						data: {
							message: `Set attribute value for '${propName}'.`,
						},
						fix: (fixer) => fixer.insertTextAfter(node.name, "={true}"),
						messageId: "default",
						node: node.value ?? node,
					});

					break;
				}

				default: {
					break;
				}
			}
		},
	};
};

const jsxShorthandBooleanMeta = {
	meta: {
		defaultOptions: ["never"],
		docs: {
			description:
				"Enforces whether to use shorthand syntax for boolean attributes (e.g., 'disabled') or not",
		},
		fixable: "code",
		hasSuggestions: true,
		messages: {
			default: "{{message}}",
		},
		schema: [
			{
				enum: ["always", "never"],
				type: "string",
			},
		],
		type: "suggestion",
	},
	name: "jsx-shorthand-boolean",
} as const satisfies RuleWithMetaAndName;

const jsxShorthandFragment = (): RuleFunction => (context, toolkit) => {
	const policy: NonNullable<OptionsShortHand[0]> =
		(context.options[0] as OptionsShortHand[0]) ?? "always";

	switch (policy) {
		case "always": {
			return {
				JSXElement: (node) => {
					if (node.openingElement.attributes.length > 0) return;

					const isFragment = toolkit.is.API("Fragment")(node.openingElement.name);

					if (!isFragment) return;

					context.report({
						data: {
							message: "Use fragment shorthand syntax instead of 'Fragment' component.",
						},
						fix: (fixer) => {
							if (node.closingElement == null) {
								return [];
							}

							return [
								fixer.replaceTextRange(
									[node.openingElement.range[0], node.openingElement.range[1]],
									"<"
								),
								fixer.replaceTextRange(
									[node.closingElement.range[0], node.closingElement.range[1]],
									"</>"
								),
							];
						},
						messageId: "default",
						node,
					});
				},
			};
		}
		case "never": {
			return {
				JSXFragment: (node) => {
					context.report({
						data: {
							message: "Use 'Fragment' component instead of fragment shorthand syntax.",
						},
						fix: (fixer) => {
							return [
								fixer.replaceTextRange(
									[node.openingFragment.range[0], node.openingFragment.range[1]],
									`<Fragment>`
								),
								fixer.replaceTextRange(
									[node.closingFragment.range[0], node.closingFragment.range[1]],
									`</Fragment>`
								),
							];
						},
						messageId: "default",
						node,
					});
				},
			};
		}
		default: {
			return {};
		}
	}
};

const jsxShorthandFragmentMeta = {
	meta: {
		...jsxShorthandBooleanMeta.meta,
		defaultOptions: ["always"],
		docs: {
			description: "Enforces whether to use fragment shorthand syntax (<>...</>) or not",
		},
	},
	name: "jsx-shorthand-fragment",
} as const satisfies RuleWithMetaAndName;

const RuleMetaArray = [jsxShorthandBooleanMeta, jsxShorthandFragmentMeta];

export const getCustomJsxPlugin = () => {
	const plugin = eslintReactKit().use(jsxShorthandBoolean).use(jsxShorthandFragment).getPlugin();

	for (const ruleMeta of RuleMetaArray) {
		const rule = plugin.rules?.[ruleMeta.name];

		rule?.meta && Object.assign(rule.meta, ruleMeta.meta);
	}

	return plugin;
};
