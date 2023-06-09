/**
 * @description The iterator type including `NORMAL` and `REVERSE`.
 */
export const enum IteratorType {
  NORMAL = 0,
  REVERSE = 1
}

export abstract class ContainerIterator<T> {
  /**
   * @description The container pointed to by the iterator.
   */
  abstract readonly container: Container<T>;
  /**
   * @internal
   */
  abstract _node: unknown;
  /**
   * @description Iterator's type.
   * @example
   * console.log(container.end().type === IteratorType.NORMAL);  // true
   */
  readonly type: IteratorType;
  /**
   * @internal
   */
  protected constructor(props: {
    type?: IteratorType
  } = {}) {
    const { type = IteratorType.NORMAL } = props;
    this.type = type;
  }
  /**
   * @param iter - The other iterator you want to compare.
   * @returns Whether this equals to obj.
   * @example
   * container.find(1).equals(container.end());
   */
  equals(iter: ContainerIterator<T>) {
    return this._node === iter._node;
  }
  /**
   * @description Pointers to item.
   * @returns The value of the pointer's item.
   * @example
   * const val = container.begin().pointer;
   */
  abstract get pointer(): T;
  /**
   * @description Set pointer's value (some containers are unavailable).
   * @param newValue - The new value you want to set.
   * @example
   * (<LinkList<number>>container).begin().pointer = 1;
   */
  abstract set pointer(newValue: T);
  /**
   * @description Move `this` iterator to pre.
   * @returns The iterator's self.
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
   * @returns The iterator's self.
   * @example
   * const iter = container.find(1);  // container = [1, 2]
   * const next = iter.next();
   * console.log(next === iter);  // true
   * console.log(next.equals(iter));  // true
   * console.log(next.pointer, iter.pointer); // 2, 2
   */
  abstract next(): this;
  /**
   * @description Get a copy of itself.
   * @returns The copy of self.
   * @example
   * const iter = container.find(1);  // container = [1, 2]
   * const next = iter.copy().next();
   * console.log(next === iter);  // false
   * console.log(next.equals(iter));  // false
   * console.log(next.pointer, iter.pointer); // 2, 1
   */
  abstract copy(): ContainerIterator<T>;
}

export type CallbackFn<T, C, R> = (value: T, index: number, container: C) => R;

export abstract class Base {
  /**
   * @description Container's size.
   * @internal
   */
  protected _length = 0;
  /**
   * @returns The size of the container.
   * @example
   * const container = new Vector([1, 2]);
   * console.log(container.length); // 2
   */
  get length() {
    return this._length;
  }
  /**
   * @returns The size of the container.
   * @example
   * const container = new Vector([1, 2]);
   * console.log(container.length); // 2
   */
  get size() {
    return this._length;
  }
  /**
   * @returns Whether the container is empty.
   * @example
   * container.clear();
   * console.log(container.empty());  // true
   */
  empty() {
    return this._length === 0;
  }
  /**
   * @description Clear the container.
   * @example
   * container.clear();
   * console.log(container.empty());  // true
   */
  abstract clear(): void;
}

export abstract class Container<T> extends Base {
  /**
   * @returns Iterator pointing to the beginning item.
   * @example
   * const begin = container.begin();
   * const end = container.end();
   * for (const it = begin; !it.equals(end); it.next()) {
   *   doSomething(it.pointer);
   * }
   */
  abstract begin(): ContainerIterator<T>;
  /**
   * @returns Iterator pointing to the super end like c++.
   * @example
   * const begin = container.begin();
   * const end = container.end();
   * for (const it = begin; !it.equals(end); it.next()) {
   *   doSomething(it.pointer);
   * }
   */
  abstract end(): ContainerIterator<T>;
  /**
   * @returns Iterator pointing to the end item.
   * @example
   * const rBegin = container.rBegin();
   * const rEnd = container.rEnd();
   * for (const it = rBegin; !it.equals(rEnd); it.next()) {
   *   doSomething(it.pointer);
   * }
   */
  abstract rBegin(): ContainerIterator<T>;
  /**
   * @returns Iterator pointing to the super begin like c++.
   * @example
   * const rBegin = container.rBegin();
   * const rEnd = container.rEnd();
   * for (const it = rBegin; !it.equals(rEnd); it.next()) {
   *   doSomething(it.pointer);
   * }
   */
  abstract rEnd(): ContainerIterator<T>;
  /**
   * @returns The first item of the container.
   */
  abstract front(): T | undefined;
  /**
   * @returns The last item of the container.
   */
  abstract back(): T | undefined;
  /**
   * @param item - The item you want to find.
   * @returns An iterator pointing to the item if found, or super end if not found.
   * @example
   * container.find(1).equals(container.end());
   */
  abstract find(item: T): ContainerIterator<T>;
  /**
   * @description Iterate over all elements in the container.
   * @param callback - Callback function like Array.forEach.
   * @example
   * container.forEach((item, index) => console.log(item, index));
   */
  abstract forEach(callback: CallbackFn<T, this, void>): void;
  /**
   * @internal
   */
  protected abstract _at(index: number): T;
  /**
   * @description Gets the value of the item at the specified position.
   * @example
   * const val = container.getElementByPos(-1); // throw a RangeError
   */
  at(index: number) {
    if (index >= this._length) return undefined;
    if (index < 0) index += this._length;
    if (index < 0) {
      return undefined;
    }
    return this._at(index);
  }
  /**
   * @description Removes item by iterator and move `iter` to next.
   * @param iter - The iterator you want to erase.
   * @returns The next iterator.
   * @example
   * container.erase(container.begin());
   * container.erase(container.end()); // throw a RangeError
   */
  abstract erase(iter: ContainerIterator<T>): ContainerIterator<T>;
  abstract entries(): IterableIterator<[unknown, unknown]>;
  abstract every(callback: CallbackFn<T, this, unknown>): boolean;
  abstract filter(callback: CallbackFn<T, this, unknown>): Container<T>;
  abstract some(callback: CallbackFn<T, this, unknown>): boolean;
  abstract values(): IterableIterator<unknown>;
  /**
   * @description Using for `for...of` syntax like Array.
   * @example
   * for (const item of container) {
   *   console.log(item);
   * }
   */
  abstract [Symbol.iterator](): IterableIterator<T>;
  toArray() {
    return Array.from(this);
  }
}

/**
 * @description The initial data type passed in when initializing the container.
 */
export type Entries<T> = {
  size?: number;
  length?: number;
  forEach: (callback: (el: T) => unknown) => void;
}
