/* Pembuat Panduan Petualangan TKA SD (15 Okt 2026)
   ---------------------------------------------------------------
   Satu sumber isi (ISI di bawah) → dua berkas di akar proyek, dibuka lewat tombol 📘 Panduan di kepala halaman:
     Panduan_Petualangan_TKA_SD.pdf   (dicetak Chrome/Edge tanpa jendela, lewat DevTools Protocol)
     Panduan_Petualangan_TKA_SD.docx  (paket npm "docx")
   Jalankan dari akar proyek:
     npm i --no-save --no-package-lock docx@9      (sekali; node_modules diabaikan git)
     node alat/buat-panduan.js
   Ubah isi panduan di sini bila tampilan atau aturan aplikasi berubah, lalu jalankan ulang. */
"use strict";
const fs = require("fs"), path = require("path"), os = require("os"), { spawn } = require("child_process");

const AKAR = path.join(__dirname, ".."), NAMA = "Panduan_Petualangan_TKA_SD";
const JUDUL = "Panduan Petualangan TKA SD", VERSI = "18 Oktober 2026";

/* ================= Isi panduan =================
   Blok: H1/H2/H3 (judul, dinomori otomatis), P (paragraf), UL/OL (daftar), TB (tabel: kepala, baris, lebar relatif),
   KOTAK (jenis: info | saran | awas | bahaya), STAT (kotak angka contoh). Teks boleh memakai **tebal**. */
const H1 = s => ({ t: "h1", s }), H2 = s => ({ t: "h2", s }), H3 = s => ({ t: "h3", s }), P = s => ({ t: "p", s });
const UL = (...a) => ({ t: "ul", a }), OL = (...a) => ({ t: "ol", a });
const TB = (kepala, baris, lebar) => ({ t: "tb", kepala, baris, lebar: lebar || kepala.map(() => 1) });
const KOTAK = (jenis, judul, ...isi) => ({ t: "kotak", jenis, judul, isi });
const STAT = (ket, ...a) => ({ t: "stat", a, ket });

const ISI = [
  H1("Mengenal Petualangan TKA SD"),
  P("Petualangan TKA SD adalah latihan **Tes Kemampuan Akademik (TKA) SD/MI** yang dikemas seperti permainan. Anak menjelajahi pulau, menyelesaikan misi level demi level, mengumpulkan bintang, koin, dan piala, lalu menguji diri dengan Pos Tes dan Simulasi TKA. Aplikasi dibuka lewat peramban (Chrome disarankan) dan tidak memerlukan akun: kemajuan tersimpan di perangkat dan, bila tersambung internet, juga tersimpan online lewat **Kode Anak**."),
  P("Panduan ini untuk siapa saja: **orang tua** yang memantau, **guru atau pendamping** yang membantu, dan **anak** yang ingin tahu cara bermain. Bagian 3 ditulis untuk anak; bagian 4–8 terutama untuk orang dewasa."),
  H2("Susunan materi: Pulau, Pos, Misi, dan Level"),
  P("Materi tersusun berjenjang seperti peta petualangan:"),
  TB(["Istilah", "Arti", "Contoh"], [
    ["**Pulau**", "Satu mata pelajaran.", "Pulau Matematika, Pulau Bahasa Indonesia, Pulau Bahasa Inggris"],
    ["**Pos** (di Bahasa Indonesia disebut **Jurus**)", "Kelompok materi di dalam pulau. Setiap pos diakhiri **Pos Tes**.", "Pos 1 · Bilangan; Jurus Menemukan"],
    ["**Misi**", "Satu topik. Setiap misi berisi **10 level**.", "Pecahan; Ide pokok & urutan; Family · Keluarga dan orang"],
    ["**Level**", "Anak tangga di dalam misi, dari sangat mudah sampai Bos Terakhir.", "Level 1 Sangat Mudah … Level 10 Bos Terakhir"],
  ], [1.2, 2.2, 2.4]),
  TB(["Pulau", "Isi", "Keterangan"], [
    ["🏝️ **Matematika**", "4 pos · 20 misi · 200 level", "Mapel TKA. Bilangan, Aljabar, Pengukuran & Bangun, Data & Peluang, ditambah **Pos TKA** (10 paket simulasi)."],
    ["📖 **Bahasa Indonesia**", "3 jurus · 9 misi · 90 level", "Mapel TKA. Jurus Menemukan, Memahami, Menalar; setiap soal punya bacaan. Ditambah **Pos TKA**."],
    ["🌍 **Bahasa Inggris**", "7 pos · 54 misi · 540 level", "**Materi tambahan**, tidak diujikan di TKA SD. Tidak dihitung untuk kesiapan TKA dan Piala Raksasa. Setiap misi punya latihan **Dengar & Baca**."],
  ], [1.3, 1.5, 3.6]),
  H2("Sepuluh level dalam satu misi"),
  TB(["Level", "Tingkat", "Keterangan"], [
    ["1–2", "Sangat Mudah", "Pemanasan, mengenal konsep."],
    ["3–4", "Mudah", "Soal dasar."],
    ["5–6", "Sedang", "Mulai level 6, bentuk soal seperti TKA: pilihan ganda, PG kompleks (jawaban lebih dari satu), dan benar–salah."],
    ["7", "Sulit", "Soal bertingkat."],
    ["8", "**Setara TKA**", "Tingkat kesulitan sama dengan soal TKA."],
    ["9", "Di Atas TKA", "Lebih sulit dari TKA (soal penalaran/HOTS)."],
    ["10", "Bos Terakhir", "Penutup misi. Lulus Level 10 = **misi selesai** dan mendapat piala misi. Di **Matematika** dan **Bahasa Indonesia**, soal Level 10 adalah campuran soal Level 8 dan 9 (tidak lebih sulit dari Level 9)."],
  ], [0.8, 1.4, 4.2]),
  H2("Istilah yang sering muncul"),
  TB(["Istilah", "Arti yang dipakai aplikasi"], [
    ["**Lulus level**", "Semua soal di level itu selesai dengan jumlah salah tidak melebihi **batas salah** (bawaan: 5 soal per level, boleh salah 1×). Setelah lulus, level berikutnya terbuka."],
    ["**Bintang** ⭐", "Nilai 0–3 untuk tiap level (lihat tabel di bawah). Satu misi paling banyak 30 bintang."],
    ["**Koin** 💰", "Hadiah dari jawaban benar, lulus level, Tantangan Harian, dan tes. Menentukan **gelar** anak."],
    ["**Api semangat** 🔥", "Banyak hari berturut-turut anak berlatih. Padam (abu-abu) bila kemarin tidak berlatih."],
    ["**Akurasi / % benar**", "Jawaban benar ÷ seluruh jawaban × 100%. Di Dasbor Ortu, jawaban pada nomor yang diulang juga dihitung."],
    ["**Benar langsung**", "Soal yang dijawab benar pada percobaan pertama (tampil di layar hasil level)."],
    ["**Waktu belajar**", "Lama mengerjakan soal. Satu soal dihitung paling lama **5 menit**, supaya HP yang ditinggal tidak membuat angka membengkak."],
  ], [1.6, 4.8]),
  H3("Cara mendapat bintang"),
  TB(["Bintang", "Syarat"], [
    ["⭐⭐⭐", "Lulus **tanpa salah** dan **tanpa petunjuk** Kiko 🦉."],
    ["⭐⭐", "Lulus tanpa salah tetapi memakai petunjuk, **atau** lulus dengan salah (masih dalam batas) tanpa petunjuk."],
    ["⭐", "Lulus dengan salah **dan** memakai petunjuk."],
    ["–", "Belum lulus. Level boleh diulang kapan saja; yang dicatat bintang terbaik."],
  ], [1, 5.4]),
  H3("Koin dan gelar"),
  TB(["Kegiatan", "Koin"], [
    ["Setiap jawaban benar di level", "+10"],
    ["Lulus level untuk pertama kali", "+20 + 5 × nomor level (Level 1: +25, Level 10: +70)"],
    ["Lulus level yang sudah pernah lulus", "+5"],
    ["Tantangan Harian selesai", "+50 (ditambah +10 per jawaban benar)"],
    ["Pos Tes / Simulasi TKA", "+5 per jawaban benar; +100 saat pertama kali tuntas (nilai ≥ 70); +300 saat 10 paket simulasi satu mapel tuntas"],
    ["Sub level Dengar & Baca (Bahasa Inggris)", "+5 per jawaban benar; +30 saat pertama kali lulus"],
  ], [3.6, 2.8]),
  TB(["Koin terkumpul", "Gelar di bawah nama anak"], [
    ["0", "Penjelajah Pemula"], ["300", "Petualang Muda"], ["1.000", "Penjelajah Hebat"],
    ["2.500", "Kapten Pulau"], ["5.000", "Master Angka"], ["9.000", "Legenda TKA"],
  ], [2, 4.4]),

  H1("Memulai"),
  H2("HP anak dan HP orang tua"),
  P("Setiap perangkat dipilih perannya. Pilihan ini bisa diubah di **Orang Tua → Pengaturan → Perangkat ini → Ubah**."),
  TB(["", "👦 HP anak", "👨‍👩‍👧 HP orang tua"], [
    ["**Gunanya**", "Latihan: mengerjakan level, tes, dan Dengar & Baca.", "Memantau perkembangan anak."],
    ["**Internet**", "Harus tersambung saat memulai latihan, supaya kemajuan tersimpan online dan bisa dipantau.", "Perlu untuk mengambil kemajuan terbaru."],
    ["**Halaman Orang Tua**", "Dikunci **PIN orang tua** supaya anak tidak mengubah aturan.", "Langsung terbuka tanpa PIN; aplikasi dibuka langsung ke halaman Orang Tua."],
    ["**Latihan**", "Bisa.", "Tidak bisa. Untuk mencoba soal, pakai **Materi & Level Soal → Coba** (tidak dihitung)."],
  ], [1.4, 2.5, 2.5]),
  H2("Pertama kali di HP anak"),
  OL("Buka alamat aplikasi di Chrome.",
    "Tulis **nama** anak, pilih **teman petualangan** (hewan), dan isi **tanggal TKA** bila sudah tahu (boleh diisi nanti oleh orang tua).",
    "Tekan **Mulai Petualangan 🚀**.",
    "Begitu tersambung internet, **Kode Anak** (8 huruf/angka, mis. KIKO-7QX3) dibuat otomatis. Kodenya terlihat di **Orang Tua → Pengaturan → Kode Anak**."),
  H2("Menyambungkan HP orang tua"),
  OL("Di HP anak: buka **Orang Tua** (masukkan PIN) → **Pengaturan** → kartu **Kode Anak** → tekan **Salin** atau catat kodenya.",
    "Di HP orang tua: buka alamat aplikasi yang sama, pilih **☁️ Sudah punya Kode Anak?**, lalu ketik kode tadi.",
    "Saat ditanya **Perangkat ini dipakai oleh siapa?**, pilih **HP orang tua — hanya memantau**.",
    "Selesai. Setiap kali dibuka, HP orang tua mengambil kemajuan terbaru. Tekan **🔄 Perbarui sekarang** di kartu Kode Anak bila ingin memperbarui seketika."),
  KOTAK("awas", "Jaga Kode Anak seperti kata sandi", "Siapa pun yang mengetahui Kode Anak bisa melihat dan melanjutkan kemajuan anak. Jangan dibagikan di grup atau media sosial."),
  H2("Bagaimana kemajuan disimpan"),
  UL("Kemajuan tersimpan di perangkat dan dikirim ke server setiap ada perubahan (bila internet ada).",
    "Bila dua perangkat memakai Kode Anak yang sama, kemajuannya **digabung**: level dan bintang diambil yang tertinggi, piala dan riwayat disatukan, dan **pengaturan orang tua yang paling baru** yang dipakai.",
    "Pindah HP anak: di HP baru pilih **☁️ Sudah punya Kode Anak?** lalu ketik kodenya. Cadangan berkas juga bisa diunduh di **Pengaturan → Cadangan kemajuan**."),

  H1("Untuk Anak: Cara Bermain"),
  P("Menu utama ada di bawah layar: **🗺️ Peta**, **📅 Rencana**, **🏆 Piala**, dan **👨‍👩‍👧 Orang Tua**. Di kepala halaman terlihat teman petualangan, nama, gelar, koin 💰, api semangat 🔥, dan tombol **📘 Panduan**."),
  H2("Peta (beranda)"),
  TB(["Bagian", "Isinya"], [
    ["**Hitung mundur**", "Berapa hari lagi menuju TKA dan berapa piala misi sudah terkumpul. Di kanan: Piala Raksasa (masih kosong sampai semua pulau TKA selesai)."],
    ["**Target hari ini**", "Tugas dari Rencana Belajar hari ini, misalnya \"Pecahan · Level 4–5\", dengan batang kemajuan dan angka selesai/target. Ketuk untuk membuka Rencana."],
    ["**Lanjutkan**", "Misi terakhir yang dikerjakan, langsung ke level berikutnya."],
    ["**Tantangan Harian** 🎁", "5 soal campuran sekali sehari. Hadiah +50 koin dan menjaga api semangat."],
    ["**Pilih Pulau**", "Kartu tiap pulau: jumlah misi, persen dijelajahi, dan bintang terkumpul."],
  ], [1.6, 4.8]),
  H2("Pulau, misi, dan jalur level"),
  UL("Di dalam pulau, misi dikelompokkan per pos. Kotak kecil bernomor 1–10 di setiap misi menunjukkan level: berwarna kuning = sudah lulus (makin tua makin banyak bintangnya), bergaris putus-putus biru = level yang sedang dikerjakan.",
    "Ketuk misi untuk membuka **jalur level**. Level yang terbuka bisa diketuk; level bergembok 🔒 terbuka setelah level sebelumnya lulus.",
    "Misi Matematika punya kartu **📖 Pelajari dulu**: teori singkat bergambar dan contoh soal yang langkahnya dibuka satu per satu. Baca dulu bila belum paham.",
    "Misi Bahasa Inggris punya kartu **🎧 Dengar & Baca** (lihat 3.6)."),
  H2("Mengerjakan soal"),
  TB(["Bagian layar", "Cara memakainya"], [
    ["**Titik soal**", "Satu titik per nomor: biru berdenyut = nomor sekarang, hijau = benar, merah = salah, kuning = salah lalu benar setelah diulang."],
    ["**Keterangan batas salah**", "Mis. \"Boleh salah 1× · sudah 0×\". Bila lewat batas, level diulang dari nomor 1 dengan soal baru (atau, bila diatur orang tua, diteruskan sampai akhir tetapi belum lulus)."],
    ["**Isian angka**", "Ketik dengan papan angka. Pecahan ditulis **3/4**; pecahan campuran **1 ␣ 1/2** (pakai tombol spasi). Tulis bentuk paling sederhana."],
    ["**Pilihan ganda**", "Pilih satu jawaban (A–E)."],
    ["**PG kompleks** ☑️", "Jawaban benar bisa lebih dari satu. Pilih semuanya."],
    ["**Benar–salah**", "Tentukan Benar atau Salah untuk setiap pernyataan."],
    ["**🦉 Petunjuk**", "Kiko memberi petunjuk. Boleh dipakai, tetapi bintangnya berkurang satu."],
    ["**Periksa ✔**", "Jawaban diperiksa dan **pembahasan** muncul, untuk jawaban benar maupun salah. Matematika dibahas langkah demi langkah."],
    ["**Ulangi nomor ini 🔁**", "Bila nomor yang salah diulang (pengaturan orang tua), anak mendapat soal serupa di nomor itu sampai benar."],
    ["**✕ Keluar**", "Berhenti di tengah level. Kemajuan level itu tidak disimpan, tetapi koin yang sudah didapat tetap."],
  ], [1.7, 4.7]),
  KOTAK("info", "Mode ujian", "Bila orang tua memilih **mode ujian**, tidak ada tanda benar/salah dan tidak ada petunjuk selama mengerjakan. Nilai, kunci, dan pembahasan semua nomor baru tampil di akhir level."),
  H2("Tantangan Harian"),
  P("Lima soal campuran dari misi yang belum selesai, pada level yang sedang dikerjakan di misi itu. Hanya sekali sehari; hasilnya tidak mengubah level, tetapi memberi +50 koin dan menyalakan api semangat. Datang lagi besok supaya api terus menyala 🔥."),
  H2("Pos Tes dan Simulasi TKA"),
  TB(["", "📝 Pos Tes", "🎯 Simulasi TKA"], [
    ["**Letak**", "Di akhir setiap pos/jurus, di semua pulau.", "Di **Pos TKA**, pos terakhir Pulau Matematika dan Bahasa Indonesia."],
    ["**Isi**", "30 soal, 75 menit, menguji pos itu dan semua pos sebelumnya (Pos Tes 2 = Pos 1 + Pos 2). Soal setingkat level 7–9.", "10 paket per mapel, masing-masing 30 soal, 75 menit, mengikuti kisi-kisi TKA SD/MI. Soal tiap paket selalu sama, jadi nilainya bisa dibandingkan."],
    ["**Terbuka**", "Setelah semua misi di pos-pos yang diuji selesai sampai Level 10.", "Selalu terbuka."],
    ["**Penilaian**", "Nilai 0–100 = benar ÷ 30 × 100. **Tuntas = 70 ke atas** (piala perak).", "Sama. Sepuluh paket satu mapel tuntas = piala emas **Juara Simulasi TKA**."],
  ], [1.2, 2.6, 2.6]),
  UL("Jawaban baru diperiksa setelah **📤 Kumpulkan jawaban**. Bila waktu habis, jawaban dikumpulkan otomatis. Tes yang terputus bisa dilanjutkan, tetapi waktunya tetap berjalan seperti ujian.",
    "Predikat nilai: **≥ 85 Istimewa**, **70–84 Baik**, **55–69 Cukup**, **< 55 Perlu belajar lagi**.",
    "Layar hasil menampilkan benar, salah, kosong, lama mengerjakan, dan **tabel per materi**. Materi dengan benar di bawah 60% disarankan untuk diulang.",
    "Tekan **🔍 Lihat pembahasan** untuk melihat setiap nomor beserta jawaban, kunci, dan pembahasannya."),
  H2("Bahasa Inggris: Dengar & Baca"),
  P("Sebelum Level 1, setiap misi Bahasa Inggris punya latihan **🎧 Dengar & Baca** dengan tiga langkah:"),
  OL("**Dengarkan** seluruh teks. Kalimat yang dibacakan disorot; kata bisa diketuk untuk didengar. Kecepatan suara bisa dipilih: sangat pelan, pelan, sedang, atau normal.",
    "**Baca & Koreksi**: anak membaca teks dengan suara keras, mikrofon menilai setiap kata (hijau ≥ 85%, kuning 60–84%, merah < 60%). Skor dicatat bila teks dibaca sampai habis; syarat lulusnya **akurasi minimal** yang diatur orang tua (bawaan 75%). Kata yang belum tepat bisa didengar dan diucapkan ulang.",
    "**Lima sub level** (masing-masing 10 soal), mis. Kenali · Dengar · Situasi · Lengkapi & susun · Ucapkan. Nilai = jawaban benar pada percobaan pertama; soal yang salah diulang dengan soal lain tanpa menambah nilai. Sub level berikutnya terbuka bila nilai **≥ 80%**."),
  P("Bila pengaturan **Level 1 terbuka setelah Dengar & Baca tuntas** menyala, Level 1 misi itu baru terbuka setelah kelima sub level lulus. Perangkat tanpa mikrofon atau suara bahasa Inggris melewati langkah itu otomatis; soal ucapan diganti mengetik atau menyusun kata. Fitur bicara paling baik di **Chrome pada Android**."),
  H2("Lemari Piala"),
  TB(["Piala", "Cara mendapatkannya"], [
    ["🥉 Piala misi", "Selesaikan Level 10 sebuah misi."],
    ["🥇 Piala emas misi", "Kumpulkan 30 ⭐ (3 bintang di semua level) di satu misi."],
    ["🥈 Piala pos", "Selesaikan semua misi di satu pos."],
    ["📝 Piala Pos Tes / 🎯 Simulasi", "Raih nilai 70 atau lebih di Pos Tes atau paket Simulasi TKA."],
    ["🎯 Juara Simulasi TKA", "Kesepuluh paket simulasi satu mapel tuntas."],
    ["🏆 Piala pulau", "Selesaikan seluruh misi di satu pulau."],
    ["👑 Piala Raksasa Juara TKA", "Selesaikan semua misi Pulau Matematika dan Bahasa Indonesia (Bahasa Inggris tidak termasuk)."],
  ], [2.2, 4.2]),

  H1("Rencana Belajar"),
  P("Menu **📅 Rencana** menyusun target harian otomatis dari **tanggal TKA** dan pengaturan orang tua (menit belajar per hari, hari belajar, hari simulasi). Bila tanggal TKA belum diisi dan tidak ada target Bahasa Inggris, layar ini hanya meminta orang tua mengisinya."),
  H2("Cara rencana disusun"),
  UL("**Pekerjaan** = sisa level Matematika dan Bahasa Indonesia, ditambah paket Simulasi TKA yang belum tuntas.",
    "**Target level per hari** = sisa level ÷ banyak hari belajar sampai TKA. Beberapa hari belajar terakhir (3 atau 7 hari, bila waktunya cukup) disisihkan untuk mengulang materi lemah.",
    "Target dibatasi **menit belajar per hari**. Satu level diperkirakan ±1,3 menit per soal (paling sedikit 4 menit), jadi 30 menit dengan 5 soal per level ≈ 4 level sehari.",
    "**Simulasi TKA** dijadwalkan di hari simulasi menjelang TKA (paling banyak 2 paket sehari). **H-1 adalah hari rehat**.",
    "Rencana **disusun ulang setiap hari** dari kemajuan nyata: hari yang terlewat dibagi otomatis ke hari berikutnya. Tugas **hari ini** dibekukan sejak pertama dilihat, supaya tidak berubah saat dikerjakan; baru disusun ulang bila pengaturan diubah."),
  H2("Bagian layar Rencana"),
  TB(["Bagian", "Cara membaca"], [
    ["**MENUJU TKA**", "H-… (hari tersisa), tanggal TKA, label status jadwal (lihat 4.3), dan cincin **% siap TKA** (lihat 4.4)."],
    ["**🌍 Program Bahasa Inggris**", "Muncul bila ada target Bahasa Inggris: sisa hari sampai target, cakupan target, status, dan cincin % tercapai."],
    ["**🎯 Target hari ini**", "Daftar tugas dengan tombol **Mulai ▶**. Tugas tercentang otomatis ✓ begitu levelnya lulus. Pada hari libur, rehat, atau hari TKA tampil pesan pengganti."],
    ["**💰 Tabungan belajar**", "Kelebihan dari jadwal dan cara memakainya (lihat 4.5)."],
    ["**🗺️ Perjalanan menuju TKA**", "Garis waktu: sudah dilalui · kuasai materi · ulang materi · simulasi TKA (titik ungu) · rehat · hari TKA 🏁. Penanda \"Hari ini\" menunjukkan posisi sekarang."],
    ["**🌍 Perjalanan program Bahasa Inggris**", "Garis waktu terpisah: bersama persiapan TKA (separuh waktu), fokus Bahasa Inggris sesudah TKA, dan cadangan sebelum target 🎓."],
    ["**📆 Minggu ini**", "Tujuh hari Senin–Minggu dengan ikon (lihat 4.6)."],
    ["**🗓️ Kalender belajar**", "Dilipat per bulan. Angka kecil di tanggal = banyak tugas; ketuk tanggal untuk melihat rinciannya."],
    ["**📊 Ringkasan rencana**", "Kemajuan per mapel, target level per hari, perkiraan materi selesai, jadwal simulasi, dan **peringatan ⚠️** bila waktunya tidak cukup."],
  ], [1.9, 4.5]),
  H2("Arti status jadwal"),
  P("Aplikasi membandingkan level yang **seharusnya** sudah dikerjakan sejak rencana dibuat (menurut hari belajar yang sudah lewat) dengan level yang **benar-benar** lulus."),
  TB(["Label", "Muncul bila…"], [
    ["🚀 **Lebih cepat N level dari jadwal**", "Anak 3 level atau lebih di depan target."],
    ["👍 **Sesuai jadwal**", "Selisihnya antara 1 level di belakang sampai 2 level di depan."],
    ["⏳ **Tertinggal N level**", "Anak 2 level atau lebih di belakang target. Sisa pekerjaan otomatis dibagi ke hari berikutnya."],
  ], [2.6, 3.8]),
  H2("Persen siap TKA"),
  P("**% siap TKA = (level TKA yang lulus ÷ 290 × 70) + (paket simulasi tuntas ÷ 20 × 30)**. Artinya 70% dari penguasaan materi (200 level Matematika + 90 level Bahasa Indonesia) dan 30% dari Simulasi TKA (10 paket × 2 mapel). Bahasa Inggris tidak dihitung."),
  KOTAK("info", "Contoh", "Anak sudah lulus 145 level TKA dan menuntaskan 4 paket simulasi: 145 ÷ 290 × 70 = 35, ditambah 4 ÷ 20 × 30 = 6, jadi **41% siap TKA**."),
  H2("Tabungan belajar"),
  P("Bila anak lebih cepat dari jadwal, kelebihannya menjadi **tabungan** dan anak boleh memilih cara memakainya:"),
  UL("**🌴 Ringankan & boleh libur** (bawaan): target harian berikutnya ikut ringan, dan anak bisa memilih **hari libur** dalam 14 hari ke depan (ketuk tanggalnya; ketuk lagi untuk membatalkan). Aplikasi memberi tahu tabungannya cukup untuk berapa hari libur; bila libur lebih banyak dari tabungan, target hari lain sedikit naik.",
    "**🚀 Percepat selesai**: target harian tetap seperti awal, sehingga materi selesai lebih cepat dan waktu mengulang lebih banyak."),
  H2("Ikon hari"),
  TB(["Ikon", "Arti"], [
    ["📘 N tugas", "Hari belajar dengan N tugas."], ["📝", "Hari Simulasi TKA."], ["🔁", "Hari mengulang materi yang masih lemah."],
    ["😴", "Libur belajar."], ["🌴", "Libur pilihan anak (dari tabungan)."], ["😌", "Rehat H-1 sebelum TKA."], ["🏁", "Hari TKA."],
    ["🎉", "Tidak ada target (sudah tercapai lebih awal)."], ["✅ (hari lalu)", "Ada level lulus atau tes dikerjakan."], ["✖ terlewat (hari lalu)", "Hari belajar, tetapi tidak ada level yang lulus."],
  ], [1.6, 4.8]),
  H2("Bahasa Inggris dalam rencana"),
  P("Bahasa Inggris ikut rencana hanya bila orang tua mengisi **Target selesai Bahasa Inggris**. Ini program jangka panjang: tanggalnya boleh sesudah TKA, bahkan beberapa tahun lagi. Sebelum TKA (selama materi TKA masih ada), Bahasa Inggris memakai paling banyak **separuh** waktu belajar; sesudah TKA seluruh waktu untuk Bahasa Inggris. Satu sub level Dengar & Baca dihitung **2 tugas**. Bila waktunya tidak cukup, ringkasan memberi perkiraan tanggal selesai dan menit yang dibutuhkan."),

  H1("Membaca Dasbor Ortu"),
  P("Buka **👨‍👩‍👧 Orang Tua → 📊 Dasbor Ortu**. Isinya dari atas ke bawah:"),
  OL("Kartu ringkasan", "📲 Laporan untuk keluarga", "🔍 Di mana anak kesulitan", "Target vs kemajuan nyata (dengan Catatan 14 hari terakhir)", "Pos Tes", "Simulasi TKA", "Aktivitas terakhir", "Kemajuan per misi"),
  H2("Kartu ringkasan"),
  STAT("Gambaran kartu ringkasan (angka hanya contoh)", ["1.240", "soal dikerjakan"], ["82%", "jawaban benar"], ["17", "level minggu ini"]),
  TB(["Bagian", "Arti", "Cara membaca"], [
    ["**soal dikerjakan**", "Seluruh jawaban di level misi, termasuk nomor yang diulang.", "Ukuran banyaknya latihan."],
    ["**jawaban benar**", "Persen benar dari seluruh jawaban itu.", "≥ 80% baik; < 60% perlu pendampingan."],
    ["**level minggu ini**", "Banyak level yang dimainkan sampai akhir dalam 7 hari terakhir, **lulus maupun belum**.", "Bandingkan dengan Aktivitas terakhir: banyak \"belum lulus\" berarti anak tertahan."],
    ["**⏱️ Waktu belajar**", "Total waktu mengerjakan soal, dan waktu minggu ini.", "Setiap soal paling lama dihitung 5 menit."],
    ["**Perlu latihan tambahan**", "Tiga misi dengan akurasi terendah (minimal 10 soal).", "Mulailah pendampingan dari misi ini."],
    ["**☁️ Tersimpan online**", "Kode Anak, waktu sinkron terakhir, dan apakah ada perubahan yang belum terkirim.", "Bila lama tidak berubah, minta anak membuka aplikasi saat ada internet."],
  ], [1.6, 2.6, 2.2]),
  H2("Laporan untuk keluarga"),
  P("Kartu **📲 Laporan untuk keluarga** menyusun pesan WhatsApp berisi ringkasan dan saran, siap dikirim ke grup keluarga (misalnya untuk ibu atau kakak). Isinya disusun aplikasi dari data anak:"),
  TB(["Bagian pesan", "Isi"], [
    ["**Kesimpulan**", "Satu kalimat: seberapa rutin anak berlatih, mapel yang kuat dan yang perlu didampingi, serta status jadwal TKA."],
    ["**📊 Gambaran keseluruhan**", "Sejak mulai: jumlah soal, persen benar, waktu mengerjakan soal, dan per mapel level yang lulus serta misi yang selesai."],
    ["**🗓️ Minggu ini**", "7 hari terakhir: hari belajar, hari berturut-turut, target harian tercapai, soal dan level lulus, waktu mengerjakan soal level per hari."],
    ["**🎯 Menuju TKA**", "H-…, level Matematika & Bahasa Indonesia yang lulus, status jadwal, dan Simulasi TKA."],
    ["**👏 Sudah dikuasai**", "Misi yang selesai minggu ini dan misi dengan 85% benar ke atas."],
    ["**🧩 Perlu bantuan**", "Level yang masih tertahan, misi di bawah 65% benar, selisih antar-mapel, tanda menebak, dan kesulitan yang sudah teratasi."],
    ["**💡 Saran minggu ini**", "Paling banyak 4 saran ditambah ajakan memuji anak di grup."],
  ], [1.8, 4.6]),
  P("Ketuk **Lihat & ubah isi pesan** untuk membaca atau mengubah teksnya (mis. mengganti nama panggilan anak). **💬 Kirim via WhatsApp** membuka WhatsApp; pilih grup keluarga lalu kirim. **📤 Bagikan…** memakai menu bagikan HP, **📋 Salin teks** menyalin teks untuk ditempel di mana saja. Tombol **↺ Susun ulang** mengembalikan teks dari data terbaru."),
  KOTAK("awas", "Kode Anak tidak ikut dikirim", "Pesan ini sengaja tidak memuat Kode Anak. Siapa pun yang memegang kode itu bisa mengubah kemajuan anak. Bila anggota keluarga lain ingin memantau sendiri, masukkan kodenya langsung di HP mereka (**Pengaturan → Sudah punya Kode Anak?**)."),
  H2("Di mana anak kesulitan"),
  P("Kartu **🔍 Di mana anak kesulitan** menjawab: **\"Materi mana yang membuat anak tersendat, dan salahnya seperti apa?\"** Isinya tiga bagian:"),
  TB(["Bagian", "Arti", "Cara membaca"], [
    ["**Misi & level yang paling sulit**", "Paling banyak 6 pasangan misi + level dengan akurasi di bawah 70% (minimal 5 jawaban) atau yang **2× atau lebih belum lulus**, diurutkan dari yang paling sulit. Batang hijau ≥ 75%, kuning 60–74%, merah < 60%.", "Label **masih tersangkut** = level itu belum lulus sampai sekarang; **sudah lulus** = sempat gagal, tetapi akhirnya lulus."],
    ["**Pos/jurus di Pos Tes & Simulasi TKA**", "Persen benar per pos/jurus dari 3 hasil terakhir setiap tes, dari yang terlemah. Label **perlu diperkuat** bila di bawah 60%.", "Pos/jurus paling atas adalah materi yang paling perlu diulang sebelum TKA."],
    ["**❌ Soal yang terakhir dijawab salah**", "10 soal salah terbaru: soal, **jawaban anak**, kunci, dan pembahasan.", "Bandingkan jawaban anak dengan kunci untuk melihat pola salahnya, mis. selalu lupa menyederhanakan pecahan."],
  ], [1.8, 2.8, 2.2]),
  P("Ketuk satu baris misi untuk membuka soal-soal yang salah di misi itu (level yang sama ditampilkan lebih dulu). Tombol **📚 Lihat contoh soal & coba level ini** membuka misi itu di tab **Materi & Level Soal**."),
  KOTAK("info", "Catatan data", "Akurasi per level dihitung dari riwayat level, jadi latihan sebelum fitur ini ikut terhitung. Contoh soal yang salah baru dicatat sejak **18 Oktober 2026**: paling banyak 10 soal terbaru per misi dan 80 soal seluruhnya (Pos Tes paling banyak 6 soal per tes). Soal salah dari HP anak ikut tersimpan online, jadi terlihat juga di HP orang tua."),
  H2("Target vs kemajuan nyata"),
  P("Kartu ini menjawab: **\"Apakah anak berjalan sesuai rencana?\"** Tombol **Lihat rencana ▶** membuka layar Rencana."),
  STAT("Gambaran kotak ringkasan (angka hanya contoh)", ["H-45", "menuju TKA"], ["41%", "siap TKA"], ["3/4", "target hari ini"], ["78%", "hari target tercapai (14 hari)"]),
  TB(["Bagian", "Arti"], [
    ["**H-…**", "Hari tersisa sampai TKA."],
    ["**siap TKA**", "Persen kesiapan (rumus di 4.4)."],
    ["**target hari ini**", "Tugas hari ini yang sudah selesai / jumlah tugas hari ini."],
    ["**hari target tercapai (14 hari)**", "Dari hari-hari dalam 13 hari terakhir (tanpa hari ini) yang punya target, berapa persen targetnya tercapai penuh. Ukuran **kebiasaan** belajar."],
    ["**Batang Target / Nyata** 📘", "Matematika & Bahasa Indonesia, dalam **level**: Target = yang seharusnya sudah lulus sejak tanggal rencana dibuat; Nyata = yang benar-benar lulus. Batang Nyata hijau bila sudah mencapai target. Labelnya sama dengan status jadwal (4.3)."],
    ["**Batang Target / Nyata** 🌍", "Bahasa Inggris, dalam **tugas** (sub level Dengar & Baca = 2 tugas). Hanya muncul bila ada target Bahasa Inggris."],
    ["**Keterangan di bawah batang**", "Target level per hari belajar, perkiraan materi selesai, simulasi tuntas (dari 20), dan mode 🚀 percepat bila dipilih anak."],
  ], [2.1, 4.3]),
  H3("Catatan 14 hari terakhir"),
  P("Satu baris per hari. **Target** = banyak tugas hari itu, **Dikerjakan** = tugas yang selesai (ditambah \"· N level lulus\" bila ada). Target dicatat saat aplikasi dibuka pada hari itu, di perangkat mana pun."),
  TB(["Hasil", "Arti"], [
    ["✅ tercapai", "Semua tugas hari itu selesai."],
    ["🟡 N%", "Sebagian tugas selesai."],
    ["✖ tidak", "Ada target, tetapi tidak ada tugas yang selesai."],
    ["⏳ belum", "Hari ini, belum ada tugas yang selesai."],
    ["✖ tidak dibuka", "Hari belajar, tetapi aplikasi tidak dibuka dan tidak ada level yang lulus."],
    ["✅ belajar", "Hari belajar tanpa catatan target, tetapi ada level yang lulus."],
    ["✨ belajar ekstra", "Hari libur atau tanpa target, tetapi anak tetap berlatih."],
    ["😴 libur", "Bukan hari belajar dan anak tidak berlatih."],
    ["🌴 libur pilihan", "Hari libur yang dipilih anak dari tabungan belajar."],
    ["· sebelum ada rencana", "Tanggal sebelum rencana dibuat."],
  ], [1.8, 4.6]),
  KOTAK("saran", "Contoh membaca kartu ini", "📘 Target **24 level**, Nyata **18 level**, label **⏳ Tertinggal 6 level**. Di Catatan 14 hari, empat hari terakhir bertuliskan **✖ tidak dibuka**.",
    "Artinya: anak sanggup mengerjakan targetnya ketika belajar, tetapi beberapa hari tidak membuka aplikasi. Yang perlu diperbaiki **kebiasaan**, bukan kemampuan: sepakati jam belajar tetap. Bila banyak hari bertuliskan **🟡 50%**, targetnya mungkin terlalu berat; tambah menit atau hari belajar di Pengaturan."),
  H2("Pos Tes"),
  TB(["Kolom", "Arti"], [
    ["**Tes**", "Nama Pos Tes dan cakupannya, dikelompokkan per pulau."],
    ["**Kali**", "Berapa kali tes itu dikerjakan."],
    ["**Terbaik**", "Nilai tertinggi; 🏆 = sudah tuntas (≥ 70)."],
    ["**Terakhir**", "Nilai percobaan terakhir, tanggal, dan lamanya. \"siap\" = sudah terbuka tetapi belum dikerjakan; 🔒 = belum terbuka (misi di pos-pos itu belum selesai)."],
  ], [1.4, 5]),
  H2("Simulasi TKA"),
  P("Tabel nilai terbaik setiap paket 1–10 untuk Matematika dan Bahasa Indonesia. **Sel hijau = tuntas (≥ 70)**, \"–\" = belum dikerjakan. Karena soal tiap paket tetap, mengerjakan ulang paket yang sama menunjukkan apakah anak sudah memahami pembahasannya."),
  H2("Aktivitas terakhir"),
  P("Delapan level terakhir yang dimainkan sampai selesai: waktu, misi, level, lalu hasilnya, mis. **\"✅ lulus · 4/5 benar langsung · ❌ 1× salah · ⏱️ 3 mnt\"** atau **\"belum lulus\"**. Jumlah salah mencakup semua putaran, termasuk yang diulang dari nomor 1. Tantangan Harian dan tes tidak tampil di sini."),
  H2("Kemajuan per misi"),
  P("Tabel semua misi, dikelompokkan per pulau."),
  TB(["Kolom", "Arti", "Cara membaca"], [
    ["**Posisi**", "\"Level N\" = level yang sedang dikerjakan, dengan banyak level yang sudah lulus di bawahnya. \"Selesai 🏆\" = Level 10 lulus. \"–\" = belum dimulai.", "Misi Bahasa Inggris yang masih di Dengar & Baca tampil \"🎧 x/5\" beserta skor baca terbaik."],
    ["**⭐**", "Jumlah bintang di misi itu (paling banyak 30).", "Bintang sedikit pada misi yang sudah jauh = banyak lulus dengan salah atau pakai petunjuk."],
    ["**Hasil**", "Persen benar dan banyak salah di misi itu.", "< 60% = konsep belum kuat; buka Materi & Level Soal untuk melihat contohnya."],
    ["**Waktu**", "Lama mengerjakan soal di misi itu.", "Waktu lama tetapi posisi tidak naik = anak kesulitan."],
  ], [1.1, 3, 2.3]),

  H1("Materi & Level Soal"),
  P("Tab **📚 Materi & Level Soal** di halaman Orang Tua menampilkan susunan pulau → pos → misi → 10 level, beserta aturan level yang sedang berlaku. Buka sebuah misi untuk melihat setiap level: tingkatnya, bentuk soalnya, dan status anak (bintang, \"sedang\", atau \"belum\")."),
  UL("**Contoh**: tiga soal acak beserta kunci dan pembahasannya. Tekan lagi untuk contoh lain.",
    "**Coba**: orang tua atau guru mengerjakan level itu sendiri. **Uji coba tidak mengubah kemajuan dan koin anak**, dan bisa dipakai juga di HP orang tua.",
    "**📖 Materi singkat & contoh bertahap**: materi yang dilihat anak sebelum mengerjakan (misi Matematika).",
    "Di bagian bawah setiap pulau: daftar **Pos Tes** dan **Simulasi TKA paket 1–10**, masing-masing bisa dicoba."),
  KOTAK("saran", "Kapan berguna?", "Bila Dasbor Ortu menunjukkan akurasi rendah di sebuah misi, buka misi itu di sini dan lihat contoh soalnya. Orang tua jadi tahu persis materi apa yang perlu dijelaskan, tanpa mengganggu kemajuan anak."),

  H1("Pengaturan"),
  P("Tab **⚙️ Pengaturan** di halaman Orang Tua. **Setiap perubahan langsung tersimpan** dan ikut terkirim ke perangkat lain yang memakai Kode Anak yang sama."),
  H2("Profil & aturan level"),
  TB(["Pengaturan", "Arti", "Saran"], [
    ["**Nama anak, Teman petualangan**", "Nama dan hewan yang tampil di kepala halaman.", "–"],
    ["**Tanggal TKA**", "Dasar hitung mundur dan Rencana Belajar.", "Isi sedini mungkin agar target harian terbentuk."],
    ["**Jumlah soal per level**", "5, 10, 15, atau 20 soal (bawaan 5).", "Lebih banyak soal = lebih teliti, tetapi level lebih lama dan target harian lebih sedikit."],
    ["**Mode level**", "📖 Belajar (tanda benar/salah dan pembahasan setiap nomor) atau 📝 Ujian (hasil dan pembahasan di akhir level).", "Belajar untuk sehari-hari; Ujian menjelang TKA."],
    ["**Toleransi kesalahan mode belajar**", "Batas salah agar level lulus: tanpa salah sampai 5× (harus lebih kecil dari jumlah soal).", "Mulai longgar (1–2×), perketat bila anak sudah lancar."],
    ["**Bila salah melebihi batas**", "🔁 Ulang dari nomor 1 dengan soal baru, atau ➡️ Lanjut sampai akhir (hasilnya belum lulus).", "Lanjut cocok untuk anak yang mudah patah semangat."],
    ["**Toleransi kesalahan mode ujian**", "Batas salah di mode ujian; lewat batas = belum lulus.", "–"],
    ["**Ulangi nomor yang salah**", "Mode belajar: anak mengerjakan soal serupa di nomor itu sampai benar.", "Nyalakan agar anak belajar dari kesalahannya."],
    ["**Suara**", "Bunyi benar/salah dan efek permainan.", "–"],
  ], [1.9, 2.6, 1.9]),
  H2("Rencana belajar menuju TKA"),
  TB(["Pengaturan", "Arti"], [
    ["**Waktu belajar per hari**", "15, 30, 45, 60, atau 90 menit. Menentukan berapa level paling banyak dijadwalkan sehari."],
    ["**Hari belajar**", "Hari yang dipakai untuk belajar; hari lain libur (paling sedikit satu hari)."],
    ["**Hari simulasi TKA**", "Hari untuk paket simulasi 75 menit menjelang TKA (bawaan Sabtu)."],
    ["**Target selesai Bahasa Inggris**", "Tanggal target program Bahasa Inggris (boleh sesudah TKA). Kosongkan (✕) bila Bahasa Inggris tidak ikut rencana."],
    ["**Cakupan target Bahasa Inggris**", "Dengar & Baca saja · + Level 1–5 · + semua level (untuk 54 misi)."],
    ["**Hari latihan Bahasa Inggris**", "Hari khusus Bahasa Inggris, dipilih dari hari belajar."],
  ], [2.2, 4.2]),
  H2("Bahasa Inggris · Dengar & Baca"),
  TB(["Pengaturan", "Arti"], [
    ["**Wajib dengar seluruh teks**", "Anak harus mendengarkan seluruh teks sebelum sub level 1 terbuka."],
    ["**Wajib Baca & Koreksi**", "Anak harus membaca keras dan dinilai mikrofon. Matikan bila kelas ramai atau mikrofon HP kurang baik."],
    ["**Akurasi minimal Baca & Koreksi**", "50–95% (bawaan 75%). Teks harus dibaca sampai habis dengan akurasi sebesar ini agar sub level 1 terbuka. Yang dibandingkan adalah **skor terbaik** yang sudah tersimpan."],
    ["**Sub level Ucapkan memakai mikrofon**", "Bila mati, soal ucapan diganti mengetik atau menyusun kata."],
    ["**Level 1 terbuka setelah Dengar & Baca tuntas**", "Level 1 misi baru terbuka setelah kelima sub level lulus. Hanya berlaku untuk misi yang belum dimulai."],
  ], [2.4, 4]),
  H2("Kode Anak dan cadangan"),
  TB(["Tombol", "Fungsi"], [
    ["**Perangkat ini → Ubah**", "Mengganti peran perangkat: HP anak atau HP orang tua."],
    ["**Salin**", "Menyalin Kode Anak untuk disambungkan di perangkat lain."],
    ["**🔄 Perbarui sekarang**", "Mengirim dan mengambil kemajuan terbaru seketika."],
    ["**Hapus dari server**", "Menghapus kemajuan di server; kemajuan di perangkat tetap ada."],
    ["**🔗 Masukkan Kode Anak lain**", "Menyambungkan perangkat ini ke kemajuan anak dengan kode lain."],
    ["**Matikan di perangkat ini**", "(HP orang tua) Berhenti menyimpan online di perangkat ini; bisa disambungkan lagi kapan saja."],
    ["**⬇️ Unduh cadangan / ⬆️ Pulihkan dari berkas**", "Menyimpan kemajuan sebagai berkas .json, atau memulihkannya."],
    ["**Hapus kemajuan**", "Mulai dari awal di perangkat ini (ketik HAPUS untuk memastikan). **Tidak bisa dibatalkan**; unduh cadangan dulu."],
  ], [2.4, 4]),

  H1("Dari Data ke Tindakan"),
  H2("Situasi umum dan tindakan"),
  TB(["Situasi", "Terlihat di", "Tindakan yang disarankan"], [
    ["Anak tertinggal dari jadwal", "Dasbor → label ⏳ Tertinggal; Catatan 14 hari banyak ✖", "Bila banyak \"tidak dibuka\": sepakati jam belajar tetap. Bila banyak 🟡: tambah menit atau hari belajar."],
    ["Waktu tidak cukup sampai TKA", "Rencana → Ringkasan ⚠️ \"Waktunya belum cukup\"", "Tambah menit atau hari belajar, atau kurangi jumlah soal per level."],
    ["Akurasi rendah di satu misi", "Dasbor → 🔍 Di mana anak kesulitan; Kemajuan per misi kolom Hasil", "Buka baris misinya untuk melihat soal yang salah dan jawaban anak; lihat Contoh di Materi & Level Soal; ajak anak membaca 📖 Pelajari dulu; ulangi level berbintang sedikit."],
    ["Anak tertahan di satu level", "🔍 Di mana anak kesulitan: label masih tersangkut; Aktivitas terakhir: level sama berulang \"belum lulus\"", "Dampingi satu putaran; longgarkan toleransi atau pilih \"Lanjut sampai akhir\" sementara."],
    ["Lulus, tetapi bintang sedikit", "Kemajuan per misi kolom ⭐", "Anak sering memakai petunjuk atau kurang teliti; ajak mengulang level untuk 3 bintang."],
    ["Nilai Pos Tes di bawah 70", "Dasbor → Pos Tes; 🔍 Di mana anak kesulitan → Pos/jurus", "Ulangi misi pada materi yang di bawah 60%, lalu kerjakan ulang tesnya."],
    ["Nilai simulasi naik-turun", "Dasbor → Simulasi TKA", "Bahas pembahasannya bersama, lalu ulangi paket yang sama untuk melihat pemahaman."],
    ["Baca & Koreksi tidak pernah lulus", "Kemajuan per misi: \"🎧 0/5 · baca 60%\"", "Coba di tempat tenang; turunkan akurasi minimal atau matikan Wajib Baca & Koreksi."],
    ["Kemajuan di HP orang tua tidak berubah", "Dasbor → baris ☁️ Tersimpan online", "Pastikan HP anak tersambung internet; tekan 🔄 Perbarui sekarang; cocokkan Kode Anak di kedua HP."],
  ], [1.8, 2.2, 2.4]),
  H2("Tanya jawab singkat"),
  TB(["Pertanyaan", "Jawaban"], [
    ["Mengapa \"level minggu ini\" banyak, tetapi posisi misi naik sedikit?", "Angka itu menghitung semua level yang dimainkan sampai akhir, termasuk yang belum lulus. Lihat Aktivitas terakhir untuk hasil tiap level."],
    ["Mengapa persen benar di Dasbor berbeda dengan \"benar langsung\" di layar hasil?", "Dasbor menghitung semua jawaban, termasuk nomor yang diulang sampai benar. Layar hasil hanya menghitung yang benar pada percobaan pertama."],
    ["Waktu belajar terlihat kecil padahal anak lama memegang HP?", "Yang dihitung hanya waktu mengerjakan soal, paling lama 5 menit per soal. Waktu membaca materi, memilih misi, atau HP yang ditinggal tidak dihitung."],
    ["Mengapa Bahasa Inggris tidak menaikkan % siap TKA?", "Bahasa Inggris bukan mapel TKA SD; ia materi tambahan dengan program dan targetnya sendiri."],
    ["Mengapa Pos Tes masih terkunci?", "Pos Tes terbuka setelah semua misi di pos-pos yang diuji selesai sampai Level 10. Simulasi TKA selalu terbuka."],
    ["Target hari ini tidak berubah walau anak sudah mengerjakan lebih?", "Tugas hari ini dibekukan supaya tidak berubah saat dikerjakan. Kelebihannya masuk tabungan belajar dan meringankan hari berikutnya."],
    ["Bisakah anak berlatih di HP orang tua?", "Tidak; HP orang tua hanya untuk memantau. Ubah perannya menjadi HP anak di Pengaturan bila HP itu memang dipakai anak."],
    ["Anak tidak bisa memulai level: \"Penyimpanan online mati\"?", "Nyalakan lagi di Orang Tua → Pengaturan → Kode Anak. Latihan memerlukan penyimpanan online agar kemajuannya bisa dipantau."],
    ["Uji coba orang tua mengacaukan nilai anak?", "Tidak. Semua yang dikerjakan lewat tombol Coba tidak disimpan dan tidak mendapat koin."],
  ], [2.6, 3.8]),
];

/* ================= Penomoran judul ================= */
(function nomori() { const n = [0, 0, 0];
  ISI.forEach(b => { if (!/^h[123]$/.test(b.t)) return; const k = +b.t[1] - 1; n[k]++; for (let i = k + 1; i < 3; i++) n[i] = 0;
    b.no = k === 0 ? `${n[0]}.` : n.slice(0, k + 1).join("."); b.id = "b" + n.slice(0, k + 1).join("-"); }); })();
const DAFTAR = ISI.filter(b => b.t === "h1" || b.t === "h2");

/* ================= HTML untuk PDF ================= */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const sebaris = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const WARNA_KOTAK = { info: ["#2F7FD8", "#E8F1FC"], saran: ["#2E9E5B", "#E7F5EC"], awas: ["#C98A12", "#FDF4E1"], bahaya: ["#D9534F", "#FBE9E8"] };
function htmlBlok(b) {
  if (b.t === "h1") return `<h1 id="${b.id}">${b.no} ${sebaris(b.s)}</h1>`;
  if (b.t === "h2") return `<h2 id="${b.id}">${b.no} ${sebaris(b.s)}</h2>`;
  if (b.t === "h3") return `<h3 id="${b.id}">${b.no} ${sebaris(b.s)}</h3>`;
  if (b.t === "p") return `<p>${sebaris(b.s)}</p>`;
  if (b.t === "ul" || b.t === "ol") return `<${b.t}>${b.a.map(x => `<li>${sebaris(x)}</li>`).join("")}</${b.t}>`;
  if (b.t === "tb") { const tot = b.lebar.reduce((a, x) => a + x, 0);
    return `<table><colgroup>${b.lebar.map(w => `<col style="width:${(w / tot * 100).toFixed(1)}%">`).join("")}</colgroup><thead><tr>${b.kepala.map(k => `<th>${sebaris(k)}</th>`).join("")}</tr></thead>
      <tbody>${b.baris.map(r => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="pertama"' : ""}>${sebaris(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`; }
  if (b.t === "kotak") { const [w, l] = WARNA_KOTAK[b.jenis];
    return `<div class="kotak" style="border-color:${w};background:${l}"><div class="kotak-judul" style="color:${w}">${sebaris(b.judul)}</div>${b.isi.map(x => `<p>${sebaris(x)}</p>`).join("")}</div>`; }
  if (b.t === "stat") return `<div class="stat">${b.a.map(([a, k]) => `<div><b>${esc(a)}</b><span>${esc(k)}</span></div>`).join("")}</div><p class="stat-ket">${esc(b.ket)}</p>`;
  throw new Error("Blok tidak dikenal: " + b.t);
}
function buatHTML() {
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>${JUDUL}</title><style>
  @page { size: A4; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Calibri, "Segoe UI", Carlito, sans-serif; font-size: 10.5pt; line-height: 1.45; color: #1F2633; }
  b { font-weight: 700; }
  .sampul { height: 247mm; display: flex; flex-direction: column; justify-content: center; break-after: page; }
  .sampul .atas { font-size: 11pt; font-weight: 700; letter-spacing: .08em; color: #8F6B1A; }
  .sampul h1 { break-before: auto; font-size: 34pt; color: #1D2A3A; margin: 10px 0 6px; border: 0; padding: 0; }
  .sampul .sub { font-size: 15pt; color: #33445A; }
  .sampul .garis { height: 4px; background: linear-gradient(90deg, #1D2A3A 0 70%, #F2B92E 70%); margin: 34px 0 22px; border-radius: 2px; }
  .sampul ul { margin: 8px 0 0; } .sampul .kaki { margin-top: 70px; color: #556070; font-size: 9.5pt; }
  .daftar { break-after: page; } .daftar h1 { break-before: auto; }
  .daftar a { color: inherit; text-decoration: none; display: block; padding: 3px 0; border-bottom: 1px dotted #C9D2DE; }
  .daftar .d1 { font-weight: 700; margin-top: 8px; } .daftar .d2 { padding-left: 18px; color: #33445A; }
  h1 { break-before: page; font-size: 19pt; color: #1D2A3A; margin: 0 0 12px; padding-bottom: 6px; border-bottom: 2.5px solid #1D2A3A; }
  h2 { font-size: 13.5pt; color: #1D2A3A; margin: 20px 0 6px; break-after: avoid; }
  h3 { font-size: 11.5pt; color: #2F6FB8; margin: 14px 0 4px; break-after: avoid; }
  p { margin: 0 0 8px; } ul, ol { margin: 0 0 10px; padding-left: 22px; } li { margin: 0 0 4px; }
  table { width: 100%; border-collapse: collapse; margin: 6px 0 14px; font-size: 9.5pt; }
  th { background: #1D2A3A; color: #fff; text-align: left; padding: 6px 8px; font-weight: 700; }
  td { padding: 6px 8px; border-bottom: 1px solid #D5DCE6; vertical-align: top; }
  tbody tr:nth-child(even) td { background: #F6F8FB; } tr { break-inside: avoid; } td.pertama { font-weight: 400; }
  .kotak { border-left: 5px solid; border-radius: 4px; padding: 10px 14px; margin: 8px 0 14px; break-inside: avoid; font-size: 9.8pt; }
  .kotak-judul { font-weight: 700; margin-bottom: 3px; } .kotak p { margin: 0 0 4px; }
  .stat { display: flex; gap: 6px; margin: 8px 0 2px; break-inside: avoid; }
  .stat div { flex: 1; background: #EEF2F7; border-radius: 6px; padding: 8px 6px; text-align: center; }
  .stat b { display: block; font-size: 17pt; color: #1D2A3A; line-height: 1.1; } .stat span { font-size: 8.5pt; color: #556070; }
  .stat-ket { text-align: center; font-size: 8.5pt; font-style: italic; color: #8A93A3; margin-bottom: 12px; }
  </style></head><body>
  <section class="sampul"><div class="atas">PETUALANGAN TKA SD</div><h1>${JUDUL}</h1>
    <div class="sub">Cara memakai aplikasi dan membaca hasil belajar anak</div><div class="garis"></div>
    <p>Isi panduan ini:</p><ul>${ISI.filter(b => b.t === "h1").map(b => `<li><b>${esc(b.s)}</b></li>`).join("")}</ul>
    <div class="kaki">Untuk: orang tua, guru atau pendamping, dan anak<br>Versi: ${VERSI} (sesuai tampilan aplikasi per tanggal tersebut)</div></section>
  <section class="daftar"><h1>Daftar Isi</h1>${DAFTAR.map(b => `<a class="d${b.t[1]}" href="#${b.id}">${b.no} ${sebaris(b.s)}</a>`).join("")}</section>
  ${ISI.map(htmlBlok).join("\n")}
  </body></html>`;
}

/* ================= Cetak PDF lewat Chrome/Edge (DevTools Protocol) ================= */
function cariPeramban() {
  const calon = [process.env.CHROME, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome", "/usr/bin/chromium", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"];
  const ada = calon.find(p => p && fs.existsSync(p)); if (!ada) throw new Error("Chrome/Edge tidak ditemukan. Atur variabel CHROME ke lokasi chrome.exe."); return ada;
}
const tunggu = ms => new Promise(r => setTimeout(r, ms));
async function cetakPDF(berkasHTML, keluaran) {
  const port = 9300 + Math.floor(Math.random() * 500), profil = fs.mkdtempSync(path.join(os.tmpdir(), "panduan-"));
  const p = spawn(cariPeramban(), ["--headless=new", "--disable-gpu", "--no-first-run", `--remote-debugging-port=${port}`, `--user-data-dir=${profil}`, "about:blank"], { stdio: "ignore" });
  try {
    let daftar;
    for (let i = 0; i < 100 && !daftar; i++) { try { daftar = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch (e) { await tunggu(150); } }
    const hal = daftar && daftar.find(x => x.type === "page"); if (!hal) throw new Error("Peramban tidak merespons.");
    const ws = new WebSocket(hal.webSocketDebuggerUrl); await new Promise((ok, gagal) => { ws.onopen = ok; ws.onerror = gagal; });
    let id = 0; const janji = new Map(), acara = [];
    ws.onmessage = m => { const x = JSON.parse(m.data); if (x.id && janji.has(x.id)) { janji.get(x.id)(x); janji.delete(x.id); } else if (x.method) acara.push(x.method); };
    const kirim = (method, params = {}) => new Promise(ok => { const k = ++id; janji.set(k, ok); ws.send(JSON.stringify({ id: k, method, params })); });
    await kirim("Page.enable");
    await kirim("Page.navigate", { url: "file:///" + berkasHTML.replace(/\\/g, "/") });
    for (let i = 0; i < 100 && !acara.includes("Page.loadEventFired"); i++) await tunggu(100);
    await kirim("Runtime.evaluate", { expression: "document.fonts.ready.then(() => 1)", awaitPromise: true });
    const gaya = "font-family:Calibri,'Segoe UI',sans-serif;font-size:8px;color:#8A93A3;width:100%;padding:0 18mm;";
    const opsi = { printBackground: true, displayHeaderFooter: true, paperWidth: 8.27, paperHeight: 11.69, marginTop: 0.75, marginBottom: 0.7, marginLeft: 0.71, marginRight: 0.71,
      headerTemplate: `<div style="${gaya}text-align:right">${JUDUL}</div>`,
      footerTemplate: `<div style="${gaya}text-align:center">Halaman <span class="pageNumber"></span> dari <span class="totalPages"></span></div>`,
      generateDocumentOutline: true, generateTaggedPDF: true };
    let r = await kirim("Page.printToPDF", opsi);
    if (r.error) { delete opsi.generateDocumentOutline; delete opsi.generateTaggedPDF; r = await kirim("Page.printToPDF", opsi); }   // Chrome lama
    if (r.error) throw new Error(r.error.message);
    fs.writeFileSync(keluaran, Buffer.from(r.result.data, "base64")); ws.close();
  } finally { p.kill(); await tunggu(400); try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) { /* biarkan */ } }
}

/* ================= Word (.docx) ================= */
async function buatDOCX(keluaran) {
  const D = require("docx");
  const LEBAR = 9638;   // lebar isi A4 dengan margin 2 cm (twip)
  const lari = (s, o = {}) => String(s).split(/(\*\*.+?\*\*)/).filter(Boolean).map(x => /^\*\*.+\*\*$/.test(x) ? new D.TextRun({ text: x.slice(2, -2), bold: true, ...o }) : new D.TextRun({ text: x, ...o }));
  const par = (s, o = {}, r = {}) => new D.Paragraph({ children: lari(s, r), spacing: { after: 120 }, ...o });
  const garis = { style: D.BorderStyle.SINGLE, size: 4, color: "D5DCE6" }, kosong = { style: D.BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const sel = (isi, lebar, o = {}) => new D.TableCell({ width: { size: lebar, type: D.WidthType.DXA }, margins: { top: 70, bottom: 70, left: 110, right: 110 }, children: isi, ...o });
  let nomorDaftar = 0;
  const blok = b => {
    if (b.t === "h1") return [new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, pageBreakBefore: true, children: lari(`${b.no} ${b.s}`) })];
    if (b.t === "h2") return [new D.Paragraph({ heading: D.HeadingLevel.HEADING_2, children: lari(`${b.no} ${b.s}`) })];
    if (b.t === "h3") return [new D.Paragraph({ heading: D.HeadingLevel.HEADING_3, children: lari(`${b.no} ${b.s}`) })];
    if (b.t === "p") return [par(b.s)];
    if (b.t === "ul") return b.a.map(x => par(x, { bullet: { level: 0 }, spacing: { after: 60 } }));
    if (b.t === "ol") { const n = ++nomorDaftar; return b.a.map(x => par(x, { numbering: { reference: "angka", level: 0, instance: n }, spacing: { after: 60 } })); }
    if (b.t === "tb") { const tot = b.lebar.reduce((a, x) => a + x, 0), w = b.lebar.map(x => Math.round(x / tot * LEBAR));
      return [new D.Table({ width: { size: LEBAR, type: D.WidthType.DXA }, columnWidths: w,
        borders: { top: garis, bottom: garis, left: kosong, right: kosong, insideHorizontal: garis, insideVertical: kosong },
        rows: [new D.TableRow({ tableHeader: true, cantSplit: true, children: b.kepala.map((k, i) => sel([par(k, { spacing: { after: 0 } }, { bold: true, color: "FFFFFF", size: 19 })], w[i], { shading: { type: D.ShadingType.CLEAR, color: "auto", fill: "1D2A3A" } })) }),
          ...b.baris.map((r, j) => new D.TableRow({ cantSplit: true, children: r.map((c, i) => sel([par(c, { spacing: { after: 0 } }, { size: 19 })], w[i], j % 2 ? { shading: { type: D.ShadingType.CLEAR, color: "auto", fill: "F6F8FB" } } : {})) }))] }),
        new D.Paragraph({ spacing: { after: 120 }, children: [] })]; }
    if (b.t === "kotak") { const [w, l] = WARNA_KOTAK[b.jenis].map(x => x.slice(1));
      return [new D.Table({ width: { size: LEBAR, type: D.WidthType.DXA }, columnWidths: [LEBAR],
        borders: { top: kosong, bottom: kosong, right: kosong, left: { style: D.BorderStyle.SINGLE, size: 30, color: w }, insideHorizontal: kosong, insideVertical: kosong },
        rows: [new D.TableRow({ cantSplit: true, children: [sel([par(b.judul, { spacing: { after: 40 } }, { bold: true, color: w, size: 20 }), ...b.isi.map(x => par(x, { spacing: { after: 40 } }, { size: 19 }))], LEBAR,
          { shading: { type: D.ShadingType.CLEAR, color: "auto", fill: l }, margins: { top: 120, bottom: 120, left: 200, right: 160 } })] })] }),
        new D.Paragraph({ spacing: { after: 120 }, children: [] })]; }
    if (b.t === "stat") { const w = Math.floor(LEBAR / b.a.length), putih = { style: D.BorderStyle.SINGLE, size: 24, color: "FFFFFF" };
      return [new D.Table({ width: { size: LEBAR, type: D.WidthType.DXA }, columnWidths: b.a.map(() => w),
        borders: { top: putih, bottom: putih, left: putih, right: putih, insideHorizontal: putih, insideVertical: putih },
        rows: [new D.TableRow({ cantSplit: true, children: b.a.map(([a, k]) => sel([
          new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [new D.TextRun({ text: a, bold: true, size: 34, color: "1D2A3A" })] }),
          new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [new D.TextRun({ text: k, size: 16, color: "556070" })] })], w, { shading: { type: D.ShadingType.CLEAR, color: "auto", fill: "EEF2F7" } })) })] }),
        new D.Paragraph({ alignment: D.AlignmentType.CENTER, spacing: { before: 40, after: 160 }, children: [new D.TextRun({ text: b.ket, italics: true, size: 16, color: "8A93A3" })] })]; }
    throw new Error("Blok tidak dikenal: " + b.t);
  };
  const sampul = [
    new D.Paragraph({ spacing: { before: 3200, after: 120 }, children: [new D.TextRun({ text: "PETUALANGAN TKA SD", bold: true, size: 22, color: "8F6B1A" })] }),
    new D.Paragraph({ spacing: { after: 120 }, children: [new D.TextRun({ text: JUDUL, bold: true, size: 64, color: "1D2A3A" })] }),
    new D.Paragraph({ spacing: { after: 400 }, border: { bottom: { style: D.BorderStyle.SINGLE, size: 24, color: "1D2A3A", space: 18 } },
      children: [new D.TextRun({ text: "Cara memakai aplikasi dan membaca hasil belajar anak", size: 30, color: "33445A" })] }),
    par("Isi panduan ini:"),
    ...ISI.filter(b => b.t === "h1").map(b => par(`**${b.s}**`, { bullet: { level: 0 }, spacing: { after: 40 } })),
    new D.Paragraph({ spacing: { before: 1400, after: 0 }, children: [new D.TextRun({ text: "Untuk: orang tua, guru atau pendamping, dan anak", size: 19, color: "556070" })] }),
    new D.Paragraph({ children: [new D.TextRun({ text: `Versi: ${VERSI} (sesuai tampilan aplikasi per tanggal tersebut)`, size: 19, color: "556070" })] }),
  ];
  const daftarIsi = [new D.Paragraph({ heading: D.HeadingLevel.HEADING_1, children: [new D.TextRun("Daftar Isi")] }),
    ...DAFTAR.map(b => new D.Paragraph({ spacing: { after: 50, before: b.t === "h1" ? 140 : 0 }, indent: { left: b.t === "h1" ? 0 : 360 },
      children: lari(`${b.no} ${b.s}`, { bold: b.t === "h1", color: b.t === "h1" ? "1F2633" : "33445A" }) }))];
  const kepala = new D.Header({ children: [new D.Paragraph({ alignment: D.AlignmentType.RIGHT, children: [new D.TextRun({ text: JUDUL, size: 16, color: "8A93A3" })] })] });
  const kaki = new D.Footer({ children: [new D.Paragraph({ alignment: D.AlignmentType.CENTER, children: [new D.TextRun({ children: ["Halaman ", D.PageNumber.CURRENT], size: 16, color: "8A93A3" })] })] });
  const halaman = { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } };
  const doc = new D.Document({
    creator: "Petualangan TKA SD", title: JUDUL, description: "Cara memakai aplikasi dan membaca hasil belajar anak",
    styles: { default: { document: { run: { font: "Calibri", size: 21, color: "1F2633" }, paragraph: { spacing: { line: 276 } } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 36, bold: true, color: "1D2A3A" },
          paragraph: { spacing: { before: 0, after: 200 }, border: { bottom: { style: D.BorderStyle.SINGLE, size: 18, color: "1D2A3A", space: 6 } } } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 27, bold: true, color: "1D2A3A" }, paragraph: { spacing: { before: 320, after: 100 }, keepNext: true } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 23, bold: true, color: "2F6FB8" }, paragraph: { spacing: { before: 220, after: 80 }, keepNext: true } }] },
    numbering: { config: [{ reference: "angka", levels: [{ level: 0, format: D.LevelFormat.DECIMAL, text: "%1.", alignment: D.AlignmentType.START, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }] },
    sections: [{ properties: halaman, children: sampul },
      { properties: halaman, headers: { default: kepala }, footers: { default: kaki }, children: [...daftarIsi, ...ISI.flatMap(blok)] }],
  });
  fs.writeFileSync(keluaran, await D.Packer.toBuffer(doc));
}

(async () => {
  const html = path.join(os.tmpdir(), NAMA + ".html"); fs.writeFileSync(html, buatHTML());
  if (process.argv.includes("--html")) { fs.copyFileSync(html, path.join(AKAR, NAMA + ".html")); console.log("HTML →", NAMA + ".html"); }
  await cetakPDF(html, path.join(AKAR, NAMA + ".pdf")); console.log("PDF  →", NAMA + ".pdf");
  await buatDOCX(path.join(AKAR, NAMA + ".docx")); console.log("DOCX →", NAMA + ".docx");
})().catch(e => { console.error("Gagal:", e.message); process.exit(1); });
