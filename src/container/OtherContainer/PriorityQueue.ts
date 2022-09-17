import { Base, initContainer } from '@/container/ContainerBase/index';

class PriorityQueue<T> extends Base {
  private readonly priorityQueue: T[];
  private readonly cmp: (x: T, y: T) => number;
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
    }, copy = true) {
    super();
    this.cmp = cmp;
    if (Array.isArray(container)) {
      this.priorityQueue = copy ? [...container] : container;
    } else {
      this.priorityQueue = [];
      container.forEach(element => this.priorityQueue.push(element));
    }
    this.length = this.priorityQueue.length;
    const halfLength = this.length >> 1;
    for (let parent = (this.length - 1) >> 1; parent >= 0; --parent) {
      let curParent = parent;
      const item = this.priorityQueue[curParent];
      while (curParent < halfLength) {
        let left = curParent << 1 | 1;
        const right = left + 1;
        let minItem = this.priorityQueue[left];
        if (
          right < this.length &&
          this.cmp(minItem, this.priorityQueue[right]) > 0
        ) {
          left = right;
          minItem = this.priorityQueue[right];
        }
        if (this.cmp(minItem, item) >= 0) break;
        this.priorityQueue[curParent] = minItem;
        curParent = left;
      }
      this.priorityQueue[curParent] = item;
    }
  }
  clear() {
    this.length = 0;
    this.priorityQueue.length = 0;
  }
  /**
   * @description Push element into a container in order.
   * @param element The element you want to push.
   */
  push(element: T) {
    let curNode = this.length;
    this.length += 1;
    this.priorityQueue.push(element);
    while (curNode > 0) {
      const parent = (curNode - 1) >> 1;
      const parentItem = this.priorityQueue[parent];
      if (this.cmp(parentItem, element) <= 0) break;
      this.priorityQueue[curNode] = parentItem;
      curNode = parent;
    }
    this.priorityQueue[curNode] = element;
  }
  /**
   * @description Removes the top element.
   */
  pop() {
    if (!this.length) return;
    const last = this.priorityQueue.pop() as T;
    this.length -= 1;
    if (!this.length) return;
    let parent = 0;
    const halfLength = this.length >> 1;
    while (parent < halfLength) {
      let left = parent << 1 | 1;
      const right = left + 1;
      let minItem = this.priorityQueue[left];
      const rightItem = this.priorityQueue[right];
      if (
        right < this.length &&
        this.cmp(minItem, rightItem) > 0
      ) {
        left = right;
        minItem = rightItem;
      }
      if (this.cmp(minItem, last) >= 0) break;
      this.priorityQueue[parent] = minItem;
      parent = left;
    }
    this.priorityQueue[parent] = last;
  }
  /**
   * @description Accesses the top element.
   */
  top() {
    return this.priorityQueue[0] as (T | undefined);
  }
}

export default PriorityQueue;
