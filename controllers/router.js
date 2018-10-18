var express = require('express');
var router = express.Router();

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

router.post('/', (req,res) => {
  var commandArr = req.body.text.split(" ");
  var command = commandArr[0];

  switch (command) {
    case "help":
      res.send(helpJson);
      break;
    default:
      console.log(req.body)
    }
});



module.exports = router;