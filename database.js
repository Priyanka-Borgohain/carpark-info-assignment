const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:', {
    logging: true,
});

module.exports = sequelize;
