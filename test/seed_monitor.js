'use strict';


var Monitor = require('../models/monitor.js');
var monitor = new Monitor();



var expect = require('chai').expect;

describe('Monitor Model', function(){
  describe('Initialization', function(){
    before(function(){
      monitor.initMonitor();
    });
    
    it('Should initialize the load', function(){
      expect(monitor.load.iRandom).to.equal(200);
    });
    
    it('Should initialize the battery', function(){
      expect(monitor.battery.batV).to.equal(12700);
    });
    
    it('Should initialize the panel', function(){
      expect(monitor.panel.capacity).to.equal(20000);
    });
  });
  describe('Data record generation',function(){
    
    before(function(){
      monitor.initMonitor();
      monitor.genData(36);
    });
    
    it('Should Generate 36 batteryRecords', function(){
      expect(monitor.batteryRecords.length).to.equal(36);
    });
    
    it('Should Generate 2 sysRecords', function(){
      expect(monitor.sysRecords.length).to.equal(2);
    });
  });
});
