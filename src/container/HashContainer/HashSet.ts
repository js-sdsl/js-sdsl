import { initContainer } from '@/container/ContainerBase';
import HashContainer, { HashContainerConst } from './Base';
import OrderedSet from '@/container/TreeContainer/OrderedSet';

class HashSet<K> extends HashContainer<K, undefined> {
  /**
   * @internal
   */
  protected _hashTable: (K[] | OrderedSet<K>)[] = [];
  /**
   * @description HashSet's constructor.
   * @param container Initialize container, must have a forEach function.
   * @param hashFunc The hash function to get a number from item.
   * @param cmp The compare function for rbtree.
   */
  constructor(
    container: initContainer<K> = [],
    hashFunc?: (x: K) => number,
    cmp?: (x: K, y: K) => number
  ) {
    super(hashFunc, cmp);
    this._hashTable.length = HashContainerConst.maxBucketNum + 1;
    container.forEach(element => this.insert(element));
  }
  forEach(callback: (element: K, index: number) => void) {
    const containers = Object.values(this._hashTable);
    const containersNum = containers.length;
    let index = 0;
    for (let i = 0; i < containersNum; ++i) {
      containers[i].forEach(element => callback(element, index++));
    }
  }
  /**
   * @description Insert element to hash set.
   * @param element The element you want to insert.
   */
  insert(element: K) {
    const index = this._hashFunc(element) & HashContainerConst.maxBucketNum;
    const container = this._hashTable[index];
    if (!container) {
      this._hashTable[index] = [element];
      this._length += 1;
    } else {
      if (container instanceof Array) {
        if (container.indexOf(element) >= 0) return;
        container.push(element);
        if (container.length >= HashContainerConst.treeifyThreshold) {
          this._hashTable[index] = new OrderedSet<K>(container, this._cmp);
        }
        this._length += 1;
      } else {
        const preSize = container.length;
        (container as OrderedSet<K>).insert(element);
        const curSize = container.length;
        this._length += curSize - preSize;
      }
    }
  }
  eraseElementByKey(key: K) {
    const index = this._hashFunc(key) & HashContainerConst.maxBucketNum;
    const container = this._hashTable[index];
    if (!container) return;
    const preSize = container.length;
    if (preSize === 0) return;
    if (container instanceof Array) {
      this._hashTable[index] = container.filter(element => element !== key);
      const curSize = this._hashTable[index].length;
      this._length += curSize - preSize;
    } else {
      (container as OrderedSet<K>).eraseElementByKey(key);
      const curSize = container.length;
      this._length += curSize - preSize;
      if (curSize <= HashContainerConst.untreeifyThreshold) {
        this._hashTable[index] = Array.from(container);
      }
    }
  }
  find(key: K) {
    const index = this._hashFunc(key) & HashContainerConst.maxBucketNum;
    const container = this._hashTable[index];
    if (!container) return false;
    if (container instanceof Array) {
      return container.indexOf(key) >= 0;
    }
    return !container.find(key).equals(container.end());
  }
  [Symbol.iterator]() {
    return function * (this: HashSet<K>) {
      const containers = Object.values(this._hashTable);
      const containersNum = containers.length;
      for (let i = 0; i < containersNum; ++i) {
        yield * containers[i];
      }
    }.bind(this)();
  }
}

export default HashSet;
