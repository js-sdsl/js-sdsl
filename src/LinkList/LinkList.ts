import { ContainerIterator, initContainer, SequentialContainer } from "../Base/Base";

export class LinkNode<T> {
    value: T | undefined = undefined;
    pre: LinkNode<T> | undefined = undefined;
    next: LinkNode<T> | undefined = undefined;

    constructor(element?: T) {
        this.value = element;
    }
}

class LinkListIterator<T> implements ContainerIterator<T> {
    private node: LinkNode<T>;

    pointer: T;
    readonly iteratorType: "normal" | "reverse";

    constructor(
        node: LinkNode<T>,
        iteratorType: 'normal' | 'reverse' = 'normal'
    ) {
        this.node = node;
        this.iteratorType = iteratorType;
        this.pointer = undefined as unknown as T;
        Object.defineProperty(this, 'pointer', {
            get() {
                return this.node.value;
            },
            set(newValue: T) {
                if (this.node.value === undefined) {
                    throw new Error("LinkList iterator access denied!");
                }
                if (newValue === null || newValue === undefined) {
                    throw new Error("you can't push undefined or null here");
                }
                this.node.value = newValue;
            }
        });
    }

    pre() {
        if (this.iteratorType === 'reverse') {
            if (this.node.next?.value) throw new Error("LinkList iterator access denied!");
            this.node = this.node.next ?? this.node;
        } else {
            if (this.node.pre?.value) throw new Error("LinkList iterator access denied!");
            this.node = this.node.pre ?? this.node;
        }
        return this;
    }
    next() {
        if (this.iteratorType === 'reverse') {
            if (this.node.value === undefined) throw new Error("LinkList iterator access denied!");
            this.node = this.node.pre ?? this.node;
        } else {
            if (this.node.value === undefined) throw new Error("LinkList iterator access denied!");
            this.node = this.node.next ?? this.node;
        }
        return this;
    }
    equals(obj: ContainerIterator<T>) {
        if (obj.constructor.name !== this.constructor.name) {
            throw new Error(`obj's constructor is not ${this.constructor.name}!`);
        }
        if (this.iteratorType !== obj.iteratorType) {
            throw new Error("iterator type error!");
        }
        // @ts-ignore
        return this.node === obj.node;
    }
}

class LinkList<T> implements SequentialContainer<T> {
    private length = 0;
    private header: LinkNode<T> = new LinkNode<T>();
    private head: LinkNode<T> | undefined = undefined;
    private tail: LinkNode<T> | undefined = undefined;

    constructor(container: initContainer<T> = []) {
        container.forEach(element => this.pushBack(element));
    }
    size() { return this.length; }
    empty() { return this.length === 0; }
    clear() {
        this.length = 0;
        this.head = this.tail = undefined;
        this.header.pre = this.header.next = undefined;
    }
    begin() {
        return new LinkListIterator(this.head || this.header);
    }
    end() {
        return new LinkListIterator(this.header);
    }
    rBegin() {
        return new LinkListIterator(this.tail || this.header, 'reverse');
    }
    rEnd() {
        return new LinkListIterator(this.header, 'reverse');
    }
    front() {
        return this.head?.value;
    }
    back() {
        return this.tail?.value;
    }
    forEach(callback: (element: T, index: number) => void) {
        let curNode = this.head;
        let index = 0;
        while (curNode && curNode !== this.header) {
            if (curNode.value === undefined) throw new Error("unknown error");
            callback(curNode.value, index++);
            curNode = curNode.next;
        }
    }
    getElementByPos(pos: number) {
        if (pos < 0 || pos >= this.length) throw new Error("pos must more then 0 and less then the list' length");
        let curNode = this.head;
        while (pos--) {
            if (!curNode) break;
            curNode = curNode.next;
        }
        if (!curNode || curNode.value === undefined) throw new Error("unknown error");
        return curNode.value;
    }
    eraseElementByPos(pos: number) {
        if (pos < 0 || pos >= this.length) throw new Error("erase pos must more then 0 and less then the list's length");
        if (pos === 0) this.popFront();
        else if (pos === this.length - 1) this.popBack();
        else {
            let curNode = this.head;
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
            if (this.length > 0) --this.length;
        }
    }
    eraseElementByValue(value: T) {
        while (this.head && this.head.value === value) this.popFront();
        while (this.tail && this.tail.value === value) this.popBack();
        if (!this.head) return;
        let curNode: LinkNode<T> | undefined = this.head;
        while (curNode && curNode !== this.header) {
            if (curNode.value === value) {
                const pre = curNode.pre;
                const next = curNode.next;
                if (next) next.pre = pre;
                if (pre) pre.next = next;
                if (this.length > 0) --this.length;
            }
            curNode = curNode.next;
        }
    }
    eraseElementByIterator(iter: ContainerIterator<T>) {
        const nextIter = iter.next();
        // @ts-ignore
        this.eraseElementByPos(iter.node);
        iter = nextIter;
        return iter;
    }
    pushBack(element: T) {
        if (element === null || element === undefined) {
            throw new Error("you can't push null or undefined here");
        }
        ++this.length;
        const newTail = new LinkNode(element);
        if (!this.tail) {
            this.head = this.tail = newTail;
            this.header.next = this.head;
            this.head.pre = this.header;
        } else {
            this.tail.next = newTail;
            newTail.pre = this.tail;
            this.tail = newTail;
        }
        this.tail.next = this.header;
        this.header.pre = this.tail;
    }
    popBack() {
        if (!this.tail) return;
        if (this.length > 0) --this.length;
        if (this.head === this.tail) {
            this.head = this.tail = undefined;
            this.header.next = undefined;
        } else {
            this.tail = this.tail.pre;
            if (this.tail) this.tail.next = undefined;
        }
        this.header.pre = this.tail;
        if (this.tail) this.tail.next = this.header;
    }
    setElementByPos(pos: number, element: T) {
        if (element === null || element === undefined) {
            throw new Error("you can't set null or undefined here");
        }
        if (pos < 0 || pos >= this.length) throw new Error("pos must more then 0 and less then the list's length");
        let curNode = this.head;
        while (pos--) {
            if (!curNode) throw new Error("unknown error");
            curNode = curNode.next;
        }
        if (curNode) curNode.value = element;
    }
    insert(pos: number, element: T, num = 1) {
        if (element === null || element === undefined) {
            throw new Error("you can't insert null or undefined here");
        }
        if (pos < 0 || pos > this.length) throw new Error("insert pos must more then 0 and less then or equal to the list's length");
        if (num < 0) throw new Error("insert size must more than 0");
        if (pos === 0) {
            while (num--) this.pushFront(element);
        } else if (pos === this.length) {
            while (num--) this.pushBack(element);
        } else {
            let curNode = this.head;
            for (let i = 1; i < pos; ++i) {
                if (!curNode?.next) throw new Error("unknown error");
                curNode = curNode?.next;
            }
            if (!curNode) {
                throw new Error("unknown error");
            }
            const next = curNode.next;
            this.length += num;
            while (num--) {
                curNode.next = new LinkNode(element);
                curNode.next.pre = curNode;
                curNode = curNode.next;
            }
            curNode.next = next;
            if (next) next.pre = curNode;
        }
    }
    find(element: T) {
        let curNode = this.head;
        while (curNode && curNode !== this.header) {
            if (curNode.value === element) return new LinkListIterator(curNode);
            curNode = curNode.next;
        }
        return this.end();
    }
    reverse() {
        let pHead = this.head;
        let pTail = this.tail;
        let cnt = 0;
        while (pHead && pTail && cnt * 2 < this.length) {
            const tmp = pHead.value;
            pHead.value = pTail.value;
            pTail.value = tmp;
            pHead = pHead.next;
            pTail = pTail.pre;
            ++cnt;
        }
    }
    unique() {
        let curNode = this.head;
        while (curNode && curNode !== this.header) {
            let tmpNode = curNode;
            while (tmpNode && tmpNode.next && tmpNode.value === tmpNode.next.value) {
                tmpNode = tmpNode.next;
                if (this.length > 0) --this.length;
            }
            curNode.next = tmpNode.next;
            if (curNode.next) curNode.next.pre = curNode;
            curNode = curNode.next;
        }
    }
    sort(cmp?: (x: T, y: T) => number) {
        const arr: T[] = [];
        this.forEach((element) => {
            arr.push(element);
        });
        arr.sort(cmp);
        let curNode: LinkNode<T> | undefined = this.head;
        arr.forEach((element) => {
            if (curNode) {
                curNode.value = element;
                curNode = curNode.next;
            }
        });
    }
    /**
     * Inserts an element to the beginning.
     */
    pushFront(element: T) {
        if (element === null || element === undefined) {
            throw new Error("you can't push null or undefined here");
        }
        ++this.length;
        const newHead = new LinkNode(element);
        if (!this.head) {
            this.head = this.tail = newHead;
            this.tail.next = this.header;
            this.header.pre = this.tail;
        } else {
            newHead.next = this.head;
            this.head.pre = newHead;
            this.head = newHead;
        }
        this.header.next = this.head;
        this.head.pre = this.header;
    }
    /**
     * Removes the last element.
     */
    popFront() {
        if (!this.head) return;
        if (this.length > 0) --this.length;
        if (this.head === this.tail) {
            this.head = this.tail = undefined;
            this.header.pre = this.tail;
        } else {
            this.head = this.head.next;
            if (this.head) this.head.pre = this.header;
        }
        this.header.next = this.head;
    }
    /**
     * Merges two sorted lists.
     */
    merge(list: LinkList<T>) {
        let curNode: LinkNode<T> | undefined = this.head;
        list.forEach((element: T) => {
            while (curNode && curNode !== this.header && curNode.value !== undefined && curNode.value <= element) {
                curNode = curNode.next;
            }
            if (curNode === this.header) {
                this.pushBack(element);
                curNode = this.tail;
            } else if (curNode === this.head) {
                this.pushFront(element);
                curNode = this.head;
            } else {
                if (!curNode) throw new Error("unknown error");
                ++this.length;
                const pre = curNode.pre;
                if (pre) {
                    pre.next = new LinkNode(element);
                    pre.next.pre = pre;
                    pre.next.next = curNode;
                    if (curNode) curNode.pre = pre.next;
                }
            }
        });
    }
    [Symbol.iterator]() {
        return (function* (this: LinkList<T>) {
            let curNode = this.head;
            while (curNode && curNode !== this.header) {
                if (!curNode.value) throw new Error("unknown error");
                yield curNode.value;
                curNode = curNode.next;
            }
        }).bind(this)();
    }
}

export default LinkList;
