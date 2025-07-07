import { Base, Entries } from '@/base';

const enum QUEUE_CONSTANT {
  ALLOCATE_SIGMA = 0.5,
  MIN_ALLOCATE_SIZE = (1 << 12)
}

class Queue<T> extends Base<T> {
  /**
   * @internal
   */
  private _first = 0;
  /**
   * @internal
   */
  private _queue: T[] = [];
  constructor(entries: Entries<T> = []) {
    super();
    const self = this;
    entries.forEach(function (el) {
      self.push(el);
    });
  }
  clear() {
    this._queue = [];
    this._length = this._first = 0;
  }
  /**
   * @description Inserts item to queue's end.
   * @param item - The item you want to push to the front.
   * @returns The container length after pushing.
   */
  push(item: T) {
    const capacity = this._queue.length;
    const firstIndex = this._first;
    const lastIndex = this._first + this._length;
    if (
      lastIndex >= capacity &&
      capacity > QUEUE_CONSTANT.MIN_ALLOCATE_SIZE &&
      (firstIndex / capacity) > QUEUE_CONSTANT.ALLOCATE_SIGMA
    ) {
      this._queue.copyWithin(0, firstIndex, lastIndex);
      this._first = 0;
      this._queue[this._length] = item;
    } else this._queue[lastIndex] = item;
    return ++this._length;
  }
  /**
   * @description Removes the first item.
   * @returns The item you popped.
   */
  unshift() {
    if (this._length === 0) return;
    const el = this._queue[this._first++];
    this._length -= 1;
    return el;
  }
  /**
   * @description Access the first item.
   * @returns The first item.
   */
  front(): T | undefined {
    if (this._length === 0) return;
    return this._queue[this._first];
  }
  toArray(): T[] {
    return this._queue.slice(this._first, this._first + this._length);
  }
}

export default Queue;
