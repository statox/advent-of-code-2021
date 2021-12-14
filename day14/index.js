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

function parseData(data) {
    const input = data.split(/\r?\n/).filter((l) => l.length);
    const poly = input.shift();
    const rules = input
        .map((l) => l.split(' -> '))
        .reduce((rules, rule) => {
            rules[rule[0]] = rule[1];
            return rules;
        }, {});
    return {poly, rules};
}

function step({poly, rules}) {
    let res = '';

    for (let i = 0; i < poly.length - 1; i++) {
        const start = poly[i] + poly[i + 1];
        if (rules[start]) {
            res += poly[i] + rules[start];
        }
    }
    res += poly[poly.length - 1];
    return res;
}

// Used only during tests
function getPolyByStep({poly, rules}, maxStep) {
    let p = poly;
    for (let i = 0; i < maxStep; i++) {
        const r = step({poly: p, rules});
        p = r;
    }
    return p;
}

function part1({poly, rules}) {
    let p = poly;
    for (let i = 0; i < 10; i++) {
        p = step({poly: p, rules});
    }

    const counts = [...p].reduce((count, letter) => {
        count[letter] = (count[letter] || 0) + 1;
        return count;
    }, {});

    const {min, max} = Object.values(counts).reduce((MM, count) => {
        if (!MM.min || MM.min > count) {
            MM.min = count;
        }
        if (!MM.max || MM.max < count) {
            MM.max = count;
        }
        return MM;
    }, {});

    const part1 = max - min;
    console.log('Part 1', part1);
}

function part2({poly, rules}) {
    // First take all the pairs in the polymer and count them
    let counts = {};
    for (let i = 0; i < poly.length - 1; i++) {
        const tuple = poly[i] + poly[i + 1];
        counts[tuple] = (counts[tuple] || 0) + 1;
    }

    // For each step:
    // We know that one pair (e.g. BB) gives two new pairs (BN, NB)
    // So we just need to count the occurences of the pair in the previous step
    // and add the same number of occurences for each new created pairs
    for (let i = 0; i < 40; i++) {
        let newCounts = {};
        for (const tuple of Object.keys(counts)) {
            const tuple1 = tuple[0] + rules[tuple];
            const tuple2 = rules[tuple] + tuple[1];

            newCounts[tuple1] = (newCounts[tuple1] || 0) + counts[tuple];
            newCounts[tuple2] = (newCounts[tuple2] || 0) + counts[tuple];
        }
        counts = {...newCounts};
    }

    // We can then count the number of occurences of each letter in the pairs
    const letterCounts = {};
    for (const tuple of Object.keys(counts)) {
        const [a, b] = [...tuple];
        letterCounts[a] = (letterCounts[a] || 0) + counts[tuple];
        letterCounts[b] = (letterCounts[b] || 0) + counts[tuple];
    }

    // The actual number of occurences will be divided by two since each letter
    // is in two pairs
    let min, max;
    for (const letter of Object.keys(letterCounts)) {
        const actualCount = Math.ceil(letterCounts[letter] / 2);
        if (!min || min > actualCount) {
            min = actualCount;
        }
        if (!max || max < actualCount) {
            max = actualCount;
        }
    }

    const part2 = max - min;
    console.log('Part 2', part2);
}

const parsedData = parseData(data);
part1(parsedData);
part2(parsedData);
