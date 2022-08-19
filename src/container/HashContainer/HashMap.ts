import { initContainer } from '@/container/ContainerBase/index';
import Vector from '../SequentialContainer/Vector';
import OrderedMap from '../TreeContainer/OrderedMap';
import HashContainerBase from './Base/index';

class HashMap<K, V> extends HashContainerBase<K> {
  private hashTable: (Vector<[K, V]> | OrderedMap<K, V>)[] = [];
  constructor(
    container: initContainer<[K, V]> = [],
    initBucketNum? :number,
    hashFunc?: (x: K) => number) {
    super(initBucketNum, hashFunc);
    container.forEach(element => this.setElement(element[0], element[1]));
  }
  private reAllocate() {
    if (this.bucketNum >= HashContainerBase.maxBucketNum) return;
    const newHashTable: (Vector<[K, V]> | OrderedMap<K, V>)[] = [];
    const originalBucketNum = this.bucketNum;
    this.bucketNum <<= 1;
    for (let index = 0; index < originalBucketNum; ++index) {
      const container = this.hashTable[index];
      if (!container || container.empty()) continue;
      if (container.size() === 1) {
        const element = container.front() as [K, V];
        newHashTable[
          this.hashFunc(element[0]) & (this.bucketNum - 1)
        ] = new Vector([element], false);
        continue;
      }
      const lowList: [K, V][] = [];
      const highList: [K, V][] = [];
      container.forEach(pair => {
        const hashCode = this.hashFunc(pair[0]);
        if ((hashCode & originalBucketNum) === 0) {
          lowList.push(pair);
        } else highList.push(pair);
      });
      if (container instanceof OrderedMap) {
        if (lowList.length > HashMap.untreeifyThreshold) {
          newHashTable[index] = new OrderedMap(lowList);
        } else if (lowList.length) {
          newHashTable[index] = new Vector(lowList, false);
        }
        if (highList.length > HashMap.untreeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedMap(highList);
        } else if (highList.length) {
          newHashTable[index + originalBucketNum] = new Vector(highList, false);
        }
      } else {
        if (lowList.length >= HashMap.treeifyThreshold) {
          newHashTable[index] = new OrderedMap(lowList);
        } else if (lowList.length) {
          newHashTable[index] = new Vector(lowList, false);
        }
        if (highList.length >= HashMap.treeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedMap(highList);
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
  forEach(callback: (element: [K, V], index: number) => void) {
    let index = 0;
    for (let i = 0; i < this.bucketNum; ++i) {
      if (!this.hashTable[i]) continue;
      this.hashTable[i].forEach(element => callback(element, index++));
    }
  }
  /**
   * Insert a new key-value pair or set value by key.
   */
  setElement(key: K, value: V) {
    const index = this.hashFunc(key) & (this.bucketNum - 1);
    if (!this.hashTable[index]) {
      this.length += 1;
      this.hashTable[index] = new Vector([<[K, V]>[key, value]], false);
    } else {
      const preSize = this.hashTable[index].size();
      if (this.hashTable[index] instanceof Vector) {
        for (const pair of this.hashTable[index]) {
          if (pair[0] === key) {
            pair[1] = value;
            return;
          }
        }
        (this.hashTable[index] as Vector<[K, V]>).pushBack([key, value]);
        if (this.hashTable[index].size() >= HashMap.treeifyThreshold) {
          if (this.bucketNum <= HashMap.minTreeifySize) {
            this.length += 1;
            this.reAllocate();
            return;
          }
          this.hashTable[index] = new OrderedMap<K, V>(this.hashTable[index]);
        }
      } else (this.hashTable[index] as OrderedMap<K, V>).setElement(key, value);
      const curSize = this.hashTable[index].size();
      this.length += curSize - preSize;
    }
    if (this.length > this.bucketNum * HashMap.sigma) {
      this.reAllocate();
    }
  }
  /**
   * Gets the value of the element which has the specified key.
   */
  getElementByKey(key: K) {
    const index = this.hashFunc(key) & (this.bucketNum - 1);
    if (!this.hashTable[index]) return undefined;
    if (this.hashTable[index] instanceof OrderedMap) {
      return (this.hashTable[index] as OrderedMap<K, V>).getElementByKey(key);
    } else {
      for (const pair of this.hashTable[index]) {
        if (pair[0] === key) return pair[1];
      }
      return undefined;
    }
  }
  /**
   * Removes the element of the specified key.
   */
  eraseElementByKey(key: K) {
    const index = this.hashFunc(key) & (this.bucketNum - 1);
    if (!this.hashTable[index]) return;
    const preSize = this.hashTable[index].size();
    if (this.hashTable[index] instanceof OrderedMap) {
      (this.hashTable[index] as OrderedMap<K, V>).eraseElementByKey(key);
      if (this.hashTable[index].size() <= HashMap.untreeifyThreshold) {
        this.hashTable[index] = new Vector<[K, V]>(this.hashTable[index]);
      }
    } else {
      let pos = 0;
      for (const pair of this.hashTable[index]) {
        if (pair[0] === key) {
          this.hashTable[index].eraseElementByPos(pos);
          break;
        }
        pos += 1;
      }
    }
    const curSize = this.hashTable[index].size();
    this.length += curSize - preSize;
  }
  /**
   * @return If the specified element in the HashSet.
   */
  find(key: K) {
    const index = this.hashFunc(key) & (this.bucketNum - 1);
    if (!this.hashTable[index]) return false;
    if (this.hashTable[index] instanceof OrderedMap) {
      return !(this.hashTable[index] as OrderedMap<K, V>).find(key)
        .equals((this.hashTable[index] as OrderedMap<K, V>).end());
    }
    for (const pair of this.hashTable[index]) {
      if (pair[0] === key) return true;
    }
    return false;
  }
  /**
   * Using for 'for...of' syntax like Array.
   */
  [Symbol.iterator]() {
    return function * (this: HashMap<K, V>) {
      let index = 0;
      while (index < this.bucketNum) {
        while (index < this.bucketNum && !this.hashTable[index]) index += 1;
        if (index >= this.bucketNum) break;
        for (const pair of this.hashTable[index]) yield pair;
        index += 1;
      }
    }.bind(this)();
  }
}

export default HashMap;
