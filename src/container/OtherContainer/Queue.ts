import { Base, initContainer } from '@/types/interface';
import LinkList from '../SequentialContainer/LinkList';

class Queue<T> implements Base {
  private queue: LinkList<T>;
  constructor(container: initContainer<T> = []) {
    this.queue = new LinkList(container);
  }
  size() {
    return this.queue.size();
  }
  empty() {
    return this.queue.empty();
  }
  clear() {
    this.queue.clear();
  }
  /**
   * Inserts element at the end.
   */
  push(element: T) {
    this.queue.pushBack(element);
  }
  /**
   * Removes the first element.
   */
  pop() {
    this.queue.popFront();
  }
  /**
   * Access the first element.
   */
  front() {
    return this.queue.front();
  }
}

export default Queue;
