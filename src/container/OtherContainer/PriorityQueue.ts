import { InternalError } from '@/types/error';
import { Base, initContainer } from '@/types/interface';

class PriorityQueue<T> implements Base {
  private length = 0;
  private priorityQueue: T[] = [];
  private cmp: (x: T, y: T) => number;
  constructor(container: initContainer<T> = [], cmp?: (x: T, y: T) => number) {
    this.cmp = cmp ?? ((x: T, y: T) => {
      if (x > y) return -1;
      if (x < y) return 1;
      return 0;
    });
    container.forEach(element => this.priorityQueue.push(element));
    this.length = this.priorityQueue.length;
    for (let parent = Math.floor((this.length - 1) / 2); parent >= 0; --parent) {
      let curParent = parent;
      let curChild = curParent * 2 + 1;
      while (curChild < this.length) {
        const leftChild = curChild;
        const rightChild = leftChild + 1;
        let minChild = leftChild;
        if (rightChild < this.length && this.cmp(this.priorityQueue[leftChild], this.priorityQueue[rightChild]) > 0) minChild = rightChild;
        if (this.cmp(this.priorityQueue[curParent], this.priorityQueue[minChild]) <= 0) break;
        this.swap(curParent, minChild);
        curParent = minChild;
        curChild = curParent * 2 + 1;
      }
    }
  }
  private swap(x: number, y: number) {
    if (x < 0 || x >= this.length) throw new InternalError();
    if (y < 0 || y >= this.length) throw new InternalError();
    const tmp = this.priorityQueue[x];
    this.priorityQueue[x] = this.priorityQueue[y];
    this.priorityQueue[y] = tmp;
  }
  private adjust(parent: number) {
    if (parent < 0 || parent >= this.length) throw new InternalError();
    const leftChild = parent * 2 + 1;
    const rightChild = parent * 2 + 2;
    if (leftChild < this.length && this.cmp(this.priorityQueue[parent], this.priorityQueue[leftChild]) > 0) this.swap(parent, leftChild);
    if (rightChild < this.length && this.cmp(this.priorityQueue[parent], this.priorityQueue[rightChild]) > 0) this.swap(parent, rightChild);
  }
  size() {
    return this.length;
  }
  empty() {
    return this.length === 0;
  }
  clear() {
    this.length = 0;
    this.priorityQueue.length = 0;
  }
  /**
   * Inserts element and sorts the underlying container.
   */
  push(element: T) {
    this.priorityQueue.push(element);
    ++this.length;
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
    if (this.empty()) return;
    if (this.length === 1) {
      --this.length;
      return;
    }
    const last = this.priorityQueue[this.length - 1];
    --this.length;
    let parent = 0;
    while (parent < this.length) {
      const leftChild = parent * 2 + 1;
      const rightChild = parent * 2 + 2;
      if (leftChild >= this.length) break;
      let minChild = leftChild;
      if (rightChild < this.length && this.cmp(this.priorityQueue[leftChild], this.priorityQueue[rightChild]) > 0) minChild = rightChild;
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
