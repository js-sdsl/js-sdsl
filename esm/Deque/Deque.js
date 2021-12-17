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
export default Deque;
