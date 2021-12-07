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
const bingo = data.split(/\r?\n/);

function readBingoData(data) {
    const numbers = bingo.shift().split(',').map(Number);

    const boards = [];

    bingo.pop(); // Remove the last empty line
    while (bingo.length) {
        bingo.shift(); // Empty line
        const board = [];
        for (let _ = 0; _ < 5; _++) {
            const line = bingo.shift().trim().replace(/\s+/g, ' ').split(' ').map(Number);
            board.push(line);
        }
        boards.push(board);
    }
    return {numbers, boards};
}

function boardHasNumber(board, number) {
    for (const line of board) {
        if (line.includes(number)) {
            return true;
        }
    }
    return false;
}

function markNumberInBoard(board, number) {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === number) {
                board[y][x] = -1;
            }
        }
    }

    return board;
}

function boardIsFinished(board) {
    for (let y = 0; y < board.length; y++) {
        if (board[y].every((i) => i === -1)) {
            return true;
        }
    }

    for (let x = 0; x < board[0].length; x++) {
        let allMarked = true;
        for (let y = 0; y < board.length; y++) {
            if (board[y][x] !== -1) {
                allMarked = false;
                break;
            }
        }
        if (allMarked) {
            return true;
        }
    }
    return false;
}

function boardScore(board, lastNumber) {
    let totalUnmarked = 0;
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] !== -1) {
                totalUnmarked += board[y][x];
            }
        }
    }
    return totalUnmarked * lastNumber;
}

function part1(numbers, boards) {
    for (const number of numbers) {
        for (const board of boards) {
            const found = boardHasNumber(board, number);
            if (found) {
                markNumberInBoard(board, number);
            }

            if (boardIsFinished(board)) {
                const score = boardScore(board, number);
                console.log('Board is winner with score', score);
                return score;
            }
        }
    }
}

// Ouh that's dirty
function part2(numbers, boards) {
    let lastScore;
    const finished = new Set();
    for (const number of numbers) {
        for (let i = 0; i < boards.length; i++) {
            if (finished.has(i)) {
                continue;
            }
            const board = boards[i];
            const found = boardHasNumber(board, number);
            if (found) {
                markNumberInBoard(board, number);
            }

            if (boardIsFinished(board)) {
                finished.add(i);
                const score = boardScore(board, number);
                console.log('Board is winner with score', score);
                lastScore = score;
            }
        }
    }
    console.log('Last winning score', lastScore);
}

const {numbers, boards} = readBingoData(bingo);
part1(numbers, boards);
part2(numbers, boards);
