import SequentialContainer from './Base';
import { $checkWithinAccessParams } from '@/utils/checkParams.macro';
import { ContainerIterator, initContainer, IteratorType } from '@/container/ContainerBase';

export class LinkNode<T> {
  value: T | undefined = undefined;
  pre: LinkNode<T> | undefined = undefined;
  next: LinkNode<T> | undefined = undefined;
  constructor(element?: T) {
    this.value = element;
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
        if (this._node.pre === this._header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this._node = this._node.pre as LinkNode<T>;
        return this;
      };

      this.next = function () {
        if (this._node === this._header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this._node = this._node.next as LinkNode<T>;
        return this;
      };
    } else {
      this.pre = function () {
        if (this._node.next === this._header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this._node = this._node.next as LinkNode<T>;
        return this;
      };

      this.next = function () {
        if (this._node === this._header) {
          throw new RangeError('LinkList iterator access denied!');
        }
        this._node = this._node.pre as LinkNode<T>;
        return this;
      };
    }
  }
  get pointer() {
    if (this._node === this._header) {
      throw new RangeError('LinkList iterator access denied!');
    }
    return this._node.value as T;
  }
  set pointer(newValue: T) {
    if (this._node === this._header) {
      throw new RangeError('LinkList iterator access denied!');
    }
    this._node.value = newValue;
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
    this._header.pre = this._header.next = undefined;
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
    return this._head ? this._head.value : undefined;
  }
  back() {
    return this._tail ? this._tail.value : undefined;
  }
  forEach(callback: (element: T, index: number) => void) {
    if (!this._length) return;
    let curNode = this._head as LinkNode<T>;
    let index = 0;
    while (curNode !== this._header) {
      callback(curNode.value as T, index++);
      curNode = curNode.next as LinkNode<T>;
    }
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let curNode = this._head as LinkNode<T>;
    while (pos--) {
      curNode = curNode.next as LinkNode<T>;
    }
    return curNode.value as T;
  }
  eraseElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    if (pos === 0) this.popFront();
    else if (pos === this._length - 1) this.popBack();
    else {
      let curNode = this._head;
      while (pos--) {
        curNode = (curNode as LinkNode<T>).next;
      }
      curNode = curNode as LinkNode<T>;
      const pre = curNode.pre as LinkNode<T>;
      const next = curNode.next as LinkNode<T>;
      next.pre = pre;
      pre.next = next;
      this._length -= 1;
    }
  }
  eraseElementByValue(value: T) {
    while (this._head && this._head.value === value) this.popFront();
    while (this._tail && this._tail.value === value) this.popBack();
    if (!this._head) return;
    let curNode: LinkNode<T> = this._head;
    while (curNode !== this._header) {
      if (curNode.value === value) {
        const pre = curNode.pre as LinkNode<T>;
        const next = curNode.next as LinkNode<T>;
        next.pre = pre;
        pre.next = next;
        this._length -= 1;
      }
      curNode = curNode.next as LinkNode<T>;
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
      const pre = _node.pre as LinkNode<T>;
      const next = _node.next as LinkNode<T>;
      next.pre = pre;
      pre.next = next;
      this._length -= 1;
    }
    return iter;
  }
  pushBack(element: T) {
    this._length += 1;
    const newTail = new LinkNode(element);
    if (!this._tail) {
      this._head = this._tail = newTail;
      this._header.next = this._head;
      this._head.pre = this._header;
    } else {
      this._tail.next = newTail;
      newTail.pre = this._tail;
      this._tail = newTail;
    }
    this._tail.next = this._header;
    this._header.pre = this._tail;
  }
  popBack() {
    if (!this._tail) return;
    this._length -= 1;
    if (this._head === this._tail) {
      this._head = this._tail = undefined;
      this._header.next = undefined;
    } else {
      this._tail = this._tail.pre as LinkNode<T>;
      this._tail.next = this._header;
    }
    this._header.pre = this._tail;
  }
  setElementByPos(pos: number, element: T) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let curNode = this._head as LinkNode<T>;
    while (pos--) {
      curNode = curNode.next as LinkNode<T>;
    }
    curNode.value = element;
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
        curNode = curNode.next as LinkNode<T>;
      }
      const next = curNode.next as LinkNode<T>;
      this._length += num;
      while (num--) {
        curNode.next = new LinkNode(element);
        curNode.next.pre = curNode;
        curNode = curNode.next;
      }
      curNode.next = next;
      next.pre = curNode;
    }
  }
  find(element: T) {
    if (!this._head) return this.end();
    let curNode = this._head;
    while (curNode !== this._header) {
      if (curNode.value === element) {
        return new LinkListIterator(curNode, this._header);
      }
      curNode = curNode.next as LinkNode<T>;
    }
    return this.end();
  }
  reverse() {
    if (this._length <= 1) return;
    let pHead = this._head as LinkNode<T>;
    let pTail = this._tail as LinkNode<T>;
    let cnt = 0;
    while ((cnt << 1) < this._length) {
      const tmp = pHead.value;
      pHead.value = pTail.value;
      pTail.value = tmp;
      pHead = pHead.next as LinkNode<T>;
      pTail = pTail.pre as LinkNode<T>;
      cnt += 1;
    }
  }
  unique() {
    if (this._length <= 1) return;
    let curNode = this._head as LinkNode<T>;
    while (curNode !== this._header) {
      let tmpNode = curNode;
      while (tmpNode.next && tmpNode.value === tmpNode.next.value) {
        tmpNode = tmpNode.next;
        this._length -= 1;
      }
      curNode.next = tmpNode.next as LinkNode<T>;
      curNode.next.pre = curNode;
      curNode = curNode.next as LinkNode<T>;
    }
  }
  sort(cmp?: (x: T, y: T) => number) {
    if (this._length <= 1) return;
    const arr: T[] = [];
    this.forEach(element => arr.push(element));
    arr.sort(cmp);
    let curNode: LinkNode<T> = this._head as LinkNode<T>;
    arr.forEach((element) => {
      curNode.value = element;
      curNode = curNode.next as LinkNode<T>;
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
      this._tail.next = this._header;
      this._header.pre = this._tail;
    } else {
      newHead.next = this._head;
      this._head.pre = newHead;
      this._head = newHead;
    }
    this._header.next = this._head;
    this._head.pre = this._header;
  }
  /**
   * @description Removes the first element.
   */
  popFront() {
    if (!this._head) return;
    this._length -= 1;
    if (this._head === this._tail) {
      this._head = this._tail = undefined;
      this._header.pre = this._tail;
    } else {
      this._head = this._head.next as LinkNode<T>;
      this._head.pre = this._header;
    }
    this._header.next = this._head;
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
        (curNode.value as T) <= element
      ) {
        curNode = curNode.next as LinkNode<T>;
      }
      if (curNode === this._header) {
        this.pushBack(element);
        curNode = this._tail as LinkNode<T>;
      } else if (curNode === this._head) {
        this.pushFront(element);
        curNode = this._head;
      } else {
        this._length += 1;
        const pre = curNode.pre as LinkNode<T>;
        pre.next = new LinkNode(element);
        pre.next.pre = pre;
        pre.next.next = curNode;
        curNode.pre = pre.next;
      }
    });
  }
  [Symbol.iterator]() {
    return function * (this: LinkList<T>) {
      if (!this._head) return;
      let curNode = this._head;
      while (curNode !== this._header) {
        yield curNode.value as T;
        curNode = curNode.next as LinkNode<T>;
      }
    }.bind(this)();
  }
}

export default LinkList;
