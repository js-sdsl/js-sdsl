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
      let str;
      if (typeof x === 'number') {
        if (x === parseInt(x as unknown as string)) {
          return ((x << 5) | 0) >>> 0;
        }
        str = x.toFixed(6);
      } else if (typeof x !== 'string') {
        str = JSON.stringify(x);
      } else str = x;
      let hashCode = 0;
      const strLength = str.length;
      for (let i = 0; i < strLength; i++) {
        const ch = str.charCodeAt(i);
        hashCode = ((hashCode << 5) - hashCode) + ch;
        hashCode |= 0;
      }
      return hashCode >>> 0;
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
