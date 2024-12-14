import {Grid, processFile} from "../lib/utils.js";

const list = []
const width = 101;
const height = 103

processFile('input.txt', (line) => {
    const [pos, vel] = line.replace(/(p|v)=/g, '').split(' ').map(el => el.split(',').map(el2 => parseInt(el2)));
    list.push([pos[0], pos[1], vel[0], vel[1]]);
})

let freshGrid = [];
let row = [];
for (let i = 0; i < width; i++) {
    row.push('.');
}
for (let i = 0; i < height; i++) {
    freshGrid.push(row)
}


out:
    for (let sec = 0; sec <= 5000000; sec++) {
        console.log(sec)
        const grid = new Grid();
        grid.setGrid(freshGrid);

        for (const robot of list) {
            let x = (robot[0] + (robot[2] * sec)) % width;
            let y = (robot[1] + (robot[3] * sec)) % height;

            if (x < 0) {
                x += width;
            }
            if (y < 0) {
                y += height;
            }

            grid.setCell(y, x, '*');
        }

        if (grid.getPrinted().match(/(\*){10}/)) {
            grid.print(true)
            console.log('!!!!!', sec);
            break out;
        }
    }


