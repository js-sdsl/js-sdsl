import {
    Vector,
    Stack,
    Queue,
    LinkList,
    Deque,
    PriorityQueue,
    Set as SdslSet,
    Map as SdslMap,
    HashSet,
    HashMap,
} from "./index";
import { ContainerIterator, SequentialContainerType, Pair } from "./Base/Base";
import { VectorType } from "./Vector/Vector";
import { StackType } from "./Stack/Stack";
import { QueueType } from "./Queue/Queue";
import { SetType } from "./Set/Set";
import { MapType } from "./Map/Map";
import { HashSetType } from "./HashSet/HashSet";
import { HashMapType } from "./HashMap/HashMap";

const arr: number[] = [];
for (let i = 0; i < 10000; ++i) arr.push(Math.random() * 1000000);

type testReportFormat = {
    containerName: string,
    reportList: {
        testFunc: string,
        containerSize: number,
        testNum: number,
        runTime: number
    }[];
}

function testStack(testNum: number) {
    function judgeStack(myStack: StackType<number>, myVector: VectorType<number>) {
        while (!myStack.empty()) {
            if (myStack.size() !== myVector.size()) {
                throw new Error("Stack size test failed!");
            }
            const s = myStack.top();
            const v = myVector.back();
            if (s !== v) {
                throw new Error("Stack test failed!");
            }
            myStack.pop();
            myVector.popBack();
        }
    }

    console.log("Stack test start...");

    const myStack = new Stack(arr);
    const myVector = new Vector(arr);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random() * 1000000;
        myStack.push(random);
        myVector.pushBack(random);
    }
    judgeStack(myStack, myVector);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random() * 1000000;
        myStack.push(random);
        myVector.pushBack(random);
    }
    myStack.clear();
    myVector.clear();
    judgeStack(myStack, myVector);

    console.clear();
    console.log("Stack test end, all tests passed!");

    console.log("Stack test report generating...");

    let startTime, endTime;
    const reportList: testReportFormat["reportList"] = [];

    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) myStack.push(Math.random() * 1000000);
    endTime = Date.now();
    reportList.push({
        testFunc: "push",
        testNum: testNum,
        containerSize: myStack.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    const size = myStack.size();
    myStack.clear();
    endTime = Date.now();
    reportList.push({
        testFunc: "clear",
        testNum: 1,
        containerSize: size,
        runTime: endTime - startTime
    });

    console.log("Stack test report done.");

    return {
        containerName: "Stack",
        reportList
    };
}

function testQueue(testNum: number) {
    function judgeQueue(myQueue: QueueType<number>, myVector: VectorType<number>) {
        while (!myQueue.empty()) {
            if (myQueue.size() !== myVector.size()) {
                throw new Error("Stack size test failed!");
            }
            const s = myQueue.front();
            const v = myVector.front();
            if (s !== v) {
                throw new Error("Stack test failed!");
            }
            myQueue.pop();
            myVector.eraseElementByPos(0);
        }
    }

    console.log("Queue test start...");

    const myQueue = new Queue(arr);
    const myVector = new Vector(arr);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random() * 1000000;
        myQueue.push(random);
        myVector.pushBack(random);
    }
    judgeQueue(myQueue, myVector);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random() * 1000000;
        myQueue.push(random);
        myVector.pushBack(random);
    }
    myQueue.clear();
    myVector.clear();
    judgeQueue(myQueue, myVector);

    console.clear();
    console.log("Queue test end, all tests passed!");

    console.log("Queue test report generating...");

    let startTime, endTime;
    const reportList: testReportFormat["reportList"] = [];

    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) myQueue.push(Math.random() * 1000000);
    endTime = Date.now();
    reportList.push({
        testFunc: "push",
        testNum: testNum,
        containerSize: myQueue.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    const size = myQueue.size();
    myQueue.clear();
    endTime = Date.now();
    reportList.push({
        testFunc: "clear",
        testNum: 1,
        containerSize: size,
        runTime: endTime - startTime
    });

    console.log("Queue test report done.");

    return {
        containerName: "Queue",
        reportList
    };
}

function judgeSequentialContainer(funcName: string, container: SequentialContainerType<number>, myVector: SequentialContainerType<number>) {
    let testResult = (container.size() === myVector.size());
    container.forEach((element, index) => {
        testResult = testResult && (element === myVector.getElementByPos(index));
    });
    if (!testResult) throw new Error(`${funcName} test failed!`);
    console.log(container.constructor.name, funcName, "test passed.");
}

function testSequentialContainer(container: SequentialContainerType<number>, testNum: number) {
    const containerName = container.constructor.name;
    console.log(containerName, "SequentialContainer standard test start...");

    const myVector = new Vector<number>(arr);

    if (container.size() !== myVector.size()) {
        throw new Error("size test failed.");
    }
    console.log(containerName, "size test passed.");

    if (container.front() !== myVector.front()) {
        throw new Error("front test failed!");
    }
    console.log(containerName, "front test passed.");

    if (container.back() !== myVector.back()) {
        throw new Error("back test failed!");
    }
    console.log(containerName, "back test passed.");

    judgeSequentialContainer("forEach", container, myVector);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random();
        container.pushBack(random);
        myVector.pushBack(random);
    }
    judgeSequentialContainer("pushBack", container, myVector);

    for (let i = 0; i < 10000; ++i) {
        container.popBack();
        myVector.popBack();
    }
    judgeSequentialContainer("popBack", container, myVector);

    let testResult = true;
    const len = container.size();
    testResult = testResult && (container.size() === myVector.size());
    for (let i = 0; i < len; ++i) {
        testResult = testResult && (container.getElementByPos(i) === myVector.getElementByPos(i));
    }
    if (!testResult) {
        throw new Error("getElementByPos test failed.");
    }
    console.log(containerName, "getElementByPos test passed.");

    for (let i = 0; i < len; ++i) {
        myVector.setElementByPos(i, i);
        container.setElementByPos(i, i);
    }
    judgeSequentialContainer("setElementByPos", container, myVector);

    for (let i = 0; i < 10000; ++i) {
        const pos = Math.floor(Math.random() * myVector.size());
        container.eraseElementByPos(pos);
        myVector.eraseElementByPos(pos);
    }
    judgeSequentialContainer("eraseElementByPos", container, myVector);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random();
        container.pushBack(random);
        myVector.pushBack(random);
    }
    for (let i = 0; i < 10000; ++i) {
        const pos = Math.floor(Math.random() * container.size());
        const num = Math.floor(Math.random() * 10);
        container.insert(pos, -2, num);
        myVector.insert(pos, -2, num);
    }
    judgeSequentialContainer("insert", container, myVector);

    container.eraseElementByValue(-2);
    myVector.eraseElementByValue(-2);
    judgeSequentialContainer("eraseElementByValue", container, myVector);

    container.reverse();
    myVector.reverse();
    judgeSequentialContainer("reverse", container, myVector);

    for (let i = 0; i < 10000; ++i) {
        const pos = Math.floor(Math.random() * container.size());
        const num = Math.floor(Math.random() * 10);
        container.insert(pos, -1, num);
        myVector.insert(pos, -1, num);
    }
    container.unique();
    myVector.unique();
    judgeSequentialContainer("unique", container, myVector);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random() * 1000000;
        container.pushBack(random);
        myVector.pushBack(random);
    }
    container.sort((x, y) => x - y);
    myVector.sort((x: number, y: number) => x - y);
    judgeSequentialContainer("sort", container, myVector);

    container.clear();
    myVector.clear();
    judgeSequentialContainer("clear", container, myVector);

    console.clear();
    console.log(containerName, `SequentialContainer standard test end, all standard tests passed!`);

    let startTime, endTime;
    const reportList: testReportFormat["reportList"] = [];

    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) container.pushBack(Math.random());
    endTime = Date.now();
    reportList.push({
        testFunc: "pushBack",
        testNum: testNum,
        containerSize: container.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    let size = container.size();
    for (let i = 0; i < testNum; ++i) container.popBack();
    endTime = Date.now();
    reportList.push({
        testFunc: "popBack",
        testNum: testNum,
        containerSize: size,
        runTime: endTime - startTime
    });

    for (let i = 0; i < testNum; ++i) {
        const random = Math.random();
        container.pushBack(random);
        myVector.pushBack(random);
    }
    startTime = Date.now();
    for (let i = 0; i < 10000; ++i) container.getElementByPos(i);
    endTime = Date.now();
    reportList.push({
        testFunc: "getElementByPos",
        testNum: 10000,
        containerSize: container.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    for (let i = 0; i < 10000; ++i) container.setElementByPos(i, i);
    endTime = Date.now();
    reportList.push({
        testFunc: "setElementByPos",
        testNum: 10000,
        containerSize: container.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    size = container.size();
    for (let i = 0; i < (container.constructor.name === "Deque" ? 10 : 10000); ++i) {
        container.eraseElementByPos(Math.floor(Math.random() * Math.min(1000, Math.max(container.size() - 1, 0))));
    }
    endTime = Date.now();
    reportList.push({
        testFunc: "eraseElementByPos",
        testNum: 10000,
        containerSize: size,
        runTime: endTime - startTime
    });

    startTime = Date.now();
    for (let i = 0; i < (container.constructor.name === "Deque" ? 50 : 10000); ++i) container.insert(Math.floor(Math.random() * Math.min(1000, Math.max(container.size() - 1, 0))), -1, Math.floor(Math.random() * 10));
    endTime = Date.now();
    reportList.push({
        testFunc: "insert",
        testNum: 10000,
        containerSize: container.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    size = container.size();
    container.eraseElementByValue(-1);
    endTime = Date.now();
    reportList.push({
        testFunc: "eraseElementByValue",
        testNum: 1,
        containerSize: size,
        runTime: endTime - startTime
    });

    startTime = Date.now();
    container.reverse();
    endTime = Date.now();
    reportList.push({
        testFunc: "reverse",
        testNum: 1,
        containerSize: container.size(),
        runTime: endTime - startTime
    });

    for (let i = 0; i < (container.constructor.name === "Deque" ? 50 : 10000); ++i) container.insert(Math.floor(Math.random() * Math.min(container.size(), 10)), -1, Math.floor(Math.random() * 10));
    size = container.size();
    startTime = Date.now();
    container.unique();
    endTime = Date.now();
    reportList.push({
        testFunc: "unique",
        testNum: 1,
        containerSize: size,
        runTime: endTime - startTime
    });

    for (let i = 0; i < testNum; ++i) container.pushBack(Math.random() * testNum);
    startTime = Date.now();
    container.sort((x, y) => x - y);
    endTime = Date.now();
    reportList.push({
        testFunc: "sort",
        testNum: 1,
        containerSize: container.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    size = container.size();
    container.clear();
    endTime = Date.now();
    reportList.push({
        testFunc: "clear",
        testNum: 1,
        containerSize: size,
        runTime: endTime - startTime
    });

    return reportList;
}

function testLinkList(testNum: number) {
    console.log("LinkList test start...");

    const myLinkList = new LinkList(arr);

    const reportList = testSequentialContainer(myLinkList, testNum);

    const tmpArr = [];
    for (let i = 0; i < 10000; ++i) {
        myLinkList.pushFront(i);
        tmpArr.push(i);
    }
    tmpArr.reverse();
    judgeSequentialContainer("pushFront", myLinkList, new Vector(tmpArr));

    tmpArr.reverse();
    for (let i = 0; i < 10000; ++i) {
        myLinkList.popFront();
        tmpArr.pop();
    }
    tmpArr.reverse();
    judgeSequentialContainer("popFront", myLinkList, new Vector(tmpArr));

    for (let i = 0; i < 10000; ++i) {
        tmpArr.push(Math.random() * 1000000);
    }
    const otherLinkList = new LinkList(tmpArr);
    myLinkList.forEach(element => tmpArr.push(element));
    myLinkList.sort((x, y) => x - y);
    otherLinkList.sort((x, y) => x - y);
    tmpArr.sort((x, y) => x - y);
    myLinkList.merge(otherLinkList);
    judgeSequentialContainer("merge", myLinkList, new Vector(tmpArr));

    console.clear();
    console.log("LinkList test end, all tests passed!");

    console.log("LinkList test report generating...");

    let startTime, endTime;

    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) myLinkList.pushFront(i);
    endTime = Date.now();
    reportList.push({
        testFunc: "pushFront",
        testNum: testNum,
        containerSize: myLinkList.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    const size = myLinkList.size();
    for (let i = 0; i < testNum; ++i) myLinkList.popFront();
    endTime = Date.now();
    reportList.push({
        testFunc: "popFront",
        testNum: testNum,
        containerSize: size,
        runTime: endTime - startTime
    });

    const _otherLinkList = new LinkList<number>();
    for (let i = 0; i < testNum; ++i) _otherLinkList.pushBack(Math.random() * 1000000);
    myLinkList.forEach(element => tmpArr.push(element));
    myLinkList.sort((x, y) => x - y);
    _otherLinkList.sort((x, y) => x - y);
    startTime = Date.now();
    myLinkList.merge(_otherLinkList);
    endTime = Date.now();
    reportList.push({
        testFunc: "merge",
        testNum: 1,
        containerSize: myLinkList.size(),
        runTime: endTime - startTime
    });

    console.log("LinkList test report done.");

    return {
        containerName: "LinkList",
        reportList
    };
}

function testDeque(testNum: number) {
    console.log("Deque test start...");

    const myDeque = new Deque(arr);

    const reportList = testSequentialContainer(myDeque, testNum);

    const tmpArr = [];
    for (let i = 0; i < 10000; ++i) {
        myDeque.pushFront(i);
        tmpArr.unshift(i);
    }
    judgeSequentialContainer("pushFront", myDeque, new Vector(tmpArr));

    for (let i = 0; i < 10000; ++i) {
        myDeque.popFront();
        tmpArr.shift();
    }
    judgeSequentialContainer("popFront", myDeque, new Vector(tmpArr));

    myDeque.shrinkToFit();
    judgeSequentialContainer("shrinkToFit", myDeque, new Vector(tmpArr));

    console.clear();
    console.log("Deque test end, all tests passed!");

    let startTime, endTime;

    startTime = Date.now();
    for (let i = 0; i < testNum * 2; ++i) myDeque.pushFront(i);
    endTime = Date.now();
    reportList.push({
        testFunc: "pushFront",
        testNum: testNum * 2,
        containerSize: myDeque.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    const size = myDeque.size();
    for (let i = 0; i < testNum; ++i) myDeque.popFront();
    endTime = Date.now();
    reportList.push({
        testFunc: "popFront",
        testNum: testNum,
        containerSize: size,
        runTime: endTime - startTime
    });

    startTime = Date.now();
    myDeque.shrinkToFit();
    endTime = Date.now();
    reportList.push({
        testFunc: "shrinkToFit",
        testNum: 1,
        containerSize: myDeque.size(),
        runTime: endTime - startTime
    });

    return {
        containerName: "Deque",
        reportList
    };
}

function testPriorityQueue(testNum: number) {
    console.log("PriorityQueue test start...");

    const cmp = (x: number, y: number) => y - x;

    let startTime, endTime;
    const reportList: testReportFormat["reportList"] = [];

    startTime = Date.now();
    const myPriority = new PriorityQueue(arr, cmp);
    endTime = Date.now();
    reportList.push({
        testFunc: "constructor",
        testNum: 1,
        containerSize: myPriority.size(),
        runTime: endTime - startTime
    });

    const myVector = new Vector(arr);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random() * 1000000;
        myPriority.push(random);
        myVector.pushBack(random);
    }
    myVector.sort(cmp);
    while (!myPriority.empty()) {
        if (myPriority.size() !== myVector.size()) {
            throw new Error("PriorityQueue size test failed!");
        }
        const u = myPriority.top();
        if (u !== myVector.front()) {
            throw new Error("PriorityQueue test failed!");
        }
        myPriority.pop();
        myVector.eraseElementByPos(0);
    }

    console.clear();
    console.log("PriorityQueue test end, all tests passed!");

    console.log("PriorityQueue test report generating...");

    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) myPriority.push(Math.random() * 1000000);
    endTime = Date.now();
    reportList.push({
        testFunc: "push",
        testNum: testNum,
        containerSize: myPriority.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    const size = myPriority.size();
    while (!myPriority.empty()) myPriority.pop();
    endTime = Date.now();
    reportList.push({
        testFunc: "pop all",
        testNum: 1,
        containerSize: size,
        runTime: endTime - startTime
    });

    console.log("PriorityQueue test report done.");

    return {
        containerName: "PriorityQueue",
        reportList
    };
}

function testSet(testNum: number) {
    function judgeSet(mySdslSet: SetType<number>, myVector: VectorType<number>) {
        if (mySdslSet.getHeight() > 2 * Math.log2(mySdslSet.size() + 1)) {
            throw new Error("Set tree too high!");
        }
        if (mySdslSet.size() !== myVector.size()) {
            throw new Error("Set size test failed!");
        }
        myVector.sort((x, y) => x - y);
        mySdslSet.forEach((element, index) => {
            if (myVector.getElementByPos(index) !== element) {
                throw new Error("Set test failed!");
            }
        });
    }

    console.log("Set test start...");

    let startTime, endTime;
    const reportList: testReportFormat["reportList"] = [];

    startTime = Date.now();
    const mySdslSet = new SdslSet(arr);
    endTime = Date.now();
    reportList.push({
        testFunc: "constructor",
        testNum: 1,
        containerSize: mySdslSet.size(),
        runTime: endTime - startTime
    });

    const myVector = new Vector(arr);
    judgeSet(mySdslSet, myVector);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random() * 1000000;
        mySdslSet.insert(random);
        myVector.pushBack(random);
    }
    judgeSet(mySdslSet, myVector);

    for (let i = 0; i < 10000; ++i) {
        const pos = Math.floor(Math.random() * myVector.size());
        const eraseValue = myVector.getElementByPos(pos);
        myVector.eraseElementByPos(pos);
        mySdslSet.eraseElementByValue(eraseValue);
    }
    judgeSet(mySdslSet, myVector);

    for (let i = 0; i < 10000; ++i) {
        const pos = Math.floor(Math.random() * myVector.size());
        myVector.eraseElementByPos(pos);
        mySdslSet.eraseElementByPos(pos);
    }
    judgeSet(mySdslSet, myVector);

    const otherSdslSet = new SdslSet<number>();
    for (let i = 0; i < 20000; ++i) {
        const random = Math.random() * 1000000;
        otherSdslSet.insert(random);
        myVector.pushBack(random);
    }
    mySdslSet.union(otherSdslSet);
    judgeSet(mySdslSet, myVector);

    myVector.forEach((element: number) => {
        if (!mySdslSet.find(element)) throw new Error("Set test failed!");
    });

    myVector.sort((x: number, y: number) => x - y);
    for (let i = 0; i < myVector.size(); ++i) {
        if (mySdslSet.lowerBound(myVector.getElementByPos(i)).pointer !== myVector.getElementByPos(i)) {
            throw new Error("Set lowerBound test failed!");
        }
        if (i !== myVector.size() - 1 && mySdslSet.upperBound(myVector.getElementByPos(i)).pointer !== myVector.getElementByPos(i + 1)) {
            throw new Error("Set upperBound test failed!");
        }
    }
    console.log("Set lowerBound and upperBound test passed.");

    for (let i = 0; i < myVector.size(); ++i) {
        if (mySdslSet.reverseLowerBound(myVector.getElementByPos(i)).pointer !== myVector.getElementByPos(i)) {
            throw new Error("Set reverseLowerBound test failed!");
        }
        if (i !== 0 && mySdslSet.reverseUpperBound(myVector.getElementByPos(i)).pointer !== myVector.getElementByPos(i - 1)) {
            throw new Error("Set reverseUpperBound test failed!");
        }
    }
    console.log("Set reverseLowerBound and reverseUpperBound test passed.");

    for (let i = 0; i < 10000; ++i) {
        mySdslSet.eraseElementByPos(0);
        myVector.eraseElementByPos(0);
        if (mySdslSet.front() !== myVector.front()) {
            throw new Error("Set test failed!");
        }
        mySdslSet.eraseElementByPos(mySdslSet.size() - 1);
        myVector.eraseElementByPos(myVector.size() - 1);
        if (mySdslSet.back() !== myVector.back()) {
            throw new Error("Set test failed!");
        }
    }
    judgeSet(mySdslSet, myVector);


    console.clear();
    console.log("Set test end, all tests passed!");

    console.log("Set test report generating...");

    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) mySdslSet.insert(i);
    endTime = Date.now();
    reportList.push({
        testFunc: "insert",
        testNum: testNum,
        containerSize: mySdslSet.size(),
        runTime: endTime - startTime
    });

    for (let i = 0; i < testNum; ++i) mySdslSet.insert(Math.random() * 1000000);
    const tmpArr: number[] = [];
    mySdslSet.forEach((element: number) => tmpArr.push(element));
    startTime = Date.now();
    const size = mySdslSet.size();
    for (let i = 0; i < testNum; ++i) mySdslSet.eraseElementByValue(tmpArr[i]);
    endTime = Date.now();
    reportList.push({
        testFunc: "eraseElementByValue",
        testNum: testNum,
        containerSize: size,
        runTime: endTime - startTime
    });

    startTime = Date.now();
    for (let i = 0; i < 10; ++i) mySdslSet.eraseElementByPos(Math.floor(Math.random() * mySdslSet.size()));
    endTime = Date.now();
    reportList.push({
        testFunc: "eraseElementByPos",
        testNum: 10,
        containerSize: size,
        runTime: endTime - startTime
    });

    const _otherSdslSet = new SdslSet<number>();
    for (let i = 0; i < testNum; ++i) _otherSdslSet.insert(Math.random() * 1000000);
    startTime = Date.now();
    mySdslSet.union(_otherSdslSet);
    endTime = Date.now();
    reportList.push({
        testFunc: "union",
        testNum: 1,
        containerSize: mySdslSet.size(),
        runTime: endTime - startTime
    });

    let num = 0;
    startTime = Date.now();
    for (const element of mySdslSet) {
        ++num;
        if (num >= testNum) break;
        mySdslSet.lowerBound(element);
    }
    endTime = Date.now();
    reportList.push({
        testFunc: "lowerBound",
        testNum: testNum,
        containerSize: mySdslSet.size(),
        runTime: endTime - startTime
    });

    num = 0;
    startTime = Date.now();
    for (const element of mySdslSet) {
        ++num;
        if (num >= testNum) break;
        mySdslSet.upperBound(element);
    }
    endTime = Date.now();
    reportList.push({
        testFunc: "upperBound",
        testNum: testNum,
        containerSize: mySdslSet.size(),
        runTime: endTime - startTime
    });
    num = 0;
    startTime = Date.now();
    for (const element of mySdslSet) {
        ++num;
        if (num >= testNum) break;
        mySdslSet.reverseLowerBound(element);
    }
    endTime = Date.now();
    reportList.push({
        testFunc: "reverseLowerBound",
        testNum: testNum,
        containerSize: mySdslSet.size(),
        runTime: endTime - startTime
    });

    num = 0;
    startTime = Date.now();
    for (const element of mySdslSet) {
        ++num;
        if (num >= testNum) break;
        mySdslSet.reverseUpperBound(element);
    }
    endTime = Date.now();
    reportList.push({
        testFunc: "reverseUpperBound",
        testNum: testNum,
        containerSize: mySdslSet.size(),
        runTime: endTime - startTime
    });


    console.log("Set test report done.");

    return {
        containerName: "Set",
        reportList
    };
}

function testMap(testNum: number) {
    function judgeMap(myMap: MapType<number, number>, stdMap: Map<number, number>) {
        if (myMap.getHeight() > 2 * Math.log2(myMap.size() + 1)) {
            throw new Error("Map tree too high!");
        }
        if (myMap.size() !== stdMap.size) {
            throw new Error("Map tree too high!");
        }
        stdMap.forEach((value, key) => {
            const _value = myMap.getElementByKey(key);
            if (_value !== stdMap.get(key)) {
                throw new Error("Map test failed!");
            }
        });
        myMap.forEach(({ key, value }) => {
            const _value = stdMap.get(key);
            if (_value !== value) {
                throw new Error("Map test failed!");
            }
        });
    }

    console.log("Map test start...");

    let startTime, endTime;
    const reportList: testReportFormat["reportList"] = [];

    startTime = Date.now();
    const myMap = new SdslMap(arr.map((element, index) => ({
        key: element,
        value: index
    })));
    endTime = Date.now();
    reportList.push({
        testFunc: "constructor",
        testNum: 1,
        containerSize: myMap.size(),
        runTime: endTime - startTime
    });

    const stdMap = new Map(arr.map((element, index) => [element, index]));
    judgeMap(myMap, stdMap);

    const eraseArr: number[] = [];
    myMap.forEach(({ key, value }) => {
        const v = stdMap.get(key);
        if (v !== value) {
            throw new Error("Map test failed!");
        }
        if (Math.random() > 0.5) {
            eraseArr.push(key);
        }
    });
    eraseArr.forEach(key => {
        myMap.eraseElementByKey(key);
        stdMap.delete(key);
    });
    judgeMap(myMap, stdMap);

    for (let i = 10000; i < 30000; ++i) {
        const random = Math.random() * 1000000;
        myMap.setElement(i, random);
        stdMap.set(i, random);
    }
    judgeMap(myMap, stdMap);

    for (let i = 20000; i < 30000; ++i) {
        myMap.eraseElementByKey(i);
        stdMap.delete(i);
    }
    judgeMap(myMap, stdMap);

    for (let i = 0; i < 100; ++i) {
        const pos = Math.floor(Math.random() * myMap.size());
        const pair = myMap.getElementByPos(pos);
        myMap.eraseElementByPos(pos);
        stdMap.delete(pair.key);
    }
    judgeMap(myMap, stdMap);

    const otherMap = new SdslMap<number, number>();
    for (let i = 20000; i < 30000; ++i) {
        const random = Math.random() * 1000000;
        otherMap.setElement(i, random);
        stdMap.set(i, random);
    }
    myMap.union(otherMap);
    judgeMap(myMap, stdMap);

    const myVector = new Vector(myMap);
    myVector.sort((x, y) => x.key - y.key);
    for (let i = 0; i < myVector.size(); ++i) {
        let vElement = myVector.getElementByPos(i);
        let myElement = myMap.lowerBound(vElement.key).pointer;
        if (vElement?.key !== myElement?.key || vElement?.value !== myElement?.value) {
            throw new Error("Map lowerBound test failed!");
        }
        if (i !== myVector.size() - 1) {
            vElement = myVector.getElementByPos(i);
            myElement = myMap.upperBound(vElement.key).pointer;
            vElement = myVector.getElementByPos(i + 1);
            if (vElement?.key !== myElement?.key || vElement?.value !== myElement?.value) {
                throw new Error("Map upperBound test failed!");
            }
        }
    }
    console.log("Map lowerBound and upperBound test passed.");

    for (let i = 0; i < myVector.size(); ++i) {
        let vElement = myVector.getElementByPos(i);
        let myElement = myMap.reverseLowerBound(vElement.key).pointer;
        if (vElement?.key !== myElement?.key || vElement?.value !== myElement?.value) {
            throw new Error("Map reverseLowerBound test failed!");
        }
        if (i !== 0) {
            vElement = myVector.getElementByPos(i);
            myElement = myMap.reverseUpperBound(vElement.key).pointer;
            vElement = myVector.getElementByPos(i - 1);
            if (vElement?.key !== myElement?.key || vElement?.value !== myElement?.value) {
                throw new Error("Map reverseUpperBound test failed!");
            }
        }
    }
    console.log("Map reverseLowerBound and reverseUpperBound test passed.");

    console.clear();
    console.log("Map test end, all tests passed!");

    console.log("Map test report generating...");

    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) myMap.setElement(i, Math.random() * 1000000);
    endTime = Date.now();
    reportList.push({
        testFunc: "setElement",
        testNum: testNum,
        containerSize: myMap.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    let size = myMap.size();
    for (let i = 0; i < testNum; ++i) myMap.eraseElementByKey(i);
    endTime = Date.now();
    reportList.push({
        testFunc: "eraseElementByKey",
        testNum: testNum,
        containerSize: size,
        runTime: endTime - startTime
    });

    startTime = Date.now();
    size = myMap.size();
    for (let i = testNum; i < testNum + 100; ++i) myMap.eraseElementByPos(Math.floor(Math.random() * myMap.size()));
    endTime = Date.now();
    reportList.push({
        testFunc: "eraseElementByPos",
        testNum: 100,
        containerSize: size,
        runTime: endTime - startTime
    });

    const _otherMap = new SdslMap<number, number>();
    for (let i = testNum; i < testNum * 2; ++i) _otherMap.setElement(i, Math.random() * 1000000);
    startTime = Date.now();
    myMap.union(_otherMap);
    endTime = Date.now();
    reportList.push({
        testFunc: "union",
        testNum: 1,
        containerSize: myMap.size(),
        runTime: endTime - startTime
    });

    let num = 0;
    startTime = Date.now();
    for (const pair of myMap) {
        ++num;
        if (num >= testNum) break;
        myMap.lowerBound(pair.key);
    }
    endTime = Date.now();
    reportList.push({
        testFunc: "lowerBound",
        testNum: testNum,
        containerSize: myMap.size(),
        runTime: endTime - startTime
    });

    num = 0;
    startTime = Date.now();
    for (const pair of myMap) {
        ++num;
        if (num >= testNum) break;
        myMap.upperBound(pair.key);
    }
    endTime = Date.now();
    reportList.push({
        testFunc: "upperBound",
        testNum: testNum,
        containerSize: myMap.size(),
        runTime: endTime - startTime
    });

    num = 0;
    startTime = Date.now();
    for (const pair of myMap) {
        ++num;
        if (num >= testNum) break;
        myMap.reverseLowerBound(pair.key);
    }
    endTime = Date.now();
    reportList.push({
        testFunc: "reverseLowerBound",
        testNum: testNum,
        containerSize: myMap.size(),
        runTime: endTime - startTime
    });

    num = 0;
    startTime = Date.now();
    for (const pair of myMap) {
        ++num;
        if (num >= testNum) break;
        myMap.reverseUpperBound(pair.key);
    }
    endTime = Date.now();
    reportList.push({
        testFunc: "reverseUpperBound",
        testNum: testNum,
        containerSize: myMap.size(),
        runTime: endTime - startTime
    });

    console.log("Map test report done.");

    return {
        containerName: "Map",
        reportList
    };
}

function testHashSet(testNum: number) {
    function judgeHashSet(funcName: string, myHashSet: HashSetType<number>, stdSet: Set<number>) {
        if (myHashSet.size() !== stdSet.size) {
            throw new Error(`HashSet ${funcName} test failed!`);
        }
        stdSet.forEach((element) => {
            if (!myHashSet.find(element)) {
                throw new Error(`HashSet ${funcName} test failed!`);
            }
        });
        myHashSet.forEach(element => {
            if (!stdSet.has(element)) {
                throw new Error(`HashSet ${funcName} test failed!`);
            }
        });
        console.log("HashSet", funcName, "test passed.");
    }

    console.log("HashSet test start...");

    let startTime, endTime;
    const reportList: testReportFormat["reportList"] = [];

    startTime = Date.now();
    const myHashSet = new HashSet(arr, (1 << 21));
    endTime = Date.now();
    reportList.push({
        testFunc: "constructor",
        testNum: 1,
        containerSize: myHashSet.size(),
        runTime: endTime - startTime
    });

    const stdSet = new Set(arr);
    judgeHashSet("constructor", myHashSet, stdSet);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random() * 1000000;
        myHashSet.insert(random);
        stdSet.add(random);
    }
    judgeHashSet("insert", myHashSet, stdSet);

    for (let i = 0; i < 10000; ++i) {
        myHashSet.eraseElementByValue(arr[i]);
        stdSet.delete(arr[i]);
        const random = Math.random() * 1000000;
        myHashSet.eraseElementByValue(random);
        stdSet.delete(random);
    }
    judgeHashSet("eraseElementByValue", myHashSet, stdSet);

    myHashSet.clear();
    stdSet.clear();
    judgeHashSet("clear", myHashSet, stdSet);

    console.clear();
    console.log("HashSet test end, all tests passed!");

    console.log("HashSet test report generating...");

    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) myHashSet.insert(Math.random() * 1000000);
    endTime = Date.now();
    reportList.push({
        testFunc: "insert",
        testNum: testNum,
        containerSize: myHashSet.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    myHashSet.forEach(element => myHashSet.find(element));
    endTime = Date.now();
    reportList.push({
        testFunc: "find",
        testNum: myHashSet.size(),
        containerSize: myHashSet.size(),
        runTime: endTime - startTime
    });

    myHashSet.forEach(element => stdSet.add(element));
    const size = myHashSet.size();
    startTime = Date.now();
    stdSet.forEach(element => myHashSet.eraseElementByValue(element));
    endTime = Date.now();
    reportList.push({
        testFunc: "eraseElementByValue",
        testNum: stdSet.size,
        containerSize: size,
        runTime: endTime - startTime
    });

    console.log("HashSet test report done.");

    return {
        containerName: "HashSet",
        reportList
    };
}

function testHashMap(testNum: number) {
    function judgeHashMap(funcName: string, myHashMap: HashMapType<number, number>, stdMap: Map<number, number>) {
        if (myHashMap.size() !== stdMap.size) {
            throw new Error(`HashMap ${funcName} test failed!`);
        }
        stdMap.forEach((value, key) => {
            if (!myHashMap.find(key)) {
                throw new Error(`HashMap ${funcName} test failed!`);
            }
            if (myHashMap.getElementByKey(key) !== value) {
                throw new Error(`HashMap ${funcName} test failed!`);
            }
        });
        myHashMap.forEach(({ key, value }) => {
            if (myHashMap.getElementByKey(key) !== value) {
                throw new Error(`HashMap ${funcName} test failed!`);
            }
        });
        console.log("HashMap", funcName, "test passed.");
    }

    console.log("HashMap test start...");

    let startTime, endTime;
    const reportList: testReportFormat["reportList"] = [];

    startTime = Date.now();
    const myHashMap = new HashMap(arr.map((element, index) => ({
        key: index,
        value: element
    })), (1 << 21));
    endTime = Date.now();
    reportList.push({
        testFunc: "constructor",
        testNum: 1,
        containerSize: myHashMap.size(),
        runTime: endTime - startTime
    });

    const stdMap = new Map(arr.map((element, index) => [index, element]));
    judgeHashMap("constructor", myHashMap, stdMap);

    for (let i = 0; i <= 10000; ++i) {
        myHashMap.setElement(i, i);
        stdMap.set(i, i);
    }
    for (let i = 10000; i < 20000; ++i) {
        const random = Math.random() * 1000000;
        myHashMap.setElement(i, random);
        stdMap.set(i, random);
    }
    judgeHashMap("setElement", myHashMap, stdMap);

    for (let i = 0; i < 10000; ++i) {
        myHashMap.eraseElementByKey(i);
        stdMap.delete(i);
    }
    judgeHashMap("eraseElementByKey", myHashMap, stdMap);

    myHashMap.clear();
    stdMap.clear();
    judgeHashMap("clear", myHashMap, stdMap);

    console.clear();
    console.log("HashMap test end, all tests passed!");

    console.log("HashMap test report generating...");

    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) myHashMap.setElement(i, Math.random() * 1000000);
    endTime = Date.now();
    reportList.push({
        testFunc: "setElement",
        testNum: testNum,
        containerSize: myHashMap.size(),
        runTime: endTime - startTime
    });

    startTime = Date.now();
    myHashMap.forEach(({ key }) => myHashMap.getElementByKey(key));
    endTime = Date.now();
    reportList.push({
        testFunc: "getElementByKey",
        testNum: myHashMap.size(),
        containerSize: myHashMap.size(),
        runTime: endTime - startTime
    });

    const size = myHashMap.size();
    startTime = Date.now();
    for (let i = 0; i < testNum; ++i) myHashMap.eraseElementByKey(i);
    endTime = Date.now();
    reportList.push({
        testFunc: "eraseElementByKey",
        testNum: testNum,
        containerSize: size,
        runTime: endTime - startTime
    });

    console.log("HashMap test report done.");

    return {
        containerName: "HashMap",
        reportList
    };
}

function testIterator() {
    const containerArr = [
        new Vector(arr),
        new LinkList(arr),
        new Deque(arr),
        new SdslSet(arr),
        new SdslMap(arr.map((element, index) => ({
            key: element,
            value: index
        }))),
    ];

    const sortedArr = [...arr];
    sortedArr.sort((a, b) => a - b);

    console.log("Iterator test started...");

    console.log("Normal iterator test started...");
    for (const container of containerArr) {
        let index = 0;
        for (let it = container.begin() as ContainerIterator<unknown>; !it.equals(container.end() as ContainerIterator<unknown>); it = it.next()) {
            let testPassed = true;
            if (container instanceof SdslSet) {
                if (it.pointer !== sortedArr[index++]) {
                    testPassed = false;
                }
            } else if (container instanceof SdslMap) {
                if ((it as ContainerIterator<Pair<number, number>>).pointer.key !== arr[(it as ContainerIterator<Pair<number, number>>).pointer.value]) {
                    testPassed = false;
                }
            } else {
                if (it.pointer !== arr[index++]) {
                    testPassed = false;
                }
            }
            if (!testPassed) throw new Error(`${container.constructor.name}'s normal iterator error!`);
        }
    }
    console.log("Normal iterator test end, all tests passed.");

    console.log("Reverse iterator test started...");
    for (const container of containerArr) {
        let index = arr.length - 1;
        for (let it = container.rBegin() as ContainerIterator<unknown>; !it.equals(container.rEnd() as ContainerIterator<unknown>); it = it.next()) {
            let testPassed = true;
            if (container instanceof SdslSet) {
                if (it.pointer !== sortedArr[index--]) {
                    testPassed = false;
                }
            } else if (container instanceof SdslMap) {
                if ((it as ContainerIterator<Pair<number, number>>).pointer.key !== arr[(it as ContainerIterator<Pair<number, number>>).pointer.value]) {
                    testPassed = false;
                }
            } else {
                if (it.pointer !== arr[index--]) {
                    testPassed = false;
                }
            }
            if (!testPassed) throw new Error(`${container.constructor.name}'s reverse iterator error!`);
        }
    }
    console.log("Reverse iterator test end, all tests passed.");

    console.clear();
    console.log("Iterator test end, all tests passed.");
}

function main(taskQueue: string[]) {
    const testReport: testReportFormat[] = [];
    const testNum = 1000000;

    console.log("test start...");

    if (taskQueue.length === 0 || taskQueue.includes("Stack")) testReport.push(testStack(testNum * 10));
    if (taskQueue.length === 0 || taskQueue.includes("Queue")) testReport.push(testQueue(testNum * 10));
    if (taskQueue.length === 0 || taskQueue.includes("LinkList")) testReport.push(testLinkList(testNum));
    if (taskQueue.length === 0 || taskQueue.includes("Deque")) testReport.push(testDeque(testNum));
    if (taskQueue.length === 0 || taskQueue.includes("PriorityQueue")) testReport.push(testPriorityQueue(testNum * 10));
    if (taskQueue.length === 0 || taskQueue.includes("Set")) testReport.push(testSet(testNum));
    if (taskQueue.length === 0 || taskQueue.includes("Map")) testReport.push(testMap(testNum));
    if (taskQueue.length === 0 || taskQueue.includes("HashSet")) testReport.push(testHashSet(testNum));
    if (taskQueue.length === 0 || taskQueue.includes("HashMap")) testReport.push(testHashMap(testNum));
    if (taskQueue.length === 0 || taskQueue.includes("Iterator")) testIterator();

    console.clear();
    console.log("test end, all tests passed!");

    if (testReport.length) {
        console.log("=".repeat(35), "Report", "=".repeat(35));
        testReport.forEach(report => {
            console.log("=".repeat(35), report.containerName, "=".repeat(35));
            console.table(report.reportList);
        });
        console.log("=".repeat(35), "Report", "=".repeat(35));
    }
}

main(process.argv.slice(2));
