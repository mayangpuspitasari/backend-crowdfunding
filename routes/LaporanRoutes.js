const express = require('express');
const router = express.Router();
const db = require('../config/db');

//ambil data laporan
router.get('/laporan_program', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const search = `%${req.query.search || ''}%`;

  const sql = `
  SELECT 
    p.id_program,
    p.judul_program,
    p.target_donasi,
    p.tgl_mulai,
    p.tgl_berakhir,
    COUNT(DISTINCT d.id_user) AS total_donatur,
    COALESCE(SUM(d.jumlah_donasi), 0) AS total_terkumpul
  FROM tbl_programdonasi p
  LEFT JOIN tbl_donasi d 
    ON p.id_program = d.id_program AND d.verifikasi = 1
  WHERE p.judul_program LIKE ?
  GROUP BY 
    p.id_program, 
    p.judul_program, 
    p.target_donasi,
    p.tgl_mulai,
    p.tgl_berakhir
  ORDER BY p.tgl_mulai DESC
  LIMIT ? OFFSET ?
`;

  try {
    const [results] = await db.query(sql, [search, limit, offset]);

    const [countResult] = await db.query(
      `
      SELECT COUNT(*) AS total FROM tbl_programdonasi WHERE judul_program LIKE ?
    `,
      [search],
    );

    const totalPages = Math.ceil(countResult[0].total / limit);

    res.json({
      data: results,
      totalPages,
    });
  } catch (err) {
    console.error('SQL Error:', err);
    res.status(500).json({
      error: 'Gagal mengambil data laporan program',
      detail: err,
    });
  }
});

// Endpoint: GET /laporan_program/:id_program (untuk detail per program)
router.get('/laporan_program/:id_program', async (req, res) => {
  const { id_program } = req.params;

  const sql = `
  SELECT 
    u.nama AS nama_donatur,
    d.jumlah_donasi,
    d.tanggal_donasi
  FROM tbl_donasi d
  JOIN tbl_user u ON d.id_user = u.id_user
  WHERE d.id_program = ? AND d.verifikasi = 1
  ORDER BY d.tanggal_donasi DESC
`;

  try {
    const [results] = await db.query(sql, [id_program]);

    // Hitung total donasi
    const total_donasi = results.reduce(
      (sum, item) => sum + item.jumlah_donasi,
      0,
    );

    res.json({
      detail: results,
      total_donasi,
    });
  } catch (err) {
    res.status(500).json({
      error: 'Gagal mengambil detail laporan program',
      detail: err,
    });
  }
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

        res.status(201).json({
          message: 'Laporan berhasil disimpan',
          id_laporan: result.insertId,
        });
      },
    );
  });
});

//export module
module.exports = router;

