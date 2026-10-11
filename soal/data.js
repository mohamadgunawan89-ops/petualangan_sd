/* Pos 4 — Data & Peluang: 3 misi × 10 level */
"use strict";

/* ---------- Kumpulan data ---------- */
const TEMA = [
  { judul: "Buah kesukaan siswa kelas 6", sat: "siswa", kat: ["Apel", "Jeruk", "Mangga", "Pisang", "Anggur", "Salak"] },
  { judul: "Olahraga kesukaan siswa", sat: "siswa", kat: ["Sepak bola", "Renang", "Bulu tangkis", "Voli", "Basket"] },
  { judul: "Kendaraan siswa ke sekolah", sat: "siswa", kat: ["Jalan kaki", "Sepeda", "Motor", "Mobil", "Angkot"] },
  { judul: "Buku yang dipinjam di perpustakaan", sat: "buku", kat: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"] },
  { judul: "Hasil panen jagung Pak Tani", sat: "kg", kat: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"] },
  { judul: "Pengunjung taman kota", sat: "orang", kat: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] },
  { judul: "Warna kesukaan siswa", sat: "siswa", kat: ["Merah", "Biru", "Hijau", "Kuning", "Ungu"] },
];
function dataAcak(k, step = 1, min = 1, max = 10, beda = true) {
  const t = pilih(TEMA), kat = t.kat.slice(0, Math.min(k, t.kat.length)), v = [];
  while (v.length < kat.length) { const x = acak(min, max) * step; if (!beda || !v.includes(x)) v.push(x); }
  return { ...t, kat, v };
}
const tabelHtml = d => `<table class="tabel-data"><thead><tr><th>${d.kolom || "Kategori"}</th><th>Banyak (${d.sat})</th></tr></thead><tbody>${d.kat.map((k, i) => `<tr><td>${k}</td><td>${fmt(d.v[i])}</td></tr>`).join("")}</tbody></table>`;
function svgBatang(d, step) {
  const maks = Math.ceil(Math.max(...d.v) / step) * step + step, n = d.kat.length, bw = 34, gap = 18, x0 = 44, H = 170, W = x0 + n * (bw + gap) + 10, Y = v => 20 + H - v / maks * H;
  let s = svgBuka(W, H + 60, d.judul) + svgT(W / 2, 13, d.judul, 'text-anchor="middle" class="lbl"');
  for (let v = 0; v <= maks; v += step) s += `<line x1="${x0}" y1="${Y(v)}" x2="${W - 6}" y2="${Y(v)}" class="kisi"/>` + svgT(x0 - 6, Y(v) + 4, fmt(v), 'text-anchor="end" class="kecil"');
  d.kat.forEach((k, i) => { const x = x0 + gap / 2 + i * (bw + gap); s += `<rect x="${x}" y="${Y(d.v[i])}" width="${bw}" height="${Y(0) - Y(d.v[i])}" class="batang b${i % 6}"/>` + svgT(x + bw / 2, Y(0) + 15, k, 'text-anchor="middle" class="mini"'); });
  return s + `<line x1="${x0}" y1="${Y(0)}" x2="${W - 6}" y2="${Y(0)}" class="sumbu"/></svg>`;
}
function svgGarisD(d, step) {
  const maks = Math.ceil(Math.max(...d.v) / step) * step + step, n = d.kat.length, x0 = 44, sp = 52, H = 160, W = x0 + (n - 1) * sp + 40, Y = v => 22 + H - v / maks * H, X = i => x0 + 20 + i * sp;
  let s = svgBuka(W, H + 56, d.judul) + svgT(W / 2, 13, d.judul, 'text-anchor="middle" class="lbl"');
  for (let v = 0; v <= maks; v += step) s += `<line x1="${x0}" y1="${Y(v)}" x2="${W - 6}" y2="${Y(v)}" class="kisi"/>` + svgT(x0 - 6, Y(v) + 4, fmt(v), 'text-anchor="end" class="kecil"');
  s += `<polyline points="${d.v.map((v, i) => X(i) + "," + Y(v)).join(" ")}" class="garis-data"/>`;
  d.kat.forEach((k, i) => { s += `<circle cx="${X(i)}" cy="${Y(d.v[i])}" r="4" class="titik-k"/>` + svgT(X(i), Y(0) + 15, k, 'text-anchor="middle" class="mini"'); });
  return s + "</svg>";
}
function svgPiktogram(d, k, ikon) {
  const baris = d.kat.length, W = 330; let s = svgBuka(W, baris * 30 + 44, d.judul) + svgT(W / 2, 13, d.judul, 'text-anchor="middle" class="lbl"');
  d.kat.forEach((kt, i) => { s += svgT(4, 42 + i * 30, kt, 'class="mini"'); for (let j = 0; j < d.v[i] / k; j++) s += svgT(96 + j * 22, 44 + i * 30, ikon, 'class="emoji-kecil"'); });
  return s + svgT(W - 4, baris * 30 + 40, `${ikon} = ${k} ${d.sat}`, 'text-anchor="end" class="mini"') + "</svg>";
}
function svgLingkaranD(kat, pr, judul) {
  const c = 90, r = 78; let s = svgBuka(340, 190, judul), a0 = -Math.PI / 2;
  kat.forEach((k, i) => { const a1 = a0 + pr[i] / 100 * 2 * Math.PI, x0 = c + r * Math.cos(a0), y0 = c + r * Math.sin(a0) + 6, x1 = c + r * Math.cos(a1), y1 = c + r * Math.sin(a1) + 6;
    s += `<path d="M${c} ${c + 6}L${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${pr[i] > 50 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}Z" class="batang b${i % 6}"/>`;
    const am = (a0 + a1) / 2; s += svgT((c + r * 0.62 * Math.cos(am)).toFixed(1), (c + 6 + r * 0.62 * Math.sin(am) + 4).toFixed(1), pr[i] + "%", 'text-anchor="middle" class="mini tebal"'); a0 = a1; });
  kat.forEach((k, i) => { s += `<rect x="196" y="${22 + i * 24}" width="14" height="14" class="batang b${i % 6}"/>` + svgT(216, 34 + i * 24, k, 'class="mini"'); });
  return s + "</svg>";
}
const IKON = ["⭐", "🍎", "📘", "🙂", "⚽", "🌼"];
const dJml = a => a.reduce((s, x) => s + x, 0);

/* ---------- Pembahasan bertahap (langkah) ---------- */
const lN = (x, s) => fmt(x) + (!s ? "" : /^[%°]$/.test(s) ? s : " " + s);
const lJadi = (x, s) => `Jadi, jawabannya <b>${lN(x, s)}</b>.`;
const lTambah = a => `${a.map(fmt).join(" + ")} = ${fmt(dJml(a))}`;
const lDaftar = (kat, v, s) => kat.map((k, i) => `${k} = ${lN(v[i], s)}`).join(", ");
const lNaik = x => (x > 0 ? `naik ${fmt(x)}` : x < 0 ? `turun ${fmt(-x)}` : "tetap");
/* Rata-rata: jumlahkan, lalu bagi banyak data */
function lRata(a, s, ket = "data") {
  const n = a.length, J = dJml(a), r = J / n;
  return [`Jumlahkan semua data: ${lTambah(a)}.`, `Banyaknya ada ${n} ${ket}, jadi jumlahnya dibagi ${n}.`, `Rata-rata = ${fmt(J)} : ${n} = ${fmt(r)}.`, lJadi(r, s)];
}
/* Median: urutkan, lalu cari data tengah (data tengah dicetak tebal) */
function lMedian(a, s) {
  const u = dUrut(a), n = u.length, m = median(a), t = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2];
  const L = [`Urutkan data dari yang terkecil: ${u.map((x, i) => (t.includes(i) ? `<b>${fmt(x)}</b>` : fmt(x))).join(", ")}.`];
  if (n % 2) L.push(`Banyak data ${n} (ganjil), jadi median adalah data ke-${(n + 1) / 2}, yaitu ${fmt(m)}.`);
  else L.push(`Banyak data ${n} (genap), jadi ada dua data tengah: data ke-${n / 2} dan ke-${n / 2 + 1}, yaitu ${fmt(u[n / 2 - 1])} dan ${fmt(u[n / 2])}.`,
    `Median = (${fmt(u[n / 2 - 1])} + ${fmt(u[n / 2])}) : 2 = ${fmt(u[n / 2 - 1] + u[n / 2])} : 2 = ${fmt(m)}.`);
  return [...L, lJadi(m, s)];
}
/* Modus: hitung kemunculan setiap nilai */
function lModus(a, s) {
  const nilai = dUrut([...new Set(a)]), c = nilai.map(v => a.filter(x => x === v).length), m = modusTunggal(a);
  return [`Urutkan supaya mudah dihitung: ${dUrut(a).join(", ")}.`, `Hitung kemunculan setiap nilai: ${nilai.map((v, i) => `${v} → ${c[i]} kali`).join("; ")}.`,
    `Yang paling sering muncul adalah ${m} (${Math.max(...c)} kali).`, lJadi(m, s)];
}
/* Median dari tabel frekuensi (banyak data ganjil) */
function lMedFrek(nilai, f) {
  const n = dJml(f), k = (n + 1) / 2, data = []; nilai.forEach((v, i) => { for (let j = 0; j < f[i]; j++) data.push(v); });
  let a = 0; const rentang = nilai.map((v, i) => { const s = `nilai ${v} → data ke-${a + 1}${f[i] > 1 ? ` sampai ke-${a + f[i]}` : ""}`; a += f[i]; return s; });
  return [`Banyak data = ${f.join(" + ")} = ${n} (ganjil), jadi median adalah data ke-(${n} + 1) : 2 = data ke-${k}.`,
    `Urutkan dari nilai terkecil: ${rentang.join("; ")}.`, `Data ke-${k} ada pada nilai ${data[k - 1]}.`, lJadi(data[k - 1])];
}
/* Peluang = banyak kejadian yang diinginkan : banyak semua kemungkinan, lalu disederhanakan */
function lPeluang(c, n, kalC, kalN) {
  const [p, q] = sed(c, n), g = c ? fpb(c, n) : n;
  return [kalN, kalC, `Peluang = banyak yang diinginkan : banyak semua = ${pc(c, n)}${g > 1 ? ` = ${pcT(p, q)} (pembilang dan penyebut dibagi ${g})` : " (sudah paling sederhana)"}.`,
    `Jadi, peluangnya <b>${pcT(p, q)}</b>.`];
}
/* Benar–salah / pilihan ganda kompleks: setiap butir punya alasan a; urutan mengikuti tampilan soal */
function lPilihan(s, butir, awal) {
  const daftar = s.pernyataan || s.opsi, pgkS = s.bentuk === "pgk";
  const akhir = "Jadi:<br>" + daftar.map(t => { const x = butir.find(y => y.t === t);
    return `${x.b ? "✔" : "✘"} ${t} — ${x.b ? (pgkS ? "dipilih" : "Benar") : (pgkS ? "tidak dipilih" : "Salah")}, karena ${x.a}`; }).join("<br>");
  s.langkah = [...awal, akhir]; return s;
}
/* Daftar mata dadu yang memenuhi keterangan (mis. "genap", "kurang dari 3", "faktor dari 6", "bilangan 7") */
const dDaduL = t => [1, 2, 3, 4, 5, 6].filter(x => { let m;
  if (/genap/.test(t)) return x % 2 === 0; if (/ganjil/.test(t)) return x % 2 === 1; if (/prima/.test(t)) return [2, 3, 5].includes(x);
  if ((m = t.match(/kurang dari (\d+)/))) return x < +m[1]; if ((m = t.match(/lebih dari (\d+)/))) return x > +m[1];
  if ((m = t.match(/faktor dari (\d+)/))) return +m[1] % x === 0; if ((m = t.match(/kelipatan (\d+)/))) return x % +m[1] === 0;
  if ((m = t.match(/paling sedikit (\d+)/))) return x >= +m[1]; if ((m = t.match(/(\d+)$/))) return x === +m[1]; return false; });
const lDadu = t => { const l = dDaduL(t); return l.length ? l.join(", ") : "tidak ada"; };
/* Banyak hari/bulan yang nilainya lebih dari x (x tidak sama dengan data mana pun) */
function dLebih(gbr) {
  const t = pilih([{ i: 3, u: "hari", f: x => `hari dengan peminjaman buku lebih dari ${x} buku` }, { i: 4, u: "bulan", f: x => `bulan dengan hasil panen lebih dari ${x} kg` }, { i: 5, u: "hari", f: x => `hari dengan pengunjung lebih dari ${x} orang` }]);
  const tm = TEMA[t.i], st = gbr ? pilih([2, 5]) : 1; let v, x;
  do { v = tm.kat.map(() => acak(gbr ? 1 : 5, gbr ? 10 : 40) * st); x = acak(Math.min(...v) + 1, Math.max(...v) - 1); } while (v.includes(x) || Math.max(...v) - Math.min(...v) < 3);
  const d = { ...tm, kolom: t.u === "hari" ? "Hari" : "Bulan", v }, c = v.filter(y => y > x);
  return isian(`${gbr ? "Perhatikan diagram batang berikut. " : `Perhatikan tabel <b>${tm.judul}</b>.${tabelHtml(d)}`}Banyak ${t.f(x)} adalah …`, c.length,
    { gambar: gbr ? svgBatang(d, st) : undefined, satuan: t.u, petunjuk: `Tandai setiap ${t.u} yang nilainya lebih dari ${x}.`, bahas: `Yang lebih dari ${x}: ${d.kat.filter((_, k) => v[k] > x).map(k => `${k} (${v[d.kat.indexOf(k)]})`).join(", ")} → ${c.length} ${t.u}.`,
      langkah: [`Baca nilai setiap ${t.u}: ${lDaftar(d.kat, v)}.`, `Tandai yang lebih dari ${x}: ${d.kat.filter((_, k) => v[k] > x).map(k => `${k} (${v[d.kat.indexOf(k)]})`).join(", ")}.`,
        `Hitung yang ditandai: ada ${c.length} ${t.u}.`, lJadi(c.length, t.u)] });
}

/* ================= Misi 1: Membaca diagram ================= */
daftarMisi("dat", "d1", "Membaca tabel & diagram", "📊", {
  1: [() => { const d = dataAcak(4, 1, 3, 20), i = acak(0, d.kat.length - 1); return isian(`Perhatikan tabel <b>${d.judul}</b>.${tabelHtml(d)}Banyak ${d.sat} pada <b>${d.kat[i]}</b> adalah …`, d.v[i], { satuan: d.sat, bahas: `Lihat baris ${d.kat[i]}: ${d.v[i]}.`,
    langkah: [`Cari baris <b>${d.kat[i]}</b> pada tabel.`, `Lihat angka pada kolom Banyak di baris itu: ${d.v[i]}.`, lJadi(d.v[i], d.sat)] }); }],
  2: [() => { const k = pilih([2, 5, 10]), d = dataAcak(4, k, 1, 6), i = acak(0, d.kat.length - 1), ik = pilih(IKON); return isian(`Perhatikan piktogram berikut. Banyak ${d.sat} pada <b>${d.kat[i]}</b> adalah …`, d.v[i], { gambar: svgPiktogram(d, k, ik), satuan: d.sat, petunjuk: `Setiap gambar mewakili ${k}.`, bahas: `${d.v[i] / k} gambar × ${k} = ${d.v[i]}.`,
    langkah: [`Cari baris <b>${d.kat[i]}</b>, lalu hitung gambarnya: ada ${d.v[i] / k} gambar ${ik}.`, `Lihat keterangan: setiap ${ik} mewakili ${k} ${d.sat}.`, `Kalikan: ${d.v[i] / k} × ${k} = ${d.v[i]}.`, lJadi(d.v[i], d.sat)] }); }],
  3: [() => { const st = pilih([1, 2, 5]), d = dataAcak(5, st, 1, 10), i = acak(0, d.kat.length - 1); return isian(`Perhatikan diagram batang berikut. Banyak ${d.sat} pada <b>${d.kat[i]}</b> adalah …`, d.v[i], { gambar: svgBatang(d, st), satuan: d.sat, petunjuk: "Tarik garis dari ujung batang ke angka di kiri.", bahas: `Batang ${d.kat[i]} menunjukkan ${d.v[i]}.`,
    langkah: [`Cari batang <b>${d.kat[i]}</b>.`, `Tarik garis lurus dari ujung atas batang ke sumbu angka di kiri (setiap garis bantu naik ${st}).`, `Garis itu menunjuk angka ${d.v[i]}.`, lJadi(d.v[i], d.sat)] }); }],
  4: [
    () => { const st = pilih([2, 5]), d = dataAcak(5, st, 1, 10), [i, j] = ambil([...d.kat.keys()], 2); return isian(`Perhatikan diagram batang. Selisih banyak ${d.sat} pada <b>${d.kat[i]}</b> dan <b>${d.kat[j]}</b> adalah …`, Math.abs(d.v[i] - d.v[j]), { gambar: svgBatang(d, st), satuan: d.sat, bahas: `${Math.max(d.v[i], d.v[j])} − ${Math.min(d.v[i], d.v[j])} = ${Math.abs(d.v[i] - d.v[j])}.`,
      langkah: [`Baca batang <b>${d.kat[i]}</b>: ${lN(d.v[i], d.sat)}.`, `Baca batang <b>${d.kat[j]}</b>: ${lN(d.v[j], d.sat)}.`, `Selisih = yang besar − yang kecil = ${Math.max(d.v[i], d.v[j])} − ${Math.min(d.v[i], d.v[j])} = ${Math.abs(d.v[i] - d.v[j])}.`, lJadi(Math.abs(d.v[i] - d.v[j]), d.sat)] }); },
    keTKA(() => { const st = pilih([2, 5]), d = dataAcak(5, st, 1, 10), b = ya(), v = b ? Math.max(...d.v) : Math.min(...d.v), k = d.kat[d.v.indexOf(v)]; return pg(`Perhatikan diagram batang. Kategori dengan nilai <b>${b ? "paling banyak" : "paling sedikit"}</b> adalah …`, k, d.kat.filter(x => x !== k), { gambar: svgBatang(d, st), bahas: `${k}: ${v} ${d.sat}.`,
      langkah: [`Baca nilai setiap batang: ${lDaftar(d.kat, d.v)}.`, `Batang yang ${b ? "paling tinggi" : "paling pendek"} bernilai ${v}, yaitu ${k}.`, `Jadi, jawabannya <b>${k}</b>.`] }); }),
  ],
  5: [
    () => { const st = pilih([2, 5]), d = dataAcak(5, st, 1, 8); return isian(`Perhatikan diagram batang. Jumlah seluruhnya adalah …`, d.v.reduce((a, b) => a + b), { gambar: svgBatang(d, st), satuan: d.sat, bahas: `${d.v.join(" + ")} = ${d.v.reduce((a, b) => a + b)}.`,
      langkah: [`Baca nilai setiap batang: ${lDaftar(d.kat, d.v)}.`, `Jumlahkan semuanya: ${lTambah(d.v)}.`, lJadi(dJml(d.v), d.sat)] }); },
    () => { const k = pilih([2, 5, 10]), d = dataAcak(4, k, 1, 6, false); return isian(`Perhatikan piktogram. Jumlah seluruhnya adalah …`, d.v.reduce((a, b) => a + b), { gambar: svgPiktogram(d, k, pilih(IKON)), satuan: d.sat, petunjuk: "Hitung semua gambar, lalu kalikan.", bahas: `${d.v.reduce((a, b) => a + b) / k} gambar × ${k} = ${d.v.reduce((a, b) => a + b)}.`,
      langkah: [`Hitung gambar pada setiap baris: ${d.kat.map((x, i) => `${x} ${d.v[i] / k}`).join(", ")}.`, `Jumlah semua gambar: ${lTambah(d.v.map(x => x / k))}.`,
        `Setiap gambar mewakili ${k}, jadi ${dJml(d.v) / k} × ${k} = ${dJml(d.v)}.`, lJadi(dJml(d.v), d.sat)] }); },
    /* Selisih terbanyak dan tersedikit pada piktogram */
    () => { const k = pilih([2, 5, 10]), d = dataAcak(4, k, 1, 6), mx = Math.max(...d.v), mn = Math.min(...d.v);
      return isian(`Perhatikan piktogram. Selisih banyak ${d.sat} pada kategori yang <b>paling banyak</b> dan yang <b>paling sedikit</b> adalah …`, mx - mn, { gambar: svgPiktogram(d, k, pilih(IKON)), satuan: d.sat, petunjuk: `Setiap gambar mewakili ${k}.`,
        bahas: `Paling banyak ${d.kat[d.v.indexOf(mx)]} = ${mx}, paling sedikit ${d.kat[d.v.indexOf(mn)]} = ${mn}. ${mx} − ${mn} = ${mx - mn}.`,
        langkah: [`Baca setiap baris (gambar × ${k}): ${d.kat.map((x, i) => `${x} ${d.v[i] / k} × ${k} = ${d.v[i]}`).join(", ")}.`, `Paling banyak ${d.kat[d.v.indexOf(mx)]} (${mx}), paling sedikit ${d.kat[d.v.indexOf(mn)]} (${mn}).`,
          `Selisih = ${mx} − ${mn} = ${mx - mn}.`, lJadi(mx - mn, d.sat)] }); },
    /* Jumlah dua kategori dari tabel */
    () => { const d = dataAcak(5, 1, 5, 40), [i, j] = ambil([...d.kat.keys()], 2);
      return isian(`Perhatikan tabel <b>${d.judul}</b>.${tabelHtml(d)}Banyak ${d.sat} pada <b>${d.kat[i]}</b> dan <b>${d.kat[j]}</b> seluruhnya adalah …`, d.v[i] + d.v[j], { satuan: d.sat, bahas: `${d.v[i]} + ${d.v[j]} = ${d.v[i] + d.v[j]}.`,
        langkah: [`Baris <b>${d.kat[i]}</b>: ${lN(d.v[i], d.sat)}.`, `Baris <b>${d.kat[j]}</b>: ${lN(d.v[j], d.sat)}.`, `Jumlahkan: ${d.v[i]} + ${d.v[j]} = ${d.v[i] + d.v[j]}.`, lJadi(d.v[i] + d.v[j], d.sat)] }); },
    /* Selisih dua titik pada diagram garis */
    () => { const t = pilih([TEMA[4], TEMA[5]]), st = pilih([5, 10]), [i, j] = ambil([...t.kat.keys()], 2).sort((a, b) => a - b); let v; do v = t.kat.map(() => acak(1, 9) * st); while (v[i] === v[j]);
      const apa = t.sat === "kg" ? "hasil panen bulan" : "pengunjung hari";
      return isian(`Perhatikan diagram garis. Selisih ${apa} <b>${t.kat[i]}</b> dan <b>${t.kat[j]}</b> adalah …`, Math.abs(v[i] - v[j]), { gambar: svgGarisD({ ...t, v }, st), satuan: t.sat, petunjuk: "Baca nilai kedua titik, lalu kurangkan.",
        bahas: `${t.kat[i]} = ${v[i]}, ${t.kat[j]} = ${v[j]}. Selisihnya ${Math.max(v[i], v[j])} − ${Math.min(v[i], v[j])} = ${Math.abs(v[i] - v[j])} ${t.sat}.`,
        langkah: [`Cari titik <b>${t.kat[i]}</b>, lalu tarik garis ke kiri: ${lN(v[i], t.sat)}.`, `Cari titik <b>${t.kat[j]}</b>: ${lN(v[j], t.sat)}.`,
          `Selisih = ${Math.max(v[i], v[j])} − ${Math.min(v[i], v[j])} = ${Math.abs(v[i] - v[j])}.`, lJadi(Math.abs(v[i] - v[j]), t.sat)] }); },
    /* Banyak hari/bulan yang lebih dari suatu nilai (tabel) */
    () => dLebih(false),
  ],
  6: [
    () => { const t = TEMA[4], st = pilih([5, 10]), v = t.kat.map(() => acak(2, 10) * st), d = { ...t, v }; const naik = v.slice(1).map((x, i) => x - v[i]), m = Math.max(...naik);
      if (m <= 0 || naik.filter(x => x === m).length > 1) return isian(`Perhatikan diagram garis. Hasil panen bulan ${t.kat[2]} adalah … kg.`, v[2], { gambar: svgGarisD(d, st), satuan: "kg", bahas: `${v[2]} kg.`,
        langkah: [`Cari titik bulan <b>${t.kat[2]}</b> pada diagram garis.`, `Tarik garis dari titik itu ke sumbu angka di kiri: ${v[2]}.`, lJadi(v[2], "kg")] });
      const i = naik.indexOf(m), j = `${t.kat[i]} ke ${t.kat[i + 1]}`; return pg(`Perhatikan diagram garis. Kenaikan hasil panen <b>paling besar</b> terjadi dari bulan …`, j, naik.map((_, k) => `${t.kat[k]} ke ${t.kat[k + 1]}`).filter(x => x !== j), { gambar: svgGarisD(d, st), petunjuk: "Cari garis yang paling curam naiknya.", bahas: `Kenaikan ${t.kat[i]} ke ${t.kat[i + 1]} = ${m} kg, paling besar.`,
        langkah: [`Baca setiap titik: ${lDaftar(t.kat, v, "kg")}.`, `Hitung perubahan setiap bulan: ${naik.map((x, k) => `${t.kat[k]} ke ${t.kat[k + 1]} ${lNaik(x)}`).join("; ")}.`,
          `Kenaikan paling besar adalah ${m} kg, dari ${t.kat[i]} ke ${t.kat[i + 1]}.`, `Jadi, jawabannya <b>${j}</b>.`] }); },
    /* Berapa kali lipat (piktogram) */
    () => { const k = pilih([2, 5, 10]); let d, i, j; do { d = dataAcak(4, k, 1, 8); i = d.v.findIndex(x => d.v.some(y => y !== x && x % y === 0)); } while (i < 0); j = d.v.findIndex(y => y !== d.v[i] && d.v[i] % y === 0);
      return isian(`Perhatikan piktogram. Banyak ${d.sat} pada <b>${d.kat[i]}</b> adalah … kali banyak ${d.sat} pada <b>${d.kat[j]}</b>.`, d.v[i] / d.v[j], { gambar: svgPiktogram(d, k, pilih(IKON)), petunjuk: "Bandingkan banyak gambarnya.",
        bahas: `${d.kat[i]} ${d.v[i] / k} gambar, ${d.kat[j]} ${d.v[j] / k} gambar. ${d.v[i] / k} : ${d.v[j] / k} = ${d.v[i] / d.v[j]}.`,
        langkah: [`Hitung gambar pada baris <b>${d.kat[i]}</b>: ${d.v[i] / k} gambar.`, `Hitung gambar pada baris <b>${d.kat[j]}</b>: ${d.v[j] / k} gambar.`,
          `Bagi: ${d.v[i] / k} : ${d.v[j] / k} = ${d.v[i] / d.v[j]} (sama dengan ${d.v[i]} : ${d.v[j]}).`, lJadi(d.v[i] / d.v[j])] }); },
    /* Hasil penjualan pada hari paling laris */
    () => { const h = pilih([2000, 2500, 3000, 4000, 5000, 6000]), o = pilih(["kue bolu", "roti isi", "nasi kuning", "jus buah"]), d = { judul: `Penjualan ${o} di kantin`, kolom: "Hari", sat: "porsi", kat: HARI.slice(0, 5), v: [] };
      while (d.v.length < 5) { const x = acak(8, 30); if (!d.v.includes(x)) d.v.push(x); } const mx = Math.max(...d.v), hr = d.kat[d.v.indexOf(mx)];
      return isian(`Perhatikan tabel <b>${d.judul}</b>.${tabelHtml(d)}Harga satu porsi ${o} ${rp(h)}. Uang hasil penjualan pada hari yang <b>paling laris</b> adalah Rp …`, mx * h,
        { petunjuk: "Cari hari dengan penjualan paling banyak, lalu kalikan dengan harganya.", bahas: `Paling laris hari ${hr}: ${mx} porsi. ${mx} × ${rp(h)} = ${rp(mx * h)}.`,
          langkah: [`Baca tabel: ${lDaftar(d.kat, d.v)}.`, `Penjualan paling banyak hari <b>${hr}</b>: ${mx} porsi.`, `Uang = ${mx} × ${rp(h)} = ${rp(mx * h)}.`, `Jadi, jawabannya <b>${rp(mx * h)}</b>.`] }); },
    /* Selisih terbanyak dan tersedikit pada diagram batang */
    () => { const st = pilih([2, 5]), d = dataAcak(5, st, 1, 10), mx = Math.max(...d.v), mn = Math.min(...d.v);
      return isian(`Perhatikan diagram batang <b>${d.judul}</b>. Berapa selisih banyak ${d.sat} pada kategori yang paling banyak dan yang paling sedikit?`, mx - mn, { gambar: svgBatang(d, st), satuan: d.sat,
        bahas: `Paling banyak ${d.kat[d.v.indexOf(mx)]} (${mx}), paling sedikit ${d.kat[d.v.indexOf(mn)]} (${mn}). ${mx} − ${mn} = ${mx - mn}.`,
        langkah: [`Baca nilai setiap batang: ${lDaftar(d.kat, d.v)}.`, `Batang tertinggi ${d.kat[d.v.indexOf(mx)]} (${mx}), batang terpendek ${d.kat[d.v.indexOf(mn)]} (${mn}).`, `Selisih = ${mx} − ${mn} = ${mx - mn}.`, lJadi(mx - mn, d.sat)] }); },
    /* Banyak hari/bulan yang lebih dari suatu nilai (diagram batang) */
    () => dLebih(true),
  ],
  7: [
    () => { const st = pilih([2, 5]); let d; do d = dataAcak(5, st, 1, 10); while (!d.v.some((x, i) => d.v.some((y, j) => i !== j && x === 2 * y))); let i, j; for (i = 0; i < 5; i++) { j = d.v.findIndex(y => d.v[i] === 2 * y); if (j >= 0) break; }
      return isian(`Perhatikan diagram batang. Banyak ${d.sat} pada <b>${d.kat[i]}</b> adalah … kali banyak ${d.sat} pada <b>${d.kat[j]}</b>.`, 2, { gambar: svgBatang(d, st), bahas: `${d.v[i]} : ${d.v[j]} = 2.`,
        langkah: [`Baca batang <b>${d.kat[i]}</b>: ${d.v[i]}.`, `Baca batang <b>${d.kat[j]}</b>: ${d.v[j]}.`, `Bagi: ${d.v[i]} : ${d.v[j]} = 2.`, lJadi(2)] }); },
    () => { const st = pilih([2, 5]); let d, tot; do { d = dataAcak(4, st, 1, 10); tot = d.v.reduce((a, b) => a + b); } while (!d.v.some(x => (x * 100) % tot === 0)); const i = d.v.findIndex(x => (x * 100) % tot === 0);
      return isian(`Perhatikan tabel <b>${d.judul}</b>.${tabelHtml(d)}Persentase ${d.sat} pada <b>${d.kat[i]}</b> dari seluruhnya adalah … %`, d.v[i] * 100 / tot, { satuan: "%", petunjuk: "Persentase = bagian : seluruhnya × 100%.", bahas: `${d.v[i]} : ${tot} × 100% = ${d.v[i] * 100 / tot}%.`,
        langkah: [`Jumlah seluruhnya: ${lTambah(d.v)}.`, `Bagian <b>${d.kat[i]}</b> = ${d.v[i]}.`, `Persentase = ${d.v[i]} : ${tot} × 100% = ${fmt(d.v[i] * 100 / tot)}%.`, lJadi(d.v[i] * 100 / tot, "%")] }); },
  ],
  8: [() => { const st = pilih([2, 5]), d = dataAcak(5, st, 1, 10), tot = d.v.reduce((a, b) => a + b), mx = Math.max(...d.v), mn = Math.min(...d.v), [i, j] = ambil([0, 1, 2, 3, 4], 2);
    const kmx = d.kat[d.v.indexOf(mx)], kmn = d.kat[d.v.indexOf(mn)], sl = Math.abs(d.v[i] - d.v[j]), slT = `${Math.max(d.v[i], d.v[j])} − ${Math.min(d.v[i], d.v[j])} = ${sl}`, B = [
      ya() ? { t: `Jumlah seluruhnya ${tot} ${d.sat}.`, b: true, a: `${lTambah(d.v)}.` } : { t: `Jumlah seluruhnya ${tot + st} ${d.sat}.`, b: false, a: `${lTambah(d.v)}, bukan ${tot + st}.` },
      { t: `${kmx} adalah yang paling banyak.`, b: true, a: `batangnya paling tinggi (${mx}).` },
      ya() ? { t: `Selisih ${d.kat[i]} dan ${d.kat[j]} adalah ${sl}.`, b: true, a: `${slT}.` } : { t: `Selisih ${d.kat[i]} dan ${d.kat[j]} adalah ${sl + st}.`, b: false, a: `${slT}, bukan ${sl + st}.` },
      { t: `${kmn} lebih banyak daripada ${kmx}.`, b: false, a: `${kmn} hanya ${mn}, sedangkan ${kmx} ${mx}.` }];
    return lPilihan(bs(`Perhatikan diagram batang <b>${d.judul}</b>. Tentukan Benar atau Salah.`, B, { gambar: svgBatang(d, st), bahas: `Data: ${d.kat.map((k, x) => `${k} ${d.v[x]}`).join(", ")}. Jumlah ${tot}.` }), B,
      [`Baca nilai setiap batang: ${lDaftar(d.kat, d.v)}.`, `Jumlah seluruhnya: ${lTambah(d.v)}.`, `Paling banyak ${kmx} (${mx}), paling sedikit ${kmn} (${mn}).`]); }],
  9: [() => { const st = pilih([2, 5]), d = dataAcak(5, st, 1, 10), i = acak(0, 4), tot = d.v.reduce((a, b) => a + b), dd = { ...d, v: d.v.map((x, k) => (k === i ? 0 : x)) };
    return isian(`Diagram batang di bawah belum lengkap: batang <b>${d.kat[i]}</b> belum digambar. Jika jumlah seluruhnya ${tot} ${d.sat}, banyak ${d.sat} pada ${d.kat[i]} adalah …`, d.v[i], { gambar: svgBatang(dd, st), satuan: d.sat, petunjuk: "Jumlahkan yang ada, lalu kurangkan dari total.", bahas: `${tot} − (${dd.v.filter(x => x).join(" + ")}) = ${d.v[i]}.`,
      langkah: [`Baca batang yang sudah ada: ${lDaftar(d.kat.filter((_, k) => k !== i), d.v.filter((_, k) => k !== i))}.`, `Jumlahkan: ${lTambah(dd.v.filter(x => x))}.`,
        `Batang ${d.kat[i]} = jumlah seluruhnya − yang sudah ada = ${tot} − ${tot - d.v[i]} = ${d.v[i]}.`, lJadi(d.v[i], d.sat)] }); }],
  10: [
    () => { const t = pilih([TEMA[0], TEMA[1], TEMA[6]]), pr = pilih([[40, 25, 20, 15], [30, 30, 25, 15], [35, 25, 25, 15], [50, 20, 20, 10], [45, 30, 15, 10], [25, 25, 30, 20]]), kat = t.kat.slice(0, 4), N = pilih([120, 160, 200, 240, 280, 320, 400]), i = acak(0, 3), j = (i + acak(1, 3)) % 4, sel = ya();
      return isian(`Diagram lingkaran menunjukkan <b>${t.judul}</b>. Jumlah seluruhnya ${N} ${t.sat}. ${sel ? `Selisih banyak ${t.sat} yang memilih ${kat[i]} dan ${kat[j]}` : `Banyak ${t.sat} yang memilih ${kat[i]}`} adalah …`, sel ? Math.abs(pr[i] - pr[j]) * N / 100 : pr[i] * N / 100,
        { gambar: svgLingkaranD(kat, pr, t.judul), satuan: t.sat, petunjuk: "Ubah persen menjadi banyak: persen × jumlah seluruhnya.", bahas: sel ? `(${Math.max(pr[i], pr[j])}% − ${Math.min(pr[i], pr[j])}%) × ${N} = ${Math.abs(pr[i] - pr[j]) * N / 100}.` : `${pr[i]}% × ${N} = ${pr[i] * N / 100}.`,
        langkah: sel ? [`Baca diagram: ${kat[i]} = ${pr[i]}%, ${kat[j]} = ${pr[j]}%.`, `Selisih persennya: ${Math.max(pr[i], pr[j])}% − ${Math.min(pr[i], pr[j])}% = ${Math.abs(pr[i] - pr[j])}%.`,
          `Ubah ke banyak ${t.sat}: ${Math.abs(pr[i] - pr[j])}% × ${N} = ${pc(Math.abs(pr[i] - pr[j]), 100)} × ${N} = ${fmt(Math.abs(pr[i] - pr[j]) * N / 100)}.`, lJadi(Math.abs(pr[i] - pr[j]) * N / 100, t.sat)]
          : [`Baca diagram: ${kat[i]} = ${pr[i]}%.`, `Jumlah seluruhnya ${N} ${t.sat}, artinya 100% = ${N}.`, `${pr[i]}% × ${N} = ${pc(pr[i], 100)} × ${N} = ${fmt(pr[i] * N / 100)}.`, lJadi(pr[i] * N / 100, t.sat)] }); },
    () => { const pr = pilih([[40, 25, 20, 15], [30, 30, 25, 15], [50, 20, 20, 10]]), t = TEMA[2], kat = t.kat.slice(0, 4), i = acak(0, 3), x = pilih([6, 9, 12, 15, 18]) * 2, N = x * 100 / pr[i];
      if (!Number.isInteger(N)) return isian(`Pada diagram lingkaran, 25% siswa = 30 siswa. Jumlah seluruh siswa …`, 120, { bahas: "30 × 4 = 120.",
        langkah: ["25% = 30 siswa.", "100% adalah 4 kali 25%, jadi seluruh siswa = 4 × 30 = 120.", lJadi(120)] });
      return isian(`Diagram lingkaran menunjukkan <b>${t.judul}</b>. Jika siswa yang ${kat[i].toLowerCase()} ada ${x} siswa, jumlah seluruh siswa adalah …`, N, { gambar: svgLingkaranD(kat, pr, t.judul), satuan: "siswa", petunjuk: `${pr[i]}% = ${x} siswa. Berapa 100%?`, bahas: `${x} : ${pr[i]}% = ${x} × 100 : ${pr[i]} = ${N} siswa.`,
        langkah: [`Baca diagram: ${kat[i]} = ${pr[i]}%.`, `Jadi ${pr[i]}% dari seluruh siswa = ${x} siswa.`, `Seluruh siswa (100%) = ${x} × 100 : ${pr[i]} = ${fmt(x * 100)} : ${pr[i]} = ${N}.`, lJadi(N, "siswa")] }); },
  ],
});

/* ================= Misi 2: Rata-rata, modus, median ================= */
const median = a => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
function modusTunggal(a) { const f = {}; a.forEach(x => (f[x] = (f[x] || 0) + 1)); const m = Math.max(...Object.values(f)), k = Object.keys(f).filter(x => f[x] === m); return k.length === 1 ? +k[0] : null; }
function dataModus(n, min, max) { let a; do a = Array.from({ length: n }, () => acak(min, max)); while (modusTunggal(a) === null); return a; }
function dataRata(n, min, max) { let a; do a = Array.from({ length: n }, () => acak(min, max)); while (a.reduce((s, x) => s + x) % n); return a; }
const frekTabel = (nilai, f, judul = "Nilai") => `<table class="tabel-data"><thead><tr><th>${judul}</th>${nilai.map(v => `<th>${v}</th>`).join("")}</tr></thead><tbody><tr><td>Banyak siswa</td>${f.map(v => `<td>${v}</td>`).join("")}</tr></tbody></table>`;
/* Frekuensi acak dengan satu nilai terbesar (modus tunggal) */
function dFrek(n, lo, hi) { let f; do f = Array.from({ length: n }, () => acak(lo, hi)); while (f.filter(x => x === Math.max(...f)).length > 1); return f; }
const dUrut = a => a.slice().sort((x, y) => x - y);
const dTurus = n => "<s>||||</s> ".repeat(Math.floor(n / 5)) + "|".repeat(n % 5);
const dTabelTurus = (nilai, f) => `<table class="tabel-data"><thead><tr><th>Nilai</th><th>Turus</th></tr></thead><tbody>${nilai.map((v, i) => `<tr><td>${v}</td><td style="letter-spacing:2px">${dTurus(f[i])}</td></tr>`).join("")}</tbody></table>`;
const dSat = s => (s ? { satuan: s } : {});
daftarMisi("dat", "d2", "Rata-rata, modus, median", "🧮", {
  1: [
    /* Modus dalam cerita */
    () => { const c = pilih([["Ukuran sepatu beberapa siswa kelas 5", 33, 38, "Ukuran sepatu yang paling banyak dipakai adalah …", ""], ["Banyak saudara kandung beberapa siswa", 1, 5, "Banyak saudara kandung yang paling sering muncul adalah …", "orang"],
        ["Umur anak-anak di taman bermain (tahun)", 6, 11, "Modus umur anak-anak itu adalah …", "tahun"], ["Banyak gol tim sepak bola sekolah di setiap pertandingan", 1, 5, "Banyak gol yang paling sering terjadi adalah …", "gol"]]), a = dataModus(acak(7, 10), c[1], c[2]), m = modusTunggal(a);
      return isian(`${c[0]}: <b>${a.join(", ")}</b>.<br>${c[3]}`, m, { ...dSat(c[4]), petunjuk: "Cari angka yang paling sering muncul.", bahas: `${m} muncul ${a.filter(x => x === m).length} kali, paling sering.`, langkah: lModus(a, c[4]) }); },
    /* Modus dari tabel turus */
    () => { const nilai = pilih([[6, 7, 8, 9], [7, 8, 9, 10], [5, 6, 7, 8, 9]]), f = dFrek(nilai.length, 1, 9), m = nilai[f.indexOf(Math.max(...f))];
      return isian(`Nilai ulangan siswa dicatat dengan turus (<s>||||</s> = 5).${dTabelTurus(nilai, f)}Modus nilai ulangan tersebut adalah …`, m, { petunjuk: "Modus = nilai yang turusnya paling banyak.", bahas: `Nilai ${m} punya ${Math.max(...f)} turus, paling banyak.`,
        langkah: [`Hitung turus setiap nilai (satu ikat <s>||||</s> = 5): ${nilai.map((v, i) => `nilai ${v} → ${f[i]}`).join("; ")}.`, `Turus paling banyak ada pada nilai ${m} (${Math.max(...f)} turus).`, lJadi(m)] }); },
    /* Rata-rata dua data dalam cerita */
    () => { const nm = nama(), c = pilih([[(a, b) => `${nm} membaca ${a} halaman buku pada hari Sabtu dan ${b} halaman pada hari Minggu. Rata-rata halaman yang dibaca setiap hari adalah …`, "halaman"],
        [(a, b) => `Ayam ${nm} bertelur ${a} butir pada minggu pertama dan ${b} butir pada minggu kedua. Rata-rata telur setiap minggu adalah …`, "butir"]]); let a, b; do { a = acak(4, 30); b = acak(4, 30); } while ((a + b) % 2 || a === b);
      return isian(c[0](a, b), (a + b) / 2, { satuan: c[1], petunjuk: "Jumlahkan, lalu bagi 2.", bahas: `(${a} + ${b}) : 2 = ${a + b} : 2 = ${(a + b) / 2}.`, langkah: lRata([a, b], c[1], c[1] === "halaman" ? "hari" : "minggu") }); },
    () => { const a = dataModus(acak(6, 9), 5, 10); return isian(`Data nilai: <b>${a.join(", ")}</b>.<br>Modus data tersebut adalah …`, modusTunggal(a), { petunjuk: "Modus = nilai yang paling sering muncul.", bahas: `${modusTunggal(a)} muncul paling sering.`, langkah: lModus(a) }); }],
  2: [
    /* Rata-rata dalam cerita */
    () => { const nm = nama(), n = acak(3, 4), c = pilih([{ t: `Banyak telur yang dikumpulkan ${nm} selama ${n} hari`, s: "butir", q: "telur setiap hari", r: [3, 15] }, { t: `Banyak ikan yang ditangkap ${nm} selama ${n} hari`, s: "ekor", q: "ikan setiap hari", r: [2, 12] },
        { t: `Banyak halaman yang dibaca ${nm} selama ${n} hari`, s: "halaman", q: "halaman setiap hari", r: [5, 25] }]), a = dataRata(n, ...c.r), r = dJml(a) / n;
      return isian(`${c.t}: ${a.join(", ")}.<br>Rata-rata ${c.q} adalah …`, r, { satuan: c.s, petunjuk: "Jumlahkan semua, lalu bagi banyak hari.", bahas: `(${a.join(" + ")}) : ${n} = ${dJml(a)} : ${n} = ${r}.`, langkah: lRata(a, c.s, "hari") }); },
    /* Jumlah data dari rata-rata */
    () => { const n = acak(3, 6), r = acak(4, 20), nm = nama(), cerita = ya(), R = cerita ? r * 5 : r;
      return isian(cerita ? `Rata-rata nilai ${n} kali ulangan ${nm} adalah ${R}. Jumlah semua nilai ulangan ${nm} adalah …` : `Rata-rata ${n} bilangan adalah ${R}. Jumlah ${n} bilangan itu adalah …`, n * R,
        { petunjuk: "Jumlah = rata-rata × banyak data.", bahas: `${R} × ${n} = ${n * R}.`,
          langkah: ["Ingat: rata-rata = jumlah : banyak data.", "Dibalik: jumlah = rata-rata × banyak data.", `Jumlah = ${R} × ${n} = ${fmt(n * R)}.`, lJadi(n * R)] }); },
    /* Rata-rata dari tabel harian */
    () => { const nm = nama(), n = acak(3, 4), c = pilih([[`Kue yang dibuat ${nm}`, "kue"], ["Botol plastik yang dikumpulkan kelas 5", "botol"], ["Bibit pohon yang ditanam warga", "bibit"], [`Gambar yang diwarnai ${nm}`, "gambar"]]), v = dataRata(n, 2, 15),
        d = { judul: c[0], kolom: "Hari", sat: c[1], kat: HARI.slice(0, n), v };
      return isian(`Perhatikan tabel <b>${c[0]}</b>.${tabelHtml(d)}Rata-rata setiap hari adalah …`, dJml(v) / n, { satuan: c[1], petunjuk: "Jumlahkan semua, lalu bagi banyak hari.", bahas: `(${v.join(" + ")}) : ${n} = ${dJml(v)} : ${n} = ${dJml(v) / n}.`, langkah: lRata(v, c[1], "hari") }); },
    () => { const n = acak(3, 5), a = dataRata(n, 2, 20); const r = a.reduce((s, x) => s + x) / n; return isian(`Rata-rata dari <b>${a.join(", ")}</b> adalah …`, r, { petunjuk: "Rata-rata = jumlah semua data : banyak data.", bahas: `(${a.join(" + ")}) : ${n} = ${a.reduce((s, x) => s + x)} : ${n} = ${r}.`, langkah: lRata(a) }); }],
  3: [
    /* Median dalam cerita (banyak data ganjil) */
    () => { const n = pilih([5, 7]), c = pilih([{ t: `Tinggi ${n} tanaman kacang (cm)`, q: "tinggi tanaman", s: "cm", r: [8, 30] }, { t: `Suhu udara siang hari selama ${n} hari (°C)`, q: "suhu udara", s: "°C", r: [25, 34] },
        { t: `Berat ${n} ekor kucing (kg)`, q: "berat kucing", s: "kg", r: [2, 7] }, { t: `Banyak buku yang dibaca ${n} siswa bulan ini`, q: "banyak buku", s: "buku", r: [1, 12] }]), a = Array.from({ length: n }, () => acak(...c.r)), m = median(a);
      return isian(`${c.t}: ${a.join(", ")}.<br>Median ${c.q} adalah …`, m, { satuan: c.s, petunjuk: "Urutkan dulu dari yang terkecil, lalu ambil yang paling tengah.", bahas: `Diurutkan: ${dUrut(a).join(", ")}. Yang paling tengah (ke-${(n + 1) / 2}) = ${m}.`, langkah: lMedian(a, c.s) }); },
    /* Selisih nilai terbesar dan terkecil */
    () => { const n = acak(5, 8), cerita = ya(); let a; do a = Array.from({ length: n }, () => (cerita ? acak(55, 100) : acak(5, 40))); while (Math.max(...a) === Math.min(...a)); const mx = Math.max(...a), mn = Math.min(...a);
      return isian(cerita ? `Nilai ulangan ${n} siswa: ${a.join(", ")}.<br>Selisih nilai tertinggi dan nilai terendah adalah …` : `Data: <b>${a.join(", ")}</b>.<br>Selisih nilai terbesar dan nilai terkecil adalah …`, mx - mn,
        { petunjuk: "Cari yang paling besar dan yang paling kecil, lalu kurangkan.", bahas: `Terbesar ${mx}, terkecil ${mn}. ${mx} − ${mn} = ${mx - mn}.`,
          langkah: [`Urutkan supaya mudah dilihat: ${dUrut(a).join(", ")}.`, `Nilai terbesar ${mx}, nilai terkecil ${mn}.`, `Selisih = ${mx} − ${mn} = ${mx - mn}.`, lJadi(mx - mn)] }); },
    /* Modus dari diagram batang */
    () => { const nilai = pilih([[6, 7, 8, 9, 10], [60, 70, 80, 90, 100], [5, 6, 7, 8, 9]]), f = dFrek(5, 1, 9), m = nilai[f.indexOf(Math.max(...f))], mapel = pilih(["IPAS", "Matematika", "Bahasa Indonesia", "Bahasa Inggris"]);
      return isian(`Diagram batang menunjukkan nilai ulangan ${mapel} siswa kelas 5. Modus nilai tersebut adalah …`, m, { gambar: svgBatang({ judul: `Nilai ulangan ${mapel}`, sat: "siswa", kat: nilai.map(String), v: f }, 1), petunjuk: "Modus = nilai yang batangnya paling tinggi.",
        bahas: `Batang tertinggi ada pada nilai ${m} (${Math.max(...f)} siswa).`,
        langkah: [`Baca tinggi setiap batang: ${nilai.map((v, i) => `nilai ${v} → ${f[i]} siswa`).join("; ")}.`, `Modus adalah nilai yang paling banyak siswanya, yaitu batang tertinggi.`, `Batang tertinggi ada pada nilai ${m} (${Math.max(...f)} siswa).`, lJadi(m)] }); },
    () => { const a = Array.from({ length: pilih([5, 7, 9]) }, () => acak(4, 30)); return isian(`Median dari data <b>${a.join(", ")}</b> adalah …`, median(a), { petunjuk: "Urutkan dulu, lalu ambil nilai paling tengah.", bahas: `Diurutkan: ${a.slice().sort((x, y) => x - y).join(", ")}. Median = ${median(a)}.`, langkah: lMedian(a) }); }],
  4: [
    /* Median dalam cerita (banyak data genap) */
    () => { const n = pilih([6, 8]), c = pilih([{ t: `Berat badan ${n} siswa (kg)`, q: "berat badan", s: "kg", r: [24, 40] }, { t: `Panjang ${n} pita (cm)`, q: "panjang pita", s: "cm", r: [10, 50] },
        { t: `Banyak kelereng milik ${n} anak`, q: "banyak kelereng", s: "kelereng", r: [3, 25] }, { t: `Suhu udara pagi hari selama ${n} hari (°C)`, q: "suhu udara", s: "°C", r: [20, 28] }]), a = Array.from({ length: n }, () => acak(...c.r)), u = dUrut(a), m = median(a);
      return isian(`${c.t}: ${a.join(", ")}.<br>Median ${c.q} adalah …`, m, { satuan: c.s, petunjuk: "Banyak data genap: urutkan, lalu ambil rata-rata dua nilai tengah.", bahas: `Diurutkan: ${u.join(", ")}. Dua nilai tengah ${u[n / 2 - 1]} dan ${u[n / 2]}. Median = (${u[n / 2 - 1]} + ${u[n / 2]}) : 2 = ${fmt(m)}.`, langkah: lMedian(a, c.s) }); },
    /* Banyak data dari jumlah dan rata-rata */
    () => { const r = acak(5, 20), n = acak(3, 9), nm = nama(), cerita = ya(), R = cerita ? r * 5 : r;
      return isian(cerita ? `Jumlah nilai semua ulangan ${nm} adalah ${n * R}, dan rata-ratanya ${R}. Banyak ulangan yang diikuti ${nm} adalah …` : `Jumlah beberapa bilangan adalah ${n * R}. Rata-rata bilangan-bilangan itu ${R}. Banyak bilangannya adalah …`, n,
        { ...dSat(cerita ? "kali" : ""), petunjuk: "Banyak data = jumlah : rata-rata.", bahas: `${n * R} : ${R} = ${n}.`,
          langkah: ["Ingat: rata-rata = jumlah : banyak data.", "Dibalik: banyak data = jumlah : rata-rata.", `Banyak data = ${fmt(n * R)} : ${R} = ${n}.`, lJadi(n, cerita ? "kali" : "")] }); },
    /* Rata-rata dari diagram batang */
    () => { const t = pilih([TEMA[3], TEMA[4], TEMA[5]]), st = pilih([2, 5]); let v; do v = t.kat.map(() => acak(1, 10) * st); while (dJml(v) % v.length); const r = dJml(v) / v.length, per = t === TEMA[4] ? "bulan" : "hari";
      return isian(`Diagram batang menunjukkan <b>${t.judul[0].toLowerCase() + t.judul.slice(1)}</b>. Rata-rata setiap ${per} adalah …`, r, { gambar: svgBatang({ ...t, v }, st), satuan: t.sat, petunjuk: `Jumlahkan semua batang, lalu bagi banyak ${per}.`, bahas: `(${v.join(" + ")}) : ${v.length} = ${dJml(v)} : ${v.length} = ${r}.`,
        langkah: [`Baca setiap batang: ${lDaftar(t.kat, v)}.`, ...lRata(v, t.sat, per)] }); },
    () => { const a = Array.from({ length: pilih([6, 8, 10]) }, () => acak(4, 30)); return isian(`Median dari data <b>${a.join(", ")}</b> adalah …`, median(a), { petunjuk: "Banyak data genap: rata-rata dua nilai tengah.", bahas: `Diurutkan: ${a.slice().sort((x, y) => x - y).join(", ")}. Median = ${fmt(median(a))}.`, langkah: lMedian(a) }); }],
  5: [
    () => { const nilai = [6, 7, 8, 9, 10].slice(0, acak(4, 5)); let f; do f = nilai.map(() => acak(1, 9)); while (f.filter(x => x === Math.max(...f)).length > 1); const m = nilai[f.indexOf(Math.max(...f))];
      return isian(`Perhatikan tabel nilai ulangan berikut.${frekTabel(nilai, f)}Modus data tersebut adalah …`, m, { petunjuk: "Cari nilai dengan banyak siswa terbesar.", bahas: `Nilai ${m} dimiliki ${Math.max(...f)} siswa (paling banyak).`,
        langkah: [`Baca tabel: ${nilai.map((v, i) => `nilai ${v} → ${f[i]} siswa`).join("; ")}.`, `Banyak siswa terbesar adalah ${Math.max(...f)}, pada nilai ${m}.`, lJadi(m)] }); },
    () => { const nilai = [5, 6, 7, 8, 9, 10].slice(0, 4).map(x => x + acak(0, 1) * 0); let f, t, n; do { f = nilai.map(() => acak(1, 6)); n = f.reduce((a, b) => a + b); t = f.reduce((s, x, i) => s + x * nilai[i], 0); } while (t % n);
      return isian(`Perhatikan tabel nilai berikut.${frekTabel(nilai, f)}Rata-rata nilainya adalah …`, t / n, { petunjuk: "Kalikan setiap nilai dengan banyak siswanya, jumlahkan, lalu bagi banyak siswa.", bahas: `Jumlah nilai ${t}, banyak siswa ${n}. Rata-rata ${t} : ${n} = ${t / n}.`,
        langkah: [`Kalikan setiap nilai dengan banyak siswanya: ${nilai.map((v, i) => `${v} × ${f[i]} = ${v * f[i]}`).join("; ")}.`, `Jumlah semua nilai: ${lTambah(nilai.map((v, i) => v * f[i]))}.`,
          `Banyak siswa: ${lTambah(f)}.`, `Rata-rata = ${t} : ${n} = ${fmt(t / n)}.`, lJadi(t / n)] }); },
    /* Data yang belum diketahui dari rata-rata */
    () => { const n = acak(3, 5), nm = nama(), cerita = ya(); let a, r, x;
      do { r = cerita ? acak(70, 90) : acak(8, 20); a = Array.from({ length: n - 1 }, () => (cerita ? acak(60, 100) : acak(3, 30))); x = n * r - dJml(a); } while (cerita ? x < 50 || x > 100 : x < 1 || x > 40);
      return isian(cerita ? `Rata-rata nilai ${n} kali ulangan ${nm} adalah ${r}. Nilai ${n - 1} ulangan pertamanya: ${a.join(", ")}. Nilai ulangan terakhir ${nm} adalah …` : `Rata-rata ${n} bilangan adalah ${r}. Sebanyak ${n - 1} bilangan di antaranya adalah ${a.join(", ")}. Bilangan yang lain adalah …`, x,
        { petunjuk: "Jumlah semua = rata-rata × banyak data. Kurangkan yang sudah diketahui.", bahas: `Jumlah semua ${n} × ${r} = ${n * r}. ${n * r} − (${a.join(" + ")}) = ${n * r} − ${dJml(a)} = ${x}.`,
        langkah: [`Jumlah semua ${n} data = rata-rata × banyak data = ${r} × ${n} = ${n * r}.`, `Jumlah yang sudah diketahui: ${lTambah(a)}.`, `Data yang dicari = ${n * r} − ${dJml(a)} = ${x}.`, lJadi(x)] }); },
    /* Median dari tabel frekuensi kecil */
    () => { const nilai = pilih([[6, 7, 8, 9], [7, 8, 9, 10], [5, 6, 7, 8, 9]]), mapel = pilih(["IPAS", "Matematika", "Bahasa Indonesia", "Bahasa Inggris"]); let f, n; do { f = nilai.map(() => acak(1, 4)); n = dJml(f); } while (n % 2 === 0);
      const data = []; nilai.forEach((v, i) => { for (let k = 0; k < f[i]; k++) data.push(v); }); const me = median(data);
      return isian(`Tabel berikut menunjukkan nilai ulangan ${mapel} beberapa siswa.${frekTabel(nilai, f)}Median nilai tersebut adalah …`, me, { petunjuk: `Ada ${n} siswa. Median adalah data ke-${(n + 1) / 2} setelah diurutkan.`, bahas: `Diurutkan: ${data.join(", ")}. Data ke-${(n + 1) / 2} = ${me}.`, langkah: lMedFrek(nilai, f) }); },
    /* Rata-rata suhu dari tabel */
    () => { const n = pilih([4, 5]), kota = pilih(["Bandung", "Malang", "Bogor", "Medan", "Makassar", "Kupang"]); let v; do v = Array.from({ length: n }, () => acak(24, 34)); while (dJml(v) % n);
      const tb = `<table class="tabel-data"><thead><tr><th>Hari</th>${HARI.slice(0, n).map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody><tr><td>Suhu (°C)</td>${v.map(x => `<td>${x}</td>`).join("")}</tr></tbody></table>`;
      return isian(`Tabel berikut menunjukkan suhu udara siang hari di kota ${kota} selama ${n} hari.${tb}Rata-rata suhu udaranya adalah …`, dJml(v) / n, { satuan: "°C", petunjuk: "Jumlahkan semua suhu, lalu bagi banyak hari.", bahas: `(${v.join(" + ")}) : ${n} = ${dJml(v)} : ${n} = ${dJml(v) / n} °C.`, langkah: lRata(v, "°C", "hari") }); },
  ],
  6: [
    () => { const n = acak(4, 6), x = nama(); let a; do a = Array.from({ length: n }, () => acak(60, 100)); while ((a.reduce((s, v) => s + v) * 10) % n); const r = a.reduce((s, v) => s + v) / n;
      return isian(`Nilai ulangan matematika ${x}: ${a.join(", ")}. Rata-rata nilai ${x} adalah …`, r, { bahas: `${a.reduce((s, v) => s + v)} : ${n} = ${fmt(r)}.`, langkah: lRata(a, "", "nilai") }); },
    () => { const a = dataRata(5, 128, 150), r = a.reduce((s, x) => s + x) / 5; return isian(`Tinggi badan 5 siswa (dalam cm): ${a.join(", ")}. Rata-rata tinggi badan mereka adalah … cm.`, r, { satuan: "cm", bahas: `${a.reduce((s, x) => s + x)} : 5 = ${r} cm.`, langkah: lRata(a, "cm", "siswa") }); },
  ],
  7: [() => { const n = acak(3, 5), r0 = acak(70, 85), r1 = r0 + acak(1, 4), x = (n + 1) * r1 - n * r0, nm = nama(); if (x > 100) return isian(`Rata-rata 4 ulangan 80. Agar rata-rata 5 ulangan menjadi 82, nilai ulangan ke-5 harus …`, 90, { bahas: "5 × 82 − 4 × 80 = 410 − 320 = 90.",
      langkah: ["Jumlah nilai 4 ulangan = 4 × 80 = 320.", "Jumlah nilai 5 ulangan yang diinginkan = 5 × 82 = 410.", "Nilai ulangan ke-5 = 410 − 320 = 90.", lJadi(90)] });
    return isian(`Rata-rata ${n} nilai ulangan ${nm} adalah ${r0}. Agar rata-ratanya menjadi ${r1} setelah ulangan berikutnya, nilai ulangan ke-${n + 1} harus …`, x, { petunjuk: "Jumlah nilai baru − jumlah nilai lama.", bahas: `${n + 1} × ${r1} − ${n} × ${r0} = ${(n + 1) * r1} − ${n * r0} = ${x}.`,
      langkah: [`Jumlah nilai ${n} ulangan sekarang = ${n} × ${r0} = ${n * r0}.`, `Jumlah nilai ${n + 1} ulangan yang diinginkan = ${n + 1} × ${r1} = ${(n + 1) * r1}.`, `Nilai ulangan ke-${n + 1} = ${(n + 1) * r1} − ${n * r0} = ${x}.`, lJadi(x)] }); }],
  8: [
    () => { const a = acak(10, 25), b = acak(8, 20), ra = acak(70, 85), rb = acak(70, 90); const t = a * ra + b * rb; if ((t * 10) % (a + b)) return isian(`Rata-rata 20 siswa 75, rata-rata 10 siswa 84. Rata-rata gabungan …`, 78, { bahas: "(1500 + 840) : 30 = 78.",
        langkah: [`Jumlah nilai 20 siswa = 20 × 75 = ${fmt(1500)}.`, "Jumlah nilai 10 siswa = 10 × 84 = 840.", `Jumlah semua = ${fmt(1500)} + 840 = ${fmt(2340)}, banyak siswa = 20 + 10 = 30.`, `Rata-rata gabungan = ${fmt(2340)} : 30 = 78.`, lJadi(78)] });
      return isian(`Rata-rata nilai ${a} siswa putra adalah ${ra} dan rata-rata nilai ${b} siswa putri adalah ${rb}. Rata-rata nilai seluruh siswa adalah …`, t / (a + b), { petunjuk: "Cari jumlah nilai setiap kelompok, lalu bagi banyak semua siswa.", bahas: `(${a} × ${ra} + ${b} × ${rb}) : ${a + b} = ${t} : ${a + b} = ${fmt(t / (a + b))}.`,
        langkah: [`Jumlah nilai siswa putra = ${a} × ${ra} = ${fmt(a * ra)}.`, `Jumlah nilai siswa putri = ${b} × ${rb} = ${fmt(b * rb)}.`, `Jumlah semua = ${fmt(a * ra)} + ${fmt(b * rb)} = ${fmt(t)}, banyak siswa = ${a} + ${b} = ${a + b}.`,
          `Rata-rata = ${fmt(t)} : ${a + b} = ${fmt(t / (a + b))}.`, lJadi(t / (a + b))] }); },
    () => { const a = dataModus(7, 5, 10), r = bulat(a.reduce((s, x) => s + x) / 7, 2), m = median(a), mo = modusTunggal(a);
      const J = dJml(a), pas = J % 7 === 0, rT = `${J} : 7 = ${pas ? fmt(r) : "kira-kira " + fmt(r)}`, mx = Math.max(...a), mn = Math.min(...a), B = [
        { t: `Modusnya ${mo}.`, b: true, a: `${mo} muncul paling sering (${a.filter(x => x === mo).length} kali).` },
        ya() ? { t: `Mediannya ${m}.`, b: true, a: `data ke-4 setelah diurutkan adalah ${m}.` } : { t: `Mediannya ${a[3]}.`, b: a[3] === m, a: `data ke-4 setelah diurutkan adalah ${m}${a[3] === m ? "" : ", bukan " + a[3]}.` },
        { t: `Nilai terbesar dikurangi nilai terkecil adalah ${mx - mn}.`, b: true, a: `${mx} − ${mn} = ${mx - mn}.` },
        { t: `Rata-ratanya lebih dari ${Math.floor(r) + 1}.`, b: r > Math.floor(r) + 1, a: `rata-ratanya ${rT}, tidak lebih dari ${Math.floor(r) + 1}.` }];
      return lPilihan(bs(`Data: <b>${a.join(", ")}</b>. Tentukan Benar atau Salah.`, B,
        { bahas: `Urut: ${a.slice().sort((x, y) => x - y).join(", ")}. Modus ${mo}, median ${m}, rata-rata ${fmt(r)}.` }), B,
        [`Urutkan data: ${dUrut(a).map((x, i) => (i === 3 ? `<b>${x}</b>` : x)).join(", ")}. Ada 7 data, jadi median = data ke-4 = ${m}.`, `Modus = nilai yang paling sering muncul = ${mo}.`, `Rata-rata: jumlah semua data = ${lTambah(a)}, lalu dibagi 7: ${rT}.`]); },
    /* Rata-rata setelah data ditambah */
    () => { const c = pilih([{ b: "berat", o: "karung beras", s: "kg", r: [20, 40] }, { b: "tinggi", o: "pohon mangga muda", s: "cm", r: [60, 120] }, { b: "panjang", o: "pita", s: "cm", r: [30, 80] }, { b: "berat", o: "semangka", s: "kg", r: [4, 9] }, { b: "banyak isi", o: "kotak pensil", s: "pensil", r: [10, 24] }]);
      let n, m, d, naik, x, r; do { n = acak(4, 8); m = acak(1, 2); d = acak(1, 3); naik = ya(); r = acak(...c.r); x = r + (naik ? 1 : -1) * d * (n + m) / m; } while (!Number.isInteger(x) || x < 1);
      const r1 = r + (naik ? d : -d);
      return isian(`Rata-rata ${c.b} ${n} ${c.o} adalah ${r} ${c.s}. Kemudian ditambah ${m} ${c.o} lagi yang ${c.b}nya ${m > 1 ? "masing-masing " : ""}${x} ${c.s}. Rata-rata ${c.b} semua ${c.o} sekarang adalah …`, r1,
        { satuan: c.s, petunjuk: "Hitung jumlah lama, tambahkan yang baru, lalu bagi banyak data yang baru.", bahas: `Jumlah lama ${n} × ${r} = ${n * r}. Jumlah baru ${n * r} + ${m} × ${x} = ${n * r + m * x}. Rata-rata ${n * r + m * x} : ${n + m} = ${r1} ${c.s}.`,
        langkah: [`Jumlah ${c.b} ${n} ${c.o} lama = ${n} × ${r} = ${fmt(n * r)}.`, `Tambahan ${m} ${c.o}: ${m} × ${x} = ${fmt(m * x)}.`, `Jumlah baru = ${fmt(n * r)} + ${fmt(m * x)} = ${fmt(n * r + m * x)}, banyaknya sekarang ${n} + ${m} = ${n + m}.`,
          `Rata-rata baru = ${fmt(n * r + m * x)} : ${n + m} = ${fmt(r1)}.`, lJadi(r1, c.s)] }); },
    /* Median dari diagram batang */
    () => { const nilai = pilih([[5, 6, 7, 8, 9], [6, 7, 8, 9, 10], [60, 70, 80, 90, 100], [65, 70, 75, 80, 85]]); let f, n; do { f = nilai.map(() => acak(1, 8)); n = f.reduce((a, b) => a + b); } while (n % 2 === 0 || f.filter(x => x === Math.max(...f)).length > 1);
      const data = []; nilai.forEach((v, i) => { for (let k = 0; k < f[i]; k++) data.push(v); }); const me = median(data), mo = nilai[f.indexOf(Math.max(...f))], mapel = pilih(["IPAS", "Matematika", "Bahasa Indonesia", "Bahasa Inggris"]);
      return pg(`Diagram batang menunjukkan nilai ulangan ${mapel} siswa kelas 6. Median data tersebut adalah …`, me, [mo, nilai[2], ...nilai], { gambar: svgBatang({ judul: `Nilai ulangan ${mapel}`, sat: "siswa", kat: nilai.map(String), v: f }, 1), petunjuk: `Banyak siswa ${n}. Median adalah data ke-${(n + 1) / 2} setelah diurutkan.`,
        bahas: `Banyak siswa ${f.join(" + ")} = ${n}. Data ke-${(n + 1) / 2} jatuh pada nilai ${me}.${mo !== me ? ` (Modusnya ${mo}, jangan tertukar.)` : ""}`,
        langkah: [`Baca tinggi setiap batang: ${nilai.map((v, i) => `nilai ${v} → ${f[i]} siswa`).join("; ")}.`, ...lMedFrek(nilai, f).slice(0, 3),
          `Jadi, jawabannya <b>${me}</b>.${mo !== me ? ` (Modusnya ${mo}, jangan tertukar.)` : ""}`] }); },
    /* Membandingkan rata-rata dua kelompok */
    () => { const c = pilih([{ o: "botol plastik yang dikumpulkan", s: "botol" }, { o: "skor lempar bola", s: "poin" }, { o: "buku yang dibaca bulan ini", s: "buku" }, { o: "ikan yang ditangkap", s: "ekor" }]), [p, q] = ambil(["Regu Elang", "Regu Merpati", "Regu Kenari", "Regu Rajawali", "Regu Garuda"], 2);
      let A, B, ra, rb; do { A = dataRata(acak(3, 4), 5, 30); B = dataRata(A.length + acak(1, 2), 5, 30); ra = A.reduce((s, x) => s + x) / A.length; rb = B.reduce((s, x) => s + x) / B.length; } while (ra === rb);
      const [hi, lo] = ra > rb ? [p, q] : [q, p], sel = Math.abs(ra - rb), sJ = Math.abs(A.reduce((s, x) => s + x) - B.reduce((s, x) => s + x)), t = (r, k) => `${r}, rata-ratanya lebih besar ${k} ${c.s}`;
      return pg(`Data ${c.o}:<br>${p}: ${A.join(", ")}<br>${q}: ${B.join(", ")}<br>Pernyataan yang benar adalah …`, t(hi, sel), [t(lo, sel), t(hi, sel + 1), t(hi, sJ), t(lo, sJ), t(hi, sel + 2)],
        { petunjuk: "Banyak anggota regu berbeda, jadi bandingkan rata-ratanya, bukan jumlahnya.", bahas: `${p}: ${A.reduce((s, x) => s + x)} : ${A.length} = ${ra}. ${q}: ${B.reduce((s, x) => s + x)} : ${B.length} = ${rb}. ${hi} lebih besar ${ra > rb ? ra - rb : rb - ra}.`,
        langkah: [`Rata-rata ${p}: (${lTambah(A)}) : ${A.length} = ${dJml(A)} : ${A.length} = ${ra}.`, `Rata-rata ${q}: (${lTambah(B)}) : ${B.length} = ${dJml(B)} : ${B.length} = ${rb}.`,
          `Bandingkan: ${hi} lebih besar, selisihnya ${Math.max(ra, rb)} − ${Math.min(ra, rb)} = ${sel} ${c.s}.`, `Jadi, jawabannya <b>${t(hi, sel)}</b>.`] }); },
  ],
  9: [() => { const nilai = [5, 6, 7, 8, 9]; let f, n; do { f = nilai.map(() => acak(1, 7)); n = f.reduce((a, b) => a + b); } while (n % 2 === 0); const data = []; nilai.forEach((v, i) => { for (let k = 0; k < f[i]; k++) data.push(v); });
    return isian(`Perhatikan tabel nilai berikut.${frekTabel(nilai, f)}Median data tersebut adalah …`, median(data), { petunjuk: `Banyak data ${n}. Data ke berapa yang di tengah?`, bahas: `Data ke-${(n + 1) / 2} (setelah diurutkan) = ${median(data)}.`, langkah: lMedFrek(nilai, f) }); },
    /* Frekuensi yang hilang dari rata-rata */
    () => { const nilai = pilih([[5, 6, 7, 8, 9], [6, 7, 8, 9, 10], [4, 5, 6, 7, 8]]); let f, n, t; do { f = nilai.map(() => acak(1, 8)); n = f.reduce((a, b) => a + b); t = f.reduce((s, x, i) => s + x * nilai[i], 0); } while (t % n);
      const r = t / n, k = pilih([...nilai.keys()].filter(i => nilai[i] !== r));
      return isian(`Perhatikan tabel nilai berikut. Satu isian tabel terhapus.${frekTabel(nilai, f.map((x, i) => (i === k ? "<b>?</b>" : x)))}Jika rata-rata nilai seluruh siswa ${r}, banyak siswa yang mendapat nilai ${nilai[k]} adalah …`, f[k],
        { satuan: "siswa", petunjuk: "Coba tebak banyak siswanya, lalu periksa: jumlah nilai : banyak siswa harus sama dengan rata-rata.", bahas: `Jika banyaknya ${f[k]}, jumlah nilai = ${f.map((x, i) => `${nilai[i]} × ${x}`).join(" + ")} = ${t} dan banyak siswa ${n}. ${t} : ${n} = ${r} ✔. Banyak siswa yang lain akan memberi rata-rata yang bukan ${r}.`,
        langkah: (() => { const tanda = x => (x > 0 ? "+" + fmt(x) : x < 0 ? "−" + fmt(-x) : "0"), S = f.reduce((s, x, i) => (i === k ? s : s + x * (nilai[i] - r)), 0), dk = nilai[k] - r;
          return [`Bandingkan setiap nilai dengan rata-rata ${r}: nilai yang lebih memberi kelebihan (+), nilai yang kurang memberi kekurangan (−). Totalnya harus 0.`,
            `Siswa yang diketahui: ${nilai.map((v, i) => (i === k ? null : `nilai ${v}: ${f[i]} × (${tanda(v - r)}) = ${tanda(f[i] * (v - r))}`)).filter(Boolean).join("; ")}. Totalnya ${tanda(S)}.`,
            `Nilai ${nilai[k]} ${dk > 0 ? "lebih" : "kurang"} ${Math.abs(dk)} dari ${r}. Supaya totalnya 0: banyak siswa × ${Math.abs(dk)} = ${Math.abs(S)}, jadi banyak siswa = ${Math.abs(S)} : ${Math.abs(dk)} = ${f[k]}.`,
            `Cek: jumlah nilai ${fmt(t)} : ${n} siswa = ${r} ✔.`, lJadi(f[k], "siswa")]; })() }); },
    /* Banyak anggota kelompok dari rata-rata gabungan */
    () => { const R = acak(72, 85), a = acak(1, 5); let b; do b = acak(1, 5); while (b === a); const g = fpb(a, b), u = b / g, w = a / g; let tt; do tt = acak(1, 12); while (u * tt < 8 || w * tt < 8 || u * tt > 40 || w * tt > 40);
      const atas = ya(), [k1, k2] = ambil(["6A", "6B", "6C", "6D"], 2), n1 = u * tt, n2 = w * tt, r1 = atas ? R + a : R - a, r2 = atas ? R - b : R + b;
      return isian(`Rata-rata nilai ${n1} siswa kelas ${k1} adalah ${r1}. Rata-rata nilai siswa kelas ${k2} adalah ${r2}. Jika rata-rata nilai gabungan kedua kelas ${R}, banyak siswa kelas ${k2} adalah …`, n2,
        { satuan: "siswa", petunjuk: `Bandingkan setiap rata-rata kelas dengan rata-rata gabungan ${R}.`, bahas: `Kelas ${k1} ${atas ? "lebih" : "kurang"} ${a} dari ${R}: ${n1} × ${a} = ${n1 * a}. Kelas ${k2} ${atas ? "kurang" : "lebih"} ${b} dari ${R}, jadi banyak siswanya × ${b} juga harus ${n1 * a}: ${n1 * a} : ${b} = ${n2} siswa. Cek: (${n1} × ${r1} + ${n2} × ${r2}) : ${n1 + n2} = ${R}.`,
        langkah: [`Kelas ${k1}: rata-rata ${r1}, ${atas ? "lebih" : "kurang"} ${a} dari rata-rata gabungan ${R}. Totalnya ${atas ? "kelebihan" : "kekurangan"} ${n1} × ${a} = ${n1 * a}.`,
          `Kelas ${k2}: rata-rata ${r2}, ${atas ? "kurang" : "lebih"} ${b} dari ${R}. Supaya seimbang, banyak siswa ${k2} × ${b} harus = ${n1 * a}.`,
          `Banyak siswa ${k2} = ${n1 * a} : ${b} = ${n2}.`, `Cek: (${n1} × ${r1} + ${n2} × ${r2}) : ${n1 + n2} = ${fmt(n1 * r1 + n2 * r2)} : ${n1 + n2} = ${R} ✔.`, lJadi(n2, "siswa")] }); },
    /* Berapa tambahan data agar menjadi modus */
    () => { const nilai = pilih([[6, 7, 8, 9, 10], [60, 70, 80, 90, 100], [5, 6, 7, 8, 9]]); let f; do f = nilai.map(() => acak(1, 9)); while (f.filter(x => x === Math.max(...f)).length > 1); const mx = Math.max(...f), k = pilih([...nilai.keys()].filter(i => f[i] < mx)), X = nilai[k], jaw = mx - f[k] + 1;
      return isian(`Diagram batang menunjukkan nilai ulangan siswa kelas 6. Beberapa siswa ikut ulangan susulan dan semuanya mendapat nilai ${X}. Paling sedikit berapa siswa susulan agar modus data menjadi ${X} saja?`, jaw,
        { gambar: svgBatang({ judul: "Nilai ulangan kelas 6", sat: "siswa", kat: nilai.map(String), v: f }, 1), satuan: "siswa", petunjuk: "Banyak siswa bernilai itu harus lebih banyak daripada yang sekarang paling banyak.", bahas: `Sekarang modusnya ${nilai[f.indexOf(mx)]} (${mx} siswa). Nilai ${X} baru ${f[k]} siswa. Agar lebih dari ${mx}, perlu ${mx + 1} − ${f[k]} = ${jaw} siswa lagi.`,
        langkah: [`Baca tinggi setiap batang: ${nilai.map((v, i) => `nilai ${v} → ${f[i]} siswa`).join("; ")}.`, `Sekarang modusnya ${nilai[f.indexOf(mx)]} dengan ${mx} siswa.`,
          `Agar nilai ${X} menjadi modus satu-satunya, banyak siswanya harus lebih dari ${mx}, paling sedikit ${mx + 1}.`, `Nilai ${X} sudah ada ${f[k]} siswa, jadi perlu ${mx + 1} − ${f[k]} = ${jaw} siswa lagi.`, lJadi(jaw, "siswa")] }); },
  ],
  10: [
    () => { const n = acak(10, 30), r0 = acak(65, 80), r1 = r0 + 1, x = (n + 1) * r1 - n * r0; return isian(`Rata-rata nilai ${n} siswa adalah ${r0}. Setelah satu siswa baru ikut ulangan, rata-ratanya menjadi ${r1}. Nilai siswa baru itu adalah …`, x, { petunjuk: "Jumlah nilai sesudah − jumlah nilai sebelum.", bahas: `${n + 1} × ${r1} − ${n} × ${r0} = ${(n + 1) * r1} − ${n * r0} = ${x}.`,
      langkah: [`Jumlah nilai ${n} siswa sebelum = ${n} × ${r0} = ${fmt(n * r0)}.`, `Jumlah nilai ${n + 1} siswa sesudah = ${n + 1} × ${r1} = ${fmt((n + 1) * r1)}.`, `Nilai siswa baru = selisihnya = ${fmt((n + 1) * r1)} − ${fmt(n * r0)} = ${x}.`, lJadi(x)] }); },
    () => { const n = acak(5, 9), r0 = acak(12, 30), r1 = r0 - acak(1, 3), x = n * r0 - (n - 1) * r1; return isian(`Rata-rata ${n} bilangan adalah ${r0}. Jika satu bilangan dikeluarkan, rata-ratanya menjadi ${r1}. Bilangan yang dikeluarkan adalah …`, x, { bahas: `${n} × ${r0} − ${n - 1} × ${r1} = ${n * r0} − ${(n - 1) * r1} = ${x}.`,
      langkah: [`Jumlah ${n} bilangan = ${n} × ${r0} = ${n * r0}.`, `Setelah satu dikeluarkan, jumlah ${n - 1} bilangan = ${n - 1} × ${r1} = ${(n - 1) * r1}.`, `Bilangan yang dikeluarkan = ${n * r0} − ${(n - 1) * r1} = ${x}.`, lJadi(x)] }); },
    /* Median setelah mencari data yang hilang dari rata-rata */
    () => { const n = pilih([5, 7]); let a, r, k, j; do { a = Array.from({ length: n - 1 }, () => acak(4, 20)); r = acak(8, 16); j = a.reduce((s, x) => s + x); k = n * r - j; } while (k < 1 || k > 30 || a.includes(k));
      const data = [...a, k], me = median(data);
      return isian(`Data: ${a.join(", ")}, <i>x</i>.<br>Rata-rata data tersebut ${r}. Median data tersebut adalah …`, me,
        { petunjuk: "Cari dulu nilai x dari jumlah semua data, lalu urutkan.", bahas: `Jumlah semua data = ${n} × ${r} = ${n * r}, jadi x = ${n * r} − ${j} = ${k}. Diurutkan: ${data.slice().sort((p, q) => p - q).join(", ")}. Median = ${me}.`,
        langkah: [`Jumlah semua data = rata-rata × banyak data = ${r} × ${n} = ${n * r}.`, `Jumlah data yang diketahui: ${lTambah(a)}. Jadi <i>x</i> = ${n * r} − ${j} = ${k}.`, ...lMedian(data)] }); },
    /* Rata-rata setelah salah catat diperbaiki */
    () => { let n, q, dl, b, a, r; do { n = pilih([5, 6, 8, 10, 12, 15, 20]); q = pilih([0.5, 1, 1.5, 2, 2.5]); dl = n * q; b = acak(55, 100); r = acak(68, 85); } while (!Number.isInteger(dl) || dl > 40 || b - dl < 20);
      const naik = ya(), [salah, benar] = naik ? [b - dl, b] : [b, b - dl], r1 = naik ? r + q : r - q, nm = nama();
      return isian(`Rata-rata nilai ${n} siswa tercatat ${r}. Ternyata nilai ${nm} salah ditulis ${salah}, seharusnya ${benar}. Rata-rata nilai yang benar adalah …`, r1,
        { petunjuk: "Perbaiki dulu jumlah semua nilai, lalu bagi lagi dengan banyak siswa.", bahas: `Jumlah tercatat ${n} × ${r} = ${n * r}. Jumlah benar ${n * r} ${naik ? "+" : "−"} ${dl} = ${n * r + (naik ? dl : -dl)}. Rata-rata ${n * r + (naik ? dl : -dl)} : ${n} = ${fmt(r1)}.`,
        langkah: [`Jumlah nilai yang tercatat = ${n} × ${r} = ${fmt(n * r)}.`, `Nilai ${nm} seharusnya ${benar}, bukan ${salah}: jumlahnya harus ${naik ? "ditambah" : "dikurangi"} ${Math.max(benar, salah)} − ${Math.min(benar, salah)} = ${dl}.`,
          `Jumlah yang benar = ${fmt(n * r)} ${naik ? "+" : "−"} ${dl} = ${fmt(n * r + (naik ? dl : -dl))}.`, `Rata-rata yang benar = ${fmt(n * r + (naik ? dl : -dl))} : ${n} = ${fmt(r1)}.`, lJadi(r1)] }); },
    /* Rata-rata gabungan dengan perbandingan banyak anggota */
    () => { let p, q, r1, r2, R; do { [p, q] = pilih([[1, 2], [2, 1], [2, 3], [3, 2], [1, 3], [3, 1], [3, 4], [4, 3], [1, 4], [4, 1], [3, 5], [5, 3]]); r1 = acak(130, 150); r2 = acak(130, 150); R = (p * r1 + q * r2) / (p + q); } while (r1 === r2 || !Number.isInteger(R * 2));
      return isian(`Perbandingan banyak siswa putra dan putri di kelas 6 adalah ${p} : ${q}. Rata-rata tinggi badan siswa putra ${r1} cm dan siswa putri ${r2} cm. Rata-rata tinggi badan seluruh siswa adalah …`, R,
        { satuan: "cm", petunjuk: `Anggap saja ada ${p} siswa putra dan ${q} siswa putri.`, bahas: `(${p} × ${r1} + ${q} × ${r2}) : (${p} + ${q}) = ${p * r1 + q * r2} : ${p + q} = ${fmt(R)} cm. Bukan (${r1} + ${r2}) : 2, karena banyak siswanya tidak sama.`,
        langkah: [`Perbandingan ${p} : ${q} artinya setiap ${p} siswa putra ada ${q} siswa putri. Anggap saja ada ${p} putra dan ${q} putri.`, `Jumlah tinggi = ${p} × ${r1} + ${q} × ${r2} = ${fmt(p * r1)} + ${fmt(q * r2)} = ${fmt(p * r1 + q * r2)}.`,
          `Rata-rata = ${fmt(p * r1 + q * r2)} : (${p} + ${q}) = ${fmt(p * r1 + q * r2)} : ${p + q} = ${fmt(R)}.`, lJadi(R, "cm")] }); },
  ],
});

/* ================= Misi 3: Peluang ================= */
const WARNA = ["merah", "biru", "hijau", "kuning", "ungu"];
function svgRoda(bag) {   // bag: larik nama warna, potongan sama besar
  const c = 80, r = 70, n = bag.length; let s = svgBuka(170, 170, "roda putar");
  bag.forEach((w, i) => { const a0 = i / n * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / n * 2 * Math.PI - Math.PI / 2;
    s += `<path d="M${c} ${c}L${(c + r * Math.cos(a0)).toFixed(1)} ${(c + r * Math.sin(a0)).toFixed(1)}A${r} ${r} 0 0 1 ${(c + r * Math.cos(a1)).toFixed(1)} ${(c + r * Math.sin(a1)).toFixed(1)}Z" class="w-${w}"/>`; });
  return s + `<path d="M${c} ${c - 12}L${c - 6} ${c + 6}L${c + 6} ${c + 6}Z" class="panah"/><circle cx="${c}" cy="${c}" r="5" class="titik"/></svg>`;
}
const kantong = () => { const w = ambil(WARNA, acak(2, 3)), v = w.map(() => acak(1, 9)); return { w, v, n: v.reduce((a, b) => a + b) }; };
const isiKantong = k => k.w.map((w, i) => `${k.v[i]} kelereng ${w}`).join(", ");
const kejadian = ["pasti", "mungkin", "tidak mungkin"];
daftarMisi("dat", "d3", "Peluang sederhana", "🎲", {
  1: [
    () => { const s = pilih([["genap", [2, 4, 6]], ["ganjil", [1, 3, 5]], ["kurang dari 4", [1, 2, 3]], ["lebih dari 2", [3, 4, 5, 6]], ["lebih dari 4", [5, 6]], ["kurang dari 7", [1, 2, 3, 4, 5, 6]], ["kelipatan 2", [2, 4, 6]], ["lebih dari 6", []]]);
      return isian(`Sebuah dadu dilempar. Banyak mata dadu <b>${s[0]}</b> yang mungkin muncul adalah …`, s[1].length, { petunjuk: "Mata dadu: 1, 2, 3, 4, 5, 6.", bahas: `Mata dadu ${s[0]}: ${s[1].join(", ") || "tidak ada"} → ${s[1].length}.`,
        langkah: ["Tulis semua mata dadu: 1, 2, 3, 4, 5, 6.", `Pilih yang ${s[0]}: ${s[1].join(", ") || "tidak ada"}.`, `Hitung: ada ${s[1].length}.`, lJadi(s[1].length)] }); },
    () => { const k = kantong(); return isian(`Dalam kantong ada ${isiKantong(k)}. Banyak semua kelereng di kantong adalah …`, k.n, { bahas: `${k.v.join(" + ")} = ${k.n}.`,
      langkah: [`Isi kantong: ${isiKantong(k)}.`, `Jumlahkan semuanya: ${lTambah(k.v)}.`, lJadi(k.n)] }); },
    keTKA(() => { const satu = ya(0.35), w = pilih(WARNA), lain = pilih(WARNA.filter(x => x !== w)), n = acak(3, 9); const isi = satu ? `${n} kelereng ${w}` : `${n} kelereng ${w} dan ${acak(2, 6)} kelereng ${lain}`; const tanya = pilih(satu ? [w, lain] : [w, lain, pilih(WARNA.filter(x => x !== w && x !== lain))]);
    const j = satu ? (tanya === w ? "pasti" : "tidak mungkin") : tanya === w || tanya === lain ? "mungkin" : "tidak mungkin";
    const ada = tanya === w || (!satu && tanya === lain);
    return pgTetap(`Dalam kantong ada ${isi}. Tanpa melihat, diambil satu kelereng. Kejadian terambil kelereng <b>${tanya}</b> adalah kejadian yang …`, kejadian, j, { bahas: `Kejadian itu ${j} terjadi.`,
      langkah: [`Lihat isi kantong: ${isi}.`, !ada ? `Tidak ada kelereng ${tanya} di kantong, jadi kelereng ${tanya} tidak mungkin terambil.`
        : satu ? `Semua kelereng berwarna ${w}, jadi yang terambil pasti ${w}.` : `Ada kelereng ${tanya}, tetapi ada juga warna lain. Jadi ${tanya} bisa terambil, tetapi belum pasti.`, `Jadi, jawabannya <b>${j}</b>.`] }); }),
  ],
  2: [
    () => { const n = acak(10, 30), k = acak(2, 6); const l = Array.from({ length: n }, (_, i) => i + 1).filter(x => x % k === 0);
      return isian(`Ada kartu bernomor 1 sampai ${n}. Banyak kartu bernomor <b>kelipatan ${k}</b> adalah …`, l.length, { bahas: `${l.join(", ")} → ${l.length} kartu.`,
        langkah: [`Kartu bernomor 1 sampai ${n}.`, `Kelipatan ${k}: ${l.join(", ")}.`, `Hitung: ada ${l.length} kartu.`, lJadi(l.length)] }); },
    () => { const k = kantong(), i = acak(0, k.w.length - 1); return isian(`Dalam kantong ada ${isiKantong(k)}. Banyak kelereng yang <b>bukan</b> berwarna ${k.w[i]} adalah …`, k.n - k.v[i], { bahas: `${k.n} − ${k.v[i]} = ${k.n - k.v[i]}.`,
      langkah: [`Semua kelereng: ${lTambah(k.v)}.`, `Kelereng ${k.w[i]} ada ${k.v[i]}.`, `Yang bukan ${k.w[i]} = ${k.n} − ${k.v[i]} = ${k.n - k.v[i]}.`, lJadi(k.n - k.v[i])] }); },
    keTKA(() => { const n = acak(5, 20), t = pilih(["genap", "ganjil", "kurang dari " + (n + 1), "lebih dari " + n, "bilangan 0", "kelipatan " + acak(2, 5), "lebih dari " + acak(1, n - 1)]);
      const cek = { genap: x => x % 2 === 0, ganjil: x => x % 2 === 1 }[t] || (t.startsWith("kurang") ? x => x < n + 1 : t === "lebih dari " + n ? x => x > n : t === "bilangan 0" ? x => x === 0 : t.startsWith("kelipatan") ? x => x % +t.split(" ")[1] === 0 : x => x > +t.split(" ")[2]);
      const c = Array.from({ length: n }, (_, i) => i + 1).filter(cek).length, j = c === n ? "pasti" : c === 0 ? "tidak mungkin" : "mungkin";
      const l = Array.from({ length: n }, (_, i) => i + 1).filter(cek);
      return pgTetap(`Ada ${n} kartu bernomor 1 sampai ${n}. Diambil satu kartu secara acak. Kejadian terambil kartu bernomor <b>${t}</b> adalah kejadian yang …`, kejadian, j, { bahas: `Ada ${c} dari ${n} kartu yang memenuhi, jadi kejadian itu ${j} terjadi.`,
        langkah: [`Kartu bernomor 1 sampai ${n}.`, `Kartu bernomor ${t}: ${l.length ? l.join(", ") : "tidak ada"} → ${c} dari ${n} kartu.`,
          c === n ? "Semua kartu memenuhi, jadi kejadian itu pasti terjadi." : c === 0 ? "Tidak ada kartu yang memenuhi, jadi kejadian itu tidak mungkin terjadi." : "Sebagian kartu memenuhi, jadi kejadian itu bisa terjadi tetapi belum pasti.", `Jadi, jawabannya <b>${j}</b>.`] }); }),
    keTKA(() => { const s = pilih([["bilangan kurang dari 7", "pasti"], ["bilangan 7", "tidak mungkin"], ["bilangan genap", "mungkin"], ["bilangan 0", "tidak mungkin"], ["bilangan lebih dari 0", "pasti"], [`bilangan ${acak(1, 6)}`, "mungkin"], ["bilangan prima", "mungkin"], ["bilangan lebih dari 6", "tidak mungkin"]]);
    const l = dDaduL(s[0]);
    return pgTetap(`Sebuah dadu dilempar satu kali. Kejadian muncul mata dadu <b>${s[0]}</b> adalah kejadian yang …`, kejadian, s[1], { petunjuk: "Mata dadu: 1, 2, 3, 4, 5, 6.", bahas: `Kejadian itu ${s[1]} terjadi.`,
      langkah: ["Mata dadu yang mungkin muncul: 1, 2, 3, 4, 5, 6.", `Mata dadu ${s[0]}: ${lDadu(s[0])} → ${l.length} dari 6.`,
        l.length === 6 ? "Semua mata dadu memenuhi, jadi pasti terjadi." : l.length ? "Sebagian mata dadu memenuhi, jadi bisa terjadi tetapi belum pasti." : "Tidak ada mata dadu yang memenuhi, jadi tidak mungkin terjadi.", `Jadi, jawabannya <b>${s[1]}</b>.`] }); }),
  ],
  3: [
    () => { const k = kantong(), i = acak(0, k.w.length - 1); return isian(`Dalam kantong ada ${isiKantong(k)}. Tanpa melihat, paling sedikit berapa kelereng harus diambil agar <b>pasti</b> mendapat kelereng ${k.w[i]}?`, k.n - k.v[i] + 1,
      { petunjuk: `Bayangkan nasib paling sial: semua kelereng yang bukan ${k.w[i]} terambil dulu.`, bahas: `Yang bukan ${k.w[i]} ada ${k.n - k.v[i]}. Ambil satu lagi pasti ${k.w[i]}: ${k.n - k.v[i] + 1}.`,
      langkah: [`Kelereng yang bukan ${k.w[i]}: ${k.n} − ${k.v[i]} = ${k.n - k.v[i]}.`, `Bayangkan nasib paling sial: ${k.n - k.v[i]} kelereng yang bukan ${k.w[i]} terambil semua lebih dulu.`,
        `Sisanya tinggal kelereng ${k.w[i]}, jadi pengambilan berikutnya pasti ${k.w[i]}: ${k.n - k.v[i]} + 1 = ${k.n - k.v[i] + 1}.`, lJadi(k.n - k.v[i] + 1)] }); },
    () => { const m = acak(2, 8), bi = acak(1, m - 1); return isian(`Dalam kantong ada ${m} kelereng merah dan ${bi} kelereng biru. Berapa kelereng biru harus ditambahkan agar merah dan biru <b>sama mungkin</b> terambil?`, m - bi, { petunjuk: "Sama mungkin artinya banyaknya sama.", bahas: `${m} − ${bi} = ${m - bi}.`,
      langkah: ["Sama mungkin terambil artinya banyak kelereng merah dan biru harus sama.", `Merah ada ${m}, biru baru ${bi}.`, `Biru perlu ditambah ${m} − ${bi} = ${m - bi}.`, lJadi(m - bi)] }); },
    keTKA(() => { let k; do k = kantong(); while (k.v.filter(x => x === Math.max(...k.v)).length > 1 || k.w.length < 3); const b = ya(), v = b ? Math.max(...k.v) : Math.min(...k.v); if (!b && k.v.filter(x => x === v).length > 1) return pg(`Dalam kantong ada ${isiKantong(k)}. Warna yang <b>paling mungkin</b> terambil adalah …`, k.w[k.v.indexOf(Math.max(...k.v))], k.w.filter((_, i) => k.v[i] !== Math.max(...k.v)), { bahas: "Warna yang paling banyak paling mungkin terambil.",
      langkah: [`Bandingkan banyak kelereng: ${isiKantong(k)}.`, "Makin banyak kelerengnya, makin mungkin terambil.", `Paling banyak: ${k.w[k.v.indexOf(Math.max(...k.v))]} (${Math.max(...k.v)} kelereng).`, `Jadi, jawabannya <b>${k.w[k.v.indexOf(Math.max(...k.v))]}</b>.`] });
    const j = k.w[k.v.indexOf(v)]; return pg(`Dalam kantong ada ${isiKantong(k)}. Diambil satu kelereng. Warna yang <b>${b ? "paling mungkin" : "paling kecil kemungkinannya"}</b> terambil adalah …`, j, k.w.filter(x => x !== j), { petunjuk: "Makin banyak kelerengnya, makin mungkin terambil.", bahas: `${j}: ${v} kelereng (paling ${b ? "banyak" : "sedikit"}).`,
      langkah: [`Bandingkan banyak kelereng: ${isiKantong(k)}.`, `Makin ${b ? "banyak" : "sedikit"} kelerengnya, makin ${b ? "besar" : "kecil"} kemungkinannya terambil.`, `Paling ${b ? "banyak" : "sedikit"}: ${j} (${v} kelereng).`, `Jadi, jawabannya <b>${j}</b>.`] }); }, 7),
  ],
  4: [() => { const s = pilih([["genap", [2, 4, 6]], ["ganjil", [1, 3, 5]], ["prima", [2, 3, 5]], ["kurang dari 3", [1, 2]], ["lebih dari 2", [3, 4, 5, 6]], ["faktor dari 6", [1, 2, 3, 6]], ["kelipatan 3", [3, 6]], ["paling sedikit 4", [4, 5, 6]]]);
    return isian(`Sebuah dadu dilempar. Banyak hasil yang mungkin untuk mata dadu <b>${s[0]}</b> adalah …`, s[1].length, { bahas: `Mata dadu ${s[0]}: ${s[1].join(", ")} → ${s[1].length} hasil.`,
      langkah: ["Tulis semua mata dadu: 1, 2, 3, 4, 5, 6.", `Pilih yang ${s[0]}: ${s[1].join(", ")}.`, `Hitung: ada ${s[1].length} hasil.`, lJadi(s[1].length)] }); },
    () => { const n = acak(10, 30), k = acak(2, 6), jenis = pilih(["kelipatan", "faktor", "prima", "lebih"]); let l;
      if (jenis === "kelipatan") l = Array.from({ length: n }, (_, i) => i + 1).filter(x => x % k === 0);
      else if (jenis === "faktor") l = Array.from({ length: n }, (_, i) => i + 1).filter(x => n % x === 0);
      else if (jenis === "prima") l = Array.from({ length: n }, (_, i) => i + 1).filter(x => faktor(x).length === 2);
      else l = Array.from({ length: n }, (_, i) => i + 1).filter(x => x > n - k * 2);
      const t = { kelipatan: `kelipatan ${k}`, faktor: `faktor dari ${n}`, prima: "bilangan prima", lebih: `lebih dari ${n - k * 2}` }[jenis];
      return isian(`Kartu bernomor 1 sampai ${n} dikocok, lalu diambil satu. Banyak hasil yang mungkin untuk kartu bernomor <b>${t}</b> adalah …`, l.length, { bahas: `${t}: ${l.join(", ")} → ${l.length} hasil.`,
        langkah: [`Kartu bernomor 1 sampai ${n}.`, `Nomor yang ${t}: ${l.join(", ")}.`, `Hitung: ada ${l.length} hasil.`, lJadi(l.length)] }); },
    /* Roda putar: banyak hasil untuk dua warna */
    () => { const n = pilih([6, 8, 10]), w = ambil(WARNA, 3); let bag; do bag = Array.from({ length: n }, () => pilih(w)); while (new Set(bag).size < 3); const [p, q] = ambil(w, 2), cnt = x => bag.filter(y => y === x).length, c = cnt(p) + cnt(q);
      return isian(`Roda putar dibagi menjadi ${n} bagian sama besar seperti gambar. Roda diputar sekali. Banyak hasil yang mungkin untuk jarum berhenti di warna <b>${p} atau ${q}</b> adalah …`, c,
        { gambar: svgRoda(bag), petunjuk: "Hitung bagian yang berwarna salah satu dari kedua warna itu.", bahas: `${p} ${cnt(p)} bagian, ${q} ${cnt(q)} bagian. ${cnt(p)} + ${cnt(q)} = ${c} hasil.`,
          langkah: [`Hitung bagian berwarna ${p} pada gambar: ${cnt(p)} bagian.`, `Hitung bagian berwarna ${q}: ${cnt(q)} bagian.`, `Jumlahkan: ${cnt(p)} + ${cnt(q)} = ${c}.`, lJadi(c)] }); },
    /* Kartu huruf: banyak hasil vokal/konsonan */
    () => { const kata = pilih(["MATEMATIKA", "INDONESIA", "KALIMANTAN", "SURABAYA", "PELANGI", "SEMARANG", "NUSANTARA", "SULAWESI", "BENGKULU", "PERPUSTAKAAN"]), h = [...kata], v = h.filter(x => "AIUEO".includes(x)), vok = ya(), l = vok ? v : h.filter(x => !"AIUEO".includes(x));
      return isian(`Setiap huruf pada kata <b>${kata}</b> ditulis pada satu kartu. Kartu dikocok, lalu diambil satu. Banyak hasil yang mungkin untuk kartu <b>huruf ${vok ? "vokal (A, I, U, E, O)" : "konsonan (bukan A, I, U, E, O)"}</b> adalah …`, l.length,
        { petunjuk: "Setiap huruf ditulis pada kartunya sendiri, termasuk huruf yang sama.", bahas: `Kata ${kata} punya ${h.length} kartu. Huruf ${vok ? "vokal" : "konsonan"}: ${l.join(", ")} → ${l.length} hasil.`,
          langkah: [`Tulis semua kartu: ${h.join(", ")} (${h.length} kartu).`, `Kartu huruf ${vok ? "vokal" : "konsonan"}: ${l.join(", ")}.`, `Hitung: ada ${l.length} kartu.`, lJadi(l.length)] }); },
    /* Uang logam: banyak hasil */
    () => { const nA = x => [...x].filter(c => c === "A").length, R = { 2: ["AA", "AG", "GA", "GG"], 3: ["AAA", "AAG", "AGA", "GAA", "AGG", "GAG", "GGA", "GGG"] };
      const s = pilih([[2, "keduanya sisi angka", x => nA(x) === 2], [2, "satu angka dan satu gambar", x => nA(x) === 1], [2, "paling sedikit satu gambar", x => nA(x) < 2], [2, "kedua sisinya sama", x => x[0] === x[1]],
        [3, "tepat dua sisi angka", x => nA(x) === 2], [3, "paling sedikit satu angka", x => nA(x) >= 1], [3, "ketiganya sisi yang sama", x => nA(x) % 3 === 0], [3, "tepat satu sisi angka", x => nA(x) === 1], [3, "paling sedikit dua gambar", x => nA(x) <= 1]]), l = R[s[0]].filter(s[2]);
      return isian(`${s[0] === 2 ? "Dua" : "Tiga"} keping uang logam dilempar bersamaan (A = angka, G = gambar). Banyak hasil yang mungkin untuk <b>${s[1]}</b> adalah …`, l.length,
        { petunjuk: "Tuliskan dulu semua hasil yang mungkin.", bahas: `Semua hasil: ${R[s[0]].join(", ")}. Yang memenuhi: ${l.join(", ")} → ${l.length} hasil.`,
          langkah: [`Tulis semua hasil (A = angka, G = gambar): ${R[s[0]].join(", ")}.`, `Pilih yang ${s[1]}: ${l.join(", ")}.`, `Hitung: ada ${l.length} hasil.`, lJadi(l.length)] }); },
  ],
  5: [
    () => { const k = kantong(), i = acak(0, k.w.length - 1); return isianPc(`Dalam kantong ada ${isiKantong(k)}. Diambil satu kelereng secara acak. Peluang terambil kelereng <b>${k.w[i]}</b> adalah … (tulis pecahan paling sederhana)`, k.v[i], k.n, { petunjuk: "Peluang = banyak yang diharapkan : banyak semua.", bahas: `${k.v[i]} : ${k.n} = ${pcS(k.v[i], k.n)}.`,
      langkah: lPeluang(k.v[i], k.n, `Kelereng ${k.w[i]} (yang diinginkan) ada ${k.v[i]}.`, `Semua kelereng: ${lTambah(k.v)}.`) }); },
    () => { const s = pilih([["genap", 3], ["prima", 3], ["kurang dari 3", 2], ["lebih dari 4", 2], ["kelipatan 3", 2], ["5", 1], ["faktor dari 4", 3]]); return isianPc(`Sebuah dadu dilempar. Peluang muncul mata dadu <b>${s[0]}</b> adalah …`, s[1], 6, { bahas: `${s[1]} dari 6 → ${pcS(s[1], 6)}.`,
      langkah: lPeluang(s[1], 6, `Mata dadu ${s[0]}: ${lDadu(s[0])} → ${s[1]} hasil.`, "Semua mata dadu: 1, 2, 3, 4, 5, 6 → 6 hasil.") }); },
  ],
  6: [() => { const n = pilih([4, 5, 6, 8]), w = ambil(WARNA, 3); let bag; do bag = Array.from({ length: n }, () => pilih(w)); while (new Set(bag).size < 2); const t = pilih([...new Set(bag)]), c = bag.filter(x => x === t).length;
    return isianPc(`Roda putar dibagi menjadi ${n} bagian sama besar seperti gambar. Roda diputar sekali. Peluang jarum berhenti di warna <b>${t}</b> adalah …`, c, n, { gambar: svgRoda(bag), petunjuk: "Hitung bagian berwarna itu.", bahas: `${c} dari ${n} bagian → ${pcS(c, n)}.`,
      langkah: lPeluang(c, n, `Bagian berwarna ${t} ada ${c}.`, `Semua bagian roda ada ${n} (sama besar).`) }); }],
  7: [() => { const s = pilih([["dua keping uang logam dilempar bersamaan", 4, "AA, AG, GA, GG"], ["tiga keping uang logam dilempar bersamaan", 8, "2 × 2 × 2"], ["sebuah uang logam dan sebuah dadu dilempar bersamaan", 12, "2 × 6"], ["dua dadu dilempar bersamaan", 36, "6 × 6"]]);
    if (ya(0.4)) { const k = acak(2, 5), c = acak(2, 4), sp = acak(1, 3), x = nama(); return isian(`${x} punya ${k} kaos, ${c} celana, dan ${sp} pasang sepatu. Banyak cara berbeda ${x} memakai satu kaos, satu celana, dan satu pasang sepatu adalah …`, k * c * sp, { petunjuk: "Kalikan banyak pilihan setiap jenis.", bahas: `${k} × ${c} × ${sp} = ${k * c * sp} cara.`,
      langkah: [`Pilihan: ${k} kaos, ${c} celana, ${sp} pasang sepatu.`, "Setiap kaos bisa dipasangkan dengan setiap celana dan setiap sepatu, jadi banyak pilihannya dikalikan.", `${k} × ${c} × ${sp} = ${k * c * sp}.`, lJadi(k * c * sp)] }); }
    const ur = { 4: ["Setiap uang logam punya 2 hasil: A (angka) atau G (gambar).", "2 × 2 = 4, yaitu AA, AG, GA, GG."], 8: ["Setiap uang logam punya 2 hasil: A atau G.", "2 × 2 × 2 = 8."],
      12: ["Uang logam punya 2 hasil (A, G); dadu punya 6 hasil (1–6).", "Setiap sisi uang bisa berpasangan dengan setiap mata dadu: 2 × 6 = 12."], 36: ["Setiap dadu punya 6 hasil (1–6).", "Setiap mata dadu pertama bisa berpasangan dengan setiap mata dadu kedua: 6 × 6 = 36."] }[s[1]];
    return isian(`Banyak semua hasil yang mungkin jika ${s[0]} adalah …`, s[1], { bahas: `${s[2]} → ${s[1]} hasil.`, langkah: [...ur, lJadi(s[1])] }); }],
  8: [() => { const k = kantong(), [i] = [acak(0, k.w.length - 1)], j = (i + 1) % k.w.length;
    const B = [
      { t: `Peluang terambil ${k.w[i]} adalah ${pcS(k.v[i], k.n)}.`, b: true, a: `${k.v[i]} dari ${k.n} kelereng = ${pc(k.v[i], k.n)}${fpb(k.v[i], k.n) > 1 ? " = " + pcS(k.v[i], k.n) : ""}.` },
      ya() ? { t: `Peluang terambil ${k.w[j]} adalah ${pc(k.v[j], k.n + 1)}.`, b: false, a: `penyebutnya harus banyak semua kelereng (${k.n}), jadi peluangnya ${pc(k.v[j], k.n)}.` } : { t: `Peluang terambil ${k.w[j]} adalah ${pc(k.v[j], k.n)}.`, b: true, a: `ada ${k.v[j]} kelereng ${k.w[j]} dari ${k.n} kelereng.` },
      { t: `Terambil kelereng hitam adalah kejadian yang tidak mungkin.`, b: true, a: "tidak ada kelereng hitam di kantong." },
      { t: `Peluang terambil ${k.w[i]} lebih besar daripada ${k.w[j]}.`, b: k.v[i] > k.v[j], a: `${k.w[i]} ada ${k.v[i]}, ${k.w[j]} ada ${k.v[j]}${k.v[i] > k.v[j] ? "; lebih banyak, jadi peluangnya lebih besar" : k.v[i] === k.v[j] ? "; sama banyak, jadi peluangnya sama" : "; lebih sedikit, jadi peluangnya lebih kecil"}.` }];
    return lPilihan(bs(`Dalam kantong ada ${isiKantong(k)}. Diambil satu kelereng secara acak. Tentukan Benar atau Salah.`, B, { bahas: `Total ${k.n} kelereng. ${k.w.map((w, x) => `${w}: ${pcS(k.v[x], k.n)}`).join("; ")}.` }), B,
      [`Banyak semua kelereng: ${lTambah(k.v)}.`, `Peluang setiap warna = banyak warna itu : ${k.n}. ${k.w.map((w, x) => `${w}: ${pc(k.v[x], k.n)}${fpb(k.v[x], k.n) > 1 ? " = " + pcS(k.v[x], k.n) : ""}`).join("; ")}.`]); }],
  9: [() => { const k = acak(1, 12), s = pilih([[`jumlah kedua mata dadu sama dengan ${k + 1}`, (a, b) => a + b === k + 1], [`jumlah kedua mata dadu lebih dari ${k}`, (a, b) => a + b > k], [`jumlah kedua mata dadu kurang dari ${k}`, (a, b) => a + b < k],
      ["kedua mata dadu sama", (a, b) => a === b], [`selisih kedua mata dadu ${k % 6}`, (a, b) => Math.abs(a - b) === k % 6], [`hasil kali kedua mata dadu ${pilih([4, 6, 12])}`, null], ["kedua mata dadu genap", (a, b) => a % 2 === 0 && b % 2 === 0], [`jumlah kedua mata dadu bilangan prima`, (a, b) => faktor(a + b).length === 2]]);
    if (!s[1]) { const h = +s[0].split(" ").pop(); s[1] = (a, b) => a * b === h; }
    let c = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (s[1](a, b)) c++;
    const semua36 = "Dua dadu: 6 × 6 = 36 pasangan (dadu 1, dadu 2).";
    if (c === 0) return isianPc(`Dua dadu dilempar bersamaan. Peluang jumlah kedua mata dadu 7 adalah …`, 6, 36, { bahas: "6 pasangan dari 36 → 1/6.",
      langkah: lPeluang(6, 36, "Jumlah 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → 6 pasangan.", semua36) });
    const ps = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (s[1](a, b)) ps.push(`(${a},${b})`);
    return isianPc(`Dua dadu dilempar bersamaan. Peluang <b>${s[0]}</b> adalah …`, c, 36, { petunjuk: "Buat tabel 6 × 6 pasangan (dadu 1, dadu 2). Semua hasil ada 36.", bahas: `Ada ${c} pasangan dari 36 → ${pcS(c, 36)}.`,
      langkah: lPeluang(c, 36, ps.length <= 18 ? `Pasangan yang ${s[0]}: ${ps.join(", ")} → ${c} pasangan.` : `Pasangan yang ${s[0]} (hitung pada tabel 6 × 6) ada ${c}; yang tidak memenuhi ada 36 − ${c} = ${36 - c}.`, semua36) }); },
    /* Kartu angka dengan syarat gabungan */
    () => { const n = acak(12, 40), k = acak(3, n - 4), m = pilih([12, 18, 20, 24, 30, 36].filter(x => x <= n));
      const s = pilih([["kelipatan 2 atau kelipatan 3", x => x % 2 === 0 || x % 3 === 0], ["kelipatan 3 atau kelipatan 5", x => x % 3 === 0 || x % 5 === 0], ["kelipatan 2 dan juga kelipatan 3", x => x % 6 === 0], ["genap dan lebih dari " + k, x => x % 2 === 0 && x > k],
        ["ganjil yang bukan bilangan prima", x => x % 2 === 1 && faktor(x).length !== 2], ["bilangan prima", x => faktor(x).length === 2], ["faktor dari " + m, x => m % x === 0], ["yang memuat angka 1", x => String(x).includes("1")], ["bilangan kuadrat (seperti 9 = 3 × 3)", x => Number.isInteger(Math.sqrt(x))]]);
      const l = Array.from({ length: n }, (_, i) => i + 1).filter(s[1]);
      return isianPc(`Kartu bernomor 1 sampai ${n} dikocok, lalu diambil satu kartu secara acak. Peluang terambil kartu bernomor <b>${s[0]}</b> adalah …`, l.length, n,
        { petunjuk: "Tuliskan semua nomor yang memenuhi, lalu bagi banyak semua kartu.", bahas: `Yang memenuhi: ${l.join(", ")} → ${l.length} kartu dari ${n}. Peluang ${pcS(l.length, n)}.`,
        langkah: lPeluang(l.length, n, `Nomor yang ${s[0]}: ${l.join(", ") || "tidak ada"} → ${l.length} kartu.`, `Semua kartu: nomor 1 sampai ${n} → ${n} kartu.`) }); },
    /* Kartu huruf */
    () => { const kata = pilih(["MATEMATIKA", "INDONESIA", "KALIMANTAN", "SURABAYA", "PERPUSTAKAAN", "PELANGI", "SEMARANG", "BERSEPEDA", "KATULISTIWA", "NUSANTARA", "PAPUA", "SULAWESI", "BENGKULU", "PALEMBANG"]), h = kata.split(""), n = h.length;
      const jenis = pilih(["huruf", "huruf", "vokal", "konsonan"]); let t, c;
      if (jenis === "huruf") { const u = [...new Set(h)]; t = pilih(ya(0.7) ? u.filter(x => h.filter(y => y === x).length > 1).concat(u.slice(0, 1)) : u); c = h.filter(y => y === t).length; t = "huruf " + t; }
      else { const v = h.filter(x => "AIUEO".includes(x)).length; c = jenis === "vokal" ? v : n - v; t = jenis === "vokal" ? "huruf vokal (A, I, U, E, O)" : "huruf konsonan (bukan A, I, U, E, O)"; }
      return isianPc(`Setiap huruf pada kata <b>${kata}</b> ditulis pada satu kartu, lalu semua kartu dikocok. Diambil satu kartu secara acak. Peluang terambil kartu <b>${t}</b> adalah …`, c, n,
        { petunjuk: `Ada ${n} kartu. Hitung kartu yang memenuhi.`, bahas: `Kata ${kata} punya ${n} huruf; yang memenuhi ada ${c}. Peluang ${c} : ${n} = ${pcS(c, n)}.`,
        langkah: lPeluang(c, n, `Kartu ${t}: ${h.filter(x => (jenis === "huruf" ? x === t.slice(6) : jenis === "vokal" ? "AIUEO".includes(x) : !"AIUEO".includes(x))).join(", ")} → ${c} kartu.`, `Kartu dari kata ${kata}: ${h.join(", ")} → ${n} kartu.`) }); },
    /* Pemintal: gabungan dua warna atau bukan satu warna */
    () => { const n = pilih([8, 10, 12]), w = ambil(WARNA, acak(3, 4)); let bag; do bag = Array.from({ length: n }, () => pilih(w)); while (new Set(bag).size < 3); const ada = [...new Set(bag)], cnt = x => bag.filter(y => y === x).length;
      let t, c, kal; if (ya()) { const [p, q] = ambil(ada, 2); t = `${p} atau ${q}`; c = cnt(p) + cnt(q); kal = `Bagian ${p} ada ${cnt(p)}, bagian ${q} ada ${cnt(q)}. Yang memenuhi: ${cnt(p)} + ${cnt(q)} = ${c} bagian.`; }
      else { const p = pilih(ada); t = `bukan ${p}`; c = n - cnt(p); kal = `Bagian ${p} ada ${cnt(p)}. Yang bukan ${p}: ${n} − ${cnt(p)} = ${c} bagian.`; }
      return isianPc(`Roda putar dibagi menjadi ${n} bagian sama besar seperti gambar. Roda diputar sekali. Peluang jarum berhenti di warna <b>${t}</b> adalah …`, c, n,
        { gambar: svgRoda(bag), petunjuk: "Hitung bagian yang memenuhi, lalu bagi banyak semua bagian.", bahas: `${ada.map(x => `${x} ${cnt(x)}`).join(", ")}. Yang memenuhi ${c} dari ${n} bagian → ${pcS(c, n)}.`,
          langkah: lPeluang(c, n, kal, `Hitung bagian setiap warna: ${ada.map(x => `${x} ${cnt(x)}`).join(", ")}. Semua ada ${n} bagian.`) }); },
    /* Menambah kelereng agar peluang tertentu */
    () => { const [w1, w2] = ambil(WARNA, 2); let p, q, m, o, x; do { [p, q] = pilih([[1, 2], [2, 3], [3, 4], [3, 5], [2, 5], [1, 3]]); m = acak(1, 9); o = acak(2, 12); x = (p * o - (q - p) * m) / (q - p); } while (!Number.isInteger(x) || x < 1 || x > 20);
      return isian(`Dalam kantong ada ${m} kelereng ${w1} dan ${o} kelereng ${w2}. Berapa kelereng ${w1} harus ditambahkan agar peluang terambil kelereng ${w1} menjadi ${pc(p, q)}?`, x,
        { satuan: "kelereng", petunjuk: `Kelereng ${w2} tetap ${o}. Peluang ${pc(p, q)} artinya kelereng ${w2} adalah ${pc(q - p, q)} bagian dari semua.`, bahas: `Jika ditambah ${x}: kelereng ${w1} jadi ${m + x}, semua jadi ${m + o + x}. ${m + x} : ${m + o + x} = ${pcS(m + x, m + o + x)} ✔.`,
        langkah: [`Kelereng ${w2} tidak ditambah, tetap ${o}. Jika peluang ${w1} = ${pc(p, q)}, maka kelereng ${w2} = ${pc(q - p, q)} bagian dari semua kelereng.`,
          `Semua kelereng nanti = ${o} × ${q} : ${q - p} = ${m + o + x}.`, `Kelereng ${w1} nanti = ${m + o + x} − ${o} = ${m + x}. Sekarang ada ${m}, jadi ditambah ${m + x} − ${m} = ${x}.`,
          `Cek: ${pc(m + x, m + o + x)} = ${pcS(m + x, m + o + x)} ✔.`, lJadi(x, "kelereng")] }); },
    /* Membandingkan peluang dua kantong */
    () => { const w = pilih(WARNA), l = pilih(WARNA.filter(x => x !== w)); let a1, b1, a2, b2, kA, kB;
      if (ya(0.25)) { do { a1 = acak(1, 5); b1 = acak(1, 5); } while (fpb(a1, b1) > 1 || a1 === b1); const t = acak(2, 3); a2 = a1 * t; b2 = b1 * t; if (ya()) [a1, b1, a2, b2] = [a2, b2, a1, b1]; kA = kB = 0; }
      else { const jebak = ya(0.7); do { a1 = acak(2, 12); b1 = acak(2, 12); a2 = acak(2, 12); b2 = acak(2, 12); kA = a1 * (a2 + b2); kB = a2 * (a1 + b1); } while (kA === kB || a1 === a2 || (jebak && (a1 > a2) === (kA > kB))); }
      const j = kA === kB ? "Peluangnya sama besar" : kA > kB ? "Kantong A" : "Kantong B", tk = (a, b) => `${a} kelereng ${w} dan ${b} kelereng ${l}`;
      return pgTetap(`Kantong A berisi ${tk(a1, b1)}. Kantong B berisi ${tk(a2, b2)}. Diambil satu kelereng secara acak. Peluang terambil kelereng ${w} lebih besar jika diambil dari …`, ["Kantong A", "Kantong B", "Peluangnya sama besar", "Tidak dapat ditentukan"], j,
        { petunjuk: `Bandingkan pecahan (banyak kelereng ${w} : banyak semua kelereng), bukan banyak kelereng ${w} saja.`, bahas: `Kantong A: ${pc(a1, a1 + b1)}${fpb(a1, a1 + b1) > 1 ? " = " + pcS(a1, a1 + b1) : ""}. Kantong B: ${pc(a2, a2 + b2)}${fpb(a2, a2 + b2) > 1 ? " = " + pcS(a2, a2 + b2) : ""}.${kA !== kB ? ` Samakan penyebutnya: ${pc(kA, (a1 + b1) * (a2 + b2))} dan ${pc(kB, (a1 + b1) * (a2 + b2))}.` : ""} Jadi jawabannya: ${j}.`,
        langkah: [`Kantong A: ${a1} kelereng ${w} dari ${a1 + b1} kelereng → peluang ${pc(a1, a1 + b1)}${fpb(a1, a1 + b1) > 1 ? " = " + pcS(a1, a1 + b1) : ""}.`,
          `Kantong B: ${a2} kelereng ${w} dari ${a2 + b2} kelereng → peluang ${pc(a2, a2 + b2)}${fpb(a2, a2 + b2) > 1 ? " = " + pcS(a2, a2 + b2) : ""}.`,
          kA === kB ? "Kedua pecahan itu sama nilainya, jadi peluangnya sama besar." : `Samakan penyebutnya (${a1 + b1} × ${a2 + b2} = ${(a1 + b1) * (a2 + b2)}): A = ${pc(kA, (a1 + b1) * (a2 + b2))}, B = ${pc(kB, (a1 + b1) * (a2 + b2))}. Yang lebih besar: ${kA > kB ? "A" : "B"}.`,
          `Jadi, jawabannya <b>${j}</b>.`] }); },
  ],
  10: [
    () => { const m = acak(3, 8), b = acak(3, 8), k = acak(1, Math.min(2, m - 1)); return isianPc(`Dalam kantong ada ${m} kelereng merah dan ${b} kelereng biru. Diambil ${k} kelereng merah dan <b>tidak dikembalikan</b>. Kemudian diambil satu kelereng lagi. Peluang terambil kelereng merah adalah …`, m - k, m + b - k,
      { petunjuk: "Hitung isi kantong setelah kelereng diambil.", bahas: `Sisa: ${m - k} merah dari ${m + b - k} kelereng → ${pcS(m - k, m + b - k)}.`,
        langkah: [`Mula-mula: ${m} merah dan ${b} biru (${m + b} kelereng).`, ...lPeluang(m - k, m + b - k, `Merah yang tersisa: ${m} − ${k} = ${m - k}.`, `${k} kelereng merah diambil dan tidak dikembalikan. Kelereng yang tersisa: ${m + b} − ${k} = ${m + b - k}.`)] }); },
    () => { const n = pilih([20, 30, 40, 50, 60]), t = acak(4, n / 2); return isian(`Sebuah dadu dilempar ${n * 3} kali. Frekuensi harapan muncul mata dadu <b>genap</b> adalah …`, n * 3 / 2, { petunjuk: "Frekuensi harapan = peluang × banyak percobaan.", bahas: `${pc(1, 2)} × ${n * 3} = ${n * 3 / 2} kali.`,
      langkah: [`Mata dadu genap: 2, 4, 6 → 3 dari 6, jadi peluangnya ${pc(3, 6)} = ${pc(1, 2)}.`, "Frekuensi harapan = peluang × banyak percobaan.", `${pc(1, 2)} × ${n * 3} = ${n * 3 / 2}.`, lJadi(n * 3 / 2)] }); },
    /* Kartu tanpa pengembalian */
    () => { const n = acak(8, 20), x = acak(1, n), k = acak(2, n - 3), nm = nama();
      const s = pilih([["genap", v => v % 2 === 0], ["ganjil", v => v % 2 === 1], ["kelipatan 3", v => v % 3 === 0], ["lebih dari " + k, v => v > k], ["bilangan prima", v => faktor(v).length === 2], ["kurang dari " + (k + 1), v => v < k + 1]]);
      const sisa = Array.from({ length: n }, (_, i) => i + 1).filter(v => v !== x), l = sisa.filter(s[1]);
      return isianPc(`Kartu bernomor 1 sampai ${n} dikocok. ${nm} mengambil satu kartu dan mendapat nomor ${x}. Kartu itu <b>tidak dikembalikan</b>. Jika diambil satu kartu lagi, peluang terambil kartu bernomor <b>${s[0]}</b> adalah …`, l.length, n - 1,
        { petunjuk: `Sisa kartu tinggal ${n - 1}. Apakah kartu ${x} termasuk yang dicari?`, bahas: `Sisa ${n - 1} kartu (tanpa ${x}). Yang ${s[0]}: ${l.join(", ")} → ${l.length} kartu. Peluang ${pcS(l.length, n - 1)}.`,
        langkah: lPeluang(l.length, n - 1, `Kartu ${x} ${s[1](x) ? "termasuk" : "tidak termasuk"} yang ${s[0]}. Sisa kartu yang ${s[0]}: ${l.join(", ") || "tidak ada"} → ${l.length} kartu.`,
          `Kartu ${x} tidak dikembalikan, jadi sisa kartu ${n} − 1 = ${n - 1}.`) }); },
    /* Frekuensi harapan dari kantong atau roda putar */
    () => { if (ya()) { const k = kantong(), i = acak(0, k.w.length - 1), N = k.n * acak(3, 10), F = k.v[i] * N / k.n;
        return isian(`Dalam kantong ada ${isiKantong(k)}. Satu kelereng diambil, dicatat warnanya, lalu <b>dikembalikan</b>. Percobaan itu diulang ${N} kali. Frekuensi harapan terambil kelereng ${k.w[i]} adalah …`, F,
          { satuan: "kali", petunjuk: "Frekuensi harapan = peluang × banyak percobaan.", bahas: `Peluang ${k.w[i]} = ${pcS(k.v[i], k.n)}. ${pcS(k.v[i], k.n)} × ${N} = ${F} kali.`,
          langkah: [`Semua kelereng: ${lTambah(k.v)}.`, `Peluang ${k.w[i]} = ${pc(k.v[i], k.n)}${fpb(k.v[i], k.n) > 1 ? " = " + pcS(k.v[i], k.n) : ""}.`, `Frekuensi harapan = peluang × banyak percobaan = ${pcS(k.v[i], k.n)} × ${N} = ${F}.`, lJadi(F, "kali")] }); }
      const n = pilih([4, 5, 6, 8]), w = ambil(WARNA, 3); let bag; do bag = Array.from({ length: n }, () => pilih(w)); while (new Set(bag).size < 2); const t = pilih([...new Set(bag)]), c = bag.filter(x => x === t).length, N = n * acak(5, 25);
      return isian(`Roda putar seperti gambar diputar ${N} kali. Frekuensi harapan jarum berhenti di warna ${t} adalah …`, c * N / n,
        { gambar: svgRoda(bag), satuan: "kali", petunjuk: "Frekuensi harapan = peluang × banyak percobaan.", bahas: `Peluang ${t} = ${pcS(c, n)}. ${pcS(c, n)} × ${N} = ${c * N / n} kali.`,
        langkah: [`Hitung bagian ${t} pada gambar: ${c} dari ${n} bagian.`, `Peluang ${t} = ${pc(c, n)}${fpb(c, n) > 1 ? " = " + pcS(c, n) : ""}.`, `Frekuensi harapan = peluang × banyak percobaan = ${pcS(c, n)} × ${N} = ${c * N / n}.`, lJadi(c * N / n, "kali")] }); },
    /* Banyak percobaan dari frekuensi harapan */
    () => { const s = pilih([["sebuah dadu", "mata dadu genap", 1, 2], ["sebuah dadu", "mata dadu prima", 1, 2], ["sebuah dadu", "mata dadu kelipatan 3", 1, 3], ["sebuah dadu", "mata dadu 6", 1, 6], ["sebuah dadu", "mata dadu faktor dari 6", 2, 3], ["sebuah uang logam", "sisi angka", 1, 2], ["dua uang logam", "keduanya gambar", 1, 4], ["dua uang logam", "satu angka dan satu gambar", 1, 2]]);
      const F = s[2] * acak(4, 30), N = F * s[3] / s[2];
      return isian(`${s[0][0].toUpperCase() + s[0].slice(1)} dilempar berkali-kali. Frekuensi harapan muncul <b>${s[1]}</b> adalah ${F} kali. Banyak pelemparan seluruhnya adalah …`, N,
        { satuan: "kali", petunjuk: "Frekuensi harapan = peluang × banyak pelemparan. Jadi banyak pelemparan = frekuensi harapan : peluang.", bahas: `Peluang ${s[1]} = ${pc(s[2], s[3])}. ${pc(s[2], s[3])} × banyak pelemparan = ${F}, jadi banyak pelemparan = ${F} × ${s[3]} : ${s[2]} = ${N} kali.`,
        langkah: [`Peluang ${s[1]} = ${pc(s[2], s[3])}.`, `Frekuensi harapan = peluang × banyak pelemparan, jadi ${pc(s[2], s[3])} × banyak pelemparan = ${F}.`,
          `Banyak pelemparan = ${F} : ${pc(s[2], s[3])} = ${F} × ${s[3]} : ${s[2]} = ${N}.`, lJadi(N, "kali")] }); },
    /* Banyak kelereng dari peluang */
    () => { const w = pilih(WARNA), [p, q] = pilih([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5], [3, 8], [5, 6], [4, 7]]), t = acak(2, 6), m = p * t, semua = ya(0.35);
      return isian(`Dalam kantong ada ${m} kelereng ${w} dan beberapa kelereng warna lain. Peluang terambil kelereng ${w} adalah ${pc(p, q)}. Banyak kelereng ${semua ? "di dalam kantong seluruhnya" : `yang <b>bukan</b> ${w}`} adalah …`, semua ? q * t : (q - p) * t,
        { satuan: "kelereng", petunjuk: `${pc(p, q)} artinya setiap ${p} kelereng ${w} ada di antara ${q} kelereng.`, bahas: `${m} : ${p} = ${t}, jadi semua kelereng = ${q} × ${t} = ${q * t}.${semua ? "" : ` Bukan ${w} = ${q * t} − ${m} = ${(q - p) * t}.`}`,
        langkah: [`Peluang ${pc(p, q)} artinya: setiap ${q} kelereng, ${p} di antaranya berwarna ${w}.`, `Kelereng ${w} ada ${m} = ${p} × ${t}, jadi ada ${t} kelompok.`, `Semua kelereng = ${q} × ${t} = ${q * t}.`,
          ...(semua ? [] : [`Yang bukan ${w} = ${q * t} − ${m} = ${(q - p) * t}.`]), lJadi(semua ? q * t : (q - p) * t, "kelereng")] }); },
    /* Uang logam dan dadu: ruang sampel */
    () => { const s = pilih([
        ["Sebuah uang logam dan sebuah dadu", "sisi angka dan mata dadu genap", 3, 12], ["Sebuah uang logam dan sebuah dadu", "sisi gambar dan mata dadu prima", 3, 12], ["Sebuah uang logam dan sebuah dadu", "sisi angka dan mata dadu kurang dari 3", 2, 12],
        ["Sebuah uang logam dan sebuah dadu", "sisi gambar dan mata dadu 6", 1, 12], ["Sebuah uang logam dan sebuah dadu", "sisi angka dan mata dadu lebih dari 2", 4, 12], ["Sebuah uang logam dan sebuah dadu", "sisi gambar dan mata dadu faktor dari 6", 4, 12],
        ["Dua uang logam", "keduanya sisi angka", 1, 4], ["Dua uang logam", "satu angka dan satu gambar", 2, 4], ["Dua uang logam", "paling sedikit satu gambar", 3, 4],
        ["Tiga uang logam", "ketiganya sisi gambar", 1, 8], ["Tiga uang logam", "tepat dua sisi angka", 3, 8], ["Tiga uang logam", "paling sedikit satu sisi angka", 7, 8], ["Tiga uang logam", "tepat satu sisi gambar", 3, 8]]);
      const ruang = { 12: "(A,1), (A,2), …, (G,6) → 2 × 6 = 12", 4: "AA, AG, GA, GG → 4", 8: "AAA, AAG, AGA, GAA, AGG, GAG, GGA, GGG → 8" }[s[3]];
      return isianPc(`${s[0]} dilempar bersamaan. Peluang muncul <b>${s[1]}</b> adalah …`, s[2], s[3],
        { petunjuk: "Tuliskan semua hasil yang mungkin (A = angka, G = gambar), lalu hitung yang memenuhi.", bahas: `Semua hasil: ${ruang}. Yang memenuhi ada ${s[2]} → ${pcS(s[2], s[3])}.`,
          langkah: lPeluang(s[2], s[3], `Yang ${s[1]}: ${{
            "sisi angka dan mata dadu genap": "(A,2), (A,4), (A,6)", "sisi gambar dan mata dadu prima": "(G,2), (G,3), (G,5)", "sisi angka dan mata dadu kurang dari 3": "(A,1), (A,2)",
            "sisi gambar dan mata dadu 6": "(G,6)", "sisi angka dan mata dadu lebih dari 2": "(A,3), (A,4), (A,5), (A,6)", "sisi gambar dan mata dadu faktor dari 6": "(G,1), (G,2), (G,3), (G,6)",
            "keduanya sisi angka": "AA", "satu angka dan satu gambar": "AG, GA", "paling sedikit satu gambar": "AG, GA, GG", "ketiganya sisi gambar": "GGG", "tepat dua sisi angka": "AAG, AGA, GAA",
            "paling sedikit satu sisi angka": "AAA, AAG, AGA, GAA, AGG, GAG, GGA", "tepat satu sisi gambar": "AAG, AGA, GAA" }[s[1]]} → ${s[2]} hasil.`, `Semua hasil (A = angka, G = gambar): ${ruang}.`) }); },
    /* Pernyataan peluang pada dadu */
    () => { const EV = [["mata dadu genap", 3], ["mata dadu ganjil", 3], ["mata dadu prima", 3], ["mata dadu faktor dari 6", 4], ["mata dadu kelipatan 3", 2], ["mata dadu kurang dari 3", 2], ["mata dadu lebih dari 4", 2], ["mata dadu lebih dari 2", 4], ["mata dadu 7", 0], ["mata dadu kurang dari 7", 6], ["mata dadu 5", 1], ["mata dadu kelipatan 4", 1]];
      const buat = () => { const [a, b] = ambil(EV, 2), j = pilih([1, 2, 3, 4]);
        const hA = `${a[0]} (${lDadu(a[0])}) ada ${a[1]} hasil`, hB = `${b[0]} (${lDadu(b[0])}) ada ${b[1]} hasil`;
        if (j === 1) { const benar = ya(); return { t: `Peluang muncul ${a[0]} adalah ${pcS(benar ? a[1] : a[1] === 6 ? 5 : a[1] + 1, 6)}.`, b: benar, a: `${hA}, jadi peluangnya ${pc(a[1], 6)}${fpb(a[1], 6) > 1 ? " = " + pcS(a[1], 6) : ""}.` }; }
        if (j === 2) return { t: `Peluang muncul ${a[0]} sama dengan peluang muncul ${b[0]}.`, b: a[1] === b[1], a: `${hA}, sedangkan ${hB}.` };
        if (j === 3) return { t: `Peluang muncul ${a[0]} lebih besar daripada peluang muncul ${b[0]}.`, b: a[1] > b[1], a: `${hA}, sedangkan ${hB}.` };
        const p = ya(); return { t: `Muncul ${a[0]} adalah kejadian yang ${p ? "pasti terjadi" : "tidak mungkin terjadi"}.`, b: p ? a[1] === 6 : a[1] === 0,
          a: `${hA} dari 6${a[1] === 6 ? " (semua hasil), jadi pasti terjadi" : a[1] === 0 ? ", jadi tidak mungkin terjadi" : ", jadi mungkin terjadi tetapi belum pasti"}.` }; };
      let butir; do { butir = []; while (butir.length < 4) { const x = buat(); if (!butir.some(y => y.t === x.t)) butir.push(x); } } while (butir.every(x => x.b) || !butir.some(x => x.b));
      return lPilihan(pgk(`Sebuah dadu dilempar satu kali. Pilih <b>semua</b> pernyataan yang benar.`, butir,
        { petunjuk: "Mata dadu: 1, 2, 3, 4, 5, 6. Hitung banyak hasil untuk setiap kejadian.", bahas: EV.filter(e => butir.some(x => x.t.includes(e[0] + " ") || x.t.includes(e[0] + "."))).map(e => `${e[0]}: ${pcS(e[1], 6)}`).join("; ") + "." }), butir,
        ["Semua hasil yang mungkin: 1, 2, 3, 4, 5, 6 (6 hasil). Peluang = banyak hasil yang diinginkan : 6.", "Periksa setiap pernyataan dengan menghitung banyak hasilnya."]); },
  ],
});
