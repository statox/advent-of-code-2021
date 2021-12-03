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
const depths = data.split(/\r?\n/).map(Number);

// Given an array count the number of item greater than the one before
const countIncreasesInArray = (a) => {
    let countIncreases = 0;
    for (let i = 1; i < a.length; i++) {
        if (a[i] > a[i - 1]) {
            countIncreases++;
        }
    }
    return countIncreases;
};

const part1 = countIncreasesInArray(depths);
console.log('Part 1', part1);

// Create the sliding windows
const windows = [];
for (let i = 0; i + 3 < depths.length; i++) {
    const currentWindow = depths[i] + depths[i + 1] + depths[i + 2];
    windows.push(currentWindow);
}

const part2 = countIncreasesInArray(windows);
console.log('Part 2', part2);
