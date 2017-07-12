'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('SysRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      timeIndex: {
        type: Sequelize.DECIMAL(8,0)
      },
      totalEin: {
        type: Sequelize.DECIMAL(10,0)
      },
      totalEout: {
        type: Sequelize.DECIMAL(10,0)
      },
      ahCumulative: {
        type: Sequelize.DECIMAL(10,0)
      },
      ahConsumed: {
        type: Sequelize.DECIMAL(10,0)
      },
      batVmin: {
        type: Sequelize.DECIMAL(8,0)
      },
      batVmax: {
        type: Sequelize.DECIMAL(8,0)
      },
      minDischarge: {
        type: Sequelize.DECIMAL(8,0)
      },
      lastDischarge: {
        type: Sequelize.DECIMAL(8,0)
      },
      avgDischarge: {
        type: Sequelize.DECIMAL(8,0)
      },
      discharges: {
        type: Sequelize.DECIMAL(8,0)
      },
      cycles: {
        type: Sequelize.DECIMAL(8,0)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('SysRecords');
  }
};