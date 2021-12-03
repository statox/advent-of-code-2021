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
const commands = data
    .split(/\r?\n/)
    .filter((l) => l.length > 0)
    .map((line) => line.split(' '));

function part1(commands) {
    const position = {x: 0, y: 0};

    for (const command of commands) {
        const [direction, value] = command;
        if (direction === 'forward') {
            position.x += +value;
        }
        if (direction === 'down') {
            position.y += +value;
        }
        if (direction === 'up') {
            position.y -= +value;
        }
    }

    const part1 = position.x * position.y;
    console.log('part1', part1);
}

function part2(commands) {
    const position = {x: 0, y: 0, aim: 0};

    for (const command of commands) {
        const [direction, value] = command;
        if (direction === 'forward') {
            position.x += +value;
            position.y += position.aim * +value;
        }
        if (direction === 'down') {
            position.aim += +value;
        }
        if (direction === 'up') {
            position.aim -= +value;
        }
    }

    const part1 = position.x * position.y;
    console.log('part1', part1);
}

part1(commands);
part2(commands);
