module.exports = (laporan) => {
  const rows = laporan.map((item, index) => `
    <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}">
      <td class="border px-2 py-1 text-center">${index + 1}</td>
      <td class="border px-2 py-1">${item.judul_program}</td>
      <td class="border px-2 py-1 text-right">Rp${Number(item.target_donasi).toLocaleString('id-ID')}</td>
      <td class="border px-2 py-1 text-right">Rp${Number(item.total_terkumpul).toLocaleString('id-ID')}</td>
      <td class="border px-2 py-1 text-center">${item.total_donatur}</td>
      <td class="border px-2 py-1 text-center">${new Date(item.tgl_mulai).toLocaleDateString('id-ID')}</td>
      <td class="border px-2 py-1 text-center">${new Date(item.tgl_berakhir).toLocaleDateString('id-ID')}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan Donasi</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: sans-serif; }
      </style>
    </head>
    <body class="p-6">
      <h1 class="text-2xl font-bold text-center mb-6">LAPORAN PROGRAM DONASI</h1>
      <table class="min-w-full border-collapse border border-gray-300 text-sm">
        <thead class="bg-orange-100 text-orange-900 font-semibold text-center">
          <tr>
            <th class="border px-2 py-1">No</th>
            <th class="border px-2 py-1">Judul Program</th>
            <th class="border px-2 py-1">Target</th>
            <th class="border px-2 py-1">Terkumpul</th>
            <th class="border px-2 py-1">Donatur</th>
            <th class="border px-2 py-1">Mulai</th>
            <th class="border px-2 py-1">Berakhir</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p class="text-sm mt-6 text-right text-gray-600">
        Dicetak pada: ${new Date().toLocaleString('id-ID')}
      </p>
    </body>
    </html>
  `;
};
