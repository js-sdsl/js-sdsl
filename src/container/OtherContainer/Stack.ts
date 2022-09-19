import { Base, initContainer } from '@/container/ContainerBase';

class Stack<T> extends Base {
  private stack: T[] = [];
  constructor(container: initContainer<T> = []) {
    super();
    container.forEach(element => this.push(element));
  }
  clear() {
    this.length = 0;
    this.stack.length = 0;
  }
  /**
   * @description Insert element to stack's end.
   */
  push(element: T) {
    this.stack.push(element);
    this.length += 1;
  }
  /**
   * @description Removes the end element.
   */
  pop() {
    this.stack.pop();
    if (this.length > 0) this.length -= 1;
  }
  /**
   * @description Accesses the end element.
   */
  top() {
    return this.stack[this.length - 1] as (T | undefined);
  }
}

export default Stack;
