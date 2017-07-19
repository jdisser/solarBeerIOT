var db = require('../models/index.js');

exports.table = function(req, res, next){
  res.send('batrecords controller: batrecords_table');
};

exports.plot = function(req, res, next){
  res.send('batrecords controller: batrecords_plot');
};