import { initContainer } from '@/container/ContainerBase/index';
import OrderedSet from '../TreeContainer/OrderedSet';
import HashContainerBase from './Base/index';
import Vector from '../SequentialContainer/Vector';

class HashSet<K> extends HashContainerBase<K> {
  private hashTable: (Vector<K> | OrderedSet<K>)[] = [];
  constructor(
    container: initContainer<K> = [],
    initBucketNum?: number,
    hashFunc?: (x: K) => number
  ) {
    super(initBucketNum, hashFunc);
    container.forEach(element => this.insert(element));
  }
  /**
   * @description Growth the hash table.
   * @private
   */
  private reAllocate() {
    if (this.bucketNum >= HashSet.maxBucketNum) return;
    const newHashTable: (Vector<K> | OrderedSet<K>)[] = [];
    const originalBucketNum = this.bucketNum;
    this.bucketNum <<= 1;
    const keys = Object.keys(this.hashTable);
    const keyNums = keys.length;
    for (let i = 0; i < keyNums; ++i) {
      const index = parseInt(keys[i]);
      const container = this.hashTable[index];
      if (!container || container.empty()) continue;
      if (container.size() === 1) {
        const element = container.front() as K;
        newHashTable[
          this.hashFunc(element) & (this.bucketNum - 1)
        ] = new Vector([element], false);
        continue;
      }
      const lowList: K[] = [];
      const highList: K[] = [];
      container.forEach(element => {
        const hashCode = this.hashFunc(element);
        if ((hashCode & originalBucketNum) === 0) {
          lowList.push(element);
        } else highList.push(element);
      });
      if (container instanceof OrderedSet) {
        if (lowList.length > HashSet.untreeifyThreshold) {
          newHashTable[index] = new OrderedSet(lowList);
        } else if (lowList.length) {
          newHashTable[index] = new Vector(lowList, false);
        }
        if (highList.length > HashSet.untreeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedSet(highList);
        } else if (highList.length) {
          newHashTable[index + originalBucketNum] = new Vector(highList, false);
        }
      } else {
        if (lowList.length >= HashSet.treeifyThreshold) {
          newHashTable[index] = new OrderedSet<K>(lowList);
        } else if (lowList.length) {
          newHashTable[index] = new Vector(lowList, false);
        }
        if (highList.length >= HashSet.treeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedSet(highList);
        } else if (highList.length) {
          newHashTable[index + originalBucketNum] = new Vector(highList, false);
        }
      }
    }
    this.hashTable = newHashTable;
  }
  clear() {
    this.length = 0;
    this.bucketNum = this.initBucketNum;
    this.hashTable = [];
  }
  forEach(callback: (element: K, index: number) => void) {
    const keys = Object.keys(this.hashTable);
    const keyNums = keys.length;
    for (let i = 0; i < keyNums; ++i) {
      const index = parseInt(keys[i]);
      const container = this.hashTable[index];
      container.forEach(callback);
    }
  }
  /**
   * @description Insert element to hash set.
   * @param element The element you want to insert.
   */
  insert(element: K) {
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) {
      this.hashTable[index] = new Vector<K>([element], false);
      this.length += 1;
    } else {
      const preSize = this.hashTable[index].size();
      if (this.hashTable[index] instanceof Vector) {
        if (!(this.hashTable[index] as Vector<K>).find(element)
          .equals((this.hashTable[index] as Vector<K>).end())) return;
        (this.hashTable[index] as Vector<K>).pushBack(element);
        if (this.bucketNum <= HashSet.minTreeifySize) {
          this.length += 1;
          this.reAllocate();
          return;
        } else if (this.hashTable[index].size() >= HashSet.treeifyThreshold) {
          this.hashTable[index] = new OrderedSet<K>(this.hashTable[index]);
        }
      } else (this.hashTable[index] as OrderedSet<K>).insert(element);
      const curSize = this.hashTable[index].size();
      this.length += curSize - preSize;
    }
    if (this.length > this.bucketNum * HashSet.sigma) {
      this.reAllocate();
    }
  }
  /**
   * @description Remove the elements of the specified value.
   * @param element The element you want to remove.
   */
  eraseElementByKey(element: K) {
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) return;
    const preSize = this.hashTable[index].size();
    if (this.hashTable[index] instanceof Vector) {
      (this.hashTable[index] as Vector<K>).eraseElementByValue(element);
      if (this.hashTable[index].empty()) {
        this.length -= preSize;
        Reflect.deleteProperty(this.hashTable, index);
        return;
      }
    } else {
      (this.hashTable[index] as OrderedSet<K>).eraseElementByKey(element);
      const size = this.hashTable[index].size();
      if (size === 0) {
        this.length -= preSize;
        Reflect.deleteProperty(this.hashTable, index);
        return;
      } else if (size <= HashSet.untreeifyThreshold) {
        this.hashTable[index] = new Vector<K>(this.hashTable[index]);
      }
    }
    const curSize = this.hashTable[index].size();
    this.length += curSize - preSize;
  }
  /**
   * @param element The element you want to find.
   * @return Boolean about if the specified element in the hash set.
   */
  find(element: K) {
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) return false;
    return !(this.hashTable[index] as Vector<K>).find(element)
      .equals((this.hashTable[index] as Vector<K>).end());
  }
  [Symbol.iterator]() {
    return function * (this: HashSet<K>) {
      const keys = Object.keys(this.hashTable);
      const keysNum = keys.length;
      for (let i = 0; i < keysNum; ++i) {
        const index = parseInt(keys[i]);
        const container = this.hashTable[index];
        for (const element of container) {
          yield element;
        }
      }
    }.bind(this)();
  }
}

export default HashSet;
