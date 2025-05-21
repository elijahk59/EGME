const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// File storage
const upload = multer({ dest: 'uploads/' });

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// SQLite setup
const db = new sqlite3.Database('claims.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vin TEXT,
    mileage INTEGER,
    customer TEXT,
    date TEXT,
    complaint TEXT,
    diagnosis TEXT,
    remedy TEXT,
    additionalDetails TEXT,
    files TEXT
  )`);
});

// Submit route
app.post('/submit', upload.array('documents'), (req, res) => {
  const { vin, mileage, customer, date, complaint, diagnosis, remedy, additionalDetails } = req.body;
  const fileNames = req.files.map(f => f.filename).join(',');

  db.run(
    `INSERT INTO claims (vin, mileage, customer, date, complaint, diagnosis, remedy, additionalDetails, files)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [vin, mileage, customer, date, complaint, diagnosis, remedy, additionalDetails, fileNames],
    function(err) {
      if (err) return res.status(500).send('Database error');
      res.send('Success');
    }
  );
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
