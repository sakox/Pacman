'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HighscoreSchema = new Schema({
  name: String,
  score: Number,
  date: {type: Date, Default:Date.now}
});

module.exports = mongoose.model('Highscore', HighscoreSchema);