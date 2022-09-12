import HashContainer, { HashContainerConst } from './Base/index';
import Vector from '../SequentialContainer/Vector';
import OrderedMap from '../TreeContainer/OrderedMap';
import { initContainer } from '@/container/ContainerBase/index';

class HashMap<K, V> extends HashContainer<K> {
  protected hashTable: (Vector<[K, V]> | OrderedMap<K, V>)[] = [];
  constructor(
    container: initContainer<[K, V]> = [],
    initBucketNum? :number,
    hashFunc?: (x: K) => number) {
    super(initBucketNum, hashFunc);
    container.forEach(element => this.setElement(element[0], element[1]));
  }
  protected reAllocate() {
    if (this.bucketNum >= HashContainerConst.maxBucketNum) return;
    const newHashTable: (Vector<[K, V]> | OrderedMap<K, V>)[] = [];
    const originalBucketNum = this.bucketNum;
    this.bucketNum <<= 1;
    const keys = Object.keys(this.hashTable);
    const keyNums = keys.length;
    for (let i = 0; i < keyNums; ++i) {
      const index = parseInt(keys[i]);
      const container = this.hashTable[index];
      const size = container.size();
      if (size === 0) continue;
      if (size === 1) {
        const element = container.front() as [K, V];
        newHashTable[
          this.hashFunc(element[0]) & (this.bucketNum - 1)
        ] = new Vector([element], false);
        continue;
      }
      const lowList: [K, V][] = [];
      const highList: [K, V][] = [];
      container.forEach(element => {
        const hashCode = this.hashFunc(element[0]);
        if ((hashCode & originalBucketNum) === 0) {
          lowList.push(element);
        } else highList.push(element);
      });
      if (container instanceof OrderedMap) {
        if (lowList.length > HashContainerConst.untreeifyThreshold) {
          newHashTable[index] = new OrderedMap(lowList);
        } else {
          newHashTable[index] = new Vector(lowList, false);
        }
        if (highList.length > HashContainerConst.untreeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedMap(highList);
        } else {
          newHashTable[index + originalBucketNum] = new Vector(highList, false);
        }
      } else {
        newHashTable[index] = new Vector(lowList, false);
        newHashTable[index + originalBucketNum] = new Vector(highList, false);
      }
    }
    this.hashTable = newHashTable;
  }
  forEach(callback: (element: [K, V], index: number) => void) {
    const containers = Object.values(this.hashTable);
    const containersNum = containers.length;
    let index = 0;
    for (let i = 0; i < containersNum; ++i) {
      containers[i].forEach(element => callback(element, index++));
    }
  }
  /**
   * @description Insert a new key-value pair to hash map or set value by key.
   * @param key The key you want to insert.
   * @param value The value you want to insert.
   * @example HashMap.setElement(1, 2); // insert a key-value pair [1, 2]
   */
  setElement(key: K, value: V) {
    const index = this.hashFunc(key) & (this.bucketNum - 1);
    const container = this.hashTable[index];
    if (!container) {
      this.length += 1;
      this.hashTable[index] = new Vector([<[K, V]>[key, value]], false);
    } else {
      const preSize = container.size();
      if (container instanceof Vector) {
        for (const pair of container) {
          if (pair[0] === key) {
            pair[1] = value;
            return;
          }
        }
        (container as Vector<[K, V]>).pushBack([key, value]);
        if (preSize + 1 >= HashContainerConst.treeifyThreshold) {
          if (this.bucketNum <= HashContainerConst.minTreeifySize) {
            this.length += 1;
            this.reAllocate();
            return;
          }
          this.hashTable[index] = new OrderedMap<K, V>(this.hashTable[index]);
        }
        this.length += 1;
      } else {
        (container as OrderedMap<K, V>).setElement(key, value);
        const curSize = container.size();
        this.length += curSize - preSize;
      }
    }
    if (this.length > this.bucketNum * HashContainerConst.sigma) {
      this.reAllocate();
    }
  }
  /**
   * @description Get the value of the element which has the specified key.
   * @param key The key you want to get.
   */
  getElementByKey(key: K) {
    const index = this.hashFunc(key) & (this.bucketNum - 1);
    const container = this.hashTable[index];
    if (!container) return undefined;
    if (container instanceof OrderedMap) {
      return (container as OrderedMap<K, V>).getElementByKey(key);
    } else {
      for (const pair of container) {
        if (pair[0] === key) return pair[1];
      }
      return undefined;
    }
  }
  eraseElementByKey(key: K) {
    const index = this.hashFunc(key) & (this.bucketNum - 1);
    const container = this.hashTable[index];
    if (!container) return;
    if (container instanceof Vector) {
      let pos = 0;
      for (const pair of container) {
        if (pair[0] === key) {
          container.eraseElementByPos(pos);
          this.length -= 1;
          return;
        }
        pos += 1;
      }
    } else {
      const preSize = container.size();
      (container as OrderedMap<K, V>).eraseElementByKey(key);
      const curSize = container.size();
      this.length += curSize - preSize;
      if (curSize <= HashContainerConst.untreeifyThreshold) {
        this.hashTable[index] = new Vector(container);
      }
    }
  }
  find(key: K) {
    const index = this.hashFunc(key) & (this.bucketNum - 1);
    const container = this.hashTable[index];
    if (!container) return false;
    if (container instanceof OrderedMap) {
      return !(container as OrderedMap<K, V>).find(key)
        .equals((container as OrderedMap<K, V>).end());
    }
    for (const pair of container) {
      if (pair[0] === key) return true;
    }
    return false;
  }
  [Symbol.iterator]() {
    return function * (this: HashMap<K, V>) {
      const containers = Object.values(this.hashTable);
      const containersNum = containers.length;
      for (let i = 0; i < containersNum; ++i) {
        const container = containers[i];
        for (const element of container) {
          yield element;
        }
      }
    }.bind(this)();
  }
}

export default HashMap;
