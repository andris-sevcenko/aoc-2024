import {getAllLines, Grid} from "../lib/utils.js";

const startTime = performance.now()

const map = new Grid();
map.setGrid(getAllLines('input.txt'), true);

class Walker {
    row = 0;
    col = 0;
    height = 0;
    source = [];

    constructor(row, col, height, source) {
        this.row = parseInt(row);
        this.col = parseInt(col);
        this.height = height;
        this.source = source;
    }
}

let walkers = [];
for (const start of map.find(0)) {
    walkers.push(new Walker(start.row, start.col, 0, [start.row, start.col]));
}

let p1 = {};
let p2 = {};

while (walkers.length > 0) {
    const newWalkers = [];
    for (let walker of walkers) {
        for (const adjacent of map.getAdjacent(walker.row, walker.col, false)) {
            if (adjacent.value === walker.height + 1) {
                if (adjacent.value === 9) {
                    const startHash = walker.source.join('.')
                    const endHash = adjacent.row + '.' + adjacent.col;
                    if (!p1[startHash]) {
                        p1[startHash] = {};
                    }
                    p1[startHash][endHash] = true;
                    if (!p2[startHash]) {
                        p2[startHash] = 1;
                    } else {
                        p2[startHash]++;
                    }
                } else {
                    newWalkers.push(new Walker(adjacent.row, adjacent.col, adjacent.value, walker.source))
                }
            }
        }
    }
    walkers = newWalkers;
}

let p1Answer = 0;
let p2Answer = 0;

for (const [coords, score] of Object.entries(p1)) {
    p1Answer += Object.entries(score).length;
}
for (const [coords, score] of Object.entries(p2)) {
    p2Answer += score;
}
console.log('P1: ', p1Answer);
console.log('P2: ', p2Answer
);

const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
