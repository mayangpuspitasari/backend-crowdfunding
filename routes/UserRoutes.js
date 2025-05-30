const express = require('express');
const router = express.Router();
const db = require ('../coonfig/db');

// Menampilkan semua data pengguna
router.get('/', (req,res) => {
    const sql = "SELECT * FROM tbl_user WHERE role ='donatur' ";
    db.query(sql,(err,results) => {
        if (err) => {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
    
});

//Registrasi User
router.post('/register', (req,res) => {
    const {nama,email,password,no_hp}=req.body;

    //Validasi Input
    if(!nama || !email || !password || !no_hp) {
        .status(400).sen('Semuai Field Haruus Di Isi');
    }

    if (role && role.toLowerCase() === 'admin') {
        return res.status(403).send('Role Admin Tidak Bisa Melakukan Registrasi');
    }

    if (role && role.toLowerCase() === 'pimpinan') {
        return res.status(403).send('Role pimpinan Tidak Bisa Melakukan Registrasi');
    }

    try {
        //cek apakah email dan no hp sudah ada
        const cekUser = 'SELECT * FROM tbl_user WHERE email = ? OR no_hp = ?';
        const [results] = await db.promise().query(cekUser, [email, no_hp]);

        if (results.length > 0)
            return res.status(400).send('Email dan No Hp Sudah Digunakan');

        //Hash Passwoed
        const hashPassword = await bcrypt.hash(password, 10);


        //simpan ke database;
        const sql = 'INSERT INTO tbl_user (nama,email,password,no_hp) VALUES (?, ?, ?, ?)';
        await db.promise().query(sql, [nama, email, hashPassword, no_hp]);

        res.status(201).send('Registrasi Berhasil');
    } catch (err) {
        console.error(err);
        res.status(500).send('Terjadi Kesalahan Server');
    }
});

// Login

const SECRET_KEY = process.env.JWT_SECRET || 'rahasia';

router.post('/login', (req,res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({ message: 'Email dan Password Harus Diisi Dengan Benar'});
    }

    try {
        //cek apakah user ada di database
        cons sql = 'SELECT * FROM tbl_user WHERE email = ?';
        const [results] = await db.promise().query(sql, [email]);

        if (results.length > 0) {
            return res.status(404).json({ message: 'User Tidak Ditemukan'});
        }

        const user = results[0];

        //validasi password dengan bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password Salah'});
        }

        //Buat Token JWT dengan payload dan secret_kkey
         const token = jwt.sign({ id: user.id_user, role: user.role }, SECRET_KEY, {
         expiresIn: '24h',
    });

    // Kembalikan token, role, email, dan user_id kepada client
    res.status(200).json({
      token,
      role: user.role,
      email: user.email,
      id_user: user.id_user, // Tambahkan user_id di sini
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server.' });
  }
})