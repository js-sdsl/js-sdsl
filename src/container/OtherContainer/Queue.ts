import { Base, initContainer } from '@/container/ContainerBase';

const enum QUEUE_CONSTANT {
  ALLOCATE_SIGMA = 0.5,
  MIN_ALLOCATE_SIZE = (1 << 12)
}

class Queue<T> extends Base {
  /**
   * @internal
   */
  private _first = 0;
  /**
   * @internal
   */
  private _queue: T[] = [];
  constructor(container: initContainer<T> = []) {
    super();
    const self = this;
    container.forEach(function (el) {
      self.push(el);
    });
  }
  clear() {
    this._queue = [];
    this._length = this._first = 0;
  }
  /**
   * @description Inserts element to queue's end.
   * @param element - The element you want to push to the front.
   * @returns The container length after pushing.
   */
  push(element: T) {
    const capacity = this._queue.length;
    if (
      (this._first / capacity) > QUEUE_CONSTANT.ALLOCATE_SIGMA &&
      (this._first + this._length) >= capacity &&
      capacity > QUEUE_CONSTANT.MIN_ALLOCATE_SIZE
    ) {
      const length = this._length;
      for (let i = 0; i < length; ++i) {
        this._queue[i] = this._queue[this._first + i];
      }
      this._first = 0;
      this._queue[this._length] = element;
    } else this._queue[this._first + this._length] = element;
    return ++this._length;
  }
  /**
   * @description Removes the first element.
   * @returns The element you popped.
   */
  pop() {
    if (this._length === 0) return;
    const el = this._queue[this._first++];
    this._length -= 1;
    return el;
  }
  /**
   * @description Access the first element.
   * @returns The first element.
   */
  front(): T | undefined {
    if (this._length === 0) return;
    return this._queue[this._first];
  }
}

export default Queue;
