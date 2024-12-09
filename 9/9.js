import {getFirstLine} from "../lib/utils.js";

const startTime = performance.now()

const analyzeFs = (line) => {
    const files = [];
    const spaces = [];

    let expanded = '';
    let id = 0;
    let readingFile = true;

    for (const ch of line) {
        if (readingFile) {
            files.push({id: id++, size: ch});
        } else {
            spaces.push(parseInt(ch));
        }

        readingFile = !readingFile;
    }

    return [files, spaces];
}

const [files, spaces] = analyzeFs(getFirstLine('input.txt'))

let checksum = 0;
let step = 0;

let borrowedFile = {size: 0};

// Return either the next file or, if file list empty, the in-memory file
const getNextFile = () => {
    return files.length ? files.shift() : borrowedFile;
}

// Return a chunk from the in-memory file
const getBorrowedFileChunk = () => {
    if (borrowedFile.size === 0) {
        borrowedFile = files.pop();
    }
    borrowedFile.size--;
    return borrowedFile.id;
}

// Process the next file from list
while (true) {
    let currentFile = getNextFile();
    while (currentFile.size > 0) {
        checksum += currentFile.id * step++;
        currentFile.size--;
    }

    // If there are no more files, process the remained in-memory file
    if (files.length === 0) {
        while (borrowedFile.size > 0) {
            let fileId = getBorrowedFileChunk();
            checksum += fileId * step++;
        }
        break;
    }

    let space = spaces.shift();

    // Fill in spaces from in-memory files
    while (space > 0) {
        let fileId = getBorrowedFileChunk();
        checksum += fileId * step++;
        space--;
    }
}

console.log('P1: ', checksum);

const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
