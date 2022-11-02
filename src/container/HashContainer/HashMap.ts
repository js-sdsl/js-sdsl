import { initContainer } from '@/container/ContainerBase';
import HashContainer from '@/container/HashContainer/Base';
import checkObject from '@/utils/checkObject';

class HashMap<K, V> extends HashContainer<K, V> {
  constructor(container: initContainer<[K, V]> = []) {
    super();
    const self = this;
    container.forEach(function (el) {
      self.setElement(el[0], el[1]);
    });
  }
  /**
   * @description Insert a key-value pair or set value by the given key.
   * @param key The key want to insert.
   * @param value The value want to set.
   * @param isObject Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                 If a `undefined` value is passed in, the type will be automatically judged.
   */
  setElement(key: K, value: V, isObject?: boolean) {
    this._set(key, value, isObject);
  }
  /**
   * @description Get the value of the element of the specified key.
   * @param key The key want to search.
   * @param isObject Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                 If a `undefined` value is passed in, the type will be automatically judged.
   * @example const val = container.getElementByKey(1);
   */
  getElementByKey(key: K, isObject?: boolean) {
    if (isObject === undefined) isObject = checkObject(key);
    if (isObject) {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG];
      return index !== undefined ? this._objMap[index][1] : undefined;
    }
    const value = this._originMap[<string><unknown>key];
    return value ? value[1] : undefined;
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
