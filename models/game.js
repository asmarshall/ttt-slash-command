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
       let responseJson = {
         "response_type": "in_channel",
         "text": "Hey <@" + gameDetails.owner_mark_0 + ">! <@" + gameDetails.owner_mark_x + "> challenged you to a game of Tic Tac Toe. You are up first!",
         "attachments":
            [ {"text":"\n```\n" +
                   " " + board[1] + " | " + board[2] + " | " + board[3] + "\n" +
                   " --+---+--\n" +
                   " " + board[4] + " | " + board[5] + " | " + board[6] + "\n" +
                   " --+---+--\n" +
                   " " + board[7] + " | " + board[8] + " | " + board[9] + "\n```"}
            ]
          }

       res.send(responseJson);
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

  /**
   * Update A Game
   * @param {object} req
   * @param {object} res
   * @param {object} updatedBoard
   * @param {string} note
   * @returns {object} updated game
   */
  async update(req, res, updatedBoard, note) {
    await knex('games')
      .where({ channel_id:req.body.channel_id })
      .update({ board:updatedBoard, notes:note })
      .then(function(updatedGame){
        console.log(updatedGame)
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

  /**
   * Get Latest Game For Specific Channel
   * @param {object} req
   * @param {object} res
   * @returns {object} game object
   */
  async getLatest(req, res) {
    await knex('games')
      .where({ channel_id:req.params.channel_id })
      .orderBy('id', 'desc')
      .limit(1)
      .then(function(latestGame){
        return res.status(200).send(latestGame[0]);
      })
      .catch(function(err){
        console.log(err)
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
