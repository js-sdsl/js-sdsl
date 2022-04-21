import { BaseType } from "../Base/Base";
import Set, { SetType } from "../Set/Set";
import LinkList, { LinkListType } from "../LinkList/LinkList";

export type HashSetType<T> = {
    forEach: (callback: (element: T, index: number) => void) => void;
    insert: (element: T) => void;
    eraseElementByValue: (value: T) => void;
    find: (element: T) => boolean;
    [Symbol.iterator]: () => Generator<T, void, undefined>;
} & BaseType;

HashSet.initSize = (1 << 4);
HashSet.maxSize = (1 << 30);
HashSet.sigma = 0.75;   // default load factor
HashSet.treeifyThreshold = 8;
HashSet.untreeifyThreshold = 6;
HashSet.minTreeifySize = 64;

function HashSet<T>(this: HashSetType<T>, container: { forEach: (callback: (element: T) => void) => void } = [], initBucketNum = HashSet.initSize, hashFunc: (x: T) => number) {
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
            for (let i = 0; i < str.length; i++) {
                const character = str.charCodeAt(i);
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
    let hashTable: (LinkListType<T> | SetType<T>)[] = [];
    let bucketNum = Math.max(HashSet.initSize, Math.min(HashSet.maxSize, initBucketNum));

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

    this.forEach = function (callback: (element: T, index: number) => void) {
        let index = 0;
        hashTable.forEach(container => {
            container.forEach(element => {
                callback(element, index++);
            });
        });
    };

    const reAllocate = function (this: HashSetType<T>, originalBucketNum: number) {
        if (originalBucketNum >= HashSet.maxSize) return;
        bucketNum = originalBucketNum * 2;
        const newHashTable: (LinkListType<T> | SetType<T>)[] = [];
        hashTable.forEach((container, index) => {
            if (container.empty()) return;
            if (container instanceof LinkList && container.size() === 1) {
                const element = container.front();
                if (element === undefined) throw new Error("unknown error");
                newHashTable[hashFunc(element) & (bucketNum - 1)] = new LinkList<T>([element]);
            } else if (container instanceof Set) {
                const lowList: LinkListType<T> = new LinkList<T>();
                const highList: LinkListType<T> = new LinkList<T>();
                container.forEach(element => {
                    const hashCode = hashFunc(element);
                    if ((hashCode & originalBucketNum) === 0) {
                        lowList.pushBack(element);
                    } else highList.pushBack(element);
                });
                if (lowList.size() > HashSet.untreeifyThreshold) newHashTable[index] = new Set<T>(lowList);
                else if (lowList.size()) newHashTable[index] = lowList;
                if (highList.size() > HashSet.untreeifyThreshold) newHashTable[index + originalBucketNum] = new Set<T>(highList);
                else if (highList.size()) newHashTable[index + originalBucketNum] = highList;
            } else {
                const lowList = new LinkList<T>();
                const highList = new LinkList<T>();
                container.forEach(element => {
                    const hashCode = hashFunc(element);
                    if ((hashCode & originalBucketNum) === 0) {
                        lowList.pushBack(element);
                    } else highList.pushBack(element);
                });
                if (lowList.size()) newHashTable[index] = lowList;
                if (highList.size()) newHashTable[index + originalBucketNum] = highList;
            }
            hashTable[index].clear();
        });
        hashTable = newHashTable;
    };

    this.insert = function (element: T) {
        if (element === null || element === undefined) {
            throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
        }
        const index = hashFunc(element) & (bucketNum - 1);
        if (!hashTable[index]) {
            hashTable[index] = new LinkList<T>([element]);
            ++len;
        } else {
            const preSize = hashTable[index].size();
            if (hashTable[index] instanceof LinkList) {
                if (!hashTable[index].find(element).equals(hashTable[index].end())) return;
                (hashTable[index] as LinkListType<T>).pushBack(element);
                if (hashTable[index].size() >= HashSet.treeifyThreshold) {
                    hashTable[index] = new Set<T>(hashTable[index]);
                }
            } else (hashTable[index] as SetType<T>).insert(element);
            const curSize = hashTable[index].size();
            len += curSize - preSize;
        }
        if (len > bucketNum * HashSet.sigma) {
            reAllocate.call(this, bucketNum);
        }
    };

    this.eraseElementByValue = function (element: T) {
        const index = hashFunc(element) & (bucketNum - 1);
        if (!hashTable[index]) return;
        const preSize = hashTable[index].size();
        hashTable[index].eraseElementByValue(element);
        if (hashTable[index] instanceof Set) {
            if (hashTable[index].size() <= HashSet.untreeifyThreshold) {
                hashTable[index] = new LinkList<T>(hashTable[index]);
            }
        }
        const curSize = hashTable[index].size();
        len += curSize - preSize;
    };

    this.find = function (element: T) {
        const index = hashFunc(element) & (bucketNum - 1);
        if (!hashTable[index]) return false;
        return !hashTable[index].find(element).equals(hashTable[index].end());
    };

    if (typeof Symbol.iterator === 'symbol') {
        this[Symbol.iterator] = function () {
            return (function* () {
                let index = 0;
                while (index < bucketNum) {
                    while (index < bucketNum && !hashTable[index]) ++index;
                    if (index >= bucketNum) break;
                    for (const element of hashTable[index]) yield element;
                    ++index;
                }
            })();
        };
    }

    container.forEach(element => this.insert(element));
}

export default (HashSet as unknown as { new <T>(container?: { forEach: (callback: (element: T) => void) => void }, initBucketNum?: number, hashFunc?: (x: T) => number): HashSetType<T> });
