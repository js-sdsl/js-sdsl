import { ContainerIterator, initContainer } from '@/container/ContainerBase/index';
import { checkWithinAccessParams } from '@/utils/checkParams';
import SequentialContainer from './Base/index';

export class DequeIterator<T> extends ContainerIterator<T> {
  private node: number;
  private readonly size: () => number;
  private readonly getElementByPos: (pos: number) => T;
  private readonly setElementByPos: (pos: number, element: T) => void;
  constructor(
    index: number,
    size: () => number,
    getElementByPos: (pos: number) => T,
    setElementByPos: (pos: number, element: T) => void,
    iteratorType: 'normal' | 'reverse' = 'normal'
  ) {
    super(iteratorType);
    this.node = index;
    this.size = size;
    this.getElementByPos = getElementByPos;
    this.setElementByPos = setElementByPos;
  }
  get pointer() {
    checkWithinAccessParams(this.node, 0, this.size() - 1);
    return this.getElementByPos(this.node);
  }
  set pointer(newValue: T) {
    checkWithinAccessParams(this.node, 0, this.size() - 1);
    this.setElementByPos(this.node, newValue);
  }
  pre() {
    if (this.iteratorType === 'reverse') {
      if (this.node === this.size() - 1) {
        throw new RangeError('Deque iterator access denied!');
      }
      this.node += 1;
    } else {
      if (this.node === 0) {
        throw new RangeError('Deque iterator access denied!');
      }
      this.node -= 1;
    }
    return this;
  }
  next() {
    if (this.iteratorType === 'reverse') {
      if (this.node === -1) {
        throw new RangeError('Deque iterator access denied!');
      }
      this.node -= 1;
    } else {
      if (this.node === this.size()) {
        throw new RangeError('Deque Iterator access denied!');
      }
      this.node += 1;
    }
    return this;
  }
  equals(obj: DequeIterator<T>) {
    if (obj.constructor.name !== this.constructor.name) {
      throw new TypeError(`Obj's constructor is not ${this.constructor.name}!`);
    }
    if (this.iteratorType !== obj.iteratorType) {
      throw new TypeError('Iterator type error!');
    }
    return this.node === obj.node;
  }
}

class Deque<T> extends SequentialContainer<T> {
  private first = 0;
  private curFirst = 0;
  private last = 0;
  private curLast = 0;
  private bucketNum = 0;
  private readonly bucketSize: number;
  private map: T[][] = [];
  constructor(container: initContainer<T> = [], bucketSize = (1 << 12)) {
    super();
    let _length;
    if ('size' in container) {
      if (typeof container.size === 'number') {
        _length = container.size;
      } else {
        _length = container.size();
      }
    } else if ('length' in container) {
      _length = container.length;
    } else {
      throw new RangeError('Can\'t get container\'s size!');
    }
    this.bucketSize = bucketSize;
    const needSize = _length * 3;
    if (needSize < this.bucketSize) {
      this.bucketNum = 1;
      this.map.push(new Array(needSize));
      this.first = this.last = 0;
      this.curFirst = this.curLast = _length;
    } else {
      this.bucketNum = Math.max(Math.ceil(_length / this.bucketSize), 1);
      for (let i = 0; i < this.bucketNum; ++i) {
        this.map.push(new Array(this.bucketSize));
      }
      const needBucketNum = Math.ceil(_length / this.bucketSize);
      this.first = this.last = (this.bucketNum >> 1) - (needBucketNum >> 1);
      this.curFirst = this.curLast = (this.bucketSize - _length % this.bucketSize) >> 1;
    }
    container.forEach(element => this.pushBack(element));
    this.size = this.size.bind(this);
    this.getElementByPos = this.getElementByPos.bind(this);
    this.setElementByPos = this.setElementByPos.bind(this);
  }
  private reAllocate() {
    const newMap = [];
    const addBucketNum = Math.max(this.bucketNum >> 1, 1);
    for (let i = 0; i < addBucketNum; ++i) {
      newMap[i] = new Array(this.bucketSize);
    }
    for (let i = this.first; i < this.bucketNum; ++i) {
      newMap[newMap.length] = this.map[i];
    }
    for (let i = 0; i < this.last; ++i) {
      newMap[newMap.length] = this.map[i];
    }
    newMap[newMap.length] = [...this.map[this.last]];
    this.first = addBucketNum;
    this.last = newMap.length - 1;
    for (let i = 0; i < addBucketNum; ++i) {
      newMap[newMap.length] = new Array(this.bucketSize);
    }
    this.map = newMap;
    this.bucketNum = newMap.length;
  }
  private getElementIndex(pos: number) {
    const offset = this.curFirst + pos + 1;
    const offsetRemainder = offset % this.bucketSize;
    let curNodePointerIndex = offsetRemainder - 1;
    let curNodeBucketIndex = this.first + (offset - offsetRemainder) / this.bucketSize;
    if (offsetRemainder === 0) curNodeBucketIndex -= 1;
    curNodeBucketIndex %= this.bucketNum;
    if (curNodePointerIndex < 0) curNodePointerIndex += this.bucketSize;
    return { curNodeBucketIndex, curNodePointerIndex };
  }
  clear() {
    this.map = [[]];
    this.bucketNum = 1;
    this.first = this.last = this.length = 0;
    this.curFirst = this.curLast = this.bucketSize >> 1;
  }
  front() {
    return this.map[this.first][this.curFirst] as (T | undefined);
  }
  back() {
    return this.map[this.last][this.curLast] as (T | undefined);
  }
  begin() {
    return new DequeIterator<T>(
      0,
      this.size,
      this.getElementByPos,
      this.setElementByPos
    );
  }
  end() {
    return new DequeIterator(
      this.length,
      this.size,
      this.getElementByPos,
      this.setElementByPos
    );
  }
  rBegin() {
    return new DequeIterator(
      this.length - 1,
      this.size,
      this.getElementByPos,
      this.setElementByPos,
      'reverse'
    );
  }
  rEnd() {
    return new DequeIterator(
      -1,
      this.size,
      this.getElementByPos,
      this.setElementByPos,
      'reverse'
    );
  }
  pushBack(element: T) {
    if (this.length) {
      if (this.curLast < this.bucketSize - 1) {
        this.curLast += 1;
      } else if (this.last < this.bucketNum - 1) {
        this.last += 1;
        this.curLast = 0;
      } else {
        this.last = 0;
        this.curLast = 0;
      }
      if (
        this.last === this.first &&
        this.curLast === this.curFirst
      ) this.reAllocate();
    }
    this.length += 1;
    this.map[this.last][this.curLast] = element;
  }
  popBack() {
    if (!this.length) return;
    if (this.length !== 1) {
      if (this.curLast > 0) {
        this.curLast -= 1;
      } else if (this.last > 0) {
        this.last -= 1;
        this.curLast = this.bucketSize - 1;
      } else {
        this.last = this.bucketNum - 1;
        this.curLast = this.bucketSize - 1;
      }
    }
    this.length -= 1;
  }
  /**
   * Push the element to the front.
   */
  pushFront(element: T) {
    if (this.length) {
      if (this.curFirst > 0) {
        this.curFirst -= 1;
      } else if (this.first > 0) {
        this.first -= 1;
        this.curFirst = this.bucketSize - 1;
      } else {
        this.first = this.bucketNum - 1;
        this.curFirst = this.bucketSize - 1;
      }
      if (
        this.first === this.last &&
        this.curFirst === this.curLast
      ) this.reAllocate();
    }
    this.length += 1;
    this.map[this.first][this.curFirst] = element;
  }
  /**
   * Remove the first element.
   */
  popFront() {
    if (!this.length) return;
    if (this.length !== 1) {
      if (this.curFirst < this.bucketSize - 1) {
        this.curFirst += 1;
      } else if (this.first < this.bucketNum - 1) {
        this.first += 1;
        this.curFirst = 0;
      } else {
        this.first = 0;
        this.curFirst = 0;
      }
    }
    this.length -= 1;
  }
  forEach(callback: (element: T, index: number) => void) {
    for (let i = 0; i < this.length; ++i) {
      callback(this.getElementByPos(i), i);
    }
  }
  getElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this.getElementIndex(pos);
    return this.map[curNodeBucketIndex][curNodePointerIndex];
  }
  setElementByPos(pos: number, element: T) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this.getElementIndex(pos);
    this.map[curNodeBucketIndex][curNodePointerIndex] = element;
  }
  insert(pos: number, element: T, num = 1) {
    checkWithinAccessParams(pos, 0, this.length);
    if (pos === 0) {
      while (num--) this.pushFront(element);
    } else if (pos === this.length) {
      while (num--) this.pushBack(element);
    } else {
      const arr: T[] = [];
      for (let i = pos; i < this.length; ++i) {
        arr.push(this.getElementByPos(i));
      }
      this.cut(pos - 1);
      for (let i = 0; i < num; ++i) this.pushBack(element);
      for (let i = 0; i < arr.length; ++i) this.pushBack(arr[i]);
    }
  }
  /**
   * Remove all elements after the specified position (excluding the specified position).
   */
  cut(pos: number) {
    if (pos < 0) {
      this.clear();
      return;
    }
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this.getElementIndex(pos);
    this.last = curNodeBucketIndex;
    this.curLast = curNodePointerIndex;
    this.length = pos + 1;
  }
  eraseElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    if (pos === 0) this.popFront();
    else if (pos === this.length - 1) this.popBack();
    else {
      const arr = [];
      for (let i = pos + 1; i < this.length; ++i) {
        arr.push(this.getElementByPos(i));
      }
      this.cut(pos);
      this.popBack();
      arr.forEach(element => this.pushBack(element));
    }
  }
  eraseElementByValue(value: T) {
    if (!this.length) return;
    const arr: T[] = [];
    for (let i = 0; i < this.length; ++i) {
      const element = this.getElementByPos(i);
      if (element !== value) arr.push(element);
    }
    const _length = arr.length;
    for (let i = 0; i < _length; ++i) this.setElementByPos(i, arr[i]);
    this.cut(_length - 1);
  }
  eraseElementByIterator(iter: DequeIterator<T>) {
    // @ts-ignore
    const node = iter.node;
    this.eraseElementByPos(node);
    iter = iter.next();
    return iter;
  }
  find(element: T) {
    for (let i = 0; i < this.length; ++i) {
      if (this.getElementByPos(i) === element) {
        return new DequeIterator(
          i,
          this.size,
          this.getElementByPos,
          this.setElementByPos
        );
      }
    }
    return this.end();
  }
  reverse() {
    let l = 0; let r = this.length - 1;
    while (l < r) {
      const tmp = this.getElementByPos(l);
      this.setElementByPos(l, this.getElementByPos(r));
      this.setElementByPos(r, tmp);
      l += 1;
      r -= 1;
    }
  }
  unique() {
    if (this.length <= 1) return;
    let index = 1;
    let pre = this.getElementByPos(0);
    for (let i = 1; i < this.length; ++i) {
      const cur = this.getElementByPos(i);
      if (cur !== pre) {
        pre = cur;
        this.setElementByPos(index++, cur);
      }
    }
    while (this.length > index) this.popBack();
  }
  sort(cmp?: (x: T, y: T) => number) {
    const arr: T[] = [];
    for (let i = 0; i < this.length; ++i) {
      arr.push(this.getElementByPos(i));
    }
    arr.sort(cmp);
    for (let i = 0; i < this.length; ++i) this.setElementByPos(i, arr[i]);
  }
  /**
   * Remove as much useless space as possible.
   */
  shrinkToFit() {
    if (!this.length) return;
    const arr: T[] = [];
    this.forEach(element => arr.push(element));
    this.bucketNum = Math.max(Math.ceil(this.length / this.bucketSize), 1);
    this.length = this.first = this.last = this.curFirst = this.curLast = 0;
    this.map = [];
    for (let i = 0; i < this.bucketNum; ++i) {
      this.map.push(new Array(this.bucketSize));
    }
    for (let i = 0; i < arr.length; ++i) this.pushBack(arr[i]);
  }
  [Symbol.iterator]() {
    return function * (this: Deque<T>) {
      for (let i = 0; i < this.length; ++i) {
        yield this.getElementByPos(i);
      }
    }.bind(this)();
  }
}

export default Deque;
