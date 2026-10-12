# Petualangan TKA SD

Latihan TKA SD seperti bermain game: jelajahi pulau, selesaikan 10 level setiap misi, uji diri di Pos Tes,
kumpulkan piala. Halaman statis (GitHub Pages), kemajuan disimpan di perangkat dan disinkronkan lewat
**Kode Anak** ke database (`config.js` → tabel `pts_anak`, fungsi `pts_buat/ambil/simpan/hapus`).

## Isi

| Berkas | Isi |
|---|---|
| `soal/inti.js` | pembuat soal, pendaftaran `PULAU` → `POS` → `MISI` (10 level per misi) |
| `soal/bilangan.js` … `data.js` | Pulau Matematika |
| `soal/bahasa-*.js` | Pulau Bahasa Indonesia (3 jurus membaca) |
| `soal/inggris*.js` | **Pulau Bahasa Inggris** (11 Okt 2026) |
| `postes.js` | Pos Tes (30 soal, 75 menit, lulus 70); bobot per pos di `BOBOT_TES` |
| `app.js` | tampilan, piala, Tantangan Harian, Dasbor Ortu, suara |
| `sinkron.js` + `config.js` | sinkron Kode Anak |

## Pulau Bahasa Inggris (11 Okt 2026)

- Materi **disalin** dari English Reading, tahapan umum **Tahap 0 "Fondasi"** (35 kelompok kosakata, setara SD)
  dan **Tahap 1 "Kalimat Sederhana"** (5 pola kalimat + 4 bacaan pendek dengan soal pemahaman):
  `soal/inggris-data.js` (data) dan `soal/inggris-pola.js` (salinan `pola.js`). **Jangan diubah di sini**:
  ubah di English Reading lalu jalankan `node alat/salin-inggris.js` (butuh folder `../English_Reading`).
- 6 pos, 44 misi: Aku & Keluargaku · Angka & Waktu · Rumah & Sekolah · Kegiatan & Dunia Sekitar ·
  Kata Penting · Kalimat & Bacaan. Pembuat soal di `soal/inggris.js`.
- Level 1–5 pilihan ganda (arti kata, kata dari arti, dengar kata, lengkapi kalimat, situasi);
  level 6–10 bentuk TKA (benar–salah, pilih semua, "kecuali", dengar kalimat). Bacaan level 9–10 kadang
  hanya diperdengarkan.
- **Soal dengar**: `s.suara` dibacakan suara peramban (`speechSynthesis`, en-US, sedikit diperlambat), otomatis
  sekali + tombol 🔊. Perangkat tanpa suara bahasa Inggris mendapat soal tulis sebagai gantinya.
- Materi **tambahan**, bukan materi TKA SD: pulau ditandai `tka: false`, sehingga **tidak** ikut syarat
  Piala Raksasa Juara TKA. Piala pulau/pos/misi, Pos Tes 1–6, Tantangan Harian, dan Dasbor Ortu tetap ada.
- Diuji: 66.000 soal (44 misi × 10 level × 150, dengan & tanpa suara) tanpa kunci keliru/opsi kembar;
  uji browser beranda, soal dengar, jawab benar, Pos Tes ketiga pulau, Dasbor Ortu.

### Dengar & Baca (11 Okt 2026, `latih-inggris.js`)

Meniru English Reading, sebagai **tambahan** di depan 10 level setiap misi Bahasa Inggris (kartu "🎧 Dengar & Baca" di jalur misi):

1. **Dengarkan** seluruh teks (kalimat disorot saat dibacakan; kata bisa diketuk; kecepatan 0,6–1).
2. **Baca & Koreksi**: anak membaca keras, `SpeechRecognition` (en-US) menilai tiap kata (hijau ≥ 85, kuning 60–84,
   merah < 60); dicatat bila dibaca sampai habis, syarat **≥ 75%**. Kata yang lemah bisa didengar/diucapkan ulang.
3. **5 sub level**, 10 soal: kosakata = Kenali · Dengar · Situasi · Lengkapi & susun · Ucapkan; pola = Pilih bentuk ·
   Benar atau salah · Dengar · Susun kalimat · Ucapkan; bacaan = Kosakata · Dengar & pahami · Urutkan · Pemahaman ·
   Ucapkan kalimat. Nilai = benar pada percobaan pertama; yang salah diulang dengan soal lain tanpa menambah nilai.
   Sub level berikutnya terbuka bila **≥ 80%**. Ucapan kata lulus ≥ 70; kalimat lulus bila kata terlewat ≤ 20%.

**Ilustrasi** (12 Okt 2026, `ilustrasi-inggris.js`, disalin dari English Reading): 18 level kosakata punya gambar bantu
interaktif di layar Dengar & Baca — jam (jarum bergerak, past/to), pekan, kalender, toko sekolah (struk & kembalian),
anggota tubuh, pohon keluarga, denah rumah, preposisi (bola & kotak), palet warna, peta (rute), dan kisi ikon. Ketuk
bagian gambar → kalimatnya tampil dan dibacakan. Level berikon juga mendapat soal bergambar ("Gambar ini dalam bahasa
Inggris adalah …") di level 1–3 dan sub level Kenali. Data `ilustrasi`/`ikon`/`catatanIlus` ikut disalin `salin-inggris.js`.

Pengaturan orang tua (`S.atur.ingDengar/ingBaca/ingUcap/ingSyarat`, bawaan nyala): wajib dengar, wajib Baca & Koreksi,
sub level Ucapkan pakai mikrofon (mati = mengetik/menyusun), dan Level 1 baru terbuka setelah 5 sub level tuntas (hanya
misi yang belum dimulai). Tanpa suara/mikrofon di peramban, langkah itu dilewati otomatis. Kemajuan di `S.ing[idMisi]`
(`d`, `dh`, `b`, `s[5]`), ikut tersinkron (gabung = nilai terbesar). Pos 7 "Teks Pendek" = Tahap 2 English Reading
(3 pola + 7 bacaan), disalin oleh `node alat/salin-inggris.js`.

## Materi & pembahasan bertahap Matematika (12 Okt 2026)

- **📖 Pelajari dulu** (kartu di jalur setiap misi Matematika → layar `materi`, `materi.js`): teori singkat bergambar,
  2–3 contoh soal yang langkahnya dibuka satu per satu, dan contoh acak dari bank soal. Isinya di
  `soal/materi-bil.js`, `materi-alj.js`, `materi-ukr.js`, `materi-dat.js` (`MATERI[idMisi] = { ringkas, contoh }`).
- **Pembahasan langkah demi langkah** setelah menjawab, benar maupun salah: setiap cetakan soal Matematika punya
  `langkah` (larik HTML, butir terakhir = jawaban). `bentukTKA` ikut membawa/menyusun `langkah` untuk bentuk pg, bs, pgk.
  Ditampilkan juga di pembahasan mode ujian, Pos Tes, dan contoh di halaman Orang Tua. Belum lulus level → tombol
  "Pelajari materinya dulu".
- Pemeriksa: `node alat/cek-langkah.js [bil|alj|ukr|dat] [sampel]` (langkah ada, tag seimbang, materi lengkap).

## Pos TKA & Rencana Belajar (12 Okt 2026)

- **Pos TKA** (`postes.js`): pos terakhir Pulau Matematika dan Bahasa Indonesia (mapel TKA SD/MI), 10 paket
  Simulasi TKA per mapel. Acuan kerangka asesmen TKA SD/MI (Perkaban BSKAP No. 047/H/AN/2025): 30 soal, 75 menit;
  pilihan ganda, PG kompleks, benar–salah (tanpa isian). Elemen & jumlah soal di `KISI_TKA`/`BOBOT_TES`, tingkat di
  `LEVEL_TKA` (6 mudah, 8 sedang, 12 setara TKA, 4 HOTS), sasaran bentuk di `BENTUK_TKA`. Soal tiap paket tetap (benih
  acak dari id paket) supaya nilai bisa dibandingkan. Selalu terbuka. Nilai 70+ = tuntas (piala perak); kesepuluh
  paket tuntas = piala emas "Juara Simulasi TKA". Bahasa Inggris tidak mendapat Pos TKA (tidak diujikan di TKA SD).
- **Rencana Belajar** (`rencana.js`, tab 📅 Rencana + kartu "Target hari ini" di beranda): dari tanggal TKA dan
  pengaturan orang tua (menit per hari, hari belajar, hari simulasi) disusun target level harian Matematika & Bahasa
  Indonesia, jadwal 20 paket simulasi menjelang TKA, dan H-1 rehat. Disusun ulang setiap hari dari kemajuan nyata
  (hari terlewat dibagi ke hari berikutnya); tugas hari ini dibekukan di `S.rencanaHari` (lokal). Tampilan: hitung
  mundur & cincin kesiapan, status sesuai jadwal (`S.rencanaAwal`), target hari ini (tercentang otomatis), garis waktu
  fase, minggu ini, kalender belajar (dilipat per bulan), dan ringkasan.
- **Bahasa Inggris dalam rencana** (opsional, program belajar jangka panjang): `S.atur.ingTarget` (target selesai; boleh
  sesudah TKA, bertahun-tahun — rentang rencana sampai tanggal paling akhir, juga tanpa tanggal TKA),
  `ingHari` (hari latihan), `ingSampai` (cakupan: Dengar & Baca saja / + Level 1–5 / semua level). Sub level Dengar & Baca
  dihitung 2 tugas. Dijadwalkan lebih dulu, tetapi selama materi TKA masih ada paling banyak separuh waktu hari itu;
  bila tidak muat, ringkasan memberi perkiraan selesai dan menit yang dibutuhkan.

## Database (Supabase sendiri, sejak 11 Okt 2026)

- Proyek Supabase: `gwanpjezsokmxulebing` (alamat & kunci publik di `config.js`; kunci publik memang boleh terlihat).
- Isi database ada di `database/migrations/` (urut nama berkas): tabel `pts_anak` + fungsi `pts_buat/ambil/simpan/hapus`,
  dan `pts_ping` untuk penjaga. Hanya PostgreSQL biasa (tanpa fitur khusus Supabase), jadi bisa pindah ke server lain.
- **11 Okt 2026**: isi database sempat terhapus (skrip pembersih Tryout terjalankan di proyek ini) lalu dipasang ulang.
  Baris `pts_anak` lama hilang; perangkat anak yang membawa Kode Anak lama mengirim ulang kemajuannya otomatis
  (`pts_pulihkan`, dipanggil `sinkronkan()` bila `pts_ambil` menjawab "tidak ditemukan").
- **Menerapkan migrasi baru**: buka Supabase → SQL Editor → New query → tempel isi berkas → Run.
- **Penjaga**: `.github/workflows/jaga-supabase.yml` memanggil `pts_ping` tiap 3 hari agar proyek gratis tidak dijeda.
  Bila gagal, GitHub mengirim surel; periksa apakah proyek Supabase sedang dijeda (Restore).
- **Rahasia**: kunci `sb_secret_…` dan sandi database **jangan** ditaruh di repo atau dikirim lewat chat. `.env` dan
  `.pindah/` (berisi data anak) sudah diabaikan git.

## Pindah akun (11 Okt 2026)

Dulu menumpang di database Tryout dan repo `smapmerdekasoreang99-star/game_tka_sd`; sekarang di repo
`mohamadgunawan89-ops/petualangan_sd` dan Supabase sendiri. Data Kode Anak lama ikut dipindah. Karena alamat situs
berubah, kemajuan di perangkat (localStorage) tidak ikut: anak membuka situs baru → **🔗 Masukkan Kode Anak lain** →
ketik Kode Anaknya, dan kemajuan dari server muncul kembali.

Situs lama (`smapmerdekasoreang99-star.github.io/game_tka_sd/`) sempat menjadi halaman pengalih yang membawa
kemajuan perangkat lewat `#pindah=…` (diterima `terimaPindahan()` di `app.js`); repo lama **dihapus 11 Okt 2026**,
jadi alamat lama tidak ada lagi. `terimaPindahan()` boleh dibuang kapan saja. Folder ini kini di
`C:\Development\petualangan_sd`, `origin` = repo baru (`git push` biasa).

Bila suatu saat pindah lagi: jalankan semua berkas `database/migrations/` di server baru, salin isi tabel `pts_anak`,
ganti `url`/`key` di `config.js`, dan ganti alamat di `jaga-supabase.yml`.

## Mengerjakan di komputer

Folder ini proyek tersendiri (buka foldernya langsung di VS Code). Materi Bahasa Inggris disalin dari English Reading:
`node alat/salin-inggris.js <folder English_Reading>`.
