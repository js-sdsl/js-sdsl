import { Base, Entries } from '@/base';

class Stack<T> extends Base<T> {
  /**
   * @internal
   */
  private _stack: T[] = [];
  constructor(entries: Entries<T> = []) {
    super();
    const self = this;
    entries.forEach(function (el) {
      self.push(el);
    });
  }
  clear() {
    this._length = 0;
    this._stack = [];
  }
  /**
   * @description Insert item to stack's end.
   * @description The item you want to push to the back.
   * @returns The container length after erasing.
   */
  push(item: T) {
    this._stack.push(item);
    this._length += 1;
    return this._length;
  }
  /**
   * @description Removes the end item.
   * @returns The item you popped.
   */
  pop() {
    if (this._length === 0) return;
    this._length -= 1;
    return this._stack.pop();
  }
  /**
   * @description Accesses the end item.
   * @returns The last item.
   */
  top(): T | undefined {
    return this._stack[this._length - 1];
  }
  toArray(): T[] {
    return this._stack.slice();
  }
}

export default Stack;
