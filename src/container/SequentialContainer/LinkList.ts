import SequentialContainer from './Base';
import { ContainerIterator, initContainer, IteratorType } from '@/container/ContainerBase';
import $checkWithinAccessParams from '@/utils/checkParams.macro';
import { throwIteratorAccessError } from '@/utils/throwError';

type LinkNode<T> = {
  _value: T;
  _pre: LinkNode<T>;
  _next: LinkNode<T>;
}

class LinkListIterator<T> extends ContainerIterator<T> {
  readonly container: LinkList<T>;
  /**
   * @internal
   */
  _node: LinkNode<T>;
  /**
   * @internal
   */
  private readonly _header: LinkNode<T>;
  /**
   * @internal
   */
  constructor(
    _node: LinkNode<T>,
    _header: LinkNode<T>,
    container: LinkList<T>,
    iteratorType?: IteratorType
  ) {
    super(iteratorType);
    this._node = _node;
    this._header = _header;
    this.container = container;
    if (this.iteratorType === IteratorType.NORMAL) {
      this.pre = function () {
        if (this._node._pre === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._pre;
        return this;
      };
      this.next = function () {
        if (this._node === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._next;
        return this;
      };
    } else {
      this.pre = function () {
        if (this._node._next === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._next;
        return this;
      };
      this.next = function () {
        if (this._node === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._pre;
        return this;
      };
    }
  }
  get pointer() {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    return this._node._value;
  }
  set pointer(newValue: T) {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    this._node._value = newValue;
  }
  copy() {
    return new LinkListIterator<T>(this._node, this._header, this.container, this.iteratorType);
  }
  isAccessible() {
    return this._node !== this._header;
  }
  // @ts-ignore
  equals(iter: LinkListIterator<T>): boolean;
  // @ts-ignore
  pre(): this;
  // @ts-ignore
  next(): this;
}

export type { LinkListIterator };

class LinkList<T> extends SequentialContainer<T> {
  /**
   * @internal
   */
  private _head: LinkNode<T>;
  /**
   * @internal
   */
  private _tail: LinkNode<T>;
  /**
   * @internal
   */
  private readonly _header: LinkNode<T>;
  constructor(container: initContainer<T> = []) {
    super();
    this._header = <LinkNode<T>>{};
    this._head = this._tail = this._header._pre = this._header._next = this._header;
    const self = this;
    container.forEach(function (el) {
      self.pushBack(el);
    });
  }
  /**
   * @internal
   */
  private _eraseNode(node: LinkNode<T>) {
    const { _pre, _next } = node;
    _pre._next = _next;
    _next._pre = _pre;
    if (node === this._head) {
      this._head = _next;
    }
    if (node === this._tail) {
      this._tail = _pre;
    }
    this._length -= 1;
  }
  /**
   * @internal
   */
  private _insertNode(value: T, pre: LinkNode<T>) {
    const next = pre._next;
    const node = {
      _value: value,
      _pre: pre,
      _next: next
    };
    pre._next = node;
    next._pre = node;
    if (pre === this._header) {
      this._head = node;
    }
    if (next === this._header) {
      this._tail = node;
    }
    this._length += 1;
  }
  clear() {
    this._length = 0;
    this._head = this._tail = this._header._pre = this._header._next = this._header;
  }
  begin() {
    return new LinkListIterator<T>(this._head, this._header, this);
  }
  end() {
    return new LinkListIterator<T>(this._header, this._header, this);
  }
  rBegin() {
    return new LinkListIterator<T>(this._tail, this._header, this, IteratorType.REVERSE);
  }
  rEnd() {
    return new LinkListIterator<T>(this._header, this._header, this, IteratorType.REVERSE);
  }
  front(): T | undefined {
    return this._head._value;
  }
  back(): T | undefined {
    return this._tail._value;
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let curNode = this._head;
    while (pos--) {
      curNode = curNode._next;
    }
    return curNode._value;
  }
  eraseElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let curNode = this._head;
    while (pos--) {
      curNode = curNode._next;
    }
    this._eraseNode(curNode);
    return this._length;
  }
  eraseElementByValue(_value: T) {
    let curNode = this._head;
    while (curNode !== this._header) {
      if (curNode._value === _value) {
        this._eraseNode(curNode);
      }
      curNode = curNode._next;
    }
    return this._length;
  }
  eraseElementByIterator(iter: LinkListIterator<T>) {
    const node = iter._node;
    if (node === this._header) {
      throwIteratorAccessError();
    }
    iter = iter.next();
    this._eraseNode(node);
    return iter;
  }
  pushBack(element: T) {
    this._insertNode(element, this._tail);
    return this._length;
  }
  popBack() {
    if (this._length === 0) return;
    const value = this._tail._value;
    this._eraseNode(this._tail);
    return value;
  }
  /**
   * @description Push an element to the front.
   * @param element - The element you want to push.
   * @returns The size of queue after pushing.
   */
  pushFront(element: T) {
    this._insertNode(element, this._header);
    return this._length;
  }
  /**
   * @description Removes the first element.
   * @returns The element you popped.
   */
  popFront() {
    if (this._length === 0) return;
    const value = this._head._value;
    this._eraseNode(this._head);
    return value;
  }
  setElementByPos(pos: number, element: T) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let curNode = this._head;
    while (pos--) {
      curNode = curNode._next;
    }
    curNode._value = element;
  }
  insert(pos: number, element: T, num = 1) {
    $checkWithinAccessParams!(pos, 0, this._length);
    if (num <= 0) return this._length;
    if (pos === 0) {
      while (num--) this.pushFront(element);
    } else if (pos === this._length) {
      while (num--) this.pushBack(element);
    } else {
      let curNode = this._head;
      for (let i = 1; i < pos; ++i) {
        curNode = curNode._next;
      }
      const next = curNode._next;
      this._length += num;
      while (num--) {
        curNode._next = <LinkNode<T>>{
          _value: element,
          _pre: curNode
        };
        curNode._next._pre = curNode;
        curNode = curNode._next;
      }
      curNode._next = next;
      next._pre = curNode;
    }
    return this._length;
  }
  find(element: T) {
    let curNode = this._head;
    while (curNode !== this._header) {
      if (curNode._value === element) {
        return new LinkListIterator<T>(curNode, this._header, this);
      }
      curNode = curNode._next;
    }
    return this.end();
  }
  reverse() {
    if (this._length <= 1) {
      return this;
    }
    let pHead = this._head;
    let pTail = this._tail;
    let cnt = 0;
    while ((cnt << 1) < this._length) {
      const tmp = pHead._value;
      pHead._value = pTail._value;
      pTail._value = tmp;
      pHead = pHead._next;
      pTail = pTail._pre;
      cnt += 1;
    }
    return this;
  }
  unique() {
    if (this._length <= 1) {
      return this._length;
    }
    let curNode = this._head;
    while (curNode !== this._header) {
      let tmpNode = curNode;
      while (
        tmpNode._next !== this._header &&
        tmpNode._value === tmpNode._next._value
      ) {
        tmpNode = tmpNode._next;
        this._length -= 1;
      }
      curNode._next = tmpNode._next;
      curNode._next._pre = curNode;
      curNode = curNode._next;
    }
    return this._length;
  }
  sort(cmp?: (x: T, y: T) => number) {
    if (this._length <= 1) {
      return this;
    }
    const arr: T[] = [];
    this.forEach(function (el) {
      arr.push(el);
    });
    arr.sort(cmp);
    let curNode: LinkNode<T> = this._head;
    arr.forEach(function (element) {
      curNode._value = element;
      curNode = curNode._next;
    });
    return this;
  }
  /**
   * @description Merges two sorted lists.
   * @param list - The other list you want to merge (must be sorted).
   * @returns The size of list after merging.
   * @example
   * const linkA = new LinkList([1, 3, 5]);
   * const linkB = new LinkList([2, 4, 6]);
   * linkA.merge(linkB);  // [1, 2, 3, 4, 5];
   */
  merge(list: LinkList<T>) {
    const self = this;
    if (this._length === 0) {
      list.forEach(function (el) {
        self.pushBack(el);
      });
    } else {
      let curNode = this._head;
      list.forEach(function (el) {
        while (
          curNode !== self._header &&
          curNode._value <= el
        ) {
          curNode = curNode._next;
        }
        self._insertNode(el, curNode._pre);
      });
    }
    return this._length;
  }
  forEach(callback: (element: T, index: number, list: LinkList<T>) => void) {
    let curNode = this._head;
    let index = 0;
    while (curNode !== this._header) {
      callback(curNode._value, index++, this);
      curNode = curNode._next;
    }
  }
  * [Symbol.iterator]() {
    if (this._length === 0) return;
    let curNode = this._head;
    while (curNode !== this._header) {
      yield curNode._value;
      curNode = curNode._next;
    }
  }
}

export default LinkList;
