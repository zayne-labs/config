export type PromItem<T> = {
	hint?: string;
	label: string;
	value: T;
};

export type FrameworkOptionUnion = "astro" | "react" | "solid" | "svelte" | "vue";

export type ExtraLibrariesOptionUnion = "tailwindcssBetter";

export type PromptResult = {
	extra: ExtraLibrariesOptionUnion[];
	frameworks: FrameworkOptionUnion[];
	uncommittedConfirmed: boolean;
	updateVscodeSettings: unknown;
};
