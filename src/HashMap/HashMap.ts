import { Base, Pair, initContainer } from "../Base/Base";
import LinkList from "../LinkList/LinkList";
import Map, { MapType } from "../OrderedMap/OrderedMap";

class HashMap<K, V> implements Base {
    private static initSize: number = (1 << 4);
    private static maxSize: number = (1 << 30);
    private static sigma = 0.75;
    private static treeifyThreshold = 8;
    private static untreeifyThreshold = 6;
    private static minTreeifySize = 64;

    private length = 0;
    private initBucketNum: number;
    private bucketNum: number;
    private hashFunc: (x: K) => number;
    private hashTable: (LinkList<Pair<K, V>> | MapType<K, V>)[] = [];

    constructor(container: initContainer<Pair<K, V>> = [], initBucketNum = HashMap.initSize, hashFunc?: (x: K) => number) {
        if ((initBucketNum & (initBucketNum - 1)) !== 0) {
            throw new Error("initBucketNum must be 2 to the power of n");
        }
        this.initBucketNum = initBucketNum;
        this.bucketNum = Math.max(HashMap.initSize, Math.min(HashMap.maxSize, this.initBucketNum));
        this.hashFunc = hashFunc ?? ((x: K) => {
            let hashCode = 0;
            let str = '';
            if (typeof x !== "string") {
                str = JSON.stringify(x);
            } else str = x;
            for (let i = 0; i < str.length; i++) {
                const character = str.charCodeAt(i);
                hashCode = ((hashCode << 5) - hashCode) + character;
                hashCode = hashCode & hashCode;
            }
            hashCode ^= (hashCode >>> 16);
            return hashCode;
        });
        container.forEach(element => this.setElement(element.key, element.value));
    }

    private reAllocate(originalBucketNum: number) {
        if (originalBucketNum >= HashMap.maxSize) return;
        this.bucketNum = originalBucketNum * 2;
        const newHashTable: (LinkList<Pair<K, V>> | MapType<K, V>)[] = [];
        this.hashTable.forEach((container, index) => {
            if (container.empty()) return;
            if (container instanceof LinkList && container.size() === 1) {
                const pair = container.front();
                if (pair !== undefined) {
                    const { key, value } = pair;
                    newHashTable[this.hashFunc(key) & (this.bucketNum - 1)] = new LinkList<Pair<K, V>>([{
                        key,
                        value
                    }]);
                }
            } else if (container instanceof Map) {
                const lowList: (LinkList<Pair<K, V>>) = new LinkList<Pair<K, V>>();
                const highList: (LinkList<Pair<K, V>>) = new LinkList<Pair<K, V>>();
                container.forEach((pair) => {
                    const hashCode = this.hashFunc(pair.key);
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
                    const hashCode = this.hashFunc(pair.key);
                    if ((hashCode & originalBucketNum) === 0) {
                        lowList.pushBack(pair);
                    } else highList.pushBack(pair);
                });
                if (lowList.size()) newHashTable[index] = lowList;
                if (highList.size()) newHashTable[index + originalBucketNum] = highList;
            }
            this.hashTable[index].clear();
        });
        this.hashTable = newHashTable;
    }

    size() { return this.length; }
    empty() { return this.length === 0; }
    clear() {
        this.length = 0;
        this.bucketNum = this.initBucketNum;
        this.hashTable = [];
    }
    forEach(callback: (element: Pair<K, V>, index: number) => void) {
        let index = 0;
        this.hashTable.forEach(container => {
            container.forEach(element => {
                callback(element, index++);
            });
        });
    }
    /**
     * Insert a new key-value pair or set value by key.
     */
    setElement(key: K, value: V) {
        if (key === null || key === undefined) {
            throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
        }
        if (value === null || value === undefined) {
            this.eraseElementByKey(key);
            return;
        }
        const index = this.hashFunc(key) & (this.bucketNum - 1);
        if (!this.hashTable[index]) {
            ++this.length;
            this.hashTable[index] = new LinkList<Pair<K, V>>([{ key, value }]);
        } else {
            const preSize = this.hashTable[index].size();
            if (this.hashTable[index] instanceof LinkList) {
                for (const pair of this.hashTable[index]) {
                    if (pair.key === key) {
                        pair.value = value;
                        return;
                    }
                }
                (this.hashTable[index] as LinkList<Pair<K, V>>).pushBack({
                    key,
                    value,
                });
                if (this.bucketNum <= HashMap.minTreeifySize) {
                    this.reAllocate(this.bucketNum);
                } else if (this.hashTable[index].size() >= HashMap.treeifyThreshold) {
                    this.hashTable[index] = new Map<K, V>(this.hashTable[index]);
                }
            } else (this.hashTable[index] as MapType<K, V>).setElement(key, value);
            const curSize = this.hashTable[index].size();
            this.length += curSize - preSize;
        }
        if (this.length > this.bucketNum * HashMap.sigma) {
            this.reAllocate.call(this, this.bucketNum);
        }
    }
    /**
     * Gets the value of the element which has the specified key.
     */
    getElementByKey(key: K) {
        const index = this.hashFunc(key) & (this.bucketNum - 1);
        if (!this.hashTable[index]) return undefined;
        if (this.hashTable[index] instanceof Map) return (this.hashTable[index] as MapType<K, V>).getElementByKey(key);
        else {
            for (const pair of this.hashTable[index]) {
                if (pair.key === key) return pair.value;
            }
            return undefined;
        }
    }
    /**
     * Removes the element of the specified key.
     */
    eraseElementByKey(key: K) {
        const index = this.hashFunc(key) & (this.bucketNum - 1);
        if (!this.hashTable[index]) return;
        const preSize = this.hashTable[index].size();
        if (this.hashTable[index] instanceof Map) {
            (this.hashTable[index] as MapType<K, V>).eraseElementByKey(key);
            if (this.hashTable[index].size() <= HashMap.untreeifyThreshold) {
                this.hashTable[index] = new LinkList<Pair<K, V>>(this.hashTable[index]);
            }
        } else {
            let pos = -1;
            for (const pair of this.hashTable[index]) {
                ++pos;
                if (pair.key === key) {
                    this.hashTable[index].eraseElementByPos(pos);
                    break;
                }
            }
        }
        const curSize = this.hashTable[index].size();
        this.length += curSize - preSize;
    }
    /**
     * @return If the specified element in the HashSet.
     */
    find(key: K) {
        const index = this.hashFunc(key) & (this.bucketNum - 1);
        if (!this.hashTable[index]) return false;
        if (this.hashTable[index] instanceof Map) return !(this.hashTable[index] as MapType<K, V>).find(key).equals(this.hashTable[index].end());
        for (const pair of this.hashTable[index]) {
            if (pair.key === key) return true;
        }
        return false;
    }
    /**
     * Using for 'for...of' syntax like Array.
     */
    [Symbol.iterator]() {
        return (function* (this: HashMap<K, V>) {
            let index = 0;
            while (index < this.bucketNum) {
                while (index < this.bucketNum && !this.hashTable[index]) ++index;
                if (index >= this.bucketNum) break;
                for (const pair of this.hashTable[index]) yield pair;
                ++index;
            }
        }).bind(this)();
    }
}

export default HashMap;
