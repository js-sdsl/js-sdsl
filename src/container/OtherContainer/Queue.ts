import { Base, initContainer } from '@/container/ContainerBase/index';
import Deque from '../SequentialContainer/Deque';

class Queue<T> extends Base {
  private queue: Deque<T>;
  constructor(container: initContainer<T> = []) {
    super();
    this.queue = new Deque(container);
    this.length = this.queue.size();
  }
  clear() {
    this.queue.clear();
    this.length = 0;
  }
  /**
   * @description Inserts element to queue's end.
   */
  push(element: T) {
    this.queue.pushBack(element);
    this.length += 1;
  }
  /**
   * @description Removes the first element.
   */
  pop() {
    this.queue.popFront();
    if (this.length) this.length -= 1;
  }
  /**
   * @description Access the first element.
   */
  front() {
    return this.queue.front();
  }
}

export default Queue;
