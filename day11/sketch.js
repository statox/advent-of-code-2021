let input;
let grid;
let scaleY;
let scaleX;
let flashesCount;
let stepCount;
let lastTick;
let part2Found;
const D = 700;

function preload() {
    input = loadStrings('./input');
}

function setup() {
    lastTick = millis();
    flashesCount = 0;
    part2Found = false;
    stepCount = 0;
    grid = input.filter((l) => l.length).map((l) => l.split('').map(Number));
    scaleY = D / grid.length;
    scaleX = D / grid[0].length;

    const myCanvas = createCanvas(D, D);
    myCanvas.parent('canvasDiv');
    noStroke();
}

function colorByFlashLevel(level) {
    if (level === 0) {
        return '#f9dc00';
    }
    return map(level, 1, 9, 0, 205);
}

function draw() {
    background(10);

    doUpdate();
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const c = colorByFlashLevel(grid[y][x]);
            fill(c);
            circle(x * scaleX + scaleX / 2, y * scaleY + scaleY / 2, scaleX, scaleY);
        }
    }
}

const xyToStr = (x, y) => `${x};${y}`;

function doUpdate() {
    if (stepCount === 100) {
        console.log('Part1', flashesCount);
        document.getElementById('part1Span').innerText = `Part 1: ${flashesCount} flashes after 100 steps`;
    }

    if (millis() > lastTick + 100) {
        lastTick = millis();
        stepCount++;
        flashesCount += doStep(grid);

        if (
            !part2Found &&
            grid
                .join(',')
                .split(',')
                .filter((i) => +i !== 0).length === 0
        ) {
            part2Found = true;
            document.getElementById('part2Span').innerText = `Part 2: All synced at step ${stepCount}`;
        }

        document.getElementById('stepSpan').innerText = stepCount;
        document.getElementById('flashesSpan').innerText = flashesCount;
    }
}

function getNeighbors(x, y) {
    const n = [];
    y > 0 && x > 0 && n.push({x: x - 1, y: y - 1});
    y > 0 && n.push({x: x, y: y - 1});
    y > 0 && x < grid[y].length - 1 && n.push({x: x + 1, y: y - 1});

    x > 0 && n.push({x: x - 1, y});
    x < grid[y].length - 1 && n.push({x: x + 1, y});

    y < grid.length - 1 && x > 0 && n.push({x: x - 1, y: y + 1});
    y < grid.length - 1 && n.push({x: x, y: y + 1});
    y < grid.length - 1 && x < grid[y].length - 1 && n.push({x: x + 1, y: y + 1});
    return n;
}

function doStep(lines) {
    const flashed = new Set();
    const toFlash = [];

    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines.length; x++) {
            lines[y][x] += 1;
            if (lines[y][x] > 9) {
                toFlash.push({x, y});
            }
        }
    }

    while (toFlash.length) {
        const {x, y} = toFlash.shift();
        if (flashed.has(xyToStr(x, y))) {
            continue;
        }
        flashed.add(xyToStr(x, y));

        for (const n of getNeighbors(x, y)) {
            if (lines[n.y][n.x] > 9) {
                continue;
            }
            lines[n.y][n.x] += 1;
            if (lines[n.y][n.x] > 9) {
                toFlash.push(n);
            }
        }
    }

    for (const str of flashed) {
        const [x, y] = str.split(';').map(Number);
        lines[y][x] = 0;
    }

    return flashed.size;
}
