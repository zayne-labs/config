/* eslint-disable ts-eslint/no-unsafe-enum-comparison -- Ignore, I don't want the enum to be bundled */
import type { TSESTree } from "@typescript-eslint/types";

export const stringifyJsx = (
	node:
		| TSESTree.JSXClosingElement
		| TSESTree.JSXClosingFragment
		| TSESTree.JSXIdentifier
		| TSESTree.JSXMemberExpression
		| TSESTree.JSXNamespacedName
		| TSESTree.JSXOpeningElement
		| TSESTree.JSXOpeningFragment
		| TSESTree.JSXText
): string => {
	switch (node.type) {
		case "JSXClosingElement": {
			// Closing tags like "</div>"
			return `</${stringifyJsx(node.name)}>`;
		}
		case "JSXClosingFragment": {
			// Fragment closing syntax "</>"
			return "</>";
		}
		case "JSXIdentifier": {
			// Simple element names like "div" or component names like "Button"
			return node.name;
		}
		case "JSXMemberExpression": {
			// Dot-notation components like "React.Fragment" or "Namespace.Component"
			return `${stringifyJsx(node.object)}.${stringifyJsx(node.property)}`;
		}
		case "JSXNamespacedName": {
			// XML-style namespaced elements like "svg:path"
			return `${node.namespace.name}:${node.name.name}`;
		}
		case "JSXOpeningElement": {
			// Opening tags like "<div>"
			return `<${stringifyJsx(node.name)}>`;
		}
		case "JSXOpeningFragment": {
			// Fragment opening syntax "<>"
			return "<>";
		}
		case "JSXText": {
			// Text content inside JSX
			return node.value;
		}
		default: {
			return "";
		}
	}
};
