const express = require('express');
const router = express.Router();
const db = require('../config/db');
const program = require('../mildware/program');

//mengambil semua program
router.get('/', (req, res) => {
  const sql = `
    SELECT p.*, k.jenis_kategori 
    FROM tbl_programdonasi p
    JOIN tbl_kategori k ON p.id_kategori = k.id_kategori
  `;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

//Tambah program
router.post('/', program.single('gambar'), (req, res) => {
  const {
    judul_program,
    deskripsi,
    id_kategori,
    tgl_mulai,
    tgl_berakhir,
    jumlah_donatur,
    target_donasi,
    total_terkumpul,
    status,
  } = req.body;
  const gambar = req.file ? `/program/${req.file.filename}` : null;

  const sql =
    'INSERT INTO tbl_programdonasi (gambar, judul_program, deskripsi, id_kategori, tgl_mulai, tgl_berakhir, jumlah_donatur, target_donasi, total_terkumpul, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [
      gambar,
      judul_program,
      deskripsi,
      id_kategori,
      tgl_mulai,
      tgl_berakhir,
      jumlah_donatur,
      target_donasi,
      total_terkumpul,
      status,
    ],
    (err) => {
      if (err) {
        return res.status(500).send(err); // Mengirimkan respons error dan menghentikan eksekusi
      }
      res.status(201).send('Program Berhasil Ditambahkan'); // Respons sukses
    },
  );
});

//Update program
router.put('/:id_program', program.single('gambar'), (req, res) => {
  const { id_program } = req.params;
  const {
    judul_program,
    deskripsi,
    id_kategori,
    tgl_mulai,
    tgl_berakhir,
    jumlah_donatur,
    target_donasi,
    total_terkumpul,
    status,
  } = req.body;

  const gambar = req.file ? `/program/${req.file.filename}` : null;

  const sql =
    'UPDATE tbl_programdonasi SET gambar = ?, judul_program = ?, deskripsi = ?, id_kategori = ?, tgl_mulai = ?, tgl_berakhir = ?, jumlah_donatur = ?, target_donasi = ?, total_terkumpul = ?, status = ? WHERE id_program = ?';
  db.query(
    sql,
    [
      gambar,
      judul_program,
      deskripsi,
      id_kategori,
      tgl_mulai,
      tgl_berakhir,
      jumlah_donatur,
      target_donasi,
      total_terkumpul,
      status,
      id_program,
    ],
    (err) => {
      if (err) {
        return res.status(500).send(err); // Mengirimkan respons error dan menghentikan eksekusi
      }
      res.status(200).send('Program Berhasil Diupdate'); // Respons sukses
    },
  );
});

//hapus program
router.delete('/:id_program', (req, res) => {
  const { id_program } = req.params;

  const sql = 'DELETE FROM tbl_programdonasi WHERE id_program = ?';
  db.query(sql, [id_program], (err) => {
    if (err) {
      return res.status(500).send(err); // Mengirimkan respons error dan menghentikan eksekusi
    }
    res.status(200).send('Program Berhasil Dihapus'); // Respons sukses
  });
});

// Route untuk 3 program terbaru
router.get('/terbaru', (req, res) => {
  const sql = `
    SELECT p.*, k.jenis_kategori 
    FROM tbl_programdonasi p
    JOIN tbl_kategori k ON p.id_kategori = k.id_kategori
    ORDER BY p.id_program DESC
    LIMIT 3
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }

    res.status(200).json(results);
  });
});

//Detail program
router.get('/:id_program', (req, res) => {
  const { id_program } = req.params;

  const sql = 'SELECT * FROM tbl_programdonasi WHERE id_program = ?';
  db.query(sql, [id_program], (err, results) => {
    if (err) {
      return res.status(500).send(err); // Mengirimkan respons error dan menghentikan eksekusi
    }
    if (results.length === 0) {
      return res.status(404).send('Program tidak ditemukan'); // Respons jika tidak ada data
    }
    res.json(results[0]); // Respons sukses dengan data program
  });
});

// Export router
module.exports = router;

