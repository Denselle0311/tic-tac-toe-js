const gameController = (()=> {
    const game = {
            player1: 'X',
            player2: 'O',
            round: 0,
            currentPlayer: 'X',
            gameBoard: new Array(9).fill(null),
            difficulty: 'easy'
        };

    const winCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    function handleClickBox(e) {
        const box = e.target;
        const idx = box.getAttribute('cellIndex');
        
        box.classList.add('active')

        box.textContent = game.currentPlayer;
        game.gameBoard[idx] = game.currentPlayer;

        nextRound();
        
        box.removeEventListener('click', handleClickBox);

        if (game.round > 3) checkWinner();
    }
    
    function nextRound() {
        game.round++; // increment first
        game.currentPlayer = checkPlayerTurn();
        displayController.updateTurnDisplay();
    }

    function checkPlayerTurn() {
        return game.round % 2 ? 'O' : 'X';
    }

    function checkWinner() {
        const gameBoard = game.gameBoard;

        winCombinations.forEach(r => {
            const [a, b, c] = r; 

            if (gameBoard[a] && (gameBoard[a] === gameBoard[b] && gameBoard[b] === gameBoard[c])) {
                
                console.log('win')
                game.currentPlayer = gameBoard[a];
                displayController.win(r)
            }
            else if (game.round == 9) displayController.draw()
            else console.log('nope')
        })
    }

    function defaultGameboard() {
        game.gameBoard = new Array(9).fill(null);
    }

    function restoreDefaultGame() {
        game.currentPlayer = 'X';
        game.difficulty = 'easy';
        game.round = 0;
        defaultGameboard();
    }

    function setDifficulty(diff) {
        game.difficulty = diff;
    }

    function setPlayerOne(sign) {
        game.player1 = sign;
        game.player2 = sign == 'X' ? 'O' : 'X';
    }

    return {
      game,
      handleClickBox,
      setPlayerOne,
      setDifficulty,
      checkPlayerTurn,
      defaultGameboard,
      restoreDefaultGame
    }
})();
