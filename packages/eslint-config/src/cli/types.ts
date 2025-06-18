export type PromItem<T> = {
	hint?: string;
	label: string;
	value: T;
};

export type FrameworkOption = "astro" | "react" | "solid" | "svelte" | "vue";

export type ExtraLibrariesOption = "tailwindcss";

export type PromptResult = {
	extra: ExtraLibrariesOption[];
	frameworks: FrameworkOption[];
	uncommittedConfirmed: boolean;
	updateVscodeSettings: unknown;
};
