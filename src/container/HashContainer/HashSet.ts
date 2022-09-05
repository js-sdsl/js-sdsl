import HashContainer from './Base/index';
import Vector from '../SequentialContainer/Vector';
import OrderedSet from '../TreeContainer/OrderedSet';
import { Container, initContainer } from '@/container/ContainerBase/index';

class HashSet<K> extends HashContainer<K> {
  protected hashTable: (Vector<K> | OrderedSet<K>)[] = [];
  constructor(
    container: initContainer<K> = [],
    initBucketNum?: number,
    hashFunc?: (x: K) => number
  ) {
    super(initBucketNum, hashFunc);
    container.forEach(element => this.insert(element));
  }
  protected reAllocate() {
    if (this.bucketNum >= HashContainer.maxBucketNum) return;
    const newHashTable: (Vector<K> | OrderedSet<K>)[] = [];
    const originalBucketNum = this.bucketNum;
    this.bucketNum <<= 1;
    const keys = Object.keys(this.hashTable);
    const keyNums = keys.length;
    for (let i = 0; i < keyNums; ++i) {
      const index = parseInt(keys[i]);
      const container = this.hashTable[index];
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
        if (lowList.length > HashContainer.untreeifyThreshold) {
          newHashTable[index] = new OrderedSet(lowList);
        } else if (lowList.length) {
          newHashTable[index] = new Vector(lowList, false);
        }
        if (highList.length > HashContainer.untreeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedSet(highList);
        } else if (highList.length) {
          newHashTable[index + originalBucketNum] = new Vector(highList, false);
        }
      } else {
        if (lowList.length >= HashContainer.treeifyThreshold) {
          newHashTable[index] = new OrderedSet(lowList);
        } else if (lowList.length) {
          newHashTable[index] = new Vector(lowList, false);
        }
        if (highList.length >= HashContainer.treeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedSet(highList);
        } else if (highList.length) {
          newHashTable[index + originalBucketNum] = new Vector(highList, false);
        }
      }
    }
    this.hashTable = newHashTable;
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
    const container = this.hashTable[index];
    if (!container) {
      this.hashTable[index] = new Vector<K>([element], false);
      this.length += 1;
    } else {
      const preSize = container.size();
      if (container instanceof Vector) {
        if (!(container as Vector<K>).find(element)
          .equals((container as Vector<K>).end())) return;
        (container as Vector<K>).pushBack(element);
        if (this.bucketNum <= HashContainer.minTreeifySize) {
          this.length += 1;
          this.reAllocate();
          return;
        } else if (container.size() >= HashContainer.treeifyThreshold) {
          this.hashTable[index] = new OrderedSet<K>(container);
        }
      } else (container as OrderedSet<K>).insert(element);
      const curSize = container.size();
      this.length += curSize - preSize;
    }
    if (this.length > this.bucketNum * HashContainer.sigma) {
      this.reAllocate();
    }
  }
  eraseElementByKey(key: K) {
    const index = this.hashFunc(key) & (this.bucketNum - 1);
    const container = this.hashTable[index];
    if (!container) return;
    const preSize = container.size();
    if (container instanceof Vector) {
      (container as Vector<K>).eraseElementByValue(key);
      const curSize = container.size();
      this.length += curSize - preSize;
      if (curSize === 0) {
        Reflect.deleteProperty(this.hashTable, index);
      }
    } else {
      (container as OrderedSet<K>).eraseElementByKey(key);
      const curSize = container.size();
      this.length += curSize - preSize;
      if (curSize <= HashContainer.untreeifyThreshold) {
        this.hashTable[index] = new Vector<K>(container);
      }
    }
  }
  find(element: K) {
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    const container = this.hashTable[index];
    if (!container) return false;
    return !(container as Container<K>).find(element)
      .equals((container as Container<K>).end());
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
