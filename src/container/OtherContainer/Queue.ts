import { Base, initContainer } from '@/container/ContainerBase/index';
import LinkList from '../SequentialContainer/LinkList';

class Queue<T> extends Base {
  private queue: LinkList<T>;
  constructor(container: initContainer<T> = []) {
    super();
    this.queue = new LinkList(container);
    this.length = this.queue.size();
  }
  clear() {
    this.queue.clear();
    this.length = 0;
  }
  /**
   * Inserts element at the end.
   */
  push(element: T) {
    this.queue.pushBack(element);
    this.length += 1;
  }
  /**
   * Removes the first element.
   */
  pop() {
    this.queue.popFront();
    if (this.length) this.length -= 1;
  }
  /**
   * Access the first element.
   */
  front() {
    return this.queue.front();
  }
}

export default Queue;
