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

let p1 = 0;
for (const entry of visited.values()) {
    let numeric = entry.split('.').map((el) => parseInt(el));

    let alternatives = [
        [numeric[0] - 2, numeric[1]],
        [numeric[0] + 2, numeric[1]],
        [numeric[0], numeric[1] - 2],
        [numeric[0], numeric[1] + 2],
    ]

    for (const alternative of alternatives) {
        const alternativeHash = alternative[0].toString() + '.' + alternative[1].toString();
        if (visited.has(alternativeHash)) {
            let source =  moveList.findIndex((el) => el === entry);
            let dest =  moveList.findIndex((el) => el === alternativeHash);
            const distance = dest - source;
            if (distance - 2 >= 100) { // Subtract 2, because that's time lost, anyway
                p1++;
            }
        }
    }
}

console.log('P1:', p1);