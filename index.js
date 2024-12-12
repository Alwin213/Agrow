const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const corsOptions = {
  origin: 'http://127.0.0.1:5500',  
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};


app.use(cors(corsOptions));
app.use(bodyParser.json());


const db = mysql.createConnection({
  host: '127.0.0.1', 
  port: '3307',     
  user: 'root',            
  password: 'root9609!', 
  database: 'agrowdb',     
});


db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;  
  } else {
    console.log('Connected to the AgrowDB database');
  }
});


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


app.post('/add', (req, res) => {
  const { Typeoffarmingland, Area, Location, Contactnumber } = req.body;
  const query = 'INSERT INTO land (Typeoffarmingland, Area, Location, Contactnumber) VALUES (?, ?, ?, ?)';
  db.query(query, [Typeoffarmingland, Area, Location, Contactnumber], (err, results) => {
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
  const { Typeoffarmingland, Area, Location, Contactnumber } = req.body;
  const query = 'UPDATE land SET Typeoffarmingland = ?, Area = ?, Location = ?, Contactnumber = ? WHERE id = ?';
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
