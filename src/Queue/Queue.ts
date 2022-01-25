import { BaseType } from "../Base/Base";
import LinkList from "../LinkList/LinkList";

export type QueueType<T> = {
    push: (element: T) => void;
    pop: () => void;
    front: () => T | undefined;
} & BaseType;

function Queue<T>(this: QueueType<T>, container: { forEach: (callback: (element: T) => void) => void } = []) {
    const queue = new LinkList(container);

    this.size = function () {
        return queue.size();
    };

    this.empty = function () {
        return queue.empty();
    };

    this.clear = function () {
        queue.clear();
    };

    this.push = function (element: T) {
        queue.pushBack(element);
    };

    this.pop = function () {
        queue.popFront();
    };

    this.front = function () {
        return queue.front();
    };
}

export default (Queue as unknown as { new<T>(container?: { forEach: (callback: (element: T) => void) => void }): QueueType<T> });
