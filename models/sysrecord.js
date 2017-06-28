'use strict';
module.exports = function(sequelize, DataTypes) {
  var SysRecord = sequelize.define('SysRecord', {
    timeIndex: DataTypes.DECIMAL,
    totalEin: DataTypes.DECIMAL,
    totalEout: DataTypes.DECIMAL,
    totalPin: DataTypes.DECIMAL,
    totalPout: DataTypes.DECIMAL,
    batVmin: DataTypes.DECIMAL,
    batVmax: DataTypes.DECIMAL,
    batTfull: DataTypes.DECIMAL,
    minDischarge: DataTypes.DECIMAL,
    avgDischarge: DataTypes.DECIMAL,
    lastDischarge: DataTypes.DECIMAL,
    discharges: DataTypes.DECIMAL,
    cycles: DataTypes.DECIMAL
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return SysRecord;
};