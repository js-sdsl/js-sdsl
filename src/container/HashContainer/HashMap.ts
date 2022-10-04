import { initContainer } from '@/container/ContainerBase';
import HashContainer, { HashContainerConst } from './Base';
import OrderedMap from '@/container/TreeContainer/OrderedMap';

class HashMap<K, V> extends HashContainer<K, V> {
  /**
   * @internal
   */
  protected _hashTable: ([K, V][] | OrderedMap<K, V>)[] = [];
  constructor(
    container: initContainer<[K, V]> = [],
    hashFunc?: (x: K) => number) {
    super(hashFunc);
    container.forEach(element => this.setElement(element[0], element[1]));
  }
  forEach(callback: (element: [K, V], index: number) => void) {
    const containers = Object.values(this._hashTable);
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
    const index = this._hashFunc(key) & (HashContainerConst.maxBucketNum - 1);
    const container = this._hashTable[index];
    if (!container) {
      this._length += 1;
      this._hashTable[index] = [[key, value]];
    } else {
      if (container instanceof Array) {
        if (container.some(element => {
          if (element[0] === key) {
            element[1] = value;
            return true;
          }
          return false;
        })) return;
        container.push([key, value]);
        if (container.length >= HashContainerConst.treeifyThreshold) {
          this._hashTable[index] = new OrderedMap<K, V>(container);
        }
        this._length += 1;
      } else {
        const preSize = container.length;
        (container as OrderedMap<K, V>).setElement(key, value);
        const curSize = container.length;
        this._length += curSize - preSize;
      }
    }
  }
  /**
   * @description Get the value of the element which has the specified key.
   * @param key The key you want to get.
   */
  getElementByKey(key: K) {
    const index = this._hashFunc(key) & (HashContainerConst.maxBucketNum - 1);
    const container = this._hashTable[index];
    if (!container) return undefined;
    if (container instanceof Array) {
      const element = container.find(element => element[0] === key);
      if (element === undefined) return undefined;
      return element[1];
    } else {
      return (container as OrderedMap<K, V>).getElementByKey(key);
    }
  }
  eraseElementByKey(key: K) {
    const index = this._hashFunc(key) & (HashContainerConst.maxBucketNum - 1);
    const container = this._hashTable[index];
    if (!container) return;
    const preSize = container.length;
    if (!preSize) return;
    if (container instanceof Array) {
      this._hashTable[index] = container.filter(element => element[0] !== key);
      const curSize = this._hashTable[index].length;
      this._length += curSize - preSize;
    } else {
      (container as OrderedMap<K, V>).eraseElementByKey(key);
      const curSize = container.length;
      this._length += curSize - preSize;
      if (curSize <= HashContainerConst.untreeifyThreshold) {
        this._hashTable[index] = Array.from(container);
      }
    }
  }
  find(key: K) {
    const index = this._hashFunc(key) & (HashContainerConst.maxBucketNum - 1);
    const container = this._hashTable[index];
    if (!container) return false;
    if (container instanceof Array) {
      return container.some(element => element[0] === key);
    }
    return !container.find(key).equals(container.end());
  }
  [Symbol.iterator]() {
    return function * (this: HashMap<K, V>) {
      const containers = Object.values(this._hashTable);
      const containersNum = containers.length;
      for (let i = 0; i < containersNum; ++i) {
        yield * containers[i];
      }
    }.bind(this)();
  }
}

export default HashMap;
