import { Base, initContainer } from '@/container/ContainerBase';

class PriorityQueue<T> extends Base {
  /**
   * @internal
   */
  private readonly _priorityQueue: T[];
  /**
   * @internal
   */
  private readonly _cmp: (x: T, y: T) => number;
  /**
   * @description PriorityQueue's constructor.
   * @param container Initialize container, must have a forEach function.
   * @param cmp Compare function.
   * @param copy When the container is an array, you can choose to directly operate on the original object of
   *             the array or perform a shallow copy. The default is shallow copy.
   */
  constructor(
    container: initContainer<T> = [],
    cmp: (x: T, y: T) => number =
    (x: T, y: T) => {
      if (x > y) return -1;
      if (x < y) return 1;
      return 0;
    },
    copy = true
  ) {
    super();
    this._cmp = cmp;
    if (Array.isArray(container)) {
      this._priorityQueue = copy ? [...container] : container;
    } else {
      this._priorityQueue = [];
      container.forEach(element => this._priorityQueue.push(element));
    }
    this._length = this._priorityQueue.length;
    const halfLength = this._length >> 1;
    for (let parent = (this._length - 1) >> 1; parent >= 0; --parent) {
      this._pushDown(parent, halfLength);
    }
  }
  /**
   * @internal
   */
  private _pushUp(pos: number) {
    const item = this._priorityQueue[pos];
    while (pos > 0) {
      const parent = (pos - 1) >> 1;
      const parentItem = this._priorityQueue[parent];
      if (this._cmp(parentItem, item) <= 0) break;
      this._priorityQueue[pos] = parentItem;
      pos = parent;
    }
    this._priorityQueue[pos] = item;
  }
  /**
   * @internal
   */
  private _pushDown(pos: number, halfLength: number) {
    const item = this._priorityQueue[pos];
    while (pos < halfLength) {
      let left = pos << 1 | 1;
      const right = left + 1;
      let minItem = this._priorityQueue[left];
      if (
        right < this._length &&
        this._cmp(minItem, this._priorityQueue[right]) > 0
      ) {
        left = right;
        minItem = this._priorityQueue[right];
      }
      if (this._cmp(minItem, item) >= 0) break;
      this._priorityQueue[pos] = minItem;
      pos = left;
    }
    this._priorityQueue[pos] = item;
  }
  clear() {
    this._length = 0;
    this._priorityQueue.length = 0;
  }
  /**
   * @description Push element into a container in order.
   * @param item The element you want to push.
   */
  push(item: T) {
    this._priorityQueue.push(item);
    this._pushUp(this._length);
    this._length += 1;
  }
  /**
   * @description Removes the top element.
   */
  pop() {
    if (!this._length) return;
    const last = this._priorityQueue.pop() as T;
    this._length -= 1;
    if (this._length) {
      this._priorityQueue[0] = last;
      this._pushDown(0, this._length >> 1);
    }
  }
  /**
   * @description Accesses the top element.
   */
  top() {
    return this._priorityQueue[0] as (T | undefined);
  }
  /**
   * @description Check if element is in heap.
   * @param item The item want to find.
   * @return Boolean about if element is in heap.
   */
  find(item: T) {
    return this._priorityQueue.indexOf(item) >= 0;
  }
  /**
   * @description Remove specified item from heap.
   * @param item The item want to remove.
   * @return Boolean about if remove success.
   */
  remove(item: T) {
    const index = this._priorityQueue.indexOf(item);
    if (index < 0) return false;
    if (index === 0) {
      this.pop();
    } else if (index === this._length - 1) {
      this._priorityQueue.pop();
      this._length -= 1;
    } else {
      this._priorityQueue.splice(index, 1, this._priorityQueue.pop() as T);
      this._length -= 1;
      this._pushUp(index);
      this._pushDown(index, this._length >> 1);
    }
    return true;
  }
  /**
   * @description Update item and it's pos in the heap.
   * @param item The item want to update.
   * @return Boolean about if update success.
   */
  updateItem(item: T) {
    const index = this._priorityQueue.indexOf(item);
    if (index < 0) return false;
    this._pushUp(index);
    this._pushDown(index, this._length >> 1);
    return true;
  }
  /**
   * @return Return a copy array of heap.
   */
  toArray() {
    return [...this._priorityQueue];
  }
}

export default PriorityQueue;
