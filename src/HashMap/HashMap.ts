import { BaseType, Pair } from "../Base/Base";
import LinkList, { LinkListType } from "../LinkList/LinkList";
import Map, { MapType } from "../Map/Map";

export type HashMapType<T, K> = {
    forEach: (callback: (element: Pair<T, K>, index: number) => void) => void;
    find: (element: T) => boolean;
    getElementByKey: (key: T) => K | undefined;
    setElement: (key: T, value: K) => void;
    eraseElementByKey: (key: T) => void;
    [Symbol.iterator]: () => Generator<Pair<T, K>, void, undefined>;
} & BaseType;

HashMap.initSize = (1 << 4);
HashMap.maxSize = (1 << 30);
HashMap.sigma = 0.75;   // default load factor
HashMap.treeifyThreshold = 8;
HashMap.untreeifyThreshold = 6;
HashMap.minTreeifySize = 64;

/**
 * Note that resize is a time-consuming operation, please try to determine the number of buckets before use.
 * @param container Initialize the container
 * @param initBucketNum Initialize the bucket num, must be 2 to the power of n
 * @param hashFunc Function to map elements to numbers
 * @constructor
 */
function HashMap<T, K>(this: HashMapType<T, K>, container: { forEach: (callback: (element: Pair<T, K>) => void) => void } = [], initBucketNum = HashMap.initSize, hashFunc: (x: T) => number) {
    hashFunc = hashFunc || ((x: T) => {
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
    let hashTable: (LinkListType<Pair<T, K>> | MapType<T, K>)[] = [];
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

    this.forEach = function (callback: (element: Pair<T, K>, index: number) => void) {
        let index = 0;
        hashTable.forEach(container => {
            container.forEach(element => {
                callback(element, index++);
            });
        });
    };

    const reAllocate = function (this: HashMapType<T, K>, originalBucketNum: number) {
        if (originalBucketNum >= HashMap.maxSize) return;
        bucketNum = originalBucketNum * 2;
        const newHashTable: (LinkListType<Pair<T, K>> | MapType<T, K>)[] = [];
        hashTable.forEach((container, index) => {
            if (container.empty()) return;
            if (container instanceof LinkList && container.size() === 1) {
                const { key, value } = container.front();
                newHashTable[hashFunc(key) & (bucketNum - 1)] = new LinkList<Pair<T, K>>([{
                    key,
                    value
                }]);
            } else if (container instanceof Map) {
                const lowList: (LinkListType<Pair<T, K>>) = new LinkList<Pair<T, K>>();
                const highList: (LinkListType<Pair<T, K>>) = new LinkList<Pair<T, K>>();
                container.forEach((pair) => {
                    const hashCode = hashFunc(pair.key);
                    if ((hashCode & originalBucketNum) === 0) {
                        lowList.pushBack(pair);
                    } else highList.pushBack(pair);
                });
                if (lowList.size() > HashMap.untreeifyThreshold) newHashTable[index] = new Map<T, K>(lowList);
                else if (lowList.size()) newHashTable[index] = lowList;
                if (highList.size() > HashMap.untreeifyThreshold) newHashTable[index + originalBucketNum] = new Map<T, K>(highList);
                else if (highList.size()) newHashTable[index + originalBucketNum] = highList;
            } else {
                const lowList = new LinkList<Pair<T, K>>();
                const highList = new LinkList<Pair<T, K>>();
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

    this.setElement = function (key: T, value: K) {
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
            hashTable[index] = new LinkList<Pair<T, K>>([{ key, value }]);
        } else {
            const preSize = hashTable[index].size();
            if (hashTable[index] instanceof LinkList) {
                for (const pair of hashTable[index]) {
                    if (pair.key === key) {
                        pair.value = value;
                        return;
                    }
                }
                (hashTable[index] as LinkListType<Pair<T, K>>).pushBack({
                    key,
                    value,
                });
                if (hashTable[index].size() >= HashMap.treeifyThreshold) {
                    hashTable[index] = new Map<T, K>(hashTable[index]);
                }
            } else (hashTable[index] as MapType<T, K>).setElement(key, value);
            const curSize = hashTable[index].size();
            len += curSize - preSize;
        }
        if (len > bucketNum * HashMap.sigma) {
            reAllocate.call(this, bucketNum);
        }
    };

    this.getElementByKey = function (key: T) {
        const index = hashFunc(key) & (bucketNum - 1);
        if (!hashTable[index]) return undefined;
        if (hashTable[index] instanceof Map) return (hashTable[index] as MapType<T, K>).getElementByKey(key);
        else {
            for (const pair of hashTable[index]) {
                if (pair.key === key) return pair.value;
            }
            return undefined;
        }
    };

    this.eraseElementByKey = function (key: T) {
        const index = hashFunc(key) & (bucketNum - 1);
        if (!hashTable[index]) return;
        const preSize = hashTable[index].size();
        if (hashTable[index] instanceof Map) {
            (hashTable[index] as MapType<T, K>).eraseElementByKey(key);
            if (hashTable[index].size() <= HashMap.untreeifyThreshold) {
                hashTable[index] = new LinkList<Pair<T, K>>(hashTable[index]);
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

    this.find = function (key: T) {
        const index = hashFunc(key) & (bucketNum - 1);
        if (!hashTable[index]) return false;
        if (hashTable[index] instanceof Map) return (hashTable[index] as MapType<T, K>).find(key);
        for (const pair of hashTable[index]) {
            if (pair.key === key) return true;
        }
        return false;
    };

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

    container.forEach(({ key, value }) => this.setElement(key, value));

    Object.freeze(this);
}

Object.freeze(HashMap);

export default (HashMap as unknown as { new<T, K>(container?: { forEach: (callback: (element: Pair<T, K>) => void) => void }, initBucketNum?: number, hashFunc?: (x: T) => number): HashMapType<T, K> });
