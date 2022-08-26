import { ContainerIterator, initContainer } from '@/container/ContainerBase/index';
import { checkWithinAccessParams } from '@/utils/checkParams';
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
  private readonly header: LinkNode<T>;
  constructor(
    node: LinkNode<T>,
    header: LinkNode<T>,
    iteratorType: 'normal' | 'reverse' = 'normal'
  ) {
    super(iteratorType);
    this.node = node;
    this.header = header;
  }
  get pointer() {
    if (this.node === this.header) {
      throw new RangeError('LinkList iterator access denied!');
    }
    return this.node.value as T;
  }
  set pointer(newValue: T) {
    if (this.node === this.header) {
      throw new RangeError('LinkList iterator access denied!');
    }
    this.node.value = newValue;
  }
  pre() {
    if (this.iteratorType === 'reverse') {
      this.node.next = this.node.next as LinkNode<T>;
      if (this.node.next === this.header) {
        throw new RangeError('LinkList iterator access denied!');
      }
      this.node = this.node.next;
    } else {
      this.node.pre = this.node.pre as LinkNode<T>;
      if (this.node.pre === this.header) {
        throw new RangeError('LinkList iterator access denied!');
      }
      this.node = this.node.pre;
    }
    return this;
  }
  next() {
    if (this.node === this.header) {
      throw new RangeError('LinkList iterator access denied!');
    }
    if (this.iteratorType === 'reverse') {
      this.node = this.node.pre as LinkNode<T>;
    } else {
      this.node = this.node.next as LinkNode<T>;
    }
    return this;
  }
  equals(obj: LinkListIterator<T>) {
    if (obj.constructor.name !== this.constructor.name) {
      throw new TypeError(`Obj's constructor is not ${this.constructor.name}!`);
    }
    if (this.iteratorType !== obj.iteratorType) {
      throw new TypeError('Iterator type error!');
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
    return new LinkListIterator(this.head || this.header, this.header);
  }
  end() {
    return new LinkListIterator(this.header, this.header);
  }
  rBegin() {
    return new LinkListIterator(this.tail || this.header, this.header, 'reverse');
  }
  rEnd() {
    return new LinkListIterator(this.header, this.header, 'reverse');
  }
  front() {
    return this.head ? this.head.value : undefined;
  }
  back() {
    return this.tail ? this.tail.value : undefined;
  }
  forEach(callback: (element: T, index: number) => void) {
    if (!this.length) return;
    let curNode = this.head as LinkNode<T>;
    let index = 0;
    while (curNode !== this.header) {
      callback(curNode.value as T, index++);
      curNode = curNode.next as LinkNode<T>;
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
      this.length -= 1;
    }
  }
  eraseElementByValue(value: T) {
    while (this.head && this.head.value === value) this.popFront();
    while (this.tail && this.tail.value === value) this.popBack();
    if (!this.head) return;
    let curNode: LinkNode<T> = this.head;
    while (curNode !== this.header) {
      if (curNode.value === value) {
        const pre = curNode.pre;
        const next = curNode.next;
        if (next) next.pre = pre;
        if (pre) pre.next = next;
        this.length -= 1;
      }
      curNode = curNode.next as LinkNode<T>;
    }
  }
  eraseElementByIterator(iter: LinkListIterator<T>) {
    // @ts-ignore
    const node = iter.node;
    if (node === this.header) {
      throw new RangeError('Invalid iterator');
    }
    iter = iter.next();
    if (this.head === node) this.popFront();
    else if (this.tail === node) this.popBack();
    else {
      const pre = node.pre;
      const next = node.next;
      if (next) next.pre = pre;
      if (pre) pre.next = next;
      this.length -= 1;
    }
    return iter;
  }
  pushBack(element: T) {
    this.length += 1;
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
    this.length -= 1;
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
    checkWithinAccessParams(pos, 0, this.length - 1);
    let curNode = this.head as LinkNode<T>;
    while (pos--) {
      curNode = curNode.next as LinkNode<T>;
    }
    curNode.value = element;
  }
  insert(pos: number, element: T, num = 1) {
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
    if (!this.head) return this.end();
    let curNode = this.head;
    while (curNode !== this.header) {
      if (curNode.value === element) {
        return new LinkListIterator(curNode, this.header);
      }
      curNode = curNode.next as LinkNode<T>;
    }
    return this.end();
  }
  reverse() {
    if (this.length <= 1) return;
    let pHead = this.head as LinkNode<T>;
    let pTail = this.tail as LinkNode<T>;
    let cnt = 0;
    while ((cnt << 1) < this.length) {
      const tmp = pHead.value;
      pHead.value = pTail.value;
      pTail.value = tmp;
      pHead = pHead.next as LinkNode<T>;
      pTail = pTail.pre as LinkNode<T>;
      cnt += 1;
    }
  }
  unique() {
    if (this.length <= 1) return;
    let curNode = this.head as LinkNode<T>;
    while (curNode !== this.header) {
      let tmpNode = curNode;
      while (tmpNode.next && tmpNode.value === tmpNode.next.value) {
        tmpNode = tmpNode.next;
        this.length -= 1;
      }
      curNode.next = tmpNode.next;
      if (curNode.next) curNode.next.pre = curNode;
      curNode = curNode.next as LinkNode<T>;
    }
  }
  sort(cmp?: (x: T, y: T) => number) {
    if (this.length <= 1) return;
    const arr: T[] = [];
    this.forEach(element => arr.push(element));
    arr.sort(cmp);
    let curNode: LinkNode<T> = this.head as LinkNode<T>;
    arr.forEach((element) => {
      curNode.value = element;
      curNode = curNode.next as LinkNode<T>;
    });
  }
  /**
   * Inserts an element to the beginning.
   */
  pushFront(element: T) {
    this.length += 1;
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
    this.length -= 1;
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
    if (!this.head) {
      list.forEach(element => this.pushBack(element));
      return;
    }
    let curNode: LinkNode<T> = this.head;
    list.forEach(element => {
      while (
        curNode &&
        curNode !== this.header &&
        (curNode.value as T) <= element
      ) {
        curNode = curNode.next as LinkNode<T>;
      }
      if (curNode === this.header) {
        this.pushBack(element);
        curNode = this.tail as LinkNode<T>;
      } else if (curNode === this.head) {
        this.pushFront(element);
        curNode = this.head;
      } else {
        this.length += 1;
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
      if (!this.head) return;
      let curNode = this.head;
      while (curNode !== this.header) {
        yield curNode.value as T;
        curNode = curNode.next as LinkNode<T>;
      }
    }.bind(this)();
  }
}

export default LinkList;
