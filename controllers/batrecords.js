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
    title: 'Battery Voltage',
    scale: .001
  });
};

exports.plotVJson = function(req, res, next){
  db.BatRecord.findAll({attributes: ['timeIndex', 'batV']})
    .then(function(batVs){
      res.json(batVs);
    });
};

exports.plotI = function(req, res, next){
    res.render('../views/batPlot', {
    parameter: 'batI',
    plotUrl: '/batrecords/batI/json',
    title: 'Battery Current',
    scale: .001
  });
};

exports.plotIJson = function(req, res, next){
    db.BatRecord.findAll({attributes: ['timeIndex', 'batI']})
    .then(function(batIs){
      res.json(batIs);
    });
};


exports.plotP = function(req, res, next){
    res.render('../views/batPlot', {
    parameter: 'batP',
    plotUrl: '/batrecords/batP/json',
    title: 'Battery Power',
    scale: .01
  });
};

exports.plotPJson = function(req, res, next){
    db.BatRecord.findAll({attributes: ['timeIndex', 'batP']})
    .then(function(batPs){
      res.json(batPs);
    });
};


exports.plotC = function(req, res, next){
    res.render('../views/batPlot', {
    parameter: 'batC',
    plotUrl: '/batrecords/batC/json',
    title: 'Battery Capacity',
    scale: 1
  });
};

exports.plotCJson = function(req, res, next){
    db.BatRecord.findAll({attributes: ['timeIndex', 'batC']})
    .then(function(batCs){
      res.json(batCs);
      console.log(batCs);
    });
};

exports.plotQ = function(req, res, next){
    res.render('../views/batPlot', {
    parameter: 'batQ',
    plotUrl: '/batrecords/batQ/json',
    title: 'Battery Charge',
    scale: .001
  });
};

exports.plotQJson = function(req, res, next){
    db.BatRecord.findAll({attributes: ['timeIndex', 'batQ']})
    .then(function(batQs){
      res.json(batQs);
    });
};