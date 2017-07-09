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
  });
  // describe('Output',function(){
    
  //   before(function(){
  //     now = moment();
  //   });
  // });
});
