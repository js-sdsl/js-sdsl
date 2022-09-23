import SequentialContainer from './Base';
import { $checkWithinAccessParams } from '@/utils/checkParams.macro';
import { ContainerIterator, initContainer, IteratorType } from '@/container/ContainerBase';

export class LinkNode<T> {
  _value: T | undefined = undefined;
  _pre: LinkNode<T> | undefined = undefined;
  _next: LinkNode<T> | undefined = undefined;
  constructor(element?: T) {
    this._value = element;
  }
}

export class LinkListIterator<T> extends ContainerIterator<T> {
  /**
   * @internal
   */
  _node: LinkNode<T>;
  /**
   * @internal
   */
  private readonly _header: LinkNode<T>;
  pre: () => this;
  next: () => this;
  constructor(
    _node: LinkNode<T>,
    _header: LinkNode<T>,
    iteratorType?: IteratorType
  ) {
    super(iteratorType);
    this._node = _node;
    this._header = _header;

    if (this.iteratorType === IteratorType.NORMAL) {
      this.pre = function () {
        if (this._node._pre === this._header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this._node = this._node._pre as LinkNode<T>;
        return this;
      };

      this.next = function () {
        if (this._node === this._header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this._node = this._node._next as LinkNode<T>;
        return this;
      };
    } else {
      this.pre = function () {
        if (this._node._next === this._header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this._node = this._node._next as LinkNode<T>;
        return this;
      };

      this.next = function () {
        if (this._node === this._header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this._node = this._node._pre as LinkNode<T>;
        return this;
      };
    }
  }
  get pointer() {
    if (this._node === this._header) {
      throw new RangeError('LinkList iterator access denied!');
    }
    return this._node._value as T;
  }
  set pointer(newValue: T) {
    if (this._node === this._header) {
      throw new RangeError('LinkList iterator access denied!');
    }
    this._node._value = newValue;
  }
  equals(obj: LinkListIterator<T>) {
    return this._node === obj._node;
  }
  copy() {
    return new LinkListIterator(
      this._node,
      this._header,
      this.iteratorType
    );
  }
}

class LinkList<T> extends SequentialContainer<T> {
  /**
   * @internal
   */
  private _header: LinkNode<T> = new LinkNode<T>();
  /**
   * @internal
   */
  private _head: LinkNode<T> | undefined = undefined;
  /**
   * @internal
   */
  private _tail: LinkNode<T> | undefined = undefined;
  constructor(container: initContainer<T> = []) {
    super();
    container.forEach(element => this.pushBack(element));
  }
  clear() {
    this._length = 0;
    this._head = this._tail = undefined;
    this._header._pre = this._header._next = undefined;
  }
  begin() {
    return new LinkListIterator(this._head || this._header, this._header);
  }
  end() {
    return new LinkListIterator(this._header, this._header);
  }
  rBegin() {
    return new LinkListIterator(this._tail || this._header, this._header, IteratorType.REVERSE);
  }
  rEnd() {
    return new LinkListIterator(this._header, this._header, IteratorType.REVERSE);
  }
  front() {
    return this._head ? this._head._value : undefined;
  }
  back() {
    return this._tail ? this._tail._value : undefined;
  }
  forEach(callback: (element: T, index: number) => void) {
    if (!this._length) return;
    let curNode = this._head as LinkNode<T>;
    let index = 0;
    while (curNode !== this._header) {
      callback(curNode._value as T, index++);
      curNode = curNode._next as LinkNode<T>;
    }
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let curNode = this._head as LinkNode<T>;
    while (pos--) {
      curNode = curNode._next as LinkNode<T>;
    }
    return curNode._value as T;
  }
  eraseElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    if (pos === 0) this.popFront();
    else if (pos === this._length - 1) this.popBack();
    else {
      let curNode = this._head;
      while (pos--) {
        curNode = (curNode as LinkNode<T>)._next;
      }
      curNode = curNode as LinkNode<T>;
      const _pre = curNode._pre as LinkNode<T>;
      const _next = curNode._next as LinkNode<T>;
      _next._pre = _pre;
      _pre._next = _next;
      this._length -= 1;
    }
  }
  eraseElementByValue(_value: T) {
    while (this._head && this._head._value === _value) this.popFront();
    while (this._tail && this._tail._value === _value) this.popBack();
    if (!this._head) return;
    let curNode: LinkNode<T> = this._head;
    while (curNode !== this._header) {
      if (curNode._value === _value) {
        const _pre = curNode._pre as LinkNode<T>;
        const _next = curNode._next as LinkNode<T>;
        _next._pre = _pre;
        _pre._next = _next;
        this._length -= 1;
      }
      curNode = curNode._next as LinkNode<T>;
    }
  }
  eraseElementByIterator(iter: LinkListIterator<T>) {
    const _node = iter._node;
    if (_node === this._header) {
      throw new RangeError('Invalid iterator');
    }
    iter = iter.next();
    if (this._head === _node) this.popFront();
    else if (this._tail === _node) this.popBack();
    else {
      const _pre = _node._pre as LinkNode<T>;
      const _next = _node._next as LinkNode<T>;
      _next._pre = _pre;
      _pre._next = _next;
      this._length -= 1;
    }
    return iter;
  }
  pushBack(element: T) {
    this._length += 1;
    const newTail = new LinkNode(element);
    if (!this._tail) {
      this._head = this._tail = newTail;
      this._header._next = this._head;
      this._head._pre = this._header;
    } else {
      this._tail._next = newTail;
      newTail._pre = this._tail;
      this._tail = newTail;
    }
    this._tail._next = this._header;
    this._header._pre = this._tail;
  }
  popBack() {
    if (!this._tail) return;
    this._length -= 1;
    if (this._head === this._tail) {
      this._head = this._tail = undefined;
      this._header._next = undefined;
    } else {
      this._tail = this._tail._pre as LinkNode<T>;
      this._tail._next = this._header;
    }
    this._header._pre = this._tail;
  }
  setElementByPos(pos: number, element: T) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let curNode = this._head as LinkNode<T>;
    while (pos--) {
      curNode = curNode._next as LinkNode<T>;
    }
    curNode._value = element;
  }
  insert(pos: number, element: T, num = 1) {
    $checkWithinAccessParams!(pos, 0, this._length);
    if (num <= 0) return;
    if (pos === 0) {
      while (num--) this.pushFront(element);
    } else if (pos === this._length) {
      while (num--) this.pushBack(element);
    } else {
      let curNode = this._head as LinkNode<T>;
      for (let i = 1; i < pos; ++i) {
        curNode = curNode._next as LinkNode<T>;
      }
      const _next = curNode._next as LinkNode<T>;
      this._length += num;
      while (num--) {
        curNode._next = new LinkNode(element);
        curNode._next._pre = curNode;
        curNode = curNode._next;
      }
      curNode._next = _next;
      _next._pre = curNode;
    }
  }
  find(element: T) {
    if (!this._head) return this.end();
    let curNode = this._head;
    while (curNode !== this._header) {
      if (curNode._value === element) {
        return new LinkListIterator(curNode, this._header);
      }
      curNode = curNode._next as LinkNode<T>;
    }
    return this.end();
  }
  reverse() {
    if (this._length <= 1) return;
    let pHead = this._head as LinkNode<T>;
    let pTail = this._tail as LinkNode<T>;
    let cnt = 0;
    while ((cnt << 1) < this._length) {
      const tmp = pHead._value;
      pHead._value = pTail._value;
      pTail._value = tmp;
      pHead = pHead._next as LinkNode<T>;
      pTail = pTail._pre as LinkNode<T>;
      cnt += 1;
    }
  }
  unique() {
    if (this._length <= 1) return;
    let curNode = this._head as LinkNode<T>;
    while (curNode !== this._header) {
      let tmpNode = curNode;
      while (tmpNode._next && tmpNode._value === tmpNode._next._value) {
        tmpNode = tmpNode._next;
        this._length -= 1;
      }
      curNode._next = tmpNode._next as LinkNode<T>;
      curNode._next._pre = curNode;
      curNode = curNode._next as LinkNode<T>;
    }
  }
  sort(cmp?: (x: T, y: T) => number) {
    if (this._length <= 1) return;
    const arr: T[] = [];
    this.forEach(element => arr.push(element));
    arr.sort(cmp);
    let curNode: LinkNode<T> = this._head as LinkNode<T>;
    arr.forEach((element) => {
      curNode._value = element;
      curNode = curNode._next as LinkNode<T>;
    });
  }
  /**
   * @description Push an element to the front.
   * @param element The element you want to push.
   */
  pushFront(element: T) {
    this._length += 1;
    const newHead = new LinkNode(element);
    if (!this._head) {
      this._head = this._tail = newHead;
      this._tail._next = this._header;
      this._header._pre = this._tail;
    } else {
      newHead._next = this._head;
      this._head._pre = newHead;
      this._head = newHead;
    }
    this._header._next = this._head;
    this._head._pre = this._header;
  }
  /**
   * @description Removes the first element.
   */
  popFront() {
    if (!this._head) return;
    this._length -= 1;
    if (this._head === this._tail) {
      this._head = this._tail = undefined;
      this._header._pre = this._tail;
    } else {
      this._head = this._head._next as LinkNode<T>;
      this._head._pre = this._header;
    }
    this._header._next = this._head;
  }
  /**
   * @description Merges two sorted lists.
   * @param list The other list you want to merge (must be sorted).
   */
  merge(list: LinkList<T>) {
    if (!this._head) {
      list.forEach(element => this.pushBack(element));
      return;
    }
    let curNode: LinkNode<T> = this._head;
    list.forEach(element => {
      while (
        curNode &&
        curNode !== this._header &&
        (curNode._value as T) <= element
      ) {
        curNode = curNode._next as LinkNode<T>;
      }
      if (curNode === this._header) {
        this.pushBack(element);
        curNode = this._tail as LinkNode<T>;
      } else if (curNode === this._head) {
        this.pushFront(element);
        curNode = this._head;
      } else {
        this._length += 1;
        const _pre = curNode._pre as LinkNode<T>;
        _pre._next = new LinkNode(element);
        _pre._next._pre = _pre;
        _pre._next._next = curNode;
        curNode._pre = _pre._next;
      }
    });
  }
  [Symbol.iterator]() {
    return function * (this: LinkList<T>) {
      if (!this._head) return;
      let curNode = this._head;
      while (curNode !== this._header) {
        yield curNode._value as T;
        curNode = curNode._next as LinkNode<T>;
      }
    }.bind(this)();
  }
}

export default LinkList;
