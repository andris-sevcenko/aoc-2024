import {processFile} from "../lib/utils.js";

const startTime = performance.now()

let p1 = 0,
    p2 = 0,
    active = true;

processFile('input.txt', (line) => {
    const matches = line.matchAll(/(do\(\)|don't\(\)|mul\(([\d]{1,3}),([\d]{1,3})\))/g);
    for (const match of matches) {
        switch (match[1]) {
            case 'do()':
                active = true;
                break;
            case "don't()":
                active = false;
                break;
            default:
                p1 += parseInt(match[2]) * parseInt(match[3]);
                if (active) {
                    p2 += parseInt(match[2]) * parseInt(match[3]);
                }
        }
    }
});


console.log('P1: ', p1);
console.log('P2: ', p2);
const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)