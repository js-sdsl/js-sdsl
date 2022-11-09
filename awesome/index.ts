import { OrderedMap, OrderedMapIterator } from '@/index';

class OrderedMapWithRollback<K, V> extends OrderedMap<K, V> {
  private isRecording = false;
  private recordNow: ([K, V] | K)[] = [];
  private recordAll: ([K, V] | K)[][] = [];
  private endIter: OrderedMapIterator<K, V> = super.end();
  setElement(key: K, value: V) {
    this.recordNow.push(key);
    super.setElement(key, value);
  }
  eraseElementByKey(key: K) {
    const iter = super.find(key);
    if (iter.equals(this.endIter)) return;
    const pointer = iter.pointer;
    this.recordNow.push([pointer[0], pointer[1]]);
    super.eraseElementByIterator(iter);
  }
  startRecord() {
    if (this.isRecording) return;
    this.isRecording = true;
    this.recordNow = [];
  }
  endRecord() {
    if (!this.isRecording) return;
    this.isRecording = false;
    this.recordAll.push(this.recordNow);
  }
  rollback(depth = 1) {
    if (depth <= 0 || this.recordAll.length < depth) {
      throw new RangeError();
    }
    while (depth--) {
      const record = this.recordAll.pop()!;
      for (const op of record) {
        if (Array.isArray(op)) {
          super.setElement(op[0], op[1]);
        } else super.eraseElementByKey(op);
      }
    }
  }
}

export default OrderedMapWithRollback;
