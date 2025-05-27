const express = require('express');
const router = express.Router();
const db = require('../config/db');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const stream = require('stream');

// Export Excel laporan program donasi
router.get('/export/excel', (req, res) => {
  const sql = `
    SELECT p.id_program, p.judul_program, COUNT(DISTINCT d.id_user) AS total_donatur,
           SUM(d.jumlah_donasi) AS total_donasi,
           GROUP_CONCAT(DISTINCT u.nama SEPARATOR ', ') AS nama
    FROM tbl_programdonasi p
    LEFT JOIN tbl_donasi d ON p.id_program = d.id_program
    LEFT JOIN tbl_user u ON d.id_user = u.id_user
    GROUP BY p.id_program, p.judul_program
  `;

  db.query(sql, async (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 'Gagal mengambil data laporan donasi', detail: err });
    }

    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Program Donasi');

    // Header kolom
    worksheet.columns = [
      { header: 'ID Program', key: 'id_program', width: 15 },
      { header: 'Judul Program', key: 'judul_program', width: 30 },
      { header: 'Total Donatur', key: 'total_donatur', width: 15 },
      { header: 'Total Donasi', key: 'total_donasi', width: 20 },
      { header: 'Nama Donatur', key: 'nama', width: 50 },
    ];

    // Isi data
    results.forEach((row) => {
      worksheet.addRow(row);
    });

    // Set header response
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=laporan_program_donasi.xlsx',
    );

    // Kirim file excel ke client
    await workbook.xlsx.write(res);
    res.end();
  });
});

// Export PDF laporan program donasi
router.get('/export/pdf', (req, res) => {
  const sql = `
    SELECT p.id_program, p.judul_program, COUNT(DISTINCT d.id_user) AS total_donatur,
           SUM(d.jumlah_donasi) AS total_donasi,
           GROUP_CONCAT(DISTINCT u.nama SEPARATOR ', ') AS nama
    FROM tbl_programdonasi p
    LEFT JOIN tbl_donasi d ON p.id_program = d.id_program
    LEFT JOIN tbl_user u ON d.id_user = u.id_user
    GROUP BY p.id_program, p.judul_program
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: 'Gagal mengambil data laporan donasi', detail: err });
    }

    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    let filename = 'laporan_program_donasi.pdf';
    filename = encodeURIComponent(filename);

    // Headers untuk PDF download
    res.setHeader(
      'Content-disposition',
      'attachment; filename="' + filename + '"',
    );
    res.setHeader('Content-type', 'application/pdf');

    // Pipe output PDF ke response
    doc.pipe(res);

    // Judul
    doc.fontSize(18).text('Laporan Program Donasi', { align: 'center' });
    doc.moveDown();

    // Header tabel manual
    doc.fontSize(12);
    doc.text('ID Program', { continued: true, width: 80 });
    doc.text('Judul Program', { continued: true, width: 150 });
    doc.text('Total Donatur', { continued: true, width: 90 });
    doc.text('Total Donasi', { continued: true, width: 90 });
    doc.text('Nama Donatur');
    doc.moveDown();

    // Isi data
    results.forEach((row) => {
      doc.text(row.id_program.toString(), { continued: true, width: 80 });
      doc.text(row.judul_program, { continued: true, width: 150 });
      doc.text(row.total_donatur.toString(), { continued: true, width: 90 });
      doc.text(row.total_donasi ? row.total_donasi.toString() : '0', {
        continued: true,
        width: 90,
      });
      doc.text(row.nama ? row.nama : '-');
    });

    doc.end();
  });
});
module.exports = router;

