export abstract class ContainerIterator<T, P> {
  protected node: P;
  /**
   * Pointers to element.
   */
  readonly iteratorType: 'normal' | 'reverse';
  constructor(node: P, iteratorType: 'normal' | 'reverse') {
    this.node = node;
    this.iteratorType = iteratorType;
  }
  abstract get pointer(): T;
  abstract set pointer(newValue: T);
  /**
   * @return Previous iterator.
   */
  abstract pre(): ContainerIterator<T, P>;
  /**
   * @return Next iterator.
   */
  abstract next(): ContainerIterator<T, P>;
  /**
   * @param obj The other iterator you want to compare.
   * @return If this equals to obj.
   */
  abstract equals(obj: ContainerIterator<T, P>): boolean;
}

export abstract class Base {
  protected length = 0;
  /**
   * @return The size of the container.
   */
  size() {
    return this.length;
  }
  /**
   * @return Is the container empty.
   */
  empty() {
    return this.length === 0;
  }
  /**
   * Clear the container.
   */
  abstract clear(): void;
}

export abstract class Container<T, P> extends Base {
  /**
   * @return Iterator pointing to the begin element.
   */
  abstract begin(): ContainerIterator<T, P>;
  /**
   * @return Iterator pointing to the super end like c++.
   */
  abstract end(): ContainerIterator<T, P>;
  /**
   * @return Iterator pointing to the end element.
   */
  abstract rBegin(): ContainerIterator<T, P>;
  /**
   * @return Iterator pointing to the super begin like c++.
   */
  abstract rEnd(): ContainerIterator<T, P>;
  /**
   * @return The first element.
   */
  abstract front(): T | undefined;
  /**
   * @return The last element.
   */
  abstract back(): T | undefined;
  abstract forEach(callback: (element: T, index: number) => void): void;
  /**
   * @param element The element you want to find.
   * @return Iterator pointing to the element if found, or super end if not found.
   */
  abstract find(element: T): ContainerIterator<T, P>;
  /**
   * Gets the value of the element at the specified position.
   */
  abstract getElementByPos(pos: number): T;
  /**
   * Removes the element at the specified position.
   */
  abstract eraseElementByPos(pos: number): void;
  /**
   * Removes the elements of the specified value.
   */
  abstract eraseElementByValue(value: T): void;
  /**
   * @return An iterator point to the next iterator.
   * Removes element by iterator.
   */
  abstract eraseElementByIterator(
    iter: ContainerIterator<T, P>
  ): ContainerIterator<T, P>;
  /**
   * Using for 'for...of' syntax like Array.
   */
  abstract [Symbol.iterator](): Generator<T, void, undefined>;
}

export abstract class SequentialContainer<T, P> extends Container<T, P> {
  /**
   * Push the element to the back.
   */
  abstract pushBack(element: T): void;
  /**
   * Removes the last element.
   */
  abstract popBack(): void;
  /**
   * Sets element by position.
   */
  abstract setElementByPos(pos: number, element: T): void;
  /**
   * @param pos The position you want to insert.
   * @param element The element you want to insert.
   * @param num The number of elements you want to insert (default 1).
   * Insert several elements after the specified position.
   */
  abstract insert(pos: number, element: T, num?: number): void;
  /**
   * Reverses the container.
   */
  abstract reverse(): void;
  /**
   * Removes the duplication of elements in the container.
   */
  abstract unique(): void;
  /**
   * @param cmp Comparison function.
   * Sort the container.
   */
  abstract sort(cmp?: (x: T, y: T) => number): void;
}

export type initContainer<T> = (
  { size: number } |
  { length: number } |
  { size(): number }
  ) &
  { forEach(callback: (element: T) => void): void; };
