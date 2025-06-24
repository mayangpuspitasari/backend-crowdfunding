require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();

// 🔧 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Dummy test
app.get('/', (req, res) => res.send('API is running'));

// Static file untuk gambar
app.use('/instansi', express.static(path.join(__dirname, 'instansi')));
app.use('/program', express.static(path.join(__dirname, 'program')));
app.use('/bukti', express.static(path.join(__dirname, 'bukti')));
app.use('/kegiatan', express.static(path.join(__dirname, 'kegiatan')));

// Routes
app.use('/user', require('./routes/UserRoutes'));
app.use('/instansi', require('./routes/InstansiRoutes'));
app.use('/program', require('./routes/ProgramRoutes'));
app.use('/kategori', require('./routes/KategoriRoutes'));
app.use('/kegiatan', require('./routes/KegiatanRoutes'));
app.use('/donasi', require('./routes/DonasiRoutes'));
app.use('/laporan', require('./routes/LaporanRoutes'));
app.use('/download', require('./routes/DownloadRoutes'));
app.use('/komentar', require('./routes/KomentarRoutes'));

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

