const pg = require('pg');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Database setup
const client = new pg.Client('postgres://localhost/tv_show_backend_db');

app.use(bodyParser.json());

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// GET all shows
app.get('/api/shows', async (req, res, next) => {
  try {
    const SQL = `SELECT * FROM shows`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex);
  }
});

// GET a single show by ID
app.get('/api/shows/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `SELECT * FROM shows WHERE id = $1`;
    const response = await client.query(SQL, [id]);
    if (response.rows.length === 0) {
      res.status(404).send('Show not found');
    } else {
      res.send(response.rows[0]);
    }
  } catch (ex) {
    next(ex);
  }
});

// DELETE a single show by ID
app.delete('/api/shows/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const SQL = `DELETE FROM shows WHERE id = $1 RETURNING *`;
    const response = await client.query(SQL, [id]);
    if (response.rows.length === 0) {
      res.status(404).send('Show not found');
    } else {
      res.send(response.rows[0]);
    }
  } catch (ex) {
    next(ex);
  }
});

// POST route to add a new show
app.post('/api/shows', async (req, res, next) => {
  try {
    const { name, is_favorite } = req.body;
    const SQL = `INSERT INTO shows(name, is_favorite) VALUES($1, $2) RETURNING *`;
    const response = await client.query(SQL, [name, is_favorite]);
    res.status(201).send(response.rows[0]);
  } catch (ex) {
    next(ex);
  }
});

// PUT route to edit an existing show by ID
app.put('/api/shows/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, is_favorite } = req.body;
    const SQL = `UPDATE shows SET name = $1, is_favorite = $2 WHERE id = $3 RETURNING *`;
    const response = await client.query(SQL, [name, is_favorite, id]);
    if (response.rows.length === 0) {
      res.status(404).send('Show not found');
    } else {
      res.send(response.rows[0]);
    }
  } catch (ex) {
    next(ex);
  }
});

// Handling invalid routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

const init = async () => {
  await client.connect();
  console.log('Connected to the database');

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
};

init();
