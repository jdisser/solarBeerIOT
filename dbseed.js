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

function dataRecord(count, time, charge){
    this.count = count;
    this.time = time;
    this.charge = charge;
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
        currents.push(new dataRecord(count, now.format('X'), Math.cos(diff/360*ninetyDeg)));
    } else {
        currents.push(new dataRecord(count, now.format('X'), 0));
    }
    now.add(interval); //iterate the time loop here
}

console.log(hours);
console.log(diffs);
console.log(currents);