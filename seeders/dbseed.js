'use strict';

var moment = require('moment');
var now = moment();
var stopTime = moment(now).add(2,'days');
var interval = moment.duration(1,'hours');
var highNoon = moment(now).hour('12');
var hours = [];
var diffs = [];
var currents = [];
var count = 0;
var diff = 0;
const ninetyDeg = Math.PI/2;
var discharge = .05;                        //constant discharge rate for seed simulation

var bat = {                                 //initialize the battery object
    
    "voltage": 12.7,
    "state": 90,
    "ahtotal": 180,
    "capacity": 200,
    "eInTot": 0,
    "eOutTot": 0
}


class DataRecord {
    
    constructor(count, time, charge, discharge, battery){   //pass in the battery object
    this.count = count;
    this.timeIndex = time;
    this.batI = charge - discharge;
    this.battery = battery;
    }
    
    get batV(){                                             //Battery voltage
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
    highNoon = moment(now).hour('12');
    diff = highNoon.diff(now, 'minutes');
    diffs.push(diff);
    if (diff >= -360 && diff <= 360){
        currents.push(new DataRecord(count, timeStamp(now), Math.cos(diff/360*ninetyDeg), discharge, bat));
    } else {
        currents.push(new DataRecord(count, timeStamp(now), 0, discharge, bat));
    }
    now.add(interval); //iterate the time loop here
}

//console.log(hours);
//console.log(diffs);
console.log(currents);