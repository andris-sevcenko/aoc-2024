import {getFile, Grid} from "../lib/utils.js";

const [gridData, instructions] = getFile('input.txt').split("\n\n");

const grid = new Grid();
grid.setGrid(gridData.split("\n").map(r => [...r]))


class Pusher {
    grid;
    row;
    col;
    constructor(row, col, grid) {
        this.row = row;
        this.col = col;
        this.grid = grid;
    }

    goUp() {
        for (let row = this.row - 1; row >= 0; row--) {
            if (this.grid.getCell(row, this.col) === '#') {
                return; // Pushed against the wall
            }

            if (this.grid.getCell(row, this.col) === '.') {
                for (let swapRow = row; swapRow < this.row; swapRow++) {
                    // Come back to pusher, swapping cells along the way.
                    const temp = this.grid.getCell(swapRow, this.col);
                    this.grid.setCell(swapRow, this.col, this.grid.getCell(swapRow + 1, this.col));
                    this.grid.setCell(swapRow + 1, this.col, temp);
                }
                this.row--;
                return;
            }
        }
    }
    goDown() {
        for (let row = this.row + 1; row <this.grid.maxGridRow; row++) {
            if (this.grid.getCell(row, this.col) === '#') {
                return; // Pushed against the wall
            }

            if (this.grid.getCell(row, this.col) === '.') {
                for (let swapRow = row; swapRow > this.row; swapRow--) {
                    // Come back to pusher, swapping cells along the way.
                    const temp = this.grid.getCell(swapRow, this.col);
                    this.grid.setCell(swapRow, this.col, this.grid.getCell(swapRow - 1, this.col));
                    this.grid.setCell(swapRow - 1, this.col, temp);
                }
                this.row++;
                return;
            }
        }
    }
    goRight() {
        for (let col = this.col + 1; col < this.grid.maxGridCol; col++) {
            if (this.grid.getCell(this.row, col) === '#') {
                return; // Pushed against the wall
            }

            if (this.grid.getCell(this.row, col) === '.') {
                for (let swapCol = col; swapCol > this.col; swapCol--) {
                    // Come back to pusher, swapping cells along the way.
                    const temp = this.grid.getCell(this.row, swapCol);
                    this.grid.setCell(this.row, swapCol, this.grid.getCell(this.row, swapCol - 1));
                    this.grid.setCell(this.row, swapCol - 1, temp);
                }
                this.col++;
                return;
            }
        }
    }

    goLeft() {
        for (let col = this.col - 1; col >= 0; col--) {
            if (this.grid.getCell(this.row, col) === '#') {
                return; // Pushed against the wall
            }

            if (this.grid.getCell(this.row, col) === '.') {
                for (let swapCol = col; swapCol < this.col; swapCol++) {
                    // Come back to pusher, swapping cells along the way.
                    const temp = this.grid.getCell(this.row, swapCol);
                    this.grid.setCell(this.row, swapCol, this.grid.getCell(this.row, swapCol + 1));
                    this.grid.setCell(this.row, swapCol + 1, temp);
                }
                this.col--;
                return;
            }
        }
    }
}

const start = grid.find('@')[0];
const pusher = new Pusher(start.row, start.col, grid);

grid.print(true)
for (const direction of [...instructions]) {
    switch (direction) {
        case '^':
            pusher.goUp();
            break;
        case '<':
            pusher.goLeft();
            break;
        case '>':
            pusher.goRight();
            break;
        case 'v':
            pusher.goDown();
            break;
    }
}

let p1 = 0;
for (const box of grid.find('O')) {
    p1 += box.row * 100 + box.col;
}

console.log('P1: ', p1)

