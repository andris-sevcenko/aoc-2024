import {getFile} from "../lib/utils.js";
const now = performance.now();
const [regData,gateData] = getFile('input.txt').split("\n\n").map((el) => el.split("\n"))


const registers = new Map();
const gates = new Map();

for (const item of regData.map((el) => el.split(": "))) {
    registers.set(item[0], item[1]);
}

const gateMap = new Map();
const outputMap = new Map();

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

    outputMap.set(out, hash);

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

console.log('Checking output generators');
for (let i = 2; i < 45; i++) {
    // skipping 0 and 1 because they have special starting conditions in a full adder setup
    const outWire = 'z' + (i < 10 ? '0' : '') + i;
    const inWireX = 'x' + (i < 10 ? '0' : '') + i;
    const inWireY = 'y' + (i < 10 ? '0' : '') + i;

    const sumGate = gates.get(outputMap.get(outWire))[0];
    if (sumGate.op !== 'XOR') {
        console.log('!!!! ' + outWire + ' has wrong operation set on SUMGATE');
        console.log(sumGate);
        continue;
    }

    const sumGateI1 = gates.get(outputMap.get(sumGate.inputs[0]))[0];
    const sumGateI2 = gates.get(outputMap.get(sumGate.inputs[1]))[0];
    const xorOr = sumGateI1.op === 'XOR' && sumGateI2.op === 'OR';
    const orXor = sumGateI2.op === 'XOR' && sumGateI1.op === 'OR';

    if (!(xorOr || orXor)) {
        console.log('!!!! Sum gate for ' + outWire + ' failed inbound conditions');
        console.log(sumGateI1);
        console.log(sumGateI2);
        console.log(sumGate);
        continue;
    }

    const xorGate = sumGateI1.op === 'XOR' ? sumGateI1 : sumGateI2;
    if (!(xorGate.inputs[0] !== inWireX || xorGate.inputs[0] !== inWireY)
        || !(xorGate.inputs[1] !== inWireX || xorGate.inputs[1  ] !== inWireY)
    ) {
        console.log('!!!! XOR GATE INPUT VIOLATION');
        console.log(xorGate);
        continue;
    }

    const orGate = sumGateI1.op === 'OR' ? sumGateI1 : sumGateI2;
    const orGateI1 = gates.get(outputMap.get(orGate.inputs[0]))[0];
    const orGateI2 = gates.get(outputMap.get(orGate.inputs[1]))[0];

    if (orGateI1.op !== 'AND' || orGateI2.op !== 'AND') {
        console.log('!!!! CARRY GATE INPUT VIOLATION');
        console.log(orGateI1);
        console.log(orGateI2);
        console.log(orGate)
        continue;
    }
    // if (gates.get(outputMap.get(outWire).values()[0])) {
    //     throw new Error(outWire + ' has multiple writers');
    // }
}
// loop through gates
// for each entry in gate that has two actual values, set as registers
// unless output is z, in which case store in z-regs

// loop big