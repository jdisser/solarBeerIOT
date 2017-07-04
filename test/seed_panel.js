'use strict';

var moment = require('moment');
var now;
var Panel = require('../models/panel.js');
var panel = new Panel();



var expect = require('chai').expect;

describe('Panel Model', function(){
  describe('Initialization', function(){
    it('Should initialize the capacity to 20000', function(){
      expect(panel.capacity).to.equal(20000);
    });
  });
  describe('Output',function(){
    
    before(function(){
      now = moment();
    });
    
    it('Should output the full capacity at noon', function(){
      expect(panel.getOutput(now.hour('12'))).to.be.equal(panel.capacity);
    });
    
    it('Output should be < the full capacity during daylight', function(){
      expect(panel.getOutput(now.hour('14'))).to.be.below(panel.capacity);
    });
    
    it('Output should be > zero during daylight', function(){
      expect(panel.getOutput(now.hour('14'))).to.be.above(0);
    });
    
    it('Output should be zero at night', function(){
      expect(panel.getOutput(now.hour('19'))).to.be.below(panel.capacity);
    });
    
  });
});
