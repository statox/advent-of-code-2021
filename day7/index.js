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
const crabs = data.split(',').map(Number);

function median(numbers) {
    const sorted = numbers.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[middle - 1] + sorted[middle]) / 2;
    }

    return sorted[middle];
}

function part1(crabs) {
    const med = median(crabs);
    console.log('Best position', med);

    const totalFuel = crabs.reduce((total, position) => {
        const consommation = Math.abs(position - med);
        return total + consommation;
    }, 0);

    console.log('Part 1', totalFuel);
}

// 1+2+3+...+n
function triangularNumber(n) {
    return (n * (n + 1)) / 2;
}

function part2Cost(crabs, target) {
    const totalFuel = crabs.reduce((total, position) => {
        const diff = Math.abs(position - target);
        const cost = triangularNumber(diff);
        return total + cost;
    }, 0);

    return totalFuel;
}

function part2(crabs) {
    const min = Math.min(...crabs);
    const max = Math.max(...crabs);
    let bestPosition;
    let bestPositionCost;

    for (let target = min; target <= max; target++) {
        const cost = part2Cost(crabs, target);
        if (!bestPositionCost || cost < bestPositionCost) {
            bestPosition = target;
            bestPositionCost = cost;
        }
    }

    console.log('Part 2', bestPositionCost);
}

part1(crabs);
part2(crabs);
