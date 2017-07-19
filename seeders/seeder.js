'use strict';

let seed;

if(process.env.NODE_ENV !== 'production') {
//  require('dotenv-safe').config() // environment variables, used for hiding secrets
  console.log('Not in production mode');
  seed = require('./seedquelize.js');
}

//const express = require('express')
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

// Connect to a sql database
const sequelize = new Sequelize('solarbeer.db', '', '', { 
  dialect: 'sqlite',
  storage: '../database/solarbeer.db'
});



//import the models instead of defining them in this file
sequelize.import('../models/batrecord.js');
sequelize.import('../models/sysrecord.js');

var Monitor = require('./monitor.js');
var monitor = new Monitor();

// This line saves your job by not deleting production data
if(process.env.NODE_ENV !== 'production') {
  
  //generate the data in the Monitor
  monitor.initMonitor();
  monitor.genData(36);
  // Clear out the existing database

  sequelize.sync({force: true}).then(() => {    //drops and recreates model tables ONLY!
    
    const batrecs = {};
    batrecs.data = monitor.batteryRecords;
    batrecs.model = sequelize.models.BatRecord;
    
    const sysrecs = {};
    sysrecs.data = monitor.sysRecords;
    sysrecs.model = sequelize.models.SysRecord;



    // Actually seed the database using seedquelize
    seed([
      batrecs,
      sysrecs
    ]).then(() =>{
      // Only started after seeding in dev/test
//      startExpress();
    })
  })
} 

// else {
//   // Started right away in prod
//   startExpress();
// }


