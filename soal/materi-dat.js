/* Materi Pos 4 — Data & Peluang (d1–d3): teori singkat & contoh bertahap.
   Skema: lihat komentar MATERI di soal/inti.js. Dimuat setelah semua berkas soal. */
"use strict";

(() => {
  /* ---------- Warna & bantuan gambar ---------- */
  const BIRU = "#2F7FD8", HIJAU = "#2E9E5B", EMAS = "#F2B92E", MERAH = "#D9534F", UNGU = "#7B4FD6", TEKS = "#1F2633", ABU = "#C9D3E0";
  const MUDA_B = "#E3EFFC", MUDA_E = "#FFF4D2";
  const WARNA = [BIRU, EMAS, HIJAU, MERAH, UNGU];
  const tulis = (x, y, s, uk = 13, o = "") => svgT(x, y, s, `font-size="${uk}"` + (/fill=/.test(o) ? "" : ` fill="${TEKS}"`)
    + (/text-anchor=/.test(o) ? "" : ` text-anchor="middle"`) + (o ? " " + o : ""));
  const latar = (w, h) => `<rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="#FFFFFF"/>`;

  /* Piktogram: satu buku = 4 buku, ada setengah gambar */
  function gbrPiktogram() {
    const w = 350, h = 150, baris = [["Senin", 3], ["Selasa", 5], ["Rabu", 2.5]];
    let s = svgBuka(w, h, "Piktogram buku yang dibaca. Satu gambar mewakili 4 buku") + latar(w, h) + tulis(w / 2, 18, "Buku yang dibaca Dina", 14, `font-weight="bold"`);
    const buku = (x, y, setengah) => `<rect x="${x}" y="${y}" width="${setengah ? 9 : 18}" height="22" rx="2" fill="${BIRU}"/>` + (setengah ? "" : `<line x1="${x + 9}" y1="${y + 2}" x2="${x + 9}" y2="${y + 20}" stroke="#fff" stroke-width="1.5"/>`);
    baris.forEach(([hari, n], i) => {
      const y = 32 + i * 32; s += tulis(8, y + 16, hari, 13, `text-anchor="start"`);
      for (let k = 0; k < Math.ceil(n); k++) s += buku(64 + k * 24, y, n - k < 1);
      s += tulis(w - 8, y + 16, `${n === 2.5 ? "2½" : n} × 4 = ${n * 4}`, 13, `text-anchor="end" font-weight="bold" fill="${n === 2.5 ? MERAH : TEKS}"`);
    });
    s += buku(64, 128) + tulis(90, 144, "= 4 buku   (setengah gambar = 2 buku)", 12, `text-anchor="start"`);
    return s + "</svg>";
  }

  /* Diagram batang dengan garis bantu dari ujung batang ke sumbu */
  function gbrBatangPandu() {
    const w = 340, h = 210, kat = ["Senin", "Selasa", "Rabu", "Kamis"], v = [12, 8, 14, 10], maks = 16, Y = x => 172 - x / maks * 144;
    let s = svgBuka(w, h, "Diagram batang buku yang dipinjam. Batang Rabu menunjuk angka 14") + latar(w, h) + tulis(w / 2, 16, "Buku yang dipinjam", 14, `font-weight="bold"`);
    for (let k = 0; k <= maks; k += 2) s += `<line x1="40" y1="${Y(k)}" x2="${w - 10}" y2="${Y(k)}" stroke="${ABU}" stroke-width="1"/>` + tulis(34, Y(k) + 4, k, 11, `text-anchor="end"`);
    kat.forEach((k, i) => { const x = 60 + i * 70, sorot = i === 2;
      s += `<rect x="${x}" y="${Y(v[i])}" width="40" height="${Y(0) - Y(v[i])}" fill="${sorot ? EMAS : BIRU}" stroke="rgba(0,0,0,.25)"/>` + tulis(x + 20, 190, k, 12, `font-weight="bold"`); });
    s += `<line x1="40" y1="${Y(14)}" x2="200" y2="${Y(14)}" stroke="${MERAH}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    s += `<rect x="4" y="${Y(14) - 10}" width="32" height="18" rx="4" fill="${MERAH}"/>` + tulis(20, Y(14) + 4, "14", 12, `fill="#fff" font-weight="bold"`);
    s += `<line x1="40" y1="${Y(0)}" x2="${w - 10}" y2="${Y(0)}" stroke="${TEKS}" stroke-width="2.5"/>` + tulis(w / 2, 206, "Setiap garis bantu naik 2", 11, `fill="#5A6577"`);
    return s + "</svg>";
  }

  /* Diagram lingkaran dengan persen */
  function gbrLingkaran(kat, pr, judul) {
    const w = 340, h = 190, c = 92, cy = 100, r = 80;
    let s = svgBuka(w, h, `Diagram lingkaran ${judul}: ${kat.map((k, i) => k + " " + pr[i] + "%").join(", ")}`) + latar(w, h), a0 = -Math.PI / 2;
    kat.forEach((k, i) => { const a1 = a0 + pr[i] / 100 * 2 * Math.PI, x0 = c + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = c + r * Math.cos(a1), y1 = cy + r * Math.sin(a1), am = (a0 + a1) / 2;
      s += `<path d="M${c} ${cy}L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${pr[i] > 50 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" fill="${WARNA[i]}" stroke="#fff" stroke-width="2"/>`;
      s += tulis((c + r * 0.62 * Math.cos(am)).toFixed(1), (cy + r * 0.62 * Math.sin(am) + 5).toFixed(1), pr[i] + "%", 13, `font-weight="bold" fill="${i === 1 ? TEKS : "#fff"}"`); a0 = a1; });
    kat.forEach((k, i) => { s += `<rect x="196" y="${40 + i * 28}" width="16" height="16" rx="3" fill="${WARNA[i]}"/>` + tulis(220, 53 + i * 28, k, 13, `text-anchor="start"`); });
    return s + tulis(196, 22, judul, 13, `text-anchor="start" font-weight="bold"`) + "</svg>";
  }

  /* Rata-rata = meratakan batang */
  function gbrRata() {
    const w = 340, h = 190, v = [4, 7, 5, 8], Y = x => 160 - x * 15;
    let s = svgBuka(w, h, "Data 4, 7, 5, 8 diratakan menjadi 6, 6, 6, 6") + latar(w, h) + tulis(w / 2, 18, "4 + 7 + 5 + 8 = 24,  24 : 4 = 6", 14, `font-weight="bold"`);
    v.forEach((x, i) => { const bx = 40 + i * 62;
      s += `<rect x="${bx}" y="${Y(x)}" width="42" height="${Y(0) - Y(x)}" fill="${x > 6 ? HIJAU : BIRU}" stroke="rgba(0,0,0,.25)"/>` + tulis(bx + 21, Y(x) - 6, x, 13, `font-weight="bold"`); });
    s += `<line x1="30" y1="${Y(6)}" x2="300" y2="${Y(6)}" stroke="${MERAH}" stroke-width="2.5" stroke-dasharray="6 4"/>` + tulis(304, Y(6) + 4, "6", 14, `text-anchor="start" font-weight="bold" fill="${MERAH}"`);
    s += `<line x1="30" y1="${Y(0)}" x2="300" y2="${Y(0)}" stroke="${TEKS}" stroke-width="2.5"/>`;
    return s + tulis(w / 2, 182, "Yang tinggi menambal yang rendah → semua jadi 6", 12, `fill="#5A6577"`) + "</svg>";
  }

  /* Median: data urut, yang tengah disorot */
  function gbrMedian() {
    const w = 350, h = 176, kartu = (x, y, n, sorot) => `<rect x="${x}" y="${y}" width="36" height="34" rx="6" fill="${sorot ? MUDA_E : MUDA_B}" stroke="${sorot ? EMAS : BIRU}" stroke-width="${sorot ? 3 : 1.5}"/>` + tulis(x + 18, y + 23, n, 15, `font-weight="bold"`);
    let s = svgBuka(w, h, "Median data ganjil 3 5 6 7 8 9 10 adalah 7. Median data genap 2 4 5 7 9 10 adalah 6") + latar(w, h);
    s += tulis(10, 18, "7 data (ganjil): data ke-4 di tengah", 13, `text-anchor="start" font-weight="bold"`);
    [3, 5, 6, 7, 8, 9, 10].forEach((n, i) => { s += kartu(12 + i * 46, 26, n, i === 3); });
    s += tulis(w / 2, 80, "Median = 7", 13, `font-weight="bold" fill="${MERAH}"`);
    s += tulis(10, 106, "6 data (genap): dua data di tengah", 13, `text-anchor="start" font-weight="bold"`);
    [2, 4, 5, 7, 9, 10].forEach((n, i) => { s += kartu(12 + i * 46, 114, n, i === 2 || i === 3); });
    return s + tulis(w / 2, 168, "Median = (5 + 7) : 2 = 6", 13, `font-weight="bold" fill="${MERAH}"`) + "</svg>";
  }

  /* Modus: diagram titik, kolom tertinggi */
  function gbrModus() {
    const w = 320, h = 180, nilai = [6, 7, 8, 9], f = [3, 5, 2, 1];
    let s = svgBuka(w, h, "Diagram titik nilai 6, 7, 8, 9. Nilai 7 paling sering muncul, 5 kali, jadi modusnya 7") + latar(w, h);
    nilai.forEach((v, i) => { const x = 50 + i * 70, sorot = i === 1;
      for (let k = 0; k < f[i]; k++) s += `<circle cx="${x}" cy="${140 - k * 24}" r="9" fill="${sorot ? EMAS : BIRU}"/>`;
      s += tulis(x, 166, v, 14, `font-weight="bold"`); });
    s += `<line x1="20" y1="152" x2="${w - 20}" y2="152" stroke="${TEKS}" stroke-width="2"/>`;
    return s + tulis(185, 30, "Modus = 7 (muncul 5 kali)", 13, `text-anchor="start" font-weight="bold" fill="${MERAH}"`) + "</svg>";
  }

  /* Skala peluang 0 sampai 1 */
  function gbrSkala() {
    const w = 350, h = 104;
    let s = svgBuka(w, h, "Skala peluang: 0 tidak mungkin, antara 0 dan 1 mungkin, 1 pasti") + latar(w, h);
    s += `<rect x="30" y="40" width="290" height="12" rx="6" fill="${MUDA_B}" stroke="${BIRU}"/>`;
    [[30, "0", "tidak mungkin", MERAH], [175, "½", "mungkin", EMAS], [320, "1", "pasti", HIJAU]].forEach(([x, a, k, wr]) => {
      s += `<circle cx="${x}" cy="46" r="9" fill="${wr}"/>` + tulis(x, 28, a, 15, `font-weight="bold"`) + tulis(x, 76, k, 13, `font-weight="bold" fill="${wr}"`); });
    return s + tulis(w / 2, 97, "Peluang selalu di antara 0 dan 1", 12, `fill="#5A6577"`) + "</svg>";
  }

  /* Kantong kelereng: 3 merah, 2 biru, 1 kuning */
  function gbrKantong() {
    const w = 340, h = 160, isi = [MERAH, MERAH, MERAH, BIRU, BIRU, EMAS], pos = [[60, 92], [88, 108], [116, 92], [74, 122], [104, 128], [92, 82]];
    let s = svgBuka(w, h, "Kantong berisi 3 kelereng merah, 2 biru, 1 kuning. Peluang merah 3 per 6 sama dengan 1 per 2") + latar(w, h);
    s += `<path d="M40 60 Q30 150 90 150 Q150 150 140 60 Z" fill="#F3E3C8" stroke="#8A6A3A" stroke-width="2.5"/><path d="M48 58 Q90 44 132 58" fill="none" stroke="#8A6A3A" stroke-width="4" stroke-linecap="round"/>`;
    isi.forEach((wr, i) => { s += `<circle cx="${pos[i][0]}" cy="${pos[i][1]}" r="11" fill="${wr}" stroke="#fff" stroke-width="1.5"/>`; });
    s += tulis(170, 50, "Semua kelereng: 6", 13, `text-anchor="start" font-weight="bold"`) + tulis(170, 76, "Merah: 3", 13, `text-anchor="start" fill="${MERAH}" font-weight="bold"`);
    s += tulis(170, 106, "Peluang merah", 13, `text-anchor="start"`) + tulis(170, 128, "= 3/6 = 1/2", 15, `text-anchor="start" font-weight="bold" fill="${MERAH}"`);
    return s + "</svg>";
  }

  /* Ruang sampel: dadu dan uang logam */
  function gbrRuang() {
    const w = 350, h = 150, TT = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]] };
    let s = svgBuka(w, h, "Dadu punya 6 hasil, satu uang logam punya 2 hasil, dua uang logam punya 4 hasil") + latar(w, h);
    s += tulis(110, 18, "Dadu: 6 hasil", 13, `font-weight="bold"`);
    for (let n = 1; n <= 6; n++) { const x = 8 + (n - 1) % 3 * 70, y = 28 + Math.floor((n - 1) / 3) * 58;
      s += `<rect x="${x}" y="${y}" width="46" height="46" rx="8" fill="#fff" stroke="${TEKS}" stroke-width="2"/>`;
      TT[n].forEach(([c, r]) => { s += `<circle cx="${x + 11 + c * 12}" cy="${y + 11 + r * 12}" r="4" fill="${n === 1 ? MERAH : TEKS}"/>`; }); }
    s += tulis(290, 18, "Uang logam: 2 hasil", 13, `font-weight="bold"`);
    [["A", 262], ["G", 318]].forEach(([t, x]) => { s += `<circle cx="${x}" cy="52" r="20" fill="${EMAS}" stroke="#B98A10" stroke-width="2"/>` + tulis(x, 58, t, 16, `font-weight="bold"`); });
    s += tulis(290, 100, "Dua uang logam: 4 hasil", 12, `font-weight="bold"`) + tulis(290, 120, "AA, AG, GA, GG", 13, `fill="${BIRU}" font-weight="bold"`);
    return s + tulis(290, 142, "A = angka, G = gambar", 11, `fill="#5A6577"`) + "</svg>";
  }

  /* ================= d1: Membaca tabel & diagram ================= */
  MATERI.d1 = {
    ringkas: [
      { judul: "Tabel & piktogram",
        isi: `<p><b>Tabel</b>: cari dulu barisnya (kategori), lalu baca angkanya di kolom yang diminta.</p>
<p><b>Piktogram</b> memakai gambar. Lihat dulu <b>keterangan</b>: satu gambar mewakili berapa?</p>
<ul><li>Banyak = jumlah gambar × nilai satu gambar.</li><li>Setengah gambar = setengah nilainya.</li></ul>`,
        gambar: gbrPiktogram() },
      { judul: "Diagram batang & diagram garis",
        isi: `<p>Untuk membaca satu batang (atau satu titik), <b>tarik garis lurus</b> dari ujungnya ke sumbu angka di kiri.</p>
<ul><li>Perhatikan <b>skala</b>: garis bantu bisa naik 2, 5, atau 10.</li><li>Batang tertinggi = paling banyak, batang terpendek = paling sedikit.</li>
<li>Pada diagram garis, garis yang paling curam naiknya = kenaikan terbesar.</li></ul>`,
        gambar: gbrBatangPandu() },
      { judul: "Diagram lingkaran (persen)",
        isi: `<p>Satu lingkaran penuh = <b>100%</b> = seluruh data.</p>
<ul><li>Banyak satu bagian = persen × jumlah seluruhnya.</li><li>Ingat: 50% = ${pc(1, 2)}, 25% = ${pc(1, 4)}, 10% = ${pc(1, 10)}.</li>
<li>Jika diketahui banyak satu bagian, cari 100%: banyak × 100 : persennya.</li></ul>`,
        gambar: gbrLingkaran(["Sepak bola", "Renang", "Voli", "Basket"], [50, 25, 15, 10], "Olahraga kesukaan") },
      { judul: "Tips TKA membaca data",
        isi: `<ul><li>Baca <b>judul</b> dan <b>satuan</b> dulu (siswa, kg, buku, orang).</li>
<li>Soal TKA sering meminta <b>jumlah</b>, <b>selisih</b>, atau <b>berapa kali lipat</b> dari dua data.</li>
<li>"Lebih dari 20" artinya 20 <b>tidak</b> ikut dihitung.</li>
<li>Tulis dulu semua nilai yang kamu baca, baru dihitung. Lebih rapi, lebih sedikit salah!</li></ul>` },
    ],
    contoh: [
      { soal: "Perhatikan diagram batang <b>Buku yang dipinjam</b>. Berapa selisih buku yang dipinjam hari Rabu dan hari Selasa?",
        gambar: gbrBatangPandu(),
        langkah: ["Baca batang Rabu: tarik garis ke kiri, menunjuk 14.", "Baca batang Selasa: menunjuk 8.", "Selisih = yang besar − yang kecil = 14 − 8 = 6.", "Jadi, selisihnya <b>6 buku</b>."],
        jawab: "6 buku" },
      { soal: "Pada piktogram, satu gambar buku mewakili 4 buku. Pada baris Rabu ada 2 gambar penuh dan setengah gambar. Berapa buku yang dibaca hari Rabu?",
        gambar: gbrPiktogram(),
        langkah: ["Satu gambar = 4 buku, jadi setengah gambar = 4 : 2 = 2 buku.", "2 gambar penuh = 2 × 4 = 8 buku.", "Jumlahkan: 8 + 2 = 10 buku.", "Jadi, hari Rabu Dina membaca <b>10 buku</b>."],
        jawab: "10 buku" },
      { soal: "Diagram lingkaran menunjukkan olahraga kesukaan 240 siswa. Berapa selisih banyak siswa yang menyukai sepak bola dan renang?",
        gambar: gbrLingkaran(["Sepak bola", "Renang", "Bulu tangkis", "Voli"], [35, 25, 20, 20], "Olahraga 240 siswa"),
        langkah: ["Baca diagram: sepak bola 35%, renang 25%.", "Selisih persennya: 35% − 25% = 10%.", `Ubah ke banyak siswa: 10% × 240 = ${pc(10, 100)} × 240 = 24.`, "Jadi, selisihnya <b>24 siswa</b>."],
        jawab: "24 siswa" },
    ],
  };

  /* ================= d2: Rata-rata, modus, median ================= */
  MATERI.d2 = {
    ringkas: [
      { judul: "Rata-rata",
        isi: `<p><b>Rata-rata = jumlah semua data : banyak data.</b></p>
<p>Bayangkan semua batang diratakan sampai sama tinggi. Contoh: 4, 7, 5, 8 → jumlahnya 24, ada 4 data, jadi rata-ratanya 24 : 4 = 6.</p>
<ul><li>Kebalikannya: <b>jumlah = rata-rata × banyak data</b>. Rumus ini dipakai untuk mencari data yang hilang.</li></ul>`,
        gambar: gbrRata() },
      { judul: "Median (nilai tengah)",
        isi: `<p><b>Urutkan dulu</b> dari yang terkecil! Lalu cari data yang di tengah.</p>
<ul><li>Banyak data <b>ganjil</b>: median = data ke-(n + 1) : 2.</li><li>Banyak data <b>genap</b>: ada dua data tengah, median = (jumlah keduanya) : 2.</li>
<li>Dari tabel frekuensi: hitung urutan data dari nilai terkecil sampai ketemu data tengahnya.</li></ul>`,
        gambar: gbrMedian() },
      { judul: "Modus (paling sering)",
        isi: `<p><b>Modus = nilai yang paling sering muncul.</b> Hitung berapa kali setiap nilai muncul.</p>
<ul><li>Pada tabel atau diagram batang: modus = nilai yang banyaknya (batangnya) paling besar.</li>
<li>Hati-hati: modus adalah <b>nilainya</b>, bukan banyak siswanya.</li></ul>`,
        gambar: gbrModus() },
      { judul: "Trik TKA: rata-rata gabungan & data hilang",
        isi: `<ul><li><b>Rata-rata gabungan</b>: hitung jumlah nilai setiap kelompok (rata-rata × banyak), jumlahkan, lalu bagi banyak semua anggota. Jangan langsung merata-rata dua rata-rata jika banyak anggotanya berbeda!</li>
<li><b>Data yang hilang</b>: jumlah semua (rata-rata × banyak data) − jumlah data yang diketahui.</li>
<li><b>Nilai tambahan</b> agar rata-rata naik: jumlah baru yang diinginkan − jumlah lama.</li></ul>` },
    ],
    contoh: [
      { soal: "Nilai ulangan Raka: 7, 8, 6, 9, 10. Berapa rata-ratanya?",
        langkah: ["Jumlahkan semua data: 7 + 8 + 6 + 9 + 10 = 40.", "Banyaknya ada 5 data, jadi jumlahnya dibagi 5.", "Rata-rata = 40 : 5 = 8.", "Jadi, rata-ratanya <b>8</b>."],
        jawab: "8" },
      { soal: `Tabel nilai ulangan 15 siswa:<table class="tabel-data"><thead><tr><th>Nilai</th><th>6</th><th>7</th><th>8</th><th>9</th></tr></thead><tbody><tr><td>Banyak siswa</td><td>6</td><td>2</td><td>3</td><td>4</td></tr></tbody></table>Tentukan modus dan median nilai tersebut.`,
        langkah: ["Modus: banyak siswa terbesar adalah 6, pada nilai 6. Jadi modusnya 6.", "Banyak data = 6 + 2 + 3 + 4 = 15 (ganjil), jadi median = data ke-(15 + 1) : 2 = data ke-8.",
          "Urutkan dari nilai terkecil: nilai 6 → data ke-1 sampai ke-6; nilai 7 → data ke-7 sampai ke-8; nilai 8 → data ke-9 sampai ke-11; nilai 9 → data ke-12 sampai ke-15.",
          "Data ke-8 ada pada nilai 7, jadi mediannya 7.", "Jadi, modusnya <b>6</b> dan mediannya <b>7</b>."],
        jawab: "Modus 6, median 7" },
      { soal: "Rata-rata nilai 20 siswa putra adalah 75. Rata-rata nilai 10 siswa putri adalah 84. Berapa rata-rata nilai seluruh siswa?",
        langkah: [`Jumlah nilai siswa putra = 20 × 75 = ${fmt(1500)}.`, "Jumlah nilai siswa putri = 10 × 84 = 840.", `Jumlah semua = ${fmt(1500)} + 840 = ${fmt(2340)}, banyak siswa = 20 + 10 = 30.`,
          `Rata-rata = ${fmt(2340)} : 30 = 78. (Bukan (75 + 84) : 2 = 79,5, karena banyak siswanya tidak sama.)`, "Jadi, rata-rata seluruh siswa <b>78</b>."],
        jawab: "78" },
    ],
  };

  /* ================= d3: Peluang sederhana ================= */
  MATERI.d3 = {
    ringkas: [
      { judul: "Pasti, mungkin, tidak mungkin",
        isi: `<ul><li><b>Pasti</b>: selalu terjadi. Contoh: dadu menunjukkan mata kurang dari 7.</li>
<li><b>Mungkin</b>: bisa terjadi, bisa juga tidak. Contoh: dadu menunjukkan mata genap.</li>
<li><b>Tidak mungkin</b>: tidak akan pernah terjadi. Contoh: dadu menunjukkan mata 7.</li></ul>`,
        gambar: gbrSkala() },
      { judul: "Menghitung peluang",
        isi: `<p><b>Peluang = banyak kejadian yang diinginkan : banyak semua kemungkinan.</b></p>
<ul><li>Tulis hasilnya sebagai pecahan, lalu <b>sederhanakan</b>.</li><li>Makin banyak kelereng suatu warna, makin besar peluang warna itu terambil.</li>
<li>Peluang "bukan merah" = semua − merah, lalu dibagi semua.</li></ul>`,
        gambar: gbrKantong() },
      { judul: "Dadu, uang logam & semua hasil",
        isi: `<ul><li>Satu dadu: 6 hasil (1–6). Satu uang logam: 2 hasil (A atau G).</li>
<li>Dua uang logam: 2 × 2 = 4 hasil. Tiga uang logam: 2 × 2 × 2 = 8.</li><li>Uang logam dan dadu: 2 × 6 = 12. Dua dadu: 6 × 6 = 36.</li>
<li>Tips: tulis semua hasilnya dulu (misalnya AA, AG, GA, GG), baru hitung yang memenuhi.</li></ul>`,
        gambar: gbrRuang() },
      { judul: "Frekuensi harapan & tanpa pengembalian",
        isi: `<ul><li><b>Frekuensi harapan = peluang × banyak percobaan.</b> Contoh: dadu dilempar 60 kali, harapan muncul mata 6 = ${pc(1, 6)} × 60 = 10 kali.</li>
<li><b>Tidak dikembalikan</b>: kurangi dulu isi kantong (atau kartu) yang sudah diambil, baru hitung peluangnya.</li></ul>` },
    ],
    contoh: [
      { soal: "Sebuah dadu dilempar satu kali. Berapa peluang muncul mata dadu bilangan prima?",
        langkah: ["Semua mata dadu: 1, 2, 3, 4, 5, 6 → 6 hasil.", "Mata dadu prima: 2, 3, 5 → 3 hasil.", `Peluang = ${pc(3, 6)} = ${pc(1, 2)} (pembilang dan penyebut dibagi 3).`, `Jadi, peluangnya <b>${pc(1, 2)}</b>.`],
        jawab: pc(1, 2) },
      { soal: "Dalam kantong ada 4 kelereng merah, 6 kelereng biru, dan 2 kelereng hijau. Diambil satu kelereng secara acak. Berapa peluang terambil kelereng merah?",
        langkah: ["Semua kelereng: 4 + 6 + 2 = 12.", "Kelereng merah (yang diinginkan) ada 4.", `Peluang = ${pc(4, 12)} = ${pc(1, 3)} (pembilang dan penyebut dibagi 4).`, `Jadi, peluangnya <b>${pc(1, 3)}</b>.`],
        jawab: pc(1, 3) },
      { soal: "Dua uang logam dilempar bersamaan sebanyak 80 kali. Berapa frekuensi harapan muncul satu angka dan satu gambar?",
        langkah: ["Tulis semua hasil: AA, AG, GA, GG → 4 hasil.", "Yang satu angka dan satu gambar: AG, GA → 2 hasil.", `Peluang = ${pc(2, 4)} = ${pc(1, 2)}.`, `Frekuensi harapan = ${pc(1, 2)} × 80 = 40.`, "Jadi, frekuensi harapannya <b>40 kali</b>."],
        jawab: "40 kali" },
    ],
  };
})();
