import {getAllLines, Grid, processFile} from "../lib/utils.js";

const startTime = performance.now()

class WordMap extends Grid {
    getHasWordInDirection (word, row, col, direction) {
        if (this.getCell(row, col) === word[0]) {
            if (word.length === 1) {
                return true;
            }

            return this.getHasWordInDirection(word.substring(1), row + direction[0], col + direction[1], direction);
        }

        return false;
    }
}

const wordMap = new WordMap();
wordMap.setGrid(getAllLines('input.txt'));

let p1Hits = 0;
let p2Hits = 0;

const p1Directions = [
    [-1,0],
    [-1,-1],
    [-1,1],
    [0,-1],
    [0,1],
    [1,0],
    [1,-1],
    [1,1],
];
const p2Directions = [
    [-1,-1],
    [-1,1],
    [1,-1],
    [1,1],
];


const foundMas = {};

for (let r = 0; r <= wordMap.maxGridRow; r++) {
    for (let c = 0; c <= wordMap.maxGridCol; c++) {
        if (wordMap.getCell(r, c) === 'X') {
            for (const direction of p1Directions) {
                p1Hits += wordMap.getHasWordInDirection('XMAS', r, c, direction) ? 1 : 0;
            }
        }
        if (wordMap.getCell(r, c) === 'M') {
            for (const direction of p2Directions) {
                if (wordMap.getHasWordInDirection('MAS', r, c, direction)) {
                    const thisHash = `${r}-${c}|${r + direction[0]}-${c + direction[1]}|${r + direction[0] + direction[0]}-${c + direction[1] + direction[1]}`;

                    // Generate hashes that would complete this X
                    const crossHashes = [
                        `${r + direction[0] + direction[0]}-${c}|${r + direction[0]}-${c + direction[1]}|${r}-${c + direction[1] + direction[1]}`,
                        `${r}-${c + direction[1] + direction[1]}|${r + direction[0]}-${c + direction[1]}|${r + direction[0] + direction[0]}-${c}`
                    ];

                    foundMas[thisHash] = crossHashes;
                }
            }
        }
    }
}

const allHashes = Object.keys(foundMas);

for (const [thisHash, hashes] of Object.entries(foundMas)) {
    for (const hash of hashes) {
        if (allHashes.includes(hash)) {
            p2Hits++;
        }
    }
}

console.log('P1: ', p1Hits);

// Divide by 2, because reverse hits have also been recorded
console.log('P2: ', p2Hits / 2);

const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)