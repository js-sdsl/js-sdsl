import { ContainerIterator, SequentialContainer, initContainer } from "../Base/Base";

class VectorIterator<T> implements ContainerIterator<T> {
    private node: number;
    private size: () => number;
    private getElementByPos: (pos: number) => T;
    private setElementByPos: (pos: number, element: T) => void;

    pointer: T;
    readonly iteratorType: 'normal' | 'reverse';

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
            get(this: VectorIterator<T>) {
                if (this.node < 0 || this.node >= this.size()) {
                    throw new Error("Deque iterator access denied!");
                }
                return this.getElementByPos(this.node);
            },
            set(this: VectorIterator<T>, newValue: T) {
                if (this.node < 0 || this.node >= this.size()) {
                    throw new Error("Deque iterator access denied!");
                }
                this.setElementByPos(this.node, newValue);
            }
        });
    }

    pre() {
        if (this.iteratorType === 'reverse') {
            if (this.node === this.size() - 1) throw new Error("Deque iterator access denied!");
            ++this.node;
        } else {
            if (this.node === 0) throw new Error("Deque iterator access denied!");
            --this.node;
        }
        return this;
    }
    next() {
        if (this.iteratorType === 'reverse') {
            if (this.node === -1) throw new Error("Deque iterator access denied!");
            --this.node
        } else {
            if (this.node === this.size()) throw new Error("Iterator access denied!");
            ++this.node;
        }
        return this;
    }
    equals(obj: ContainerIterator<T>) {
        if (obj.constructor.name !== this.constructor.name) {
            throw new Error(`obj's constructor is not ${this.constructor.name}!`);
        }
        if (this.iteratorType !== obj.iteratorType) {
            throw new Error("iterator type error!");
        }
        // @ts-ignore
        return this.node === obj.node;
    }
}

class Vector<T> implements SequentialContainer<T> {
    private length  = 0;
    private vector: T[] = [];

    constructor(container: initContainer<T> = []) {
        container.forEach(element => this.pushBack(element));
    }

    size() { return this.length; }
    empty() { return this.length === 0; }
    clear() {
        this.length = 0;
        this.vector.length = 0;
    }
    begin() {
        return new VectorIterator<T>(0, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this));
    }
    end() {
        return new VectorIterator<T>(this.length, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this));
    }
    rBegin() {
        return new VectorIterator<T>(this.length - 1, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this), 'reverse');
    }
    rEnd() {
        return new VectorIterator<T>(-1, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this), 'reverse');
    }
    front() {
        if (this.empty()) return undefined;
        return this.vector[0];
    }
    back() {
        if (this.empty()) return undefined;
        return this.vector[this.length - 1];
    }
    forEach(callback: (element: T, index: number) => void) {
        this.vector.forEach(callback);
    }
    getElementByPos(pos: number) {
        if (pos < 0 || pos >= this.length) throw new Error("pos must more than 0 and less than vector's size");
        return this.vector[pos];
    }
    eraseElementByPos(pos: number) {
        if (pos < 0 || pos >= this.length) throw new Error("pos must more than 0 and less than vector's size");
        for (let i = pos; i < this.length - 1; ++i) this.vector[i] = this.vector[i + 1];
        this.popBack();
    }
    eraseElementByValue(value: T) {
        const newArr: T[] = [];
        this.forEach(element => {
            if (element !== value) newArr.push(element);
        });
        newArr.forEach((element, index) => {
            this.vector[index] = element;
        });
        const newLen = newArr.length;
        while (this.length > newLen) this.popBack();
    }
    eraseElementByIterator(iter: ContainerIterator<T>) {
        const nextIter = iter.next();
        // @ts-ignore
        this.eraseElementByPos(iter.node);
        iter = nextIter;
        return iter;
    }
    pushBack(element: T) {
        this.vector.push(element);
        ++this.length;
    }
    popBack() {
        this.vector.pop();
        if (this.length > 0) --this.length;
    }
    setElementByPos(pos: number, element: T) {
        if (element === undefined || element === null) {
            this.eraseElementByPos(pos);
            return;
        }
        if (pos < 0 || pos >= this.length) throw new Error("pos must more than 0 and less than vector's size");
        this.vector[pos] = element;
    }
    insert(pos: number, element: T, num = 1) {
        if (element === undefined || element === null) {
            throw new Error("you can't push undefined or null here");
        }
        if (pos < 0 || pos > this.length) throw new Error("pos must more than 0 and less than or equal to vector's size");
        this.vector.splice(pos, 0, ...new Array<T>(num).fill(element));
        this.length += num;
    }
    find(element: T) {
        for (let i = 0; i < this.length; ++i) {
            if (this.vector[i] === element) return new VectorIterator(i, this.size, this.getElementByPos, this.getElementByPos);
        }
        return this.end();
    }
    reverse() {
        this.vector.reverse();
    }
    unique() {
        let pre: T;
        const newArr: T[] = [];
        this.forEach((element, index) => {
            if (index === 0 || element !== pre) {
                newArr.push(element);
                pre = element;
            }
        });
        newArr.forEach((element, index) => {
            this.vector[index] = element;
        });
        const newLen = newArr.length;
        while (this.length > newLen) this.popBack();
    }
    sort(cmp?: (x: T, y: T) => number) {
        this.vector.sort(cmp);
    }
    [Symbol.iterator]() {
        return (function* (this: Vector<T>) {
            return yield* this.vector;
        }).bind(this)();
    }
}

export default Vector;
