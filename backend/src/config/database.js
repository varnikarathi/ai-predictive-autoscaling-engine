const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Will save to backend/database.sqlite
    logging: false
});

module.exports = sequelize;
