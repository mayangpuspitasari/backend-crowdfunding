const express = require('express');
const router = express.Router();
const db = require('../config/db');
const kegiatan = require('../mildware/kegiatan');

//Mengambil Semua Kegiatan
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : `%`;

  try {
    // Ambil data kegiatan berdasarkan pencarian judul kegiatan
    const [results] = await db.query(
      `SELECT p.*, k.judul_program 
       FROM tbl_kegiatan p 
       JOIN tbl_programdonasi k ON p.id_program = k.id_program 
       WHERE p.judul_kegiatan LIKE ? 
       ORDER BY p.id_kegiatan DESC
       LIMIT ? OFFSET ?`,
      [search, limit, offset],
    );

    // Hitung total data (untuk pagination)
    const [countResult] = await db.query(
      `SELECT COUNT(*) AS total 
       FROM tbl_kegiatan p 
       JOIN tbl_programdonasi k ON p.id_program = k.id_program 
       WHERE p.judul_kegiatan LIKE ?`,
      [search],
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Kirim respons ke frontend
    res.json({
      data: results,
      currentPage: page,
      totalData: total,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

//Tambah Kegiatan
router.post('/', kegiatan.single('gambar'), async (req, res) => {
  const { id_program, judul_kegiatan, deskripsi, tanggal_kegiatan } = req.body;
  const gambar = req.file ? `/kegiatan/${req.file.filename}` : null;

  //Validasi
  const validasiFields = [
    'id_program',
    'judul_kegiatan',
    'deskripsi',
    'tanggal_kegiatan',
  ];

  for (const field of validasiFields) {
    const value = req.body[field];
    if (!value || String(value).trim() === '') {
      return res.status(400).json({ error: `${field} Tidak Boleh Kosong` });
    }
  }

  //Validasi Gambar File
  if (!req.file) {
    return res.status(400).send({ error: 'Gambar Tidak Boleh Kosong' });
  }

  const sql =
    ' INSERT INTO tbl_kegiatan (gambar,id_program,judul_kegiatan,deskripsi,tanggal_kegiatan) VALUES (?, ?, ?, ?, ?)';
  try {
    await db.query(sql, [
      gambar,
      id_program,
      judul_kegiatan,
      deskripsi,
      tanggal_kegiatan,
    ]);
    res.status(201).json({ message: 'Kegiatan Berhasil Ditambahkan' });
  } catch (error) {
    console.error('Terjadi kesalahan saat menambahkan kegiatan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

//Update Kegiatan
router.put('/:id_kegiatan', kegiatan.single('gambar'), async (req, res) => {
  const { id_kegiatan } = req.params;
  const { id_program, judul_kegiatan, deskripsi, tanggal_kegiatan } = req.body;

  const gambar = req.file ? `/kegiatan/${req.file.filename}` : null;

  const sql =
    ' UPDATE tbl_kegiatan SET gambar = ?, id_program = ?, judul_kegiatan = ?, deskripsi = ?, tanggal_kegiatan = ? WHERE id_kegiatan = ?';
  try {
    await db.query(sql, [
      gambar,
      id_program,
      judul_kegiatan,
      deskripsi,
      tanggal_kegiatan,
      id_kegiatan,
    ]);
    res.status(200).json({ message: 'Kegiatan Berhasil Diedit' });
  } catch (error) {
    console.error('Terjadi kesalahan saat mengupdate kegiatan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

//Hapus Kegiatan
router.delete('/:id_kegiatan', async (req, res) => {
  const { id_kegiatan } = req.params;

  const sql = ' DELETE FROM tbl_kegiatan WHERE id_kegiatan = ?';
  try {
    await db.query(sql, [id_kegiatan]);
    res.status(200).json({ message: 'Kegiatan Berhasil Dihapus' });
  } catch (error) {
    console.error('Terjadi kesalahan saat menghapus kegiatan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET detail kegiatan berdasarkan ID
router.get('/:id_kegiatan', async (req, res) => {
  const { id_kegiatan } = req.params;

  const sql = `
    SELECT p.*, k.judul_program 
    FROM tbl_kegiatan p 
    JOIN tbl_programdonasi k ON p.id_program = k.id_program
    WHERE p.id_kegiatan = ?
  `;

  try {
    const [results] = await db.query(sql, [id_kegiatan]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error mengambil data kegiatan:', err);
    res
      .status(500)
      .json({ error: 'Terjadi kesalahan saat mengambil data kegiatan.' });
  }
});

//export router
module.exports = router;

