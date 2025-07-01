const express = require('express');
const router = express.Router();
const db = require('../config/db');
const puppeteer = require('puppeteer');
const generateHTML = require('../utils/laporanTemplate');
const generateDetailHTML = require('../utils/laporanDetailTemplate');

router.get('/export/pdf', async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.id_program,
        p.judul_program,
        p.target_donasi,
        p.tgl_mulai,
        p.tgl_berakhir,
        COUNT(DISTINCT d.id_user) AS total_donatur,
        COALESCE(SUM(d.jumlah_donasi), 0) AS total_terkumpul
      FROM tbl_programdonasi p
      LEFT JOIN tbl_donasi d ON p.id_program = d.id_program
      GROUP BY 
        p.id_program, p.judul_program, p.target_donasi, p.tgl_mulai, p.tgl_berakhir
      ORDER BY p.tgl_mulai DESC
    `;

    const [laporan] = await db.query(sql);

    // Hitung total keseluruhan
    const totalKeseluruhan = laporan.reduce(
      (acc, item) => acc + Number(item.total_terkumpul),
      0,
    );

    const html = generateHTML(laporan, totalKeseluruhan);

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=laporan_donasi.pdf',
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Gagal export PDF:', err);
    res.status(500).json({ error: 'Gagal membuat laporan PDF' });
  }
});

//detail laporan
router.get('/export/detail/:id_program', async (req, res) => {
  const { id_program } = req.params;

  try {
    const [[program]] = await db.query(
      `SELECT judul_program FROM tbl_programdonasi WHERE id_program = ?`,
      [id_program],
    );

    if (!program) {
      return res.status(404).json({ error: 'Program tidak ditemukan' });
    }

    const [donatur] = await db.query(
      `SELECT 
        u.nama, 
        d.jumlah_donasi, 
        d.tanggal_donasi 
      FROM tbl_donasi d
      JOIN tbl_user u ON d.id_user = u.id_user
      WHERE d.id_program = ?
      ORDER BY d.tanggal_donasi ASC`,
      [id_program],
    );

    const total = donatur.reduce(
      (sum, item) => sum + Number(item.jumlah_donasi),
      0,
    );

    const html = generateDetailHTML(program.judul_program, donatur, total);

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=detail_donasi_${id_program}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Gagal export detail PDF:', err);
    res.status(500).json({ error: 'Gagal membuat detail PDF' });
  }
});

module.exports = router;

