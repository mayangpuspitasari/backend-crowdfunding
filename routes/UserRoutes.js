const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db');

// Menampilkan semua data pengguna
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const offset = (page - 1) * limit;
  const search = req.query.search ? `%${req.query.search}%` : `%`;

  try {
    const [results] = await db.query(
      `SELECT * FROM tbl_user WHERE role = 'donatur' AND nama LIKE ? ORDER BY id_user DESC LIMIT ? OFFSET ?`,
      [search, limit, offset],
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total FROM tbl_user WHERE role = 'donatur' AND nama LIKE ?`,
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

//Registrasi User
router.post('/register', async (req, res) => {
  const { nama, email, password, no_hp, role } = req.body;

  // Validasi Input
  if (!nama || !email || !password || !no_hp) {
    return res.status(400).send('Semua field harus diisi');
  }

  // Cek role yang dilarang
  if (role && role.toLowerCase() === 'admin') {
    return res.status(403).send('Role Admin Tidak Bisa Registrasi');
  }

  if (role && role.toLowerCase() === 'pimpinan') {
    return res.status(403).send('Role Pimpinan Tidak Bisa Registrasi');
  }

  try {
    // Cek apakah email atau no_hp sudah digunakan
    const cekUserQuery = 'SELECT * FROM tbl_user WHERE email = ? OR no_hp = ?';
    const [results] = await db.query(cekUserQuery, [email, no_hp]);

    if (results.length > 0) {
      return res.status(400).send('Email atau No HP sudah digunakan');
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const insertQuery = `
      INSERT INTO tbl_user (nama, email, password, no_hp, role)
      VALUES (?, ?, ?, ?, 'donatur')
    `;
    await db.query(insertQuery, [nama, email, hashedPassword, no_hp]);

    res.status(201).send('Registrasi berhasil');
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).send('Terjadi kesalahan server');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password,role } = req.body;

  try {
   const [users] = await db.query('SELECT * FROM tbl_user WHERE email = ? AND role = ?', [email, role]);

    const user = users[0];

    if (!user) {
      return res.status(401).json({ message: 'User tidak ditemukan' });
    }

    console.log('Email input:', email);
    console.log('Password input:', password);
    console.log('Password from DB:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign(
      {
        id: user.id_user,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' },
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user.id_user,
        nama: user.nama,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});
// Export router
module.exports = router;

