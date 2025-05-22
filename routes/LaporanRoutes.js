const express = require('express');
const router = express.Router();
const db = require('../config/db');

//ambil data laporan
router.get('/', (req, res) => {
  db.query(
    'SELECT * FROM tbl_laporan ORDER BY tanggal_cetak DESC',
    (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({ error: 'Gagal mengambil data laporan', detail: err });
      }
      res.json(results);
    },
  );
});

// Menampilkan semua data laporan
router.get('/laporan_program', (req, res) => {
  const sql = ` SELECT p.id_program, p.judul_program, COUNT(DISTINCT d.id_user)
                AS total_donatur, SUM(d.jumlah_donasi) AS total_donasi,
                GROUP_CONCAT(DISTINCT u.nama SEPARATOR ', ') AS nama
                FROM tbl_programdonasi p
                LEFT JOIN tbl_donasi d ON p.id_program = d.id_program
                LEFT JOIN tbl_user u ON d.id_user = u.id_user
                GROUP BY p.id_program, p.judul_program`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Gagal mengambil data laporan donasi',
        detail: err,
      });
    }
    res.status(200).json(results);
  });
});

//Buat Laporan
router.post('/', (req, res) => {
  const tanggalCetak = new Date();

  // Hitung data laporan
  const sql = `
    SELECT 
      (SELECT COUNT(*) FROM tbl_programdonasi) AS total_program,
      (SELECT COUNT(DISTINCT id_user) FROM tbl_donasi) AS total_user,
      (SELECT SUM(jumlah_donasi) FROM tbl_donasi) AS total_donasi
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 'Gagal mengambil data laporan', detail: err });
    }

    const { total_program, total_user, total_donasi } = results[0];
    const insertSql = `
      INSERT INTO tbl_laporan (total_program, total_user, total_donasi, tanggal_cetak)
      VALUES (?, ?, ?, ?)
    `;
    db.query(
      insertSql,
      [total_program, total_user, total_donasi, tanggalCetak],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: 'Gagal menyimpan laporan', detail: err });
        }

        res
          .status(201)
          .json({
            message: 'Laporan berhasil disimpan',
            id_laporan: result.insertId,
          });
      },
    );
  });
});

//export module
module.exports = router;

