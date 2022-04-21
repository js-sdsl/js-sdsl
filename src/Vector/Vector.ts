import { ContainerIterator, SequentialContainerType } from "../Base/Base";

export type VectorType<T> = SequentialContainerType<T>;

const VectorIterator = function <T>(
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
            return new VectorIterator(index + 1, size, getElementByPos, setElementByPos, this.iteratorType);
        }
        if (index === 0) throw new Error("Deque iterator access denied!");
        return new VectorIterator(index - 1, size, getElementByPos, setElementByPos);
    };

    this.next = function () {
        if (this.iteratorType === 'reverse') {
            if (index === -1) throw new Error("Deque iterator access denied!");
            return new VectorIterator(index - 1, size, getElementByPos, setElementByPos, this.iteratorType);
        }
        if (index === size()) throw new Error("Iterator access denied!");
        return new VectorIterator(index + 1, size, getElementByPos, setElementByPos);
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

function Vector<T>(this: VectorType<T>, container: { forEach: (callback: (element: T) => void) => void } = []) {
    let len = 0;
    const vector: T[] = [];

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        len = 0;
        vector.length = 0;
    };

    this.begin = function () {
        return new VectorIterator(0, this.size, this.getElementByPos, this.setElementByPos);
    };

    this.end = function () {
        return new VectorIterator(len, this.size, this.getElementByPos, this.setElementByPos);
    };

    this.rBegin = function () {
        return new VectorIterator(len - 1, this.size, this.getElementByPos, this.setElementByPos, 'reverse');
    }

    this.rEnd = function () {
        return new VectorIterator(-1, this.size, this.getElementByPos, this.setElementByPos, 'reverse');
    }

    this.front = function () {
        if (this.empty()) return undefined;
        return vector[0];
    };

    this.back = function () {
        if (this.empty()) return undefined;
        return vector[len - 1];
    };

    this.forEach = function (callback: (element: T, index: number) => void) {
        vector.forEach(callback);
    };

    this.getElementByPos = function (pos: number) {
        if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than vector's size");
        return vector[pos];
    };

    this.eraseElementByPos = function (pos: number) {
        if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than vector's size");
        for (let i = pos; i < len - 1; ++i) vector[i] = vector[i + 1];
        this.popBack();
    };

    this.eraseElementByValue = function (value: T) {
        const newArr: T[] = [];
        this.forEach(element => {
            if (element !== value) newArr.push(element);
        });
        newArr.forEach((element, index) => {
            vector[index] = element;
        });
        const newLen = newArr.length;
        while (len > newLen) this.popBack();
    };

    this.pushBack = function (element: T) {
        vector.push(element);
        ++len;
    };

    this.popBack = function () {
        vector.pop();
        if (len > 0) --len;
    };

    this.setElementByPos = function (pos: number, element: T) {
        if (element === undefined || element === null) {
            this.eraseElementByPos(pos);
            return;
        }
        if (pos < 0 || pos >= len) throw new Error("pos must more than 0 and less than vector's size");
        vector[pos] = element;
    };

    this.insert = function (pos: number, element: T, num = 1) {
        if (element === undefined || element === null) {
            throw new Error("you can't push undefined or null here");
        }
        if (pos < 0 || pos > len) throw new Error("pos must more than 0 and less than or equal to vector's size");
        vector.splice(pos, 0, ...new Array<T>(num).fill(element));
        len += num;
    };

    this.find = function (element: T) {
        for (let i = 0; i < len; ++i) {
            if (vector[i] === element) return new VectorIterator(i, this.size, this.getElementByPos, this.getElementByPos);
        }
        return this.end();
    };

    this.reverse = function () {
        vector.reverse();
    };

    this.unique = function () {
        let pre: T;
        const newArr: T[] = [];
        this.forEach((element, index) => {
            if (index === 0 || element !== pre) {
                newArr.push(element);
                pre = element;
            }
        });
        newArr.forEach((element, index) => {
            vector[index] = element;
        });
        const newLen = newArr.length;
        while (len > newLen) this.popBack();
    };

    this.sort = function (cmp?: (x: T, y: T) => number) {
        vector.sort(cmp);
    };

    if (typeof Symbol.iterator === 'symbol') {
        this[Symbol.iterator] = function () {
            return (function* () {
                return yield* vector;
            })();
        };
    }

    container.forEach(element => this.pushBack(element));
}

export default (Vector as unknown as { new <T>(container?: { forEach: (callback: (element: T) => void) => void }): VectorType<T>; });
