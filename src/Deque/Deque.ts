import { BaseType, ContainerIterator, SequentialContainerType } from "../Base/Base";

export interface DequeType<T> extends SequentialContainerType<T> {
    /**
     * Push the element to the front.
     */
    pushFront: (element: T) => void;
    /**
     * Remove the first element.
     */
    popFront: () => void;
    /**
     * Remove useless space.
     */
    shrinkToFit: () => void;
    /**
     * Remove all elements after the specified position (excluding the specified position).
     */
    cut: (pos: number) => void;
}

class DequeIterator<T> implements ContainerIterator<T> {
    private node: number;
    private size: () => number;
    private getElementByPos: (pos: number) => T;
    private setElementByPos: (pos: number, element: T) => void;

    pointer: T;
    readonly iteratorType: 'normal' | 'reverse' = 'normal';

    constructor(
        index: number,
        size: () => number,
        getElementByPos: (pos: number) => T,
        setElementByPos: (pos: number, element: T) => void,
        iteratorType: 'normal' | 'reverse' = 'normal'
    ) {
        this.node = index;
        this.size = size;
        this.getElementByPos = getElementByPos;
        this.setElementByPos = setElementByPos;
        this.iteratorType = iteratorType;

        this.pointer = undefined as unknown as T;

        Object.defineProperty(this, 'pointer', {
            get(this: DequeIterator<T>) {
                return this.getElementByPos(this.node);
            },
            set(this: DequeIterator<T>, newValue: T) {
                this.setElementByPos(this.node, newValue);
            }
        });
    }

    pre() {
        if (this.iteratorType === 'reverse') {
            if (this.node === this.size() - 1) throw new Error("Deque iterator access denied!");
            ++this.node;
        }
        if (this.node === 0) throw new Error("Deque iterator access denied!");
        --this.node;
        return this;
    }
    next() {
        if (this.iteratorType === 'reverse') {
            if (this.node === -1) throw new Error("Deque iterator access denied!");
            --this.node
        }
        if (this.node === this.size()) throw new Error("Iterator access denied!");
        ++this.node;
        return this;
    }
    equals(obj: ContainerIterator<T>) {
        if (obj.constructor.name !== this.constructor.name) {
            throw new Error(`obj's constructor is not ${this.constructor.name}!`);
        }
        if (this.iteratorType !== obj.iteratorType) {
            throw new Error("iterator type error!");
        }
        return this.node === (obj as DequeIterator<T>).node;
    }
}

class Deque<T> implements DequeType<T> {
    private static sigma = 3;
    private static bucketSize = (1 << 12);

    private map: (T[])[] = [];
    private first: number = 0;
    private curFirst: number = 0;
    private last: number = 0;
    private curLast: number = 0;
    private bucketNum: number = 0;
    private length: number = 0;

    constructor(container: {
        forEach: (callback: (element: T) => void) => void,
        size?: () => number,
        length?: number
    } = []) {
        let _length = Deque.bucketSize;
        if (container.size) {
            _length = container.size();
        } else if (container.length) {
            _length = container.length;
        }
        const needSize = _length * Deque.sigma;
        this.bucketNum = Math.ceil(needSize / Deque.bucketSize);
        this.bucketNum = Math.max(this.bucketNum, 3);
        for (let i = 0; i < this.bucketNum; ++i) {
            this.map.push(new Array(Deque.bucketSize));
        }
        const needBucketNum = Math.ceil(_length / Deque.bucketSize);
        this.first = Math.floor(this.bucketNum / 2) - Math.floor(needBucketNum / 2);
        this.last = this.first;
        container.forEach(element => this.pushBack(element));
    }

    private reAllocate(originalSize: number) {
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
        this.map = newMap;
        this.first = newFirst;
        this.curFirst = 0;
        this.last = newLast;
        this.curLast = newCurLast;
        this.bucketNum = newBucketNum;
        this.length = originalSize;
    };
    private getElementIndex(pos: number) {
        const curFirstIndex = this.first * Deque.bucketSize + this.curFirst;
        const curNodeIndex = curFirstIndex + pos;
        const curLastIndex = this.last * Deque.bucketSize + this.curLast;
        if (curNodeIndex < curFirstIndex || curNodeIndex > curLastIndex) throw new Error("pos should more than 0 and less than queue's size");
        const curNodeBucketIndex = Math.floor(curNodeIndex / Deque.bucketSize);
        const curNodePointerIndex = curNodeIndex % Deque.bucketSize;
        return { curNodeBucketIndex, curNodePointerIndex };
    };
    private getIndex(curNodeBucketIndex: number, curNodePointerIndex: number) {
        if (curNodeBucketIndex === this.first) return curNodePointerIndex - this.curFirst;
        if (curNodeBucketIndex === this.last) return this.length - (this.curLast - curNodePointerIndex) - 1;
        return (Deque.bucketSize - this.first) + (curNodeBucketIndex - 2) * Deque.bucketSize + curNodePointerIndex;
    }

    size() { return this.length };
    empty() { return this.length === 0 };
    clear() {
        this.first = this.last = this.curFirst = this.curLast = this.bucketNum = this.length = 0;
        this.reAllocate(Deque.bucketSize);
        this.length = 0;
    }
    front() {
        return this.map[this.first][this.curFirst];
    }
    back() {
        return this.map[this.last][this.curLast];
    }
    begin() {
        return new DequeIterator(0, this.size, this.getElementByPos, this.setElementByPos);
    }
    end() {
        return new DequeIterator(this.length, this.size, this.getElementByPos, this.setElementByPos);
    }
    rBegin() {
        return new DequeIterator(this.length - 1, this.size, this.getElementByPos, this.setElementByPos, 'reverse');
    }
    rEnd() {
        return new DequeIterator(-1, this.size, this.getElementByPos, this.setElementByPos, 'reverse');
    }
    pushBack(element: T) {
        if (!this.empty()) {
            if (this.last === this.bucketNum - 1 && this.curLast === Deque.bucketSize - 1) {
                this.reAllocate(this.size());
            }
            if (this.curLast < Deque.bucketSize - 1) {
                ++this.curLast;
            } else if (this.last < this.bucketNum - 1) {
                ++this.last;
                this.curLast = 0;
            }
        }
        ++this.length;
        this.map[this.last][this.curLast] = element;
    }
    popBack() {
        if (this.empty()) return;
        if (this.size() !== 1) {
            if (this.curLast > 0) {
                --this.curLast;
            } else if (this.first < this.last) {
                --this.last;
                this.curLast = Deque.bucketSize - 1;
            }
        }
        if (this.length > 0) --this.length;
    }
    pushFront(element: T) {
        if (element === undefined || element === null) {
            throw new Error("you can't push undefined or null here");
        }
        if (!this.empty()) {
            if (this.first === 0 && this.curFirst === 0) {
                this.reAllocate.call(this, this.size());
            }
            if (this.curFirst > 0) {
                --this.curFirst;
            } else if (this.first > 0) {
                --this.first;
                this.curFirst = Deque.bucketSize - 1;
            }
        }
        ++this.length;
        this.map[this.first][this.curFirst] = element;
    }
    popFront() {
        if (this.empty()) return;
        if (this.size() !== 1) {
            if (this.curFirst < Deque.bucketSize - 1) {
                ++this.curFirst;
            } else if (this.first < this.last) {
                ++this.first;
                this.curFirst = 0;
            }
        }
        if (this.length > 0) --this.length;
    }
    forEach(callback: (element: T, index: number) => void) {
        if (this.empty()) return;
        let index = 0;
        if (this.first === this.last) {
            for (let i = this.curFirst; i <= this.curLast; ++i) {
                callback(this.map[this.first][i], index++);
            }
            return;
        }
        for (let i = this.curFirst; i < Deque.bucketSize; ++i) {
            callback(this.map[this.first][i], index++);
        }
        for (let i = this.first + 1; i < this.last; ++i) {
            for (let j = 0; j < Deque.bucketSize; ++j) {
                callback(this.map[i][j], index++);
            }
        }
        for (let i = 0; i <= this.curLast; ++i) {
            callback(this.map[this.last][i], index++);
        }
    }
    getElementByPos(pos: number) {
        const {
            curNodeBucketIndex,
            curNodePointerIndex
        } = this.getElementIndex(pos);
        return this.map[curNodeBucketIndex][curNodePointerIndex];
    }
    setElementByPos(pos: number, element: T) {
        if (element === undefined || element === null) {
            this.eraseElementByPos(pos);
            return;
        }
        const {
            curNodeBucketIndex,
            curNodePointerIndex
        } = this.getElementIndex(pos);
        this.map[curNodeBucketIndex][curNodePointerIndex] = element;
    }
    insert(pos: number, element: T, num = 1) {
        if (element === undefined || element === null) {
            throw new Error("you can't push undefined or null here");
        }
        if (pos === 0) {
            while (num--) this.pushFront(element);
        } else if (pos === this.size()) {
            while (num--) this.pushBack(element);
        } else {
            const arr: T[] = [];
            for (let i = pos; i < this.length; ++i) {
                arr.push(this.getElementByPos(i));
            }
            this.cut(pos - 1);
            for (let i = 0; i < num; ++i) this.pushBack(element);
            arr.forEach(element => this.pushBack(element));
        }
    }
    cut(pos: number) {
        if (pos < 0) {
            this.clear();
            return;
        }
        const {
            curNodeBucketIndex,
            curNodePointerIndex
        } = this.getElementIndex(pos);
        this.last = curNodeBucketIndex;
        this.curLast = curNodePointerIndex;
        this.length = pos + 1;
    }
    eraseElementByPos(pos: number) {
        if (pos < 0 || pos > this.length) throw new Error("pos should more than 0 and less than queue's size");
        if (pos === 0) this.popFront();
        else if (pos === this.size()) this.popBack();
        else {
            const arr = [];
            for (let i = pos + 1; i < this.length; ++i) {
                arr.push(this.getElementByPos(i));
            }
            this.cut(pos);
            this.popBack();
            arr.forEach(element => this.pushBack(element));
        }
    }
    eraseElementByValue(value: T) {
        if (this.empty()) return;
        const arr: T[] = [];
        this.forEach(element => {
            if (element !== value) {
                arr.push(element);
            }
        });
        const _length = arr.length;
        for (let i = 0; i < _length; ++i) this.setElementByPos(i, arr[i]);
        this.cut(_length - 1);
    }
    eraseElementByIterator(iter: ContainerIterator<T>) {
        const nextIter = iter.next();
        // @ts-ignore
        this.eraseElementByPos(iter.node);
        iter = nextIter;
        return iter;
    }
    find(element: T) {
        let resIndex: number | undefined = undefined;

        if (this.first === this.last) {
            for (let i = this.curFirst; i <= this.curLast; ++i) {
                if (this.map[this.first][i] === element) resIndex = this.getIndex(this.first, i);
            }
            return this.end();
        }
        for (let i = this.curFirst; i < Deque.bucketSize; ++i) {
            if (this.map[this.first][i] === element) resIndex = this.getIndex(this.first, i);
        }
        if (resIndex === undefined) {
            for (let i = this.first + 1; i < this.last; ++i) {
                for (let j = 0; j < Deque.bucketSize; ++j) {
                    if (this.map[i][j] === element) resIndex = this.getIndex(this.first, i);
                }
            }
        }
        if (resIndex === undefined) {
            for (let i = 0; i <= this.curLast; ++i) {
                if (this.map[this.last][i] === element) resIndex = this.getIndex(this.first, i);
            }
        }
        if (resIndex === undefined) return this.end();
        if (resIndex === 0) return this.begin();
        return new DequeIterator(resIndex, this.size, this.getElementByPos, this.setElementByPos);
    }
    reverse() {
        let l = 0, r = this.length - 1;
        while (l < r) {
            const tmp = this.getElementByPos(l);
            this.setElementByPos(l, this.getElementByPos(r));
            this.setElementByPos(r, tmp);
            ++l;
            --r;
        }
    }
    unique() {
        if (this.empty()) return;
        const arr: T[] = [];
        let pre = this.front();
        this.forEach((element, index) => {
            if (index === 0 || element !== pre) {
                arr.push(element);
                pre = element;
            }
        });
        for (let i = 0; i < this.length; ++i) {
            this.setElementByPos(i, arr[i]);
        }
        this.cut(arr.length - 1);
    }
    sort(cmp?: (x: T, y: T) => number) {
        const arr: T[] = [];
        this.forEach(element => {
            arr.push(element);
        });
        arr.sort(cmp);
        for (let i = 0; i < this.length; ++i) this.setElementByPos(i, arr[i]);
    }
    shrinkToFit() {
        const arr: T[] = [];
        this.forEach((element) => {
            arr.push(element);
        });
        const _length = arr.length;
        this.map = [];
        const bucketNum = Math.ceil(_length / Deque.bucketSize);
        for (let i = 0; i < bucketNum; ++i) {
            this.map.push(new Array(Deque.bucketSize));
        }
        this.clear();
        arr.forEach(element => this.pushBack(element));
    }
    [Symbol.iterator]() {
        const self = this;
        return (function* () {
            if (self.length === 0) return;
            if (self.first === self.last) {
                for (let i = self.curFirst; i <= self.curLast; ++i) {
                    yield self.map[self.first][i];
                }
                return;
            }
            for (let i = self.curFirst; i < Deque.bucketSize; ++i) {
                yield self.map[self.first][i];
            }
            for (let i = self.first + 1; i < self.last; ++i) {
                for (let j = 0; j < Deque.bucketSize; ++j) {
                    yield self.map[i][j];
                }
            }
            for (let i = 0; i <= self.curLast; ++i) {
                yield self.map[self.last][i];
            }
        })();
    };
}

export default Deque;
