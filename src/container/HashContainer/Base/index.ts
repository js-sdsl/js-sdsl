import { Base } from '@/container/ContainerBase/index';
import { ContainerInitError } from '@/utils/error';

abstract class HashContainerBase<K> extends Base {
  protected static maxBucketNum: number = (1 << 30);
  protected static initBucketNum: number = (1 << 4);
  protected static sigma = 0.75;
  protected static treeifyThreshold = 8;
  protected static untreeifyThreshold = 6;
  protected static minTreeifySize = 64;
  protected initBucketNum: number;
  protected bucketNum: number;
  protected hashFunc: (x: K) => number;
  constructor(
    initBucketNum = HashContainerBase.initBucketNum,
    hashFunc: (x: K) => number =
    (x: K) => {
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
    }) {
    super();
    if ((initBucketNum & (initBucketNum - 1)) !== 0) {
      throw new ContainerInitError('initBucketNum must be 2 to the power of n');
    }
    this.initBucketNum = Math.max(initBucketNum, HashContainerBase.initBucketNum);
    this.bucketNum = this.initBucketNum;
    this.hashFunc = hashFunc;
  }
}

export default HashContainerBase;
