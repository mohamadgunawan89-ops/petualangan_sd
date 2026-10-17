/* Inti pembuat soal — Petualangan TKA SD
   ---------------------------------------------------------------
   Setiap misi mendaftarkan 10 level; tiap level berisi beberapa
   "cetakan" soal. Angka, nama tokoh, benda, dan konteks diacak
   setiap kali, jadi satu cetakan menghasilkan ratusan sampai jutaan
   soal berbeda. Riwayat soal per misi disimpan supaya soal yang
   sama tidak muncul lagi dalam waktu dekat.

   Bentuk soal yang dikembalikan sebuah cetakan:
     { bentuk: "isian" | "pg" | "pgk" | "bs",
       teks, gambar?, satuan?, petunjuk?, bahas?, langkah?,
       kunci (isian: {nilai} atau {p, q, sederhana}; pg: indeks;
              pgk/bs: larik benar/salah),
       opsi (pg/pgk) atau pernyataan (bs) }
   langkah (Matematika, 11 Okt 2026): pembahasan bertahap, larik HTML satu langkah per butir; butir terakhir
   menyebut jawabannya. Ditampilkan setelah menjawab (benar maupun salah); bahas = ringkasan satu kalimat.

   MATERI[idMisi] (soal/materi-*.js): teori singkat & contoh bertahap sebelum mengerjakan level:
     { ringkas: [{ judul, isi, gambar? }],              isi/gambar = HTML (gambar boleh SVG)
       contoh:  [{ soal, gambar?, langkah: [HTML], jawab }] }
*/
"use strict";

/* ---------- Acak ---------- */
const acak = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pilih = arr => arr[Math.floor(Math.random() * arr.length)];
const kocok = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const ambil = (arr, n) => kocok(arr).slice(0, n);
const ya = (p = 0.5) => Math.random() < p;

/* ---------- Hitung ---------- */
const fpb = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
const kpk = (a, b) => a / fpb(a, b) * b;
const sed = (p, q) => { const g = fpb(p, q) || 1; return [p / g, q / g]; };
const bulat = (x, k = 6) => Math.round(x * 10 ** k) / 10 ** k;
const fmt = n => Number(n).toLocaleString("id-ID", { maximumFractionDigits: 6 });
const rp = n => "Rp" + fmt(n);
const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const pkl = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + "." + String(m % 60).padStart(2, "0"); };

function terbilang(n) {
  const s = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  const lanjut = (sisa, f) => (sisa ? " " + f(sisa) : "");
  if (n === 0) return "nol";
  if (n < 12) return s[n];
  if (n < 20) return terbilang(n - 10) + " belas";
  if (n < 100) return terbilang(Math.floor(n / 10)) + " puluh" + lanjut(n % 10, terbilang);
  if (n < 200) return "seratus" + lanjut(n - 100, terbilang);
  if (n < 1000) return terbilang(Math.floor(n / 100)) + " ratus" + lanjut(n % 100, terbilang);
  if (n < 2000) return "seribu" + lanjut(n - 1000, terbilang);
  if (n < 1e6) return terbilang(Math.floor(n / 1000)) + " ribu" + lanjut(n % 1000, terbilang);
  if (n < 1e9) return terbilang(Math.floor(n / 1e6)) + " juta" + lanjut(n % 1e6, terbilang);
  return fmt(n);
}

/* ---------- Tokoh & benda ---------- */
const NAMA = ["Andi", "Budi", "Citra", "Dina", "Eko", "Fajar", "Gita", "Hana", "Intan", "Joko", "Kiki", "Lina", "Made", "Nina", "Oki",
  "Putri", "Rani", "Sari", "Tono", "Udin", "Vina", "Wulan", "Yusuf", "Zahra", "Bayu", "Dewi", "Rizki", "Siti", "Ayu", "Agus", "Raka", "Nadia",
  "Ilham", "Tasya", "Fikri", "Laras", "Galih", "Mira", "Dimas", "Salsa"];
const nama = () => pilih(NAMA);
const namaBeda = n => ambil(NAMA, n);

/* ---------- Tampilan pecahan ---------- */
const pcF = v => (typeof v === "number" ? fmt(v) : v);
const pc = (p, q) => `<span class="pc"><span>${pcF(p)}</span><span>${pcF(q)}</span></span>`;
/* Pecahan apa adanya (tidak disederhanakan); lebih dari 1 ditulis campuran */
function pcT(p, q) {
  if (q === 1) return fmt(p);
  if (p >= q) { const w = Math.floor(p / q), s = p % q; return s ? `${fmt(w)}&nbsp;${pc(s, q)}` : fmt(w); }
  return pc(p, q);
}
const pcS = (p, q) => { const [a, b] = sed(p, q); return pcT(a, b); };
/* Operasi pecahan [p, q] */
const pTambah = ([a, b], [c, d]) => sed(a * d + c * b, b * d);
const pKurang = ([a, b], [c, d]) => sed(a * d - c * b, b * d);
const pKali = ([a, b], [c, d]) => sed(a * c, b * d);
const pBagi = ([a, b], [c, d]) => sed(a * d, b * c);

/* ---------- Pembuat bentuk soal ---------- */
function isian(teks, nilai, o = {}) { return { bentuk: "isian", teks, kunci: { nilai: bulat(nilai) }, ...o }; }
/* Jawaban pecahan; bawaan: harus bentuk paling sederhana */
function isianPc(teks, p, q, o = {}) {
  const [a, b] = sed(p, q);
  return { bentuk: "isian", teks, kunci: { p: a, q: b, sederhana: o.sederhana !== false }, pecahan: true, ...o };
}
function pg(teks, benar, salah, o = {}) {
  const b = String(benar);
  const lain = [...new Set(salah.map(String))].filter(s => s !== b);
  const opsi = kocok([b, ...lain.slice(0, o.banyak ? o.banyak - 1 : 3)]);
  return { bentuk: "pg", teks, opsi, kunci: opsi.indexOf(b), ...o };
}
/* Pilihan berurutan tetap (mis. >, <, =) */
function pgTetap(teks, semua, benar, o = {}) {
  const opsi = semua.map(String);
  return { bentuk: "pg", teks, opsi, kunci: opsi.indexOf(String(benar)), ...o };
}
function pgk(teks, butir, o = {}) {
  const b = kocok(butir);
  return { bentuk: "pgk", teks, opsi: b.map(x => x.t), kunci: b.map(x => !!x.b), ...o };
}
function bs(teks, butir, o = {}) {
  const b = kocok(butir);
  return { bentuk: "bs", teks, pernyataan: b.map(x => x.t), kunci: b.map(x => !!x.b), ...o };
}
/* Bilangan pengecoh di sekitar n (dahulukan kesalahan yang masuk akal) */
function dekat(n, banyak = 3, utama = [], langkah) {
  const set = new Set(); const st = langkah || Math.max(1, Math.round(Math.abs(n) / 10));
  utama.forEach(x => { if (Number.isFinite(x) && x !== n && x >= 0 && set.size < banyak) set.add(bulat(x)); });
  let jaga = 0;
  while (set.size < banyak && jaga++ < 200) { const c = bulat(n + (ya() ? 1 : -1) * st * acak(1, 4)); if (c !== n && c > 0) set.add(c); }
  return [...set];
}

/* ---------- SVG ---------- */
const svgBuka = (w, h, label) => `<svg viewBox="0 0 ${w} ${h}" class="gbr" role="img" aria-label="${label || "gambar soal"}" style="max-width:${w}px">`;
const svgT = (x, y, s, o = "") => `<text x="${x}" y="${y}" ${o}>${s}</text>`;

/* ---------- Pendaftaran misi ---------- */
const PULAU = [
  { id: "mtk", judul: "Matematika", ikon: "🏝️", ket: "Pilih misi mana saja. Setiap misi punya 10 level, dari <b>sangat mudah</b> sampai <b>Bos Terakhir</b>. Selesaikan level 10 untuk mendapat piala!" },
  { id: "bin", judul: "Bahasa Indonesia", ikon: "📖", ket: "Setiap soal punya bacaan. Kuasai <b>tiga jurus membaca</b>: menemukan informasi, memahami isi, lalu menalar. Selesaikan level 10 untuk mendapat piala!" },
];
const POS = [
  { id: "bil", pulau: "mtk", no: 1, judul: "Bilangan", ikon: "🏝️", ket: "Pos paling sering keluar!" },
  { id: "alj", pulau: "mtk", no: 2, judul: "Aljabar", ikon: "🧩", ket: "Pola & teka-teki angka" },
  { id: "ukr", pulau: "mtk", no: 3, judul: "Pengukuran & Bangun", ikon: "📐", ket: "Ukur, hitung, bayangkan" },
  { id: "dat", pulau: "mtk", no: 4, judul: "Data & Peluang", ikon: "📊", ket: "Baca data seperti detektif" },
  { id: "tem", pulau: "bin", no: 1, judul: "Jurus Menemukan", ikon: "🔍", ket: "Cari informasi yang tertulis di bacaan" },
  { id: "pah", pulau: "bin", no: 2, judul: "Jurus Memahami", ikon: "💡", ket: "Makna kata, ide pokok, tokoh & latar" },
  { id: "nal", pulau: "bin", no: 3, judul: "Jurus Menalar", ikon: "🧠", ket: "Simpulan, amanat, fakta & opini" },
];
const MISI = [];
const MATERI = {};
/* Level 1–5 hanya isian singkat. Cetakan berbentuk pilihan yang ditulis di level 1–5
   ditandai keTKA(...) dan otomatis dipindah ke level 6 (atau level yang disebut). */
const keTKA = (f, L = 6) => Object.assign(f, { keLevel: L });
function daftarMisi(pos, id, judul, ikon, tingkat) {
  for (let L = 1; L <= 5; L++) (tingkat[L] || []).filter(f => f.keLevel).forEach(f => { tingkat[f.keLevel].push(f); tingkat[L] = tingkat[L].filter(g => g !== f); });
  for (let L = 1; L <= 10; L++) if (!tingkat[L] || !tingkat[L].length) throw new Error(`Misi ${id} level ${L} kosong`);
  const pulau = POS.find(p => p.id === pos).pulau;
  /* Matematika & Bahasa Indonesia (17 Okt 2026): Level 10 terlalu sulit untuk anak SD, jadi soalnya diambil dari Level 8
     (setara TKA) dan Level 9 secara campuran. Cetakan Level 10 lama tetap di berkas soal, hanya tidak dipakai. */
  if (pulau === "mtk" || pulau === "bin") tingkat[10] = [...tingkat[8], ...tingkat[9]];
  MISI.push({ pos, pulau, id, judul, ikon, tingkat });
}
const cariMisi = id => MISI.find(m => m.id === id);

/* Kunci pembeda soal untuk riwayat */
const kunciSoal = s => ((s.bacaan || "") + "|" + s.teks + "|" + (s.opsi || s.pernyataan || []).slice().sort().join("|")).replace(/<[^>]+>/g, "").replace(/\s+/g, " ")
  + "|" + (s.gambar || "").replace(/\s+/g, " ");

function buatSoal(idMisi, L, riwayat) {
  const m = cariMisi(idMisi); let s, k;
  for (let i = 0; i < 40; i++) {
    s = pilih(m.tingkat[L])(); k = kunciSoal(s);
    if (!riwayat || !riwayat.has(k)) break;
  }
  if (L >= 6 && s.bentuk === "isian") s = bentukTKA(s, m, L);
  s.kunciUnik = k; s.misi = idMisi; s.level = L;
  return s;
}

/* ---------- Bentuk soal TKA untuk level 6–10 ----------
   Level 1–5 isian singkat. Mulai level 6 semua soal berbentuk seperti TKA:
   isian diubah menjadi pilihan ganda, atau beberapa soal hitung pendek
   digabung menjadi soal benar–salah / pilihan ganda kompleks. */
function tulisNilai(s, p, q) {
  const rpDepan = /Rp\s*…/.test(s.teks), t = q !== undefined ? pcT(p, q) : fmt(p);
  if (rpDepan) return "Rp" + t;
  if (!s.satuan) return t;
  return /^[%°]$/.test(s.satuan) ? t + s.satuan : t + " " + s.satuan;
}
/* Nilai pengisi "…" di dalam kalimat: "Rp" atau satuan yang sudah tertulis di sekitar "…" tidak diulang
   (mencegah "70 menit menit", "55°°", "Rp Rp…") */
function isiTitik(s, p, q) {
  const [depan, belakang = ""] = s.teks.replace(/<[^>]+>|&nbsp;/g, " ").split("…");
  const sudah = /Rp\s*$/.test(depan) || (s.satuan && belakang.trimStart().startsWith(s.satuan));
  return sudah ? (q !== undefined ? pcT(p, q) : fmt(p)) : tulisNilai(s, p, q);
}
/* Pengecoh selalu > 0 (tidak ada "0 cm"); maks membatasi nilai, mis. sudut ≤ 360° */
function pengecohAngka(n, banyak = 3, gMin = 0, maks = Infinity) {
  const desimal = (String(n).split(".")[1] || "").length; let g = 10 ** -desimal;
  if (!desimal) { g = 1; while (n % (g * 10) === 0 && g * 10 < n) g *= 10; if (gMin && n % gMin === 0) g = Math.max(g, gMin); }
  const langkah = Math.max(g, Math.round(Math.abs(n) * 0.1 / g) * g), hasil = new Set();
  const calon = kocok([1, 2, 3, -1, -2, -3, 4, -4]).map(k => bulat(n + k * langkah));
  if (Number.isInteger(n) && n >= 10 && maks === Infinity && ya(0.4)) calon.unshift(n * 10, n / 10);
  for (const c of calon) { if (c > 0 && c <= maks && c !== n && Number.isFinite(c) && (desimal || Number.isInteger(c))) hasil.add(c); if (hasil.size >= banyak) break; }
  return [...hasil];
}
function pengecohPecahan(p, q, banyak = 3) {
  const nilai = p / q, hasil = new Map();
  for (const [a, b] of kocok([[p + 1, q], [p, q + 1], [q, p], [Math.max(1, p - 1), q], [p + q, q], [p, q + 2], [p * 2, q + 1], [p + 2, q]])) {
    if (b <= 0 || a <= 0) continue; const [x, y] = sed(a, b); if (Math.abs(x / y - nilai) < 1e-9) continue;
    hasil.set(x + "/" + y, [x, y]); if (hasil.size >= banyak) break;
  }
  return [...hasil.values()];
}
const bisaDigabung = s => s.bentuk === "isian" && !s.gambar && (s.teks.match(/…/g) || []).length === 1 && s.teks.replace(/<[^>]+>/g, "").length <= 90;
/* Pengecoh sudut: paling besar 360°, atau di bawah 180° untuk sudut segitiga */
const batasPengecoh = s => (s.satuan === "°" ? Math.max(/segitiga/i.test(s.teks) ? 179 : 360, s.kunci.nilai) : Infinity);
function bentukTKA(s, m, L) {
  const k = s.kunci;
  if (bisaDigabung(s) && ya(0.45)) {
    const kumpulan = [s];
    for (let i = 0; i < 40 && kumpulan.length < 4; i++) { const t = pilih(m.tingkat[L])(); if (bisaDigabung(t) && !kumpulan.some(x => x.teks === t.teks)) kumpulan.push(t); }
    if (kumpulan.length >= 3) {
      const butir = kumpulan.map(t => { const b = ya(), kt = t.kunci;
        const nilai = b ? (kt.p !== undefined ? isiTitik(t, kt.p, kt.q) : isiTitik(t, kt.nilai))
          : (kt.p !== undefined ? isiTitik(t, ...pilih(pengecohPecahan(kt.p, kt.q, 1))) : isiTitik(t, pengecohAngka(kt.nilai, 1, 0, batasPengecoh(t))[0]));
        return { t: t.teks.replace(/<br>/g, " ").replace("…", `<b>${nilai}</b>`), b, asal: t, benarnya: kt.p !== undefined ? isiTitik(t, kt.p, kt.q) : isiTitik(t, kt.nilai) }; });
      const bahas = kumpulan.map(t => t.bahas).filter(Boolean).join("<br>"), pk = L >= 8 && !butir.every(x => x.b) && butir.some(x => x.b);
      const q = pk ? pgk("Pilih <b>semua</b> pernyataan yang benar.", butir, { bahas }) : bs("Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan.", butir, { bahas });
      // Pembahasan bertahap: satu langkah per pernyataan, sesuai urutan yang tampil
      q.langkah = (q.opsi || q.pernyataan).map((teks, i) => { const x = butir.find(y => y.t === teks) || butir[i], cara = x.asal.bahas || (x.asal.langkah || []).slice(-1)[0] || "";
        return `${x.b ? "✔" : "✘"} Pernyataan ${i + 1} <b>${x.b ? (pk ? "benar, dipilih" : "Benar") : (pk ? "salah, tidak dipilih" : "Salah")}</b>${x.b ? "" : ` (seharusnya <b>${x.benarnya}</b>)`}. ${cara}`; });
      return q;
    }
  }
  const benar = k.p !== undefined ? tulisNilai(s, k.p, k.q) : tulisNilai(s, k.nilai);
  const gUang = /Rp\s*…/.test(s.teks) && k.nilai >= 5000 ? 500 : 0;
  const salah = k.p !== undefined ? pengecohPecahan(k.p, k.q).map(([a, b]) => tulisNilai(s, a, b)) : pengecohAngka(k.nilai, 3, gUang, batasPengecoh(s)).map(v => tulisNilai(s, v));
  if (salah.length < 3) return s;   // tidak cukup pengecoh yang masuk akal: biarkan isian
  return pg(s.teks, benar, salah, { gambar: s.gambar, petunjuk: s.petunjuk, bahas: s.bahas, langkah: s.langkah });
}

/* ---------- Memeriksa jawaban isian ---------- */
function bacaJawab(t) {
  let s = String(t || "").trim().replace(/\s+/g, " ");
  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, "");   // 1.250.000
  let m = s.match(/^(\d+) (\d+)\/(\d+)$/);
  if (m) { const w = +m[1], p = +m[2], q = +m[3]; if (!q) return null; return { nilai: (w * q + p) / q, p: w * q + p, q, sederhana: fpb(p, q) === 1 && p < q, campuran: true }; }
  m = s.match(/^(\d+)\/(\d+)$/);
  if (m) { const p = +m[1], q = +m[2]; if (!q) return null; return { nilai: p / q, p, q, sederhana: fpb(p, q) === 1 && q !== 1 }; }
  if (/^\d+(,\d+)?$/.test(s) || /^\d+\.\d+$/.test(s)) return { nilai: parseFloat(s.replace(",", ".")) };
  return null;
}
/* Hasil: { benar, catatan? } */
function periksa(soal, jawab) {
  if (soal.bentuk === "pg") return { benar: jawab === soal.kunci };
  if (soal.bentuk === "pgk" || soal.bentuk === "bs") return { benar: Array.isArray(jawab) && soal.kunci.every((k, i) => !!jawab[i] === k) };
  const j = bacaJawab(jawab);
  if (!j) return { benar: false, catatan: "Jawabannya belum bisa dibaca. Tulis angka, desimal (2,5), atau pecahan (3/4, 1 1/2)." };
  const k = soal.kunci;
  if (k.p !== undefined) {
    const sama = Math.abs(j.nilai - k.p / k.q) < 1e-9;
    if (!sama) return { benar: false };
    // 6/5 dan 1 1/5 sama-sama benar, KECUALI soal meminta pecahan campuran (soal.campuran, 6 Okt 2026)
    if (soal.campuran && k.p % k.q !== 0 && !j.campuran) return { benar: false, catatan: "Nilainya sudah benar, tetapi soal ini meminta <b>pecahan campuran</b>. Ketik misalnya 1 1/5." };
    if (k.sederhana && k.q !== 1 && j.q !== undefined && !j.sederhana) return { benar: false, catatan: "Nilainya sudah benar, tetapi belum bentuk paling sederhana." };
    if (k.sederhana && k.q !== 1 && j.q === undefined && !Number.isInteger(j.nilai)) return { benar: true };
    return { benar: true };
  }
  return { benar: Math.abs(j.nilai - k.nilai) < 1e-6 };
}
/* Kunci isian dalam bentuk HTML untuk ditampilkan */
function tulisKunci(soal) {
  if (soal.bentuk === "pg") return soal.opsi[soal.kunci];
  if (soal.bentuk === "pgk") return soal.opsi.filter((_, i) => soal.kunci[i]).join("<br>");
  if (soal.bentuk === "bs") return soal.pernyataan.map((p, i) => `${soal.kunci[i] ? "✔️ Benar" : "❌ Salah"} — ${p}`).join("<br>");
  const k = soal.kunci;
  return (k.p !== undefined ? pcT(k.p, k.q) : fmt(k.nilai)) + (soal.satuan ? " " + soal.satuan : "");
}
