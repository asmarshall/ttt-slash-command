const axios = require('axios');

const newBoard = {
  1: ' ',
  2: ' ',
  3: ' ',
  4: ' ',
  5: ' ',
  6: ' ',
  7: ' ',
  8: ' ',
  9: ' '
};

const getCurrentGame = (req, res) => {
  let urlApi;
  let env = process.env.NODE_ENV || 'development';

  if (env === 'development') {
    urlApi = 'http://localhost:8000';
  } else {
    urlApi = process.env.PROD_URL;
  }

  return new Promise((resolve, reject) => {
    console.log(urlApi)
    axios({
      method:'get',
      url: urlApi + '/api/games/' + req.body.channel_id ,
      responseType:'json'
    })
    .then(function(response) {
      resolve(response.data);
    })
    .catch(function (error) {
      console.log(error);
      reject(error);
    });
  });
}

const printBoard = (board) => {
    return('\n```\n' +
        ' ' + board[1] + ' | ' + board[2] + ' | ' + board[3] + '\n' +
        ' --+---+--\n' +
        ' ' + board[4] + ' | ' + board[5] + ' | ' + board[6] + '\n' +
        ' --+---+--\n' +
        ' ' + board[7] + ' | ' + board[8] + ' | ' + board[9] + '\n```');
}

const validPlays = ['1','2','3','4','5','6','7','8','9'];

const isValidInt = (position) => {
  return validPlays.includes(position);
}

const validateMove = (position, board) => {
  return(isValidInt(position) && board[position] === ' ');
}

const winningCombs = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
];

const checkWin = (mark, board) => {
  var i, j, markCount;

    for (i = 0; i < winningCombs.length; i++) {
      markCount = 0;
      for (j = 0; j < winningCombs[i].length; j++) {
        if (board[winningCombs[i][j]] === mark) {
          markCount++;
        }
        if (markCount === 3) {
          console.log("a winner")
          return true;
        }
      }
    }
    console.log("no winner")
    return false;
}

const checkTie = (board) => {
  for (var i = 1; i <= Object.keys(board).length; i++) {
    if (board[i] === ' ') {
      return false;
    }
  }
  return true;
}

module.exports = {
  newBoard,
  getCurrentGame,
  checkWin,
  checkTie,
  validateMove,
  printBoard
};
