import {getAllLines, Grid} from "../lib/utils.js";

const startTime = performance.now()
const grid = new Grid();
grid.setGrid(getAllLines('input.txt'));

const antennas = {}

for (let r = 0; r <= grid.maxGridRow; r++) {
    for (let c = 0; c <= grid.maxGridCol; c++) {
        const cell = grid.getCell(r, c).toString();
        if (cell !== '.') {
            if (!antennas[cell]) {
                antennas[cell] = [];
            }

            antennas[cell].push([r, c]);
        }
    }
}

const p1 = {};
let p2 = {};

for (const [antenna, coords] of Object.entries(antennas)) {
    for (let c1 of coords) {
        for (let c2 of coords) {
            if (c1 !== c2) {
                const rowVelocity = c2[0] - c1[0];
                const colVelocity = c2[1] - c1[1];

                // P1
                let locRow = c1[0] - rowVelocity;
                let locCol = c1[1] - colVelocity;
                if (grid.isInBounds(locRow, locCol)) {
                    const loc = locRow + '.' + locCol;
                    p1[loc] = true;
                }

                // P2
                let check = [c1[0], c1[1]];
                do {
                    if (grid.isInBounds(check[0], check[1])) {
                        const loc = check[0] + '.' + check[1];
                        p2[loc] = true;
                    } else {
                        break;
                    }
                    check[0] += rowVelocity;
                    check[1] += colVelocity;
                } while (true);
            }
        }
    }
}
console.log('P1: ', Object.keys(p1).length)
console.log('P2: ', Object.keys(p2).length)
const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
