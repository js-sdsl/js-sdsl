import Deque from '@/container/SequentialContainer/Deque';
import { Base, initContainer } from '@/container/ContainerBase';

class Queue<T> extends Base {
  /**
   * @internal
   */
  private _queue: Deque<T>;
  constructor(container: initContainer<T> = []) {
    super();
    this._queue = new Deque(container);
    this._length = this._queue.size();
  }
  clear() {
    this._queue.clear();
    this._length = 0;
  }
  /**
   * @description Inserts element to queue's end.
   */
  push(element: T) {
    this._queue.pushBack(element);
    this._length += 1;
  }
  /**
   * @description Removes the first element.
   */
  pop() {
    this._queue.popFront();
    if (this._length) this._length -= 1;
  }
  /**
   * @description Access the first element.
   */
  front() {
    return this._queue.front();
  }
}

export default Queue;
