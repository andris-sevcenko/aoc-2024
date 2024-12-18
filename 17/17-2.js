import {getFile} from "../lib/utils.js";

const [regs, rest] = getFile('input.txt').split("\n\n");

const [a, b, c] = regs.split("\n").map((r) => parseInt(r.trim().split(' ')[2]))
const instructionString = rest.split(' ')[1];
const instructions = instructionString.split(',').map((e) => parseInt(e));

class ElfOS {

    static ADV = 0;
    static BXL = 1;
    static BST = 2;
    static JNZ = 3;
    static BXC = 4;
    static OUT = 5;
    static BDV = 6;
    static CDV = 7;

    instructions = [];
    regA = 0;
    regB = 0;
    regC = 0;

    pointer = 0;
    buffer = [];
    once = false;
    constructor(instructions, a, once = false) {
        this.instructions = instructions;
        this.regA = a;
        this.once = once;
    }

    run() {
        while (true) {
            let opCode = this.instructions[this.pointer] ?? undefined;
            let operand = this.instructions[this.pointer + 1] ?? undefined;

            if (typeof opCode === "undefined" || typeof operand == "undefined") {
                return;
            }

            switch (opCode) {
                case ElfOS.ADV:
                    this.regA = Math.trunc(this.regA / Math.pow(2, this.getCombo(operand)));
                    this.pointer += 2;
                    break;
                case ElfOS.BXL:
                    this.regB = this.regB ^ operand;
                    this.pointer += 2;
                    break;
                case ElfOS.BST:
                    this.regB = this.getCombo(operand) & 7;
                    this.pointer += 2;
                    break;
                case ElfOS.JNZ:
                    if (this.regA === 0 || this.once) {
                        this.pointer++;
                    } else {
                        this.pointer = operand;
                    }
                    break;
                case ElfOS.BXC:
                    this.regB = this.regB ^ this.regC;
                    this.pointer += 2;
                    break;
                case ElfOS.OUT:
                    const val = this.getCombo(operand) & 7;
                    this.buffer.push(this.getCombo(operand) & 7);
                    this.pointer += 2;
                    break;
                case ElfOS.BDV:
                    this.regB = Math.trunc(this.regA / Math.pow(2, this.getCombo(operand)));
                    this.pointer += 2;
                    break;
                case ElfOS.CDV:
                    this.regC = Math.trunc(this.regA / Math.pow(2, this.getCombo(operand)));
                    this.pointer += 2;
                    break;
            }
        }
    }

    getCombo(operand) {
        switch (operand) {
            case 0:
            case 1:
            case 2:
            case 3:
                return operand;
            case 4:
                return this.regA;
            case 5:
                return this.regB;
            case 6:
                return this.regC;
        }
    }

    echo() {
        return this.buffer.join(',')
    }
}

let out = [2,4,1,1,7,5,1,4,0,3,4,5,5,5,3,0];
let startVals = [0];
let pos = 999999999999999;
while (out.length) {
    let next = out.pop();

    let newStartVals = [];
    for (const startVal of startVals) {

        for (let thisA = startVal * 8; thisA < (startVal * 8) + 8; thisA++) {
            const thisComputer = new ElfOS(instructions, thisA, true);
            thisComputer.run();
            if (thisComputer.buffer[0] === next) {
                if (out.length === 0) {
                    pos = Math.min(pos, thisA);
                } else {
                    newStartVals.push(thisA);
                }
            }
        }
    }
    startVals = newStartVals;
}

console.log(pos)