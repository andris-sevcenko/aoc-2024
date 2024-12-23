import {processFile} from "../lib/utils.js";

const computers = new Map();

class Computer {
    id;
    connections = new Set();

    constructor(id) {
        this.id = id;
    }

    add(connection) {
        this.connections.add(connection)
    }
}
processFile('input.txt', (line) => {
    const [c1, c2] = line.trim().split('-');
    if (!computers.has(c1)) {
        computers.set(c1, new Computer(c1))
    }

    if (!computers.has(c2)) {
        computers.set(c2, new Computer(c2))
    }

    computers.get(c1).add(c2);
    computers.get(c2).add(c1);
})

const computerSets = new Set();
for (const [,sourceComputer] of computers.entries()) {
    for (const [,conn] of sourceComputer.connections.entries()) {
        const next = computers.get(conn);
        for (const [,secondConn] of next.connections.entries()) {
            const last = computers.get(secondConn)
            if (last.connections.has(sourceComputer.id)) {
                const setName = [sourceComputer.id, conn, secondConn].sort().map((el) => '-' + el)
                computerSets.add(setName.join(','))
            }
        }
    }
}

let p1 = 0;

for (const [,set] of computerSets.entries()) {
    if (set.indexOf('-t') !== -1) {
        p1++;
    }
}
console.log('P1:', p1)
