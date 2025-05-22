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

    res.status(200).json(
      results.map((program) => {
        const persentase =
          program.target_donasi > 0
            ? Math.round(
                (program.total_terkumpul / program.target_donasi) * 100,
              )
            : 0;

        const hari_tersisa = Math.ceil(
          (new Date(program.tgl_berakhir) - new Date()) / (1000 * 60 * 60 * 24),
        );

        return {
          ...program,
          persentase,
          hari_tersisa,
        };
      }),
    );
  });
});

//Detail program
router.get('/:id_program', (req, res) => {
  const { id_program } = req.params;

  const sql = 'SELECT * FROM tbl_programdonasi WHERE id_program = ?';
  db.query(sql, [id_program], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send('Program tidak ditemukan');
    }

    const program = results[0];

    // Hitung Persentase
    const target = parseFloat(program.target_donasi);
    const terkumpul = parseFloat(program.total_terkumpul);
    const persentase = target > 0 ? Math.round((terkumpul / target) * 100) : 0;

    // Hitung Sisa Hari
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
  });
});

// Export router
module.exports = router;

