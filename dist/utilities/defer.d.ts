export type DeferredPromise<ValueType> = {
    promise: Promise<ValueType>;
    reject: (error: unknown) => void;
    resolve: (value: ValueType) => void;
};
export declare const defer: <T>() => DeferredPromise<T>;
//# sourceMappingURL=defer.d.ts.map