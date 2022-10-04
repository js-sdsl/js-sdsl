import { Base, Container } from '@/container/ContainerBase';

/**
 * @internal
 */
export const enum HashContainerConst {
  treeifyThreshold = 8,
  untreeifyThreshold = 6,
  maxBucketNum = (1 << 30)
}

abstract class HashContainer<K, V> extends Base {
  /**
   * @internal
   */
  protected _hashFunc: (x: K) => number;
  /**
   * @internal
   */
  protected abstract _hashTable: ((K | [K, V])[] | Container<K | [K, V]>)[];
  protected constructor(
    hashFunc = (x: K) => {
      let str;
      const type = typeof x;
      if (type === 'number') {
        if ((x as unknown as number) % 1 === 0) {
          let hash = x as unknown as number;
          hash = hash ^ 5381;
          hash = ~hash + (hash << 15);
          hash = hash ^ (hash >> 12);
          hash = hash + (hash << 2);
          hash = hash ^ (hash >> 4);
          hash = hash * 2057;
          hash = hash ^ (hash >> 16);
          return hash & 0x3fffffff;
        } else str = (x as unknown as number).toFixed(6);
      } else if (type === 'string') {
        str = x as unknown as string;
      } else str = JSON.stringify(x);
      let hashCode = 0;
      const strLength = str.length;
      for (let i = 0; i < strLength; ++i) {
        const ch = str.charCodeAt(i);
        hashCode = ((hashCode << 5) - hashCode) + ch;
        hashCode |= 0;
      }
      return hashCode >>> 0;
    }) {
    super();
    this._hashFunc = hashFunc;
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
