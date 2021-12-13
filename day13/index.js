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
    const input = data.split(/\r?\n/);
    const points = [];
    const instructions = [];
    for (const line of input) {
        if (line.match(/,/)) {
            points.push(line.split(',').map(Number));
        } else if (line.length) {
            const value = Number(line.match(/\d+/));
            const op = line.match(/x/) ? 'x' : 'y';
            instructions.push([op, value]);
        }
    }

    let maxX = 0;
    let maxY = 0;
    for (const [x, y] of points) {
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }

    const G = [];
    for (let y = 0; y <= maxY; y++) {
        G.push([]);
        for (let x = 0; x < maxX + 1; x++) {
            if (input.includes(`${x},${y}`)) {
                G[y].push('#');
            } else {
                G[y].push('.');
            }
        }
    }

    return {points, instructions, grid: G};
}

function foldHorizontal(G, splitY) {
    for (let y = splitY; y < G.length; y++) {
        const relativeIndex = splitY + splitY - y;
        // console.log({y, splitY, relativeIndex});
        for (let x = 0; x < G[y].length; x++) {
            G[relativeIndex][x] = [G[relativeIndex][x], G[y][x]].includes('#') ? '#' : '.';
        }
    }

    return G.slice(0, splitY);
}

function foldVertical(G, splitX) {
    for (let x = splitX; x < G[0].length; x++) {
        const relativeIndex = splitX + splitX - x;
        // console.log({x, splitX, relativeIndex});
        for (let y = 0; y < G.length; y++) {
            G[y][relativeIndex] = [G[y][relativeIndex], G[y][x]].includes('#') ? '#' : '.';
        }
    }

    return G.map((l) => l.slice(0, splitX));
}

const showGrid = (G) => console.log(G.map((l) => l.join('')).join('\n'));
function part1({grid, instructions, points}) {
    let G = grid.map((l) => [...l]);

    const [op, value] = instructions[0];
    if (op === 'y') {
        G = foldHorizontal(G, value);
    } else {
        G = foldVertical(G, value);
    }

    let totalPoints = 0;
    for (let y = 0; y < G.length; y++) {
        for (let x = 0; x < G[0].length; x++) {
            if (G[y][x] === '#') {
                totalPoints++;
            }
        }
    }

    console.log('Part 1', totalPoints);
}

function part2({grid, instructions, points}) {
    let G = grid.map((l) => [...l]);

    for (const [op, value] of instructions) {
        if (op === 'y') {
            G = foldHorizontal(G, value);
        } else {
            G = foldVertical(G, value);
        }
    }

    console.log('Part 2');
    console.log(G.map((l) => l.join('').replace(/\./g, ' ')).join('\n'));
}

const parsedData = parseData(data);
part1(parsedData);
part2(parsedData);
