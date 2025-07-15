-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 06, 2025 at 09:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crowdfunding`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_donasi`
--

CREATE TABLE `tbl_donasi` (
  `id_donasi` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `jumlah_donasi` decimal(12,2) NOT NULL,
  `tanggal_donasi` datetime NOT NULL DEFAULT current_timestamp(),
  `verifikasi` tinyint(1) NOT NULL DEFAULT 0,
  `dukungan` text NOT NULL,
  `bukti_pembayaran` varchar(100) NOT NULL,
  `id_program` int(11) NOT NULL,
  `anonymous` tinyint(1) NOT NULL DEFAULT 0,
  `status_donasi` enum('menunggu','berhasil','gagal') NOT NULL DEFAULT 'menunggu'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_donasi`
--

INSERT INTO `tbl_donasi` (`id_donasi`, `id_user`, `jumlah_donasi`, `tanggal_donasi`, `verifikasi`, `dukungan`, `bukti_pembayaran`, `id_program`, `anonymous`, `status_donasi`) VALUES
(19, 5, 15000000.00, '2025-07-04 12:00:29', 1, 'Semoga Membantu Ya', '/bukti/1751610628993-download.jpeg', 36, 1, 'berhasil'),
(20, 5, 5000000.00, '2025-07-04 12:01:10', 1, 'semoga bermanfaat', '/bukti/1751610670256-User Interface Admin (3).png', 37, 0, 'berhasil'),
(21, 5, 7000000.00, '2025-07-04 12:01:47', 1, 'Semoga Berguna', '/bukti/1751610707262-Mayang Puspita Sari (4).png', 35, 0, 'berhasil'),
(22, 5, 4999998.00, '2025-07-04 12:06:22', 1, 'bismillah', '/bukti/1751610982114-May 24, 2025, 12_52_09 PM.png', 34, 1, 'berhasil'),
(23, 18, 15000000.00, '2025-07-04 12:11:17', 1, 'semoga berguna', '/bukti/1751611277695-May 24, 2025, 12_52_09 PM.png', 26, 1, 'berhasil'),
(24, 18, 3000000.00, '2025-07-04 12:11:52', 1, 'bagus', '/bukti/1751611312586-May 24, 2025, 12_52_09 PM.png', 33, 0, 'berhasil'),
(25, 18, 2000000.00, '2025-07-04 12:12:32', 1, 'bagus', '/bukti/1751611352354-User Interface Admin (3).png', 32, 0, 'berhasil'),
(26, 5, 2000000.00, '2025-07-04 12:16:58', 1, 'bagus', '/bukti/1751611618321-User Interface Admin (3).png', 27, 0, 'berhasil'),
(30, 5, 2000000.00, '2025-07-05 13:03:16', 1, 'semoga bermanfaat', '/bukti/1751700796026-WhatsApp Image 2025-07-05 at 11.15.55.jpeg', 39, 1, 'berhasil'),
(31, 18, 999998.00, '2025-07-05 13:05:52', 1, 'semoga berguna', '/bukti/1751700952769-WhatsApp Image 2025-07-05 at 11.09.22.jpeg', 36, 0, 'berhasil'),
(32, 5, 3000000.00, '2025-07-07 01:18:12', 2, 'baik', '/bukti/1751831292170-WhatsApp Image 2025-07-05 at 11.20.14.jpeg', 34, 1, 'gagal');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_instansi`
--

CREATE TABLE `tbl_instansi` (
  `id_instansi` int(11) NOT NULL,
  `deskripsi` text NOT NULL,
  `visi` text NOT NULL,
  `misi` text NOT NULL,
  `struktur` varchar(100) NOT NULL,
  `logo` varchar(100) NOT NULL,
  `alamat` text NOT NULL,
  `kontak` varchar(12) NOT NULL,
  `email` varchar(25) NOT NULL,
  `fb` varchar(25) NOT NULL,
  `ig` varchar(25) NOT NULL,
  `rekening` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_instansi`
--

INSERT INTO `tbl_instansi` (`id_instansi`, `deskripsi`, `visi`, `misi`, `struktur`, `logo`, `alamat`, `kontak`, `email`, `fb`, `ig`, `rekening`) VALUES
(5, 'LAZISMU Asahan adalah lembaga nirlaba yang bertugas memberdayakan masyarakat di Kabupaten Asahan, Sumatera Utara. LAZISMU Asahan menghimpun dana zakat, infaq, dan dana kedermawanan lainnya dari berbagai pihak. LAZISMU Asahan didirikan sebagai bagian dari gerakan filantropi Muhammadiyah yang berfokus pada pengelolaan zakat, infak, dan shadaqah (ZIS) di Kabupaten Asahan. Kehadirannya bertujuan mendukung masyarakat dalam menyalurkan dana zakat secara amanah dan tepat sasaran, sekaligus berkontribusi dalam memberdayakan umat di berbagai sektor. Sejak berdiri, LAZISMU Asahan terus berkembang dengan menjalankan berbagai program sosial, pendidikan, ekonomi, dan kemanusiaan yang disesuaikan dengan kebutuhan lokal.', 'Mengangkat visi \"Menjadi Lembaga Amil Zakat Terpercaya\" menerapkan proses 3P yaitu Penghimpunan, Pendistribusian dan Pendayagunaan. Menganut prinsip Amanah, Transparan, Berkemajuan, Profesional dan Layanan.', 'a.	Meningkatkan Efektifitas dan Efesiensi dalam pelayanan dan pengelolaan ZISKA (Zakat, Infaq Shadaqah)\r\nb.	Meningkatkan manfaat dan ZISKA untuk mewujudkan kesejahteraan masyarakat dan penanggulangan kemiskinan \r\nc.	Meningkatkan kemampuan ekonomi Umat', '/instansi/1751334368472-Struktur Organisasi.jpg', '/instansi/1751334368471-lazismu.png', 'Jl. Dr. Setia Budi, Kisaran Kota, Kec. Kota Kisaran Timur, Kabupaten Asahan, Sumatera Utara 21211.', '081265311204', 'lazismuasahan@gmail.com', 'Lazismu Asahan', 'lazismuasahan', '717 6788 186');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_kategori`
--

CREATE TABLE `tbl_kategori` (
  `id_kategori` int(11) NOT NULL,
  `jenis_kategori` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_kategori`
--

INSERT INTO `tbl_kategori` (`id_kategori`, `jenis_kategori`) VALUES
(1, 'Donasi Sosial'),
(2, 'Donasi Kesehatan'),
(4, 'Donasi Pendidikan'),
(13, 'Donasi Sukarela');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_kegiatan`
--

CREATE TABLE `tbl_kegiatan` (
  `id_kegiatan` int(11) NOT NULL,
  `id_program` int(11) NOT NULL,
  `judul_kegiatan` varchar(55) NOT NULL,
  `deskripsi` text NOT NULL,
  `tanggal_kegiatan` datetime NOT NULL,
  `gambar` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_kegiatan`
--

INSERT INTO `tbl_kegiatan` (`id_kegiatan`, `id_program`, `judul_kegiatan`, `deskripsi`, `tanggal_kegiatan`, `gambar`) VALUES
(8, 26, 'Penyaluran Kado Ramadhan untuk Guru Amal Usaha Muhammad', 'Lazismu Asahan bersama PC Aisyiyah Kisaran kembali melaksanakan kegiatan berbagi dalam semangat Ramadhan melalui program Kado Ramadhan. Kali ini, paket bingkisan disalurkan khusus kepada para guru yang mengajar di Amal Usaha Muhammadiyah sebagai bentuk apresiasi dan dukungan atas dedikasi mereka. Penyaluran bantuan ini dilakukan langsung oleh Pengurus Lazismu Asahan. Semoga Allah Ta\'ala senantiasa melimpahkan rahmat-Nya dan memberikan kita kesempatan untuk menjalankan ibadah Ramadhan dengan sebaik-baiknya. Jangan lupa sempurnakan Zakat, Infak, dan Sedekah Anda melalui Lazismu Asahan.', '2024-04-08 00:00:00', '/kegiatan/1751697776895-WhatsApp Image 2025-07-05 at 11.04.14.jpeg'),
(9, 35, 'Penyaluran Bantuan untuk Penderita ENTB Tuberkulosis', 'Alhamdulillah, Lazismu Asahan kembali menyalurkan bantuan melalui Program Penderita ENTB (Ekstra Paru) Tuberkulosis. Bantuan kali ini diserahkan kepada Yayasan Mentari Meraki Asa, Kabupaten Asahan, sebagai bentuk kepedulian terhadap mereka yang membutuhkan. Semoga bantuan ini membawa manfaat dan Allah memberikan kemudahan bagi kita semua dalam setiap langkah kebaikan. Mari sempurnakan Zakat, Infak, dan Sedekah Anda melalui Lazismu Asahan.', '2024-08-27 00:00:00', '/kegiatan/1751698229664-WhatsApp Image 2025-07-05 at 11.08.04.jpeg'),
(10, 39, 'Penyaluran Bantuan Kemanusiaan untuk Korban Kebakaran d', 'Alhamdulillah, Tim Lazismu Asahan telah menyalurkan bantuan kemanusiaan kepada para korban kebakaran yang terjadi di Jln. Malik Ibrahim. Bantuan ini merupakan bentuk kepedulian terhadap saudara-saudara kita yang sedang mengalami musibah. Semoga Allah memberikan kemudahan dan kekuatan kepada mereka yang terdampak, serta memberkahi setiap kebaikan yang kita lakukan. Jangan lupa sempurnakan Zakat, Infak, dan Sedekah Anda melalui Lazismu Asahan', '2024-10-11 00:00:00', '/kegiatan/1751698501163-WhatsApp Image 2025-07-05 at 11.14.22.jpeg'),
(11, 37, 'Penyaluran Beasiswa Pendidikan', 'Alhamdulillah, Tim Lazismu Asahan telah menyalurkan Program Beasiswa Mentari dan Beasiswa Sang Surya kepada siswa/i dan mahasiswa Muhammadiyah se-Kabupaten Asahan. Program ini merupakan wujud nyata dukungan terhadap pendidikan generasi muda agar terus semangat dalam menuntut ilmu. Semoga Allah memberikan kemudahan kepada kita semua dalam menebar manfaat. Jangan lupa sempurnakan Zakat, Infak, dan Sedekah Anda melalui Lazismu Asahan.', '2024-10-28 00:00:00', '/kegiatan/1751698623306-WhatsApp Image 2025-07-05 at 11.16.53.jpeg'),
(12, 33, 'Penyaluran Bantuan untuk Korban Bencana Longsor di Asah', 'Alhamdulillah, Lazismu Asahan bersama Majelis Dikdasmen PNF PDM Asahan telah menyalurkan bantuan untuk korban bencana longsor. Bantuan ini merupakan bentuk kepedulian dan solidaritas terhadap warga yang terdampak musibah. Semoga Allah memberikan kemudahan dan kekuatan bagi semua pihak yang terlibat serta masyarakat yang terdampak. Jangan lupa sempurnakan Zakat, Infak, dan Sedekah Anda melalui Lazismu Asahan.', '2024-12-19 00:00:00', '/kegiatan/1751698786030-WhatsApp Image 2025-07-05 at 11.20.14.jpeg'),
(13, 33, 'Penyaluran Bantuan Banjir Bersama PDA Asahan dan Lazism', 'Alhamdulillah, Lazismu Kabupaten Asahan bersama Pimpinan Daerah Aisyiyah (PDA) Asahan telah menyalurkan bantuan untuk korban banjir yang telah dihimpun dari masyarakat Asahan. Apresiasi setinggi-tingginya kami sampaikan kepada Ibunda PDA Asahan atas upaya luar biasa dalam penggalangan dana di lingkungan Aisyiyah Asahan. Ucapan terima kasih juga kami tujukan kepada @lazismu.sumut dan @lazismukotamedan atas sambutan hangat dan bantuannya dalam mendampingi penyaluran bantuan secara simbolis. Semoga Allah meridhoi setiap langkah dan pergerakan kita dalam menebar manfaat bagi sesama.', '2024-12-11 00:00:00', '/kegiatan/1751698906260-WhatsApp Image 2025-07-05 at 11.19.18.jpeg'),
(14, 34, 'Penyerahan Bantuan Program Sosial Dakwah untuk Renovasi', 'Alhamdulillah, Lazismu Asahan telah menyalurkan bantuan dalam Program Sosial Dakwah kepada PRM Kisaran Barat untuk mendukung renovasi Gedung Dakwah Muhammadiyah Kisaran Kota. Bantuan ini merupakan bagian dari komitmen Lazismu dalam mendukung kegiatan dakwah dan pengembangan sarana keummatan. Semoga Allah memberikan kemudahan kepada kita semua dalam menebar kebaikan. Jangan lupa sempurnakan Zakat, Infak, dan Sedekah Anda melalui Lazismu Asahan.', '2024-11-09 00:00:00', '/kegiatan/1751699915232-WhatsApp Image 2025-07-05 at 11.09.22.jpeg'),
(16, 30, 'Penyerahan Bantuan Sembako Rutin untuk Pengidap Keterbe', 'Alhamdulillah, Tim Lazismu Asahan telah menyalurkan bantuan sembako secara rutin kepada saudara-saudara kita yang mengidap keterbelakangan mental. Kegiatan ini merupakan bentuk kepedulian sosial dalam memenuhi kebutuhan dasar mereka yang membutuhkan perhatian khusus. Semoga Allah memberikan kemudahan dan keberkahan bagi kita semua. Jangan lupa sempurnakan Zakat, Infak, dan Sedekah Anda melalui Lazismu Asahan.', '2024-10-12 00:00:00', '/kegiatan/1751700185773-WhatsApp Image 2025-07-05 at 11.14.55.jpeg'),
(17, 31, 'Penyerahan Bantuan Usaha Kedai kepada Warga Desa Banjar', 'Alhamdulillah, Tim Lazismu Asahan telah menyalurkan bantuan usaha kedai kepada Ibu Sri Muliani, warga Desa Banjar, bekerja sama dengan Pimpinan Cabang Aisyiyah (PCA) Air Joman. Bantuan ini diharapkan dapat mendorong kemandirian ekonomi dan meningkatkan kesejahteraan penerima manfaat. Semoga Allah memberikan kemudahan dan keberkahan bagi kita semua. Jangan lupa sempurnakan Zakat, Infak, dan Sedekah Anda melalui Lazismu Asahan.', '2024-10-25 00:00:00', '/kegiatan/1751700317705-WhatsApp Image 2025-07-05 at 11.15.55.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_komentar`
--

CREATE TABLE `tbl_komentar` (
  `id_komentar` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_program` int(11) NOT NULL,
  `komentar` text NOT NULL,
  `tanggal_komentar` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_komentar`
--

INSERT INTO `tbl_komentar` (`id_komentar`, `id_user`, `id_program`, `komentar`, `tanggal_komentar`) VALUES
(9, 18, 26, 'semoga bermanfaat ya', '2025-07-04 12:10:42'),
(10, 5, 36, 'semoga bermanfaat ya', '2025-07-06 09:40:53'),
(11, 5, 37, 'semoga membantu', '2025-07-07 00:02:32'),
(12, 5, 34, 'tes', '2025-07-07 01:17:42');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_laporan`
--

CREATE TABLE `tbl_laporan` (
  `id_laporan` int(11) NOT NULL,
  `total_program` int(11) NOT NULL,
  `total_donasi` int(11) NOT NULL,
  `total_user` int(11) NOT NULL,
  `tanggal_cetak` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_programdonasi`
--

CREATE TABLE `tbl_programdonasi` (
  `id_program` int(11) NOT NULL,
  `judul_program` varchar(100) NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` varchar(100) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `tgl_mulai` datetime NOT NULL,
  `tgl_berakhir` datetime NOT NULL,
  `jumlah_donatur` int(10) NOT NULL,
  `target_donasi` decimal(12,2) NOT NULL,
  `total_terkumpul` decimal(12,2) NOT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_programdonasi`
--

INSERT INTO `tbl_programdonasi` (`id_program`, `judul_program`, `deskripsi`, `gambar`, `id_kategori`, `tgl_mulai`, `tgl_berakhir`, `jumlah_donatur`, `target_donasi`, `total_terkumpul`, `status`) VALUES
(26, 'Kado Ramadhan Untuk Dhuafah dan Yatim', 'Bulan suci Ramadhan adalah waktu yang penuh berkah, di mana setiap amal kebaikan akan dilipatgandakan. Melalui program Kado Ramadhan, Lazismu Asahan mengajak Anda untuk berbagi kebahagiaan dengan anak-anak yatim dan keluarga dhuafa yang membutuhkan.\r\n\r\nDalam program ini, donasi yang Anda salurkan akan diwujudkan dalam bentuk paket kebutuhan pokok, bingkisan lebaran, hingga bantuan tunai yang langsung disalurkan ke berbagai wilayah di Asahan. Kegiatan ini tidak hanya membawa senyum bagi mereka yang menerima, tapi juga menjadi jembatan pahala untuk para donatur.\r\n\r\nMari sempurnakan Ramadhan kita dengan sedekah terbaik.\r\nBerbagi di bulan penuh berkah, bahagiakan mereka yang berhak.', '/program/1751696203459-WhatsApp Image 2025-07-05 at 11.03.23.jpeg', 1, '2024-01-28 00:00:00', '2024-03-14 00:00:00', 1, 10000000.00, 15000000.00, 'Tidak Aktif'),
(27, 'Open Donasi: Peduli Korban Banjir Bandang', 'Banjir bandang yang melanda sejumlah wilayah di Sumatra Barat telah menyebabkan kerusakan parah, menghancurkan rumah-rumah warga, fasilitas umum, serta memaksa banyak keluarga kehilangan tempat tinggal dan harta benda.\r\nLazismu Asahan membuka program donasi darurat untuk membantu para korban bencana. Bantuan yang terkumpul akan disalurkan dalam bentuk sembako, pakaian layak, perlengkapan kebersihan, air bersih, dan kebutuhan mendesak lainnya.\r\nSaat saudara kita diuji, inilah saatnya kita hadir memberikan kepedulian nyata.\r\nMari ulurkan tangan, ringankan beban mereka.\r\nSetiap donasi Anda adalah harapan bagi mereka yang terdampak.', '/program/1751695771627-WhatsApp Image 2025-07-05 at 11.05.39.jpeg', 1, '2024-05-09 00:00:00', '2024-06-24 00:00:00', 1, 7000000.00, 2000000.00, 'Tidak Aktif'),
(30, 'Bantuan Sembako: Ringankan Beban, Tebar Kebaikan', 'Dalam upaya membantu masyarakat kurang mampu, Lazismu Asahan mengadakan program Bantuan Sembako yang bertujuan untuk meringankan beban ekonomi penerima manfaat. Bantuan ini diberikan kepada para dhuafa, lansia, dan warga yang terdampak kondisi ekonomi sulit.\r\n\r\nMelalui program ini, paket sembako berisi kebutuhan pokok seperti beras, minyak goreng, gula, dan bahan makanan lainnya disalurkan langsung kepada mereka yang membutuhkan.\r\n\r\n✨ Uluran tangan Anda akan sangat berarti bagi mereka.\r\nMari bersama tebar kebaikan, ringankan beban saudara kita.\r\nBersama Lazismu Asahan, wujudkan kepedulian nyata.', '/program/1751696248750-WhatsApp Image 2025-07-05 at 11.06.20.jpeg', 13, '2024-07-02 00:00:00', '2025-08-27 00:00:00', 0, 15000000.00, 0.00, 'Aktif'),
(31, 'Bantuan UMKM: Bangkit Bersama, Kuatkan Ekonomi ', 'Lazismu Asahan melalui program Bantuan UMKM berkomitmen untuk mendukung pelaku usaha kecil agar tetap bertahan dan berkembang di tengah tantangan ekonomi. Bantuan ini diberikan dalam bentuk modal usaha, peralatan pendukung, atau pembinaan ringan yang dapat membantu pelaku UMKM meningkatkan produktivitas mereka.\r\n\r\nDengan program ini, Lazismu tidak hanya membantu secara langsung, tetapi juga mendorong kemandirian ekonomi masyarakat sebagai bentuk nyata pemberdayaan.\r\n\r\n🌱 Mari berdayakan, bukan sekadar memberi.\r\nDukung usaha kecil, bangun ketahanan ekonomi umat bersama Lazismu Asahan.', '/program/1751696293946-WhatsApp Image 2025-07-05 at 11.07.01.jpeg', 1, '2024-07-02 00:00:00', '2025-09-08 00:00:00', 0, 12000000.00, 0.00, 'Aktif'),
(32, 'Open Donasi: Pembangunan Masjid Taqwa Muhammadiyah ', 'Masjid adalah pusat ibadah dan aktivitas keumatan. Kini, Masjid Taqwa Muhammadiyah di Rawang Pasar IV tengah dalam proses pembangunan untuk menghadirkan tempat ibadah yang layak, nyaman, dan representatif bagi masyarakat sekitar.\r\n\r\nLazismu Asahan mengajak seluruh dermawan untuk ikut serta dalam Open Donasi Pembangunan Masjid ini. Dana yang terkumpul akan digunakan untuk pembangunan fisik, sarana pendukung, serta perlengkapan ibadah.\r\n\r\n🏗️ Mari jadi bagian dari amal jariyah yang tak terputus.\r\n💛 Satu bata dari Anda, menjadi pijakan pahala untuk selamanya.\r\n\r\nSalurkan donasi terbaik Anda melalui Lazismu Asahan.\r\n“Barang siapa membangun masjid karena Allah, maka Allah akan bangunkan untuknya rumah di surga.” (HR. Bukhari & Muslim)', '/program/1751695673498-WhatsApp Image 2025-07-05 at 11.12.19.jpeg', 1, '2024-09-18 00:00:00', '2024-10-25 00:00:00', 1, 6000000.00, 2000000.00, 'Tidak Aktif'),
(33, 'Open Donasi: Banjir & Tanah Longsor Sumatra Utara', 'Musibah banjir dan tanah longsor yang melanda beberapa wilayah di Sumatra Utara telah menyebabkan kerusakan parah, menggenangi permukiman warga, dan memutus akses transportasi. Banyak keluarga yang kehilangan tempat tinggal, harta benda, dan membutuhkan bantuan darurat.\r\n\r\nLazismu Asahan mengajak seluruh masyarakat untuk ikut serta dalam Open Donasi Peduli Bencana Sumatra Utara. Dana yang terkumpul akan disalurkan untuk kebutuhan logistik darurat seperti makanan, air bersih, pakaian, obat-obatan, dan perlengkapan kebersihan bagi para korban terdampak.\r\n\r\n🌿 Saat mereka dalam kesulitan, mari kita hadir membawa harapan.\r\n🤲 Donasi Anda adalah bentuk nyata kepedulian dan solidaritas kemanusiaan.\r\n\r\nSalurkan bantuan Anda melalui Lazismu Asahan dan bantu mereka bangkit kembali.', '/program/1751695869620-WhatsApp Image 2025-07-05 at 11.18.26.jpeg', 1, '2024-11-21 00:00:00', '2024-12-01 00:00:00', 1, 5000000.00, 3000000.00, 'Tidak Aktif'),
(34, 'Bantu Dakwah: Kuatkan Syiar, Tegakkan Nilai Islam', 'Setiap anak berhak atas pendidikan yang layak. Melalui program Bantuan Pendidikan, Lazismu Asahan membantu siswa-siswi dari keluarga kurang mampu melalui bantuan biaya sekolah, perlengkapan belajar, hingga perbaikan sarana pendidikan.\r\n\r\n🌱 Satu donasi Anda adalah investasi jangka panjang untuk generasi penerus bangsa.\r\nMari bersama wujudkan pendidikan yang merata dan berkualitas.\r\n\r\n', '/program/1751696467214-WhatsApp Image 2025-07-05 at 11.11.36.jpeg', 13, '2024-09-07 00:00:00', '2025-09-24 00:00:00', 1, 10000000.00, 4999998.00, 'Aktif'),
(35, 'Bantu Sehat: Peduli Kesehatan, Selamatkan Sesama', 'Program Bantuan Kesehatan difokuskan untuk membantu masyarakat yang kesulitan mengakses layanan medis. Bantuan disalurkan untuk pengobatan, pembelian obat-obatan, alat kesehatan, hingga dukungan bagi penderita penyakit kronis dan langka.\r\n\r\n🤲 Dengan kepedulian kita, banyak nyawa bisa tertolong.\r\nDukung mereka yang sedang berjuang untuk sembuh, bersama Lazismu Asahan.', '/program/1751696401995-WhatsApp Image 2025-07-05 at 11.19.46.jpeg', 2, '2025-08-26 00:00:00', '2025-08-30 00:00:00', 1, 20000000.00, 7000000.00, 'Aktif'),
(36, 'Dari Asahan untuk Palestina: Mari Ulurkan Tangan', 'Kondisi kemanusiaan di Palestina semakin memprihatinkan. Ribuan warga kehilangan tempat tinggal, akses air, dan kebutuhan pokok akibat konflik yang tak kunjung reda.\r\n\r\nMelalui Open Donasi Palestina, Lazismu Asahan mengajak masyarakat untuk menunjukkan solidaritas dan membantu sesama muslim di tanah suci. Bantuan akan disalurkan untuk makanan, obat-obatan, air bersih, pakaian, dan layanan medis darurat.\r\n\r\n🤍 Dari Asahan, mari kirimkan kepedulian kita.\r\nSetiap donasi Anda adalah bukti cinta dan ukhuwah Islamiyah.', '/program/1751695634081-WhatsApp Image 2025-07-05 at 11.15.17.jpeg', 1, '2024-10-15 00:00:00', '2025-09-16 00:00:00', 2, 25000000.00, 15999998.00, 'Aktif'),
(37, 'Bantu Pendidikan: Akses Ilmu untuk Masa Depan Cerah', 'Setiap anak berhak atas pendidikan yang layak. Melalui program Bantuan Pendidikan, Lazismu Asahan membantu siswa-siswi dari keluarga kurang mampu melalui bantuan biaya sekolah, perlengkapan belajar, hingga perbaikan sarana pendidikan.\r\n\r\n🌱 Satu donasi Anda adalah investasi jangka panjang untuk generasi penerus bangsa.\r\nMari bersama wujudkan pendidikan yang merata dan berkualitas.', '/program/1751695573758-WhatsApp Image 2025-07-05 at 11.10.17.jpeg', 4, '2024-07-04 00:00:00', '2025-09-09 00:00:00', 1, 20000000.00, 5000000.00, 'Aktif'),
(39, 'Open Donasi untuk Korban Kebakaran di Jln. Malik Ibrahim Kisaran', 'Telah terjadi musibah kebakaran di Jln. Malik Ibrahim, Kisaran, yang menghanguskan sejumlah rumah warga dan menyebabkan kerugian besar. Dalam situasi darurat ini, kami mengajak para dermawan untuk turut membantu meringankan beban para korban. Donasi yang terkumpul akan digunakan untuk memenuhi kebutuhan mendesak seperti makanan, pakaian, perlengkapan tidur, dan bantuan tempat tinggal sementara. Uluran tangan Anda sangat berarti bagi mereka yang sedang tertimpa musibah.', '/program/1751696134638-WhatsApp Image 2025-07-05 at 11.12.52.jpeg', 1, '2024-09-24 00:00:00', '2024-11-04 00:00:00', 1, 5000000.00, 2000000.00, 'Tidak Aktif');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id_user` int(11) NOT NULL,
  `nama` varchar(25) NOT NULL,
  `email` varchar(35) NOT NULL,
  `no_hp` varchar(12) NOT NULL,
  `foto` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` enum('admin','donatur','pimpinan') NOT NULL,
  `tanggal_daftar` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id_user`, `nama`, `email`, `no_hp`, `foto`, `password`, `role`, `tanggal_daftar`) VALUES
(3, 'Ega Kurniawan', 'ega@gmail.com', '087765432155', '', '$2b$10$TbsID2Tb', 'donatur', '2025-06-22 11:59:46'),
(4, 'wahyu', 'wahyu@gmail.com', '098765432133', '', '$2b$10$bqbeYN2r', 'donatur', '2025-06-22 12:27:21'),
(5, 'Mayang Puspita Sari ', 'mayangpuspita@gmail.com', '082265432211', '/profil/1751261910598-react.png', '$2b$10$uQjVXh7sNs7JxNdofzOBTeqDEUAxAK2HJaZvpT26ak./rjps8GcSa', 'donatur', '2025-06-22 13:52:33'),
(6, 'Mayy', 'may@gmail.com', '083323412345', '', '$2b$10$wRmBoQMA6BAcjaaZuDUefuzXYCNCesmFrFE0uUldpLWQh3J4Mc9Zm', 'donatur', '2025-06-24 13:06:44'),
(9, 'Admin', 'admin@gmail.com', '123456789900', '/profil/1751252869057-lazismu.png', '$2b$10$EEiRyTxDreOeEC9v/e/WV.Hr1o/Wu3FnydzwLUvAFwZMxo.g3ctQi', 'admin', '2025-06-24 14:02:25'),
(15, 'Pimpinan', 'pimpinan@gmail.com', '085342665433', '/profil/1751263323015-lazismu.png', '$2b$10$njRON28BeWrvCgVKg6GiaOFfROnVItZ4rd7pPBX8sSbpvCuvumAlW', 'pimpinan', '2025-06-24 21:21:59'),
(17, 'Ega', 'ega2@gmail.com', '085543213456', '', '$2b$10$bT5klv5gYwnWkSgqBWYFoeiuQnzGOxSTYTdRhHqiaQZOyex8nlcnq', 'donatur', '2025-06-30 08:19:42'),
(18, 'Reza', 'reza@gmail.com', '082234213321', '', '$2b$10$hA25tBiYm7gp2byiy5uxs.hULNz.o.DYtFvAkPTVuE00ENsCIbY1i', 'donatur', '2025-07-03 09:54:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_donasi`
--
ALTER TABLE `tbl_donasi`
  ADD PRIMARY KEY (`id_donasi`),
  ADD KEY `fk_donasi_program` (`id_program`),
  ADD KEY `fk_donasi_user` (`id_user`);

--
-- Indexes for table `tbl_instansi`
--
ALTER TABLE `tbl_instansi`
  ADD PRIMARY KEY (`id_instansi`);

--
-- Indexes for table `tbl_kategori`
--
ALTER TABLE `tbl_kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `tbl_kegiatan`
--
ALTER TABLE `tbl_kegiatan`
  ADD PRIMARY KEY (`id_kegiatan`),
  ADD KEY `fk_kegiatan_program` (`id_program`);

--
-- Indexes for table `tbl_komentar`
--
ALTER TABLE `tbl_komentar`
  ADD PRIMARY KEY (`id_komentar`),
  ADD KEY `fk_komentar_program` (`id_program`),
  ADD KEY `fk_komentar_user` (`id_user`);

--
-- Indexes for table `tbl_laporan`
--
ALTER TABLE `tbl_laporan`
  ADD PRIMARY KEY (`id_laporan`);

--
-- Indexes for table `tbl_programdonasi`
--
ALTER TABLE `tbl_programdonasi`
  ADD PRIMARY KEY (`id_program`),
  ADD KEY `fk_program_kategori` (`id_kategori`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `no_hp` (`no_hp`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_donasi`
--
ALTER TABLE `tbl_donasi`
  MODIFY `id_donasi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `tbl_instansi`
--
ALTER TABLE `tbl_instansi`
  MODIFY `id_instansi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tbl_kategori`
--
ALTER TABLE `tbl_kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tbl_kegiatan`
--
ALTER TABLE `tbl_kegiatan`
  MODIFY `id_kegiatan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tbl_komentar`
--
ALTER TABLE `tbl_komentar`
  MODIFY `id_komentar` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `tbl_laporan`
--
ALTER TABLE `tbl_laporan`
  MODIFY `id_laporan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_programdonasi`
--
ALTER TABLE `tbl_programdonasi`
  MODIFY `id_program` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_donasi`
--
ALTER TABLE `tbl_donasi`
  ADD CONSTRAINT `fk_donasi_program` FOREIGN KEY (`id_program`) REFERENCES `tbl_programdonasi` (`id_program`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_donasi_user` FOREIGN KEY (`id_user`) REFERENCES `tbl_user` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_kegiatan`
--
ALTER TABLE `tbl_kegiatan`
  ADD CONSTRAINT `fk_kegiatan_program` FOREIGN KEY (`id_program`) REFERENCES `tbl_programdonasi` (`id_program`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_komentar`
--
ALTER TABLE `tbl_komentar`
  ADD CONSTRAINT `fk_komentar_program` FOREIGN KEY (`id_program`) REFERENCES `tbl_programdonasi` (`id_program`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_komentar_user` FOREIGN KEY (`id_user`) REFERENCES `tbl_user` (`id_user`) ON DELETE CASCADE;

--
-- Constraints for table `tbl_programdonasi`
--
ALTER TABLE `tbl_programdonasi`
  ADD CONSTRAINT `fk_program_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `tbl_kategori` (`id_kategori`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
