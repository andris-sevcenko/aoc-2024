import {processFile} from "../lib/utils.js";

const genSecret = (secret) => {
    let res = secret;

    res = ((res * 64) ^ res) & 16777215;
    res = ((Math.floor(res / 32)) ^ res) & 16777215;
    res = ((res * 2048) ^ res) & 16777215;

    return res;
}

const globalPrices = new Map();

processFile('input.txt', (line) => {
    const prices = new Map();
    let num = parseInt(line.trim())
    let secret = num;

    let lastPrice = num.toString().slice(-1);
    let last4Changes = ['x', 'x', 'x', 'x'];

    for (let i = 1; i <= 2000; i++) {
        secret = genSecret(secret);

        const lastDigit = secret.toString().slice(-1)
        const buyPrice = lastDigit - lastPrice;
        lastPrice = lastDigit;

        last4Changes.push(buyPrice);
        last4Changes.shift();

        let hash = last4Changes.join('.');

        // Start checking only when we have enough changes
        if (i > 3) {
            if (prices.has(hash)) {
                continue; // Each buyer only wants to buy one hiding spot
            } else {
                prices.set(hash, lastDigit);
            }
        }
    }

    // Tally the potential for all change sequences across all the buyers
    for (const [key, value] of prices.entries()) {
        if (globalPrices.has(key)) {
            globalPrices.set(key, parseInt(globalPrices.get(key)) + parseInt(value));
        } else {
            globalPrices.set(key, value);
        }
    }
})

// Home run.
let p2 = 0;
for (const [, value] of globalPrices.entries()) {
    p2 = Math.max(p2, value);
}

console.log('P2:', p2);
