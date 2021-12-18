var LinkNode = /** @class */ (function () {
    function LinkNode(element) {
        this.val = null;
        this.pre = null;
        this.next = null;
        this.val = element;
    }
    return LinkNode;
}());
function LinkList(arr) {
    if (arr === void 0) { arr = []; }
    var len = arr.length;
    var head = null;
    var tail = null;
    if (len) {
        head = new LinkNode(arr[0]);
        var curNode = head;
        for (var i = 1; i < len; ++i) {
            curNode.next = new LinkNode(arr[i]);
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
    this.forEach = function (callback) {
        if (typeof callback !== 'function')
            throw new Error("callback must be a function");
        var curNode = head;
        var index = 0;
        while (curNode != null) {
            callback(curNode.val, index++);
            curNode = curNode.next;
        }
    };
    this.front = function () {
        return head === null || head === void 0 ? void 0 : head.val;
    };
    this.back = function () {
        return tail === null || tail === void 0 ? void 0 : tail.val;
    };
    this.push_front = function (element) {
        ++len;
        var newHead = new LinkNode(element);
        if (!head) {
            head = tail = newHead;
        }
        else {
            newHead.next = head;
            head.pre = newHead;
            head = newHead;
        }
    };
    this.push_back = function (element) {
        ++len;
        var newTail = new LinkNode(element);
        if (!tail) {
            head = tail = newTail;
        }
        else {
            tail.next = newTail;
            newTail.pre = tail;
            tail = newTail;
        }
    };
    this.pop_front = function () {
        if (len)
            --len;
        if (!head)
            return;
        if (head === tail) {
            head = tail = null;
        }
        else {
            head = head.next;
            if (head)
                head.pre = null;
        }
    };
    this.pop_back = function () {
        if (len)
            --len;
        if (!tail)
            return;
        if (head === tail) {
            head = tail = null;
        }
        else {
            tail = tail.pre;
            if (tail)
                tail.next = null;
        }
    };
    /**
     * @param {number} pos insert element before pos, should in [0, list.size]
     * @param {any} element the element you want to insert
     * @param {number} [num = 1] the nums you want to insert
     */
    this.insert = function (pos, element, num) {
        if (num === void 0) { num = 1; }
        if (pos < 0 || pos > len)
            throw new Error("insert pos must more then 0 and less then or equal to the list length");
        if (num < 0)
            throw new Error("insert size must more then 0");
        if (pos === 0) {
            while (num--)
                this.push_front(element);
        }
        else if (pos === len + 1) {
            while (num--)
                this.push_back(element);
        }
        else {
            var curNode = head;
            for (var i = 1; i < pos; ++i) {
                if (!(curNode === null || curNode === void 0 ? void 0 : curNode.next))
                    break;
                curNode = curNode === null || curNode === void 0 ? void 0 : curNode.next;
            }
            if (!curNode || !(curNode === null || curNode === void 0 ? void 0 : curNode.pre)) {
                throw new Error("unknown error");
            }
            var next = curNode.next;
            len += num;
            while (num--) {
                curNode.next = new LinkNode(element);
                curNode.next.pre = curNode;
                curNode = curNode.next;
            }
            curNode.next = next;
            if (next)
                next.pre = curNode;
        }
    };
    this.eraseElementByPos = function (pos) {
        if (pos < 0 || pos >= len)
            throw new Error("insert pos must more then 0 and less then the list length");
        if (pos === 0)
            this.pop_front();
        else if (pos === len - 1)
            this.pop_back();
        else {
            var curNode = head;
            while (pos--) {
                if (!(curNode === null || curNode === void 0 ? void 0 : curNode.next))
                    break;
                curNode = curNode.next;
            }
            if (!curNode || !curNode.pre || !curNode.next) {
                throw new Error("unknown error");
            }
            var pre = curNode.pre;
            var next = curNode.next;
            next.pre = pre;
            pre.next = next;
        }
        if (len)
            --len;
    };
    this.eraseElementByValue = function (value) {
        while (head && head.val === value)
            this.pop_front();
        while (tail && tail.val === value)
            this.pop_back();
        if (!head)
            return;
        var curNode = head.next;
        while (curNode) {
            if (curNode.val === value) {
                var pre = curNode.pre;
                var next = curNode.next;
                if (next)
                    next.pre = pre;
                if (pre)
                    pre.next = next;
                if (len)
                    --len;
            }
            curNode = curNode.next;
        }
    };
    /**
     * merge two sorted lists
     * @param list other list
     */
    this.merge = function (list) {
        var _this = this;
        var curNode = head;
        list.forEach(function (element) {
            while (curNode && curNode.val <= element) {
                curNode = curNode.next;
            }
            if (!curNode) {
                _this.push_back(element);
                curNode = tail;
            }
            else if (curNode === head) {
                _this.push_front(element);
                curNode = head;
            }
            else {
                ++len;
                var pre = curNode.pre;
                if (pre) {
                    pre.next = new LinkNode(element);
                    pre.next.pre = pre;
                    pre.next.next = curNode;
                    if (curNode)
                        curNode.pre = pre.next;
                }
            }
        });
    };
    this.reverse = function () {
        var pHead = head;
        var pTail = tail;
        var cnt = 0;
        while (pHead && pTail && cnt * 2 < len) {
            var tmp = pHead.val;
            pHead.val = pTail.val;
            pTail.val = tmp;
            pHead = pHead.next;
            pTail = pTail.pre;
            ++cnt;
        }
    };
    this.unique = function () {
        var curNode = head;
        while (curNode) {
            var tmpNode = curNode;
            while (tmpNode && tmpNode.next && tmpNode.val === tmpNode.next.val) {
                tmpNode = tmpNode.next;
                --len;
            }
            curNode.next = tmpNode.next;
            curNode = curNode.next;
        }
    };
    this.sort = function (cmp) {
        var arr = [];
        this.forEach(function (element) {
            arr.push(element);
        });
        arr.sort(cmp);
        var curNode = head;
        arr.forEach(function (element) {
            if (curNode) {
                curNode.val = element;
                curNode = curNode.next;
            }
        });
    };
}
Object.freeze(LinkList);
export default LinkList;