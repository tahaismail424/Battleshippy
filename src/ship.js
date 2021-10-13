const Ship = (length) => {
    let positions = new Array(length).fill('o');

    function hit(position) {
        //increase hitCount if ship position isn't already hit 
        if (positions[position] == 'x') return "error";
        else positions[position] = 'x';
    }


    function isSunk() {
        const reducer = (prev, cur) => prev + (cur == 'x');
        return (positions.reduce(reducer, 0) >= length);
    };

    return { length, hit, isSunk, positions };
}

export default Ship;