'use strict';

var Battery = require('../models/battery.js');
var battery = new Battery();

var expect = require('chai').expect;

describe('Battery Model', function(){
  describe('Initialization', function(){
    it('Should initialize the battery voltage to 12700', function(){
      expect(battery.batV).to.equal(12700);
    });
    it('Should intialize the battery capacity to 220000', function(){
      expect(battery.batCapacity).to.equal(220000);
    });
    it('Should intialize the battery charge to 176000', function(){
      expect(battery.batCharge).to.equal(176000);
    });
    it('Should intialize the charge state to 0', function(){
      expect(battery.chargeState).to.equal(0);
    });
    it('Should intialize the energy object to 0 for all properties', function(){
      expect(battery.energy).to.eql({charge: 0, discharge: 0});
    });
    it('Should intialize the voltage object to 0 for all properties', function(){
      expect(battery.voltage).to.eql({max: 0, min: 0});
    });
    it('Should intialize the dischargeStat object to 0 for all properties', function(){
      expect(battery.dischargeStat).to.eql({min: 0,last: 0,sum: 0,n: 0,avg: 0});
    });
  });
  // describe('Output',function(){
  //   it('Should generate an output greater than the Load Limit by a random amount', function(){
  //     expect(load.getLoadI()).to.be.above(load.iLoadLimit);
  //   });
  // });
});

