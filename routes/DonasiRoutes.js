const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bukti = require('../mildware/bukti');

//Mengambil Semua Donasi
router.get('/', (req, res) => {
  const sql = `SELECT d. *, u.nama, p.judul_program 
  FROM tbl_donasi d JOIN tbl_user u 
  ON d.id_user = u._iduser JOIN tbl_programdonasi
  p ON d.id_program`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

//Tambah Donasi
router.post('/', single.bukti('bukti_pembayaran'), (req, res) => {
  const {
    id_user,
    jumlah_donasi,
    tanggal_donasi,
    dukungan,
    id_program,
    anonymous,
  } = req.body;
  const bukti_pembayaran = req.file ? `/bukti/${req.file.filename}` : null;

  //Validasi Fields
  const validasiFields = [
    id_user,
    jumlah_donasi,
    tanggal_donasi,
    dukungan,
    id_program,
    anonymous,
  ];

  for (const field of validasiFields) {
    const value = req.body[field];

    //ubah jadi string dulu
    if (!value || String(value).trim() === '') {
      return res.status(400).json({ error: `${field} Tidak Boleh Kosong` });
    }
  }

  //Validasi Gambar
  if (!req.file) {
    return res.status(400).json({ error: 'Gambar Tidak Boleh Kosong' });
  }

  const sql =
    ' INSERT INTO tbl_donasi (bukti_pembayaran,id_user,jumlah_donasi, tanggal_donasi, dukungan, id_program, anonymous) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [bukti_pembayaran, id_user, jumlah_donasi, id_program, anonymous],
    (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send('Status Berhasil Ditambahkan');
    },
  );
});

//Detail Donasi
router.get('/:id_donasi', (req, res) => {
  const { id_donasi } = req.params;

  const sql = ' SELECT FROM tbl_donasi WHERE id_donasi = ?';
  db.query(sql, [id_donasi], (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Donasi Tidak Ada' });
    }
    res.status(200).json(results[0]);
  });
});

//Hapus Donasi
router.delete('/:id_donasi', (req, res) => {
  const { id_donasi } = req.params;
  const sql = ' DELETE FROM tbl_donasi WHERE id_donasi = ?';

  db.query(sql, [id_donasi], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Donasi Berhasil Dihapus');
  });
});

