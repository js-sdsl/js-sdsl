import { SequentialContainerType } from "../Base/Base";

export type DequeType<T> = {
    push_front: (element: T) => void;
    pop_front: () => void;
    shrinkToFit: () => void;
    cut: (pos: number) => void;
} & SequentialContainerType<T>;

Deque.sigma = 3;    // growth factor
Deque.bucketSize = 5000;

function Deque<T>(this: DequeType<T>, arr: T[] = []) {
    let map: (T[])[] = [];
    let first = 0;
    let curFirst = 0;
    let last = 0;
    let curLast = 0;
    let bucketNum = 0;
    let len = arr.length;
    const needSize = len * Deque.sigma;
    bucketNum = Math.ceil(needSize / Deque.bucketSize);
    bucketNum = Math.max(bucketNum, 3);
    for (let i = 0; i < bucketNum; ++i) {
        map.push(new Array(Deque.bucketSize));
    }
    const needBucketNum = Math.ceil(len / Deque.bucketSize);
    first = Math.floor(bucketNum / 2) - Math.floor(needBucketNum / 2);
    last = first;
    if (len > 0) {
        let cnt = 0;
        for (let i = 0; i < needBucketNum; ++i) {
            for (let j = 0; j < Deque.bucketSize; ++j) {
                map[first + i][j] = arr[cnt++];
                if (cnt >= len) {
                    last = first + i;
                    curLast = j;
                    break;
                }
            }
            if (cnt >= len) break;
        }
    }

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        first = last = curFirst = curLast = bucketNum = len = 0;
        reAllocate.call(this, Deque.bucketSize);
        len = 0;
    };

    this.front = function () {
        return map[first][curFirst];
    };

    this.back = function () {
        return map[last][curLast];
    };

    this.forEach = function (callback: (element: T, index: number) => void) {
        if (this.empty()) return;
        let index = 0;
        if (first === last) {
            for (let i = curFirst; i <= curLast; ++i) {
                callback(map[first][i], index++);
            }
            return;
        }
        for (let i = curFirst; i < Deque.bucketSize; ++i) {
            callback(map[first][i], index++);
        }
        for (let i = first + 1; i < last; ++i) {
            for (let j = 0; j < Deque.bucketSize; ++j) {
                callback(map[i][j], index++);
            }
        }
        for (let i = 0; i <= curLast; ++i) {
            callback(map[last][i], index++);
        }
    };

    const getElementIndex = function (pos: number) {
        const curFirstIndex = first * Deque.bucketSize + curFirst;
        const curNodeIndex = curFirstIndex + pos;
        const curLastIndex = last * Deque.bucketSize + curLast;
        if (curNodeIndex < curFirstIndex || curNodeIndex > curLastIndex) throw new Error("pos should more than 0 and less than queue's size");
        const curNodeBucketIndex = Math.floor(curNodeIndex / Deque.bucketSize);
        const curNodePointerIndex = curNodeIndex % Deque.bucketSize;
        return { curNodeBucketIndex, curNodePointerIndex };
    };

    /**
     * @param pos index from 0 to size - 1
     */
    this.getElementByPos = function (pos: number) {
        const {
            curNodeBucketIndex,
            curNodePointerIndex
        } = getElementIndex(pos);
        return map[curNodeBucketIndex][curNodePointerIndex];
    };

    this.eraseElementByPos = function (pos: number) {
        if (pos < 0 || pos > len) throw new Error("pos should more than 0 and less than queue's size");
        if (pos === 0) this.pop_front();
        else if (pos === this.size()) this.pop_back();
        else {
            const arr = [];
            for (let i = pos + 1; i < len; ++i) {
                arr.push(this.getElementByPos(i));
            }
            this.cut(pos);
            this.pop_back();
            arr.forEach(element => this.push_back(element));
        }
    };

    this.eraseElementByValue = function (value: T) {
        if (this.empty()) return;
        const arr: T[] = [];
        this.forEach(element => {
            if (element !== value) {
                arr.push(element);
            }
        });
        const _len = arr.length;
        for (let i = 0; i < _len; ++i) this.setElementByPos(i, arr[i]);
        this.cut(_len - 1);
    };

    const reAllocate = function (this: DequeType<T>, originalSize: number) {
        const newMap = [];
        const needSize = originalSize * Deque.sigma;
        const newBucketNum = Math.max(Math.ceil(needSize / Deque.bucketSize), 2);
        for (let i = 0; i < newBucketNum; ++i) {
            newMap.push(new Array(Deque.bucketSize));
        }
        const needBucketNum = Math.ceil(originalSize / Deque.bucketSize);
        const newFirst = Math.floor(newBucketNum / 2) - Math.floor(needBucketNum / 2);
        let newLast = newFirst, newCurLast = 0;
        if (this.size()) {
            for (let i = 0; i < needBucketNum; ++i) {
                for (let j = 0; j < Deque.bucketSize; ++j) {
                    newMap[newFirst + i][j] = this.front();
                    this.pop_front();
                    if (this.empty()) {
                        newLast = newFirst + i;
                        newCurLast = j;
                        break;
                    }
                }
                if (this.empty()) break;
            }
        }
        map = newMap;
        first = newFirst;
        curFirst = 0;
        last = newLast;
        curLast = newCurLast;
        bucketNum = newBucketNum;
        len = originalSize;
    };

    this.push_back = function (element: T) {
        if (!this.empty()) {
            if (last === bucketNum - 1 && curLast === Deque.bucketSize - 1) {
                reAllocate.call(this, this.size());
            }
            if (curLast < Deque.bucketSize - 1) {
                ++curLast;
            } else if (last < bucketNum - 1) {
                ++last;
                curLast = 0;
            }
        }
        ++len;
        map[last][curLast] = element;
    };

    this.pop_back = function () {
        if (this.empty()) return;
        if (this.size() !== 1) {
            if (curLast > 0) {
                --curLast;
            } else if (first < last) {
                --last;
                curLast = Deque.bucketSize - 1;
            }
        }
        if (len > 0) --len;
    };

    this.setElementByPos = function (pos: number, element: T) {
        const {
            curNodeBucketIndex,
            curNodePointerIndex
        } = getElementIndex(pos);
        map[curNodeBucketIndex][curNodePointerIndex] = element;
    };

    /**
     * @param {number} pos insert element before pos, should in [0, queue.size]
     * @param {any} element the element you want to insert
     * @param {number} [num = 1] the nums you want to insert
     */
    this.insert = function (pos: number, element: T, num = 1) {
        if (pos === 0) {
            while (num--) this.push_front(element);
        } else if (pos === this.size()) {
            while (num--) this.push_back(element);
        } else {
            const arr: T[] = [];
            for (let i = pos; i < len; ++i) {
                arr.push(this.getElementByPos(i));
            }
            this.cut(pos - 1);
            for (let i = 0; i < num; ++i) this.push_back(element);
            arr.forEach(element => this.push_back(element));
        }
    };

    this.reverse = function () {
        let l = 0, r = len - 1;
        while (l < r) {
            const tmp = this.getElementByPos(l);
            this.setElementByPos(l, this.getElementByPos(r));
            this.setElementByPos(r, tmp);
            ++l;
            --r;
        }
    };

    this.unique = function () {
        if (this.empty()) return;
        const arr: T[] = [];
        let pre = this.front();
        this.forEach((element, index) => {
            if (index === 0 || element !== pre) {
                arr.push(element);
                pre = element;
            }
        });
        for (let i = 0; i < len; ++i) {
            this.setElementByPos(i, arr[i]);
        }
        this.cut(arr.length - 1);
    };

    this.sort = function (cmp?: (x: T, y: T) => number) {
        const arr: T[] = [];
        this.forEach(element => {
            arr.push(element);
        });
        arr.sort(cmp);
        for (let i = 0; i < len; ++i) this.setElementByPos(i, arr[i]);
    };

    this.push_front = function (element: T) {
        if (!this.empty()) {
            if (first === 0 && curFirst === 0) {
                reAllocate.call(this, this.size());
            }
            if (curFirst > 0) {
                --curFirst;
            } else if (first > 0) {
                --first;
                curFirst = Deque.bucketSize - 1;
            }
        }
        ++len;
        map[first][curFirst] = element;
    };

    this.pop_front = function () {
        if (this.empty()) return;
        if (this.size() !== 1) {
            if (curFirst < Deque.bucketSize - 1) {
                ++curFirst;
            } else if (first < last) {
                ++first;
                curFirst = 0;
            }
        }
        if (len > 0) --len;
    };

    /**
     * reduces memory usage by freeing unused memory
     */
    this.shrinkToFit = function () {
        const arr: T[] = [];
        this.forEach((element) => {
            arr.push(element);
        });
        const _len = arr.length;
        map = [];
        const bucketNum = Math.ceil(_len / Deque.bucketSize);
        for (let i = 0; i < bucketNum; ++i) {
            map.push(new Array(Deque.bucketSize));
        }
        this.clear();
        let cnt = 0;
        for (let i = 0; i < bucketNum; ++i) {
            for (let j = 0; j < Deque.bucketSize; ++j) {
                map[i][j] = arr[cnt++];
                if (cnt >= _len) {
                    last = i;
                    curLast = j;
                    break;
                }
            }
        }
        len = _len;
    };

    /**
     * @param pos cut element after pos
     */
    this.cut = function (pos: number) {
        if (pos < 0) {
            this.clear();
            return;
        }
        const {
            curNodeBucketIndex,
            curNodePointerIndex
        } = getElementIndex(pos);
        last = curNodeBucketIndex;
        curLast = curNodePointerIndex;
        len = pos + 1;
    };

    Object.freeze(this);
}

Object.freeze(Deque);

export default (Deque as any as { new<T>(arr: T[]): DequeType<T>; });
