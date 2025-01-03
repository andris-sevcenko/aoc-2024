import {getAllLines, Grid} from "../lib/utils.js";

// const SIZE = 7;
// const COUNT = 12;
// const FILE = 'input-test.txt';

const SIZE = 71;
const COUNT = 1024;
const FILE = 'input.txt';

const hash = (node) => node.row + '.' + node.col

let gridData = [];
for (let r = 0; r < SIZE; r++) {
    gridData[r] = []
    for (let c = 0; c < SIZE; c++) {
        gridData[r][c] = '.';
    }
}

const grid = new Grid();
grid.setGrid(gridData);

for (const wall of getAllLines(FILE).slice(0, COUNT)) {
    let coords = wall.split(',');
    grid.setCell(coords[1], coords[0], '#');
}

grid.setCell(0,0, 'S');
grid.setCell(SIZE - 1,SIZE - 1, 'E');

grid.print(true);

const visited = new Set();

let start = {row: 0, col: 0};
let traversables = new Map();
traversables.set(hash(start), start);

let steps = 1;

stop:
while (traversables.size > 0) {
    const newTraversables = new Map();

    for (const [key, node] of traversables.entries()) {
        visited.add(key);
        let options = grid.getAdjacent(node.row, node.col).filter((el) => el.value === '.' || el.value === 'E');

        for (const thisNode of options) {
            if (thisNode.value === 'E') {
                console.log(steps);
                break stop;
            }

            const h = hash(thisNode);
            if (!visited.has(h) && !traversables.has(h)) {
                newTraversables.set(h, thisNode);
            }
        }

        traversables = newTraversables;
    }
    steps++;

}