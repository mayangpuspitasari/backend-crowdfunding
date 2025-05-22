const express = require('express');
const router = express.Router();
const db = require('../config/db');
const kegiatan = require('../mildware/kegiatan');

//Mengambil Semua Kegiatan
router.get('/', (req, res) => {
  const sql = `
    SELECT p.*, k.judul_program 
    FROM tbl_kegiatan p 
    JOIN tbl_programdonasi k ON p.id_program = k.id_program
    `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

//Tambah Kegiatan
router.post('/', kegiatan.single('gambar'), (req, res) => {
  const { id_program, judul_kegiatan, deskripsi, tanggal_kegiatan } = req.body;
  const gambar = req.file ? `/kegiatan/${req.file.filename}` : null;

  //Validasi
  const validasiFields = [
    'id_program',
    'judul_kegiatan',
    'deskripsi',
    'tanggal_kegiatan',
  ];

  for (const fields of validasiFields) {
    const value = req.body[fields];

    //ubah semua jadi string dulu baru di-trim
    if (!value || String(fields).trim() === '') {
      return res.status(400).json({ error: `${fields} Tidak Boleh Kosong` });
    }
  }

  //Validasi Gambar File
  if (!req.file) {
    return res.status(400).send({ error: 'Gambar Tidak Boleh Kosong' });
  }
  const sql =
    ' INSERT INTO tbl_kegiatan (gambar,id_program,judul_kegiatan,deskripsi,tanggal_kegiatan) VALUES (?, ?, ?, ?, ?)';
  db.query(
    sql,
    [gambar, id_program, judul_kegiatan, deskripsi, tanggal_kegiatan],
    (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send('Kegiatan Berhasil Di Tambahkan');
    },
  );
});

//Update Kegiatan
router.put('/:id_kegiatan', kegiatan.single('gambar'), (req, res) => {
  const { id_kegiatan } = req.params;
  const { id_program, judul_kegiatan, deskripsi, tanggal_kegiatan } = req.body;

  const gambar = req.file ? `/kegiatan/${req.file.filename}` : null;

  const sql =
    ' UPDATE tbl_kegiatan SET gambar = ?, id_program = ?, judul_kegiatan = ?, deskripsi = ?, tanggal_kegiatan = ? WHERE id_kegiatan = ?';
  db.query(
    sql,
    [
      gambar,
      id_program,
      judul_kegiatan,
      deskripsi,
      tanggal_kegiatan,
      id_kegiatan,
    ],
    (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send('Kegiatan Berhasil Di Update');
    },
  );
});

//Hapus Kegiatan
router.delete('/:id_kegiatan', (req, res) => {
  const { id_kegiatan } = req.params;

  const sql = ' DELETE FROM tbl_kegiatan WHERE id_kegiatan = ?';
  db.query(sql, [id_kegiatan], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Kegiatan Berhasil Dihapus');
  });
});

//Detail Kegiatan
router.get('/:id_kegiatan', (req, res) => {
  const { id_kegiatan } = req.params;

  const sql = 'SELECT * FROM tbl_kegiatan WHERE id_kegiatan = ?';
  db.query(sql, [id_kegiatan], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
    }

    res.status(200).json(results[0]); // kirim data kegiatan
  });
});

//export router
module.exports = router;

