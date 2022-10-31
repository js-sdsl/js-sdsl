import { initContainer } from '@/container/ContainerBase';
import HashContainerBase from '@/container/HashContainer/Base';

class HashSet<K> extends HashContainerBase<K, undefined> {
  constructor(container: initContainer<K> = []) {
    super();
    const self = this;
    container.forEach(function (el) {
      self.insert(el);
    });
  }
  insert(key: K) {
    this._set(key);
  }
  forEach(callback: (element: K, index: number, hashSet: HashSet<K>) => void) {
    const objMapLength = this._objMap.length;
    for (let i = 0; i < objMapLength; ++i) {
      callback(this._objMap[i][0], i, this);
    }
    const keys = Object.keys(this._originMap);
    const originMapLength = keys.length;
    let index = objMapLength;
    for (let i = 0; i < originMapLength; ++i) {
      callback(this._originMap[keys[i]][0], index++, this);
    }
  }
  [Symbol.iterator]() {
    return function * (this: HashSet<K>) {
      const objMapLength = this._objMap.length;
      for (let i = 0; i < objMapLength; ++i) {
        yield this._objMap[i][0];
      }
      const keys = Object.keys(this._originMap);
      const originMapLength = keys.length;
      for (let i = 0; i < originMapLength; ++i) {
        yield this._originMap[keys[i]][0];
      }
    }.bind(this)();
  }
}

export default HashSet;
