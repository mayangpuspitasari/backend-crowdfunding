const express = require('express');
const router = express.Router();
const db = require('../config/db');
const program = require('../middleware/program');

//mengambil semua program
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM tbl_program';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

//Tambah program
router.post('/', program.single('gambar'), (req, res) => {
  const { id_instansi, judul, deskripsi, target_dana, tanggal_akhir } =
    req.body;
  const gambar = req.file ? req.file.filename : null;

  const sql =
    'INSERT INTO tbl_program (id_instansi, judul, deskripsi, target_dana, tanggal_akhir, gambar) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [id_instansi, judul, deskripsi, target_dana, tanggal_akhir, gambar],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({
          message: 'Program created successfully',
          id: results.insertId,
        });
    },
  );
});
//Update program

