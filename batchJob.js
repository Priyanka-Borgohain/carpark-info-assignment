const fs = require('fs');
const csv = require('csv-parser');
const sequelize = require('./database');
const Carpark = require('./models/carpark');

async function processCarparkFile(filePath) {
    const results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                results.push(data);
            })
            .on('end', async () => {
                try {
                    console.log('Total rows:', results.length); 
                    await Carpark.bulkCreate(results);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            })
            .on('error', reject);
    });
}

module.exports = processCarparkFile;
