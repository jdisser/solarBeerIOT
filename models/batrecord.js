'use strict';
module.exports = function(sequelize, DataTypes) {
  var BatRecord = sequelize.define('BatRecord', {
    batV: DataTypes.DECIMAL,
    batI: DataTypes.DECIMAL,
    batP: DataTypes.DECIMAL,
    batC: DataTypes.DECIMAL,
    batQ: DataTypes.DECIMAL,
    timeIndex: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return BatRecord;
};