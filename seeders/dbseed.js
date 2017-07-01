'use strict';
var moment = require('moment');
var fs = require('fs');




/*
* load.getLoadI returns a current in mA set by iLoadLimit
* with a random component of magnitude iRandom
*
*
****/
function Load(){
    this.iRandom = 200;       //random fluctuation component of load current in mA
    this.iLoadLimit = 2000;   //steady state load current
    
    this.getLoadI = function(){
        return Math.floor(this.iLoadLimit + this.iRandom * Math.random)
    }
}


/* panel.getOutput(now) returns the charging current based on the sun angle
*  assuming that the daylight is 12 hours long for simple seeding
*  set the panel.capacity to the max output of the model panel in mA
***/
function Panel() {
  
    //set capacity to max mA with panel at full sun
    this.capacity = 20000;      //20A at battery volatge
    
    this.getOutput = function(now){
        
        const ninetyDeg = Math.PI/2;
        var highNoon = moment(now).hour('12');
        var diff = highNoon.diff(now, 'minutes');
            
        if (diff >= -360 && diff <= 360){
            return this.capacity * Math.cos(diff/360*ninetyDeg);
        } else {
            return 0;
        }
    }
};

/* Battery charge and discharge functions store energy in the battery
*  and adjust the battery voltage based on the stored charge to simulate
*  charge cycles. The model is a simple approximation for generating some
*  interesting seed data.
*  The model assumes the time period of the charging is 1 hour.
***/
function Battery(){ 
    
    var states = {
        INIT: = 1,
        CHARGE = 2,
        DISCHARGE = 3
    };
    
    
    this.batV = 12700;              //battery voltage in mV
    this.batCapacity = 220000;      //capacity in mAH
    this.batCharge = 176000;        //battery charge initially at 80% for simulation
    this.chargeState = states.INIT;
    

    
    var lastStates = [states.INIT];   //last n states to debounce charge cycles
    
    var chargeCyl = 0;              //# of battery charging cycles could be > solar cycles
    
    var discharges = {              //object to track discharge statistics
      min = 0,
      last = 0,
      sum = 0,
      n = 0,
      avg = 0
    };
    
    var setState = function() {
        // set entry in lastStates[]
        // get array vote
        // if vote != to chargeState then= vote
    };

    this.chargeBatV = function(batI){                       
        if (batI > 0){
            if (this.batV < 13.2){
                this.batV += batI / 1000;
                //call setState
            }
        } else {
            if (this.batV > 10.7){
                this.batV -= batI / 1000;
                //call set state
            }
        }
    }
    
    this.charge = function(iIn){
        if (this.batCharge <= (this.batCapacity - iIn)) {
            this.batCharge += iIn;
            chargeBatV(iIn);
            return this.batCharge;
        }
    }
    
    this.discharge = function(iOut){
        if (this.batCharge > iOut) {
            this.batCharge -= iOut;
            chargeBatV(-iOut);
            return this.batCharge;
        }
    }
    
    this.batState = function(){
        return this.batCharge/this.batCapacity * 100;
    }
    
    this.batPower = function(batI){
        return (batI * this.batV) / 10000000;  
        // mA / 1000 x mV / 1000 /1000 x 100 = .01kWH 
    }
};

/*
* Monitor creates a battery monitor to source simulation data to be persisted
* it creates a battery, panel and load
*
***/

function Monitor(){
    this.battery = new Battery();
    this.panel = new Panel();
    this.load = new Load();
    this.now = moment();
    this.count = 130;               //max number of records
    this.days = 5;                  //days in simulation
    this.minutes = 60;              //min between readings
    this.interval = moment.duration(this.minutes,'minutes');
    this.stopTime = moment(now).add(this.days,'days');
    
    var batteryData = {
      timeIndex: 0,
      batV: 0,
      batI: 0,
      batP: 0,
      batE: 0,
      bQtotal: 0,
      bC: 0
    };
    
    var batteryRecords = [];
    
    var systemData = {
      timeIndex: 0,
      eCharged: 0,
      eDischarged: 0,
      ahCumulative: 0,
      vBatMin: 0,
      vBatMax: 0,
      minDischarge: 0,
      lastDischarge: 0,
      avgDischarge: 0,
      discharges: 0,
      cycles: 0
    };
    
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
        
    };
    
    var genBatData = function(){
        
    };
    
    var genSysData = function(){
        
    };
    
    this.genData = function(){
        //This is the time loop...
        var loops = 0;
        while (this.now.isBefore(stopTime)){
            ++loops;
            if (loops > this.count) {
            break;
            }

            //code for generating data records within the Monitor goes here    

            this.now.add(interval); //iterate the time loop here
        }
        
    };
}





