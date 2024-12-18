import {getFile} from "../lib/utils.js";

const [regs, rest] = getFile('input.txt').split("\n\n");

const [a, b, c] = regs.split("\n").map((r) => parseInt(r.trim().split(' ')[2]))
const instructions = rest.split(' ')[1].split(',').map((e) => parseInt(e));

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
    tick = 0;

    constructor(instructions, a, b, c) {
        this.instructions = instructions;
        this.regA = a;
        this.regB = b;
        this.regC = c;
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
                    this.regB = this.getCombo(operand) % 8;
                    this.pointer += 2;
                    break;
                case ElfOS.JNZ:
                    if (this.regA === 0) {
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
                    this.buffer.push(this.getCombo(operand) % 8);
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

    print() {
        console.log(this.buffer.join(','))
    }


}

const computer = new ElfOS(instructions, a, b, c);
computer.run();
computer.print();
console.log()
