const express = require('express');
const router = express.Router();
const db = require('../config/db');

//Ambil Semua Komentar
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        k.id_komentar,
        u.nama AS nama_user,
        p.judul_program,
        k.komentar,
        k.tanggal_komentar
      FROM tbl_komentar k
      JOIN tbl_user u ON k.id_user = u.id_user
      JOIN tbl_programdonasi p ON k.id_program = p.id_program
    `);

    res.json(results);
  } catch (err) {
    console.error('Gagal mengambil semua komentar:', err);
    res.status(500).json({ error: 'Gagal mengambil semua komentar' });
  }
});

//Ambil Komentar Berdasarkan ID Program
router.get('/program/:id_program', async (req, res) => {
  const { id_program } = req.params;

  try {
    const [results] = await db.query(
      `
      SELECT 
        k.id_komentar,
        u.nama AS nama_user,
        p.judul_program,
        k.komentar,
        k.tanggal_komentar
      FROM tbl_komentar k
      JOIN tbl_user u ON k.id_user = u.id_user
      JOIN tbl_programdonasi p ON k.id_program = p.id_program
      WHERE k.id_program = ?
      ORDER BY k.tanggal_komentar DESC
    `,
      [id_program],
    );

    res.json(results);
  } catch (err) {
    console.error('Gagal mengambil komentar:', err.message); // 🧠 Tampilkan pesan error MySQL
    res.status(500).json({ error: 'Gagal mengambil komentar' });
  }
});

// POST Komentar
router.post('/', async (req, res) => {
  const { id_user, id_program, komentar } = req.body;
  const tanggal_komentar = new Date();

  const sql = `
    INSERT INTO tbl_komentar (id_user, id_program, komentar, tanggal_komentar)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [
      id_user,
      id_program,
      komentar,
      tanggal_komentar,
    ]);

    res.status(201).json({
      message: 'Komentar berhasil ditambahkan',
      id_komentar: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

