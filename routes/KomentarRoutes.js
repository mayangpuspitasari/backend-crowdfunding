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

//Buat Komentar
router.post('/', (req, res) => {
  const { id_user, id_program, komentar } = req.body;
  const tanggal_komentar = new Date();

  const sql = `
        INSERT INTO tbl_komentar (id_user, id_program, komentar, tannggal_komentar) 
        VALUES (?, ?, ?, ?)
    `;

  db.query(
    sql,
    [id_user, id_program, komentar, tanggal_komentar],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res
        .status(201)
        .json({
          message: 'Komentar berhasil ditambahkan',
          id_komentar: result.insertId,
        });
    },
  );
});

//AMbil Komentar Berdasarkan Program Donasi
router.get('/program/:id_program', (req, res) => {
  const { id_program } = req.params;

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
        WHERE k.id_program = ?
        ORDER BY k.tannggal_komentar DESC
    `;

  db.query(sql, [id_program], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

//Hapus Komentar
router.delete('/:id_komentar', (req, res) => {
  const { id_komentar } = req.params;
  const sql = 'DELETE FROM tbl_komentar WHERE id_komentar = ?';
  db.query(sql, [id_komentar], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('KOmentar Berhasil Dihapus');
  });
});

//export module
module.exports = router;

