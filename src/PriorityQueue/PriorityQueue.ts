import { BaseType } from "../Base/Base";

type PriorityQueue<T> = {
    push: (element: T) => void;
    pop: () => void;
    top: () => T;
} & BaseType;

/**
 * @param arr
 * @param cmp default cmp will generate a max heap
 * @constructor
 */
function PriorityQueue<T>(this: PriorityQueue<T>, arr: T[] = [], cmp: (x: T, y: T) => number) {
    cmp = cmp || ((x, y) => {
        if (x > y) return -1;
        if (x < y) return 1;
        return 0;
    });

    let len = arr.length;
    const priorityQueue = [...arr];

    const swap = function (x: number, y: number) {
        if (x < 0 || x >= len) throw new Error("unknown error");
        if (y < 0 || y >= len) throw new Error("unknown error");
        const tmp = priorityQueue[x];
        priorityQueue[x] = priorityQueue[y];
        priorityQueue[y] = tmp;
    };

    const adjust = function (parent: number) {
        if (parent < 0 || parent >= len) throw new Error("unknown error");
        const leftChild = parent * 2 + 1;
        const rightChild = parent * 2 + 2;
        if (leftChild < len && cmp(priorityQueue[parent], priorityQueue[leftChild]) > 0) swap(parent, leftChild);
        if (rightChild < len && cmp(priorityQueue[parent], priorityQueue[rightChild]) > 0) swap(parent, rightChild);
    };

    for (let parent = Math.floor((len - 1) / 2); parent >= 0; --parent) {
        let curParent = parent;
        let curChild = curParent * 2 + 1;
        while (curChild < len) {
            const leftChild = curChild;
            const rightChild = leftChild + 1;
            let minChild = leftChild;
            if (rightChild < len && cmp(priorityQueue[leftChild], priorityQueue[rightChild]) > 0) minChild = rightChild;
            if (cmp(priorityQueue[curParent], priorityQueue[minChild]) <= 0) break;
            swap(curParent, minChild);
            curParent = minChild;
            curChild = curParent * 2 + 1;
        }
    }

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        len = 0;
        priorityQueue.length = 0;
    };

    this.push = function (element: T) {
        priorityQueue.push(element);
        ++len;
        if (len === 1) return;
        let curNode = len - 1;
        while (curNode > 0) {
            const parent = Math.floor((curNode - 1) / 2);
            if (cmp(priorityQueue[parent], element) <= 0) break;
            adjust(parent);
            curNode = parent;
        }
    };

    this.pop = function () {
        if (this.empty()) return;
        if (this.size() === 1) {
            --len;
            return;
        }
        const last = priorityQueue[len - 1];
        --len;
        let parent = 0;
        while (parent < this.size()) {
            const leftChild = parent * 2 + 1;
            const rightChild = parent * 2 + 2;
            if (leftChild >= this.size()) break;
            let minChild = leftChild;
            if (rightChild < this.size() && cmp(priorityQueue[leftChild], priorityQueue[rightChild]) > 0) minChild = rightChild;
            if (cmp(priorityQueue[minChild], last) >= 0) break;
            priorityQueue[parent] = priorityQueue[minChild];
            parent = minChild;
        }
        priorityQueue[parent] = last;
    };

    this.top = function () {
        return priorityQueue[0];
    };

    Object.freeze(this);
}

Object.freeze(PriorityQueue);

export default (PriorityQueue as any as { new<T>(arr?: T[], cmp?: (x: T, y: T) => number): PriorityQueue<T> });
