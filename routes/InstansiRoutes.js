const express = requie('express');
const router = express.Router();
const db = require('../config/db');
const instansi = require('../middleware/instansi');
const fs = require('fs');

// Menampilkan semua data instansi
router.get('/', (req, res) => {
  db.query('SELECT * FROM tbl_instansi', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

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

