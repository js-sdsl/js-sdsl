import HashContainer, { HashContainerConst } from './Base';
import Vector from '@/container/SequentialContainer/Vector';
import OrderedSet from '@/container/TreeContainer/OrderedSet';
import { Container, initContainer } from '@/container/ContainerBase';

class HashSet<K> extends HashContainer<K> {
  /**
   * @internal
   */
  protected _hashTable: (Vector<K> | OrderedSet<K>)[] = [];
  constructor(
    container: initContainer<K> = [],
    initBucketNum?: number,
    _hashFunc?: (x: K) => number
  ) {
    super(initBucketNum, _hashFunc);
    container.forEach(element => this.insert(element));
  }
  /**
   * @internal
   */
  protected _reAllocate() {
    if (this._bucketNum >= HashContainerConst.maxBucketNum) return;
    const newHashTable: (Vector<K> | OrderedSet<K>)[] = [];
    const originalBucketNum = this._bucketNum;
    this._bucketNum <<= 1;
    const keys = Object.keys(this._hashTable);
    const keyNums = keys.length;
    for (let i = 0; i < keyNums; ++i) {
      const index = parseInt(keys[i]);
      const container = this._hashTable[index];
      const size = container.size();
      if (size === 0) continue;
      if (size === 1) {
        const element = container.front() as K;
        newHashTable[
          this._hashFunc(element) & (this._bucketNum - 1)
        ] = new Vector([element], false);
        continue;
      }
      const lowList: K[] = [];
      const highList: K[] = [];
      container.forEach(element => {
        const hashCode = this._hashFunc(element);
        if ((hashCode & originalBucketNum) === 0) {
          lowList.push(element);
        } else highList.push(element);
      });
      if (container instanceof OrderedSet) {
        if (lowList.length > HashContainerConst.untreeifyThreshold) {
          newHashTable[index] = new OrderedSet(lowList);
        } else {
          newHashTable[index] = new Vector(lowList, false);
        }
        if (highList.length > HashContainerConst.untreeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedSet(highList);
        } else {
          newHashTable[index + originalBucketNum] = new Vector(highList, false);
        }
      } else {
        newHashTable[index] = new Vector(lowList, false);
        newHashTable[index + originalBucketNum] = new Vector(highList, false);
      }
    }
    this._hashTable = newHashTable;
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
    const index = this._hashFunc(element) & (this._bucketNum - 1);
    const container = this._hashTable[index];
    if (!container) {
      this._hashTable[index] = new Vector<K>([element], false);
      this._length += 1;
    } else {
      const preSize = container.size();
      if (container instanceof Vector) {
        if (!(container as Vector<K>).find(element)
          .equals((container as Vector<K>).end())) return;
        (container as Vector<K>).pushBack(element);
        if (preSize + 1 >= HashContainerConst.treeifyThreshold) {
          if (this._bucketNum <= HashContainerConst.minTreeifySize) {
            this._length += 1;
            this._reAllocate();
            return;
          }
          this._hashTable[index] = new OrderedSet<K>(container);
        }
        this._length += 1;
      } else {
        (container as OrderedSet<K>).insert(element);
        const curSize = container.size();
        this._length += curSize - preSize;
      }
    }
    if (this._length > this._bucketNum * HashContainerConst.sigma) {
      this._reAllocate();
    }
  }
  eraseElementByKey(key: K) {
    const index = this._hashFunc(key) & (this._bucketNum - 1);
    const container = this._hashTable[index];
    if (!container) return;
    const preSize = container.size();
    if (preSize === 0) return;
    if (container instanceof Vector) {
      (container as Vector<K>).eraseElementByValue(key);
      const curSize = container.size();
      this._length += curSize - preSize;
    } else {
      (container as OrderedSet<K>).eraseElementByKey(key);
      const curSize = container.size();
      this._length += curSize - preSize;
      if (curSize <= HashContainerConst.untreeifyThreshold) {
        this._hashTable[index] = new Vector<K>(container);
      }
    }
  }
  find(element: K) {
    const index = this._hashFunc(element) & (this._bucketNum - 1);
    const container = this._hashTable[index];
    if (!container) return false;
    return !(container as Container<K>).find(element)
      .equals((container as Container<K>).end());
  }
  [Symbol.iterator]() {
    return function * (this: HashSet<K>) {
      const containers = Object.values(this._hashTable);
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

export default HashSet;
