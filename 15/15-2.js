import {getFile, Grid} from "../lib/utils.js";

const [gridData, instructions] = getFile('input.txt').split("\n\n");

const grid = new Grid();

// Expand the warehouse
grid.setGrid(gridData.split("\n")
    .map(r => { // Expand warehouse
        return r.replaceAll('#', '##')
            .replaceAll('.', '..')
            .replaceAll('O', '[]')
            .replaceAll('@', '@.')
    })
    .map(r => [...r])) // Split to array


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
        let pushCols = new Set([this.col]);
        let pushColStack = [pushCols]

        for (let row = this.row - 1; row >= 0; row--) {
            // Break if any pushcols have a wall.
            for (const pushCol of pushCols.values()) {
                if (this.grid.getCell(row, pushCol) === '#') {
                    return;
                }
            }

            let canPush = true;
            let newPushCols = new Set(pushCols.values());

            // Check if we can push. If not, register any new cols we're pushing in the stack
            for (const pushCol of pushCols.values()) {
                if (this.grid.getCell(row, pushCol) === '.') {
                    newPushCols.delete(pushCol)
                }

                if (this.grid.getCell(row, pushCol) !== '.') {
                    canPush = false;
                }

                if (this.grid.getCell(row, pushCol) === '[') {
                    newPushCols.add(pushCol + 1);
                }
                if (this.grid.getCell(row, pushCol) === ']') {
                    newPushCols.add(pushCol - 1);
                }
            }

            if (!canPush) {
                pushColStack.push(newPushCols);
                pushCols = newPushCols;
            }

            if (canPush) {
                // We're clear to push
                for (let swapRow = row; swapRow < this.row; swapRow++) {
                    // Pop items from the stack, to keep track of which cols we're pushing in this step
                    pushCols = pushColStack.pop();
                    for (const pushCol of pushCols.values()) {
                        // Come back to pusher, swapping cells along the way.
                        const temp = this.grid.getCell(swapRow, pushCol);
                        this.grid.setCell(swapRow, pushCol, this.grid.getCell(swapRow + 1, pushCol));
                        this.grid.setCell(swapRow + 1, pushCol, temp);
                    }
                }
                this.row--;
                return;
            }
        }
    }

    goDown() {
        let pushCols = new Set([this.col]);
        let pushColStack = [pushCols]

        for (let row = this.row + 1; row < this.grid.maxGridRow; row++) {
            // Break if any pushcols have a wall.
            for (const pushCol of pushCols.values()) {
                if (this.grid.getCell(row, pushCol) === '#') {
                    return;
                }
            }

            let canPush = true;
            let newPushCols = new Set(pushCols.values());

            // Check if we can push. If not, register any new cols we're pushing in the stack
            for (const pushCol of pushCols.values()) {
                if (this.grid.getCell(row, pushCol) === '.') {
                    newPushCols.delete(pushCol)
                }

                if (this.grid.getCell(row, pushCol) !== '.') {
                    canPush = false;
                }

                if (this.grid.getCell(row, pushCol) === '[') {
                    newPushCols.add(pushCol + 1);
                }
                if (this.grid.getCell(row, pushCol) === ']') {
                    newPushCols.add(pushCol - 1);
                }
            }

            if (!canPush) {
                pushColStack.push(newPushCols);
                pushCols = newPushCols;
            }

            if (canPush) {
                // We're clear to push
                for (let swapRow = row; swapRow > this.row; swapRow--) {
                    // Pop items from the stack, to keep track of which cols we're pushing in this step
                    pushCols = pushColStack.pop();
                    for (const pushCol of pushCols.values()) {
                        // Come back to pusher, swapping cells along the way.
                        const temp = this.grid.getCell(swapRow, pushCol);
                        this.grid.setCell(swapRow, pushCol, this.grid.getCell(swapRow - 1, pushCol));
                        this.grid.setCell(swapRow - 1, pushCol, temp);
                    }
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

let p2 = 0;
for (const box of grid.find('[')) {
    p2 += box.row * 100 + box.col;
}

console.log('P2: ', p2)

