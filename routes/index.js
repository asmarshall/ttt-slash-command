const express = require('express');
const router = express.Router();
const Game = require('../models/game.js');
const Player = require('../controllers/player.js');

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

router.post('/', (req,res) => {
  var commandArr = req.body.text.split(" ");
  var command = commandArr[0];

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
          var number = commandArr[1];

          Player.playTurn(req, res, number);
        }
        break;
    default:
      console.log(req.body)
    }
});



module.exports = router;
