'use strict';


var moment = require('moment');
var now = moment();

/* 
*  Model Constructor: Panel
*
*  useage: panel = new Panel();
*
*  panel.getOutput(now), where now is a moment,
*  returns the charging current based on the sun angle
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
        console.log('diff: ' + diff);
            
        if (diff >= -360 && diff <= 360){
            return this.capacity * Math.cos(diff/360*ninetyDeg);
        } else {
            return 0;
        }
    }
};

module.exports = Panel;