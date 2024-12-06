import {getAllLines, Grid} from "../lib/utils.js";
const startTime = performance.now()

const grid = new Grid();

class Guard {
    pos = [];
    dir = [];

    constructor(pos, dir) {
        this.pos = pos;
        this.dir = dir;
    }

    getNext () {
        return [this.pos[0] + this.dir[0], this.pos[1] + this.dir[1]];
    }

    move () {
        this.pos = this.getNext();
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

grid.setGrid(getAllLines('input.txt'));
const guard = new Guard([89, 51], [-1, 0])
grid.setCell(89, 51, 'X');

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



const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
