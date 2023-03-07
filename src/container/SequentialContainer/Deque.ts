import SequentialContainer from './Base';
import { IteratorType, initContainer } from '@/container/ContainerBase';
import { RandomIterator } from '@/container/SequentialContainer/Base/RandomIterator';
import $checkWithinAccessParams from '@/utils/checkParams.macro';
import $getContainerSize from '@/utils/getContainerSize.macro';
import * as Math from '@/utils/math';

class DequeIterator<T> extends RandomIterator<T> {
  readonly container: Deque<T>;
  constructor(node: number, container: Deque<T>, iteratorType?: IteratorType) {
    super(node, iteratorType);
    this.container = container;
  }
  copy() {
    return new DequeIterator<T>(this._node, this.container, this.iteratorType);
  }
  // @ts-ignore
  equals(iter: DequeIterator<T>): boolean;
}

export type { DequeIterator };

class Deque<T> extends SequentialContainer<T> {
  /**
   * @internal
   */
  private _first = 0;
  /**
   * @internal
   */
  private _curFirst = 0;
  /**
   * @internal
   */
  private _last = 0;
  /**
   * @internal
   */
  private _curLast = 0;
  /**
   * @internal
   */
  private _bucketNum = 0;
  /**
   * @internal
   */
  private readonly _bucketSize: number;
  /**
   * @internal
   */
  private _map: T[][] = [];
  constructor(container: initContainer<T> = [], _bucketSize = (1 << 12)) {
    super();
    const _length = $getContainerSize!(container);
    this._bucketSize = _bucketSize;
    this._bucketNum = Math.ceil(_length, this._bucketSize) || 1;
    for (let i = 0; i < this._bucketNum; ++i) {
      this._map.push(new Array(this._bucketSize));
    }
    const needBucketNum = Math.ceil(_length, this._bucketSize);
    this._first = this._last = (this._bucketNum >> 1) - (needBucketNum >> 1);
    this._curFirst = this._curLast = (this._bucketSize - _length % this._bucketSize) >> 1;
    const self = this;
    container.forEach(function (element) {
      self.pushBack(element);
    });
  }
  /**
   * @description Growth the Deque.
   * @internal
   */
  private _reAllocate(needBucketNum?: number) {
    const newMap = [];
    const addBucketNum = needBucketNum || this._bucketNum >> 1 || 1;
    for (let i = 0; i < addBucketNum; ++i) {
      newMap[i] = new Array(this._bucketSize);
    }
    for (let i = this._first; i < this._bucketNum; ++i) {
      newMap[newMap.length] = this._map[i];
    }
    for (let i = 0; i < this._last; ++i) {
      newMap[newMap.length] = this._map[i];
    }
    newMap[newMap.length] = [...this._map[this._last]];
    this._first = addBucketNum;
    this._last = newMap.length - 1;
    for (let i = 0; i < addBucketNum; ++i) {
      newMap[newMap.length] = new Array(this._bucketSize);
    }
    this._map = newMap;
    this._bucketNum = newMap.length;
  }
  /**
   * @description Get the bucket position of the element and the pointer position by index.
   * @param pos - The element's index.
   * @internal
   */
  private _getElementIndex(pos: number) {
    let curNodeBucketIndex, curNodePointerIndex;
    const index = this._curFirst + pos;
    curNodeBucketIndex = this._first + Math.floor(index / this._bucketSize);
    if (curNodeBucketIndex >= this._bucketNum) {
      curNodeBucketIndex -= this._bucketNum;
    }
    curNodePointerIndex = (index + 1) % this._bucketSize - 1;
    if (curNodePointerIndex < 0) {
      curNodePointerIndex = this._bucketSize - 1;
    }
    return { curNodeBucketIndex, curNodePointerIndex };
  }
  clear() {
    this._map = [new Array(this._bucketSize)];
    this._bucketNum = 1;
    this._first = this._last = this._length = 0;
    this._curFirst = this._curLast = this._bucketSize >> 1;
  }
  begin() {
    return new DequeIterator<T>(0, this);
  }
  end() {
    return new DequeIterator<T>(this._length, this);
  }
  rBegin() {
    return new DequeIterator<T>(this._length - 1, this, IteratorType.REVERSE);
  }
  rEnd() {
    return new DequeIterator<T>(-1, this, IteratorType.REVERSE);
  }
  front(): T | undefined {
    if (this._length === 0) return;
    return this._map[this._first][this._curFirst];
  }
  back(): T | undefined {
    if (this._length === 0) return;
    return this._map[this._last][this._curLast];
  }
  pushBack(element: T) {
    if (this._length) {
      if (this._curLast < this._bucketSize - 1) {
        this._curLast += 1;
      } else if (this._last < this._bucketNum - 1) {
        this._last += 1;
        this._curLast = 0;
      } else {
        this._last = 0;
        this._curLast = 0;
      }
      if (
        this._last === this._first &&
        this._curLast === this._curFirst
      ) this._reAllocate();
    }
    this._length += 1;
    this._map[this._last][this._curLast] = element;
    return this._length;
  }
  popBack() {
    if (this._length === 0) return;
    const value = this._map[this._last][this._curLast];
    if (this._length !== 1) {
      if (this._curLast > 0) {
        this._curLast -= 1;
      } else if (this._last > 0) {
        this._last -= 1;
        this._curLast = this._bucketSize - 1;
      } else {
        this._last = this._bucketNum - 1;
        this._curLast = this._bucketSize - 1;
      }
    }
    this._length -= 1;
    return value;
  }
  /**
   * @description Push the element to the front.
   * @param element - The element you want to push.
   * @returns The size of queue after pushing.
   */
  pushFront(element: T) {
    if (this._length) {
      if (this._curFirst > 0) {
        this._curFirst -= 1;
      } else if (this._first > 0) {
        this._first -= 1;
        this._curFirst = this._bucketSize - 1;
      } else {
        this._first = this._bucketNum - 1;
        this._curFirst = this._bucketSize - 1;
      }
      if (
        this._first === this._last &&
        this._curFirst === this._curLast
      ) this._reAllocate();
    }
    this._length += 1;
    this._map[this._first][this._curFirst] = element;
    return this._length;
  }
  /**
   * @description Remove the _first element.
   * @returns The element you popped.
   */
  popFront() {
    if (this._length === 0) return;
    const value = this._map[this._first][this._curFirst];
    if (this._length !== 1) {
      if (this._curFirst < this._bucketSize - 1) {
        this._curFirst += 1;
      } else if (this._first < this._bucketNum - 1) {
        this._first += 1;
        this._curFirst = 0;
      } else {
        this._first = 0;
        this._curFirst = 0;
      }
    }
    this._length -= 1;
    return value;
  }
  getElementByPos(pos: number): T {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this._getElementIndex(pos);
    return this._map[curNodeBucketIndex][curNodePointerIndex]!;
  }
  setElementByPos(pos: number, element: T) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this._getElementIndex(pos);
    this._map[curNodeBucketIndex][curNodePointerIndex] = element;
  }
  insert(pos: number, element: T, num = 1) {
    const length = this._length;
    $checkWithinAccessParams!(pos, 0, length);
    if (pos === 0) {
      while (num--) this.pushFront(element);
    } else if (pos === this._length) {
      while (num--) this.pushBack(element);
    } else {
      const arr: T[] = [];
      for (let i = pos; i < this._length; ++i) {
        arr.push(this.getElementByPos(i));
      }
      this.cut(pos - 1);
      for (let i = 0; i < num; ++i) this.pushBack(element);
      for (let i = 0; i < arr.length; ++i) this.pushBack(arr[i]);
    }
    return this._length;
  }
  /**
   * @description Remove all elements after the specified position (excluding the specified position).
   * @param pos - The previous position of the first removed element.
   * @returns The size of the container after cutting.
   * @example
   * deque.cut(1); // Then deque's size will be 2. deque -> [0, 1]
   */
  cut(pos: number) {
    if (pos < 0) {
      this.clear();
      return 0;
    }
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this._getElementIndex(pos);
    this._last = curNodeBucketIndex;
    this._curLast = curNodePointerIndex;
    this._length = pos + 1;
    return this._length;
  }
  eraseElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    if (pos === 0) this.popFront();
    else if (pos === this._length - 1) this.popBack();
    else {
      const length = this._length - 1;
      let {
        curNodeBucketIndex: curBucket,
        curNodePointerIndex: curPointer
      } = this._getElementIndex(pos);
      for (let i = pos; i < length; ++i) {
        const {
          curNodeBucketIndex: nextBucket,
          curNodePointerIndex: nextPointer
        } = this._getElementIndex(pos + 1);
        this._map[curBucket][curPointer] = this._map[nextBucket][nextPointer];
        curBucket = nextBucket;
        curPointer = nextPointer;
      }
      this.popBack();
    }
    return this._length;
  }
  eraseElementByValue(value: T) {
    const length = this._length;
    if (length === 0) return 0;
    let i = 0;
    let index = 0;
    while (i < length) {
      const element = this.getElementByPos(i);
      if (element !== value) {
        this.setElementByPos(index, element!);
        index += 1;
      }
      i += 1;
    }
    this.cut(index - 1);
    return this._length;
  }
  eraseElementByIterator(iter: DequeIterator<T>) {
    const _node = iter._node;
    this.eraseElementByPos(_node);
    iter = iter.next();
    return iter;
  }
  find(element: T) {
    for (let i = 0; i < this._length; ++i) {
      if (this.getElementByPos(i) === element) {
        return new DequeIterator<T>(i, this);
      }
    }
    return this.end();
  }
  reverse() {
    this._map.reverse().forEach(function (bucket) {
      bucket.reverse();
    });
    const { _first, _last, _curFirst, _curLast } = this;
    this._first = this._bucketNum - _last - 1;
    this._last = this._bucketNum - _first - 1;
    this._curFirst = this._bucketSize - _curLast - 1;
    this._curLast = this._bucketSize - _curFirst - 1;
    return this;
  }
  unique() {
    if (this._length <= 1) {
      return this._length;
    }
    let index = 1;
    let pre = this.getElementByPos(0);
    for (let i = 1; i < this._length; ++i) {
      const cur = this.getElementByPos(i);
      if (cur !== pre) {
        pre = cur;
        this.setElementByPos(index++, cur);
      }
    }
    this.cut(index - 1);
    return this._length;
  }
  sort(cmp?: (x: T, y: T) => number) {
    const arr: T[] = [];
    for (let i = 0; i < this._length; ++i) {
      arr.push(this.getElementByPos(i));
    }
    arr.sort(cmp);
    for (let i = 0; i < this._length; ++i) {
      this.setElementByPos(i, arr[i]);
    }
    return this;
  }
  /**
   * @description Remove as much useless space as possible.
   */
  shrinkToFit() {
    if (this._length === 0) return;
    const newMap = [];
    if (this._first === this._last) return;
    else if (this._first < this._last) {
      for (let i = this._first; i <= this._last; ++i) {
        newMap.push(this._map[i]);
      }
    } else {
      for (let i = this._first; i < this._bucketNum; ++i) {
        newMap.push(this._map[i]);
      }
      for (let i = 0; i <= this._last; ++i) {
        newMap.push(this._map[i]);
      }
    }
    this._first = 0;
    this._last = newMap.length - 1;
    this._map = newMap;
  }
  forEach(callback: (element: T, index: number, deque: Deque<T>) => void) {
    for (let i = 0; i < this._length; ++i) {
      callback(this.getElementByPos(i), i, this);
    }
  }
  * [Symbol.iterator]() {
    for (let i = 0; i < this._length; ++i) {
      yield this.getElementByPos(i);
    }
  }
}

export default Deque;
