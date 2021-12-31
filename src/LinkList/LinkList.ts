import { SequentialContainerType } from "../Base/Base";

class LinkNode<T> {
    value: T | undefined = undefined;
    pre: LinkNode<T> | undefined = undefined;
    next: LinkNode<T> | undefined = undefined;

    constructor(element?: T) {
        this.value = element;
    }
}

export type LinkListType<T> = {
    pushFront: (element: T) => void;
    popFront: () => void;
    merge: (other: LinkListType<T>) => void;
} & SequentialContainerType<T>;

function LinkList<T>(this: LinkListType<T>, container: { forEach: (callback: (element: T) => void) => void } = []) {
    let len = 0;
    let head: LinkNode<T> | undefined = undefined;
    let tail: LinkNode<T> | undefined = undefined;

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        head = tail = undefined;
        len = 0;
    };

    this.front = function () {
        return head?.value;
    };

    this.back = function () {
        return tail?.value;
    };

    this.forEach = function (callback: (element: T, index: number) => void) {
        let curNode = head;
        let index = 0;
        while (curNode) {
            if (curNode.value === undefined) throw new Error("unknown error");
            callback(curNode.value, index++);
            curNode = curNode.next;
        }
    };

    this.getElementByPos = function (pos: number) {
        if (pos < 0 || pos >= len) throw new Error("pos must more then 0 and less then the list length");
        let curNode = head;
        while (pos--) {
            if (!curNode) break;
            curNode = curNode.next;
        }
        if (!curNode || curNode.value === undefined) throw new Error("unknown error");
        return curNode.value;
    };

    this.eraseElementByPos = function (pos: number) {
        if (pos < 0 || pos >= len) throw new Error("erase pos must more then 0 and less then the list length");
        if (pos === 0) this.popFront();
        else if (pos === len - 1) this.popBack();
        else {
            let curNode = head;
            while (pos--) {
                if (!curNode?.next) throw new Error("unknown error");
                curNode = curNode.next;
            }
            if (!curNode || !curNode.pre || !curNode.next) {
                throw new Error("unknown error");
            }
            const pre = curNode.pre;
            const next = curNode.next;
            next.pre = pre;
            pre.next = next;
            if (len > 0) --len;
        }
    };

    this.eraseElementByValue = function (value: T) {
        while (head && head.value === value) this.popFront();
        while (tail && tail.value === value) this.popBack();
        if (!head) return;
        let curNode: LinkNode<T> | undefined = head;
        while (curNode) {
            if (curNode.value === value) {
                const pre = curNode.pre;
                const next = curNode.next;
                if (next) next.pre = pre;
                if (pre) pre.next = next;
                if (len > 0) --len;
            }
            curNode = curNode.next;
        }
    };

    this.pushBack = function (element: T) {
        if (element === null || element === undefined) {
            throw new Error("you can't push null or undefined here");
        }
        ++len;
        const newTail = new LinkNode(element);
        if (!tail) {
            head = tail = newTail;
        } else {
            tail.next = newTail;
            newTail.pre = tail;
            tail = newTail;
        }
    };

    this.popBack = function () {
        if (!tail) return;
        if (len > 0) --len;
        if (!tail) return;
        if (head === tail) {
            head = tail = undefined;
        } else {
            tail = tail.pre;
            if (tail) tail.next = undefined;
        }
    };

    this.setElementByPos = function (pos: number, element: T) {
        if (element === null || element === undefined) {
            throw new Error("you can't set null or undefined here");
        }
        if (pos < 0 || pos >= len) throw new Error("pos must more then 0 and less then the list length");
        let curNode = head;
        while (pos--) {
            if (!curNode) throw new Error("unknown error");
            curNode = curNode.next;
        }
        if (curNode) curNode.value = element;
    };

    /**
     * @param {number} pos insert element before pos, should in [0, list.size]
     * @param {any} element the element you want to insert
     * @param {number} [num = 1] the nums you want to insert
     */
    this.insert = function (pos: number, element: T, num = 1) {
        if (element === null || element === undefined) {
            throw new Error("you can't insert null or undefined here");
        }
        if (pos < 0 || pos > len) throw new Error("insert pos must more then 0 and less then or equal to the list length");
        if (num < 0) throw new Error("insert size must more than 0");
        if (pos === 0) {
            while (num--) this.pushFront(element);
        } else if (pos === len) {
            while (num--) this.pushBack(element);
        } else {
            let curNode = head;
            for (let i = 1; i < pos; ++i) {
                if (!curNode?.next) throw new Error("unknown error");
                curNode = curNode?.next;
            }
            if (!curNode) {
                throw new Error("unknown error");
            }
            const next = curNode.next;
            len += num;
            while (num--) {
                curNode.next = new LinkNode(element);
                curNode.next.pre = curNode;
                curNode = curNode.next;
            }
            curNode.next = next;
            if (next) next.pre = curNode;
        }
    };

    this.find = function (element: T) {
        let curNode = head;
        while (curNode) {
            if (curNode.value === element) return true;
            curNode = curNode.next;
        }
        return false;
    };

    this.reverse = function () {
        let pHead = head;
        let pTail = tail;
        let cnt = 0;
        while (pHead && pTail && cnt * 2 < len) {
            const tmp = pHead.value;
            pHead.value = pTail.value;
            pTail.value = tmp;
            pHead = pHead.next;
            pTail = pTail.pre;
            ++cnt;
        }
    };

    this.unique = function () {
        let curNode = head;
        while (curNode) {
            let tmpNode = curNode;
            while (tmpNode && tmpNode.next && tmpNode.value === tmpNode.next.value) {
                tmpNode = tmpNode.next;
                if (len > 0) --len;
            }
            curNode.next = tmpNode.next;
            if (curNode.next) curNode.next.pre = curNode;
            curNode = curNode.next;
        }
    };

    this.sort = function (cmp?: (x: T, y: T) => number) {
        const arr: T[] = [];
        this.forEach((element) => {
            arr.push(element);
        });
        arr.sort(cmp);
        let curNode: LinkNode<T> | undefined = head;
        arr.forEach((element) => {
            if (curNode) {
                curNode.value = element;
                curNode = curNode.next;
            }
        });
    };

    this.pushFront = function (element: T) {
        if (element === null || element === undefined) {
            throw new Error("you can't push null or undefined here");
        }
        ++len;
        const newHead = new LinkNode(element);
        if (!head) {
            head = tail = newHead;
        } else {
            newHead.next = head;
            head.pre = newHead;
            head = newHead;
        }
    };

    this.popFront = function () {
        if (!head) return;
        if (len > 0) --len;
        if (!head) return;
        if (head === tail) {
            head = tail = undefined;
        } else {
            head = head.next;
            if (head) head.pre = undefined;
        }
    };

    /**
     * merge two sorted lists
     * @param list other list
     */
    this.merge = function (list: LinkListType<T>) {
        let curNode: LinkNode<T> | undefined = head;
        list.forEach((element: T) => {
            while (curNode && curNode.value !== undefined && curNode.value <= element) {
                curNode = curNode.next;
            }
            if (curNode === undefined) {
                this.pushBack(element);
                curNode = tail;
            } else if (curNode === head) {
                this.pushFront(element);
                curNode = head;
            } else {
                ++len;
                const pre = curNode.pre;
                if (pre) {
                    pre.next = new LinkNode(element);
                    pre.next.pre = pre;
                    pre.next.next = curNode;
                    if (curNode) curNode.pre = pre.next;
                }
            }
        });
    };

    this[Symbol.iterator] = function () {
        return (function* () {
            let curNode = head;
            while (curNode !== undefined) {
                if (!curNode.value) throw new Error("unknown error");
                yield curNode.value;
                curNode = curNode.next;
            }
        })();
    };

    container.forEach(element => this.pushBack(element));

    Object.freeze(this);
}

Object.freeze(LinkList);

export default (LinkList as unknown as { new<T>(container?: { forEach: (callback: (element: T) => void) => void }): LinkListType<T>; });
