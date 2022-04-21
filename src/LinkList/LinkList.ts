import { ContainerIterator, SequentialContainerType } from "../Base/Base";

export class LinkNode<T> {
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

const LinkListIterator = function <T>(
    this: ContainerIterator<T>,
    _node: LinkNode<T>,
    head: LinkNode<T>,
    tail: LinkNode<T>,
    iteratorType: 'normal' | 'reverse' = 'normal',
) {
    Object.defineProperties(this, {
        iteratorType: {
            value: iteratorType
        },
        node: {
            value: _node
        },
        pointer: {
            get() {
                return _node.value;
            },
            set(newValue: T) {
                if (_node.value === undefined) {
                    throw new Error("LinkList iterator access denied!");
                }
                if (newValue === null || newValue === undefined) {
                    throw new Error("you can't push undefined or null here");
                }
                _node.value = newValue;
            },
            enumerable: true
        }
    });

    this.equals = function (obj: ContainerIterator<T>) {
        if (this.iteratorType !== obj.iteratorType) {
            throw new Error("iterator type error!");
        }
        // @ts-ignore
        return this.node === obj.node;
    };

    this.pre = function () {
        if (this.iteratorType === 'reverse') {
            if (_node === tail) throw new Error("LinkList iterator access denied!");
            return new LinkListIterator(_node.next || _node, head, tail, this.iteratorType);
        }
        if (_node === head) throw new Error("LinkList iterator access denied!");
        return new LinkListIterator(_node.pre || _node, head, tail);
    };

    this.next = function () {
        if (this.iteratorType === 'reverse') {
            if (_node.value === undefined) throw new Error("LinkList iterator access denied!");
            return new LinkListIterator(_node.pre || _node, head, tail, this.iteratorType);
        }
        if (_node.value === undefined) throw new Error("LinkList iterator access denied!");
        return new LinkListIterator(_node.next || _node, head, tail);
    };
} as unknown as {
    new <T>(
        _node: LinkNode<T>,
        head: LinkNode<T>,
        tail: LinkNode<T>,
        iteratorType?: 'normal' | 'reverse'
    ): ContainerIterator<T>
};

function LinkList<T>(this: LinkListType<T>, container: { forEach: (callback: (element: T) => void) => void } = []) {
    let len = 0;
    let head: LinkNode<T> | undefined = undefined;
    let tail: LinkNode<T> | undefined = undefined;
    const header = new LinkNode<T>();

    this.size = function () {
        return len;
    };

    this.empty = function () {
        return len === 0;
    };

    this.clear = function () {
        len = 0;
        head = tail = undefined;
        header.pre = header.next = undefined;
    };

    this.begin = function () {
        return new LinkListIterator(head || header, head || header, tail || header);
    };

    this.end = function () {
        return new LinkListIterator(header, head || header, tail || header);
    };

    this.rBegin = function () {
        return new LinkListIterator(tail || header, head || header, tail || header);
    }

    this.rEnd = function () {
        return new LinkListIterator(header, head || header, tail || header);
    }

    this.front = function () {
        return head?.value;
    };

    this.back = function () {
        return tail?.value;
    };

    this.forEach = function (callback: (element: T, index: number) => void) {
        let curNode = head;
        let index = 0;
        while (curNode && curNode !== header) {
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
        while (curNode && curNode !== header) {
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
            header.next = head;
            head.pre = header;
        } else {
            tail.next = newTail;
            newTail.pre = tail;
            tail = newTail;
        }
        tail.next = header;
        header.pre = tail;
    };

    this.popBack = function () {
        if (!tail) return;
        if (len > 0) --len;
        if (head === tail) {
            head = tail = undefined;
            header.next = undefined;
        } else {
            tail = tail.pre;
            if (tail) tail.next = undefined;
        }
        header.pre = tail;
        if (tail) tail.next = header;
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
        while (curNode && curNode !== header) {
            if (curNode.value === element) return new LinkListIterator(curNode, head || header, tail || header);
            curNode = curNode.next;
        }
        return this.end();
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
        while (curNode && curNode !== header) {
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
            tail.next = header;
            header.pre = tail;
        } else {
            newHead.next = head;
            head.pre = newHead;
            head = newHead;
        }
        header.next = head;
        head.pre = header;
    };

    this.popFront = function () {
        if (!head) return;
        if (len > 0) --len;
        if (head === tail) {
            head = tail = undefined;
            header.pre = tail;
        } else {
            head = head.next;
            if (head) head.pre = header;
        }
        header.next = head;
    };

    this.merge = function (list: LinkListType<T>) {
        let curNode: LinkNode<T> | undefined = head;
        list.forEach((element: T) => {
            while (curNode && curNode !== header && curNode.value !== undefined && curNode.value <= element) {
                curNode = curNode.next;
            }
            if (curNode === header) {
                this.pushBack(element);
                curNode = tail;
            } else if (curNode === head) {
                this.pushFront(element);
                curNode = head;
            } else {
                if (!curNode) throw new Error("unknown error");
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

    if (typeof Symbol.iterator === 'symbol') {
        this[Symbol.iterator] = function () {
            return (function* () {
                let curNode = head;
                while (curNode && curNode !== header) {
                    if (!curNode.value) throw new Error("unknown error");
                    yield curNode.value;
                    curNode = curNode.next;
                }
            })();
        };
    }

    container.forEach(element => this.pushBack(element));
}

export default (LinkList as unknown as { new <T>(container?: { forEach: (callback: (element: T) => void) => void }): LinkListType<T>; });
