const express = require('express');
const router = express.Router();
const db = require('../config/db');
const program = require('../mildware/program');

//mengambil semua program
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : '%';

  try {
    // Ambil data sesuai pencarian + pagination
    const [results] = await db.query(
      `
      SELECT 
        p.*, 
        k.jenis_kategori,
        DATEDIFF(p.tgl_berakhir, CURDATE()) AS hari_tersisa
      FROM tbl_programdonasi p
      JOIN tbl_kategori k ON p.id_kategori = k.id_kategori
      WHERE p.judul_program LIKE ?
      LIMIT ? OFFSET ?
    `,
      [search, limit, offset],
    );

    // Hitung total hasil pencarian (tanpa limit-offset)
    const [[{ total }]] = await db.query(
      `
      SELECT COUNT(*) as total 
      FROM tbl_programdonasi p
      JOIN tbl_kategori k ON p.id_kategori = k.id_kategori
      WHERE p.judul_program LIKE ?
    `,
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

  //vALIDASI FIELD
  const validasiFields = [
    'judul_program',
    'deskripsi',
    'id_kategori',
    'tgl_mulai',
    'tgl_berakhir',
    'jumlah_donatur',
    'target_donasi',
    'total_terkumpul',
    'status',
  ];

  for (const field of validasiFields) {
    const value = req.body[field];

    //ubah semua jadi string dulu baru di-trim
    if (!value || String(value).trim() === '') {
      return res.status(400).send({ error: `${field} Tidak Boleh Kosong` });
    }
  }

  //Validasi Gambar File
  if (!req.file) {
    return res.status(400).send({ error: 'Gambar Tidak Boleh Kosong' });
  }

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
router.get('/terbaru', async (req, res) => {
  const sql = `
    SELECT p.*, k.jenis_kategori 
    FROM tbl_programdonasi p
    JOIN tbl_kategori k ON p.id_kategori = k.id_kategori
    ORDER BY p.id_program DESC
    LIMIT 3
  `;

  try {
    const [results] = await db.query(sql);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }

    const data = results.map((program) => {
      const persentase =
        program.target_donasi > 0
          ? Math.round((program.total_terkumpul / program.target_donasi) * 100)
          : 0;

      const hari_tersisa = Math.ceil(
        (new Date(program.tgl_berakhir) - new Date()) / (1000 * 60 * 60 * 24),
      );

      return {
        ...program,
        persentase,
        hari_tersisa,
      };
    });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Ringkasan Donasi
router.get('/ringkasan', async (req, res) => {
  try {
    const [programRows] = await db.query(
      'SELECT COUNT(*) AS totalProgram FROM tbl_programdonasi',
    );
    const [donasiRows] = await db.query(
      'SELECT SUM(total_terkumpul) AS totalDonasi FROM tbl_programdonasi',
    );
    const [donaturRows] = await db.query(
      "SELECT COUNT(DISTINCT id_user) AS totalDonatur FROM tbl_user WHERE role = 'donatur'",
    );

    const totalProgram = programRows[0]?.totalProgram || 0;
    const totalDonasi = donasiRows[0]?.totalDonasi || 0;
    const totalDonatur = donaturRows[0]?.totalDonatur || 0;

    res.json({
      totalProgram,
      totalDonasi,
      totalDonatur,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Gagal mengambil data ringkasan',
      error: error.message,
    });
  }
});

// Detail program
router.get('/:id_program', async (req, res) => {
  const { id_program } = req.params;

  try {
    const [results] = await db.query(
      'SELECT * FROM tbl_programdonasi WHERE id_program = ?',
      [id_program],
    );

    if (results.length === 0) {
      return res.status(404).json({ message: 'Program tidak ditemukan' });
    }

    const program = results[0];

    // Hitung persentase
    const target = parseFloat(program.target_donasi);
    const terkumpul = parseFloat(program.total_terkumpul);
    const persentase = target > 0 ? Math.round((terkumpul / target) * 100) : 0;

    // Hitung sisa hari
    const today = new Date();
    const endDate = new Date(program.tgl_berakhir);
    const selisihMs = endDate - today;
    const sisa_hari =
      selisihMs > 0 ? Math.ceil(selisihMs / (1000 * 60 * 60 * 24)) : 0;

    // Gabungkan hasil ke response
    const detailProgram = {
      ...program,
      persentase,
      sisa_hari,
    };

    res.json(detailProgram);
  } catch (err) {
    console.error('Error saat mengambil detail program:', err);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Export router
module.exports = router;

