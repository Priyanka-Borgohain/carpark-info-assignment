const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Carpark = sequelize.define('Carpark', {
    car_park_no: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    address: DataTypes.STRING,
    x_coord: DataTypes.FLOAT,
    y_coord: DataTypes.FLOAT,
    car_park_type: DataTypes.STRING,
    type_of_parking_system: DataTypes.STRING,
    short_term_parking: DataTypes.STRING,
    free_parking: DataTypes.STRING,
    night_parking: DataTypes.STRING,
    car_park_decks: DataTypes.INTEGER,
    gantry_height: DataTypes.FLOAT,
    car_park_basement: DataTypes.BOOLEAN,
});

module.exports = Carpark;
