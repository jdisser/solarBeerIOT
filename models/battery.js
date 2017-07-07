'use strict';

var moment = require('moment');

/* Battery charge and discharge functions store energy in the battery
*  and adjust the battery voltage based on the stored charge to simulate
*  charge cycles. The model is a simple approximation for generating some
*  interesting seed data.
*  The battery maintains it's state and statistics
*  for discharge cycles, charge, voltage, and energy.
***/
function Battery(){ 
    
    const states = {                //this code meant to emulate enum but not implemented
        INIT:  0,                   //use to define the meaning of the state numbers
        CHARGE:  1,
        DISCHARGE:  2
    };
    
    var lastStates = [states.INIT, states.INIT, states.INIT];   //last 3 states to debounce charge cycles
    
    this.batV = 12700;              //battery voltage in mV
    this.batCapacity = 220000;      //capacity in mAH
    this.batCharge = 176000;        //battery charge initially at 80% for simulation
    this.chargeState = 0;           //battery is initially not charging or discharging
    this.ahCumulative = 0;          //total charge
    
    this.energy = {
        charge: 0,
        discharge: 0
    };
    
    this.voltage = {
        max: 0,
        min: 15000
    };

    
    this.dischargeStat = {              //object to track discharge statistics
      min: 176000,
      last: 0,
      sum: 0,
      n: 0,                //# of battery charging cycles could be > solar cycles
      avg: 0
    };
    
    
    /*
    * Restore the properties to the listed defaults
    *
    *
    **/
    this.initialize = function(){
      this.batV = 12700;              
      this.batCapacity = 220000;     
      this.batCharge = 176000;        
      this.chargeState = 0; 
      this.ahCumulative = 0;
      
      this.energy = {
        charge: 0,
        discharge: 0
      };
      
      this.voltage = {
        max: 0,
        min: 15000
      };
      
      this.dischargeStat = {              
        min: 176000,
        last: 0,
        sum: 0,
        n: 0,               
        avg: 0
      };
    }
    
    this.setCycles = function(currentState) {
        // set entry in lastStates[]
        lastStates.pop();
        lastStates.unshift(currentState);
//        var debstate = this.chargeState;    //start with the debounce = current state
        
        var votes = [0,0,0];
        var debState;

        for (var i = 0; i<3; i++){          //count the votes in lastStates
          switch (lastStates[i]){
          
            case 0:                         //INIT state
              ++votes[0];
              if (votes[0]>1){
                debState = 0;
              }
            break;
            
            case 1:                         //CHARGE state
              ++votes[1];
              if (votes[1]>1){
                debState = 1;
              }
            break;
            
            case 2:                         //DISCHARGE state
              ++votes[2];
              if (votes[2]>1){
                debState = 2;
              }
            break;
            
            default:
              debState = this.chargeState;  //no change
            break;
            
          }
          console.log('i: ' + i);
          console.log('votes: ' + votes);
          console.log('lastStates: ' + lastStates);
          console.log('debState: ' + debState);
        }
        
        if (debState !== this.chargeState){                 // if debState != to chargeState then a new state is starting
            if (debState === 1) {                           //the discharge or init cycle is ending here
                    
                if (this.chargeState === 2){                    //service the discharge object if discharge ending
                                                                
                    this.dischargeStat.n++;                     //increment the number of discharge cycles
                    this.dischargeStat.sum += this.batCharge;   //add to the sum (BIG NUMBER!!)
                    this.dischargeStat.last = this.batCharge;   //store the last discharge level
                    this.dischargeStat.avg = Math.floor(this.dischargeStat.sum / this.dischargeStat.n);
                    if (this.batCharge < this.dischargeStat.min){
                        this.dischargeStat.min = this.batCharge;
                        
                    }
                    console.log('n: '+ this.dischargeStat.n);
                    console.log('sum: '+ this.dischargeStat.sum);
                    console.log('last: '+ this.dischargeStat.last);
                    console.log('avg: '+ this.dischargeStat.avg);
                    console.log('min: '+ this.dischargeStat.min);
                }
                
                this.chargeState = 1;                       //update the state AFTER triggering the statistics!!!
                
            } else {                                        //the charge cycle is ending here
                this.chargeState = 2;                       //only 2 reachable states after INIT
                
            }
        }
        console.log('Charge State: ' + this.chargeState);
    };

    this.chargeBatV = function(ah){
        
        var currentState;
        var deltaV = Math.floor(ah/this.batCapacity * 2500); //crude approximation!
        var deltaE = Math.floor(this.batV * ah / 10000000); //mv ->V /1000 * maH ->A /1000 -> W -> (kW) /1000 -> (.01kW) * 100
        
        if (ah > 0){
            if (this.batV < 13200){
                this.batV += deltaV;
                currentState = 1;               //states const not in scope here! 1 = CHARGING
                this.energy.charge += deltaE;
            }
        } else {
            if (this.batV > 10700){
                this.batV -= deltaV;
                currentState = 2;                   //2 = DISCHARGING
                this.energy.discharge -= deltaE;    //ah is negative implies deltaE is negative!!!
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
            this.chargeBatV(ah);
            return ah;
        }
    }
    
    this.discharge = function(iOut, duration){
        var ah = ampHours(iOut, duration);
        if (this.batCharge > ah) {
            this.batCharge -= ah;
            this.chargeBatV(-ah);
            return ah;
        }
    }
    
    this.batState = function(){
        return this.batCharge/this.batCapacity * 100;
    }
    

};

module.exports = Battery;


