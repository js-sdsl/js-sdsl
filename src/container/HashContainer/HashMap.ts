import { initContainer, IteratorType } from '@/container/ContainerBase';
import { HashContainer, HashContainerIterator, HashLinkNode } from '@/container/HashContainer/Base';
import checkObject from '@/utils/checkObject';
import $checkWithinAccessParams from '@/utils/checkParams.macro';
import { throwIteratorAccessError } from '@/utils/throwError';

class HashMapIterator<K, V> extends HashContainerIterator<K, V> {
  readonly container: HashMap<K, V>;
  constructor(
    node: HashLinkNode<K, V>,
    header: HashLinkNode<K, V>,
    container: HashMap<K, V>,
    iteratorType?: IteratorType
  ) {
    super(node, header, iteratorType);
    this.container = container;
  }
  get pointer() {
    if (this._node === this._header) {
      throwIteratorAccessError();
    }
    const self = this;
    return new Proxy(<[K, V]><unknown>[], {
      get(target, prop: '0' | '1') {
        if (prop === '0') return self._node._key;
        else if (prop === '1') return self._node._value;
        target[0] = self._node._key;
        target[1] = self._node._value;
        return target[prop];
      },
      set(_, prop: '1', newValue: V) {
        if (prop !== '1') {
          throw new TypeError('prop must be 1');
        }
        self._node._value = newValue;
        return true;
      }
    });
  }
  copy() {
    return new HashMapIterator<K, V>(this._node, this._header, this.container, this.iteratorType);
  }
  // @ts-ignore
  equals(iter: HashMapIterator<K, V>): boolean;
}

export type { HashMapIterator };

class HashMap<K, V> extends HashContainer<K, V> {
  constructor(container: initContainer<[K, V]> = []) {
    super();
    const self = this;
    container.forEach(function (el) {
      self.setElement(el[0], el[1]);
    });
  }
  begin() {
    return new HashMapIterator<K, V>(this._head, this._header, this);
  }
  end() {
    return new HashMapIterator<K, V>(this._header, this._header, this);
  }
  rBegin() {
    return new HashMapIterator<K, V>(this._tail, this._header, this, IteratorType.REVERSE);
  }
  rEnd() {
    return new HashMapIterator<K, V>(this._header, this._header, this, IteratorType.REVERSE);
  }
  front() {
    if (this._length === 0) return;
    return <[K, V]>[this._head._key, this._head._value];
  }
  back() {
    if (this._length === 0) return;
    return <[K, V]>[this._tail._key, this._tail._value];
  }
  /**
   * @description Insert a key-value pair or set value by the given key.
   * @param key - The key want to insert.
   * @param value - The value want to set.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @returns The size of container after setting.
   */
  setElement(key: K, value: V, isObject?: boolean) {
    return this._set(key, value, isObject);
  }
  /**
   * @description Get the value of the element of the specified key.
   * @param key - The key want to search.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @example
   * const val = container.getElementByKey(1);
   */
  getElementByKey(key: K, isObject?: boolean) {
    if (isObject === undefined) isObject = checkObject(key);
    if (isObject) {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_TAG];
      return index !== undefined ? this._objMap[index]._value : undefined;
    }
    const node = this._originMap[<string><unknown>key];
    return node ? node._value : undefined;
  }
  getElementByPos(pos: number) {
    $checkWithinAccessParams!(pos, 0, this._length - 1);
    let node = this._head;
    while (pos--) {
      node = node._next;
    }
    return <[K, V]>[node._key, node._value];
  }
  /**
   * @description Check key if exist in container.
   * @param key - The element you want to search.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @returns An iterator pointing to the element if found, or super end if not found.
   */
  find(key: K, isObject?: boolean) {
    const node = this._findElementNode(key, isObject);
    return new HashMapIterator<K, V>(node, this._header, this);
  }
  forEach(callback: (element: [K, V], index: number, hashMap: HashMap<K, V>) => void) {
    let index = 0;
    let node = this._head;
    while (node !== this._header) {
      callback(<[K, V]>[node._key, node._value], index++, this);
      node = node._next;
    }
  }
  * [Symbol.iterator]() {
    let node = this._head;
    while (node !== this._header) {
      yield <[K, V]>[node._key, node._value];
      node = node._next;
    }
  }
}

export default HashMap;
