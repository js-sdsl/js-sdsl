import { Base } from '@/container/ContainerBase';
import checkObject from '@/utils/checkObject';

abstract class HashContainer<K, V> extends Base {
  /**
   * @internal
   */
  protected _objMap: [K, V][] = [];
  /**
   * @internal
   */
  protected _originMap: Record<string | symbol, [K, V]> = {};
  /**
   * @internal
   */
  protected readonly HASH_KEY_TAG = Symbol('JS_SDSL_HASH_KEY_TAG');
  protected constructor() {
    super();
    Object.setPrototypeOf(this._originMap, null);
  }
  /**
   * @internal
   */
  protected _set(key: K, value?: V, isObject?: boolean) {
    if (isObject === undefined) isObject = checkObject(key);
    if (isObject) {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG];
      if (index !== undefined) {
        this._objMap[<number>index][1] = <V>value;
        return;
      }
      Object.defineProperty(key, this.HASH_KEY_TAG, {
        value: this._objMap.length,
        configurable: true
      });
      this._objMap.push([key, <V>value]);
    } else {
      const originValue = this._originMap[<string><unknown>key];
      if (originValue) {
        originValue[1] = <V>value;
        return;
      }
      this._originMap[<string><unknown>key] = [key, <V>value];
    }
    this._length += 1;
  }
  clear() {
    const self = this;
    this._objMap.forEach(function (el) {
      delete (<Record<symbol, number>><unknown>el[0])[self.HASH_KEY_TAG];
    });
    this._objMap = [];
    this._originMap = {};
    Object.setPrototypeOf(this._originMap, null);
    this._length = 0;
  }
  /**
   * @description Remove the element of the specified key.
   * @param key The key you want to remove.
   * @param isObject Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                 If a `undefined` value is passed in, the type will be automatically judged.
   */
  eraseElementByKey(key: K, isObject?: boolean) {
    if (isObject === undefined) isObject = checkObject(key);
    if (isObject) {
      const index = (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG];
      if (index === undefined) return;
      delete (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG];
      delete this._objMap[index];
    } else {
      if (this._originMap[<string><unknown>key] === undefined) return;
      delete this._originMap[<string><unknown>key];
    }
    this._length -= 1;
  }
  /**
   * @description Check key if exist in container.
   * @param key The element you want to search.
   * @param isObject Tell us if the type of inserted key is `object` to improve efficiency.<br/>
   *                 If a `undefined` value is passed in, the type will be automatically judged.
   * @return Boolean about if key exist in container.
   */
  find(key: K, isObject?: boolean) {
    if (isObject === undefined) isObject = checkObject(key);
    if (isObject) {
      return typeof (<Record<symbol, number>><unknown>key)[this.HASH_KEY_TAG] === 'number';
    } else {
      return this._originMap[<string><unknown>key] !== undefined;
    }
  }
  /**
   * @description Iterate over all elements in the container.
   * @param callback Callback function like Array.forEach.
   * @example container.forEach((element, index) => console.log(element, index));
   */
  abstract forEach(
    callback: (element: K | [K, V], index: number, hashContainer: HashContainer<K, V>) => void
  ): void;
  /**
   * @description Using for `for...of` syntax like Array.
   * @example
   * for (const element of container) {
   *   console.log(element);
   * }
   */
  abstract [Symbol.iterator](): Generator<K | [K, V], void, undefined>;
}

export default HashContainer;
