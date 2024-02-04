const fs = require('fs');
const csv = require('csv-parser');
const pgp = require('pg-promise')();

const filePath = 'episodes.csv';
const tableName = 'episodes';

const connection = {
    host: 'localhost',
    port: 5432,
    database: 'NBP Lab1',
    user: 'postgres',
    password: ''
};

const db = pgp(connection);

fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
        db.none(
            `INSERT INTO ${tableName} (id, program, title, episode_date) VALUES ($1, $2, $3, $4)`,
            [row.id, row.program, row.title, row.episode_date]
        );
    })
    .on('error', (error) => {
        console.log(error);
    })
    .on('end', () => {
        console.log('CSV file successfully processed and inserted into database');
        pgp.end();
    });
