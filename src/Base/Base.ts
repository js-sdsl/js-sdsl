export type ContainerIterator<T> = {
    pointer: T;
    readonly iteratorType: 'normal' | 'reverse';
    pre: () => ContainerIterator<T>;
    next: () => ContainerIterator<T>;
    equals: (obj: ContainerIterator<T>) => boolean;
};

export type BaseType = {
    size: () => number;
    empty: () => boolean;
    clear: () => void;
};

export type ContainerType<T> = {
    begin: () => ContainerIterator<T>;
    end: () => ContainerIterator<T>;
    rBegin: () => ContainerIterator<T>;
    rEnd: () => ContainerIterator<T>;
    front: () => T | undefined;
    back: () => T | undefined;
    forEach: (callback: (element: T, index: number) => void) => void;
    find: (element: T) => ContainerIterator<T>;
    getElementByPos: (pos: number) => T;
    eraseElementByPos: (pos: number) => void;
    eraseElementByValue: (value: T) => void;
    eraseElementByIterator: (iter: ContainerIterator<T>) => ContainerIterator<T>;
    [Symbol.iterator]: () => Generator<T, void, undefined>;
} & BaseType;

export type SequentialContainerType<T> = {
    pushBack: (element: T) => void;
    popBack: () => void;
    setElementByPos: (pos: number, element: T) => void;
    insert: (pos: number, element: T, num?: number) => void;
    reverse: () => void;
    unique: () => void;
    sort: (cmp?: (x: T, y: T) => number) => void;
} & ContainerType<T>;

export type Pair<T, K> = { key: T, value: K };
