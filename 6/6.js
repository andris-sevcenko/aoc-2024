import {getAllLines, Grid} from "../lib/utils.js";
const startTime = performance.now()

const grid = new Grid();

class Guard {
    pos = [];
    dir = [];
    visited = {};

    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }

    getNext () {
        return [this.pos[0] + this.dir[0], this.pos[1] + this.dir[1]];
    }

    move () {
        this.pos = this.getNext();
        const hash = this.pos.join('.') + '-' + this.dir.join(',')

        if (this.visited[hash]) {
            return true;
        }

        this.visited[hash] = true;
    }

    turn () {
        const dir = this.dir[0] + '.' + this.dir[1];
        switch (dir) {
            case '-1.0':
                this.dir = [0, 1];
                return;
            case '0.1':
                this.dir = [1, 0];
                return;
            case '1.0':
                this.dir = [0, -1];
                return;
            case '0.-1':
                this.dir = [-1, 0];
                return;
        }
    }
}

const inputGrid = getAllLines('input.txt')

grid.setGrid(inputGrid);
const startPos = [89, 51];
const guard = new Guard(startPos, [-1, 0])

do {
    const guardMove = guard.getNext();
    const nextMove = grid.getCell(guardMove[0], guardMove[1]);
    if (!nextMove) {
        break;
    }

    if (nextMove === '#') {
        guard.turn();
        continue;
    }

    grid.setCell(guardMove[0], guardMove[1], 'X');
    guard.move();
} while (true)

const total = grid.count('X');
console.log('P1: ', total);

let p2 = 0;
// Part 2 here we go
for (let r = 0; r <= grid.maxGridRow; r++) {
    for (let c = 0; c <= grid.maxGridCol; c++) {
        grid.setGrid(inputGrid);
        if (grid.getCell(r, c) === '#' || grid.getCell(r, c) === '^') {
            continue;
        }
        grid.setCell(r, c, '#');
        const p2Guard = new Guard(startPos, [-1, 0])

        do {
            const guardMove = p2Guard.getNext();
            const nextMove = grid.getCell(guardMove[0], guardMove[1]);
            if (!nextMove) {
                break;
            }

            if (nextMove === '#') {
                p2Guard.turn();
                continue;
            }

            grid.setCell(guardMove[0], guardMove[1], 'X');
            const res = p2Guard.move();
            if (res) {
                p2++;
                break;
            }
        } while (true)
    }
}
console.log('P2: ', p2);
const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
