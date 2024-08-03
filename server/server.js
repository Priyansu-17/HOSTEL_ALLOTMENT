const express = require('express');
const mysql=require('mysql2');
const cors=require('cors');
const bodyParser=require('body-parser');

const port=3001;
const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());

const db=mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'admin123', // Replace with your MySQL password
  database: 'seat_selection'
})

db.connect(err => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
  }
  console.log('Connected to MySQL');
});

// // Fetch seats
// app.get('/api/seats', (req, res) => {
//   db.query('SELECT * FROM total', (err, results) => {
//       if (err) {
//           res.status(500).send(err);
//           return;
//       }
//       res.json(results);
//   });
// });



// Fetch seats based on block and floor
app.get('/api/seats', (req, res) => {
  const { block, floor } = req.query;
  if (!block || floor === undefined) {
      return res.status(400).json({ error: 'Block and floor are required' });
  }

  const query = 'SELECT * FROM total WHERE block = ? AND floor = ?';
  db.query(query, [block, floor], (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.json(results);
  });
});

// Update seat status
app.post('/api/seats', (req, res) => {
  const { id, status } = req.body;
  console.log(id,status);
  db.query('UPDATE total SET status = ? WHERE id = ?', [status, id], (err) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.json({ success: true });
  });
});

app.get('/api/blocks', (req, res) => {
  db.query('SELECT DISTINCT block FROM total', (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.json(results.map(row => row.block));
  });
});

// Fetch available floors
app.get('/api/floors', (req, res) => {
  db.query('SELECT DISTINCT floor FROM total ORDER BY floor', (err, results) => {
      if (err) {
          res.status(500).send(err);
          return;
      }
      res.json(results.map(row => row.floor));
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});