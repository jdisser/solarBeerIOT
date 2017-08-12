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
  res.render('../views/batPlot', {
    parameter: 'batV',
    plotUrl: '/batrecords/batV/json',
    title: 'Battery Voltage'
  });
};

exports.plotVJson = function(req, res, next){
  db.BatRecord.findAll({attributes: ['timeIndex', 'batV']})
    .then(function(batVs){
      res.json(batVs);
    });
};

exports.plotI = function(req, res, next){
  res.send('batrecords controller: batrecords_Iplot');
};

exports.plotIJson = function(req, res, next){
    db.BatRecord.findAll({attributes: ['timeIndex', 'batI']})
    .then(function(batIs){
      res.json(batIs);
    });
};


exports.plotP = function(req, res, next){
  res.send('batrecords controller: batrecords_Pplot');
};

exports.plotPJson = function(req, res, next){
    db.BatRecord.findAll({attributes: ['timeIndex', 'batP']})
    .then(function(batPs){
      res.json(batPs);
    });
};


exports.plotC = function(req, res, next){
  res.send('batrecords controller: batrecords_Cplot');
};

exports.plotCJson = function(req, res, next){
    db.BatRecord.findAll({attributes: ['timeIndex', 'batC']})
    .then(function(batCs){
      res.json(batCs);
    });
};

exports.plotQ = function(req, res, next){
  res.send('batrecords controller: batrecords_Qplot');
};

exports.plotQJson = function(req, res, next){
    db.BatRecord.findAll({attributes: ['timeIndex', 'batQ']})
    .then(function(batQs){
      res.json(batQs);
    });
};