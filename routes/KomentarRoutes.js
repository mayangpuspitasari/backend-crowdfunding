const express = require('express');
const router = express.Router();
const db = require('../config/db');

//Ambil Semua Komentar
router.get('/', (req, res) => {
  const sql = `
        SELECT 
            k.id_komentar,
            u.nama AS nama_user,
            p.judul_program,
            k.komentar,
            k.tannggal_komentar
        FROM tbl_komentar k
        JOIN tbl_user u ON k.id_user = u.id_user
        JOIN tbl_programdonasi p ON k.id_program = p.id_program
    `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

