// Salin materi English Reading Tahap 0–2 ke Petualangan TKA SD (soal/inggris-data.js) + pola.js utuh.
// Dijalankan ulang bila materi English Reading Tahap 0–2 berubah (dari folder Petualangan_TKA_SD):  node alat/salin-inggris.js
// Folder English Reading dicari otomatis, atau sebutkan:  node alat/salin-inggris.js C:\Development\system_sekolah\English_Reading
const fs = require('fs'), path = require('path');
// Folder English Reading: argumen pertama, atau ../English_Reading, atau ../system_sekolah/English_Reading
const calonER = [process.argv[2], path.join(__dirname, '..', '..', 'English_Reading'), path.join(__dirname, '..', '..', 'system_sekolah', 'English_Reading')].filter(Boolean);
const ER = (calonER.find((d) => fs.existsSync(path.join(d, 'bacaan.js'))) || (() => { console.error('Folder English Reading tidak ditemukan. Pakai:  node alat/salin-inggris.js C:\Development\system_sekolah\English_Reading'); process.exit(1); })()) + '/';
const PT = path.join(__dirname, '..', 'soal') + '/';
global.window = {};
require(ER + 'bacaan.js'); require(ER + 'soal.js');
const W = global.window;
const LEVEL = W.BACAAN.filter((b) => b.tahap <= 2).map((b) => {
  const o = { id: b.id, tahap: b.tahap, judul: b.judul };
  for (const k of ['kelompok', 'kosakata', 'contohLain', 'situasi', 'mirip', 'pola', 'catatan', 'teks', 'arti']) if (b[k] !== undefined) o[k] = b[k];
  return o;
});
const BACAAN_ID = LEVEL.filter((b) => b.teks && !b.pola).map((b) => b.id);
const ambil = (src) => Object.fromEntries(BACAAN_ID.filter((id) => src && src[id]).map((id) => [id, src[id]]));
const data = { TAHAP: W.TAHAP.filter((t) => t.no <= 2), LEVEL, SOAL: ambil(W.SOAL), KATA: ambil(W.KATA_BACAAN), BS: ambil(W.SOAL_BS) };
const baris = (x) => JSON.stringify(x);
const isi = `/* Materi Bahasa Inggris — Petualangan TKA SD
   DISALIN dari English Reading (bacaan.js & soal.js, tahapan umum Tahap 0 "Fondasi", Tahap 1
   "Kalimat Sederhana", dan Tahap 2 "Teks Fungsional Pendek") pada ${new Date().toISOString().slice(0, 10)}. Jangan diubah di sini: ubah di English Reading lalu salin ulang
   (node alat/salin-inggris.js), supaya kedua aplikasi tetap sama.
   LEVEL: { id, tahap, judul, kelompok?, kosakata?: [[kata, arti, contoh, arti contoh]], contohLain?, situasi?,
            mirip?, pola?, catatan?, teks?, arti? }
   SOAL/KATA/BS: soal pemahaman, kosakata bacaan, dan benar–salah untuk bacaan Tahap 1–2. */
"use strict";
const INGGRIS = {
  TAHAP: ${baris(data.TAHAP)},
  LEVEL: [
${data.LEVEL.map((l) => '    ' + baris(l)).join(',\n')}
  ],
  SOAL: ${baris(data.SOAL)},
  KATA: ${baris(data.KATA)},
  BS: ${baris(data.BS)}
};
`;
fs.writeFileSync(PT + 'inggris-data.js', isi);
const pola = fs.readFileSync(ER + 'pola.js', 'utf8');
fs.writeFileSync(PT + 'inggris-pola.js', `/* DISALIN dari English Reading/pola.js (${new Date().toISOString().slice(0, 10)}) — perakit kalimat pola (window.POLA_GEN).
   Jangan diubah di sini: ubah di English Reading lalu salin ulang. */\n` + pola);
console.log('level', LEVEL.length, 'bacaan', BACAAN_ID, 'KB data', Math.round(isi.length / 1024), 'pola gen', Object.keys((() => { const w = {}; new Function('window', pola)(w); return w.POLA_GEN; })()).join(','));
