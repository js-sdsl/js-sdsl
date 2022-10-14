export const enum IteratorType {
  NORMAL = 0,
  REVERSE = 1
}

export abstract class ContainerIterator<T> {
  /**
   * @description Iterator's type.
   * @example console.log(container.end().iteratorType === IteratorType.NORMAL);  // true
   */
  readonly iteratorType: IteratorType;
  /**
   * @internal
   */
  protected _node: unknown;
  protected constructor(iteratorType: IteratorType = IteratorType.NORMAL) {
    this.iteratorType = iteratorType;
  }
  /**
   * @description Pointers to element.
   * @return The value of the pointer's element.
   * @example const val = container.begin().pointer;
   */
  abstract get pointer(): T;
  /**
   * @description Set pointer's value (some containers are unavailable).
   * @param newValue The new value you want to set.
   * @example (<LinkList<number>>container).begin().pointer = 1;
   */
  abstract set pointer(newValue: T);
  /**
   * @description Move `this` iterator to pre.
   * @example
   * const iter = container.find(1);  // container = [0, 1]
   * const pre = iter.pre();
   * console.log(pre === iter);  // true
   * console.log(pre.equals(iter));  // true
   * console.log(pre.pointer, iter.pointer); // 0, 0
   */
  abstract pre(): this;
  /**
   * @description Move `this` iterator to next.
   * @example
   * const iter = container.find(1);  // container = [1, 2]
   * const next = iter.next();
   * console.log(next === iter);  // true
   * console.log(next.equals(iter));  // true
   * console.log(next.pointer, iter.pointer); // 2, 2
   */
  abstract next(): this;
  /**
   * @param obj The other iterator you want to compare.
   * @return Boolean about if this equals to obj.
   * @example container.find(1).equals(container.end());
   */
  abstract equals(obj: ContainerIterator<T>): boolean;
  /**
   * @description Get a copy of itself.
   * @return The copy of self.
   * @example
   * const iter = container.find(1);  // container = [1, 2]
   * const next = iter.copy().next();
   * console.log(next === iter);  // false
   * console.log(next.equals(iter));  // false
   * console.log(next.pointer, iter.pointer); // 2, 1
   */
  abstract copy(): ContainerIterator<T>;
}

export abstract class Base {
  /**
   * @description Container's size.
   * @internal
   */
  protected _length = 0;
  /**
   * @return The size of the container.
   */
  size() {
    return this._length;
  }
  /**
   * @return Boolean about if the container is empty.
   */
  empty() {
    return this._length === 0;
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
   * @description Iterate over all elements in the container.
   * @param callback Callback function like Array.forEach.
   * @example container.forEach((element, index) => console.log(element, index));
   */
  abstract forEach(callback: (element: T, index: number) => void): void;
  /**
   * @param element The element you want to find.
   * @return An iterator pointing to the element if found, or super end if not found.
   * @example container.find(1).equals(container.end());
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
   * @description Using for `for...of` syntax like Array.
   * @example
   * for (const element of container) {
   *   console.log(element);
   * }
   */
  abstract [Symbol.iterator](): Generator<T, void, undefined>;
}

export type initContainer<T> = (
  { size: number } |
  { length: number } |
  { size(): number }
  ) &
  { forEach(callback: (element: T) => void): void; };
