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
    .map((l) => {
        const [p1, p2] = l.split(' -> ');
        const [x1, y1] = p1.split(',').map(Number);
        const [x2, y2] = p2.split(',').map(Number);
        return {x1, y1, x2, y2};
    });

const pointToStr = ({x, y}) => `${x};${y}`;

function part1(lines) {
    const pointsInLine = new Set();
    const overlappingPoints = new Set();

    for (const line of lines) {
        const {x1, x2, y1, y2} = line;
        // For now ignore diagonal lines
        if (x1 !== x2 && y1 !== y2) {
            continue;
        }

        const points = [];
        if (x1 === x2) {
            const start = Math.min(y1, y2);
            const stop = Math.max(y1, y2);
            for (let y = start; y <= stop; y++) {
                points.push({x: x1, y});
            }
        } else {
            const start = Math.min(x1, x2);
            const stop = Math.max(x1, x2);
            for (let x = start; x <= stop; x++) {
                points.push({x, y: y1});
            }
        }

        for (const point of points) {
            const pointStr = pointToStr(point);
            if (!pointsInLine.has(pointStr)) {
                pointsInLine.add(pointStr);
                continue;
            }
            if (!overlappingPoints.has(pointStr)) {
                overlappingPoints.add(pointStr);
            }
        }
    }
    console.log('Part 1 overlapping points: ', overlappingPoints.size);
    return overlappingPoints.size;
}

function showGrid(g) {
    console.log(g.map((l) => l.join(' ')).join('\n'));
}

function part2(lines) {
    let xMax = 0;
    let yMax = 0;
    for (const line of lines) {
        let {x1, x2, y1, y2} = line;
        if (x1 > xMax) xMax = x1;
        if (x2 > xMax) xMax = x2;

        if (y1 > yMax) yMax = y1;
        if (y2 > yMax) yMax = y2;
    }

    const board = [];
    for (let y = 0; y <= yMax; y++) {
        board.push(new Array(xMax).fill(0));
    }

    for (const line of lines) {
        let {x1, x2, y1, y2} = line;
        const xDiff = x1 < x2 ? 1 : x1 > x2 ? -1 : 0;
        const yDiff = y1 < y2 ? 1 : y1 > y2 ? -1 : 0;

        let x = x1;
        let y = y1;
        const points = [{x, y}];

        while (x !== x2 || y !== y2) {
            x += xDiff;
            y += yDiff;
            points.push({x, y});
        }

        for (const point of points) {
            board[point.y][point.x] = board[point.y][point.x] + 1;
        }
    }

    let countOverlapping = 0;
    for (const line of board) {
        countOverlapping += line.filter((i) => i > 1).length;
    }
    console.log('Part 2 overlapping points: ', countOverlapping);
    return countOverlapping;
}

part1(lines);
part2(lines);
