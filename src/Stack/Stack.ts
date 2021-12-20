import { BaseType } from "../Base/Base";

export type StackType<T> = {
    push: (element: T) => void;
    pop: () => void;
    top: () => T | undefined;
} & BaseType;

function Stack<T>(this: StackType<T>, arr: T[] = []) {
    let len = arr.length;
    const stack = [...arr];

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        len = 0;
        stack.length = 0;
    };

    this.push = function (element: T) {
        stack.push(element);
        ++len;
    };

    this.pop = function () {
        stack.pop();
        if (len > 0) --len;
    };

    this.top = function () {
        return stack[len - 1];
    };

    Object.freeze(this);
}

Object.freeze(Stack);

export default (Stack as any as { new<T>(arr?: T[]): StackType<T> });
