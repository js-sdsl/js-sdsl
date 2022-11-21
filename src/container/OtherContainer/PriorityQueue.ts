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
   * @param container - Initialize container, must have a forEach function.
   * @param cmp - Compare function.
   * @param copy - When the container is an array, you can choose to directly operate on the original object of
   *               the array or perform a shallow copy. The default is shallow copy.
   * @example
   * new PriorityQueue();
   * new PriorityQueue([1, 2, 3]);
   * new PriorityQueue([1, 2, 3], (x, y) => x - y);
   * new PriorityQueue([1, 2, 3], (x, y) => x - y, false);
   */
  constructor(
    container: initContainer<T> = [],
    cmp: (x: T, y: T) => number =
    function (x: T, y: T) {
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
      const self = this;
      container.forEach(function (el) {
        self._priorityQueue.push(el);
      });
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
   * @param item - The element you want to push.
   * @returns The size of heap after pushing.
   * @example
   * queue.push(1);
   */
  push(item: T) {
    this._priorityQueue.push(item);
    this._pushUp(this._length);
    this._length += 1;
  }
  /**
   * @description Removes the top element.
   * @returns The element you popped.
   * @example
   * queue.pop();
   */
  pop() {
    if (this._length === 0) return;
    const value = this._priorityQueue[0];
    const last = this._priorityQueue.pop()!;
    this._length -= 1;
    if (this._length) {
      this._priorityQueue[0] = last;
      this._pushDown(0, this._length >> 1);
    }
    return value;
  }
  /**
   * @description Accesses the top element.
   * @example
   * const top = queue.top();
   */
  top(): T | undefined {
    return this._priorityQueue[0];
  }
  /**
   * @description Check if element is in heap.
   * @param item - The item want to find.
   * @returns Whether element is in heap.
   * @example
   * const que = new PriorityQueue([], (x, y) => x.id - y.id);
   * const obj = { id: 1 };
   * que.push(obj);
   * console.log(que.find(obj));  // true
   */
  find(item: T) {
    return this._priorityQueue.indexOf(item) >= 0;
  }
  /**
   * @description Remove specified item from heap.
   * @param item - The item want to remove.
   * @returns Whether remove success.
   * @example
   * const que = new PriorityQueue([], (x, y) => x.id - y.id);
   * const obj = { id: 1 };
   * que.push(obj);
   * que.remove(obj);
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
      this._priorityQueue.splice(index, 1, this._priorityQueue.pop()!);
      this._length -= 1;
      this._pushUp(index);
      this._pushDown(index, this._length >> 1);
    }
    return true;
  }
  /**
   * @description Update item and it's pos in the heap.
   * @param item - The item want to update.
   * @returns Whether update success.
   * @example
   * const que = new PriorityQueue([], (x, y) => x.id - y.id);
   * const obj = { id: 1 };
   * que.push(obj);
   * obj.id = 2;
   * que.updateItem(obj);
   */
  updateItem(item: T) {
    const index = this._priorityQueue.indexOf(item);
    if (index < 0) return false;
    this._pushUp(index);
    this._pushDown(index, this._length >> 1);
    return true;
  }
  /**
   * @returns Return a copy array of heap.
   * @example
   * const arr = queue.toArray();
   */
  toArray() {
    return [...this._priorityQueue];
  }
}

export default PriorityQueue;
