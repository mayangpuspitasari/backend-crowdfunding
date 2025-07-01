module.exports = (judul_program, donatur, total) => {
  const rows = donatur
    .map(
      (item, index) => `
        <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
          <td class="border px-3 py-2 text-center">${index + 1}</td>
          <td class="border px-3 py-2">${item.nama}</td>
          <td class="border px-3 py-2 text-center">
            ${new Date(item.tanggal_donasi).toLocaleDateString('id-ID')}
          </td>
          <td class="border px-3 py-2 text-right">
            Rp${Number(item.jumlah_donasi).toLocaleString('id-ID')}
          </td>
        </tr>
      `,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8" />
      <title>Detail Donasi - ${judul_program}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body {
          font-family: 'sans-serif';
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #d1d5db;
        }
      </style>
    </head>
    <body class="p-8 text-sm text-gray-800">
      <h1 class="text-2xl font-bold text-center mb-1">Laporan Detail Donasi</h1>
      <h2 class="text-md text-center font-medium mb-6 text-gray-600">${judul_program}</h2>

      <table class="mb-4">
        <thead class="bg-orange-100 text-orange-900">
          <tr>
            <th class="px-3 py-2">No</th>
            <th class="px-3 py-2">Nama Donatur</th>
            <th class="px-3 py-2">Tanggal Donasi</th>
            <th class="px-3 py-2">Jumlah Donasi</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
        <tfoot>
          <tr class="bg-gray-100 font-bold">
            <td colspan="3" class="px-3 py-2 text-right">Total Terkumpul</td>
            <td class="px-3 py-2 text-right text-green-700">
              Rp${Number(total).toLocaleString('id-ID')}
            </td>
          </tr>
        </tfoot>
      </table>

      <p class="text-right text-gray-500 mt-8">
        Dicetak pada: ${new Date().toLocaleString('id-ID')}
      </p>
    </body>
    </html>
  `;
};

