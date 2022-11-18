import { Base, initContainer } from '@/container/ContainerBase';

class Stack<T> extends Base {
  /**
   * @internal
   */
  private _stack: T[] = [];
  constructor(container: initContainer<T> = []) {
    super();
    const self = this;
    container.forEach(function (el) {
      self.push(el);
    });
  }
  clear() {
    this._length = 0;
    this._stack = [];
  }
  /**
   * @description Insert element to stack's end.
   * @description The element you want to push to the back.
   * @returns The container length after erasing.
   */
  push(element: T) {
    this._stack.push(element);
    this._length += 1;
    return this._length;
  }
  /**
   * @description Removes the end element.
   * @returns The element you popped.
   */
  pop() {
    if (this._length === 0) return;
    this._length -= 1;
    return this._stack.pop();
  }
  /**
   * @description Accesses the end element.
   * @returns The last element.
   */
  top(): T | undefined {
    return this._stack[this._length - 1];
  }
}

export default Stack;
