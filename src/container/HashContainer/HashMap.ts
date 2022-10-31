import { initContainer } from '@/container/ContainerBase';
import HashContainer from '@/container/HashContainer/Base';
import { checkNotObject } from '@/utils/checkNotObject';

class HashMap<K, V> extends HashContainer<K, V> {
  constructor(container: initContainer<[K, V]> = []) {
    super();
    container.forEach(el => {
      this.setElement(el[0], el[1]);
    });
  }
  /**
   * @description Insert a key-value pair or set value by the given key.
   * @param key The key want to insert.
   * @param value The value want to set.
   */
  setElement(key: K, value: V) {
    if (value === undefined || value === null) {
      this.eraseElementByKey(key);
      return;
    }
    this._set(key, value);
  }
  /**
   * @description Get the value of the element of the specified key.
   * @example const val = container.getElementByKey(1);
   */
  getElementByKey(key: K) {
    if (checkNotObject(key)) {
      const value = this._originMap[<string><unknown>key];
      return value ? value[1] : undefined;
    }
    const index = (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG];
    return index !== undefined ? this._objMap[index][1] : undefined;
  }
  forEach(callback: (element: [K, V], index: number, hashMap: HashMap<K, V>) => void) {
    const objMapLength = this._objMap.length;
    for (let i = 0; i < objMapLength; ++i) {
      callback(this._objMap[i], i, this);
    }
    const keys = Object.keys(this._originMap);
    const originMapLength = keys.length;
    let index = objMapLength;
    for (let i = 0; i < originMapLength; ++i) {
      callback(this._originMap[keys[i]], index++, this);
    }
  }
  [Symbol.iterator]() {
    return function * (this: HashMap<K, V>) {
      yield * this._objMap;
      const keys = Object.keys(this._originMap);
      const originMapLength = keys.length;
      for (let i = 0; i < originMapLength; ++i) {
        yield this._originMap[keys[i]];
      }
      const symbols = Object.getOwnPropertySymbols(this._originMap);
      const symbolsLength = symbols.length;
      for (let i = 0; i < symbolsLength; ++i) {
        yield this._originMap[symbols[i]];
      }
    }.bind(this)();
  }
}

export default HashMap;
