const express = require('express');
const mysql = require('mysql2');  // Use mysql2 instead of mysql
const cors = require('cors');  // Make sure CORS is installed and configured
const app = express();
const PORT = 5500;

// Middleware to parse incoming JSON data
app.use(express.json());
app.use(cors()); // Enable CORS

// MySQL Connection Setup (with mysql2)
const db = mysql.createConnection({
  host: '127.0.0.1',
  port: '3307',  // Make sure this matches your MySQL setup
  user: 'root',  // Your MySQL username
  password: 'root',  // Your MySQL password
  database: 'agrowdb',  // Your database name
});

// Connect to MySQL using mysql2
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// Define a GET API Route to fetch all records
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

// POST API to add new records
app.post('/add', (req, res) => {
  const { Typeoffarmingland, Area, Location, Contactnumber } = req.body;
  console.log(req.body);
  
  // Validate that all fields are provided
  if (!Typeoffarmingland || !Area || !Location || !Contactnumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // SQL Query to Insert a New Record into the Land Table
  const sql = 'INSERT INTO land (Typeoffarmingland, Area, Location, Contactnumber) VALUES (?, ?, ?, ?)';

  db.query(sql, [Typeoffarmingland, Area, Location, Contactnumber], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Record added successfully', id: result.insertId });
  });
});

// PUT API to update a record
app.put('/update/:id', (req, res) => {
  const { id } = req.params; // Get the id from the URL parameter
  const { Typeoffarmingland, Area, Location, Contactnumber } = req.body;

  // Validate that all fields are provided
  if (!Typeoffarmingland || !Area || !Location || !Contactnumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // SQL Query to Update the Record
  const sql = 'UPDATE land SET Typeoffarmingland = ?, Area = ?, Location = ?, Contactnumber = ? WHERE id = ?';

  db.query(sql, [Typeoffarmingland, Area, Location, Contactnumber, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record updated successfully' });
  });
});

// DELETE API to delete a record
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  // First, check if the ID exists
  const checkSql = 'SELECT * FROM land WHERE id = ?';
  db.query(checkSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // If the record exists, proceed with the delete operation
    const deleteSql = 'DELETE FROM land WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Record deleted successfully' });
    });
  });
});

// SEARCH API to search records by Typeoffarmingland
app.get('/search', (req, res) => {
  const { term } = req.query;  // Extract the search term from the query

  if (!term) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  // SQL Query with Wildcards
  const sql = 'SELECT * FROM land WHERE Typeoffarmingland LIKE ?';

  db.query(sql, [`%${term}%`], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No records found' });
    }
    res.json(results);
  });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
