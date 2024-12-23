import {processFile} from "../lib/utils.js";

const edges = [];

processFile('input.txt', (line) => {
    edges.push(line.trim().split('-'));
})

function bronKerbosch(R, P, X, graph) {
    let cliques = new Set();

    if (P.size === 0 && X.size === 0) {
        cliques.add(new Set(R));
    }

    for (let v of P) {
        let newR = new Set(R);
        newR.add(v);

        let newP = new Set([...P].filter(x => graph.get(v).has(x)));
        let newX = new Set([...X].filter(x => graph.get(v).has(x)));

        cliques = new Set([...cliques, ...bronKerbosch(newR, newP, newX, graph)]);

        P.delete(v);
        X.add(v);
    }

    return cliques;
}

// Create an adjacency list from the edges
let graph = new Map();
for (let edge of edges) {
    const [u, v] = edge;
    graph.set(u, (graph.get(u) || new Set()).add(v));
    graph.set(v, (graph.get(v) || new Set()).add(u));
}

let vertices = new Set(graph.keys());
let allCliques = bronKerbosch(new Set(), vertices, new Set(), graph);

let maxSize = 0;
let biggestClique;

for (const clique of allCliques) {
    if (clique.size > maxSize) {
        biggestClique = clique;
        maxSize = clique.size
    }
}
console.log(Array.from(biggestClique.keys()).sort().join(','))
