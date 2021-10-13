import Ship from './ship.js';

const Gameboard = () => {
    let gameboard = [['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0'],
                    ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']];

    //make ships
    let ships = [];
    for (let i = 1; i <= 5; i++) {
        let length;
        if (i == 1) length = 2;
        else if (i == 2 || i == 3) length = 3;
        else length = i;
        ships.push(Ship(length));
    }
   
    
    function shipPlacement(startX, startY, orientation, shipNo) {
        let length = ships[shipNo].length;
        if (orientation == 'vertical' && 
        isVacant(startX, startY, 'vertical', length)) {
            for (let i = 0; i < length; i++) {
                gameboard[startY + i][startX] = shipNo + '.' + i;
            }
        }
        else if (orientation == 'horizontal' &&
        isVacant(startX, startY, 'horizontal', length)) {
            for (let i = 0; i < length; i++) {
                gameboard[startY][startX + i] = shipNo + '.' + i;
            }
        }
        else return "error";
        return { startX, startY };
        }
    function isVacant(startX, startY, orientation, length) {
        if (orientation == 'vertical') {
            //make sure ship is not out of bounds
            if (startY + length > 10) return false;
            for (let i = 0; i < length; i++) {
                if (gameboard[startY + i][startX] != '0' &&
                gameboard[startY + i][startX] != 'm') {
                    return false;
                }
            }
        }
        else if (orientation == 'horizontal') {
            //make sure ship is not out of bounds
            if (startX + length > 10) return false;
            for (let i = 0; i < length; i++) {
                if (gameboard[startY][startX + i] != '0' &&
                gameboard[startY][startX + i] != 'm') {
                    return false;
                }
            }
        }
        return true;
    }

    function receiveAttack(x, y) {
        let shipPos = gameboard[y][x];
        let shipNo = gameboard[y][x].charAt(0);
        if (shipPos != '0' && shipPos != 'm' && shipPos != 'h') {
            ships[shipNo].hit(parseInt(shipPos.charAt(2)));
            gameboard[y][x] = 'h';
            return { status: "hit", shipNo };
        }
        else {
            gameboard[y][x] = 'm';
            return { status: "miss", shipNo: -1 };
        }
    }

    function allSunk() {
        return ships.every((ship) => ship.isSunk());
        
    }
    return { receiveAttack, shipPlacement, allSunk, ships, gameboard };
};

export default Gameboard;
