import { Base, Pair } from "../Base/Base";
import LinkList, { LinkListType } from "../LinkList/LinkList";
import Map, { MapType } from "../Map/Map";

export interface HashMapType<K, V> extends Base {
    forEach: (callback: (element: Pair<K, V>, index: number) => void) => void;
    /**
     * @return If the specified element in the HashSet.
     */
    find: (key: K) => boolean;
    /**
     * Gets the value of the element which has the specified key.
     */
    getElementByKey: (key: K) => V | undefined;
    /**
     * Insert a new key-value pair or set value by key.
     */
    setElement: (key: K, value: V) => void;
    /**
     * Removes the element of the specified key.
     */
    eraseElementByKey: (key: K) => void;
    /**
     * Using for 'for...of' syntax like Array.
     */
    [Symbol.iterator]: () => Generator<Pair<K, V>, void, undefined>;
}

HashMap.initSize = (1 << 4);
HashMap.maxSize = (1 << 30);
HashMap.sigma = 0.75;   // default load factor
HashMap.treeifyThreshold = 8;
HashMap.untreeifyThreshold = 6;
HashMap.minTreeifySize = 64;

function HashMap<K, V>(this: HashMapType<K, V>, container: { forEach: (callback: (element: Pair<K, V>) => void) => void } = [], initBucketNum = HashMap.initSize, hashFunc: (x: K) => number) {
    hashFunc = hashFunc || ((x: K) => {
        let hashCode = 0;
        let str = '';
        if (typeof x === "number") {
            hashCode = Math.floor(x);
            hashCode = ((hashCode << 5) - hashCode);
            hashCode = hashCode & hashCode;
        } else {
            if (typeof x !== "string") {
                str = JSON.stringify(x);
            } else str = x;
            for (const ch of str) {
                const character = ch.charCodeAt(0);
                hashCode = ((hashCode << 5) - hashCode) + character;
                hashCode = hashCode & hashCode;
            }
        }
        hashCode ^= (hashCode >>> 16);
        return hashCode;
    });

    if ((initBucketNum & (initBucketNum - 1)) !== 0) {
        throw new Error("initBucketNum must be 2 to the power of n");
    }

    let len = 0;
    let hashTable: (LinkListType<Pair<K, V>> | MapType<K, V>)[] = [];
    let bucketNum = Math.max(HashMap.initSize, Math.min(HashMap.maxSize, initBucketNum));

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        len = 0;
        bucketNum = initBucketNum;
        hashTable = [];
    };

    this.forEach = function (callback: (element: Pair<K, V>, index: number) => void) {
        let index = 0;
        hashTable.forEach(container => {
            container.forEach(element => {
                callback(element, index++);
            });
        });
    };

    const reAllocate = function (this: HashMapType<K, V>, originalBucketNum: number) {
        if (originalBucketNum >= HashMap.maxSize) return;
        bucketNum = originalBucketNum * 2;
        const newHashTable: (LinkListType<Pair<K, V>> | MapType<K, V>)[] = [];
        hashTable.forEach((container, index) => {
            if (container.empty()) return;
            if (container instanceof LinkList && container.size() === 1) {
                const pair = container.front();
                if (pair !== undefined) {
                    const { key, value } = pair;
                    newHashTable[hashFunc(key) & (bucketNum - 1)] = new LinkList<Pair<K, V>>([{
                        key,
                        value
                    }]);
                }
            } else if (container instanceof Map) {
                const lowList: (LinkListType<Pair<K, V>>) = new LinkList<Pair<K, V>>();
                const highList: (LinkListType<Pair<K, V>>) = new LinkList<Pair<K, V>>();
                container.forEach((pair) => {
                    const hashCode = hashFunc(pair.key);
                    if ((hashCode & originalBucketNum) === 0) {
                        lowList.pushBack(pair);
                    } else highList.pushBack(pair);
                });
                if (lowList.size() > HashMap.untreeifyThreshold) newHashTable[index] = new Map<K, V>(lowList);
                else if (lowList.size()) newHashTable[index] = lowList;
                if (highList.size() > HashMap.untreeifyThreshold) newHashTable[index + originalBucketNum] = new Map<K, V>(highList);
                else if (highList.size()) newHashTable[index + originalBucketNum] = highList;
            } else {
                const lowList = new LinkList<Pair<K, V>>();
                const highList = new LinkList<Pair<K, V>>();
                container.forEach(pair => {
                    const hashCode = hashFunc(pair.key);
                    if ((hashCode & originalBucketNum) === 0) {
                        lowList.pushBack(pair);
                    } else highList.pushBack(pair);
                });
                if (lowList.size()) newHashTable[index] = lowList;
                if (highList.size()) newHashTable[index + originalBucketNum] = highList;
            }
            hashTable[index].clear();
        });
        hashTable = newHashTable;
    };

    this.setElement = function (key: K, value: V) {
        if (key === null || key === undefined) {
            throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
        }
        if (value === null || value === undefined) {
            this.eraseElementByKey(key);
            return;
        }
        const index = hashFunc(key) & (bucketNum - 1);
        if (!hashTable[index]) {
            ++len;
            hashTable[index] = new LinkList<Pair<K, V>>([{ key, value }]);
        } else {
            const preSize = hashTable[index].size();
            if (hashTable[index] instanceof LinkList) {
                for (const pair of hashTable[index]) {
                    if (pair.key === key) {
                        pair.value = value;
                        return;
                    }
                }
                (hashTable[index] as LinkListType<Pair<K, V>>).pushBack({
                    key,
                    value,
                });
                if (hashTable[index].size() >= HashMap.treeifyThreshold) {
                    hashTable[index] = new Map<K, V>(hashTable[index]);
                }
            } else (hashTable[index] as MapType<K, V>).setElement(key, value);
            const curSize = hashTable[index].size();
            len += curSize - preSize;
        }
        if (len > bucketNum * HashMap.sigma) {
            reAllocate.call(this, bucketNum);
        }
    };

    this.getElementByKey = function (key: K) {
        const index = hashFunc(key) & (bucketNum - 1);
        if (!hashTable[index]) return undefined;
        if (hashTable[index] instanceof Map) return (hashTable[index] as MapType<K, V>).getElementByKey(key);
        else {
            for (const pair of hashTable[index]) {
                if (pair.key === key) return pair.value;
            }
            return undefined;
        }
    };

    this.eraseElementByKey = function (key: K) {
        const index = hashFunc(key) & (bucketNum - 1);
        if (!hashTable[index]) return;
        const preSize = hashTable[index].size();
        if (hashTable[index] instanceof Map) {
            (hashTable[index] as MapType<K, V>).eraseElementByKey(key);
            if (hashTable[index].size() <= HashMap.untreeifyThreshold) {
                hashTable[index] = new LinkList<Pair<K, V>>(hashTable[index]);
            }
        } else {
            let pos = -1;
            for (const pair of hashTable[index]) {
                ++pos;
                if (pair.key === key) {
                    hashTable[index].eraseElementByPos(pos);
                    break;
                }
            }
        }
        const curSize = hashTable[index].size();
        len += curSize - preSize;
    };

    this.find = function (key: K) {
        const index = hashFunc(key) & (bucketNum - 1);
        if (!hashTable[index]) return false;
        if (hashTable[index] instanceof Map) return !(hashTable[index] as MapType<K, V>).find(key).equals(hashTable[index].end());
        for (const pair of hashTable[index]) {
            if (pair.key === key) return true;
        }
        return false;
    };

    if (typeof Symbol.iterator === 'symbol') {
        this[Symbol.iterator] = function () {
            return (function* () {
                let index = 0;
                while (index < bucketNum) {
                    while (index < bucketNum && !hashTable[index]) ++index;
                    if (index >= bucketNum) break;
                    for (const pair of hashTable[index]) yield pair;
                    ++index;
                }
            })();
        };
    }

    container.forEach(({ key, value }) => this.setElement(key, value));
}

export default (HashMap as unknown as { new <K, V>(container?: { forEach: (callback: (element: Pair<K, V>) => void) => void }, initBucketNum?: number, hashFunc?: (x: K) => number): HashMapType<K, V> });
