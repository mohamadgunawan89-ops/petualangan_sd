/* Materi Pos 2 — Aljabar (misi a1 Pola bilangan, a2 Pola gambar, a3 Mencari angka yang hilang)
   Teori singkat bergambar + contoh bertahap. Dimuat SETELAH semua berkas soal, jadi boleh memakai
   pembantu inti.js (svgBuka, fmt) dan aljabar.js (svgPola, POLA, svgTimbang). */
"use strict";
{
  /* Teks SVG: gaya ditulis inline supaya tidak tertimpa aturan .gbr text di gaya.css */
  const tx = (x, y, s, gaya = "", o = 'text-anchor="middle"') => `<text x="${x}" y="${y}" ${o} style="${gaya}">${s}</text>`;
  const BIRU = "#2F7FD8", HIJAU = "#2E9E5B", EMAS = "#F2B92E", MERAH = "#D9534F", TINTA = "#1F2633";
  const panah = (x1, y, x2, warna) => { const d = x2 > x1 ? -8 : 8;
    return `<line x1="${x1}" y1="${y}" x2="${x2 + d / 2}" y2="${y}" stroke="${warna}" stroke-width="2.5"/><polygon points="${x2},${y} ${x2 + d},${y - 5} ${x2 + d},${y + 5}" fill="${warna}"/>`; };

  /* Garis bilangan dengan lompatan sama besar; bilangan terakhir ditanya (?) */
  function garisLompat(mulai, k, banyak) {
    const akhir = mulai + k * banyak, sk = 300 / (akhir - mulai), X = v => 30 + (v - mulai) * sk;
    let s = svgBuka(360, 110, `Garis bilangan: lompatan +${k} dari ${mulai}`);
    s += `<line x1="15" y1="75" x2="345" y2="75" stroke="${TINTA}" stroke-width="2"/>`;
    for (let v = mulai; v <= akhir; v++) s += `<line x1="${X(v)}" y1="70" x2="${X(v)}" y2="80" stroke="${TINTA}" stroke-width="1.5"/>`;
    for (let i = 0; i < banyak; i++) { const a = X(mulai + i * k), b = X(mulai + (i + 1) * k);
      s += `<path d="M${a} 72 Q${(a + b) / 2} 22 ${b} 72" fill="none" stroke="${BIRU}" stroke-width="2.5"/>` + tx((a + b) / 2, 40, `+${k}`, `font-size:14px;font-weight:800;fill:${HIJAU}`); }
    for (let i = 0; i <= banyak; i++) { const v = mulai + i * k, akhirnya = i === banyak;
      s += `<circle cx="${X(v)}" cy="75" r="6" fill="${akhirnya ? MERAH : EMAS}"/>` + tx(X(v), 100, akhirnya ? "?" : fmt(v), `font-size:15px;font-weight:800;fill:${akhirnya ? MERAH : TINTA}`); }
    return s + "</svg>";
  }

  /* Tabel selisih bertingkat */
  function tabelSelisih(d) {
    const X = i => 35 + i * (290 / (d.length - 1));
    let s = svgBuka(360, 135, "Tabel selisih bertingkat");
    d.forEach((v, i) => { s += `<circle cx="${X(i)}" cy="25" r="17" fill="${i === d.length - 1 ? "#FDE8E7" : "#E3F0FC"}" stroke="${i === d.length - 1 ? MERAH : BIRU}" stroke-width="2"/>` + tx(X(i), 30, i === d.length - 1 ? "?" : v, `font-size:14px;font-weight:800;fill:${TINTA}`); });
    const s1 = d.slice(1).map((v, i) => v - d[i]);
    s1.forEach((v, i) => { const x = (X(i) + X(i + 1)) / 2;
      s += `<line x1="${X(i)}" y1="42" x2="${x}" y2="58" stroke="#9AA5B4"/><line x1="${X(i + 1)}" y1="42" x2="${x}" y2="58" stroke="#9AA5B4"/>` + tx(x, 74, `+${v}`, `font-size:14px;font-weight:800;fill:${i === s1.length - 1 ? MERAH : HIJAU}`); });
    s1.slice(1).forEach((v, i) => { const x = X(i + 1); s += tx(x, 104, `+${v - s1[i]}`, `font-size:13px;font-weight:700;fill:${BIRU}`); });
    return s + tx(180, 127, "baris 2: selisih · baris 3: selisih dari selisih", `font-size:11px;fill:#5B6575`) + "</svg>";
  }

  /* Korek api persegi: persegi pertama 4 batang (merah), setiap persegi baru +3 batang (hijau) */
  function korekTambah() {
    const u = 52, x0 = 40, y0 = 18; let s = svgBuka(360, 110, "Persegi korek api: 4 batang, lalu setiap persegi baru menambah 3 batang");
    const ln = (x1, y1, x2, y2, w) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${w}" stroke-width="5" stroke-linecap="round"/>`;
    s += ln(x0, y0, x0, y0 + u, MERAH) + ln(x0 + 3, y0, x0 + u - 3, y0, MERAH) + ln(x0 + 3, y0 + u, x0 + u - 3, y0 + u, MERAH) + ln(x0 + u, y0, x0 + u, y0 + u, MERAH);
    for (let i = 1; i < 4; i++) { const x = x0 + i * u, w = i % 2 ? HIJAU : BIRU;
      s += ln(x + 3, y0, x + u - 3, y0, w) + ln(x + 3, y0 + u, x + u - 3, y0 + u, w) + ln(x + u, y0, x + u, y0 + u, w); }
    s += tx(x0 + u / 2, 95, "4", `font-size:15px;font-weight:800;fill:${MERAH}`);
    for (let i = 1; i < 4; i++) s += tx(x0 + i * u + u / 2, 95, "+3", `font-size:15px;font-weight:800;fill:${i % 2 ? HIJAU : BIRU}`);
    return s + tx(320, 50, "…", `font-size:22px;fill:${TINTA}`) + "</svg>";
  }

  /* Operasi lawan: + ⇄ −, × ⇄ : */
  function operasiLawan() {
    let s = svgBuka(360, 92, "Operasi lawan: tambah dengan kurang, kali dengan bagi");
    [[60, 140, "+", "−", BIRU], [220, 300, "×", ":", HIJAU]].forEach(([a, b, p, q, w]) => {
      s += `<circle cx="${a}" cy="52" r="24" fill="${w}"/><circle cx="${b}" cy="52" r="24" fill="${w}"/>` + tx(a, 61, p, "font-size:26px;font-weight:800;fill:#fff") + tx(b, 61, q, "font-size:26px;font-weight:800;fill:#fff");
      s += `<path d="M${a + 26} 44 Q${(a + b) / 2} 30 ${b - 26} 44" fill="none" stroke="${TINTA}" stroke-width="2"/><polygon points="${b - 26},44 ${b - 36},42 ${b - 30},35" fill="${TINTA}"/>`;
      s += `<path d="M${b - 26} 60 Q${(a + b) / 2} 74 ${a + 26} 60" fill="none" stroke="${TINTA}" stroke-width="2"/><polygon points="${a + 26},60 ${a + 36},62 ${a + 30},69" fill="${TINTA}"/>`;
      s += tx((a + b) / 2, 18, "lawan", `font-size:12px;font-weight:700;fill:${TINTA}`); });
    return s + "</svg>";
  }

  /* Mesin fungsi: maju (×3, +4) dan mundur (−4, :3) */
  function mesinMundur() {
    const xs = [30, 105, 180, 255, 330];
    const baris = (y, isi, warna, arah) => { let s = "";
      isi.forEach((t, i) => { const x = xs[i];
        s += i % 2 ? `<rect x="${x - 28}" y="${y - 17}" width="56" height="34" rx="8" fill="${warna}"/>` + tx(x, y + 6, t, "font-size:15px;font-weight:800;fill:#fff")
          : `<circle cx="${x}" cy="${y}" r="20" fill="${EMAS}"/>` + tx(x, y + 6, t, `font-size:15px;font-weight:800;fill:${TINTA}`); });
      for (let i = 0; i < 4; i++) { const a = xs[i] + (i % 2 ? 28 : 20), b = xs[i + 1] - (i % 2 ? 20 : 28);
        s += arah > 0 ? panah(a + 2, y, b - 2, warna) : panah(b - 2, y, a + 2, warna); }
      return s; };
    let s = svgBuka(360, 150, "Mesin fungsi: maju dikali 3 lalu ditambah 4; mundur dikurangi 4 lalu dibagi 3");
    s += tx(8, 16, "Maju: 7 × 3 + 4 = 25", `font-size:12px;font-weight:700;fill:${BIRU}`, 'text-anchor="start"') + baris(45, ["7", "× 3", "21", "+ 4", "25"], BIRU, 1);
    s += tx(8, 92, "Mundur: urutan dibalik, operasinya dilawan", `font-size:12px;font-weight:700;fill:${MERAH}`, 'text-anchor="start"') + baris(122, ["7", ": 3", "21", "− 4", "25"], MERAH, -1);
    return s + "</svg>";
  }

  /* ===================== a1 — Pola bilangan ===================== */
  MATERI.a1 = {
    ringkas: [
      { judul: "Cari aturannya dulu", isi: `<p><b>Pola bilangan</b> adalah deretan bilangan yang mengikuti <b>aturan yang sama</b>.</p>
        <ul><li>Hitung perubahan dari satu bilangan ke bilangan berikutnya.</li>
        <li>Perubahannya selalu sama (+3, −5)? Itu pola <b>tambah/kurang</b>.</li>
        <li>Bilangannya membesar sangat cepat (3, 6, 12, 24)? Coba <b>bagi</b>: mungkin polanya <b>×2</b>.</li>
        <li>Tips TKA: cek aturannya pada <b>semua</b> bilangan, jangan hanya dua bilangan pertama.</li></ul>`,
        gambar: garisLompat(2, 3, 4) },
      { judul: "Selisih bertingkat & pola selang-seling", isi: `<p>Kalau selisihnya tidak sama, tulis selisihnya di bawah. Sering kali <b>selisihnya ikut berpola</b>.</p>
        <ul><li>2, 3, 5, 8, 12, … → selisih +1, +2, +3, +4, jadi berikutnya +5 → <b>17</b>.</li>
        <li>Bilangannya naik-turun? Mungkin ada <b>dua pola berselang-seling</b>. Pisahkan urutan ganjil dan urutan genap.</li>
        <li>1, 1, 2, 3, 5, 8, … → setiap bilangan = <b>jumlah dua bilangan sebelumnya</b>.</li></ul>`,
        gambar: tabelSelisih([2, 3, 5, 8, 12, 17]) },
      { judul: "Rumus suku ke-n (selisih tetap)", isi: `<p>Untuk mencari suku yang jauh, tidak perlu menulis satu per satu.</p>
        <ul><li><b>Suku ke-n = suku pertama + (n − 1) × selisih</b>. Contoh 3, 7, 11, …: suku ke-10 = 3 + 9 × 4 = <b>39</b>.</li>
        <li>Mengapa n − 1? Dari suku ke-1 ke suku ke-10 hanya ada <b>9 lompatan</b>.</li>
        <li>Bilangan X suku ke berapa? <b>(X − suku pertama) : selisih + 1</b>.</li>
        <li>Jumlah n suku: <b>n × (suku pertama + suku terakhir) : 2</b>.</li></ul>` },
      { judul: "Pola khusus yang sering keluar", isi: `<ul><li><b>Persegi</b>: 1, 4, 9, 16, … = n × n.</li>
        <li><b>Segitiga</b>: 1, 3, 6, 10, … = n × (n + 1) : 2.</li>
        <li><b>Kubik</b>: 1, 8, 27, 64, … = n × n × n.</li>
        <li><b>Genap</b> ke-n = 2 × n; <b>ganjil</b> ke-n = 2 × n − 1.</li>
        <li><b>Pola berulang</b> (merah, kuning, hijau, merah, …): bagi nomornya dengan panjang satu putaran, lalu lihat <b>sisanya</b>. Sisa 0 berarti warna terakhir.</li></ul>`,
        gambar: svgPola(POLA.titikPersegi, [1, 2, 3, 4]) },
    ],
    contoh: [
      { soal: "Bilangan berikutnya dari pola <b>4, 9, 14, 19, …</b> adalah …",
        langkah: ["Lihat perubahannya: 4 → 9 (+5), 9 → 14 (+5), 14 → 19 (+5).", "Perubahannya selalu sama, yaitu <b>+5</b>.", "Bilangan berikutnya: 19 + 5 = 24."], jawab: "24" },
      { soal: "Bilangan berikutnya dari pola <b>2, 3, 5, 8, 12, …</b> adalah …", gambar: tabelSelisih([2, 3, 5, 8, 12, 17]),
        langkah: ["Selisihnya tidak sama, jadi tulis selisihnya: +1, +2, +3, +4.", "Selisihnya selalu bertambah 1, jadi selisih berikutnya <b>+5</b>.", "Bilangan berikutnya: 12 + 5 = 17."], jawab: "17" },
      { soal: "Di sebuah gedung pertunjukan, baris pertama ada 12 kursi. Setiap baris di belakangnya bertambah 3 kursi. Banyak kursi pada baris ke-20 adalah …",
        langkah: ["Polanya: 12, 15, 18, … (selalu +3).", "Dari baris ke-1 ke baris ke-20 ada 20 − 1 = 19 kali penambahan.", "Banyak kursi = 12 + 19 × 3 = 12 + 57 = 69."], jawab: "69 kursi" },
    ],
  };

  /* ===================== a2 — Pola gambar ===================== */
  MATERI.a2 = {
    ringkas: [
      { judul: "Ubah gambar menjadi bilangan", isi: `<p>Pola gambar sebenarnya <b>pola bilangan</b> yang digambar.</p>
        <ul><li>Hitung benda pada Pola 1, Pola 2, Pola 3. Tulis hasilnya: misalnya <b>4, 7, 10</b>.</li>
        <li>Cari aturannya seperti pola bilangan: 4 → 7 → 10 selalu <b>+3</b>.</li>
        <li>Tips: beri tanda pada benda yang sudah dihitung supaya tidak terhitung dua kali.</li></ul>`,
        gambar: svgPola(POLA.korekPersegi) },
      { judul: "Mengapa bertambah tetap? Lihat bagian barunya", isi: `<p>Perhatikan bagian yang <b>ditambahkan</b> setiap pola. Pada persegi korek api, persegi baru menempel pada persegi sebelumnya, jadi cukup <b>3 batang baru</b>.</p>
        <ul><li><b>Pola ke-n = pola 1 + (n − 1) × tambahan</b>. Pola ke-10 = 4 + 9 × 3 = <b>31</b>.</li>
        <li>Bisa juga ditulis <b>3 × n + 1</b>. Uji rumus pada pola 1, 2, <b>dan</b> 3: 3 × 1 + 1 = 4 ✔, 3 × 2 + 1 = 7 ✔, 3 × 3 + 1 = 10 ✔.</li></ul>`,
        gambar: korekTambah() },
      { judul: "Pola persegi, persegi panjang & segitiga", isi: `<p>Ada pola yang tambahannya <b>makin besar</b>. Lihat bentuknya:</p>
        <ul><li><b>Persegi</b> (n baris × n titik): n × n → 1, 4, 9, 16, …</li>
        <li><b>Persegi panjang</b> (n baris × (n + 1) titik): n × (n + 1) → 2, 6, 12, 20, …</li>
        <li><b>Segitiga / tangga</b> (1 + 2 + … + n): n × (n + 1) : 2 → 1, 3, 6, 10, …</li></ul>`,
        gambar: svgPola(POLA.titikSegitiga, [1, 2, 3, 4]) },
      { judul: "Trik soal TKA", isi: `<ul><li><b>Meja & kursi</b>: setiap meja 2 kursi (atas–bawah) + 2 kursi di ujung → <b>2 × n + 2</b>.</li>
        <li><b>Pola ke berapa</b> yang memerlukan X benda? (X − pola 1) : tambahan + 1.</li>
        <li><b>Persediaan terbatas</b>: pilih pola terbesar yang bendanya <b>tidak lebih</b> dari persediaan.</li>
        <li><b>Selisih dua pola</b>: (beda nomor pola) × tambahan, tanpa menghitung keduanya.</li></ul>`,
        gambar: svgPola(POLA.meja) },
    ],
    contoh: [
      { soal: "Perhatikan pola batang korek api berikut. Banyak batang korek api pada <b>pola ke-6</b> adalah …", gambar: svgPola(POLA.korekPersegi),
        langkah: ["Hitung batang pada gambar: Pola 1 = 4, Pola 2 = 7, Pola 3 = 10.", "Setiap naik satu pola bertambah <b>3 batang</b>.", "Pola ke-6 = 4 + (6 − 1) × 3 = 4 + 15 = 19."], jawab: "19 batang korek api" },
      { soal: "Perhatikan pola titik berikut. Banyak titik pada <b>pola ke-8</b> adalah …", gambar: svgPola(POLA.titikSegitiga),
        langkah: ["Hitung titik pada gambar: Pola 1 = 1, Pola 2 = 3, Pola 3 = 6.", "Bentuknya segitiga: baris 1 ada 1 titik, baris 2 ada 2 titik, …, jadi banyaknya n × (n + 1) : 2.", "Pola ke-8 = 8 × 9 : 2 = 72 : 2 = 36."], jawab: "36 titik" },
      { soal: "Perhatikan pola rumah dari batang korek api berikut. Pola ke berapa yang memerlukan tepat <b>76 batang korek api</b>?", gambar: svgPola(POLA.korekRumah),
        langkah: ["Hitung batang pada gambar: Pola 1 = 6, Pola 2 = 11, Pola 3 = 16. Setiap pola bertambah <b>5</b>.", "Hitung mundur: 76 − 6 = 70, lalu 70 : 5 = 14 kali bertambah.", "Pola 1 ditambah 14 kali menjadi pola ke-15.", "Cek: 6 + (15 − 1) × 5 = 6 + 70 = 76 ✔"], jawab: "Pola ke-15" },
    ],
  };

  /* ===================== a3 — Mencari angka yang hilang ===================== */
  MATERI.a3 = {
    ringkas: [
      { judul: "Pakai operasi lawan", isi: `<p>Untuk mencari □, gunakan <b>operasi lawannya</b>: tambah ⇄ kurang, kali ⇄ bagi.</p>
        <ul><li>□ + 17 = 45 → □ = 45 − 17 = <b>28</b></li>
        <li>□ × 6 = 42 → □ = 42 : 6 = <b>7</b></li>
        <li>□ − 9 = 15 → □ = 15 + 9 = <b>24</b></li>
        <li>Awas! 50 − □ = 18 → □ = 50 − 18 = <b>32</b> (bukan ditambah). Begitu juga 72 : □ = 8 → □ = 72 : 8 = <b>9</b>.</li>
        <li>Selalu <b>cek</b>: masukkan jawabanmu ke soal. 28 + 17 = 45 ✔</li></ul>`,
        gambar: operasiLawan() },
      { judul: "Tanda = seperti timbangan seimbang", isi: `<p>Tanda <b>=</b> artinya ruas kiri <b>sama berat</b> dengan ruas kanan.</p>
        <ul><li>Timbangan di bawah: □ + 5 = 12.</li>
        <li>Ambil 5 kg dari <b>kedua</b> piring, timbangan tetap seimbang: □ = 12 − 5 = <b>7</b>.</li>
        <li>Kalau ruas kanan berupa hitungan (□ + 15 = 20 + 12), hitung dulu ruas kanannya: □ + 15 = 32, jadi □ = 17.</li></ul>`,
        gambar: svgTimbang([{ t: "?", kotak: true }, { t: "5 kg" }], [{ t: "12 kg" }]) },
      { judul: "Dua langkah? Kerjakan mundur", isi: `<p>"Aku memikirkan bilangan, kukali 3 lalu kutambah 4, hasilnya 25."</p>
        <ul><li>Mundur berarti: <b>urutannya dibalik</b> dan <b>operasinya dilawan</b>.</li>
        <li>Batalkan +4 dulu: 25 − 4 = 21. Lalu batalkan ×3: 21 : 3 = <b>7</b>.</li>
        <li>Pada 4 × □ + 9 = 41, perkalian dikerjakan lebih dulu, jadi yang dibatalkan pertama adalah <b>+ 9</b>.</li>
        <li>Ada kurung, misalnya (□ + 3) × 5 = 40? Bagi dulu: 40 : 5 = 8, lalu 8 − 3 = <b>5</b>.</li></ul>`,
        gambar: mesinMundur() },
      { judul: "Simbol & soal cerita", isi: `<ul><li>Ubah cerita menjadi kalimat matematika. "3 buku sama harga + pulpen Rp4.000 = Rp19.000" → <b>3 × □ + 4.000 = 19.000</b>.</li>
        <li>Simbol: bandingkan dua baris. ▲ + ▲ + ● = 23 dan ▲ + ● = 15, bedanya satu ▲, jadi ▲ = 23 − 15 = <b>8</b> dan ● = 15 − 8 = <b>7</b>.</li>
        <li>Jumlah & selisih dua bilangan: bilangan besar = (jumlah + selisih) : 2.</li>
        <li>Ingat urutan: <b>kali dan bagi dulu</b>, baru tambah dan kurang.</li></ul>` },
    ],
    contoh: [
      { soal: "□ − 18 = 27<br>Nilai □ adalah …",
        langkah: ["Lawan dari kurang adalah tambah.", "□ = 27 + 18 = 45.", "Cek: 45 − 18 = 27 ✔"], jawab: "45" },
      { soal: "4 × □ + 9 = 41<br>Nilai □ adalah …",
        langkah: ["Kerjakan mundur, mulai dari operasi terakhir (+ 9).", "Kurangi: 41 − 9 = 32. Jadi 4 × □ = 32.", "Bagi: □ = 32 : 4 = 8.", "Cek: 4 × 8 + 9 = 32 + 9 = 41 ✔"], jawab: "8" },
      { soal: "Dina membeli 3 buku tulis yang harganya sama dan sebuah pulpen seharga Rp4.000. Seluruhnya Dina membayar Rp19.000. Harga 1 buku tulis adalah …",
        langkah: ["Kalimatnya: 3 × □ + 4.000 = 19.000.", "Kurangi harga pulpen: Rp19.000 − Rp4.000 = Rp15.000. Itu harga 3 buku.", "Harga 1 buku = Rp15.000 : 3 = Rp5.000.", "Cek: 3 × Rp5.000 + Rp4.000 = Rp15.000 + Rp4.000 = Rp19.000 ✔"], jawab: "Rp5.000" },
    ],
  };
}
