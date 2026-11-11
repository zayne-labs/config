import { isObject } from "@zayne-labs/toolkit-type-helpers";

/**
 * @description Resolves a boolean or object option to an object.
 * If the option is an object, it returns it as-is. Otherwise, returns an empty object.
 */
export const resolveOptions = <TObject>(option: boolean | TObject | undefined) => {
	return isObject(option) ? option : ({} as TObject);
};
