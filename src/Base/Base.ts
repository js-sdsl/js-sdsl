export type BaseType = {
    size: () => number;
    empty: () => boolean;
    clear: () => void;
} & Record<string, never>;

export type SequentialContainerType<T> = {
    front: () => T | undefined;
    back: () => T | undefined;
    push_back: (element: T) => void;
    pop_back: () => void;
    forEach: (callback: (element: T, index: number) => void) => void;
    getElementByPos: (pos: number) => T;
    setElementByPos: (pos: number, element: T) => void;
    eraseElementByPos: (pos: number) => void;
    eraseElementByValue: (value: T) => void;
    insert: (pos: number, element: T, num?: number) => void;
    reverse: () => void;
    unique: () => void;
    sort: (cmp?: (x: T, y: T) => number) => void;
} & BaseType;
