const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bukti = require('../mildware/bukti');

//Mengambil Semua Donasi
router.get('/', (req, res) => {
  const sql = `SELECT d.*, u.nama, p.judul_program  
               FROM tbl_donasi d 
               JOIN tbl_user u ON d.id_user = u.id_user 
               JOIN tbl_programdonasi p ON d.id_program = p.id_program`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

//Tambah Donasi
router.post('/', bukti.single('bukti_pembayaran'), (req, res) => {
  const { id_user, jumlah_donasi, dukungan, id_program, anonymous } = req.body;
  const bukti_pembayaran = req.file ? `/bukti/${req.file.filename}` : null;

  // Validasi Fields
  const validasiFields = ['id_user', 'jumlah_donasi', 'id_program'];

  for (const field of validasiFields) {
    const value = req.body[field];
    if (!value || String(value).trim() === '') {
      return res.status(400).json({ error: `${field} Tidak Boleh Kosong` });
    }
  }

  // Validasi Jumlah Donasi
  if (Number(jumlah_donasi) <= 0) {
    return res.status(400).json({ error: 'Jumlah Donasi Harus Lebih Dari 0' });
  }

  // Validasi Gambar
  if (!req.file) {
    return res.status(400).json({ error: 'Bukti Pembayaran Wajib Diisi' });
  }

  const sql = `
    INSERT INTO tbl_donasi (
      bukti_pembayaran, id_user, jumlah_donasi,
      tanggal_donasi, dukungan, id_program,
      anonymous, verifikasi, status_donasi
    ) VALUES (?, ?, ?, NOW(), ?, ?, ?, 0, 'menunggu')`;

  db.query(
    sql,
    [
      bukti_pembayaran,
      id_user,
      jumlah_donasi,
      dukungan || null,
      id_program,
      anonymous ? 1 : 0,
    ],
    (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send('Donasi Berhasil Ditambahkan');
    },
  );
});

//Verifikasi Donasi Berhasil
router.put('/verifikasi_berhasil/:id_donasi', (req, res) => {
  const { id_donasi } = req.params;

  // Update status donasi jadi berhasil dan verifikasi = 1
  const updateStatusSql = `UPDATE tbl_donasi SET verifikasi = 1, status_donasi = 'Berhasil' WHERE id_donasi = ?`;

  db.query(updateStatusSql, [id_donasi], (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    // Ambil data donasi setelah diupdate statusnya
    const getDonasiSql = `SELECT id_user, id_program, jumlah_donasi FROM tbl_donasi WHERE id_donasi = ?`;

    db.query(getDonasiSql, [id_donasi], (err2, results) => {
      if (err2) return res.status(500).send(err2);

      if (results.length === 0)
        return res.status(404).send('Donasi tidak ditemukan');

      const donasi = results[0];

      // Cek apakah user sudah pernah donasi berhasil ke program ini (kecuali donasi ini)
      const cekDonaturSql = `
        SELECT COUNT(*) AS count FROM tbl_donasi
        WHERE id_user = ? AND id_program = ? AND status_donasi = 'Berhasil' AND id_donasi <> ?`;

      db.query(
        cekDonaturSql,
        [donasi.id_user, donasi.id_program, id_donasi],
        (err3, countResult) => {
          if (err3) return res.status(500).send(err3);

          const isFirstDonatur = countResult[0].count === 0;

          // Update total_terkumpul dan jumlah_donatur di program
          let updateProgramSql = `UPDATE tbl_programdonasi SET total_terkumpul = total_terkumpul + ?`;
          const params = [donasi.jumlah_donasi];

          if (isFirstDonatur) {
            updateProgramSql += `, jumlah_donatur = jumlah_donatur + 1`;
          }
          updateProgramSql += ` WHERE id_program = ?`;
          params.push(donasi.id_program);

          db.query(updateProgramSql, params, (err4) => {
            if (err4) return res.status(500).send(err4);

            res.status(200).send('Donasi berhasil diverifikasi dan total program diperbarui');
          });
        },
      );
    });
  });
});


//Verifikasi Donasi Gagal
router.put('/verifikasi_gagal/:id_donasi', (req, res) => {
  const { id_donasi } = req.params;
  const sql = ` UPDATE tbl_donasi SET verifikasi = 0, status_donasi = 'Gagal' WHERE id_donasi = ?`;

  db.query(sql, [id_donasi], (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send('Donasi Gagal Diverifikasi');
  });
});

//Detail Donasi
router.get('/:id_donasi', (req, res) => {
  const { id_donasi } = req.params;

  const sql = `SELECT d.*, u.nama, p.judul_program 
    FROM tbl_donasi d
    JOIN tbl_user u ON d.id_user = u.id_user
    JOIN tbl_programdonasi p ON d.id_program = p.id_program
    WHERE d.id_donasi = ?`;

  db.query(sql, [id_donasi], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0)
      return res.status(404).json({ message: 'Donasi tidak ditemukan' });
    res.json(result[0]);
  });
});

// GET Riwayat Donasi User
router.get('/user/:id_user', (req, res) => {
  const { id_user } = req.params;

  const sql = `
    SELECT 
      d.id_donasi,
      p.judul_program AS judul_donasi,
      d.jumlah_donasi,
      d.tanggal_donasi,
      d.status_donasi
    FROM 
      tbl_donasi d
    JOIN 
      tbl_programdonasi p ON d.id_program = p.id_program
    WHERE 
      d.id_user = ?
    ORDER BY 
      d.tanggal_donasi DESC
  `;

  db.query(sql, [id_user], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 'Gagal mengambil riwayat donasi', detail: err });
    }
    res.status(200).json(results);
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

//export module
module.exports = router;

