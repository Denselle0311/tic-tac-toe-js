// @ts-nocheck
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

const displayController = (()=> {
    const gameContainer = document.querySelector('.game-container');
    const startWrapper = document.querySelector('.start-wrapper');
    const gameoverWrapper = document.querySelector('.gameover-wrapper');
    const selectDifficulty = document.getElementById('select-difficulty');
    const difficultyDisplay = document.querySelector('.difficulty-display');
    const startGameButton = document.querySelector('.start-button');
    const playerSignContainer = document.querySelector('.player-sign-container');
    const playerTurnSign = document.querySelector('.name');
    const cellContainer = document.querySelector('.cell-container');
    const restartPlayButton = document.querySelector('.play-restart');
    const gameoverRestartButton = document.querySelector('.gameover-restart');
    const gameoverNewGameButton = document.querySelector('.gameover-new-game');
    const playingNewGameButton = document.querySelector('.new-game');

    const cells = [...cellContainer.children];
    
    const setSelectingState = () => {
        startWrapper.style.display = 'flex';
        gameContainer.style.display = 'none';
        
        gameoverWrapper.classList.remove('active');
    };
    
    const setPlayingState = () => {
        startWrapper.style.display = 'none';
        gameContainer.style.display = 'flex';
        
        gameoverWrapper.classList.remove('active');
    };
    
    const setGameOverState = () => {
        startWrapper.style.display = 'none';
        gameContainer.style.display = 'none';
        
        gameoverWrapper.classList.toggle('active');
    };  

    function updateTurnDisplay() {
        playerTurnSign.textContent = gameController.game.currentPlayer;

        removeClass(cellContainer);

        const sign = gameController.game.currentPlayer.toLowerCase();
        cellContainer.classList.add(sign);
    }

    function removeClass(target) {
        target.className = target.className.split(' ')[0];
    }

    function handleSign(e) {
        if (e.target.classList.contains('sign')) {
            const sign = e.target;
            const selectedSign = sign.id.toUpperCase(); 
            
            toggleDisableSign();
            gameController.setPlayerOne(selectedSign);
        }
    }

    function newGame() {
        gameController.restoreDefaultGame();
        clearCellContainer();
        setSelectingState();
        updateTurnDisplay();
        enabledAllClickBox();
        
        removeClass(cellContainer);
        cells.forEach(c => removeClass(c));
        // player sign

        selectDifficulty.value = gameController.game.difficulty;
    }

    function restartPlay() {
        const game = gameController.game;
        game.round = 0;
        game.currentPlayer = 'X';

        gameController.defaultGameboard();
        clearCellContainer();
        enabledAllClickBox();
        updateTurnDisplay();

        removeClass(cellContainer);
        cells.forEach(c => removeClass(c));

        setPlayingState();
    }

    function clearCellContainer() {
        cells.forEach(c => {
            c.textContent = '';
            c.classList.remove('win');
        });
    }

    function toggleDisableSign() {
        const signs = [...playerSignContainer?.querySelectorAll('.sign')];
        signs.forEach(s => s.classList.toggle('active'));
    }
    
    function addStyle(thisEle, valueObj) {
        Object.assign(thisEle, valueObj);
    }

    function draw() {
        setGameOverState();
        gameoverWrapper.querySelector('h2').textContent = 'Draw!!';
        console.log('draw');
    }
    
    function win([a,b,c]) {
        renderWinnerStyle(a,b,c);
        gameoverWrapper.querySelector('h2').textContent = gameController.game.currentPlayer+' Win!!';
        disabledAllClickBox();
        setGameOverState()
    }

    function loss() {

    }

    function renderWinnerStyle(a,b,c) {
        [...arguments].forEach(e => cells[e].classList.add('win'));
    }
    
    function disabledAllClickBox() {
        cells.forEach(cell => cell.removeEventListener('click', gameController.handleClickBox));
    }

    function enabledAllClickBox() {
        cells.forEach(cell => cell.addEventListener('click', gameController.handleClickBox));
    }

    
    cells.forEach(a => a.addEventListener('click', gameController.handleClickBox));
    
    playerSignContainer?.addEventListener('click', handleSign);

    selectDifficulty?.addEventListener('change', (e) => {
        const difficulty = e.target.value;
        gameController.setDifficulty(difficulty);
        
    })

    restartPlayButton.addEventListener('click', restartPlay);
    gameoverRestartButton.addEventListener('click', restartPlay);

    gameoverNewGameButton.addEventListener('click', newGame);

    playingNewGameButton.addEventListener('click', newGame);

    startGameButton?.addEventListener('click', ()=> {
        setPlayingState();
        difficultyDisplay.textContent = gameController.game.difficulty[0].toUpperCase() + gameController.game.difficulty.slice(1);
    });

    return {
        setSelectingState,
        setPlayingState,
        setGameOverState,
        updateTurnDisplay,
        draw,
        win
    }
})();
