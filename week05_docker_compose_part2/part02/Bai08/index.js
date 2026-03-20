const express = require('express');
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/', (req, res) => {
  pool.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      return res.status(500).send('Database connection failed: ' + err.message);
    }
    res.send('Successfully connected to MySQL! 1 + 1 = ' + results[0].solution);
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
