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
const lines = data
    .split(/\r?\n/)
    .filter((l) => l.length)
    .map((l) => l.split(''));

const openingSymbols = '{[(<';
const pairs = {
    '}': '{',
    ']': '[',
    ')': '(',
    '>': '<'
};
const pairsInverted = {
    '{': '}',
    '[': ']',
    '(': ')',
    '<': '>'
};
const scores = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
};

function getFirstErrorInLine(line) {
    const input = [...line];
    const stack = [];
    while (input.length) {
        const c = input.shift();
        if (openingSymbols.includes(c)) {
            stack.push(c);
            continue;
        }

        if (stack.pop() !== pairs[c]) {
            return c;
        }
    }

    return;
}

function part1(lines) {
    const totalScore = lines.reduce((total, line) => {
        const c = getFirstErrorInLine(line);
        if (c) {
            total += scores[c];
        }
        return total;
    }, 0);
    console.log('Part 1', totalScore);
}

function completeLine(line) {
    const input = [...line];
    const stack = [];

    while (input.length) {
        const c = input.shift();
        if (openingSymbols.includes(c)) {
            stack.push(c);
            continue;
        }

        if (stack.pop() !== pairs[c]) {
            throw new Error('corrupted line feeded to completion');
        }
    }

    const scores = {')': 1, ']': 2, '}': 3, '>': 4};
    const score = stack
        .reverse()
        .map((c) => pairsInverted[c])
        .map((c) => scores[c])
        .reduce((total, s) => {
            return total * 5 + s;
        }, 0);
    return score;
}

function part2(lines) {
    const incompleteLines = lines.filter((l) => !getFirstErrorInLine(l));
    const scores = lines
        .filter((l) => !getFirstErrorInLine(l))
        .map((l) => completeLine(l))
        .sort((a, b) => a - b);
    const middle = scores[Math.floor(scores.length / 2)];
    console.log('Part 2', middle);
}

part1(lines);
part2(lines);
