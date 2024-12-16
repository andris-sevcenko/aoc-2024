import {getAllLines, Grid} from "../lib/utils.js";

const gridData = getAllLines('input.txt');

const grid = new Grid();
grid.setGrid(gridData.map(r => [...r]))

const start  = grid.find('S')[0];
const end  = grid.find('E')[0];
const globalVisited = new Map();
let finalPaths = [];

class Walker {
    row;
    col;
    direction;
    cost;
    visited;

    constructor(row, col, direction, cost, visited) {
        this.row = row;
        this.col = col;
        this.visited = visited;
        this.direction = direction;
        this.cost = cost;
    }

    hash(node, direction) {
        return node.row + '.' + node.col + '.' + direction;
    }

    walk()  {
        this.visited.set(this.hash({row: this.row, col: this.col}, this.direction), this.cost)

        // Get only walkable cells
        const possible = grid.getAdjacent(this.row, this.col).filter((el) => el.value === '.' || el.value === 'E');
        const relevant = [];

        // Consider only straight and 90 degree turns
        for (const node of possible) {
            if (node.row < this.row && this.direction !== 'S') {
                relevant.push(node);
            }
            if (node.row > this.row && this.direction !== 'N') {
                relevant.push(node);
            }
            if (node.col < this.col && this.direction !== 'E') {
                relevant.push(node);
            }
            if (node.col > this.col && this.direction !== 'W') {
                relevant.push(node);
            }
        }

        for (const relevantNode of relevant) {
            let visitCost = 1;
            let newDirection = this.direction;

            // Turn north
            if (relevantNode.row < this.row && this.direction !== 'N') {
                visitCost += 1000;
                newDirection = 'N';
            }

            // Turn south
            if (relevantNode.row > this.row && this.direction !== 'S') {
                visitCost += 1000;
                newDirection = 'S';
            }

            // Turn east
            if (relevantNode.col > this.col && this.direction !== 'E') {
                visitCost += 1000;
                newDirection = 'E';
            }
            // Turn west
            if (relevantNode.col < this.col && this.direction !== 'W') {
                visitCost += 1000;
                newDirection = 'W';
            }

            if (relevantNode.row === end.row && relevantNode.col === end.col) {
                finalPaths.push({cost: this.cost + visitCost, path: new Map(this.visited)});
                return;
            }

            if (this.cost + visitCost > 102488) {
                continue;
            }
            const hash = this.hash(relevantNode, newDirection);

            // If never visited, or a more expensive visit (accounting for direction)
            if (!globalVisited.has(hash) || globalVisited.get(hash) >= this.cost + visitCost) {
                globalVisited.set(hash, this.cost + visitCost)
                const newWalker = new Walker(relevantNode.row, relevantNode.col, newDirection, this.cost + visitCost, new Map(this.visited))
                newWalker.walk()
            }
        }
    }
}


const reindeer = new Walker(start.row, start.col,'E', 0, new Map());
reindeer.walk()
let p1 = 99999999;

for (const visitedPath of finalPaths) {
    p1 = Math.min(p1, visitedPath.cost);
}
const p2 = new Set();
for (const visitedPath of finalPaths) {
    if (visitedPath.cost === p1) {
        for (const location of visitedPath.path.keys()) {
            p2.add(location.split('.').slice(0,2).join('.'))
            grid.setCell(location.split('.')[0], location.split('.')[1], 'O');
        }
    }
}

console.log('P1: ', p1);
console.log('P2: ', p2.size + 1) // Add finish square
grid.print(true)