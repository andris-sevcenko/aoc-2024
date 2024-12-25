import {getFile} from "../lib/utils.js";

const [regData,gateData] = getFile('input.txt').split("\n\n").map((el) => el.split("\n"))

const registers = new Map();
const gates = new Map();

for (const item of regData.map((el) => el.split(": "))) {
    registers.set(item[0], item[1]);
}

const gateMap = new Map();

class LogicGate {
    inputs;
    op = '';
    output = '';

    constructor(inputs, op, output) {
        this.inputs = inputs;
        this.op = op;
        this.output = output;
    }

    setInput(id, val) {
        const idx = this.inputs.indexOf(id);
        if (idx === 0) {
            this.inputs = [val, this.inputs[1]];
        } else {
            this.inputs = [this.inputs[0], val];
        }
    }

    hasBothInputs() {
        for (const val of this.inputs) {
            if (typeof val === "string") {
                return false;
            }
        }

        return true;
    }

    getOutput() {
        const [i1, i2] = this.inputs;
        switch (this.op) {
            case 'AND':
                return i1 && i2 ? 1 : 0;
            case 'OR':
                return i1 || i2 ? 1 : 0;
            case 'XOR':
                return i1 !== i2 ? 1 : 0;
        }
    }
}

for (const item of gateData.map((el) => el.split(' -> '))) {
    const inputs = item[0].split(/AND|XOR|OR/).map((el) => el.trim());
    const hash = item[0];
    const op = item[0].match(/(AND|XOR|OR)/)[1]
    const out = item[1];

    if (gates.has(hash)) {
        gates.set(hash, gates.get(hash).concat([new LogicGate(inputs, op, out)]));
    } else {
        gates.set(hash, [new LogicGate(inputs, op, out)]);
    }

    // Map gate inputs to actual gates
    if (!gateMap.has(inputs[0])) {
        gateMap.set(inputs[0], new Set());
    }
    if (!gateMap.has(inputs[1])) {
        gateMap.set(inputs[1], new Set());
    }

    gateMap.get(inputs[0]).add(hash);
    gateMap.get(inputs[1]).add(hash);
}

const zRegs = {};

// big loop
while (registers.size > 0) {
    const toRemove = [];

    // loop through registers
    for (const [reg, val] of registers.entries()) {
        for (const gateHash of gateMap.get(reg).values()) {
            // replace inputs with actual value in relevant gates
            for (const gate of gates.get(gateHash)) {
                gate.setInput(reg, parseInt(val));
            }
            toRemove.push(reg);
        }
    }

    // remove processed registers
    for (const processedReg of toRemove) {
        registers.delete(processedReg);
    }

    for (const [hash ,gateList] of gates.entries()) {
        for (const gate of gateList) {
            if (gate.hasBothInputs()) {
                const out = gate.getOutput();
                if (gate.output.startsWith('z')) {
                    zRegs[gate.output] = out.toString();
                } else {
                    registers.set(gate.output, out);
                }
                gates.delete(hash)
            }
        }
    }
}
let str = ''
for (let z = 0; z <= 46; z++) {
    const key = "z" + (z < 10 ? "0".concat(z) : z);
    if (key in zRegs) {
        str = zRegs[key].concat(str);
    } else {
        break;
    }
}
console.log(parseInt(str, 2));


// loop through gates
// for each entry in gate that has two actual values, set as registers
// unless output is z, in which case store in z-regs

// loop big