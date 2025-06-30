const express = require('express');
const router = express.Router();
const db = require('../config/db');
const puppeteer = require('puppeteer');
const generateHTML = require('../utils/laporanTemplate');

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
    const html = generateHTML(laporan);

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

module.exports = router;
