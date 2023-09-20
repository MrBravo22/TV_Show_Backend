const pg = require('pg');
const client = new pg.Client('postgres://localhost/tv_show_backend_db');
const express = require('express');
const app = express();

app.get('/api/shows', async (req, res, next) => {
    try {
        const SQL = `
        SELECT * FROM shows
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    }
    catch(ex){
        next(ex);
    }
});

const init = async () => {
    await client.connect();
    console.log('connected to the database');
    const SQL =`
        DROP TABLE IF EXISTS shows;
        CREATE TABLE shows(
            id SERIAL PRIMARY KEY,
            name VARCHAR(30),
            is_favorite BOOLEAN
        );
        INSERT INTO shows(name, is_favorite) values('Family Guy', true);
        INSERT INTO shows(name, is_favorite) values('Friends', false);
        INSERT INTO shows(name, is_favorite) values('Chainsaw Man', true);


    `;
    await client.query(SQL);
    console.log('tables created');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
};

init();

