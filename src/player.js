import Gameboard from './gameboard.js';
import { cpu } from './index.js';

const Player = () => {

    let playerBoard = Gameboard();
    
    function sendAttack(x, y, opBoard) {
        if (opBoard[y][x] == 'h' || opBoard[y][x] == 'm') return "error";
        else return [x, y];
    }

    function placeShip(x, y, orientation, shipNo) {
        if (playerBoard.shipPlacement(x, y, orientation, shipNo) == "error") return false;
        else return true;
    }

    return { playerBoard, sendAttack, placeShip };

};

const Computer = () => {

    const {playerBoard} = Player();

    function sendAttack(opBoard) {
        let x;
        let y;
        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        } while (opBoard[y][x] == 'h' ||
        opBoard[y][x] == 'm')

        return [x, y];
    }

    let shipStarts = [];

    function placeShips() {
        for (let shipNo in playerBoard.ships) 
            shipStarts.push(placeShip(shipNo));
        return shipStarts;
    }


    function placeShip(shipNo) {
        let coin = Math.floor(Math.random() * 2);
        let orientation = (coin == 0) ? 'vertical' : 'horizontal';
        let x;
        let y;
        let result;
        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            result = playerBoard.shipPlacement(x, y, orientation, shipNo);
        } while (result == "error"); 
        return result;
    }

    return { playerBoard, sendAttack, placeShips, shipStarts };
}

export { Player, Computer };