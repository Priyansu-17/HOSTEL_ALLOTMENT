require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection("mysql://root:kJsILNaBYLrtvaEYAWNiBmxivQoIvEAN@autorack.proxy.rlwy.net:31953/railway");

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = db;