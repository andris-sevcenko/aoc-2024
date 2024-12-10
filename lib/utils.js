import fs from "fs";

const processFile = (file, cb) => {
    const allFileContents = fs.readFileSync(file, 'utf-8');
    allFileContents.split(/\r?\n/).forEach(cb);
}

const getFirstLine = (file) => {
    const allFileContents = fs.readFileSync(file, 'utf-8');
    return allFileContents.split(/\r?\n/)[0];
}

const getAllLines = (file) => {
    const allFileContents = fs.readFileSync(file, 'utf-8');
    return allFileContents.split(/\r?\n/);
}

const getBatches = (file, batchSize, separator, skip, space) => {
    if (!skip) {
        skip = 0;
    }

    if (!space) {
        space = 0;
    }


    let allFileContents = fs.readFileSync(file, 'utf-8').split(/\r?\n/);

    const batches = [];

    for (let i = skip; i < allFileContents.length; i += batchSize + space) {
        const batch = [];
        for (let ii = 0; ii < batchSize; ii++) {
            let line = allFileContents[i + ii].trim();
            if (separator) {
                line = line.split(separator)
            }
            batch.push(line);
        }
        batches.push(batch);
    }

    return batches;
}

class Grid {
    grid = [];
    maxGridRow = 0;
    maxGridCol = 0;
    minGridRow = 999;
    minGridCol = 999;

    constructor () {

    }

    setGrid (data, asInt = false) {
        for (let row = 0; row < data.length; row++) {
            this.grid[row] = [];
            this._addRow(data[row], row, 0, asInt)
        }
    }

    addRight (data) {
        const offset = this.maxGridCol + 1;
        for (let row = 0; row < data.length; row++) {
            this._addRow(data[row], row, offset)
        }
    }

    _addRow (dataRow, rowNum, startPos = 0, asInt = false) {
        for (let col = 0; col < dataRow.length; col++) {
            const actualCol = col + startPos;
            this.grid[rowNum][actualCol] = asInt ? parseInt(dataRow[col]) : dataRow[col];
            this.maxGridCol = Math.max(this.maxGridCol, actualCol);
            this.maxGridRow = Math.max(this.maxGridRow, rowNum);
            this.minGridCol = Math.min(this.minGridCol, actualCol);
            this.minGridRow = Math.min(this.minGridRow, rowNum);
        }
    }

    setCell (row, col, value) {
        if (!this.grid[row]) {
            this.grid[row] = [];
        }

        this.grid[row][col] = value;
    }

    setRow (row, value) {
        this.grid[row] = value;
    }

    getRow (row) {
        return this.grid[row];
    }

    setCol (col, value) {
        for (let row = 0; row < value.length; row++) {
            if (!this.grid[row]) {
                this.grid[row] = [];
            }
            this.grid[row][col] = value[row];
        }
    }

    getCol (col) {
        const column = [];
        for (let row = 0; row < this.grid.length; row++) {
            column[row] = this.grid[row][col];
        }

        return column;
    }

    getCell (row, col) {
        return (this.grid[row] && this.grid[row][col]) ? this.grid[row][col] : null;
    }

    getAdjacent (row, col, diagonal) {
        const out = [];

        if (this.grid[row - 1]) {
            out.push({row: row - 1, col: col, value: this.getCell(row - 1, col)});
        }

        if (this.grid[row + 1]) {
            out.push({row: row + 1, col: col, value: this.getCell(row + 1, col)});
        }

        if (this.grid[row][col - 1]) {
            out.push({row: row, col: col - 1, value: this.getCell(row, col - 1)});
        }

        if (this.grid[row][col + 1]) {
            out.push({row: row, col: col + 1, value: this.getCell(row, col + 1)});
        }

        if (diagonal) {
            if (this.grid[row - 1] && this.grid[row - 1][col + 1]) {
                out.push({row: row - 1, col: col + 1, value: this.getCell(row - 1, col + 1)});
            }

            if (this.grid[row - 1] && this.grid[row - 1][col - 1]) {
                out.push({row: row - 1, col: col - 1, value: this.getCell(row - 1, col - 1)});
            }

            if (this.grid[row + 1] && this.grid[row + 1][col - 1]) {
                out.push({row: row + 1, col: col - 1, value: this.getCell(row + 1, col - 1)});

            }

            if (this.grid[row + 1] && this.grid[row + 1][col + 1]) {
                out.push({row: row + 1, col: col + 1, value: this.getCell(row + 1, col + 1)});
            }

        }

        return out;
    }

    isInBounds(row, col) {
        return row > -1 && row <= this.maxGridRow && col > -1 && col <= this.maxGridCol
    }

    count (char) {
        let count = 0;
        for (const element of this.grid) {
            if (element.join('').match(new RegExp(char, 'g'))) {
                count += element.join('').match(new RegExp(char, 'g')).length;
            }
        }

        return count;
    }

    find (char) {
        const out = [];
        let count = 0;
        for (const row in this.grid) {
            for (const col in this.grid) {
                if (this.grid[row][col] === char) {
                    out.push({row: row, col: col});
                }
            }
        }

        return out;
    }
    print (mono) {
        for (const element of this.grid) {
            if (mono) {
                console.log(element.join(''));
            } else {
                console.log(element);
            }
        }
    }
}

export { processFile, getFirstLine, getAllLines, getBatches, Grid }