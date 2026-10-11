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
