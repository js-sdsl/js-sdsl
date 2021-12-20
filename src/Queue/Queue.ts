import { BaseType } from "../Base/Base";
import LinkList from "../LinkList/LinkList";

export type QueueType<T> = {
    push: (element: T) => void;
    pop: () => void;
    front: () => T | undefined;
} & BaseType;

function Queue<T>(this: QueueType<T>, arr: T[] = []) {
    const queue = new LinkList(arr);

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
        queue.push_back(element);
    };

    this.pop = function () {
        queue.pop_front();
    };

    this.front = function () {
        return queue.front();
    };

    Object.freeze(this);
}

Object.freeze(Queue);

export default (Queue as any as { new<T>(arr?: T[]): QueueType<T> });
