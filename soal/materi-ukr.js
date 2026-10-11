/* Materi Pos 3 — Pengukuran & Bangun (u1–u7): teori singkat + contoh bertahap.
   Dimuat SETELAH semua berkas soal; memakai svgBuka/svgT/fmt/pc (inti.js) dan gambar dari ukur.js. */
"use strict";
(() => {
  /* ---------- Alat gambar kecil ---------- */
  const B = "#2F7FD8", H = "#2E9E5B", K = "#F2B92E", M = "#D9534F", U = "#7B4FD6", T = "#1F2633";
  const MB = "#E3EFFC", MH = "#E2F6EA", MK = "#FFF4D2";
  const tx = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" style="font-size:${o.f || 14}px;font-weight:${o.w || 700};fill:${o.c || T}">${s}</text>`;
  const ln = (x1, y1, x2, y2, c = T, w = 2.5, dash = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ""} stroke-linecap="round"/>`;
  const kotak = (x, y, w, h, isi, garis = B, lebar = 2) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${isi}" stroke="${garis}" stroke-width="${lebar}"/>`;
  const sisip = (svg, tambahan) => svg.replace(/<\/svg>$/, tambahan + "</svg>");
  const pi = pc(22, 7);

  /* Tangga satuan panjang */
  const gTangga = (() => {
    const st = ["km", "hm", "dam", "m", "dm", "cm", "mm"], warna = [MB, MH, MK, MB, MH, MK, MB];
    let s = svgBuka(360, 205, "tangga satuan panjang dari km sampai mm");
    st.forEach((n, i) => { const x = 8 + i * 49, y = 40 + i * 20; s += kotak(x, y, 47, 196 - y, warna[i], B, 2) + tx(x + 23.5, y + 17, n, { f: 15, w: 800 }); });
    s += tx(196, 26, "turun 1 anak tangga: × 10 ↘", { a: "start", f: 13, c: H }) + tx(196, 46, "naik 1 anak tangga: : 10 ↖", { a: "start", f: 13, c: M });
    return s + "</svg>";
  })();

  /* Persegi panjang dengan keempat sisi berlabel (untuk keliling) */
  const gKeliling = (() => {
    let s = svgBuka(320, 200, "persegi panjang 8 cm kali 5 cm, keliling dijumlahkan dari keempat sisinya");
    s += kotak(60, 30, 200, 110, MB, B, 3);
    s += tx(160, 22, "8 cm", { c: B }) + tx(160, 160, "8 cm", { c: B }) + tx(52, 90, "5 cm", { a: "end", c: H }) + tx(268, 90, "5 cm", { a: "start", c: H });
    s += tx(160, 190, "K = 8 + 5 + 8 + 5 = 26 cm", { f: 14, w: 800 });
    return s + "</svg>";
  })();

  /* Segitiga di dalam persegi panjang: luas segitiga = setengahnya */
  const gSegitiga = (() => {
    let s = svgBuka(320, 200, "segitiga di dalam persegi panjang, luasnya setengah persegi panjang");
    s += kotak(50, 20, 220, 130, "#FFFFFF", B, 2) + `<polygon points="50,150 190,20 270,150" fill="${MK}" stroke="${K}" stroke-width="3"/>`;
    s += ln(190, 20, 190, 150, M, 2, "6 4") + `<path d="M190 138H202V150" fill="none" stroke="${M}" stroke-width="2"/>`;
    s += tx(160, 172, "alas (a)", { c: B }) + tx(198, 92, "tinggi (t)", { a: "start", c: M, f: 13 });
    s += tx(160, 194, "L = a × t : 2", { w: 800 });
    return s + "</svg>";
  })();

  /* Lingkaran dengan jari-jari dan diameter */
  const gLingkaran = (() => {
    let s = svgBuka(300, 190, "lingkaran dengan jari-jari r dan diameter d");
    s += `<circle cx="150" cy="90" r="75" fill="${MB}" stroke="${B}" stroke-width="3"/>`;
    s += ln(75, 90, 225, 90, U, 2.5) + ln(150, 90, 203, 37, H, 2.5) + `<circle cx="150" cy="90" r="4" fill="${T}"/>`;
    s += tx(112, 108, "d", { c: U, f: 15 }) + tx(186, 76, "r", { c: H, f: 15 }) + tx(150, 186, "d = 2 × r", { w: 800 });
    return s + "</svg>";
  })();

  /* Bangun L: 10 × 8 dengan potongan 4 × 3 di pojok kanan atas (u = 22 px) */
  const gL = (() => {
    let s = svgBuka(330, 232, "bangun L dipecah menjadi persegi panjang A 6 kali 8 dan B 4 kali 5");
    s += kotak(50, 24, 132, 176, MB, "none", 0) + kotak(182, 90, 88, 110, MH, "none", 0);
    s += `<polygon points="50,24 182,24 182,90 270,90 270,200 50,200" fill="none" stroke="${B}" stroke-width="3"/>` + ln(182, 90, 182, 200, M, 2.5, "6 4");
    s += tx(116, 18, "6 cm") + tx(188, 62, "3 cm", { a: "start" }) + tx(226, 84, "4 cm") + tx(276, 150, "5 cm", { a: "start" }) + tx(160, 222, "10 cm") + tx(44, 116, "8 cm", { a: "end" });
    s += tx(116, 118, "A", { f: 18, c: B, w: 800 }) + tx(116, 140, "6 × 8", { f: 13 }) + tx(226, 138, "B", { f: 18, c: H, w: 800 }) + tx(226, 160, "4 × 5", { f: 13 });
    return s + "</svg>";
  })();
  const gLKurang = (() => {
    let s = svgBuka(330, 232, "bangun L sebagai persegi panjang 10 kali 8 dikurangi potongan 4 kali 3");
    s += kotak(50, 24, 220, 176, MB, B, 3) + `<rect x="182" y="24" width="88" height="66" fill="#FBE3E2" stroke="${M}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
    s += tx(226, 52, "dibuang", { f: 13, c: M }) + tx(226, 72, "4 × 3", { f: 13, c: M });
    s += tx(116, 130, "10 × 8", { f: 15, w: 800 }) + tx(160, 222, "10 cm") + tx(44, 116, "8 cm", { a: "end" });
    return s + "</svg>";
  })();

  /* Jenis-jenis sudut */
  const gJenisSudut = (() => {
    let s = svgBuka(360, 140, "sudut lancip, siku-siku, tumpul, dan lurus");
    // lancip 45°
    s += ln(12, 88, 82, 88) + ln(12, 88, 58, 42) + `<path d="M32 88A20 20 0 0 0 26.1 73.9" fill="none" stroke="${H}" stroke-width="3"/>`;
    // siku-siku
    s += ln(110, 88, 170, 88) + ln(110, 88, 110, 28) + `<path d="M124 88V74H110" fill="none" stroke="${B}" stroke-width="3"/>`;
    // tumpul 130°
    s += ln(230, 88, 268, 88) + ln(230, 88, 194.6, 45.9) + `<path d="M250 88A20 20 0 0 0 217.1 72.7" fill="none" stroke="${K}" stroke-width="3"/>`;
    // lurus 180°
    s += ln(277, 88, 353, 88) + `<path d="M333 88A18 18 0 0 0 297 88" fill="none" stroke="${U}" stroke-width="3"/>`;
    [[12, 88], [110, 88], [230, 88], [315, 88]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="3.5" fill="${T}"/>`; });
    [["lancip", "&lt; 90°", 45, H], ["siku-siku", "= 90°", 135, B], ["tumpul", "90°–180°", 228, "#B7860B"], ["lurus", "= 180°", 315, U]]
      .forEach(([n, d, x, c]) => { s += tx(x, 112, n, { f: 13, c, w: 800 }) + tx(x, 130, d, { f: 13 }); });
    return s + "</svg>";
  })();

  /* Bangun dengan sumbu simetri (garis putus-putus) */
  const gSimetri = (() => {
    let s = svgBuka(360, 165, "sumbu simetri persegi panjang, persegi, dan segitiga sama sisi");
    const d = (x1, y1, x2, y2) => ln(x1, y1, x2, y2, M, 2, "6 4");
    s += kotak(10, 30, 110, 70, MB, B, 2.5) + d(65, 20, 65, 110) + d(0, 65, 130, 65);
    s += kotak(150, 25, 80, 80, MH, H, 2.5) + d(190, 15, 190, 115) + d(140, 65, 240, 65) + d(143, 18, 237, 112) + d(237, 18, 143, 112);
    s += `<polygon points="305,22 350,100 260,100" fill="${MK}" stroke="#B7860B" stroke-width="2.5"/>` + d(305, 12, 305, 108) + d(260, 100, 335, 56.7) + d(350, 100, 275, 56.7);
    s += tx(65, 134, "2 sumbu", { f: 13 }) + tx(190, 134, "4 sumbu", { f: 13 }) + tx(305, 134, "3 sumbu", { f: 13 });
    s += tx(65, 154, "persegi panjang", { f: 12, w: 600 }) + tx(190, 154, "persegi", { f: 12, w: 600 }) + tx(305, 154, "segitiga sama sisi", { f: 12, w: 600 });
    return s + "</svg>";
  })();

  /* Jaring-jaring kubus 1-4-1 bernomor; sisi yang berhadapan berwarna sama */
  const gJaring = (() => {
    const u = 46, sel = [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], w = [MK, MB, MH, MB, MH, MK];
    let s = svgBuka(4 * u + 12, 3 * u + 12, "jaring-jaring kubus bernomor 1 sampai 6; sisi berhadapan berwarna sama");
    sel.forEach(([i, j], k) => { s += kotak(6 + i * u, 6 + j * u, u, u, w[k], B, 2) + tx(6 + i * u + u / 2, 6 + j * u + u / 2 + 6, k + 1, { f: 18, w: 800 }); });
    return s + "</svg>";
  })();

  /* Mata angin delapan arah */
  const gMataAngin = (() => {
    let s = svgBuka(300, 212, "mata angin delapan arah");
    const c = [150, 110];
    [[0, -70, "utara", "middle", 0, -10], [70, 0, "timur", "start", 6, 5], [0, 70, "selatan", "middle", 0, 22], [-70, 0, "barat", "end", -6, 5],
      [35.4, -35.4, "timur laut", "start", 6, -6], [35.4, 35.4, "tenggara", "start", 6, 16], [-35.4, 35.4, "barat daya", "end", -6, 16], [-35.4, -35.4, "barat laut", "end", -6, -6]]
      .forEach(([dx, dy, n, a, ox, oy], i) => { const x = c[0] + dx, y = c[1] + dy; s += ln(c[0], c[1], x.toFixed(1), y.toFixed(1), i < 4 ? B : "#8A93A3", i < 4 ? 3 : 2) + tx((x + ox).toFixed(1), (y + oy).toFixed(1), n, { a, f: 13, c: i ? T : M, w: i ? 700 : 800 }); });
    s += `<polygon points="150,36 143,52 157,52" fill="${M}"/><circle cx="150" cy="110" r="5" fill="${T}"/>`;
    return s + "</svg>";
  })();

  /* Bidang koordinat dengan jalan "ke kanan dulu, lalu ke atas" (svgKoord: X = 26 + 26x, Y = 226 − 26y) */
  const jalanKoord = (x0, y0, x1, y1) => { const X = x => 26 + 26 * x, Y = y => 226 - 26 * y;
    return `<path d="M${X(x0)} ${Y(y0)}H${X(x1)}" stroke="${H}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${X(x1)} ${Y(y0)}V${Y(y1)}" stroke="${M}" stroke-width="4" fill="none" stroke-linecap="round"/>`; };
  const gKoord = sisip(svgKoord([{ n: "A", x: 3, y: 5 }]), jalanKoord(0, 0, 3, 5));

  const lis = a => "<ul>" + a.map(x => `<li>${x}</li>`).join("") + "</ul>";
  const tabel = (kepala, baris) => `<table class="tabel-data"><tr>${kepala.map(k => `<th>${k}</th>`).join("")}</tr>${baris.map(b => `<tr>${b.map(x => `<td>${x}</td>`).join("")}</tr>`).join("")}</table>`;

  /* ================= u1: Satuan ================= */
  MATERI.u1 = {
    ringkas: [
      { judul: "Tangga satuan panjang",
        isi: `<p>Bayangkan satuan panjang seperti anak tangga: <b>km – hm – dam – m – dm – cm – mm</b>.</p>` +
          lis(["<b>Turun</b> 1 anak tangga → <b>dikali 10</b>.", "<b>Naik</b> 1 anak tangga → <b>dibagi 10</b>.", "Hafalkan: 1 km = 1.000 m, 1 m = 100 cm, 1 cm = 10 mm."]) +
          `<p>Contoh: m ke cm turun 2 anak tangga, jadi dikali 10 × 10 = 100.</p>`,
        gambar: gTangga },
      { judul: "Satuan berat",
        isi: `<p>Satuan berat juga punya tangga: <b>kg – hg – dag – g</b>, turun dikali 10. Satuan lain yang sering muncul:</p>` +
          tabel(["Satuan", "Sama dengan"], [["1 ton", "1.000 kg"], ["1 kuintal", "100 kg"], ["1 kg", "10 ons = 1.000 g"], ["1 ons", "1 hg = 100 g"]]) },
      { judul: "Satuan waktu",
        isi: tabel(["Satuan", "Sama dengan"], [["1 jam", "60 menit"], ["1 menit", "60 detik"], ["1 hari", "24 jam"], ["1 minggu", "7 hari"], ["1 tahun", "12 bulan"]]) +
          `<p>Ingat: 0,5 jam = 30 menit dan 15 menit = 0,25 jam. Zona waktu: <b>WIT</b> lebih cepat 1 jam dari <b>WITA</b>, dan WITA lebih cepat 1 jam dari <b>WIB</b>.</p>` },
      { judul: "Satuan isi, kecepatan & debit",
        isi: lis(["<b>1 liter = 1 dm³ = 1.000 mL = 1.000 cm³</b>, jadi 1 mL = 1 cm³.", "1 m³ = 1.000 liter.",
          "<b>Kecepatan = jarak : waktu</b>, jarak = kecepatan × waktu, waktu = jarak : kecepatan.",
          "<b>Debit = volume : waktu</b>, misalnya liter/menit."]) +
          `<p>Kuncinya: <b>samakan satuan dulu</b>, baru menghitung.</p>` },
    ],
    contoh: [
      { soal: "3 km 25 m = … m",
        langkah: ["1 km = 1.000 m, jadi 3 km = 3 × 1.000 = 3.000 m.", "Tambahkan sisanya: 3.000 m + 25 m = 3.025 m."],
        jawab: "3.025 m" },
      { soal: "2,5 kg + 7 ons = … g",
        langkah: ["Ubah kg ke g: 2,5 × 1.000 = 2.500 g.", "Ubah ons ke g: 7 × 100 = 700 g.", "Jumlahkan: 2.500 g + 700 g = 3.200 g."],
        jawab: "3.200 g" },
      { soal: "Bus berangkat pukul 07.15 menempuh jarak 150 km dengan kecepatan rata-rata 60 km/jam. Di tengah jalan bus berhenti istirahat 20 menit. Bus tiba pukul …",
        langkah: ["Waktu perjalanan = jarak : kecepatan = 150 : 60 = 2,5 jam.", "2,5 jam = 2 jam 30 menit.",
          "Tambah istirahat: 2 jam 30 menit + 20 menit = 2 jam 50 menit.", "07.15 + 2 jam = 09.15, lalu 09.15 + 50 menit = 10.05."],
        jawab: "pukul 10.05" },
    ],
  };

  /* ================= u2: Keliling & luas ================= */
  MATERI.u2 = {
    ringkas: [
      { judul: "Keliling = jumlah semua sisi",
        isi: `<p>Keliling adalah panjang <b>tepi</b> bangun, seperti semut berjalan mengitari pinggirnya satu kali. Satuannya cm, m, dan seterusnya.</p>` +
          lis(["Persegi: K = 4 × s", "Persegi panjang: K = 2 × (p + l)", "Bangun lain: jumlahkan semua sisinya."]),
        gambar: gKeliling },
      { judul: "Luas segi empat",
        isi: `<p>Luas adalah banyak persegi satuan yang menutupi bangun. Satuannya cm², m², dan seterusnya.</p>` +
          tabel(["Bangun", "Luas"], [["Persegi", "s × s"], ["Persegi panjang", "p × l"], ["Jajar genjang", "a × t"], ["Trapesium", "(a + b) × t : 2"], ["Belah ketupat & layang-layang", "d₁ × d₂ : 2"]]) +
          `<p><small>a dan b = dua sisi yang sejajar, d₁ dan d₂ = kedua diagonal.</small></p>` },
      { judul: "Luas segitiga",
        isi: `<p>Segitiga adalah <b>setengah</b> dari persegi panjang yang membungkusnya. Jadi <b>L = alas × tinggi : 2</b>.</p>` +
          `<p>Tinggi selalu <b>tegak lurus</b> alas (ada tanda siku-siku). Pada segitiga siku-siku, kedua sisi siku-sikunya menjadi alas dan tinggi.</p>`,
        gambar: gSegitiga },
      { judul: "Lingkaran",
        isi: lis(["Diameter d = 2 × jari-jari r.", `π = ${pi} (pakai jika r atau d kelipatan 7) atau 3,14.`,
          "<b>Keliling = 2 × π × r = π × d</b>", "<b>Luas = π × r × r</b>", "Setengah lingkaran = ½ luas, seperempat lingkaran = ¼ luas."]),
        gambar: gLingkaran },
    ],
    contoh: [
      { soal: "Sebuah persegi panjang berukuran 12 cm × 7 cm. Berapa keliling dan luasnya?",
        gambar: persegiP(12, 7),
        langkah: ["Keliling = 2 × (p + l) = 2 × (12 + 7).", "2 × 19 = 38 cm.", "Luas = p × l = 12 × 7 = 84 cm²."],
        jawab: "Keliling 38 cm, luas 84 cm²" },
      { soal: "Sebuah trapesium memiliki sisi sejajar 8 cm dan 14 cm, serta tinggi 6 cm. Luasnya adalah …",
        gambar: trapesiumG(8, 14, 6),
        langkah: ["Jumlahkan sisi sejajar: 8 + 14 = 22 cm.", "Kalikan tinggi: 22 × 6 = 132.", "Bagi 2: 132 : 2 = 66 cm²."],
        jawab: "66 cm²" },
      { soal: `Roda sepeda berjari-jari 35 cm berputar 20 kali. Jarak yang ditempuh adalah … m. (Gunakan π = ${pi})`,
        langkah: ["Satu putaran roda = keliling lingkaran = 2 × π × r.", `K = 2 × ${pi} × 35 = 2 × 22 × 5 = 220 cm.`,
          "20 putaran: 20 × 220 = 4.400 cm.", "Ubah ke meter: 4.400 : 100 = 44 m."],
        jawab: "44 m" },
    ],
  };

  /* ================= u3: Bangun gabungan ================= */
  const J = jendelaP(14, 20);
  MATERI.u3 = {
    ringkas: [
      { judul: "Cara 1: pecah, lalu jumlahkan",
        isi: `<p>Bangun gabungan dipecah menjadi bangun sederhana (persegi panjang, segitiga, setengah lingkaran) dengan garis bantu.</p>` +
          `<p><b>Luas gabungan = luas bagian A + luas bagian B</b>.</p>` +
          `<p>Ukuran yang belum tertulis dicari dari selisih: di gambar, tinggi B = 8 − 3 = 5 cm. Hasilnya 48 + 20 = 68 cm².</p>`,
        gambar: gL },
      { judul: "Cara 2: besar dikurangi yang kosong",
        isi: `<p>Kadang lebih cepat menganggapnya persegi panjang utuh, lalu <b>mengurangi bagian yang hilang</b> (potongan atau lubang).</p>` +
          `<p>Bangun L yang sama: 10 × 8 = 80, dikurangi 4 × 3 = 12, hasilnya 80 − 12 = 68 cm². Sama dengan cara 1!</p>`,
        gambar: gLKurang },
      { judul: "Keliling bangun gabungan",
        isi: lis(["Keliling = jumlah sisi <b>tepi luar</b> saja.", "Garis bantu di dalam bangun (putus-putus) <b>tidak</b> dihitung.",
          "Trik bangun L/tangga yang semua pojoknya siku-siku: kelilingnya sama dengan persegi panjang pembungkusnya. Bangun L di atas: 2 × (10 + 8) = 36 cm.",
          "Ada setengah lingkaran? Pakai setengah keliling lingkaran: ½ × π × d."]) },
    ],
    contoh: [
      { soal: "Hitunglah luas bangun L pada gambar.",
        gambar: gL,
        langkah: ["Pecah menjadi dua persegi panjang A dan B.", "Tinggi B = 8 − 3 = 5 cm, lebar B = 10 − 6 = 4 cm.", "Luas A = 6 × 8 = 48 cm², luas B = 4 × 5 = 20 cm².", "Jumlahkan: 48 + 20 = 68 cm²."],
        jawab: "68 cm²" },
      { soal: "Gambar rumah terdiri atas persegi bersisi 10 cm dan atap segitiga dengan alas 10 cm dan tinggi 6 cm. Luas seluruh gambar adalah …",
        gambar: svgPoligon(bentukRumah(10, 10, 6), { 2: "10 cm", 3: "10 cm" }, { label: "rumah dari persegi dan segitiga", extra: Tr => garis(Tr([0, 6]), Tr([10, 6])) + bantuTegak(Tr, 5, 0, 6, "6 cm") }),
        langkah: ["Luas persegi = 10 × 10 = 100 cm².", "Alas segitiga sama dengan sisi persegi, yaitu 10 cm.", "Luas segitiga = 10 × 6 : 2 = 30 cm².", "Jumlahkan: 100 + 30 = 130 cm²."],
        jawab: "130 cm²" },
      { soal: `Jendela berbentuk persegi panjang dengan setengah lingkaran di atasnya. Lebar jendela 28 cm dan tinggi bagian persegi panjangnya 20 cm. Luas jendela adalah … (Gunakan π = ${pi})`,
        gambar: svgPoligon(J, { 0: "20 cm", [J.length - 1]: "28 cm" }, { label: "jendela persegi panjang dengan setengah lingkaran", extra: Tr => garis(Tr([0, 14]), Tr([28, 14])) }),
        langkah: ["Luas persegi panjang = 28 × 20 = 560 cm².", "Diameter setengah lingkaran = 28 cm, jadi r = 14 cm.",
          `Luas setengah lingkaran = ½ × ${pi} × 14 × 14 = ½ × 616 = 308 cm².`, "Jumlahkan: 560 + 308 = 868 cm²."],
        jawab: "868 cm²" },
    ],
  };

  /* ================= u4: Volume ================= */
  MATERI.u4 = {
    ringkas: [
      { judul: "Volume = banyak kubus satuan",
        isi: `<p>Volume adalah <b>isi</b> sebuah bangun ruang, yaitu banyak kubus satuan yang memenuhinya. Kubus satuan 1 cm × 1 cm × 1 cm volumenya 1 cm³.</p>` +
          `<p>Balok di gambar: satu lapis berisi 4 × 3 = 12 kubus, ada 2 lapis, jadi 12 × 2 = 24 cm³.</p>`,
        gambar: svgBalok(4, 3, 2, ["p = 4", "l = 3", "t = 2"], true) },
      { judul: "Rumus volume",
        isi: lis(["<b>Kubus: V = s × s × s</b> (s = rusuk)", "<b>Balok: V = p × l × t</b>", "Bisa juga: V = luas alas × tinggi.",
          "Mencari ukuran yang hilang: t = V : (p × l).", "Rusuk kubus: cari bilangan yang dikali 3 kali hasilnya V."]) +
          tabel(["s", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], [["s × s × s", "1", "8", "27", "64", "125", "216", "343", "512", "729", "1.000"]]) },
      { judul: "Satuan volume",
        isi: `<p>Tangga satuan volume: <b>m³ – dm³ – cm³</b>. Turun 1 anak tangga <b>dikali 1.000</b>, naik <b>dibagi 1.000</b>.</p>` +
          tabel(["Satuan", "Sama dengan"], [["1 m³", "1.000 dm³ = 1.000 liter"], ["1 dm³", "1 liter = 1.000 cm³"], ["1 cm³", "1 mL"]]) +
          `<p>Soal air dalam akuarium atau bak hampir selalu meminta liter: hitung cm³, lalu bagi 1.000.</p>` },
    ],
    contoh: [
      { soal: "Sebuah kubus memiliki panjang rusuk 7 cm. Volumenya adalah …",
        langkah: ["V = s × s × s = 7 × 7 × 7.", "7 × 7 = 49.", "49 × 7 = 343 cm³."],
        jawab: "343 cm³" },
      { soal: "Akuarium berbentuk balok berukuran panjang 50 cm, lebar 30 cm, dan tinggi 40 cm diisi air sampai penuh. Banyak air adalah … liter.",
        gambar: svgBalok(50, 30, 40, ["50 cm", "30 cm", "40 cm"]),
        langkah: ["V = p × l × t = 50 × 30 × 40.", "50 × 30 = 1.500.", "1.500 × 40 = 60.000 cm³.", "Ubah ke liter: 60.000 : 1.000 = 60 liter."],
        jawab: "60 liter" },
      { soal: "Bak mandi berbentuk balok berukuran 80 cm × 50 cm × 60 cm kosong, lalu diisi air dengan debit 8 liter/menit. Bak itu penuh dalam waktu … menit.",
        langkah: ["Volume bak = 80 × 50 × 60.", "80 × 50 = 4.000, lalu 4.000 × 60 = 240.000 cm³.", "Ubah ke liter: 240.000 : 1.000 = 240 liter.", "Waktu = volume : debit = 240 : 8 = 30 menit."],
        jawab: "30 menit" },
    ],
  };

  /* ================= u5: Sudut ================= */
  MATERI.u5 = {
    ringkas: [
      { judul: "Jenis-jenis sudut",
        isi: lis(["<b>Lancip</b>: kurang dari 90°.", "<b>Siku-siku</b>: tepat 90°, ditandai kotak kecil (seperti pojok buku).",
          "<b>Tumpul</b>: lebih dari 90° tetapi kurang dari 180°.", "<b>Lurus</b>: tepat 180°.", "Satu putaran penuh = 360°."]),
        gambar: gJenisSudut },
      { judul: "Mengukur dengan busur derajat",
        isi: lis(["Letakkan titik tengah busur tepat di titik sudut.", "Impitkan garis 0° dengan salah satu kaki sudut.", "Baca angka yang dilewati kaki sudut lainnya, mulai hitung dari 0°.", "Setiap garis kecil = 10° (gambar ini menunjukkan 50°)."]),
        gambar: svgBusur(50) },
      { judul: "Jumlah sudut",
        isi: tabel(["Tempat", "Jumlah sudut"], [["Pada garis lurus", "180°"], ["Mengelilingi satu titik", "360°"], ["Segitiga", "180°"], ["Segiempat", "360°"]]) +
          `<p>Cari sudut yang hilang: <b>jumlah total dikurangi sudut-sudut yang diketahui</b>.</p>` },
      { judul: "Sudut jarum jam & mata angin",
        isi: lis(["Jarak antar angka jam = 360° : 12 = <b>30°</b>.", "Jarum panjang bergerak <b>6°</b> setiap menit.", "Jarum pendek bergerak <b>0,5°</b> setiap menit.",
          "Mata angin 8 arah: setiap arah bertetangga berjarak <b>45°</b>."]),
        gambar: svgJam(3, 0) },
    ],
    contoh: [
      { soal: "Pada garis lurus, sudut x dan sudut 125° saling berdampingan. Besar sudut x adalah …",
        gambar: svgSudutBagi(180, 55, ["x", "125°"]),
        langkah: ["Sudut pada garis lurus jumlahnya 180°.", "x = 180° − 125° = 55°."],
        jawab: "55°" },
      { soal: "Dua sudut sebuah segitiga besarnya 48° dan 67°. Besar sudut ketiga adalah …",
        gambar: svgSegitigaSudut(48, 67, ["48°", "67°", "?"]),
        langkah: ["Jumlah ketiga sudut segitiga = 180°.", "Jumlahkan yang diketahui: 48° + 67° = 115°.", "Sudut ketiga = 180° − 115° = 65°."],
        jawab: "65°" },
      { soal: "Besar sudut terkecil yang dibentuk jarum jam pada pukul 04.30 adalah …",
        gambar: svgJam(4, 30),
        langkah: ["Jarum panjang di angka 6: 30 × 6° = 180° dari angka 12.", "Jarum pendek: 4 × 30° = 120°, ditambah 30 × 0,5° = 15°, jadi 135°.", "Selisihnya: 180° − 135° = 45°."],
        jawab: "45°" },
    ],
  };

  /* ================= u6: Sifat bangun, simetri, jaring-jaring ================= */
  const enam = segiBeraturan(6);
  MATERI.u6 = {
    ringkas: [
      { judul: "Sifat bangun datar",
        isi: tabel(["Bangun", "Ciri utama", "Lipat", "Putar"], [
          ["Persegi", "4 sisi sama, 4 sudut siku-siku", "4", "4"],
          ["Persegi panjang", "sisi berhadapan sama, 4 sudut siku-siku", "2", "2"],
          ["Belah ketupat", "4 sisi sama, diagonal tegak lurus", "2", "2"],
          ["Jajar genjang", "sisi berhadapan sejajar & sama", "0", "2"],
          ["Layang-layang", "2 pasang sisi berdekatan sama", "1", "–"],
          ["Segitiga sama sisi", "3 sisi sama, sudut 60°", "3", "3"],
        ]) + `<p><small>Lipat = banyak simetri lipat, Putar = tingkat simetri putar, – = tidak punya. Lingkaran punya simetri lipat tak terhingga.</small></p>` },
      { judul: "Simetri lipat & simetri putar",
        isi: lis(["<b>Sumbu simetri</b> = garis lipat yang membagi bangun menjadi dua bagian yang tepat berimpit.",
          "<b>Tingkat simetri putar</b> = berapa kali bangun tepat menempati bingkainya dalam satu putaran penuh.",
          "Sudut putar terkecil = 360° : tingkat simetri putar.", "Segi-n beraturan: n sumbu simetri dan simetri putar tingkat n."]),
        gambar: gSimetri },
      { judul: "Bangun ruang",
        isi: tabel(["Bangun", "Sisi", "Rusuk", "Titik sudut"], [["Kubus / balok", "6", "12", "8"], ["Prisma segi-n", "n + 2", "3 × n", "2 × n"], ["Limas segi-n", "n + 1", "2 × n", "n + 1"],
          ["Tabung", "3", "2", "0"], ["Kerucut", "2", "1", "1 (puncak)"], ["Bola", "1", "0", "0"]]) },
      { judul: "Jaring-jaring kubus",
        isi: lis(["Jaring-jaring kubus terdiri atas <b>6 persegi</b> yang bisa dilipat menjadi kubus tanpa tumpang tindih.", "Pola <b>1-4-1</b> (4 berderet, 1 di atas, 1 di bawah) selalu benar.",
          "Pada deretan 4 persegi, sisi yang <b>berhadapan dipisahkan satu persegi</b>: 2 dan 4, 3 dan 5.", "Persegi di atas dan di bawah deretan saling berhadapan: 1 dan 6."]),
        gambar: gJaring },
    ],
    contoh: [
      { soal: "Berapa banyak sisi, rusuk, dan titik sudut prisma segienam?",
        langkah: ["Alas prisma segienam punya 6 sisi, jadi n = 6.", "Sisi = n + 2 = 6 + 2 = 8.", "Rusuk = 3 × n = 3 × 6 = 18.", "Titik sudut = 2 × n = 2 × 6 = 12."],
        jawab: "8 sisi, 18 rusuk, 12 titik sudut" },
      { soal: "Segienam beraturan memiliki berapa sumbu simetri, dan berapa sudut putar terkecilnya?",
        gambar: svgPoligon(enam, {}, { label: "segienam beraturan dengan 6 sumbu simetri", extra: Tr => [0, 30, 60, 90, 120, 150].map(d => { const a = d * Math.PI / 180, c = Math.cos(a) * 112, s = Math.sin(a) * 112; return garis(Tr([c, s]), Tr([-c, -s])); }).join("") }),
        langkah: ["Segienam beraturan punya 6 sisi sama panjang, jadi n = 6.", "Banyak sumbu simetri = 6: 3 melalui titik sudut yang berhadapan dan 3 melalui tengah sisi yang berhadapan.", "Tingkat simetri putarnya juga 6.", "Sudut putar terkecil = 360° : 6 = 60°."],
        jawab: "6 sumbu simetri, sudut putar terkecil 60°" },
      { soal: "Jaring-jaring pada gambar dilipat menjadi kubus. Sisi yang berhadapan dengan sisi 2 adalah sisi nomor …",
        gambar: svgJaring({ sel: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] }, ["1", "2", "3", "4", "5", "6"]),
        langkah: ["Lihat deretan 4 persegi: 2 – 3 – 4 – 5.", "Pada deretan itu, sisi berhadapan dipisahkan satu persegi.", "Sisi 2 dipisahkan dari sisi 4 oleh sisi 3, jadi 2 berhadapan dengan 4."],
        jawab: "4" },
    ],
  };

  /* ================= u7: Denah & koordinat ================= */
  MATERI.u7 = {
    ringkas: [
      { judul: "Koordinat (x, y)",
        isi: `<p>Letak titik ditulis <b>(x, y)</b> = (mendatar, tegak). Mulai dari titik pangkal O(0, 0):</p>` +
          lis(["Jalan <b>ke kanan dulu</b> sebanyak x (angka pertama).", "Lalu <b>naik ke atas</b> sebanyak y (angka kedua)."]) +
          `<p>Titik A(3, 5): 3 langkah ke kanan, lalu 5 langkah ke atas. Ingat: “jalan dulu, baru naik tangga”.</p>`,
        gambar: gKoord },
      { judul: "Geser titik & jarak",
        isi: lis(["Geser ke <b>kanan</b>: x ditambah. Ke <b>kiri</b>: x dikurangi.", "Geser ke <b>atas</b>: y ditambah. Ke <b>bawah</b>: y dikurangi.",
          "Dua titik pada garis mendatar (y sama): jarak = selisih x.", "Persegi panjang dari koordinat: panjang = selisih x, lebar = selisih y."]) },
      { judul: "Denah & mata angin",
        isi: `<p>Pada denah, arah <b>utara</b> biasanya di atas (lihat tanda U). Urutan searah jarum jam: utara, timur laut, timur, tenggara, selatan, barat daya, barat, barat laut. Setiap langkah 45°.</p>`,
        gambar: gMataAngin },
      { judul: "Skala",
        isi: `<p>Skala <b>1 : 500</b> artinya 1 cm pada denah = 500 cm di tempat sebenarnya.</p>` +
          lis(["<b>Jarak sebenarnya = jarak denah × skala</b>", "<b>Jarak denah = jarak sebenarnya : skala</b> (ubah ke cm dulu!)", "1 m = 100 cm, 1 km = 100.000 cm."]) },
    ],
    contoh: [
      { soal: "Titik A(2, 3) digeser 4 satuan ke kanan, lalu 3 satuan ke atas menjadi titik B. Koordinat titik B adalah …",
        gambar: sisip(svgKoord([{ n: "A", x: 2, y: 3 }, { n: "B", x: 6, y: 6 }]), jalanKoord(2, 3, 6, 6)),
        langkah: ["Ke kanan 4 satuan: x bertambah, 2 + 4 = 6.", "Ke atas 3 satuan: y bertambah, 3 + 3 = 6.", "Jadi B = (6, 6)."],
        jawab: "B(6, 6)" },
      { soal: "Pada peta berskala 1 : 250.000, jarak dua kota 6 cm. Jarak sebenarnya adalah … km.",
        langkah: ["Jarak sebenarnya = jarak peta × skala.", "6 × 250.000 = 1.500.000 cm.", "1 km = 100.000 cm, jadi 1.500.000 : 100.000 = 15 km."],
        jawab: "15 km" },
      { soal: "Sebuah taman pada denah berskala 1 : 200 berbentuk persegi panjang berukuran 6 cm × 4 cm. Luas taman sebenarnya adalah … m².",
        langkah: ["Panjang sebenarnya = 6 × 200 = 1.200 cm = 12 m.", "Lebar sebenarnya = 4 × 200 = 800 cm = 8 m.", "Luas = 12 × 8 = 96 m²."],
        jawab: "96 m²" },
    ],
  };
})();
