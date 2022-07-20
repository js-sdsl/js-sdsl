import { Base, initContainer } from '@/types/interface';
import OrderedSet from '../TreeContainer/OrderedSet';
import LinkList from '../SequentialContainer/LinkList';
import { checkUndefinedParams } from '@/utils/checkParams';
import { ContainerInitError, InternalError } from '@/types/error';

class HashSet<T> implements Base {
  private static initSize: number = (1 << 4);
  private static maxSize: number = (1 << 30);
  private static sigma = 0.75;
  private static treeifyThreshold = 8;
  private static untreeifyThreshold = 6;
  private static minTreeifySize = 64;
  private length = 0;
  private initBucketNum: number;
  private bucketNum: number;
  private hashFunc: (x: T) => number;
  private hashTable: (LinkList<T> | OrderedSet<T>)[] = [];
  constructor(container: initContainer<T> = [], initBucketNum = HashSet.initSize, hashFunc?: (x: T) => number) {
    if ((initBucketNum & (initBucketNum - 1)) !== 0) {
      throw new ContainerInitError('initBucketNum must be 2 to the power of n');
    }
    this.initBucketNum = initBucketNum;
    this.bucketNum = Math.max(HashSet.initSize, Math.min(HashSet.maxSize, this.initBucketNum));
    this.hashFunc = hashFunc ?? ((x: T) => {
      let hashCode = 0;
      let str = '';
      if (typeof x !== 'string') {
        str = JSON.stringify(x);
      } else str = x;
      for (let i = 0; i < str.length; i++) {
        const character = str.charCodeAt(i);
        hashCode = ((hashCode << 5) - hashCode) + character;
        hashCode = hashCode & hashCode;
      }
      hashCode ^= (hashCode >>> 16);
      return hashCode;
    });
    container.forEach(element => this.insert(element));
  }
  private reAllocate(originalBucketNum: number) {
    if (originalBucketNum >= HashSet.maxSize) return;
    this.bucketNum = originalBucketNum * 2;
    const newHashTable: (LinkList<T> | OrderedSet<T>)[] = [];
    this.hashTable.forEach((container, index) => {
      if (container.empty()) return;
      if (container instanceof LinkList && container.size() === 1) {
        const element = container.front();
        if (element === undefined) throw new InternalError();
        newHashTable[this.hashFunc(element) & (this.bucketNum - 1)] = new LinkList<T>([element]);
      } else if (container instanceof OrderedSet) {
        const lowList: LinkList<T> = new LinkList<T>();
        const highList: LinkList<T> = new LinkList<T>();
        container.forEach(element => {
          const hashCode = this.hashFunc(element);
          if ((hashCode & originalBucketNum) === 0) {
            lowList.pushBack(element);
          } else highList.pushBack(element);
        });
        if (lowList.size() > HashSet.untreeifyThreshold) newHashTable[index] = new OrderedSet<T>(lowList);
        else if (lowList.size()) newHashTable[index] = lowList;
        if (highList.size() > HashSet.untreeifyThreshold) newHashTable[index + originalBucketNum] = new OrderedSet<T>(highList);
        else if (highList.size()) newHashTable[index + originalBucketNum] = highList;
      } else {
        const lowList = new LinkList<T>();
        const highList = new LinkList<T>();
        container.forEach(element => {
          const hashCode = this.hashFunc(element);
          if ((hashCode & originalBucketNum) === 0) {
            lowList.pushBack(element);
          } else highList.pushBack(element);
        });
        if (lowList.size()) newHashTable[index] = lowList;
        if (highList.size()) newHashTable[index + originalBucketNum] = highList;
      }
      this.hashTable[index].clear();
    });
    this.hashTable = newHashTable;
  }
  size() {
    return this.length;
  }
  empty() {
    return this.length === 0;
  }
  clear() {
    this.length = 0;
    this.bucketNum = this.initBucketNum;
    this.hashTable = [];
  }
  forEach(callback: (element: T, index: number) => void) {
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
  insert(element: T) {
    checkUndefinedParams(element);
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) {
      this.hashTable[index] = new LinkList<T>([element]);
      ++this.length;
    } else {
      const preSize = this.hashTable[index].size();
      if (this.hashTable[index] instanceof LinkList) {
        if (!this.hashTable[index].find(element).equals(this.hashTable[index].end())) return;
        (this.hashTable[index] as LinkList<T>).pushBack(element);
        if (this.bucketNum <= HashSet.minTreeifySize) {
          this.reAllocate(this.bucketNum);
        } else if (this.hashTable[index].size() >= HashSet.treeifyThreshold) {
          this.hashTable[index] = new OrderedSet<T>(this.hashTable[index]);
        }
      } else (this.hashTable[index] as OrderedSet<T>).insert(element);
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
  eraseElementByValue(element: T) {
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) return;
    const preSize = this.hashTable[index].size();
    this.hashTable[index].eraseElementByValue(element);
    if (this.hashTable[index] instanceof OrderedSet) {
      if (this.hashTable[index].size() <= HashSet.untreeifyThreshold) {
        this.hashTable[index] = new LinkList<T>(this.hashTable[index]);
      }
    }
    const curSize = this.hashTable[index].size();
    this.length += curSize - preSize;
  }
  /**
   * @return If the specified element in the HashSet.
   */
  find(element: T) {
    const index = this.hashFunc(element) & (this.bucketNum - 1);
    if (!this.hashTable[index]) return false;
    return !this.hashTable[index].find(element).equals(this.hashTable[index].end());
  }
  /**
   * Using for 'for...of' syntax like Array.
   */
  [Symbol.iterator]() {
    return function * (this: HashSet<T>) {
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
