export abstract class ContainerIterator<T> {
  /**
   * @description Iterator type.
   */
  readonly iteratorType: 'normal' | 'reverse';
  protected constructor(iteratorType: 'normal' | 'reverse') {
    this.iteratorType = iteratorType;
  }
  /**
   * @description Pointers to element.
   * @return The value of the pointer's element.
   */
  abstract get pointer(): T;
  /**
   * @description Set pointer's value (some containers are unavailable).
   * @param newValue The new value you want to set.
   */
  abstract set pointer(newValue: T);
  /**
   * @description Move `this` iterator to pre.
   */
  abstract pre(): ContainerIterator<T>;
  /**
   * @description Move `this` iterator to next.
   */
  abstract next(): ContainerIterator<T>;
  /**
   * @param obj The other iterator you want to compare.
   * @return Boolean about if this equals to obj.
   * @example container.find(1).equals(container.end());
   */
  abstract equals(obj: ContainerIterator<T>): boolean;
}

export abstract class Base {
  /**
   * @description Container's size.
   * @protected
   */
  protected length = 0;
  /**
   * @return The size of the container.
   */
  size() {
    return this.length;
  }
  /**
   * @return Boolean about if the container is empty.
   */
  empty() {
    return this.length === 0;
  }
  /**
   * @description Clear the container.
   */
  abstract clear(): void;
}

export abstract class Container<T> extends Base {
  /**
   * @return Iterator pointing to the beginning element.
   */
  abstract begin(): ContainerIterator<T>;
  /**
   * @return Iterator pointing to the super end like c++.
   */
  abstract end(): ContainerIterator<T>;
  /**
   * @return Iterator pointing to the end element.
   */
  abstract rBegin(): ContainerIterator<T>;
  /**
   * @return Iterator pointing to the super begin like c++.
   */
  abstract rEnd(): ContainerIterator<T>;
  /**
   * @return The first element of the container.
   */
  abstract front(): T | undefined;
  /**
   * @return The last element of the container.
   */
  abstract back(): T | undefined;
  /**
   * @description I terate over all elements in the container.
   * @param callback callback function like Array.forEach.
   */
  abstract forEach(callback: (element: T, index: number) => void): void;
  /**
   * @param element The element you want to find.
   * @return An iterator pointing to the element if found, or super end if not found.
   */
  abstract find(element: T): ContainerIterator<T>;
  /**
   * @description Gets the value of the element at the specified position.
   */
  abstract getElementByPos(pos: number): T;
  /**
   * @description Removes the element at the specified position.
   * @param pos The element's position you want to remove.
   */
  abstract eraseElementByPos(pos: number): void;
  /**
   * @description Removes element by iterator and move `iter` to next.
   * @param iter The iterator you want to erase.
   * @example container.eraseElementByIterator(container.begin());
   */
  abstract eraseElementByIterator(
    iter: ContainerIterator<T>
  ): ContainerIterator<T>;
  /**
   * @description Using for 'for...of' syntax like Array.
   */
  abstract [Symbol.iterator](): Generator<T, void, undefined>;
}

export type initContainer<T> = (
  { size: number } |
  { length: number } |
  { size(): number }
  ) &
  { forEach(callback: (element: T) => void): void; };
