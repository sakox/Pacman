'use strict';

var _ = require('lodash');
var Highscore = require('./highscore.model');

// Get list of highscores
exports.index = function(req, res) {
  Highscore.find(function (err, highscores) {
    if(err) { return handleError(res, err); }
    return res.json(200, highscores);
  });
};

// Get a single highscore
exports.show = function(req, res) {
  Highscore.findById(req.params.id, function (err, highscore) {
    if(err) { return handleError(res, err); }
    if(!highscore) { return res.send(404); }
    return res.json(highscore);
  });
};

// Creates a new highscore in the DB.
exports.create = function(req, res) {
  Highscore.create(req.body, function(err, highscore) {
    if(err) { return handleError(res, err); }
    return res.json(201, highscore);
  });
};

// Updates an existing highscore in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Highscore.findById(req.params.id, function (err, highscore) {
    if (err) { return handleError(res, err); }
    if(!highscore) { return res.send(404); }
    var updated = _.merge(highscore, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, highscore);
    });
  });
};

// Deletes a highscore from the DB.
exports.destroy = function(req, res) {
  Highscore.findById(req.params.id, function (err, highscore) {
    if(err) { return handleError(res, err); }
    if(!highscore) { return res.send(404); }
    highscore.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}