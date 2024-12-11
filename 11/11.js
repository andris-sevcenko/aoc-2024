import {getAllLines, getFirstLine, Grid} from "../lib/utils.js";

const startTime = performance.now()

// Return rules for a stone during a blink
const transformStone = (value) => {
    if (value === 0) {
        return [1];
    }

    const valAsString = value.toString();
    if (valAsString.length % 2 === 0) {
        const leftVal = valAsString.substring(0, valAsString.length / 2);
        const rightVal = valAsString.substring(valAsString.length / 2);

        return [parseInt(leftVal), parseInt(rightVal)];
    }

    return [value *= 2024];
}

// Count stones in a collection
const countStones = (map) => {
    let stones = 0;

    thisBlink.forEach((count) => {
        stones += count;
    });

    return stones;
}


let line = getFirstLine('input.txt').split(' ').map((val) => parseInt(val))

const stoneRules = {};
let thisBlink = new Map();

// Set up rules and stone collection
for (const stone of line) {
    stoneRules[stone] = transformStone(stone);
    thisBlink.set(stone, 1);
}

// Each blink, look at the stones we have and calculate how many of which stones we'll have after the blink
for (let blink = 1; blink <= 75; blink++) {
    let nextBlink = new Map();
    thisBlink.forEach((count, stone) => {
        // Add new rule, if we don't have that
        if (!stoneRules[stone]) {
            stoneRules[stone] = transformStone(stone);
        }

        for (const newStone of stoneRules[stone]) {
            if (nextBlink.has(newStone)) {
                nextBlink.set(newStone, nextBlink.get(newStone) + count);
            } else {
                nextBlink.set(newStone, count);
            }
        }
    });

    thisBlink = nextBlink;

    if (blink === 25) {
        console.log('P1: ', countStones(thisBlink));
    }
}

console.log('P2: ', countStones(thisBlink));

const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
