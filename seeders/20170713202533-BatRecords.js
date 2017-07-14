'use strict';

module.exports = {
  var Monitor = require('../models/monitor.js');
  this.monitor = new Monitor();
  up: function (queryInterface, Sequelize) {

    this.monitor.genData(48);
    var batRecords = this.monitor.batteryRecords;
    return queryInterface.bulkInsert('BatRecords', batRecords, {});
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.bulkDelete('BatRecords', null, {});
  }
};
