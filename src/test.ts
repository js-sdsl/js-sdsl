import LinkList from "./LinkList/LinkList";
import Deque from "./Deque/Deque";

function testLink(arr: any[] = []) {
    console.log("testLink");

    const myLink = new LinkList(arr);
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    console.log('size =', myLink.size());
    console.log(myLink.front());
    console.log(myLink.back());

    myLink.insert(myLink.size() - 2, 5, 10);
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    myLink.push_front(88);
    myLink.push_back(77);
    console.log('size =', myLink.size());
    console.log(myLink.front());
    console.log(myLink.back());

    myLink.pop_back();
    myLink.pop_front();
    console.log('size =', myLink.size());
    console.log(myLink.front());
    console.log(myLink.back());

    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    myLink.eraseElementByPos(2);
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    myLink.eraseElementByValue(5);
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    myLink.merge(new LinkList([2, 5, 6, 7, 555]));
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    for (let i = 0; i < 10; ++i) {
        myLink.push_front(Math.random() * 10);
    }
    myLink.sort((x, y) => x - y);
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    myLink.reverse();
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    for (let i = 0; i < 10; ++i) myLink.push_back(0);
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    myLink.unique();
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });

    myLink.clear();
    console.log('size =', myLink.size());
    myLink.forEach((element, index) => {
        console.log(index, element);
    });
}

function testDeque(arr: any[]) {
    console.log("testDeque");

    const myDeque = new Deque(arr);
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    myDeque.pop_front();
    myDeque.pop_back();
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    // for (let i = 0; i < 3000; ++i) {
    //     myDeque.push_front(i);
    //     myDeque.push_back(i);
    // }
    // console.log('size =', myDeque.size());
    // myDeque.forEach((element, index) => {
    //     console.log(index, element);
    // });

    myDeque.shrinkToFit();
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    const len = myDeque.size();
    console.log('size =', myDeque.size());
    for (let i = 0; i < len; ++i) console.log(i, myDeque.getElementByPos(i));

    console.log('size =', myDeque.size());
    for (let i = 0; i < len; ++i) {
        myDeque.setElementByPos(i, i);
        console.log(i, myDeque.getElementByPos(i));
    }

    myDeque.insert(2, 'q', 5);
    myDeque.insert(6, 'w', 3);
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    myDeque.eraseElementByPos(1);
    myDeque.eraseElementByPos(9);
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    myDeque.eraseElementByValue('q');
    myDeque.eraseElementByValue('w');
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    // const otherDeque = new Deque(arr);
    // myDeque.swap(otherDeque);
    // console.log('size =', myDeque.size());
    // myDeque.forEach((element, index) => {
    //     console.log(index, element);
    // });
    // console.log('size =', otherDeque.size());
    // otherDeque.forEach((element, index) => {
    //     console.log(index, element);
    // });

    myDeque.reverse();
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    for (let i = 0; i < 10; ++i) {
        myDeque.push_front(0);
        myDeque.push_back(1);
    }
    myDeque.unique();
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    for (let i = 0; i < 10; ++i) {
        myDeque.push_back(Math.random() * 6);
    }
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    myDeque.sort((x, y) => x - y);
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });

    myDeque.clear();
    console.log('size =', myDeque.size());
    myDeque.forEach((element, index) => {
        console.log(index, element);
    });
}

function main() {
    const arr: number[] = [1, 2, 3, 4, 5, 6];
    testLink(arr);
    testDeque(arr);
}

main();
