import SequentialContainer from './Base';
import { initContainer, IteratorType } from '@/container/ContainerBase';
import { RandomIterator } from '@/container/SequentialContainer/Base/RandomIterator';
import $checkWithinAccessParams from '@/utils/checkParams.macro';

class VectorIterator<T> extends RandomIterator<T> {
  copy() {
    return new VectorIterator(
      this._node,
      this._size,
      this._getElementByPos,
      this._setElementByPos,
      this.iteratorType
    );
  }
  // @ts-ignore
  equals(iter: VectorIterator<T>): boolean;
}

export type { VectorIterator };

class Vector<T> extends SequentialContainer<T> {
  /**
   * @internal
   */
  private readonly _vector: T[];
  /**
   * @param container - Initialize container, must have a forEach function.
   * @param copy - When the container is an array, you can choose to directly operate on the original object of
   *               the array or perform a shallow copy. The default is shallow copy.
   */
  constructor(container: initContainer<T> = [], copy = true) {
    super();
    if (Array.isArray(container)) {
      this._vector = copy ? [...container] : container;
      this._length = container.length;
    } else {
      this._vector = [];
      const self = this;
      container.forEach(function (el) {
        self.pushBack(el);
      });
    }
    this.size = this.size.bind(this);
    this.getElementByPos = this.getElementByPos.bind(this);
    this.setElementByPos = this.setElementByPos.bind(this);
  }
  clear() {
    this._length = 0;
    this._vector.length = 0;
  }
  begin() {
    return new VectorIterator(
      0,
      this.size,
      this.getElementByPos,
      this.setElementByPos
    );
  }
  end() {
    return new VectorIterator(
      this._length,
      this.size,
      this.getElementByPos,
      this.setElementByPos
    );
  }
  rBegin() {
    return new VectorIterator(
      this._length - 1,
      this.size,
      this.getElementByPos,
      this.setElementByPos,
      IteratorType.REVERSE
    );
  }
  rEnd() {
    return new VectorIterator(
      -1,
      this.size,
      this.getElementByPos,
      this.setElementByPos,
      IteratorType.REVERSE
    );
  }
  front(): T | undefined {
    return this._vector[0];
  }
  back(): T | undefined {
    return this._vector[this._length - 1];
  }
  forEach(callback: (element: T, index: number, vector: Vector<T>) => void) {
    for (let i = 0; i < this._length; ++i) {
      callback(this._vector[i], i, this);
    }
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    return this._vector[pos];
  }
  eraseElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    this._vector.splice(pos, 1);
    this._length -= 1;
    return this._length;
  }
  eraseElementByValue(value: T) {
    let index = 0;
    for (let i = 0; i < this._length; ++i) {
      if (this._vector[i] !== value) {
        this._vector[index++] = this._vector[i];
      }
    }
    this._length = this._vector.length = index;
    return this._length;
  }
  eraseElementByIterator(iter: VectorIterator<T>) {
    const _node = iter._node;
    iter = iter.next();
    this.eraseElementByPos(_node);
    return iter;
  }
  pushBack(element: T) {
    this._vector.push(element);
    this._length += 1;
    return this._length;
  }
  popBack() {
    if (this._length === 0) return;
    this._length -= 1;
    return this._vector.pop();
  }
  setElementByPos(pos: number, element: T) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    this._vector[pos] = element;
  }
  insert(pos: number, element: T, num = 1) {
    $checkWithinAccessParams!(pos, 0, this._length);
    this._vector.splice(pos, 0, ...new Array<T>(num).fill(element));
    this._length += num;
    return this._length;
  }
  find(element: T) {
    for (let i = 0; i < this._length; ++i) {
      if (this._vector[i] === element) {
        return new VectorIterator(
          i,
          this.size,
          this.getElementByPos,
          this.getElementByPos
        );
      }
    }
    return this.end();
  }
  reverse() {
    this._vector.reverse();
  }
  unique() {
    let index = 1;
    for (let i = 1; i < this._length; ++i) {
      if (this._vector[i] !== this._vector[i - 1]) {
        this._vector[index++] = this._vector[i];
      }
    }
    this._length = this._vector.length = index;
    return this._length;
  }
  sort(cmp?: (x: T, y: T) => number) {
    this._vector.sort(cmp);
  }
  [Symbol.iterator]() {
    return function * (this: Vector<T>) {
      return yield * this._vector;
    }.bind(this)();
  }
}

export default Vector;
