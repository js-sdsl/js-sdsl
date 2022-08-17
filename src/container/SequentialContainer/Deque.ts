import { ContainerInitError, RunTimeError } from '@/utils/error';
import { ContainerIterator, initContainer } from '@/container/ContainerBase/index';
import { checkUndefinedParams, checkWithinAccessParams } from '@/utils/checkParams';
import SequentialContainer from './Base/index';

export class DequeIterator<T> extends ContainerIterator<T> {
  private node: number;
  private size: () => number;
  private getElementByPos: (pos: number) => T;
  private setElementByPos: (pos: number, element: T) => void;
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
        throw new RunTimeError('Deque iterator access denied!');
      }
      this.node += 1;
    } else {
      if (this.node === 0) {
        throw new RunTimeError('Deque iterator access denied!');
      }
      this.node -= 1;
    }
    return this;
  }
  next() {
    if (this.iteratorType === 'reverse') {
      if (this.node === -1) {
        throw new RunTimeError('Deque iterator access denied!');
      }
      this.node -= 1;
    } else {
      if (this.node === this.size()) {
        throw new RunTimeError('Iterator access denied!');
      }
      this.node += 1;
    }
    return this;
  }
  equals(obj: DequeIterator<T>) {
    if (obj.constructor.name !== this.constructor.name) {
      throw new TypeError(`obj's constructor is not ${this.constructor.name}!`);
    }
    if (this.iteratorType !== obj.iteratorType) {
      throw new TypeError('iterator type error!');
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
  private bucketSize: number;
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
      throw new ContainerInitError('Can\'t get container\'s size!');
    }
    this.bucketSize = bucketSize;
    this.bucketNum = Math.max(Math.ceil(_length / this.bucketSize), 1);
    for (let i = 0; i < this.bucketNum; ++i) {
      this.map.push(new Array(this.bucketSize));
    }
    const needBucketNum = Math.ceil(_length / this.bucketSize);
    this.first = this.last = (this.bucketNum >> 1) - (needBucketNum >> 1);
    this.curFirst = this.curLast = (this.bucketSize - _length % this.bucketSize) >> 1;
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
    let newMapLength = addBucketNum;
    if (this.first < this.last) {
      for (let i = this.first; i <= this.last; ++i) {
        newMap[newMapLength] = this.map[i];
        newMapLength += 1;
      }
    } else if (this.first > this.last) {
      for (let i = this.first; i < this.bucketNum; ++i) {
        newMap[newMapLength] = this.map[i];
        newMapLength += 1;
      }
      for (let i = 0; i <= this.last; ++i) {
        newMap[newMapLength] = this.map[i];
        newMapLength += 1;
      }
    } else {
      if (this.curFirst <= this.curLast) {
        newMap[newMapLength] = this.map[this.first];
        newMapLength += 1;
      } else {
        for (let i = this.first; i < this.bucketNum; ++i) {
          newMap[newMapLength] = this.map[i];
          newMapLength += 1;
        }
        for (let i = 0; i <= this.last; ++i) {
          newMap[newMapLength] = [...this.map[i]];
          newMapLength += 1;
        }
      }
    }
    this.first = addBucketNum;
    this.last = newMapLength - 1;
    for (let i = 0; i < addBucketNum; ++i) {
      newMap[newMapLength] = new Array(this.bucketSize);
      newMapLength += 1;
    }
    this.map = newMap;
    this.bucketNum = this.map.length;
  }
  private getElementIndex(pos: number) {
    let curNodeBucketIndex, curNodePointerIndex;
    const curFirstIndex = this.first * this.bucketSize + this.curFirst;
    const curNodeIndex = curFirstIndex + pos;
    if ((curNodeIndex + 1) % this.bucketSize === 0) {
      curNodeBucketIndex = (curNodeIndex + 1) / this.bucketSize - 1;
      curNodePointerIndex = this.bucketSize - 1;
    } else {
      curNodeBucketIndex = Math.floor((curNodeIndex + 1) / this.bucketSize);
      curNodePointerIndex = (curNodeIndex + 1) % this.bucketSize - 1;
    }
    curNodeBucketIndex %= this.bucketNum;
    return { curNodeBucketIndex, curNodePointerIndex };
  }
  clear() {
    this.map = [new Array(this.bucketSize)];
    this.bucketNum = 1;
    this.first = this.last = this.length = 0;
    this.curFirst = this.curLast = this.bucketSize >> 1;
  }
  front() {
    return this.map[this.first][this.curFirst];
  }
  back() {
    return this.map[this.last][this.curLast];
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
      'reverse');
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
    checkUndefinedParams(element);
    if (this.length) {
      while (true) {
        let changedLast = this.last;
        let changedCurLast = this.curLast;
        if (this.curLast < this.bucketSize - 1) {
          changedCurLast += 1;
        } else if (this.last < this.bucketNum - 1) {
          changedLast += 1;
          changedCurLast = 0;
        } else {
          changedLast = 0;
          changedCurLast = 0;
        }
        if (
          changedLast === this.first &&
          changedCurLast === this.curFirst
        ) {
          this.reAllocate();
          continue;
        }
        this.last = changedLast;
        this.curLast = changedCurLast;
        break;
      }
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
    checkUndefinedParams(element);
    if (this.length) {
      while (true) {
        let changedFirst = this.first;
        let changedCurFirst = this.curFirst;
        if (this.curFirst > 0) {
          changedCurFirst -= 1;
        } else if (this.first > 0) {
          changedFirst -= 1;
          changedCurFirst = this.bucketSize - 1;
        } else {
          changedFirst = this.bucketNum - 1;
          changedCurFirst = this.bucketSize - 1;
        }
        if (
          changedFirst === this.last &&
          changedCurFirst === this.curLast
        ) {
          this.reAllocate();
          continue;
        }
        this.first = changedFirst;
        this.curFirst = changedCurFirst;
        break;
      }
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
    if (element === undefined || element === null) {
      this.eraseElementByPos(pos);
      return;
    }
    checkWithinAccessParams(pos, 0, this.length - 1);
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this.getElementIndex(pos);
    this.map[curNodeBucketIndex][curNodePointerIndex] = element;
  }
  insert(pos: number, element: T, num = 1) {
    checkUndefinedParams(element);
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
    if (pos < 0 || pos > this.length) {
      checkWithinAccessParams(pos, 0, this.length - 1);
    }
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
