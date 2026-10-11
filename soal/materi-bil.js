/* Materi Pos 1 — Bilangan (b1–b7): teori singkat & contoh bertahap.
   Skema: lihat komentar MATERI di soal/inti.js. Dimuat setelah semua berkas soal. */
"use strict";

(() => {
  /* ---------- Warna & bantuan gambar ---------- */
  const BIRU = "#2F7FD8", HIJAU = "#2E9E5B", EMAS = "#F2B92E", MERAH = "#D9534F", UNGU = "#7B4FD6", TEKS = "#1F2633";
  const MUDA_B = "#E3EFFC", MUDA_H = "#E2F6EA", MUDA_E = "#FFF4D2";
  const tulis = (x, y, s, uk = 13, o = "") => svgT(x, y, s, `font-size="${uk}"` + (/fill=/.test(o) ? "" : ` fill="${TEKS}"`)
    + (/text-anchor=/.test(o) ? "" : ` text-anchor="middle"`) + (o ? " " + o : ""));
  const latar = (w, h) => `<rect x="0" y="0" width="${w}" height="${h}" rx="10" fill="#FFFFFF"/>`;
  const PANGKAT = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const pangkat = n => String(n).split("").map(d => PANGKAT[+d]).join("");

  /* Kotak nilai tempat untuk 345.672 */
  function gbrNilaiTempat() {
    const w = 360, h = 112, label = [["ratus", "ribuan"], ["puluh", "ribuan"], ["ribuan"], ["ratusan"], ["puluhan"], ["satuan"]];
    const angka = [3, 4, 5, 6, 7, 2], nilai = ["300.000", "40.000", "5.000", "600", "70", "2"];
    let s = svgBuka(w, h, "Kotak nilai tempat bilangan 345.672") + latar(w, h);
    angka.forEach((a, i) => {
      const x = 4 + i * 59, cx = x + 28, sorot = i === 1;
      const garis = i < 3 ? UNGU : BIRU, isi = sorot ? MUDA_E : (i < 3 ? "#F0EAFB" : MUDA_B);
      if (label[i].length === 2) { s += tulis(cx, 14, label[i][0], 12) + tulis(cx, 28, label[i][1], 12); }
      else s += tulis(cx, 28, label[i][0], 12);
      s += `<rect x="${x}" y="36" width="56" height="44" rx="6" fill="${isi}" stroke="${sorot ? EMAS : garis}" stroke-width="${sorot ? 3 : 2}"/>`;
      s += tulis(cx, 67, a, 26, `font-weight="bold"`);
      s += tulis(cx, 100, nilai[i], 12, sorot ? `font-weight="bold" fill="${MERAH}"` : "");
    });
    return s + "</svg>";
  }

  /* Garis bilangan 340–350: 347 dibulatkan ke 350 */
  function gbrGarisBulat() {
    const w = 360, h = 100, x0 = 20, d = 32, X = n => x0 + (n - 340) * d;
    let s = svgBuka(w, h, "Garis bilangan 340 sampai 350, 347 lebih dekat ke 350") + latar(w, h);
    s += `<line x1="${X(340)}" y1="60" x2="${X(350)}" y2="60" stroke="${TEKS}" stroke-width="2"/>`;
    for (let n = 340; n <= 350; n++) {
      const besar = n === 340 || n === 345 || n === 350;
      s += `<line x1="${X(n)}" y1="${besar ? 50 : 54}" x2="${X(n)}" y2="${besar ? 70 : 66}" stroke="${n === 345 ? EMAS : TEKS}" stroke-width="${besar ? 3 : 1.5}"/>`;
      if (besar) s += tulis(X(n), 88, n, 13, `font-weight="bold"`);
    }
    s += `<circle cx="${X(347)}" cy="60" r="7" fill="${MERAH}"/>` + tulis(X(347), 40, "347", 13, `font-weight="bold" fill="${MERAH}"`);
    s += `<path d="M ${X(347) + 6} 50 Q ${X(348.5)} 28 ${X(350) - 2} 48" fill="none" stroke="${HIJAU}" stroke-width="2.5"/>`;
    s += `<polygon points="${X(350) - 2},50 ${X(350) - 9},42 ${X(350) + 3},41" fill="${HIJAU}"/>`;
    s += tulis(X(345), 22, "tengah = 345", 12, `fill="#8A6A00"`);
    s += tulis(250, 22, "lebih dekat ke 350", 12, `fill="${HIJAU}" text-anchor="start"`);
    return s + "</svg>";
  }

  /* Urutan operasi: ( ) → × : → + − */
  function gbrUrutan() {
    const w = 360, h = 84, kotak = [["( )", "1. Kurung", UNGU, "#F0EAFB"], ["×  :", "2. Kali/Bagi", BIRU, MUDA_B], ["+  −", "3. Tambah/Kurang", HIJAU, MUDA_H]];
    let s = svgBuka(w, h, "Urutan operasi: kurung, lalu kali dan bagi, lalu tambah dan kurang") + latar(w, h);
    kotak.forEach(([lambang, ket, g, f], i) => {
      const x = 4 + i * 124;
      s += `<rect x="${x}" y="8" width="104" height="66" rx="10" fill="${f}" stroke="${g}" stroke-width="2"/>`;
      s += tulis(x + 52, 40, lambang, 22, `font-weight="bold" fill="${g}"`) + tulis(x + 52, 62, ket, 12);
      if (i < 2) s += `<polygon points="${x + 108},34 ${x + 120},41 ${x + 108},48" fill="${EMAS}"/>`;
    });
    return s + "</svg>";
  }

  /* Pohon faktor bertingkat: kiri = faktor prima, kanan = sisa */
  function gbrPohon(n) {
    const tingkat = []; let c = n;
    while (c > 1) { let p = 2; while (c % p) p++; if (p === c) break; tingkat.push([p, c / p]); c /= p; }
    const w = 360, h = 40 + tingkat.length * 46 + 26, fp = {};
    let x = 120, y = 24;
    let s = svgBuka(w, h, `Pohon faktor bilangan ${n}`) + latar(w, h);
    const simpul = (cx, cy, v, prima) => `<circle cx="${cx}" cy="${cy}" r="17" fill="${prima ? MUDA_H : MUDA_B}" stroke="${prima ? HIJAU : BIRU}" stroke-width="2"/>` + tulis(cx, cy + 5, v, 14, `font-weight="bold"`);
    let isi = simpul(x, y, n, false), garis = "";
    tingkat.forEach(([p, sisa], i) => {
      const ny = y + 46, kiri = x - 40, kanan = x + 40, akhir = i === tingkat.length - 1;
      garis += `<line x1="${x}" y1="${y + 17}" x2="${kiri}" y2="${ny - 17}" stroke="${TEKS}" stroke-width="1.5"/><line x1="${x}" y1="${y + 17}" x2="${kanan}" y2="${ny - 17}" stroke="${TEKS}" stroke-width="1.5"/>`;
      isi += simpul(kiri, ny, p, true) + simpul(kanan, ny, sisa, akhir);
      fp[p] = (fp[p] || 0) + 1; if (akhir) fp[sisa] = (fp[sisa] || 0) + 1;
      x = kanan; y = ny;
    });
    const hasil = Object.keys(fp).map(Number).sort((a, b) => a - b).map(p => p + (fp[p] > 1 ? pangkat(fp[p]) : "")).join(" × ");
    s += garis + isi + tulis(12, h - 12, `${n} = ${hasil}`, 15, `text-anchor="start" font-weight="bold" fill="${HIJAU}"`);
    return s + "</svg>";
  }

  /* Pizza 3/4 dan pita 3/4 */
  function gbrTigaPerempat() {
    const w = 360, h = 132, cx = 66, cy = 60, r = 48;
    const titik = [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]];
    let s = svgBuka(w, h, "Pizza dan pita yang dibagi 4 sama besar, 3 bagian diarsir") + latar(w, h);
    for (let i = 0; i < 4; i++) {
      const [a, b] = titik[i], [c, d] = titik[(i + 1) % 4];
      s += `<path d="M ${cx} ${cy} L ${a} ${b} A ${r} ${r} 0 0 1 ${c} ${d} Z" fill="${i < 3 ? EMAS : "#FFFFFF"}" stroke="${TEKS}" stroke-width="2"/>`;
    }
    s += tulis(cx, 124, "3 dari 4 potong", 12);
    s += tulis(250, 26, "pita dibagi 4, diarsir 3", 12);
    for (let i = 0; i < 4; i++) s += `<rect x="${150 + i * 50}" y="38" width="50" height="34" fill="${i < 3 ? MUDA_B : "#FFFFFF"}" stroke="${BIRU}" stroke-width="2"/>`;
    s += tulis(250, 100, "diarsir = 3/4", 15, `font-weight="bold" fill="${BIRU}"`) + tulis(250, 122, "tidak diarsir = 1/4", 12);
    return s + "</svg>";
  }

  /* Pita senilai 1/2 = 2/4 = 4/8 */
  function gbrSenilai() {
    const w = 360, h = 124;
    let s = svgBuka(w, h, "Pita 1/2, 2/4, dan 4/8 sama panjang bagian arsirannya") + latar(w, h);
    [2, 4, 8].forEach((q, j) => {
      const y = 8 + j * 38, lebar = 260 / q;
      s += tulis(36, y + 20, `${q / 2}/${q}`, 15, `font-weight="bold"`);
      for (let i = 0; i < q; i++) s += `<rect x="${80 + i * lebar}" y="${y}" width="${lebar}" height="28" fill="${i < q / 2 ? MUDA_H : "#FFFFFF"}" stroke="${HIJAU}" stroke-width="2"/>`;
    });
    s += `<line x1="210" y1="4" x2="210" y2="122" stroke="${MERAH}" stroke-width="2" stroke-dasharray="5 4"/>`;
    return s + "</svg>";
  }

  /* Petak 10 × 10 dengan 35 kotak diarsir */
  function gbrPersen() {
    const w = 360, h = 156, k = 14;
    let s = svgBuka(w, h, "Petak 10 kali 10, 35 kotak diarsir berarti 35 persen") + latar(w, h);
    for (let i = 0; i < 100; i++) {
      const bx = 8 + (i % 10) * k, by = 8 + Math.floor(i / 10) * k;
      s += `<rect x="${bx}" y="${by}" width="${k}" height="${k}" fill="${i < 35 ? EMAS : "#FFFFFF"}" stroke="#9AA3AE" stroke-width="1"/>`;
    }
    const t = (y, teks, uk, o = "") => tulis(170, y, teks, uk, `text-anchor="start"` + (o ? " " + o : ""));
    s += t(34, "35 kotak dari 100", 14) + t(62, "= 35/100", 15) + t(90, "= 0,35", 15) + t(122, "= 35%", 20, `font-weight="bold" fill="${MERAH}"`);
    return s + "</svg>";
  }

  /* Koin & uang kertas */
  function gbrUang() {
    const w = 360, h = 124;
    let s = svgBuka(w, h, "Koin dan uang kertas rupiah") + latar(w, h);
    s += svgT(6, 31, "Koin:", `font-size="13" fill="${TEKS}" font-weight="bold"`);
    [["100", "#D8DDE3", "#8A94A6"], ["200", "#D8DDE3", "#8A94A6"], ["500", MUDA_E, EMAS], ["1.000", MUDA_E, EMAS]].forEach(([v, f, g], i) => {
      s += `<circle cx="${78 + i * 52}" cy="26" r="21" fill="${f}" stroke="${g}" stroke-width="2.5"/>` + tulis(78 + i * 52, 31, v, 12, `font-weight="bold"`);
    });
    [["2.000", "#EEF0F3", "#8A94A6"], ["5.000", MUDA_E, EMAS], ["10.000", "#F0EAFB", UNGU], ["20.000", MUDA_H, HIJAU], ["50.000", MUDA_B, BIRU], ["100.000", "#FDE4E3", MERAH]].forEach(([v, f, g], i) => {
      const x = 4 + i * 59;
      s += `<rect x="${x}" y="58" width="55" height="34" rx="4" fill="${f}" stroke="${g}" stroke-width="2"/>` + tulis(x + 27.5, 80, v, 12, `font-weight="bold"`);
    });
    s += tulis(180, 114, "uang kertas (rupiah)", 12);
    return s + "</svg>";
  }

  /* ================= b1: Nilai tempat & membaca bilangan ================= */
  MATERI.b1 = {
    ringkas: [
      { judul: "Setiap angka punya rumah",
        isi: `<p>Dalam sebuah bilangan, setiap angka tinggal di <b>rumah nilai tempat</b>: satuan, puluhan, ratusan, ribuan, puluh ribuan, ratus ribuan, jutaan — dihitung dari <b>kanan</b>.</p>
<p><b>Nilai angka = angka × nilai tempatnya.</b> Pada 345.672, angka 4 ada di puluh ribuan, jadi nilainya 4 × 10.000 = <b>40.000</b>.</p>`,
        gambar: gbrNilaiTempat() },
      { judul: "Bentuk panjang",
        isi: `<p>Bilangan bisa "dibongkar" menjadi jumlah nilai setiap angkanya:</p>
<p><b>345.672 = 300.000 + 40.000 + 5.000 + 600 + 70 + 2</b></p>
<p>Kalau ada tempat yang kosong, tulis <b>0</b>. Contoh: 4 ribuan, 0 ratusan, 3 puluhan, 8 satuan = <b>4.038</b>.</p>` },
      { judul: "Membaca & menulis bilangan besar",
        isi: `<p>Kelompokkan <b>tiga angka dari kanan</b> (dipisah titik), lalu baca setiap kelompok dan sebut namanya: <b>juta</b>, <b>ribu</b>.</p>
<table class="tabel-data"><tr><th>2</th><th>405</th><th>030</th></tr><tr><td>dua juta</td><td>empat ratus lima ribu</td><td>tiga puluh</td></tr></table>
<p>Ingat: 1.000 dibaca <b>seribu</b>, 100 <b>seratus</b>, 11 <b>sebelas</b>. Saat menulis, kelompok yang kosong diisi <b>000</b>.</p>` },
      { judul: "Trik kartu angka",
        isi: `<ul><li><b>Terbesar:</b> susun angka dari yang paling besar ke paling kecil. 3, 8, 1, 5 → <b>8.531</b>.</li>
<li><b>Terkecil:</b> susun dari yang paling kecil, <b>tetapi 0 tidak boleh di depan</b>. 0, 6, 2, 9 → <b>2.069</b>.</li></ul>` },
    ],
    contoh: [
      { soal: "Nilai angka <b>6</b> pada bilangan <b>362.418</b> adalah …",
        langkah: [
          "Beri nama rumah dari kanan: 8 satuan, 1 puluhan, 4 ratusan, 2 ribuan, <b>6 puluh ribuan</b>, 3 ratus ribuan.",
          "Angka 6 tinggal di <b>puluh ribuan</b> = 10.000.",
          "Nilai = 6 × 10.000 = <b>60.000</b>.",
        ],
        jawab: "60.000" },
      { soal: "Tulis lambang bilangan dari <i>\"tiga juta dua puluh ribu lima ratus delapan\"</i>.",
        langkah: [
          "Siapkan tiga kelompok: <b>juta . ribu . sisanya</b>.",
          "\"tiga juta\" → kelompok juta = <b>3</b>.",
          "\"dua puluh ribu\" → kelompok ribu = 20, ditulis tiga angka <b>020</b>.",
          "\"lima ratus delapan\" → kelompok terakhir = <b>508</b>.",
          "Gabungkan: <b>3.020.508</b>.",
        ],
        jawab: "3.020.508" },
      { soal: "Dari kartu <b>0, 4, 7, 2, 9</b> (setiap kartu dipakai sekali) dibuat bilangan 5 angka terbesar dan terkecil. Selisih kedua bilangan itu adalah …",
        langkah: [
          "Terbesar: urutkan dari besar ke kecil → <b>97.420</b>.",
          "Terkecil: 0 tidak boleh di depan, jadi depan diisi angka terkecil selain 0, yaitu 2 → <b>20.479</b>.",
          "Selisih = 97.420 − 20.479 = <b>76.941</b>.",
        ],
        jawab: "76.941" },
    ],
  };

  /* ================= b2: Membandingkan, mengurutkan, membulatkan ================= */
  MATERI.b2 = {
    ringkas: [
      { judul: "Membandingkan dua bilangan",
        isi: `<ol><li>Hitung <b>banyak angkanya</b>. Yang angkanya lebih banyak, lebih besar: 10.250 &gt; 9.980.</li>
<li>Kalau banyak angkanya sama, bandingkan <b>dari kiri</b> satu per satu sampai ada yang beda: 45.<b>2</b>09 &lt; 45.<b>2</b>90 karena puluhannya 0 &lt; 9.</li></ol>
<p>Tanda <b>&gt;</b> artinya "lebih dari", <b>&lt;</b> artinya "kurang dari". Mulut buaya selalu menghadap bilangan yang lebih besar!</p>` },
      { judul: "Mengurutkan",
        isi: `<p><b>Dari yang terkecil</b> = naik, <b>dari yang terbesar</b> = turun.</p>
<p>Tipsnya: tulis bilangan-bilangan itu bersusun <b>rata kanan</b>, lalu cari yang paling kecil dulu dengan membandingkan dari kiri. Coret yang sudah dipakai, ulangi sampai habis.</p>` },
      { judul: "Membulatkan: lihat tetangga kanannya",
        isi: `<p>Lihat angka <b>tepat di kanan</b> tempat pembulatan:</p>
<ul><li><b>5 atau lebih</b> → angka di tempat itu <b>naik 1</b>.</li><li><b>Kurang dari 5</b> → angkanya <b>tetap</b>.</li></ul>
<p>Semua angka di kanannya menjadi 0. Contoh ke puluhan: 34<b>7</b> → 350, 34<b>2</b> → 340. Bilangan yang dibulatkan ke ratusan menjadi 700 adalah <b>650 sampai 749</b>.</p>`,
        gambar: gbrGarisBulat() },
      { judul: "Menaksir hasil hitung",
        isi: `<p>Menaksir = <b>bulatkan dulu setiap bilangan</b>, baru dihitung. Hasilnya kira-kira, tetapi cepat!</p>
<p>Taksiran ke ratusan: 389 + 512 → <b>400 + 500 = 900</b>.</p>` },
    ],
    contoh: [
      { soal: "Hasil pembulatan <b>3.472</b> ke <b>ratusan terdekat</b> adalah …",
        langkah: [
          "Angka ratusan pada 3.<b>4</b>72 adalah <b>4</b>.",
          "Tetangga kanannya (puluhan) adalah <b>7</b>. Karena 7 ≥ 5, angka 4 naik menjadi 5.",
          "Angka di kanannya menjadi 0 → <b>3.500</b>.",
        ],
        jawab: "3.500" },
      { soal: "Taksiran hasil <b>2.648 + 1.375</b> dengan membulatkan setiap bilangan ke ratusan terdekat adalah …",
        langkah: [
          "2.648: puluhannya 4 (&lt; 5) → tetap → <b>2.600</b>.",
          "1.375: puluhannya 7 (≥ 5) → naik → <b>1.400</b>.",
          "Jumlahkan: 2.600 + 1.400 = <b>4.000</b>.",
        ],
        jawab: "4.000" },
      { soal: "Urutkan dari yang terkecil: <b>45.209; 45.290; 44.999; 45.092</b>.",
        langkah: [
          "Puluh ribuannya sama-sama 4. Bandingkan ribuan: 4<b>4</b>.999 punya 4, yang lain 5 → <b>44.999</b> paling kecil.",
          "Sisa 45.209, 45.290, 45.092. Bandingkan ratusan: 2, 2, <b>0</b> → <b>45.092</b> berikutnya.",
          "45.209 dan 45.290: puluhannya 0 &lt; 9 → <b>45.209</b> lalu <b>45.290</b>.",
          "Urutan: <b>44.999; 45.092; 45.209; 45.290</b>.",
        ],
        jawab: "44.999; 45.092; 45.209; 45.290" },
    ],
  };

  /* ================= b3: Operasi hitung campuran ================= */
  MATERI.b3 = {
    ringkas: [
      { judul: "Urutan mengerjakan",
        isi: `<ol><li>Kerjakan yang di dalam <b>kurung ( )</b> dulu.</li>
<li>Lalu <b>kali dan bagi</b> — mana yang lebih kiri, itu duluan.</li>
<li>Terakhir <b>tambah dan kurang</b> — juga dari kiri.</li></ol>
<p>Jadi ingat: <b>kali/bagi dulu, baru tambah/kurang!</b> Contoh: 45 + 15 × 4 = 45 + 60 = 105 (bukan 60 × 4).</p>`,
        gambar: gbrUrutan() },
      { judul: "Kali & bagi sama kuat",
        isi: `<p>Kali dan bagi <b>sama kuat</b>, begitu juga tambah dan kurang. Kerjakan berurutan <b>dari kiri ke kanan</b>.</p>
<p>24 : 4 × 3 = 6 × 3 = <b>18</b> (bukan 24 : 12).<br>20 − 8 + 5 = 12 + 5 = <b>17</b> (bukan 20 − 13).</p>` },
      { judul: "Cara cerdik",
        isi: `<ul><li>Ambil bilangan yang sama: 25 × 37 + 25 × 63 = 25 × (37 + 63) = 25 × 100 = <b>2.500</b>.</li>
<li>Dekatkan ke bilangan bulat: 99 × 15 = 100 × 15 − 15 = 1.500 − 15 = <b>1.485</b>.</li></ul>` },
      { judul: "Soal cerita jadi kalimat matematika",
        isi: `<table class="tabel-data"><tr><th>Kata kunci</th><th>Operasi</th></tr>
<tr><td>setiap, tiap, masing-masing berisi</td><td>×</td></tr>
<tr><td>dibagi sama rata</td><td>:</td></tr>
<tr><td>diberikan, dijual, sisa</td><td>−</td></tr>
<tr><td>membeli lagi, datang, seluruhnya</td><td>+</td></tr></table>
<p>Tulis kalimat matematikanya, pakai kurung kalau perlu, lalu hitung.</p>` },
    ],
    contoh: [
      { soal: "45 + 15 × 4 = …",
        langkah: [
          "Tidak ada kurung. Cari kali/bagi: <b>15 × 4 = 60</b>.",
          "Baru tambah: 45 + 60 = <b>105</b>.",
        ],
        jawab: "105" },
      { soal: "(48 − 12) : 4 + 7 × 3 = …",
        langkah: [
          "Kurung dulu: 48 − 12 = <b>36</b>.",
          "Bagi: 36 : 4 = <b>9</b>.",
          "Kali: 7 × 3 = <b>21</b>.",
          "Tambah: 9 + 21 = <b>30</b>.",
        ],
        jawab: "30" },
      { soal: "Pak Budi memiliki 8 kandang. Setiap kandang berisi 25 ayam. Sebanyak 45 ayam dijual, lalu sisanya dibagi sama rata ke dalam 5 kandang baru. Banyak ayam di setiap kandang baru adalah …",
        langkah: [
          "Kalimat matematika: (8 × 25 − 45) : 5.",
          "Ayam semula: 8 × 25 = <b>200</b>.",
          "Setelah dijual: 200 − 45 = <b>155</b>.",
          "Dibagi 5 kandang: 155 : 5 = <b>31</b> ayam.",
        ],
        jawab: "31 ayam" },
    ],
  };

  /* ================= b4: KPK & FPB ================= */
  MATERI.b4 = {
    ringkas: [
      { judul: "Kelipatan, faktor, dan prima",
        isi: `<ul><li><b>Kelipatan</b> 4 = hasil kali 4: 4, 8, 12, 16, 20, …</li>
<li><b>Faktor</b> 12 = bilangan yang membagi 12 habis. Cari berpasangan: 1×12, 2×6, 3×4 → 1, 2, 3, 4, 6, 12.</li>
<li><b>Bilangan prima</b> punya tepat 2 faktor (1 dan dirinya): 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, … (1 bukan prima).</li></ul>` },
      { judul: "Pohon faktor",
        isi: `<p>Pecah bilangan terus-menerus menjadi perkalian sampai semua ujungnya <b>bilangan prima</b> (lingkaran hijau). Kalikan semua ujungnya, tulis dengan pangkat:</p>
<p><b>36 = 2 × 2 × 3 × 3 = 2² × 3²</b></p>`,
        gambar: gbrPohon(36) },
      { judul: "KPK & FPB dari faktorisasi prima",
        isi: `<table class="tabel-data"><tr><th></th><th>Ambil faktor</th><th>Pangkat</th></tr>
<tr><td>KPK</td><td><b>semua</b></td><td>yang <b>terbesar</b></td></tr>
<tr><td>FPB</td><td>yang <b>sama</b> saja</td><td>yang <b>terkecil</b></td></tr></table>
<p>12 = 2² × 3, 18 = 2 × 3² → KPK = 2² × 3² = <b>36</b>, FPB = 2 × 3 = <b>6</b>.</p>` },
      { judul: "Soal cerita: KPK atau FPB?",
        isi: `<ul><li><b>KPK</b>: kejadian berulang yang <b>bertemu/bersama lagi</b> — lampu berkedip, jadwal, bus berangkat. Tanyanya "kapan?".</li>
<li><b>FPB</b>: <b>membagi</b> benda sama banyak ke sebanyak-banyaknya kantong/anak, atau potongan <b>terpanjang/terbesar</b>.</li></ul>` },
    ],
    contoh: [
      { soal: "KPK dan FPB dari <b>36</b> dan <b>48</b> adalah …",
        gambar: gbrPohon(48),
        langkah: [
          "Pohon faktor: 36 = <b>2² × 3²</b> dan 48 = <b>2⁴ × 3</b>.",
          "KPK: semua faktor, pangkat terbesar → 2⁴ × 3² = 16 × 9 = <b>144</b>.",
          "FPB: faktor yang sama, pangkat terkecil → 2² × 3 = 4 × 3 = <b>12</b>.",
        ],
        jawab: "KPK = 144, FPB = 12" },
      { soal: "Lampu merah berkedip setiap 12 menit dan lampu biru setiap 18 menit. Keduanya berkedip bersama pukul 08.00. Mereka akan berkedip bersama lagi pukul …",
        langkah: [
          "\"Bersama lagi\" → pakai <b>KPK</b>.",
          "12 = 2² × 3 dan 18 = 2 × 3².",
          "KPK = 2² × 3² = 4 × 9 = <b>36</b> menit.",
          "08.00 + 36 menit = <b>08.36</b>.",
        ],
        jawab: "pukul 08.36" },
      { soal: "Bu guru mempunyai 24 pensil dan 36 buku. Semuanya dibagikan kepada sebanyak-banyaknya anak dengan bagian yang sama. Berapa anak yang mendapat bagian, dan apa yang diterima setiap anak?",
        langkah: [
          "\"Dibagi sama, sebanyak-banyaknya\" → pakai <b>FPB</b>.",
          "24 = 2³ × 3 dan 36 = 2² × 3².",
          "FPB = 2² × 3 = <b>12</b> anak.",
          "Setiap anak: 24 : 12 = <b>2 pensil</b> dan 36 : 12 = <b>3 buku</b>.",
        ],
        jawab: "12 anak; masing-masing 2 pensil dan 3 buku" },
    ],
  };

  /* ================= b5: Pecahan ================= */
  MATERI.b5 = {
    ringkas: [
      { judul: "Arti pecahan",
        isi: `<p>Pecahan ${pc(3, 4)} artinya satu benda dibagi <b>4 bagian sama besar</b> (penyebut, di bawah), lalu diambil <b>3 bagian</b> (pembilang, di atas).</p>
<p>Bagian yang tidak diarsir = 1 − ${pc(3, 4)} = ${pc(1, 4)}.</p>`,
        gambar: gbrTigaPerempat() },
      { judul: "Pecahan senilai & menyederhanakan",
        isi: `<p>Kalikan atau bagi <b>atas dan bawah dengan bilangan yang sama</b>, nilainya tidak berubah: ${pc(1, 2)} = ${pc(2, 4)} = ${pc(4, 8)}.</p>
<p><b>Menyederhanakan</b>: bagi atas dan bawah dengan FPB-nya. ${pc(18, 24)} → FPB 6 → ${pc(3, 4)}.</p>`,
        gambar: gbrSenilai() },
      { judul: "Tambah & kurang: samakan penyebut",
        isi: `<p>Penyebut harus <b>sama dulu</b> (pakai KPK penyebut), baru pembilangnya dijumlah/dikurang.</p>
<p>${pc(1, 3)} + ${pc(1, 4)} = ${pc(4, 12)} + ${pc(3, 12)} = ${pc(7, 12)}</p>
<p>Pecahan campuran: ${pcT(9, 4)} = ${pc(9, 4)} (2 × 4 + 1 = 9). Sebaliknya ${pc(7, 4)} = ${pcT(7, 4)}.</p>` },
      { judul: "Kali & bagi",
        isi: `<ul><li><b>Kali</b>: atas × atas, bawah × bawah. ${pc(2, 3)} × ${pc(3, 5)} = ${pc(6, 15)} = ${pc(2, 5)}.</li>
<li><b>Bagi</b>: balik pecahan kedua, lalu kali. ${pc(3, 4)} : ${pc(1, 2)} = ${pc(3, 4)} × ${pc(2, 1)} = ${pc(6, 4)} = ${pcT(3, 2)}.</li>
<li>Kata <b>"dari"</b> berarti kali: ${pc(2, 5)} dari 30 = 30 : 5 × 2 = 12.</li></ul>` },
    ],
    contoh: [
      { soal: `Bentuk paling sederhana dari ${pc(18, 24)} adalah …`,
        langkah: [
          "Faktor 18: 1, 2, 3, 6, 9, 18. Faktor 24: 1, 2, 3, 4, 6, 8, 12, 24. FPB = <b>6</b>.",
          `Bagi atas dan bawah dengan 6: ${pc("18 : 6", "24 : 6")} = ${pc(3, 4)}.`,
        ],
        jawab: pc(3, 4) },
      { soal: `${pcT(5, 2)} − ${pc(3, 4)} = …`,
        langkah: [
          `Ubah ke pecahan biasa: ${pcT(5, 2)} = ${pc(5, 2)} (2 × 2 + 1 = 5).`,
          `Samakan penyebut jadi 4: ${pc(5, 2)} = ${pc(10, 4)}.`,
          `Kurangkan: ${pc(10, 4)} − ${pc(3, 4)} = ${pc(7, 4)}.`,
          `Jadikan campuran: ${pc(7, 4)} = ${pcT(7, 4)}.`,
        ],
        jawab: pcT(7, 4) },
      { soal: `Rina memotong pita. ${pc(1, 4)} bagian dipakai untuk kado. Lalu ${pc(2, 3)} dari <b>sisanya</b> dipakai untuk hiasan. Bagian pita yang masih tersisa adalah …`,
        langkah: [
          `Sisa setelah kado: 1 − ${pc(1, 4)} = ${pc(3, 4)}.`,
          `Hiasan = ${pc(2, 3)} dari ${pc(3, 4)} = ${pc(2, 3)} × ${pc(3, 4)} = ${pc(6, 12)} = ${pc(1, 2)}.`,
          `Sisa akhir: ${pc(3, 4)} − ${pc(1, 2)} = ${pc(3, 4)} − ${pc(2, 4)} = ${pc(1, 4)}.`,
        ],
        jawab: `${pc(1, 4)} bagian` },
    ],
  };

  /* ================= b6: Pecahan ↔ desimal ↔ persen ================= */
  MATERI.b6 = {
    ringkas: [
      { judul: "Pecahan ke desimal",
        isi: `<p>Ubah penyebutnya menjadi <b>10, 100, atau 1.000</b>, lalu tulis dengan koma:</p>
<p>${pc(3, 4)} = ${pc(75, 100)} = <b>0,75</b> &nbsp; ${pc(2, 5)} = ${pc(4, 10)} = <b>0,4</b></p>
<p>Sebaliknya: 0,25 = ${pc(25, 100)} = ${pc(1, 4)}. Satu angka di belakang koma → per 10, dua angka → per 100.</p>` },
      { judul: "Persen = per seratus",
        isi: `<p><b>%</b> artinya "dari 100". 35% = ${pc(35, 100)} = 0,35.</p>
<p>Pecahan ke persen: <b>kalikan 100%</b>. ${pc(3, 5)} × 100% = <b>60%</b>.</p>
<p>Persen ke pecahan: tulis per 100 lalu sederhanakan. 40% = ${pc(40, 100)} = ${pc(2, 5)}.</p>`,
        gambar: gbrPersen() },
      { judul: "Hafalkan pasangan ini",
        isi: `<table class="tabel-data"><tr><th>Persen</th><th>Pecahan</th><th>Desimal</th></tr>
<tr><td>50%</td><td>${pc(1, 2)}</td><td>0,5</td></tr>
<tr><td>25%</td><td>${pc(1, 4)}</td><td>0,25</td></tr>
<tr><td>75%</td><td>${pc(3, 4)}</td><td>0,75</td></tr>
<tr><td>20%</td><td>${pc(1, 5)}</td><td>0,2</td></tr>
<tr><td>10%</td><td>${pc(1, 10)}</td><td>0,1</td></tr></table>
<p>25% dari 80 = ${pc(1, 4)} × 80 = <b>20</b>.</p>` },
      { judul: "Diskon",
        isi: `<p><b>Harga bayar = harga − diskon</b>. Atau langsung: diskon 20% berarti bayar 80%.</p>
<p>Diskon <b>bertingkat</b> (20% lalu 10%): diskon kedua dihitung dari harga <b>setelah</b> diskon pertama — bukan langsung 30%!</p>` },
    ],
    contoh: [
      { soal: `${pc(3, 8)} jika ditulis dalam bentuk desimal dan persen adalah …`,
        langkah: [
          "Penyebut 8 dijadikan 1.000: 8 × 125 = 1.000.",
          `Atas juga × 125: ${pc(3, 8)} = ${pc(375, 1000)}.`,
          `${pc(375, 1000)} = <b>0,375</b> (tiga angka di belakang koma).`,
          "Persen: 0,375 × 100% = <b>37,5%</b>.",
        ],
        jawab: "0,375 = 37,5%" },
      { soal: "Di sebuah kelas ada 40 siswa. Sebanyak 35% siswa gemar menari. Banyak siswa yang <b>tidak</b> gemar menari adalah …",
        langkah: [
          "Yang tidak gemar: 100% − 35% = <b>65%</b>.",
          `65% dari 40 = ${pc(65, 100)} × 40.`,
          "40 : 100 × 65 = 0,4 × 65 = <b>26</b> siswa.",
        ],
        jawab: "26 siswa" },
      { soal: "Harga Rp200.000 didiskon 20%, lalu didiskon lagi 10%. Harga akhirnya adalah …",
        langkah: [
          "Diskon pertama: 20% × 200.000 = <b>40.000</b>.",
          "Harga sementara: 200.000 − 40.000 = <b>160.000</b>.",
          "Diskon kedua dari harga baru: 10% × 160.000 = <b>16.000</b>.",
          "Harga akhir: 160.000 − 16.000 = <b>Rp144.000</b>.",
        ],
        jawab: "Rp144.000" },
    ],
  };

  /* ================= b7: Soal uang ================= */
  MATERI.b7 = {
    ringkas: [
      { judul: "Mengenal uang rupiah",
        isi: `<p>Uang rupiah ada yang berbentuk <b>koin</b> dan <b>uang kertas</b>. Untuk menghitung jumlah uang, kalikan nilainya dengan banyaknya, lalu jumlahkan.</p>
<p>3 lembar Rp5.000 + 4 koin Rp500 = 15.000 + 2.000 = <b>Rp17.000</b>.</p>`,
        gambar: gbrUang() },
      { judul: "Belanja & kembalian",
        isi: `<ol><li><b>Total belanja</b> = harga satuan × banyak barang, lalu jumlahkan semua barang.</li>
<li><b>Kembalian</b> = uang yang dibayarkan − total belanja.</li></ol>
<p>Tulis rapi setiap barang supaya tidak ada yang terlewat.</p>` },
      { judul: "Harga satuan & paket",
        isi: `<p><b>Harga 1 barang = harga total : banyak barang.</b> Untuk mencari harga beberapa barang, cari harga 1 dulu, lalu kalikan.</p>
<p>Memilih paket lebih murah? Bandingkan <b>harga per buah</b>.</p>
<p>Ingat satuan: <b>1 lusin = 12</b>, <b>1 kodi = 20</b>, <b>1 gros = 144</b>.</p>` },
      { judul: "Untung, rugi, dan menabung",
        isi: `<ul><li><b>Untung</b> = harga jual − modal (harga beli). Kalau jual lebih kecil dari modal, namanya <b>rugi</b>.</li>
<li><b>Tabungan</b> = uang awal + (tabungan per hari × banyak hari).</li>
<li>Uang tidak cukup untuk barang terakhir? Jawab "paling banyak" dengan <b>membulatkan ke bawah</b>.</li></ul>` },
    ],
    contoh: [
      { soal: "Dina membeli 3 buku tulis seharga Rp4.500 per buku dan 2 pulpen seharga Rp3.000 per buah. Ia membayar dengan uang Rp50.000. Uang kembaliannya adalah …",
        langkah: [
          "Buku: 3 × 4.500 = <b>13.500</b>.",
          "Pulpen: 2 × 3.000 = <b>6.000</b>.",
          "Total: 13.500 + 6.000 = <b>19.500</b>.",
          "Kembalian: 50.000 − 19.500 = <b>Rp30.500</b>.",
        ],
        jawab: "Rp30.500" },
      { soal: "Harga 4 roti adalah Rp18.000. Harga 7 roti adalah …",
        langkah: [
          "Harga 1 roti: 18.000 : 4 = <b>4.500</b>.",
          "Harga 7 roti: 7 × 4.500 = <b>Rp31.500</b>.",
        ],
        jawab: "Rp31.500" },
      { soal: "Pedagang membeli 2 lusin buku seharga Rp36.000 per lusin. Semua buku dijual Rp4.000 per buah. Keuntungannya adalah …",
        langkah: [
          "Modal: 2 × 36.000 = <b>72.000</b>.",
          "Banyak buku: 2 lusin = 2 × 12 = <b>24</b> buah.",
          "Hasil penjualan: 24 × 4.000 = <b>96.000</b>.",
          "Untung: 96.000 − 72.000 = <b>Rp24.000</b>.",
        ],
        jawab: "Rp24.000" },
    ],
  };
})();
