/* Pos 1 — Bilangan: 7 misi × 10 level */
"use strict";

/* ---------- Bantuan bilangan ---------- */
const TEMPAT = ["satuan", "puluhan", "ratusan", "ribuan", "puluh ribuan", "ratus ribuan", "jutaan"];
const angkaDari = n => String(n).split("").reverse().map(Number);          // [satuan, puluhan, ...]
function bilAcak(pj, beda = false) {                                      // pj angka, angka pertama bukan 0
  if (!beda) return acak(10 ** (pj - 1), 10 ** pj - 1);
  const d = [acak(1, 9)]; while (d.length < pj) { const x = acak(0, 9); if (!d.includes(x)) d.push(x); }
  return +d.join("");
}
function* permutasi(arr) {
  if (arr.length <= 1) { yield arr; return; }
  for (let i = 0; i < arr.length; i++) for (const p of permutasi(arr.slice(0, i).concat(arr.slice(i + 1)))) yield [arr[i], ...p];
}
/* Variasi salah tulis sebuah bilangan (menukar angka, menambah/membuang nol) */
function salahTulis(n) {
  const s = String(n), hasil = new Set();
  for (let i = 0; i < s.length - 1; i++) if (s[i] !== s[i + 1]) hasil.add(+(s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2)));
  const nol = s.indexOf("0", 1); if (nol > 0) hasil.add(+(s.slice(0, nol) + s.slice(nol + 1))), hasil.add(+(s.slice(0, nol) + "0" + s.slice(nol)));
  hasil.add(+(s.slice(0, 1) + "0" + s.slice(1)));
  hasil.delete(n); return kocok([...hasil].filter(x => String(x).length >= s.length - 1));
}
const pembulatan = (n, k) => Math.round(n / k) * k;                      // k = 10, 100, 1000, ...
const NAMA_BULAT = { 10: "puluhan", 100: "ratusan", 1000: "ribuan", 10000: "puluh ribuan", 100000: "ratus ribuan", 1000000: "jutaan" };

/* ---------- Bantuan pembahasan bertahap (langkah) ---------- */
const bJwb = x => `Jadi, jawabannya <b>${x}</b>.`;
/* Jawaban pecahan: bila belum paling sederhana, sebut juga bentuk sederhananya (= kunci) */
const bJwbPc = (p, q) => { const [a, b] = sed(p, q); return a === p && b === q ? bJwb(pcT(p, q)) : `Jadi, jawabannya ${pc(p, q)}, atau dalam bentuk paling sederhana <b>${pcT(a, b)}</b>.`; };
/* Setiap angka dengan nama tempatnya, dari kiri */
const bUrai = n => angkaDari(n).map((d, k) => `${d} (${TEMPAT[k]})`).reverse().join(", ");
/* Nilai angka d yang berada di tempat ke-i (0 = satuan) pada bilangan n */
const bNilai = (n, d, i) => [`Tulis nama tempat setiap angka: ${bUrai(n)}.`, `Angka ${d} ada di tempat <b>${TEMPAT[i]}</b>, nilai tempatnya ${fmt(10 ** i)}.`,
  `Nilai angka = angka × nilai tempat = ${d} × ${fmt(10 ** i)} = ${fmt(d * 10 ** i)}.`, bJwb(fmt(d * 10 ** i))];
/* Angka yang menempati tempat ke-i */
const bTempat = (n, i) => [`Hitung dari kanan: ${TEMPAT.slice(0, String(n).length).join(", ")}.`, `Tulis nama tempat setiap angka: ${bUrai(n)}.`,
  `Tempat ${TEMPAT[i]} adalah urutan ke-${i + 1} dari kanan, angkanya ${angkaDari(n)[i]}.`];
/* Membulatkan */
const B_KANAN = { 10: "satuan", 100: "puluhan", 1000: "ratusan", 10000: "ribuan", 100000: "puluh ribuan", 1000000: "ratus ribuan" };
const bAngkaKanan = (n, k) => Math.floor((n % k) / (k / 10));
function bBulat(n, k) {
  const d = bAngkaKanan(n, k), v = pembulatan(n, k);
  return [`Membulatkan ke ${NAMA_BULAT[k]} terdekat: lihat angka ${B_KANAN[k]}nya (tepat di kanan tempat ${NAMA_BULAT[k]}), yaitu <b>${d}</b>.`,
    d >= 5 ? `${d} ≥ 5, jadi dibulatkan <b>ke atas</b>: ${fmt(n)} ≈ ${fmt(v)}.` : `${d} < 5, jadi dibulatkan <b>ke bawah</b>: ${fmt(n)} ≈ ${fmt(v)}.`];
}
/* Satu kalimat pembulatan, mis. "47 ≈ 50 (angka satuan 7 ≥ 5, naik)" */
const bBulatS = (n, k, f = fmt) => { const d = bAngkaKanan(n, k); return `${f(n)} ≈ ${f(pembulatan(n, k))} (angka ${B_KANAN[k]} ${d} ${d >= 5 ? "≥ 5, dibulatkan ke atas" : "< 5, dibulatkan ke bawah"})`; };
/* Membandingkan dua bilangan cacah */
function bBanding(a, b) {
  const t = a > b ? ">" : a < b ? "<" : "=", sa = String(a), sb = String(b);
  if (a === b) return ["Bandingkan angka demi angka dari kiri: semuanya sama.", `Jadi ${fmt(a)} = ${fmt(b)}.`];
  if (sa.length !== sb.length) return [`${fmt(a)} terdiri atas ${sa.length} angka, ${fmt(b)} terdiri atas ${sb.length} angka.`, `Yang angkanya lebih banyak lebih besar, jadi ${fmt(a)} ${t} ${fmt(b)}.`];
  const k = [...sa].findIndex((c, i) => c !== sb[i]), tmp = TEMPAT[sa.length - 1 - k];
  return [k ? `Bandingkan dari kiri. ${k} angka terdepan sama (${sa.slice(0, k)}).` : `Bandingkan angka paling kiri (${tmp}).`,
    `Angka ${tmp}: ${sa[k]} ${t} ${sb[k]}, jadi ${fmt(a)} ${t} ${fmt(b)}.`];
}
/* Memilih yang terbesar/terkecil */
function bEkstrem(arr, besar) {
  const u = arr.slice().sort((x, y) => x - y), beda = new Set(arr).size === arr.length, j = besar ? u[u.length - 1] : u[0];
  return [`Bandingkan dari angka paling kiri, lalu urutkan dari yang terkecil: ${u.map(fmt).join(beda ? " < " : " ≤ ")}.`,
    `Yang ${besar ? "terbesar ada paling kanan" : "terkecil ada paling kiri"}: ${fmt(j)}.`, bJwb(fmt(j))];
}
/* Menjumlah / mengurang bertahap menurut nilai tempat bilangan kedua */
const bBagian = b => angkaDari(b).map((d, k) => d * 10 ** k).filter(x => x).reverse();
function bTambah(a, b, plus = true) {
  const op = plus ? "+" : "−", ps = bBagian(b);
  if (ps.length < 2) return [`${fmt(a)} ${op} ${fmt(b)} = ${fmt(plus ? a + b : a - b)}.`];
  const L = [`Pecah ${fmt(b)} menurut nilai tempat: ${ps.map(fmt).join(" + ")}.`]; let c = a;
  ps.forEach(p => { const n = plus ? c + p : c - p; L.push(`${fmt(c)} ${op} ${fmt(p)} = ${fmt(n)}.`); c = n; });
  return L;
}
/* Mengali: pecah bilangan yang lebih banyak angkanya (atau bilangan kedua) menurut nilai tempat */
function bKali(a, b) {
  const [x, y] = b < 10 ? [b, a] : [a, b], ps = bBagian(y);
  if (ps.length < 2) return [`${fmt(a)} × ${fmt(b)} = ${fmt(a * b)}.`];
  return [`Pecah ${fmt(y)} = ${ps.map(fmt).join(" + ")}.`, ...ps.map(p => `${fmt(x)} × ${fmt(p)} = ${fmt(x * p)}.`),
    `Jumlahkan: ${ps.map(p => fmt(x * p)).join(" + ")} = ${fmt(a * b)}.`];
}
/* Daftar ringkas: a, a+d, …, b */
const bDeret = (a, b, d) => ((b - a) / d <= 7 ? Array.from({ length: (b - a) / d + 1 }, (_, i) => fmt(a + i * d)).join(", ") : `${fmt(a)}, ${fmt(a + d)}, ${fmt(a + 2 * d)}, …, ${fmt(b)}`);
/* bs/pgk: langkah per pernyataan sesuai urutan tampil; butir punya t, b, a (alasan) */
function bAlasan(s, butir, awal = []) {
  s.langkah = [...awal, ...(s.pernyataan || s.opsi).map(t => { const x = butir.find(y => y.t === t);
    return `${x.b ? "✔" : "✘"} “${String(t).replace(/\.$/, "")}” <b>${x.b ? "benar" : "salah"}</b> karena ${x.a}.`; })];
  return s;
}

/* ================= Misi 1: Nilai tempat ================= */
daftarMisi("bil", "b1", "Nilai tempat & membaca bilangan", "🔟", {
  1: [
    keTKA(() => { const n = bilAcak(3, true), i = acak(0, 2), d = angkaDari(n)[i];
      return pgTetap(`Pada bilangan <b>${fmt(n)}</b>, angka <b>${d}</b> menempati tempat …`, TEMPAT.slice(0, 4), TEMPAT[i],
        { petunjuk: "Hitung dari kanan: satuan, puluhan, ratusan, ribuan.", bahas: `Dari kanan, angka ${d} berada di urutan ke-${i + 1}, yaitu tempat ${TEMPAT[i]}.`,
          langkah: [`Hitung dari kanan: satuan, puluhan, ratusan.`, `Tulis nama tempat setiap angka: ${bUrai(n)}.`, `Angka ${d} ada di urutan ke-${i + 1} dari kanan.`, bJwb(TEMPAT[i])] }); }),
    () => { const n = bilAcak(3, true), i = acak(0, 2), d = angkaDari(n)[i];
      return isian(`Angka yang menempati tempat <b>${TEMPAT[i]}</b> pada bilangan <b>${fmt(n)}</b> adalah …`, d,
        { petunjuk: "Hitung dari kanan: satuan, puluhan, ratusan.", bahas: `Tempat ${TEMPAT[i]} adalah angka ke-${i + 1} dari kanan, yaitu ${d}.`, langkah: [...bTempat(n, i), bJwb(d)] }); },
    () => { const r = acak(1, 9), p = acak(0, 9), s = acak(0, 9);
      return isian(`Bilangan yang terdiri atas <b>${r} ratusan, ${p} puluhan, dan ${s} satuan</b> adalah …`, r * 100 + p * 10 + s,
        { petunjuk: "Ratusan di depan, lalu puluhan, lalu satuan.", bahas: `${r} ratusan = ${r * 100}, ${p} puluhan = ${p * 10}, ${s} satuan = ${s}. Jumlahnya ${r * 100 + p * 10 + s}.`,
          langkah: [`${r} ratusan = ${r} × 100 = ${r * 100}.`, `${p} puluhan = ${p} × 10 = ${p * 10}.`, `${s} satuan = ${s}.`, `Jumlahkan: ${r * 100} + ${p * 10} + ${s} = ${r * 100 + p * 10 + s}.`, bJwb(r * 100 + p * 10 + s)] }); },
  ],
  2: [
    () => { const n = bilAcak(4, true); let i; do i = acak(0, 3); while (angkaDari(n)[i] === 0); const d = angkaDari(n)[i];
      return isian(`Nilai angka <b>${d}</b> pada bilangan <b>${fmt(n)}</b> adalah …`, d * 10 ** i,
        { petunjuk: "Nilai angka = angka itu × nilai tempatnya.", bahas: `Angka ${d} ada di tempat ${TEMPAT[i]}, jadi nilainya ${d} × ${fmt(10 ** i)} = ${fmt(d * 10 ** i)}.`, langkah: bNilai(n, d, i) }); },
    () => { const n = bilAcak(4, true), a = angkaDari(n), i = acak(1, 2), parts = a.map((d, k) => d * 10 ** k).reverse(), j = 3 - i;
      const tampil = parts.map((x, k) => (k === j ? "□" : fmt(x))).join(" + ");
      return isian(`${fmt(n)} = ${tampil}<br>Nilai □ adalah …`, parts[j], { petunjuk: "Uraikan bilangan menurut nilai tempat.", bahas: `${fmt(n)} = ${parts.map(fmt).join(" + ")}.`,
        langkah: [`Tulis nama tempat setiap angka: ${bUrai(n)}.`, `□ ada di urutan ke-${j + 1} dari kiri, yaitu tempat ${TEMPAT[3 - j]}. Angkanya ${a[3 - j]}.`,
          `Nilainya = ${a[3 - j]} × ${fmt(10 ** (3 - j))} = ${fmt(parts[j])}.`, bJwb(fmt(parts[j]))] }); },
    () => { const x = nama(), a = acak(1, 9), b = acak(0, 9), c = acak(0, 9), t = a * 1000 + b * 100 + c * 10;
      return isian(`${x} memiliki ${a} lembar uang Rp1.000, ${b} keping uang Rp100, dan ${c} keping uang Rp10. Jumlah uang ${x} adalah Rp …`, t,
        { petunjuk: "Rp1.000 = ribuan, Rp100 = ratusan, Rp10 = puluhan.", bahas: `${a} × 1.000 + ${b} × 100 + ${c} × 10 = ${fmt(a * 1000)} + ${b * 100} + ${c * 10} = ${fmt(t)}.`,
          langkah: [`${a} lembar Rp1.000 = ${a} × 1.000 = ${fmt(a * 1000)}.`, `${b} keping Rp100 = ${b} × 100 = ${b * 100}.`, `${c} keping Rp10 = ${c} × 10 = ${c * 10}.`,
            `Jumlahkan: ${fmt(a * 1000)} + ${b * 100} + ${c * 10} = ${fmt(t)}.`, bJwb(rp(t))] }); },
    () => { const a = acak(1, 9), p = acak(1, 9), s = acak(0, 9), n = a * 1000 + p * 10 + s;
      return isian(`Bilangan yang terdiri atas <b>${a} ribuan, ${p} puluhan, dan ${s} satuan</b> (tanpa ratusan) adalah …`, n,
        { petunjuk: "Tidak ada ratusan, jadi tempat ratusan diisi 0.", bahas: `${fmt(a * 1000)} + ${p * 10} + ${s} = ${fmt(n)}. Angka ratusannya 0.`,
          langkah: [`${a} ribuan = ${fmt(a * 1000)}; ${p} puluhan = ${p * 10}; ${s} satuan = ${s}.`, "Tidak ada ratusan, jadi angka ratusannya 0.",
            `Jumlahkan: ${fmt(a * 1000)} + ${p * 10} + ${s} = ${fmt(n)}.`, bJwb(fmt(n))] }); },
    () => { const n = bilAcak(4), a = angkaDari(n), i = acak(0, 3), nm = ["satuan", "puluhan", "ratusan", "ribuan"];
      const tampil = [3, 2, 1, 0].map(k => (k === i ? `□ ${nm[k]}` : `${a[k]} ${nm[k]}`)).join(" + ");
      return isian(`${fmt(n)} = ${tampil}<br>Nilai □ adalah …`, a[i], { petunjuk: "Lihat angka di tempat yang ditanyakan.", bahas: `${fmt(n)} = ${[3, 2, 1, 0].map(k => `${a[k]} ${nm[k]}`).join(" + ")}. Jadi □ = ${a[i]}.`,
        langkah: [`Tulis nama tempat setiap angka: ${bUrai(n)}.`, `□ ada di depan kata "${nm[i]}". Angka ${nm[i]} pada ${fmt(n)} adalah ${a[i]}.`, bJwb(a[i])] }); },
    () => { const n = acak(1100, 8899), k = pilih([10, 100, 1000]), lebih = ya(), v = lebih ? n + k : n - k;
      return isian(`Bilangan yang <b>${fmt(k)} ${lebih ? "lebih besar" : "lebih kecil"}</b> daripada ${fmt(n)} adalah …`, v,
        { petunjuk: `${lebih ? "Tambah" : "Kurangi"} angka ${NAMA_BULAT[k]}nya dengan 1.`, bahas: `${fmt(n)} ${lebih ? "+" : "−"} ${fmt(k)} = ${fmt(v)}.`,
          langkah: [`${fmt(k)} ${lebih ? "lebih besar" : "lebih kecil"} artinya ${lebih ? "ditambah" : "dikurangi"} ${fmt(k)}.`, `${fmt(n)} ${lebih ? "+" : "−"} ${fmt(k)} = ${fmt(v)}.`, bJwb(fmt(v))] }); },
  ],
  3: [
    () => { const n = bilAcak(5), a = angkaDari(n).map((d, k) => d * 10 ** k).reverse().filter(x => x);
      return isian(`Hasil dari ${a.map(fmt).join(" + ")} adalah …`, n, { petunjuk: "Tulis tiap angka di tempatnya.", bahas: `Bentuk panjang itu sama dengan ${fmt(n)}.`,
        langkah: [`Setiap suku adalah nilai satu angka: ${a.map(fmt).join(" + ")}.`, "Tempat yang tidak disebut diisi angka 0.", `Tulis angkanya per tempat: ${bUrai(n)}.`, bJwb(fmt(n))] }); },
    () => { const n = bilAcak(5, true); let i; do i = acak(2, 4); while (angkaDari(n)[i] === 0); const d = angkaDari(n)[i];
      return isian(`Nilai angka <b>${d}</b> pada bilangan <b>${fmt(n)}</b> adalah …`, d * 10 ** i, { bahas: `${d} di tempat ${TEMPAT[i]} → ${fmt(d * 10 ** i)}.`, langkah: bNilai(n, d, i) }); },
  ],
  4: [
    () => { const n = bilAcak(6, true), i = acak(2, 5), d = angkaDari(n)[i];
      return isian(`Angka yang menempati tempat <b>${TEMPAT[i]}</b> pada bilangan <b>${fmt(n)}</b> adalah …`, d,
        { petunjuk: "Hitung dari kanan: satuan, puluhan, ratusan, ribuan, puluh ribuan, ratus ribuan.", bahas: `Tempat ${TEMPAT[i]} adalah angka ke-${i + 1} dari kanan, yaitu ${d}.`, langkah: [...bTempat(n, i), bJwb(d)] }); },
    keTKA(() => { const n = bilAcak(6, true); let i; do i = acak(3, 5); while (angkaDari(n)[i] === 0); const d = angkaDari(n)[i];
      return pg(`Nilai angka <b>${d}</b> pada bilangan <b>${fmt(n)}</b> adalah …`, fmt(d * 10 ** i), [d * 10 ** (i - 1), d * 10 ** (i + 1), d * 10 ** (i - 2), d].map(fmt),
        { bahas: `${d} di tempat ${TEMPAT[i]}, nilainya ${fmt(d * 10 ** i)}.`, langkah: bNilai(n, d, i) }); }),
    () => { const n = bilAcak(6, true); let i; do i = acak(3, 5); while (angkaDari(n)[i] === 0); const d = angkaDari(n)[i];
      return isian(`Nilai angka <b>${d}</b> pada bilangan <b>${fmt(n)}</b> adalah …`, d * 10 ** i, { bahas: `${d} di tempat ${TEMPAT[i]}, nilainya ${fmt(d * 10 ** i)}.`, langkah: bNilai(n, d, i) }); },
  ],
  5: [
    keTKA(() => { const s = String(bilAcak(6)).split(""); s[acak(1, 4)] = "0"; const n = +s.join("");
      return pg(`Lambang bilangan dari <i>"${terbilang(n)}"</i> adalah …`, fmt(n), salahTulis(n).map(fmt),
        { petunjuk: "Tulis bagian ribuannya dulu, lalu sisanya tiga angka.", bahas: `${terbilang(n)} = ${fmt(n)}.`, langkah: bLambang(n) }); }),
    keTKA(() => { const s = String(bilAcak(5)).split(""); s[acak(1, 3)] = "0"; const n = +s.join("");
      return pg(`Bilangan <b>${fmt(n)}</b> dibaca …`, terbilang(n), salahTulis(n).map(terbilang), { bahas: `${fmt(n)} dibaca "${terbilang(n)}".`, langkah: bBaca(n) }); }, 7),
    () => { const s = String(bilAcak(6)).split(""); s[acak(1, 4)] = "0"; const n = +s.join("");
      return isian(`Tulis lambang bilangan dari <i>"${terbilang(n)}"</i>.`, n, { petunjuk: "Tulis bagian ribuannya dulu, lalu sisanya selalu tiga angka (pakai 0 bila perlu).", bahas: `${terbilang(n)} = ${fmt(n)}.`, langkah: bLambang(n) }); },
    () => { const a = [acak(1, 9), acak(0, 9), acak(0, 9), acak(0, 9), acak(0, 9), acak(0, 9)], n = +a.join(""), nm = ["ratus ribuan", "puluh ribuan", "ribuan", "ratusan", "puluhan", "satuan"];
      return isian(`Bilangan yang terdiri atas ${a.map((d, i) => `<b>${d} ${nm[i]}</b>`).join(", ")} adalah …`, n, { petunjuk: "Tulis angkanya berurutan dari ratus ribuan sampai satuan.", bahas: `Bilangannya ${fmt(n)}.`,
        langkah: ["Urutan tempat dari kiri: ratus ribuan, puluh ribuan, ribuan, ratusan, puluhan, satuan.", `Isi angkanya: ${a.map((d, i) => `${nm[i]} ${d}`).join(", ")}.`, `Tulis berurutan: ${a.join("")} → ${fmt(n)}.`, bJwb(fmt(n))] }); },
  ],
  6: [
    () => { const n = bilAcak(7, true); let i; do i = acak(4, 6); while (angkaDari(n)[i] === 0); const d = angkaDari(n)[i];
      return isian(`Nilai angka <b>${d}</b> pada bilangan <b>${fmt(n)}</b> adalah …`, d * 10 ** i, { bahas: `${d} di tempat ${TEMPAT[i]}, nilainya ${fmt(d * 10 ** i)}.`, langkah: bNilai(n, d, i) }); },
    () => { const d = acak(2, 9), i = acak(4, 6), j = acak(0, 2), a = angkaDari(bilAcak(7));
      for (let k = 0; k < 7; k++) if (a[k] === d && k !== i && k !== j) a[k] = (d + acak(1, 8)) % 10 || 1;
      a[i] = d; a[j] = d; if (a[6] === 0) a[6] = d === 1 ? 2 : 1; const n = +a.slice().reverse().join("");
      const v = d * 10 ** i - d * 10 ** j;
      return isian(`Pada bilangan <b>${fmt(n)}</b>, selisih nilai angka <b>${d}</b> yang paling kiri dan angka <b>${d}</b> yang paling kanan adalah …`, v,
        { petunjuk: "Cari nilai masing-masing angka, lalu kurangkan.", bahas: `${fmt(d * 10 ** i)} − ${fmt(d * 10 ** j)} = ${fmt(v)}.`,
          langkah: [`Angka ${d} paling kiri ada di tempat ${TEMPAT[i]}, nilainya ${d} × ${fmt(10 ** i)} = ${fmt(d * 10 ** i)}.`,
            `Angka ${d} paling kanan ada di tempat ${TEMPAT[j]}, nilainya ${d} × ${fmt(10 ** j)} = ${fmt(d * 10 ** j)}.`,
            `Selisihnya: ${fmt(d * 10 ** i)} − ${fmt(d * 10 ** j)} = ${fmt(v)}.`, bJwb(fmt(v))] }); },
  ],
  7: [
    () => { const kota = pilih(["Kota Bunga", "Kota Pelangi", "Kabupaten Sejahtera", "Kota Harapan"]), s = String(bilAcak(7)).split(""); s[acak(2, 5)] = "0"; const n = +s.join("");
      return pg(`Jumlah penduduk ${kota} adalah <b>${fmt(n)} jiwa</b>. Cara membaca bilangan tersebut adalah …`, terbilang(n), salahTulis(n).map(terbilang),
        { bahas: `${fmt(n)} dibaca "${terbilang(n)}".`, langkah: bBaca(n) }); },
    () => { const benda = pilih(["Penonton konser", "Pengunjung pameran buku", "Peserta lomba lari", "Pembaca majalah anak"]), n = bilAcak(7, true), i = acak(3, 6), d = angkaDari(n)[i];
      return isian(`${benda} tercatat <b>${fmt(n)} orang</b>. Angka pada tempat <b>${TEMPAT[i]}</b> dari bilangan itu bernilai …`, d * 10 ** i,
        { petunjuk: "Temukan angkanya dulu, lalu kalikan dengan nilai tempatnya.", bahas: `Angka di tempat ${TEMPAT[i]} adalah ${d}, nilainya ${fmt(d * 10 ** i)}.`,
          langkah: [`Tulis nama tempat setiap angka: ${bUrai(n)}.`, `Angka di tempat ${TEMPAT[i]} adalah ${d}.`, `Nilainya = ${d} × ${fmt(10 ** i)} = ${fmt(d * 10 ** i)}.`, bJwb(fmt(d * 10 ** i))] }); },
  ],
  8: [
    () => { const n = bilAcak(7, true), a = angkaDari(n), pos = kocok([0, 1, 2, 3, 4, 5, 6].filter(k => a[k])).slice(0, 3);
      const [i1, i2, i3] = pos, geser = i3 === 6 ? 5 : i3 + 1, benarBaca = ya(), sb = benarBaca ? n : salahTulis(n)[0], i2s = i2 === 6 ? 5 : i2 + 1;
      const butir = [
        { t: `Angka ${a[i1]} bernilai ${fmt(a[i1] * 10 ** i1)}.`, b: true, a: `${a[i1]} ada di tempat ${TEMPAT[i1]}: ${a[i1]} × ${fmt(10 ** i1)} = ${fmt(a[i1] * 10 ** i1)}` },
        ya() ? { t: `Angka ${a[i2]} menempati tempat ${TEMPAT[i2]}.`, b: true, a: `${a[i2]} memang di urutan ke-${i2 + 1} dari kanan, yaitu ${TEMPAT[i2]}` }
          : { t: `Angka ${a[i2]} menempati tempat ${TEMPAT[i2s]}.`, b: false, a: `${a[i2]} ada di urutan ke-${i2 + 1} dari kanan, yaitu ${TEMPAT[i2]}, bukan ${TEMPAT[i2s]}` },
        benarBaca ? { t: `Bilangan itu dibaca "${terbilang(n)}".`, b: true, a: `${fmt(n)} memang dibaca "${terbilang(n)}"` }
          : { t: `Bilangan itu dibaca "${terbilang(sb)}".`, b: false, a: `bacaan itu untuk ${fmt(sb)}, padahal ${fmt(n)} dibaca "${terbilang(n)}"` },
        { t: `Angka ${a[i3]} bernilai ${fmt(a[i3] * 10 ** geser)}.`, b: false, a: `${a[i3]} ada di tempat ${TEMPAT[i3]}, nilainya ${a[i3]} × ${fmt(10 ** i3)} = ${fmt(a[i3] * 10 ** i3)}` },
      ];
      return bAlasan(bs(`Perhatikan bilangan <b>${fmt(n)}</b>. Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan.`, butir,
        { petunjuk: "Periksa satu per satu. Tuliskan nilai tempat di atas setiap angka.", bahas: `Uraian: ${a.map((d, k) => `${d} (${TEMPAT[k]})`).reverse().join(", ")}.` }), butir,
        [`Tulis nama tempat setiap angka: ${bUrai(n)}.`]); },
    () => { const n = bilAcak(7, true), a = angkaDari(n), salah = acak(3, 6), ks = [0, 1, 2, 3, 4, 5, 6].filter(k => a[k]).slice(-4);
      const sah = k => `${a[k]} ada di tempat ${TEMPAT[k]}, nilainya ${a[k]} × ${fmt(10 ** k)} = ${fmt(a[k] * 10 ** k)}`;
      const butir = ks.map(k => (k === salah ? { t: `Nilai angka ${a[k]} adalah ${fmt(a[k] * 10 ** (k - 1))}`, b: false, a: sah(k) } : { t: `Nilai angka ${a[k]} adalah ${fmt(a[k] * 10 ** k)}`, b: true, a: sah(k) }));
      if (butir.every(b => b.b)) butir[0] = { t: `Nilai angka ${a[ks[0]]} adalah ${fmt(a[ks[0]] * 10 ** 9)}`, b: false, a: sah(ks[0]) };
      return bAlasan(pgk(`Pilih <b>semua</b> pernyataan yang benar tentang bilangan <b>${fmt(n)}</b>.`, butir, { bahas: `Uraian: ${a.map((d, k) => fmt(d * 10 ** k)).reverse().join(" + ")}.` }), butir,
        [`Tulis nama tempat setiap angka: ${bUrai(n)}.`]); },
  ],
  9: [
    () => { const kartu = ambil([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 5); if (!kartu.includes(0)) kartu[0] = 0; const besar = ya();
      const urut = kartu.slice().sort((x, y) => (besar ? y - x : x - y)); if (!besar && urut[0] === 0) { const k = urut.findIndex(x => x > 0); [urut[0], urut[k]] = [urut[k], urut[0]]; }
      const n = +urut.join("");
      return isian(`Kartu angka: <b>${kartu.join(", ")}</b>. Setiap kartu dipakai tepat satu kali. Bilangan 5 angka <b>${besar ? "terbesar" : "terkecil"}</b> yang dapat disusun adalah …`, n,
        { petunjuk: besar ? "Taruh angka terbesar paling kiri." : "Angka paling kiri tidak boleh 0!", bahas: `Susunannya ${fmt(n)}.`,
          langkah: besar ? ["Agar terbesar, angka terbesar ditaruh paling kiri, lalu makin kecil ke kanan.", `Urutkan kartu dari besar ke kecil: ${urut.join(", ")}.`, bJwb(fmt(n))]
            : ["Agar terkecil, angka kecil ditaruh di kiri. Tetapi angka paling kiri tidak boleh 0.", `Angka terkecil selain 0 adalah ${urut[0]}, taruh paling kiri.`,
              `Sisanya dari kecil ke besar: ${urut.slice(1).join(", ")}.`, bJwb(fmt(n))] }); },
    () => { const kartu = ambil([1, 2, 3, 4, 5, 6, 7, 8, 9], 4).concat([0]); const b = +kartu.slice().sort((x, y) => y - x).join("");
      const u = kartu.slice().sort((x, y) => x - y); const k = u.findIndex(x => x > 0); [u[0], u[k]] = [u[k], u[0]]; const kc = +u.join("");
      return isian(`Dari kartu <b>${kocok(kartu).join(", ")}</b> (masing-masing dipakai sekali) dibuat bilangan 5 angka terbesar dan terkecil. Selisih kedua bilangan itu adalah …`, b - kc,
        { petunjuk: "Cari dulu bilangan terbesar dan terkecil.", bahas: `Terbesar ${fmt(b)}, terkecil ${fmt(kc)}, selisih ${fmt(b - kc)}.`,
          langkah: [`Terbesar: urutkan kartu dari besar ke kecil → ${fmt(b)}.`, `Terkecil: angka terkecil selain 0 di depan, lalu 0, lalu sisanya dari kecil ke besar → ${fmt(kc)}.`,
            `Selisih: ${fmt(b)} − ${fmt(kc)} = ${fmt(b - kc)}.`, bJwb(fmt(b - kc))] }); },
    () => { const p = acak(1, 4), r = acak(p + 1, 9), ra = pilih([0, r - p]), pu = p + r <= 9 ? p + r : r - p, genap = ya(), s = genap ? 8 : 1;
      const n = p * 10000 + r * 1000 + ra * 100 + pu * 10 + s;
      const petun = [`Angka puluh ribuanku ${p}.`, `Angka ribuanku ${r - p} lebih besar daripada angka puluh ribuanku.`,
        ra === 0 ? "Angka ratusanku nol." : "Angka ratusanku sama dengan selisih angka ribuan dan angka puluh ribuanku.",
        p + r <= 9 ? "Angka puluhanku adalah jumlah angka puluh ribuan dan angka ribuanku." : "Angka puluhanku adalah selisih angka ribuan dan angka puluh ribuanku.",
        genap ? "Angka satuanku adalah angka genap terbesar." : "Angka satuanku adalah angka ganjil terkecil."];
      return isian(`Tebak aku! Aku bilangan 5 angka.<br>${petun.map((t, i) => `${i + 1}) ${t}`).join("<br>")}<br>Aku adalah bilangan …`, n,
        { petunjuk: "Isi tempat satu per satu dari kiri: puluh ribuan, ribuan, ratusan, puluhan, satuan.", bahas: `Puluh ribuan ${p}, ribuan ${r}, ratusan ${ra}, puluhan ${pu}, satuan ${s}. Bilangannya ${fmt(n)}.`,
        langkah: [`Puluh ribuan = ${p}. Ribuan = ${p} + ${r - p} = ${r}.`, `Ratusan = ${ra === 0 ? "0" : `${r} − ${p} = ${ra}`}.`,
          `Puluhan = ${p + r <= 9 ? `${p} + ${r}` : `${r} − ${p}`} = ${pu}. Satuan = ${s} (${genap ? "angka genap terbesar" : "angka ganjil terkecil"}).`,
          `Susun: ${p}, ${r}, ${ra}, ${pu}, ${s} → ${fmt(n)}.`, bJwb(fmt(n))] }); },
    () => { const n = bilAcak(7, true), a = angkaDari(n), i = acak(2, 6), d = a[i]; let e; do e = acak(i === 6 ? 1 : 0, 9); while (e === d);
      const m = n + (e - d) * 10 ** i, sel = Math.abs(e - d) * 10 ** i, salahKetik = ya();
      const teks = salahKetik
        ? `Petugas mencatat jumlah penduduk sebuah kota <b>${fmt(n)} jiwa</b>. Ternyata ada salah ketik: angka <b>${d}</b> di tempat ${TEMPAT[i]} seharusnya angka <b>${e}</b>. Selisih data yang salah dengan data yang benar adalah … jiwa.`
        : `Pada bilangan <b>${fmt(n)}</b>, angka <b>${d}</b> di tempat ${TEMPAT[i]} diganti dengan angka <b>${e}</b>. Bilangan itu menjadi ${e > d ? "lebih besar" : "lebih kecil"} sebanyak …`;
      return isian(teks, sel, { satuan: salahKetik ? "jiwa" : undefined, petunjuk: "Yang berubah hanya nilai angka di tempat itu saja.",
        bahas: `Nilai semula ${fmt(d * 10 ** i)}, nilai baru ${fmt(e * 10 ** i)}. Selisihnya ${fmt(sel)}. Bilangan yang benar/baru: ${fmt(m)}.`,
        langkah: [`Yang berubah hanya angka di tempat ${TEMPAT[i]} (nilai tempat ${fmt(10 ** i)}).`, `Nilai angka ${d}: ${d} × ${fmt(10 ** i)} = ${fmt(d * 10 ** i)}. Nilai angka ${e}: ${e} × ${fmt(10 ** i)} = ${fmt(e * 10 ** i)}.`,
          `Selisih: ${fmt(Math.max(d, e) * 10 ** i)} − ${fmt(Math.min(d, e) * 10 ** i)} = ${fmt(sel)}.`, bJwb(salahKetik ? `${fmt(sel)} jiwa` : fmt(sel))] }); },
    () => { const d = acak(1, 9), i = acak(4, 6), j = acak(0, 2), lain = ambil([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== d), 5), a = [];
      for (let k = 0; k < 7; k++) a.push(k === i || k === j ? d : lain.pop());
      if (a[6] === 0) { const k = [0, 1, 2, 3, 4, 5].find(t => a[t] !== 0 && a[t] !== d); [a[6], a[k]] = [a[k], a[6]]; }
      const n = +a.slice().reverse().join(""), kali = 10 ** (i - j);
      return isian(`Pada bilangan <b>${fmt(n)}</b> terdapat dua angka <b>${d}</b>. Nilai angka ${d} yang paling kiri adalah … kali nilai angka ${d} yang paling kanan.`, kali,
        { petunjuk: "Tulis nilai kedua angka itu, lalu bagi yang besar dengan yang kecil.", bahas: `Nilai angka ${d} paling kiri ${fmt(d * 10 ** i)} (${TEMPAT[i]}), paling kanan ${fmt(d * 10 ** j)} (${TEMPAT[j]}). ${fmt(d * 10 ** i)} : ${fmt(d * 10 ** j)} = ${fmt(kali)}.`,
          langkah: [`Angka ${d} paling kiri ada di tempat ${TEMPAT[i]}: nilainya ${d} × ${fmt(10 ** i)} = ${fmt(d * 10 ** i)}.`, `Angka ${d} paling kanan ada di tempat ${TEMPAT[j]}: nilainya ${d} × ${fmt(10 ** j)} = ${fmt(d * 10 ** j)}.`,
            `Bagi yang besar dengan yang kecil: ${fmt(d * 10 ** i)} : ${fmt(d * 10 ** j)} = ${fmt(kali)}.`, bJwb(fmt(kali))] }); },
    () => { const d = acak(1, 9), i = acak(3, 5), lain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== d);
      const buat = k => { const a = ambil(lain, 7); a[k] = d; if (a[6] === 0) a[6] = pilih(lain.filter(x => x && !a.includes(x))); return +a.slice().reverse().join(""); };
      const posisi = kocok([i, i - 1, i + 1, pilih([i, i - 2]), pilih([i, i - 2, i + 1])]), daftar = new Map();
      for (const k of posisi) { let n; do n = buat(k); while (daftar.has(n)); daftar.set(n, k); }
      const butir = [...daftar].map(([n, k]) => ({ t: fmt(n), b: k === i, a: `angka ${d}-nya di tempat ${TEMPAT[k]}, nilainya ${fmt(d * 10 ** k)}` }));
      return bAlasan(pgk(`Pilih <b>semua</b> bilangan yang angka <b>${d}</b>-nya bernilai <b>${fmt(d * 10 ** i)}</b>.`, butir,
        { petunjuk: `${fmt(d * 10 ** i)} berarti angka ${d} harus berada di tempat ${TEMPAT[i]}.`, bahas: `Angka ${d} bernilai ${fmt(d * 10 ** i)} jika berada di tempat ${TEMPAT[i]} (urutan ke-${i + 1} dari kanan).` }), butir,
        [`${fmt(d * 10 ** i)} = ${d} × ${fmt(10 ** i)}, jadi angka ${d} harus di tempat ${TEMPAT[i]} (urutan ke-${i + 1} dari kanan).`]); },
  ],
  10: [
    () => { const kartu = ambil([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 6), syarat = pilih(["genap", "ganjil", "kelipatan 5"]), besar = ya();
      const cocok = n => (syarat === "genap" ? n % 2 === 0 : syarat === "ganjil" ? n % 2 === 1 : n % 5 === 0);
      let best = null;
      for (const p of permutasi(kartu)) { if (p[0] === 0) continue; const n = +p.join(""); if (cocok(n) && (best === null || (besar ? n > best : n < best))) best = n; }
      if (best === null) return pilih(this_b1_10)();
      return isian(`Kartu angka: <b>${kartu.join(", ")}</b>. Setiap kartu dipakai tepat satu kali untuk membuat bilangan 6 angka. Bilangan <b>${syarat}</b> ${besar ? "terbesar" : "terkecil"} yang dapat dibuat adalah …`, best,
        { petunjuk: `Tentukan dulu angka satuannya agar ${syarat}, lalu susun sisanya.`, bahas: `Jawabannya ${fmt(best)}.`,
          langkah: [`Bilangan ${syarat}: angka satuannya harus ${syarat === "genap" ? "genap (0, 2, 4, 6, 8)" : syarat === "ganjil" ? "ganjil (1, 3, 5, 7, 9)" : "0 atau 5"}.`,
            `Coba setiap kartu yang boleh jadi satuan. Yang menghasilkan bilangan ${besar ? "terbesar" : "terkecil"} adalah satuan <b>${best % 10}</b>.`,
            `Lima kartu sisanya disusun ${besar ? "dari besar ke kecil" : "dari kecil ke besar (angka paling kiri bukan 0)"}: ${String(best).slice(0, 5).split("").join(", ")}.`, bJwb(fmt(best))] }); },
    () => { const kartu = ambil([1, 2, 3, 4, 5, 6, 7, 8, 9], 4), x = pilih([3, 4, 6, 9]), set = new Set();
      for (const p of permutasi(kartu)) { const n = +p.join(""); if (n % x === 0) set.add(n); }
      return isian(`Dari kartu <b>${kartu.join(", ")}</b> disusun bilangan 4 angka (setiap kartu dipakai sekali). Ada berapa bilangan yang <b>habis dibagi ${x}</b>?`, set.size,
        { petunjuk: x === 3 || x === 9 ? `Bilangan habis dibagi ${x} jika jumlah angkanya habis dibagi ${x}.` : `Perhatikan angka-angka terakhirnya.`, bahas: `Ada ${set.size} bilangan.`, langkah: bHabisBagi(kartu, x, set.size) }); },
    () => { const nol = ya(), b = acak(4, 5), kartu = ambil([1, 2, 3, 4, 5, 6, 7, 8, 9], nol ? b - 1 : b).concat(nol ? [0] : []), set = new Set();
      for (const p of permutasi(kartu)) if (p[0] !== 0) set.add(+p.slice(0, 3).join(""));
      const r = nol ? b - 1 : b, rumus = `${r} × ${b - 1} × ${b - 2}`;
      return isian(`Dari ${b} kartu angka <b>${kocok(kartu).join(", ")}</b> akan dibuat bilangan <b>3 angka</b>. Setiap kartu paling banyak dipakai satu kali${nol ? " dan angka paling kiri tidak boleh 0" : ""}. Banyak bilangan berbeda yang dapat dibuat adalah …`, set.size,
        { petunjuk: `Hitung pilihan untuk angka ratusan${nol ? " (bukan 0)" : ""}, lalu puluhan dari kartu sisa, lalu satuan.`, bahas: `Ratusan ${r} pilihan, puluhan ${b - 1} pilihan, satuan ${b - 2} pilihan: ${rumus} = ${set.size} bilangan.`,
          langkah: [`Angka ratusan: ${r} pilihan${nol ? " (semua kartu kecuali 0)" : ""}.`, `Angka puluhan: ${b - 1} pilihan (kartu yang tersisa${nol ? ", 0 boleh" : ""}).`, `Angka satuan: ${b - 2} pilihan (kartu yang masih tersisa).`,
            `Kalikan: ${rumus} = ${set.size}.`, bJwb(set.size)] }); },
    () => { const kartu = ambil([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4), N = acak(3, 8) * 1000 + acak(0, 9) * 100 + acak(0, 99); let best = null;
      for (const p of permutasi(kartu)) { if (p[0] === 0) continue; const n = +p.join(""); if (best === null || Math.abs(n - N) < Math.abs(best - N) || (Math.abs(n - N) === Math.abs(best - N) && n < best)) best = n; }
      if (Math.abs(best - N) === 0) return pilih(this_b1_10)();
      const kembar = [...permutasi(kartu)].filter(p => p[0] !== 0).map(p => +p.join("")).filter(n => n !== best && Math.abs(n - N) === Math.abs(best - N)).length;
      if (kembar) return pilih(this_b1_10)();
      return isian(`Kartu angka: <b>${kartu.join(", ")}</b>. Setiap kartu dipakai tepat satu kali untuk membuat bilangan 4 angka. Bilangan yang <b>paling dekat</b> dengan ${fmt(N)} adalah …`, best,
        { petunjuk: "Pilih angka ribuan yang paling dekat dulu, lalu atur angka sisanya.", bahas: `Bilangan ${fmt(best)} berselisih ${fmt(Math.abs(best - N))} dari ${fmt(N)}, paling kecil di antara semua susunan.`,
          langkah: bDekat(kartu, N, best) }); },
    () => { const d = acak(2, 9), pos = ambil([0, 1, 2, 3, 4, 5], 3).sort((x, y) => x - y), lain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== d), a = [];
      for (let k = 0; k < 7; k++) a.push(pos.includes(k) ? d : pilih(k === 6 ? lain.filter(x => x) : lain));
      const n = +a.slice().reverse().join(""), j = pos.reduce((s, k) => s + d * 10 ** k, 0);
      return isian(`Pada bilangan <b>${fmt(n)}</b> terdapat tiga angka <b>${d}</b>. Jumlah nilai ketiga angka ${d} itu adalah …`, j,
        { petunjuk: "Tentukan nilai setiap angka sesuai tempatnya, lalu jumlahkan.", bahas: `${pos.slice().reverse().map(k => fmt(d * 10 ** k)).join(" + ")} = ${fmt(j)}.`,
          langkah: [`Angka ${d} ada di tempat ${pos.slice().reverse().map(k => TEMPAT[k]).join(", ")}.`, `Nilainya: ${pos.slice().reverse().map(k => `${d} × ${fmt(10 ** k)} = ${fmt(d * 10 ** k)}`).join("; ")}.`,
            `Jumlahkan: ${pos.slice().reverse().map(k => fmt(d * 10 ** k)).join(" + ")} = ${fmt(j)}.`, bJwb(fmt(j))] }); },
  ],
});
const this_b1_10 = [() => isian("Nilai angka 7 pada bilangan 4.738.215 adalah …", 700000, { bahas: "7 di tempat ratus ribuan → 700.000.", langkah: bNilai(4738215, 7, 5) })];
/* Lambang bilangan 6 angka dari bacaannya */
function bLambang(n) {
  const rb = Math.floor(n / 1000), s = n % 1000, tiga = String(s).padStart(3, "0");
  return [`Bagian ribuan: "${terbilang(rb)} ribu" → ${rb}.`,
    s ? `Sisanya: "${terbilang(s)}" → ditulis tiga angka: ${tiga}.` : "Setelah kata \"ribu\" tidak ada lagi, jadi tiga angka terakhir 000.",
    `Gabungkan: ${rb} dan ${tiga} → ${fmt(n)}.`, bJwb(fmt(n))];
}
/* Cara membaca bilangan sampai jutaan */
function bBaca(n) {
  const jt = Math.floor(n / 1e6), rb = Math.floor(n / 1000) % 1000, s = n % 1000, L = [`Pisahkan per tiga angka dari kanan: ${fmt(n)}.`];
  if (jt) L.push(`Kelompok jutaan ${jt} dibaca "${terbilang(jt)} juta".`);
  if (rb) L.push(`Kelompok ribuan ${String(rb).padStart(jt ? 3 : 1, "0")} dibaca "${rb === 1 ? "seribu" : terbilang(rb) + " ribu"}".`); else L.push("Kelompok ribuan 000 tidak dibaca.");
  if (s) L.push(`Kelompok terakhir ${String(s).padStart(3, "0")} dibaca "${terbilang(s)}".`); else L.push("Kelompok terakhir 000 tidak dibaca.");
  L.push(bJwb(terbilang(n)));
  return L;
}
/* Banyak susunan 4 kartu yang habis dibagi x */
function bHabisBagi(kartu, x, c) {
  const S = kartu.reduce((a, b) => a + b, 0);
  if (x === 3 || x === 9) return [`Habis dibagi ${x} jika jumlah angkanya habis dibagi ${x}. Jumlah angka: ${kartu.join(" + ")} = ${S}.`,
    S % x ? `${S} tidak habis dibagi ${x}, jadi tidak ada susunan yang habis dibagi ${x}.` : `${S} habis dibagi ${x}, jadi <b>semua</b> susunan habis dibagi ${x}. Banyak susunan 4 kartu = 4 × 3 × 2 × 1 = 24.`, bJwb(c)];
  if (x === 4) {
    const dua = []; for (const p of kartu) for (const q of kartu) if (p !== q && (10 * p + q) % 4 === 0) dua.push(`${p}${q}`);
    return ["Habis dibagi 4 jika dua angka terakhirnya habis dibagi 4.", `Dua angka terakhir yang mungkin dan habis dibagi 4: ${dua.join(", ") || "tidak ada"}.`,
      `Untuk setiap pasangan, dua kartu sisanya bisa disusun 2 cara: ${dua.length} × 2 = ${dua.length * 2}.`, bJwb(c)];
  }
  const gp = kartu.filter(d => d % 2 === 0);
  return ["Habis dibagi 6 berarti habis dibagi 2 dan habis dibagi 3.", `Jumlah angka: ${kartu.join(" + ")} = ${S}. ${S % 3 ? `${S} tidak habis dibagi 3, jadi tidak ada yang habis dibagi 6.` : `${S} habis dibagi 3, jadi cukup angka satuannya genap.`}`,
    ...(S % 3 ? [] : [`Kartu genap untuk satuan: ${gp.join(", ") || "tidak ada"} (${gp.length} pilihan). Tiga kartu sisanya disusun 3 × 2 × 1 = 6 cara: ${gp.length} × 6 = ${gp.length * 6}.`]), bJwb(c)];
}
/* Susunan 4 kartu yang paling dekat dengan N */
function bDekat(kartu, N, best) {
  const semua = [...permutasi(kartu)].filter(p => p[0] !== 0).map(p => +p.join("")).sort((x, y) => Math.abs(x - N) - Math.abs(y - N) || x - y), kedua = semua.find(n => n !== best);
  return [`Agar dekat dengan ${fmt(N)}, angka ribuannya dibuat sedekat mungkin dengan ${Math.floor(N / 1000)}, lalu atur angka sisanya.`,
    `Susunan terdekat: ${fmt(best)}, selisihnya ${fmt(Math.max(best, N))} − ${fmt(Math.min(best, N))} = ${fmt(Math.abs(best - N))}.`,
    `Susunan terdekat berikutnya, ${fmt(kedua)}, berselisih ${fmt(Math.abs(kedua - N))}, lebih jauh.`, bJwb(fmt(best))];
}

/* ================= Misi 2: Membandingkan & membulatkan ================= */
daftarMisi("bil", "b2", "Membandingkan, mengurutkan, membulatkan", "⚖️", {
  1: [
    keTKA(() => { const a = bilAcak(3), b = ya(0.1) ? a : Math.floor(a / 100) * 100 + acak(0, 99); const t = a > b ? ">" : a < b ? "<" : "=";
      return pgTetap(`${fmt(a)} … ${fmt(b)}<br>Tanda yang tepat adalah …`, [">", "<", "="], t, { petunjuk: "Bandingkan dari angka paling kiri.", bahas: `${fmt(a)} ${t} ${fmt(b)}.`, langkah: [...bBanding(a, b), bJwb(t)] }); }),
    () => { const x = new Set(); while (x.size < 3) x.add(bilAcak(3)); const a = [...x], b = ya(), j = b ? Math.max(...a) : Math.min(...a);
      return isian(`Bilangan <b>${b ? "terbesar" : "terkecil"}</b> di antara ${a.map(fmt).join(", ")} adalah …`, j, { petunjuk: "Bandingkan ratusannya dulu.", bahas: `Jawabannya ${fmt(j)}.`, langkah: bEkstrem(a, b) }); },
    () => { const a = bilAcak(3), b = a + acak(1, 30); return isian(`Selisih ${fmt(b)} dan ${fmt(a)} adalah …`, b - a, { bahas: `${fmt(b)} − ${fmt(a)} = ${b - a}.`,
      langkah: ["Selisih = bilangan besar − bilangan kecil.", ...bTambah(b, a, false), bJwb(fmt(b - a))] }); },
    keTKA(() => { const x = [bilAcak(3), bilAcak(3), bilAcak(3)]; const b = ya(); const j = b ? Math.max(...x) : Math.min(...x);
      return pg(`Bilangan <b>${b ? "terbesar" : "terkecil"}</b> di antara ${x.map(fmt).join(", ")} adalah …`, fmt(j), x.filter(v => v !== j).map(fmt).concat([fmt(j + 1)]),
        { bahas: `Bandingkan ratusannya dulu. Jawabannya ${fmt(j)}.`, langkah: bEkstrem(x, b) }); }),
    () => { const n = acak(101, 998), sesudah = ya();
      return isian(`Bilangan yang tepat ${sesudah ? "<b>sesudah</b>" : "<b>sebelum</b>"} ${fmt(n)} adalah …`, sesudah ? n + 1 : n - 1,
        { petunjuk: sesudah ? "Bilangan sesudah = tambah 1." : "Bilangan sebelum = kurangi 1.", bahas: `${fmt(n)} ${sesudah ? "+" : "−"} 1 = ${fmt(sesudah ? n + 1 : n - 1)}.`,
          langkah: [`Bilangan tepat ${sesudah ? "sesudah" : "sebelum"} artinya ${sesudah ? "ditambah" : "dikurangi"} 1.`, `${fmt(n)} ${sesudah ? "+" : "−"} 1 = ${fmt(sesudah ? n + 1 : n - 1)}.`, bJwb(fmt(sesudah ? n + 1 : n - 1))] }); },
    () => { const [x, y] = namaBeda(2), benda = pilih(["kelereng", "perangko", "stiker", "kartu bergambar", "manik-manik"]), a = bilAcak(3); let b; do b = Math.floor(a / 100) * 100 + acak(0, 99); while (b === a);
      const banyak = ya(), j = banyak ? Math.max(a, b) : Math.min(a, b);
      return isian(`${x} mengumpulkan ${fmt(a)} ${benda}, sedangkan ${y} mengumpulkan ${fmt(b)} ${benda}. Banyak ${benda} milik anak yang mengumpulkan paling <b>${banyak ? "banyak" : "sedikit"}</b> adalah …`, j,
        { satuan: benda, petunjuk: "Angka ratusannya sama, bandingkan puluhannya.", bahas: `${fmt(Math.max(a, b))} > ${fmt(Math.min(a, b))}. Jawabannya ${fmt(j)} ${benda}.`,
          langkah: [...bBanding(Math.max(a, b), Math.min(a, b)), `Yang paling ${banyak ? "banyak" : "sedikit"} adalah ${fmt(j)} ${benda}.`, bJwb(`${fmt(j)} ${benda}`)] }); },
    () => { const x = new Set(); while (x.size < 3) x.add(bilAcak(3)); const a = [...x], u = a.slice().sort((p, q) => p - q);
      return isian(`Bilangan ${a.map(fmt).join(", ")} diurutkan dari yang terkecil. Bilangan yang berada di <b>tengah</b> adalah …`, u[1],
        { petunjuk: "Urutkan dulu ketiga bilangan itu.", bahas: `Urutannya ${u.map(fmt).join(", ")}. Yang di tengah ${fmt(u[1])}.`,
          langkah: ["Bandingkan ratusan, lalu puluhan, lalu satuan.", `Urutan dari yang terkecil: ${u.map(fmt).join(" < ")}.`, `Bilangan di tengah adalah ${fmt(u[1])}.`, bJwb(fmt(u[1]))] }); },
    () => { const d = ambil([1, 2, 3, 4, 5, 6, 7, 8, 9], 3), b = ya(), n = +d.slice().sort((x, y) => (b ? y - x : x - y)).join("");
      return isian(`Dari kartu angka ${d.join(", ")} (masing-masing dipakai sekali) dibuat bilangan 3 angka. Bilangan <b>${b ? "terbesar" : "terkecil"}</b> yang dapat dibuat adalah …`, n,
        { petunjuk: b ? "Taruh angka terbesar paling kiri." : "Taruh angka terkecil paling kiri.", bahas: `Jawabannya ${fmt(n)}.`,
          langkah: [b ? "Agar terbesar, angka terbesar ditaruh paling kiri, lalu makin kecil ke kanan." : "Agar terkecil, angka terkecil ditaruh paling kiri, lalu makin besar ke kanan.",
            `Urutan kartunya: ${String(n).split("").join(", ")}.`, bJwb(fmt(n))] }); },
  ],
  2: [
    () => { const d = ambil([1, 2, 3, 4, 5, 6, 7, 8, 9], 4); const x = new Set(); while (x.size < 4) x.add(+kocok(d).join("")); const arr = [...x], b = ya(), j = b ? Math.max(...arr) : Math.min(...arr);
      return isian(`Bilangan <b>${b ? "terbesar" : "terkecil"}</b> di antara ${arr.map(fmt).join(", ")} adalah …`, j, { petunjuk: "Angkanya sama, bandingkan urutannya dari kiri.", bahas: `Jawabannya ${fmt(j)}.`, langkah: bEkstrem(arr, b) }); },
    () => { const d = ambil([1, 2, 3, 4, 5, 6, 7, 8, 9], 4), b = ya(), n = +d.sort((x, y) => (b ? y - x : x - y)).join("");
      return isian(`Dari angka ${kocok(d).join(", ")} (masing-masing dipakai sekali), bilangan 4 angka <b>${b ? "terbesar" : "terkecil"}</b> yang dapat dibuat adalah …`, n, { bahas: `Jawabannya ${fmt(n)}.`,
        langkah: [b ? "Agar terbesar, angka terbesar ditaruh paling kiri, lalu makin kecil ke kanan." : "Agar terkecil, angka terkecil ditaruh paling kiri, lalu makin besar ke kanan.",
          `Urutan angkanya: ${d.join(", ")}.`, bJwb(fmt(n))] }); },
    keTKA(() => { const a = bilAcak(4), b = a + pilih([-1, 1]) * acak(1, 9) * pilih([1, 10, 100]); const t = a > b ? ">" : "<";
      return pgTetap(`${fmt(a)} … ${fmt(b)}`, [">", "<", "="], t, { bahas: `${fmt(a)} ${t} ${fmt(b)}.`, langkah: [...bBanding(a, b), bJwb(t)] }); }),
  ],
  3: [
    () => { const n = acak(10, 999) * 10 + pilih([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      return isian(`Hasil pembulatan <b>${fmt(n)}</b> ke <b>puluhan terdekat</b> adalah …`, pembulatan(n, 10), { petunjuk: "Lihat angka satuannya: 5 ke atas dibulatkan ke atas.", bahas: `Angka satuan ${n % 10} → ${n % 10 >= 5 ? "naik" : "tetap"}. Hasilnya ${fmt(pembulatan(n, 10))}.`,
        langkah: [...bBulat(n, 10), bJwb(fmt(pembulatan(n, 10)))] }); },
    () => { let n; do n = acak(110, 989); while (n % 100 === 0);
      return isian(`Hasil pembulatan <b>${fmt(n)}</b> ke <b>ratusan terdekat</b> adalah …`, pembulatan(n, 100),
        { petunjuk: "Lihat angka puluhannya: 5 ke atas dibulatkan ke atas.", bahas: `Angka puluhan ${Math.floor(n / 10) % 10} → ${Math.floor(n / 10) % 10 >= 5 ? "naik" : "tetap"}. ${fmt(n)} ≈ ${fmt(pembulatan(n, 100))}.`,
          langkah: [...bBulat(n, 100), bJwb(fmt(pembulatan(n, 100)))] }); },
    () => { const [hal, sat] = pilih([["Tinggi pohon mangga di halaman sekolah", "cm"], ["Berat karung beras di toko", "kg"], ["Jarak rumah Dina ke sekolah", "m"], ["Banyak siswa di SD Harapan", "siswa"], ["Banyak buku di rak kelas", "buku"]]);
      let n; do n = acak(41, 489); while (n % 10 === 0);
      return isian(`${hal} adalah ${fmt(n)} ${sat}. Jika dibulatkan ke <b>puluhan terdekat</b>, hasilnya kira-kira …`, pembulatan(n, 10),
        { satuan: sat, petunjuk: "Lihat angka satuannya.", bahas: `Angka satuan ${n % 10} → ${n % 10 >= 5 ? "naik" : "tetap"}. ${fmt(n)} ≈ ${fmt(pembulatan(n, 10))} ${sat}.`,
          langkah: [...bBulat(n, 10), bJwb(`${fmt(pembulatan(n, 10))} ${sat}`)] }); },
    () => { let a, b; do { a = acak(12, 89); b = acak(12, 89); } while (a % 10 === 0 || b % 10 === 0); const A = pembulatan(a, 10), B = pembulatan(b, 10);
      return isian(`Taksiran hasil <b>${a} + ${b}</b> dengan membulatkan setiap bilangan ke puluhan terdekat adalah …`, A + B,
        { petunjuk: "Bulatkan dulu setiap bilangan, baru jumlahkan.", bahas: `${a} ≈ ${A} dan ${b} ≈ ${B}. Taksirannya ${A} + ${B} = ${A + B}.`,
          langkah: [`Bulatkan bilangan pertama: ${bBulatS(a, 10)}.`, `Bulatkan bilangan kedua: ${bBulatS(b, 10)}.`, `Jumlahkan hasil pembulatannya: ${A} + ${B} = ${A + B}.`, bJwb(A + B)] }); },
    () => { const X = acak(2, 49) * 10, kecil = ya();
      return isian(`Bilangan cacah <b>${kecil ? "terkecil" : "terbesar"}</b> yang jika dibulatkan ke puluhan terdekat menjadi <b>${X}</b> adalah …`, kecil ? X - 5 : X + 4,
        { petunjuk: "Satuan 5 ke atas dibulatkan naik, satuan 4 ke bawah dibulatkan turun.", bahas: `Bilangan ${X - 5} sampai ${X + 4} dibulatkan menjadi ${X}. Jawabannya ${kecil ? X - 5 : X + 4}.`,
          langkah: [`Dari bawah: ${X - 5} punya satuan 5, jadi dibulatkan naik ke ${X}. (${X - 6} turun ke ${X - 10}.)`, `Dari atas: ${X + 4} punya satuan 4, jadi dibulatkan turun ke ${X}. (${X + 5} naik ke ${X + 10}.)`,
            `Jadi bilangan ${X - 5} sampai ${X + 4} dibulatkan menjadi ${X}. Yang ${kecil ? "terkecil" : "terbesar"}: ${kecil ? X - 5 : X + 4}.`, bJwb(kecil ? X - 5 : X + 4)] }); },
  ],
  4: [
    () => { const k = pilih([100, 1000]), n = acak(1000, 99999); if (n % k === 0) return isian(`Pembulatan ${fmt(n + 37)} ke ratusan terdekat adalah …`, pembulatan(n + 37, 100), { bahas: "Lihat angka puluhannya.", langkah: [...bBulat(n + 37, 100), bJwb(fmt(pembulatan(n + 37, 100)))] });
      return isian(`Hasil pembulatan <b>${fmt(n)}</b> ke <b>${NAMA_BULAT[k]} terdekat</b> adalah …`, pembulatan(n, k), { petunjuk: `Lihat angka di kanan tempat ${NAMA_BULAT[k]}.`, bahas: `${fmt(n)} ≈ ${fmt(pembulatan(n, k))}.`,
        langkah: [...bBulat(n, k), bJwb(fmt(pembulatan(n, k)))] }); },
    () => { const b = pilih(["sepatu", "tas sekolah", "jaket", "boneka", "mainan mobil", "kotak bekal"]); let h; do h = acak(15, 95) * 1000 + acak(1, 9) * 100 + pilih([0, 50]); while (h % 1000 === 0);
      return isian(`Harga sebuah ${b} adalah ${rp(h)}. Jika dibulatkan ke <b>ribuan terdekat</b>, harganya kira-kira Rp …`, pembulatan(h, 1000),
        { petunjuk: "Lihat angka ratusannya: 5 ke atas dibulatkan naik.", bahas: `Angka ratusan ${Math.floor((h % 1000) / 100)} → ${h % 1000 >= 500 ? "naik" : "tetap"}. ${rp(h)} ≈ ${rp(pembulatan(h, 1000))}.`,
          langkah: [...bBulat(h, 1000), bJwb(rp(pembulatan(h, 1000)))] }); },
    () => { let a, b; do { a = acak(110, 890); b = acak(110, 890); } while (a % 100 === 0 || b % 100 === 0 || a % 100 === 50 || b % 100 === 50); const A = pembulatan(a, 100), B = pembulatan(b, 100);
      return isian(`Taksiran hasil <b>${a} + ${b}</b> dengan membulatkan setiap bilangan ke ratusan terdekat adalah …`, A + B,
        { petunjuk: "Bulatkan dulu setiap bilangan ke ratusan, baru jumlahkan.", bahas: `${a} ≈ ${A} dan ${b} ≈ ${B}. Taksirannya ${A} + ${B} = ${fmt(A + B)}.`,
          langkah: [`Bulatkan bilangan pertama: ${bBulatS(a, 100)}.`, `Bulatkan bilangan kedua: ${bBulatS(b, 100)}.`, `Jumlahkan hasil pembulatannya: ${A} + ${B} = ${fmt(A + B)}.`, bJwb(fmt(A + B))] }); },
    () => { const x = new Set(); while (x.size < 3) x.add(bilAcak(4)); const a = [...x], s = Math.max(...a) - Math.min(...a);
      return isian(`Selisih bilangan terbesar dan terkecil di antara ${a.map(fmt).join(", ")} adalah …`, s,
        { petunjuk: "Temukan yang terbesar dan terkecil dulu, lalu kurangkan.", bahas: `Terbesar ${fmt(Math.max(...a))}, terkecil ${fmt(Math.min(...a))}. ${fmt(Math.max(...a))} − ${fmt(Math.min(...a))} = ${fmt(s)}.`,
          langkah: [`Urutkan: ${a.slice().sort((p, q) => p - q).map(fmt).join(" < ")}.`, `Terbesar ${fmt(Math.max(...a))}, terkecil ${fmt(Math.min(...a))}.`, `Selisih: ${fmt(Math.max(...a))} − ${fmt(Math.min(...a))} = ${fmt(s)}.`, bJwb(fmt(s))] }); },
  ],
  5: [
    () => { const d = acak(1, 8), x = new Set(); while (x.size < 4) x.add(d * 10000 + acak(0, 9999)); const arr = [...x], urut = arr.slice().sort((a, b) => a - b), k = acak(2, 3), besar = ya();
      return isian(`Bilangan ${arr.map(fmt).join(", ")} diurutkan dari yang <b>${besar ? "terbesar" : "terkecil"}</b>. Bilangan pada urutan ke-${k} adalah …`, besar ? urut[4 - k] : urut[k - 1], { petunjuk: "Bandingkan ribuan, lalu ratusan, dan seterusnya.", bahas: `Urutannya ${(besar ? urut.slice().reverse() : urut).map(fmt).join("; ")}.`,
        langkah: [`Semua bilangan punya angka puluh ribuan ${d}, jadi bandingkan mulai dari ribuan.`, `Urutan dari yang ${besar ? "terbesar" : "terkecil"}: ${(besar ? urut.slice().reverse() : urut).map(fmt).join(besar ? " > " : " < ")}.`,
          `Urutan ke-${k}: ${fmt(besar ? urut[4 - k] : urut[k - 1])}.`, bJwb(fmt(besar ? urut[4 - k] : urut[k - 1]))] }); },
    keTKA(() => { const d = acak(1, 8), x = new Set(); while (x.size < 4) x.add(d * 10000 + acak(0, 9999)); const arr = [...x], benar = arr.slice().sort((a, b) => a - b);
      const salah = []; while (salah.length < 3) { const p = kocok(arr); if (p.join() !== benar.join() && !salah.some(s => s.join() === p.join())) salah.push(p); }
      return pg(`Urutan bilangan dari yang <b>terkecil</b> adalah …`, benar.map(fmt).join("; "), salah.map(s => s.map(fmt).join("; ")), { petunjuk: "Bandingkan ribuan, lalu ratusan, dan seterusnya.", bahas: `Urutannya ${benar.map(fmt).join(" < ")}.`,
        langkah: [`Bilangannya: ${arr.map(fmt).join(", ")}. Semua punya angka puluh ribuan ${d}.`, "Bandingkan ribuan, lalu ratusan, puluhan, dan satuan.", `Dari yang terkecil: ${benar.map(fmt).join(" < ")}.`, bJwb(benar.map(fmt).join("; "))] }); }),
    () => { const nm = ambil(["Gunung Sinar", "Gunung Pelangi", "Gunung Awan", "Gunung Bintang", "Gunung Embun", "Gunung Fajar"], 4), x = new Set(); while (x.size < 4) x.add(acak(2500, 3900));
      const t = [...x], u = t.slice().sort((p, q) => q - p), k = acak(2, 3);
      return isian(`Tinggi empat gunung: ${nm.map((g, i) => `${g} ${fmt(t[i])} m`).join(", ")}. Tinggi gunung yang berada di urutan <b>ke-${k}</b> dari yang tertinggi adalah …`, u[k - 1],
        { satuan: "m", petunjuk: "Urutkan dari yang tertinggi.", bahas: `Urutannya ${u.map(fmt).join(" > ")}. Urutan ke-${k}: ${fmt(u[k - 1])} m.`,
          langkah: ["Bandingkan ribuan, lalu ratusan, puluhan, dan satuan.", `Urutan dari yang tertinggi: ${u.map(fmt).join(" > ")}.`, `Urutan ke-${k}: ${fmt(u[k - 1])} m.`, bJwb(`${fmt(u[k - 1])} m`)] }); },
    () => { let a, b; do { a = acak(3100, 9800); b = acak(1100, a - 600); } while (a % 100 === 50 || b % 100 === 50); const A = pembulatan(a, 100), B = pembulatan(b, 100);
      return isian(`Taksiran hasil <b>${fmt(a)} − ${fmt(b)}</b> dengan membulatkan setiap bilangan ke ratusan terdekat adalah …`, A - B,
        { petunjuk: "Bulatkan dulu setiap bilangan, baru kurangkan.", bahas: `${fmt(a)} ≈ ${fmt(A)} dan ${fmt(b)} ≈ ${fmt(B)}. ${fmt(A)} − ${fmt(B)} = ${fmt(A - B)}.`,
          langkah: [`Bulatkan bilangan pertama: ${bBulatS(a, 100)}.`, `Bulatkan bilangan kedua: ${bBulatS(b, 100)}.`, `Kurangkan hasil pembulatannya: ${fmt(A)} − ${fmt(B)} = ${fmt(A - B)}.`, bJwb(fmt(A - B))] }); },
    () => { const k = pilih([10000, 100000]); let n; do n = acak(100000, 999999); while (n % k === 0);
      return isian(`Hasil pembulatan <b>${fmt(n)}</b> ke <b>${NAMA_BULAT[k]} terdekat</b> adalah …`, pembulatan(n, k),
        { petunjuk: `Lihat angka tepat di sebelah kanan tempat ${NAMA_BULAT[k]}.`, bahas: `Angka di kanannya ${Math.floor((n % k) / (k / 10))} → ${Math.floor((n % k) / (k / 10)) >= 5 ? "naik" : "tetap"}. ${fmt(n)} ≈ ${fmt(pembulatan(n, k))}.`,
          langkah: [...bBulat(n, k), bJwb(fmt(pembulatan(n, k)))] }); },
    () => { const d = ambil([1, 2, 3, 4, 5, 6, 7, 8, 9], 4).concat([0]), u = d.slice().sort((x, y) => x - y); [u[0], u[1]] = [u[1], u[0]]; const n = +u.join("");
      return isian(`Dari kartu angka ${kocok(d).join(", ")} (masing-masing dipakai sekali) dibuat bilangan 5 angka. Bilangan <b>terkecil</b> yang dapat dibuat adalah …`, n,
        { petunjuk: "Angka paling kiri tidak boleh 0. Letakkan 0 di tempat kedua.", bahas: `Angka terkecil selain 0 di depan, lalu 0, lalu sisanya dari kecil ke besar: ${fmt(n)}.`,
          langkah: [`Angka paling kiri tidak boleh 0. Pakai angka terkecil selain 0, yaitu ${u[0]}.`, `Berikutnya 0, lalu sisanya dari kecil ke besar: ${u.slice(1).join(", ")}.`, bJwb(fmt(n))] }); },
  ],
  6: [
    () => { const k = pilih([10000, 100000, 1000000]), n = acak(1000000, 9999999);
      return isian(`Hasil pembulatan <b>${fmt(n)}</b> ke <b>${NAMA_BULAT[k]} terdekat</b> adalah …`, pembulatan(n, k), { bahas: `${fmt(n)} ≈ ${fmt(pembulatan(n, k))}.`, langkah: [...bBulat(n, k), bJwb(fmt(pembulatan(n, k)))] }); },
  ],
  7: [
    () => { const a = acak(1100, 9800), b = acak(1100, 9800), op = ya() ? "+" : "−"; const [x, y] = op === "−" && a < b ? [b, a] : [a, b];
      const h = op === "+" ? pembulatan(x, 1000) + pembulatan(y, 1000) : pembulatan(x, 1000) - pembulatan(y, 1000);
      return isian(`Taksiran hasil <b>${fmt(x)} ${op} ${fmt(y)}</b> dengan membulatkan setiap bilangan ke <b>ribuan terdekat</b> adalah …`, h,
        { petunjuk: "Bulatkan dulu tiap bilangan, baru hitung.", bahas: `${fmt(pembulatan(x, 1000))} ${op} ${fmt(pembulatan(y, 1000))} = ${fmt(h)}.`,
          langkah: [`Bulatkan bilangan pertama: ${bBulatS(x, 1000)}.`, `Bulatkan bilangan kedua: ${bBulatS(y, 1000)}.`, `${op === "+" ? "Jumlahkan" : "Kurangkan"}: ${fmt(pembulatan(x, 1000))} ${op} ${fmt(pembulatan(y, 1000))} = ${fmt(h)}.`, bJwb(fmt(h))] }); },
    () => { const harga = [acak(18, 49) * 1000 + acak(1, 9) * 100, acak(18, 49) * 1000 + acak(1, 9) * 100, acak(18, 49) * 1000 + acak(1, 9) * 100]; const h = harga.reduce((s, x) => s + pembulatan(x, 1000), 0);
      return isian(`Ibu membeli tiga barang seharga ${harga.map(rp).join(", ")}. Jika setiap harga dibulatkan ke ribuan terdekat, taksiran jumlah belanja Ibu adalah Rp …`, h,
        { bahas: `${harga.map(x => rp(pembulatan(x, 1000))).join(" + ")} = ${rp(h)}.`,
          langkah: [...harga.map((x, i) => `Harga ke-${i + 1}: ${bBulatS(x, 1000, rp)}.`), `Jumlahkan: ${harga.map(x => rp(pembulatan(x, 1000))).join(" + ")} = ${rp(h)}.`, bJwb(rp(h))] }); },
    () => { const [hal, sat] = pilih([["Pengunjung museum selama satu tahun", "orang"], ["Jumlah buku di perpustakaan daerah", "buku"], ["Penonton pertandingan sepak bola", "orang"], ["Panjang jalan tol yang baru dibangun", "meter"], ["Hasil panen padi sebuah desa", "kg"]]);
      const k = pilih([100, 1000, 10000]); let n = acak(10000, 99999); if (n % k === 0) n += acak(1, 9) * (k / 10) + 1;
      return isian(`${hal} adalah <b>${fmt(n)} ${sat}</b>. Dalam laporan, bilangan itu dibulatkan ke <b>${NAMA_BULAT[k]} terdekat</b>. Bilangan yang ditulis dalam laporan adalah …`, pembulatan(n, k),
        { satuan: sat, petunjuk: `Lihat angka tepat di sebelah kanan tempat ${NAMA_BULAT[k]}.`, bahas: `Angka di kanan tempat ${NAMA_BULAT[k]} adalah ${Math.floor((n % k) / (k / 10))}, ${Math.floor((n % k) / (k / 10)) >= 5 ? "dibulatkan ke atas" : "dibulatkan ke bawah"}. ${fmt(n)} ≈ ${fmt(pembulatan(n, k))}.`,
          langkah: [...bBulat(n, k), bJwb(`${fmt(pembulatan(n, k))} ${sat}`)] }); },
    () => { let a, b; do { a = acak(21, 89); b = acak(21, 89); } while (a % 10 === 0 || b % 10 === 0 || a % 10 === 5 || b % 10 === 5);
      const A = pembulatan(a, 10), B = pembulatan(b, 10), [w, isi] = pilih([["bus", "penumpang"], ["kardus", "buku"], ["rak", "botol"], ["keranjang", "telur"], ["kelas", "siswa"]]);
      return isian(`Ada ${a} ${w}. Setiap ${w} berisi ${b} ${isi}. Dengan membulatkan setiap bilangan ke <b>puluhan terdekat</b>, taksiran banyak ${isi} seluruhnya adalah …`, A * B,
        { satuan: isi, petunjuk: "Bulatkan kedua bilangan dulu, baru kalikan.", bahas: `${a} ≈ ${A} dan ${b} ≈ ${B}. Taksirannya ${A} × ${B} = ${fmt(A * B)} ${isi}.`,
          langkah: [`Banyak ${w}: ${bBulatS(a, 10)}.`, `Isi setiap ${w}: ${bBulatS(b, 10)}.`, `Kalikan: ${A} × ${B} = ${fmt(A * B)}.`, bJwb(`${fmt(A * B)} ${isi}`)] }); },
    () => { const X = acak(20, 98) * 100, sama = new Set(); while (sama.size < 3) sama.add(X - 50 + acak(0, 99)); const beda = ya() ? X - acak(51, 85) : X + acak(50, 85);
      return pg(`Tiga bilangan berikut jika dibulatkan ke <b>ratusan terdekat</b> hasilnya sama, tetapi satu bilangan hasilnya <b>berbeda</b>. Bilangan yang berbeda itu adalah …`, fmt(beda), [...sama].map(fmt),
        { petunjuk: "Bulatkan setiap bilangan, lalu bandingkan hasilnya.", bahas: `${[...sama].map(fmt).join(", ")} dibulatkan menjadi ${fmt(X)}, sedangkan ${fmt(beda)} dibulatkan menjadi ${fmt(pembulatan(beda, 100))}.`,
          langkah: [...[...sama].map(v => `${bBulatS(v, 100)}.`), `${bBulatS(beda, 100)} → hasilnya berbeda.`, bJwb(fmt(beda))] }); },
  ],
  8: [
    () => { const X = acak(12, 89) * 1000; const c = [X - 500, X + 499, X - acak(1, 499), X + acak(1, 498), X + 500, X - 501, X - acak(600, 900)];
      const butir = ambil(c, 5).map(v => ({ t: fmt(v), b: pembulatan(v, 1000) === X, a: pembulatan(v, 1000) === X ? `${fmt(v)} ada di antara ${fmt(X - 500)} dan ${fmt(X + 499)} (angka ratusan ${bAngkaKanan(v, 1000)})` : `${bBulatS(v, 1000)} menjadi ${fmt(pembulatan(v, 1000))}` }));
      return bAlasan(pgk(`Pilih <b>semua</b> bilangan yang jika dibulatkan ke ribuan terdekat menjadi <b>${fmt(X)}</b>.`, butir,
        { petunjuk: `Bilangan itu harus di antara ${fmt(X - 500)} dan ${fmt(X + 499)}.`, bahas: `Bilangan dari ${fmt(X - 500)} sampai ${fmt(X + 499)} dibulatkan menjadi ${fmt(X)}.` }), butir,
        [`Bilangan dari ${fmt(X - 500)} sampai ${fmt(X + 499)} dibulatkan menjadi ${fmt(X)} (lihat angka ratusannya).`]); },
    () => { const hari = ["Senin", "Selasa", "Rabu", "Kamis"], v = hari.map(() => acak(12000, 13999)); const t = Math.max(...v), h = hari[v.indexOf(t)];
      return pg(`Pengunjung taman bermain: ${hari.map((x, i) => `${x} ${fmt(v[i])} orang`).join(", ")}. Hari dengan pengunjung <b>paling banyak</b> adalah …`, h, hari.filter(x => x !== h), { bahas: `${fmt(t)} adalah yang terbesar.`,
        langkah: ["Semua bilangan berangka puluh ribuan 1. Bandingkan mulai dari ribuan.", `Urutkan dari yang terbanyak: ${hari.map((x, i) => [x, v[i]]).sort((p, q) => q[1] - p[1]).map(([x, n]) => `${fmt(n)} (${x})`).join(" ≥ ")}.`,
          `Paling banyak ${fmt(t)} orang, yaitu hari ${h}.`, bJwb(h)] }); },
    () => { const n = acak(100000, 999999), flag = kocok([true, false, ya(), ya()]);
      const butir = [100, 1000, 10000, 100000].map((k, i) => { const v = pembulatan(n, k), bawah = Math.floor(n / k) * k, salah = bawah !== v ? bawah : v + k, d = bAngkaKanan(n, k);
        return { t: `Jika dibulatkan ke ${NAMA_BULAT[k]} terdekat, hasilnya ${fmt(flag[i] ? v : salah)}.`, b: flag[i],
          a: `angka ${B_KANAN[k]}nya ${d} (${d >= 5 ? "≥ 5, dibulatkan ke atas" : "< 5, dibulatkan ke bawah"}), jadi hasilnya ${fmt(v)}${flag[i] ? "" : `, bukan ${fmt(salah)}`}` }; });
      return bAlasan(bs(`Perhatikan bilangan <b>${fmt(n)}</b>. Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan.`, butir,
        { petunjuk: "Untuk setiap pembulatan, lihat angka tepat di sebelah kanan tempat yang diminta.", bahas: [100, 1000, 10000, 100000].map(k => `ke ${NAMA_BULAT[k]}: ${fmt(pembulatan(n, k))}`).join("; ") + "." }), butir); },
    () => { const depan = acak(1, 8) * 1000000 + acak(0, 9) * 100000, x = new Set(); while (x.size < 4) x.add(depan + acak(0, 99999));
      const kab = ["A", "B", "C", "D"], v = [...x], benar = kab.slice().sort((p, q) => v[kab.indexOf(q)] - v[kab.indexOf(p)]).join(", ");
      const salah = []; while (salah.length < 3) { const p = kocok(kab).join(", "); if (p !== benar && !salah.includes(p)) salah.push(p); }
      return pg(`Jumlah penduduk empat kabupaten: ${kab.map((k, i) => `Kabupaten ${k} ${fmt(v[i])} jiwa`).join("; ")}. Urutan kabupaten dari penduduk <b>terbanyak</b> sampai paling sedikit adalah …`, benar, salah,
        { petunjuk: "Dua angka terdepannya sama. Bandingkan mulai dari tempat puluh ribuan.", bahas: `${kab.map((k, i) => [k, v[i]]).sort((p, q) => q[1] - p[1]).map(([k, n]) => `${k} (${fmt(n)})`).join(" > ")}.`,
          langkah: ["Angka jutaan dan ratus ribuannya sama. Bandingkan mulai dari puluh ribuan.", `Urutan dari yang terbanyak: ${kab.map((k, i) => [k, v[i]]).sort((p, q) => q[1] - p[1]).map(([k, n]) => `${fmt(n)} (${k})`).join(" > ")}.`, bJwb(benar)] }); },
    () => { const brg = ambil(["buku cerita", "kotak pensil", "botol minum", "topi", "kaus kaki", "tas kecil"], 3), h = brg.map(() => acak(12, 45) * 1000 + acak(1, 9) * 100);
      const S = h.reduce((s, x) => s + x, 0), T = h.reduce((s, x) => s + pembulatan(x, 1000), 0), U = ya() ? Math.ceil(S / 10000) * 10000 : Math.floor(S / 10000) * 10000;
      const bT = ya(), bS = ya(), Tsalah = T + pilih([-1000, 1000]), Ssalah = S + pilih([-1, 1]) * acak(1, 9) * 100;
      const butir = [
        { t: `Taksiran jumlah harga (setiap harga dibulatkan ke ribuan terdekat) adalah ${rp(bT ? T : Tsalah)}.`, b: bT, a: `${h.map(x => rp(pembulatan(x, 1000))).join(" + ")} = ${rp(T)}` },
        { t: `Jumlah harga yang sebenarnya adalah ${rp(bS ? S : Ssalah)}.`, b: bS, a: `${h.map(rp).join(" + ")} = ${rp(S)}` },
        { t: `Uang ${rp(U)} cukup untuk membeli ketiga barang itu.`, b: S <= U, a: `harga sebenarnya ${rp(S)} ${S <= U ? "tidak lebih dari" : "lebih dari"} ${rp(U)}` },
        { t: `Taksiran jumlah harga lebih besar daripada jumlah harga sebenarnya.`, b: T > S, a: `${rp(T)} ${T > S ? ">" : T < S ? "<" : "="} ${rp(S)}` },
      ];
      return bAlasan(bs(`Kakak ingin membeli ${brg.map((b, i) => `${b} seharga ${rp(h[i])}`).join(", ")}. Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan.`, butir,
        { petunjuk: "Hitung taksiran dan jumlah sebenarnya, lalu bandingkan.", bahas: `Taksiran: ${h.map(x => rp(pembulatan(x, 1000))).join(" + ")} = ${rp(T)}. Sebenarnya: ${rp(S)}. ${S <= U ? "Uang cukup" : "Uang tidak cukup"}.` }), butir); },
  ],
  9: [
    () => { const k = pilih([100, 1000]), X = acak(12, 98) * k * (k === 100 ? 1 : 1), kecil = ya();
      const v = kecil ? X - k / 2 : X + k / 2 - 1;
      return isian(`Bilangan cacah <b>${kecil ? "terkecil" : "terbesar"}</b> yang jika dibulatkan ke ${NAMA_BULAT[k]} terdekat menjadi <b>${fmt(X)}</b> adalah …`, v,
        { petunjuk: `Ingat: setengah dari ${fmt(k)} adalah ${fmt(k / 2)}.`, bahas: `Bilangan dari ${fmt(X - k / 2)} sampai ${fmt(X + k / 2 - 1)} dibulatkan menjadi ${fmt(X)}. Jawabannya ${fmt(v)}.`,
          langkah: [`Setengah dari ${fmt(k)} adalah ${fmt(k / 2)}. Angka ${B_KANAN[k]} 5 ke atas dibulatkan naik.`, `${fmt(X - k / 2)} dibulatkan naik ke ${fmt(X)}, dan ${fmt(X + k / 2 - 1)} dibulatkan turun ke ${fmt(X)}.`,
            `Jadi bilangan dari ${fmt(X - k / 2)} sampai ${fmt(X + k / 2 - 1)} menjadi ${fmt(X)}. Yang ${kecil ? "terkecil" : "terbesar"}: ${fmt(v)}.`, bJwb(fmt(v))] }); },
  ],
  10: [
    () => { const X = acak(20, 98) * 100, sy = pilih(["ganjil", "genap", "kelipatan 3", "kelipatan 4"]);
      const f = { ganjil: n => n % 2 === 1, genap: n => n % 2 === 0, "kelipatan 3": n => n % 3 === 0, "kelipatan 4": n => n % 4 === 0 }[sy];
      let c = 0; for (let n = X - 50; n <= X + 49; n++) if (f(n)) c++;
      return isian(`Ada berapa bilangan <b>${sy}</b> yang jika dibulatkan ke ratusan terdekat hasilnya <b>${fmt(X)}</b>?`, c,
        { petunjuk: `Tentukan dulu batasnya: dari ${fmt(X - 50)} sampai ${fmt(X + 49)}.`, bahas: `Dari ${fmt(X - 50)} sampai ${fmt(X + 49)} ada ${c} bilangan ${sy}.`, langkah: bHitungRentang(X, sy, f, c) }); },
    () => { const X = acak(2, 9) * 1000 + acak(1, 9) * 100, J = acak(10, 22); let c = 0;
      for (let n = X - 50; n <= X + 49; n++) if (String(n).split("").reduce((s, d) => s + +d, 0) === J) c++;
      if (!c) return isian(`Bilangan cacah terkecil yang dibulatkan ke ratusan terdekat menjadi ${fmt(X)} adalah …`, X - 50, { bahas: `${fmt(X - 50)}.`,
        langkah: [`Bilangan dari ${fmt(X - 50)} sampai ${fmt(X + 49)} dibulatkan menjadi ${fmt(X)}.`, `${fmt(X - 50)} punya angka puluhan 5, jadi naik ke ${fmt(X)}; ${fmt(X - 51)} turun ke ${fmt(X - 100)}.`, bJwb(fmt(X - 50))] });
      const daftarJ = []; for (let n = X - 50; n <= X + 49; n++) if (String(n).split("").reduce((s, d) => s + +d, 0) === J) daftarJ.push(n);
      return isian(`Ada berapa bilangan yang dibulatkan ke ratusan terdekat menjadi <b>${fmt(X)}</b> dan <b>jumlah angka-angkanya ${J}</b>?`, c,
        { petunjuk: `Daftar bilangan dari ${fmt(X - 50)} sampai ${fmt(X + 49)} yang jumlah angkanya ${J}.`, bahas: `Ada ${c} bilangan.`,
          langkah: [`Bilangan yang dibulatkan ke ${fmt(X)}: dari ${fmt(X - 50)} sampai ${fmt(X + 49)}.`, `Periksa jumlah angkanya. Yang jumlahnya ${J}: ${daftarJ.map(n => `${fmt(n)} (${String(n).split("").join(" + ")})`).join(", ")}.`,
            `Banyaknya ${c} bilangan.`, bJwb(c)] }); },
    () => { let kartu, Y, cocok; do { kartu = ambil([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4); Y = acak(2, 9) * 1000; cocok = [...permutasi(kartu)].filter(p => p[0]).map(p => +p.join("")).filter(n => pembulatan(n, 1000) === Y); } while (cocok.length < 2);
      const besar = ya(), v = besar ? Math.max(...cocok) : Math.min(...cocok);
      return isian(`Kartu angka: <b>${kartu.join(", ")}</b>. Setiap kartu dipakai tepat satu kali untuk membuat bilangan 4 angka yang jika dibulatkan ke ribuan terdekat hasilnya <b>${fmt(Y)}</b>. Bilangan <b>${besar ? "terbesar" : "terkecil"}</b> yang memenuhi adalah …`, v,
        { petunjuk: `Bilangan itu harus di antara ${fmt(Y - 500)} dan ${fmt(Y + 499)}.`, bahas: `Bilangan yang memenuhi: ${cocok.sort((p, q) => p - q).map(fmt).join(", ")}. Jawabannya ${fmt(v)}.`,
          langkah: [`Bilangan yang dibulatkan ke ${fmt(Y)} ada di antara ${fmt(Y - 500)} dan ${fmt(Y + 499)}.`, `Susunan kartu yang masuk rentang itu: ${cocok.map(fmt).join(", ")}.`,
            `Yang ${besar ? "terbesar" : "terkecil"}: ${fmt(v)}.`, bJwb(fmt(v))] }); },
    () => { let a, b, c; do { a = acak(1010, 4990); b = acak(1010, 4990); c = acak(1010, 4990); } while ([a, b, c].some(v => v % 100 === 50));
      const S = a + b + c, Q = pembulatan(a, 100) + pembulatan(b, 100) + pembulatan(c, 100), s = Math.abs(S - Q), x = nama();
      if (!s) return isian(`Taksiran ${fmt(a)} + ${fmt(b)} + ${fmt(c)} dengan membulatkan setiap bilangan ke ratusan terdekat adalah …`, Q, { bahas: `${fmt(Q)}.`,
        langkah: [`Bulatkan ke ratusan: ${[a, b, c].map(v => `${fmt(v)} ≈ ${fmt(pembulatan(v, 100))}`).join("; ")}.`, `Jumlahkan: ${fmt(pembulatan(a, 100))} + ${fmt(pembulatan(b, 100))} + ${fmt(pembulatan(c, 100))} = ${fmt(Q)}.`, bJwb(fmt(Q))] });
      return isian(`${x} menaksir hasil ${fmt(a)} + ${fmt(b)} + ${fmt(c)} dengan membulatkan setiap bilangan ke ratusan terdekat lebih dulu. Selisih hasil taksiran ${x} dengan hasil yang sebenarnya adalah …`, s,
        { petunjuk: "Hitung taksiran dan hasil sebenarnya, lalu kurangkan yang besar dengan yang kecil.", bahas: `Taksiran: ${fmt(pembulatan(a, 100))} + ${fmt(pembulatan(b, 100))} + ${fmt(pembulatan(c, 100))} = ${fmt(Q)}. Sebenarnya: ${fmt(S)}. Selisih ${fmt(s)}.`,
          langkah: [`Bulatkan ke ratusan: ${[a, b, c].map(v => `${fmt(v)} ≈ ${fmt(pembulatan(v, 100))}`).join("; ")}.`, `Taksiran: ${fmt(pembulatan(a, 100))} + ${fmt(pembulatan(b, 100))} + ${fmt(pembulatan(c, 100))} = ${fmt(Q)}.`,
            `Hasil sebenarnya: ${fmt(a)} + ${fmt(b)} + ${fmt(c)} = ${fmt(S)}.`, `Selisih: ${fmt(Math.max(S, Q))} − ${fmt(Math.min(S, Q))} = ${fmt(s)}.`, bJwb(fmt(s))] }); },
    () => { const kartu = ambil([1, 2, 3, 4, 5, 6, 7, 8, 9], 4), semua = [...new Set([...permutasi(kartu)].map(p => +p.slice(0, 3).join("")))].sort((x, y) => x - y), k = acak(3, 8), besar = ya();
      const v = besar ? semua[semua.length - k] : semua[k - 1];
      return isian(`Dari kartu <b>${kartu.join(", ")}</b> dibuat semua bilangan 3 angka (setiap kartu paling banyak dipakai sekali), lalu diurutkan dari yang <b>${besar ? "terbesar" : "terkecil"}</b>. Bilangan pada urutan ke-${k} adalah …`, v,
        { petunjuk: "Daftar bilangan dengan angka ratusan yang sama dulu, secara berurutan.", bahas: `Urutan: ${(besar ? semua.slice().reverse() : semua).slice(0, k).map(fmt).join(", ")}. Urutan ke-${k}: ${fmt(v)}.`,
          langkah: [`Mulai dari angka ratusan ${besar ? "terbesar" : "terkecil"}, yaitu ${(besar ? semua[semua.length - 1] : semua[0]).toString()[0]}. Setiap angka ratusan punya 3 × 2 = 6 bilangan.`,
            `Tulis berurutan dari yang ${besar ? "terbesar" : "terkecil"}: ${(besar ? semua.slice().reverse() : semua).slice(0, k).map(fmt).join(", ")}.`, `Urutan ke-${k}: ${fmt(v)}.`, bJwb(fmt(v))] }); },
  ],
});

/* Banyak bilangan bersyarat yang dibulatkan ke ratusan menjadi X */
function bHitungRentang(X, sy, f, c) {
  const lo = X - 50, hi = X + 49, awal = `Bilangan yang dibulatkan ke ${fmt(X)}: dari ${fmt(lo)} sampai ${fmt(hi)} (ada 100 bilangan).`;
  if (sy === "ganjil" || sy === "genap") return [awal, `Bilangan ganjil dan genap berselang-seling, jadi setengahnya ${sy}: 100 : 2 = 50.`, bJwb(c)];
  const m = +sy.split(" ")[1]; let a = lo, z = hi; while (!f(a)) a++; while (!f(z)) z--;
  return [awal, `${sy[0].toUpperCase() + sy.slice(1)} yang pertama ${fmt(a)}, yang terakhir ${fmt(z)}.`,
    `Banyaknya: (${fmt(z)} − ${fmt(a)}) : ${m} + 1 = ${z - a} : ${m} + 1 = ${c}.`, bJwb(c)];
}

/* ================= Misi 3: Operasi hitung campuran ================= */
const ceritaBarang = () => pilih([["kotak", "kue"], ["kardus", "buku"], ["keranjang", "jeruk"], ["plastik", "permen"], ["peti", "apel"], ["bungkus", "biskuit"]]);
daftarMisi("bil", "b3", "Operasi hitung campuran", "➕", {
  1: [
    () => { const a = acak(12, 89), b = acak(11, 89); return isian(`${a} + ${b} = …`, a + b, { bahas: `${a} + ${b} = ${a + b}.`, langkah: [...bTambah(a, b), bJwb(a + b)] }); },
    () => { const a = acak(40, 99), b = acak(11, a - 1); return isian(`${a} − ${b} = …`, a - b, { bahas: `${a} − ${b} = ${a - b}.`, langkah: [...bTambah(a, b, false), bJwb(a - b)] }); },
    () => { const a = acak(12, 30), b = acak(10, 30), kls = pilih(["4A", "5A", "5B", "6A", "6B"]);
      return isian(`Di kelas ${kls} ada ${a} siswa laki-laki dan ${b} siswa perempuan. Banyak siswa kelas ${kls} seluruhnya adalah …`, a + b, { satuan: "siswa", petunjuk: "Seluruhnya → dijumlahkan.", bahas: `${a} + ${b} = ${a + b} siswa.`,
        langkah: [`Seluruhnya → dijumlahkan: ${a} + ${b}.`, ...bTambah(a, b), bJwb(`${a + b} siswa`)] }); },
    () => { const x = nama(), benda = pilih(["permen", "kelereng", "stiker", "jeruk", "kue"]), a = acak(30, 95), b = acak(5, a - 10), siapa = pilih(["adiknya", "temannya", "sepupunya"]);
      return isian(`${x} mempunyai ${a} ${benda}. Sebanyak ${b} ${benda} diberikan kepada ${siapa}. Sisa ${benda} ${x} adalah …`, a - b, { satuan: benda, petunjuk: "Diberikan → berkurang, jadi dikurangi.", bahas: `${a} − ${b} = ${a - b} ${benda}.`,
        langkah: [`Diberikan → berkurang, jadi dikurangi: ${a} − ${b}.`, ...bTambah(a, b, false), bJwb(`${a - b} ${benda}`)] }); },
    () => { const a = acak(11, 60), c = acak(a + 5, 99), tambah = ya();
      return isian(tambah ? `${a} + □ = ${c}<br>Nilai □ adalah …` : `${c} − □ = ${a}<br>Nilai □ adalah …`, c - a,
        { petunjuk: tambah ? `□ = ${c} − ${a}` : `□ = ${c} − ${a}`, bahas: tambah ? `${c} − ${a} = ${c - a}, karena ${a} + ${c - a} = ${c}.` : `${c} − ${a} = ${c - a}, karena ${c} − ${c - a} = ${a}.`,
          langkah: [`□ = ${c} − ${a}.`, ...bTambah(c, a, false), `Cek: ${tambah ? `${a} + ${c - a} = ${c}` : `${c} − ${c - a} = ${a}`}. Cocok!`, bJwb(c - a)] }); },
    () => { const a = acak(2, 10), b = acak(2, 5); return isian(`${a} × ${b} = …`, a * b, { petunjuk: `${a} × ${b} artinya ${b} ditambahkan sebanyak ${a} kali.`, bahas: `${a} × ${b} = ${a * b}.`,
      langkah: [`${a} × ${b} artinya ${b} dijumlahkan sebanyak ${a} kali.`, `${Array(a).fill(b).join(" + ")} = ${a * b}.`, bJwb(a * b)] }); },
  ],
  2: [
    () => { const a = acak(250, 899), b = acak(101, 499), p = ya(); const [x, y] = p ? [a, b] : [a + b, b]; return isian(`${fmt(x)} ${p ? "+" : "−"} ${fmt(y)} = …`, p ? x + y : x - y, { bahas: `Hasilnya ${fmt(p ? x + y : x - y)}.`,
      langkah: [...bTambah(x, y, p), bJwb(fmt(p ? x + y : x - y))] }); },
    () => { const a = acak(12, 98), b = acak(3, 9); return isian(`${a} × ${b} = …`, a * b, { petunjuk: `${a} × ${b} = (${Math.floor(a / 10) * 10} × ${b}) + (${a % 10} × ${b})`, bahas: `${a} × ${b} = ${a * b}.`,
      langkah: [...bKali(a, b), bJwb(fmt(a * b))] }); },
    () => { const [w, b] = ceritaBarang(), k = acak(3, 9), m = acak(4, 12);
      return isian(`Ada ${k} ${w}. Setiap ${w} berisi ${m} ${b}. Banyak ${b} seluruhnya adalah …`, k * m, { satuan: b, petunjuk: "Sama banyak setiap wadah → dikalikan.", bahas: `${k} × ${m} = ${k * m} ${b}.`,
        langkah: [`Isi setiap ${w} sama banyak → dikalikan: ${k} × ${m}.`, `${k} × ${m} = ${k * m}.`, bJwb(`${k * m} ${b}`)] }); },
    () => { const b = acak(2, 9), h = acak(2, 12), bentuk = ya();
      return isian(bentuk ? `${b * h} : ${b} = …` : `□ × ${b} = ${b * h}<br>Nilai □ adalah …`, h,
        { petunjuk: `Bilangan berapa yang dikali ${b} hasilnya ${b * h}?`, bahas: `${h} × ${b} = ${b * h}, jadi jawabannya ${h}.`,
          langkah: [bentuk ? `Cari bilangan yang jika dikali ${b} hasilnya ${b * h}.` : `□ = ${b * h} : ${b}.`, `${h} × ${b} = ${b * h}, jadi ${b * h} : ${b} = ${h}.`, bJwb(h)] }); },
    () => { const a = acak(120, 480), b = acak(110, 450), [j1, j2] = pilih([["buku cerita", "buku pelajaran"], ["kursi merah", "kursi biru"], ["bibit cabai", "bibit tomat"], ["botol air", "kotak susu"]]);
      return isian(`Di gudang sekolah ada ${a} ${j1} dan ${b} ${j2}. Jumlah semuanya adalah …`, a + b, { bahas: `${a} + ${b} = ${a + b}.`,
        langkah: [`Jumlah semuanya → dijumlahkan: ${a} + ${b}.`, ...bTambah(a, b), bJwb(a + b)] }); },
  ],
  3: [
    () => { const a = acak(12, 49), b = acak(11, 29); return isian(`${a} × ${b} = …`, a * b, { bahas: `${a} × ${b} = ${fmt(a * b)}.`, langkah: [...bKali(a, b), bJwb(fmt(a * b))] }); },
    () => { const b = acak(3, 15), h = acak(12, 60); return isian(`${fmt(b * h)} : ${b} = …`, h, { petunjuk: `Bilangan berapa yang dikali ${b} hasilnya ${b * h}?`, bahas: `${b} × ${h} = ${b * h}, jadi hasilnya ${h}.`,
      langkah: bBagi(b * h, b) }); },
    () => { const x = nama(), [w, b] = ceritaBarang(), p = acak(3, 9), h = acak(6, 25);
      return isian(`${x} membagikan ${p * h} ${b} kepada ${p} temannya sama banyak. Setiap teman mendapat … ${b}.`, h, { satuan: b, petunjuk: "Dibagi sama banyak → dibagi.", bahas: `${p * h} : ${p} = ${h} ${b}.`,
        langkah: [`Dibagikan sama banyak → dibagi: ${p * h} : ${p}.`, `${p} × ${h} = ${p * h}, jadi ${p * h} : ${p} = ${h}.`, bJwb(`${h} ${b}`)] }); },
    () => { const b = acak(4, 15), h = acak(11, 40);
      return isian(`${b} × □ = ${b * h}<br>Nilai □ adalah …`, h, { petunjuk: `□ = ${b * h} : ${b}`, bahas: `${b * h} : ${b} = ${h}, karena ${b} × ${h} = ${b * h}.`,
        langkah: [`□ = ${b * h} : ${b}.`, ...bBagi(b * h, b).slice(1)] }); },
    () => { const r = acak(8, 25), k = acak(11, 30), tempat = pilih(["aula", "lapangan upacara", "gedung pertunjukan", "ruang serbaguna"]);
      return isian(`Di ${tempat} terdapat ${r} baris kursi. Setiap baris ada ${k} kursi. Banyak kursi seluruhnya adalah …`, r * k, { satuan: "kursi", bahas: `${r} × ${k} = ${r * k} kursi.`,
        langkah: [`Banyak kursi = banyak baris × kursi per baris = ${r} × ${k}.`, ...bKali(r, k), bJwb(`${r * k} kursi`)] }); },
    () => { const a = acak(120, 450), b = acak(100, 350), c = acak(50, 200); return isian(`${a} + ${b} + ${c} = …`, a + b + c, { petunjuk: "Jumlahkan dua bilangan dulu, lalu tambah yang ketiga.", bahas: `${a} + ${b} = ${a + b}, lalu ${a + b} + ${c} = ${a + b + c}.`,
      langkah: [`Jumlahkan dua bilangan pertama: ${a} + ${b} = ${a + b}.`, `Tambahkan bilangan ketiga: ${a + b} + ${c} = ${a + b + c}.`, bJwb(a + b + c)] }); },
  ],
  4: [
    () => { const a = acak(10, 90), b = acak(3, 12), c = acak(3, 12); return isian(`${a} + ${b} × ${c} = …`, a + b * c, { petunjuk: "Kali dan bagi dikerjakan lebih dulu!", bahas: `${b} × ${c} = ${b * c}, lalu ${a} + ${b * c} = ${a + b * c}.`,
      langkah: [`Kali dikerjakan lebih dulu: ${b} × ${c} = ${b * c}.`, `Lalu tambah: ${a} + ${b * c} = ${a + b * c}.`, bJwb(a + b * c)] }); },
    () => { const c = acak(3, 9), q = acak(4, 12), b = c * q, a = acak(q + 5, 99); return isian(`${a} − ${b} : ${c} = …`, a - q, { petunjuk: "Bagi dulu, baru kurangi.", bahas: `${b} : ${c} = ${q}, lalu ${a} − ${q} = ${a - q}.`,
      langkah: [`Bagi dikerjakan lebih dulu: ${b} : ${c} = ${q}.`, `Lalu kurangi: ${a} − ${q} = ${a - q}.`, bJwb(a - q)] }); },
    () => { const a = acak(4, 15), b = acak(4, 15), c = acak(5, Math.min(60, a * b - 1)); return isian(`${a} × ${b} − ${c} = …`, a * b - c, { bahas: `${a} × ${b} = ${a * b}, lalu ${a * b} − ${c} = ${a * b - c}.`,
      langkah: [`Kali dikerjakan lebih dulu: ${a} × ${b} = ${a * b}.`, `Lalu kurangi: ${a * b} − ${c} = ${a * b - c}.`, bJwb(a * b - c)] }); },
    () => { const x = nama(), a = acak(10, 40), b = acak(2, 6), c = pilih([5, 6, 8, 10, 12]);
      return isian(`${x} mempunyai ${a} kelereng. Ia membeli lagi ${b} kantong kelereng. Setiap kantong berisi ${c} kelereng. Banyak kelereng ${x} sekarang adalah …`, a + b * c,
        { satuan: "kelereng", petunjuk: "Hitung isi semua kantong dulu, lalu tambahkan.", bahas: `${a} + ${b} × ${c} = ${a} + ${b * c} = ${a + b * c} kelereng.`,
          langkah: [`Isi semua kantong: ${b} × ${c} = ${b * c} kelereng.`, `Tambahkan kelereng semula: ${a} + ${b * c} = ${a + b * c}.`, bJwb(`${a + b * c} kelereng`)] }); },
    () => { const b = acak(2, 9), q = acak(3, 12), c = acak(5, 60);
      return isian(`${b * q} : ${b} + ${c} = …`, q + c, { petunjuk: "Bagi dulu, baru tambah.", bahas: `${b * q} : ${b} = ${q}, lalu ${q} + ${c} = ${q + c}.`,
        langkah: [`Bagi dikerjakan lebih dulu: ${b * q} : ${b} = ${q}.`, `Lalu tambah: ${q} + ${c} = ${q + c}.`, bJwb(q + c)] }); },
    () => { const r = acak(4, 9), k = acak(6, 12), t = acak(3, r * k - 5), pohon = pilih(["pohon jati", "pohon pisang", "pohon kelapa", "tanaman jagung"]);
      return isian(`Di kebun ada ${r} baris ${pohon}. Setiap baris ada ${k} ${pohon}. Sebanyak ${t} ${pohon} ditebang. Sisa ${pohon} di kebun adalah …`, r * k - t,
        { petunjuk: "Hitung semua pohon dulu (kali), lalu kurangi.", bahas: `${r} × ${k} − ${t} = ${r * k} − ${t} = ${r * k - t}.`,
          langkah: [`Banyak ${pohon} semula: ${r} × ${k} = ${r * k}.`, `Dikurangi yang ditebang: ${r * k} − ${t} = ${r * k - t}.`, bJwb(r * k - t)] }); },
  ],
  5: [
    () => { const a = acak(5, 40), b = acak(5, 40), c = acak(3, 9); return isian(`(${a} + ${b}) × ${c} = …`, (a + b) * c, { petunjuk: "Kerjakan yang di dalam kurung dulu.", bahas: `(${a + b}) × ${c} = ${(a + b) * c}.`,
      langkah: [`Kurung dikerjakan lebih dulu: ${a} + ${b} = ${a + b}.`, `Lalu kali: ${a + b} × ${c} = ${(a + b) * c}.`, bJwb((a + b) * c)] }); },
    () => { const c = acak(3, 9), q = acak(5, 20), b = acak(10, 90), a = b + c * q; return isian(`(${a} − ${b}) : ${c} = …`, q, { bahas: `${a} − ${b} = ${a - b}, lalu ${a - b} : ${c} = ${q}.`,
      langkah: [`Kurung dikerjakan lebih dulu: ${a} − ${b} = ${a - b}.`, `Lalu bagi: ${a - b} : ${c} = ${q}, karena ${c} × ${q} = ${a - b}.`, bJwb(q)] }); },
    () => { const a = acak(6, 15), b = acak(6, 15), d = acak(2, 9), q = acak(2, 9), c = d * q; return isian(`${a} × ${b} − ${c} : ${d} = …`, a * b - q, { bahas: `${a} × ${b} = ${a * b} dan ${c} : ${d} = ${q}, lalu ${a * b} − ${q} = ${a * b - q}.`,
      langkah: [`Kali dan bagi dikerjakan lebih dulu: ${a} × ${b} = ${a * b}.`, `${c} : ${d} = ${q}.`, `Terakhir kurangi: ${a * b} − ${q} = ${a * b - q}.`, bJwb(a * b - q)] }); },
    () => { const a = acak(3, 9), b = acak(10, 30), c = acak(2, b - 3), plus = ya(), h = plus ? a * (b + c) : a * (b - c);
      return isian(`${a} × (${b} ${plus ? "+" : "−"} ${c}) = …`, h, { petunjuk: "Kerjakan yang di dalam kurung dulu.", bahas: `${b} ${plus ? "+" : "−"} ${c} = ${plus ? b + c : b - c}, lalu ${a} × ${plus ? b + c : b - c} = ${h}.`,
        langkah: [`Kurung dikerjakan lebih dulu: ${b} ${plus ? "+" : "−"} ${c} = ${plus ? b + c : b - c}.`, `Lalu kali: ${a} × ${plus ? b + c : b - c} = ${h}.`, bJwb(h)] }); },
    () => { const [x, y] = namaBeda(2), k = acak(3, 8), h = acak(4, 12), t = k * h, a = acak(5, t - 5), b = t - a;
      return isian(`${x} membawa ${a} kue dan ${y} membawa ${b} kue. Semua kue itu dimasukkan ke dalam ${k} kotak sama banyak. Setiap kotak berisi … kue.`, h,
        { satuan: "kue", petunjuk: "Jumlahkan dulu kuenya, lalu bagi.", bahas: `(${a} + ${b}) : ${k} = ${t} : ${k} = ${h} kue.`,
          langkah: [`Jumlah kue: ${a} + ${b} = ${t}.`, `Dibagi ke ${k} kotak sama banyak: ${t} : ${k} = ${h}.`, bJwb(`${h} kue`)] }); },
    () => { const b = acak(2, 9), q = acak(3, 15), a = b * q, c = acak(2, 9);
      return isian(`${a} : ${b} × ${c} = …`, q * c, { petunjuk: "Kali dan bagi setara: kerjakan dari kiri.", bahas: `${a} : ${b} = ${q}, lalu ${q} × ${c} = ${q * c}.`,
        langkah: ["Kali dan bagi sama kuat, jadi kerjakan dari kiri.", `${a} : ${b} = ${q}.`, `${q} × ${c} = ${q * c}.`, bJwb(q * c)] }); },
  ],
  6: [
    () => { const a = acak(12, 35), b = acak(12, 35), c = acak(6, 25), d = acak(6, 25); return isian(`${a} × ${b} + ${c} × ${d} = …`, a * b + c * d, { bahas: `${a * b} + ${c * d} = ${fmt(a * b + c * d)}.`,
      langkah: [`Kali dikerjakan lebih dulu: ${a} × ${b} = ${fmt(a * b)}.`, `${c} × ${d} = ${fmt(c * d)}.`, `Lalu tambah: ${fmt(a * b)} + ${fmt(c * d)} = ${fmt(a * b + c * d)}.`, bJwb(fmt(a * b + c * d))] }); },
    () => { const a = acak(20, 80), b = acak(10, 60), c = acak(15, 40), d = acak(2, c - 5); return isian(`(${a} + ${b}) × (${c} − ${d}) = …`, (a + b) * (c - d), { bahas: `${a + b} × ${c - d} = ${fmt((a + b) * (c - d))}.`,
      langkah: [`Kurung pertama: ${a} + ${b} = ${a + b}.`, `Kurung kedua: ${c} − ${d} = ${c - d}.`, `Kalikan: ${a + b} × ${c - d} = ${fmt((a + b) * (c - d))}.`, bJwb(fmt((a + b) * (c - d)))] }); },
    () => { const b = acak(3, 12), q = acak(6, 25), a = b * q, c = acak(4, 15); return isian(`${fmt(a)} : ${b} × ${c} = …`, q * c, { petunjuk: "Kali dan bagi setara: kerjakan dari kiri.", bahas: `${a} : ${b} = ${q}, lalu ${q} × ${c} = ${q * c}.`,
      langkah: ["Kali dan bagi sama kuat, jadi kerjakan dari kiri.", `${fmt(a)} : ${b} = ${q}.`, `${q} × ${c} = ${q * c}.`, bJwb(q * c)] }); },
  ],
  7: [
    () => { const [w, b] = ceritaBarang(), k = acak(3, 9), p = pilih([4, 5, 6, 8, 10, 12]); let m = acak(6, 30); while ((k * m) % p) m++;
      const x = nama(); return isian(`${x} membeli ${k} ${w} ${b}. Setiap ${w} berisi ${m} ${b}. Semua ${b} dibagikan sama rata kepada ${p} teman. Setiap teman mendapat … ${b}.`, k * m / p,
        { satuan: b, petunjuk: "Hitung semua isinya dulu, lalu bagi.", bahas: `${k} × ${m} = ${k * m}, lalu ${k * m} : ${p} = ${k * m / p}.`,
          langkah: [`Banyak ${b} seluruhnya: ${k} × ${m} = ${k * m}.`, `Dibagi sama rata kepada ${p} teman: ${k * m} : ${p} = ${k * m / p}.`, bJwb(`${k * m / p} ${b}`)] }); },
    () => { const a = acak(300, 800), b = acak(40, 150), c = acak(3, 8), d = acak(12, 30);
      return isian(`Di perpustakaan ada ${a} buku. Sebanyak ${b} buku dipinjam siswa. Kemudian datang ${c} kardus buku baru, masing-masing berisi ${d} buku. Banyak buku di perpustakaan sekarang adalah …`, a - b + c * d,
        { satuan: "buku", bahas: `${a} − ${b} + ${c} × ${d} = ${a - b} + ${c * d} = ${a - b + c * d}.`,
          langkah: [`Setelah dipinjam: ${a} − ${b} = ${a - b} buku.`, `Buku baru: ${c} × ${d} = ${c * d} buku.`, `Sekarang: ${a - b} + ${c * d} = ${fmt(a - b + c * d)}.`, bJwb(`${fmt(a - b + c * d)} buku`)] }); },
    () => { const k = acak(8, 25), m = pilih([25, 30, 40, 50]), j = acak(50, k * m - 20);
      return isian(`Sebuah truk mengangkut ${k} karung beras. Setiap karung beratnya ${m} kg. Di pasar, ${j} kg beras dijual. Sisa beras di truk adalah … kg.`, k * m - j, { satuan: "kg", bahas: `${k} × ${m} − ${j} = ${k * m - j} kg.`,
        langkah: [`Berat semua beras: ${k} × ${m} = ${fmt(k * m)} kg.`, `Dikurangi yang dijual: ${fmt(k * m)} − ${j} = ${fmt(k * m - j)} kg.`, bJwb(`${fmt(k * m - j)} kg`)] }); },
  ],
  8: [
    () => { const k = acak(4, 9), m = acak(12, 30), j = acak(10, k * m - 10), x = nama();
      return pg(`Pak ${x} memiliki ${k} kandang. Setiap kandang berisi ${m} ayam. Sebanyak ${j} ayam dijual. Kalimat matematika yang tepat untuk menghitung sisa ayam adalah …`,
        `${k} × ${m} − ${j}`, [`${k} + ${m} − ${j}`, `${k} × (${m} − ${j})`, `(${k} + ${j}) × ${m}`, `${k} × ${m} + ${j}`], { bahas: `Banyak ayam semula ${k} × ${m}, lalu dikurangi ${j}: ${k} × ${m} − ${j} = ${k * m - j}.`,
        langkah: [`Banyak ayam semula: ${k} kandang × ${m} ayam = ${k} × ${m}.`, `Sebagian dijual → dikurangi ${j}.`, `Kalimatnya: ${k} × ${m} − ${j} (hasilnya ${k * m - j} ayam).`, bJwb(`${k} × ${m} − ${j}`)] }); },
    () => { const x = nama(), a = acak(5, 12), h = acak(3, 8) * 500, b = acak(2, 6), g = acak(4, 9) * 1000, u = pilih([50000, 100000]);
      const tot = a * h + b * g; if (tot >= u) return isian(`${a} × ${b} + ${a} × ${b} = …`, 2 * a * b, { bahas: "Kerjakan perkaliannya dulu.",
        langkah: [`Kali dikerjakan lebih dulu: ${a} × ${b} = ${a * b}.`, `Lalu tambah: ${a * b} + ${a * b} = ${2 * a * b}.`, bJwb(2 * a * b)] });
      return isian(`${x} membeli ${a} buku tulis seharga ${rp(h)} per buku dan ${b} pulpen seharga ${rp(g)} per buah. ${x} membayar dengan uang ${rp(u)}. Uang kembalian ${x} adalah Rp …`, u - tot,
        { petunjuk: "Hitung harga semua barang, lalu kurangkan dari uang yang dibayar.", bahas: `${a} × ${rp(h)} + ${b} × ${rp(g)} = ${rp(tot)}. Kembalian ${rp(u)} − ${rp(tot)} = ${rp(u - tot)}.`,
          langkah: [`Harga buku tulis: ${a} × ${rp(h)} = ${rp(a * h)}.`, `Harga pulpen: ${b} × ${rp(g)} = ${rp(b * g)}.`, `Jumlah belanja: ${rp(a * h)} + ${rp(b * g)} = ${rp(tot)}.`,
            `Kembalian: ${rp(u)} − ${rp(tot)} = ${rp(u - tot)}.`, bJwb(rp(u - tot))] }); },
    () => { const r = acak(3, 6), s = acak(20, 32), t = acak(2, 5), isi = pilih([4, 6, 8, 10, 12]), n = r * s * t, k = Math.ceil(n / isi);
      return isian(`Sebuah sekolah memiliki ${r} kelas. Setiap kelas berisi ${s} siswa. Setiap siswa mendapat ${t} buku. Buku dikemas dalam kardus berisi ${isi} buku. Paling sedikit diperlukan … kardus.`, k,
        { satuan: "kardus", petunjuk: `Hitung semua buku, lalu bagi ${isi}. Jika bersisa, perlu satu kardus lagi!`, bahas: `${r} × ${s} × ${t} = ${n} buku. ${n} : ${isi} = ${fmt(bulat(n / isi, 2))} → ${k} kardus.`,
        langkah: [`Banyak buku: ${r} × ${s} = ${r * s}, lalu ${r * s} × ${t} = ${n} buku.`, `${n} : ${isi} = ${Math.floor(n / isi)} sisa ${n % isi}.`,
          n % isi ? `Masih ada ${n % isi} buku, jadi perlu 1 kardus lagi: ${Math.floor(n / isi)} + 1 = ${k}.` : `Tidak ada sisa, jadi cukup ${k} kardus.`, bJwb(`${k} kardus`)] }); },
  ],
  9: [
    () => { const x = acak(5, 30), a = acak(3, 9), b = acak(5, 40), c = x * a + b;
      return isian(`Sebuah bilangan dikalikan ${a}, lalu ditambah ${b}. Hasilnya ${c}. Bilangan itu adalah …`, x, { petunjuk: "Kerjakan mundur: kurangi dulu, lalu bagi.", bahas: `${c} − ${b} = ${c - b}, lalu ${c - b} : ${a} = ${x}.`,
      langkah: [`Kerjakan mundur. Sebelum ditambah ${b}: ${c} − ${b} = ${c - b}.`, `Sebelum dikali ${a}: ${c - b} : ${a} = ${x}.`, `Cek: ${x} × ${a} + ${b} = ${x * a} + ${b} = ${c}. Cocok!`, bJwb(x)] }); },
    () => { const a = acak(3, 9), m = acak(8, 25), ab = a * m, d = acak(3, 9), q = acak(2, Math.floor((ab - 5) / d)), c = ab - d * q, e = acak(5, 50);
      return isian(`(${a} × ${m} − ${c}) : ${d} + ${e} = …`, q + e, { petunjuk: "Kurung dulu (kali sebelum kurang), lalu bagi, terakhir tambah.", bahas: `${a} × ${m} = ${ab}; ${ab} − ${c} = ${d * q}; ${d * q} : ${d} = ${q}; ${q} + ${e} = ${q + e}.`,
      langkah: [`Di dalam kurung, kali dulu: ${a} × ${m} = ${ab}.`, `Masih di dalam kurung: ${ab} − ${c} = ${d * q}.`, `Bagi: ${d * q} : ${d} = ${q}.`, `Terakhir tambah: ${q} + ${e} = ${q + e}.`, bJwb(q + e)] }); },
  ],
  10: [
    () => { const a = acak(13, 89), t = pilih([100, 1000]), b = acak(t === 100 ? 11 : 120, t === 100 ? 89 : 880), c = t - b;
      return isian(`Hitung dengan cara cerdik: <b>${a} × ${b} + ${a} × ${c}</b> = …`, a * t, { petunjuk: `${a} × ${b} + ${a} × ${c} = ${a} × (${b} + ${c})`, bahas: `${a} × (${b} + ${c}) = ${a} × ${t} = ${fmt(a * t)}.`,
      langkah: [`Keduanya dikali ${a}, jadi bisa digabung: ${a} × ${b} + ${a} × ${c} = ${a} × (${b} + ${c}).`, `${b} + ${c} = ${fmt(t)}.`, `${a} × ${fmt(t)} = ${fmt(a * t)}.`, bJwb(fmt(a * t))] }); },
    () => { const a = acak(13, 99), k = pilih([99, 999, 101]);
      return isian(`Hitung dengan cara cerdik: <b>${a} × ${k}</b> = …`, a * k, { petunjuk: k === 101 ? `${a} × 101 = ${a} × 100 + ${a}` : `${a} × ${k} = ${a} × ${k + 1} − ${a}`, bahas: `Hasilnya ${fmt(a * k)}.`,
      langkah: k === 101 ? [`101 = 100 + 1, jadi ${a} × 101 = ${a} × 100 + ${a} × 1.`, `${a} × 100 = ${fmt(a * 100)}.`, `${fmt(a * 100)} + ${a} = ${fmt(a * k)}.`, bJwb(fmt(a * k))]
        : [`${k} = ${fmt(k + 1)} − 1, jadi ${a} × ${k} = ${a} × ${fmt(k + 1)} − ${a} × 1.`, `${a} × ${fmt(k + 1)} = ${fmt(a * (k + 1))}.`, `${fmt(a * (k + 1))} − ${a} = ${fmt(a * k)}.`, bJwb(fmt(a * k))] }); },
    () => { const x = acak(6, 40), a = acak(2, 6), b = acak(3, 9), c = acak(5, 40); const v = (x * a - c); if (v % b || v <= 0) return isian(`Sebuah bilangan ditambah 15, lalu dikali 4, hasilnya 120. Bilangan itu adalah …`, 15, { bahas: "120 : 4 = 30, 30 − 15 = 15.",
      langkah: ["Kerjakan mundur. Sebelum dikali 4: 120 : 4 = 30.", "Sebelum ditambah 15: 30 − 15 = 15.", bJwb(15)] });
      return isian(`${nama()} memikirkan sebuah bilangan. Bilangan itu dikali ${a}, dikurangi ${c}, lalu dibagi ${b}. Hasil akhirnya ${v / b}. Bilangan yang dipikirkan adalah …`, x,
        { petunjuk: "Kerjakan mundur dengan operasi kebalikannya.", bahas: `${v / b} × ${b} = ${v}; ${v} + ${c} = ${v + c}; ${v + c} : ${a} = ${x}.`,
          langkah: [`Kerjakan mundur dari hasil akhir ${v / b}. Kebalikan "dibagi ${b}" adalah dikali ${b}: ${v / b} × ${b} = ${v}.`, `Kebalikan "dikurangi ${c}" adalah ditambah ${c}: ${v} + ${c} = ${v + c}.`,
            `Kebalikan "dikali ${a}" adalah dibagi ${a}: ${v + c} : ${a} = ${x}.`, bJwb(x)] }); },
  ],
});

/* Pembagian a : b yang hasilnya bulat */
const bBagi = (a, b) => [`Cari bilangan yang jika dikali ${b} hasilnya ${fmt(a)}.`, `${b} × ${fmt(a / b)} = ${fmt(a)}, jadi ${fmt(a)} : ${b} = ${fmt(a / b)}.`, bJwb(fmt(a / b))];

/* ================= Misi 4: KPK & FPB ================= */
const faktor = n => { const f = []; for (let i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; };
function faktorPrima(n) { const r = {}; for (let p = 2; n > 1; p++) while (n % p === 0) { r[p] = (r[p] || 0) + 1; n /= p; } return r; }
const tulisFP = f => Object.entries(f).map(([p, e]) => (e > 1 ? `${p}<sup>${e}</sup>` : p)).join(" × ");
const kpk3 = (a, b, c) => kpk(kpk(a, b), c), fpb3 = (a, b, c) => fpb(fpb(a, b), c);
/* Langkah KPK/FPB: daftar kelipatan/faktor bila pendek, selain itu faktorisasi prima */
function bGabungFP(ns, pilihE) {
  const fs = ns.map(faktorPrima), r = {};
  [...new Set(fs.flatMap(f => Object.keys(f)))].sort((a, b) => a - b).forEach(p => { const e = pilihE(...fs.map(f => f[p] || 0)); if (e) r[p] = e; });
  return r;
}
const bFaktorisasi = ns => `Faktorisasi prima: ${ns.map(n => `${n} = ${tulisFP(faktorPrima(n))}`).join("; ")}.`;
function bKPK(ns) {
  const K = ns.reduce((a, b) => kpk(a, b));
  if (ns.every(n => K / n <= 10)) return [ns.map(n => `Kelipatan ${n}: ${Array.from({ length: K / n }, (_, i) => fmt(n * (i + 1))).join(", ")}, …`).join("<br>"),
    `Kelipatan yang sama dan paling kecil adalah ${fmt(K)}. Jadi KPK = ${fmt(K)}.`];
  return [bFaktorisasi(ns), `KPK = kalikan semua faktor prima, pilih pangkat yang terbesar: ${tulisFP(bGabungFP(ns, Math.max))} = ${fmt(K)}.`];
}
function bFPB(ns) {
  const F = ns.reduce((a, b) => fpb(a, b));
  if (Math.max(...ns) <= 60) return [ns.map(n => `Faktor ${n}: ${faktor(n).join(", ")}`).join("<br>"), `Faktor yang sama: ${faktor(F).join(", ")}. Yang terbesar ${F}, jadi FPB = ${F}.`];
  return [bFaktorisasi(ns), F > 1 ? `FPB = kalikan faktor prima yang sama, pilih pangkat yang terkecil: ${tulisFP(bGabungFP(ns, Math.min))} = ${F}.` : "Tidak ada faktor prima yang sama, jadi FPB = 1."];
}
function bFaktor(n) {
  const ps = []; for (let i = 1; i * i <= n; i++) if (n % i === 0) ps.push(`${i} × ${n / i}`);
  return [`Cari pasangan perkalian yang hasilnya ${n}: ${ps.join(", ")}.`, `Jadi faktor ${n}: ${faktor(n).join(", ")}.`];
}
function bPohon(n) {
  const L = []; let m = n;
  for (let p = 2; m > 1; p++) while (m % p === 0) { L.push(`${fmt(m)} : ${p} = ${fmt(m / p)}`); m /= p; }
  return `Pohon faktor: bagi terus dengan bilangan prima: ${L.join(", ")}.`;
}
daftarMisi("bil", "b4", "KPK & FPB", "🔁", {
  1: [
    () => { const n = acak(3, 12), k = acak(3, 10); return isian(`Kelipatan ke-${k} dari ${n} adalah …`, n * k, { petunjuk: `Kelipatan ${n}: ${n}, ${2 * n}, ${3 * n}, …`, bahas: `${n} × ${k} = ${n * k}.`,
      langkah: [`Kelipatan ${n}: ${n} × 1 = ${n}, ${n} × 2 = ${2 * n}, ${n} × 3 = ${3 * n}, …`, `Kelipatan ke-${k} = ${n} × ${k} = ${n * k}.`, bJwb(n * k)] }); },
    keTKA(() => { const n = acak(3, 9), b = n * acak(3, 11); return pg(`Bilangan berikut yang merupakan <b>kelipatan ${n}</b> adalah …`, b, [b + 1, b - 1, b + 2, b - 2].filter(x => x % n), { bahas: `${b} = ${n} × ${b / n}.`,
      langkah: [`Kelipatan ${n} adalah bilangan yang habis dibagi ${n}.`, `${b} : ${n} = ${b / n} tanpa sisa, karena ${n} × ${b / n} = ${b}.`, `Pilihan yang lain bersisa jika dibagi ${n}.`, bJwb(b)] }); }),
    () => { const n = acak(3, 9), a = n * acak(2, 6), c = a + n * acak(2, 5); let k = 0; for (let x = a + 1; x < c; x++) if (x % n === 0) k++;
      return isian(`Banyak kelipatan ${n} yang lebih dari ${a} dan kurang dari ${c} adalah …`, k, { petunjuk: `Tulis kelipatan ${n} mulai setelah ${a}.`, bahas: `Ada ${k} kelipatan ${n} di antara ${a} dan ${c}.`,
        langkah: [`Tulis kelipatan ${n} dari ${a} sampai ${c}: ${bDeret(a, c, n)}.`, `${a} dan ${c} tidak ikut dihitung. Yang di antaranya: ${bDeret(a + n, c - n, n)}.`, `Banyaknya ${k}.`, bJwb(k)] }); },
    () => { const n = acak(3, 9), m = n * acak(3, 10), a = m - acak(1, n - 1), b = a + n;
      return isian(`Kelipatan ${n} yang terletak di antara ${a} dan ${b} adalah …`, m, { petunjuk: `Coba bagi setiap bilangan di antaranya dengan ${n}.`, bahas: `${m} = ${n} × ${m / n}. Hanya ${m} kelipatan ${n} di antara ${a} dan ${b}.`,
        langkah: [`Bilangan di antara ${a} dan ${b}: ${bDeret(a + 1, b - 1, 1)}.`, `Yang habis dibagi ${n} hanya ${m}, karena ${n} × ${m / n} = ${m}.`, bJwb(m)] }); },
    () => { const n = acak(3, 9), a = acak(10, 60), v = (Math.floor(a / n) + 1) * n;
      return isian(`Kelipatan ${n} yang paling kecil tetapi <b>lebih dari ${a}</b> adalah …`, v, { petunjuk: `Mulai dari ${a}, cari bilangan berikutnya yang habis dibagi ${n}.`, bahas: `${Math.floor(a / n) * n} ≤ ${a}, jadi kelipatan berikutnya ${v} = ${n} × ${v / n}.`,
        langkah: [`${a} : ${n} = ${Math.floor(a / n)} sisa ${a % n}.`, `Jadi ${n} × ${Math.floor(a / n)} = ${Math.floor(a / n) * n} belum lebih dari ${a}.`, `Kelipatan berikutnya: ${n} × ${v / n} = ${v}.`, bJwb(v)] }); },
    () => { const n = acak(2, 9), k = acak(3, 9), [benda, bunyi] = pilih([["Lampu hias", "berkedip"], ["Jam dinding", "berdenting"], ["Air mancur", "menyembur"], ["Alarm mainan", "berbunyi"]]);
      return isian(`${benda} ${bunyi} setiap ${n} detik. ${benda} itu ${bunyi} untuk pertama kali pada detik ke-${n}. ${benda} itu ${bunyi} untuk yang ke-${k} kalinya pada detik ke-…`, n * k,
        { petunjuk: `Waktunya adalah kelipatan ${n}.`, bahas: `Kelipatan ${n} yang ke-${k}: ${n} × ${k} = ${n * k}.`,
          langkah: [`${benda} ${bunyi} pada detik ke-${n}, ${2 * n}, ${3 * n}, … (kelipatan ${n}).`, `Yang ke-${k}: ${n} × ${k} = ${n * k}.`, bJwb(n * k)] }); },
    () => { const n = acak(2, 12), s = acak(1, 3), j = acak(0, 4), deret = [0, 1, 2, 3, 4].map(i => (i === j ? "□" : n * (s + i)));
      return isian(`${deret.join(", ")}<br>Barisan di atas adalah kelipatan ${n}. Nilai □ adalah …`, n * (s + j), { petunjuk: `Setiap bilangan bertambah ${n}.`, bahas: `${[0, 1, 2, 3, 4].map(i => n * (s + i)).join(", ")}. Jadi □ = ${n * (s + j)}.`,
        langkah: [`Kelipatan ${n}: setiap bilangan bertambah ${n}.`, j ? `□ = ${n * (s + j - 1)} + ${n} = ${n * (s + j)}.` : `□ = ${n * (s + 1)} − ${n} = ${n * s}.`,
          `Barisannya: ${[0, 1, 2, 3, 4].map(i => n * (s + i)).join(", ")}.`, bJwb(n * (s + j))] }); },
  ],
  2: [
    () => { const n = pilih([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48]); return isian(`Banyak faktor dari ${n} adalah …`, faktor(n).length, { petunjuk: "Cari pasangan perkalian yang hasilnya bilangan itu.", bahas: `Faktor ${n}: ${faktor(n).join(", ")} → ${faktor(n).length} faktor.`,
      langkah: [...bFaktor(n), `Hitung faktornya: ada ${faktor(n).length}.`, bJwb(faktor(n).length)] }); },
    keTKA(() => { const n = pilih([24, 30, 36, 40, 42, 48, 54, 60]), f = pilih(faktor(n).filter(x => x > 2 && x < n)); const s = []; for (let d = 1; s.length < 4 && d < 40; d++) [f + d, f - d].forEach(x => { if (x > 1 && n % x && s.length < 4) s.push(x); });
      return pg(`Bilangan berikut yang merupakan <b>faktor dari ${n}</b> adalah …`, f, s, { bahas: `${n} : ${f} = ${n / f}, tanpa sisa.`,
        langkah: [`Faktor ${n} adalah bilangan yang membagi ${n} tanpa sisa.`, `${n} : ${f} = ${n / f} tanpa sisa, karena ${f} × ${n / f} = ${n}.`, `Pilihan yang lain membagi ${n} dengan sisa.`, bJwb(f)] }); }),
    () => { const n = pilih([24, 30, 36, 40, 42, 48, 54, 60, 64, 72, 84, 90, 96, 100]), fs = faktor(n), b = ya(); const v = b ? fs[fs.length - 2] : fs[1];
      return isian(`Faktor dari ${n} yang ${b ? "terbesar selain " + n + " sendiri" : "terkecil selain 1"} adalah …`, v, { bahas: `Faktor ${n}: ${fs.join(", ")}.`,
        langkah: [...bFaktor(n), `${b ? `Yang terbesar selain ${n}` : "Yang terkecil selain 1"}: ${v}.`, bJwb(v)] }); },
    () => { const n = pilih([12, 18, 20, 24, 28, 30, 36, 40, 45]), fs = faktor(n); return isian(`Jumlah semua faktor dari ${n} adalah …`, fs.reduce((a, c) => a + c, 0), { petunjuk: "Tulis semua faktornya, lalu jumlahkan.", bahas: `${fs.join(" + ")} = ${fs.reduce((a, c) => a + c, 0)}.`,
      langkah: [...bFaktor(n), `Jumlahkan: ${fs.join(" + ")} = ${fs.reduce((a, c) => a + c, 0)}.`, bJwb(fs.reduce((a, c) => a + c, 0))] }); },
    () => { const a = acak(2, 9), b = acak(3, 12), n = a * b, kiri = ya();
      return isian(kiri ? `${n} = ${a} × □<br>Nilai □ adalah …` : `${n} = □ × ${b}<br>Nilai □ adalah …`, kiri ? b : a,
        { petunjuk: "Pasangan faktor: dua bilangan yang dikalikan hasilnya bilangan itu.", bahas: `${a} × ${b} = ${n}, jadi □ = ${kiri ? b : a}. Pasangan ${a} dan ${b} adalah faktor dari ${n}.`,
          langkah: [`□ = ${n} : ${kiri ? a : b}.`, `${n} : ${kiri ? a : b} = ${kiri ? b : a}. Cek: ${a} × ${b} = ${n}.`, bJwb(kiri ? b : a)] }); },
    () => { const x = nama(), wadah = pilih(["kantong", "kotak", "toples", "keranjang"]), benda = pilih(["kelereng", "permen", "kancing", "jeruk", "manik-manik"]), k = acak(2, 9), h = acak(3, 12), n = k * h;
      return isian(`${x} memasukkan ${n} ${benda} ke dalam ${k} ${wadah} sama banyak tanpa sisa. Setiap ${wadah} berisi … ${benda}.`, h,
        { satuan: benda, petunjuk: `${k} adalah faktor dari ${n}. Cari pasangannya.`, bahas: `${n} : ${k} = ${h}, karena ${k} × ${h} = ${n}.`,
          langkah: [`Dibagi sama banyak ke ${k} ${wadah}: ${n} : ${k}.`, `${k} × ${h} = ${n}, jadi ${n} : ${k} = ${h}.`, bJwb(`${h} ${benda}`)] }); },
    () => { const n = pilih([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 44, 45, 48, 50, 54, 56, 60, 63, 64, 70, 72, 75, 80, 84, 90, 96, 100]), fs = faktor(n), genap = ya(), d = fs.filter(f => (f % 2 === 0) === genap);
      if (!d.length) return isian(`Banyak faktor ganjil dari ${n} adalah …`, fs.filter(f => f % 2).length, { bahas: `Faktor ${n}: ${fs.join(", ")}.`,
        langkah: [...bFaktor(n), `Faktor ganjil: ${fs.filter(f => f % 2).join(", ")}.`, bJwb(fs.filter(f => f % 2).length)] });
      return isian(`Banyak faktor <b>${genap ? "genap" : "ganjil"}</b> dari ${n} adalah …`, d.length,
        { petunjuk: "Tulis semua faktornya dulu, lalu pilih.", bahas: `Faktor ${n}: ${fs.join(", ")}. Faktor ${genap ? "genap" : "ganjil"}: ${d.join(", ")} → ${d.length} faktor.`,
          langkah: [...bFaktor(n), `Faktor ${genap ? "genap" : "ganjil"}: ${d.join(", ")}.`, `Banyaknya ${d.length}.`, bJwb(d.length)] }); },
  ],
  3: [
    () => { const a = acak(2, 6), b = acak(3, 8); if (a === b) return isian(`KPK dari 4 dan 6 adalah …`, 12, { bahas: "Kelipatan 4: 4, 8, 12. Kelipatan 6: 6, 12.", langkah: [...bKPK([4, 6]), bJwb(12)] });
      return isian(`Kelipatan persekutuan terkecil (KPK) dari ${a} dan ${b} adalah …`, kpk(a, b), { petunjuk: "Tulis kelipatan masing-masing, cari yang sama paling kecil.", bahas: `KPK ${a} dan ${b} = ${kpk(a, b)}.`,
        langkah: [...bKPK([a, b]), bJwb(kpk(a, b))] }); },
    () => { const g = acak(2, 6), a = g * acak(2, 5), b = g * acak(2, 5); if (a === b) return isian(`FPB dari 12 dan 18 adalah …`, 6, { bahas: "Faktor sama terbesar = 6.", langkah: [...bFPB([12, 18]), bJwb(6)] });
      return isian(`Faktor persekutuan terbesar (FPB) dari ${a} dan ${b} adalah …`, fpb(a, b), { petunjuk: "Tulis faktor masing-masing, cari yang sama paling besar.", bahas: `Faktor ${a}: ${faktor(a).join(", ")}. Faktor ${b}: ${faktor(b).join(", ")}. FPB = ${fpb(a, b)}.`,
        langkah: [...bFPB([a, b]), bJwb(fpb(a, b))] }); },
    () => { const a = acak(1, 30), b = a + acak(10, 25); let c = 0, l = []; for (let i = a + 1; i < b; i++) if (faktor(i).length === 2) { c++; l.push(i); }
      return isian(`Banyak bilangan prima di antara ${a} dan ${b} adalah …`, c, { petunjuk: "Bilangan prima hanya punya 2 faktor: 1 dan dirinya sendiri.", bahas: `Bilangan primanya: ${l.join(", ") || "tidak ada"}.`,
        langkah: ["Bilangan prima hanya punya 2 faktor: 1 dan dirinya sendiri. (1 bukan bilangan prima.)", `Periksa bilangan ${a + 1} sampai ${b - 1}. Yang prima: ${l.join(", ") || "tidak ada"}.`, `Banyaknya ${c}.`, bJwb(c)] }); },
  ],
  4: [
    () => { let a = acak(4, 24), b = acak(4, 24); while (a === b) b = acak(4, 24); return isian(`KPK dari ${a} dan ${b} adalah …`, kpk(a, b), { petunjuk: "Pakai faktorisasi prima: ambil semua faktor dengan pangkat terbesar.", bahas: `${a} = ${tulisFP(faktorPrima(a))}, ${b} = ${tulisFP(faktorPrima(b))}. KPK = ${kpk(a, b)}.`,
      langkah: [...bKPK([a, b]), bJwb(kpk(a, b))] }); },
    () => { const g = acak(3, 16), a = g * acak(2, 6), b = g * acak(2, 6); if (a === b) return isian(`FPB dari 36 dan 48 adalah …`, 12, { bahas: "FPB = 12.", langkah: [...bFPB([36, 48]), bJwb(12)] });
      return isian(`FPB dari ${a} dan ${b} adalah …`, fpb(a, b), { petunjuk: "Ambil faktor prima yang sama dengan pangkat terkecil.", bahas: `${a} = ${tulisFP(faktorPrima(a))}, ${b} = ${tulisFP(faktorPrima(b))}. FPB = ${fpb(a, b)}.`,
        langkah: [...bFPB([a, b]), bJwb(fpb(a, b))] }); },
    () => { let a = acak(2, 9), b = acak(3, 12); while (a === b || kpk(a, b) === Math.max(a, b)) b = acak(3, 12); const [l1, l2] = ambil(["merah", "kuning", "hijau", "biru", "ungu"], 2);
      return isian(`Lampu ${l1} menyala setiap ${a} detik dan lampu ${l2} setiap ${b} detik. Kedua lampu baru saja menyala bersama. Kedua lampu akan menyala bersama lagi setelah … detik.`, kpk(a, b),
        { satuan: "detik", petunjuk: "Menyala bersama lagi → cari KPK.", bahas: `KPK ${a} dan ${b} = ${kpk(a, b)}, jadi kedua lampu menyala bersama lagi setelah ${kpk(a, b)} detik.`,
          langkah: [`Menyala bersama lagi → cari KPK dari ${a} dan ${b}.`, ...bKPK([a, b]), bJwb(`${kpk(a, b)} detik`)] }); },
    () => { const g = acak(2, 8); let x, y; do { x = acak(2, 6); y = acak(2, 6); } while (x === y || fpb(x, y) !== 1); const A = g * x, B = g * y, [b1, b2] = pilih([["pensil", "buku tulis"], ["roti", "susu kotak"], ["jeruk", "salak"], ["balon", "topi pesta"]]);
      return isian(`Bu guru mempunyai ${A} ${b1} dan ${B} ${b2}. Semuanya akan dibagikan kepada beberapa anak sehingga setiap anak mendapat ${b1} dan ${b2} sama banyak. Paling banyak ada … anak yang mendapat bagian.`, g,
        { satuan: "anak", petunjuk: "Dibagi sama banyak kepada sebanyak-banyaknya anak → cari FPB.", bahas: `FPB ${A} dan ${B} = ${g}. Setiap anak mendapat ${x} ${b1} dan ${y} ${b2}.`,
          langkah: [`Dibagi sama banyak kepada sebanyak-banyaknya anak → cari FPB dari ${A} dan ${B}.`, ...bFPB([A, B]), bJwb(`${g} anak`)] }); },
    () => { const f = {}; const ps = ambil([2, 3, 5, 7], acak(2, 3)); ps.forEach(p => { f[p] = p === 2 ? acak(1, 3) : p === 3 ? acak(1, 2) : 1; }); const ur = {}; Object.keys(f).sort((a, b) => a - b).forEach(k => { ur[k] = f[k]; });
      const n = Object.entries(ur).reduce((s, [p, e]) => s * p ** e, 1);
      const urai = Object.entries(ur).flatMap(([p, e]) => Array(e).fill(+p)), kumul = []; urai.reduce((s, p, i) => { if (i) kumul.push(`${fmt(s)} × ${p} = ${fmt(s * p)}`); return s * p; }, urai[0]);
      return isian(`Bilangan yang faktorisasi primanya ${tulisFP(ur)} adalah …`, n, { petunjuk: "Kalikan semua faktornya. Pangkat 2 artinya dikali dirinya sendiri.", bahas: `${Object.entries(ur).map(([p, e]) => Array(e).fill(p).join(" × ")).join(" × ")} = ${fmt(n)}.`,
        langkah: [`Pangkat artinya dikali dirinya sendiri, jadi ${tulisFP(ur)} = ${urai.join(" × ")}.`, `Kalikan dari kiri: ${kumul.join("; ")}.`, bJwb(fmt(n))] }); },
  ],
  5: [
    () => { let n; do n = pilih([2, 3]) ** acak(1, 3) * pilih([3, 5, 7, 9, 15, 25, 21]) * pilih([1, 2, 5]); while (Object.keys(faktorPrima(n)).length < 2); const f = faktorPrima(n), k = pilih(Object.keys(f)), sembunyi = ya();
      const tampil = Object.entries(f).map(([p, e]) => (p === k ? (sembunyi ? `${p}<sup>□</sup>` : "□") : e > 1 ? `${p}<sup>${e}</sup>` : p)).join(" × ");
      return isian(`Faktorisasi prima dari <b>${fmt(n)}</b> adalah ${tampil}.<br>Nilai □ adalah …`, sembunyi ? f[k] : +k, { petunjuk: "Gunakan pohon faktor.", bahas: `${fmt(n)} = ${tulisFP(f)}.`,
        langkah: [bPohon(n), `Kumpulkan faktor yang sama dalam bentuk pangkat: ${fmt(n)} = ${tulisFP(f)}.`,
          sembunyi ? `Bandingkan dengan ${tampil}: faktor ${k} muncul ${f[k]} kali, jadi pangkatnya ${f[k]}.` : `Bandingkan dengan ${tampil}: faktor prima yang belum tertulis adalah ${k}.`, bJwb(sembunyi ? f[k] : k)] }); },
    keTKA(() => { const n = pilih([2, 3]) ** acak(1, 3) * pilih([3, 5, 7, 9, 15, 25, 21]) * pilih([1, 2, 5]); const f = faktorPrima(n), k = Object.keys(f);
      const salah = []; const f1 = { ...f }; f1[k[0]]++; salah.push(tulisFP(f1)); if (f[k[0]] > 1) { const f2 = { ...f }; f2[k[0]]--; salah.push(tulisFP(f2)); }
      const f3 = { ...f }; if (k.length > 1) { f3[k[1]] = (f3[k[1]] || 0) + 1; salah.push(tulisFP(f3)); } salah.push(tulisFP({ ...f, 11: 1 })); salah.push(tulisFP({ 2: 1, ...f, [k[k.length - 1]]: f[k[k.length - 1]] + 1 }));
      return pg(`Faktorisasi prima dari <b>${fmt(n)}</b> adalah …`, tulisFP(f), salah, { petunjuk: "Gunakan pohon faktor.", bahas: `${fmt(n)} = ${tulisFP(f)}.`,
        langkah: [bPohon(n), `Faktor primanya: ${Object.entries(f).flatMap(([p, e]) => Array(e).fill(p)).join(" × ")}.`, `Faktor yang sama ditulis sebagai pangkat: ${tulisFP(f)}.`, bJwb(tulisFP(f))] }); }),
  ],
  6: [
    () => { const [a, b, c] = ambil([4, 6, 8, 9, 10, 12, 15, 18, 20], 3); return isian(`KPK dari ${a}, ${b}, dan ${c} adalah …`, kpk3(a, b, c), { bahas: `KPK = ${kpk3(a, b, c)}.`, langkah: [...bKPK([a, b, c]), bJwb(kpk3(a, b, c))] }); },
    () => { const g = acak(2, 12), [x, y, z] = ambil([2, 3, 4, 5, 6, 7], 3); return isian(`FPB dari ${g * x}, ${g * y}, dan ${g * z} adalah …`, fpb3(g * x, g * y, g * z), { bahas: `FPB = ${fpb3(g * x, g * y, g * z)}.`,
      langkah: [...bFPB([g * x, g * y, g * z]), bJwb(fpb3(g * x, g * y, g * z))] }); },
  ],
  7: [
    () => { const g = acak(4, 12), [x, y] = (() => { let p; do p = ambil([2, 3, 4, 5, 7], 2); while (fpb(...p) !== 1); return p; })(), [b1, b2] = ambil(["jeruk", "apel", "salak", "mangga", "pisang"], 2), A = g * x, B = g * y, t = ya();
      return isian(`Ibu mempunyai ${A} ${b1} dan ${B} ${b2}. Buah-buahan itu dimasukkan ke dalam kantong dengan isi yang sama banyak untuk setiap jenisnya. ${t ? "Banyak kantong <b>paling banyak</b> yang diperlukan adalah …" : `Jika kantongnya sebanyak-banyaknya, setiap kantong berisi … ${b1}.`}`,
        t ? g : x, { petunjuk: "Membagi rata sebanyak-banyaknya → gunakan FPB.", bahas: `FPB ${A} dan ${B} = ${g} kantong. Tiap kantong berisi ${x} ${b1} dan ${y} ${b2}.`,
          langkah: [`Membagi rata ke kantong sebanyak-banyaknya → cari FPB dari ${A} dan ${B}.`, ...bFPB([A, B]), ...(t ? [] : [`Ada ${g} kantong, jadi setiap kantong berisi ${A} : ${g} = ${x} ${b1}.`]), bJwb(t ? `${g} kantong` : `${x} ${b1}`)] }); },
    () => { let a = acak(2, 8), b = acak(3, 10); while (a === b) b = acak(3, 10); const [x, y] = namaBeda(2), kg = pilih(["berenang", "ke perpustakaan", "latihan pramuka", "bermain bulu tangkis"]);
      return isian(`${x} ${kg} setiap ${a} hari sekali, sedangkan ${y} setiap ${b} hari sekali. Hari ini mereka ${kg} bersama. Mereka akan ${kg} bersama lagi setelah … hari.`, kpk(a, b),
        { petunjuk: "Kejadian berulang dan bertemu lagi → gunakan KPK.", bahas: `KPK ${a} dan ${b} = ${kpk(a, b)} hari.`,
          langkah: [`Kegiatan berulang dan bersama lagi → cari KPK dari ${a} dan ${b}.`, ...bKPK([a, b]), bJwb(`${kpk(a, b)} hari`)] }); },
  ],
  8: [
    () => { let a = pilih([3, 4, 5, 6, 8]), b = acak(4, 12); while (a === b || kpk(a, b) % 7 === 0) b = acak(4, 12); const h0 = acak(0, 6), K = kpk(a, b), hasil = HARI[(h0 + K) % 7];
      return pg(`Bus A berangkat dari terminal setiap ${a} hari, bus B setiap ${b} hari. Pada hari <b>${HARI[h0]}</b> kedua bus berangkat bersama. Kedua bus berangkat bersama lagi pada hari …`, hasil, HARI.filter(h => h !== hasil).slice(0, 6).sort(() => Math.random() - 0.5),
        { petunjuk: `Cari KPK-nya, lalu hitung sisa pembagian dengan 7 (satu minggu).`, bahas: `KPK = ${K} hari. ${K} : 7 = ${Math.floor(K / 7)} minggu sisa ${K % 7} hari. ${HARI[h0]} + ${K % 7} hari = ${hasil}.`,
          langkah: [...bKPK([a, b]), `Satu minggu 7 hari: ${K} : 7 = ${Math.floor(K / 7)} minggu sisa ${K % 7} hari.`, `Setelah tepat ${Math.floor(K / 7)} minggu harinya kembali ${HARI[h0]}. Maju ${K % 7} hari lagi: ${hasil}.`, bJwb(hasil)] }); },
    () => { const a = pilih([6, 8, 10, 12, 15]), b = pilih([9, 12, 16, 18, 20]), j = acak(6, 9) * 60 + pilih([0, 15, 30]), K = kpk(a, b);
      if (a === b) return isian("KPK 12 dan 18 adalah …", 36, { bahas: "KPK 12 dan 18 = 36.", langkah: [...bKPK([12, 18]), bJwb(36)] });
      const hasil = pkl(j + K); return pg(`Lampu merah berkedip setiap ${a} menit dan lampu biru setiap ${b} menit. Keduanya berkedip bersama pukul ${pkl(j)}. Mereka akan berkedip bersama lagi pukul …`, hasil, [pkl(j + a * b), pkl(j + K / 2), pkl(j + K + 10), pkl(j + a + b)],
        { bahas: `KPK ${a} dan ${b} = ${K} menit. ${pkl(j)} + ${K} menit = ${hasil}.`,
          langkah: [`Berkedip bersama lagi → cari KPK dari ${a} dan ${b}.`, ...bKPK([a, b]), `${K} menit${K >= 60 ? ` = ${Math.floor(K / 60)} jam${K % 60 ? ` ${K % 60} menit` : ""}` : ""}. Pukul ${pkl(j)} + ${K} menit = pukul ${hasil}.`, bJwb(hasil)] }); },
    () => { const g = acak(3, 8), [x, y, z] = ambil([2, 3, 4, 5, 7], 3), [b1, b2, b3] = ["buku tulis", "pensil", "penghapus"];
      return isian(`Untuk paket hadiah tersedia ${g * x} ${b1}, ${g * y} ${b2}, dan ${g * z} ${b3}. Semua dibagi ke paket dengan isi sama banyak. Paling banyak dapat dibuat … paket.`, g,
        { bahas: `FPB ${g * x}, ${g * y}, ${g * z} = ${g}.`,
          langkah: [`Isi setiap paket sama, paketnya sebanyak-banyaknya → cari FPB dari ${g * x}, ${g * y}, dan ${g * z}.`, ...bFPB([g * x, g * y, g * z]), bJwb(`${g} paket`)] }); },
  ],
  9: [
    () => { const [a, b] = ambil([4, 5, 6, 8, 10, 12, 15], 2), K = kpk(a, b), T = K * acak(3, 8) + acak(0, K - 1), jam = T >= 60;
      return isian(`Alarm A berbunyi setiap ${a} menit dan alarm B setiap ${b} menit. Keduanya berbunyi bersama tepat pada menit ke-0. Selama ${T} menit berikutnya, berapa kali lagi keduanya berbunyi bersama?`, Math.floor(T / K),
        { petunjuk: "Cari KPK, lalu hitung berapa kali KPK muat dalam waktu itu.", bahas: `KPK = ${K}. ${T} : ${K} = ${Math.floor(T / K)} (sisa ${T % K}).`,
          langkah: [...bKPK([a, b]), `Keduanya berbunyi bersama setiap ${K} menit: menit ke-${bDeret(K, Math.floor(T / K) * K, K)}.`, `${T} : ${K} = ${Math.floor(T / K)} sisa ${T % K}, jadi ada ${Math.floor(T / K)} kali dalam ${T} menit.`, bJwb(Math.floor(T / K))] }); },
    () => { const g = acak(5, 25), [x, y, z] = (() => { let p; do p = ambil([2, 3, 4, 5, 6, 7], 3); while (fpb3(...p) !== 1); return p; })(), A = g * x, B = g * y, C = g * z;
      return isian(`Tiga utas tali panjangnya ${A} cm, ${B} cm, dan ${C} cm. Ketiganya dipotong menjadi potongan yang sama panjang, <b>sepanjang-panjangnya</b>, tanpa sisa. Banyak potongan tali seluruhnya adalah …`, x + y + z,
        { petunjuk: "Panjang tiap potongan = FPB ketiga panjang tali.", bahas: `FPB = ${g} cm. Potongan: ${A}:${g} + ${B}:${g} + ${C}:${g} = ${x} + ${y} + ${z} = ${x + y + z}.`,
          langkah: [`Potongan terpanjang tanpa sisa = FPB dari ${A}, ${B}, dan ${C}.`, ...bFPB([A, B, C]), `Banyak potongan: ${A} : ${g} + ${B} : ${g} + ${C} : ${g} = ${x} + ${y} + ${z} = ${x + y + z}.`, bJwb(x + y + z)] }); },
    () => { const [a, b, c] = pilih([[2, 3, 4], [2, 3, 5], [3, 4, 6], [2, 4, 5], [4, 6, 8], [2, 5, 6], [3, 5, 6], [4, 5, 10], [3, 6, 8], [2, 6, 9]]), K = kpk3(a, b, c), [x, y, z] = namaBeda(3);
      const [bln, pjg, blnB] = pilih([["Juli", 31, "Agustus"], ["Maret", 31, "April"], ["April", 30, "Mei"], ["Juni", 30, "Juli"], ["Oktober", 31, "November"], ["Januari", 31, "Februari"]]), t = acak(5, pjg - 2);
      const tgl = d => (t + d <= pjg ? `${t + d} ${bln}` : `${t + d - pjg} ${blnB}`), benar = tgl(K);
      const salah = [a * b * c, K + c, K - a, K + 1, a + b + c, a * b, K - 1].filter(d => d > 0 && d !== K && t + d <= pjg + 28).map(tgl);
      return pg(`Mulai tanggal <b>${t} ${bln}</b>, ${x} piket setiap ${a} hari, ${y} setiap ${b} hari, dan ${z} setiap ${c} hari. Pada tanggal itu mereka piket bersama. Mereka akan piket bersama lagi pada tanggal …`, benar, salah,
        { petunjuk: `Cari KPK ketiga bilangan. Ingat, bulan ${bln} ada ${pjg} hari.`, bahas: `KPK ${a}, ${b}, dan ${c} = ${K}. ${t} ${bln} + ${K} hari = ${benar}${t + K > pjg ? ` (karena ${bln} hanya ${pjg} hari, ${t + K} − ${pjg} = ${t + K - pjg})` : ""}.`,
          langkah: [...bKPK([a, b, c]), `${t} + ${K} = ${t + K}.`, t + K > pjg ? `${bln} hanya ${pjg} hari, jadi lewat ke bulan berikutnya: ${t + K} − ${pjg} = ${t + K - pjg} ${blnB}.` : `${t + K} masih di bulan ${bln} (ada ${pjg} hari).`, bJwb(benar)] }); },
    () => { const g = pilih([20, 25, 30, 40, 50, 60]); let x, y; do { [x, y] = ambil([2, 3, 4, 5, 6, 7], 2); } while (fpb(x, y) !== 1); const A = g * x, B = g * y, tanya = ya();
      return isian(`Lantai sebuah ruangan berukuran ${A} cm × ${B} cm akan ditutup ubin berbentuk persegi yang sama besar. Ubin dipilih <b>sebesar-besarnya</b> agar tidak ada ubin yang dipotong. ${tanya ? "Banyak ubin yang diperlukan adalah …" : "Panjang sisi setiap ubin adalah … cm."}`, tanya ? x * y : g,
        { satuan: tanya ? "ubin" : "cm", petunjuk: "Sisi ubin terbesar = FPB panjang dan lebar lantai.", bahas: `FPB ${A} dan ${B} = ${g}, jadi sisi ubin ${g} cm. Banyak ubin ${A} : ${g} × ${B} : ${g} = ${x} × ${y} = ${x * y}.`,
          langkah: [`Sisi ubin terbesar = FPB dari ${A} dan ${B}.`, ...bFPB([A, B]), ...(tanya ? [`Banyak ubin: (${A} : ${g}) × (${B} : ${g}) = ${x} × ${y} = ${x * y}.`] : []), bJwb(tanya ? `${x * y} ubin` : `${g} cm`)] }); },
    () => { const g = acak(2, 9); let x, y; do { [x, y] = ambil([2, 3, 4, 5, 7], 2); } while (fpb(x, y) !== 1); const A = g * Math.min(x, y), B = g * Math.max(x, y), F = g, K = g * x * y;
      const pasang = [[`FPB dari ${A} dan ${B} adalah ${F}.`, `FPB dari ${A} dan ${B} adalah ${2 * F}.`], [`KPK dari ${A} dan ${B} adalah ${K}.`, `KPK dari ${A} dan ${B} adalah ${A * B}.`],
        [`${A} × ${B} sama dengan FPB × KPK kedua bilangan itu.`, `${A} + ${B} sama dengan FPB + KPK kedua bilangan itu.`], ["KPK kedua bilangan itu habis dibagi FPB-nya.", "FPB kedua bilangan itu habis dibagi KPK-nya."]];
      const flag = kocok([true, false, ya(), ya()]);
      const alasan = [[`FPB-nya memang ${F}`, `FPB-nya ${F}, bukan ${2 * F}`], [`KPK-nya memang ${K}`, `KPK-nya ${K}, bukan ${A * B}`],
        [`${A} × ${B} = ${fmt(A * B)} dan ${F} × ${K} = ${fmt(F * K)}`, `${A} + ${B} = ${A + B}, sedangkan ${F} + ${K} = ${F + K}`], [`${K} : ${F} = ${K / F} tanpa sisa`, `${F} lebih kecil daripada ${K}, jadi tidak habis dibagi ${K}`]];
      const butir = pasang.map((p, i) => ({ t: flag[i] ? p[0] : p[1], b: flag[i], a: alasan[i][flag[i] ? 0 : 1] }));
      return bAlasan(pgk(`Pilih <b>semua</b> pernyataan yang benar tentang bilangan <b>${A}</b> dan <b>${B}</b>.`, butir,
        { petunjuk: "Hitung FPB dan KPK dengan faktorisasi prima, lalu periksa satu per satu.", bahas: `${A} = ${tulisFP(faktorPrima(A))}, ${B} = ${tulisFP(faktorPrima(B))}. FPB = ${F}, KPK = ${K}. ${A} × ${B} = ${fmt(A * B)} = ${F} × ${K}.` }), butir,
        [`${bFaktorisasi([A, B]).replace(/\.$/, "")}. Jadi FPB = ${tulisFP(bGabungFP([A, B], Math.min))} = ${F} dan KPK = ${tulisFP(bGabungFP([A, B], Math.max))} = ${K}.`]); },
  ],
  10: [
    () => { const g = acak(2, 12), x = acak(2, 9); let y = acak(2, 9); while (fpb(x, y) !== 1 || x === y) y = acak(2, 11); const A = g * x, B = g * y, K = kpk(A, B);
      return isian(`FPB dua bilangan adalah ${g} dan KPK-nya ${K}. Jika salah satu bilangan adalah ${A}, bilangan yang lain adalah …`, B,
        { petunjuk: "Hasil kali dua bilangan = FPB × KPK.", bahas: `${g} × ${K} = ${g * K}. ${g * K} : ${A} = ${B}.`,
          langkah: ["Ingat: bilangan pertama × bilangan kedua = FPB × KPK.", `FPB × KPK = ${g} × ${K} = ${fmt(g * K)}.`, `Bilangan yang lain = ${fmt(g * K)} : ${A} = ${B}.`, bJwb(B)] }); },
    () => { const [a, b, c] = ambil([3, 4, 5, 6, 8, 9, 10], 3), K = kpk3(a, b, c); let r = acak(1, Math.min(a, b, c) - 1);
      return isian(`Bilangan terkecil yang lebih dari ${r} dan jika dibagi ${a}, ${b}, atau ${c} selalu bersisa ${r} adalah …`, K + r,
        { petunjuk: "KPK habis dibagi ketiganya. Tambahkan sisanya.", bahas: `KPK ${a}, ${b}, ${c} = ${K}. ${K} + ${r} = ${K + r}.`,
          langkah: [`Bilangan yang habis dibagi ${a}, ${b}, dan ${c} adalah kelipatan KPK-nya.`, ...bKPK([a, b, c]), `Agar selalu bersisa ${r}, tambahkan ${r}: ${K} + ${r} = ${K + r}.`, bJwb(K + r)] }); },
    () => { const [a, b] = ambil([3, 4, 5, 6, 8], 2), K = kpk(a, b), lo = acak(1, 4) * 100, hi = lo + 100; let c = 0; for (let n = lo; n <= hi; n++) if (n % K === 0) c++;
      return isian(`Banyak bilangan antara ${lo} dan ${hi} (termasuk keduanya) yang habis dibagi ${a} dan juga habis dibagi ${b} adalah …`, c,
        { petunjuk: `Habis dibagi ${a} dan ${b} = habis dibagi KPK-nya.`, bahas: `KPK = ${K}. Kelipatan ${K} di antara ${lo}–${hi} ada ${c}.`,
          langkah: [`Habis dibagi ${a} dan ${b} sama dengan habis dibagi KPK-nya.`, ...bKPK([a, b]), `Kelipatan ${K} dari ${lo} sampai ${hi}: ${bDeret(Math.ceil(lo / K) * K, Math.floor(hi / K) * K, K)}.`, `Banyaknya ${c}.`, bJwb(c)] }); },
    () => { const [a, b, c] = pilih([[2, 3, 4], [2, 3, 5], [3, 4, 6], [4, 5, 6], [2, 5, 8], [3, 5, 6], [4, 6, 9], [3, 4, 5]]), K = kpk3(a, b, c), N = acak(2, 9) * 100 + acak(1, 99), v = (Math.floor(N / K) + 1) * K;
      return isian(`Bilangan terkecil yang <b>lebih dari ${N}</b> dan habis dibagi ${a}, ${b}, dan ${c} adalah …`, v,
        { petunjuk: "Habis dibagi ketiganya berarti kelipatan KPK-nya.", bahas: `KPK ${a}, ${b}, ${c} = ${K}. ${N} : ${K} = ${Math.floor(N / K)} sisa ${N % K}, jadi kelipatan ${K} berikutnya ${(Math.floor(N / K) + 1)} × ${K} = ${v}.`,
          langkah: [...bKPK([a, b, c]), `${N} : ${K} = ${Math.floor(N / K)} sisa ${N % K}.`, `Kelipatan ${K} berikutnya: ${Math.floor(N / K) + 1} × ${K} = ${fmt(v)}.`, bJwb(fmt(v))] }); },
    () => { const [a, b] = ambil([4, 5, 6, 8, 9, 10, 12], 2), K = kpk(a, b), d = acak(1, Math.min(a, b) - 1);
      return isian(`Sebuah bilangan jika dibagi ${a} bersisa ${a - d} dan jika dibagi ${b} bersisa ${b - d}. Bilangan cacah terkecil yang memenuhi adalah …`, K - d,
        { petunjuk: `Perhatikan: bilangan itu kurang ${d} dari kelipatan ${a} dan juga kurang ${d} dari kelipatan ${b}.`, bahas: `Bilangan + ${d} habis dibagi ${a} dan ${b}, jadi bilangan + ${d} = KPK = ${K}. Bilangannya ${K} − ${d} = ${K - d}.`,
          langkah: [`Sisa ${a - d} jika dibagi ${a} berarti kurang ${d} untuk habis dibagi ${a}. Sisa ${b - d} jika dibagi ${b} juga kurang ${d}.`, `Jadi bilangan + ${d} habis dibagi ${a} dan ${b}; yang terkecil adalah KPK-nya.`,
            ...bKPK([a, b]), `Bilangannya = ${K} − ${d} = ${K - d}.`, bJwb(K - d)] }); },
    () => { const [a, b, c] = pilih([[10, 15, 20], [12, 15, 20], [10, 12, 15], [15, 20, 30], [12, 18, 24], [20, 30, 40]]), K = kpk3(a, b, c), j0 = acak(6, 8) * 60, durasi = K * acak(2, 4) + pilih([0, 10, 20]);
      const kali = Math.floor(durasi / K) + 1;
      return isian(`Di terminal, bus jurusan A berangkat setiap ${a} menit, jurusan B setiap ${b} menit, dan jurusan C setiap ${c} menit. Ketiganya berangkat bersama pukul ${pkl(j0)}. Dari pukul ${pkl(j0)} sampai pukul ${pkl(j0 + durasi)}, ketiga bus berangkat bersama sebanyak … kali (termasuk pukul ${pkl(j0)}).`, kali,
        { petunjuk: "Cari KPK ketiga waktu, lalu hitung berapa kali muat dalam rentang waktu itu.", bahas: `KPK = ${K} menit. Waktu ${durasi} menit memuat ${Math.floor(durasi / K)} kali ${K} menit, ditambah keberangkatan pukul ${pkl(j0)}: ${kali} kali.`,
          langkah: [...bKPK([a, b, c]), `Dari pukul ${pkl(j0)} sampai ${pkl(j0 + durasi)} ada ${durasi} menit. ${durasi} : ${K} = ${Math.floor(durasi / K)} sisa ${durasi % K}.`,
            `Berangkat bersama ${Math.floor(durasi / K)} kali setelah pukul ${pkl(j0)}, ditambah pukul ${pkl(j0)} sendiri: ${Math.floor(durasi / K)} + 1 = ${kali}.`, bJwb(kali)] }); },
  ],
});

/* ================= Misi 5: Pecahan ================= */
function svgPecahan(p, q, bentuk) {
  if (bentuk === "lingkaran" && q <= 12) {
    let s = svgBuka(160, 160, `lingkaran dibagi ${q} bagian, ${p} diarsir`); const r = 70, cx = 80, cy = 80;
    for (let i = 0; i < q; i++) { const a1 = (i / q) * 2 * Math.PI - Math.PI / 2, a2 = ((i + 1) / q) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1), x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      s += `<path d="M${cx} ${cy}L${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}Z" class="${i < p ? "isi" : "kosong"}"/>`; }
    return s + "</svg>";
  }
  const w = Math.min(36, Math.floor(300 / q)); let s = svgBuka(w * q + 4, 54, `persegi panjang dibagi ${q} bagian, ${p} diarsir`);
  const terisi = kocok([...Array(q)].map((_, i) => i < p));
  for (let i = 0; i < q; i++) s += `<rect x="${2 + i * w}" y="2" width="${w}" height="50" class="${terisi[i] ? "isi" : "kosong"}"/>`;
  return s + "</svg>";
}
const pcAcak = (maxQ = 12) => { const q = acak(2, maxQ), p = acak(1, q - 1); return [p, q]; };
/* Langkah menyederhanakan N/D (kosong bila sudah paling sederhana dan < 1) */
const bSed = (N, D) => { const g = fpb(N, D), [s, t] = sed(N, D); if (g === 1 && N < D) return [];
  return [`${g > 1 ? `Sederhanakan (bagi pembilang dan penyebut dengan ${g})` : "Ubah ke pecahan campuran"}: ${pc(N, D)} = ${g > 1 && s >= t && t !== 1 ? `${pc(s, t)} = ` : ""}${pcT(s, t)}.`]; };
/* Langkah a ± b untuk pecahan [p, q] */
function bPcOp(a, b, plus) {
  const K = kpk(a[1], b[1]), x = a[0] * K / a[1], y = b[0] * K / b[1], N = plus ? x + y : x - y, op = plus ? "+" : "−";
  return [a[1] === b[1] ? `Penyebutnya sudah sama (${K}), jadi ${plus ? "jumlahkan" : "kurangkan"} pembilangnya saja.`
    : `Samakan penyebut. KPK dari ${a[1]} dan ${b[1]} adalah ${K}. Ubah: ${[a, b].filter(f => f[1] !== K).map(f => `${pc(...f)} = ${pc(f[0] * K / f[1], K)}`).join(" dan ")}.`,
    `${pc(x, K)} ${op} ${pc(y, K)} = ${pc(N, K)}.`, ...bSed(N, K)];
}
daftarMisi("bil", "b5", "Pecahan", "🍕", {
  1: [
    () => { const q = acak(3, 10), p = acak(1, q - 1); return isianPc(`Pecahan yang menunjukkan bagian yang <b>diarsir</b> adalah …`, p, q,
      { gambar: svgPecahan(p, q, ya() ? "lingkaran" : "batang"), sederhana: false, petunjuk: "Pembilang = bagian diarsir, penyebut = semua bagian.", bahas: `${p} bagian diarsir dari ${q} bagian → ${pc(p, q)}.`,
      langkah: [`Hitung semua bagian: ${q}. Ini penyebutnya (angka bawah).`, `Hitung bagian yang diarsir: ${p}. Ini pembilangnya (angka atas).`, bJwbPc(p, q)] }); },
    () => { const q = acak(3, 10), p = acak(1, q - 1); return isianPc(`Pecahan yang menunjukkan bagian yang <b>tidak diarsir</b> adalah …`, q - p, q,
      { gambar: svgPecahan(p, q, "batang"), sederhana: false, bahas: `${q - p} dari ${q} bagian tidak diarsir → ${pc(q - p, q)}.`,
      langkah: [`Semua bagian ada ${q}, yang diarsir ${p}.`, `Yang tidak diarsir: ${q} − ${p} = ${q - p} bagian dari ${q} bagian.`, bJwbPc(q - p, q)] }); },
    () => { const NAMA_Q = { 2: "dua", 3: "tiga", 4: "empat", 5: "lima", 6: "enam", 7: "tujuh", 8: "delapan", 9: "sembilan", 10: "sepuluh" }, q = acak(2, 10), p = acak(1, q - 1);
      return isianPc(`Pecahan <i>"${terbilang(p)} per ${NAMA_Q[q]}"</i> ditulis …`, p, q,
        { sederhana: false, petunjuk: "Angka sebelum kata \"per\" adalah pembilang (atas), sesudahnya penyebut (bawah). Ketik dengan garis miring, misalnya 2/5.", bahas: `${terbilang(p)} per ${NAMA_Q[q]} = ${pc(p, q)}.`,
          langkah: [`Kata sebelum "per" adalah pembilang (atas): ${terbilang(p)} = ${p}.`, `Kata sesudah "per" adalah penyebut (bawah): ${NAMA_Q[q]} = ${q}.`, bJwbPc(p, q)] }); },
    () => { const x = nama(), [mkn, ptg] = pilih([["pizza", "potong"], ["kue bolu", "potong"], ["semangka", "potong"], ["cokelat batangan", "kotak kecil"], ["martabak", "potong"]]), q = acak(4, 12), p = acak(1, q - 1);
      return isianPc(`Sebuah ${mkn} dibagi menjadi ${q} ${ptg} sama besar. ${x} memakan ${p} ${ptg}. Bagian ${mkn} yang dimakan ${x} adalah …`, p, q,
        { sederhana: false, petunjuk: "Pembilang = bagian yang dimakan, penyebut = semua bagian.", bahas: `${p} dari ${q} ${ptg} → ${pc(p, q)}.`,
          langkah: [`Penyebut = banyak semua ${ptg} = ${q}.`, `Pembilang = ${ptg} yang dimakan = ${p}.`, bJwbPc(p, q)] }); },
    () => { const q = acak(2, 12), p = acak(1, q - 1), tanya = ya();
      return isian(`Pada pecahan ${pc(p, q)}, ${tanya ? "<b>penyebutnya</b>" : "<b>pembilangnya</b>"} adalah …`, tanya ? q : p,
        { petunjuk: "Pembilang di atas garis, penyebut di bawah garis.", bahas: `${pc(p, q)}: pembilang ${p}, penyebut ${q}.`,
          langkah: [`Pada ${pc(p, q)}: angka di atas garis (pembilang) = ${p}, angka di bawah garis (penyebut) = ${q}.`, `Yang ditanyakan ${tanya ? "penyebut" : "pembilang"}nya.`, bJwb(tanya ? q : p)] }); },
    () => { const q = acak(2, 12);
      return isian(`1 = ${pc("□", q)}<br>Nilai □ adalah …`, q, { petunjuk: "Pecahan bernilai 1 jika pembilang sama dengan penyebut.", bahas: `${pc(q, q)} = 1, jadi □ = ${q}.`,
        langkah: [`Pecahan bernilai 1 jika pembilang sama dengan penyebut, misalnya ${pc(q, q)} = ${q} : ${q} = 1.`, `Penyebutnya ${q}, jadi pembilangnya juga ${q}.`, bJwb(q)] }); },
  ],
  2: [
    () => { const [p, q] = sed(...pcAcak(6)), k = acak(2, 6), atas = ya();
      return isian(`${pc(p, q)} = ${atas ? pc("□", q * k).replace("□", "□") : pc(p * k, "□")}<br>Nilai □ adalah …`, atas ? p * k : q * k,
        { petunjuk: "Pecahan senilai: kalikan pembilang dan penyebut dengan bilangan yang sama.", bahas: `${pc(p, q)} = ${pc(p * k, q * k)} (dikali ${k}).`,
          langkah: ["Pecahan senilai: pembilang dan penyebut dikali bilangan yang sama.", atas ? `Penyebut: ${q} × ${k} = ${q * k}, jadi pengalinya ${k}.` : `Pembilang: ${p} × ${k} = ${p * k}, jadi pengalinya ${k}.`,
            atas ? `Pembilang juga dikali ${k}: ${p} × ${k} = ${p * k}.` : `Penyebut juga dikali ${k}: ${q} × ${k} = ${q * k}.`, bJwb(atas ? p * k : q * k)] }); },
    () => { const x = nama(), mkn = pilih(["kue lapis", "roti tawar", "pizza", "agar-agar", "bolu pandan"]), q = acak(3, 12), p = acak(1, q - 1);
      return isianPc(`${x} memotong ${mkn} menjadi ${q} bagian sama besar. Sebanyak ${p} bagian sudah dimakan. Bagian ${mkn} yang <b>tersisa</b> adalah …`, q - p, q,
        { sederhana: false, petunjuk: "Sisa = semua bagian dikurangi yang dimakan.", bahas: `${q} − ${p} = ${q - p} bagian tersisa dari ${q} → ${pc(q - p, q)}.`,
          langkah: [`Sisa = semua bagian − yang dimakan = ${q} − ${p} = ${q - p} bagian.`, `Sisa ${q - p} dari ${q} bagian ditulis ${pc(q - p, q)}.`, bJwbPc(q - p, q)] }); },
    () => { const q = acak(3, 12), a = acak(1, q - 2), b = acak(1, q - a - 1);
      return isianPc(`${pc(a, q)} + ${pc(b, q)} = …`, a + b, q, { sederhana: false, petunjuk: "Penyebutnya sama: jumlahkan pembilangnya, penyebutnya tetap.", bahas: `${pc(a, q)} + ${pc(b, q)} = ${pc(a + b, q)}.`,
        langkah: [`Penyebutnya sama (${q}): jumlahkan pembilangnya, penyebut tetap.`, `${a} + ${b} = ${a + b}, jadi ${pc(a, q)} + ${pc(b, q)} = ${pc(a + b, q)}.`, bJwbPc(a + b, q)] }); },
    () => { const q = acak(4, 12), x = new Set(); while (x.size < 3) x.add(acak(1, q - 1)); const arr = [...x], besar = ya(), j = besar ? Math.max(...arr) : Math.min(...arr);
      return isianPc(`Pecahan <b>${besar ? "terbesar" : "terkecil"}</b> di antara ${arr.map(p => pc(p, q)).join(", ")} adalah …`, j, q,
        { sederhana: false, petunjuk: "Penyebutnya sama, bandingkan pembilangnya.", bahas: `Penyebut sama, pembilang ${besar ? "terbesar" : "terkecil"} ${j}. Jawabannya ${pc(j, q)}.`,
          langkah: [`Penyebutnya sama (${q}), jadi cukup bandingkan pembilangnya: ${arr.join(", ")}.`, `Pembilang ${besar ? "terbesar" : "terkecil"} adalah ${j}.`, bJwbPc(j, q)] }); },
    () => { const [p, q] = sed(...pcAcak(8)), k = acak(2, 5), bawah = ya();
      return isian(`${pc(p * k, q * k)} = ${bawah ? pc(p, "□") : pc("□", q)}<br>Nilai □ adalah …`, bawah ? q : p,
        { petunjuk: `Bagi pembilang dan penyebut dengan ${k}.`, bahas: `${pc(p * k, q * k)} = ${pc(p, q)} (dibagi ${k}).`,
          langkah: ["Pecahan senilai: pembilang dan penyebut dibagi bilangan yang sama.", `${bawah ? `Pembilang ${p * k} menjadi ${p}` : `Penyebut ${q * k} menjadi ${q}`}, jadi keduanya dibagi ${k}.`,
            bawah ? `Penyebut: ${q * k} : ${k} = ${q}.` : `Pembilang: ${p * k} : ${k} = ${p}.`, bJwb(bawah ? q : p)] }); },
  ],
  3: [
    () => { const [p, q] = sed(...pcAcak(9)), k = acak(2, 8); return isianPc(`Bentuk paling sederhana dari ${pc(p * k, q * k)} adalah …`, p, q, { petunjuk: "Bagi pembilang dan penyebut dengan FPB-nya.", bahas: `FPB ${p * k} dan ${q * k} = ${fpb(p * k, q * k)}. Hasilnya ${pc(p, q)}.`,
      langkah: [`Cari FPB dari ${p * k} dan ${q * k}: ${fpb(p * k, q * k)}.`, `Bagi keduanya dengan ${fpb(p * k, q * k)}: ${p * k} : ${fpb(p * k, q * k)} = ${p} dan ${q * k} : ${fpb(p * k, q * k)} = ${q}.`, bJwb(pcT(p, q))] }); },
    () => { const n = pilih([12, 16, 18, 20, 24, 30, 32, 36, 40]), a = pilih(faktor(n).filter(f => f > 1 && f < n).flatMap(f => [f, n - f]).filter(v => fpb(v, n) > 1 && v < n)), ciri = pilih(["memakai kacamata", "membawa bekal", "suka bersepeda", "ikut pramuka", "berambut panjang"]);
      return isianPc(`Di sebuah kelas ada ${n} siswa. Sebanyak ${a} siswa ${ciri}. Bagian siswa yang ${ciri} dalam pecahan <b>paling sederhana</b> adalah …`, a, n,
        { petunjuk: `Tulis ${a}/${n}, lalu sederhanakan.`, bahas: `${pc(a, n)} dibagi FPB ${fpb(a, n)} = ${pcS(a, n)}.`,
          langkah: [`Bagian siswa yang ${ciri}: ${a} dari ${n} = ${pc(a, n)}.`, `FPB dari ${a} dan ${n} adalah ${fpb(a, n)}.`, `Bagi pembilang dan penyebut dengan ${fpb(a, n)}: ${pc(a, n)} = ${pcS(a, n)}.`, bJwb(pcS(a, n))] }); },
    () => { const q = acak(2, 9), w = acak(1, 5), s = acak(1, q - 1), p = w * q + s;
      return isianPc(`Ubah ${pc(p, q)} menjadi pecahan campuran.`, p, q, { petunjuk: `${p} : ${q} = … sisa … . Hasil bagi jadi bilangan bulat, sisanya jadi pembilang. Ketik dengan spasi, misalnya 2 1/3.`, campuran: true, bahas: `${p} : ${q} = ${w} sisa ${s}, jadi ${pc(p, q)} = ${pcS(p, q)}.`,
      langkah: [`Bagi pembilang dengan penyebut: ${p} : ${q} = ${w} sisa ${s}.`, `Hasil bagi ${w} menjadi bilangan bulat, sisa ${s} menjadi pembilang, penyebut tetap ${q}: ${pcT(p, q)}.`,
        ...(fpb(s, q) > 1 ? [`Sederhanakan pecahannya: ${pc(s, q)} = ${pcS(s, q)}, jadi hasilnya ${pcS(p, q)}.`] : []), bJwb(pcS(p, q))] }); },
    () => { const q = acak(2, 9), w = acak(1, 5), s = acak(1, q - 1);
      return isian(`${w}&nbsp;${pc(s, q)} = ${pc("□", q)}<br>Nilai □ adalah …`, w * q + s, { petunjuk: "Kalikan bilangan bulat dengan penyebut, lalu tambah pembilangnya.", bahas: `${w} × ${q} + ${s} = ${w * q + s}, jadi ${w}&nbsp;${pc(s, q)} = ${pc(w * q + s, q)}.`,
      langkah: [`Kalikan bilangan bulat dengan penyebut: ${w} × ${q} = ${w * q}.`, `Tambahkan pembilangnya: ${w * q} + ${s} = ${w * q + s}. Penyebut tetap ${q}.`, bJwb(w * q + s)] }); },
    () => { const q = pilih([4, 6, 8, 9, 10, 12]), p = pilih([...Array(q - 1).keys()].map(i => i + 1).filter(v => fpb(q - v, q) > 1));
      return isianPc(`1 − ${pc(p, q)} = … (tulis dalam bentuk paling sederhana)`, q - p, q, { petunjuk: `1 = ${pc(q, q)}.`, bahas: `${pc(q, q)} − ${pc(p, q)} = ${pc(q - p, q)} = ${pcS(q - p, q)}.`,
      langkah: [`Ubah 1 menjadi ${pc(q, q)}.`, `${pc(q, q)} − ${pc(p, q)} = ${pc(q - p, q)}.`, ...bSed(q - p, q), bJwb(pcS(q - p, q))] }); },
  ],
  4: [
    keTKA(() => { let a = pcAcak(9), b = pcAcak(9); const v = a[0] / a[1] - b[0] / b[1], t = Math.abs(v) < 1e-9 ? "=" : v > 0 ? ">" : "<";
      return pgTetap(`${pc(...a)} … ${pc(...b)}<br>Tanda yang tepat adalah …`, [">", "<", "="], t, { petunjuk: "Samakan penyebutnya dulu.", bahas: `${pc(a[0] * b[1], a[1] * b[1])} ${t} ${pc(b[0] * a[1], a[1] * b[1])}.`,
      langkah: [`Samakan penyebut: ${a[1]} × ${b[1]} = ${a[1] * b[1]}.`, `${pc(...a)} = ${pc(a[0] * b[1], a[1] * b[1])} dan ${pc(...b)} = ${pc(b[0] * a[1], a[1] * b[1])}.`,
        `Bandingkan pembilangnya: ${a[0] * b[1]} ${t} ${b[0] * a[1]}.`, bJwb(t)] }); }),
    () => { const q = acak(4, 12), a = acak(1, q - 1), b = acak(1, q - 1); if (a === b) return isianPc(`${pc(1, 2)} + ${pc(1, 4)} = …`, 3, 4, { bahas: "2/4 + 1/4 = 3/4.", langkah: [...bPcOp([1, 2], [1, 4], true), bJwb(pc(3, 4))] });
      const [x, y] = a > b ? [a, b] : [b, a]; return isianPc(`${pc(x, q)} − ${pc(y, q)} = …`, x - y, q, { petunjuk: "Penyebut sama: kurangkan pembilangnya saja.", bahas: `${pc(x - y, q)} = ${pcS(x - y, q)}.`,
        langkah: [...bPcOp([x, q], [y, q], false), bJwb(pcS(x - y, q))] }); },
    () => { const q = acak(5, 15), a = acak(1, q - 2), b = acak(1, q - a - 1); return isianPc(`${pc(a, q)} + ${pc(b, q)} = …`, a + b, q, { petunjuk: "Penyebut sama: jumlahkan pembilangnya saja.", bahas: `${pc(a + b, q)} = ${pcS(a + b, q)}.`,
      langkah: [...bPcOp([a, q], [b, q], true), bJwb(pcS(a + b, q))] }); },
    () => { const x = nama(), q = pilih([4, 5, 6, 8, 10]), a = acak(1, q - 2), b = acak(1, q - a - 1), [mnm, sat] = pilih([["susu", "liter"], ["air putih", "liter"], ["jus jeruk", "liter"]]);
      return isianPc(`${x} minum ${pc(a, q)} ${sat} ${mnm} pada pagi hari dan ${pc(b, q)} ${sat} pada sore hari. Banyak ${mnm} yang diminum ${x} seluruhnya adalah … ${sat}.`, a + b, q,
        { satuan: sat, petunjuk: "Penyebut sama: jumlahkan pembilangnya. Sederhanakan bila bisa.", bahas: `${pc(a, q)} + ${pc(b, q)} = ${pc(a + b, q)} = ${pcS(a + b, q)} ${sat}.`,
          langkah: [`Pagi + sore → dijumlahkan: ${pc(a, q)} + ${pc(b, q)}.`, ...bPcOp([a, q], [b, q], true), bJwb(`${pcS(a + b, q)} ${sat}`)] }); },
    () => { const x = nama(), q = pilih([3, 4, 5, 6, 8, 10, 12]), a = acak(2, q - 1), b = acak(1, a - 1), [bnd, sat] = pilih([["pita", "meter"], ["tali", "meter"], ["kain", "meter"], ["tepung", "kg"]]);
      return isianPc(`${x} mempunyai ${pc(a, q)} ${sat} ${bnd}. Sebanyak ${pc(b, q)} ${sat} dipakai untuk prakarya. Sisa ${bnd} ${x} adalah … ${sat}.`, a - b, q,
        { satuan: sat, petunjuk: "Penyebut sama: kurangkan pembilangnya. Sederhanakan bila bisa.", bahas: `${pc(a, q)} − ${pc(b, q)} = ${pc(a - b, q)} = ${pcS(a - b, q)} ${sat}.`,
          langkah: [`Dipakai → dikurangi: ${pc(a, q)} − ${pc(b, q)}.`, ...bPcOp([a, q], [b, q], false), bJwb(`${pcS(a - b, q)} ${sat}`)] }); },
    () => { const q = acak(2, 8), n = q * acak(2, 10), [bnd, sat] = pilih([["kelereng", "butir"], ["siswa", "siswa"], ["permen", "buah"], ["telur", "butir"]]);
      return isian(`${pc(1, q)} dari ${n} ${bnd} adalah … ${sat}.`, n / q, { satuan: sat, petunjuk: `${pc(1, q)} dari ${n} = ${n} : ${q}.`, bahas: `${n} : ${q} = ${n / q} ${sat}.`,
        langkah: [`${pc(1, q)} dari ${n} artinya ${n} dibagi menjadi ${q} bagian sama besar.`, `${n} : ${q} = ${n / q}.`, bJwb(`${n / q} ${sat}`)] }); },
    () => { const q = acak(3, 9), a = acak(2, q - 1), b = acak(q - a + 1, q - 1);
      return isianPc(`${pc(a, q)} + ${pc(b, q)} = … (tulis sebagai pecahan campuran)`, a + b, q, { petunjuk: "Jumlahkan pembilangnya. Jika pembilang lebih dari penyebut, ubah ke pecahan campuran. Ketik misalnya 1 2/5.", campuran: true, bahas: `${pc(a, q)} + ${pc(b, q)} = ${pc(a + b, q)} = ${pcS(a + b, q)}.`,
      langkah: [...bPcOp([a, q], [b, q], true), bJwb(pcS(a + b, q))] }); },
  ],
  5: [
    () => { const a = pcAcak(8), b = pcAcak(8), plus = ya() || a[0] / a[1] < b[0] / b[1] + 1e-9 ? true : false; const h = plus ? pTambah(a, b) : pKurang(a, b);
      return isianPc(`${pc(...a)} ${plus ? "+" : "−"} ${pc(...b)} = …`, ...h, { petunjuk: "Samakan penyebut dengan KPK.", bahas: `Samakan penyebutnya dulu, lalu ${plus ? "jumlahkan" : "kurangkan"}. Hasilnya ${pcT(...h)}.`,
        langkah: [...bPcOp(a, b, plus), bJwb(pcT(...h))] }); },
    () => { const x = nama(), [q1, q2] = pilih([[2, 4], [2, 6], [3, 6], [4, 8], [2, 8], [3, 9], [2, 3], [3, 4], [2, 5], [4, 6]]), a = sed(acak(1, q1 - 1), q1), b = sed(acak(1, q2 - 1), q2);
      const urut = a[0] / a[1] > b[0] / b[1] ? [a, b] : [b, a]; if (Math.abs(a[0] / a[1] - b[0] / b[1]) < 1e-9) return isianPc(`${pc(3, 4)} − ${pc(1, 2)} = …`, 1, 4, { bahas: `${pc(3, 4)} − ${pc(2, 4)} = ${pc(1, 4)}.`, langkah: [...bPcOp([3, 4], [1, 2], false), bJwb(pc(1, 4))] });
      const [A, B] = urut, h = pKurang(A, B), [bnd, guna] = pilih([["tepung", "membuat kue"], ["gula", "membuat teh manis"], ["mentega", "membuat roti"], ["beras", "membuat bubur"]]);
      return isianPc(`Ibu ${x} mempunyai ${pc(...A)} kg ${bnd}. Sebanyak ${pc(...B)} kg dipakai untuk ${guna}. Sisa ${bnd} adalah … kg.`, ...h,
        { satuan: "kg", petunjuk: "Samakan penyebutnya dulu, lalu kurangkan.", bahas: `KPK ${A[1]} dan ${B[1]} = ${kpk(A[1], B[1])}. ${pc(A[0] * kpk(A[1], B[1]) / A[1], kpk(A[1], B[1]))} − ${pc(B[0] * kpk(A[1], B[1]) / B[1], kpk(A[1], B[1]))} = ${pcT(...h)} kg.`,
          langkah: [`Sisa = ${pc(...A)} − ${pc(...B)}.`, ...bPcOp(A, B, false), bJwb(`${pcT(...h)} kg`)] }); },
    () => { const [p, q] = sed(...pcAcak(6)), n = q * acak(2, 12), [bnd, sat] = pilih([["siswa", "siswa"], ["kelereng", "butir"], ["buku", "buku"], ["jeruk", "buah"]]);
      return isian(`${pc(p, q)} dari ${n} ${bnd} adalah … ${sat}.`, n / q * p, { satuan: sat, petunjuk: `Bagi ${n} dengan ${q}, lalu kali ${p}.`, bahas: `${n} : ${q} = ${n / q}, lalu ${n / q} × ${p} = ${n / q * p} ${sat}.`,
        langkah: [`Bagi dulu dengan penyebut: ${n} : ${q} = ${n / q}.`, `Lalu kali dengan pembilang: ${n / q} × ${p} = ${n / q * p}.`, bJwb(`${n / q * p} ${sat}`)] }); },
    () => { const q = acak(3, 8), w = acak(1, 4), a = acak(1, q - 1), b = acak(1, q - 1), h = [w * q + a + b, q];
      return isianPc(`${w}&nbsp;${pc(a, q)} + ${pc(b, q)} = …`, ...h, { petunjuk: "Jumlahkan bagian pecahannya, lalu tambahkan bilangan bulatnya.", bahas: `${pc(a, q)} + ${pc(b, q)} = ${pcT(a + b, q)}. Ditambah ${w}: ${pcS(...h)}.`,
      langkah: [`Jumlahkan bagian pecahannya: ${pc(a, q)} + ${pc(b, q)} = ${pc(a + b, q)}${a + b >= q ? ` = ${pcT(a + b, q)}` : ""}.`, `Tambahkan bilangan bulat ${w}: ${w} + ${pcT(a + b, q)} = ${pcT(...h)}.`,
        ...(fpb(...h) > 1 && h[0] % h[1] ? [`Sederhanakan pecahannya: ${pcT(...h)} = ${pcS(...h)}.`] : []), bJwb(pcS(...h))] }); },
    () => { let a = sed(...pcAcak(6)), b = sed(...pcAcak(6)); if (a[0] / a[1] > b[0] / b[1]) [a, b] = [b, a]; if (Math.abs(a[0] / a[1] - b[0] / b[1]) < 1e-9) return isianPc(`${pc(1, 3)} + □ = ${pc(5, 6)}<br>Nilai □ adalah …`, 1, 2, { bahas: `${pc(5, 6)} − ${pc(2, 6)} = ${pc(3, 6)} = ${pc(1, 2)}.`,
        langkah: [`□ = ${pc(5, 6)} − ${pc(1, 3)}.`, ...bPcOp([5, 6], [1, 3], false), bJwb(pc(1, 2))] });
      const h = pKurang(b, a);
      return isianPc(`${pc(...a)} + □ = ${pc(...b)}<br>Nilai □ adalah …`, ...h, { petunjuk: `□ = ${pc(...b)} − ${pc(...a)}. Samakan penyebutnya.`, bahas: `${pc(...b)} − ${pc(...a)} = ${pcT(...h)}.`,
        langkah: [`□ = ${pc(...b)} − ${pc(...a)}.`, ...bPcOp(b, a, false), bJwb(pcT(...h))] }); },
  ],
  6: [
    () => { const w1 = acak(1, 4), w2 = acak(1, 3), a = pcAcak(6), b = pcAcak(6), A = [w1 * a[1] + a[0], a[1]], B = [w2 * b[1] + b[0], b[1]], plus = ya() || A[0] / A[1] <= B[0] / B[1];
      const h = plus ? pTambah(A, B) : pKurang(A, B);
      return isianPc(`${pcT(...A)} ${plus ? "+" : "−"} ${pcT(...B)} = …`, ...h, { petunjuk: "Ubah ke pecahan biasa, atau hitung bilangan bulat dan pecahannya terpisah.", bahas: `Ubah ke pecahan biasa, samakan penyebut, lalu ${plus ? "jumlahkan" : "kurangkan"}. Hasilnya ${pcT(...h)}.`,
        langkah: [`Ubah ke pecahan biasa: ${pcT(...A)} = ${pc(...A)} (${w1} × ${a[1]} + ${a[0]} = ${A[0]}) dan ${pcT(...B)} = ${pc(...B)} (${w2} × ${b[1]} + ${b[0]} = ${B[0]}).`, ...bPcOp(A, B, plus), bJwb(pcT(...h))] }); },
    () => { const a = pcAcak(9), b = pcAcak(9), h = pKali(a, b); return isianPc(`${pc(...a)} × ${pc(...b)} = …`, ...h, { petunjuk: "Pembilang × pembilang, penyebut × penyebut.", bahas: `${pc(a[0] * b[0], a[1] * b[1])} = ${pcT(...h)}.`,
      langkah: [`Pembilang × pembilang: ${a[0]} × ${b[0]} = ${a[0] * b[0]}.`, `Penyebut × penyebut: ${a[1]} × ${b[1]} = ${a[1] * b[1]}. Hasilnya ${pc(a[0] * b[0], a[1] * b[1])}.`, ...bSed(a[0] * b[0], a[1] * b[1]), bJwb(pcT(...h))] }); },
  ],
  7: [
    () => { const a = pcAcak(9), b = pcAcak(9), h = pBagi(a, b); return isianPc(`${pc(...a)} : ${pc(...b)} = …`, ...h, { petunjuk: "Bagi pecahan = kali dengan kebalikannya.", bahas: `${pc(...a)} × ${pc(b[1], b[0])} = ${pcT(...h)}.`,
      langkah: [`Membagi dengan pecahan = mengali dengan kebalikannya: ${pc(...a)} : ${pc(...b)} = ${pc(...a)} × ${pc(b[1], b[0])}.`,
        `Kalikan: ${pc(...a)} × ${pc(b[1], b[0])} = ${pc(a[0] * b[1], a[1] * b[0])}.`, ...bSed(a[0] * b[1], a[1] * b[0]), bJwb(pcT(...h))] }); },
    () => { const [p, q] = sed(...pcAcak(10)), n = q * acak(2, 15); return isian(`${pc(p, q)} dari ${n} adalah …`, n / q * p, { petunjuk: `Bagi ${n} dengan ${q}, lalu kali ${p}.`, bahas: `${n} : ${q} × ${p} = ${n / q * p}.`,
      langkah: [`Bagi dulu dengan penyebut: ${n} : ${q} = ${n / q}.`, `Lalu kali dengan pembilang: ${n / q} × ${p} = ${n / q * p}.`, bJwb(n / q * p)] }); },
  ],
  8: [
    () => { const x = nama(), q1 = pilih([2, 4]), w = acak(2, 4), A = [w * q1 + acak(1, q1 - 1), q1], b = [acak(1, 3), 4], c = [acak(1, 2), 3]; let s = pKurang(pKurang(A, b), c);
      if (s[0] <= 0) s = pKurang(A, b);
      const pakai2 = s[0] > 0 && pKurang(pKurang(A, b), c)[0] > 0;
      return isianPc(`${x} memiliki ${pcT(...A)} kg gula. Sebanyak ${pc(...b)} kg dipakai untuk membuat kue${pakai2 ? ` dan ${pc(...c)} kg untuk membuat minuman` : ""}. Sisa gula ${x} adalah … kg.`, ...s,
        { satuan: "kg", petunjuk: "Kurangkan satu per satu dengan menyamakan penyebut.", bahas: `Ubah ke pecahan biasa, samakan penyebut, lalu kurangkan. Sisa gula ${pcT(...s)} kg.`, langkah: bGula(A, b, c, pakai2, s) }); },
    () => { const x = nama(), a = [1, pilih([3, 4, 5])], b = [1, pilih([2, 3, 6])]; const sisa = pKurang([1, 1], a); const h = pKali(sisa, b);
      return isianPc(`${x} memotong pita. ${pc(...a)} bagian dipakai untuk kado. Lalu ${pc(...b)} dari <b>sisanya</b> dipakai untuk hiasan. Bagian pita yang dipakai untuk hiasan adalah … bagian dari seluruh pita.`, ...h,
        { petunjuk: "Hitung sisanya dulu, lalu kalikan.", bahas: `Sisa ${pc(...sisa)}. ${pc(...b)} × ${pc(...sisa)} = ${pcT(...h)}.`,
          langkah: [`Sisa setelah dipakai untuk kado: 1 − ${pc(...a)} = ${pc(a[1], a[1])} − ${pc(...a)} = ${pc(...sisa)}.`, `Untuk hiasan: ${pc(...b)} dari sisa = ${pc(...b)} × ${pc(...sisa)} = ${pc(b[0] * sisa[0], b[1] * sisa[1])}.`,
            ...bSed(b[0] * sisa[0], b[1] * sisa[1]), bJwb(pcT(...h))] }); },
  ],
  9: [
    () => { const set = new Map(); while (set.size < 4) { const [p, q] = sed(...pcAcak(12)); set.set(p / q, [p, q]); } const arr = [...set.values()], b = arr.slice().sort((x, y) => x[0] / x[1] - y[0] / y[1]);
      const tulis = a => a.map(x => pc(...x)).join(" ; "), salah = []; while (salah.length < 3) { const p = kocok(arr); if (tulis(p) !== tulis(b) && !salah.includes(tulis(p))) salah.push(tulis(p)); }
      const K = arr.reduce((s, x) => kpk(s, x[1]), 1);
      return pg(`Urutan pecahan dari yang <b>terkecil</b> adalah …`, tulis(b), salah, { petunjuk: "Ubah ke desimal atau samakan penyebutnya.", bahas: `Urutannya: ${tulis(b)}.`,
        langkah: K <= 60 ? [`Samakan penyebut. KPK semua penyebut = ${K}.`, `${arr.map(([p, q]) => `${pc(p, q)} = ${pc(p * K / q, K)}`).join(", ")}.`, `Urutkan pembilangnya dari kecil: ${b.map(([p, q]) => p * K / q).join(" < ")}.`, bJwb(tulis(b))]
          : [`Penyebutnya berbeda-beda, jadi ubah ke desimal (dibulatkan 3 angka di belakang koma).`, `${arr.map(([p, q]) => `${pc(p, q)} ≈ ${fmt(bulat(p / q, 3))}`).join(", ")}.`, `Urutkan dari kecil: ${b.map(([p, q]) => fmt(bulat(p / q, 3))).join(" < ")}.`, bJwb(tulis(b))] }); },
    () => { const a = pcAcak(6), b = pcAcak(6), c = pcAcak(6), h = pTambah(a, pKali(b, c)), bc = pKali(b, c); return isianPc(`${pc(...a)} + ${pc(...b)} × ${pc(...c)} = …`, ...h, { petunjuk: "Kali dulu, baru tambah.", bahas: `${pc(...b)} × ${pc(...c)} = ${pcT(...pKali(b, c))}. Ditambah ${pc(...a)} = ${pcT(...h)}.`,
      langkah: [`Kali dikerjakan lebih dulu: ${pc(...b)} × ${pc(...c)} = ${pc(b[0] * c[0], b[1] * c[1])}${bc[1] !== b[1] * c[1] ? ` = ${pc(...bc)}` : ""}.`, `Lalu tambah: ${pc(...a)} + ${pc(...bc)}.`, ...bPcOp(a, bc, true), bJwb(pcT(...h))] }); },
  ],
  10: [
    () => { const a = pilih([2, 3, 4, 5]), b = pilih([2, 3, 4, 5]), x = nama(), keperluan = pilih(["membeli buku", "membeli tas", "ditabung"]);
      const T = a * b * acak(2, 12) * 5000, s1 = T - T / a, s2 = s1 - s1 / b;
      return isian(`${x} memiliki sejumlah uang. ${pc(1, a)} bagian dipakai untuk membeli sepatu. ${pc(1, b)} dari <b>sisanya</b> dipakai untuk ${keperluan}. Sekarang uang ${x} tinggal ${rp(s2)}. Uang ${x} mula-mula adalah Rp …`, T,
        { petunjuk: "Sisa akhir = uang awal × (1 − 1/a) × (1 − 1/b).", bahas: `Sisa = ${pc(a - 1, a)} × ${pc(b - 1, b)} = ${pcS((a - 1) * (b - 1), a * b)} dari uang awal. Uang awal = ${rp(s2)} : ${pcS((a - 1) * (b - 1), a * b)} = ${rp(T)}.`,
          langkah: (() => { const [N, D] = sed((a - 1) * (b - 1), a * b); return [`Setelah membeli sepatu, sisa uang: 1 − ${pc(1, a)} = ${pc(a - 1, a)} bagian.`,
            `Dipakai ${pc(1, b)} dari sisanya, jadi tinggal ${pc(b - 1, b)} dari sisa itu: ${pc(b - 1, b)} × ${pc(a - 1, a)} = ${pc((a - 1) * (b - 1), a * b)}${N !== (a - 1) * (b - 1) ? ` = ${pc(N, D)}` : ""} dari uang awal.`,
            N === 1 ? `${pc(1, D)} bagian = ${rp(s2)}.` : `${pc(N, D)} bagian = ${rp(s2)}, jadi ${pc(1, D)} bagian = ${rp(s2)} : ${N} = ${rp(s2 / N)}.`,
            `Uang awal = ${pc(D, D)} bagian = ${D} × ${rp(s2 / N)} = ${rp(T)}.`, bJwb(rp(T))]; })() }); },
    () => { const q = pilih([3, 4, 5, 6]), p = acak(1, q - 1), k = acak(3, 12) * (q - p), n = k / (q - p) * q;
      return isian(`Di kelas, ${pc(p, q)} siswa memilih ekstrakurikuler pramuka dan sisanya memilih menari. Jika yang memilih menari ada ${k} siswa, banyak siswa di kelas itu adalah …`, n,
        { petunjuk: `Yang memilih menari = ${pc(q - p, q)} bagian.`, bahas: `${pc(q - p, q)} bagian = ${k} siswa, jadi 1 bagian (${pc(1, q)}) = ${k / (q - p)}. Semua = ${n} siswa.`,
          langkah: [`Yang memilih menari: 1 − ${pc(p, q)} = ${pc(q - p, q)} bagian.`, `${pc(q - p, q)} bagian = ${k} siswa, jadi ${pc(1, q)} bagian = ${k} : ${q - p} = ${k / (q - p)} siswa.`,
            `Semua siswa = ${pc(q, q)} bagian = ${q} × ${k / (q - p)} = ${n}.`, bJwb(n)] }); },
  ],
});

/* Sisa gula: A − b (− c) dengan penyebut sama */
function bGula(A, b, c, pakai2, s) {
  const fr = pakai2 ? [A, b, c] : [A, b], D = fr.reduce((k, f) => kpk(k, f[1]), 1), x = fr.map(f => f[0] * D / f[1]), N = x[0] - x.slice(1).reduce((p, q) => p + q, 0);
  return [`Ubah ke pecahan biasa: ${pcT(...A)} = ${pc(...A)}.`, `Samakan penyebut menjadi ${D}: ${fr.map((f, i) => `${pc(...f)} = ${pc(x[i], D)}`).join(", ")}.`,
    `Kurangkan: ${x.map(v => pc(v, D)).join(" − ")} = ${pc(N, D)}.`, ...bSed(N, D), bJwb(`${pcT(...s)} kg`)];
}

/* ================= Misi 6: Pecahan, desimal, persen ================= */
const desTulis = x => fmt(bulat(x, 4));
daftarMisi("bil", "b6", "Pecahan ↔ desimal ↔ persen", "💯", {
  1: [
    () => { const p = acak(1, 9); return isian(`${pc(p, 10)} jika ditulis dalam bentuk desimal adalah …`, p / 10, { petunjuk: "Persepuluhan = 1 angka di belakang koma.", bahas: `${pc(p, 10)} = ${desTulis(p / 10)}.`,
      langkah: [`${pc(p, 10)} artinya ${p} persepuluhan.`, `Persepuluhan ditulis dengan 1 angka di belakang koma: ${desTulis(p / 10)}.`, bJwb(desTulis(p / 10))] }); },
    () => { const p = acak(1, 9); return isianPc(`0,${p} jika ditulis dalam bentuk pecahan paling sederhana adalah …`, p, 10, { bahas: `0,${p} = ${pc(p, 10)} = ${pcS(p, 10)}.`,
      langkah: [`1 angka di belakang koma berarti persepuluhan: 0,${p} = ${pc(p, 10)}.`, ...bSed(p, 10), bJwb(pcS(p, 10))] }); },
    () => { const w = acak(1, 20), p = acak(1, 9); return isian(`${w}&nbsp;${pc(p, 10)} jika ditulis dalam bentuk desimal adalah …`, w + p / 10, { petunjuk: "Bilangan bulatnya di depan koma.", bahas: `${w}&nbsp;${pc(p, 10)} = ${desTulis(w + p / 10)}.`,
      langkah: [`Bilangan bulat ${w} ditulis di depan koma.`, `${pc(p, 10)} = 0,${p}, jadi angka ${p} ditulis di belakang koma.`, bJwb(desTulis(w + p / 10))] }); },
    () => { const a = acak(1, 8), b = acak(1, 9 - a), w = acak(0, 5); return isian(`${desTulis(w + a / 10)} + 0,${b} = …`, w + (a + b) / 10, { petunjuk: "Jumlahkan angka persepuluhannya.", bahas: `${desTulis(w + a / 10)} + 0,${b} = ${desTulis(w + (a + b) / 10)}.`,
      langkah: [`Tulis dengan koma sejajar. Jumlahkan angka persepuluhan: ${a} + ${b} = ${a + b}.`, `Angka di depan koma tetap ${w}.`, bJwb(desTulis(w + (a + b) / 10))] }); },
  ],
  2: [
    () => { const p = acak(1, 99); return isian(`${pc(p, 100)} = … (dalam desimal)`, p / 100, { petunjuk: "Perseratus = 2 angka di belakang koma.", bahas: `${pc(p, 100)} = ${desTulis(p / 100)}.`,
      langkah: [`${pc(p, 100)} artinya ${p} perseratus.`, `Perseratus ditulis dengan 2 angka di belakang koma: 0,${String(p).padStart(2, "0")}${p % 10 ? "" : ` = ${desTulis(p / 100)}`}.`, bJwb(desTulis(p / 100))] }); },
    () => { const p = acak(1, 99); return isian(`${pc(p, 100)} = … %`, p, { satuan: "%", petunjuk: "Persen artinya per seratus.", bahas: `${pc(p, 100)} = ${p}%.`,
      langkah: ["Persen (%) artinya per seratus.", `${pc(p, 100)} = ${p} per seratus = ${p}%.`, bJwb(`${p}%`)] }); },
    () => { let p; do p = acak(11, 99); while (p % 10 === 0); return isian(`${desTulis(p / 100)} = ${pc("□", 100)}<br>Nilai □ adalah …`, p, { petunjuk: "Dua angka di belakang koma = perseratus.", bahas: `${desTulis(p / 100)} = ${pc(p, 100)}, jadi □ = ${p}.`,
      langkah: [`${desTulis(p / 100)} punya 2 angka di belakang koma, jadi perseratus.`, `${desTulis(p / 100)} = ${pc(p, 100)}.`, bJwb(p)] }); },
    () => { const p = acak(5, 95), [ktg, sk] = pilih([["siswa", "suka sepak bola"], ["siswa", "datang dengan berjalan kaki"], ["warga", "menanam pohon di halaman"], ["pengunjung", "membeli tiket terusan"]]);
      return isian(`Dari 100 ${ktg}, sebanyak ${p} ${ktg} ${sk}. Persentase ${ktg} yang ${sk} adalah … %`, p, { satuan: "%", petunjuk: "Dari 100 → langsung jadi persen.", bahas: `${p} dari 100 = ${pc(p, 100)} = ${p}%.`,
      langkah: [`${p} dari 100 ${ktg} = ${pc(p, 100)}.`, `Per seratus = persen: ${pc(p, 100)} = ${p}%.`, bJwb(`${p}%`)] }); },
    () => { const p = acak(11, 99); return isian(`${desTulis(p / 100)} = … %`, p, { satuan: "%", petunjuk: "Desimal dua angka di belakang koma: geser koma dua tempat ke kanan.", bahas: `${desTulis(p / 100)} = ${pc(p, 100)} = ${p}%.`,
      langkah: [`Ubah ke perseratus: ${desTulis(p / 100)} = ${pc(p, 100)}.`, `Per seratus = persen: ${pc(p, 100)} = ${p}%.`, bJwb(`${p}%`)] }); },
    () => { const x = new Set(); while (x.size < 3) x.add(acak(11, 99)); const a = [...x], besar = ya(), j = besar ? Math.max(...a) : Math.min(...a);
      return isian(`Bilangan <b>${besar ? "terbesar" : "terkecil"}</b> di antara ${a.map(v => desTulis(v / 100)).join(" ; ")} adalah …`, j / 100,
        { petunjuk: "Bandingkan angka persepuluhan dulu, lalu perseratusan.", bahas: `Jawabannya ${desTulis(j / 100)}.`,
          langkah: ["Bandingkan angka persepuluhan dulu, lalu perseratusan.", `Urutkan dari yang terkecil: ${a.slice().sort((x, y) => x - y).map(v => desTulis(v / 100)).join(" < ")}.`,
            `Yang ${besar ? "terbesar" : "terkecil"}: ${desTulis(j / 100)}.`, bJwb(desTulis(j / 100))] }); },
  ],
  3: [
    () => { let p; do p = acak(2, 98); while (fpb(p, 100) === 1); return isianPc(`${p}% dalam bentuk pecahan paling sederhana adalah …`, p, 100, { petunjuk: `${p}% = ${pc(p, 100)}, lalu sederhanakan.`, bahas: `${p}% = ${pc(p, 100)} = ${pcS(p, 100)}.`,
      langkah: [`Persen artinya per seratus: ${p}% = ${pc(p, 100)}.`, ...bSed(p, 100), bJwb(pcS(p, 100))] }); },
    () => { let p; do p = acak(2, 98); while (fpb(p, 100) === 1); return isianPc(`${desTulis(p / 100)} dalam bentuk pecahan paling sederhana adalah …`, p, 100, { petunjuk: `${desTulis(p / 100)} = ${pc(p, 100)}, lalu sederhanakan.`, bahas: `${desTulis(p / 100)} = ${pc(p, 100)} = ${pcS(p, 100)}.`,
      langkah: [`${p % 10 ? `2 angka di belakang koma berarti perseratus` : `${desTulis(p / 100)} = 0,${p}`}: ${desTulis(p / 100)} = ${pc(p, 100)}.`, ...bSed(p, 100), bJwb(pcS(p, 100))] }); },
    () => { const p = acak(1, 9); return isian(`${pc(p, 10)} = … %`, p * 10, { satuan: "%", petunjuk: "Ubah penyebutnya menjadi 100: kalikan atas dan bawah dengan 10.", bahas: `${pc(p, 10)} = ${pc(p * 10, 100)} = ${p * 10}%.`,
      langkah: ["Ubah penyebutnya menjadi 100: kalikan pembilang dan penyebut dengan 10.", `${pc(p, 10)} = ${pc(p * 10, 100)}.`, `Per seratus = persen: ${pc(p * 10, 100)} = ${p * 10}%.`, bJwb(`${p * 10}%`)] }); },
    () => { const p = acak(1, 19) * 5, [ktg, a, b] = pilih([["siswa", "naik sepeda ke sekolah", "berjalan kaki"], ["peserta", "memilih lomba lari", "memilih lomba renang"], ["penonton", "duduk di tribun timur", "duduk di tribun barat"]]);
      return isian(`Sebanyak ${p}% ${ktg} ${a}, sisanya ${b}. Persentase ${ktg} yang ${b} adalah … %`, 100 - p, { satuan: "%", petunjuk: "Seluruhnya = 100%.", bahas: `100% − ${p}% = ${100 - p}%.`,
      langkah: [`Seluruh ${ktg} = 100%.`, `Sisanya: 100% − ${p}% = ${100 - p}%.`, bJwb(`${100 - p}%`)] }); },
    () => { const w = acak(1, 9), p = pilih([2, 4, 5, 6, 8]);
      return isianPc(`${w},${p} dalam bentuk pecahan campuran paling sederhana adalah …`, w * 10 + p, 10, { petunjuk: `${w},${p} = ${w}&nbsp;${pc(p, 10)}, lalu sederhanakan pecahannya. Ketik misalnya 2 1/2.`, campuran: true, bahas: `${w},${p} = ${w}&nbsp;${pc(p, 10)} = ${pcS(w * 10 + p, 10)}.`,
      langkah: [`Angka di depan koma (${w}) menjadi bilangan bulat; 1 angka di belakang koma berarti persepuluhan: ${w},${p} = ${w}&nbsp;${pc(p, 10)}.`,
        `Sederhanakan pecahannya (bagi dengan ${fpb(p, 10)}): ${pc(p, 10)} = ${pcS(p, 10)}.`, bJwb(pcS(w * 10 + p, 10))] }); },
    () => { const a = acak(11, 60), b = acak(11, 99 - a); return isian(`${desTulis(a / 100)} + ${desTulis(b / 100)} = …`, (a + b) / 100, { petunjuk: "Tulis bersusun dengan koma sejajar.", bahas: `${desTulis(a / 100)} + ${desTulis(b / 100)} = ${desTulis((a + b) / 100)}.`,
      langkah: [`Tulis bersusun dengan koma sejajar: ${desTulis(a / 100)} = ${a} perseratus dan ${desTulis(b / 100)} = ${b} perseratus.`, `Jumlahkan: ${a} + ${b} = ${a + b} perseratus = ${desTulis((a + b) / 100)}.`, bJwb(desTulis((a + b) / 100))] }); },
  ],
  4: [
    () => { const q = pilih([2, 4, 5, 20, 25, 50]), p = acak(1, q - 1); return isian(`${pc(p, q)} = … (dalam desimal)`, p / q, { petunjuk: `Ubah penyebutnya menjadi 10 atau 100.`, bahas: `${pc(p, q)} = ${pc(p * 100 / q, 100)} = ${desTulis(p / q)}.`,
      langkah: [`Ubah penyebutnya menjadi 100: kalikan pembilang dan penyebut dengan ${100 / q}.`, `${pc(p, q)} = ${pc(p * 100 / q, 100)}.`, `${pc(p * 100 / q, 100)} = ${desTulis(p / q)}.`, bJwb(desTulis(p / q))] }); },
    () => { const q = pilih([2, 4, 5, 10, 20, 25, 50]), p = acak(1, q - 1); return isian(`${pc(p, q)} = … %`, p * 100 / q, { satuan: "%", bahas: `${pc(p, q)} × 100% = ${fmt(p * 100 / q)}%.`,
      langkah: [`Ubah penyebutnya menjadi 100: kalikan pembilang dan penyebut dengan ${100 / q}.`, `${pc(p, q)} = ${pc(p * 100 / q, 100)}.`, `Per seratus = persen: ${fmt(p * 100 / q)}%.`, bJwb(`${fmt(p * 100 / q)}%`)] }); },
    () => { const q = pilih([4, 5, 10, 20, 25, 50]), p = acak(1, q - 1), [bnd, w] = pilih([["kelereng", "merah"], ["balon", "biru"], ["bunga", "kuning"], ["kancing", "putih"]]);
      return isian(`Dari ${q} ${bnd}, sebanyak ${p} ${bnd} berwarna ${w}. Persentase ${bnd} ${w} adalah … %`, p * 100 / q,
        { satuan: "%", petunjuk: `Tulis ${p}/${q}, lalu ubah penyebutnya menjadi 100.`, bahas: `${pc(p, q)} = ${pc(p * 100 / q, 100)} = ${fmt(p * 100 / q)}%.`,
          langkah: [`Bagian ${bnd} ${w}: ${p} dari ${q} = ${pc(p, q)}.`, `Ubah penyebutnya menjadi 100 (kali ${100 / q}): ${pc(p * 100 / q, 100)}.`, `Per seratus = persen: ${fmt(p * 100 / q)}%.`, bJwb(`${fmt(p * 100 / q)}%`)] }); },
    () => { const x = acak(101, 999) / 100, k = pilih([10, 100]); return isian(`${desTulis(x)} × ${k} = …`, bulat(x * k), { petunjuk: `Dikali ${k}: koma bergeser ${k === 10 ? "satu" : "dua"} tempat ke kanan.`, bahas: `${desTulis(x)} × ${k} = ${desTulis(bulat(x * k))}.`,
      langkah: [`Dikali ${k}: koma bergeser ${k === 10 ? "satu" : "dua"} tempat ke kanan.`, `${desTulis(x)} × ${k} = ${desTulis(bulat(x * k))}.`, bJwb(desTulis(bulat(x * k)))] }); },
    () => { const w = acak(1, 9), p = pilih([1, 2, 3]); return isian(`${w}&nbsp;${pc(p, 4)} = … (dalam desimal)`, w + p / 4, { petunjuk: `${pc(p, 4)} = ${pc(p * 25, 100)}.`, bahas: `${pc(p, 4)} = ${desTulis(p / 4)}, jadi ${w}&nbsp;${pc(p, 4)} = ${desTulis(w + p / 4)}.`,
      langkah: [`Ubah pecahannya: ${pc(p, 4)} = ${pc(p * 25, 100)} (kali 25) = ${desTulis(p / 4)}.`, `Tambahkan bilangan bulatnya: ${w} + ${desTulis(p / 4)} = ${desTulis(w + p / 4)}.`, bJwb(desTulis(w + p / 4))] }); },
    () => { const kecil = ya(), y = kecil ? acak(101, 999) / 10 : acak(101, 999);
      return isian(`${desTulis(y)} : ${kecil ? 10 : 100} = …`, bulat(y / (kecil ? 10 : 100)), { petunjuk: `Dibagi ${kecil ? 10 : 100}: koma bergeser ${kecil ? "satu" : "dua"} tempat ke kiri.`, bahas: `${desTulis(y)} : ${kecil ? 10 : 100} = ${desTulis(bulat(y / (kecil ? 10 : 100)))}.`,
        langkah: [`Dibagi ${kecil ? 10 : 100}: koma bergeser ${kecil ? "satu" : "dua"} tempat ke kiri.`, `${desTulis(y)} : ${kecil ? 10 : 100} = ${desTulis(bulat(y / (kecil ? 10 : 100)))}.`, bJwb(desTulis(bulat(y / (kecil ? 10 : 100))))] }); },
  ],
  5: [
    () => { const x = acak(1, 199) / 100; return isian(`${desTulis(x)} = … %`, bulat(x * 100), { satuan: "%", petunjuk: "Kalikan 100.", bahas: `${desTulis(x)} × 100% = ${fmt(bulat(x * 100))}%.`,
      langkah: ["Desimal ke persen: kalikan dengan 100% (koma bergeser dua tempat ke kanan).", `${desTulis(x)} × 100% = ${fmt(bulat(x * 100))}%.`, bJwb(`${fmt(bulat(x * 100))}%`)] }); },
    () => { const x = acak(1, 150); return isian(`${x}% = … (dalam desimal)`, x / 100, { petunjuk: "Bagi 100.", bahas: `${x}% = ${desTulis(x / 100)}.`,
      langkah: [`Persen ke desimal: bagi 100. ${x}% = ${pc(x, 100)}.`, `${x} : 100 = ${desTulis(x / 100)} (koma bergeser dua tempat ke kiri).`, bJwb(desTulis(x / 100))] }); },
    () => { const pr = pilih([10, 20, 25, 50]), n = (100 / pr) * acak(2, 15), ktg = pilih(["siswa", "peserta lomba", "anggota pramuka", "penonton"]), sk = pilih(["memakai topi", "membawa botol minum", "datang lebih awal", "memakai sepatu putih"]);
      return isian(`Ada ${n} ${ktg}. Sebanyak ${pr}% di antaranya ${sk}. Banyak ${ktg} yang ${sk} adalah …`, n * pr / 100,
        { petunjuk: `${pr}% = ${pcS(pr, 100)}, jadi bagi ${n} dengan ${100 / pr}.`, bahas: `${pr}% × ${n} = ${pcS(pr, 100)} × ${n} = ${n * pr / 100}.`,
          langkah: [`${pr}% = ${pc(pr, 100)} = ${pcS(pr, 100)}.`, `${pcS(pr, 100)} dari ${n} = ${n} : ${100 / pr} = ${n * pr / 100}.`, bJwb(n * pr / 100)] }); },
    () => { const x = nama(), a = acak(15, 50) / 10, b = acak(2, Math.round(a * 10) - 5) / 10, [bnd, sat] = pilih([["pita", "m"], ["kain", "m"], ["tali", "m"], ["kawat", "m"]]);
      return isian(`Panjang ${bnd} ${x} ${desTulis(a)} ${sat}. ${x} memotongnya ${desTulis(b)} ${sat}. Sisa panjang ${bnd} adalah … ${sat}.`, bulat(a - b, 2),
        { satuan: sat, petunjuk: "Kurangkan dengan koma sejajar.", bahas: `${desTulis(a)} − ${desTulis(b)} = ${desTulis(bulat(a - b, 2))} ${sat}.`,
          langkah: [`Sisa = ${desTulis(a)} − ${desTulis(b)}. Tulis dengan koma sejajar: ${Math.round(a * 10)} persepuluhan − ${Math.round(b * 10)} persepuluhan.`,
            `${Math.round(a * 10)} − ${Math.round(b * 10)} = ${Math.round(a * 10) - Math.round(b * 10)} persepuluhan = ${desTulis(bulat(a - b, 2))}.`, bJwb(`${desTulis(bulat(a - b, 2))} ${sat}`)] }); },
    () => { const w = acak(1, 3), q = pilih([2, 4, 5, 10, 20, 25]), p = acak(1, q - 1), v = bulat((w + p / q) * 100);
      return isian(`${w}&nbsp;${pc(p, q)} = … %`, v, { satuan: "%", petunjuk: "1 = 100%. Ubah bagian pecahannya ke persen, lalu tambahkan.", bahas: `${w} = ${w * 100}% dan ${pc(p, q)} = ${fmt(p * 100 / q)}%. Jumlahnya ${fmt(v)}%.`,
      langkah: [w === 1 ? "1 = 100%." : `1 = 100%, jadi ${w} = ${w * 100}%.`, `${pc(p, q)} = ${pc(p * 100 / q, 100)} (kali ${100 / q}) = ${fmt(p * 100 / q)}%.`, `Jumlahkan: ${w * 100}% + ${fmt(p * 100 / q)}% = ${fmt(v)}%.`, bJwb(`${fmt(v)}%`)] }); },
    () => { const q = pilih([8, 40]), p = q === 8 ? pilih([1, 3, 5, 7]) : acak(1, q - 1);
      return isian(`${pc(p, q)} = … (dalam desimal)`, p / q, { petunjuk: `Ubah penyebutnya menjadi 1.000: kalikan dengan ${1000 / q}.`, bahas: `${pc(p, q)} = ${pc(p * 1000 / q, 1000)} = ${desTulis(p / q)}.`,
      langkah: [`Ubah penyebutnya menjadi 1.000: kalikan pembilang dan penyebut dengan ${1000 / q}.`, `${pc(p, q)} = ${pc(p * 1000 / q, 1000)}.`,
        `Perseribu = 3 angka di belakang koma: 0,${String(p * 1000 / q).padStart(3, "0")}${(p * 1000 / q) % 10 ? "" : ` = ${desTulis(p / q)}`}.`, bJwb(desTulis(p / q))] }); },
  ],
  6: [
    () => { const q = pilih([4, 5, 20, 25]), p = acak(1, q - 1), v = p / q, geser = (x, d) => bulat(x + d > 0 ? x + d : x + Math.abs(d));   // pengecoh selalu positif (1/20 − 0,05 bukan 0)
      const opsi = [{ t: pc(p, q), v }, { t: desTulis(geser(v, pilih([-0.03, 0.02, -0.05]))), v: 0 }, { t: fmt(geser(Math.round(v * 100), pilih([-4, 3, 6]))) + "%", v: 0 }, { t: desTulis(geser(v, pilih([0.01, -0.02, 0.04]))), v: 0 }];
      opsi.forEach(o => { if (!o.v) o.v = o.t.includes("%") ? parseFloat(o.t) / 100 : parseFloat(o.t.replace(",", ".")); }); const b = ya(); const j = opsi.reduce((m, o) => ((b ? o.v > m.v : o.v < m.v) ? o : m));
      if (opsi.filter(o => o.v === j.v).length > 1) return isian(`${pc(3, 4)} = … %`, 75, { satuan: "%", bahas: `${pc(3, 4)} = ${pc(75, 100)} = 75%.`,
        langkah: [`Ubah penyebutnya menjadi 100 (kali 25): ${pc(3, 4)} = ${pc(75, 100)}.`, `Per seratus = persen: 75%.`, bJwb("75%")] });
      return pg(`Bilangan <b>${b ? "terbesar" : "terkecil"}</b> di antara ${opsi.map(o => o.t).join(" ; ")} adalah …`, j.t, opsi.filter(o => o !== j).map(o => o.t), { petunjuk: "Ubah semuanya ke desimal.", bahas: opsi.map(o => `${o.t} = ${desTulis(o.v)}`).join("; ") + ".",
        langkah: [`Ubah semuanya ke desimal: ${opsi.map(o => `${o.t} = ${desTulis(o.v)}`).join("; ")}.`, `Urutkan: ${opsi.slice().sort((x, y) => x.v - y.v).map(o => desTulis(o.v)).join(" < ")}.`,
          `Yang ${b ? "terbesar" : "terkecil"} adalah ${desTulis(j.v)}, yaitu ${j.t}.`, bJwb(j.t)] }); },
    () => { const q = pilih([4, 5, 10, 20]), p = acak(1, q - 1), persen = ya(0.6);
      return isian(`Bagian yang <b>diarsir</b> jika dinyatakan dalam ${persen ? "persen" : "bentuk desimal"} adalah …`, persen ? p * 100 / q : p / q,
        { satuan: persen ? "%" : undefined, gambar: svgPecahan(p, q, "batang"), petunjuk: "Tulis dulu sebagai pecahan, lalu ubah penyebutnya menjadi 100.", bahas: `${p} dari ${q} bagian diarsir = ${pc(p, q)} = ${pc(p * 100 / q, 100)} = ${desTulis(p / q)} = ${fmt(p * 100 / q)}%.`,
        langkah: [`Diarsir ${p} dari ${q} bagian = ${pc(p, q)}.`, `Ubah penyebutnya menjadi 100 (kali ${100 / q}): ${pc(p * 100 / q, 100)}.`,
          persen ? `Per seratus = persen: ${fmt(p * 100 / q)}%.` : `Perseratus = 2 angka di belakang koma: ${desTulis(p / q)}.`, bJwb(persen ? `${fmt(p * 100 / q)}%` : desTulis(p / q))] }); },
    () => { const x = nama(), t = pilih([20, 25, 50]), b = acak(Math.ceil(t / 3), t - 1);
      const [awal, akhir] = pilih([[`${x} mengerjakan ${t} soal latihan dan menjawab ${b} soal dengan benar.`, "soal yang dijawab benar"], [`Dalam latihan basket, ${x} melempar bola ${t} kali dan ${b} lemparan masuk ke ring.`, "lemparan yang masuk"],
        [`${x} menanam ${t} bibit cabai. Setelah seminggu, ${b} bibit tumbuh.`, "bibit yang tumbuh"]]);
      return isian(`${awal} Persentase ${akhir} adalah … %`, b * 100 / t, { satuan: "%", petunjuk: `Tulis sebagai pecahan ${b}/${t}, lalu ubah penyebutnya menjadi 100.`, bahas: `${pc(b, t)} = ${pc(b * 100 / t, 100)} = ${fmt(b * 100 / t)}%.`,
      langkah: [`Tulis sebagai pecahan: ${b} dari ${t} = ${pc(b, t)}.`, `Ubah penyebutnya menjadi 100 (kali ${100 / t}): ${pc(b * 100 / t, 100)}.`, `Per seratus = persen: ${fmt(b * 100 / t)}%.`, bJwb(`${fmt(b * 100 / t)}%`)] }); },
    () => { const q = pilih([2, 4, 5, 8, 20, 25]), p = acak(1, q - 1), v = p / q, desimal = ya();
      const benar = desimal ? desTulis(v) : fmt(v * 100) + "%";
      const salah = desimal ? [`${p},${q}`, desTulis(v * 10), desTulis(v / 10), desTulis(bulat(1 - v))] : [`${p}${q}%`, fmt(v * 10) + "%", `${p * q}%`, fmt(bulat(100 - v * 100)) + "%"];
      return pg(`Bilangan yang nilainya <b>sama dengan</b> ${pc(p, q)} adalah …`, benar, salah,
        { petunjuk: desimal ? "Ubah penyebutnya menjadi 10, 100, atau 1.000." : "Kalikan pecahannya dengan 100%.", bahas: `${pc(p, q)} = ${desTulis(v)} = ${fmt(v * 100)}%.`,
          langkah: (() => { const D = q === 8 ? 1000 : 100; return [`Ubah penyebutnya menjadi ${fmt(D)}: kalikan pembilang dan penyebut dengan ${D / q}.`, `${pc(p, q)} = ${pc(p * D / q, D)}.`,
            desimal ? `${pc(p * D / q, D)} = ${desTulis(v)}.` : `${pc(p * D / q, D)} × 100% = ${fmt(v * 100)}%.`, bJwb(benar)]; })() }); },
  ],
  7: [
    () => { const p = pilih([10, 20, 25, 50, 75, 5, 15, 40, 60, 12]), n = pilih([20, 40, 60, 80, 100, 120, 160, 200, 240, 300, 400, 360, 500, 800]); if ((p * n) % 100) return isian(`25% dari 80 = …`, 20, { bahas: "25% = 1/4, jadi 80 : 4 = 20.", langkah: [`25% = ${pc(25, 100)} = ${pc(1, 4)}.`, `${pc(1, 4)} dari 80 = 80 : 4 = 20.`, bJwb(20)] });
      return isian(`${p}% dari ${n} = …`, p * n / 100, { petunjuk: `${p}% = ${pcS(p, 100)}`, bahas: `${pc(p, 100)} × ${n} = ${p * n / 100}.`,
        langkah: [`${p}% = ${pc(p, 100)}.`, `${pc(p, 100)} × ${n} = ${p} × ${n} : 100 = ${fmt(p * n)} : 100 = ${fmt(p * n / 100)}.`, bJwb(fmt(p * n / 100))] }); },
    () => { const n = pilih([20, 25, 40, 50, 80, 200]), pr = pilih([5, 10, 15, 20, 25, 30, 40, 45, 60, 75, 80].filter(v => (v * n) % 100 === 0)), a = pr * n / 100;
      const [benda, warna] = pilih([["kelereng", "merah"], ["manik-manik", "biru"], ["balon", "kuning"], ["kancing", "hijau"]]);
      const teks = ya() ? `${a} dari ${n} sama dengan … %` : `Di dalam kotak ada ${n} ${benda}. Sebanyak ${a} ${benda} berwarna ${warna}. Persentase ${benda} ${warna} adalah … %`;
      return isian(teks, pr, { satuan: "%", petunjuk: `Tulis sebagai pecahan ${a}/${n}, lalu ubah ke perseratus.`, bahas: `${pc(a, n)} = ${pc(pr, 100)} = ${pr}%.`,
        langkah: [`Tulis sebagai pecahan: ${pc(a, n)}.`, `Kalikan dengan 100%: ${a} × 100 : ${n} = ${fmt(a * 100)} : ${n} = ${pr}.`, bJwb(`${pr}%`)] }); },
    () => { const x = nama(), a = acak(105, 350) / 100, b = acak(25, 95) / 100, tambah = ya(), [benda, sat] = pilih([["pita", "m"], ["gula", "kg"], ["minyak goreng", "liter"], ["tali rafia", "m"], ["tepung", "kg"]]);
      const h = bulat(tambah ? a + b : a - b, 2);
      const teks = tambah ? `${x} mempunyai ${desTulis(a)} ${sat} ${benda}, lalu membeli lagi ${desTulis(b)} ${sat}. Jumlah ${benda} ${x} sekarang adalah … ${sat}.`
        : `${x} mempunyai ${desTulis(a)} ${sat} ${benda}. Sebanyak ${desTulis(b)} ${sat} dipakai untuk membuat prakarya. Sisa ${benda} ${x} adalah … ${sat}.`;
      return isian(teks, h, { satuan: sat, petunjuk: "Tulis bersusun dengan koma sejajar.", bahas: `${desTulis(a)} ${tambah ? "+" : "−"} ${desTulis(b)} = ${desTulis(h)} ${sat}.`,
        langkah: [`${tambah ? "Membeli lagi → dijumlahkan" : "Dipakai → dikurangi"}: ${desTulis(a)} ${tambah ? "+" : "−"} ${desTulis(b)}.`,
          `Dengan koma sejajar: ${Math.round(a * 100)} perseratus ${tambah ? "+" : "−"} ${Math.round(b * 100)} perseratus = ${Math.round(h * 100)} perseratus = ${desTulis(h)}.`, bJwb(`${desTulis(h)} ${sat}`)] }); },
    () => { const a = pilih([0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 1.2, 1.5, 2.5]), b = acak(3, 16), h = bulat(a * b), cerita = ya();
      const [wadah, sat] = pilih([["botol", "liter"], ["bungkus", "kg"], ["kantong", "kg"]]);
      const teks = cerita ? `Setiap ${wadah} berisi ${desTulis(a)} ${sat}. Isi ${b} ${wadah} seluruhnya adalah … ${sat}.` : `${desTulis(a)} × ${b} = …`;
      const dd = String(a).split(".")[1].length, A = Math.round(a * 10 ** dd);
      return isian(teks, h, { satuan: cerita ? sat : undefined, petunjuk: `Kalikan tanpa koma dulu, lalu letakkan koma sesuai banyak angka desimalnya.`, bahas: `${desTulis(a)} × ${b} = ${desTulis(h)}${cerita ? " " + sat : ""}.`,
        langkah: [`${cerita ? `Isi seluruhnya = ${desTulis(a)} × ${b}. ` : ""}Kalikan tanpa koma dulu: ${A} × ${b} = ${A * b}.`,
          `${desTulis(a)} punya ${dd} angka di belakang koma, jadi letakkan koma ${dd} angka dari kanan: ${A * b} → ${desTulis(h)}.`, bJwb(`${desTulis(h)}${cerita ? " " + sat : ""}`)] }); },
  ],
  8: [
    () => { const n = pilih([20, 25, 30, 32, 36, 40]), pr = pilih([10, 20, 25, 30, 40, 50, 60, 75]), ok = (n * pr) % 100 === 0, k = ok ? n * pr / 100 : null; if (!ok) return isian(`Dari 40 siswa, 25% suka melukis. Banyak siswa yang tidak suka melukis adalah …`, 30, { bahas: "25% × 40 = 10, 40 − 10 = 30.",
        langkah: [`Yang suka melukis: 25% × 40 = ${pc(1, 4)} × 40 = 10 siswa.`, "Yang tidak suka: 40 − 10 = 30 siswa.", bJwb(30)] });
      const kegiatan = pilih(["membaca komik", "bermain futsal", "menari", "melukis", "menyanyi"]); return isian(`Di sebuah kelas ada ${n} siswa. Sebanyak ${pr}% siswa gemar ${kegiatan}. Banyak siswa yang <b>tidak</b> gemar ${kegiatan} adalah …`, n - k,
        { satuan: "siswa", petunjuk: "Hitung yang gemar dulu, atau langsung hitung (100% − persen).", bahas: `${pr}% × ${n} = ${k}. ${n} − ${k} = ${n - k} siswa.`,
          langkah: [`Yang gemar ${kegiatan}: ${pr}% × ${n} = ${pr} × ${n} : 100 = ${k} siswa.`, `Yang tidak gemar: ${n} − ${k} = ${n - k} siswa.`, bJwb(`${n - k} siswa`)] }); },
    () => { const h = acak(4, 30) * 10000, d = pilih([10, 15, 20, 25, 30, 40, 50]), b = pilih(["tas", "sepatu", "jaket", "boneka", "sepeda mini"]);
      return isian(`Harga sebuah ${b} ${rp(h)}. Toko memberi diskon ${d}%. Harga yang harus dibayar adalah Rp …`, h - h * d / 100, { petunjuk: "Hitung besar diskonnya, lalu kurangkan.", bahas: `Diskon ${d}% × ${rp(h)} = ${rp(h * d / 100)}. Bayar ${rp(h - h * d / 100)}.`,
      langkah: [`Besar diskon: ${d}% × ${fmt(h)} = ${d} × ${fmt(h)} : 100 = ${fmt(h * d / 100)}.`, `Harga yang dibayar: ${rp(h)} − ${rp(h * d / 100)} = ${rp(h - h * d / 100)}.`, bJwb(rp(h - h * d / 100))] }); },
  ],
  9: [
    () => { const vals = new Map(); const tambah = (t, v) => { if (![...vals.values()].includes(v)) vals.set(t, v); };
      while (vals.size < 4) { const k = acak(0, 2), q = pilih([4, 5, 8, 20, 25]), p = acak(1, q - 1), v = bulat(p / q); if (k === 0) tambah(pc(p, q), v); else if (k === 1) tambah(desTulis(v), v); else tambah(fmt(v * 100) + "%", v); }
      const arr = [...vals.entries()], b = arr.slice().sort((x, y) => x[1] - y[1]).map(x => x[0]).join(" ; ");
      const salah = []; while (salah.length < 3) { const p = kocok(arr).map(x => x[0]).join(" ; "); if (p !== b && !salah.includes(p)) salah.push(p); }
      return pg(`Urutan dari yang <b>terkecil</b> adalah …`, b, salah, { petunjuk: "Ubah semua ke desimal.", bahas: arr.map(([t, v]) => `${t} = ${desTulis(v)}`).join("; ") + ".",
        langkah: [`Ubah semua ke desimal: ${arr.map(([t, v]) => `${t} = ${desTulis(v)}`).join("; ")}.`, `Urutkan desimalnya dari yang terkecil: ${arr.map(x => x[1]).sort((x, y) => x - y).map(desTulis).join(" < ")}.`, bJwb(b)] }); },
    () => { const q = pilih([4, 5, 20, 25]), p = acak(1, q - 1), v = p / q;
      const butir = [
        { t: `${pc(p, q)} = ${desTulis(v)}`, b: true, a: `${pc(p, q)} = ${pc(p * 100 / q, 100)} = ${desTulis(v)}` }, { t: `${pc(p, q)} = ${fmt(v * 100)}%`, b: true, a: `${pc(p, q)} = ${pc(p * 100 / q, 100)} = ${fmt(v * 100)}%` },
        { t: `${desTulis(v)} = ${fmt(v * 10)}%`, b: v * 10 === v * 100, a: `${desTulis(v)} × 100% = ${fmt(v * 100)}%, bukan ${fmt(v * 10)}%` },
        { t: `${fmt(v * 100)}% lebih dari ${pc(1, 2)}`, b: v > 0.5, a: `${pc(1, 2)} = 50%, dan ${fmt(v * 100)}% ${v > 0.5 ? "lebih dari" : v < 0.5 ? "kurang dari" : "sama dengan, bukan lebih dari,"} 50%` }];
      return bAlasan(bs(`Tentukan Benar atau Salah.`, butir, { bahas: `${pc(p, q)} = ${desTulis(v)} = ${fmt(v * 100)}%.` }), butir,
        [`Ubah penyebutnya menjadi 100 (kali ${100 / q}): ${pc(p, q)} = ${pc(p * 100 / q, 100)} = ${desTulis(v)} = ${fmt(v * 100)}%.`]); },
    () => { const x = nama(), pr = pilih([10, 20, 25, 40, 50, 60, 75]), dasar = 100 / fpb(pr, 100), T = dasar * acak(Math.ceil(40 / dasar), Math.floor(400 / dasar)), a = T * pr / 100;
      const [teks, sat] = pilih([[`${x} sudah membaca ${pr}% halaman sebuah buku, yaitu ${a} halaman. Tebal buku itu adalah … halaman.`, "halaman"],
        [`Sebanyak ${pr}% siswa kelas 6 ikut lomba gerak jalan, yaitu ${a} siswa. Banyak siswa kelas 6 seluruhnya adalah … siswa.`, "siswa"],
        [`${x} sudah menabung ${rp(a * 10000)}. Jumlah itu baru ${pr}% dari harga sepeda yang ingin dibelinya. Harga sepeda itu adalah Rp …`, null]]);
      const tl = v => (sat ? `${fmt(v)} ${sat}` : rp(v * 10000));
      return isian(teks, sat ? T : T * 10000, { satuan: sat || undefined, petunjuk: `${pr}% = ${pcS(pr, 100)} bagian. Seluruhnya = 100%.`,
        bahas: `${pr}% (= ${pcS(pr, 100)} bagian) sama dengan ${tl(a)}. Seluruhnya (100%) = ${tl(a)} × 100 : ${pr} = ${tl(T)}.`,
        langkah: (() => { const [N, D] = sed(pr, 100); return [`${pr}% = ${pc(pr, 100)} = ${pc(N, D)} bagian, dan itu sama dengan ${tl(a)}.`,
          N === 1 ? `Jadi ${pc(1, D)} bagian = ${tl(a)}.` : `${pc(1, D)} bagian = ${tl(a)} : ${N} = ${tl(a / N)}.`, `Seluruhnya = ${pc(D, D)} bagian = ${D} × ${tl(a / N)} = ${tl(T)}.`, bJwb(tl(T))]; })() }); },
    () => { const b = pilih(["sepatu", "tas sekolah", "jaket", "sepeda", "raket"]); let hA, hB, dA, dB, A, B;
      do { hA = acak(10, 40) * 10000; hB = hA + pilih([-1, 1]) * acak(1, 4) * 10000; dA = pilih([10, 20, 25, 30]); dB = pilih([10, 20, 25, 30, 40, 50].filter(v => v !== dA)); A = hA * (100 - dA) / 100; B = hB * (100 - dB) / 100; } while (A === B);
      const murah = A < B ? "A" : "B", lain = murah === "A" ? "B" : "A", sel = Math.abs(A - B), tulis = (t, r) => `Toko ${t}, lebih murah ${rp(r)}`;
      return pg(`Harga sebuah ${b} di Toko A ${rp(hA)} dengan diskon ${dA}%. Di Toko B harganya ${rp(hB)} dengan diskon ${dB}%. Toko yang harganya lebih murah setelah diskon dan selisih harganya adalah …`,
        tulis(murah, sel), [tulis(lain, sel), tulis(murah, Math.abs(hA - hB)), tulis(lain, Math.abs(hA * dA - hB * dB) / 100), tulis(murah, sel + 5000), tulis(lain, sel + 5000)],
        { petunjuk: "Hitung harga setelah diskon di setiap toko, lalu bandingkan.", bahas: `Toko A: ${rp(hA)} − ${dA}% = ${rp(A)}. Toko B: ${rp(hB)} − ${dB}% = ${rp(B)}. Toko ${murah} lebih murah ${rp(sel)}.`,
          langkah: [`Toko A: diskon ${dA}% × ${fmt(hA)} = ${fmt(hA * dA / 100)}, harga ${rp(hA)} − ${rp(hA * dA / 100)} = ${rp(A)}.`, `Toko B: diskon ${dB}% × ${fmt(hB)} = ${fmt(hB * dB / 100)}, harga ${rp(hB)} − ${rp(hB * dB / 100)} = ${rp(B)}.`,
            `Toko ${murah} lebih murah. Selisihnya ${rp(Math.max(A, B))} − ${rp(Math.min(A, B))} = ${rp(sel)}.`, bJwb(tulis(murah, sel))] }); },
    () => { const n = pilih([40, 80]), [k1, k2, k3] = ambil(["pramuka", "menari", "futsal", "paduan suara", "melukis"], 3), pr = pilih([10, 20, 25, 30, 40]), q = pilih([4, 5, 8]), p = pilih({ 4: [1], 5: [1, 2], 8: [1, 3] }[q]);
      const a = n * pr / 100, b = n * p / q, s = n - a - b;
      return isian(`Di sebuah sekolah ada ${n} siswa kelas 6. Sebanyak ${pr}% siswa ikut ${k1}, ${pc(p, q)} bagian ikut ${k2}, dan sisanya ikut ${k3}. Banyak siswa yang ikut ${k3} adalah …`, s,
        { satuan: "siswa", petunjuk: "Hitung banyak siswa setiap kegiatan, lalu kurangkan dari jumlah seluruhnya.", bahas: `${k1}: ${pr}% × ${n} = ${a}. ${k2}: ${pc(p, q)} × ${n} = ${b}. ${k3}: ${n} − ${a} − ${b} = ${s} siswa.`,
          langkah: [`Ikut ${k1}: ${pr}% × ${n} = ${pr} × ${n} : 100 = ${a} siswa.`, `Ikut ${k2}: ${pc(p, q)} × ${n} = ${n} : ${q} × ${p} = ${b} siswa.`, `Ikut ${k3}: ${n} − ${a} − ${b} = ${s} siswa.`, bJwb(`${s} siswa`)] }); },
  ],
  10: [
    () => { const h = acak(10, 50) * 10000, d1 = pilih([10, 20, 25, 50]), d2 = pilih([10, 20]); const s1 = h - h * d1 / 100, s2 = s1 - s1 * d2 / 100;
      if (!Number.isInteger(s2)) return isian(`Harga Rp200.000 didiskon 20% lalu 10%. Harga akhirnya Rp …`, 144000, { bahas: "200.000 → 160.000 → 144.000.",
        langkah: ["Diskon pertama 20% × 200.000 = 40.000, harga menjadi 200.000 − 40.000 = 160.000.", "Diskon kedua dihitung dari 160.000: 10% × 160.000 = 16.000.", "Harga akhir: 160.000 − 16.000 = 144.000.", bJwb(rp(144000))] });
      return isian(`Harga sebuah sepeda ${rp(h)}. Toko memberi diskon ${d1}%, lalu diskon tambahan ${d2}% dari harga setelah diskon pertama. Harga akhir sepeda adalah Rp …`, s2,
        { petunjuk: "Diskon kedua dihitung dari harga setelah diskon pertama, bukan dijumlah!", bahas: `${rp(h)} − ${d1}% = ${rp(s1)}. ${rp(s1)} − ${d2}% = ${rp(s2)}.`,
          langkah: [`Diskon pertama: ${d1}% × ${fmt(h)} = ${fmt(h * d1 / 100)}. Harga menjadi ${rp(h)} − ${rp(h * d1 / 100)} = ${rp(s1)}.`, `Diskon kedua dihitung dari ${rp(s1)}: ${d2}% × ${fmt(s1)} = ${fmt(s1 * d2 / 100)}.`,
            `Harga akhir: ${rp(s1)} − ${rp(s1 * d2 / 100)} = ${rp(s2)}.`, bJwb(rp(s2))] }); },
    () => { const a = pilih([20, 25, 40, 50, 60, 80]), pr = pilih([10, 20, 25, 50]), naik = ya(), b = naik ? a + a * pr / 100 : a - a * pr / 100;
      return isian(`Nilai ulangan ${nama()} ${naik ? "naik" : "turun"} dari ${a} menjadi ${b}. Persentase ${naik ? "kenaikan" : "penurunan"} nilainya adalah … %`, pr,
        { satuan: "%", petunjuk: "Persentase = selisih : nilai awal × 100%.", bahas: `Selisih ${Math.abs(b - a)}. ${Math.abs(b - a)} : ${a} × 100% = ${pr}%.`,
          langkah: [`Selisih nilai: ${Math.max(a, b)} − ${Math.min(a, b)} = ${Math.abs(b - a)}.`, `Persentase ${naik ? "kenaikan" : "penurunan"} = selisih : nilai awal × 100% = ${pc(Math.abs(b - a), a)} × 100%.`,
            `${Math.abs(b - a)} × 100 : ${a} = ${fmt(Math.abs(b - a) * 100)} : ${a} = ${pr}.`, bJwb(`${pr}%`)] }); },
  ],
});

/* ================= Misi 7: Soal uang ================= */
const BARANG = [["buku tulis", 3000, 6000], ["pensil", 1500, 4000], ["penghapus", 1000, 3000], ["penggaris", 2500, 6000], ["roti", 3000, 8000], ["susu kotak", 4000, 7000],
  ["pulpen", 2000, 5000], ["spidol", 5000, 9000], ["kue", 2000, 5000], ["es krim", 4000, 10000], ["jus", 5000, 12000], ["stiker", 1000, 3500]];
const hargaAcak = b => Math.round(acak(b[1], b[2]) / 500) * 500;
daftarMisi("bil", "b7", "Soal uang", "💰", {
  1: [
    () => { const [a, b] = ambil(BARANG, 2), ha = hargaAcak(a), hb = hargaAcak(b), x = nama();
      return isian(`${x} membeli ${a[0]} seharga ${rp(ha)} dan ${b[0]} seharga ${rp(hb)}. Jumlah uang yang harus dibayar adalah Rp …`, ha + hb, { bahas: `${rp(ha)} + ${rp(hb)} = ${rp(ha + hb)}.`,
        langkah: ["Membeli dua barang → jumlahkan kedua harganya.", `${rp(ha)} + ${rp(hb)} = ${rp(ha + hb)}.`, bJwb(rp(ha + hb))] }); },
  ],
  2: [
    () => { const a = pilih(BARANG), h = hargaAcak(a), u = pilih([10000, 20000, 50000].filter(v => v > h)); return isian(`${nama()} membeli ${a[0]} seharga ${rp(h)} dan membayar dengan uang ${rp(u)}. Uang kembaliannya adalah Rp …`, u - h, { bahas: `${rp(u)} − ${rp(h)} = ${rp(u - h)}.`,
      langkah: ["Kembalian = uang yang dibayarkan − harga barang.", `${rp(u)} − ${rp(h)} = ${rp(u - h)}.`, bJwb(rp(u - h))] }); },
  ],
  3: [
    () => { const a = pilih(BARANG), h = hargaAcak(a), n = acak(3, 12); return isian(`Harga 1 ${a[0]} ${rp(h)}. Harga ${n} ${a[0]} adalah Rp …`, n * h, { bahas: `${n} × ${rp(h)} = ${rp(n * h)}.`,
      langkah: [`Harga ${n} barang = ${n} × harga 1 barang.`, `${n} × ${rp(h)} = ${rp(n * h)}.`, bJwb(rp(n * h))] }); },
  ],
  4: [
    () => { const [a, b] = ambil(BARANG, 2), ha = hargaAcak(a), hb = hargaAcak(b), na = acak(2, 5), nb = acak(2, 5), t = na * ha + nb * hb, u = [20000, 50000, 100000].find(v => v > t) || 200000;
      return isian(`${nama()} membeli ${na} ${a[0]} seharga ${rp(ha)} per buah dan ${nb} ${b[0]} seharga ${rp(hb)} per buah. Ia membayar dengan uang ${rp(u)}. Kembaliannya adalah Rp …`, u - t,
        { petunjuk: "Hitung total belanja dulu.", bahas: `${na} × ${rp(ha)} + ${nb} × ${rp(hb)} = ${rp(t)}. ${rp(u)} − ${rp(t)} = ${rp(u - t)}.`,
          langkah: [`Harga ${a[0]}: ${na} × ${rp(ha)} = ${rp(na * ha)}.`, `Harga ${b[0]}: ${nb} × ${rp(hb)} = ${rp(nb * hb)}.`, `Total belanja: ${rp(na * ha)} + ${rp(nb * hb)} = ${rp(t)}.`,
            `Kembalian: ${rp(u)} − ${rp(t)} = ${rp(u - t)}.`, bJwb(rp(u - t))] }); },
  ],
  5: [
    () => { const a = pilih(BARANG), h = hargaAcak(a), lusin = ya(); const n = lusin ? 12 : acak(3, 10);
      return isian(`Harga ${lusin ? "1 lusin" : n} ${a[0]} adalah ${rp(n * h)}. Harga 1 ${a[0]} adalah Rp …`, h, { petunjuk: lusin ? "1 lusin = 12 buah." : "Bagi harga total dengan banyak barang.", bahas: `${rp(n * h)} : ${n} = ${rp(h)}.`,
      langkah: [`${lusin ? "1 lusin = 12 buah. " : ""}Harga 1 barang = harga total : banyak barang.`, `${rp(n * h)} : ${n} = ${rp(h)}.`, bJwb(rp(h))] }); },
    () => { const a = pilih(BARANG), h = hargaAcak(a), n = acak(3, 8), m = acak(2, 9); return isian(`Harga ${n} ${a[0]} adalah ${rp(n * h)}. Harga ${m} ${a[0]} adalah Rp …`, m * h, { petunjuk: "Cari harga 1 barang dulu.", bahas: `1 ${a[0]} = ${rp(h)}. ${m} × ${rp(h)} = ${rp(m * h)}.`,
      langkah: [`Harga 1 ${a[0]}: ${rp(n * h)} : ${n} = ${rp(h)}.`, `Harga ${m} ${a[0]}: ${m} × ${rp(h)} = ${rp(m * h)}.`, bJwb(rp(m * h))] }); },
  ],
  6: [
    () => { const b = pilih(["telur", "permen", "jeruk", "pensil", "kue"]), k1 = pilih([4, 5, 6]), k2 = pilih([10, 12, 15]), h1 = acak(4, 15) * 500 * k1 / k1, s1 = Math.round(acak(800, 1500) / 50) * 50; const H1 = s1 * k1;
      let s2 = s1 + pilih([-100, -50, 50, 100]); const H2 = s2 * k2; const m = s1 < s2 ? "A" : "B";
      return pgTetap(`Paket A: ${k1} ${b} seharga ${rp(H1)}.<br>Paket B: ${k2} ${b} seharga ${rp(H2)}.<br>Paket yang harga per buahnya <b>lebih murah</b> adalah …`, ["Paket A", "Paket B", "Sama saja"], "Paket " + m,
        { petunjuk: "Hitung harga 1 buah untuk setiap paket.", bahas: `Paket A: ${rp(s1)} per buah. Paket B: ${rp(s2)} per buah. Lebih murah Paket ${m}.`,
          langkah: [`Paket A: ${rp(H1)} : ${k1} = ${rp(s1)} per buah.`, `Paket B: ${rp(H2)} : ${k2} = ${rp(s2)} per buah.`,
            `${rp(Math.min(s1, s2))} < ${rp(Math.max(s1, s2))}, jadi Paket ${m} lebih murah per buahnya.`, bJwb("Paket " + m)] }); },
    () => { const a = pilih(BARANG), h = hargaAcak(a), U = pilih([20000, 25000, 30000, 50000]), n = Math.floor(U / h), x = nama();
      return isian(`${x} mempunyai uang ${rp(U)}. Harga 1 ${a[0]} ${rp(h)}. Paling banyak ${x} dapat membeli … ${a[0]}.`, n,
        { petunjuk: "Bagi uangnya dengan harga satu barang. Sisa uang yang tidak cukup tidak dihitung.", bahas: `${rp(U)} : ${rp(h)} = ${n} sisa ${rp(U - n * h)}. Jadi paling banyak ${n} ${a[0]}.`,
          langkah: [`Bagi uang dengan harga 1 ${a[0]}: ${rp(U)} : ${rp(h)} = ${n} sisa ${rp(U - n * h)}.`, `Cek: ${n} × ${rp(h)} = ${rp(n * h)}${U - n * h ? `; sisa ${rp(U - n * h)} tidak cukup untuk 1 ${a[0]} lagi` : ", uangnya pas habis"}.`, bJwb(`${n} ${a[0]}`)] }); },
    () => { const x = nama(), B = pilih([1000, 2000, 2500, 3000, 5000]), n = acak(7, 30), awal = acak(0, 10) * 5000;
      return isian(`Tabungan ${x} mula-mula ${rp(awal)}. Setiap hari ${x} menabung ${rp(B)}. Setelah ${n} hari, jumlah tabungan ${x} menjadi Rp …`, awal + n * B,
        { petunjuk: "Hitung tabungan selama beberapa hari itu, lalu tambahkan tabungan mula-mula.", bahas: `${n} × ${rp(B)} = ${rp(n * B)}. ${rp(awal)} + ${rp(n * B)} = ${rp(awal + n * B)}.`,
          langkah: [`Tabungan selama ${n} hari: ${n} × ${rp(B)} = ${rp(n * B)}.`, `Ditambah tabungan mula-mula: ${rp(awal)} + ${rp(n * B)} = ${rp(awal + n * B)}.`, bJwb(rp(awal + n * B))] }); },
    () => { const [a, b] = ambil(BARANG, 2), ha = hargaAcak(a), hb = hargaAcak(b), t = ha + hb, U = pilih([20000, 30000, 50000].filter(v => v > t)), x = nama(), ok = U >= 2 * t;
      const bJml = ya(), bSisa = ya(), tS = bJml ? t : t + pilih([-1000, 1000, 500]), sS = bSisa ? U - t : U - t + pilih([-500, 1000]);
      const butir = [
        { t: `Harga 1 ${a[0]} dan 1 ${b[0]} adalah ${rp(tS)}.`, b: bJml, a: `${rp(ha)} + ${rp(hb)} = ${rp(t)}` },
        { t: `Uang ${x} cukup untuk membeli 2 ${a[0]} dan 2 ${b[0]}.`, b: ok, a: `2 × ${rp(t)} = ${rp(2 * t)}, ${ok ? "tidak lebih dari" : "lebih dari"} ${rp(U)}` },
        { t: `Jika membeli 1 ${a[0]} dan 1 ${b[0]}, sisa uang ${x} ${rp(sS)}.`, b: bSisa, a: `${rp(U)} − ${rp(t)} = ${rp(U - t)}` },
        { t: `Harga 1 ${a[0]} lebih mahal daripada harga 1 ${b[0]}.`, b: ha > hb, a: `${rp(ha)} ${ha > hb ? ">" : ha < hb ? "<" : "="} ${rp(hb)}` }];
      return bAlasan(bs(`${x} mempunyai uang ${rp(U)}. Harga 1 ${a[0]} ${rp(ha)} dan harga 1 ${b[0]} ${rp(hb)}. Tentukan <b>Benar</b> atau <b>Salah</b>.`, butir,
        { petunjuk: "Hitung jumlah harga dulu, lalu bandingkan dengan uangnya.", bahas: `1 ${a[0]} + 1 ${b[0]} = ${rp(t)}. 2 pasang = ${rp(2 * t)} → ${ok ? "cukup" : "tidak cukup"}. Sisa jika membeli sepasang: ${rp(U)} − ${rp(t)} = ${rp(U - t)}.` }), butir); },
  ],
  7: [
    () => { const h = acak(4, 40) * 5000, d = pilih([10, 20, 25, 50]), b = pilih(["kaos", "topi", "tas sekolah", "buku cerita", "mainan robot"]);
      return isian(`Harga sebuah ${b} ${rp(h)} dan mendapat diskon ${d}%. Besar diskonnya adalah Rp …`, h * d / 100, { petunjuk: `${d}% = ${pcS(d, 100)}`, bahas: `${d}% × ${rp(h)} = ${rp(h * d / 100)}.`,
      langkah: [`${d}% = ${pc(d, 100)} = ${pcS(d, 100)}.`, `Besar diskon = ${pcS(d, 100)} × ${rp(h)} = ${rp(h)} : ${100 / d} = ${rp(h * d / 100)}.`, bJwb(rp(h * d / 100))] }); },
  ],
  8: [
    () => { const h = acak(6, 30) * 5000, d = pilih([10, 20, 25]), u = [50000, 100000, 200000, 300000].find(v => v > h * (100 - d) / 100), b = pilih(["sepatu", "jaket", "tas"]);
      const bayar = h * (100 - d) / 100; return isian(`${nama()} membeli ${b} seharga ${rp(h)} dengan diskon ${d}%. Ia membayar dengan uang ${rp(u)}. Uang kembaliannya adalah Rp …`, u - bayar,
        { petunjuk: "Hitung harga setelah diskon, lalu kembaliannya.", bahas: `Harga setelah diskon ${rp(bayar)}. Kembalian ${rp(u)} − ${rp(bayar)} = ${rp(u - bayar)}.`,
          langkah: [`Besar diskon: ${d}% × ${fmt(h)} = ${d} × ${fmt(h)} : 100 = ${fmt(h * d / 100)}.`, `Harga setelah diskon: ${rp(h)} − ${rp(h * d / 100)} = ${rp(bayar)}.`,
            `Kembalian: ${rp(u)} − ${rp(bayar)} = ${rp(u - bayar)}.`, bJwb(rp(u - bayar))] }); },
    () => { const a = pilih(BARANG), h = hargaAcak(a), n = acak(5, 14), bayar = (n - Math.floor(n / 4)) * h;
      return isian(`Toko memberi promo <b>"beli 3 gratis 1"</b> untuk ${a[0]} seharga ${rp(h)} per buah. ${nama()} ingin mendapatkan ${n} ${a[0]}. Ia cukup membayar Rp …`, bayar,
        { petunjuk: "Setiap 4 barang, hanya 3 yang dibayar.", bahas: `${n} barang: ${Math.floor(n / 4)} gratis, dibayar ${n - Math.floor(n / 4)} × ${rp(h)} = ${rp(bayar)}.`,
          langkah: ["Beli 3 gratis 1: setiap 4 barang, hanya 3 yang dibayar.", `${n} : 4 = ${Math.floor(n / 4)} sisa ${n % 4}, jadi ada ${Math.floor(n / 4)} barang gratis.`,
            `Yang dibayar: ${n} − ${Math.floor(n / 4)} = ${n - Math.floor(n / 4)} barang.`, `${n - Math.floor(n / 4)} × ${rp(h)} = ${rp(bayar)}.`, bJwb(rp(bayar))] }); },
  ],
  9: [
    () => { const lus = acak(2, 6), hb = acak(20, 48) * 1000, hj = Math.round((hb / 12) / 500) * 500 + pilih([500, 1000, 1500]), r = acak(0, 3), b = pilih(["pensil", "jepit rambut", "gantungan kunci", "bolpoin"]);
      const jual = (lus * 12 - r) * hj, beli = lus * hb, u = jual - beli;
      if (u <= 0) return isian(`Pedagang membeli 2 lusin buku seharga Rp36.000 per lusin dan menjual Rp4.000 per buah. Untungnya Rp …`, 24000, { bahas: "96.000 − 72.000 = 24.000.",
        langkah: ["Modal: 2 × Rp36.000 = Rp72.000.", "2 lusin = 24 buah. Hasil jual: 24 × Rp4.000 = Rp96.000.", "Untung: Rp96.000 − Rp72.000 = Rp24.000.", bJwb(rp(24000))] });
      return isian(`Pedagang membeli ${lus} lusin ${b} seharga ${rp(hb)} per lusin. ${r ? `Sebanyak ${r} ${b} rusak dan tidak terjual. ` : ""}Sisanya dijual ${rp(hj)} per buah. Keuntungan pedagang adalah Rp …`, u,
        { petunjuk: "Untung = uang hasil jual − uang modal.", bahas: `Modal ${lus} × ${rp(hb)} = ${rp(beli)}. Jual ${lus * 12 - r} × ${rp(hj)} = ${rp(jual)}. Untung ${rp(u)}.`,
          langkah: [`Modal: ${lus} × ${rp(hb)} = ${rp(beli)}.`, `Banyak ${b}: ${lus} × 12 = ${lus * 12}${r ? `, yang terjual ${lus * 12} − ${r} = ${lus * 12 - r}` : ""}.`,
            `Hasil jual: ${lus * 12 - r} × ${rp(hj)} = ${rp(jual)}.`, `Untung = hasil jual − modal = ${rp(jual)} − ${rp(beli)} = ${rp(u)}.`, bJwb(rp(u))] }); },
  ],
  10: [
    () => { const x = nama(), A = acak(2, 20) * 5000, B = pilih([2000, 2500, 3000, 4000, 5000]), C = acak(30, 120) * 5000, b = pilih(["sepeda", "sepatu roda", "tas baru", "kamera mainan"]), n = Math.ceil((C - A) / B);
      if (C <= A) return isian(`Uang 50.000 ditambah 5.000 per hari. Setelah berapa hari menjadi 100.000?`, 10, { bahas: "50.000 : 5.000 = 10.",
        langkah: ["Kekurangan: 100.000 − 50.000 = 50.000.", "50.000 : 5.000 = 10 hari.", bJwb(10)] });
      return isian(`${x} sudah memiliki tabungan ${rp(A)}. Setiap hari ia menabung ${rp(B)}. ${x} ingin membeli ${b} seharga ${rp(C)}. Paling sedikit ${x} harus menabung selama … hari lagi.`, n,
        { satuan: "hari", petunjuk: "Hitung kekurangannya, lalu bagi. Jika bersisa, tambah 1 hari!", bahas: `Kekurangan ${rp(C - A)}. ${rp(C - A)} : ${rp(B)} = ${fmt(bulat((C - A) / B, 2))} → ${n} hari.`,
          langkah: [`Kekurangan: ${rp(C)} − ${rp(A)} = ${rp(C - A)}.`, `${rp(C - A)} : ${rp(B)} = ${Math.floor((C - A) / B)} sisa ${rp((C - A) % B)}.`,
            (C - A) % B ? `Masih kurang ${rp((C - A) % B)}, jadi perlu 1 hari lagi: ${Math.floor((C - A) / B)} + 1 = ${n}.` : `Tidak bersisa, jadi tepat ${n} hari.`, bJwb(`${n} hari`)] }); },
    () => { const t = acak(12, 49) * 10000 + acak(0, 9) * 1000, pot = pilih([10000, 15000, 20000]); const kel = Math.floor(t / 100000), bayar = t - kel * pot;
      return isian(`Sebuah toko memberi promo: <b>setiap belanja kelipatan Rp100.000 mendapat potongan ${rp(pot)}</b>. Ibu berbelanja seharga ${rp(t)}. Ibu cukup membayar Rp …`, bayar,
        { petunjuk: "Berapa kali Rp100.000 ada di dalam belanjaan Ibu?", bahas: `${rp(t)} memuat ${kel} kali Rp100.000 → potongan ${kel} × ${rp(pot)} = ${rp(kel * pot)}. Bayar ${rp(bayar)}.`,
          langkah: [`${rp(t)} memuat Rp100.000 sebanyak ${kel} kali (${kel} × Rp100.000 = ${rp(kel * 100000)}).`, `Potongan: ${kel} × ${rp(pot)} = ${rp(kel * pot)}.`,
            `Bayar: ${rp(t)} − ${rp(kel * pot)} = ${rp(bayar)}.`, bJwb(rp(bayar))] }); },
  ],
});
