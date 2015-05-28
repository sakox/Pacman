/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Score = require('../api/highscore/highscore.model');


Score.find({}).remove(function() {
  Score.create({
    name : 'Sako Kalid',
    score : '1337'
  }, {
    name : 'Dilan Rashid',
    score : '13'
  }, {
    name : 'Sako',
    score : '99'
  });
});