const express = require('express')
const router = express.Router()
var knex = require('../db/knex.js');

const Game = {
  /**
   * Create A Game
   * @param {object} req
   * @param {object} res
   * @param {object} newBoard
   * @returns {object} game object
   */
   async create(req, res, newBoard) {
    var command = req.body.text.split(" ");
    var usernameRegex = /(?<=\<@)([A-Z])\w+/g;
    var p2Username = command[1].match(usernameRegex)[0];
    var p1Username = req.body.user_id.toString();

    await knex('games').insert({
      channel_id:req.body.channel_id,
      owner_mark_0:p2Username,
      owner_mark_x:p1Username,
      board:newBoard
    }, '*')
     .then(function(newGame){
       let gameDetails = newGame[0];
       let board = JSON.parse(gameDetails.board);

       res.send('Hey <@' + gameDetails.owner_mark_0 + '>! <@' + gameDetails.owner_mark_x + '> challenged you to a game of Tic Tac Toe. You are up first!' +
       '\n```\n' +
             ' ' + board[1] + ' | ' + board[2] + ' | ' + board[3] + '\n' +
             ' --+---+--\n' +
             ' ' + board[4] + ' | ' + board[5] + ' | ' + board[6] + '\n' +
             ' --+---+--\n' +
             ' ' + board[7] + ' | ' + board[8] + ' | ' + board[9] + '\n```'
        );
     })
     .catch(function(err){
       res.status(500).json({
       error:true,
       data:{
         message:err.message
       }
      })
    })
  },

}

module.exports = Game;
