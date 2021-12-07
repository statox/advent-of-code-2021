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
const ages = data.split(',').map(Number);

function part1(ages, maxDays) {
    for (let days = 0; days < maxDays; days++) {
        let toPush = 0;
        for (let i = 0; i < ages.length; i++) {
            ages[i] -= 1;
            if (ages[i] < 0) {
                ages[i] = 6;
                toPush++;
            }
        }
        for (let _ = 0; _ < toPush; _++) {
            ages.push(8);
        }

        // console.log(ages);
    }
    console.log('Part 1', ages.length);
}

function part2(ages, maxDays) {
    let allAges = {};
    for (let age = 0; age <= 8; age++) {
        allAges[age] = 0;
    }

    for (const age of ages) {
        allAges[age] += 1;
    }

    for (let days = 0; days < maxDays; days++) {
        const newFishes = allAges[0];
        for (let age = 0; age < 8; age++) {
            allAges[age] = allAges[age + 1];
        }
        allAges[8] = newFishes;
        allAges[6] += newFishes;
        // console.log(allAges);
    }

    let total = 0;
    for (let age = 0; age <= 8; age++) {
        total += allAges[age];
    }
    console.log('Part 2', total);
}

part1([...ages], 80);
part2([...ages], 256);
