const Game = require('../models/game.js');
const Board = require('./board.js');

const challengeUser = (req, res) => {
  let newBoard = Board.newBoard;
  Board.getCurrentGame(req, res).then(function(currentGame) {
    if (!currentGame) {
      Game.create(req, res, newBoard);
    } else {
      let responseJson = {
        "response_type": "in_channel",
        "text": "Sorry, there may only be one game per channel. <@" + currentGame.owner_mark_x + "> and <@" + currentGame.owner_mark_0 + "> are currently playing!"
      }
      res.send(responseJson);
    }
  })
};

const findNext = (board, owner_mark_o, owner_mark_x) => {
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
  var currentPlayer, marking, board, validateCurrentPlayer, nextPlayerUp;
  Board.getCurrentGame(req, res).then(function(currentGame) {
    board = JSON.parse(currentGame.board);
    validateCurrentPlayer = findNext(board, currentGame.owner_mark_0, currentGame.owner_mark_x);

    // verify if the user who made the play is supposed to be next
    if (req.body.user_id !== validateCurrentPlayer) {
      if (currentGame.notes === null) {
        return res.send("Hew now, it's <@" + validateCurrentPlayer + ">'s turn!");
      } else {
        return res.send(currentGame.notes + " \n" + Board.printBoard(board));
      }
    }

    // assign the markings: the challenger is X and other player is O
    if (req.body.user_id === currentGame.owner_mark_0) {
      currentPlayer = currentGame.owner_mark_0;
      nextPlayerUp = currentGame.owner_mark_x;
      marking = 'O';
    } else {
      currentPlayer = currentGame.owner_mark_x;
      nextPlayerUp = currentGame.owner_mark_0;
      marking = 'X';
    }

    if (currentGame.notes === null) {
      board[number] = marking; // mark the board
    }

    // check if this move is a winning play
    if (Board.checkWin(marking, board)) {
      let winningMessage = {
        "response_type": "in_channel",
        "text": "We have a winner!! Congrats <@" + currentPlayer + ">! \n" + Board.printBoard(board)
      }
      let savedNote =  "<@" + currentPlayer + "> won the game!";

      if (currentGame.notes === null) {
        Game.update(req, res, board, savedNote);
        return res.send(winningMessage);
      } else {
        let gameNotes = {
          "response_type": "in_channel",
          "text": currentGame.notes + " \n" + Board.printBoard(board)
        }
        return res.send(gameNotes);
      }
    }

    // check if this move caused a tie
    if (Board.checkTie(board) && (currentGame.notes === null)) {
      let tieMessage = {
        "response_type": "in_channel",
        "text": "It's a tie! <@" + currentGame.owner_mark_x + "> as player X and <@" + currentGame.owner_mark_0 + "> as player O. \n" + Board.printBoard(board)
      }
      let savedNote = "It's a tie! <@" + currentGame.owner_mark_x + "> as player X and <@" + currentGame.owner_mark_0 + "> as player O.";

      if (currentGame.notes === null) {
        Game.update(req, res, board, savedNote);
      }

      res.send(tieMessage);
      return;
    }

    // if the desired move is valid update the board
    if (Board.validateMove(number, JSON.parse(currentGame.board)) && (currentGame.notes === null)) {
      let note = null;
      let nextMarking;

      Game.update(req, res, board, note);

      if (marking === "X") {
        nextMarking = "O";
      } else {
        nextMarking = "X";
      }

      let printBoard = {
        "response_type": "in_channel",
        "text": "<@" + nextPlayerUp + ">: you are up next as player " + nextMarking + "! \n" + Board.printBoard(board),
      }
      res.send(printBoard); // print the board with the new marking
    } else {
      if (currentGame.notes !== null) {
        res.send(currentGame.notes + " \n" + Board.printBoard(board)); // return game notes if it was a tie or win
        return;
      }
      res.send("Sorry that's not a valid move. Please try again!");
    }
  })
  .catch(function (error) {
    console.log(error);
    res.send("Something went wrong... please ensure that there is a game in this channel by typing `/ttt status`.");
  });
};

module.exports = {
  findNext,
  challengeUser,
  playTurn
};
