import {processFile} from "../lib/utils.js";
const startTime = performance.now()

let p1 = 0;
let p2 = 0;

processFile('input.txt', (line) => {
    let parts = line.trim().split(':')

    const nums = parts[1].trim().split(' ').map(n => parseInt(n));
    const result = parseInt(parts[0]);

    const to = Number(Math.pow(2, nums.length - 1) - 1)

    const initial = nums.shift();

    for (let operationString = 0; operationString <= to; operationString++) {
        const operationStringInBinary = operationString.toString(2).padStart(nums.length, '0');
        const thisOperation =  nums.reduce((prev, cur, idx) => {
            if (!operationStringInBinary[idx] || operationStringInBinary[idx] === '0') {
                return prev + cur;
            }
            return prev * cur;
        }, initial)

        if (thisOperation === result) {
            p1 += result
            break;
        }
    }
})

console.log('P1: ', p1);

processFile('input.txt', (line) => {
    let parts = line.trim().split(':')

    const nums = parts[1].trim().split(' ').map(n => parseInt(n));
    const result = parseInt(parts[0]);

    const to = Number(Math.pow(3, nums.length - 1) - 1)

    const initial = nums.shift();

    for (let operationString = 0; operationString <= to; operationString++) {
        const operationStringInBase3 = operationString.toString(3).padStart(nums.length, '0');
        const thisOperation =  nums.reduce((prev, cur, idx) => {
            if (!operationStringInBase3[idx] || operationStringInBase3[idx] === '0') {
                return prev + cur;
            } else if (operationStringInBase3[idx] === '1') {
                return prev * cur;
            } else {
                return parseInt(prev.toString().concat(cur.toString()))
            }

        }, initial)

        if (thisOperation === result) {
            p2 += result
            break;
        }
    }
})

console.log('P2: ', p2);
const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
