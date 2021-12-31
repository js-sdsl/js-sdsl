export type Iterator<T> = {
    value: T;
    pre: () => Iterator<T>;
    next: () => Iterator<T>;
    equals: (obj: Iterator<T>) => boolean;
}

export type MapIteratorType<T, K> = {
    key: T;
    value: K;
    pre: () => MapIteratorType<T, K>;
    next: () => MapIteratorType<T, K>;
    equals: (obj: MapIteratorType<T, K>) => boolean;
}

export type BaseType = {
    size: () => number;
    empty: () => boolean;
    clear: () => void;
} & Record<string, never>;

export type ContainerType<T> = {
    begin: () => Iterator<T>;
    end: () => Iterator<T>;
    rBegin: () => Iterator<T>;
    rEnd: () => Iterator<T>;
    front: () => T | undefined;
    back: () => T | undefined;
    forEach: (callback: (element: T, index: number) => void) => void;
    find: (element: T) => boolean;
    getElementByPos: (pos: number) => T;
    eraseElementByPos: (pos: number) => void;
    eraseElementByValue: (value: T) => void;
    [Symbol.iterator]: () => Generator<T, void, undefined>;
} & BaseType;

export type SequentialContainerType<T> = {
    forEach: (callback: (element: T, index: number) => void) => void;
    pushBack: (element: T) => void;
    popBack: () => void;
    setElementByPos: (pos: number, element: T) => void;
    insert: (pos: number, element: T, num?: number) => void;
    reverse: () => void;
    unique: () => void;
    sort: (cmp?: (x: T, y: T) => number) => void;
} & ContainerType<T>;

export type Pair<T, K> = { key: T, value: K };
