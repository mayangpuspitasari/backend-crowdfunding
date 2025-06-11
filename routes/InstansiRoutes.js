const express = require('express');
const router = express.Router();
const db = require('../config/db');
const instansi = require('../mildware/instansi');
const fs = require('fs');

// Menampilkan semua data instansi
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM tbl_instansi');
    res.json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  res.json(results);
});

// Menmapilkan Profil Instansi
router.get('/profil', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT deskripsi, visi, misi FROM tbl_instansi',
    );
    // Kirim data baris pertama (asumsi datanya hanya 1 instansi)
    res.json(results[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Menampikan Struktur
router.get('/struktur', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT struktur FROM tbl_instansi LIMIT 1',
    );
    if (results.length === 0) {
      return res.status(404).json({ error: 'Data struktur tidak ditemukan' });
    }

    const strukturFilename = results[0].struktur;
    const strukturUrl = strukturFilename.startsWith('/instansi/')
      ? strukturFilename
      : `/instansi/${strukturFilename}`;
    // tambahkan path folder

    res.json({ struktur: strukturUrl }); // kirim path lengkap ke frontend
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//MENAMPILKAN FOOTER INSTANSI
router.get('/footer', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT alamat, kontak, email, fb, ig FROM tbl_instansi',
    );
    res.json(results[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//MENAMPILKAN logo INSTANSI
router.get('/logo', async (req, res) => {
  try {
    const [results] = await db.query('SELECT logo FROM tbl_instansi');
    res.json(results[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//MENAMPILKAN rekening INSTANSI
router.get('/rekening', async (req, res) => {
  try {
    const [results] = await db.query('SELECT rekening FROM tbl_instansi');
    res.json(results[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//Tambah Data Instansi
router.post(
  '/',
  instansi.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'struktur', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { deskripsi, visi, misi, alamat, kontak, email, fb, ig, rekening } =
        req.body;

      // Validasi input
      if (!deskripsi || !visi || !misi || !alamat || !kontak || !email) {
        return res.status(400).json({
          error:
            'Deskripsi, visi, misi, alamat, kontak, dan email wajib diisi.',
        });
      }

      // Ambil nama file (jika diupload)
      const logo = req.files?.logo
        ? `/instansi/${req.files.logo[0].filename}`
        : null;
      const struktur = req.files?.struktur
        ? `/instansi/${req.files.struktur[0].filename}`
        : null;

      // Simpan ke database
      const sql = `
        INSERT INTO tbl_instansi 
        (deskripsi, visi, misi, alamat, kontak, email, fb, ig, rekening, logo, struktur) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        deskripsi,
        visi,
        misi,
        alamat,
        kontak,
        email,
        fb || null,
        ig || null,
        rekening || null,
        logo,
        struktur,
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res
            .status(500)
            .json({ error: 'Gagal menyimpan data instansi' });
        }

        res.status(201).json({
          message: 'Data instansi berhasil ditambahkan',
          data: {
            id: result.insertId,
            ...req.body,
            logo,
            struktur,
          },
        });
      });
    } catch (err) {
      console.error('Upload error:', err.message);
      return res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
  },
);

//update data instansi
router.put(
  '/:id_instansi',
  instansi.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'struktur', maxCount: 1 },
  ]),
  (req, res) => {
    const { id_instansi } = req.params;
    const { deskripsi, visi, misi, alamat, kontak, email, fb, ig, rekening } =
      req.body;

    const logoBaru = req.files['logo'] ? req.files['logo'][0].filename : null;
    const strukturBaru = req.files['struktur']
      ? req.files['struktur'][0].filename
      : null;

    // Ambil data lama dulu dari database
    const getQuery =
      'SELECT logo, struktur FROM tbl_instansi WHERE id_instansi = ?';
    db.query(getQuery, [id_instansi], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res.status(404).json({ error: 'Instansi tidak ditemukan' });

      const instansiLama = results[0];
      const finalLogo = logoBaru || instansiLama.logo;
      const finalStruktur = strukturBaru || instansiLama.struktur;

      // Jika file baru ada, hapus file lama (opsional)
      if (
        logoBaru &&
        instansiLama.logo &&
        fs.existsSync(`./instansi/${instansiLama.logo}`)
      ) {
        fs.unlinkSync(`./instansi/${instansiLama.logo}`);
      }
      if (
        strukturBaru &&
        instansiLama.struktur &&
        fs.existsSync(`./instansi/${instansiLama.struktur}`)
      ) {
        fs.unlinkSync(`./instansi/${instansiLama.struktur}`);
      }

      // Lanjut update
      const updateQuery = `
      UPDATE tbl_instansi 
      SET deskripsi = ?, visi = ?, misi = ?, alamat = ?, kontak = ?, email = ?, fb = ?, ig = ?, rekening = ?, logo = ?, struktur = ?
      WHERE id_instansi = ?
    `;
      db.query(
        updateQuery,
        [
          deskripsi,
          visi,
          misi,
          alamat,
          kontak,
          email,
          fb,
          ig,
          rekening,
          finalLogo,
          finalStruktur,
          id_instansi,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ message: 'Data instansi berhasil diperbarui' });
        },
      );
    });
  },
);

// Export router
module.exports = router;

