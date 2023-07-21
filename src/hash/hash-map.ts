import { Entries } from '@/base';
import { ITERATOR_TYPE } from '@/base/iterator';
import { HashContainer, HashLinkNode } from '@/hash/base';
import { HashContainerIterator } from '@/hash/hash-iterator';
import checkObject from '@/utils/checkObject';
import { throwIteratorAccessError } from '@/utils/throwError';

class HashMapIterator<K, V> extends HashContainerIterator<K, V> {
  readonly container: HashMap<K, V>;
  constructor(props: {
    node: HashLinkNode<K, V>,
    header: HashLinkNode<K, V>,
    container: HashMap<K, V>,
    type?: ITERATOR_TYPE
  }) {
    super(props);
    this.container = props.container;
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
    return new HashMapIterator<K, V>({
      node: this._node,
      header: this._header,
      container: this.container,
      type: this.type
    });
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
    return new HashMapIterator<K, V>({
      node: this._head,
      header: this._header,
      container: this
    });
  }
  end() {
    return new HashMapIterator<K, V>({
      node: this._header,
      header: this._header,
      container: this
    });
  }
  rBegin() {
    return new HashMapIterator<K, V>({
      node: this._tail,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
  }
  rEnd() {
    return new HashMapIterator<K, V>({
      node: this._header,
      header: this._header,
      container: this,
      type: ITERATOR_TYPE.REVERSE
    });
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
   * @returns The container itself.
   */
  set(key: K, value: V, isObject?: boolean) {
    this._set(key, value, isObject);
    return this;
  }
  /**
   * @description Get the value of the item by the specified key.
   * @param key - The key want to search.
   * @param isObject - Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                   If a `undefined` value is passed in, the type will be automatically judged.
   * @example
   * const val = container.getElementByKey(1);
   */
  get(key: K, isObject = checkObject(key)) {
    if (isObject) {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_TAG];
      return index !== undefined ? this._objMap[index]._value : undefined;
    }
    const node = this._originMap[<string><unknown>key];
    return node ? node._value : undefined;
  }
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
    const node = this._getHashLinkNodeByKey(key, isObject);
    return new HashMapIterator<K, V>({
      node,
      header: this._header,
      container: this
    });
  }
  forEach(callback: (value: [K, V], index: number, container: this) => void) {
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
  every(callback: (value: [K, V], index: number, container: this) => unknown) {
    let index = 0;
    let node = this._head;
    while (node !== this._header) {
      const flag = callback(<[K, V]>[node._key, node._value], index++, this);
      if (!flag) return false;
      node = node._next;
    }
    return true;
  }
  filter(callback: (value: [K, V], index: number, container: this) => unknown) {
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
  some(callback: (value: [K, V], index: number, container: this) => unknown) {
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
