export type Awaitable<T> = Promise<T> | T;

export type ExtractOptions<TUnion> = Extract<TUnion, object>;

export type Prettify<TObject> = NonNullable<unknown> & { [Key in keyof TObject]: TObject[Key] };
