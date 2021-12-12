const INPUT_PATH = './input';
const fs = require('fs');

let data;
try {
    // read contents of the file
    data = fs.readFileSync(INPUT_PATH, 'UTF-8');
} catch (err) {
    console.error(err);
    process.exit(1);
}

// split the contents by new line
const input = data.split(/\r?\n/).filter((l) => l.length);

function makeGraph(input) {
    const G = {};
    for (const line of input) {
        const [start, end] = line.split('-');
        if (!G[start]) {
            G[start] = [];
        }
        if (!G[end]) {
            G[end] = [];
        }
        G[start].push(end);
        G[end].push(start);
    }
    return G;
}

const isLowerCase = (id) => !id.match(/[A-Z]/g);

function part1(G) {
    const stack = [{id: 'start', path: []}];
    const visited = new Set();
    const allPaths = [];

    while (stack.length) {
        const {id, path} = stack.pop();
        if (id === 'end') {
            allPaths.push(path);
        }
        for (const nextId of G[id]) {
            if (!isLowerCase(nextId) || !path.includes(nextId)) {
                stack.push({id: nextId, path: [...path, id]});
            }
        }
    }

    const part1 = allPaths.length;
    // console.log(allPaths.map((l) => l.join(',')).join('\n'));
    console.log('Part 1', part1);
}

function doTests() {
    const tests = [
        [[], 'a', true],
        [['a'], 'a', true],
        [['a'], 'b', true],
        [['a', 'a'], 'a', false],
        [['a', 'a'], 'b', true],
        [['a', 'b'], 'a', true],
        [['a', 'b'], 'b', true],

        [['a', 'a', 'b'], 'a', false],
        [['a', 'a', 'b'], 'b', false],
        [['a', 'a', 'b'], 'c', true],
        [['a', 'b', 'c'], 'a', true],

        [['a', 'a', 'b', 'c'], 'a', false],
        [['a', 'a', 'b', 'c'], 'b', false],
        [['a', 'a', 'b', 'c'], 'c', false],
        [['a', 'a', 'b', 'c'], 'd', true],

        [['a', 'b', 'c', 'a'], 'a', false],
        [['a', 'b', 'c', 'a'], 'b', false],
        [['a', 'b', 'c', 'a'], 'c', false],
        [['a', 'b', 'c', 'a'], 'd', true],

        [['start'], 'start', false],
        [['start'], 'end', true],
        [['start', 'end'], 'end', false],
        [['start'], 'a', true],
        [['start'], 'A', true],

        [['a'], 'A', true],
        [['a', 'a'], 'A', true],
        [['a', 'A'], 'A', true],
        [['a', 'A', 'A'], 'A', true],

        [['start', 'b'], 'b', true],
        [['start', 'b', 'd', 'b', 'A', 'c', 'A'], 'b', false]
    ];

    let failedTests = 0;
    for (const test of tests) {
        const [path, cave, expected] = test;
        const res = canUseCave(path, cave);
        console.log(res === expected ? 'OK' : 'KO', {path, cave, res});
        if (res !== expected) {
            failedTests++;
        }
    }
    console.log(failedTests, 'failed tests');
}

function canUseCave(path, cave) {
    if ((cave === 'end' || cave === 'start') && path.includes(cave)) {
        return false;
    }
    if (!isLowerCase(cave)) {
        return true;
    }

    const counts = {};
    let usedTwice;

    for (const id of path) {
        if (!isLowerCase(id)) {
            continue;
        }
        if (!counts[id]) {
            counts[id] = 1;
        } else {
            counts[id] += 1;
        }
        if (counts[id] > 1) {
            usedTwice = id;
        }
    }

    // console.log({path, cave, usedTwice, counts});
    if (usedTwice === cave) {
        return false;
    }
    if (usedTwice && counts[cave] === 1) {
        return false;
    }
    return true;
}

function part2(G) {
    const stack = [{id: 'start', path: []}];
    const visited = new Set();
    const allPaths = [];

    let guard = 0;
    while (stack.length) {
        const {id, path} = stack.pop();

        if (id === 'end') {
            allPaths.push([...path, 'end']);
            continue;
        }

        const newPath = [...path, id];
        for (const nextId of G[id]) {
            if (canUseCave(newPath, nextId)) {
                stack.push({id: nextId, path: [...newPath]});
            }
        }
    }

    const part2 = allPaths.length;
    console.log('Part 2', part2);
}

// doTests();
const G = makeGraph(input);
part1(G);
part2(G);
