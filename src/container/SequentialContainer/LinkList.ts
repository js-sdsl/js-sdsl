import SequentialContainer from './Base';
import {
  CallbackFn,
  ContainerIterator,
  initContainer,
  IteratorType
} from '@/container/ContainerBase';
import $checkWithinAccessParams from '@/utils/checkParams.macro';
import { CompareFn, compareFromS2L } from '@/utils/compareFn';
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
      self.push(el);
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
  private _insertNode(item: T, pre: LinkNode<T>) {
    const next = pre._next;
    const node = {
      _value: item,
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
  at(index: number) {
    $checkWithinAccessParams!(index, 0, this._length - 1);
    let curNode = this._head;
    while (index--) {
      curNode = curNode._next;
    }
    return curNode._value;
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
  push(...items: T[]) {
    const num = items.length;
    for (let i = 0; i < num; ++i) {
      this._insertNode(items[i], this._tail);
    }
    return this._length;
  }
  pop() {
    if (this._length === 0) return;
    const item = this._tail._value;
    this._eraseNode(this._tail);
    return item;
  }
  unshift(...items: T[]) {
    const num = items.length;
    for (let i = 0; i < num; ++i) {
      this._insertNode(items[i], this._header);
    }
    return this._length;
  }
  /**
   * @description Removes the first item.
   * @returns The item you popped.
   */
  shift() {
    if (this._length === 0) return;
    const item = this._head._value;
    this._eraseNode(this._head);
    return item;
  }
  set(index: number, item: T) {
    $checkWithinAccessParams!(index, 0, this._length - 1);
    let curNode = this._head;
    while (index--) {
      curNode = curNode._next;
    }
    curNode._value = item;
  }
  find(item: T, cmp: CompareFn<T> = compareFromS2L) {
    let curNode = this._head;
    while (curNode !== this._header) {
      if (cmp(curNode._value, item) === 0) {
        return new LinkListIterator<T>(curNode, this._header, this);
      }
      curNode = curNode._next;
    }
    return this.end();
  }
  reverse() {
    const length = this._length;
    if (length <= 1) {
      return this;
    }
    let pHead = this._head;
    let pTail = this._tail;
    let cnt = 0;
    while ((cnt << 1) < length) {
      const tmp = pHead._value;
      pHead._value = pTail._value;
      pTail._value = tmp;
      pHead = pHead._next;
      pTail = pTail._pre;
      cnt += 1;
    }
    return this;
  }
  unique(cmp: CompareFn<T> = compareFromS2L) {
    if (this._length <= 1) {
      return this._length;
    }
    let curNode = this._head;
    while (curNode !== this._header) {
      let tmpNode = curNode;
      while (
        tmpNode._next !== this._header &&
        cmp(tmpNode._value, tmpNode._next._value) === 0
      ) {
        tmpNode = tmpNode._next;
        this._length -= 1;
      }
      curNode._next = tmpNode._next;
      curNode._next._pre = curNode;
      curNode = curNode._next;
    }
    this._head = this._header._next;
    this._tail = this._header._pre;
    return this._length;
  }
  sort(cmp: CompareFn<T> = compareFromS2L) {
    if (this._length <= 1) {
      return this;
    }
    const arr: T[] = [];
    this.forEach(function (el) {
      arr.push(el);
    });
    arr.sort(cmp);
    let curNode: LinkNode<T> = this._head;
    arr.forEach(function (item) {
      curNode._value = item;
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
        self.push(el);
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
  forEach(callback: CallbackFn<T, this, void>) {
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
  entries(): IterableIterator<[number, T]> {
    let index = 0;
    const self = this;
    let node = this._head;
    return {
      next() {
        const done = node === self._header;
        if (done) {
          return {
            done,
            value: undefined as unknown as [number, T]
          };
        }
        const value = <[number, T]>[index, node._value];
        index += 1;
        node = node._next;
        return {
          done,
          value
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  }
  every(callback: CallbackFn<T, this, unknown>) {
    let index = 0;
    for (let node = this._head; node !== this._header; node = node._next) {
      const flag = callback(node._value, index, this);
      if (!flag) return false;
      index += 1;
    }
    return true;
  }
  filter(callback: CallbackFn<T, this, unknown>) {
    let index = 0;
    const newLinkList = new LinkList<T>();
    for (let node = this._head; node !== this._header; node = node._next) {
      const item = node._value;
      const flag = callback(item, index, this);
      if (flag) newLinkList.push(item);
      index += 1;
    }
    return newLinkList;
  }
  map<U>(callback: CallbackFn<T, this, U>) {
    let index = 0;
    const newLinkList = new LinkList<U>();
    for (let node = this._head; node !== this._header; node = node._next) {
      const newItem = callback(node._value, index, this);
      newLinkList.push(newItem);
      index += 1;
    }
    return newLinkList;
  }
  slice(start = 0, end = this._length) {
    const length = this._length;
    const sliceList = new LinkList<T>();
    if (start >= length) {
      return sliceList;
    } else if (start < 0) {
      start += length;
      if (start < 0) {
        start = 0;
      }
    }
    if (end < 0) end += length;
    else if (end > length) end = length;
    let index = 0;
    let curNode = this._head!;
    while (index < start) {
      curNode = curNode._next!;
      index += 1;
    }
    while (index < end) {
      sliceList.push(curNode._value);
      curNode = curNode._next!;
      index += 1;
    }
    return sliceList;
  }
  some(callback: CallbackFn<T, this, unknown>) {
    let index = 0;
    for (let node = this._head; node !== this._header; node = node._next) {
      const flag = callback(node._value, index, this);
      if (flag) return true;
      index += 1;
    }
    return false;
  }
  splice(start: number, deleteCount?: number, ...items: T[]) {
    const length = this._length;
    if (typeof start !== 'number' || length <= 0) {
      this.push(...items);
      return new LinkList<T>();
    }
    if (start < 0) {
      start += length;
      if (start < 0) {
        start = 0;
      }
    } else {
      const maxStart = length - 1;
      if (start > maxStart) {
        start = maxStart;
      }
    }
    const maxDeleteCount = length - start;
    if (typeof deleteCount !== 'number' || deleteCount > maxDeleteCount) {
      deleteCount = maxDeleteCount;
    } else if (deleteCount < 0) {
      deleteCount = 0;
    }
    let deleteHead: LinkNode<T>;
    const formBegin = start < (length >> 1);
    if (formBegin) {
      deleteHead = this._head;
      for (let i = 0; i < start; ++i) {
        deleteHead = deleteHead._next;
      }
    } else {
      deleteHead = this._tail;
      const moveNum = length - start - 1;
      for (let i = 0; i < moveNum; ++i) {
        deleteHead = deleteHead._pre;
      }
    }
    const deleteRecord = new LinkList<T>();
    const insertStartNode = deleteHead._pre;
    let insertEndNode = deleteHead;
    if (deleteCount > 0) {
      deleteRecord._head = deleteHead;
      let deleteTail = deleteHead;
      for (let i = 1; i < deleteCount; ++i) {
        deleteTail = deleteTail._next;
      }
      deleteRecord._tail = deleteTail;
      insertEndNode = deleteTail._next;
      insertStartNode._next = insertEndNode;
      insertEndNode._pre = insertStartNode;
      deleteHead._pre = deleteTail._next = deleteRecord._header;
      deleteRecord._header._next = deleteHead;
      deleteRecord._header._pre = deleteTail;
      deleteRecord._length = deleteCount;
      this._length -= deleteCount;
    }
    const insertNum = items.length;
    let currentNode = insertStartNode;
    for (let i = 0; i < insertNum; ++i) {
      currentNode._next = {
        _pre: currentNode,
        _next: insertEndNode,
        _value: items[i]
      };
      currentNode = currentNode._next;
    }
    insertEndNode._pre = currentNode;
    if (insertStartNode === this._header) {
      this._head = insertStartNode._next;
    }
    if (insertEndNode === this._header) {
      this._tail = currentNode;
    }
    this._length += insertNum;
    return deleteRecord;
  }
  values(): IterableIterator<T> {
    const self = this;
    let node = this._head;
    return {
      next() {
        const done = node === self._header;
        if (done) {
          return {
            value: undefined as unknown as T,
            done
          };
        }
        const value = node._value;
        node = node._next;
        return {
          value,
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  }
}

export default LinkList;
