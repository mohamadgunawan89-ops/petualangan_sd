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

## Pindah ke akun lain (direncanakan)

Repo ini akan dipindah ke akun GitHub dan Supabase lain. Yang perlu dibawa ke Supabase baru: tabel `pts_anak`
dan fungsi `pts_*` (migrasi `20261004200000_petualangan_tka_sd_sinkron_kode.sql` di repo database_tryout,
kontrak `kontrak/petualangan.sql`), lalu ganti `url`/`key` di `config.js`. Data Kode Anak lama dipindah
dengan ekspor/impor tabel `pts_anak`.
