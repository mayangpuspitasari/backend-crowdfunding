const mysql = require('mysql2');
const db = mysql
  .createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crowdfunding',
  })
  .promise(); 

db.connect((err) => {
  if (err) throw err;
  console.log('Koneksi Ke Database Berhasil!!!');
});

module.exports = db;
