import {getFirstLine} from "../lib/utils.js";

const startTime = performance.now()

// Analyze FS, return files, spaces and a representation of the whole FS
const analyzeFs = (line) => {
    const files = [];
    const spaces = [];
    const combined = [];

    let expanded = '';
    let id = 0;
    let spId = 0;
    let readingFile = true;

    for (const ch of line) {
        const size = parseInt(ch);

        if (readingFile) {
            files.push({id: id, size: size});
            combined.push({id: id++, size: size});
        } else {
            spaces.push({id: 'sp' + spId, size: size});
            combined.push({id: 'sp' + spId++, size: size});
        }

        readingFile = !readingFile;
    }

    return [files, spaces, combined];
}

let [files, spaces, combined] = analyzeFs(getFirstLine('input.txt'))

// For each file, starting with biggest ID
for (let i = files.length - 1; i >= 0; i--) {
    const file = files[i];
    // Check the earliest size that fits
    for (const space of spaces) {
        if (space.size >= file.size) {
            space.size -= file.size;
            for (let lookup = 0; lookup < combined.length; lookup++) {

                // Form a new FS representation, with file moved in the space
                if (combined[lookup].id === space.id) {

                    let newCombined = combined.slice(0, lookup).concat([file]);

                    // If space has some size remaining, splice this in the new FS array
                    if (space.size > 0) {
                        newCombined = newCombined.concat([space]);
                    }

                    combined = newCombined.concat(combined.slice(lookup + 1));
                    break;
                }
            }

            // Make sure to remove the moved file from the new FS array and leave a space in its place
            for (let lookup = combined.length - 1; lookup >= 0; lookup--) {
                if (combined[lookup].id === file.id) {
                    combined = combined.slice(0, lookup).concat({id: 'spX' + file.id, size: file.size}).concat(combined.slice(lookup + 1));
                    break;
                }
            }
            break;
        }
    }
}

let step = 0;
let checksum = 0;

// Checkusm
for (const item of combined) {
    for (let i = item.size; i >0; i--) {
        if (typeof item.id === 'string') {
            step++;
        } else {
            checksum += item.id * step++;
        }
    }
}
console.log('P2: ', checksum);

const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
