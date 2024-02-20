import SequentialContainer from './base';
import { Entries } from '@/base';
import { ITERATOR_TYPE } from '@/base/iterator';
import { RandomIterator } from '@/sequential/random-iterator';
import { CompareFn, compareFromS2L } from '@/utils/compareFn';
import * as Math from '@/utils/math';

type Position = {
  x: number;
  y: number
}

class DequeIterator<T> extends RandomIterator<T> {
  readonly container: Deque<T>;
  constructor(props: {
    node: number,
    container: Deque<T>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    this.container = props.container;
  }
  copy() {
    return new DequeIterator<T>({
      node: this._node,
      container: this.container,
      type: this.type
    });
  }
  // @ts-ignore
  equals(iter: DequeIterator<T>): boolean;
}

export type { DequeIterator };

class Deque<T> extends SequentialContainer<T> {
  /**
   * @internal
   */
  private _first: Position = {
    x: 0,
    y: 0
  };
  /**
   * @internal
   */
  private _last: Position = {
    x: 0,
    y: 0
  };
  /**
   * @internal
   */
  private _bucketNum!: number;
  /**
   * @internal
   */
  private _bucketSize!: number;
  /**
   * @internal
   */
  private _map: T[][] = [];
  constructor(entries: Entries<T> = [], options: {
    bucketSize?: number
  } = {}) {
    super();
    this._init(entries, options);
  }
  /**
   * @internal
   */
  private _init(entries: Entries<T>, options: {
    bucketSize?: number
  }) {
    const length = entries.length ?? entries.size;
    if (typeof length !== 'number') {
      throw new TypeError('Can\'t get entries\' size');
    }
    this._bucketSize = options.bucketSize || (1 << 12);
    this._bucketNum = Math.ceil(length, this._bucketSize) || 1;
    for (let i = 0; i < this._bucketNum; ++i) {
      this._map.push(new Array(this._bucketSize));
    }
    const needBucketNum = Math.ceil(length, this._bucketSize);
    this._first.x = this._last.x = (this._bucketNum >> 1) - (needBucketNum >> 1);
    this._first.y = this._last.y = (this._bucketSize - length % this._bucketSize) >> 1;
    const self = this;
    entries.forEach(function (item) {
      self._push(item);
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
    for (let i = this._first.x; i < this._bucketNum; ++i) {
      newMap[newMap.length] = this._map[i];
    }
    const lastX = this._last.x;
    for (let i = 0; i < lastX; ++i) {
      newMap[newMap.length] = this._map[i];
    }
    newMap[newMap.length] = [...this._map[this._last.x]];
    this._first.x = addBucketNum;
    this._last.x = newMap.length - 1;
    for (let i = 0; i < addBucketNum; ++i) {
      newMap[newMap.length] = new Array(this._bucketSize);
    }
    this._map = newMap;
    this._bucketNum = newMap.length;
  }
  /**
   * @internal
   */
  private _getPrevPosition(position: Position): Position {
    let { x, y } = position;
    if (y > 0) {
      y -= 1;
    } else if (x > 0) {
      x -= 1;
      y = this._bucketSize - 1;
    } else {
      x = this._bucketNum - 1;
      y = this._bucketSize - 1;
    }
    return { x, y };
  }
  /**
   * @internal
   */
  private _getNextPosition(position: Position): Position {
    let { x, y } = position;
    if (y < this._bucketSize - 1) {
      y += 1;
    } else if (x < this._bucketNum - 1) {
      x += 1;
      y = 0;
    } else {
      x = 0;
      y = 0;
    }
    return { x, y };
  }
  /**
   * @internal
   */
  private _calcPosition(index: number) {
    let x, y;
    const realIndex = this._first.y + index + 1;
    x = this._first.x + Math.ceil(realIndex, this._bucketSize) - 1;
    x %= this._bucketNum;
    y = realIndex % this._bucketSize - 1;
    if (y < 0) {
      y = this._bucketSize - 1;
    }
    return { x, y };
  }
  clear() {
    this._map = [new Array(this._bucketSize)];
    this._bucketNum = 1;
    this._first.x = this._last.x = this._length = 0;
    this._first.y = this._last.y = this._bucketSize >> 1;
  }
  begin() {
    return new DequeIterator<T>({
      node: 0,
      container: this
    });
  }
  end() {
    return new DequeIterator<T>({
      node: this._length,
      container: this
    });
  }
  rBegin() {
    return new DequeIterator<T>({
      node: this._length - 1,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  rEnd() {
    return new DequeIterator<T>({
      node: -1,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  front(): T | undefined {
    if (this._length === 0) return;
    return this._map[this._first.x][this._first.y];
  }
  back(): T | undefined {
    if (this._length === 0) return;
    return this._map[this._last.x][this._last.y];
  }
  /**
   * @internal
   */
  private _push(item: T) {
    if (this._length > 0) {
      this._last = this._getNextPosition(this._last);
      const { x, y } = this._last;
      if (x === 0 && y === 0) {
        this._map.push(new Array(this._bucketSize));
        this._last = { x: this._bucketNum, y: 0 };
        this._bucketNum += 1;
      } else if (
        x === this._first.x &&
        y === this._first.y
      ) this._reAllocate();
    }
    this._length += 1;
    this._map[this._last.x][this._last.y] = item;
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
    const item = this._map[this._last.x][this._last.y];
    // istanbul ignore else
    if (this._length !== 1) {
      this._last = this._getPrevPosition(this._last);
    }
    this._length -= 1;
    return item;
  }
  /**
   * @internal
   */
  private _unshift(item: T) {
    if (this._length > 0) {
      this._first = this._getPrevPosition(this._first);
      const { x, y } = this._first;
      if (
        x === this._last.x &&
        y === this._last.y
      ) this._reAllocate();
    }
    this._length += 1;
    this._map[this._first.x][this._first.y] = item;
  }
  /**
   * @description Push the item to the front.
   * @param items - The items you want to push.
   */
  unshift(...items: T[]) {
    const num = items.length;
    for (let i = num - 1; i >= 0; --i) {
      this._unshift(items[i]);
    }
    return this._length;
  }
  /**
   * @description Remove the first item.
   * @returns The item you popped.
   */
  shift() {
    if (this._length === 0) return;
    const item = this._map[this._first.x][this._first.y];
    // istanbul ignore else
    if (this._length !== 1) {
      this._first = this._getNextPosition(this._first);
    }
    this._length -= 1;
    return item;
  }
  /**
   * @internal
   */
  protected _at(index: number) {
    const { x, y } = this._calcPosition(index);
    return this._map[x][y];
  }
  /**
   * @internal
   */
  protected _set(index: number, item: T) {
    const { x, y } = this._calcPosition(index);
    this._map[x][y] = item;
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
    this._last = this._calcPosition(index);
    this._length = index + 1;
    return this._length;
  }
  erase(iter: DequeIterator<T>) {
    const { _node } = iter;
    if (_node < 0 || _node >= this._length) {
      throw new RangeError('Invalid deque iterator!');
    }
    this.splice(_node, 1);
    iter = iter.next();
    return iter;
  }
  find(item: T, cmp: CompareFn<T> = compareFromS2L) {
    for (let i = 0; i < this._length; ++i) {
      if (cmp(this._at(i), item) === 0) {
        return new DequeIterator<T>({
          node: i,
          container: this
        });
      }
    }
    return this.end();
  }
  reverse() {
    this._map.reverse().forEach(function (bucket) {
      bucket.reverse();
    });
    const { _first: { x: firstX, y: firstY }, _last: { x: lastX, y: lastY } } = this;
    this._first.x = this._bucketNum - lastX - 1;
    this._last.x = this._bucketNum - firstX - 1;
    this._first.y = this._bucketSize - lastY - 1;
    this._last.y = this._bucketSize - firstY - 1;
    return this;
  }
  unique(cmp: CompareFn<T> = compareFromS2L) {
    const length = this._length;
    if (length <= 1) {
      return length;
    }
    let index = 1;
    let prev = this._at(0);
    for (let i = 1; i < length; ++i) {
      const cur = this._at(i);
      if (cmp(cur, prev) !== 0) {
        prev = cur;
        this._set(index++, cur);
      }
    }
    this.cut(index - 1);
    return this._length;
  }
  sort(cmp: CompareFn<T> = compareFromS2L) {
    const arr: T[] = [];
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      arr.push(this._at(i));
    }
    arr.sort(cmp);
    for (let i = 0; i < length; ++i) {
      this._set(i, arr[i]);
    }
    return this;
  }
  /**
   * @description Remove as much useless space as possible.
   */
  shrink() {
    if (this._length === 0) return;
    const newMap = [];
    if (this._first.x === this._last.x) return;
    else if (this._first.x < this._last.x) {
      for (let i = this._first.x; i <= this._last.x; ++i) {
        newMap.push(this._map[i]);
      }
    } else {
      for (let i = this._first.x; i < this._bucketNum; ++i) {
        newMap.push(this._map[i]);
      }
      for (let i = 0; i <= this._last.x; ++i) {
        newMap.push(this._map[i]);
      }
    }
    this._first.x = 0;
    this._last.x = newMap.length - 1;
    this._bucketNum = newMap.length;
    this._map = newMap;
  }
  forEach(callback: (value: T, index: number, container: this) => void) {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      callback(this._at(i), i, this);
    }
  }
  * [Symbol.iterator]() {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      yield this._at(i);
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
        const value = <[number, T]>[index, self._at(index)];
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
  every(callback: (value: T, index: number, container: this) => unknown): boolean {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const flag = callback(this._at(i), i, this);
      if (!flag) return false;
    }
    return true;
  }
  filter(callback: (value: T, index: number, container: this) => unknown) {
    const filtered = new Deque<T>([], {
      bucketSize: this._bucketSize
    });
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const item = this._at(i);
      const flag = callback(item, i, this);
      if (flag) filtered._push(item);
    }
    return filtered;
  }
  map<U>(callback: (value: T, index: number, container: this) => U) {
    const mapped = new Deque<U>([], {
      bucketSize: this._bucketSize
    });
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const item = this._at(i);
      const newItem = callback(item, i, this);
      mapped._push(newItem);
    }
    return mapped;
  }
  slice(start = 0, end = this._length) {
    const length = this._length;
    const sliceDeque = new Deque<T>([], {
      bucketSize: this._bucketSize
    });
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
      sliceDeque._push(this._at(i));
    }
    return sliceDeque;
  }
  some(callback: (value: T, index: number, container: this) => unknown): boolean {
    const length = this._length;
    for (let i = 0; i < length; ++i) {
      const flag = callback(this._at(i), i, this);
      if (flag) return true;
    }
    return false;
  }
  splice(start: number, deleteCount?: number, ...items: T[]) {
    const length = this._length;
    if (typeof start !== 'number' || length <= 0) {
      this.push(...items);
      return new Deque<T>([], {
        bucketSize: this._bucketSize
      });
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
    const deleteDeque = new Deque<T>([], {
      bucketSize: this._bucketSize
    });
    if (start === 0) {
      while (deleteCount--) deleteDeque._push(this.shift()!);
      this.unshift(...items);
      return deleteDeque;
    }
    const end = start + deleteCount;
    const addCount = items.length;
    const delta = addCount - deleteCount;
    // record delete items
    for (let i = start; i < end; ++i) {
      deleteDeque._push(this._at(i));
    }
    // addCount greater than deleteCount, move back
    if (delta > 0) {
      for (let i = length - delta; i < length; ++i) {
        this._push(this._at(i));
      }
      for (let i = length - delta - 1; i >= end; --i) {
        this._set(i + delta, this._at(i));
      }
    } /* else, move front */ else if (delta < 0) {
      const endIndex = length + delta - 1;
      for (let i = end + delta; i <= endIndex; ++i) {
        this._set(i, this._at(i - delta));
      }
      // change length after delete
      this._length += delta;
      // the length will always greater than 0 because the start must greater than 0 in this branch
      this._last = this._calcPosition(this._length - 1);
    }
    for (let i = 0; i < addCount; ++i) {
      this._set(start + i, items[i]);
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
        const value = self._at(index);
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
