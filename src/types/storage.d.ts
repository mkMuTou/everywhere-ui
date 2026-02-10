export declare function createStorage<
    T extends Record<string, unknown>,
>(): IStorage<T>;
export declare interface IStorage<T extends Record<string, unknown>> {
    get<Key extends keyof T>(key: Key): PromiseLike<T[Key]>;
    set<Res, Key extends keyof T>(key: Key, value: T[Key]): PromiseLike<Res>;
}
