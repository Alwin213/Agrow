const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5500;

// Middleware to parse incoming JSON data
app.use(express.json());
app.use(cors());

// MySQL Connection Settings
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: '3307',
  user: 'root',
  password: 'root',
  database: 'agrowdb',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Fetch all records
app.get('/land', (req, res) => {
  const sqlQuery = 'SELECT * FROM land';
  db.query(sqlQuery, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

// Add a new record
app.post('/add', (req, res) => {
  const { Typeoffarmingland, Area, Location, Contactnumber } = req.body;
  if (!Typeoffarmingland || !Area || !Location || !Contactnumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const sql = 'INSERT INTO land (Typeoffarmingland, Area, Location, Contactnumber) VALUES (?, ?, ?, ?)';
  db.query(sql, [Typeoffarmingland, Area, Location, Contactnumber], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Record added successfully', id: result.insertId });
  });
});

// Update an existing record
app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { Typeoffarmingland, Area, Location, Contactnumber } = req.body;
  if (!Typeoffarmingland || !Area || !Location || !Contactnumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const sql = 'UPDATE land SET Typeoffarmingland = ?, Area = ?, Location = ?, Contactnumber = ? WHERE id = ?';
  db.query(sql, [Typeoffarmingland, Area, Location, Contactnumber, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record updated successfully' });
  });
});

// Delete a record
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM land WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
