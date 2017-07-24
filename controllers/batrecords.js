var db = require('../models/index.js');

exports.table = function(req, res, next){
  res.send('batrecords controller: batrecords_table');
};

exports.plotV = function(req, res, next){
  res.send('batrecords controller: batrecords_Vplot');
};

exports.plotI = function(req, res, next){
  res.send('batrecords controller: batrecords_Iplot');
};

exports.plotP = function(req, res, next){
  res.send('batrecords controller: batrecords_Pplot');
};

exports.plotC = function(req, res, next){
  res.send('batrecords controller: batrecords_Cplot');
};

exports.plotQ = function(req, res, next){
  res.send('batrecords controller: batrecords_Qplot');
};