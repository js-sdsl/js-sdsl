import { OrderedMap } from '@/index';

class OrderedMapWithRollback<K, V> extends OrderedMap<K, V> {
  private isRecording = false;
  private recordNow: ([K, V] | K)[] = [];
  private recordAll: ([K, V] | K)[][] = [];
  setElement(key: K, value: V) {
    this.recordNow.push(key);
    super.setElement(key, value);
  }
  eraseElementByKey(key: K) {
    const value = super.getElementByKey(key);
    if (value === undefined) return;
    this.recordNow.push([key, value]);
    super.eraseElementByKey(key);
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
