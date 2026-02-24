const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScalingEvent = sequelize.define('ScalingEvent', {
    action: {
        type: DataTypes.STRING,
        allowNull: false
    },
    instances: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cpu: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    confidence: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    ts: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = ScalingEvent;
