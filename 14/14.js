import {Grid, processFile} from "../lib/utils.js";

const list = []
const seconds = 100
const width = 101;
const height = 103

processFile('input.txt', (line) => {
    const [pos, vel] = line.replace(/(p|v)=/g, '').split(' ').map(el => el.split(',').map(el2 => parseInt(el2)));
    list.push([pos[0] + (vel[0] * seconds), pos[1] + (vel[1] * seconds)]);
})


let q1 = 0, q2 = 0, q3 = 0, q4 = 0;
for (const pos of list) {
    let x = pos[0] % width;
    if (x < 0) {
        x += width;
    }

    let y = pos[1] % height;
    if (y < 0) {
        y += height;
    }

    if (x < Math.floor(width / 2) && y < Math.floor(height / 2)) {
        q1++;
    }
    if (x > Math.floor(width / 2) && y < Math.floor(height / 2)) {
        q2++;
    }
    if (x < Math.floor(width / 2) && y > Math.floor(height / 2)) {
        q3++;
    }
    if (x > Math.floor(width / 2) && y > Math.floor(height / 2)) {
        q4++;
    }
}

console.log('P1: ', q1 * q2 * q3 * q4);
