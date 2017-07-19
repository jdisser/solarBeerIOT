var db = require('../models/index.js');

exports.table = function(req, res, next){
  res.send('sysrecords controller: table');
};

exports.range_table = function(req, res, next){
  res.send('sysrecords controller: range_table');
};