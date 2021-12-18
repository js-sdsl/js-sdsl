(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.sdsl = {}));
})(this, (function (exports) { 'use strict';

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

    Deque.sigma = 3; // growth factor
    Deque.bucketSize = 5000;
    function Deque(arr) {
        if (arr === void 0) { arr = []; }
        var map = [];
        var first = 0;
        var curFirst = 0;
        var last = 0;
        var curLast = 0;
        var bucketNum = 0;
        var len = arr.length;
        var needSize = len * Deque.sigma;
        bucketNum = Math.ceil(needSize / Deque.bucketSize);
        bucketNum = Math.max(bucketNum, 3);
        for (var i = 0; i < bucketNum; ++i) {
            map.push(new Array(Deque.bucketSize));
        }
        var needBucketNum = Math.ceil(len / Deque.bucketSize);
        first = Math.floor(bucketNum / 2) - Math.floor(needBucketNum / 2);
        last = first;
        if (len === 0)
            return;
        var cnt = 0;
        for (var i = 0; i < needBucketNum; ++i) {
            for (var j = 0; j < Deque.bucketSize; ++j) {
                map[first + i][j] = arr[cnt++];
                if (cnt >= len) {
                    last = first + i;
                    curLast = j;
                    break;
                }
            }
            if (cnt >= len)
                break;
        }
        this.size = function () {
            return len;
        };
        this.empty = function () {
            return len === 0;
        };
        this.clear = function () {
            first = last = curFirst = curLast = bucketNum = len = 0;
        };
        var reAllocate = function (originalSize) {
            var newMap = [];
            var needSize = originalSize * Deque.sigma;
            var newBucketNum = Math.max(Math.ceil(needSize / Deque.bucketSize), 2);
            for (var i = 0; i < newBucketNum; ++i) {
                newMap.push(new Array(Deque.bucketSize));
            }
            var needBucketNum = Math.ceil(originalSize / Deque.bucketSize);
            var newFirst = Math.floor(newBucketNum / 2) - Math.floor(needBucketNum / 2);
            var newLast = newFirst, newCurLast = 0;
            if (this.size()) {
                for (var i = 0; i < needBucketNum; ++i) {
                    for (var j = 0; j < Deque.bucketSize; ++j) {
                        newMap[newFirst + i][j] = this.front();
                        this.pop_front();
                        if (this.empty()) {
                            newLast = newFirst + i;
                            newCurLast = j;
                            break;
                        }
                    }
                    if (this.empty())
                        break;
                }
            }
            map = newMap;
            first = newFirst;
            curFirst = 0;
            last = newLast;
            curLast = newCurLast;
            bucketNum = newBucketNum;
            len = originalSize;
        };
        this.forEach = function (callback) {
            if (this.empty())
                return;
            var index = 0;
            if (first === last) {
                for (var i = curFirst; i <= curLast; ++i) {
                    callback(map[first][i], index++);
                }
                return;
            }
            for (var i = curFirst; i < Deque.bucketSize; ++i) {
                callback(map[first][i], index++);
            }
            for (var i = first + 1; i < last; ++i) {
                for (var j = 0; j < Deque.bucketSize; ++j) {
                    callback(map[i][j], index++);
                }
            }
            for (var i = 0; i <= curLast; ++i) {
                callback(map[last][i], index++);
            }
        };
        this.front = function () {
            return map[first][curFirst];
        };
        this.back = function () {
            return map[last][curLast];
        };
        this.push_front = function (element) {
            if (!this.empty()) {
                if (first === 0 && curFirst === 0) {
                    reAllocate.call(this, this.size());
                }
                if (curFirst > 0) {
                    --curFirst;
                }
                else if (first > 0) {
                    --first;
                    curFirst = Deque.bucketSize - 1;
                }
            }
            ++len;
            map[first][curFirst] = element;
        };
        this.push_back = function (element) {
            if (!this.empty()) {
                if (last === bucketNum - 1 && curLast === Deque.bucketSize - 1) {
                    reAllocate.call(this, this.size());
                }
                if (curLast < Deque.bucketSize - 1) {
                    ++curLast;
                }
                else if (last < bucketNum - 1) {
                    ++last;
                    curLast = 0;
                }
            }
            ++len;
            map[last][curLast] = element;
        };
        this.pop_front = function () {
            if (this.empty())
                return;
            if (this.size() !== 1) {
                if (curFirst < Deque.bucketSize - 1) {
                    ++curFirst;
                }
                else if (first < last) {
                    ++first;
                    curFirst = 0;
                }
            }
            --len;
        };
        this.pop_back = function () {
            if (this.empty())
                return;
            if (this.size() !== 1) {
                if (curLast > 0) {
                    --curLast;
                }
                else if (first < last) {
                    --last;
                    curLast = Deque.bucketSize - 1;
                }
            }
            --len;
        };
        var getElementIndex = function (pos) {
            var curFirstIndex = first * Deque.bucketSize + curFirst;
            var curNodeIndex = curFirstIndex + pos;
            var curLastIndex = last * Deque.bucketSize + curLast;
            if (curNodeIndex < curFirstIndex || curNodeIndex > curLastIndex)
                throw new Error("pos should more than 0 and less than queue's size");
            var curNodeBucketIndex = Math.floor(curNodeIndex / Deque.bucketSize);
            var curNodePointerIndex = curNodeIndex % Deque.bucketSize;
            return { curNodeBucketIndex: curNodeBucketIndex, curNodePointerIndex: curNodePointerIndex };
        };
        /**
         * @param pos index from 0 to size - 1
         */
        this.getElementByPos = function (pos) {
            var _a = getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            return map[curNodeBucketIndex][curNodePointerIndex];
        };
        this.setElementByPos = function (pos, element) {
            var _a = getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            map[curNodeBucketIndex][curNodePointerIndex] = element;
        };
        /**
         * reduces memory usage by freeing unused memory
         */
        this.shrinkToFit = function () {
            var arr = [];
            this.forEach(function (element) {
                arr.push(element);
            });
            var _len = arr.length;
            map = [];
            var bucketNum = Math.ceil(_len / Deque.bucketSize);
            for (var i = 0; i < bucketNum; ++i) {
                map.push(new Array(Deque.bucketSize));
            }
            this.clear();
            var cnt = 0;
            for (var i = 0; i < bucketNum; ++i) {
                for (var j = 0; j < Deque.bucketSize; ++j) {
                    map[i][j] = arr[cnt++];
                    if (cnt >= _len) {
                        last = i;
                        curLast = j;
                        break;
                    }
                }
            }
            len = _len;
        };
        /**
         * @param {number} pos insert element before pos, should in [0, queue.size]
         * @param {any} element the element you want to insert
         * @param {number} [num = 1] the nums you want to insert
         */
        this.insert = function (pos, element, num) {
            var _this = this;
            if (num === void 0) { num = 1; }
            if (pos === 0) {
                while (num--)
                    this.push_front(element);
            }
            else if (pos === this.size()) {
                while (num--)
                    this.push_back(element);
            }
            else {
                var _a = getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
                var arr_1 = [];
                for (var i = pos; i < len; ++i) {
                    arr_1.push(this.getElementByPos(i));
                }
                last = curNodeBucketIndex;
                curLast = curNodePointerIndex;
                len = pos + 1;
                this.pop_back();
                for (var i = 0; i < num; ++i)
                    this.push_back(element);
                arr_1.forEach(function (element) { return _this.push_back(element); });
            }
        };
        /**
         * @param pos cut element after pos
         */
        this.cut = function (pos) {
            var _a = getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            last = curNodeBucketIndex;
            curLast = curNodePointerIndex;
            len = pos + 1;
        };
        this.eraseElementByPos = function (pos) {
            var _this = this;
            if (pos === 0)
                this.pop_front();
            else if (pos === this.size())
                this.pop_back();
            else {
                var arr_2 = [];
                for (var i = pos + 1; i < len; ++i) {
                    arr_2.push(this.getElementByPos(i));
                }
                this.cut(pos);
                this.pop_back();
                arr_2.forEach(function (element) { return _this.push_back(element); });
            }
        };
        this.eraseElementByValue = function (value) {
            var arr = [];
            this.forEach(function (element) {
                if (element != value) {
                    arr.push(element);
                }
            });
            var _len = arr.length;
            for (var i = 0; i < _len; ++i)
                this.setElementByPos(i, arr[i]);
            this.cut(_len - 1);
        };
        this.reverse = function () {
            var l = 0, r = len - 1;
            while (l < r) {
                var tmp = this.getElementByPos(l);
                this.setElementByPos(l, this.getElementByPos(r));
                this.setElementByPos(r, tmp);
                ++l;
                --r;
            }
        };
        this.unique = function () {
            if (this.empty())
                return;
            var arr = [];
            var pre = this.front();
            this.forEach(function (element, index) {
                if (index === 0 || element !== pre) {
                    arr.push(element);
                    pre = element;
                }
            });
            for (var i = 0; i < len; ++i) {
                this.setElementByPos(i, arr[i]);
            }
            this.cut(arr.length - 1);
        };
        this.sort = function (cmp) {
            var arr = [];
            this.forEach(function (element) {
                arr.push(element);
            });
            arr.sort(cmp);
            for (var i = 0; i < len; ++i)
                this.setElementByPos(i, arr[i]);
        };
    }
    Object.freeze(Deque);

    exports.Deque = Deque;
    exports.LinkList = LinkList;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
