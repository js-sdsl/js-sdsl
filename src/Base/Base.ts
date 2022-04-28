export interface ContainerIterator<T> {
    /**
     * Pointers to element.
     */
    pointer: T;
    /**
     * Tag iterator type (normal or reverse).
     */
    readonly iteratorType: 'normal' | 'reverse';
    /**
     * @return Previous iterator.
     */
    pre: () => ContainerIterator<T>;
    /**
     * @return Next iterator.
     */
    next: () => ContainerIterator<T>;
    /**
     * @param obj The other iterator you want to compare.
     * @return If this equals to obj.
     */
    equals: (obj: ContainerIterator<T>) => boolean;
}

export interface BaseType {
    /**
     * @return The size of the container.
     */
    size: () => number;
    /**
     * @return Is the container empty.
     */
    empty: () => boolean;
    /**
     * Clear the container.
     */
    clear: () => void;
}

export interface ContainerType<T> extends BaseType {
    /**
     * @return Iterator pointing to the begin element.
     */
    begin: () => ContainerIterator<T>;
    /**
     * @return Iterator pointing to the super end like c++.
     */
    end: () => ContainerIterator<T>;
    /**
     * @return Iterator pointing to the end element.
     */
    rBegin: () => ContainerIterator<T>;
    /**
     * @return Iterator pointing to the super begin like c++.
     */
    rEnd: () => ContainerIterator<T>;
    /**
     * @return The first element.
     */
    front: () => T | undefined;
    /**
     * @return The last element.
     */
    back: () => T | undefined;
    forEach: (callback: (element: T, index: number) => void) => void;
    /**
     * @param element The element you want to find.
     * @return Iterator pointing to the element if found, or super end if not found.
     */
    find: (element: T) => ContainerIterator<T>;
    /**
     * Gets the value of the element at the specified position.
     */
    getElementByPos: (pos: number) => T;
    /**
     * Removes the element at the specified position.
     */
    eraseElementByPos: (pos: number) => void;
    /**
     * Removes the elements of the specified value.
     */
    eraseElementByValue: (value: T) => void;
    /**
     * Removes elements by iterator.
     */
    eraseElementByIterator: (iter: ContainerIterator<T>) => ContainerIterator<T>;
    /**
     * Using for 'for...of' syntax like Array.
     */
    [Symbol.iterator]: () => Generator<T, void, undefined>;
}

export interface SequentialContainerType<T> extends ContainerType<T> {
    /**
     * Push the element to the back.
     */
    pushBack: (element: T) => void;
    /**
     * Removes the last element.
     */
    popBack: () => void;
    /**
     * Sets element by position.
     */
    setElementByPos: (pos: number, element: T) => void;
    /**
     * @param pos The position you want to insert.
     * @param element The element you want to insert.
     * @param num The number of elements you want to insert.
     * Insert several elements after the specified position.
     */
    insert: (pos: number, element: T, num?: number) => void;
    /**
     * Reverses the container.
     */
    reverse: () => void;
    /**
     * Removes the duplication of elements in the container.
     */
    unique: () => void;
    /**
     * @param cmp Comparison function.
     * Sort the container.
     */
    sort: (cmp?: (x: T, y: T) => number) => void;
}

export interface Pair<T, K> {
    key: T;
    value: K;
}
