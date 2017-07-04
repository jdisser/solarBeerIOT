'use strict';

var Load = require('../models/load.js');
var load = new Load();

var expect = require('chai').expect;

describe('Load Model', function(){
  describe('Initialization', function(){
    it('Should initialize the random load to 200', function(){
      expect(load.iRandom).to.equal(200);
    });
    it('Should intialize the Load Limit to 2000', function(){
      expect(load.iLoadLimit).to.equal(2000);
    });
  });
  describe('Output',function(){
    it('Should generate an output greater than the Load Limit by a random amount', function(){
      expect(load.getLoadI()).to.be.above(load.iLoadLimit);
    });
  });
});
