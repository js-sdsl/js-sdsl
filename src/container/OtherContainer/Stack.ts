import { Base, initContainer } from '@/container/ContainerBase';

class Stack<T> extends Base {
  /**
   * @internal
   */
  private _stack: T[] = [];
  constructor(container: initContainer<T> = []) {
    super();
    container.forEach(element => this.push(element));
  }
  clear() {
    this._length = 0;
    this._stack.length = 0;
  }
  /**
   * @description Insert element to stack's end.
   */
  push(element: T) {
    this._stack.push(element);
    this._length += 1;
  }
  /**
   * @description Removes the end element.
   */
  pop() {
    this._stack.pop();
    if (this._length > 0) this._length -= 1;
  }
  /**
   * @description Accesses the end element.
   */
  top() {
    return this._stack[this._length - 1] as (T | undefined);
  }
}

export default Stack;
