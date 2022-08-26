import { Base, initContainer } from '@/container/ContainerBase/index';

class PriorityQueue<T> extends Base {
  private readonly priorityQueue: T[];
  private readonly cmp: (x: T, y: T) => number;
  /**
   *
   * @param container initialize container, must have a forEach function
   * @param cmp compare function
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
    for (let parent = (this.length - 1) >> 1; parent >= 0; --parent) {
      let curParent = parent;
      let curChild = (curParent << 1) | 1;
      while (curChild < this.length) {
        const left = curChild;
        const right = left + 1;
        let minChild = left;
        if (
          right < this.length &&
          this.cmp(this.priorityQueue[left], this.priorityQueue[right]) > 0
        ) {
          minChild = right;
        }
        if (this.cmp(this.priorityQueue[curParent], this.priorityQueue[minChild]) <= 0) break;
        [this.priorityQueue[curParent], this.priorityQueue[minChild]] =
          [this.priorityQueue[minChild], this.priorityQueue[curParent]];
        curParent = minChild;
        curChild = (curParent << 1) | 1;
      }
    }
  }
  private adjust(parent: number) {
    const left = (parent << 1) | 1;
    const right = (parent << 1) + 2;
    if (
      left < this.length &&
      this.cmp(this.priorityQueue[parent], this.priorityQueue[left]) > 0
    ) {
      [this.priorityQueue[parent], this.priorityQueue[left]] =
        [this.priorityQueue[left], this.priorityQueue[parent]];
    }
    if (right < this.length &&
      this.cmp(this.priorityQueue[parent], this.priorityQueue[right]) > 0
    ) {
      [this.priorityQueue[parent], this.priorityQueue[right]] =
        [this.priorityQueue[right], this.priorityQueue[parent]];
    }
  }
  clear() {
    this.length = 0;
    this.priorityQueue.length = 0;
  }
  /**
   * Insert elements into a container in order.
   */
  push(element: T) {
    this.priorityQueue.push(element);
    this.length += 1;
    if (this.length === 1) return;
    let curNode = this.length - 1;
    while (curNode > 0) {
      const parent = (curNode - 1) >> 1;
      if (this.cmp(this.priorityQueue[parent], element) <= 0) break;
      this.adjust(parent);
      curNode = parent;
    }
  }
  /**
   * Removes the top element.
   */
  pop() {
    if (!this.length) return;
    const last = this.priorityQueue[this.length - 1];
    this.length -= 1;
    let parent = 0;
    while (parent < this.length) {
      const left = (parent << 1) | 1;
      const right = (parent << 1) + 2;
      if (left >= this.length) break;
      let minChild = left;
      if (
        right < this.length &&
        this.cmp(this.priorityQueue[left], this.priorityQueue[right]) > 0
      ) {
        minChild = right;
      }
      if (this.cmp(this.priorityQueue[minChild], last) >= 0) break;
      this.priorityQueue[parent] = this.priorityQueue[minChild];
      parent = minChild;
    }
    this.priorityQueue[parent] = last;
    this.priorityQueue.pop();
  }
  /**
   * Accesses the top element.
   */
  top() {
    return this.priorityQueue[0] as (T | undefined);
  }
}

export default PriorityQueue;
