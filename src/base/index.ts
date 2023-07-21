import { Iterator } from '@/base/iterator';

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
  abstract begin(): Iterator<T>;
  /**
   * @returns Iterator pointing to the super end like c++.
   * @example
   * const begin = container.begin();
   * const end = container.end();
   * for (const it = begin; !it.equals(end); it.next()) {
   *   doSomething(it.pointer);
   * }
   */
  abstract end(): Iterator<T>;
  /**
   * @returns Iterator pointing to the end item.
   * @example
   * const rBegin = container.rBegin();
   * const rEnd = container.rEnd();
   * for (const it = rBegin; !it.equals(rEnd); it.next()) {
   *   doSomething(it.pointer);
   * }
   */
  abstract rBegin(): Iterator<T>;
  /**
   * @returns Iterator pointing to the super begin like c++.
   * @example
   * const rBegin = container.rBegin();
   * const rEnd = container.rEnd();
   * for (const it = rBegin; !it.equals(rEnd); it.next()) {
   *   doSomething(it.pointer);
   * }
   */
  abstract rEnd(): Iterator<T>;
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
  abstract find(item: T): Iterator<T>;
  /**
   * @description Iterate over all elements in the container.
   * @param callback - Callback function like Array.forEach.
   * @example
   * container.forEach((item, index) => console.log(item, index));
   */
  abstract forEach(callback: (value: T, index: number, container: this) => void): void;
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
    const length = this._length;
    if (index >= length) {
      return undefined;
    } else if (index < 0) {
      index += length;
      if (index < 0) {
        return undefined;
      }
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
  abstract erase(iter: Iterator<T>): Iterator<T>;
  abstract entries(): IterableIterator<[unknown, unknown]>;
  abstract every(callback: (value: T, index: number, container: this) => unknown): boolean;
  abstract filter(callback: (value: T, index: number, container: this) => unknown): Container<T>;
  abstract some(callback: (value: T, index: number, container: this) => unknown): boolean;
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
