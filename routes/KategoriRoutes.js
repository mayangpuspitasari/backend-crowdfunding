const express = require('express');
const router = express.Router();
const db = require('../config/db');

//Mengambil Semua Kategori
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  try {
    const [results] = await db.query(
      `SELECT * FROM tbl_kategori
       WHERE jenis_kategori LIKE ?
       ORDER BY id_kategori DESC
       LIMIT ? OFFSET ?`,
      [search, limit, offset],
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM tbl_kategori
       WHERE jenis_kategori LIKE ?`,
      [search],
    );

    res.json({
      data: results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('Query Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Mengambil kategori tertentu berdasarkan ID
router.get('/:id_kategori', (req, res) => {
  const { id_kategori } = req.params;

  db.query(
    'SELECT * FROM tbl_kategori WHERE id_kategori = ?',
    [id_kategori],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Kategori tidak ditemukan' });
      }

      res.json(results[0]); // Ambil satu hasil saja karena ID itu unik
    },
  );
});

//Tambah Kategori
router.post('/', async (req, res) => {
  const { jenis_kategori } = req.body;

  if (!jenis_kategori) {
    return res.status(400).json({ message: 'Jenis kategori wajib diisi' });
  }

  try {
    await db.query('INSERT INTO tbl_kategori (jenis_kategori) VALUES (?)', [
      jenis_kategori,
    ]);
    res.status(201).json({ message: 'Kategori berhasil ditambahkan' });
  } catch (err) {
    console.error('Gagal insert:', err);
    res.status(500).json({ message: 'Gagal menambahkan kategori' });
  }
});

//Update Kategori
router.put('/:id_kategori', (req, res) => {
  const { id_kategori } = req.params;
  const { jenis_kategori } = req.body;

  const sql =
    'UPDATE tbl_kategori SET jenis_kategori = ? WHERE id_kategori = ?';
  db.query(sql, [jenis_kategori, id_kategori], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Kategori Berhasil Diupdate');
  });
});

//Hapus Kategori
router.delete('/:id_kategori', (req, res) => {
  const { id_kategori } = req.params;

  const sql = ' DELETE FROM tbl_kategori WHERE id_kategori = ?';
  db.query(sql, [id_kategori], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Kategori Berhasil Dihapus');
  });
});

// Export router
module.exports = router;

