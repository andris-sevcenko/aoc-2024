import {getAllLines, Grid} from "../lib/utils.js";

// const SIZE = 7;
// const FILE = 'input-test.txt';

const SIZE = 71;
const FILE = 'input.txt';

const hash = (node) => node.row + '.' + node.col

let gridData = [];
for (let r = 0; r < SIZE; r++) {
    gridData[r] = []
    for (let c = 0; c < SIZE; c++) {
        gridData[r][c] = '.';
    }
}

let count = 70;

again:
while (true) {
    count++;
    const grid = new Grid();
    grid.setGrid(gridData);

    for (const wall of getAllLines(FILE).slice(0, count)) {
        let coords = wall.split(',');
        grid.setCell(coords[1], coords[0], '#');
    }

    grid.setCell(0,0, 'S');
    grid.setCell(SIZE - 1,SIZE - 1, 'E');


    const visited = new Set();

    let start = {row: 0, col: 0};
    let traversables = new Map();
    traversables.set(hash(start), start);

    let steps = 1;

    while (traversables.size > 0) {
        const newTraversables = new Map();

        for (const [key, node] of traversables.entries()) {
            visited.add(key);
            let options = grid.getAdjacent(node.row, node.col).filter((el) => el.value === '.' || el.value === 'E');

            for (const thisNode of options) {
                if (thisNode.value === 'E') {
                    continue again;
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

    console.log('Blocked after', getAllLines(FILE)[count - 1]);
    break;
}
