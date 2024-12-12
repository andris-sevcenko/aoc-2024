import {getAllLines, Grid} from "../lib/utils.js";

const startTime = performance.now()

const grid = new Grid();
grid.setGrid(getAllLines('input.txt'));

const regions = [];
const mapped = new Set();

// Explore the grid and return an array of cells belonging to this region
const mapRegion = (row, col, grid, mapped) => {
    const marker = grid.getCell(row, col);
    const region = [];

    let explore = [[row, col]];
    region.push([row, col]);
    mapped.add(row + '.' + col)

    while (explore.length) {
        let nextPossible = [];

        for (const possible of explore) {
            for (const neighbour of grid.getAdjacent(possible[0], possible[1])) {
                const visitedHash = neighbour.row + '.' + neighbour.col;
                if (grid.getCell(neighbour.row, neighbour.col) === marker && !mapped.has(visitedHash)) {
                    region.push([neighbour.row, neighbour.col]);
                    nextPossible.push([neighbour.row, neighbour.col]);
                    mapped.add(visitedHash);
                }
            }
        }

        explore = nextPossible;
    }

    return region;
}


// For a given side piece, return other possible pieces of fence
const getPossibleFencePieces = (fence) => {
    switch (fence.side) {
        case 'N':
            return [{row: fence.row, col: parseInt(fence.col) - 1, side: 'N'}, {
                row: fence.row,
                col: parseInt(fence.col) + 1,
                side: 'N'
            }];
        case 'S':
            return [{row: fence.row, col: parseInt(fence.col) - 1, side: 'S'}, {
                row: fence.row,
                col: parseInt(fence.col) + 1,
                side: 'S'
            }];
        case 'W':
            return [{row: parseInt(fence.row) - 1, col: fence.col, side: 'W'}, {
                row: parseInt(fence.row) + 1,
                col: fence.col,
                side: 'W'
            }];
        case 'E':
            return [{row: parseInt(fence.row) - 1, col: fence.col, side: 'E'}, {
                row: parseInt(fence.row) + 1,
                col: fence.col,
                side: 'E'
            }];
    }

}

for (let row = 0; row <= grid.maxGridRow; row++) {
    for (let col = 0; col <= grid.maxGridCol; col++) {

        if (!mapped.has(row + '.' + col)) {
            regions.push(mapRegion(row, col, grid, mapped));
        }
    }
}

let p1 = 0;
let p2 = 0;

const sides = new Map();

for (const [key, region] of Object.entries(regions)) {
    const cell = grid.getCell(region[0][0], region[0][1]);
    let area = 0;
    let fences = 0;

    const regionFences = new Map();
    for (const regionCell of region) {
        const row = regionCell[0];
        const col = regionCell[1];

        area++;

        const neighbours = grid.getAdjacent(row, col);
        // Fences on the outside of the grid
        fences += (4 - neighbours.length);

        // Keep track of individual fence pieces, too
        let cellFences = new Set(['N', 'S', 'W', 'E']);

        for (const adjacent of neighbours) {
            if (adjacent.value !== cell) {
                // If this does not have the same plant, it needs a fence
                fences++;
            } else {
                // Remove sides from matching neighbours
                if (row > adjacent.row) {
                    cellFences.delete('N');
                }
                if (row < adjacent.row) {
                    cellFences.delete('S');
                }
                if (col > adjacent.col) {
                    cellFences.delete('W');
                }
                if (col < adjacent.col) {
                    cellFences.delete('E');
                }
            }
        }

        // Keep track of actual fence pieces
        for (const fence of cellFences.values()) {
            regionFences.set(row + '.' + col + '.' + fence, {row: row, col: col, side: fence});
        }
    }

    const enumerated = new Set();
    let sides = 0;

    // For each fence piece, build the entire side and keep count
    for (const [hash, fence] of regionFences.entries()) {
        if (enumerated.has(hash)) {
            continue;
        }
        sides++;
        enumerated.add(hash);

        let possible = getPossibleFencePieces(fence);

        while (possible.length > 0) {
            let nextPossible = []

            for (const fencePiece of possible) {
                const hash = fencePiece.row + '.' + fencePiece.col + '.' + fencePiece.side
                if (!enumerated.has(hash) && regionFences.has(hash)) {
                    enumerated.add(hash);
                    nextPossible = nextPossible.concat(getPossibleFencePieces(fencePiece));

                }
            }

            possible = nextPossible;
        }
    }
    p1 += fences * area;
    p2 += sides * area;
}

console.log('P1: ', p1);
console.log('P2: ', p2);

const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
