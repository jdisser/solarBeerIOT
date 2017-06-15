'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.createTable(
      'batRecords',
      {
        timeIndex: {
          type: Sequelize.DATE,
          primaryKey: true,
          unique: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type Sequelize.DATE
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
        batEng: {
          type: Sequelize.DECIMAL(8,0)
        },
        batSoc: {
          type: Sequelize.DECIMAL(4,0)
        },
        batAhTot: {
          type: Sequelize.DECIMAL(10,0)
        },
        batEoutTot: {
          type: Sequelize.DECIMAL(8,0)
        },
        batEinTot: {
          type: Sequelize.DECIMAL(8,0)
        }
      }  
    ).then(() => queryInterface.addIndex('battery', ['timeIndex']));
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('battery');
  }
};
