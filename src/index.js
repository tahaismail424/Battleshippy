import './ui_styles.css';
import { Player, Computer } from './player.js';
import UI from './ui.js';

UI.addIntro();
let p1;
let cpu;
let turn;

function setupGame() {
    p1 = Player();
    cpu = Computer();
    turn = 0;

    //place computer ship
    cpu.shipStarts = cpu.placeShips();
    UI.removeIntro();
    UI.placePlayerBoard();
    UI.placeShipSelect();
    //start placement sequence
    //whenever ship is dragged to right place, it stays there
    //and placedShips goes up by one
    //when its dragged to wrong place, gives error message and
    //goes back to original place
    //when dragged nowhere at all, just goes back to original place

    const placedChecker = setInterval(nextAllPlaced, 500);
    function nextAllPlaced() {
        if (document.querySelector('.ship-space').children.length == 0) {
            clearInterval(placedChecker);
            UI.removeShipSelect();
            UI.placeOpponentBoard();
        }
            //add additional board on screen for opponent
            //populate buttons so you can take turn, add event listeners
    }  
} 

function playTurn(p1, cpu, turn) {
    return function (e) {
        let x = parseInt(e.target.id.charAt(0));
        let y = parseInt(e.target.id.charAt(1));
        let attack = p1.sendAttack(x, y, cpu.playerBoard.gameboard);
        if (attack == "error") UI.invalidActionMessage();
        else {
            evaluateAttack(cpu.playerBoard, attack);
            UI.updateCompBoard();
            turn++;
            let cpuAttack = cpu.sendAttack(p1.playerBoard.gameboard);
            evaluateAttack(p1.playerBoard, cpuAttack);
            UI.updatePlayerBoard();
        }
        function evaluateAttack(board, attack) {
            let { status, shipNo } = board.receiveAttack(attack[0], attack[1]);
            if (status == "hit") {
                UI.hitMessage(turn);
                if (board.ships[shipNo].isSunk()) UI.sinkMessage(turn);
            }
            else if (status == "miss") UI.missMessage(turn);
        }
        if (p1.playerBoard.allSunk() || cpu.playerBoard.allSunk()) UI.winMessage(turn);
        else turn++; 
    };
}




export { p1 , cpu, turn, setupGame, playTurn }
