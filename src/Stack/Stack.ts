import { BaseType } from "../Base/Base";

export type StackType<T> = {
    push: (element: T) => void;
    pop: () => void;
    top: () => T | undefined;
} & BaseType;

function Stack<T>(this: StackType<T>, container: { forEach: (callback: (element: T) => void) => void } = []) {
    let len = 0;
    const stack: T[] = [];

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

    container.forEach(element => this.push(element));

    Object.freeze(this);
}

Object.freeze(Stack);

export default (Stack as unknown as { new<T>(container?: { forEach: (callback: (element: T) => void) => void }): StackType<T> });
