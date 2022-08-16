import { initContainer } from '@/container/ContainerBase/index';
import OrderedSet from '../TreeContainer/OrderedSet';
import LinkList from '../SequentialContainer/LinkList';
import { checkUndefinedParams } from '@/utils/checkParams';
import HashContainerBase from './Base/index';

class HashSet<K> extends HashContainerBase<K> {
  private hashTable: (LinkList<K> | OrderedSet<K>)[] = [];
  constructor(
    container: initContainer<K> = [],
    initBucketNum?: number,
    hashFunc?: (x: K) => number
  ) {
    super(initBucketNum, hashFunc);
    container.forEach(element => this.insert(element));
  }
  private reAllocate(originalBucketNum: number) {
    if (originalBucketNum >= HashSet.maxBucketNum) return;
    const newHashTable: (LinkList<K> | OrderedSet<K>)[] = [];
    this.bucketNum = originalBucketNum << 1;
    for (let index = 0; index < originalBucketNum; ++index) {
      const container = this.hashTable[index];
      if (!container || container.empty()) continue;
      if (container instanceof LinkList && container.size() === 1) {
        const element = container.front() as K;
        newHashTable[this.hashFunc(element) & (this.bucketNum - 1)] = new LinkList<K>([element]);
      } else if (container instanceof OrderedSet) {
        const lowList: K[] = [];
        const highList: K[] = [];
        container.forEach(element => {
          const hashCode = this.hashFunc(element);
          if ((hashCode & originalBucketNum) === 0) {
            lowList.push(element);
          } else highList.push(element);
        });
        if (lowList.length > HashSet.untreeifyThreshold) {
          newHashTable[index] = new OrderedSet(lowList);
        } else if (lowList.length) {
          newHashTable[index] = new LinkList(lowList);
        }
        if (highList.length > HashSet.untreeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedSet(highList);
        } else if (highList.length) {
          newHashTable[index + originalBucketNum] = new LinkList(highList);
        }
      } else {
        const lowList: K[] = [];
        const highList: K[] = [];
        container.forEach(element => {
          const hashCode = this.hashFunc(element);
          if ((hashCode & originalBucketNum) === 0) {
            lowList.push(element);
          } else highList.push(element);
        });
        if (lowList.length >= HashSet.treeifyThreshold) {
          newHashTable[index] = new OrderedSet<K>(lowList);
        } else if (lowList.length) {
          newHashTable[index] = new LinkList(lowList);
        }
        if (highList.length >= HashSet.treeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedSet(highList);
        } else if (highList.length) {
          newHashTable[index + originalBucketNum] = new LinkList(highList);
        }
      }
      container.clear();
    }
    this.hashTable = newHashTable;
  }
  clear() {
    this.length = 0;
    this.bucketNum = this.initBucketNum;
    this.hashTable = [];
  }
  forEach(callback: (element: K, index: number) => void) {
    let index = 0;
    for (let i = 0; i < this.bucketNum; ++i) {
      if (!this.hashTable[i]) continue;
      this.hashTable[i].forEach(element => callback(element, index++));
    }
  }
  /**
   * Inserts element to Set.
   */
  insert(element: K) {
    checkUndefinedParams(element);
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) {
      this.hashTable[index] = new LinkList<K>([element]);
      this.length += 1;
    } else {
      const preSize = this.hashTable[index].size();
      if (this.hashTable[index] instanceof LinkList) {
        if (!(this.hashTable[index] as LinkList<K>).find(element)
          .equals((this.hashTable[index] as LinkList<K>).end())) return;
        (this.hashTable[index] as LinkList<K>).pushBack(element);
        if (this.bucketNum <= HashSet.minTreeifySize) {
          this.length += 1;
          this.reAllocate(this.bucketNum);
          return;
        } else if (this.hashTable[index].size() >= HashSet.treeifyThreshold) {
          this.hashTable[index] = new OrderedSet<K>(this.hashTable[index]);
        }
      } else (this.hashTable[index] as OrderedSet<K>).insert(element);
      const curSize = this.hashTable[index].size();
      this.length += curSize - preSize;
    }
    if (this.length > this.bucketNum * HashSet.sigma) {
      this.reAllocate(this.bucketNum);
    }
  }
  /**
   * Removes the elements of the specified value.
   */
  eraseElementByKey(element: K) {
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) return;
    const preSize = this.hashTable[index].size();
    if (this.hashTable[index] instanceof LinkList) {
      (this.hashTable[index] as LinkList<K>).eraseElementByValue(element);
    } else {
      (this.hashTable[index] as OrderedSet<K>).eraseElementByKey(element);
    }
    if (this.hashTable[index] instanceof OrderedSet) {
      if (this.hashTable[index].size() <= HashSet.untreeifyThreshold) {
        this.hashTable[index] = new LinkList<K>(this.hashTable[index]);
      }
    }
    const curSize = this.hashTable[index].size();
    this.length += curSize - preSize;
  }
  /**
   * @return If the specified element in the HashSet.
   */
  find(element: K) {
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) return false;
    return !(this.hashTable[index] as LinkList<K>).find(element)
      .equals((this.hashTable[index] as LinkList<K>).end());
  }
  /**
   * Using for 'for...of' syntax like Array.
   */
  [Symbol.iterator]() {
    return function * (this: HashSet<K>) {
      let index = 0;
      while (index < this.bucketNum) {
        while (index < this.bucketNum && !this.hashTable[index]) index += 1;
        if (index >= this.bucketNum) break;
        for (const element of this.hashTable[index]) yield element;
        index += 1;
      }
    }.bind(this)();
  }
}

export default HashSet;
