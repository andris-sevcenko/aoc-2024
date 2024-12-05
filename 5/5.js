import {getAllLines} from "../lib/utils.js";
const startTime = performance.now()

const isMore = {};
const manuals = [];

let readingRules = true;
for (const line of getAllLines('input.txt')) {
    if (line.trim().length === 0) {
        readingRules = false;
        continue;
    }

    if (readingRules) {
        const parts = line.split('|');
        const less = parseInt(parts[0]);
        const more = parseInt(parts[1]);

        if (!isMore[more]) {
            isMore[more] = [];
        }
        isMore[more].push(less);
    } else {
        manuals.push(line)
    }
}

const quickSort = (arr) => {
    if (arr.length <= 1) {
        return arr;
    }

    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];

    for (let i = 1; i < arr.length; i++) {
        const num = arr[i];
        if (isMore[pivot] && isMore[pivot].includes(num)) {
            leftArr.push(arr[i]);
        } else {
            rightArr.push(arr[i]);
        }
    }
    return [...quickSort(leftArr), pivot, ...quickSort(rightArr)];
}

let p1 = 0;
let p2 = 0;

for (const manual of manuals) {
    const sorted = quickSort(manual.split(',').map((el) => parseInt(el)));
    
    if (sorted.join(',') === manual) {
        const parts = manual.split(',');
        const start = Math.floor(parts.length / 2);
        p1 += parseInt(parts.slice(start, start + 1));
    } else {
        const start = Math.floor(sorted.length / 2);
        p2 += parseInt(sorted.slice(start, start + 1));
    }
}

console.log('P1: ', p1);
console.log('P2: ', p2);

const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
