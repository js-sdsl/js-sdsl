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
    this.bucketNum = originalBucketNum * 2;
    const newHashTable: (LinkList<K> | OrderedSet<K>)[] = [];
    this.hashTable.forEach((container, index) => {
      if (container.empty()) return;
      if (container instanceof LinkList && container.size() === 1) {
        const element = container.front() as K;
        newHashTable[this.hashFunc(element) & (this.bucketNum - 1)] = new LinkList<K>([element]);
      } else if (container instanceof OrderedSet) {
        const lowList: LinkList<K> = new LinkList<K>();
        const highList: LinkList<K> = new LinkList<K>();
        container.forEach(element => {
          const hashCode = this.hashFunc(element);
          if ((hashCode & originalBucketNum) === 0) {
            lowList.pushBack(element);
          } else highList.pushBack(element);
        });
        if (lowList.size() > HashSet.untreeifyThreshold) {
          newHashTable[index] = new OrderedSet<K>(lowList);
        } else if (lowList.size()) {
          newHashTable[index] = lowList;
        }
        if (highList.size() > HashSet.untreeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedSet<K>(highList);
        } else if (highList.size()) {
          newHashTable[index + originalBucketNum] = highList;
        }
      } else {
        const lowList = new LinkList<K>();
        const highList = new LinkList<K>();
        container.forEach(element => {
          const hashCode = this.hashFunc(element);
          if ((hashCode & originalBucketNum) === 0) {
            lowList.pushBack(element);
          } else highList.pushBack(element);
        });
        if (lowList.size() >= HashSet.treeifyThreshold) {
          newHashTable[index] = new OrderedSet<K>(lowList);
        } else if (lowList.size()) {
          newHashTable[index] = lowList;
        }
        if (highList.size() >= HashSet.treeifyThreshold) {
          newHashTable[index + originalBucketNum] = new OrderedSet<K>(highList);
        } else if (highList.size()) {
          newHashTable[index + originalBucketNum] = highList;
        }
      }
      this.hashTable[index].clear();
    });
    this.hashTable = newHashTable;
  }
  clear() {
    this.length = 0;
    this.bucketNum = this.initBucketNum;
    this.hashTable = [];
  }
  forEach(callback: (element: K, index: number) => void) {
    let index = 0;
    this.hashTable.forEach(container => {
      container.forEach(element => {
        callback(element, index++);
      });
    });
  }
  /**
   * Inserts element to Set.
   */
  insert(element: K) {
    checkUndefinedParams(element);
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) {
      this.hashTable[index] = new LinkList<K>([element]);
      ++this.length;
    } else {
      const preSize = this.hashTable[index].size();
      if (this.hashTable[index] instanceof LinkList) {
        if (!(this.hashTable[index] as LinkList<K>).find(element)
          .equals((this.hashTable[index] as LinkList<K>).end())) return;
        (this.hashTable[index] as LinkList<K>).pushBack(element);
        if (this.bucketNum <= HashSet.minTreeifySize) {
          ++this.length;
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
        while (index < this.bucketNum && !this.hashTable[index]) ++index;
        if (index >= this.bucketNum) break;
        for (const element of this.hashTable[index]) yield element;
        ++index;
      }
    }.bind(this)();
  }
}

export default HashSet;
