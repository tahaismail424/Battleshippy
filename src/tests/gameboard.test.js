const gameboard = require('../gameboard');

const board = gameboard();

test("marks board at (4,7) with 'm'", () => {
    expect(board.receiveAttack(2, 3)[3][2]).toBe('m');
});

test("gets error when placing ship out of bounds", () => {
    expect(board.shipPlacement(7, 7, 'horizontal', 4)).toBe('error');
});

test("marks board with '4.0, 4.1, 4.2, 4.3, 4.4' in a horizontal row", () => {
    expect(board.shipPlacement(2, 2, 'horizontal', 4)[2].slice(2, 7))
    .toEqual(['4.0', '4.1', '4.2', '4.3', '4.4']);
})

test("marks board with '4.0, 4.1, 4.2, 4.3, 4.4' in a vertical row", () => {
    expect(board.shipPlacement(1, 1, 'vertical', 4)
    .map((row, column) => row[1])
    .slice(1, 6))
    .toEqual(['4.0', '4.1', '4.2', '4.3', '4.4']);
});

test("marks 2nd position of ship with 'x'", () => {
    expect(board.receiveAttack(1, 2)
    .positions)
    .toEqual(['o', 'x', 'o', 'o', 'o']);
});

test("see if all ships sunk recognized", () => {
    for (let ship in board.ships) {
        board.ships[ship].positions.fill('x');
    }
    expect(board.allSunk()).toBe(true);
});







