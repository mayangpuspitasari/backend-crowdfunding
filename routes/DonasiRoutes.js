const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bukti = require('../mildware/bukti');

//Mengambil Semua Donasi
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  try {
    const [results] = await db.query(
      `SELECT 
         d.*, 
         IF(d.anonymous = 1, 'Anonymous', u.nama) AS nama_user, 
         p.judul_program 
       FROM tbl_donasi d
       JOIN tbl_user u ON d.id_user = u.id_user
       JOIN tbl_programdonasi p ON d.id_program = p.id_program
       WHERE p.judul_program LIKE ?
       ORDER BY d.id_donasi DESC
       LIMIT ? OFFSET ?`,
      [search, limit, offset],
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total 
       FROM tbl_donasi d
       JOIN tbl_user u ON d.id_user = u.id_user
       JOIN tbl_programdonasi p ON d.id_program = p.id_program
       WHERE p.judul_program LIKE ?`,
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

//Tambah Donasi
router.post('/', bukti.single('bukti_pembayaran'), async (req, res) => {
  const { id_user, jumlah_donasi, dukungan, id_program, anonymous } = req.body;
  const bukti_pembayaran = req.file ? `/bukti/${req.file.filename}` : null;

  if (!id_user || !jumlah_donasi || !id_program || !req.file) {
    return res.status(400).json({ error: 'Semua field wajib diisi' });
  }

  if (Number(jumlah_donasi) <= 0) {
    return res.status(400).json({ error: 'Jumlah Donasi Harus > 0' });
  }

  try {
    const sql = `
  INSERT INTO tbl_donasi (
    bukti_pembayaran, id_user, jumlah_donasi,
    tanggal_donasi, dukungan, id_program,
    anonymous, verifikasi, status_donasi
  ) VALUES (?, ?, ?, NOW(), ?, ?, ?, 0, 'menunggu')
`;

    await db.query(sql, [
      bukti_pembayaran,
      id_user,
      jumlah_donasi,
      dukungan || '',
      id_program,
      parseInt(anonymous) === 1 ? 1 : 0,
    ]);

    res.status(200).json({ message: 'Donasi Berhasil Ditambahkan' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menyimpan donasi' });
  }
});

//Verifikasi Donasi Berhasil
router.put('/verifikasi_berhasil/:id_donasi', async (req, res) => {
  const { id_donasi } = req.params;

  const conn = await db.getConnection(); // pastikan db pool digunakan
  try {
    await conn.beginTransaction();

    // 1. Update status donasi menjadi berhasil
    const updateStatusSql = `UPDATE tbl_donasi SET verifikasi = 1, status_donasi = 'Berhasil' WHERE id_donasi = ?`;
    await conn.query(updateStatusSql, [id_donasi]);

    // 2. Ambil data donasi terkait
    const [donasiResult] = await conn.query(
      `SELECT id_user, id_program, jumlah_donasi FROM tbl_donasi WHERE id_donasi = ?`,
      [id_donasi],
    );

    if (donasiResult.length === 0) {
      await conn.rollback();
      return res.status(404).send('Donasi tidak ditemukan');
    }

    const donasi = donasiResult[0];
    const jumlahDonasi = Number(donasi.jumlah_donasi || 0);

    // 3. Cek apakah ini donatur pertama untuk program tersebut
    const [countResult] = await conn.query(
      `SELECT COUNT(*) AS count FROM tbl_donasi 
       WHERE id_user = ? AND id_program = ? AND status_donasi = 'Berhasil' AND id_donasi <> ?`,
      [donasi.id_user, donasi.id_program, id_donasi],
    );

    const isFirstDonatur = countResult[0].count === 0;

    // 4. Update data program
    let updateProgramSql = `UPDATE tbl_programdonasi SET total_terkumpul = total_terkumpul + ?`;
    const params = [jumlahDonasi];

    if (isFirstDonatur) {
      updateProgramSql += `, jumlah_donatur = jumlah_donatur + 1`;
    }

    updateProgramSql += ` WHERE id_program = ?`;
    params.push(donasi.id_program);

    await conn.query(updateProgramSql, params);

    await conn.commit();
    res
      .status(200)
      .send('Donasi berhasil diverifikasi dan total program diperbarui');
  } catch (err) {
    await conn.rollback();
    console.error('Verifikasi Error:', err);
    res
      .status(500)
      .send(err.message || 'Terjadi kesalahan saat memverifikasi donasi');
  } finally {
    conn.release();
  }
});

// Verifikasi Donasi Gagal
router.put('/verifikasi_gagal/:id_donasi', async (req, res) => {
  const { id_donasi } = req.params;

  try {
    const [result] = await db.query(
      `UPDATE tbl_donasi SET verifikasi = 2, status_donasi = 'Gagal' WHERE id_donasi = ?`,
      [id_donasi],
    );

    if (result.affectedRows === 0) {
      return res.status(404).send('Donasi tidak ditemukan');
    }

    res.status(200).send('Donasi gagal diverifikasi');
  } catch (err) {
    console.error('Verifikasi Gagal Error:', err);
    res
      .status(500)
      .send(err.message || 'Terjadi kesalahan saat memverifikasi gagal');
  }
});

//Detail Donasi
router.get('/:id_donasi', async (req, res) => {
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
router.get('/riwayat/:id_user', async (req, res) => {
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

  try {
    const [results] = await db.query(sql, [id_user]);

    res.status(200).json(results); // kirim tetap array meskipun kosong
  } catch (err) {
    console.error('Gagal mengambil riwayat donasi:', err);
    res
      .status(500)
      .json({ error: 'Gagal mengambil riwayat donasi', detail: err });
  }
});

//Hapus Donasi
router.delete('/:id_donasi', async (req, res) => {
  const { id_donasi } = req.params;
  const sql = ' DELETE FROM tbl_donasi WHERE id_donasi = ?';

  try {
    await db.query(sql, [id_donasi]);
    res.status(200).json({ message: 'Donasi Berhasil Dihapus' });
  } catch (error) {
    console.error('Terjadi Kesalahan saat menghapus Donasi', error);
    res.status(500).json({ message: 'Terjadi Kesalahan Server' });
  }
});

//export module
module.exports = router;

