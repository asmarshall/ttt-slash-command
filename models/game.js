const express = require('express')
const router = express.Router()
let knex = require('../db/knex.js');

const Game = {
  /**
   * Create A Game
   * @param {object} req
   * @param {object} res
   * @param {object} newBoard
   * @returns {object} game object
   */
   async create(req, res, newBoard) {
    let command = req.body.text.split(" ");
    let usernameRegex = /(?<=\<@)([A-Z])\w+/g;

    if (command[1].match(usernameRegex) === null) {
      return res.send("Looks like that's not a valid username in this channel. Please try again!")
    }

    let p1Username = req.body.user_id.toString();
    let p2Username = command[1].match(usernameRegex)[0];

    if (p1Username === p2Username) {
      return res.send("Sorry. You may not challenge yourself to a game. Please choose another team member in this channel!")
    }

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
         "text": "Hey <@" + gameDetails.owner_mark_0 + ">! <@" + gameDetails.owner_mark_x + "> challenged you to a game of Tic Tac Toe. You are up first!" +
         "\n```\n" +
                " " + board[1] + " | " + board[2] + " | " + board[3] + "\n" +
                " --+---+--\n" +
                " " + board[4] + " | " + board[5] + " | " + board[6] + "\n" +
                " --+---+--\n" +
                " " + board[7] + " | " + board[8] + " | " + board[9] + "\n```"
          }

       res.send(responseJson);
     })
     .catch(function(err){
       console.log(err.message)
       res.sendStatus(500);
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
        console.log(err.message)
        res.sendStatus(500);
      })
  },

  /**
   * Delete A Game
   * @param {object} req
   * @param {object} res
   * @returns {object} deleted game
   */
  async delete(req, res) {
    await knex('games')
      .where({ channel_id:req.body.channel_id })
      .del()
      .then(function(existingGame){
        if (existingGame) {
          let responseJson = {
            "response_type": "in_channel",
            "text": "Ending the game! To start another, challenge a team member in this channel with `/ttt challenge [@username]`."
          }
          res.send(responseJson);
        } else {
          let responseJson = {
            "response_type": "in_channel",
            "text": "There is no existing game in this channel! To start one, challenge a team member in this channel with `/ttt challenge [@username]`."
          }
          res.send(responseJson);
        }
      })
      .catch(function(err){
        console.log(err.message)
        res.sendStatus(500);
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
        console.log(err.message)
        res.sendStatus(500);
      })
  },

}

module.exports = Game;
