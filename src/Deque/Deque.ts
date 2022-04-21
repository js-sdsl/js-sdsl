import { ContainerIterator, SequentialContainerType } from "../Base/Base";

export type DequeType<T> = {
    pushFront: (element: T) => void;
    popFront: () => void;
    shrinkToFit: () => void;
    cut: (pos: number) => void;
} & SequentialContainerType<T>;

const DequeIterator = function <T>(
    this: ContainerIterator<T>,
    index: number,
    size: () => number,
    getElementByPos: (pos: number) => T,
    setElementByPos: (pos: number, element: T) => void,
    iteratorType: 'normal' | 'reverse' = 'normal',
) {
    Object.defineProperties(this, {
        iteratorType: {
            value: iteratorType
        },
        node: {
            value: index,
        },
        pointer: {
            get: () => {
                if (index < 0 || index >= size()) {
                    throw new Error("Deque iterator access denied!");
                }
                return getElementByPos(index);
            },
            set: (newValue: T) => {
                setElementByPos(index, newValue);
            },
            enumerable: true
        }
    });

    this.equals = function (obj: ContainerIterator<T>) {
        if (this.iteratorType !== obj.iteratorType) {
            throw new Error("iterator type error!");
        }
        // @ts-ignore
        return this.node === obj.node;
    };

    this.pre = function () {
        if (this.iteratorType === 'reverse') {
            if (index === size() - 1) throw new Error("Deque iterator access denied!");
            return new DequeIterator(index + 1, size, getElementByPos, setElementByPos, this.iteratorType);
        }
        if (index === 0) throw new Error("Deque iterator access denied!");
        return new DequeIterator(index - 1, size, getElementByPos, setElementByPos);
    };

    this.next = function () {
        if (this.iteratorType === 'reverse') {
            if (index === -1) throw new Error("Deque iterator access denied!");
            return new DequeIterator(index - 1, size, getElementByPos, setElementByPos, this.iteratorType);
        }
        if (index === size()) throw new Error("Iterator access denied!");
        return new DequeIterator(index + 1, size, getElementByPos, setElementByPos);
    };
} as unknown as {
    new <T>(
        pos: number,
        size: () => number,
        getElementByPos: (pos: number) => T,
        setElementByPos: (pos: number, element: T) => void,
        type?: 'normal' | 'reverse',
    ): ContainerIterator<T>
};

Deque.sigma = 3;    // growth factor
Deque.bucketSize = (1 << 12);

function Deque<T>(this: DequeType<T>, container: { forEach: (callback: (element: T) => void) => void, size?: () => number, length?: number } = []) {
    let map: (T[])[] = [];
    let first = 0;
    let curFirst = 0;
    let last = 0;
    let curLast = 0;
    let bucketNum = 0;
    let len = 0;

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

    this.begin = function () {
        return new DequeIterator(0, this.size, this.getElementByPos, this.setElementByPos);
    };

    this.end = function () {
        return new DequeIterator(len, this.size, this.getElementByPos, this.setElementByPos);
    };

    this.rBegin = function () {
        return new DequeIterator(len - 1, this.size, this.getElementByPos, this.setElementByPos, 'reverse');
    }

    this.rEnd = function () {
        return new DequeIterator(-1, this.size, this.getElementByPos, this.setElementByPos, 'reverse');
    }

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

    this.getElementByPos = function (pos: number) {
        const {
            curNodeBucketIndex,
            curNodePointerIndex
        } = getElementIndex(pos);
        return map[curNodeBucketIndex][curNodePointerIndex];
    };

    this.eraseElementByPos = function (pos: number) {
        if (pos < 0 || pos > len) throw new Error("pos should more than 0 and less than queue's size");
        if (pos === 0) this.popFront();
        else if (pos === this.size()) this.popBack();
        else {
            const arr = [];
            for (let i = pos + 1; i < len; ++i) {
                arr.push(this.getElementByPos(i));
            }
            this.cut(pos);
            this.popBack();
            arr.forEach(element => this.pushBack(element));
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

    this.eraseElementByIterator = function (iter: ContainerIterator<T>) {
        const nextIter = iter.next();
        // @ts-ignore
        this.eraseElementByPos(iter.node);
        iter = nextIter;
        return iter;
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
                    this.popFront();
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

    this.pushBack = function (element: T) {
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

    this.popBack = function () {
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
        if (element === undefined || element === null) {
            this.eraseElementByPos(pos);
            return;
        }
        const {
            curNodeBucketIndex,
            curNodePointerIndex
        } = getElementIndex(pos);
        map[curNodeBucketIndex][curNodePointerIndex] = element;
    };

    this.insert = function (pos: number, element: T, num = 1) {
        if (element === undefined || element === null) {
            throw new Error("you can't push undefined or null here");
        }
        if (pos === 0) {
            while (num--) this.pushFront(element);
        } else if (pos === this.size()) {
            while (num--) this.pushBack(element);
        } else {
            const arr: T[] = [];
            for (let i = pos; i < len; ++i) {
                arr.push(this.getElementByPos(i));
            }
            this.cut(pos - 1);
            for (let i = 0; i < num; ++i) this.pushBack(element);
            arr.forEach(element => this.pushBack(element));
        }
    };

    this.find = function (element: T) {
        function getIndex(curNodeBucketIndex: number, curNodePointerIndex: number) {
            if (curNodeBucketIndex === first) return curNodePointerIndex - curFirst;
            if (curNodeBucketIndex === last) return len - (curLast - curNodePointerIndex) - 1;
            return (Deque.bucketSize - first) + (curNodeBucketIndex - 2) * Deque.bucketSize + curNodePointerIndex;
        }

        let resIndex: number | undefined = undefined;

        if (first === last) {
            for (let i = curFirst; i <= curLast; ++i) {
                if (map[first][i] === element) resIndex = getIndex(first, i);
            }
            return this.end();
        }
        for (let i = curFirst; i < Deque.bucketSize; ++i) {
            if (map[first][i] === element) resIndex = getIndex(first, i);
        }
        if (resIndex === undefined) {
            for (let i = first + 1; i < last; ++i) {
                for (let j = 0; j < Deque.bucketSize; ++j) {
                    if (map[i][j] === element) resIndex = getIndex(first, i);
                }
            }
        }
        if (resIndex === undefined) {
            for (let i = 0; i <= curLast; ++i) {
                if (map[last][i] === element) resIndex = getIndex(first, i);
            }
        }
        if (resIndex === undefined) return this.end();
        if (resIndex === 0) return this.begin();
        return new DequeIterator(resIndex, this.size, this.getElementByPos, this.setElementByPos);
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

    this.pushFront = function (element: T) {
        if (element === undefined || element === null) {
            throw new Error("you can't push undefined or null here");
        }
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

    this.popFront = function () {
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
        arr.forEach(element => this.pushBack(element));
    };

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

    if (typeof Symbol.iterator === 'symbol') {
        this[Symbol.iterator] = function () {
            return (function* () {
                if (len === 0) return;
                if (first === last) {
                    for (let i = curFirst; i <= curLast; ++i) {
                        yield map[first][i];
                    }
                    return;
                }
                for (let i = curFirst; i < Deque.bucketSize; ++i) {
                    yield map[first][i];
                }
                for (let i = first + 1; i < last; ++i) {
                    for (let j = 0; j < Deque.bucketSize; ++j) {
                        yield map[i][j];
                    }
                }
                for (let i = 0; i <= curLast; ++i) {
                    yield map[last][i];
                }
            })();
        };
    }

    (() => {
        let _len = Deque.bucketSize;
        if (container.size) {
            _len = container.size();
        } else if (container.length) {
            _len = container.length;
        }
        const needSize = _len * Deque.sigma;
        bucketNum = Math.ceil(needSize / Deque.bucketSize);
        bucketNum = Math.max(bucketNum, 3);
        for (let i = 0; i < bucketNum; ++i) {
            map.push(new Array(Deque.bucketSize));
        }
        const needBucketNum = Math.ceil(_len / Deque.bucketSize);
        first = Math.floor(bucketNum / 2) - Math.floor(needBucketNum / 2);
        last = first;
        container.forEach(element => this.pushBack(element));
    })();
}

export default (Deque as unknown as { new <T>(arr: T[]): DequeType<T>; });
