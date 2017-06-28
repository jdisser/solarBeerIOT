'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('BatRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      batV: {
        type: Sequelize.DECIMAL(8,0)
      },
      batI: {
        type: Sequelize.DECIMAL(8,0)
      },
      batP: {
        type: Sequelize.DECIMAL(8,0)
      },
      batE: {
        type: Sequelize.DECIMAL(8,0)
      },
      batC: {
        type: Sequelize.DECIMAL(8,0)
      },
      batQ: {
        type: Sequelize.DECIMAL(8,0)
      },
      timeIndex: {
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
    return queryInterface.dropTable('BatRecords');
  }
};