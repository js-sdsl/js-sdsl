import { Base, Container } from '@/container/ContainerBase';

/**
 * @internal
 */
export const enum HashContainerConst {
  sigma = 0.75,
  treeifyThreshold = 8,
  untreeifyThreshold = 6,
  minTreeifySize = 64,
  maxBucketNum = (1 << 30)
}

abstract class HashContainer<K> extends Base {
  /**
   * @internal
   */
  protected _bucketNum: number;
  /**
   * @internal
   */
  protected _initBucketNum: number;
  /**
   * @internal
   */
  protected _hashFunc: (x: K) => number;
  /**
   * @internal
   */
  protected abstract _hashTable: Container<unknown>[];
  protected constructor(
    initBucketNum = 16,
    hashFunc: (x: K) => number =
    (x: K) => {
      let str;
      if (typeof x !== 'string') {
        str = JSON.stringify(x);
      } else str = x;
      let hashCode = 0;
      const strLength = str.length;
      for (let i = 0; i < strLength; i++) {
        const ch = str.charCodeAt(i);
        hashCode = ((hashCode << 5) - hashCode) + ch;
        hashCode |= 0;
      }
      return hashCode >>> 0;
    }) {
    super();
    if (initBucketNum < 16 || (initBucketNum & (initBucketNum - 1)) !== 0) {
      throw new RangeError('InitBucketNum range error');
    }
    this._bucketNum = this._initBucketNum = initBucketNum;
    this._hashFunc = hashFunc;
  }
  clear() {
    this._length = 0;
    this._bucketNum = this._initBucketNum;
    this._hashTable = [];
  }
  /**
   * @description Growth the hash table.
   * @internal
   */
  protected abstract _reAllocate(): void;
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
  abstract [Symbol.iterator](): Generator<K | [K, unknown], void, undefined>;
}

export default HashContainer;
