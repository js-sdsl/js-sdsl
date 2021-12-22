import { SequentialContainerType } from "../Base/Base";

class LinkNode<T> {
    val: any = null;
    pre: LinkNode<T> | null = null;
    next: LinkNode<T> | null = null;

    constructor(element: T) {
        this.val = element;
    }
}

export type LinkListType<T> = {
    push_front: (element: T) => void;
    pop_front: () => void;
    merge: (other: LinkListType<T>) => void;
} & SequentialContainerType<T>;

function LinkList<T>(this: LinkListType<T>, arr: T[] = []) {
    let len = arr.length;
    let head: LinkNode<T> | null = null;
    let tail: LinkNode<T> | null = null;

    if (len > 0) {
        head = new LinkNode<T>(arr[0]);
        let curNode: LinkNode<T> = head;
        for (let i = 1; i < len; ++i) {
            curNode.next = new LinkNode<T>(arr[i]);
            curNode.next.pre = curNode;
            curNode = curNode.next;
        }
        tail = curNode;
    }

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        head = tail = null;
        len = 0;
    };

    this.front = function () {
        return head?.val;
    };

    this.back = function () {
        return tail?.val;
    };

    this.forEach = function (callback: (element: T, index: number) => void) {
        let curNode = head;
        let index = 0;
        while (curNode !== null) {
            callback(curNode.val, index++);
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
        return curNode?.val;
    };

    this.eraseElementByPos = function (pos: number) {
        if (pos < 0 || pos >= len) throw new Error("erase pos must more then 0 and less then the list length");
        if (pos === 0) this.pop_front();
        else if (pos === len - 1) this.pop_back();
        else {
            let curNode = head;
            while (pos--) {
                if (!curNode?.next) break;
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
        while (head && head.val === value) this.pop_front();
        while (tail && tail.val === value) this.pop_back();
        if (!head) return;
        let curNode = head.next;
        while (curNode) {
            if (curNode.val === value) {
                const pre = curNode.pre;
                const next = curNode.next;
                if (next) next.pre = pre;
                if (pre) pre.next = next;
                if (len > 0) --len;
            }
            curNode = curNode.next;
        }
    };

    this.push_back = function (element: T) {
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

    this.pop_back = function () {
        if (len > 0) --len;
        if (!tail) return;
        if (head === tail) {
            head = tail = null;
        } else {
            tail = tail.pre;
            if (tail) tail.next = null;
        }
    };

    this.setElementByPos = function (pos: number, element: T) {
        if (pos < 0 || pos >= len) throw new Error("pos must more then 0 and less then the list length");
        let curNode = head;
        while (pos--) {
            if (!curNode) break;
            curNode = curNode.next;
        }
        if (curNode) curNode.val = element;
    };

    /**
     * @param {number} pos insert element before pos, should in [0, list.size]
     * @param {any} element the element you want to insert
     * @param {number} [num = 1] the nums you want to insert
     */
    this.insert = function (pos: number, element: T, num = 1) {
        if (pos < 0 || pos > len) throw new Error("insert pos must more then 0 and less then or equal to the list length");
        if (num < 0) throw new Error("insert size must more then 0");
        if (pos === 0) {
            while (num--) this.push_front(element);
        } else if (pos === len) {
            while (num--) this.push_back(element);
        } else {
            let curNode = head;
            for (let i = 1; i < pos; ++i) {
                if (!curNode?.next) break;
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

    this.reverse = function () {
        let pHead = head;
        let pTail = tail;
        let cnt = 0;
        while (pHead && pTail && cnt * 2 < len) {
            const tmp = pHead.val;
            pHead.val = pTail.val;
            pTail.val = tmp;
            pHead = pHead.next;
            pTail = pTail.pre;
            ++cnt;
        }
    };

    this.unique = function () {
        let curNode = head;
        while (curNode) {
            let tmpNode = curNode;
            while (tmpNode && tmpNode.next && tmpNode.val === tmpNode.next.val) {
                tmpNode = tmpNode.next;
                if (len > 0) --len;
            }
            curNode.next = tmpNode.next;
            curNode = curNode.next;
        }
    };

    this.sort = function (cmp?: (x: T, y: T) => number) {
        const arr: T[] = [];
        this.forEach((element) => {
            arr.push(element);
        });
        arr.sort(cmp);
        let curNode: LinkNode<T> | null = head;
        arr.forEach((element) => {
            if (curNode) {
                curNode.val = element;
                curNode = curNode.next;
            }
        });
    };

    this.push_front = function (element: T) {
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

    this.pop_front = function () {
        if (len > 0) --len;
        if (!head) return;
        if (head === tail) {
            head = tail = null;
        } else {
            head = head.next;
            if (head) head.pre = null;
        }
    };

    /**
     * merge two sorted lists
     * @param list other list
     */
    this.merge = function (list: LinkListType<T>) {
        let curNode: LinkNode<T> | null = head;
        list.forEach((element: T) => {
            while (curNode && curNode.val <= element) {
                curNode = curNode.next;
            }
            if (!curNode) {
                this.push_back(element);
                curNode = tail;
            } else if (curNode === head) {
                this.push_front(element);
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

    Object.freeze(this);
}

Object.freeze(LinkList);

export default (LinkList as any as { new<T>(arr?: T[]): LinkListType<T>; });
