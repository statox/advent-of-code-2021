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

data = data.split(/\r?\n/).filter((l) => l.length);

function part1(data) {
    let total = 0;
    for (const line of data) {
        const output = line.split(' | ')[1];
        total += output.split(' ').filter((l) => [2, 3, 4, 7].includes(l.length)).length;
    }
    console.log('Part 1', total);
}

function decodeSignals(signals) {
    // 1, 4, 7, and 8 have unique size
    const ONE = signals.find((w) => w.length === 2);
    const FOUR = signals.find((w) => w.length === 4);
    const SEVEN = signals.find((w) => w.length === 3);
    const HEIGHT = signals.find((w) => w.length === 7);
    signals = signals.filter((w) => ![ONE, FOUR, SEVEN, HEIGHT].includes(w));

    // From what remains 9 is the only digit which has all the segments in 4 and 7 + another segment
    const four_plus_seven_segments = [...new Set([...FOUR, ...SEVEN])];
    const NINE = signals.find((w) => {
        if (w.length !== four_plus_seven_segments.length + 1) {
            return false;
        }
        for (const segment of four_plus_seven_segments) {
            if (!w.includes(segment)) {
                return false;
            }
        }
        return true;
    });
    signals = signals.filter((w) => ![NINE].includes(w));

    // From what remains zero is the only with a size of 6 including both segments of 1
    const ZERO = signals.find((w) => {
        if (w.length !== 6) {
            return false;
        }
        return w.includes(ONE[0]) && w.includes(ONE[1]);
    });
    signals = signals.filter((w) => w !== ZERO);

    // From what remains 6 is the only one with a size of 6
    const SIX = signals.find((w) => {
        return w.length === 6;
    });
    signals = signals.filter((w) => w !== SIX);

    // From what remains 3 is the only one including both segments of one
    const THREE = signals.find((w) => {
        return w.includes(ONE[0]) && w.includes(ONE[1]);
    });
    signals = signals.filter((w) => w !== THREE);

    // The segment c is the only one not in 6
    const segment_c = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].find((s) => !SIX.includes(s));

    // We can discriminate 5 and 2 by checking which one has the segment c
    const FIVE = signals.find((w) => !w.includes(segment_c));
    const TWO = signals.find((w) => w.includes(segment_c));

    const res = {};
    res[ONE] = '1';
    res[TWO] = '2';
    res[THREE] = '3';
    res[FOUR] = '4';
    res[FIVE] = '5';
    res[SIX] = '6';
    res[SEVEN] = '7';
    res[HEIGHT] = '8';
    res[NINE] = '9';
    res[ZERO] = '0';
    return res;
}

function decodeOutput(reference, output) {
    let res = '';
    for (const w of output) {
        res += reference[w];
    }
    return Number(res);
}

function part2(data) {
    let total = 0;
    for (const line of data) {
        const [signal, output] = line.split(' | ').map((s) => s.split(' ').map((w) => [...w].sort().join('')));
        const ref = decodeSignals(signal);
        const out = decodeOutput(ref, output);
        // console.log(line, out);
        total += out;
    }
    console.log('Part 2', total);
}

part1(data);
part2(data);
