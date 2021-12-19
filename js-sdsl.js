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
        this.push_back = function (element) {
            vector.push(element);
            ++len;
        };
        this.pop_back = function () {
            vector.pop();
            if (len > 0)
                --len;
        };
        this.forEach = function (callback) {
            vector.forEach(callback);
        };
        this.getElementByPos = function (pos) {
            if (pos < 0 || pos >= len)
                throw new Error("pos muse more than 0 and less than vector's size");
            return vector[pos];
        };
        this.setElementByPos = function (pos, element) {
            if (pos < 0 || pos >= len)
                throw new Error("pos muse more than 0 and less than vector's size");
            vector[pos] = element;
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
                if (element != value)
                    newArr.push(element);
            });
            newArr.forEach(function (element, index) {
                vector[index] = element;
            });
            var newLen = newArr.length;
            while (len > newLen)
                this.pop_back();
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
        this.front = function () {
            return head === null || head === void 0 ? void 0 : head.val;
        };
        this.back = function () {
            return tail === null || tail === void 0 ? void 0 : tail.val;
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
        this.front = function () {
            return map[first][curFirst];
        };
        this.back = function () {
            return map[last][curLast];
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
        this.setElementByPos = function (pos, element) {
            var _a = getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            map[curNodeBucketIndex][curNodePointerIndex] = element;
        };
        this.eraseElementByPos = function (pos) {
            var _this = this;
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
                var arr_2 = [];
                for (var i = pos; i < len; ++i) {
                    arr_2.push(this.getElementByPos(i));
                }
                last = curNodeBucketIndex;
                curLast = curNodePointerIndex;
                len = pos + 1;
                this.pop_back();
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
            var _a = getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            last = curNodeBucketIndex;
            curLast = curNodePointerIndex;
            len = pos + 1;
        };
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
    }
    Object.freeze(PriorityQueue);

    exports.Deque = Deque;
    exports.LinkList = LinkList;
    exports.PriorityQueue = PriorityQueue;
    exports.Queue = Queue;
    exports.Stack = Stack;
    exports.Vector = Vector;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
