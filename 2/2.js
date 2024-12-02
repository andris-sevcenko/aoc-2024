import {processFile} from "../lib/utils.js";

const processReport = (levels) => {
    if (levels.length < 2) {
        return;
    }

    let previous = null;
    let levelDirection = null;
    let safe = true;

    for (let i = 0; i < levels.length; i++){
        const level = levels[i];

        if (!previous && previous !== 0) {
            previous = level;
            continue;
        }

        const thisDirection = (previous - level < 0) ? '<' : '>';
        if (!levelDirection) {
            levelDirection = thisDirection;
        }

        const diff = Math.abs(previous - level);
        if (diff < 1 || diff > 3 || levelDirection !== thisDirection) {
            // If this generates an error, return the offending index.
            return i;
        }

        previous  = level;
    }

    return safe;
}

let safeP2Reports = 0;
let safeReports = 0;


processFile('input.txt', (line) => {
    const report = line.trim().split(' ');
    let result = processReport(report);
    
    if (result === true) {
        safeReports++;
        safeP2Reports++;
    } else if (typeof result === 'number') {
        // If a fault was returned, go up to 2 numbers back and see if removing those can help
        for (let i = 0; i < Math.min(3, result + 1); i++) {
            if (processReport(report.toSpliced(result - i, 1)) === true) {
                safeP2Reports++;
                break;
            }
        }
    }
});

console.log('P1: ', safeReports);
console.log('P2: ', safeP2Reports);
