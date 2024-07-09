const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./user');
const Carpark = require('./carpark');

const FavouriteCarpark = sequelize.define('FavouriteCarpark', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
       // references: {
       //     model: User,
        //    key: 'id',
        //},
    },
    car_park_no: {
        type: DataTypes.STRING,
        //references: {
          //  model: Carpark,
           // key: 'car_park_no',
        //},
    },
});

//User.belongsToMany(Carpark, { through: FavouriteCarpark });
//Carpark.belongsToMany(User, { through: FavouriteCarpark });

module.exports = FavouriteCarpark;
