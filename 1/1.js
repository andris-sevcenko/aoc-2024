import {processFile} from "../lib/utils.js";

let listA = [];
let listB = [];
let listC = {};

processFile('input.txt', (line) => {
  const values = line.trim().match(/(\d+)\s+(\d+)/);
  if (values) {
    listA.push(values[[1]]);
    listB.push(values[[2]]);
    if (listC[values[2]]) {
      listC[values[2]]++;
    } else {
      listC[values[2]] = 1;
    }
  }
});

listA = listA.sort((a, b) => a - b);
listB = listB.sort((a, b) => a - b);

let sum = 0;
let sum2 = 0;
for (let i = 0; i < listA.length; i++) {
  const num = listA[i];

  sum += Math.abs(listA[i] - listB[i]);
  if (listC[num]) {
    sum2 += num * listC[num];
  }
}
console.log('P1: ', sum);
console.log('P2: ', sum2);
