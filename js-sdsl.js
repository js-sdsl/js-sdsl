(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.sdsl = {}));
})(this, (function (exports) { 'use strict';

    var __extends$f = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError$1("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    function createErrorClass(errorName, errorMessage) {
        return /** @class */ (function (_super) {
            __extends$f(newError, _super);
            function newError(message) {
                if (message === void 0) { message = errorMessage; }
                var _this = _super.call(this, message) || this;
                _this.name = errorName;
                return _this;
            }
            return newError;
        }(Error));
    }
    createErrorClass('TestError', 'test error');
    var TypeError$1 = createErrorClass('TypeError', 'type error');
    var RunTimeError = createErrorClass('RunTimeError', 'access out of bounds');
    var InternalError = createErrorClass('InternalError', 'internal error');
    var NullValueError = createErrorClass('NullValueError', 'you can not set null value here');
    var ContainerInitError = createErrorClass('ContainerInitError', 'container init failed');

    var __extends$e = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var ContainerIterator = /** @class */ (function () {
        function ContainerIterator(node, iteratorType) {
            this.node = node;
            this.iteratorType = iteratorType;
        }
        return ContainerIterator;
    }());
    var Base = /** @class */ (function () {
        function Base() {
            this.length = 0;
        }
        /**
         * @return The size of the container.
         */
        Base.prototype.size = function () {
            return this.length;
        };
        /**
         * @return Is the container empty.
         */
        Base.prototype.empty = function () {
            return this.length === 0;
        };
        return Base;
    }());
    var Container = /** @class */ (function (_super) {
        __extends$e(Container, _super);
        function Container() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Container;
    }(Base));

    function checkUndefinedParams() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.includes(undefined) || args.includes(null)) {
            throw new NullValueError();
        }
    }
    function checkWithinAccessParams(pos, lower, upper) {
        if (pos < lower || pos > upper) {
            throw new RunTimeError();
        }
    }

    var __extends$d = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var SequentialContainer = /** @class */ (function (_super) {
        __extends$d(SequentialContainer, _super);
        function SequentialContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SequentialContainer;
    }(Container));

    var __extends$c = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __generator$6 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __read$1 = (undefined && undefined.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    var __values$4 = (undefined && undefined.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var VectorIterator = /** @class */ (function (_super) {
        __extends$c(VectorIterator, _super);
        function VectorIterator(index, size, getElementByPos, setElementByPos, iteratorType) {
            if (iteratorType === void 0) { iteratorType = 'normal'; }
            var _this = _super.call(this, index, iteratorType) || this;
            _this.size = size;
            _this.getElementByPos = getElementByPos;
            _this.setElementByPos = setElementByPos;
            return _this;
        }
        Object.defineProperty(VectorIterator.prototype, "pointer", {
            get: function () {
                checkWithinAccessParams(this.node, 0, this.size() - 1);
                return this.getElementByPos(this.node);
            },
            set: function (newValue) {
                checkWithinAccessParams(this.node, 0, this.size() - 1);
                this.setElementByPos(this.node, newValue);
            },
            enumerable: false,
            configurable: true
        });
        VectorIterator.prototype.pre = function () {
            if (this.iteratorType === 'reverse') {
                if (this.node === this.size() - 1) {
                    throw new RunTimeError('Deque iterator access denied!');
                }
                ++this.node;
            }
            else {
                if (this.node === 0) {
                    throw new RunTimeError('Deque iterator access denied!');
                }
                --this.node;
            }
            return this;
        };
        VectorIterator.prototype.next = function () {
            if (this.iteratorType === 'reverse') {
                if (this.node === -1) {
                    throw new RunTimeError('Deque iterator access denied!');
                }
                --this.node;
            }
            else {
                if (this.node === this.size()) {
                    throw new RunTimeError('Iterator access denied!');
                }
                ++this.node;
            }
            return this;
        };
        VectorIterator.prototype.equals = function (obj) {
            if (obj.constructor.name !== this.constructor.name) {
                throw new TypeError("obj's constructor is not ".concat(this.constructor.name, "!"));
            }
            if (this.iteratorType !== obj.iteratorType) {
                throw new TypeError('iterator type error!');
            }
            // @ts-ignore
            return this.node === obj.node;
        };
        return VectorIterator;
    }(ContainerIterator));
    var Vector = /** @class */ (function (_super) {
        __extends$c(Vector, _super);
        function Vector(container) {
            if (container === void 0) { container = []; }
            var _this = _super.call(this) || this;
            _this.vector = [];
            container.forEach(function (element) { return _this.pushBack(element); });
            return _this;
        }
        Vector.prototype.clear = function () {
            this.length = 0;
            this.vector.length = 0;
        };
        Vector.prototype.begin = function () {
            return new VectorIterator(0, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this));
        };
        Vector.prototype.end = function () {
            return new VectorIterator(this.length, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this));
        };
        Vector.prototype.rBegin = function () {
            return new VectorIterator(this.length - 1, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this), 'reverse');
        };
        Vector.prototype.rEnd = function () {
            return new VectorIterator(-1, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this), 'reverse');
        };
        Vector.prototype.front = function () {
            if (this.empty())
                return undefined;
            return this.vector[0];
        };
        Vector.prototype.back = function () {
            if (this.empty())
                return undefined;
            return this.vector[this.length - 1];
        };
        Vector.prototype.forEach = function (callback) {
            this.vector.forEach(callback);
        };
        Vector.prototype.getElementByPos = function (pos) {
            checkWithinAccessParams(pos, 0, this.length - 1);
            return this.vector[pos];
        };
        Vector.prototype.eraseElementByPos = function (pos) {
            checkWithinAccessParams(pos, 0, this.length - 1);
            for (var i = pos; i < this.length - 1; ++i)
                this.vector[i] = this.vector[i + 1];
            this.popBack();
        };
        Vector.prototype.eraseElementByValue = function (value) {
            var _this = this;
            var newArr = [];
            this.forEach(function (element) {
                if (element !== value)
                    newArr.push(element);
            });
            newArr.forEach(function (element, index) {
                _this.vector[index] = element;
            });
            var newLen = newArr.length;
            while (this.length > newLen)
                this.popBack();
        };
        Vector.prototype.eraseElementByIterator = function (iter) {
            // @ts-ignore
            var node = iter.node;
            iter = iter.next();
            this.eraseElementByPos(node);
            return iter;
        };
        Vector.prototype.pushBack = function (element) {
            this.vector.push(element);
            ++this.length;
        };
        Vector.prototype.popBack = function () {
            this.vector.pop();
            if (this.length > 0)
                --this.length;
        };
        Vector.prototype.setElementByPos = function (pos, element) {
            checkWithinAccessParams(pos, 0, this.length - 1);
            if (element === undefined || element === null) {
                this.eraseElementByPos(pos);
                return;
            }
            this.vector[pos] = element;
        };
        Vector.prototype.insert = function (pos, element, num) {
            var _a;
            if (num === void 0) { num = 1; }
            checkUndefinedParams(element);
            checkWithinAccessParams(pos, 0, this.length);
            (_a = this.vector).splice.apply(_a, __spreadArray([pos, 0], __read$1(new Array(num).fill(element)), false));
            this.length += num;
        };
        Vector.prototype.find = function (element) {
            for (var i = 0; i < this.length; ++i) {
                if (this.vector[i] === element) {
                    return new VectorIterator(i, this.size.bind(this), this.getElementByPos.bind(this), this.getElementByPos.bind(this));
                }
            }
            return this.end();
        };
        Vector.prototype.reverse = function () {
            this.vector.reverse();
        };
        Vector.prototype.unique = function () {
            var _this = this;
            var pre;
            var newArr = [];
            this.forEach(function (element, index) {
                if (index === 0 || element !== pre) {
                    newArr.push(element);
                    pre = element;
                }
            });
            newArr.forEach(function (element, index) {
                _this.vector[index] = element;
            });
            var newLen = newArr.length;
            while (this.length > newLen)
                this.popBack();
        };
        Vector.prototype.sort = function (cmp) {
            this.vector.sort(cmp);
        };
        Vector.prototype[Symbol.iterator] = function () {
            return function () {
                return __generator$6(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [5 /*yield**/, __values$4(this.vector)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            }.bind(this)();
        };
        return Vector;
    }(SequentialContainer));

    var __extends$b = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var Stack = /** @class */ (function (_super) {
        __extends$b(Stack, _super);
        function Stack(container) {
            if (container === void 0) { container = []; }
            var _this = _super.call(this) || this;
            _this.stack = [];
            container.forEach(function (element) { return _this.push(element); });
            return _this;
        }
        Stack.prototype.clear = function () {
            this.length = 0;
            this.stack.length = 0;
        };
        /**
         * Inserts element at the top.
         */
        Stack.prototype.push = function (element) {
            this.stack.push(element);
            ++this.length;
        };
        /**
         * Removes the top element.
         */
        Stack.prototype.pop = function () {
            this.stack.pop();
            if (this.length > 0)
                --this.length;
        };
        /**
         * Accesses the top element.
         */
        Stack.prototype.top = function () {
            return this.stack[this.length - 1];
        };
        return Stack;
    }(Base));

    var __extends$a = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __generator$5 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var LinkNode = /** @class */ (function () {
        function LinkNode(element) {
            this.value = undefined;
            this.pre = undefined;
            this.next = undefined;
            this.value = element;
        }
        return LinkNode;
    }());
    var LinkListIterator = /** @class */ (function (_super) {
        __extends$a(LinkListIterator, _super);
        function LinkListIterator(node, iteratorType) {
            if (iteratorType === void 0) { iteratorType = 'normal'; }
            return _super.call(this, node, iteratorType) || this;
        }
        Object.defineProperty(LinkListIterator.prototype, "pointer", {
            get: function () {
                if (this.node.value === undefined) {
                    throw new RunTimeError('LinkList iterator access denied!');
                }
                return this.node.value;
            },
            set: function (newValue) {
                if (this.node.value === undefined) {
                    throw new RunTimeError('LinkList iterator access denied!');
                }
                checkUndefinedParams(newValue);
                this.node.value = newValue;
            },
            enumerable: false,
            configurable: true
        });
        LinkListIterator.prototype.pre = function () {
            if (this.iteratorType === 'reverse') {
                this.node.next = this.node.next;
                if (this.node.next.value === undefined) {
                    throw new RunTimeError('LinkList iterator access denied!');
                }
                this.node = this.node.next;
            }
            else {
                this.node.pre = this.node.pre;
                if (this.node.pre.value === undefined) {
                    throw new RunTimeError('LinkList iterator access denied!');
                }
                this.node = this.node.pre;
            }
            return this;
        };
        LinkListIterator.prototype.next = function () {
            if (this.iteratorType === 'reverse') {
                if (this.node.value === undefined) {
                    throw new RunTimeError('LinkList iterator access denied!');
                }
                this.node = this.node.pre;
            }
            else {
                if (this.node.value === undefined) {
                    throw new RunTimeError('LinkList iterator access denied!');
                }
                this.node = this.node.next;
            }
            return this;
        };
        LinkListIterator.prototype.equals = function (obj) {
            if (obj.constructor.name !== this.constructor.name) {
                throw new TypeError("obj's constructor is not ".concat(this.constructor.name, "!"));
            }
            if (this.iteratorType !== obj.iteratorType) {
                throw new TypeError('iterator type error!');
            }
            // @ts-ignore
            return this.node === obj.node;
        };
        return LinkListIterator;
    }(ContainerIterator));
    var LinkList = /** @class */ (function (_super) {
        __extends$a(LinkList, _super);
        function LinkList(container) {
            if (container === void 0) { container = []; }
            var _this = _super.call(this) || this;
            _this.header = new LinkNode();
            _this.head = undefined;
            _this.tail = undefined;
            container.forEach(function (element) { return _this.pushBack(element); });
            return _this;
        }
        LinkList.prototype.clear = function () {
            this.length = 0;
            this.head = this.tail = undefined;
            this.header.pre = this.header.next = undefined;
        };
        LinkList.prototype.begin = function () {
            return new LinkListIterator(this.head || this.header);
        };
        LinkList.prototype.end = function () {
            return new LinkListIterator(this.header);
        };
        LinkList.prototype.rBegin = function () {
            return new LinkListIterator(this.tail || this.header, 'reverse');
        };
        LinkList.prototype.rEnd = function () {
            return new LinkListIterator(this.header, 'reverse');
        };
        LinkList.prototype.front = function () {
            var _a;
            return (_a = this.head) === null || _a === void 0 ? void 0 : _a.value;
        };
        LinkList.prototype.back = function () {
            var _a;
            return (_a = this.tail) === null || _a === void 0 ? void 0 : _a.value;
        };
        LinkList.prototype.forEach = function (callback) {
            var curNode = this.head;
            var index = 0;
            while (curNode && curNode !== this.header) {
                callback(curNode.value, index++);
                curNode = curNode.next;
            }
        };
        LinkList.prototype.getElementByPos = function (pos) {
            checkWithinAccessParams(pos, 0, this.length - 1);
            var curNode = this.head;
            while (pos--) {
                curNode = curNode.next;
            }
            return curNode.value;
        };
        LinkList.prototype.eraseElementByPos = function (pos) {
            checkWithinAccessParams(pos, 0, this.length - 1);
            if (pos === 0)
                this.popFront();
            else if (pos === this.length - 1)
                this.popBack();
            else {
                var curNode = this.head;
                while (pos--) {
                    curNode = curNode.next;
                }
                curNode = curNode;
                var pre = curNode.pre;
                var next = curNode.next;
                next.pre = pre;
                pre.next = next;
                if (this.length > 0)
                    --this.length;
            }
        };
        LinkList.prototype.eraseElementByValue = function (value) {
            while (this.head && this.head.value === value)
                this.popFront();
            while (this.tail && this.tail.value === value)
                this.popBack();
            if (!this.head)
                return;
            var curNode = this.head;
            while (curNode && curNode !== this.header) {
                if (curNode.value === value) {
                    var pre = curNode.pre;
                    var next = curNode.next;
                    if (next)
                        next.pre = pre;
                    if (pre)
                        pre.next = next;
                    if (this.length > 0)
                        --this.length;
                }
                curNode = curNode.next;
            }
        };
        LinkList.prototype.eraseElementByIterator = function (iter) {
            if (this.empty()) {
                throw new RunTimeError();
            }
            // @ts-ignore
            var node = iter.node;
            iter = iter.next();
            if (this.head === node)
                this.popFront();
            else if (this.tail === node)
                this.popBack();
            else {
                var pre = node.pre;
                var next = node.next;
                if (next)
                    next.pre = pre;
                if (pre)
                    pre.next = next;
                --this.length;
            }
            return iter;
        };
        LinkList.prototype.pushBack = function (element) {
            checkUndefinedParams(element);
            ++this.length;
            var newTail = new LinkNode(element);
            if (!this.tail) {
                this.head = this.tail = newTail;
                this.header.next = this.head;
                this.head.pre = this.header;
            }
            else {
                this.tail.next = newTail;
                newTail.pre = this.tail;
                this.tail = newTail;
            }
            this.tail.next = this.header;
            this.header.pre = this.tail;
        };
        LinkList.prototype.popBack = function () {
            if (!this.tail)
                return;
            if (this.length > 0)
                --this.length;
            if (this.head === this.tail) {
                this.head = this.tail = undefined;
                this.header.next = undefined;
            }
            else {
                this.tail = this.tail.pre;
                if (this.tail)
                    this.tail.next = undefined;
            }
            this.header.pre = this.tail;
            if (this.tail)
                this.tail.next = this.header;
        };
        LinkList.prototype.setElementByPos = function (pos, element) {
            checkUndefinedParams(element);
            checkWithinAccessParams(pos, 0, this.length - 1);
            var curNode = this.head;
            while (pos--) {
                curNode = curNode.next;
            }
            if (curNode)
                curNode.value = element;
        };
        LinkList.prototype.insert = function (pos, element, num) {
            if (num === void 0) { num = 1; }
            checkUndefinedParams(element);
            checkWithinAccessParams(pos, 0, this.length);
            if (num <= 0)
                return;
            if (pos === 0) {
                while (num--)
                    this.pushFront(element);
            }
            else if (pos === this.length) {
                while (num--)
                    this.pushBack(element);
            }
            else {
                var curNode = this.head;
                for (var i = 1; i < pos; ++i) {
                    curNode = curNode.next;
                }
                var next = curNode.next;
                this.length += num;
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
        LinkList.prototype.find = function (element) {
            var curNode = this.head;
            while (curNode && curNode !== this.header) {
                if (curNode.value === element)
                    return new LinkListIterator(curNode);
                curNode = curNode.next;
            }
            return this.end();
        };
        LinkList.prototype.reverse = function () {
            var pHead = this.head;
            var pTail = this.tail;
            var cnt = 0;
            while (pHead && pTail && cnt * 2 < this.length) {
                var tmp = pHead.value;
                pHead.value = pTail.value;
                pTail.value = tmp;
                pHead = pHead.next;
                pTail = pTail.pre;
                ++cnt;
            }
        };
        LinkList.prototype.unique = function () {
            var curNode = this.head;
            while (curNode && curNode !== this.header) {
                var tmpNode = curNode;
                while (tmpNode && tmpNode.next && tmpNode.value === tmpNode.next.value) {
                    tmpNode = tmpNode.next;
                    if (this.length > 0)
                        --this.length;
                }
                curNode.next = tmpNode.next;
                if (curNode.next)
                    curNode.next.pre = curNode;
                curNode = curNode.next;
            }
        };
        LinkList.prototype.sort = function (cmp) {
            var arr = [];
            this.forEach(function (element) {
                arr.push(element);
            });
            arr.sort(cmp);
            var curNode = this.head;
            arr.forEach(function (element) {
                if (curNode) {
                    curNode.value = element;
                    curNode = curNode.next;
                }
            });
        };
        /**
         * Inserts an element to the beginning.
         */
        LinkList.prototype.pushFront = function (element) {
            checkUndefinedParams(element);
            ++this.length;
            var newHead = new LinkNode(element);
            if (!this.head) {
                this.head = this.tail = newHead;
                this.tail.next = this.header;
                this.header.pre = this.tail;
            }
            else {
                newHead.next = this.head;
                this.head.pre = newHead;
                this.head = newHead;
            }
            this.header.next = this.head;
            this.head.pre = this.header;
        };
        /**
         * Removes the last element.
         */
        LinkList.prototype.popFront = function () {
            if (!this.head)
                return;
            if (this.length > 0)
                --this.length;
            if (this.head === this.tail) {
                this.head = this.tail = undefined;
                this.header.pre = this.tail;
            }
            else {
                this.head = this.head.next;
                if (this.head)
                    this.head.pre = this.header;
            }
            this.header.next = this.head;
        };
        /**
         * Merges two sorted lists.
         */
        LinkList.prototype.merge = function (list) {
            var _this = this;
            var curNode = this.head;
            list.forEach(function (element) {
                while (curNode &&
                    curNode !== _this.header &&
                    curNode.value !== undefined &&
                    curNode.value <= element) {
                    curNode = curNode.next;
                }
                if (curNode === _this.header) {
                    _this.pushBack(element);
                    curNode = _this.tail;
                }
                else if (curNode === _this.head) {
                    _this.pushFront(element);
                    curNode = _this.head;
                }
                else {
                    ++_this.length;
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
        LinkList.prototype[Symbol.iterator] = function () {
            return function () {
                var curNode;
                return __generator$5(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            curNode = this.head;
                            _a.label = 1;
                        case 1:
                            if (!(curNode && curNode !== this.header)) return [3 /*break*/, 3];
                            return [4 /*yield*/, curNode.value];
                        case 2:
                            _a.sent();
                            curNode = curNode.next;
                            return [3 /*break*/, 1];
                        case 3: return [2 /*return*/];
                    }
                });
            }.bind(this)();
        };
        return LinkList;
    }(SequentialContainer));

    var __extends$9 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var Queue = /** @class */ (function (_super) {
        __extends$9(Queue, _super);
        function Queue(container) {
            if (container === void 0) { container = []; }
            var _this = _super.call(this) || this;
            _this.queue = new LinkList(container);
            _this.length = _this.queue.size();
            return _this;
        }
        Queue.prototype.clear = function () {
            this.queue.clear();
            this.length = 0;
        };
        /**
         * Inserts element at the end.
         */
        Queue.prototype.push = function (element) {
            this.queue.pushBack(element);
            ++this.length;
        };
        /**
         * Removes the first element.
         */
        Queue.prototype.pop = function () {
            this.queue.popFront();
            if (this.length)
                --this.length;
        };
        /**
         * Access the first element.
         */
        Queue.prototype.front = function () {
            return this.queue.front();
        };
        return Queue;
    }(Base));

    var __extends$8 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __generator$4 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var DequeIterator = /** @class */ (function (_super) {
        __extends$8(DequeIterator, _super);
        function DequeIterator(index, size, getElementByPos, setElementByPos, iteratorType) {
            if (iteratorType === void 0) { iteratorType = 'normal'; }
            var _this = _super.call(this, index, iteratorType) || this;
            _this.node = index;
            _this.size = size;
            _this.getElementByPos = getElementByPos;
            _this.setElementByPos = setElementByPos;
            return _this;
        }
        Object.defineProperty(DequeIterator.prototype, "pointer", {
            get: function () {
                checkWithinAccessParams(this.node, 0, this.size() - 1);
                return this.getElementByPos(this.node);
            },
            set: function (newValue) {
                checkWithinAccessParams(this.node, 0, this.size() - 1);
                this.setElementByPos(this.node, newValue);
            },
            enumerable: false,
            configurable: true
        });
        DequeIterator.prototype.pre = function () {
            if (this.iteratorType === 'reverse') {
                if (this.node === this.size() - 1) {
                    throw new RunTimeError('Deque iterator access denied!');
                }
                ++this.node;
            }
            else {
                if (this.node === 0) {
                    throw new RunTimeError('Deque iterator access denied!');
                }
                --this.node;
            }
            return this;
        };
        DequeIterator.prototype.next = function () {
            if (this.iteratorType === 'reverse') {
                if (this.node === -1) {
                    throw new RunTimeError('Deque iterator access denied!');
                }
                --this.node;
            }
            else {
                if (this.node === this.size()) {
                    throw new RunTimeError('Iterator access denied!');
                }
                ++this.node;
            }
            return this;
        };
        DequeIterator.prototype.equals = function (obj) {
            if (obj.constructor.name !== this.constructor.name) {
                throw new TypeError("obj's constructor is not ".concat(this.constructor.name, "!"));
            }
            if (this.iteratorType !== obj.iteratorType) {
                throw new TypeError('iterator type error!');
            }
            // @ts-ignore
            return this.node === obj.node;
        };
        return DequeIterator;
    }(ContainerIterator));
    var Deque = /** @class */ (function (_super) {
        __extends$8(Deque, _super);
        function Deque(container, bucketSize) {
            if (container === void 0) { container = []; }
            if (bucketSize === void 0) { bucketSize = Deque.initBucketSize; }
            var _this = _super.call(this) || this;
            _this.first = 0;
            _this.curFirst = 0;
            _this.last = 0;
            _this.curLast = 0;
            _this.bucketNum = 0;
            _this.map = [];
            var _length;
            if ('size' in container) {
                if (typeof container.size === 'number') {
                    _length = container.size;
                }
                else {
                    _length = container.size();
                }
            }
            else if ('length' in container) {
                _length = container.length;
            }
            else {
                throw new ContainerInitError('Can\'t get container\'s size!');
            }
            _this.bucketSize = bucketSize;
            var needSize = _length * Deque.sigma;
            _this.bucketNum = Math.ceil(needSize / _this.bucketSize);
            _this.bucketNum = Math.max(_this.bucketNum, 3);
            for (var i = 0; i < _this.bucketNum; ++i) {
                _this.map.push(new Array(_this.bucketSize));
            }
            var needBucketNum = Math.ceil(_length / _this.bucketSize);
            _this.first = Math.floor(_this.bucketNum / 2) - Math.floor(needBucketNum / 2);
            _this.last = _this.first;
            container.forEach(function (element) { return _this.pushBack(element); });
            return _this;
        }
        Deque.prototype.reAllocate = function (originalSize) {
            var newMap = [];
            var needSize = originalSize * Deque.sigma;
            var newBucketNum = Math.max(Math.ceil(needSize / this.bucketSize), 2);
            for (var i = 0; i < newBucketNum; ++i) {
                newMap.push(new Array(this.bucketSize));
            }
            var needBucketNum = Math.ceil(originalSize / this.bucketSize);
            var newFirst = Math.floor(newBucketNum / 2) - Math.floor(needBucketNum / 2);
            var newLast = newFirst;
            var newCurLast = 0;
            if (this.length) {
                for (var i = 0; i < needBucketNum; ++i) {
                    for (var j = 0; j < this.bucketSize; ++j) {
                        newMap[newFirst + i][j] = this.front();
                        this.popFront();
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
            this.map = newMap;
            this.first = newFirst;
            this.curFirst = 0;
            this.last = newLast;
            this.curLast = newCurLast;
            this.bucketNum = newBucketNum;
            this.length = originalSize;
        };
        Deque.prototype.getElementIndex = function (pos) {
            var curFirstIndex = this.first * this.bucketSize + this.curFirst;
            var curNodeIndex = curFirstIndex + pos;
            var curNodeBucketIndex, curNodePointerIndex;
            if ((curNodeIndex + 1) % this.bucketSize === 0) {
                curNodeBucketIndex = (curNodeIndex + 1) / this.bucketSize - 1;
                curNodePointerIndex = this.bucketSize - 1;
            }
            else {
                curNodeBucketIndex = Math.floor((curNodeIndex + 1) / this.bucketSize);
                curNodePointerIndex = (curNodeIndex + 1) % this.bucketSize - 1;
            }
            return { curNodeBucketIndex: curNodeBucketIndex, curNodePointerIndex: curNodePointerIndex };
        };
        Deque.prototype.getIndex = function (curNodeBucketIndex, curNodePointerIndex) {
            if (curNodeBucketIndex === this.first) {
                return curNodePointerIndex - this.curFirst;
            }
            if (curNodeBucketIndex === this.last) {
                return this.length - (this.curLast - curNodePointerIndex) - 1;
            }
            return (this.bucketSize - this.first) +
                (curNodeBucketIndex - this.first - 1) *
                    this.bucketNum + curNodePointerIndex;
        };
        Deque.prototype.clear = function () {
            this.first = this.last = this.curFirst = this.curLast = this.bucketNum = this.length = 0;
            this.reAllocate(this.bucketSize);
            this.length = 0;
        };
        Deque.prototype.front = function () {
            return this.map[this.first][this.curFirst];
        };
        Deque.prototype.back = function () {
            return this.map[this.last][this.curLast];
        };
        Deque.prototype.begin = function () {
            return new DequeIterator(0, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this));
        };
        Deque.prototype.end = function () {
            return new DequeIterator(this.length, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this));
        };
        Deque.prototype.rBegin = function () {
            return new DequeIterator(this.length - 1, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this), 'reverse');
        };
        Deque.prototype.rEnd = function () {
            return new DequeIterator(-1, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this), 'reverse');
        };
        Deque.prototype.pushBack = function (element) {
            if (!this.empty()) {
                if (this.last === this.bucketNum - 1 && this.curLast === this.bucketSize - 1) {
                    this.reAllocate(this.length);
                }
                if (this.curLast < this.bucketSize - 1) {
                    ++this.curLast;
                }
                else if (this.last < this.bucketNum - 1) {
                    ++this.last;
                    this.curLast = 0;
                }
            }
            ++this.length;
            this.map[this.last][this.curLast] = element;
        };
        Deque.prototype.popBack = function () {
            if (this.empty())
                return;
            if (this.length !== 1) {
                if (this.curLast > 0) {
                    --this.curLast;
                }
                else if (this.first < this.last) {
                    --this.last;
                    this.curLast = this.bucketSize - 1;
                }
            }
            if (this.length > 0)
                --this.length;
        };
        /**
         * Push the element to the front.
         */
        Deque.prototype.pushFront = function (element) {
            checkUndefinedParams(element);
            if (!this.empty()) {
                if (this.first === 0 && this.curFirst === 0) {
                    this.reAllocate(this.length);
                }
                if (this.curFirst > 0) {
                    --this.curFirst;
                }
                else if (this.first > 0) {
                    --this.first;
                    this.curFirst = this.bucketSize - 1;
                }
            }
            ++this.length;
            this.map[this.first][this.curFirst] = element;
        };
        /**
         * Remove the first element.
         */
        Deque.prototype.popFront = function () {
            if (this.empty())
                return;
            if (this.size() !== 1) {
                if (this.curFirst < this.bucketSize - 1) {
                    ++this.curFirst;
                }
                else if (this.first < this.last) {
                    ++this.first;
                    this.curFirst = 0;
                }
            }
            if (this.length > 0)
                --this.length;
        };
        Deque.prototype.forEach = function (callback) {
            if (this.empty())
                return;
            var index = 0;
            if (this.first === this.last) {
                for (var i = this.curFirst; i <= this.curLast; ++i) {
                    callback(this.map[this.first][i], index++);
                }
                return;
            }
            for (var i = this.curFirst; i < this.bucketSize; ++i) {
                callback(this.map[this.first][i], index++);
            }
            for (var i = this.first + 1; i < this.last; ++i) {
                for (var j = 0; j < this.bucketSize; ++j) {
                    callback(this.map[i][j], index++);
                }
            }
            for (var i = 0; i <= this.curLast; ++i) {
                callback(this.map[this.last][i], index++);
            }
        };
        Deque.prototype.getElementByPos = function (pos) {
            checkWithinAccessParams(pos, 0, this.size() - 1);
            var _a = this.getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            return this.map[curNodeBucketIndex][curNodePointerIndex];
        };
        Deque.prototype.setElementByPos = function (pos, element) {
            if (element === undefined || element === null) {
                this.eraseElementByPos(pos);
                return;
            }
            checkWithinAccessParams(pos, 0, this.length - 1);
            var _a = this.getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            this.map[curNodeBucketIndex][curNodePointerIndex] = element;
        };
        Deque.prototype.insert = function (pos, element, num) {
            var _this = this;
            if (num === void 0) { num = 1; }
            checkUndefinedParams(element);
            checkWithinAccessParams(pos, 0, this.length);
            if (pos === 0) {
                while (num--)
                    this.pushFront(element);
            }
            else if (pos === this.length) {
                while (num--)
                    this.pushBack(element);
            }
            else {
                var arr = [];
                for (var i = pos; i < this.length; ++i) {
                    arr.push(this.getElementByPos(i));
                }
                this.cut(pos - 1);
                for (var i = 0; i < num; ++i)
                    this.pushBack(element);
                arr.forEach(function (element) { return _this.pushBack(element); });
            }
        };
        /**
         * Remove all elements after the specified position (excluding the specified position).
         */
        Deque.prototype.cut = function (pos) {
            if (pos < 0) {
                this.clear();
                return;
            }
            var _a = this.getElementIndex(pos), curNodeBucketIndex = _a.curNodeBucketIndex, curNodePointerIndex = _a.curNodePointerIndex;
            this.last = curNodeBucketIndex;
            this.curLast = curNodePointerIndex;
            this.length = pos + 1;
        };
        Deque.prototype.eraseElementByPos = function (pos) {
            var _this = this;
            if (pos < 0 || pos > this.length) {
                checkWithinAccessParams(pos, 0, this.length - 1);
            }
            if (pos === 0)
                this.popFront();
            else if (pos === this.length - 1)
                this.popBack();
            else {
                var arr = [];
                for (var i = pos + 1; i < this.length; ++i) {
                    arr.push(this.getElementByPos(i));
                }
                this.cut(pos);
                this.popBack();
                arr.forEach(function (element) { return _this.pushBack(element); });
            }
        };
        Deque.prototype.eraseElementByValue = function (value) {
            if (this.empty())
                return;
            var arr = [];
            this.forEach(function (element) {
                if (element !== value) {
                    arr.push(element);
                }
            });
            var _length = arr.length;
            for (var i = 0; i < _length; ++i)
                this.setElementByPos(i, arr[i]);
            this.cut(_length - 1);
        };
        Deque.prototype.eraseElementByIterator = function (iter) {
            // @ts-ignore
            var node = iter.node;
            this.eraseElementByPos(node);
            iter = iter.next();
            return iter;
        };
        Deque.prototype.find = function (element) {
            var _this = this;
            var resIndex = (function () {
                if (_this.first === _this.last) {
                    for (var i = _this.curFirst; i <= _this.curLast; ++i) {
                        if (_this.map[_this.first][i] === element) {
                            return _this.getIndex(_this.first, i);
                        }
                    }
                    return undefined;
                }
                for (var i = _this.curFirst; i < _this.bucketSize; ++i) {
                    if (_this.map[_this.first][i] === element) {
                        return _this.getIndex(_this.first, i);
                    }
                }
                for (var i = _this.first + 1; i < _this.last; ++i) {
                    for (var j = 0; j < _this.bucketSize; ++j) {
                        if (_this.map[i][j] === element) {
                            return _this.getIndex(i, j);
                        }
                    }
                }
                for (var i = 0; i <= _this.curLast; ++i) {
                    if (_this.map[_this.last][i] === element) {
                        return _this.getIndex(_this.last, i);
                    }
                }
                return undefined;
            })();
            if (resIndex === undefined)
                return this.end();
            return new DequeIterator(resIndex, this.size.bind(this), this.getElementByPos.bind(this), this.setElementByPos.bind(this));
        };
        Deque.prototype.reverse = function () {
            var l = 0;
            var r = this.length - 1;
            while (l < r) {
                var tmp = this.getElementByPos(l);
                this.setElementByPos(l, this.getElementByPos(r));
                this.setElementByPos(r, tmp);
                ++l;
                --r;
            }
        };
        Deque.prototype.unique = function () {
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
            for (var i = 0; i < this.length; ++i) {
                this.setElementByPos(i, arr[i]);
            }
            this.cut(arr.length - 1);
        };
        Deque.prototype.sort = function (cmp) {
            var arr = [];
            this.forEach(function (element) {
                arr.push(element);
            });
            arr.sort(cmp);
            for (var i = 0; i < this.length; ++i)
                this.setElementByPos(i, arr[i]);
        };
        /**
         * Remove as much useless space as possible.
         */
        Deque.prototype.shrinkToFit = function () {
            var _this = this;
            if (this.empty())
                return;
            var arr = [];
            this.forEach(function (element) { return arr.push(element); });
            this.bucketNum = Math.max(Math.ceil(this.length / this.bucketSize), 1);
            this.length = this.first = this.last = this.curFirst = this.curLast = 0;
            this.map = [];
            for (var i = 0; i < this.bucketNum; ++i) {
                this.map.push(new Array(this.bucketSize));
            }
            arr.forEach(function (element) { return _this.pushBack(element); });
        };
        Deque.prototype[Symbol.iterator] = function () {
            return function () {
                var i, i, i, j, i;
                return __generator$4(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.length === 0)
                                return [2 /*return*/];
                            if (!(this.first === this.last)) return [3 /*break*/, 5];
                            i = this.curFirst;
                            _a.label = 1;
                        case 1:
                            if (!(i <= this.curLast)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.map[this.first][i]];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            ++i;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                        case 5:
                            i = this.curFirst;
                            _a.label = 6;
                        case 6:
                            if (!(i < this.bucketSize)) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.map[this.first][i]];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8:
                            ++i;
                            return [3 /*break*/, 6];
                        case 9:
                            i = this.first + 1;
                            _a.label = 10;
                        case 10:
                            if (!(i < this.last)) return [3 /*break*/, 15];
                            j = 0;
                            _a.label = 11;
                        case 11:
                            if (!(j < this.bucketSize)) return [3 /*break*/, 14];
                            return [4 /*yield*/, this.map[i][j]];
                        case 12:
                            _a.sent();
                            _a.label = 13;
                        case 13:
                            ++j;
                            return [3 /*break*/, 11];
                        case 14:
                            ++i;
                            return [3 /*break*/, 10];
                        case 15:
                            i = 0;
                            _a.label = 16;
                        case 16:
                            if (!(i <= this.curLast)) return [3 /*break*/, 19];
                            return [4 /*yield*/, this.map[this.last][i]];
                        case 17:
                            _a.sent();
                            _a.label = 18;
                        case 18:
                            ++i;
                            return [3 /*break*/, 16];
                        case 19: return [2 /*return*/];
                    }
                });
            }.bind(this)();
        };
        Deque.sigma = 3;
        Deque.initBucketSize = (1 << 12);
        return Deque;
    }(SequentialContainer));

    var __extends$7 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var PriorityQueue = /** @class */ (function (_super) {
        __extends$7(PriorityQueue, _super);
        function PriorityQueue(container, cmp) {
            if (container === void 0) { container = []; }
            if (cmp === void 0) { cmp = function (x, y) {
                if (x > y)
                    return -1;
                if (x < y)
                    return 1;
                return 0;
            }; }
            var _this = _super.call(this) || this;
            _this.priorityQueue = [];
            _this.cmp = cmp;
            container.forEach(function (element) { return _this.priorityQueue.push(element); });
            _this.length = _this.priorityQueue.length;
            for (var parent_1 = Math.floor((_this.length - 1) / 2); parent_1 >= 0; --parent_1) {
                var curParent = parent_1;
                var curChild = curParent * 2 + 1;
                while (curChild < _this.length) {
                    var leftChild = curChild;
                    var rightChild = leftChild + 1;
                    var minChild = leftChild;
                    if (rightChild < _this.length &&
                        _this.cmp(_this.priorityQueue[leftChild], _this.priorityQueue[rightChild]) > 0) {
                        minChild = rightChild;
                    }
                    if (_this.cmp(_this.priorityQueue[curParent], _this.priorityQueue[minChild]) <= 0)
                        break;
                    _this.swap(curParent, minChild);
                    curParent = minChild;
                    curChild = curParent * 2 + 1;
                }
            }
            return _this;
        }
        PriorityQueue.prototype.swap = function (x, y) {
            var tmp = this.priorityQueue[x];
            this.priorityQueue[x] = this.priorityQueue[y];
            this.priorityQueue[y] = tmp;
        };
        PriorityQueue.prototype.adjust = function (parent) {
            var leftChild = parent * 2 + 1;
            var rightChild = parent * 2 + 2;
            if (leftChild < this.length &&
                this.cmp(this.priorityQueue[parent], this.priorityQueue[leftChild]) > 0) {
                this.swap(parent, leftChild);
            }
            if (rightChild < this.length &&
                this.cmp(this.priorityQueue[parent], this.priorityQueue[rightChild]) > 0) {
                this.swap(parent, rightChild);
            }
        };
        PriorityQueue.prototype.clear = function () {
            this.length = 0;
            this.priorityQueue.length = 0;
        };
        /**
         * Inserts element and sorts the underlying container.
         */
        PriorityQueue.prototype.push = function (element) {
            this.priorityQueue.push(element);
            ++this.length;
            if (this.length === 1)
                return;
            var curNode = this.length - 1;
            while (curNode > 0) {
                var parent_2 = Math.floor((curNode - 1) / 2);
                if (this.cmp(this.priorityQueue[parent_2], element) <= 0)
                    break;
                this.adjust(parent_2);
                curNode = parent_2;
            }
        };
        /**
         * Removes the top element.
         */
        PriorityQueue.prototype.pop = function () {
            if (this.empty())
                return;
            if (this.length === 1) {
                --this.length;
                return;
            }
            var last = this.priorityQueue[this.length - 1];
            --this.length;
            var parent = 0;
            while (parent < this.length) {
                var leftChild = parent * 2 + 1;
                var rightChild = parent * 2 + 2;
                if (leftChild >= this.length)
                    break;
                var minChild = leftChild;
                if (rightChild < this.length &&
                    this.cmp(this.priorityQueue[leftChild], this.priorityQueue[rightChild]) > 0) {
                    minChild = rightChild;
                }
                if (this.cmp(this.priorityQueue[minChild], last) >= 0)
                    break;
                this.priorityQueue[parent] = this.priorityQueue[minChild];
                parent = minChild;
            }
            this.priorityQueue[parent] = last;
        };
        /**
         * Accesses the top element.
         */
        PriorityQueue.prototype.top = function () {
            return this.priorityQueue[0];
        };
        return PriorityQueue;
    }(Base));

    var TreeNode = /** @class */ (function () {
        function TreeNode(key, value) {
            this.color = true;
            this.key = undefined;
            this.value = undefined;
            this.parent = undefined;
            this.brother = undefined;
            this.leftChild = undefined;
            this.rightChild = undefined;
            this.key = key;
            this.value = value;
        }
        TreeNode.prototype.rotateLeft = function () {
            var PP = this.parent;
            var PB = this.brother;
            var F = this.leftChild;
            var V = this.rightChild;
            var R = V.leftChild;
            var X = V.rightChild;
            if (PP && PP.key !== undefined) {
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
            var V = this.rightChild;
            var D = F.leftChild;
            var K = F.rightChild;
            if (PP && PP.key !== undefined) {
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
            if (this.leftChild || this.rightChild) {
                throw new InternalError('can only remove leaf node');
            }
            if (this.parent) {
                if (this === this.parent.leftChild)
                    this.parent.leftChild = undefined;
                else if (this === this.parent.rightChild)
                    this.parent.rightChild = undefined;
            }
            if (this.brother)
                this.brother.brother = undefined;
            this.key = undefined;
            this.value = undefined;
            this.parent = undefined;
            this.brother = undefined;
        };
        TreeNode.TreeNodeColorType = {
            red: true,
            black: false
        };
        return TreeNode;
    }());

    var __extends$6 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var TreeBaseContainer = /** @class */ (function (_super) {
        __extends$6(TreeBaseContainer, _super);
        function TreeBaseContainer(cmp) {
            if (cmp === void 0) { cmp = function (x, y) {
                if (x < y)
                    return -1;
                if (x > y)
                    return 1;
                return 0;
            }; }
            var _this = _super.call(this) || this;
            _this.root = new TreeNode();
            _this.header = new TreeNode();
            _this.findSubTreeMinNode = function (curNode) {
                return curNode.leftChild ? _this.findSubTreeMinNode(curNode.leftChild) : curNode;
            };
            _this.findSubTreeMaxNode = function (curNode) {
                return curNode.rightChild ? _this.findSubTreeMaxNode(curNode.rightChild) : curNode;
            };
            _this._lowerBound = function (curNode, key) {
                if (!curNode || curNode.key === undefined)
                    return undefined;
                var cmpResult = _this.cmp(curNode.key, key);
                if (cmpResult === 0)
                    return curNode;
                if (cmpResult < 0)
                    return _this._lowerBound(curNode.rightChild, key);
                var resNode = _this._lowerBound(curNode.leftChild, key);
                if (resNode === undefined)
                    return curNode;
                return resNode;
            };
            _this._upperBound = function (curNode, key) {
                if (!curNode || curNode.key === undefined)
                    return undefined;
                var cmpResult = _this.cmp(curNode.key, key);
                if (cmpResult <= 0)
                    return _this._upperBound(curNode.rightChild, key);
                var resNode = _this._upperBound(curNode.leftChild, key);
                if (resNode === undefined)
                    return curNode;
                return resNode;
            };
            _this._reverseLowerBound = function (curNode, key) {
                if (!curNode || curNode.key === undefined)
                    return undefined;
                var cmpResult = _this.cmp(curNode.key, key);
                if (cmpResult === 0)
                    return curNode;
                if (cmpResult > 0)
                    return _this._reverseLowerBound(curNode.leftChild, key);
                var resNode = _this._reverseLowerBound(curNode.rightChild, key);
                if (resNode === undefined)
                    return curNode;
                return resNode;
            };
            _this._reverseUpperBound = function (curNode, key) {
                if (!curNode || curNode.key === undefined)
                    return undefined;
                var cmpResult = _this.cmp(curNode.key, key);
                if (cmpResult >= 0)
                    return _this._reverseUpperBound(curNode.leftChild, key);
                var resNode = _this._reverseUpperBound(curNode.rightChild, key);
                if (resNode === undefined)
                    return curNode;
                return resNode;
            };
            _this.inOrderTraversal = function (curNode, callback) {
                if (!curNode || curNode.key === undefined)
                    return false;
                var ifReturn = _this.inOrderTraversal(curNode.leftChild, callback);
                if (ifReturn)
                    return true;
                if (callback(curNode))
                    return true;
                return _this.inOrderTraversal(curNode.rightChild, callback);
            };
            _this.findInsertPos = function (curNode, key) {
                var cmpResult = _this.cmp(key, curNode.key);
                if (cmpResult < 0) {
                    if (!curNode.leftChild) {
                        curNode.leftChild = new TreeNode();
                        curNode.leftChild.parent = curNode;
                        curNode.leftChild.brother = curNode.rightChild;
                        if (curNode.rightChild)
                            curNode.rightChild.brother = curNode.leftChild;
                        return curNode.leftChild;
                    }
                    return _this.findInsertPos(curNode.leftChild, key);
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
                    return _this.findInsertPos(curNode.rightChild, key);
                }
                return curNode;
            };
            _this.findElementNode = function (curNode, key) {
                if (!curNode || curNode.key === undefined)
                    return undefined;
                var cmpResult = _this.cmp(key, curNode.key);
                if (cmpResult < 0)
                    return _this.findElementNode(curNode.leftChild, key);
                else if (cmpResult > 0)
                    return _this.findElementNode(curNode.rightChild, key);
                return curNode;
            };
            _this.root.color = TreeNode.TreeNodeColorType.black;
            _this.header.parent = _this.root;
            _this.root.parent = _this.header;
            _this.cmp = cmp;
            return _this;
        }
        TreeBaseContainer.prototype.eraseNodeSelfBalance = function (curNode) {
            var parentNode = curNode.parent;
            if (!parentNode || parentNode === this.header)
                return;
            if (curNode.color === TreeNode.TreeNodeColorType.red) {
                curNode.color = TreeNode.TreeNodeColorType.black;
                return;
            }
            var brotherNode = curNode.brother;
            if (curNode === parentNode.leftChild) {
                if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.black;
                    parentNode.color = TreeNode.TreeNodeColorType.red;
                    var newRoot = parentNode.rotateLeft();
                    if (this.root === parentNode) {
                        this.root = newRoot;
                        this.header.parent = this.root;
                        this.root.parent = this.header;
                    }
                    this.eraseNodeSelfBalance(curNode);
                }
                else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                    if (brotherNode.rightChild &&
                        brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = parentNode.color;
                        parentNode.color = TreeNode.TreeNodeColorType.black;
                        if (brotherNode.rightChild) {
                            brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                        }
                        var newRoot = parentNode.rotateLeft();
                        if (this.root === parentNode) {
                            this.root = newRoot;
                            this.header.parent = this.root;
                            this.root.parent = this.header;
                        }
                        curNode.color = TreeNode.TreeNodeColorType.black;
                    }
                    else if ((!brotherNode.rightChild ||
                        brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black) &&
                        brotherNode.leftChild &&
                        brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        if (brotherNode.leftChild) {
                            brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                        }
                        var newRoot = brotherNode.rotateRight();
                        if (this.root === brotherNode) {
                            this.root = newRoot;
                            this.header.parent = this.root;
                            this.root.parent = this.header;
                        }
                        this.eraseNodeSelfBalance(curNode);
                    }
                    else if ((!brotherNode.leftChild ||
                        brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild ||
                        brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        this.eraseNodeSelfBalance(parentNode);
                    }
                }
            }
            else if (curNode === parentNode.rightChild) {
                if (brotherNode.color === TreeNode.TreeNodeColorType.red) {
                    brotherNode.color = TreeNode.TreeNodeColorType.black;
                    parentNode.color = TreeNode.TreeNodeColorType.red;
                    var newRoot = parentNode.rotateRight();
                    if (this.root === parentNode) {
                        this.root = newRoot;
                        this.header.parent = this.root;
                        this.root.parent = this.header;
                    }
                    this.eraseNodeSelfBalance(curNode);
                }
                else if (brotherNode.color === TreeNode.TreeNodeColorType.black) {
                    if (brotherNode.leftChild &&
                        brotherNode.leftChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = parentNode.color;
                        parentNode.color = TreeNode.TreeNodeColorType.black;
                        if (brotherNode.leftChild)
                            brotherNode.leftChild.color = TreeNode.TreeNodeColorType.black;
                        var newRoot = parentNode.rotateRight();
                        if (this.root === parentNode) {
                            this.root = newRoot;
                            this.header.parent = this.root;
                            this.root.parent = this.header;
                        }
                        curNode.color = TreeNode.TreeNodeColorType.black;
                    }
                    else if ((!brotherNode.leftChild ||
                        brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) &&
                        brotherNode.rightChild &&
                        brotherNode.rightChild.color === TreeNode.TreeNodeColorType.red) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        if (brotherNode.rightChild) {
                            brotherNode.rightChild.color = TreeNode.TreeNodeColorType.black;
                        }
                        var newRoot = brotherNode.rotateLeft();
                        if (this.root === brotherNode) {
                            this.root = newRoot;
                            this.header.parent = this.root;
                            this.root.parent = this.header;
                        }
                        this.eraseNodeSelfBalance(curNode);
                    }
                    else if ((!brotherNode.leftChild ||
                        brotherNode.leftChild.color === TreeNode.TreeNodeColorType.black) && (!brotherNode.rightChild ||
                        brotherNode.rightChild.color === TreeNode.TreeNodeColorType.black)) {
                        brotherNode.color = TreeNode.TreeNodeColorType.red;
                        this.eraseNodeSelfBalance(parentNode);
                    }
                }
            }
        };
        TreeBaseContainer.prototype.eraseNode = function (curNode) {
            var swapNode = curNode;
            while (swapNode.leftChild || swapNode.rightChild) {
                if (swapNode.rightChild) {
                    swapNode = this.findSubTreeMinNode(swapNode.rightChild);
                    var tmpKey = curNode.key;
                    curNode.key = swapNode.key;
                    swapNode.key = tmpKey;
                    var tmpValue = curNode.value;
                    curNode.value = swapNode.value;
                    swapNode.value = tmpValue;
                    curNode = swapNode;
                }
                if (swapNode.leftChild) {
                    swapNode = this.findSubTreeMaxNode(swapNode.leftChild);
                    var tmpKey = curNode.key;
                    curNode.key = swapNode.key;
                    swapNode.key = tmpKey;
                    var tmpValue = curNode.value;
                    curNode.value = swapNode.value;
                    swapNode.value = tmpValue;
                    curNode = swapNode;
                }
            }
            if (this.header.leftChild &&
                this.header.leftChild.key !== undefined &&
                this.cmp(this.header.leftChild.key, swapNode.key) === 0) {
                if (this.header.leftChild !== this.root) {
                    this.header.leftChild = this.header.leftChild.parent;
                }
                else if (this.header.leftChild.rightChild) {
                    this.header.leftChild = this.header.leftChild.rightChild;
                }
                else {
                    this.header.leftChild = undefined;
                }
            }
            if (this.header.rightChild &&
                this.header.rightChild.key !== undefined &&
                this.cmp(this.header.rightChild.key, swapNode.key) === 0) {
                if (this.header.rightChild !== this.root) {
                    this.header.rightChild = this.header.rightChild.parent;
                }
                else if (this.header.rightChild.leftChild) {
                    this.header.rightChild = this.header.rightChild.leftChild;
                }
                else {
                    this.header.rightChild = undefined;
                }
            }
            this.eraseNodeSelfBalance(swapNode);
            if (swapNode)
                swapNode.remove();
            --this.length;
            this.root.color = TreeNode.TreeNodeColorType.black;
        };
        TreeBaseContainer.prototype.insertNodeSelfBalance = function (curNode) {
            var parentNode = curNode.parent;
            if (!parentNode || parentNode === this.header)
                return;
            if (parentNode.color === TreeNode.TreeNodeColorType.black)
                return;
            if (parentNode.color === TreeNode.TreeNodeColorType.red) {
                var uncleNode = parentNode.brother;
                var grandParent = parentNode.parent;
                if (uncleNode && uncleNode.color === TreeNode.TreeNodeColorType.red) {
                    uncleNode.color = parentNode.color = TreeNode.TreeNodeColorType.black;
                    grandParent.color = TreeNode.TreeNodeColorType.red;
                    this.insertNodeSelfBalance(grandParent);
                }
                else if (!uncleNode || uncleNode.color === TreeNode.TreeNodeColorType.black) {
                    if (parentNode === grandParent.leftChild) {
                        if (curNode === parentNode.leftChild) {
                            parentNode.color = TreeNode.TreeNodeColorType.black;
                            grandParent.color = TreeNode.TreeNodeColorType.red;
                            var newRoot = grandParent.rotateRight();
                            if (grandParent === this.root) {
                                this.root = newRoot;
                                this.header.parent = this.root;
                                this.root.parent = this.header;
                            }
                        }
                        else if (curNode === parentNode.rightChild) {
                            var newRoot = parentNode.rotateLeft();
                            if (parentNode === this.root) {
                                this.root = newRoot;
                                this.header.parent = this.root;
                                this.root.parent = this.header;
                            }
                            this.insertNodeSelfBalance(parentNode);
                        }
                    }
                    else if (parentNode === grandParent.rightChild) {
                        if (curNode === parentNode.leftChild) {
                            var newRoot = parentNode.rotateRight();
                            if (parentNode === this.root) {
                                this.root = newRoot;
                                this.header.parent = this.root;
                                this.root.parent = this.header;
                            }
                            this.insertNodeSelfBalance(parentNode);
                        }
                        else if (curNode === parentNode.rightChild) {
                            parentNode.color = TreeNode.TreeNodeColorType.black;
                            grandParent.color = TreeNode.TreeNodeColorType.red;
                            var newRoot = grandParent.rotateLeft();
                            if (grandParent === this.root) {
                                this.root = newRoot;
                                this.header.parent = this.root;
                                this.root.parent = this.header;
                            }
                        }
                    }
                }
            }
        };
        TreeBaseContainer.prototype.clear = function () {
            this.length = 0;
            this.root.key = this.root.value = undefined;
            this.root.leftChild = this.root.rightChild = this.root.brother = undefined;
            this.header.leftChild = this.header.rightChild = undefined;
        };
        TreeBaseContainer.prototype.eraseElementByPos = function (pos) {
            var _this = this;
            checkWithinAccessParams(pos, 0, this.length - 1);
            var index = 0;
            this.inOrderTraversal(this.root, function (curNode) {
                if (pos === index) {
                    _this.eraseNode(curNode);
                    return true;
                }
                ++index;
                return false;
            });
        };
        /**
         * Removes the elements of the specified key.
         */
        TreeBaseContainer.prototype.eraseElementByKey = function (key) {
            if (this.empty())
                return;
            var curNode = this.findElementNode(this.root, key);
            if (curNode === undefined ||
                curNode.key === undefined ||
                this.cmp(curNode.key, key) !== 0)
                return;
            this.eraseNode(curNode);
        };
        /**
         * @return The height of the RB-tree.
         */
        TreeBaseContainer.prototype.getHeight = function () {
            if (this.empty())
                return 0;
            var traversal = function (curNode) {
                if (!curNode)
                    return 1;
                return Math.max(traversal(curNode.leftChild), traversal(curNode.rightChild)) + 1;
            };
            return traversal(this.root);
        };
        return TreeBaseContainer;
    }(Base));

    var __extends$5 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var TreeIterator = /** @class */ (function (_super) {
        __extends$5(TreeIterator, _super);
        function TreeIterator(node, header, iteratorType) {
            var _this = _super.call(this, node, iteratorType) || this;
            _this.header = header;
            return _this;
        }
        TreeIterator.prototype._pre = function () {
            var preNode = this.node;
            if (preNode.color === TreeNode.TreeNodeColorType.red &&
                preNode.parent.parent === preNode) {
                preNode = preNode.rightChild;
            }
            else if (preNode.leftChild) {
                preNode = preNode.leftChild;
                while (preNode.rightChild) {
                    preNode = preNode.rightChild;
                }
            }
            else {
                var pre = preNode.parent;
                while (pre.leftChild === preNode) {
                    preNode = pre;
                    pre = preNode.parent;
                }
                preNode = pre;
            }
            return preNode;
        };
        TreeIterator.prototype._next = function () {
            var nextNode = this.node;
            if (nextNode.rightChild) {
                nextNode = nextNode.rightChild;
                while (nextNode.leftChild) {
                    nextNode = nextNode.leftChild;
                }
            }
            else {
                var pre = nextNode.parent;
                while (pre.rightChild === nextNode) {
                    nextNode = pre;
                    pre = nextNode.parent;
                }
                if (nextNode.rightChild !== pre) {
                    nextNode = pre;
                }
            }
            return nextNode;
        };
        TreeIterator.prototype.pre = function () {
            if (this.iteratorType === 'reverse') {
                if (this.node === this.header.rightChild) {
                    throw new RunTimeError('Tree iterator access denied!');
                }
                this.node = this._next();
            }
            else {
                if (this.node === this.header.leftChild) {
                    throw new RunTimeError('Tree iterator access denied!');
                }
                this.node = this._pre();
            }
            return this;
        };
        TreeIterator.prototype.next = function () {
            if (this.iteratorType === 'reverse') {
                if (this.node === this.header) {
                    throw new RunTimeError('Tree iterator access denied!');
                }
                this.node = this._pre();
            }
            else {
                if (this.node === this.header) {
                    throw new RunTimeError('Tree iterator access denied!');
                }
                this.node = this._next();
            }
            return this;
        };
        TreeIterator.prototype.equals = function (obj) {
            if (obj.constructor.name !== this.constructor.name) {
                throw new TypeError("obj's constructor is not ".concat(this.constructor.name, "!"));
            }
            if (this.iteratorType !== obj.iteratorType) {
                throw new TypeError('iterator type error!');
            }
            // @ts-ignore
            return this.node === obj.node;
        };
        return TreeIterator;
    }(ContainerIterator));

    var __extends$4 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __generator$3 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __values$3 = (undefined && undefined.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var OrderedSetIterator = /** @class */ (function (_super) {
        __extends$4(OrderedSetIterator, _super);
        function OrderedSetIterator(node, header, iteratorType) {
            if (iteratorType === void 0) { iteratorType = 'normal'; }
            return _super.call(this, node, header, iteratorType) || this;
        }
        Object.defineProperty(OrderedSetIterator.prototype, "pointer", {
            get: function () {
                if (this.node.key === undefined) {
                    throw new RunTimeError('OrderedSet iterator access denied!');
                }
                return this.node.key;
            },
            enumerable: false,
            configurable: true
        });
        return OrderedSetIterator;
    }(TreeIterator));
    var OrderedSet = /** @class */ (function (_super) {
        __extends$4(OrderedSet, _super);
        function OrderedSet(container, cmp) {
            if (container === void 0) { container = []; }
            var _this = _super.call(this, cmp) || this;
            _this.iterationFunc = function (curNode) {
                return __generator$3(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!curNode || curNode.key === undefined)
                                return [2 /*return*/];
                            return [5 /*yield**/, __values$3(this.iterationFunc(curNode.leftChild))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, curNode.key];
                        case 2:
                            _a.sent();
                            return [5 /*yield**/, __values$3(this.iterationFunc(curNode.rightChild))];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            };
            container.forEach(function (element) { return _this.insert(element); });
            _this.iterationFunc = _this.iterationFunc.bind(_this);
            return _this;
        }
        OrderedSet.prototype.begin = function () {
            return new OrderedSetIterator(this.header.leftChild || this.header, this.header);
        };
        OrderedSet.prototype.end = function () {
            return new OrderedSetIterator(this.header, this.header);
        };
        OrderedSet.prototype.rBegin = function () {
            return new OrderedSetIterator(this.header.rightChild || this.header, this.header, 'reverse');
        };
        OrderedSet.prototype.rEnd = function () {
            return new OrderedSetIterator(this.header, this.header, 'reverse');
        };
        OrderedSet.prototype.front = function () {
            var _a;
            return (_a = this.header.leftChild) === null || _a === void 0 ? void 0 : _a.key;
        };
        OrderedSet.prototype.back = function () {
            var _a;
            return (_a = this.header.rightChild) === null || _a === void 0 ? void 0 : _a.key;
        };
        OrderedSet.prototype.forEach = function (callback) {
            var e_1, _a;
            var index = 0;
            try {
                for (var _b = __values$3(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var element = _c.value;
                    callback(element, index++);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        OrderedSet.prototype.getElementByPos = function (pos) {
            var e_2, _a;
            checkWithinAccessParams(pos, 0, this.length - 1);
            var index = 0;
            try {
                for (var _b = __values$3(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var element = _c.value;
                    if (index === pos)
                        return element;
                    ++index;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        OrderedSet.prototype.eraseElementByIterator = function (iter) {
            // @ts-ignore
            var node = iter.node;
            iter = iter.next();
            this.eraseNode(node);
            return iter;
        };
        /**
         * Inserts element to Set.
         */
        OrderedSet.prototype.insert = function (element) {
            checkUndefinedParams(element);
            if (this.empty()) {
                ++this.length;
                this.root.key = element;
                this.root.color = TreeNode.TreeNodeColorType.black;
                this.header.leftChild = this.root;
                this.header.rightChild = this.root;
                return;
            }
            var curNode = this.findInsertPos(this.root, element);
            if (curNode.key !== undefined && this.cmp(curNode.key, element) === 0) {
                return;
            }
            ++this.length;
            curNode.key = element;
            if (this.header.leftChild === undefined ||
                this.header.leftChild.key === undefined ||
                this.cmp(this.header.leftChild.key, element) > 0) {
                this.header.leftChild = curNode;
            }
            if (this.header.rightChild === undefined ||
                this.header.rightChild.key === undefined ||
                this.cmp(this.header.rightChild.key, element) < 0) {
                this.header.rightChild = curNode;
            }
            this.insertNodeSelfBalance(curNode);
            this.root.color = TreeNode.TreeNodeColorType.black;
        };
        OrderedSet.prototype.find = function (element) {
            var curNode = this.findElementNode(this.root, element);
            if (curNode !== undefined && curNode.key !== undefined) {
                return new OrderedSetIterator(curNode, this.header);
            }
            return this.end();
        };
        /**
         * @return An iterator to the first element not less than the given key.
         */
        OrderedSet.prototype.lowerBound = function (key) {
            var resNode = this._lowerBound(this.root, key);
            return resNode === undefined
                ? this.end()
                : new OrderedSetIterator(resNode, this.header);
        };
        /**
         * @return An iterator to the first element greater than the given key.
         */
        OrderedSet.prototype.upperBound = function (key) {
            var resNode = this._upperBound(this.root, key);
            return resNode === undefined
                ? this.end()
                : new OrderedSetIterator(resNode, this.header);
        };
        /**
         * @return An iterator to the first element not greater than the given key.
         */
        OrderedSet.prototype.reverseLowerBound = function (key) {
            var resNode = this._reverseLowerBound(this.root, key);
            return resNode === undefined
                ? this.end()
                : new OrderedSetIterator(resNode, this.header);
        };
        /**
         * @return An iterator to the first element less than the given key.
         */
        OrderedSet.prototype.reverseUpperBound = function (key) {
            var resNode = this._reverseUpperBound(this.root, key);
            return resNode === undefined
                ? this.end()
                : new OrderedSetIterator(resNode, this.header);
        };
        /**
         * Union the other Set to self.
         * Waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
         * More information => https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations
         */
        OrderedSet.prototype.union = function (other) {
            var _this = this;
            other.forEach(function (element) { return _this.insert(element); });
        };
        OrderedSet.prototype[Symbol.iterator] = function () {
            return this.iterationFunc(this.root);
        };
        return OrderedSet;
    }(TreeBaseContainer));

    var __extends$3 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __read = (undefined && undefined.__read) || function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };
    var __values$2 = (undefined && undefined.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var OrderedMapIterator = /** @class */ (function (_super) {
        __extends$3(OrderedMapIterator, _super);
        function OrderedMapIterator(node, header, iteratorType) {
            if (iteratorType === void 0) { iteratorType = 'normal'; }
            return _super.call(this, node, header, iteratorType) || this;
        }
        Object.defineProperty(OrderedMapIterator.prototype, "pointer", {
            get: function () {
                var _this = this;
                if (this.node.key === undefined) {
                    throw new RunTimeError('OrderedMap iterator access denied');
                }
                return new Proxy([this.node.key, this.node.value], {
                    get: function (_, prop) {
                        var index = Number(prop);
                        if (Number.isNaN(index)) {
                            throw new TypeError('prop must be number');
                        }
                        checkWithinAccessParams(index, 0, 1);
                        return index === 0 ? _this.node.key : _this.node.value;
                    },
                    set: function (_, prop, newValue) {
                        var index = Number(prop);
                        if (Number.isNaN(index)) {
                            throw new TypeError('prop must be number');
                        }
                        checkWithinAccessParams(index, 1, 1);
                        _this.node.value = newValue;
                        return true;
                    }
                });
            },
            enumerable: false,
            configurable: true
        });
        return OrderedMapIterator;
    }(TreeIterator));
    var OrderedMap = /** @class */ (function (_super) {
        __extends$3(OrderedMap, _super);
        function OrderedMap(container, cmp) {
            if (container === void 0) { container = []; }
            var _this = _super.call(this, cmp) || this;
            _this.iterationFunc = function (curNode) {
                return __generator$2(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!curNode || curNode.key === undefined || curNode.value === undefined)
                                return [2 /*return*/];
                            return [5 /*yield**/, __values$2(this.iterationFunc(curNode.leftChild))];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, [curNode.key, curNode.value]];
                        case 2:
                            _a.sent();
                            return [5 /*yield**/, __values$2(this.iterationFunc(curNode.rightChild))];
                        case 3:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            };
            _this.iterationFunc = _this.iterationFunc.bind(_this);
            container.forEach(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                return _this.setElement(key, value);
            });
            return _this;
        }
        /**
         * @return Iterator pointing to the begin element.
         */
        OrderedMap.prototype.begin = function () {
            return new OrderedMapIterator(this.header.leftChild || this.header, this.header);
        };
        /**
         * @return Iterator pointing to the super end like c++.
         */
        OrderedMap.prototype.end = function () {
            return new OrderedMapIterator(this.header, this.header);
        };
        /**
         * @return Iterator pointing to the end element.
         */
        OrderedMap.prototype.rBegin = function () {
            return new OrderedMapIterator(this.header.rightChild || this.header, this.header, 'reverse');
        };
        /**
         * @return Iterator pointing to the super begin like c++.
         */
        OrderedMap.prototype.rEnd = function () {
            return new OrderedMapIterator(this.header, this.header, 'reverse');
        };
        /**
         * @return The first element.
         */
        OrderedMap.prototype.front = function () {
            if (this.empty())
                return undefined;
            var minNode = this.header.leftChild;
            return [minNode.key, minNode.value];
        };
        /**
         * @return The last element.
         */
        OrderedMap.prototype.back = function () {
            if (this.empty())
                return undefined;
            var maxNode = this.header.rightChild;
            return [maxNode.key, maxNode.value];
        };
        /**
         * @param callback callback function, it's first param is an array which type is [key, value].
         */
        OrderedMap.prototype.forEach = function (callback) {
            var e_1, _a;
            var index = 0;
            try {
                for (var _b = __values$2(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var pair = _c.value;
                    callback(pair, index++);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        /**
         * @return An iterator to the first element not less than the given key.
         */
        OrderedMap.prototype.lowerBound = function (key) {
            var resNode = this._lowerBound(this.root, key);
            return resNode === undefined ? this.end() : new OrderedMapIterator(resNode, this.header);
        };
        /**
         * @return An iterator to the first element greater than the given key.
         */
        OrderedMap.prototype.upperBound = function (key) {
            var resNode = this._upperBound(this.root, key);
            return resNode === undefined ? this.end() : new OrderedMapIterator(resNode, this.header);
        };
        /**
         * @return An iterator to the first element not greater than the given key.
         */
        OrderedMap.prototype.reverseLowerBound = function (key) {
            var resNode = this._reverseLowerBound(this.root, key);
            return resNode === undefined ? this.end() : new OrderedMapIterator(resNode, this.header);
        };
        /**
         * @return An iterator to the first element less than the given key.
         */
        OrderedMap.prototype.reverseUpperBound = function (key) {
            var resNode = this._reverseUpperBound(this.root, key);
            return resNode === undefined ? this.end() : new OrderedMapIterator(resNode, this.header);
        };
        /**
         * Insert a new key-value pair or set value by key.
         */
        OrderedMap.prototype.setElement = function (key, value) {
            checkUndefinedParams(key);
            if (value === null || value === undefined) {
                this.eraseElementByKey(key);
                return;
            }
            if (this.empty()) {
                ++this.length;
                this.root.key = key;
                this.root.value = value;
                this.root.color = TreeNode.TreeNodeColorType.black;
                this.header.leftChild = this.root;
                this.header.rightChild = this.root;
                return;
            }
            var curNode = this.findInsertPos(this.root, key);
            if (curNode.key !== undefined && this.cmp(curNode.key, key) === 0) {
                curNode.value = value;
                return;
            }
            ++this.length;
            curNode.key = key;
            curNode.value = value;
            if (this.header.leftChild === undefined ||
                this.header.leftChild.key === undefined ||
                this.cmp(this.header.leftChild.key, key) > 0) {
                this.header.leftChild = curNode;
            }
            if (this.header.rightChild === undefined ||
                this.header.rightChild.key === undefined ||
                this.cmp(this.header.rightChild.key, key) < 0) {
                this.header.rightChild = curNode;
            }
            this.insertNodeSelfBalance(curNode);
            this.root.color = TreeNode.TreeNodeColorType.black;
        };
        /**
         * @param key The key you want to find.
         * @return Iterator pointing to the element if found, or super end if not found.
         */
        OrderedMap.prototype.find = function (key) {
            var curNode = this.findElementNode(this.root, key);
            if (curNode !== undefined && curNode.key !== undefined) {
                return new OrderedMapIterator(curNode, this.header);
            }
            return this.end();
        };
        /**
         * Gets the value of the element of the specified key.
         */
        OrderedMap.prototype.getElementByKey = function (key) {
            var curNode = this.findElementNode(this.root, key);
            if ((curNode === null || curNode === void 0 ? void 0 : curNode.value) === undefined)
                return undefined;
            return curNode.value;
        };
        OrderedMap.prototype.getElementByPos = function (pos) {
            var e_2, _a;
            checkWithinAccessParams(pos, 0, this.length - 1);
            var index = 0;
            try {
                for (var _b = __values$2(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var pair = _c.value;
                    if (index === pos)
                        return pair;
                    ++index;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        /**
         * @return An iterator point to the next iterator.
         * Removes element by iterator.
         */
        OrderedMap.prototype.eraseElementByIterator = function (iter) {
            // @ts-ignore
            var node = iter.node;
            iter = iter.next();
            this.eraseNode(node);
            return iter;
        };
        /**
         * Union the other Set to self.
         * waiting for optimization, this is O(mlog(n+m)) algorithm now, but we expect it to be O(mlog(n/m+1)).
         * More information => https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Set_operations_and_bulk_operations
         */
        OrderedMap.prototype.union = function (other) {
            var _this = this;
            other.forEach(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                return _this.setElement(key, value);
            });
        };
        /**
         * Using for 'for...of' syntax like Array.
         */
        OrderedMap.prototype[Symbol.iterator] = function () {
            return this.iterationFunc(this.root);
        };
        return OrderedMap;
    }(TreeBaseContainer));

    var __extends$2 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var HashContainerBase = /** @class */ (function (_super) {
        __extends$2(HashContainerBase, _super);
        function HashContainerBase(initBucketNum, hashFunc) {
            if (initBucketNum === void 0) { initBucketNum = HashContainerBase.initBucketNum; }
            if (hashFunc === void 0) { hashFunc = function (x) {
                var hashCode = 0;
                var str = '';
                if (typeof x !== 'string') {
                    str = JSON.stringify(x);
                }
                else
                    str = x;
                for (var i = 0; i < str.length; i++) {
                    var character = str.charCodeAt(i);
                    hashCode = ((hashCode << 5) - hashCode) + character;
                    hashCode = hashCode & hashCode;
                }
                hashCode ^= (hashCode >>> 16);
                return hashCode;
            }; }
            var _this = _super.call(this) || this;
            if ((initBucketNum & (initBucketNum - 1)) !== 0) {
                throw new ContainerInitError('initBucketNum must be 2 to the power of n');
            }
            _this.initBucketNum = Math.max(initBucketNum, HashContainerBase.initBucketNum);
            _this.bucketNum = _this.initBucketNum;
            _this.hashFunc = hashFunc;
            return _this;
        }
        HashContainerBase.maxBucketNum = (1 << 30);
        HashContainerBase.initBucketNum = (1 << 4);
        HashContainerBase.sigma = 0.75;
        HashContainerBase.treeifyThreshold = 8;
        HashContainerBase.untreeifyThreshold = 6;
        HashContainerBase.minTreeifySize = 64;
        return HashContainerBase;
    }(Base));

    var __extends$1 = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __values$1 = (undefined && undefined.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var HashSet = /** @class */ (function (_super) {
        __extends$1(HashSet, _super);
        function HashSet(container, initBucketNum, hashFunc) {
            if (container === void 0) { container = []; }
            var _this = _super.call(this, initBucketNum, hashFunc) || this;
            _this.hashTable = [];
            container.forEach(function (element) { return _this.insert(element); });
            return _this;
        }
        HashSet.prototype.reAllocate = function (originalBucketNum) {
            var _this = this;
            if (originalBucketNum >= HashSet.maxBucketNum)
                return;
            this.bucketNum = originalBucketNum * 2;
            var newHashTable = [];
            this.hashTable.forEach(function (container, index) {
                if (container.empty())
                    return;
                if (container instanceof LinkList && container.size() === 1) {
                    var element = container.front();
                    newHashTable[_this.hashFunc(element) & (_this.bucketNum - 1)] = new LinkList([element]);
                }
                else if (container instanceof OrderedSet) {
                    var lowList_1 = new LinkList();
                    var highList_1 = new LinkList();
                    container.forEach(function (element) {
                        var hashCode = _this.hashFunc(element);
                        if ((hashCode & originalBucketNum) === 0) {
                            lowList_1.pushBack(element);
                        }
                        else
                            highList_1.pushBack(element);
                    });
                    if (lowList_1.size() > HashSet.untreeifyThreshold) {
                        newHashTable[index] = new OrderedSet(lowList_1);
                    }
                    else if (lowList_1.size()) {
                        newHashTable[index] = lowList_1;
                    }
                    if (highList_1.size() > HashSet.untreeifyThreshold) {
                        newHashTable[index + originalBucketNum] = new OrderedSet(highList_1);
                    }
                    else if (highList_1.size()) {
                        newHashTable[index + originalBucketNum] = highList_1;
                    }
                }
                else {
                    var lowList_2 = new LinkList();
                    var highList_2 = new LinkList();
                    container.forEach(function (element) {
                        var hashCode = _this.hashFunc(element);
                        if ((hashCode & originalBucketNum) === 0) {
                            lowList_2.pushBack(element);
                        }
                        else
                            highList_2.pushBack(element);
                    });
                    if (lowList_2.size() >= HashSet.treeifyThreshold) {
                        newHashTable[index] = new OrderedSet(lowList_2);
                    }
                    else if (lowList_2.size()) {
                        newHashTable[index] = lowList_2;
                    }
                    if (highList_2.size() >= HashSet.treeifyThreshold) {
                        newHashTable[index + originalBucketNum] = new OrderedSet(highList_2);
                    }
                    else if (highList_2.size()) {
                        newHashTable[index + originalBucketNum] = highList_2;
                    }
                }
                _this.hashTable[index].clear();
            });
            this.hashTable = newHashTable;
        };
        HashSet.prototype.clear = function () {
            this.length = 0;
            this.bucketNum = this.initBucketNum;
            this.hashTable = [];
        };
        HashSet.prototype.forEach = function (callback) {
            var index = 0;
            this.hashTable.forEach(function (container) {
                container.forEach(function (element) {
                    callback(element, index++);
                });
            });
        };
        /**
         * Inserts element to Set.
         */
        HashSet.prototype.insert = function (element) {
            checkUndefinedParams(element);
            var index = this.hashFunc(element) & (this.bucketNum - 1);
            if (!this.hashTable[index]) {
                this.hashTable[index] = new LinkList([element]);
                ++this.length;
            }
            else {
                var preSize = this.hashTable[index].size();
                if (this.hashTable[index] instanceof LinkList) {
                    if (!this.hashTable[index].find(element)
                        .equals(this.hashTable[index].end()))
                        return;
                    this.hashTable[index].pushBack(element);
                    if (this.bucketNum <= HashSet.minTreeifySize) {
                        ++this.length;
                        this.reAllocate(this.bucketNum);
                        return;
                    }
                    else if (this.hashTable[index].size() >= HashSet.treeifyThreshold) {
                        this.hashTable[index] = new OrderedSet(this.hashTable[index]);
                    }
                }
                else
                    this.hashTable[index].insert(element);
                var curSize = this.hashTable[index].size();
                this.length += curSize - preSize;
            }
            if (this.length > this.bucketNum * HashSet.sigma) {
                this.reAllocate(this.bucketNum);
            }
        };
        /**
         * Removes the elements of the specified value.
         */
        HashSet.prototype.eraseElementByKey = function (element) {
            var index = this.hashFunc(element) & (this.bucketNum - 1);
            if (!this.hashTable[index])
                return;
            var preSize = this.hashTable[index].size();
            if (this.hashTable[index] instanceof LinkList) {
                this.hashTable[index].eraseElementByValue(element);
            }
            else {
                this.hashTable[index].eraseElementByKey(element);
            }
            if (this.hashTable[index] instanceof OrderedSet) {
                if (this.hashTable[index].size() <= HashSet.untreeifyThreshold) {
                    this.hashTable[index] = new LinkList(this.hashTable[index]);
                }
            }
            var curSize = this.hashTable[index].size();
            this.length += curSize - preSize;
        };
        /**
         * @return If the specified element in the HashSet.
         */
        HashSet.prototype.find = function (element) {
            var index = this.hashFunc(element) & (this.bucketNum - 1);
            if (!this.hashTable[index])
                return false;
            return !this.hashTable[index].find(element)
                .equals(this.hashTable[index].end());
        };
        /**
         * Using for 'for...of' syntax like Array.
         */
        HashSet.prototype[Symbol.iterator] = function () {
            return function () {
                var index, _a, _b, element, e_1_1;
                var e_1, _c;
                return __generator$1(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            index = 0;
                            _d.label = 1;
                        case 1:
                            if (!(index < this.bucketNum)) return [3 /*break*/, 10];
                            while (index < this.bucketNum && !this.hashTable[index])
                                ++index;
                            if (index >= this.bucketNum)
                                return [3 /*break*/, 10];
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 7, 8, 9]);
                            _a = (e_1 = void 0, __values$1(this.hashTable[index])), _b = _a.next();
                            _d.label = 3;
                        case 3:
                            if (!!_b.done) return [3 /*break*/, 6];
                            element = _b.value;
                            return [4 /*yield*/, element];
                        case 4:
                            _d.sent();
                            _d.label = 5;
                        case 5:
                            _b = _a.next();
                            return [3 /*break*/, 3];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_1_1 = _d.sent();
                            e_1 = { error: e_1_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_1) throw e_1.error; }
                            return [7 /*endfinally*/];
                        case 9:
                            ++index;
                            return [3 /*break*/, 1];
                        case 10: return [2 /*return*/];
                    }
                });
            }.bind(this)();
        };
        return HashSet;
    }(HashContainerBase));

    var __extends = (undefined && undefined.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var __values = (undefined && undefined.__values) || function(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };
    var HashMap = /** @class */ (function (_super) {
        __extends(HashMap, _super);
        function HashMap(container, initBucketNum, hashFunc) {
            if (container === void 0) { container = []; }
            var _this = _super.call(this, initBucketNum, hashFunc) || this;
            _this.hashTable = [];
            container.forEach(function (element) { return _this.setElement(element[0], element[1]); });
            return _this;
        }
        HashMap.prototype.reAllocate = function (originalBucketNum) {
            var _this = this;
            if (originalBucketNum >= HashContainerBase.maxBucketNum)
                return;
            this.bucketNum = Math.min((originalBucketNum << 1), HashContainerBase.maxBucketNum);
            var newHashTable = [];
            this.hashTable.forEach(function (container, index) {
                if (container.empty())
                    return;
                if (container instanceof LinkList && container.size() === 1) {
                    var pair = container.front();
                    newHashTable[_this.hashFunc(pair[0]) & (_this.bucketNum - 1)] = new LinkList([pair]);
                }
                else if (container instanceof OrderedMap) {
                    var lowList_1 = new LinkList();
                    var highList_1 = new LinkList();
                    container.forEach(function (pair) {
                        var hashCode = _this.hashFunc(pair[0]);
                        if ((hashCode & originalBucketNum) === 0) {
                            lowList_1.pushBack(pair);
                        }
                        else
                            highList_1.pushBack(pair);
                    });
                    if (lowList_1.size() > HashMap.untreeifyThreshold) {
                        newHashTable[index] = new OrderedMap(lowList_1);
                    }
                    else if (lowList_1.size())
                        newHashTable[index] = lowList_1;
                    if (highList_1.size() > HashMap.untreeifyThreshold) {
                        newHashTable[index + originalBucketNum] = new OrderedMap(highList_1);
                    }
                    else if (highList_1.size())
                        newHashTable[index + originalBucketNum] = highList_1;
                }
                else {
                    var lowList_2 = new LinkList();
                    var highList_2 = new LinkList();
                    container.forEach(function (pair) {
                        var hashCode = _this.hashFunc(pair[0]);
                        if ((hashCode & originalBucketNum) === 0) {
                            lowList_2.pushBack(pair);
                        }
                        else
                            highList_2.pushBack(pair);
                    });
                    if (lowList_2.size() >= HashMap.treeifyThreshold) {
                        newHashTable[index] = new OrderedMap(lowList_2);
                    }
                    else if (lowList_2.size()) {
                        newHashTable[index] = lowList_2;
                    }
                    if (highList_2.size() >= HashMap.treeifyThreshold) {
                        newHashTable[index + originalBucketNum] = new OrderedMap(highList_2);
                    }
                    else if (highList_2.size()) {
                        newHashTable[index + originalBucketNum] = highList_2;
                    }
                }
                _this.hashTable[index].clear();
            });
            this.hashTable = newHashTable;
        };
        HashMap.prototype.clear = function () {
            this.length = 0;
            this.bucketNum = this.initBucketNum;
            this.hashTable = [];
        };
        HashMap.prototype.forEach = function (callback) {
            var index = 0;
            this.hashTable.forEach(function (container) {
                container.forEach(function (element) {
                    callback(element, index++);
                });
            });
        };
        /**
         * Insert a new key-value pair or set value by key.
         */
        HashMap.prototype.setElement = function (key, value) {
            var e_1, _a;
            checkUndefinedParams(key);
            if (value === null || value === undefined) {
                this.eraseElementByKey(key);
                return;
            }
            var index = this.hashFunc(key) & (this.bucketNum - 1);
            if ((index in this.hashTable) === false) {
                ++this.length;
                this.hashTable[index] = new LinkList([[key, value]]);
            }
            else {
                var preSize = this.hashTable[index].size();
                if (this.hashTable[index] instanceof LinkList) {
                    try {
                        for (var _b = __values(this.hashTable[index]), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var pair = _c.value;
                            if (pair[0] === key) {
                                pair[1] = value;
                                return;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    this.hashTable[index].pushBack([key, value]);
                    if (this.bucketNum <= HashMap.minTreeifySize) {
                        this.reAllocate(this.bucketNum);
                        ++this.length;
                        return;
                    }
                    else if (this.hashTable[index].size() >= HashMap.treeifyThreshold) {
                        this.hashTable[index] = new OrderedMap(this.hashTable[index]);
                    }
                }
                else
                    this.hashTable[index].setElement(key, value);
                var curSize = this.hashTable[index].size();
                this.length += curSize - preSize;
            }
            if (this.length > this.bucketNum * HashMap.sigma) {
                this.reAllocate(this.bucketNum);
            }
        };
        /**
         * Gets the value of the element which has the specified key.
         */
        HashMap.prototype.getElementByKey = function (key) {
            var e_2, _a;
            var index = this.hashFunc(key) & (this.bucketNum - 1);
            if (!this.hashTable[index])
                return undefined;
            if (this.hashTable[index] instanceof OrderedMap) {
                return this.hashTable[index].getElementByKey(key);
            }
            else {
                try {
                    for (var _b = __values(this.hashTable[index]), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var pair = _c.value;
                        if (pair[0] === key)
                            return pair[1];
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return undefined;
            }
        };
        /**
         * Removes the element of the specified key.
         */
        HashMap.prototype.eraseElementByKey = function (key) {
            var e_3, _a;
            var index = this.hashFunc(key) & (this.bucketNum - 1);
            if (!this.hashTable[index])
                return;
            var preSize = this.hashTable[index].size();
            if (this.hashTable[index] instanceof OrderedMap) {
                this.hashTable[index].eraseElementByKey(key);
                if (this.hashTable[index].size() <= HashMap.untreeifyThreshold) {
                    this.hashTable[index] = new LinkList(this.hashTable[index]);
                }
            }
            else {
                var pos = -1;
                try {
                    for (var _b = __values(this.hashTable[index]), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var pair = _c.value;
                        ++pos;
                        if (pair[0] === key) {
                            this.hashTable[index].eraseElementByPos(pos);
                            break;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            var curSize = this.hashTable[index].size();
            this.length += curSize - preSize;
        };
        /**
         * @return If the specified element in the HashSet.
         */
        HashMap.prototype.find = function (key) {
            var e_4, _a;
            var index = this.hashFunc(key) & (this.bucketNum - 1);
            if (!this.hashTable[index])
                return false;
            if (this.hashTable[index] instanceof OrderedMap) {
                return !this.hashTable[index].find(key)
                    .equals(this.hashTable[index].end());
            }
            try {
                for (var _b = __values(this.hashTable[index]), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var pair = _c.value;
                    if (pair[0] === key)
                        return true;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            return false;
        };
        /**
         * Using for 'for...of' syntax like Array.
         */
        HashMap.prototype[Symbol.iterator] = function () {
            return function () {
                var index, _a, _b, pair, e_5_1;
                var e_5, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            index = 0;
                            _d.label = 1;
                        case 1:
                            if (!(index < this.bucketNum)) return [3 /*break*/, 10];
                            while (index < this.bucketNum && !this.hashTable[index])
                                ++index;
                            if (index >= this.bucketNum)
                                return [3 /*break*/, 10];
                            _d.label = 2;
                        case 2:
                            _d.trys.push([2, 7, 8, 9]);
                            _a = (e_5 = void 0, __values(this.hashTable[index])), _b = _a.next();
                            _d.label = 3;
                        case 3:
                            if (!!_b.done) return [3 /*break*/, 6];
                            pair = _b.value;
                            return [4 /*yield*/, pair];
                        case 4:
                            _d.sent();
                            _d.label = 5;
                        case 5:
                            _b = _a.next();
                            return [3 /*break*/, 3];
                        case 6: return [3 /*break*/, 9];
                        case 7:
                            e_5_1 = _d.sent();
                            e_5 = { error: e_5_1 };
                            return [3 /*break*/, 9];
                        case 8:
                            try {
                                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                            }
                            finally { if (e_5) throw e_5.error; }
                            return [7 /*endfinally*/];
                        case 9:
                            ++index;
                            return [3 /*break*/, 1];
                        case 10: return [2 /*return*/];
                    }
                });
            }.bind(this)();
        };
        return HashMap;
    }(HashContainerBase));

    exports.Deque = Deque;
    exports.DequeIterator = DequeIterator;
    exports.HashMap = HashMap;
    exports.HashSet = HashSet;
    exports.LinkList = LinkList;
    exports.LinkListIterator = LinkListIterator;
    exports.OrderedMap = OrderedMap;
    exports.OrderedMapIterator = OrderedMapIterator;
    exports.OrderedSet = OrderedSet;
    exports.OrderedSetIterator = OrderedSetIterator;
    exports.PriorityQueue = PriorityQueue;
    exports.Queue = Queue;
    exports.Stack = Stack;
    exports.Vector = Vector;
    exports.VectorIterator = VectorIterator;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
