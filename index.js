const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: 'http://127.0.0.1:5500',  // Allow only this origin
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};


app.use(cors(corsOptions));
app.use(bodyParser.json());

// Database configuration for AgrowDB connection
const db = mysql.createConnection({
  host: '127.0.0.1', 
  port: 3307,      // Ensure you're connecting to the correct host (localhost or 127.0.0.1)
  user: 'root',             // The MySQL username, typically 'root', but adjust if you have a custom username
  password: 'root9609!', // Replace with the correct MySQL password for the 'root' user
  database: 'agrowdb',      // Ensure the database 'agrowdb' exists in your MySQL server
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;  // Exit if the connection fails
  } else {
    console.log('Connected to the AgrowDB database');
  }
});

// Define routes and endpoints

// GET all records
app.get('/land', (req, res) => {
  db.query('SELECT * FROM land', (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      res.status(500).send({ error: 'Database query failed' });
    } else {
      res.status(200).json(results);
    }
  });
});

// POST a new record
app.post('/add', (req, res) => {
  const { Typeoffarmingland, Area, Location, Contactno } = req.body;
  const query = 'INSERT INTO land (Typeoffarmingland, Area, Location, Contactno) VALUES (?, ?, ?, ?)';
  db.query(query, [Typeoffarmingland, Area, Location, Contactno], (err, results) => {
    if (err) {
      console.error('Database insert failed:', err);
      res.status(500).send({ error: 'Database insert failed' });
    } else {
      res.status(201).json({ id: results.insertId, message: 'Record added successfully' });
    }
  });
});

// PUT to update a record
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { Typeoffarmingland, Area, Location, Contactno } = req.body;
  const query = 'UPDATE land SET Typeoffarmingland = ?, Area = ?, Location = ?, Contactno = ? WHERE id = ?';
  db.query(query, [Typeoffarmingland, Area, Location, Contactno, id], (err) => {
    if (err) {
      console.error('Database update failed:', err);
      res.status(500).send({ error: 'Database update failed' });
    } else {
      res.status(200).json({ message: 'Record updated successfully' });
    }
  });
});

// DELETE a record
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM land WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Database delete failed:', err);
      res.status(500).send({ error: 'Database delete failed' });
    } else {
      res.status(200).json({ message: 'Record deleted successfully' });
    }
  });
});

// Start the server
const PORT = 5500;
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, db, server };
