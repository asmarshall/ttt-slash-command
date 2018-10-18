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

    // verify if the user who made the play is supposed to be next
    if (req.body.user_id !== nextPlayerUp) {
      res.send("Hew now, it's <@" + nextPlayerUp + ">'s turn!");
      return;
    }

    // assign the markings: the challenger is X and other player is O
    if (req.body.user_id === currentGame.owner_mark_0) {
      currentPlayer = currentGame.owner_mark_0;
      marking = 'O';
    } else {
      currentPlayer = currentGame.owner_mark_x;
      marking = 'X';
    }

    board[number] = marking; // mark the board

    // check if this move is a winning play
    if (Board.checkWin(marking, board)) {
      let winningMessage = {
        "response_type": "in_channel",
        "text": "We have a winner!! Congrats <@" + currentPlayer + ">!",
        "attachments": [{ "text": Board.printBoard(board) }]
      }
      let savedNote = {
        "response_type": "in_channel",
        "text": "<@" + currentPlayer + "> won the game!",
        "attachments": [{ "text": Board.printBoard(board) }]
      }

      if (currentGame.notes !== null) {
        res.send(JSON.parse(currentGame.notes));
        return;
      }

      Game.update(req, res, board, savedNote);
      res.send(winningMessage);
      return;
    }

    // check if this move caused a tie
    if (Board.checkTie(board)) {
      let tieMessage = {
        "response_type": "in_channel",
        "text": "It's a tie! <@" + currentGame.owner_mark_x + "> as player X and <@" + currentGame.owner_mark_0 + "> as player O.",
        "attachments": [{ "text": Board.printBoard(board) }]
      }

      if (currentGame.notes === null) {
        Game.update(req, res, board, tieMessage);
      }

      res.send(tieMessage);
      return;
    }

    // if the desired move is valid update the board
    if (Board.validateMove(number, JSON.parse(currentGame.board))) {
      let note = null;
      Game.update(req, res, board, note);
      let printBoard = {
        "response_type": "in_channel",
        "text": Board.printBoard(board),
      }
      res.send(printBoard); // print the board with the new marking
    } else {
      if (currentGame.notes !== null) {
        res.send(JSON.parse(currentGame.notes)); // return game notes if it was a tie or win
        return;
      }
      res.send("Sorry that's not a valid move. Please try again!");
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};

module.exports = { challengeUser, playTurn };
