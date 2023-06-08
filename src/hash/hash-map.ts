import { CallbackFn, Entries, IteratorType } from '@/base';
import { HashContainer, HashContainerIterator, HashLinkNode } from '@/hash/base';
import checkObject from '@/utils/checkObject';
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
      get(_, props: '0' | '1') {
        if (props === '0') return self._node._key;
        else if (props === '1') return self._node._value;
      },
      set(_, props: '1', newValue: V) {
        if (props !== '1') {
          throw new TypeError('props must be 1');
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
  constructor(entries: Entries<[K, V]> = []) {
    super();
    const self = this;
    entries.forEach(function (el) {
      self.set(el[0], el[1]);
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
  set(key: K, value: V, isObject?: boolean) {
    return this._set(key, value, isObject);
  }
  /**
   * @description Get the value of the item of the specified key.
   * @param key - The key want to search.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @example
   * const val = container.getElementByKey(1);
   */
  get(key: K, isObject?: boolean) {
    if (isObject === undefined) isObject = checkObject(key);
    if (isObject) {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_TAG];
      return index !== undefined ? this._objMap[index]._value : undefined;
    }
    const node = this._originMap[<string><unknown>key];
    return node ? node._value : undefined;
  }
  /**
   * @internal
   */
  protected _at(index: number) {
    let node = this._head;
    while (index--) {
      node = node._next;
    }
    return <[K, V]>[node._key, node._value];
  }
  /**
   * @description Check key if exist in container.
   * @param key - The item you want to search.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @returns An iterator pointing to the item if found, or super end if not found.
   */
  find(key: K, isObject?: boolean) {
    const node = this._findElementNode(key, isObject);
    return new HashMapIterator<K, V>(node, this._header, this);
  }
  forEach(callback: CallbackFn<[K, V], this, void>) {
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
  entries(): IterableIterator<[K, V]> {
    const self = this;
    let node = this._head;
    return {
      next() {
        const done = node === self._header;
        if (done) {
          return {
            done,
            value: undefined as unknown as [K, V]
          };
        }
        const value = <[K, V]>[node._key, node._value];
        node = node._next;
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
  every(callback: CallbackFn<[K, V], this, unknown>) {
    let index = 0;
    let node = this._head;
    while (node !== this._header) {
      const flag = callback(<[K, V]>[node._key, node._value], index++, this);
      if (!flag) return false;
      node = node._next;
    }
    return true;
  }
  filter(callback: CallbackFn<[K, V], this, unknown>) {
    let index = 0;
    let node = this._head;
    const filtered: [K, V][] = [];
    while (node !== this._header) {
      const item = <[K, V]>[node._key, node._value];
      const flag = callback(item, index++, this);
      if (flag) filtered.push(item);
      node = node._next;
    }
    return new HashMap(filtered);
  }
  some(callback: CallbackFn<[K, V], this, unknown>) {
    let index = 0;
    let node = this._head;
    while (node !== this._header) {
      const flag = callback(<[K, V]>[node._key, node._value], index++, this);
      if (flag) return true;
      node = node._next;
    }
    return false;
  }
  values(): IterableIterator<V> {
    const self = this;
    let node = this._head;
    return {
      next() {
        const done = node === self._header;
        if (done) {
          return {
            value: undefined as unknown as V,
            done
          };
        }
        const value = node._value;
        node = node._next;
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

export default HashMap;
