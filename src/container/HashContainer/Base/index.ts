import { Base, Container } from '@/container/ContainerBase';
import getHashCode from '@/utils/hash';

/**
 * @internal
 */
export const enum HashContainerConst {
  treeifyThreshold = 8,
  untreeifyThreshold = 6,
  maxBucketNum = 0x3fffffff
}

abstract class HashContainer<K, V> extends Base {
  /**
   * @internal
   */
  protected _hashFunc: (x: K) => number;
  /**
   * @internal
   */
  protected _cmp?: (x: K, y: K) => number;
  /**
   * @internal
   */
  protected abstract _hashTable: ((K | [K, V])[] | Container<K | [K, V]>)[];
  protected constructor(
    hashFunc = <(x: K) => number>getHashCode,
    cmp?: (x: K, y: K) => number
  ) {
    super();
    this._hashFunc = hashFunc;
    this._cmp = cmp;
  }
  clear() {
    this._length = 0;
    this._hashTable = [];
  }
  /**
   * @description Iterate over all elements in the container.
   * @param callback Callback function like Array.forEach.
   */
  abstract forEach(callback: (element: unknown, index: number) => void): void;
  /**
   * @description Remove the elements of the specified value.
   * @param key The element you want to remove.
   */
  abstract eraseElementByKey(key: K): void;
  /**
   * @param key The element you want to find.
   * @return Boolean about if the specified element in the hash set.
   */
  abstract find(key: K): void;
  /**
   * @description Using for `for...of` syntax like Array.
   */
  abstract [Symbol.iterator](): Generator<K | [K, V], void, undefined>;
}

export default HashContainer;
