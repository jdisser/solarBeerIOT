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
  
    this.now = moment();
  
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
      this.id = 0;                    //db index needed for DB bulkInsert
      this.timeIndex = 0;             //= timestamp
      this.batV = 0;                  //batV
      this.batI = 0;                  //batI
      this.batP = 0;                  //batP
      this.batQ = 0;                  //batCharge
      this.batC = 0;                  //percentCharge
      this.createdAt;                 //for bulkInsert
      this.updatedAt;                 //for bulkInsert
    };
    
    this.batteryRecords = [];          //array of objects to create db records
    
    function SystemData() {           //these statistics are recorded once per solar cycle
      this.id = 0;  
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
      this.createdAt;
      this.updatedAt;
    }
    
    this.sysRecords = [];              //array of objects to create db records

 
    this.timeStamp = function (moment){
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
      console.log('Initializing monitor model');  
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
        
      this.now = moment().utcOffset(-4);            //this is only true during DST use moment-timezone for full TZ function
 
 
      this.stopTime = moment(this.now);
 
      var cycle = moment(this.now).endOf('day');    //used to trigger cycle data using #isAfter

      this.count = 0;
      
      for (var i = 1; i <= n ; ++i){
        this.stopTime.add(this.interval);
        ++this.count;                               //count is redundant and used for debug & error
      }
      

      
      //This is the time based loop...
      //the loops iterates thru moments that simulate the passage of time
      //the time of day is used to model the angle of the sun on the panels
      //but moments are used for other time related functions such as daily cycles
      //and durations are used for lengths of time such as charging periods
      
      //initialize the loop
      var cycles = 0;                               //this is used as the index into the systemData array
      var current = 0;

      var loops = 0;
      var totalEoutLast = 0;
      var timeNow = 0;
      while (this.now.isBefore(this.stopTime)){


          //first determine the charge/load current
          current = this.panel.getOutput(this.now);

          current -= this.load.getLoadI();

          //then charge or discharge the battery
          if (current >= 0){
            this.battery.charge(current, this.interval);

          } else {
            this.battery.discharge(Math.abs(current), this.interval);   //pass the discharge current as a positive value

          }

          timeNow = this.timeStamp(this.now);                           //number of milliseconds eq Unix format same as Data.now()

          //check to see if it's past midnight and if so generate the daily statistics
          if (this.now.isAfter(cycle)){
            
            //generate a new sysRecord for the daily statistics
            
            this.sysRecords.push({   //cycles are /day != loops /interval!!!

              //populate the SystemData object here
//              id: cycles,                                            //db index key
              timeIndex: timeNow,                                    //= timestamp
              totalEin: this.battery.energy.charge,                  //energy.charge
              totalEout: this.battery.energy.discharge,              //energy.discharge
              ahCumulative: this.battery.ahCumulative,               //ahCumulative
              ahConsumed: this.battery.energy.discharge - totalEoutLast,            // = totalEout - totalEoutLast
              batVmin: this.battery.voltage.min,                     //voltage.max
              batVmax: this.battery.voltage.max,                     //voltage.min
              minDischarge: this.battery.dischargeStat.min,          //dischargeStat.min
              lastDischarge: this.battery.dischargeStat.last,        //dischargeStat.last
              avgDischarge: this.battery.dischargeStat.avg,          //dischargeStat.avg
              discharges: this.battery.dischargeStat.n,              //dischargeStat.n
              cycles: cycles,                                        //= the number of solar days (passes thru this procedure)
              // createdAt: timeNow,                                    //db req field
              // updatedAt: timeNow                                     //db req field
            });

           

            totalEoutLast = this.sysRecords[cycles].totalEout;  //store the last energy total
            ++cycles;                                           //increment the array index                                   
            cycle = moment(this.now).endOf('day');              //reset the next trigger
            
            
          }

          //generate the battery data object and add it to the array
          this.batteryRecords.push({
                                                        //Battery Properties
            // id: loops,
            timeIndex: this.timeStamp(this.now),        //= timestamp
            batV: this.battery.batV,                    //batV
            batI: this.battery.batI,                    //batI
            batP: this.battery.batP,                    //batP
            batQ: this.battery.batCharge,               //batCharge
            batC: this.battery.percentCharge,           //percentCharge
            // createdAt: timeNow,
            // updatedAt: timeNow
          });

    
    
          this.now.add(this.interval);    //iterate the time loop here
          
          ++loops;                        //loops is the index into the battery array
          
          if (loops > this.count) {       //this should not execute!
          break;
          }
      }
    console.log(this.batteryRecords);
    console.log(this.sysRecords);
    return loops;                         //for test should equal n
    };
}

module.exports = Monitor;