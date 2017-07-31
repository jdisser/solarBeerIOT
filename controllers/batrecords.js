var db = require('../models/index.js');
var moment = require('moment');

exports.table = function(req, res, next){
  db.BatRecord.findAll()
  .then(function(batRecords){
//    console.log(batRecords);
    res.render('../views/batTable', {
      batRecords: batRecords,            //array of model instances can be converted to plain objects with #get
      title: 'SolarBeer Battery Data',
      moment: moment
    });
  });
};

exports.plotV = function(req, res, next){
  res.send('batrecords controller: batrecords_Vplot');
};

exports.plotVJson = function(req, res, next){
  res.json({ a: 'a V object'});
};

exports.plotI = function(req, res, next){
  res.send('batrecords controller: batrecords_Iplot');
};

exports.plotIJson = function(req, res, next){
  res.json({ a: 'a I object'});
};


exports.plotP = function(req, res, next){
  res.send('batrecords controller: batrecords_Pplot');
};

exports.plotPJson = function(req, res, next){
  res.json({ a: 'a P object'});
};


exports.plotC = function(req, res, next){
  res.send('batrecords controller: batrecords_Cplot');
};

exports.plotCJson = function(req, res, next){
  res.json({ a: 'a C object'});
};

exports.plotQ = function(req, res, next){
  res.send('batrecords controller: batrecords_Qplot');
};

exports.plotQJson = function(req, res, next){
  res.json({ a: 'a Q object'});
};