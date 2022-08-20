import { Base } from '@/container/ContainerBase/index';

abstract class HashContainerBase<K> extends Base {
  protected static sigma = 0.75;
  protected static treeifyThreshold = 8;
  protected static untreeifyThreshold = 6;
  protected static minTreeifySize = 64;
  protected static maxBucketNum: number = (1 << 30);
  protected bucketNum: number;
  protected initBucketNum: number;
  protected hashFunc: (x: K) => number;
  protected constructor(
    initBucketNum = 16,
    hashFunc: (x: K) => number =
    (x: K) => {
      let hashCode = 0;
      let str: string;
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
    if (initBucketNum < 16 || (initBucketNum & (initBucketNum - 1)) !== 0) {
      throw new RangeError('InitBucketNum range error');
    }
    this.bucketNum = this.initBucketNum = initBucketNum;
    this.hashFunc = hashFunc;
  }
}

export default HashContainerBase;
