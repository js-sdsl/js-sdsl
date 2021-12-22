(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.sdsl = {}));
})(this, (function (exports) { 'use strict';

    var __spreadArray$2 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    function Vector(arr) {
        if (arr === void 0) { arr = []; }
        var len = arr.length;
        var vector = __spreadArray$2([], arr, true);
        this.size = function () {
            return len;
        };
        this.empty = function () {
            return len === 0;
        };
        this.clear = function () {
            len = 0;
            vector.length = 0;
        };
        this.front = function () {
            if (this.empty())
                return undefined;
            return vector[0];
        };
        this.back = function () {
            if (this.empty())
                return undefined;
            return vector[len - 1];
        };
        this.forEach = function (callback) {
            vector.forEach(callback);
        };
        this.getElementByPos = function (pos) {
            if (pos < 0 || pos >= len)
                throw new Error("pos muse more than 0 and less than vector's size");
            return vector[pos];
        };
        this.eraseElementByPos = function (pos) {
            if (pos < 0 || pos >= len)
                throw new Error("pos muse more than 0 and less than vector's size");
            for (var i = pos; i < len - 1; ++i)
                vector[i] = vector[i + 1];
            this.pop_back();
        };
        this.eraseElementByValue = function (value) {
            var newArr = [];
            this.forEach(function (element) {
                if (element !== value)
                    newArr.push(element);
            });
            newArr.forEach(function (element, index) {
                vector[index] = element;
            });
            var newLen = newArr.length;
            while (len > newLen)
                this.pop_back();
        };
        this.push_back = function (element) {
            vector.push(element);
            ++len;
        };
        this.pop_back = function () {
            vector.pop();
            if (len > 0)
                --len;
        };
        this.setElementByPos = function (pos, element) {
            if (pos < 0 || pos >= len)
                throw new Error("pos muse more than 0 and less than vector's size");
            vector[pos] = element;
        };
        this.insert = function (pos, element, num) {
            if (num === void 0) { num = 1; }
            if (pos < 0 || pos > len)
                throw new Error("pos muse more than 0 and less than or equal to vector's size");
            vector.splice.apply(vector, __spreadArray$2([pos, 0], new Array(num).fill(element), false));
            len += num;
        };
        this.reverse = function () {
            vector.reverse();
        };
        this.unique = function () {
            var pre;
            var newArr = [];
            this.forEach(function (element, index) {
                if (index === 0 || element !== pre) {
                    newArr.push(element);
                    pre = element;
                }
            });
            newArr.forEach(function (element, index) {
                vector[index] = element;
            });
            var newLen = newArr.length;
            while (len > newLen)
                this.pop_back();
        };
        this.sort = function (cmp) {
            vector.sort(cmp);
        };
        Object.freeze(this);
    }
    Object.freeze(Vector);

    var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    function Stack(arr) {
        if (arr === void 0) { arr = []; }
        var len = arr.length;
        var stack = __spreadArray$1([], arr, true);
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
        this.push = function (element) {
            stack.push(element);
            ++len;
        };
        this.pop = function () {
            stack.pop();
            if (len > 0)
                --len;
        };
        this.top = function () {
            return stack[len - 1];
        };
        Object.freeze(this);
    }
    Object.freeze(Stack);

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
        if (len > 0) {
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
        this.front = function () {
            return head === null || head === void 0 ? void 0 : head.val;
        };
        this.back = function () {
            return tail === null || tail === void 0 ? void 0 : tail.val;
        };
        this.forEach = function (callback) {
            var curNode = head;
            var index = 0;
            while (curNode !== null) {
                callback(curNode.val, index++);
                curNode = curNode.next;
            }
        };
        this.getElementByPos = function (pos) {
            if (pos < 0 || pos >= len)
                throw new Error("pos must more then 0 and less then the list length");
            var curNode = head;
            while (pos--) {
                if (!curNode)
                    break;
                curNode = curNode.next;
            }
            return curNode === null || curNode === void 0 ? void 0 : curNode.val;
        };
        this.eraseElementByPos = function (pos) {
            if (pos < 0 || pos >= len)
                throw new Error("erase pos must more then 0 and less then the list length");
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
                if (len > 0)
                    --len;
            }
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
                    if (len > 0)
                        --len;
                }
                curNode = curNode.next;
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
        this.pop_back = function () {
            if (len > 0)
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
        this.setElementByPos = function (pos, element) {
            if (pos < 0 || pos >= len)
                throw new Error("pos must more then 0 and less then the list length");
            var curNode = head;
            while (pos--) {
                if (!curNode)
                    break;
                curNode = curNode.next;
            }
            if (curNode)
                curNode.val = element;
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
            else if (pos === len) {
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
                if (!curNode) {
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
                    if (len > 0)
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
        this.pop_front = function () {
            if (len > 0)
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
        Object.freeze(this);
    }
    Object.freeze(LinkList);

    function Queue(arr) {
        if (arr === void 0) { arr = []; }
        var queue = new LinkList(arr);
        this.size = function () {
            return queue.size();
        };
        this.empty = function () {
            return queue.empty();
        };
        this.clear = function () {
            queue.clear();
        };
        this.push = function (element) {
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
        if (len > 0) {
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
        }
        this.size = function () {
            return len;
        };
        this.empty = function () {
            return len === 0;
        };
        this.clear = function () {
            first = last = curFirst = curLast = bucketNum = len = 0;
            reAllocate.call(this, Deque.bucketSize);
            len = 0;
        };
        this.front = function () {
            return map[first][curFirst];
        };
        this.back = function () {
            return map[last][curLast];
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
        this.eraseElementByPos = function (pos) {
            var _this = this;
            if (pos < 0 || pos > len)
                throw new Error("pos should more than 0 and less than queue's size");
            if (pos === 0)
                this.pop_front();
            else if (pos === this.size())
                this.pop_back();
            else {
                var arr_1 = [];
                for (var i = pos + 1; i < len; ++i) {
                    arr_1.push(this.getElementByPos(i));
                }
                this.cut(pos);
                this.pop_back();
                arr_1.forEach(function (element) { return _this.push_back(element); });
            }
        };
        this.eraseElementByValue = function (value) {
            if (this.empty())
                return;
            var arr = [];
            this.forEach(function (element) {
                if (element !== value) {
                    arr.push(element);
                }
            });
            var _len = arr.length;
            for (var i = 0; i < _len; ++i)
                this.setElementByPos(i, arr[i]);
            this.cut(_len - 1);
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
            if (len > 0)
                --len;
        };
        this.setElementByPos = function (pos, element) {
            var _a = getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            map[curNodeBucketIndex][curNodePointerIndex] = element;
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
                var arr_2 = [];
                for (var i = pos; i < len; ++i) {
                    arr_2.push(this.getElementByPos(i));
                }
                this.cut(pos - 1);
                for (var i = 0; i < num; ++i)
                    this.push_back(element);
                arr_2.forEach(function (element) { return _this.push_back(element); });
            }
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
            if (len > 0)
                --len;
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
         * @param pos cut element after pos
         */
        this.cut = function (pos) {
            if (pos < 0) {
                this.clear();
                return;
            }
            var _a = getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            last = curNodeBucketIndex;
            curLast = curNodePointerIndex;
            len = pos + 1;
        };
        Object.freeze(this);
    }
    Object.freeze(Deque);

    var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    /**
     * @param arr
     * @param cmp default cmp will generate a max heap
     * @constructor
     */
    function PriorityQueue(arr, cmp) {
        if (arr === void 0) { arr = []; }
        cmp = cmp || (function (x, y) {
            if (x > y)
                return -1;
            if (x < y)
                return 1;
            return 0;
        });
        var len = arr.length;
        var priorityQueue = __spreadArray([], arr, true);
        var swap = function (x, y) {
            if (x < 0 || x >= len)
                throw new Error("unknown error");
            if (y < 0 || y >= len)
                throw new Error("unknown error");
            var tmp = priorityQueue[x];
            priorityQueue[x] = priorityQueue[y];
            priorityQueue[y] = tmp;
        };
        var adjust = function (parent) {
            if (parent < 0 || parent >= len)
                throw new Error("unknown error");
            var leftChild = parent * 2 + 1;
            var rightChild = parent * 2 + 2;
            if (leftChild < len && cmp(priorityQueue[parent], priorityQueue[leftChild]) > 0)
                swap(parent, leftChild);
            if (rightChild < len && cmp(priorityQueue[parent], priorityQueue[rightChild]) > 0)
                swap(parent, rightChild);
        };
        for (var parent_1 = Math.floor((len - 1) / 2); parent_1 >= 0; --parent_1) {
            var curParent = parent_1;
            var curChild = curParent * 2 + 1;
            while (curChild < len) {
                var leftChild = curChild;
                var rightChild = leftChild + 1;
                var minChild = leftChild;
                if (rightChild < len && cmp(priorityQueue[leftChild], priorityQueue[rightChild]) > 0)
                    minChild = rightChild;
                if (cmp(priorityQueue[curParent], priorityQueue[minChild]) <= 0)
                    break;
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
        this.push = function (element) {
            priorityQueue.push(element);
            ++len;
            if (len === 1)
                return;
            var curNode = len - 1;
            while (curNode > 0) {
                var parent_2 = Math.floor((curNode - 1) / 2);
                if (cmp(priorityQueue[parent_2], element) <= 0)
                    break;
                adjust(parent_2);
                curNode = parent_2;
            }
        };
        this.pop = function () {
            if (this.empty())
                return;
            if (this.size() === 1) {
                --len;
                return;
            }
            var last = priorityQueue[len - 1];
            --len;
            var parent = 0;
            while (parent < this.size()) {
                var leftChild = parent * 2 + 1;
                var rightChild = parent * 2 + 2;
                if (leftChild >= this.size())
                    break;
                var minChild = leftChild;
                if (rightChild < this.size() && cmp(priorityQueue[leftChild], priorityQueue[rightChild]) > 0)
                    minChild = rightChild;
                if (cmp(priorityQueue[minChild], last) >= 0)
                    break;
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

    var TreeNode = /** @class */ (function () {
        function TreeNode(key, value) {
            this.color = true;
            this.key = null;
            this.value = null;
            this.parent = null;
            this.brother = null;
            this.leftChild = null;
            this.rightChild = null;
            if (key !== undefined && value !== undefined) {
                this.key = key;
                this.value = value;
            }
        }
        TreeNode.prototype.rotateLeft = function () {
            var PP = this.parent;
            var PB = this.brother;
            var F = this.leftChild;
            var V = this.rightChild;
            if (!V)
                throw new Error("unknown error");
            var R = V.leftChild;
            var X = V.rightChild;
            if (PP) {
                if (PP.leftChild === this)
                    PP.leftChild = V;
                else if (PP.rightChild === this)
                    PP.rightChild = V;
            }
            V.parent = PP;
            V.brother = PB;
            V.leftChild = this;
            V.rightChild = X;
            if (PB)
                PB.brother = V;
            this.parent = V;
            this.brother = X;
            this.leftChild = F;
            this.rightChild = R;
            if (X) {
                X.parent = V;
                X.brother = this;
            }
            if (F) {
                F.parent = this;
                F.brother = R;
            }
            if (R) {
                R.parent = this;
                R.brother = F;
            }
            return V;
        };
        TreeNode.prototype.rotateRight = function () {
            var PP = this.parent;
            var PB = this.brother;
            var F = this.leftChild;
            if (!F)
                throw new Error("unknown error");
            var V = this.rightChild;
            var D = F.leftChild;
            var K = F.rightChild;
            if (PP) {
                if (PP.leftChild === this)
                    PP.leftChild = F;
                else if (PP.rightChild === this)
                    PP.rightChild = F;
            }
            F.parent = PP;
            F.brother = PB;
            F.leftChild = D;
            F.rightChild = this;
            if (PB)
                PB.brother = F;
            if (D) {
                D.parent = F;
                D.brother = this;
            }
            this.parent = F;
            this.brother = D;
            this.leftChild = K;
            this.rightChild = V;
            if (K) {
                K.parent = this;
                K.brother = V;
            }
            if (V) {
                V.parent = this;
                V.brother = K;
            }
            return F;
        };
        TreeNode.prototype.remove = function () {
            if (this.leftChild || this.rightChild)
                throw new Error("can only remove leaf node");
            if (this.parent) {
                if (this === this.parent.leftChild)
                    this.parent.leftChild = null;
                else if (this === this.parent.rightChild)
                    this.parent.rightChild = null;
            }
            if (this.brother)
                this.brother.brother = null;
            this.key = null;
            this.value = null;
            this.parent = null;
            this.brother = null;
        };
        TreeNode.TreeNodeColorType = {
            red: true,
            black: false
        };
        return TreeNode;
    }());
    Object.freeze(TreeNode);

    function Set(arr, cmp) {
        var _this = this;
        if (arr === void 0) { arr = []; }
        cmp = cmp || (function (x, y) {
            if (x < y)
                return -1;
            if (x > y)
                return 1;
            return 0;
        });
        var len = 0;
        var root = new TreeNode();
        root.color = TreeNode.TreeNodeColorType.black;
        this.size = function () {
            return len;
        };
        this.empty = function () {
            return len === 0;
        };
        this.clear = function () {
            len = 0;
            root = new TreeNode();
            root.color = TreeNode.TreeNodeColorType.black;
        };
        var findSubTreeMinNode = function (curNode) {
            if (!curNode || curNode.key === null)
                throw new Error("unknown error");
            return curNode.leftChild ? findSubTreeMinNode(curNode.leftChild) : curNode;
        };
        var findSubTreeMaxNode = function (curNode) {
            if (!curNode || curNode.key === null)
                throw new Error("unknown error");
            return curNode.rightChild ? findSubTreeMaxNode(curNode.rightChild) : curNode;
        };
        this.front = function () {
            if (this.empty())
                return undefined;
            var minNode = findSubTreeMinNode(root);
            if (minNode.key === null)
                return undefined;
            return minNode.key;
        };
        this.back = function () {
            if (this.empty())
                return undefined;
            var maxNode = findSubTreeMaxNode(root);
            if (maxNode.key === null)
                return undefined;
            return maxNode.key;
        };
        var inOrderTraversal = function (curNode, callback) {
            if (!curNode || curNode.key === null)
                return false;
            var ifReturn = inOrderTraversal(curNode.leftChild, callback);
            if (ifReturn)
                return true;
            if (callback(curNode))
                return true;
            return inOrderTraversal(curNode.rightChild, callback);
        };
        this.forEach = function (callback) {
            var index = 0;
            inOrderTraversal(root, function (curNode) {
                if (curNode.key === null)
                    throw new Error("unknown error");
                callback(curNode.key, index++);
                return false;
            });
        };
        this.getElementByPos = function (pos) {
            if (pos < 0 || pos >= this.size())
                throw new Error("pos must more than 0 and less than set's size");
            var index = 0;
            var element = null;
            inOrderTraversal(root, function (curNode) {
                if (pos === index) {
                    element = curNode.key;
                    return true;
                }
                ++index;
                return false;
            });
            if (element === null)
                throw new Error("unknown error");
            return element;
        };
        var eraseNodeSelfBalance = function (curNode) {
            var parentNode = curNode.parent;
            if (!parentNode) {
                if (curNode === root)
                    return;
                throw new Error("unknown error");
            }
            if (curNode.color === TreeNode.TreeNodeColorType.red) {
                curNode.color = TreeNode.TreeNodeColorType.black;
                return;
            }
            var brotherNode = curNode.brother;
            if (!brotherNode)
                throw new Error("unknown error");
            if (curNode === parentNode.leftChild) {
                if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.black;
                    parentNode.color = TreeNode.TreeNodeColorType.red;
                    var newRoot = parentNode.rotateLeft();
                    if (root === parentNode)
                        root = newRoot;
                    eraseNodeSelfBalance(curNode);
                }
                else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                    if (brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = parentNode.color;
                        parentNode.color = TreeNode.TreeNodeColorType.black;
                        if (brotherNode.rightChild)
                            brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                        var newRoot = parentNode.rotateLeft();
                        if (root === parentNode)
                            root = newRoot;
                        curNode.color = TreeNode.TreeNodeColorType.black;
                    }
                    else if ((!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        if (brotherNode.leftChild)
                            brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                        var newRoot = brotherNode.rotateRight();
                        if (root === brotherNode)
                            root = newRoot;
                        eraseNodeSelfBalance(curNode);
                    }
                    else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        eraseNodeSelfBalance(parentNode);
                    }
                }
            }
            else if (curNode === parentNode.rightChild) {
                if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.black;
                    parentNode.color = TreeNode.TreeNodeColorType.red;
                    var newRoot = parentNode.rotateRight();
                    if (root === parentNode)
                        root = newRoot;
                    eraseNodeSelfBalance(curNode);
                }
                else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                    if (brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = parentNode.color;
                        parentNode.color = TreeNode.TreeNodeColorType.black;
                        if (brotherNode.leftChild)
                            brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                        var newRoot = parentNode.rotateRight();
                        if (root === parentNode)
                            root = newRoot;
                        curNode.color = TreeNode.TreeNodeColorType.black;
                    }
                    else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        if (brotherNode.rightChild)
                            brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                        var newRoot = brotherNode.rotateLeft();
                        if (root === brotherNode)
                            root = newRoot;
                        eraseNodeSelfBalance(curNode);
                    }
                    else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        eraseNodeSelfBalance(parentNode);
                    }
                }
            }
        };
        var eraseNode = function (curNode) {
            var swapNode = curNode;
            while (swapNode.leftChild || swapNode.rightChild) {
                if (swapNode.rightChild) {
                    swapNode = findSubTreeMinNode(swapNode.rightChild);
                    var tmpKey = curNode.key;
                    curNode.key = swapNode.key;
                    swapNode.key = tmpKey;
                    curNode = swapNode;
                }
                if (swapNode.leftChild) {
                    swapNode = findSubTreeMaxNode(swapNode.leftChild);
                    var tmpKey = curNode.key;
                    curNode.key = swapNode.key;
                    swapNode.key = tmpKey;
                    curNode = swapNode;
                }
            }
            eraseNodeSelfBalance(swapNode);
            if (swapNode)
                swapNode.remove();
            --len;
            root.color = TreeNode.TreeNodeColorType.black;
        };
        this.eraseElementByPos = function (pos) {
            if (pos < 0 || pos >= len)
                throw new Error("pos must more than 0 and less than set's size");
            var index = 0;
            inOrderTraversal(root, function (curNode) {
                if (pos === index) {
                    eraseNode(curNode);
                    return true;
                }
                ++index;
                return false;
            });
        };
        this.eraseElementByValue = function (value) {
            if (this.empty())
                return;
            var curNode = findElementPos(root, value);
            if (curNode === null || curNode.key === null || cmp(curNode.key, value) !== 0)
                return;
            eraseNode(curNode);
        };
        var findInsertPos = function (curNode, element) {
            if (!curNode || curNode.key === null)
                throw new Error("unknown error");
            var cmpResult = cmp(element, curNode.key);
            if (cmpResult < 0) {
                if (!curNode.leftChild) {
                    curNode.leftChild = new TreeNode();
                    curNode.leftChild.parent = curNode;
                    curNode.leftChild.brother = curNode.rightChild;
                    if (curNode.rightChild)
                        curNode.rightChild.brother = curNode.leftChild;
                    return curNode.leftChild;
                }
                return findInsertPos(curNode.leftChild, element);
            }
            else if (cmpResult > 0) {
                if (!curNode.rightChild) {
                    curNode.rightChild = new TreeNode();
                    curNode.rightChild.parent = curNode;
                    curNode.rightChild.brother = curNode.leftChild;
                    if (curNode.leftChild)
                        curNode.leftChild.brother = curNode.rightChild;
                    return curNode.rightChild;
                }
                return findInsertPos(curNode.rightChild, element);
            }
            return curNode;
        };
        var insertNodeSelfBalance = function (curNode) {
            var parentNode = curNode.parent;
            if (!parentNode) {
                if (curNode === root)
                    return;
                throw new Error("unknown error");
            }
            if (parentNode.color === TreeNode.TreeNodeColorType.black)
                return;
            if (parentNode.color === TreeNode.TreeNodeColorType.red) {
                var uncleNode = parentNode.brother;
                var grandParent = parentNode.parent;
                if (!grandParent)
                    throw new Error("unknown error");
                if (uncleNode && uncleNode.color === TreeNode.TreeNodeColorType.red) {
                    uncleNode.color = parentNode.color = TreeNode.TreeNodeColorType.black;
                    grandParent.color = TreeNode.TreeNodeColorType.red;
                    insertNodeSelfBalance(grandParent);
                }
                else if (!uncleNode || uncleNode.color === TreeNode.TreeNodeColorType.black) {
                    if (parentNode === grandParent.leftChild) {
                        if (curNode === parentNode.leftChild) {
                            parentNode.color = TreeNode.TreeNodeColorType.black;
                            grandParent.color = TreeNode.TreeNodeColorType.red;
                            var newRoot = grandParent.rotateRight();
                            if (grandParent === root)
                                root = newRoot;
                        }
                        else if (curNode === parentNode.rightChild) {
                            var newRoot = parentNode.rotateLeft();
                            if (grandParent === root)
                                root = newRoot;
                            insertNodeSelfBalance(parentNode);
                        }
                    }
                    else if (parentNode === grandParent.rightChild) {
                        if (curNode === parentNode.leftChild) {
                            var newRoot = parentNode.rotateRight();
                            if (grandParent === root)
                                root = newRoot;
                            insertNodeSelfBalance(parentNode);
                        }
                        else if (curNode === parentNode.rightChild) {
                            parentNode.color = TreeNode.TreeNodeColorType.black;
                            grandParent.color = TreeNode.TreeNodeColorType.red;
                            var newRoot = grandParent.rotateLeft();
                            if (grandParent === root)
                                root = newRoot;
                        }
                    }
                }
            }
        };
        this.insert = function (element) {
            if (element === null || element === undefined) {
                throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
            }
            if (this.empty()) {
                ++len;
                root.key = element;
                root.color = TreeNode.TreeNodeColorType.black;
                return;
            }
            var curNode = findInsertPos(root, element);
            if (curNode.key && cmp(curNode.key, element) === 0)
                return;
            ++len;
            curNode.key = element;
            insertNodeSelfBalance(curNode);
            root.color = TreeNode.TreeNodeColorType.black;
        };
        var findElementPos = function (curNode, element) {
            if (!curNode || curNode.key === null)
                return null;
            var cmpResult = cmp(element, curNode.key);
            if (cmpResult < 0)
                return findElementPos(curNode.leftChild, element);
            else if (cmpResult > 0)
                return findElementPos(curNode.rightChild, element);
            return curNode;
        };
        this.find = function (element) {
            var curNode = findElementPos(root, element);
            return curNode !== null && curNode.key !== null && cmp(curNode.key, element) === 0;
        };
        // waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
        // (https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations)
        this.union = function (other) {
            var _this = this;
            other.forEach(function (element) { return _this.insert(element); });
        };
        this.getHeight = function () {
            if (this.empty())
                return 0;
            var traversal = function (curNode) {
                if (!curNode)
                    return 1;
                return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
            };
            return traversal(root);
        };
        arr.forEach(function (element) { return _this.insert(element); });
        Object.freeze(this);
    }

    function Map(arr, cmp) {
        var _this = this;
        if (arr === void 0) { arr = []; }
        cmp = cmp || (function (x, y) {
            if (x < y)
                return -1;
            if (x > y)
                return 1;
            return 0;
        });
        var len = 0;
        var root = new TreeNode();
        root.color = TreeNode.TreeNodeColorType.black;
        this.size = function () {
            return len;
        };
        this.empty = function () {
            return len === 0;
        };
        this.clear = function () {
            len = 0;
            root = new TreeNode();
            root.color = TreeNode.TreeNodeColorType.black;
        };
        var findSubTreeMinNode = function (curNode) {
            if (!curNode || curNode.key === null)
                throw new Error("unknown error");
            return curNode.leftChild ? findSubTreeMinNode(curNode.leftChild) : curNode;
        };
        var findSubTreeMaxNode = function (curNode) {
            if (!curNode || curNode.key === null)
                throw new Error("unknown error");
            return curNode.rightChild ? findSubTreeMaxNode(curNode.rightChild) : curNode;
        };
        this.front = function () {
            if (this.empty())
                return undefined;
            var minNode = findSubTreeMinNode(root);
            if (minNode.key === null || minNode.value === null)
                throw new Error("unknown error");
            return {
                key: minNode.key,
                value: minNode.value
            };
        };
        this.back = function () {
            if (this.empty())
                return undefined;
            var maxNode = findSubTreeMaxNode(root);
            if (maxNode.key === null || maxNode.value === null)
                throw new Error("unknown error");
            return {
                key: maxNode.key,
                value: maxNode.value
            };
        };
        var inOrderTraversal = function (curNode, callback) {
            if (!curNode || curNode.key === null)
                return false;
            var ifReturn = inOrderTraversal(curNode.leftChild, callback);
            if (ifReturn)
                return true;
            if (callback(curNode))
                return true;
            return inOrderTraversal(curNode.rightChild, callback);
        };
        this.forEach = function (callback) {
            var index = 0;
            inOrderTraversal(root, function (curNode) {
                if (curNode.key === null || curNode.value === null)
                    throw new Error("unknown error");
                callback({
                    key: curNode.key,
                    value: curNode.value
                }, index++);
                return false;
            });
        };
        this.getElementByPos = function (pos) {
            if (pos < 0 || pos >= this.size())
                throw new Error("pos must more than 0 and less than set's size");
            var index = 0;
            var element = null;
            inOrderTraversal(root, function (curNode) {
                if (pos === index) {
                    if (curNode.key === null || curNode.value === null)
                        throw new Error("unknown error");
                    element = {
                        key: curNode.key,
                        value: curNode.value
                    };
                    return true;
                }
                ++index;
                return false;
            });
            if (element === null)
                throw new Error("unknown error");
            return element;
        };
        var eraseNodeSelfBalance = function (curNode) {
            var parentNode = curNode.parent;
            if (!parentNode) {
                if (curNode === root)
                    return;
                throw new Error("unknown error");
            }
            if (curNode.color === TreeNode.TreeNodeColorType.red) {
                curNode.color = TreeNode.TreeNodeColorType.black;
                return;
            }
            var brotherNode = curNode.brother;
            if (!brotherNode)
                throw new Error("unknown error");
            if (curNode === parentNode.leftChild) {
                if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.black;
                    parentNode.color = TreeNode.TreeNodeColorType.red;
                    var newRoot = parentNode.rotateLeft();
                    if (root === parentNode)
                        root = newRoot;
                    eraseNodeSelfBalance(curNode);
                }
                else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                    if (brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = parentNode.color;
                        parentNode.color = TreeNode.TreeNodeColorType.black;
                        if (brotherNode.rightChild)
                            brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                        var newRoot = parentNode.rotateLeft();
                        if (root === parentNode)
                            root = newRoot;
                        curNode.color = TreeNode.TreeNodeColorType.black;
                    }
                    else if ((!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        if (brotherNode.leftChild)
                            brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                        var newRoot = brotherNode.rotateRight();
                        if (root === brotherNode)
                            root = newRoot;
                        eraseNodeSelfBalance(curNode);
                    }
                    else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        eraseNodeSelfBalance(parentNode);
                    }
                }
            }
            else if (curNode === parentNode.rightChild) {
                if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.black;
                    parentNode.color = TreeNode.TreeNodeColorType.red;
                    var newRoot = parentNode.rotateRight();
                    if (root === parentNode)
                        root = newRoot;
                    eraseNodeSelfBalance(curNode);
                }
                else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                    if (brotherNode.leftChild && brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = parentNode.color;
                        parentNode.color = TreeNode.TreeNodeColorType.black;
                        if (brotherNode.leftChild)
                            brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                        var newRoot = parentNode.rotateRight();
                        if (root === parentNode)
                            root = newRoot;
                        curNode.color = TreeNode.TreeNodeColorType.black;
                    }
                    else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && brotherNode.rightChild && brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        if (brotherNode.rightChild)
                            brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                        var newRoot = brotherNode.rotateLeft();
                        if (root === brotherNode)
                            root = newRoot;
                        eraseNodeSelfBalance(curNode);
                    }
                    else if ((!brotherNode.leftChild || brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild || brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        eraseNodeSelfBalance(parentNode);
                    }
                }
            }
        };
        var eraseNode = function (curNode) {
            var swapNode = curNode;
            while (swapNode.leftChild || swapNode.rightChild) {
                if (swapNode.rightChild) {
                    swapNode = findSubTreeMinNode(swapNode.rightChild);
                    var tmpKey = curNode.key;
                    curNode.key = swapNode.key;
                    swapNode.key = tmpKey;
                    var tmpValue = curNode.value;
                    curNode.value = swapNode.value;
                    swapNode.value = tmpValue;
                    curNode = swapNode;
                }
                if (swapNode.leftChild) {
                    swapNode = findSubTreeMaxNode(swapNode.leftChild);
                    var tmpKey = curNode.key;
                    curNode.key = swapNode.key;
                    swapNode.key = tmpKey;
                    var tmpValue = curNode.value;
                    curNode.value = swapNode.value;
                    swapNode.value = tmpValue;
                    curNode = swapNode;
                }
            }
            eraseNodeSelfBalance(swapNode);
            if (swapNode)
                swapNode.remove();
            --len;
            root.color = TreeNode.TreeNodeColorType.black;
        };
        this.eraseElementByPos = function (pos) {
            if (pos < 0 || pos >= len)
                throw new Error("pos must more than 0 and less than set's size");
            var index = 0;
            inOrderTraversal(root, function (curNode) {
                if (pos === index) {
                    eraseNode(curNode);
                    return true;
                }
                ++index;
                return false;
            });
        };
        this.eraseElementByKey = function (key) {
            if (this.empty())
                return;
            var curNode = findElementPos(root, key);
            if (curNode === null || curNode.key === null || cmp(curNode.key, key) !== 0)
                return;
            eraseNode(curNode);
        };
        var findInsertPos = function (curNode, element) {
            if (!curNode || curNode.key === null)
                throw new Error("unknown error");
            var cmpResult = cmp(element, curNode.key);
            if (cmpResult < 0) {
                if (!curNode.leftChild) {
                    curNode.leftChild = new TreeNode();
                    curNode.leftChild.parent = curNode;
                    curNode.leftChild.brother = curNode.rightChild;
                    if (curNode.rightChild)
                        curNode.rightChild.brother = curNode.leftChild;
                    return curNode.leftChild;
                }
                return findInsertPos(curNode.leftChild, element);
            }
            else if (cmpResult > 0) {
                if (!curNode.rightChild) {
                    curNode.rightChild = new TreeNode();
                    curNode.rightChild.parent = curNode;
                    curNode.rightChild.brother = curNode.leftChild;
                    if (curNode.leftChild)
                        curNode.leftChild.brother = curNode.rightChild;
                    return curNode.rightChild;
                }
                return findInsertPos(curNode.rightChild, element);
            }
            return curNode;
        };
        var insertNodeSelfBalance = function (curNode) {
            var parentNode = curNode.parent;
            if (!parentNode) {
                if (curNode === root)
                    return;
                throw new Error("unknown error");
            }
            if (parentNode.color === TreeNode.TreeNodeColorType.black)
                return;
            if (parentNode.color === TreeNode.TreeNodeColorType.red) {
                var uncleNode = parentNode.brother;
                var grandParent = parentNode.parent;
                if (!grandParent)
                    throw new Error("unknown error");
                if (uncleNode && uncleNode.color === TreeNode.TreeNodeColorType.red) {
                    uncleNode.color = parentNode.color = TreeNode.TreeNodeColorType.black;
                    grandParent.color = TreeNode.TreeNodeColorType.red;
                    insertNodeSelfBalance(grandParent);
                }
                else if (!uncleNode || uncleNode.color === TreeNode.TreeNodeColorType.black) {
                    if (parentNode === grandParent.leftChild) {
                        if (curNode === parentNode.leftChild) {
                            parentNode.color = TreeNode.TreeNodeColorType.black;
                            grandParent.color = TreeNode.TreeNodeColorType.red;
                            var newRoot = grandParent.rotateRight();
                            if (grandParent === root)
                                root = newRoot;
                        }
                        else if (curNode === parentNode.rightChild) {
                            var newRoot = parentNode.rotateLeft();
                            if (grandParent === root)
                                root = newRoot;
                            insertNodeSelfBalance(parentNode);
                        }
                    }
                    else if (parentNode === grandParent.rightChild) {
                        if (curNode === parentNode.leftChild) {
                            var newRoot = parentNode.rotateRight();
                            if (grandParent === root)
                                root = newRoot;
                            insertNodeSelfBalance(parentNode);
                        }
                        else if (curNode === parentNode.rightChild) {
                            parentNode.color = TreeNode.TreeNodeColorType.black;
                            grandParent.color = TreeNode.TreeNodeColorType.red;
                            var newRoot = grandParent.rotateLeft();
                            if (grandParent === root)
                                root = newRoot;
                        }
                    }
                }
            }
        };
        this.setElement = function (key, value) {
            if (key === null || key === undefined) {
                throw new Error("to avoid some unnecessary errors, we don't suggest you insert null or undefined here");
            }
            if (value === null || value === undefined) {
                this.eraseElementByKey(key);
                return;
            }
            if (this.empty()) {
                ++len;
                root.key = key;
                root.value = value;
                root.color = TreeNode.TreeNodeColorType.black;
                return;
            }
            var curNode = findInsertPos(root, key);
            if (curNode.key && cmp(curNode.key, key) === 0) {
                curNode.value = value;
                return;
            }
            ++len;
            curNode.key = key;
            curNode.value = value;
            insertNodeSelfBalance(curNode);
            root.color = TreeNode.TreeNodeColorType.black;
        };
        var findElementPos = function (curNode, element) {
            if (!curNode || curNode.key === null)
                return null;
            var cmpResult = cmp(element, curNode.key);
            if (cmpResult < 0)
                return findElementPos(curNode.leftChild, element);
            else if (cmpResult > 0)
                return findElementPos(curNode.rightChild, element);
            return curNode;
        };
        this.getElementByKey = function (element) {
            var curNode = findElementPos(root, element);
            if (curNode === null)
                return undefined;
            if (curNode.key === null || curNode.value === null)
                throw new Error("unknown error");
            return {
                key: curNode.key,
                value: curNode.value
            };
        };
        // waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
        // (https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations)
        this.union = function (other) {
            var _this = this;
            other.forEach(function (_a) {
                var key = _a.key, value = _a.value;
                return _this.setElement(key, value);
            });
        };
        this.getHeight = function () {
            if (this.empty())
                return 0;
            var traversal = function (curNode) {
                if (!curNode)
                    return 1;
                return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
            };
            return traversal(root);
        };
        arr.forEach(function (_a) {
            var key = _a.key, value = _a.value;
            return _this.setElement(key, value);
        });
        Object.freeze(this);
    }

    exports.Deque = Deque;
    exports.LinkList = LinkList;
    exports.Map = Map;
    exports.PriorityQueue = PriorityQueue;
    exports.Queue = Queue;
    exports.Set = Set;
    exports.Stack = Stack;
    exports.Vector = Vector;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
