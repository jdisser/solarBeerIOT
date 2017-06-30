'use strict';

var moment = require('moment');
var now = moment();
var stopTime = moment(now).add(2,'days');
var interval = moment.duration(1,'hours');
//var highNoon = moment(now).hour('12');
var hours = [];
var diffs = [];
var currents = [];
var count = 0;
//var diff = 0;
//const ninetyDeg = Math.PI/2;
//var discharge = .05;                        //constant discharge rate for seed simulation



/* panel.getOutput(now) returns the charging current based on the sun angle
*  assuming that the daylight is 12 hours long for simple seeding
*  set the panel.capacity to the max output of the model panel in mA
***/
var panel = function () {
  
    //set capacity to max mA with panel at full sun
    capacity: 0;
    
    getOutput: function(now){
        
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


var bat = function (){ 
    
    batV: 12700;            //battery voltage in mV
    batCapacity: 220000;    //capacity in mAH
    batCharge: 176000;      //battery charge initially at 80% for simulation

    var  chargeBatV = function(batI){                       
        if (batI > 0){
            if (this.batV < 13.2){
                this.batV += batI / 1000;
            }
        } else {
            if (this.batV > 10.7){
                this.batV -= batI / 1000;
            }
        }
    }



    charge: function(iIn){
        if (this.batCharge <= (this.batCapacity - iIn)) {
            this.batCharge += iIn;
            chargeBatV(iIn);
            return this.batCharge;
        }
        
    }
    discharge: function(iOut){
        if (this.batCharge > iOut) {
            this.batCharge -= iOut;
            chargeBatV(-iOut);
            return this.batCharge;
        }
        
    }
    batState: function(){
        
        return this.batCharge/this.batCapacity * 100;
        
    }
    batPower: function(batI){
        
        return batI * this.batV;
        
    }
        
};


class DataRecord {
    
    constructor(count, time, charge, discharge, battery){   //pass in the battery object
    this.count = count;
    this.timeIndex = time;
    this.batI = charge - discharge;
    this.battery = battery;
    }
    
/*    get batV(){                                             //Battery voltage
        if (this.batI > 0){
            if (this.battery.voltage < 13.2){
                this.battery.voltage += this.batI *.01;
                return this.battery.voltage;
            }
        } else {
            if (this.battery.voltage > 10.7){
                this.battery.voltage -= this.batI *.01;
                return this.battery.voltage;
            }
        }
    }
*/
    get batP(){return;}         //Power Delivered into the battery
    get batEng(){return;}       //Milliamp hours delivered in the time period
    get batSoc(){return;}       //Percentage charged
    get batAhTot(){return;}     //Total amphours stored in a day
    get batEoutTot(){return;}   //Total KWh discharged in a day
    get batEinTot(){return;}    //Total KWh charged in a day
    
    get batRecord(){return;}    //returns the object for the record seed
}

var timeStamp = function (moment){
    var tString = moment.format('X');
    var tStamp = parseInt(tString);
    return tStamp;
}

//This is the time loop...

while (now.isBefore(stopTime)){
    ++count;
    if (count > 60) {
        break;
    }
    
    hours.push(now.hour());
    //highNoon = moment(now).hour('12');
    //diff = highNoon.diff(now, 'minutes');
    diffs.push(diff);
    /*if (diff >= -360 && diff <= 360){
        currents.push(new DataRecord(count, timeStamp(now), Math.cos(diff/360*ninetyDeg), discharge, bat));
    } else {
        currents.push(new DataRecord(count, timeStamp(now), 0, discharge, bat));
    }
    */
    now.add(interval); //iterate the time loop here
}

//console.log(hours);
//console.log(diffs);
console.log(currents);