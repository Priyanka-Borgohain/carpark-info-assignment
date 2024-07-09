const express = require('express');
const sequelize = require('./database');
const Carpark = require('./models/carpark');
const User = require('./models/user');
const FavouriteCarpark = require('./models/favouriteCarpark');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { Sequelize, Op } = require('sequelize');
const processCarparkFile = require('./batchJob');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Carpark API',
            version: '1.0.0',
            description: 'API for carpark information management',
        },
    },
    apis: ['./app.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/carparks:
 *   get:
 *     description: Get carparks with optional filters
 *     parameters:
 *       - name: freeParking
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: nightParking
 *         in: query
 *         schema:
 *           type: boolean
 *       - name: vehicleHeight
 *         in: query
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of carparks
 */
app.get('/api/carparks', async (req, res) => {
    const { freeParking, nightParking, vehicleHeight } = req.query;
    let where = {};

    if (freeParking) {
        where.free_parking = freeParking === 'true' ? 'YES' : 'NO';
    }
    if (nightParking) {
        where.night_parking = nightParking === 'true' ? 'YES' : 'NO';
    }
    if (vehicleHeight) {
        where.gantry_height = { [Op.gte]: parseFloat(vehicleHeight) };
    }

    try {
        const carparks = await Carpark.findAll({ where });
        res.json(carparks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/users/{userId}/favourites:
 *   post:
 *     description: Add a carpark to user's favourites
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: carParkDetail
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *     responses:
 *       200:
 *         description: Successfully added
 */
app.post('/api/users/:userId/favourites', async (req, res) => {
    const { userId } = req.params;
    const { carParkNo } = req.body;

    try {
        await FavouriteCarpark.create({ user_id: userId, car_park_no: carParkNo });
        res.status(200).send('Favourite added');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

const PORT = process.env.PORT || 3000;

async function initialize() {
    await sequelize.sync({ force: true });
    try {
        await processCarparkFile('hdb-carpark-information-20220824010400.csv');
        console.log('Database initialized and CSV processed');
        
        const carparks = await Carpark.findAll();
        //console.log('Carparks after initialization:', carparks);

    } catch (error) {
        console.error('Error processing CSV:', error);
    }
}

initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Error initializing database', err);
});
