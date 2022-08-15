import { Base, initContainer } from '@/container/ContainerBase/index';

class PriorityQueue<T> extends Base {
  private priorityQueue: T[] = [];
  private cmp: (x: T, y: T) => number;
  constructor(container: initContainer<T> = [],
    cmp: (x: T, y: T) => number = (x: T, y: T) => {
      if (x > y) return -1;
      if (x < y) return 1;
      return 0;
    }) {
    super();
    this.cmp = cmp;
    container.forEach(element => this.priorityQueue.push(element));
    this.length = this.priorityQueue.length;
    for (let parent = Math.floor((this.length - 1) / 2); parent >= 0; --parent) {
      let curParent = parent;
      let curChild = curParent * 2 + 1;
      while (curChild < this.length) {
        const leftChild = curChild;
        const rightChild = leftChild + 1;
        let minChild = leftChild;
        if (
          rightChild < this.length &&
          this.cmp(this.priorityQueue[leftChild], this.priorityQueue[rightChild]) > 0
        ) {
          minChild = rightChild;
        }
        if (this.cmp(this.priorityQueue[curParent], this.priorityQueue[minChild]) <= 0) break;
        this.swap(curParent, minChild);
        curParent = minChild;
        curChild = curParent * 2 + 1;
      }
    }
  }
  private swap(x: number, y: number) {
    const tmp = this.priorityQueue[x];
    this.priorityQueue[x] = this.priorityQueue[y];
    this.priorityQueue[y] = tmp;
  }
  private adjust(parent: number) {
    const leftChild = parent * 2 + 1;
    const rightChild = parent * 2 + 2;
    if (
      leftChild < this.length &&
      this.cmp(this.priorityQueue[parent], this.priorityQueue[leftChild]) > 0
    ) {
      this.swap(parent, leftChild);
    }
    if (rightChild < this.length &&
      this.cmp(this.priorityQueue[parent], this.priorityQueue[rightChild]) > 0
    ) {
      this.swap(parent, rightChild);
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
      const parent = Math.floor((curNode - 1) / 2);
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
    if (this.length === 1) {
      this.length -= 1;
      return;
    }
    const last = this.priorityQueue[this.length - 1];
    this.length -= 1;
    let parent = 0;
    while (parent < this.length) {
      const leftChild = parent * 2 + 1;
      const rightChild = parent * 2 + 2;
      if (leftChild >= this.length) break;
      let minChild = leftChild;
      if (
        rightChild < this.length &&
        this.cmp(this.priorityQueue[leftChild], this.priorityQueue[rightChild]) > 0
      ) {
        minChild = rightChild;
      }
      if (this.cmp(this.priorityQueue[minChild], last) >= 0) break;
      this.priorityQueue[parent] = this.priorityQueue[minChild];
      parent = minChild;
    }
    this.priorityQueue[parent] = last;
  }
  /**
   * Accesses the top element.
   */
  top() {
    return this.priorityQueue[0];
  }
}

export default PriorityQueue;
