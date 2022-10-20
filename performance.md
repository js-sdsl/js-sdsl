This is Js-sdsl performance test. To get source code you can go to [github](https://github.com/js-sdsl/js-sdsl/tree/main/performance).

## Environment

```bash
Linux 5.15.0-1020-azure x64
Node.JS 16.17.0
V8 9.4.146.26-node.22
Intel(R) Xeon(R) Platinum 8171M CPU @ 2.60GHz × 2
```

## Result

### Stack

<table>
  <tr>
    <td>testFunc</td>
    <td>testNum</td>
    <td>containerSize</td>
    <td>runTime</td>
  </tr>
  <tr>
    <td>push</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>39</td>
  </tr>
  <tr>
    <td>clear</td>
    <td>1</td>
    <td>2000000</td>
    <td>0</td>
  </tr>
</table>

### Queue

<table>
  <tr>
    <td>testFunc</td>
    <td>testNum</td>
    <td>containerSize</td>
    <td>runTime</td>
  </tr>
  <tr>
    <td>push</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>32</td>
  </tr>
  <tr>
    <td>clear</td>
    <td>1</td>
    <td>2000000</td>
    <td>0</td>
  </tr>
</table>

### PriorityQueue

<table>
  <tr>
    <td>testFunc</td>
    <td>testNum</td>
    <td>containerSize</td>
    <td>runTime</td>
  </tr>
  <tr>
    <td>constructor</td>
    <td>1</td>
    <td>1000000</td>
    <td>23</td>
  </tr>
  <tr>
    <td>push</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>56</td>
  </tr>
  <tr>
    <td>pop all</td>
    <td>1</td>
    <td>2000000</td>
    <td>546</td>
  </tr>
</table>

### LinkList

<table>
  <tr>
    <td>testFunc</td>
    <td>testNum</td>
    <td>containerSize</td>
    <td>runTime</td>
  </tr>
  <tr>
    <td>pushBack</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>306</td>
  </tr>
  <tr>
    <td>popBack</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>43</td>
  </tr>
  <tr>
    <td>getElementByPos</td>
    <td>1000</td>
    <td>2000000</td>
    <td>4</td>
  </tr>
  <tr>
    <td>setElementByPos</td>
    <td>1000</td>
    <td>2000000</td>
    <td>5</td>
  </tr>
  <tr>
    <td>eraseElementByPos</td>
    <td>50</td>
    <td>2000000</td>
    <td>895</td>
  </tr>
  <tr>
    <td>insert</td>
    <td>50</td>
    <td>2000050</td>
    <td>836</td>
  </tr>
  <tr>
    <td>eraseElementByValue</td>
    <td>1</td>
    <td>2000050</td>
    <td>36</td>
  </tr>
  <tr>
    <td>reverse</td>
    <td>1</td>
    <td>1999950</td>
    <td>29</td>
  </tr>
  <tr>
    <td>unique</td>
    <td>1</td>
    <td>2000050</td>
    <td>50</td>
  </tr>
  <tr>
    <td>sort</td>
    <td>1</td>
    <td>3000000</td>
    <td>2849</td>
  </tr>
  <tr>
    <td>clear</td>
    <td>1</td>
    <td>3000000</td>
    <td>0</td>
  </tr>
  <tr>
    <td>pushFront</td>
    <td>1000000</td>
    <td>1000000</td>
    <td>182</td>
  </tr>
  <tr>
    <td>popFront</td>
    <td>1000000</td>
    <td>1000000</td>
    <td>28</td>
  </tr>
  <tr>
    <td>merge</td>
    <td>1</td>
    <td>1000000</td>
    <td>183</td>
  </tr>
</table>

### Deque

<table>
  <tr>
    <td>testFunc</td>
    <td>testNum</td>
    <td>containerSize</td>
    <td>runTime</td>
  </tr>
  <tr>
    <td>pushBack</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>66</td>
  </tr>
  <tr>
    <td>popBack</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>101</td>
  </tr>
  <tr>
    <td>getElementByPos</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>53</td>
  </tr>
  <tr>
    <td>setElementByPos</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>56</td>
  </tr>
  <tr>
    <td>eraseElementByPos</td>
    <td>50</td>
    <td>2000000</td>
    <td>2406</td>
  </tr>
  <tr>
    <td>insert</td>
    <td>50</td>
    <td>2000050</td>
    <td>2110</td>
  </tr>
  <tr>
    <td>eraseElementByValue</td>
    <td>1</td>
    <td>2000050</td>
    <td>119</td>
  </tr>
  <tr>
    <td>reverse</td>
    <td>1</td>
    <td>1999950</td>
    <td>52</td>
  </tr>
  <tr>
    <td>unique</td>
    <td>1</td>
    <td>2000050</td>
    <td>65</td>
  </tr>
  <tr>
    <td>sort</td>
    <td>1</td>
    <td>3000000</td>
    <td>2199</td>
  </tr>
  <tr>
    <td>clear</td>
    <td>1</td>
    <td>3000000</td>
    <td>0</td>
  </tr>
  <tr>
    <td>pushFront</td>
    <td>2000000</td>
    <td>2000000</td>
    <td>82</td>
  </tr>
  <tr>
    <td>popFront</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>20</td>
  </tr>
  <tr>
    <td>shrinkToFit</td>
    <td>1</td>
    <td>1000000</td>
    <td>86</td>
  </tr>
</table>

### OrderedSet

<table>
  <tr>
    <td>testFunc</td>
    <td>testNum</td>
    <td>containerSize</td>
    <td>runTime</td>
  </tr>
  <tr>
    <td>constructor</td>
    <td>1</td>
    <td>1000000</td>
    <td>1871</td>
  </tr>
  <tr>
    <td>insert</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>719</td>
  </tr>
  <tr>
    <td>eraseElementByKey</td>
    <td>1000000</td>
    <td>3000000</td>
    <td>444</td>
  </tr>
  <tr>
    <td>eraseElementByPos</td>
    <td>10</td>
    <td>3000000</td>
    <td>928</td>
  </tr>
  <tr>
    <td>union</td>
    <td>1</td>
    <td>2999990</td>
    <td>2790</td>
  </tr>
  <tr>
    <td>lowerBound</td>
    <td>1000000</td>
    <td>2999990</td>
    <td>1489</td>
  </tr>
  <tr>
    <td>upperBound</td>
    <td>1000000</td>
    <td>2999990</td>
    <td>1548</td>
  </tr>
  <tr>
    <td>reverseLowerBound</td>
    <td>1000000</td>
    <td>2999990</td>
    <td>1520</td>
  </tr>
  <tr>
    <td>reverseUpperBound</td>
    <td>1000000</td>
    <td>2999990</td>
    <td>1558</td>
  </tr>
</table>

### OrderedMap

<table>
  <tr>
    <td>testFunc</td>
    <td>testNum</td>
    <td>containerSize</td>
    <td>runTime</td>
  </tr>
  <tr>
    <td>constructor</td>
    <td>1</td>
    <td>1000000</td>
    <td>2089</td>
  </tr>
  <tr>
    <td>setElement</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>843</td>
  </tr>
  <tr>
    <td>eraseElementByKey</td>
    <td>1000000</td>
    <td>2000000</td>
    <td>419</td>
  </tr>
  <tr>
    <td>eraseElementByPos</td>
    <td>10</td>
    <td>1000000</td>
    <td>346</td>
  </tr>
  <tr>
    <td>union</td>
    <td>1</td>
    <td>1999990</td>
    <td>1988</td>
  </tr>
  <tr>
    <td>lowerBound</td>
    <td>1000000</td>
    <td>1999990</td>
    <td>1525</td>
  </tr>
  <tr>
    <td>upperBound</td>
    <td>1000000</td>
    <td>1999990</td>
    <td>1529</td>
  </tr>
  <tr>
    <td>reverseLowerBound</td>
    <td>1000000</td>
    <td>1999990</td>
    <td>1468</td>
  </tr>
  <tr>
    <td>reverseUpperBound</td>
    <td>1000000</td>
    <td>1999990</td>
    <td>1485</td>
  </tr>
</table>

### HashSet

<table>
  <tr>
    <td>testFunc</td>
    <td>testNum</td>
    <td>containerSize</td>
    <td>runTime</td>
  </tr>
  <tr>
    <td>constructor</td>
    <td>1</td>
    <td>1000000</td>
    <td>1852</td>
  </tr>
  <tr>
    <td>insert</td>
    <td>100000</td>
    <td>1100000</td>
    <td>197</td>
  </tr>
  <tr>
    <td>find</td>
    <td>1100000</td>
    <td>1100000</td>
    <td>919</td>
  </tr>
  <tr>
    <td>eraseElementByKey</td>
    <td>1100000</td>
    <td>1100000</td>
    <td>1036</td>
  </tr>
</table>

### HashMap

<table>
  <tr>
    <td>testFunc</td>
    <td>testNum</td>
    <td>containerSize</td>
    <td>runTime</td>
  </tr>
  <tr>
    <td>constructor</td>
    <td>1</td>
    <td>1000000</td>
    <td>2356</td>
  </tr>
  <tr>
    <td>setElement</td>
    <td>100000</td>
    <td>1000000</td>
    <td>389</td>
  </tr>
  <tr>
    <td>getElementByKey</td>
    <td>1000000</td>
    <td>1000000</td>
    <td>4613</td>
  </tr>
  <tr>
    <td>eraseElementByKey</td>
    <td>100000</td>
    <td>1000000</td>
    <td>359</td>
  </tr>
</table>