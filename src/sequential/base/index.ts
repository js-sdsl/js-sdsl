import { CallbackFn, Container, ContainerIterator } from '@/base';
import { CompareFn } from '@/utils/compareFn';

abstract class SequentialContainer<T> extends Container<T> {
  /**
   * @description Push the item to the back.
   * @param items - The elements you want to push.
   * @returns The size of container after pushing.
   */
  abstract push(...items: T[]): number;
  /**
   * @description Removes the last item.
   * @returns The item you popped.
   */
  abstract pop(): T | undefined;
  protected abstract _set(index: number, item: T): void;
  /**
   * @description Sets item by position.
   * @param index - The position you want to change.
   * @param item - The item's value you want to update.
   * @example
   * container.set(-1, 1); // throw a RangeError
   */
  set(index: number, item: T) {
    if (index < 0 || index >= this._length) {
      return false;
    }
    this._set(index, item);
    return true;
  }
  /**
   * @description Reverses the container.
   * @returns The container's self.
   * @example
   * const container = new Vector([1, 2, 3]);
   * container.reverse(); // [3, 2, 1]
   */
  abstract reverse(): this;
  /**
   * @description Removes the duplication of elements in the container.
   * @returns The size of container after inserting.
   * @example
   * const container = new Vector([1, 1, 3, 2, 2, 5, 5, 2]);
   * container.unique(); // [1, 3, 2, 5, 2]
   */
  abstract unique(cmp?: CompareFn<T>): number;
  abstract map<U>(callback: CallbackFn<T, this, U>, cmp?: CompareFn<U>): SequentialContainer<U>;
  abstract slice(start?: number, end?: number): SequentialContainer<T>;
  abstract splice(start: number, deleteCount?: number): SequentialContainer<T>;
  abstract splice(start: number, deleteCount?: number, ...items: T[]): SequentialContainer<T>;
  abstract entries(): IterableIterator<[number, T]>;
  abstract values(): IterableIterator<T>;
  /**
   * @description Sort the container.
   * @param cmp - Comparison function to sort.
   * @returns The container's self.
   * @example
   * const container = new Vector([3, 1, 10]);
   * container.sort();  // [1, 10, 3]
   * container.sort((x, y) => x - y); // [1, 3, 10]
   */
  abstract sort(cmp?: CompareFn<T>): this;
  abstract filter(callback: CallbackFn<T, this, unknown>): SequentialContainer<T>;
  abstract find(item: T, cmp?: CompareFn<T>): ContainerIterator<T>;
}

export default SequentialContainer;
