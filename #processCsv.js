const sequelize = require('./database');
const processCarparkFile = require('./batchJob');

async function initialize() {
    await sequelize.sync({ force: true });
    await processCarparkFile('./hdb-carpark-information-20220824010400.csv');
}

initialize().then(() => {
    console.log('Database initialized and CSV processed');
}).catch((err) => {
    console.error('Error initializing database', err);
});
