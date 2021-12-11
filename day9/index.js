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
const heights = data
    .split(/\r?\n/)
    .filter((l) => l.length)
    .map((l) => l.split('').map(Number));

function part1(heights) {
    const lowPoints = [];
    let lowPointsScore = 0;
    for (let y = 0; y < heights.length; y++) {
        for (let x = 0; x < heights[y].length; x++) {
            const neighbors = [];
            if (x > 0) {
                neighbors.push(heights[y][x - 1]);
            }
            if (x < heights[y].length - 1) {
                neighbors.push(heights[y][x + 1]);
            }
            if (y > 0) {
                neighbors.push(heights[y - 1][x]);
            }
            if (y < heights.length - 1) {
                neighbors.push(heights[y + 1][x]);
            }

            if (neighbors.filter((n) => n <= heights[y][x]).length === 0) {
                lowPointsScore += heights[y][x] + 1;
                lowPoints.push({x, y});
            }
        }
    }

    console.log('Part 1', lowPointsScore);
    return lowPoints;
}

const xyToStr = (x, y) => `${x};${y}`;

function findBassinSize(heights, lowPoint) {
    const visited = new Set();
    const stack = [lowPoint];

    while (stack.length) {
        const {x, y} = stack.pop();
        if (visited.has(xyToStr(x, y))) {
            continue;
        }
        visited.add(xyToStr(x, y));

        if (x > 0 && heights[y][x - 1] !== 9) {
            stack.push({y, x: x - 1});
        }
        if (x < heights[y].length - 1 && heights[y][x + 1] !== 9) {
            stack.push({y, x: x + 1});
        }
        if (y > 0 && heights[y - 1][x] !== 9) {
            stack.push({y: y - 1, x});
        }
        if (y < heights.length - 1 && heights[y + 1][x] !== 9) {
            stack.push({y: y + 1, x});
        }
    }
    return visited.size;
}
function part2(heights, lowPoints) {
    const bassinSizes = lowPoints.map((lowPoint) => findBassinSize(heights, lowPoint)).sort((a, b) => b - a);
    const res = bassinSizes[0] * bassinSizes[1] * bassinSizes[2];
    console.log('Part 2', res);
}

const lowPoints = part1(heights);
part2(heights, lowPoints);
