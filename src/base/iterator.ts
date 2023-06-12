import { Container } from '@/base/index';

/**
 * @description The iterator type including `NORMAL` and `REVERSE`.
 */
export const enum ITERATOR_TYPE {
  NORMAL = 0,
  REVERSE = 1
}

export abstract class Iterator<T> {
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
   * console.log(container.end().type === ITERATOR_TYPE.NORMAL);  // true
   */
  readonly type: ITERATOR_TYPE;
  /**
   * @internal
   */
  protected constructor(props: {
    type?: ITERATOR_TYPE
  } = {}) {
    const { type = ITERATOR_TYPE.NORMAL } = props;
    this.type = type;
  }
  /**
   * @param iter - The other iterator you want to compare.
   * @returns Whether this equals to obj.
   * @example
   * container.find(1).equals(container.end());
   */
  equals(iter: Iterator<T>) {
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
  abstract copy(): Iterator<T>;
}
