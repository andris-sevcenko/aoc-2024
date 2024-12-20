import {getAllLines, Grid} from "../lib/utils.js";

const hash = (node) => node.row + '.' + node.col

const gridData = getAllLines('input.txt');

const grid = new Grid();
grid.setGrid(gridData.map(r => [...r]))

const start = grid.find('S')[0];
let here = start;

const visited = new Set([hash(here)]);
const moveList = [];

while (true) {
    visited.add(hash(here))
    moveList.push(hash(here));
    const next = grid.getAdjacent(here.row, here.col).filter((el) => (el.value === '.' || el.value === 'E')).filter((el) => !visited.has(hash(el)));
    if (next[0].value === 'E') {
        visited.add(hash(next[0]));
        moveList.push(hash(next[0]));
        break;
    }
    here = next[0];
}

let p2 = 0;
const proximity = (a, b) => {
    let aa = a.split('.').map((el) => parseInt(el));
    let bb = b.split('.').map((el) => parseInt(el));
    return Math.abs(aa[0] - bb[0]) + Math.abs(aa[1] - bb[1]);
}

const cheats = new Set();

for (const idx in moveList) {
    const move = moveList[idx];
    // Very suboptimal, there has to be a better way. I mean, within this already suboptimal bubble-traverse
    
    for (let nextMoveIdx = parseInt(idx) + 99; nextMoveIdx < moveList.length; nextMoveIdx++) {
        let dist = nextMoveIdx - idx;
        let leapDistance = proximity(move, moveList[nextMoveIdx])
        if (leapDistance <= 20 && dist > 99 + leapDistance) {
            p2++;
        }
    }
}


console.log('P2:', p2);