import {getBatches} from "../lib/utils.js";

const startTime = performance.now()

const multiplyMatrix = (a, b) => [((a[0] * b[0]) + (a[1] * b[1])), ((a[2] * b[0]) + (a[3] * b[1]))];

const inverseMatrix = (a) => {
    const det = (1 / ((a[0] * a[3]) - (a[2] * a[1])));
    return [(det * a[3]), (-(det * a[1])), (-(det * a[2])), (det * a[0])];
}

const solve = (a, b, c, d, sol1, sol2) => multiplyMatrix(inverseMatrix([a, b, c, d]), [sol1, sol2])

let p2 = 0;
for (const clawRules of getBatches('input.txt', 3, null, 0, 1)) {
    const a = clawRules[0].match(/X\+(\d+).*Y\+(\d+)/);
    const b = clawRules[1].match(/X\+(\d+).*Y\+(\d+)/);
    const c = clawRules[2].match(/X=(\d+).*Y=(\d+)/);

    const result = solve(parseInt(a[1]), parseInt(b[1]), parseInt(a[2]), parseInt(b[2]), parseInt(c[1]) + 10000000000000, parseInt(c[2]) + 10000000000000);

    // JS is a piece of crap.
    if (result[0].toString().match(/\.(9999|0000)/)) {
        result[0] = Math.round(result[0]);
    }
    if (result[1].toString().match(/\.(9999|0000)/)) {
        result[1] = Math.round(result[1]);
    }

    if (result[0].toString().match(/\./) || result[1].toString().match(/\./)) {
        continue;
    }

    p2 += 3 * result[0] + result[1];
}

console.log('P2: ', p2);


const endTime = performance.now()
console.log(`Execution time in msecs: ${endTime - startTime}`)
