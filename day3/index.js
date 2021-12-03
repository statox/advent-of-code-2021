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
const bits = data.split(/\r?\n/).filter((l) => l.length > 0);

function part1(bits) {
    let gammaBin = '';
    for (let i = 0; i < bits[0].length; i++) {
        let count = {'0': 0, '1': 0};
        for (const bit of bits) {
            count[bit[i]]++;
        }
        gammaBin += count['1'] > count['0'] ? 1 : 0;
    }
    let epsilonBin = [...gammaBin].map((b) => (b === '0' ? '1' : '0')).join('');

    const gamma = parseInt(gammaBin, 2);
    const epsilon = parseInt(epsilonBin, 2);

    console.log({gammaBin, epsilonBin, gamma, epsilon});

    const part1 = gamma * epsilon;
    console.log('part1', part1);
}

function part2(bits) {
    let o2 = [...bits];
    let co2 = [...bits];
    let i = 0;
    while (o2.length > 1) {
        const count = {'0': 0, '1': 0};
        o2.forEach((b) => count[b[i]]++);
        const mostCommon = count['1'] >= count['0'] ? '1' : '0';
        o2 = o2.filter((b) => b[i] === mostCommon);
        i++;
        // console.log(o2);
    }
    const o2Bin = o2[0];
    const o2Dec = parseInt(o2Bin, 2);
    console.log({o2Dec});

    i = 0;
    while (co2.length > 1) {
        const count = {'0': 0, '1': 0};
        co2.forEach((b) => count[b[i]]++);
        const leastCommon = count['1'] >= count['0'] ? '0' : '1';
        co2 = co2.filter((b) => b[i] === leastCommon);
        i++;
        // console.log(co2);
    }
    const co2Bin = co2[0];
    const co2Dec = parseInt(co2Bin, 2);
    console.log({co2Dec});

    const part2 = o2Dec * co2Dec;
    console.log('part2', part2);
}

part1(bits);
part2(bits);
