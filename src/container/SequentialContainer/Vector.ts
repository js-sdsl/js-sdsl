import { ContainerIterator, initContainer } from '@/container/ContainerBase/index';
import { checkWithinAccessParams } from '@/utils/checkParams';
import SequentialContainer from './Base/index';

export class VectorIterator<T> extends ContainerIterator<T> {
  private node;
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
        throw new RangeError('Vector iterator access denied!');
      }
      this.node += 1;
    } else {
      if (this.node === 0) {
        throw new RangeError('Vector iterator access denied!');
      }
      this.node -= 1;
    }
    return this;
  }
  next() {
    if (this.iteratorType === 'reverse') {
      if (this.node === -1) {
        throw new RangeError('Vector iterator access denied!');
      }
      this.node -= 1;
    } else {
      if (this.node === this.size()) {
        throw new RangeError('Vector Iterator access denied!');
      }
      this.node += 1;
    }
    return this;
  }
  equals(obj: VectorIterator<T>) {
    if (obj.constructor.name !== this.constructor.name) {
      throw new TypeError(`Obj's constructor is not ${this.constructor.name}!`);
    }
    if (this.iteratorType !== obj.iteratorType) {
      throw new TypeError('Iterator type error!');
    }
    return this.node === obj.node;
  }
}

class Vector<T> extends SequentialContainer<T> {
  private readonly vector: T[];
  constructor(container: initContainer<T> = [], copy = true) {
    super();
    if (Array.isArray(container)) {
      this.vector = copy ? [...container] : container;
      this.length = container.length;
    } else {
      this.vector = [];
      container.forEach(element => this.pushBack(element));
    }
    this.size = this.size.bind(this);
    this.getElementByPos = this.getElementByPos.bind(this);
    this.setElementByPos = this.setElementByPos.bind(this);
  }
  clear() {
    this.length = 0;
    this.vector.length = 0;
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
      this.length,
      this.size,
      this.getElementByPos,
      this.setElementByPos
    );
  }
  rBegin() {
    return new VectorIterator(
      this.length - 1,
      this.size,
      this.getElementByPos,
      this.setElementByPos,
      'reverse'
    );
  }
  rEnd() {
    return new VectorIterator(
      -1,
      this.size,
      this.getElementByPos,
      this.setElementByPos,
      'reverse'
    );
  }
  front() {
    return this.vector[0] as (T | undefined);
  }
  back() {
    return this.vector[this.length - 1] as (T | undefined);
  }
  forEach(callback: (element: T, index: number) => void) {
    for (let i = 0; i < this.length; ++i) {
      callback(this.vector[i], i);
    }
  }
  getElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    return this.vector[pos];
  }
  eraseElementByPos(pos: number) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    this.vector.splice(pos, 1);
    this.length -= 1;
  }
  eraseElementByValue(value: T) {
    let index = 0;
    for (let i = 0; i < this.length; ++i) {
      if (this.vector[i] !== value) {
        this.vector[index++] = this.vector[i];
      }
    }
    this.length = this.vector.length = index;
  }
  eraseElementByIterator(iter: VectorIterator<T>) {
    // @ts-ignore
    const node = iter.node;
    iter = iter.next();
    this.eraseElementByPos(node);
    return iter;
  }
  pushBack(element: T) {
    this.vector.push(element);
    this.length += 1;
  }
  popBack() {
    if (!this.length) return;
    this.vector.pop();
    this.length -= 1;
  }
  setElementByPos(pos: number, element: T) {
    checkWithinAccessParams(pos, 0, this.length - 1);
    this.vector[pos] = element;
  }
  insert(pos: number, element: T, num = 1) {
    checkWithinAccessParams(pos, 0, this.length);
    this.vector.splice(pos, 0, ...new Array<T>(num).fill(element));
    this.length += num;
  }
  find(element: T) {
    for (let i = 0; i < this.length; ++i) {
      if (this.vector[i] === element) {
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
    this.vector.reverse();
  }
  unique() {
    let index = 1;
    for (let i = 1; i < this.length; ++i) {
      if (this.vector[i] !== this.vector[i - 1]) {
        this.vector[index++] = this.vector[i];
      }
    }
    this.length = this.vector.length = index;
  }
  sort(cmp?: (x: T, y: T) => number) {
    this.vector.sort(cmp);
  }
  [Symbol.iterator]() {
    return function * (this: Vector<T>) {
      return yield * this.vector;
    }.bind(this)();
  }
}

export default Vector;
