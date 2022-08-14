import { RunTimeError } from '@/utils/error';
import { ContainerIterator, initContainer } from '@/container/ContainerBase/index';
import { checkUndefinedParams, checkWithinAccessParams } from '@/utils/checkParams';
import SequentialContainer from './Base/index';

export class LinkNode<T> {
  value: T | undefined = undefined;
  pre: LinkNode<T> | undefined = undefined;
  next: LinkNode<T> | undefined = undefined;
  constructor(element?: T) {
    this.value = element;
  }
}

export class LinkListIterator<T> extends ContainerIterator<T> {
  private node: LinkNode<T>;
  constructor(
    node: LinkNode<T>,
    iteratorType: 'normal' | 'reverse' = 'normal'
  ) {
    super(iteratorType);
    this.node = node;
  }
  get pointer() {
    if (this.node.value === undefined) {
      throw new RunTimeError('LinkList iterator access denied!');
    }
    return this.node.value;
  }
  set pointer(newValue: T) {
    if (this.node.value === undefined) {
      throw new RunTimeError('LinkList iterator access denied!');
    }
    checkUndefinedParams(newValue);
    this.node.value = newValue;
  }
  pre() {
    if (this.iteratorType === 'reverse') {
      this.node.next = this.node.next as LinkNode<T>;
      if (this.node.next.value === undefined) {
        throw new RunTimeError('LinkList iterator access denied!');
      }
      this.node = this.node.next;
    } else {
      this.node.pre = this.node.pre as LinkNode<T>;
      if (this.node.pre.value === undefined) {
        throw new RunTimeError('LinkList iterator access denied!');
      }
      this.node = this.node.pre;
    }
    return this;
  }
  next() {
    if (this.iteratorType === 'reverse') {
      if (this.node.value === undefined) {
        throw new RunTimeError('LinkList iterator access denied!');
      }
      this.node = this.node.pre as LinkNode<T>;
    } else {
      if (this.node.value === undefined) {
        throw new RunTimeError('LinkList iterator access denied!');
      }
      this.node = this.node.next as LinkNode<T>;
    }
    return this;
  }
  equals(obj: LinkListIterator<T>) {
    if (obj.constructor.name !== this.constructor.name) {
      throw new TypeError(`obj's constructor is not ${this.constructor.name}!`);
    }
    if (this.iteratorType !== obj.iteratorType) {
      throw new TypeError('iterator type error!');
    }
    return this.node === obj.node;
  }
}

class LinkList<T> extends SequentialContainer<T> {
  private header: LinkNode<T> = new LinkNode<T>();
  private head: LinkNode<T> | undefined = undefined;
  private tail: LinkNode<T> | undefined = undefined;
  constructor(container: initContainer<T> = []) {
    super();
    container.forEach(element => this.pushBack(element));
  }
  clear() {
    this.length = 0;
    this.head = this.tail = undefined;
    this.header.pre = this.header.next = undefined;
  }
  begin() {
    return new LinkListIterator(this.head || this.header);
  }
  end() {
    return new LinkListIterator(this.header);
  }
  rBegin() {
    return new LinkListIterator(this.tail || this.header, 'reverse');
  }
  rEnd() {
    return new LinkListIterator(this.header, 'reverse');
  }
  front() {
    return this.head?.value;
  }
  back() {
    return this.tail?.value;
  }
  forEach(callback: (element: T, index: number) => void) {
    let curNode = this.head;
    let index = 0;
    while (curNode && curNode !== this.header) {
      callback(curNode.value as T, index++);
      curNode = curNode.next;
    }
  }
  getElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    let curNode = this.head as LinkNode<T>;
    while (pos--) {
      curNode = curNode.next as LinkNode<T>;
    }
    return curNode.value as T;
  }
  eraseElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    if (pos === 0) this.popFront();
    else if (pos === this.length - 1) this.popBack();
    else {
      let curNode = this.head;
      while (pos--) {
        curNode = (curNode as LinkNode<T>).next;
      }
      curNode = curNode as LinkNode<T>;
      const pre = curNode.pre as LinkNode<T>;
      const next = curNode.next as LinkNode<T>;
      next.pre = pre;
      pre.next = next;
      if (this.length > 0) --this.length;
    }
  }
  eraseElementByValue(value: T) {
    while (this.head && this.head.value === value) this.popFront();
    while (this.tail && this.tail.value === value) this.popBack();
    if (!this.head) return;
    let curNode: LinkNode<T> | undefined = this.head;
    while (curNode && curNode !== this.header) {
      if (curNode.value === value) {
        const pre = curNode.pre;
        const next = curNode.next;
        if (next) next.pre = pre;
        if (pre) pre.next = next;
        if (this.length > 0) --this.length;
      }
      curNode = curNode.next;
    }
  }
  eraseElementByIterator(iter: LinkListIterator<T>) {
    if (!this.length) {
      throw new RunTimeError();
    }
    // @ts-ignore
    const node = iter.node;
    iter = iter.next();
    if (this.head === node) this.popFront();
    else if (this.tail === node) this.popBack();
    else {
      const pre = node.pre;
      const next = node.next;
      if (next) next.pre = pre;
      if (pre) pre.next = next;
      --this.length;
    }
    return iter;
  }
  pushBack(element: T) {
    checkUndefinedParams(element);
    ++this.length;
    const newTail = new LinkNode(element);
    if (!this.tail) {
      this.head = this.tail = newTail;
      this.header.next = this.head;
      this.head.pre = this.header;
    } else {
      this.tail.next = newTail;
      newTail.pre = this.tail;
      this.tail = newTail;
    }
    this.tail.next = this.header;
    this.header.pre = this.tail;
  }
  popBack() {
    if (!this.tail) return;
    if (this.length > 0) --this.length;
    if (this.head === this.tail) {
      this.head = this.tail = undefined;
      this.header.next = undefined;
    } else {
      this.tail = this.tail.pre;
      if (this.tail) this.tail.next = undefined;
    }
    this.header.pre = this.tail;
    if (this.tail) this.tail.next = this.header;
  }
  setElementByPos(pos: number, element: T) {
    checkUndefinedParams(element);
    checkWithinAccessParams(pos, 0, this.length - 1);
    let curNode = this.head;
    while (pos--) {
      curNode = (curNode as LinkNode<T>).next;
    }
    if (curNode) curNode.value = element;
  }
  insert(pos: number, element: T, num = 1) {
    checkUndefinedParams(element);
    checkWithinAccessParams(pos, 0, this.length);
    if (num <= 0) return;
    if (pos === 0) {
      while (num--) this.pushFront(element);
    } else if (pos === this.length) {
      while (num--) this.pushBack(element);
    } else {
      let curNode = this.head as LinkNode<T>;
      for (let i = 1; i < pos; ++i) {
        curNode = curNode.next as LinkNode<T>;
      }
      const next = curNode.next;
      this.length += num;
      while (num--) {
        curNode.next = new LinkNode(element);
        curNode.next.pre = curNode;
        curNode = curNode.next;
      }
      curNode.next = next;
      if (next) next.pre = curNode;
    }
  }
  find(element: T) {
    let curNode = this.head;
    while (curNode && curNode !== this.header) {
      if (curNode.value === element) return new LinkListIterator(curNode);
      curNode = curNode.next;
    }
    return this.end();
  }
  reverse() {
    let pHead = this.head;
    let pTail = this.tail;
    let cnt = 0;
    while (pHead && pTail && cnt * 2 < this.length) {
      const tmp = pHead.value;
      pHead.value = pTail.value;
      pTail.value = tmp;
      pHead = pHead.next;
      pTail = pTail.pre;
      ++cnt;
    }
  }
  unique() {
    let curNode = this.head;
    while (curNode && curNode !== this.header) {
      let tmpNode = curNode;
      while (tmpNode && tmpNode.next && tmpNode.value === tmpNode.next.value) {
        tmpNode = tmpNode.next;
        if (this.length > 0) --this.length;
      }
      curNode.next = tmpNode.next;
      if (curNode.next) curNode.next.pre = curNode;
      curNode = curNode.next;
    }
  }
  sort(cmp?: (x: T, y: T) => number) {
    const arr: T[] = [];
    this.forEach((element) => {
      arr.push(element);
    });
    arr.sort(cmp);
    let curNode: LinkNode<T> | undefined = this.head;
    arr.forEach((element) => {
      if (curNode) {
        curNode.value = element;
        curNode = curNode.next;
      }
    });
  }
  /**
   * Inserts an element to the beginning.
   */
  pushFront(element: T) {
    checkUndefinedParams(element);
    ++this.length;
    const newHead = new LinkNode(element);
    if (!this.head) {
      this.head = this.tail = newHead;
      this.tail.next = this.header;
      this.header.pre = this.tail;
    } else {
      newHead.next = this.head;
      this.head.pre = newHead;
      this.head = newHead;
    }
    this.header.next = this.head;
    this.head.pre = this.header;
  }
  /**
   * Removes the first element.
   */
  popFront() {
    if (!this.head) return;
    if (this.length > 0) --this.length;
    if (this.head === this.tail) {
      this.head = this.tail = undefined;
      this.header.pre = this.tail;
    } else {
      this.head = this.head.next;
      if (this.head) this.head.pre = this.header;
    }
    this.header.next = this.head;
  }
  /**
   * Merges two sorted lists.
   */
  merge(list: LinkList<T>) {
    let curNode: LinkNode<T> | undefined = this.head;
    list.forEach((element: T) => {
      while (
        curNode &&
        curNode !== this.header &&
        curNode.value !== undefined &&
        curNode.value <= element
      ) {
        curNode = curNode.next;
      }
      if (curNode === this.header) {
        this.pushBack(element);
        curNode = this.tail;
      } else if (curNode === this.head) {
        this.pushFront(element);
        curNode = this.head;
      } else {
        ++this.length;
        const pre = (curNode as LinkNode<T>).pre;
        if (pre) {
          pre.next = new LinkNode(element);
          pre.next.pre = pre;
          pre.next.next = curNode;
          if (curNode) curNode.pre = pre.next;
        }
      }
    });
  }
  [Symbol.iterator]() {
    return function * (this: LinkList<T>) {
      let curNode = this.head;
      while (curNode && curNode !== this.header) {
        yield curNode.value as T;
        curNode = curNode.next;
      }
    }.bind(this)();
  }
}

export default LinkList;
