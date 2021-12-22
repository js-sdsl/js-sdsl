import { SequentialContainerType } from "../Base/Base";

export type VectorType<T> = SequentialContainerType<T>;

function Vector<T>(this: VectorType<T>, arr: T[] = []) {
    let len = arr.length;
    const vector = [...arr];

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
        if (pos < 0 || pos >= len) throw new Error("pos muse more than 0 and less than vector's size");
        return vector[pos];
    };

    this.eraseElementByPos = function (pos: number) {
        if (pos < 0 || pos >= len) throw new Error("pos muse more than 0 and less than vector's size");
        for (let i = pos; i < len - 1; ++i) vector[i] = vector[i + 1];
        this.pop_back();
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
        while (len > newLen) this.pop_back();
    };

    this.push_back = function (element: T) {
        vector.push(element);
        ++len;
    };

    this.pop_back = function () {
        vector.pop();
        if (len > 0) --len;
    };

    this.setElementByPos = function (pos: number, element: T) {
        if (pos < 0 || pos >= len) throw new Error("pos muse more than 0 and less than vector's size");
        vector[pos] = element;
    };

    this.insert = function (pos: number, element: T, num = 1) {
        if (pos < 0 || pos > len) throw new Error("pos muse more than 0 and less than or equal to vector's size");
        vector.splice(pos, 0, ...new Array<T>(num).fill(element));
        len += num;
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
        while (len > newLen) this.pop_back();
    };

    this.sort = function (cmp?: (x: T, y: T) => number) {
        vector.sort(cmp);
    };

    Object.freeze(this);
}

Object.freeze(Vector);

export default (Vector as any as { new<T>(arr?: T[]): VectorType<T>; });
