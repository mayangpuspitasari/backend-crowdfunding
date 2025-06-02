const express = require('express');
const router = express.Router();
const db = require('../config/db');

//Mengambil semua kategori
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT  * FROM tbl_kategori');
    res.json(results);
  } catch (err) {
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
router.post('/', (req, res) => {
  const { jenis_kategori } = req.body;

  if (!jenis_kategori || jenis_kategori.trim() === '') {
    return res.status(400).json({ error: 'jenis_kategori tidak boleh kosong' });
  }

  const sql = 'INSERT INTO tbl_kategori (jenis_kategori) VALUES (?)';
  db.query(sql, [jenis_kategori], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).json({ message: 'Kategori Berhasil Ditambahkan' });
  });
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
