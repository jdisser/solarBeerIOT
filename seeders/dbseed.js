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
*  The battery maintains it's state and statistics
*  for discharge cycles, charge, voltage, and energy.
***/
function Battery(){ 
    
    const states = {
        INIT:  1,
        CHARGE:  2,
        DISCHARGE:  3
    };
    
    var lastStates = [states.INIT, states.INIT, states.INIT];   //last 3 states to debounce charge cycles
    
    this.batV = 12700;              //battery voltage in mV
    this.batCapacity = 220000;      //capacity in mAH
    this.batCharge = 176000;        //battery charge initially at 80% for simulation
    this.chargeState = states.INIT; //battery is initially not charging or discharging
    this.ahCumulative = 0;          //total charge
    
    this.energy = {
        charge: 0,
        discharge: 0
    };
    
    this.voltage = {
        max: 0,
        min: 0
    };

    
    this.dischargeStat = {              //object to track discharge statistics
      min: 0,
      last: 0,
      sum: 0,
      n: 0,                //# of battery charging cycles could be > solar cycles
      avg: 0
    };
    
    var setCycles = function(currentState) {
        // set entry in lastStates[]
        lastStates.pop();
        lastStates.unshift(currentState);
        // get array vote, 2 (or 3) out of 3 is state
        // votes is an array of votes with index state i.e. votes[states.CHARGE] = charge votes
        var votes = lastStates.reduce(function(counts, state){
            if (counts[state]) {
                counts[state]++;
            } else {
                counts[state] = 1;
            }
        },[]);
        
        // debState is the state that has occured 2 or more times in the past 3 cycles
        // or is -1 if not (three differernt states)
        var debState = votes.findIndex(function(e,i,a){
            if (e>1) {
                return true;
            }
        });
        
        
        if ((debState !== this.chargeState)&&(debState !== -1)){    // if debState != to chargeState then a new state is starting
            if (debState === states.CHARGE) {                       //the discharge cycle is ending here
                this.chargeState = states.CHARGE;
                                                            //service the discharge object
                this.dischargeStat.n++;                     //increment the number of discharge cycles
                this.dischargeStat.sum += this.batCharge;   //add to the sum (BIG NUMBER!!)
                this.dischargeStat.last = this.batCharge;
                this.dischargeStat.avg = Math.floor(this.dischargeStat.sum / this.dischargeStat.n);
                if (this.batCharge < this.dischargeStat.min){
                    this.dischargeStat.min = this.batCharge;
                }
                
            } else {                                        //the charge cycle is ending here
                this.chargeState = states.DISCHARGE;        //only 2 reachable states after INIT
                
            }
        }
        
    };

    this.chargeBatV = function(ah){
        
        var currentState;
        var deltaV = Math.floor(ah/this.batCapacity * 2.5); //crude approximation!
        var deltaE = Math.floor(this.batV * ah / 10000000); //mv ->V /1000 * maH ->A /1000 -> W -> (kW) /1000 -> (.01kW) * 100
        
        if (ah > 0){
            if (this.batV < 13.2){
                this.batV += deltaV;
                currentState = states.CHARGING;
                this.energy.charge += deltaE;
            }
        } else {
            if (this.batV > 10.7){
                this.batV -= deltaV;
                currentState = states.DISCHARGING;
                this.energy.discharge -= deltaE;
            }
        }
        if (this.batV < this.voltage.min){
            this.voltage.min = this.batV;
        }
        if (this.batV > this.voltage.max){
            this.voltage.max = this.batV;
        }
        this.setCycles(currentState);
    }
    
    var ampHours = function(current, interval){
        var hours = interval.asHours();
        return Math.floor(current * hours); //returns mAH
    }
    
    
    this.charge = function(iIn, duration){
        var ah = ampHours(iIn, duration);
        if (this.batCharge <= (this.batCapacity - ah)) {
            this.batCharge += ah;
            chargeBatV(ah);
            //return this.batCharge;
        }
    }
    
    this.discharge = function(iOut, duration){
        var ah = ampHours(iIn, duration);
        if (this.batCharge > ah) {
            this.batCharge -= ah;
            chargeBatV(-ah);
            //return this.batCharge;
        }
    }
    
    this.batState = function(){
        return this.batCharge/this.batCapacity * 100;
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





