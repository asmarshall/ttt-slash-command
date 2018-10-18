const express = require('express');
const router = express.Router();
const Game = require('../models/game.js');
const Player = require('../controllers/player.js');
const Board = require('../controllers/board.js');
const Signature = require('../utils/verifySignature.js');

const helpJson = {
  "response_type": "in_channel",
  "text": "The following options are available for TTT:",
  "attachments":
    [
      {"text":"`/ttt challenge @their-username` Challenge another user in your channel to a game of TTT."},
      {"text":"`/ttt status` Prints the board from an existing game, and displays who goes next."},
      {"text":"`/ttt end` Ends the current game in the specific channel."},
      {"text":"`/ttt move [number]` Enter the number that you would like to make a play on."}
    ]
  }

router.get('/', (req,res) => {
  res.render('index', {
    message:
    'Tic-Tac-Toe Slack Slash Command'
  });
});

router.get('/api/games/:channel_id', (req,res) => {
  Game.getLatest(req,res)
});

/*
 * Endpoint to receive Slack user commands. Verifies the signing signature
 * and performs the player's desired action.
 * Possible commands include:
 * /ttt help - lists command options for playing ttt
 * /ttt challenge [@username] - creates a new Game and displays board
 * /ttt move [number] - updates the db with the player's desired move and displays board
 */
router.post('/', (req,res) => {
  let commandArr = req.body.text.split(" ");
  let command = commandArr[0];

  // verify the signing secret
  if (Signature.isVerified(req)) {
    switch (command) {
      case "help":
        res.send(helpJson);
        break;
      case "challenge":
        if (!commandArr[1]) {
          res.send("You must include a proper username. The command for challenging is `/ttt challenge [@username]`. Please try again!")
        } else {
          Player.challengeUser(req, res);
        }
        break;
      case "move":
        if (!commandArr[1]) {
          res.send("That was an invalid move. The command for making a move is `/ttt move [number]`. Please try again!")
        } else {
          let number = commandArr[1];

          Player.playTurn(req, res, number);
        }
        break;
      case "end":
        Board.deleteGame(req, res);
        break;
      case "status":
        Board.getGameStatus(req, res);
        break;
      default:
        console.log(req.body)
        res.send("Hello! For a list of valid commands please type `/ttt help`.")
      }
    } else {
      console.log('token not verified');
      res.sendStatus(404);
    }
});



module.exports = router;
