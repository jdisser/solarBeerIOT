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
    
    function BatteryData() {
      this.timeIndex = 0;
      this.batV = 0;
      this.batI = 0;
      this.batP = 0;
      this.batE = 0;
      this.bQtotal = 0;
      this.bC = 0;
    };
    
    var batteryRecords = [];
    
    function SystemData() {
      this.timeIndex = 0;
      this.eCharged = 0;
      this.eDischarged = 0;
      this.ahCumulative = 0;
      this.vBatMin = 0;
      this.vBatMax = 0;
      this.minDischarge = 0;
      this.lastDischarge = 0;
      this.avgDischarge = 0;
      this.discharges = 0;
      this.cycles = 0;
    }
    
    var sysRecords = [];

 
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