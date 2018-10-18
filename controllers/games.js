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
     .then(function(all){
       res.json({
         error:false,
         data: all
       })
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
