import SequentialContainer from './base';
import { Entries } from '@/base';
import { Iterator, ITERATOR_TYPE } from '@/base/iterator';
import { CompareFn, compareFromS2L } from '@/utils/compareFn';
import { throwIteratorAccessError } from '@/utils/throwError';

type LinkNode<T> = {
  _value: T;
  _prev: LinkNode<T>;
  _next: LinkNode<T>;
}

class LinkListIterator<T> extends Iterator<T> {
  readonly container: LinkList<T>;
  /**
   * @internal
   */
  _node: LinkNode<T>;
  /**
   * @internal
   */
  private readonly _header: LinkNode<T>;
  prev: () => this;
  next: () => this;
  /**
   * @internal
   */
  constructor(props: {
    node: LinkNode<T>,
    header: LinkNode<T>,
    container: LinkList<T>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    const { node, header, container } = props;
    this._node = node;
    this._header = header;
    this.container = container;
    if (this.type === ITERATOR_TYPE.NORMAL) {
      this.prev = function () {
        if (this._node._prev === this._header) {
          throwIteratorAccessError();
        }
        this._node = this._node._prev;
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
      this.prev = function () {
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
        this._node = this._node._prev;
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
    return new LinkListIterator<T>({
      node: this._node,
      header: this._header,
      container: this.container,
      type: this.type
    });
  }
  isAccessible() {
    return this._node !== this._header;
  }
  // @ts-ignore
  equals(iter: LinkListIterator<T>): boolean;
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
  constructor(entries: Entries<T> = []) {
    super();
    this._header = <LinkNode<T>>{};
    this._head = this._tail = this._header._prev = this._header._next = this._header;
    const self = this;
    entries.forEach(function (el) {
      self.push(el);
    });
  }
  /**
   * @internal
   */
  private _eraseNode(node: LinkNode<T>) {
    const { _prev, _next } = node;
    _prev._next = _next;
    _next._prev = _prev;
    if (node === this._head) {
      this._head = _next;
    }
    if (node === this._tail) {
      this._tail = _prev;
    }
    this._length -= 1;
  }
  /**
   * @internal
   */
  private _insertNode(item: T, prev: LinkNode<T>) {
    const next = prev._next;
    const node = {
      _value: item,
      _prev: prev,
      _next: next
    };
    prev._next = node;
    next._prev = node;
    if (prev === this._header) {
      this._head = node;
    }
    if (next === this._header) {
      this._tail = node;
    }
    this._length += 1;
  }
  clear() {
    this._length = 0;
    this._head = this._tail = this._header._prev = this._header._next = this._header;
  }
  begin() {
    return new LinkListIterator<T>({
      node: this._head,
      header: this._header,
      container: this
    });
  }
  end() {
    return new LinkListIterator<T>({
      node: this._header,
      header: this._header,
      container: this
    });
  }
  rBegin() {
    return new LinkListIterator<T>({
      node: this._tail,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  rEnd() {
    return new LinkListIterator<T>({
      node: this._header,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  front(): T | undefined {
    return this._head._value;
  }
  back(): T | undefined {
    return this._tail._value;
  }
  _at(index: number) {
    let curNode = this._head;
    while (index--) {
      curNode = curNode._next;
    }
    return curNode._value;
  }
  erase(iter: LinkListIterator<T>) {
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
    for (let i = num - 1; i >= 0; --i) {
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
  protected _set(index: number, item: T) {
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
        return new LinkListIterator<T>({
          node: curNode,
          header: this._header,
          container: this
        });
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
      pTail = pTail._prev;
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
      curNode._next._prev = curNode;
      curNode = curNode._next;
    }
    this._head = this._header._next;
    this._tail = this._header._prev;
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
        self._insertNode(el, curNode._prev);
      });
    }
    return this._length;
  }
  forEach(callback: (value: T, index: number, container: this) => void) {
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
  every(callback: (value: T, index: number, container: this) => unknown) {
    let index = 0;
    for (let node = this._head; node !== this._header; node = node._next) {
      const flag = callback(node._value, index, this);
      if (!flag) return false;
      index += 1;
    }
    return true;
  }
  filter(callback: (value: T, index: number, container: this) => unknown) {
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
  map<U>(callback: (value: T, index: number, container: this) => U) {
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
  some(callback: (value: T, index: number, container: this) => unknown) {
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
        deleteHead = deleteHead._prev;
      }
    }
    const deleteRecord = new LinkList<T>();
    const insertStartNode = deleteHead._prev;
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
      insertEndNode._prev = insertStartNode;
      deleteHead._prev = deleteTail._next = deleteRecord._header;
      deleteRecord._header._next = deleteHead;
      deleteRecord._header._prev = deleteTail;
      deleteRecord._length = deleteCount;
      this._length -= deleteCount;
    }
    const insertNum = items.length;
    let currentNode = insertStartNode;
    for (let i = 0; i < insertNum; ++i) {
      currentNode._next = {
        _prev: currentNode,
        _next: insertEndNode,
        _value: items[i]
      };
      currentNode = currentNode._next;
    }
    insertEndNode._prev = currentNode;
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
