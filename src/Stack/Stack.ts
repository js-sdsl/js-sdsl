import { Base } from "../Base/Base";

export interface StackType<T> extends Base {
    /**
     * Inserts element at the top.
     */
    push: (element: T) => void;
    /**
     * Removes the top element.
     */
    pop: () => void;
    /**
     * Accesses the top element.
     */
    top: () => T | undefined;
}

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
}

export default (Stack as unknown as { new<T>(container?: { forEach: (callback: (element: T) => void) => void }): StackType<T> });
