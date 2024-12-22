import {processFile} from "../lib/utils.js";

const genSecret = (secret) => {
    let res = secret;

    res = ((res * 64) ^ res) & 16777215;
    res = ((Math.floor(res / 32)) ^ res) & 16777215;
    res = ((res * 2048) ^ res) & 16777215;

    return res;
}

let p1 = 0;

processFile('input.txt', (line) => {
    let num = parseInt(line.trim())
    let secret = num;
    for (let i = 1; i <= 2000; i++) {
        secret = genSecret(secret);
    }
    p1 += secret;
})

console.log(p1)
