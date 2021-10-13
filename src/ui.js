import ship2 from './assets/2_boat.png';
import ship2h from './assets/2_boat_h.png';
import ship3 from './assets/3_boat.png';
import ship3h from './assets/3_boat_h.png';
import ship4 from './assets/4_boat.png';
import ship4h from './assets/4_boat_h.png';
import ship5 from './assets/5_boat.png';
import ship5h from './assets/5_boat_h.png';
import redX from './assets/red_x.png';
import { p1, cpu, turn, setupGame, playTurn } from './index.js';

const UI = (() => {

    const page = document.querySelector('body');

    let test_image = new Image();
    test_image.src = ship2h;
    page.appendChild(test_image);
    test_image = new Image();
    test_image.src = ship3h;
    page.appendChild(test_image);
    test_image = new Image();
    test_image.src = ship4h;
    page.appendChild(test_image);
    test_image = new Image();
    test_image.src = ship5h;
    page.appendChild(test_image);

    document.querySelectorAll('img').forEach(pic => pic.remove());
   

    function makeElement(type, text, parent, classname, id) {
        const elem = document.createElement(type);
        elem.textContent = text;
        elem.classList.add(classname);
        elem.setAttribute('id', id);
        parent.appendChild(elem);
        return elem;
    }

    function addIntro() {
        const title = makeElement('h1', 'Battleship!', page, 'title');
        const startButton = makeElement('button', 'click to start', page, 'menu-button');
        startButton.addEventListener('click', setupGame);

    }

    function removeIntro() {
        document.querySelector('.menu-button').remove();
        const title = document.querySelector('.title');
        title.classList.add('title-2');
        title.classList.remove('title');
    }

    

    function placePlayerBoard() {
        const playBox = makeElement('div', '', page, 'play-box');
        const board = makeElement('div', '', playBox, 'board', 'p1-board');
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const square = makeElement('div', '', board, 'board-square', `${j}${i}-square-p1`);
                square.addEventListener('drop', drop);
                square.addEventListener('dragover', whileDragover);
            }
        }
    }

    function placeShipSelect() {
        const playBox = document.querySelector('.play-box');
        const shipSpace = makeElement('div', '', playBox, 'ship-space');
        const shipPics = []
        for (let i = 0; i < 5; i++) {
            shipPics.push(makeElement('img', '', shipSpace, 'ship'));
            shipPics[i].setAttribute('id', `ship-${i}`);
            shipPics[i].setAttribute('draggable', 'true');
            shipPics[i].addEventListener('dragstart', dragstart);
            shipPics[i].addEventListener('drag', whileDrag);
            shipPics[i].addEventListener('dragend', dragend);
            if (i == 0) shipPics[i].setAttribute('src', ship2);
            else if (i == 1 || i== 2) shipPics[i].setAttribute('src', ship3); 
            else if (i == 3) shipPics[i].setAttribute('src', ship4);
            else if (i == 4) shipPics[i].setAttribute('src', ship5);
        }
    }



    function placeOpponentBoard() {
        const playBox = document.querySelector('.play-box');
        const board = makeElement('div', '', playBox, 'board', 'op-board');
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const square = makeElement('div', '', board, 'board-square', `${j}${i}-square-op`);
                const button = makeElement('button', '', square, 'board-button', `${j}${i}-button`);
                button.onclick = playTurn(p1, cpu, turn);
            }
        }
        //const board_message = makeElement('div', 'click square to hit opponent board', playBox, 'board-message')
    }

    function removeShipSelect() {
        document.querySelector('.ship-space').remove();
    }



    function invalidActionMessage() {
        alert("You have already attempted a hit there. Please pick another space.");
    }

    function updateCompBoard() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let squareStatus = cpu.playerBoard.gameboard[j][i];
                let curSquare =  document.getElementById(`${i}${j}-square-op`);
                if ((squareStatus == 'h' ||
                        squareStatus == 'm') &&
                        curSquare.classList.length == 1) {
                    let classToAdd = (squareStatus == 'h') ? 'hit' : 'miss';
                    curSquare.classList.add(classToAdd);
                }
            }
        }
        let compShips = cpu.playerBoard.ships;
        for (let shipNo = 0; shipNo < compShips.length; shipNo++) {
            if (compShips[shipNo].isSunk()) {
                let x = cpu.shipStarts[shipNo].startX;
                let y = cpu.shipStarts[shipNo].startY;
                if (document.getElementById(`${x}${y}-square-op`).children.length <= 1) {
                    let position;
                    if (cpu.playerBoard.gameboard[y][x + 1] == 'h') position = 'horizontal';
                    else if (cpu.playerBoard.gameboard[y + 1][x] == 'h') position = 'vertical';
                    let sunkShip = new Image();
                    sunkShip.src = getShipPic(shipNo, position);
                    sunkShip.classList.add(position);
                    let square = document.getElementById(`${x}${y}-square-op`);
                    square.appendChild(sunkShip);
                }
            }
        }
    }

    function updatePlayerBoard() {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let squareStatus = p1.playerBoard.gameboard[j][i];
                let curSquare =  document.getElementById(`${i}${j}-square-p1`);
                if ((squareStatus == 'h' ||
                        squareStatus == 'm') &&
                        curSquare.classList.length == 1) {

                    let classToAdd = (squareStatus == 'h') ? 'hit' : 'miss';
                    curSquare.classList.add(classToAdd);
                    if (classToAdd == 'hit') {
                        let hitImg = new Image();
                        hitImg.src = redX;
                        hitImg.classList.add('hit-x');
                        curSquare.appendChild(hitImg);
                    }
                }
            }
        }
    }

    function hitMessage(turn) {
        let message = (turn % 2 == 0) ? "You hit a ship! Nice work!" :
            "Oh no! One of your ships was hit!";
        alert(message);
    }

    function sinkMessage(turn) {
        let message = (turn % 2 == 0) ? "Wow! You sunk an opponent ship!!" :
            "Oh no! Your ship was sunk!";
        alert(message);
    }

    function missMessage(turn) {
        let message = (turn % 2 == 0) ? "Oof. Doesn't look like you hit anything." :
            "Whew. Looks like none of your ships were hit.";
        alert(message);

    }

    function winMessage(turn) {
        while (page.firstChild) page.removeChild(page.firstChild);
        let message = (turn% 2 == 0) ? "Opponent won :(" : 
            "You won!";
        let title = makeElement('h2', 'Battleship!', page, 'title-2');
        let winMessage = makeElement('h1', message, page, 'title');
        let againButton = makeElement('button', 'Play Again', page, 'menu-button');
        againButton.addEventListener('click', (e) => {
            while (page.firstChild) page.removeChild(page.firstChild);
            addIntro();
        });

    }


    let vertical = true;

    function dragstart(e) {
        let positionStatement = makeElement('div', '', 
            page, 'position');
        vertical = true;
        e.dataTransfer.setData("text/uri-list", e.target.src);
        e.dataTransfer.setData('text/plain', e.target.id.charAt(e.target.id.length - 1));
        const ship_img = new Image();
        ship_img.src = e.target.src;
        e.dataTransfer.setDragImage(ship_img, 
            e.target.width / 2, 0);
        e.dataTransfer.dropEffect = "move";
    }


    function whileDrag(e) {
        let positionStatement = document.querySelector('.position');
        positionStatement.textContent = (vertical) ? "vertical" : "horizontal";
        if (e.shiftKey) {
            vertical = !vertical;
            positionStatement.textContent = (vertical) ? "vertical" : "horizontal";
            e.target.removeEventListener('drag', whileDrag);
            setTimeout(() => {e.target.addEventListener('drag', whileDrag)}, 400);
        }
    }

    function whileDragover(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    function dragend(e) {
        e.dataTransfer.dropEffect = "move";
        document.querySelector('.position').remove();
    }

    function drop(e) {
        e.preventDefault();
        const ship_img = new Image();
        let shipNo = parseInt(e.dataTransfer.getData('text/plain'));
        let position = (vertical) ? 'vertical' : 'horizontal';
        ship_img.src = getShipPic(shipNo, position);
        let x = parseInt(e.target.id.charAt(0));
        let y = parseInt(e.target.id.charAt(1));
        

        //if valid position - then place ship inside the element
        if (p1.playerBoard.shipPlacement(x, y, position, shipNo) != "error") {
            e.target.appendChild(ship_img);
            document.querySelector(`#ship-${shipNo}`).remove();
            ship_img.setAttribute('id', `ship-${shipNo}`);
            ship_img.classList.add('placed-ship');
            ship_img.classList.add(position);
        }
    }

    function getShipPic(shipNo, position) {
        let img_link;
        switch (shipNo) {
            case 0:
                img_link = (position == 'vertical') ? ship2 : ship2h;
                break;
            case 1:
            case 2:
                img_link = (position == 'vertical') ? ship3 : ship3h;
                break;
            case 3:
                img_link = (position == 'vertical') ? ship4 : ship4h;
                break;
            case 4:
                img_link = (position == 'vertical') ? ship5 : ship5h;
                break;
        }
        return img_link;
    }

    return { addIntro, removeIntro, placePlayerBoard, placeShipSelect, placeOpponentBoard, removeShipSelect,
        invalidActionMessage, updateCompBoard, updatePlayerBoard, hitMessage, sinkMessage, missMessage, 
        winMessage }
})();

export default UI;