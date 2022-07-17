import Vector from "./Vector/Vector";
import Stack from "./Stack/Stack";
import Queue from "./Queue/Queue";
import LinkList from "./LinkList/LinkList";
import Deque from "./Deque/Deque";
import PriorityQueue from "./PriorityQueue/PriorityQueue";
import OrderedSet from "./OrderedSet/OrderedSet";
import OrderedMap from "./OrderedMap/OrderedMap";
import HashSet from "./HashSet/HashSet";
import HashMap from "./HashMap/HashMap";

if (typeof Symbol.iterator !== 'symbol') {
    console.warn("Your running environment does not support symbol type, you may can not use the 'for...of' syntax.");
}

export {
    Vector,
    Stack,
    Queue,
    LinkList,
    Deque,
    PriorityQueue,
    OrderedSet,
    OrderedMap,
    HashSet,
    HashMap
};
