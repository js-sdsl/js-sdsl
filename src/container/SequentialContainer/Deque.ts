import SequentialContainer from './Base';
import { IteratorType, initContainer, CallbackFn } from '@/container/ContainerBase';
import { RandomIterator } from '@/container/SequentialContainer/Base/RandomIterator';
import $checkWithinAccessParams from '@/utils/checkParams.macro';
import { CompareFn, compareFromS2L } from '@/utils/compareFn';
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
  private _bucketSize: number = (1 << 12);
  /**
   * @internal
   */
  private _map: T[][] = [];
  constructor(
    container: initContainer<T> = [],
    bucketSize = (1 << 12)
  ) {
    super();
    this._init(container, bucketSize);
  }
  private _init(container: initContainer<T>, bucketSize: number) {
    const _length = $getContainerSize!(container);
    this._bucketSize = bucketSize;
    this._bucketNum = Math.ceil(_length, this._bucketSize) || 1;
    for (let i = 0; i < this._bucketNum; ++i) {
      this._map.push(new Array(this._bucketSize));
    }
    const needBucketNum = Math.ceil(_length, this._bucketSize);
    this._first = this._last = (this._bucketNum >> 1) - (needBucketNum >> 1);
    this._curFirst = this._curLast = (this._bucketSize - _length % this._bucketSize) >> 1;
    const self = this;
    container.forEach(function (item) {
      self.push(item);
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
   * @description Get the bucket position of the item and the pointer position by index.
   * @param index - The item's index.
   * @internal
   */
  private _getElementIndex(index: number) {
    let curNodeBucketIndex, curNodePointerIndex;
    const realIndex = this._curFirst + index;
    curNodeBucketIndex = this._first + Math.floor(realIndex / this._bucketSize);
    if (curNodeBucketIndex >= this._bucketNum) {
      curNodeBucketIndex -= this._bucketNum;
    }
    curNodePointerIndex = (realIndex + 1) % this._bucketSize - 1;
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
  _push(item: T) {
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
    this._map[this._last][this._curLast] = item;
  }
  push(...items: T[]) {
    const num = items.length;
    for (let i = 0; i < num; ++i) {
      this._push(items[i]);
    }
    return this._length;
  }
  pop() {
    if (this._length === 0) return;
    const item = this._map[this._last][this._curLast];
    // istanbul ignore else
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
    return item;
  }
  /**
   * @description Push the item to the front.
   * @param item - The item you want to push.
   */
  _unshift(item: T) {
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
    this._map[this._first][this._curFirst] = item;
  }
  unshift(...items: T[]) {
    const num = items.length;
    for (let i = 0; i < num; ++i) {
      this._unshift(items[i]);
    }
    return this._length;
  }
  /**
   * @description Remove the _first item.
   * @returns The item you popped.
   */
  shift() {
    if (this._length === 0) return;
    const item = this._map[this._first][this._curFirst];
    // istanbul ignore else
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
    return item;
  }
  at(index: number) {
    $checkWithinAccessParams!(index, 0, this._length - 1);
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this._getElementIndex(index);
    return this._map[curNodeBucketIndex][curNodePointerIndex]!;
  }
  set(index: number, item: T) {
    $checkWithinAccessParams!(index, 0, this._length - 1);
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this._getElementIndex(index);
    this._map[curNodeBucketIndex][curNodePointerIndex] = item;
  }
  /**
   * @description Remove all elements after the specified position (excluding the specified position).
   * @param index - The previous position of the first removed item.
   * @returns The size of the container after cutting.
   * @example
   * deque.cut(1); // Then deque's size will be 2. deque -> [0, 1]
   */
  cut(index: number) {
    if (index < 0) {
      this.clear();
      return 0;
    }
    const {
      curNodeBucketIndex,
      curNodePointerIndex
    } = this._getElementIndex(index);
    this._last = curNodeBucketIndex;
    this._curLast = curNodePointerIndex;
    this._length = index + 1;
    return this._length;
  }
  eraseElementByIterator(iter: DequeIterator<T>) {
    const _node = iter._node;
    $checkWithinAccessParams!(_node, 0, this._length - 1);
    this.splice(_node, 1);
    iter = iter.next();
    return iter;
  }
  find(item: T, cmp: CompareFn<T> = compareFromS2L) {
    for (let i = 0; i < this._length; ++i) {
      if (cmp(this.at(i), item) === 0) {
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
  unique(cmp: CompareFn<T> = compareFromS2L) {
    const length = this._length;
    if (length <= 1) {
      return length;
    }
    let index = 1;
    let pre = this.at(0);
    for (let i = 1; i < length; ++i) {
      const cur = this.at(i);
      if (cmp(cur, pre) !== 0) {
        pre = cur;
        this.set(index++, cur);
      }
    }
    this.cut(index - 1);
    return this._length;
  }
  sort(cmp: CompareFn<T> = compareFromS2L) {
    const arr: T[] = [];
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      arr.push(this.at(i));
    }
    arr.sort(cmp);
    for (let i = 0; i < length; ++i) {
      this.set(i, arr[i]);
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
  forEach(callback: CallbackFn<T, this, void>) {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      callback(this.at(i), i, this);
    }
  }
  * [Symbol.iterator]() {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      yield this.at(i);
    }
  }
  entries(): IterableIterator<[number, T]> {
    let index = 0;
    const self = this;
    return {
      next() {
        const done = index >= self._length;
        if (done) {
          return {
            done,
            value: undefined as unknown as [number, T]
          };
        }
        const value = <[number, T]>[index, self.at(index)];
        index += 1;
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
  every(callback: CallbackFn<T, this, unknown>): boolean {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const flag = callback(this.at(i), i, this);
      if (!flag) return false;
    }
    return true;
  }
  filter(callback: CallbackFn<T, this, unknown>) {
    const filtered: T[] = [];
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const item = this.at(i);
      const flag = callback(item, i, this);
      if (flag) filtered.push(item);
    }
    return new Deque(filtered, this._bucketSize);
  }
  map<U>(callback: CallbackFn<T, this, U>) {
    const mapped = [];
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const item = this.at(i);
      const newItem = callback(item, i, this);
      mapped.push(newItem);
    }
    return new Deque(mapped, this._bucketSize);
  }
  slice(start = 0, end = this._length) {
    const length = this._length;
    const sliceDeque = new Deque<T>([], this._bucketSize);
    if (start >= length) {
      return sliceDeque;
    } else if (start < 0) {
      start += length;
      if (start < 0) {
        start = 0;
      }
    }
    if (end < 0) end += length;
    else if (end > length) end = length;
    for (let i = start; i < end; ++i) {
      sliceDeque.push(this.at(i));
    }
    return new Deque(sliceDeque, this._bucketSize);
  }
  some(callback: CallbackFn<T, this, unknown>): boolean {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const flag = callback(this.at(i), i, this);
      if (flag) return true;
    }
    return false;
  }
  splice(start: number, deleteCount?: number, ...items: T[]) {
    const length = this._length;
    if (typeof start !== 'number' || length <= 0) {
      this.push(...items);
      return new Deque<T>([], this._bucketSize);
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

    const self = this;
    let index = 0;
    const endDeleteIndex = start + deleteCount;
    const deleteDeque = new Deque<T>([], this._bucketSize);
    const { _map, _bucketNum, _bucketSize, _first, _last, _curFirst, _curLast } = this;

    this.clear();

    function handleForBeginOrEnd(index: number, item: T) {
      if (index === start) {
        self.push(...items);
      }
      if (deleteCount && index >= start && index < endDeleteIndex) {
        deleteDeque.push(item);
      } else {
        self.push(item);
      }
    }

    function handleForMiddle(index: number, arr: T[]) {
      const realIndex = index + _bucketSize;
      if (index < start && realIndex >= start) {
        const startIndex = _bucketSize - (realIndex - start) - 1;
        for (let i = 0; i < startIndex; ++i) {
          self.push(arr[i]);
        }
        self.push(...items);
        if (deleteCount) {
          let endIndex;
          if (endDeleteIndex <= realIndex) {
            endIndex = _bucketSize - (realIndex - endDeleteIndex) - 1;
          } else {
            endIndex = _bucketSize;
          }
          for (let i = startIndex; i < endIndex; ++i) {
            deleteDeque.push(arr[i]);
          }
          for (let i = endIndex; i < _bucketSize; ++i) {
            self.push(arr[i]);
          }
        } else {
          for (let i = startIndex; i < _bucketSize; ++i) {
            self.push(arr[i]);
          }
        }
      } else if (index >= start && realIndex < endDeleteIndex) {
        deleteDeque.push(...arr);
      } else if (index < endDeleteIndex && realIndex >= endDeleteIndex) {
        const endIndex = _bucketSize - (realIndex - endDeleteIndex) - 1;
        for (let i = 0; i < endIndex; ++i) {
          deleteDeque.push(arr[i]);
        }
        for (let i = endIndex; i < _bucketSize; ++i) {
          self.push(arr[i]);
        }
      } else {
        self.push(...arr);
      }
      return realIndex;
    }

    if (_first === _last && _curFirst <= _curLast) {
      for (let i = _curFirst; i <= _curLast; ++i, ++index) {
        handleForBeginOrEnd(index, _map[_first][i]);
      }
    } else if (_first < _last) {
      for (let i = _curFirst; i < _bucketSize; ++i, ++index) {
        handleForBeginOrEnd(index, _map[_first][i]);
      }
      index -= 1;
      for (let i = _first + 1; i < _last; ++i) {
        index = handleForMiddle(index, _map[i]);
      }
      index += 1;
      for (let i = 0; i <= _curLast; ++i, ++index) {
        handleForBeginOrEnd(index, _map[_last][i]);
      }
    } else {
      for (let i = _curFirst; i < _bucketSize; ++i, ++index) {
        handleForBeginOrEnd(index, _map[_first][i]);
      }
      index -= 1;
      for (let i = _first + 1; i < _bucketNum; ++i) {
        index = handleForMiddle(index, _map[i]);
      }
      for (let i = 0; i < _last; ++i) {
        index = handleForMiddle(index, _map[i]);
      }
      index += 1;
      for (let i = 0; i <= _curLast; ++i, ++index) {
        handleForBeginOrEnd(index, _map[_last][i]);
      }
    }

    return deleteDeque;
  }
  values(): IterableIterator<T> {
    let index = 0;
    const self = this;
    return {
      next() {
        const done = index === self._length;
        if (done) {
          return {
            value: undefined as unknown as T,
            done
          };
        }
        const value = self.at(index);
        index += 1;
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

export default Deque;
