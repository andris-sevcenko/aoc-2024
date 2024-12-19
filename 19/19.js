import {getAllLines, getFile} from "../lib/utils.js";

const [towelData, patternData] = getFile('input.txt').split("\n\n");
const patterns = patternData.split("\n").map((el) => el.trim());
const towels = new Set(towelData.split(', ').map((el) => el.trim()));

const memoized = new Map()
const howMany = (pattern) => {
    if (memoized.has(pattern)) {
        return memoized.get(pattern);
    }
    let hits = 0;
    for (const [, t] of towels.entries()) {
        if (pattern.startsWith(t)) {
            if (pattern.length === t.length) {
                hits++;
                memoized.set(pattern, hits);
            } else {
                hits += howMany(pattern.substring(t.length));
                memoized.set(pattern, hits);
            }
        }
    }
    return hits;
}

let p1 = 0;
let p2 = 0;

for (const pattern of patterns) {
    let hits = howMany(pattern);
    p1 += hits ? 1 : 0;
    p2 += howMany(pattern);
}

console.log('P1:', p1);
console.log('P2:', p2);