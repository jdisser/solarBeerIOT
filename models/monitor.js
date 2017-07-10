'use strict';

var moment = require('moment');
var Battery = require('./battery.js');
var Panel = require('./panel.js');
var Load = require('./load.js');

/*
* Monitor creates a battery monitor to source simulation data to be persisted
* it creates a battery, panel and load
*
***/

function Monitor(){
  
    var now = moment();
  
    this.battery = new Battery();
    this.panel = new Panel();
    this.load = new Load();
    this.now = moment();            //the time the monitor was created also the simulation start
    this.count = 130;               //max number of records, this is set according to n
//    this.days = 5;                  //days in simulation
    this.minutes = 60;              //min between readings
    this.interval = moment.duration(this.minutes,'minutes'); //a duration equal to minutes
    this.simDuration;               //a duration equal to the length of the simulation
    this.stopTime;                  //a moment equal to the time the simulation ends
    this.totalEoutLast = 0;         //total at the last solar cycle
    
    function BatteryData() {          //Battery Properties
      this.timeIndex = 0;             //= timestamp
      this.batV = 0;                  //batV
      this.batI = 0;                  //batI
      this.batP = 0;                  //batP
      this.batQ = 0;                  //batCharge
      this.batC = 0;                  //percentCharge
    };
    
    var batteryRecords = [];          //array of objects to create db records
    
    function SystemData() {           //these statistics are recorded once per solar cycle
      this.timeIndex = 0;             //= timestamp
      this.totalEin = 0;              //energy.charge
      this.totalEout = 0;             //energy.discharge
      this.ahCumulative = 0;          //ahCumulative
      this.ahConsumed = 0;            // = totalEout - totalEoutLast
      this.batVmin = 0;               //voltage.max
      this.batVmax = 0;               //voltage.min
      this.minDischarge = 0;          //dischargeStat.min
      this.lastDischarge = 0;         //dischargeStat.last
      this.avgDischarge = 0;          //dischargeStat.avg
      this.discharges = 0;            //dischargeStat.n
      this.cycles = 0;                //= the number of solar days
    }
    
    var sysRecords = [];              //array of objects to create db records

 
    var timeStamp = function (moment){
        var tString = moment.format('X');
        var tStamp = parseInt(tString);
        return tStamp;
    }
    
    // get configuration from monitor.cfg
    var readConfig = function(){
        
    };
    
    /* set the configurable properties in the pamel, battery, and load if called
    *  using the data from the config file
    **/
    this.initMonitor = function(){
      console.log('Initializing monitor code is running');  
    };
    
    
/*    
* genData creates n battery data records and a system record
* for each time the simulation passes midnight plus an initial
* record with the status of the system data after the first
* simulation call to the battery object.
* The records are stored in two arrays as objects and each array
* is returned. (is this the best way to return multiple objects?)
*
***/
      this.genData = function(n){
      //This is the time loop...
      var loops = 0;
      while (this.now.isBefore(this.stopTime)){
          ++loops;
          if (loops > this.count) {
          break;
          }
    
          //code for generating data records within the Monitor goes here    
    
          this.now.add(this.interval); //iterate the time loop here
      }
      
    };
}

module.exports = Monitor;