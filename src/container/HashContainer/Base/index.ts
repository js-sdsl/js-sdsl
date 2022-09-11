import { Base, Container } from '@/container/ContainerBase/index';

export const enum HashContainerConst {
  sigma = 0.75,
  treeifyThreshold = 8,
  untreeifyThreshold = 6,
  minTreeifySize = 64,
  maxBucketNum = (1 << 30)
}

abstract class HashContainer<K> extends Base {
  protected bucketNum: number;
  protected initBucketNum: number;
  protected hashFunc: (x: K) => number;
  protected abstract hashTable: Container<unknown>[];
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
    this.bucketNum = this.initBucketNum = initBucketNum;
    this.hashFunc = hashFunc;
  }
  clear() {
    this.length = 0;
    this.bucketNum = this.initBucketNum;
    this.hashTable = [];
  }
  /**
   * @description Growth the hash table.
   * @protected
   */
  protected abstract reAllocate(): void;
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
  abstract [Symbol.iterator](): Generator<unknown, void, undefined>;
}

export default HashContainer;
