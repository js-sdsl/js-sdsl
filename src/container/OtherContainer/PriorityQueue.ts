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
   * @param _cmp Compare function.
   * @param copy When the container is an array, you can choose to directly operate on the original object of
   *             the array or perform a shallow copy. The default is shallow copy.
   */
  constructor(
    container: initContainer<T> = [],
    _cmp: (x: T, y: T) => number =
    (x: T, y: T) => {
      if (x > y) return -1;
      if (x < y) return 1;
      return 0;
    },
    copy = true
  ) {
    super();
    this._cmp = _cmp;
    if (Array.isArray(container)) {
      this._priorityQueue = copy ? [...container] : container;
    } else {
      this._priorityQueue = [];
      container.forEach(element => this._priorityQueue.push(element));
    }
    this._length = this._priorityQueue.length;
    const halfLength = this._length >> 1;
    for (let parent = (this._length - 1) >> 1; parent >= 0; --parent) {
      let curParent = parent;
      const item = this._priorityQueue[curParent];
      while (curParent < halfLength) {
        let left = curParent << 1 | 1;
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
        this._priorityQueue[curParent] = minItem;
        curParent = left;
      }
      this._priorityQueue[curParent] = item;
    }
  }
  clear() {
    this._length = 0;
    this._priorityQueue.length = 0;
  }
  /**
   * @description Push element into a container in order.
   * @param element The element you want to push.
   */
  push(element: T) {
    let curNode = this._length;
    this._length += 1;
    this._priorityQueue.push(element);
    while (curNode > 0) {
      const parent = (curNode - 1) >> 1;
      const parentItem = this._priorityQueue[parent];
      if (this._cmp(parentItem, element) <= 0) break;
      this._priorityQueue[curNode] = parentItem;
      curNode = parent;
    }
    this._priorityQueue[curNode] = element;
  }
  /**
   * @description Removes the top element.
   */
  pop() {
    if (!this._length) return;
    const last = this._priorityQueue.pop() as T;
    this._length -= 1;
    if (!this._length) return;
    let parent = 0;
    const halfLength = this._length >> 1;
    while (parent < halfLength) {
      let left = parent << 1 | 1;
      const right = left + 1;
      let minItem = this._priorityQueue[left];
      const rightItem = this._priorityQueue[right];
      if (
        right < this._length &&
        this._cmp(minItem, rightItem) > 0
      ) {
        left = right;
        minItem = rightItem;
      }
      if (this._cmp(minItem, last) >= 0) break;
      this._priorityQueue[parent] = minItem;
      parent = left;
    }
    this._priorityQueue[parent] = last;
  }
  /**
   * @description Accesses the top element.
   */
  top() {
    return this._priorityQueue[0] as (T | undefined);
  }
}

export default PriorityQueue;
