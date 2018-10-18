const Game = require('../models/game.js');
const Board = require('./board.js');

const challengeUser = (req, res) => {
  let newBoard = Board.newBoard;
  Game.create(req, res, newBoard)
};

const findNextPlayer = (board, owner_mark_o, owner_mark_x) => {
  let xCount = 0;
  let oCount = 0;
  Object.keys(board).forEach(position => {
    if (board[position] === 'X') {
      xCount += 1;
    } else if (board[position] === 'O') {
      oCount += 1;
    }
  });
  if (xCount < oCount) {
    return owner_mark_x;
  } else {
    return owner_mark_o;
  }
}

const validatePlayer = (user_id, owner_mark_o, owner_mark_x) => {
  if (user_id === (owner_mark_o || owner_mark_x)) {
    return true;
  }
  return false;
}

const playTurn = (req, res, number) => {
  var currentPlayer, marking, board, nextPlayerUp;
  Board.getCurrentGame(req, res).then(function(currentGame) {
    board = JSON.parse(currentGame.board);
    nextPlayerUp = findNextPlayer(board, currentGame.owner_mark_0, currentGame.owner_mark_x);

    if (req.body.user_id === currentGame.owner_mark_0) {
      currentPlayer = currentGame.owner_mark_0;
      marking = 'O';
    } else {
      currentPlayer = currentGame.owner_mark_x;
      marking = 'X';
    }

    board[number] = marking; // mark the board

    if (Board.checkWin(marking, board)) {
      let winningMessage = currentGame.notes || 'We have a winner!! Congrats <@' + currentPlayer + '>! \n' + Board.printBoard(board);
      let note = "<@" + currentPlayer + "won the game! \n" + Board.printBoard(board);

      Game.update(req, res, board, note);
      res.send(winningMessage);
      return;
    }

    if (Board.checkTie(board)) {
      let tieMessage = currentGame.notes || "We have a tie! <@" + currentGame.owner_mark_x + "> as player X and <@" + currentGame.owner_mark_0 + "as player O. \n" + Board.printBoard(board);
      let note = "It's a tie! <@" + currentGame.owner_mark_x + "> as player X and <@" + currentGame.owner_mark_0 + "as player O. \n" + Board.printBoard(board);

      Game.update(req, res, board, note);
      res.send(tieMessage);
      return;
    }

    if (req.body.user_id !== nextPlayerUp) {
      res.send("Hew now, it's <@" + nextPlayerUp + ">'s turn!");
      return;
    }

    if (Board.validateMove(number, JSON.parse(currentGame.board))) {
      let note = "";
      Game.update(req, res, board, note);
      res.send(Board.printBoard(board)); // print the board with the new marking
    } else {
      res.send("Sorry that's not a valid move. Please try again!");
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};

module.exports = { challengeUser, playTurn };
