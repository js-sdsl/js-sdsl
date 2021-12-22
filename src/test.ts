import { SequentialContainerType } from "./Base/Base";
import { VectorType } from "./Vector/Vector";
import { StackType } from "./Stack/Stack";
import { QueueType } from "./Queue/Queue";
import { SetType } from "./Set/Set";
import { MapType } from "./Map/Map";
import {
    Vector,
    Stack,
    Queue,
    LinkList,
    Deque,
    PriorityQueue,
    Set,
    Map as SdslMap
} from "./index";

const arr: number[] = [];
for (let i = 0; i < 10000; ++i) arr.push(Math.random() * 1000000);
Object.freeze(arr);

function testStack() {
    function judgeStack(myStack: StackType<any>, myVector: VectorType<any>) {
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
            myVector.pop_back();
        }
    }

    console.log("Stack test start...");

    const myStack = new Stack(arr);
    const myVector = new Vector(arr);

    for (let i = 0; i < 1000; ++i) {
        const random = Math.random() * i;
        myStack.push(random);
        myVector.push_back(random);
    }
    judgeStack(myStack, myVector);

    for (let i = 0; i < 1000; ++i) {
        const random = Math.random() * i;
        myStack.push(random);
        myVector.push_back(random);
    }
    myStack.clear();
    myVector.clear();
    judgeStack(myStack, myVector);

    console.clear();
    console.log("Stack test end, all tests passed!");
}

function testQueue() {
    function judgeQueue(myQueue: QueueType<any>, myVector: VectorType<any>) {
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

    for (let i = 0; i < 1000; ++i) {
        const random = Math.random() * i;
        myQueue.push(random);
        myVector.push_back(random);
    }
    judgeQueue(myQueue, myVector);

    for (let i = 0; i < 1000; ++i) {
        const random = Math.random() * i;
        myQueue.push(random);
        myVector.push_back(random);
    }
    myQueue.clear();
    myVector.clear();
    judgeQueue(myQueue, myVector);

    console.clear();
    console.log("Queue test end, all tests passed!");
}

function judgeSequentialContainer(funcName: string, container: SequentialContainerType<any>, myVector: SequentialContainerType<any>) {
    let testResult = (container.size() === myVector.size());
    container.forEach((element, index) => {
        testResult = testResult && (element === myVector.getElementByPos(index));
    });
    if (!testResult) {
        throw new Error(`${funcName} test failed!`);
    }
    console.log(container.constructor.name, funcName, "test passed.");
}

function testSequentialContainer(container: SequentialContainerType<any>) {
    const containerName = container.constructor.name;
    console.log(containerName, "SequentialContainer standard test start...");

    const myVector = new Vector<any>(arr);

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
    console.log(containerName, "forEach test passed.");

    for (let i = 0; i < 5000; ++i) {
        const random = Math.random();
        container.push_back(random);
        myVector.push_back(random);
    }
    judgeSequentialContainer("push_back", container, myVector);

    for (let i = 0; i < 3000; ++i) {
        container.pop_back();
        myVector.pop_back();
    }
    judgeSequentialContainer("pop_back", container, myVector);

    let testResult = true;
    const len = container.size();
    testResult = testResult && (container.size() === myVector.size());
    for (let i = 0; i < len; ++i) {
        testResult = testResult && (container.getElementByPos(i) === myVector.getElementByPos(i));
    }
    if (!testResult) {
        console.error("getElementByPos test failed.");
        return;
    }
    console.log(containerName, "getElementByPos test passed.");

    for (let i = 0; i < len; ++i) {
        myVector.setElementByPos(i, i);
        container.setElementByPos(i, i);
    }
    judgeSequentialContainer("setElementByPos", container, myVector);

    for (let i = 0; i < 100; ++i) {
        const pos = Math.floor(Math.random() * myVector.size());
        container.eraseElementByPos(pos);
        myVector.eraseElementByPos(pos);
    }
    judgeSequentialContainer("eraseElementByPos", container, myVector);

    for (let i = 0; i < 100; ++i) {
        const pos = Math.floor(Math.random() * 10);
        const num = Math.floor(Math.random() * 10);
        container.insert(pos, 'q', num);
        myVector.insert(pos, 'q', num);
    }
    judgeSequentialContainer("insert", container, myVector);

    container.eraseElementByValue('q');
    myVector.eraseElementByValue('q');
    judgeSequentialContainer("eraseElementByValue", container, myVector);

    container.reverse();
    myVector.reverse();
    judgeSequentialContainer("reverse", container, myVector);

    for (let i = 0; i < 100; ++i) {
        const pos = Math.floor(Math.random() * 10);
        const num = Math.floor(Math.random() * 10);
        container.insert(pos, 'w', num);
        myVector.insert(pos, 'w', num);
    }
    container.unique();
    myVector.unique();
    judgeSequentialContainer("unique", container, myVector);

    for (let i = 0; i < 1000; ++i) {
        const random = Math.random() * 6;
        container.push_back(random);
        myVector.push_back(random);
    }
    container.sort((x, y) => x - y);
    myVector.sort((x, y) => x - y);
    judgeSequentialContainer("sort", container, myVector);

    container.clear();
    myVector.clear();
    judgeSequentialContainer("clear", container, myVector);

    console.clear();
    console.log(containerName, `SequentialContainer standard test end, all standard tests passed!`);
}

function testLink() {
    console.log("LinkList test start...");

    const myLinkList = new LinkList(arr);

    testSequentialContainer(myLinkList);

    const tmpArr = [];
    for (let i = 0; i < 100; ++i) {
        myLinkList.push_front(i);
        tmpArr.unshift(i);
    }
    judgeSequentialContainer("push_front", myLinkList, new Vector(tmpArr));

    for (let i = 0; i < 100; ++i) {
        myLinkList.pop_front();
        tmpArr.shift();
    }
    judgeSequentialContainer("pop_front", myLinkList, new Vector(tmpArr));

    for (let i = 0; i < 1000; ++i) {
        tmpArr.push(Math.random() * 1000);
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
}

function testDeque() {
    console.log("Deque test start...");

    const myDeque = new Deque(arr);

    testSequentialContainer(myDeque);

    const tmpArr = [];
    for (let i = 0; i < 100; ++i) {
        myDeque.push_front(i);
        tmpArr.unshift(i);
    }
    judgeSequentialContainer("push_front", myDeque, new Vector(tmpArr));

    for (let i = 0; i < 100; ++i) {
        myDeque.pop_front();
        tmpArr.shift();
    }
    judgeSequentialContainer("pop_front", myDeque, new Vector(tmpArr));

    myDeque.shrinkToFit();
    judgeSequentialContainer("shrinkToFit", myDeque, new Vector(tmpArr));

    console.clear();
    console.log("Deque test end, all tests passed!");
}

function testPriorityQueue() {
    console.log("PriorityQueue test start...");

    const cmp = (x: number, y: number) => y - x;

    const myPriority = new PriorityQueue(arr, cmp);
    const myVector = new Vector(arr);

    for (let i = 0; i < 1000; ++i) {
        const random = Math.random() * i;
        myPriority.push(random);
        myVector.push_back(random);
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
}

function testSet() {
    function judgeSet(mySet: SetType<number>, myVector: VectorType<number>) {
        if (mySet.getHeight() > 2 * Math.log2(mySet.size() + 1)) {
            throw new Error("set tree too high!");
        }
        if (mySet.size() !== myVector.size()) {
            throw new Error("set size test failed!");
        }
        myVector.sort((x, y) => x - y);
        mySet.forEach((element, index) => {
            if (myVector.getElementByPos(index) !== element) {
                throw new Error("Set test failed!");
            }
        });
    }

    console.log("Set test start...");

    const mySet = new Set(arr);
    const myVector = new Vector(arr);
    judgeSet(mySet, myVector);

    for (let i = 0; i < 10000; ++i) {
        const random = Math.random() * 1000000;
        mySet.insert(random);
        myVector.push_back(random);
    }
    judgeSet(mySet, myVector);

    for (let i = 0; i < 10000; ++i) {
        const pos = Math.floor(Math.random() * myVector.size());
        const eraseValue = myVector.getElementByPos(pos);
        myVector.eraseElementByPos(pos);
        mySet.eraseElementByValue(eraseValue);
    }
    judgeSet(mySet, myVector);

    for (let i = 0; i < 10000; ++i) {
        const pos = Math.floor(Math.random() * myVector.size());
        myVector.eraseElementByPos(pos);
        mySet.eraseElementByPos(pos);
    }
    judgeSet(mySet, myVector);

    const otherSet = new Set<number>();
    for (let i = 0; i < 20000; ++i) {
        const random = Math.random() * 1000000;
        otherSet.insert(random);
        myVector.push_back(random);
    }
    mySet.union(otherSet);
    judgeSet(mySet, myVector);

    myVector.forEach(element => {
        if (!mySet.find(element)) throw new Error("Set test failed!");
    });

    for (let i = 0; i < 10000; ++i) {
        mySet.eraseElementByPos(0);
        myVector.eraseElementByPos(0);
        if (mySet.front() !== myVector.front()) {
            throw new Error("Set test failed!");
        }
        mySet.eraseElementByPos(mySet.size() - 1);
        myVector.eraseElementByPos(myVector.size() - 1);
        if (mySet.back() !== myVector.back()) {
            throw new Error("Set test failed!");
        }
    }
    judgeSet(mySet, myVector);

    console.clear();
    console.log("Set test end, all tests passed!");
}

function testMap() {
    function judgeMap(myMap: MapType<number, number>, stdMap: Map<number, number>) {
        if (myMap.getHeight() > 2 * Math.log2(myMap.size() + 1)) {
            throw new Error("map tree too high!");
        }
        if (myMap.size() !== stdMap.size) {
            throw new Error("map tree too high!");
        }
        stdMap.forEach((value, key) => {
            const pair = myMap.getElementByKey(key);
            if (!pair || pair.key !== key || pair.value !== value || value !== stdMap.get(key)) {
                throw new Error("map test failed!");
            }
        });
    }

    console.log("map test start...");

    const myMap = new SdslMap(arr.map((element, index) => {
        return { key: element, value: index };
    }));
    const stdMap = new Map(arr.map((element, index) => {
        return [element, index];
    }));

    stdMap.forEach((value, key) => {
        const pair = myMap.getElementByKey(key);
        if (!pair || pair.key !== key || pair.value !== value || value !== stdMap.get(key)) {
            throw new Error("map test failed!");
        }
    });

    const eraseArr: number[] = [];
    myMap.forEach(({ key, value }) => {
        const v = stdMap.get(key);
        if (v !== value) {
            throw new Error("map test failed!");
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

    for (let i = 10000; i < 20000; ++i) {
        const random = Math.random() * 1000000;
        myMap.setElement(i, random);
        stdMap.set(i, random);
    }
    judgeMap(myMap, stdMap);

    for (let i = 0; i < 10000; ++i) {
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

    console.clear();
    console.log("map test end, all tests passed!");
}

function main() {
    const taskQueue = ["Stack", "Queue", "LinkList", "Deque", "PriorityQueue", "Set", "Map"];
    console.log("test start...");

    if (taskQueue.includes("Stack")) testStack();
    if (taskQueue.includes("Queue")) testQueue();
    if (taskQueue.includes("LinkList")) testLink();
    if (taskQueue.includes("Deque")) testDeque();
    if (taskQueue.includes("PriorityQueue")) testPriorityQueue();
    if (taskQueue.includes("Set")) testSet();
    if (taskQueue.includes("Map")) testMap();

    console.clear();
    console.log("test end, all tests passed!");
}

main();
