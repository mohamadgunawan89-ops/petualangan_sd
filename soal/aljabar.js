/* Pos 2 — Aljabar: 3 misi × 10 level */
"use strict";

/* ---------- Pembahasan bertahap (langkah) — pembantu khusus Aljabar ----------
   Tidak memakai angka acak, jadi soal, kunci, dan pengecoh tidak berubah. */
const ajN = v => (typeof v === "number" ? fmt(v) : v);
const ajJadi = (kalimat, v, sat) => `Jadi, ${kalimat} <b>${ajN(v)}${sat ? " " + sat : ""}</b>.`;
const ajTanda = k => (k >= 0 ? "+" : "−") + fmt(Math.abs(k));
/* "5 → 8 (+3), 8 → 11 (+3)" */
const ajPanah = d => d.slice(1).map((x, i) => `${fmt(d[i])} → ${fmt(x)} (${ajTanda(x - d[i])})`).join(", ");
/* "14 + 3 = 17, 17 + 3 = 20" untuk suku d[dari..] */
const ajTerus = (d, dari, k) => d.slice(dari).map((x, j) => `${fmt(d[dari + j - 1])} ${k >= 0 ? "+" : "−"} ${fmt(Math.abs(k))} = ${fmt(x)}`).join(", ");
/* Pola dengan selisih tetap k: d lengkap, nT suku diketahui, jawaban = suku terakhir d */
function ajBerikut(d, nT, k, kalimat = "bilangan berikutnya adalah", sat) {
  return [`Lihat perubahan dari satu bilangan ke bilangan berikutnya: ${ajPanah(d.slice(0, nT))}.`,
    `Perubahannya selalu sama, yaitu <b>${ajTanda(k)}</b>.`,
    `Teruskan polanya: ${ajTerus(d, nT, k)}.`, ajJadi(kalimat, d[d.length - 1], sat)];
}
/* □ di tengah pola tambah (indeks i, 1..3, panjang 5) */
function ajKotakTambah(d, i, k) {
  const p = i >= 2 ? 0 : 2;
  return [`Cari dua bilangan berdekatan yang sudah diketahui: ${fmt(d[p])} → ${fmt(d[p + 1])}. Selisihnya <b>+${fmt(k)}</b>.`,
    `Bilangan sebelum □ adalah ${fmt(d[i - 1])}. Jadi □ = ${fmt(d[i - 1])} + ${fmt(k)} = ${fmt(d[i])}.`,
    `Cek: ${fmt(d[i])} + ${fmt(k)} = ${fmt(d[i + 1])}, cocok dengan bilangan sesudah □ ✔`, ajJadi("nilai □ adalah", d[i])];
}
/* Pengecekan "□ op … = hasil ✔" */
const ajCek = (ekspresi, hasil) => `Cek: ${ekspresi} = ${ajN(hasil)} ✔`;

/* ================= Misi 1: Pola bilangan ================= */
const deret = (a, f, n) => { const r = [a]; while (r.length < n) r.push(f(r[r.length - 1], r.length)); return r; };
const tulisDeret = arr => arr.map(fmt).join(", ") + ", …";
daftarMisi("alj", "a1", "Pola bilangan", "🔢", {
  1: [
    () => { const a = acak(1, 20), k = acak(2, 6), d = deret(a, x => x + k, 5); return isian(`Bilangan berikutnya dari pola <b>${tulisDeret(d.slice(0, 4))}</b> adalah …`, d[4], { petunjuk: "Berapa selisih dua bilangan yang berdekatan?", bahas: `Polanya +${k}. ${d[3]} + ${k} = ${d[4]}.`, langkah: ajBerikut(d, 4, k) }); },
    /* Suku yang hilang di tengah */
    () => { const a = acak(1, 20), k = acak(1, 5), d = deret(a, x => x + k, 5), i = acak(1, 3);
      return isian(`Perhatikan pola <b>${d.map((x, j) => (j === i ? "□" : fmt(x))).join(", ")}</b><br>Bilangan pengganti □ adalah …`, d[i], { petunjuk: "Lihat bilangan sebelum dan sesudah □.", bahas: `Polanya +${k}. ${d[i - 1]} + ${k} = ${d[i]}.`, langkah: ajKotakTambah(d, i, k) }); },
    /* Lompatan di garis bilangan */
    () => { const h = pilih(["Kelinci", "Katak", "Kanguru", "Belalang"]), k = acak(2, 5), a = pilih([0, k, acak(1, 10)]), d = deret(a, x => x + k, 5);
      return isian(`${h} melompat di garis bilangan. Ia mendarat di angka <b>${d.slice(0, 4).join(", ")}</b>. Jika lompatannya selalu sama jauh, lompatan berikutnya mendarat di angka …`, d[4], { petunjuk: "Berapa jauh setiap lompatan?", bahas: `Setiap lompatan ${k} angka. ${d[3]} + ${k} = ${d[4]}.`,
        langkah: [`Hitung jauh setiap lompatan: ${ajPanah(d.slice(0, 4))}.`, `Setiap lompatan selalu <b>${k} angka</b>.`, `Lompatan berikutnya: ${d[3]} + ${k} = ${d[4]}.`, ajJadi(`${h.toLowerCase()} mendarat di angka`, d[4])] }); },
    /* Aturan pola ditanya angkanya */
    () => { const a = acak(1, 30), k = acak(2, 6), d = deret(a, x => x + k, 5);
      return isian(`Pola <b>${tulisDeret(d)}</b> selalu bertambah …`, k, { petunjuk: "Kurangkan dua bilangan yang berdekatan.", bahas: `${d[1]} − ${d[0]} = ${k}, ${d[2]} − ${d[1]} = ${k}, dan seterusnya. Polanya bertambah ${k}.`,
        langkah: [`Kurangkan dua bilangan yang berdekatan: ${d[1]} − ${d[0]} = ${k}, ${d[2]} − ${d[1]} = ${k}.`, `Cek pasangan lain: ${d[3]} − ${d[2]} = ${k}, ${d[4]} − ${d[3]} = ${k}. Hasilnya selalu sama.`, ajJadi("polanya selalu bertambah", k)] }); },
    /* Anak tangga */
    () => { const x = nama(), k = pilih([2, 2, 3]), a = acak(1, k), d = deret(a, y => y + k, 5);
      return isian(`${x} menaiki tangga sambil melompati anak tangga. Ia menginjak anak tangga nomor <b>${d.slice(0, 4).join(", ")}</b>. Anak tangga berikutnya yang diinjak ${x} adalah nomor …`, d[4], { petunjuk: "Nomor anak tangganya bertambah berapa?", bahas: `Nomornya bertambah ${k}. ${d[3]} + ${k} = ${d[4]}.`,
        langkah: ajBerikut(d, 4, k, `anak tangga berikutnya adalah nomor`) }); },
    /* Pola turun */
    () => { const k = acak(1, 5), a = acak(4 * k + 5, 40), d = deret(a, x => x - k, 5);
      return isian(`Pola menurun: <b>${tulisDeret(d.slice(0, 4))}</b><br>Bilangan berikutnya adalah …`, d[4], { petunjuk: "Bilangannya berkurang berapa setiap langkah?", bahas: `Polanya −${k}. ${d[3]} − ${k} = ${d[4]}.`, langkah: ajBerikut(d, 4, -k) }); },
  ],
  2: [
    () => { const k = acak(3, 9), a = acak(60, 120), d = deret(a, x => x - k, 5); return isian(`Bilangan berikutnya dari pola <b>${tulisDeret(d.slice(0, 4))}</b> adalah …`, d[4], { bahas: `Polanya −${k}. ${d[3]} − ${k} = ${d[4]}.`, langkah: ajBerikut(d, 4, -k) }); },
    () => { const a = acak(2, 30), k = acak(3, 9), d = deret(a, x => x + k, 5), i = acak(1, 3); return isian(`Bilangan yang tepat untuk mengisi □ pada pola <b>${d.map((x, j) => (j === i ? "□" : fmt(x))).join(", ")}</b> adalah …`, d[i], { bahas: `Polanya +${k}, jadi □ = ${d[i]}.`, langkah: ajKotakTambah(d, i, k) }); },
    /* Bilangan ke-6 */
    () => { const a = acak(2, 20), k = acak(2, 6), d = deret(a, x => x + k, 6);
      return isian(`Pola <b>${tulisDeret(d.slice(0, 3))}</b> diteruskan. Bilangan ke-6 pada pola itu adalah …`, d[5], { petunjuk: "Teruskan polanya satu per satu sampai bilangan ke-6.", bahas: `${d.join(", ")}. Bilangan ke-6 = ${d[5]}.`,
        langkah: ajBerikut(d, 3, k, "bilangan ke-6 adalah") }); },
    /* Tabungan */
    () => { const x = nama(), a = acak(1, 5) * 1000, k = acak(1, 3) * 1000, d = deret(a, y => y + k, 5);
      return isian(`Tabungan ${x} hari ke-1 ${rp(d[0])}, hari ke-2 ${rp(d[1])}, dan hari ke-3 ${rp(d[2])}. Jika polanya sama, tabungan ${x} pada hari ke-5 adalah Rp …`, d[4], { petunjuk: "Tabungannya bertambah berapa setiap hari?", bahas: `Bertambah ${rp(k)} setiap hari: ${d.map(rp).join(", ")}.`,
        langkah: [`Lihat tabungannya: ${rp(d[0])} → ${rp(d[1])} → ${rp(d[2])}. Setiap hari bertambah <b>${rp(k)}</b>.`, `Hari ke-4: ${rp(d[2])} + ${rp(k)} = ${rp(d[3])}.`, `Hari ke-5: ${rp(d[3])} + ${rp(k)} = ${rp(d[4])}.`, ajJadi(`tabungan ${x} pada hari ke-5 adalah`, rp(d[4]))] }); },
    /* Bilangan ganjil / genap berurutan */
    () => { const g = ya(), j = g ? "genap" : "ganjil", a = acak(5, 40) * 2 + (g ? 0 : 1), d = deret(a, x => x + 2, 5);
      return isian(`Deretan bilangan ${j} berurutan: <b>${tulisDeret(d.slice(0, 4))}</b><br>Bilangan ${j} berikutnya adalah …`, d[4], { petunjuk: `Bilangan ${j} yang berurutan selalu berselisih 2.`, bahas: `${d[3]} + 2 = ${d[4]}.`,
        langkah: [`Bilangan ${j} yang berurutan selalu berselisih 2: ${ajPanah(d.slice(0, 4))}.`, `Bilangan berikutnya: ${d[3]} + 2 = ${d[4]}.`, ajJadi(`bilangan ${j} berikutnya adalah`, d[4])] }); },
    /* Kursi berbaris */
    () => { const t = pilih(["ruang kelas", "aula", "ruang pertemuan", "gedung bioskop"]), a = acak(5, 15), k = acak(1, 4), d = deret(a, x => x + k, 4);
      return isian(`Di sebuah ${t}, baris pertama ada ${a} kursi, baris kedua ${d[1]} kursi, dan baris ketiga ${d[2]} kursi. Jika polanya sama, banyak kursi pada baris keempat adalah …`, d[3], { satuan: "kursi", petunjuk: "Setiap baris bertambah berapa kursi?", bahas: `Bertambah ${k} kursi setiap baris. ${d[2]} + ${k} = ${d[3]} kursi.`,
        langkah: [`Lihat banyak kursi: ${ajPanah(d.slice(0, 3))}.`, `Setiap baris bertambah <b>${k} kursi</b>.`, `Baris keempat: ${d[2]} + ${k} = ${d[3]}.`, ajJadi("banyak kursi pada baris keempat adalah", d[3], "kursi")] }); },
  ],
  3: [
    () => { const r = pilih([2, 2, 3, 4]), a = acak(1, r === 4 ? 3 : 12), d = deret(a, x => x * r, 5); return isian(`Bilangan berikutnya dari pola <b>${tulisDeret(d.slice(0, 4))}</b> adalah …`, d[4], { petunjuk: "Coba bagi bilangan dengan bilangan sebelumnya.", bahas: `Polanya ×${r}. ${d[3]} × ${r} = ${d[4]}.`,
      langkah: [`Selisihnya makin besar, jadi coba bagi setiap bilangan dengan bilangan sebelumnya: ${d.slice(1, 4).map((x, i) => `${fmt(x)} : ${fmt(d[i])} = ${r}`).join(", ")}.`, `Aturannya selalu <b>×${r}</b>.`, `Bilangan berikutnya: ${fmt(d[3])} × ${r} = ${fmt(d[4])}.`, ajJadi("bilangan berikutnya adalah", d[4])] }); },
    () => { const r = pilih([2, 3]), a = r ** 4 * acak(1, 3), d = deret(a, x => x / r, 5); return isian(`Bilangan berikutnya dari pola <b>${tulisDeret(d.slice(0, 4))}</b> adalah …`, d[4], { bahas: `Polanya :${r}. ${d[3]} : ${r} = ${d[4]}.`,
      langkah: [`Bilangannya mengecil dengan cepat. Coba bagi: ${d.slice(1, 4).map((x, i) => `${fmt(d[i])} : ${r} = ${fmt(x)}`).join(", ")}.`, `Aturannya selalu <b>dibagi ${r}</b>.`, `Bilangan berikutnya: ${fmt(d[3])} : ${r} = ${fmt(d[4])}.`, ajJadi("bilangan berikutnya adalah", d[4])] }); },
    /* Selisih bertambah 1 */
    () => { const a = acak(1, 30), s = acak(1, 4), d = deret(a, (x, i) => x + s + i - 1, 6);
      return isian(`Selisih bilangan pada pola <b>${tulisDeret(d.slice(0, 5))}</b> selalu bertambah 1. Bilangan berikutnya adalah …`, d[5], { petunjuk: "Tulis selisihnya dulu: selisih berikutnya lebih 1.", bahas: `Selisihnya ${s}, ${s + 1}, ${s + 2}, ${s + 3}, lalu ${s + 4}. ${d[4]} + ${s + 4} = ${d[5]}.`,
        langkah: [`Tulis selisihnya: ${ajPanah(d.slice(0, 5))}.`, `Selisihnya ${s}, ${s + 1}, ${s + 2}, ${s + 3}: selalu bertambah 1. Selisih berikutnya <b>${s + 4}</b>.`, `Bilangan berikutnya: ${d[4]} + ${s + 4} = ${d[5]}.`, ajJadi("bilangan berikutnya adalah", d[5])] }); },
    /* Suku hilang pada pola perkalian */
    () => { const r = pilih([2, 3]), a = acak(1, r === 2 ? 15 : 8), d = deret(a, x => x * r, 5), i = acak(1, 3), p = i >= 2 ? 0 : 2;
      return isian(`Pola <b>${d.map((x, j) => (j === i ? "□" : fmt(x))).join(", ")}</b> dibuat dengan cara mengalikan. Nilai □ adalah …`, d[i], { petunjuk: "Bagi sebuah bilangan dengan bilangan di depannya.", bahas: `Polanya ×${r}. ${d[i - 1]} × ${r} = ${d[i]}.`,
        langkah: [`Cari aturannya dari dua bilangan berdekatan yang diketahui: ${fmt(d[p + 1])} : ${fmt(d[p])} = ${r}. Aturannya <b>×${r}</b>.`, `Bilangan sebelum □ adalah ${fmt(d[i - 1])}. □ = ${fmt(d[i - 1])} × ${r} = ${fmt(d[i])}.`, ajCek(`${fmt(d[i])} × ${r}`, d[i + 1]), ajJadi("nilai □ adalah", d[i])] }); },
    /* Langkah di anak tangga */
    () => { const x = nama(), k = acak(2, 4), a = acak(1, 3), n = acak(5, 7), d = deret(a, y => y + k, n);
      return isian(`Pada langkah ke-1, ${x} menginjak anak tangga nomor ${a}. Langkah ke-2 nomor ${d[1]}, langkah ke-3 nomor ${d[2]}, dan seterusnya. Pada langkah ke-${n}, ${x} menginjak anak tangga nomor …`, d[n - 1], { petunjuk: "Nomornya bertambah sama setiap langkah. Teruskan polanya.", bahas: `Bertambah ${k} setiap langkah: ${d.join(", ")}.`,
        langkah: [`Nomor anak tangga: ${a} → ${d[1]} → ${d[2]}. Setiap langkah bertambah <b>${k}</b>.`, `Teruskan sampai langkah ke-${n}: ${d.join(", ")}.`, `Cara cepat: ${a} + (${n} − 1) × ${k} = ${a} + ${(n - 1) * k} = ${d[n - 1]}.`, ajJadi(`pada langkah ke-${n}, ${x} menginjak anak tangga nomor`, d[n - 1])] }); },
    /* Kelipatan */
    () => { const k = acak(3, 9), m = acak(1, 12), d = deret(k * m, x => x + k, 5);
      return isian(`Deretan kelipatan ${k}: <b>${tulisDeret(d.slice(0, 4))}</b><br>Kelipatan ${k} berikutnya adalah …`, d[4], { petunjuk: `Kelipatan ${k} selalu bertambah ${k}.`, bahas: `${d[3]} + ${k} = ${d[4]}.`,
        langkah: [`Kelipatan ${k} selalu bertambah ${k}: ${ajPanah(d.slice(0, 4))}.`, `Kelipatan berikutnya: ${d[3]} + ${k} = ${d[4]}.`, `Cek: ${d[4]} = ${k} × ${m + 4} ✔`, ajJadi(`kelipatan ${k} berikutnya adalah`, d[4])] }); },
  ],
  4: [
    () => { const a = acak(80, 150), s = acak(1, 4), d = deret(a, (x, i) => x - s - i + 1, 6); return isian(`Bilangan berikutnya dari pola <b>${tulisDeret(d.slice(0, 5))}</b> adalah …`, d[5], { petunjuk: "Tulis selisihnya. Selisihnya bertambah besar.", bahas: `Selisihnya ${d.slice(1).map((x, i) => d[i] - x).join(", ")}. Bilangan berikutnya ${d[5]}.`,
      langkah: [`Tulis perubahannya: ${ajPanah(d.slice(0, 5))}.`, `Pengurangnya ${s}, ${s + 1}, ${s + 2}, ${s + 3}: selalu bertambah 1. Berikutnya dikurangi <b>${s + 4}</b>.`, `Bilangan berikutnya: ${d[4]} − ${s + 4} = ${d[5]}.`, ajJadi("bilangan berikutnya adalah", d[5])] }); },
    () => { const a = acak(1, 30), s = acak(1, 5), t = acak(1, 3), d = deret(a, (x, i) => x + s + (i - 1) * t, 6); return isian(`Bilangan berikutnya dari pola <b>${tulisDeret(d.slice(0, 5))}</b> adalah …`, d[5], { petunjuk: "Tulis selisihnya. Apakah selisihnya juga berpola?", bahas: `Selisihnya ${d.slice(1).map((x, i) => x - d[i]).join(", ")}. Bilangan berikutnya ${d[5]}.`,
      langkah: [`Tulis selisihnya: ${ajPanah(d.slice(0, 5))}.`, `Selisihnya ${s}, ${s + t}, ${s + 2 * t}, ${s + 3 * t}: selalu bertambah ${t}. Selisih berikutnya ${s + 3 * t} + ${t} = <b>${s + 4 * t}</b>.`, `Bilangan berikutnya: ${d[4]} + ${s + 4 * t} = ${d[5]}.`, ajJadi("bilangan berikutnya adalah", d[5])] }); },
    /* Suku hilang pada pola bertingkat */
    () => { const a = acak(1, 30), s = acak(1, 5), d = deret(a, (x, i) => x + s + i - 1, 5), i = acak(1, 3), q = i >= 2 ? 0 : 2;
      return isian(`Selisih bilangan pada pola <b>${d.map((x, j) => (j === i ? "□" : fmt(x))).join(", ")}</b> bertambah 1 setiap langkah. Nilai □ adalah …`, d[i], { petunjuk: "Cari dulu selisih dua bilangan yang berdekatan dan sudah diketahui.", bahas: `Polanya ${d.join(", ")} (selisihnya ${s}, ${s + 1}, ${s + 2}, ${s + 3}). Jadi □ = ${d[i]}.`,
        langkah: [`Selisih dua bilangan yang diketahui: ${d[q]} → ${d[q + 1]} (+${s + q}).`, `Selisihnya bertambah 1, jadi urutan selisihnya ${s}, ${s + 1}, ${s + 2}, ${s + 3}.`, `Bilangan sebelum □ adalah ${d[i - 1]}, selisihnya +${s + i - 1}. □ = ${d[i - 1]} + ${s + i - 1} = ${d[i]}.`, ajCek(`${d[i]} + ${s + i}`, d[i + 1]), ajJadi("nilai □ adalah", d[i])] }); },
    /* Celengan */
    () => { const x = nama(), A = acak(2, 20) * 1000, k = pilih([1000, 2000, 2500, 5000]), n = acak(4, 8);
      return isian(`Celengan ${x} berisi ${rp(A)}. Setiap minggu ${x} menambah ${rp(k)}. Isi celengan ${x} setelah ${n} minggu adalah Rp …`, A + n * k, { petunjuk: `Polanya ${rp(A + k)}, ${rp(A + 2 * k)}, … (bertambah ${rp(k)}).`, bahas: `${rp(A)} + ${n} × ${rp(k)} = ${rp(A)} + ${rp(n * k)} = ${rp(A + n * k)}.`,
        langkah: [`Mula-mula isinya ${rp(A)}, lalu setiap minggu bertambah ${rp(k)}: ${rp(A + k)}, ${rp(A + 2 * k)}, …`, `Selama ${n} minggu, tambahannya ${n} × ${rp(k)} = ${rp(n * k)}.`, `Isi celengan = ${rp(A)} + ${rp(n * k)} = ${rp(A + n * k)}.`, ajJadi(`isi celengan ${x} setelah ${n} minggu adalah`, rp(A + n * k))] }); },
    /* Kursi baris ke-n */
    () => { const t = pilih(["aula sekolah", "gedung pertunjukan", "lapangan upacara", "masjid"]), a = acak(8, 15), k = acak(2, 4), n = acak(6, 9), d = deret(a, x => x + k, n);
      return isian(`Di ${t}, baris ke-1 ada ${a} kursi, baris ke-2 ada ${d[1]} kursi, baris ke-3 ada ${d[2]} kursi, dan seterusnya. Banyak kursi pada baris ke-${n} adalah …`, d[n - 1], { satuan: "kursi", petunjuk: `Setiap baris bertambah ${k} kursi.`, bahas: `${d.join(", ")}. Baris ke-${n} ada ${d[n - 1]} kursi.`,
        langkah: [`Kursinya ${a} → ${d[1]} → ${d[2]}: setiap baris bertambah <b>${k} kursi</b>.`, `Dari baris ke-1 ke baris ke-${n} ada ${n} − 1 = ${n - 1} kali penambahan.`, `Banyak kursi = ${a} + ${n - 1} × ${k} = ${a} + ${(n - 1) * k} = ${d[n - 1]}. (Cek dengan meneruskan: ${d.join(", ")}.)`, ajJadi(`banyak kursi pada baris ke-${n} adalah`, d[n - 1], "kursi")] }); },
    /* Bilangan pengali */
    () => { const r = acak(2, 5), a = acak(1, r <= 3 ? 6 : 3), d = deret(a, x => x * r, 4);
      return isian(`Setiap bilangan pada pola <b>${tulisDeret(d)}</b> diperoleh dengan mengalikan bilangan sebelumnya dengan bilangan yang sama. Bilangan pengali itu adalah …`, r, { petunjuk: "Bagi sebuah bilangan dengan bilangan di depannya.", bahas: `${d[1]} : ${d[0]} = ${r}, ${d[2]} : ${d[1]} = ${r}. Pengalinya ${r}.`,
        langkah: [`Bagi sebuah bilangan dengan bilangan di depannya: ${d[1]} : ${d[0]} = ${r}.`, `Cek pasangan lain: ${d[2]} : ${d[1]} = ${r} dan ${d[3]} : ${d[2]} = ${r}. Hasilnya selalu sama.`, ajJadi("bilangan pengalinya adalah", r)] }); },
  ],
  5: [
    () => { const a = acak(1, 5), k = acak(2, 4), b = acak(10, 20), m = pilih([5, 10]); const d = []; for (let i = 0; i < 4; i++) d.push(a + k * i, b + m * i);
      return isian(`Bilangan berikutnya dari pola <b>${tulisDeret(d.slice(0, 7))}</b> adalah …`, d[7], { petunjuk: "Ada dua pola yang berselang-seling.", bahas: `Pola ganjil: +${k}; pola genap: +${m}. Berikutnya ${d[7]}.`,
        langkah: [`Bilangannya naik-turun, jadi ada dua pola yang berselang-seling. Pisahkan bilangan urutan ganjil dan urutan genap.`, `Urutan ke-1, 3, 5, 7: ${d[0]}, ${d[2]}, ${d[4]}, ${d[6]} → selalu +${k}.`, `Urutan ke-2, 4, 6: ${d[1]}, ${d[3]}, ${d[5]} → selalu +${m}.`, `Bilangan berikutnya adalah urutan ke-8 (genap): ${d[5]} + ${m} = ${d[7]}.`, ajJadi("bilangan berikutnya adalah", d[7])] }); },
    () => { const a = acak(2, 6), d = deret(a, (x, i) => (i % 2 ? x * 2 : x + 3), 6); return isian(`Bilangan berikutnya dari pola <b>${tulisDeret(d.slice(0, 5))}</b> adalah …`, d[5], { petunjuk: "Coba: ×2, +3, ×2, +3, …", bahas: `Polanya ×2, +3 bergantian. Berikutnya ${d[5]}.`,
      langkah: [`Lihat perubahannya: ${d[0]} → ${d[1]} (×2), ${d[1]} → ${d[2]} (+3), ${d[2]} → ${d[3]} (×2), ${d[3]} → ${d[4]} (+3).`, `Aturannya bergantian: <b>×2, lalu +3</b>.`, `Setelah +3, giliran ×2: ${d[4]} × 2 = ${d[5]}.`, ajJadi("bilangan berikutnya adalah", d[5])] }); },
    /* Dua suku hilang */
    () => { const a = acak(2, 30), k = acak(3, 12), d = deret(a, x => x + k, 5);
      return isian(`Pada pola <b>${fmt(d[0])}, □, ${fmt(d[2])}, □, ${fmt(d[4])}</b>, jumlah kedua bilangan □ adalah …`, d[1] + d[3], { petunjuk: "Dari bilangan pertama ke bilangan ketiga ada 2 langkah yang sama besar.", bahas: `Selisih = (${d[2]} − ${d[0]}) : 2 = ${k}. Kedua □ adalah ${d[1]} dan ${d[3]}; jumlahnya ${d[1] + d[3]}.`,
        langkah: [`Dari ${d[0]} ke ${d[2]} ada 2 langkah sama besar: ${d[2]} − ${d[0]} = ${2 * k}, jadi satu langkah = ${2 * k} : 2 = <b>${k}</b>.`, `□ pertama = ${d[0]} + ${k} = ${d[1]}. □ kedua = ${d[2]} + ${k} = ${d[3]}.`, ajCek(`${d[3]} + ${k}`, d[4]), `Jumlah kedua □ = ${d[1]} + ${d[3]} = ${d[1] + d[3]}.`, ajJadi("jumlah kedua bilangan □ adalah", d[1] + d[3])] }); },
    /* Lilin memendek */
    () => { const k = pilih([2, 3, 4, 5]), n = acak(3, 8), P = k * (n + acak(1, 5)) + acak(0, k - 1);
      return isian(`Sebuah lilin panjangnya ${P} cm. Setelah dinyalakan, lilin itu memendek ${k} cm setiap jam. Panjang lilin setelah ${n} jam adalah …`, P - n * k, { satuan: "cm", petunjuk: `Polanya ${P - k}, ${P - 2 * k}, … (berkurang ${k}).`, bahas: `${P} − ${n} × ${k} = ${P} − ${n * k} = ${P - n * k} cm.`,
        langkah: [`Setiap jam lilin berkurang ${k} cm: ${P}, ${P - k}, ${P - 2 * k}, …`, `Selama ${n} jam, lilin memendek ${n} × ${k} = ${n * k} cm.`, `Panjang lilin = ${P} − ${n * k} = ${P - n * k} cm.`, ajJadi(`panjang lilin setelah ${n} jam adalah`, P - n * k, "cm")] }); },
    /* Bilangan ganjil / genap ke-n */
    () => { const g = ya(), j = g ? "genap" : "ganjil", n = acak(10, 30), v = g ? 2 * n : 2 * n - 1;
      return isian(`Bilangan ${j} berurutan dimulai dari ${g ? 2 : 1}: <b>${tulisDeret(g ? [2, 4, 6, 8] : [1, 3, 5, 7])}</b><br>Bilangan ${j} ke-${n} adalah …`, v, { petunjuk: g ? "Bilangan genap ke-1 = 2 × 1, ke-2 = 2 × 2, …" : "Bilangan ganjil ke-n = 2 × n − 1. Cek: ke-3 = 2 × 3 − 1 = 5.", bahas: g ? `2 × ${n} = ${v}.` : `2 × ${n} − 1 = ${v}.`,
        langkah: g ? [`Perhatikan: genap ke-1 = 2 × 1 = 2, ke-2 = 2 × 2 = 4, ke-3 = 2 × 3 = 6.`, `Aturannya: bilangan genap ke-n = <b>2 × n</b>.`, `Genap ke-${n} = 2 × ${n} = ${v}.`, ajJadi(`bilangan genap ke-${n} adalah`, v)]
          : [`Bilangan ganjil selalu 1 kurangnya dari bilangan genap: 1 = 2 − 1, 3 = 4 − 1, 5 = 6 − 1.`, `Aturannya: bilangan ganjil ke-n = <b>2 × n − 1</b>.`, `Ganjil ke-${n} = 2 × ${n} − 1 = ${2 * n} − 1 = ${v}.`, ajJadi(`bilangan ganjil ke-${n} adalah`, v)] }); },
    /* Bilangan X adalah suku ke berapa */
    () => { const a = acak(1, 10), k = acak(2, 5), n = acak(8, 15), X = a + (n - 1) * k;
      return isian(`Pola <b>${tulisDeret(deret(a, x => x + k, 4))}</b> diteruskan. Bilangan ${X} adalah bilangan ke- …`, n, { petunjuk: `Hitung berapa kali ditambah ${k} untuk sampai ke ${X}, lalu tambah 1.`, bahas: `(${X} − ${a}) : ${k} = ${n - 1}. ${n - 1} + 1 = ${n}.`,
        langkah: [`Polanya dimulai dari ${a} dan selalu <b>+${k}</b>.`, `Jarak dari ${a} ke ${X}: ${X} − ${a} = ${X - a}.`, `Banyak lompatan +${k}: ${X - a} : ${k} = ${n - 1} lompatan.`, `Bilangan ke-1 ditambah ${n - 1} lompatan menjadi bilangan ke-(${n - 1} + 1) = ke-${n}.`, `Jadi, ${X} adalah bilangan ke-<b>${n}</b>.`] }); },
  ],
  6: [
    () => { const a = acak(2, 15), k = acak(2, 9), n = acak(10, 20); return isian(`Suku ke-${n} dari pola <b>${tulisDeret(deret(a, x => x + k, 4))}</b> adalah …`, a + (n - 1) * k, { petunjuk: `Suku ke-n = suku pertama + (n − 1) × selisih.`, bahas: `${a} + (${n} − 1) × ${k} = ${a + (n - 1) * k}.`,
      langkah: [`Suku pertama ${a}, dan setiap suku bertambah <b>${k}</b>: ${ajPanah(deret(a, x => x + k, 3))}.`, `Dari suku ke-1 ke suku ke-${n} ada ${n} − 1 = ${n - 1} kali penambahan.`, `Suku ke-${n} = ${a} + ${n - 1} × ${k} = ${a} + ${(n - 1) * k} = ${a + (n - 1) * k}.`, ajJadi(`suku ke-${n} adalah`, a + (n - 1) * k)] }); },
    /* Aturan pola dalam kata-kata */
    () => { const j = pilih(["tambah", "kurang", "kali"]);
      let a, k, d, benar, salah;
      if (j === "tambah") { a = acak(2, 20); k = acak(3, 9); d = deret(a, x => x + k, 5);
        benar = `Dimulai dari ${a}, lalu setiap suku ditambah ${k}`; salah = [`Dimulai dari ${a}, lalu setiap suku dikali ${k}`, `Dimulai dari ${a + k}, lalu setiap suku ditambah ${k}`, `Dimulai dari ${a}, lalu setiap suku ditambah ${k + 1}`, `Dimulai dari ${a}, lalu setiap suku ditambah ${k - 1}`]; }
      else if (j === "kurang") { a = acak(70, 120); k = acak(3, 9); d = deret(a, x => x - k, 5);
        benar = `Dimulai dari ${a}, lalu setiap suku dikurangi ${k}`; salah = [`Dimulai dari ${a}, lalu setiap suku ditambah ${k}`, `Dimulai dari ${a - k}, lalu setiap suku dikurangi ${k}`, `Dimulai dari ${a}, lalu setiap suku dikurangi ${k + 1}`, `Dimulai dari ${a}, lalu setiap suku dibagi ${k}`]; }
      else { a = acak(2, 5); k = pilih([2, 3]); d = deret(a, x => x * k, 5);
        benar = `Dimulai dari ${a}, lalu setiap suku dikali ${k}`; salah = [`Dimulai dari ${a}, lalu setiap suku ditambah ${a * k - a}`, `Dimulai dari ${a}, lalu setiap suku ditambah ${k}`, `Dimulai dari ${a * k}, lalu setiap suku dikali ${k}`, `Dimulai dari ${a}, lalu setiap suku dikali ${k + 1}`]; }
      const langkah = j === "kali"
        ? [`Suku pertama adalah ${a}.`, `Cek setiap perubahan: ${d.slice(1).map((x, i) => `${d[i]} × ${k} = ${x}`).join(", ")}. Semuanya dikali ${k}.`, `Hati-hati: ${d[0]} → ${d[1]} juga bisa dibaca "+${a * k - a}", tetapi ${d[1]} + ${a * k - a} = ${d[1] + a * k - a}, bukan ${d[2]}. Jadi aturan tambah tidak cocok.`, ajJadi("aturannya:", benar)]
        : [`Suku pertama adalah ${a}.`, `Cek setiap perubahan: ${ajPanah(d)}. Semuanya ${j === "tambah" ? "ditambah" : "dikurangi"} ${k}.`, ajJadi("aturannya:", benar)];
      return pg(`Aturan yang tepat untuk pola <b>${tulisDeret(d)}</b> adalah …`, benar, kocok(salah), { petunjuk: "Cek aturannya pada <b>semua</b> suku, bukan hanya dua suku pertama.", bahas: `${d.slice(0, 4).map((x, i) => `${x} → ${d[i + 1]}`).join(", ")}. ${benar}.`, langkah }); },
    /* Menemukan bilangan yang salah */
    () => { const a = acak(3, 30), k = acak(3, 9), d = deret(a, x => x + k, 6), i = acak(1, 4), g = pilih([-2, -1, 1, 2]), t = d.slice(); t[i] += g;
      return pg(`Ada <b>satu</b> bilangan yang salah tulis pada pola <b>${t.map(fmt).join(", ")}</b>. Bilangan yang salah adalah …`, t[i], ambil(t.filter((_, j) => j !== i && j > 0 && j < 5), 3), { petunjuk: "Tulis selisih setiap dua bilangan berdekatan. Selisih yang berbeda menunjukkan letak kesalahan.", bahas: `Polanya +${k}: ${d.map(fmt).join(", ")}. Seharusnya ${d[i]}, bukan ${t[i]}.`,
        langkah: [`Tulis selisih setiap dua bilangan berdekatan: ${ajPanah(t)}.`, `Kebanyakan selisihnya +${k}, jadi aturannya <b>+${k}</b>. Mulai dari ${d[0]}.`, `Pola yang benar: ${d.map(fmt).join(", ")}.`, `Bilangan ke-${i + 1} seharusnya ${fmt(d[i])}, tetapi tertulis ${fmt(t[i])}.`, ajJadi("bilangan yang salah adalah", t[i])] }); },
    /* Pola berkurang dalam cerita */
    () => { const k = pilih([15, 20, 25, 30, 40, 50]), n = acak(6, 15), L = k * (n + acak(3, 12)), x = pilih(["tangki air", "drum air", "bak penampung"]);
      return isian(`Sebuah ${x} berisi ${fmt(L)} liter air. Setiap hari air dipakai ${k} liter. Sisa air setelah hari ke-${n} adalah …`, L - n * k, { satuan: "liter", petunjuk: `Polanya: ${fmt(L - k)}, ${fmt(L - 2 * k)}, ${fmt(L - 3 * k)}, … (berkurang ${k}).`, bahas: `${fmt(L)} − ${n} × ${k} = ${fmt(L)} − ${n * k} = ${fmt(L - n * k)} liter.`,
        langkah: [`Setiap hari air berkurang ${k} liter: ${fmt(L)}, ${fmt(L - k)}, ${fmt(L - 2 * k)}, …`, `Selama ${n} hari, air terpakai ${n} × ${k} = ${fmt(n * k)} liter.`, `Sisa air = ${fmt(L)} − ${fmt(n * k)} = ${fmt(L - n * k)} liter.`, ajJadi(`sisa air setelah hari ke-${n} adalah`, L - n * k, "liter")] }); },
  ],
  7: [
    () => { const t = pilih(["persegi", "segitiga", "kubik"]), f = { persegi: n => n * n, segitiga: n => n * (n + 1) / 2, kubik: n => n ** 3 }[t], n = t === "kubik" ? acak(5, 7) : acak(7, 12);
      const langkah = t === "persegi" ? [`Perhatikan: 1 = 1 × 1, 4 = 2 × 2, 9 = 3 × 3, 16 = 4 × 4. Ini bilangan persegi.`, `Aturannya: suku ke-n = <b>n × n</b>.`, `Suku ke-${n} = ${n} × ${n} = ${f(n)}.`, ajJadi(`suku ke-${n} adalah`, f(n))]
        : t === "segitiga" ? [`Selisihnya: 1 → 3 (+2), 3 → 6 (+3), 6 → 10 (+4). Selisihnya bertambah 1. Ini bilangan segitiga.`, `Aturannya: suku ke-n = 1 + 2 + … + n = <b>n × (n + 1) : 2</b>. Cek suku ke-4: 4 × 5 : 2 = 10 ✔`, `Suku ke-${n} = ${n} × ${n + 1} : 2 = ${n * (n + 1)} : 2 = ${f(n)}.`, ajJadi(`suku ke-${n} adalah`, f(n))]
          : [`Perhatikan: 1 = 1 × 1 × 1, 8 = 2 × 2 × 2, 27 = 3 × 3 × 3, 64 = 4 × 4 × 4. Ini bilangan kubik.`, `Aturannya: suku ke-n = <b>n × n × n</b>.`, `Suku ke-${n} = ${n} × ${n} × ${n} = ${n * n} × ${n} = ${f(n)}.`, ajJadi(`suku ke-${n} adalah`, f(n))];
      return isian(`Perhatikan pola <b>${[1, 2, 3, 4].map(f).join(", ")}, …</b><br>Suku ke-${n} adalah …`, f(n), { petunjuk: t === "persegi" ? "1 = 1×1, 4 = 2×2, …" : t === "segitiga" ? "Selisihnya 2, 3, 4, …" : "1 = 1×1×1, 8 = 2×2×2, …", bahas: `Suku ke-${n} = ${f(n)}.`, langkah }); },
    () => { const c = acak(1, 9) * pilih([1, -1]), k = pilih([1, 2]), f = n => k * n * n + c; if (f(1) <= 0) return isian(`Suku ke-8 dari pola 3, 6, 11, 18, … adalah …`, 66, { bahas: "n² + 2 → 64 + 2 = 66.",
        langkah: ["Bandingkan dengan bilangan persegi 1, 4, 9, 16.", "Setiap suku lebih 2: 3 = 1 + 2, 6 = 4 + 2, 11 = 9 + 2, 18 = 16 + 2. Aturannya <b>n × n + 2</b>.", "Suku ke-8 = 8 × 8 + 2 = 64 + 2 = 66.", ajJadi("suku ke-8 adalah", 66)] });
      const n = acak(6, 12), ps = [1, 2, 3, 4].map(m => k * m * m), tc = c > 0 ? "+ " + c : "− " + -c, rm = `${k === 2 ? "2 × " : ""}n × n ${tc}`;
      return isian(`Suku ke-${n} dari pola <b>${tulisDeret([1, 2, 3, 4].map(f))}</b> adalah …`, f(n), { petunjuk: `Bandingkan dengan pola bilangan persegi ${k === 2 ? "yang dikali 2 " : ""}(1, 4, 9, 16, …).`, bahas: `Rumusnya ${k === 2 ? "2 × " : ""}n × n ${c > 0 ? "+ " + c : "− " + -c}. Suku ke-${n} = ${f(n)}.`,
        langkah: [`Bandingkan dengan ${k === 2 ? "dua kali bilangan persegi: 2 × 1, 2 × 4, 2 × 9, 2 × 16 = " : "bilangan persegi: "}${ps.join(", ")}.`, `Setiap suku ${c > 0 ? "lebih " + c : "kurang " + -c}: ${[1, 2, 3, 4].map((m, i) => `${f(m)} = ${ps[i]} ${tc}`).join(", ")}.`, `Aturannya: suku ke-n = <b>${rm}</b>.`, `Suku ke-${n} = ${k === 2 ? "2 × " : ""}${n} × ${n} ${tc} = ${k * n * n} ${tc} = ${f(n)}.`, ajJadi(`suku ke-${n} adalah`, f(n))] }); },
    () => { const s = acak(0, 4), f = n => (n + s) * (n + s + 1), n = acak(6, 12); return isian(`Suku ke-${n} dari pola <b>${tulisDeret([1, 2, 3, 4].map(f))}</b> adalah …`, f(n), { petunjuk: `${f(1)} = ${1 + s} × ${2 + s}, ${f(2)} = ${2 + s} × ${3 + s}, …`, bahas: `Suku ke-n = (n + ${s}) × (n + ${s + 1}). Suku ke-${n} = ${n + s} × ${n + s + 1} = ${f(n)}.`,
      langkah: [`Uraikan setiap suku menjadi perkalian dua bilangan berurutan: ${[1, 2, 3, 4].map(m => `${f(m)} = ${m + s} × ${m + s + 1}`).join(", ")}.`, s ? `Bilangan pertama selalu ${s} lebihnya dari nomor suku. Aturannya: <b>(n + ${s}) × (n + ${s + 1})</b>.` : `Bilangan pertama sama dengan nomor suku. Aturannya: <b>n × (n + 1)</b>.`, `Suku ke-${n} = ${n + s} × ${n + s + 1} = ${f(n)}.`, ajJadi(`suku ke-${n} adalah`, f(n))] }); },
    /* Pola berulang */
    () => { const pj = acak(3, 5), x = nama(), benda = pilih([["manik-manik", "berwarna"], ["bendera", "berwarna"], ["lampu hias", "berwarna"]]),
        semua = ambil(["merah", "kuning", "hijau", "biru", "ungu", "putih", "oranye"], pj + 1), siklus = semua.slice(0, pj), N = acak(30, 99), w = siklus[(N - 1) % pj], sisa = (N - 1) % pj + 1;
      return pg(`${x} menyusun ${benda[0]} dengan urutan warna berulang: <b>${[...siklus, ...siklus.slice(0, 2)].join(", ")}, …</b><br>${benda[0][0].toUpperCase() + benda[0].slice(1)} ke-${N} ${benda[1]} …`, w, kocok(semua.filter(c => c !== w)),
        { petunjuk: `Satu putaran warna ada ${pj}. Bagi ${N} dengan ${pj}, lalu lihat sisanya.`, bahas: `${N} : ${pj} = ${Math.floor(N / pj)} sisa ${N % pj}. ${N % pj ? `Sisa ${N % pj} berarti warna ke-${sisa} dalam putaran` : `Sisa 0 berarti warna terakhir dalam putaran`}, yaitu <b>${w}</b>.`,
          langkah: [`Satu putaran warna: ${siklus.join(", ")} (ada ${pj} warna).`, `Bagi nomornya dengan ${pj}: ${N} : ${pj} = ${Math.floor(N / pj)} sisa ${N % pj}.`, N % pj ? `${Math.floor(N / pj)} putaran penuh sudah lewat. Sisa ${N % pj} berarti warna ke-${sisa} dalam putaran, yaitu ${w}.` : `Sisa 0 berarti ${benda[0]} ke-${N} adalah warna terakhir dalam putaran, yaitu ${w}.`, `Jadi, ${benda[0]} ke-${N} berwarna <b>${w}</b>.`] }); },
    /* Pola perkalian dalam cerita */
    () => { const t = pilih([15, 20, 30]), a = acak(2, 6), j = t === 30 ? pilih([2, 3]) : t === 20 ? pilih([1, 2]) : 1, n = j * 60 / t, hasil = a * 2 ** n;
      return isian(`Dalam percobaan, ${a} sel bakteri membelah diri menjadi 2 setiap ${t} menit. Banyak sel bakteri setelah ${j} jam adalah …`, hasil, { satuan: "sel", petunjuk: `${j} jam = ${j * 60} menit = ${n} kali membelah. Setiap membelah, banyaknya dikali 2.`, bahas: `${deret(a, y => y * 2, n + 1).join(" → ")}. Setelah ${n} kali membelah ada ${fmt(hasil)} sel.`,
        langkah: [`${j} jam = ${j * 60} menit.`, `Bakteri membelah setiap ${t} menit, jadi ${j * 60} : ${t} = ${n} kali membelah.`, `Setiap membelah, banyaknya dikali 2: ${deret(a, y => y * 2, n + 1).map(fmt).join(" → ")}.`, ajJadi(`banyak sel bakteri setelah ${j} jam adalah`, hasil, "sel")] }); },
    /* Bilangan yang termasuk pola */
    () => { const a = acak(2, 20), k = acak(3, 9), m = acak(15, 35), X = a + m * k;
      const s = pg(`Bilangan yang merupakan salah satu suku dari pola <b>${tulisDeret(deret(a, y => y + k, 4))}</b> adalah …`, fmt(X), kocok([X + 1, X - 1, X + 2, X - 2]).map(fmt),
        { petunjuk: `Kurangi bilangan dengan ${a}. Hasilnya harus habis dibagi ${k}.`, bahas: `(${X} − ${a}) : ${k} = ${m}, habis dibagi. Jadi ${X} adalah suku ke-${m + 1}. Bilangan lain jika dikurangi ${a} tidak habis dibagi ${k}.` });
      const lain = s.opsi.filter((_, i) => i !== s.kunci).map(o => +o.replace(/\./g, ""));
      s.langkah = [`Polanya dimulai dari ${a} dan selalu +${k}. Jadi suku pola = ${a} + kelipatan ${k}.`, `Cara cek: kurangi bilangan dengan ${a}, lalu lihat apakah hasilnya habis dibagi ${k}.`,
        `${fmt(X)} − ${a} = ${fmt(X - a)}, dan ${fmt(X - a)} : ${k} = ${m} (habis dibagi) ✔ Jadi ${fmt(X)} adalah suku ke-${m + 1}.`,
        `Pilihan lain: ${lain.map(v => `${fmt(v)} − ${a} = ${fmt(v - a)}`).join(", ")}; semuanya tidak habis dibagi ${k} ✘`, ajJadi("bilangan yang termasuk pola adalah", fmt(X))];
      return s; },
  ],
  8: [
    () => { const a = acak(10, 20), k = acak(2, 4), n = acak(12, 25); return isian(`Di sebuah gedung pertunjukan, baris pertama ada ${a} kursi. Setiap baris di belakangnya bertambah ${k} kursi. Banyak kursi pada baris ke-${n} adalah …`, a + (n - 1) * k, { satuan: "kursi", bahas: `${a} + (${n} − 1) × ${k} = ${a + (n - 1) * k} kursi.`,
      langkah: [`Baris ke-1 ada ${a} kursi, lalu setiap baris bertambah ${k}: ${a}, ${a + k}, ${a + 2 * k}, …`, `Dari baris ke-1 ke baris ke-${n} ada ${n} − 1 = ${n - 1} kali penambahan.`, `Banyak kursi = ${a} + ${n - 1} × ${k} = ${a} + ${(n - 1) * k} = ${a + (n - 1) * k}.`, ajJadi(`banyak kursi pada baris ke-${n} adalah`, a + (n - 1) * k, "kursi")] }); },
    () => { const a = pilih([2000, 3000, 5000]), k = pilih([500, 1000, 2000]), n = acak(8, 15), x = nama(); return isian(`${x} menabung. Minggu pertama ${rp(a)}, dan setiap minggu tabungannya ${rp(k)} lebih banyak dari minggu sebelumnya. Pada minggu ke-${n}, ${x} menabung Rp …`, a + (n - 1) * k, { bahas: `${rp(a)} + (${n} − 1) × ${rp(k)} = ${rp(a + (n - 1) * k)}.`,
      langkah: [`Polanya: ${rp(a)}, ${rp(a + k)}, ${rp(a + 2 * k)}, … (bertambah ${rp(k)}).`, `Dari minggu ke-1 ke minggu ke-${n} ada ${n} − 1 = ${n - 1} kali penambahan: ${n - 1} × ${rp(k)} = ${rp((n - 1) * k)}.`, `Tabungan minggu ke-${n} = ${rp(a)} + ${rp((n - 1) * k)} = ${rp(a + (n - 1) * k)}.`, ajJadi(`pada minggu ke-${n}, ${x} menabung`, rp(a + (n - 1) * k))] }); },
  ],
  9: [
    () => { const a = acak(1, 9), k = acak(2, 5), n = acak(10, 20), l = a + (n - 1) * k; return isian(`Jumlah ${n} suku pertama dari pola <b>${tulisDeret(deret(a, x => x + k, 4))}</b> adalah …`, n * (a + l) / 2, { petunjuk: "Pasangkan suku pertama dengan suku terakhir.", bahas: `Suku ke-${n} = ${l}. Jumlah = ${n} × (${a} + ${l}) : 2 = ${fmt(n * (a + l) / 2)}.`,
      langkah: [`Suku pertama ${a}, setiap suku bertambah ${k}.`, `Suku terakhir (ke-${n}) = ${a} + ${n - 1} × ${k} = ${a} + ${(n - 1) * k} = ${l}.`, `Pasangan suku pertama + suku terakhir = ${a} + ${l} = ${a + l}. Setiap pasangan dari luar ke dalam jumlahnya juga ${a + l}.`, `Jumlah = banyak suku × (pertama + terakhir) : 2 = ${n} × ${a + l} : 2 = ${fmt(n * (a + l))} : 2 = ${fmt(n * (a + l) / 2)}.`, ajJadi(`jumlah ${n} suku pertama adalah`, n * (a + l) / 2)] }); },
    () => { const a = acak(1, 4), b = acak(1, 5), d = deret(0, () => 0, 1); d.length = 0; d.push(a, b); while (d.length < 8) d.push(d[d.length - 1] + d[d.length - 2]); return isian(`Bilangan berikutnya dari pola <b>${tulisDeret(d.slice(0, 7))}</b> adalah …`, d[7], { petunjuk: "Coba jumlahkan dua bilangan sebelumnya.", bahas: `${d[5]} + ${d[6]} = ${d[7]}.`,
      langkah: [`Coba jumlahkan dua bilangan berurutan: ${d[0]} + ${d[1]} = ${d[2]}, ${d[1]} + ${d[2]} = ${d[3]}, ${d[2]} + ${d[3]} = ${d[4]}.`, `Aturannya: setiap bilangan = <b>jumlah dua bilangan sebelumnya</b>.`, `Bilangan berikutnya: ${d[5]} + ${d[6]} = ${d[7]}.`, ajJadi("bilangan berikutnya adalah", d[7])] }); },
    /* Menemukan kesalahan pada pola bertingkat / perkalian */
    () => { let d, aturan;
      if (ya()) { const a = acak(2, 6), r = pilih([2, 3]); d = deret(a, x => x * r, 6); aturan = `dikali ${r}`; }
      else { const a = acak(1, 20), s = acak(2, 5), t = acak(2, 3); d = deret(a, (x, i) => x + s + (i - 1) * t, 6); aturan = `selisihnya bertambah ${t} (${d.slice(1).map((x, i) => x - d[i]).join(", ")})`; }
      const i = acak(2, 4), t2 = d.slice(); t2[i] += pilih([-1, 1]);
      return pg(`Ada <b>satu</b> bilangan yang salah tulis pada pola <b>${t2.map(fmt).join(", ")}</b>. Bilangan yang salah adalah …`, fmt(t2[i]), kocok(t2.filter((_, j) => j !== i && j > 0)).map(fmt),
        { petunjuk: "Cari aturan dari bilangan-bilangan awal, lalu periksa satu per satu.", bahas: `Aturannya: ${aturan}. Pola yang benar ${d.map(fmt).join(", ")}. Seharusnya ${fmt(d[i])}, bukan ${fmt(t2[i])}.`,
          langkah: [`Cari aturan dari bilangan-bilangan awal ${fmt(t2[0])}, ${fmt(t2[1])}, … Aturannya: <b>${aturan}</b>.`, `Dengan aturan itu, pola yang benar: ${d.map(fmt).join(", ")}.`, `Bandingkan satu per satu dengan yang tertulis: bilangan ke-${i + 1} seharusnya ${fmt(d[i])}, tetapi tertulis ${fmt(t2[i])}.`, ajJadi("bilangan yang salah adalah", fmt(t2[i]))] }); },
    /* Pilih semua suku pola */
    () => { const a = acak(2, 15), k = acak(4, 9), ms = ambil([12, 15, 18, 20, 23, 25, 27, 30, 34, 40], 5), nB = acak(2, 3);
      const butir = ms.map((m, i) => i < nB ? { t: fmt(a + m * k), b: true } : { t: fmt(a + m * k + pilih([1, 2, k - 1, k - 2, -1, -2])), b: false });
      const s = pgk(`Perhatikan pola <b>${tulisDeret(deret(a, y => y + k, 4))}</b><br>Pilih <b>semua</b> bilangan yang termasuk suku pola tersebut.`, butir,
        { petunjuk: `Suku pola = ${a} + kelipatan ${k}.`, bahas: `Kurangi setiap bilangan dengan ${a}, lalu cek apakah habis dibagi ${k}. Yang termasuk: ${butir.filter(x => x.b).map(x => x.t).join(", ")}.` });
      s.langkah = [`Polanya dimulai dari ${a} dan selalu +${k}. Kurangi setiap bilangan dengan ${a}, lalu cek apakah hasilnya habis dibagi ${k}.`,
        ...s.opsi.map((o, i) => { const v = +o.replace(/\./g, ""), e = v - a, q = Math.floor(e / k), r = e - q * k;
          return s.kunci[i] ? `✔ <b>${o}</b> termasuk, karena ${o} − ${a} = ${fmt(e)} dan ${fmt(e)} : ${k} = ${fmt(q)} (habis dibagi).`
            : `✘ <b>${o}</b> bukan suku pola, karena ${o} − ${a} = ${fmt(e)} dan ${fmt(e)} : ${k} = ${fmt(q)} sisa ${r} (tidak habis dibagi).`; }),
        ajJadi("bilangan yang termasuk suku pola:", s.opsi.filter((_, i) => s.kunci[i]).join(", "))];
      return s; },
    /* Kabar berantai: jumlah pola perkalian */
    () => { const n = acak(5, 9), x = nama(), baru = deret(1, y => y * 2, n), tot = 2 ** n - 1;
      return isian(`Hari pertama hanya ${x} yang tahu sebuah kabar. Setiap orang yang baru tahu memberi tahu 2 orang lain keesokan harinya. Sampai hari ke-${n}, banyak orang yang sudah tahu kabar itu (termasuk ${x}) adalah …`, tot,
        { satuan: "orang", petunjuk: "Orang yang baru tahu setiap hari: 1, 2, 4, 8, … Lalu jumlahkan.", bahas: `Yang baru tahu: ${baru.join(" + ")} = ${fmt(tot)} orang.`,
          langkah: [`Hari ke-1 hanya 1 orang. Setiap orang yang baru tahu memberi tahu 2 orang, jadi orang yang baru tahu dikali 2 setiap hari.`, `Yang baru tahu dari hari ke-1 sampai hari ke-${n}: ${baru.map(fmt).join(", ")}.`, `Jumlahkan semuanya: ${baru.map(fmt).join(" + ")} = ${fmt(tot)}.`, `Trik cek: jumlahnya selalu 1 kurangnya dari bilangan berikutnya pada pola, yaitu ${fmt(2 ** n)} − 1 = ${fmt(tot)} ✔`, ajJadi(`sampai hari ke-${n}, banyak orang yang sudah tahu adalah`, tot, "orang")] }); },
  ],
  10: [
    () => { const p = acak(1, 3), q = acak(-2, 4), r = acak(0, 5), f = n => p * n * n + q * n + r; if (f(1) <= 0) return isian(`Suku ke-10 dari pola 2, 5, 10, 17, … adalah …`, 101, { bahas: "n² + 1 → 101.",
        langkah: ["Selisih tingkat pertama: 2 → 5 (+3), 5 → 10 (+5), 10 → 17 (+7). Selisih tingkat kedua tetap 2, jadi polanya berhubungan dengan n × n.", "Bandingkan dengan bilangan persegi 1, 4, 9, 16: setiap suku lebih 1. Aturannya <b>n × n + 1</b>.", "Suku ke-10 = 10 × 10 + 1 = 100 + 1 = 101.", ajJadi("suku ke-10 adalah", 101)] });
      const n = acak(10, 15), d = [1, 2, 3, 4, 5].map(f), d1 = d.slice(1).map((x, i) => x - d[i]), d2 = d1.slice(1).map((x, i) => x - d1[i]);
      const rumus = `${p === 1 ? "" : p}n²${q ? (q > 0 ? " + " : " − ") + (Math.abs(q) === 1 ? "" : Math.abs(q)) + "n" : ""}${r ? " + " + r : ""}`;
      const ek = `${p === 1 ? "" : p + " × "}${n} × ${n}${q ? (q > 0 ? " + " : " − ") + (Math.abs(q) === 1 ? "" : Math.abs(q) + " × ") + n : ""}${r ? " + " + r : ""}`;
      const ni = `${p * n * n}${q ? (q > 0 ? " + " : " − ") + Math.abs(q) * n : ""}${r ? " + " + r : ""}`;
      return isian(`Suku ke-${n} dari pola <b>${tulisDeret([1, 2, 3, 4, 5].map(f))}</b> adalah …`, f(n), { petunjuk: "Hitung selisih tingkat pertama, lalu selisih tingkat kedua.", bahas: `Rumus suku ke-n = ${p === 1 ? "" : p}n²${q ? (q > 0 ? " + " : " − ") + (Math.abs(q) === 1 ? "" : Math.abs(q)) + "n" : ""}${r ? " + " + r : ""}. Suku ke-${n} = ${f(n)}.`,
        langkah: [`Selisih tingkat pertama: ${d1.join(", ")}.`, `Selisih tingkat kedua: ${d2.join(", ")} (tetap). Jadi rumusnya memuat n² (n × n), sebanyak ${d2[0]} : 2 = ${p}.`, `Rumus suku ke-n = <b>${rumus}</b>. Cek suku ke-1: ${p} × 1${q ? (q > 0 ? " + " : " − ") + Math.abs(q) : ""}${r ? " + " + r : ""} = ${d[0]} ✔`, `Suku ke-${n} = ${ek} = ${ni} = ${f(n)}.`, ajJadi(`suku ke-${n} adalah`, f(n))] }); },
    () => { const a = acak(3, 20), k = acak(3, 8), n = acak(25, 60), X = a + (n - 1) * k; return isian(`Pada pola <b>${tulisDeret(deret(a, x => x + k, 4))}</b>, bilangan <b>${X}</b> adalah suku ke- …`, n, { petunjuk: `(${X} − ${a}) : ${k} lalu tambah 1.`, bahas: `(${X} − ${a}) : ${k} + 1 = ${n}.`,
      langkah: [`Polanya dimulai dari ${a} dan selalu <b>+${k}</b>.`, `Jarak dari ${a} ke ${X}: ${X} − ${a} = ${X - a}.`, `Banyak lompatan +${k}: ${X - a} : ${k} = ${n - 1}.`, `Suku ke-1 ditambah ${n - 1} lompatan = suku ke-${n}. Cek: ${a} + ${n - 1} × ${k} = ${X} ✔`, `Jadi, ${X} adalah suku ke-<b>${n}</b>.`] }); },
    /* Dua pola bertemu */
    () => { const a = acak(5, 30), k = acak(2, 6), m = acak(2, 6), n = acak(6, 14), b = a + (n - 1) * (k + m), v = a + (n - 1) * k, x = namaBeda(2);
      return isian(`Pada minggu ke-1, tabungan ${x[0]} ${fmt(a)} ribu rupiah dan setiap minggu berikutnya bertambah ${k} ribu rupiah. Tabungan ${x[1]} pada minggu ke-1 sebesar ${fmt(b)} ribu rupiah dan setiap minggu berikutnya berkurang ${m} ribu rupiah. Tabungan mereka sama besar pada minggu ke- …`, n,
        { petunjuk: `Setiap minggu selisih tabungan mereka mengecil ${k} + ${m} = ${k + m} ribu.`, bahas: `Selisih awal ${fmt(b)} − ${fmt(a)} = ${fmt(b - a)} ribu. ${fmt(b - a)} : ${k + m} = ${n - 1} minggu setelah minggu pertama, jadi minggu ke-${n}. Saat itu tabungan masing-masing ${fmt(v)} ribu rupiah.`,
          langkah: [`Selisih tabungan pada minggu ke-1: ${fmt(b)} − ${fmt(a)} = ${fmt(b - a)} ribu.`, `Setiap minggu tabungan ${x[0]} naik ${k} ribu dan tabungan ${x[1]} turun ${m} ribu, jadi selisihnya mengecil ${k} + ${m} = ${k + m} ribu.`, `Selisih habis setelah ${fmt(b - a)} : ${k + m} = ${n - 1} minggu, dihitung dari minggu ke-1. Jadi minggu ke-1 + ${n - 1} = minggu ke-${n}.`, `Cek: ${x[0]} = ${fmt(a)} + ${n - 1} × ${k} = ${fmt(v)}; ${x[1]} = ${fmt(b)} − ${n - 1} × ${m} = ${fmt(v)} ✔`, `Jadi, tabungan mereka sama besar pada minggu ke-<b>${n}</b>.`] }); },
    /* Menyisipkan bilangan */
    () => { const p = acak(2, 40), s = acak(3, 9), d = acak(2, 12), q = p + (s + 1) * d;
      return isian(`Di antara bilangan ${p} dan ${q} disisipkan ${s} bilangan sehingga ke-${s + 2} bilangan itu membentuk pola dengan selisih tetap. Selisih pola tersebut adalah …`, d,
        { petunjuk: `Ada ${s + 2} bilangan, berarti ada ${s + 1} langkah dari ${p} ke ${q}.`, bahas: `(${q} − ${p}) : ${s + 1} = ${q - p} : ${s + 1} = ${d}. Polanya ${deret(p, y => y + d, s + 2).join(", ")}.`,
          langkah: [`Banyak bilangan seluruhnya: ${s} sisipan + 2 ujung = ${s + 2} bilangan.`, `Dari ${p} ke ${q} ada ${s + 2} − 1 = ${s + 1} langkah yang sama besar.`, `Selisih = (${q} − ${p}) : ${s + 1} = ${q - p} : ${s + 1} = ${d}.`, `Cek polanya: ${deret(p, y => y + d, s + 2).join(", ")} ✔`, ajJadi("selisih pola tersebut adalah", d)] }); },
    /* Jumlah pola berulang */
    () => { const pj = acak(3, 4), c = Array.from({ length: pj }, () => acak(1, 9)), N = acak(30, 80), put = Math.floor(N / pj), sisa = N % pj, sp = c.reduce((s, v) => s + v, 0), ss = c.slice(0, sisa).reduce((s, v) => s + v, 0), tot = put * sp + ss;
      return isian(`Pola <b>${[...c, ...c].join(", ")}, …</b> terus berulang. Jumlah ${N} bilangan pertama pola itu adalah …`, tot,
        { petunjuk: `Satu putaran ada ${pj} bilangan dengan jumlah ${sp}.`, bahas: `${N} : ${pj} = ${put} putaran sisa ${sisa}. Jumlah = ${put} × ${sp}${sisa ? ` + (${c.slice(0, sisa).join(" + ")})` : ""} ${sisa ? ` = ${put * sp} + ${ss}` : ""} = ${fmt(tot)}.`,
          langkah: [`Satu putaran: ${c.join(", ")} (${pj} bilangan). Jumlahnya ${c.join(" + ")} = ${sp}.`, `${N} : ${pj} = ${put} putaran penuh, sisa ${sisa} bilangan.`, `Jumlah ${put} putaran = ${put} × ${sp} = ${fmt(put * sp)}.`,
            sisa ? `Sisa ${sisa} bilangan adalah awal putaran: ${sisa > 1 ? c.slice(0, sisa).join(" + ") + " = " : ""}${ss}. Total = ${fmt(put * sp)} + ${ss} = ${fmt(tot)}.` : `Tidak ada sisa, jadi totalnya ${fmt(tot)}.`, ajJadi(`jumlah ${N} bilangan pertama adalah`, tot)] }); },
  ],
});

/* ================= Misi 2: Pola gambar ================= */
const U = 22;   // ukuran satuan gambar
/* alasan = penjelasan singkat mengapa banyaknya bertambah seperti itu (untuk pembahasan bertahap) */
const POLA = {
  korekPersegi: { f: n => 3 * n + 1, nama: "batang korek api", jenis: "linear", alasan: "Setiap persegi baru menempel pada persegi sebelumnya, jadi cukup menambah 3 batang (atas, bawah, kanan).", gambar: n => { let s = ""; for (let i = 0; i <= n; i++) s += `<line x1="${i * U}" y1="0" x2="${i * U}" y2="${U}" class="korek"/>`; for (let i = 0; i < n; i++) s += `<line x1="${i * U + 2}" y1="0" x2="${(i + 1) * U - 2}" y2="0" class="korek"/><line x1="${i * U + 2}" y1="${U}" x2="${(i + 1) * U - 2}" y2="${U}" class="korek"/>`; return { s, w: n * U, h: U }; } },
  korekSegitiga: { f: n => 2 * n + 1, nama: "batang korek api", jenis: "linear", alasan: "Setiap pola baru cukup menambah 2 batang: satu miring dan satu mendatar.", gambar: n => { const h = U * 0.87, P = []; for (let i = 0; i <= n + 1; i++) P.push([i * U / 2, i % 2 ? 0 : h]); let s = "";
      for (let i = 0; i < n + 1; i++) s += `<line x1="${P[i][0]}" y1="${P[i][1]}" x2="${P[i + 1][0]}" y2="${P[i + 1][1]}" class="korek"/>`;
      for (let i = 0; i < n; i++) s += `<line x1="${P[i][0] + 2}" y1="${P[i][1]}" x2="${P[i + 2][0] - 2}" y2="${P[i + 2][1]}" class="korek"/>`; return { s, w: (n + 1) * U / 2, h }; } },
  titikPersegi: { f: n => n * n, nama: "titik", jenis: "kuadrat", alasan: "Titiknya membentuk persegi: pola ke-n berisi n baris, setiap baris n titik. Banyaknya <b>n × n</b>.", gambar: n => { let s = ""; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += `<circle cx="${i * 12 + 5}" cy="${j * 12 + 5}" r="4" class="titik"/>`; return { s, w: n * 12, h: n * 12 }; } },
  titikSegitiga: { f: n => n * (n + 1) / 2, nama: "titik", jenis: "kuadrat", alasan: "Titiknya membentuk segitiga: baris 1 ada 1 titik, baris 2 ada 2 titik, …, baris n ada n titik. Banyaknya 1 + 2 + … + n = <b>n × (n + 1) : 2</b>.", gambar: n => { let s = ""; for (let r = 1; r <= n; r++) for (let j = 0; j < r; j++) s += `<circle cx="${(n - r) * 6 + j * 12 + 5}" cy="${(r - 1) * 11 + 5}" r="4" class="titik"/>`; return { s, w: n * 12, h: n * 11 }; } },
  ubinL: { f: n => 2 * n - 1, nama: "ubin", jenis: "linear", alasan: "Setiap pola baru, kaki tegak dan kaki mendatar huruf L masing-masing bertambah 1 ubin.", gambar: n => { const u = 14; let s = ""; for (let i = 0; i < n; i++) s += `<rect x="0" y="${i * u}" width="${u}" height="${u}" class="ubin"/>`; for (let i = 1; i < n; i++) s += `<rect x="${i * u}" y="${(n - 1) * u}" width="${u}" height="${u}" class="ubin"/>`; return { s, w: n * u, h: n * u }; } },
  bingkai: { f: n => 4 * n, nama: "ubin", jenis: "linear", alasan: "Bingkainya punya 4 sisi; setiap pola baru, bingkai membesar dan bertambah 4 ubin.", gambar: n => { const u = 12, m = n + 1; let s = ""; for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) if (i === 0 || j === 0 || i === m - 1 || j === m - 1) s += `<rect x="${i * u}" y="${j * u}" width="${u}" height="${u}" class="ubin"/>`; return { s, w: m * u, h: m * u }; } },
  plus: { f: n => 4 * n + 1, nama: "persegi", jenis: "linear", alasan: "Ada 1 persegi di tengah, dan keempat lengannya masing-masing bertambah 1 persegi.", gambar: n => { const u = 10, m = 2 * n + 1; let s = ""; for (let i = 0; i < m; i++) { s += `<rect x="${i * u}" y="${n * u}" width="${u}" height="${u}" class="ubin"/>`; if (i !== n) s += `<rect x="${n * u}" y="${i * u}" width="${u}" height="${u}" class="ubin"/>`; } return { s, w: m * u, h: m * u }; } },
  korekRumah: { f: n => 5 * n + 1, nama: "batang korek api", jenis: "linear", alasan: "Setiap rumah baru menambah 3 batang badan dan 2 batang atap.", gambar: n => { const a = POLA.korekPersegi.gambar(n), r = U * 0.6; let s = `<g transform="translate(0,${r})">${a.s}`;
      for (let i = 0; i < n; i++) s += `<line x1="${i * U + 1}" y1="-1" x2="${i * U + U / 2}" y2="${-r}" class="korek"/><line x1="${i * U + U / 2}" y1="${-r}" x2="${(i + 1) * U - 1}" y2="-1" class="korek"/>`; return { s: s + "</g>", w: a.w, h: a.h + r }; } },
  titikPersegiPanjang: { f: n => n * (n + 1), nama: "titik", jenis: "kuadrat", alasan: "Titiknya membentuk persegi panjang: pola ke-n berisi n baris, setiap baris (n + 1) titik. Banyaknya <b>n × (n + 1)</b>.", gambar: n => { let s = ""; for (let i = 0; i < n + 1; i++) for (let j = 0; j < n; j++) s += `<circle cx="${i * 12 + 5}" cy="${j * 12 + 5}" r="4" class="titik"/>`; return { s, w: (n + 1) * 12, h: n * 12 }; } },
  ubinT: { f: n => 3 * n + 1, nama: "ubin", jenis: "linear", alasan: "Setiap pola baru, bagian atas huruf T bertambah 2 ubin dan tiangnya bertambah 1 ubin.", gambar: n => { const u = 12; let s = ""; for (let i = 0; i < 2 * n + 1; i++) s += `<rect x="${i * u}" y="0" width="${u}" height="${u}" class="ubin"/>`; for (let j = 1; j <= n; j++) s += `<rect x="${n * u}" y="${j * u}" width="${u}" height="${u}" class="ubin"/>`; return { s, w: (2 * n + 1) * u, h: (n + 1) * u }; } },
  ubinDuaBaris: { f: n => 2 * n + 2, nama: "ubin", jenis: "linear", alasan: "Ada 2 baris; setiap pola baru, tiap baris bertambah 1 ubin.", gambar: n => { const u = 14; let s = ""; for (let i = 0; i < n + 1; i++) s += `<rect x="${i * u}" y="0" width="${u}" height="${u}" class="ubin"/><rect x="${i * u}" y="${u}" width="${u}" height="${u}" class="ubin"/>`; return { s, w: (n + 1) * u, h: 2 * u }; } },
  tangga: { f: n => n * (n + 1) / 2, nama: "persegi", jenis: "kuadrat", alasan: "Persegi tersusun seperti tangga: kolom 1 ada 1 persegi, kolom 2 ada 2, …, kolom n ada n. Banyaknya 1 + 2 + … + n = <b>n × (n + 1) : 2</b>.", gambar: n => { const u = 12; let s = ""; for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) s += `<rect x="${i * u}" y="${(n - 1 - j) * u}" width="${u}" height="${u}" class="ubin"/>`; return { s, w: n * u, h: n * u }; } },
  meja: { f: n => 2 * n + 2, nama: "kursi", jenis: "linear", alasan: "Setiap meja tambahan memberi 1 kursi di atas dan 1 kursi di bawah; kursi di kedua ujung tetap 2.", gambar: n => { const w = 24; let s = `<rect x="12" y="12" width="${n * w}" height="20" class="meja"/>`; for (let i = 0; i < n; i++) s += `<circle cx="${12 + i * w + w / 2}" cy="5" r="5" class="kursi"/><circle cx="${12 + i * w + w / 2}" cy="39" r="5" class="kursi"/>`; s += `<circle cx="5" cy="22" r="5" class="kursi"/><circle cx="${19 + n * w}" cy="22" r="5" class="kursi"/>`; return { s, w: n * w + 24, h: 44 }; } },
  titikDuaBaris: { f: n => 2 * n, nama: "titik", jenis: "linear", alasan: "Ada 2 baris; setiap pola baru, tiap baris bertambah 1 titik.", gambar: n => { let s = ""; for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) s += `<circle cx="${i * 12 + 5}" cy="${j * 12 + 5}" r="4" class="titik"/>`; return { s, w: n * 12, h: 24 }; } },
  titikTigaBaris: { f: n => 3 * n, nama: "titik", jenis: "linear", alasan: "Ada 3 baris; setiap pola baru, tiap baris bertambah 1 titik.", gambar: n => { let s = ""; for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) s += `<circle cx="${i * 12 + 5}" cy="${j * 12 + 5}" r="4" class="titik"/>`; return { s, w: n * 12, h: 36 }; } },
  ubinTigaBaris: { f: n => 3 * n + 3, nama: "ubin", jenis: "linear", alasan: "Ada 3 baris; setiap pola baru, tiap baris bertambah 1 ubin.", gambar: n => { const u = 12; let s = ""; for (let i = 0; i < n + 1; i++) for (let j = 0; j < 3; j++) s += `<rect x="${i * u}" y="${j * u}" width="${u}" height="${u}" class="ubin"/>`; return { s, w: (n + 1) * u, h: 3 * u }; } },
  ubinV: { f: n => 2 * n + 1, nama: "ubin", jenis: "linear", alasan: "Ada 1 ubin di bawah, dan kedua lengan huruf V masing-masing bertambah 1 ubin.", gambar: n => { const u = 11; let s = `<rect x="${n * u}" y="${n * u}" width="${u}" height="${u}" class="ubin"/>`; for (let i = 1; i <= n; i++) s += `<rect x="${(n - i) * u}" y="${(n - i) * u}" width="${u}" height="${u}" class="ubin"/><rect x="${(n + i) * u}" y="${(n - i) * u}" width="${u}" height="${u}" class="ubin"/>`; return { s, w: (2 * n + 1) * u, h: (n + 1) * u }; } },
};
function svgPola(pola, ns = [1, 2, 3]) {
  const g = ns.map(n => pola.gambar(n)), gap = 34, w = g.reduce((s, x) => s + x.w, 0) + gap * (g.length - 1) + 16, h = Math.max(...g.map(x => x.h)) + 34;
  let x = 8, s = svgBuka(w, h, "gambar pola");
  g.forEach((k, i) => { s += `<g transform="translate(${x},${h - 26 - k.h})">${k.s}</g>` + svgT(x + k.w / 2, h - 6, `Pola ${ns[i]}`, 'text-anchor="middle" class="lbl"'); x += k.w + gap; });
  return s + "</svg>";
}
const polaLinear = () => pilih(Object.values(POLA).filter(p => p.jenis === "linear"));
function rumusPola(p) { const a = p.f(1), b = p.f(2) - p.f(1); return { a, b }; }
/* ---- Langkah pola gambar ---- */
/* "Pola 1 = 4, Pola 2 = 7, Pola 3 = 10" */
const ajHitungPola = (p, ns = [1, 2, 3]) => `Hitung ${p.nama} pada gambar: ${ns.map(n => `Pola ${n} = ${fmt(p.f(n))}`).join(", ")}.`;
/* Penjabaran banyak benda pola ke-n: "4 + (10 − 1) × 3 = 4 + 27 = 31" */
function ajSubPola(p, n) {
  const f = fmt(p.f(n));
  if (p.jenis === "linear") { const { a, b } = rumusPola(p); return `${a} + (${n} − 1) × ${b} = ${a} + ${n - 1} × ${b} = ${a} + ${fmt((n - 1) * b)} = ${f}`; }
  if (p === POLA.titikPersegi) return `${n} × ${n} = ${f}`;
  if (p === POLA.titikPersegiPanjang) return `${n} × ${n + 1} = ${f}`;
  return `${n} × ${n + 1} : 2 = ${fmt(n * (n + 1))} : 2 = ${f}`;
}
/* Langkah pembuka: hitung dari gambar, lalu aturan (bertambah b / bentuk persegi-segitiga) */
function ajAturanPola(p, ns = [1, 2, 3]) {
  if (p.jenis !== "linear") return [ajHitungPola(p, ns), p.alasan];
  const { b } = rumusPola(p);
  return [ajHitungPola(p, ns), `Setiap naik satu pola bertambah <b>${b} ${p.nama}</b>. ${p.alasan}`];
}
function soalPolaKe(p, n, o = {}, m) {
  const { a, b } = rumusPola(p), lin = p.jenis === "linear";
  if (!m) m = acak(1, Math.max(1, Math.min(3, n - 3)));
  const ns = [m, m + 1, m + 2], lanjut = [];
  for (let i = m + 3; i <= n; i++) lanjut.push(`Pola ${i} = ${fmt(p.f(i))}`);
  const langkah = [...ajAturanPola(p, ns),
    lin && lanjut.length && lanjut.length <= 3 ? `Teruskan: ${lanjut.join(", ")}.` + (n > 4 ? ` (Cara cepat: pola ke-${n} = ${ajSubPola(p, n)}.)` : "")
      : lin ? `Pola ke-n = pola 1 + (n − 1) × ${b}. Pola ke-${n} = ${ajSubPola(p, n)}.` : `Pola ke-${n} = ${ajSubPola(p, n)}.`,
    ajJadi(`banyak ${p.nama} pada pola ke-${n} adalah`, p.f(n), p.nama)];
  return isian(`Perhatikan pola berikut. Banyak ${p.nama} pada <b>pola ke-${n}</b> adalah …`, p.f(n), { gambar: svgPola(p, [m, m + 1, m + 2]), satuan: p.nama,
    petunjuk: lin ? `Setiap pola bertambah ${b} ${p.nama}.` : "Perhatikan bentuknya: persegi atau segitiga?", bahas: lin ? `Pola: ${p.f(1)}, ${p.f(2)}, ${p.f(3)}, … (bertambah ${b}). Pola ke-${n} = ${a} + (${n} − 1) × ${b} = ${p.f(n)}.` : `Pola ke-${n} = ${p.f(n)}.`, langkah, ...o });
}
const polaKuadrat = () => pilih([POLA.titikPersegi, POLA.titikSegitiga, POLA.titikPersegiPanjang, POLA.tangga]);
/* Pola yang mudah dihitung untuk level awal */
const POLA_MUDAH = [POLA.ubinL, POLA.bingkai, POLA.titikPersegi, POLA.korekPersegi, POLA.korekSegitiga, POLA.ubinDuaBaris, POLA.ubinT, POLA.tangga, POLA.plus, POLA.meja, POLA.titikDuaBaris, POLA.titikTigaBaris, POLA.ubinTigaBaris, POLA.ubinV];
/* Menghitung banyak benda pada salah satu gambar */
function soalHitungGambar(p, m) {
  const k = m + acak(0, 2);
  return isian(`Perhatikan gambar. Banyak ${p.nama} pada gambar <b>Pola ${k}</b> adalah …`, p.f(k), { gambar: svgPola(p, [m, m + 1, m + 2]), satuan: p.nama,
    petunjuk: "Hitung satu per satu dengan teliti. Beri tanda pada yang sudah dihitung.", bahas: `Pola ${m}, ${m + 1}, ${m + 2} berturut-turut ${p.f(m)}, ${p.f(m + 1)}, ${p.f(m + 2)} ${p.nama}. Jadi Pola ${k} = ${p.f(k)}.`,
    langkah: [`Cari gambar yang bertuliskan <b>Pola ${k}</b>. Hitung ${p.nama} satu per satu dan beri tanda pada yang sudah dihitung.`, `Cara cepat: ${p.alasan}`, `Cek dengan aturannya: Pola ${k} = ${ajSubPola(p, k)}.`, ajJadi(`banyak ${p.nama} pada Pola ${k} adalah`, p.f(k), p.nama)] });
}
/* Pertambahan tetap dari satu pola ke pola berikutnya */
function soalTambahPola(p, m) {
  const { b } = rumusPola(p);
  return isian(`Perhatikan gambar. Setiap naik satu pola, banyak ${p.nama} bertambah …`, b, { gambar: svgPola(p, [m, m + 1, m + 2]), satuan: p.nama,
    petunjuk: "Hitung benda pada dua pola yang berdekatan, lalu kurangkan.", bahas: `${p.f(m)}, ${p.f(m + 1)}, ${p.f(m + 2)}: selalu bertambah ${b}.`,
    langkah: [ajHitungPola(p, [m, m + 1, m + 2]), `Kurangkan dua pola yang berdekatan: ${p.f(m + 1)} − ${p.f(m)} = ${b} dan ${p.f(m + 2)} − ${p.f(m + 1)} = ${b}.`, `Mengapa? ${p.alasan}`, ajJadi(`setiap naik satu pola, banyak ${p.nama} bertambah`, b, p.nama)] });
}
/* Pola ke berapa yang memerlukan X benda */
function soalPolaKeBerapa(p, n) {
  const { a, b } = rumusPola(p), X = p.f(n);
  return isian(`Perhatikan pola berikut. Pola ke berapa yang memerlukan tepat <b>${X} ${p.nama}</b>?`, n, { gambar: svgPola(p), petunjuk: `Mulai dari ${a}, setiap pola bertambah ${b}. Teruskan sampai ${X}.`,
    bahas: `${deret(a, y => y + b, n).join(", ")}. Bilangan ${X} ada pada pola ke-${n}.`,
    langkah: [...ajAturanPola(p), n <= 8 ? `Teruskan sampai ${X}: ${deret(a, y => y + b, n).join(", ")}. Bilangan ${X} ada di urutan ke-${n}.` : `Hitung mundur: ${X} − ${a} = ${X - a}, lalu ${X - a} : ${b} = ${n - 1} kali bertambah.`,
      `Pola 1 ditambah ${n - 1} kali menjadi pola ke-${n}. Cek: ${ajSubPola(p, n)} ✔`, `Jadi, yang memerlukan ${X} ${p.nama} adalah pola ke-<b>${n}</b>.`] });
}
/* Selisih dua pola */
function soalSelisihPola(p, A, B) {
  const { b } = rumusPola(p);
  return isian(`Perhatikan pola berikut. Selisih banyak ${p.nama} pada pola ke-${B} dan pola ke-${A} adalah …`, p.f(B) - p.f(A), { gambar: svgPola(p), satuan: p.nama,
    petunjuk: `Setiap naik satu pola bertambah ${b}. Dari pola ke-${A} ke pola ke-${B} naik ${B - A} kali.`, bahas: `${B - A} × ${b} = ${p.f(B) - p.f(A)}. (Cek: ${p.f(B)} − ${p.f(A)} = ${p.f(B) - p.f(A)}.)`,
    langkah: [...ajAturanPola(p), `Dari pola ke-${A} ke pola ke-${B} naik ${B} − ${A} = ${B - A} kali.`, `Selisihnya = ${B - A} × ${b} = ${p.f(B) - p.f(A)}. (Cek: pola ke-${B} = ${p.f(B)}, pola ke-${A} = ${p.f(A)}, ${p.f(B)} − ${p.f(A)} = ${p.f(B) - p.f(A)} ✔)`, ajJadi("selisihnya adalah", p.f(B) - p.f(A), p.nama)] });
}
/* Persediaan benda: pola terbesar yang bisa dibuat */
function soalPolaTerbesar(nMin, nMax) {
  const p = polaLinear(), { a, b } = rumusPola(p), n = acak(nMin, nMax), T = p.f(n) + acak(0, b - 1), x = nama();
  return isian(`Perhatikan pola berikut. ${x} mempunyai ${T} ${p.nama}. Ia ingin membuat <b>satu</b> pola sebesar mungkin dengan aturan yang sama. Pola terbesar yang dapat dibuat ${x} adalah pola ke- …`, n,
    { gambar: svgPola(p), petunjuk: "Cari pola yang banyaknya paling dekat, tetapi tidak lebih dari persediaan.", bahas: `Pola ke-${n} memerlukan ${p.f(n)} ${p.nama} (cukup), sedangkan pola ke-${n + 1} memerlukan ${p.f(n + 1)} ${p.nama} (tidak cukup). Jadi pola ke-${n}.`,
      langkah: [...ajAturanPola(p), `Perkirakan: (${T} − ${a}) : ${b} = ${Math.floor((T - a) / b)}${(T - a) % b ? ` sisa ${(T - a) % b}` : ""}. Jadi paling banyak ${n - 1} kali bertambah, yaitu pola ke-${n}.`,
        `Cek: pola ke-${n} perlu ${ajSubPola(p, n)} ${p.nama} (cukup). Pola ke-${n + 1} perlu ${p.f(n + 1)} ${p.nama}, lebih dari ${T} (tidak cukup).`, `Jadi, pola terbesar yang dapat dibuat adalah pola ke-<b>${n}</b>.`] });
}
/* Gabungan dua pola */
function soalGabungPola(p, A, B) {
  return isian(`Perhatikan pola berikut. ${nama()} membuat pola ke-${A} dan pola ke-${B}. Banyak ${p.nama} yang diperlukan untuk kedua pola itu adalah …`, p.f(A) + p.f(B), { gambar: svgPola(p), satuan: p.nama,
    petunjuk: "Hitung masing-masing pola dengan aturannya, lalu jumlahkan.", bahas: `Pola ke-${A} = ${p.f(A)}, pola ke-${B} = ${p.f(B)}. Jumlah = ${p.f(A) + p.f(B)} ${p.nama}.`,
    langkah: [...ajAturanPola(p), `Pola ke-${A} = ${ajSubPola(p, A)}. Pola ke-${B} = ${ajSubPola(p, B)}.`, `Jumlah = ${p.f(A)} + ${p.f(B)} = ${p.f(A) + p.f(B)}.`, ajJadi("banyak yang diperlukan untuk kedua pola adalah", p.f(A) + p.f(B), p.nama)] });
}
const teksRumusPola = (b, c) => (b === 1 ? "n" : `${b} × n`) + (c > 0 ? ` + ${c}` : c < 0 ? ` − ${-c}` : "");
daftarMisi("alj", "a2", "Pola gambar", "🔷", {
  1: [
    () => { const n = acak(4, 5); return soalPolaKe(pilih(POLA_MUDAH), n, {}, n === 5 ? pilih([1, 2]) : 1); },
    () => soalHitungGambar(pilih(POLA_MUDAH), acak(1, 2)),
    () => soalTambahPola(pilih(POLA_MUDAH.filter(p => p.jenis === "linear")), acak(1, 2)),
  ],
  2: [
    () => soalPolaKe(polaLinear(), acak(5, 6)), () => soalPolaKe(pilih([POLA.titikSegitiga, POLA.titikPersegiPanjang, POLA.tangga]), acak(4, 5)),
    () => soalHitungGambar(pilih([...POLA_MUDAH, POLA.titikSegitiga, POLA.titikPersegiPanjang, POLA.korekRumah]), acak(2, 3)),
    () => soalTambahPola(polaLinear(), acak(2, 4)),
  ],
  3: [
    () => soalPolaKe(polaLinear(), acak(6, 8)),
    () => { const A = acak(2, 5); return soalSelisihPola(polaLinear(), A, A + acak(2, 4)); },
    () => soalPolaKeBerapa(polaLinear(), acak(5, 8)),
  ],
  4: [() => soalPolaKe(polaLinear(), acak(7, 10)), () => soalPolaKe(polaKuadrat(), acak(5, 7)), () => soalPolaKeBerapa(polaLinear(), acak(7, 11))],
  5: [
    () => soalPolaKe(polaLinear(), acak(10, 12)),
    () => soalPolaKeBerapa(polaLinear(), acak(10, 15)),
    () => { const A = acak(5, 10); return soalSelisihPola(polaLinear(), A, A + acak(3, 8)); },
  ],
  6: [
    () => soalPolaKe(polaLinear(), acak(13, 20)),
    () => soalPolaKeBerapa(polaLinear(), acak(12, 20)),
    () => { const A = acak(6, 12); return soalSelisihPola(polaLinear(), A, A + acak(4, 9)); },
    () => soalPolaKe(polaKuadrat(), acak(6, 9)),
  ],
  7: [
    () => soalPolaKe(polaKuadrat(), acak(8, 20)),
    /* Rumus pola ke-n */
    () => { const p = polaLinear(), { a, b } = rumusPola(p), c = a - b, benar = teksRumusPola(b, c);
      const salah = [teksRumusPola(a, 0), teksRumusPola(b + 1, c - 1), teksRumusPola(1, a - 1), teksRumusPola(b, c + 1), teksRumusPola(b, c - 1)].filter(t => t !== benar);
      return pg(`Perhatikan pola berikut. Jika n menyatakan nomor pola, banyak ${p.nama} pada pola ke-n dapat dihitung dengan rumus …`, benar, kocok(salah),
        { gambar: svgPola(p), petunjuk: "Uji rumus pada pola 1, pola 2, <b>dan</b> pola 3. Rumus yang benar cocok untuk semuanya.", bahas: `Setiap pola bertambah ${b}, jadi ada "${b} × n". Pola 1: ${b} × 1 = ${b}, padahal banyaknya ${a}, maka ${c > 0 ? `ditambah ${c}` : c < 0 ? `dikurangi ${-c}` : "tidak perlu ditambah apa-apa"}. Rumusnya ${benar}. Cek pola 3: ${b} × 3${c > 0 ? ` + ${c}` : c < 0 ? ` − ${-c}` : ""} = ${p.f(3)}.`,
          langkah: [ajHitungPola(p), `Setiap pola bertambah ${b}, jadi rumusnya memuat "<b>${b} × n</b>".`, `Pola 1: ${b} × 1 = ${b}, padahal banyaknya ${a}. Maka ${c > 0 ? `perlu ditambah ${c}` : c < 0 ? `perlu dikurangi ${-c}` : "tidak perlu ditambah apa-apa"}.`,
            `Cek pola 2 dan pola 3: ${teksRumusPola(b, c).replace("n", "2")} = ${p.f(2)} ✔, ${teksRumusPola(b, c).replace("n", "3")} = ${p.f(3)} ✔`, ajJadi("rumusnya adalah", benar)] }); },
    /* Benar-salah tentang pola gambar */
    () => { const p = polaLinear(), { a, b } = rumusPola(p), c = a - b, k1 = acak(4, 6), k2 = acak(10, 20), k3 = acak(3, 6), nm = p.nama;
      const b1 = ya(), v1 = b1 ? p.f(k1) : p.f(k1) + pilih([b, -b]);
      const b2 = ya(), v2 = b2 ? b : b + pilih([1, -1]);
      const b3 = ya(), v3 = b3 ? p.f(k2) : p.f(k2) + pilih([b, -b, 1]);
      const butir = [
        { t: `Pola ke-${k1} terdiri atas ${v1} ${nm}.`, b: b1 },
        { t: `Setiap naik satu pola, banyak ${nm} bertambah ${v2}.`, b: b2 },
        { t: `Pola ke-${k2} memerlukan ${v3} ${nm}.`, b: b3 },
        { t: `Banyak ${nm} pada pola ke-${2 * k3} sama dengan dua kali banyak ${nm} pada pola ke-${k3}.`, b: c === 0 },
      ];
      const alasan = [
        `pola ke-${k1} = ${ajSubPola(p, k1)}${b1 ? "" : `, bukan ${v1}`}`,
        `${p.f(2)} − ${p.f(1)} = ${b}${b2 ? "" : `, bukan ${v2}`}`,
        `pola ke-${k2} = ${ajSubPola(p, k2)}${b3 ? "" : `, bukan ${v3}`}`,
        `pola ke-${2 * k3} = ${p.f(2 * k3)}, sedangkan 2 × pola ke-${k3} = 2 × ${p.f(k3)} = ${2 * p.f(k3)}${c === 0 ? " (sama)" : " (tidak sama)"}`,
      ];
      const s = bs(`Perhatikan pola berikut. Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan.`, butir, { gambar: svgPola(p), petunjuk: `Tulis dulu banyak ${nm} pada pola 1, 2, 3, lalu cari aturannya.`, bahas: `Polanya ${p.f(1)}, ${p.f(2)}, ${p.f(3)}, … bertambah ${b}; rumusnya ${teksRumusPola(b, c)}. Pola ke-${k1} = ${p.f(k1)}, pola ke-${k2} = ${p.f(k2)}. Pola ke-${2 * k3} = ${p.f(2 * k3)}, sedangkan 2 × pola ke-${k3} = ${2 * p.f(k3)}${c === 0 ? " (sama)" : " (tidak sama)"}.` });
      s.langkah = [ajHitungPola(p), `Setiap naik satu pola bertambah ${b}. Pola ke-n = ${a} + (n − 1) × ${b}.`,
        ...s.pernyataan.map((t, i) => { const j = butir.findIndex(x => x.t === t); return `${s.kunci[i] ? "✔" : "✘"} “${t}” <b>${s.kunci[i] ? "Benar" : "Salah"}</b>, karena ${alasan[j]}.`; })];
      return s; },
    /* Persediaan benda: pola terbesar yang bisa dibuat */
    () => soalPolaTerbesar(6, 15),
  ],
  8: [
    () => { const n = acak(12, 30), x = pilih(["perpustakaan", "kantin", "aula", "ruang kelas"]); return isian(`Meja-meja di ${x} disusun berjajar seperti gambar. Satu meja untuk 4 kursi, dua meja yang disambung untuk 6 kursi, dan seterusnya. Jika ada <b>${n} meja</b> yang disambung, banyak kursi yang dapat ditempatkan adalah …`, 2 * n + 2,
      { gambar: svgPola(POLA.meja), satuan: "kursi", petunjuk: "Setiap meja punya 2 kursi (atas dan bawah), ditambah 2 kursi di ujung.", bahas: `2 × ${n} + 2 = ${2 * n + 2} kursi.`,
        langkah: ["Hitung kursi pada gambar: 1 meja = 4, 2 meja = 6, 3 meja = 8. Setiap tambah 1 meja, kursi bertambah 2.", "Setiap meja punya 2 kursi (atas dan bawah), ditambah 2 kursi di kedua ujung. Rumusnya: 2 × banyak meja + 2.", `${n} meja: 2 × ${n} + 2 = ${2 * n} + 2 = ${2 * n + 2}.`, ajJadi(`banyak kursi untuk ${n} meja adalah`, 2 * n + 2, "kursi")] }); },
    () => soalPolaKe(polaLinear(), acak(25, 50)),
    () => soalPolaKeBerapa(polaLinear(), acak(16, 30)),
    () => { const A = acak(10, 20); return soalSelisihPola(polaLinear(), A, A + acak(8, 15)); },
    () => { const A = acak(5, 12); return soalGabungPola(polaLinear(), A, A + acak(3, 10)); },
  ],
  9: [
    () => { const p = polaLinear(), n = acak(15, 40), { a, b } = rumusPola(p), X = p.f(n);
      return isian(`Perhatikan pola berikut. Pola ke berapa yang memerlukan tepat <b>${X} ${p.nama}</b>?`, n, { gambar: svgPola(p), petunjuk: `Rumusnya: ${a} + (n − 1) × ${b}.`, bahas: `${a} + (n − 1) × ${b} = ${X} → n − 1 = ${(X - a) / b} → n = ${n}.`,
        langkah: [...ajAturanPola(p), `Rumusnya: pola ke-n = ${a} + (n − 1) × ${b}. Jadi ${a} + (n − 1) × ${b} = ${X}.`, `Kurangi ${a}: (n − 1) × ${b} = ${X} − ${a} = ${X - a}. Bagi ${b}: n − 1 = ${X - a} : ${b} = ${n - 1}, jadi n = ${n}.`, `Jadi, yang memerlukan ${X} ${p.nama} adalah pola ke-<b>${n}</b>.`] }); },
    () => { const p = polaLinear(), A = acak(8, 15), B = A + acak(5, 12), { b } = rumusPola(p); return isian(`Perhatikan pola berikut. Selisih banyak ${p.nama} pada pola ke-${B} dan pola ke-${A} adalah …`, p.f(B) - p.f(A), { gambar: svgPola(p), petunjuk: "Setiap naik satu pola, bertambah tetap.", bahas: `${p.f(B)} − ${p.f(A)} = ${p.f(B) - p.f(A)}.`,
      langkah: [...ajAturanPola(p), `Dari pola ke-${A} ke pola ke-${B} naik ${B} − ${A} = ${B - A} kali.`, `Selisihnya = ${B - A} × ${b} = ${p.f(B) - p.f(A)}. (Cek: ${p.f(B)} − ${p.f(A)} = ${p.f(B) - p.f(A)} ✔)`, ajJadi("selisihnya adalah", p.f(B) - p.f(A))] }); },
    () => soalPolaKe(polaKuadrat(), acak(10, 15)),
    () => soalPolaTerbesar(15, 30),
    () => { const A = acak(10, 20); return soalGabungPola(polaLinear(), A, A + acak(5, 15)); },
  ],
  10: [
    () => { const p = polaLinear(), n = acak(6, 15); let t = 0; for (let i = 1; i <= n; i++) t += p.f(i);
      return isian(`Perhatikan pola berikut. ${nama()} membuat pola ke-1 sampai pola ke-${n} sekaligus. Jumlah ${p.nama} yang diperlukan seluruhnya adalah …`, t, { gambar: svgPola(p), satuan: p.nama, petunjuk: "Pasangkan pola pertama dan terakhir: jumlahnya selalu sama.", bahas: `Pola ke-1 = ${p.f(1)}, pola ke-${n} = ${p.f(n)}. Jumlah = ${n} × (${p.f(1)} + ${p.f(n)}) : 2 = ${t}.`,
        langkah: [...ajAturanPola(p), `Pola ke-${n} = ${ajSubPola(p, n)}. Pasangkan pola pertama dan terakhir: ${p.f(1)} + ${p.f(n)} = ${p.f(1) + p.f(n)}. Pasangan lain (pola 2 + pola ${n - 1}, …) jumlahnya juga ${p.f(1) + p.f(n)}.`, `Jumlah = ${n} × ${p.f(1) + p.f(n)} : 2 = ${fmt(n * (p.f(1) + p.f(n)))} : 2 = ${fmt(t)}.`, ajJadi(`jumlah ${p.nama} seluruhnya adalah`, t, p.nama)] }); },
    () => { const p = pilih([POLA.titikPersegi, POLA.titikSegitiga, POLA.titikPersegiPanjang, POLA.tangga]), n = acak(8, 20), X = p.f(n);
      const cari = p === POLA.titikPersegi ? `Cari bilangan yang dikali dirinya sendiri hasilnya ${X}: ${n} × ${n} = ${X}.`
        : p === POLA.titikPersegiPanjang ? `Cari dua bilangan berurutan yang hasil kalinya ${X}: ${n} × ${n + 1} = ${X}.`
          : `Kalikan ${X} dengan 2: ${X} × 2 = ${2 * X}. Cari dua bilangan berurutan yang hasil kalinya ${2 * X}: ${n} × ${n + 1} = ${2 * X}.`;
      return isian(`Perhatikan pola berikut. Pola ke berapa yang tersusun dari <b>${X} ${p.nama}</b>?`, n, { gambar: svgPola(p), bahas: `Pola ke-${n} = ${X}.`,
        langkah: [ajHitungPola(p), p.alasan, cari, `Cek: pola ke-${n} = ${ajSubPola(p, n)} ✔`, `Jadi, ${X} ${p.nama} tersusun pada pola ke-<b>${n}</b>.`] }); },
  ],
});

/* ================= Misi 3: Angka yang hilang ================= */
const KOTAK = "<b class=\"kotak-isi\">□</b>";
/* Timbangan seimbang: kiri/kanan berisi larik benda { t: label, kotak?: true } */
function svgTimbang(kiri, kanan) {
  const W = 360, H = 130, lebar = b => (b.kotak ? 26 : 46);
  let s = svgBuka(W, H, "timbangan seimbang");
  s += `<polygon points="165,124 195,124 180,92" class="bangun"/><rect x="20" y="86" width="320" height="7" rx="3" class="meja"/>`;
  [[kiri, 90], [kanan, 270]].forEach(([isi, cx]) => {
    s += `<rect x="${cx - 80}" y="76" width="160" height="6" rx="3" class="meja"/><line x1="${cx}" y1="82" x2="${cx}" y2="86" stroke="currentColor" stroke-width="3"/>`;
    const tot = isi.reduce((j, b) => j + lebar(b) + 4, -4); let x = cx - tot / 2;
    isi.forEach(b => { const w = lebar(b), h = b.kotak ? 26 : 30;
      s += `<rect x="${x}" y="${76 - h}" width="${w}" height="${h}" rx="4" class="${b.kotak ? "isi" : "kosong"}"/>` + svgT(x + w / 2, 76 - h / 2 + 4, b.t, 'text-anchor="middle" class="mini"'); x += w + 4; });
  });
  return s + svgT(90, 112, "kiri", 'text-anchor="middle" class="kecil"') + svgT(270, 112, "kanan", 'text-anchor="middle" class="kecil"') + "</svg>";
}
/* Langkah "□ + a = s" → □ = s − a, dengan cek */
const ajKurangkan = (kalimat, s, a, x, tanya = "nilai □ adalah", sat) => [`${kalimat} Lawan dari tambah adalah kurang.`, `□ = ${fmt(s)} − ${fmt(a)} = ${fmt(x)}.`, ajCek(`${fmt(x)} + ${fmt(a)}`, s), ajJadi(tanya, x, sat)];
daftarMisi("alj", "a3", "Mencari angka yang hilang", "❓", {
  1: [
    () => { const x = acak(2, 30), a = acak(2, 30); return isian(`${KOTAK} + ${a} = ${x + a}<br>Nilai □ adalah …`, x, { petunjuk: "Bilangan berapa yang ditambah ini hasilnya itu?", bahas: `□ = ${x + a} − ${a} = ${x}.`, langkah: ajKurangkan(`Kalimatnya: □ + ${a} = ${x + a}.`, x + a, a, x) }); },
    () => { const x = acak(2, 30), a = acak(2, 30); return isian(`${a} + ${KOTAK} = ${x + a}<br>Nilai □ adalah …`, x, { bahas: `□ = ${x + a} − ${a} = ${x}.`, langkah: ajKurangkan(`Kalimatnya: ${a} + □ = ${x + a}.`, x + a, a, x) }); },
    /* Aku memikirkan sebuah bilangan */
    () => { const x = acak(2, 30), a = acak(2, 20); return isian(`Aku memikirkan sebuah bilangan. Jika bilangan itu ditambah ${a}, hasilnya ${x + a}. Bilangan yang kupikirkan adalah …`, x, { petunjuk: "Kerjakan mundur: kurangi hasilnya.", bahas: `${x + a} − ${a} = ${x}.`,
      langkah: ajKurangkan(`Tulis sebagai kalimat matematika: □ + ${a} = ${x + a}.`, x + a, a, x, "bilangan yang kupikirkan adalah") }); },
    /* Timbangan */
    () => { const x = acak(2, 20), a = acak(1, 15);
      return isian(`Timbangan pada gambar seimbang. Piring kiri berisi sebuah kotak dan beban ${a} kg. Piring kanan berisi beban ${x + a} kg. Berat kotak adalah …`, x, { satuan: "kg", gambar: svgTimbang([{ t: "?", kotak: true }, { t: `${a} kg` }], [{ t: `${x + a} kg` }]),
        petunjuk: "Seimbang berarti berat kiri sama dengan berat kanan.", bahas: `□ + ${a} = ${x + a}, jadi □ = ${x + a} − ${a} = ${x} kg.`,
        langkah: ajKurangkan(`Seimbang berarti kiri = kanan: □ + ${a} = ${x + a}.`, x + a, a, x, "berat kotak adalah", "kg") }); },
    /* Hasil penjumlahan yang hilang */
    () => { const a = acak(2, 30), b = acak(2, 30); return isian(`${a} + ${b} = ${KOTAK}<br>Nilai □ adalah …`, a + b, { bahas: `${a} + ${b} = ${a + b}.`,
      langkah: [`□ ada di hasil, jadi cukup jumlahkan kedua bilangan.`, `${a} + ${b} = ${a + b}.`, ajJadi("nilai □ adalah", a + b)] }); },
    /* Cerita: diberi */
    () => { const x = nama(), a = acak(3, 20), t = acak(2, 15), b = pilih(["kelereng", "stiker", "permen", "kartu"]);
      return isian(`${x} punya ${a} ${b}. Setelah diberi kakaknya, ${b} ${x} menjadi ${a + t}. Banyak ${b} yang diberikan kakak adalah …`, t, { satuan: b, petunjuk: `${a} + □ = ${a + t}.`, bahas: `${a + t} − ${a} = ${t} ${b}.`,
        langkah: ajKurangkan(`Kalimatnya: ${a} + □ = ${a + t}.`, a + t, a, t, `banyak ${b} yang diberikan kakak adalah`, b) }); },
  ],
  2: [
    () => { const a = acak(30, 99), x = acak(2, a - 5); return isian(`${a} − ${KOTAK} = ${a - x}<br>Nilai □ adalah …`, x, { bahas: `□ = ${a} − ${a - x} = ${x}.`,
      langkah: [`Kalimatnya: ${a} − □ = ${a - x}. Bilangan yang dikurangkan = bilangan awal − hasil.`, `□ = ${a} − ${a - x} = ${x}.`, ajCek(`${a} − ${x}`, a - x), ajJadi("nilai □ adalah", x)] }); },
    () => { const x = acak(20, 90), a = acak(2, x - 5); return isian(`${KOTAK} − ${a} = ${x - a}<br>Nilai □ adalah …`, x, { bahas: `□ = ${x - a} + ${a} = ${x}.`,
      langkah: [`Kalimatnya: □ − ${a} = ${x - a}. Lawan dari kurang adalah tambah.`, `□ = ${x - a} + ${a} = ${x}.`, ajCek(`${x} − ${a}`, x - a), ajJadi("nilai □ adalah", x)] }); },
    /* Aku memikirkan sebuah bilangan */
    () => { const a = acak(5, 30), y = acak(5, 60); return isian(`Aku memikirkan sebuah bilangan. Jika bilangan itu dikurangi ${a}, hasilnya ${y}. Bilangan yang kupikirkan adalah …`, y + a, { petunjuk: "Kerjakan mundur: tambahkan.", bahas: `${y} + ${a} = ${y + a}.`,
      langkah: [`Tulis sebagai kalimat matematika: □ − ${a} = ${y}.`, `Kerjakan mundur, lawan dari kurang adalah tambah: □ = ${y} + ${a} = ${y + a}.`, ajCek(`${y + a} − ${a}`, y), ajJadi("bilangan yang kupikirkan adalah", y + a)] }); },
    /* Ruas kiri dan kanan ditukar */
    () => { const x = acak(10, 60), a = acak(5, 40); return ya()
      ? isian(`${x + a} = ${KOTAK} + ${a}<br>Nilai □ adalah …`, x, { petunjuk: "Tanda = berarti kedua ruas sama nilainya.", bahas: `□ = ${x + a} − ${a} = ${x}.`,
        langkah: ajKurangkan(`Tanda = berarti kedua ruas sama, jadi bisa dibaca □ + ${a} = ${x + a}.`, x + a, a, x) })
      : isian(`${x} = ${KOTAK} − ${a}<br>Nilai □ adalah …`, x + a, { petunjuk: "Tanda = berarti kedua ruas sama nilainya.", bahas: `□ = ${x} + ${a} = ${x + a}.`,
        langkah: [`Tanda = berarti kedua ruas sama, jadi bisa dibaca □ − ${a} = ${x}. Lawan dari kurang adalah tambah.`, `□ = ${x} + ${a} = ${x + a}.`, ajCek(`${x + a} − ${a}`, x), ajJadi("nilai □ adalah", x + a)] }); },
    /* Cerita: memberi, sisa */
    () => { const x = nama(), a = acak(20, 60), s = acak(5, a - 5), b = pilih(["kelereng", "stiker", "permen", "jeruk"]);
      return isian(`${x} punya ${a} ${b}. Sebagian diberikan kepada adiknya sehingga tinggal ${s} ${b}. Banyak ${b} yang diberikan adalah …`, a - s, { satuan: b, petunjuk: `${a} − □ = ${s}.`, bahas: `${a} − ${s} = ${a - s} ${b}.`,
        langkah: [`Kalimatnya: ${a} − □ = ${s}.`, `□ = ${a} − ${s} = ${a - s}.`, ajCek(`${a} − ${a - s}`, s), ajJadi(`banyak ${b} yang diberikan adalah`, a - s, b)] }); },
    /* Timbangan, dua beban di kanan */
    () => { const b = acak(2, 15), c = acak(2, 15), a = acak(1, b + c - 1), x = b + c - a;
      return isian(`Timbangan pada gambar seimbang. Piring kiri berisi sebuah kotak dan beban ${a} kg. Piring kanan berisi beban ${b} kg dan ${c} kg. Berat kotak adalah …`, x, { satuan: "kg", gambar: svgTimbang([{ t: "?", kotak: true }, { t: `${a} kg` }], [{ t: `${b} kg` }, { t: `${c} kg` }]),
        petunjuk: "Hitung dulu berat piring kanan.", bahas: `Kanan = ${b} + ${c} = ${b + c} kg. □ = ${b + c} − ${a} = ${x} kg.`,
        langkah: [`Hitung dulu piring kanan: ${b} + ${c} = ${b + c} kg.`, `Seimbang berarti kiri = kanan: □ + ${a} = ${b + c}.`, `□ = ${b + c} − ${a} = ${x}.`, ajCek(`${x} + ${a}`, b + c), ajJadi("berat kotak adalah", x, "kg")] }); },
  ],
  3: [
    () => { const a = acak(2, 12), x = acak(2, 12); return isian(`${a} × ${KOTAK} = ${a * x}<br>Nilai □ adalah …`, x, { petunjuk: "Gunakan pembagian.", bahas: `□ = ${a * x} : ${a} = ${x}.`,
      langkah: [`Kalimatnya: ${a} × □ = ${a * x}. Lawan dari kali adalah bagi.`, `□ = ${a * x} : ${a} = ${x}.`, ajCek(`${a} × ${x}`, a * x), ajJadi("nilai □ adalah", x)] }); },
    () => { const a = acak(2, 9), q = acak(2, 12); return isian(`${KOTAK} : ${a} = ${q}<br>Nilai □ adalah …`, a * q, { petunjuk: "Gunakan perkalian.", bahas: `□ = ${q} × ${a} = ${a * q}.`,
      langkah: [`Kalimatnya: □ : ${a} = ${q}. Lawan dari bagi adalah kali.`, `□ = ${q} × ${a} = ${a * q}.`, ajCek(`${a * q} : ${a}`, q), ajJadi("nilai □ adalah", a * q)] }); },
    /* □ di posisi lain */
    () => { const a = acak(2, 9), x = acak(2, 12); return ya()
      ? isian(`${KOTAK} × ${a} = ${a * x}<br>Nilai □ adalah …`, x, { petunjuk: "Gunakan pembagian.", bahas: `□ = ${a * x} : ${a} = ${x}.`,
        langkah: [`Kalimatnya: □ × ${a} = ${a * x}. Lawan dari kali adalah bagi.`, `□ = ${a * x} : ${a} = ${x}.`, ajCek(`${x} × ${a}`, a * x), ajJadi("nilai □ adalah", x)] })
      : isian(`${a * x} : ${KOTAK} = ${a}<br>Nilai □ adalah …`, x, { petunjuk: `${a * x} dibagi bilangan berapa hasilnya ${a}?`, bahas: `□ = ${a * x} : ${a} = ${x}.`,
        langkah: [`${a * x} dibagi □ hasilnya ${a}. Artinya ${a} × □ = ${a * x}.`, `□ = ${a * x} : ${a} = ${x}.`, ajCek(`${a * x} : ${x}`, a), ajJadi("nilai □ adalah", x)] }); },
    /* Aku memikirkan sebuah bilangan */
    () => { const a = acak(2, 9), x = acak(2, 12); return ya()
      ? isian(`Aku memikirkan sebuah bilangan. Jika bilangan itu dikali ${a}, hasilnya ${a * x}. Bilangan yang kupikirkan adalah …`, x, { petunjuk: "Kerjakan mundur: bagi.", bahas: `${a * x} : ${a} = ${x}.`,
        langkah: [`Tulis sebagai kalimat matematika: □ × ${a} = ${a * x}.`, `Kerjakan mundur, lawan dari kali adalah bagi: □ = ${a * x} : ${a} = ${x}.`, ajCek(`${x} × ${a}`, a * x), ajJadi("bilangan yang kupikirkan adalah", x)] })
      : isian(`Aku memikirkan sebuah bilangan. Jika bilangan itu dibagi ${a}, hasilnya ${x}. Bilangan yang kupikirkan adalah …`, a * x, { petunjuk: "Kerjakan mundur: kalikan.", bahas: `${x} × ${a} = ${a * x}.`,
        langkah: [`Tulis sebagai kalimat matematika: □ : ${a} = ${x}.`, `Kerjakan mundur, lawan dari bagi adalah kali: □ = ${x} × ${a} = ${a * x}.`, ajCek(`${a * x} : ${a}`, x), ajJadi("bilangan yang kupikirkan adalah", a * x)] }); },
    /* Cerita: wadah berisi sama banyak */
    () => { const b = pilih([["kotak", "pensil"], ["keranjang", "jeruk"], ["plastik", "kue"], ["rak", "buku"]]), a = acak(3, 10), n = acak(2, 9);
      return isian(`Setiap ${b[0]} berisi ${a} ${b[1]}. Seluruhnya ada ${a * n} ${b[1]}. Banyak ${b[0]} adalah …`, n, { satuan: b[0], petunjuk: `□ × ${a} = ${a * n}.`, bahas: `${a * n} : ${a} = ${n} ${b[0]}.`,
        langkah: [`Banyak ${b[0]} × isi setiap ${b[0]} = seluruhnya, jadi □ × ${a} = ${a * n}.`, `□ = ${a * n} : ${a} = ${n}.`, ajCek(`${n} × ${a}`, a * n), ajJadi(`banyak ${b[0]} adalah`, n, b[0])] }); },
    /* Mesin ajaib (tabel masuk–keluar) */
    () => { const k = acak(2, 9), [m1, m2, x] = ambil([2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
      return isian(`Mesin ajaib mengubah setiap bilangan dengan aturan yang sama.<br>Masuk ${m1} → keluar ${k * m1}<br>Masuk ${m2} → keluar ${k * m2}<br>Masuk ${KOTAK} → keluar ${k * x}<br>Nilai □ adalah …`, x, { petunjuk: "Cari aturannya: bilangan masuk dikali berapa?", bahas: `Aturannya dikali ${k}. □ × ${k} = ${k * x}, jadi □ = ${x}.`,
        langkah: [`Cari aturannya: ${k * m1} : ${m1} = ${k} dan ${k * m2} : ${m2} = ${k}. Aturannya <b>dikali ${k}</b>.`, `Jadi □ × ${k} = ${k * x}. Kerjakan mundur: □ = ${k * x} : ${k} = ${x}.`, ajCek(`${x} × ${k}`, k * x), ajJadi("nilai □ adalah", x)] }); },
  ],
  4: [
    () => { const a = acak(2, 9), x = acak(2, 15), b = acak(1, 30); return isian(`${a} × ${KOTAK} + ${b} = ${a * x + b}<br>Nilai □ adalah …`, x, { petunjuk: "Kurangi dulu, lalu bagi.", bahas: `${a * x + b} − ${b} = ${a * x}. ${a * x} : ${a} = ${x}.`,
      langkah: [`Kerjakan mundur, mulai dari operasi terakhir (+ ${b}).`, `Kurangi: ${a * x + b} − ${b} = ${a * x}. Jadi ${a} × □ = ${a * x}.`, `Bagi: □ = ${a * x} : ${a} = ${x}.`, ajCek(`${a} × ${x} + ${b} = ${a * x} + ${b}`, a * x + b), ajJadi("nilai □ adalah", x)] }); },
    () => { const a = acak(2, 9), x = acak(3, 15), b = acak(1, a * x - 1); return isian(`${a} × ${KOTAK} − ${b} = ${a * x - b}<br>Nilai □ adalah …`, x, { bahas: `${a * x - b} + ${b} = ${a * x}. ${a * x} : ${a} = ${x}.`,
      langkah: [`Kerjakan mundur, mulai dari operasi terakhir (− ${b}).`, `Tambah: ${a * x - b} + ${b} = ${a * x}. Jadi ${a} × □ = ${a * x}.`, `Bagi: □ = ${a * x} : ${a} = ${x}.`, ajCek(`${a} × ${x} − ${b} = ${a * x} − ${b}`, a * x - b), ajJadi("nilai □ adalah", x)] }); },
    /* Aku memikirkan sebuah bilangan (dua langkah) */
    () => { const a = acak(2, 9), x = acak(2, 15), b = acak(1, 30);
      return isian(`Aku memikirkan sebuah bilangan. Bilangan itu kukali ${a}, lalu kutambah ${b}. Hasilnya ${a * x + b}. Bilangan yang kupikirkan adalah …`, x, { petunjuk: "Kerjakan mundur: kurangi dulu, lalu bagi.", bahas: `${a * x + b} − ${b} = ${a * x}. ${a * x} : ${a} = ${x}.`,
        langkah: [`Kalimatnya: □ × ${a} + ${b} = ${a * x + b}. Kerjakan mundur dari belakang.`, `Batalkan "+ ${b}": ${a * x + b} − ${b} = ${a * x}.`, `Batalkan "× ${a}": ${a * x} : ${a} = ${x}.`, ajCek(`${x} × ${a} + ${b}`, a * x + b), ajJadi("bilangan yang kupikirkan adalah", x)] }); },
    /* Dibagi lalu ditambah */
    () => { const a = acak(2, 9), q = acak(2, 12), b = acak(1, 30);
      return isian(`${KOTAK} : ${a} + ${b} = ${q + b}<br>Nilai □ adalah …`, a * q, { petunjuk: "Kurangi dulu, lalu kalikan.", bahas: `${q + b} − ${b} = ${q}. □ = ${q} × ${a} = ${a * q}.`,
        langkah: [`Kerjakan mundur. Kurangi: ${q + b} − ${b} = ${q}. Jadi □ : ${a} = ${q}.`, `Lawan dari bagi adalah kali: □ = ${q} × ${a} = ${a * q}.`, ajCek(`${a * q} : ${a} + ${b} = ${q} + ${b}`, q + b), ajJadi("nilai □ adalah", a * q)] }); },
    /* Penjumlahan di depan */
    () => { const a = acak(2, 9), x = acak(2, 12), b = acak(5, 40);
      return isian(`${b} + ${a} × ${KOTAK} = ${b + a * x}<br>Nilai □ adalah …`, x, { petunjuk: "Perkalian dikerjakan lebih dulu. Jadi kurangi dulu, lalu bagi.", bahas: `${b + a * x} − ${b} = ${a * x}. ${a * x} : ${a} = ${x}.`,
        langkah: [`Perkalian dikerjakan lebih dulu, jadi ${a} × □ adalah satu bagian: ${b} + (${a} × □) = ${b + a * x}.`, `Kurangi: ${b + a * x} − ${b} = ${a * x}. Jadi ${a} × □ = ${a * x}.`, `Bagi: □ = ${a * x} : ${a} = ${x}.`, ajCek(`${b} + ${a} × ${x} = ${b} + ${a * x}`, b + a * x), ajJadi("nilai □ adalah", x)] }); },
    /* Timbangan, beberapa kotak sama berat */
    () => { const n = acak(2, 4), x = acak(2, 9), a = acak(1, 10);
      return isian(`Timbangan pada gambar seimbang. Piring kiri berisi ${n} kotak yang sama berat dan beban ${a} kg. Piring kanan berisi beban ${n * x + a} kg. Berat 1 kotak adalah …`, x, { satuan: "kg",
        gambar: svgTimbang([...Array.from({ length: n }, () => ({ t: "?", kotak: true })), { t: `${a} kg` }], [{ t: `${n * x + a} kg` }]),
        petunjuk: `Ambil beban ${a} kg dari kedua piring. Sisanya ${n} kotak.`, bahas: `${n} × □ + ${a} = ${n * x + a}. ${n * x + a} − ${a} = ${n * x}. ${n * x} : ${n} = ${x} kg.`,
        langkah: [`Seimbang berarti kiri = kanan: ${n} × □ + ${a} = ${n * x + a}.`, `Ambil beban ${a} kg dari kedua piring: ${n * x + a} − ${a} = ${n * x}. Jadi ${n} kotak beratnya ${n * x} kg.`, `Berat 1 kotak = ${n * x} : ${n} = ${x} kg.`, ajCek(`${n} × ${x} + ${a}`, n * x + a), ajJadi("berat 1 kotak adalah", x, "kg")] }); },
    /* Cerita: beberapa wadah, lalu sebagian diberikan */
    () => { const y = nama(), b = pilih([["kantong", "kelereng"], ["bungkus", "permen"], ["pak", "stiker"]]), a = acak(4, 10), n = acak(2, 8), t = acak(1, a * n - 1);
      return isian(`${y} punya beberapa ${b[0]} ${b[1]}. Setiap ${b[0]} berisi ${a} ${b[1]}. Setelah memberikan ${t} ${b[1]} kepada temannya, ${b[1]} ${y} tinggal ${a * n - t}. Banyak ${b[0]} ${b[1]} ${y} mula-mula adalah …`, n,
        { satuan: b[0], petunjuk: `□ × ${a} − ${t} = ${a * n - t}. Tambah dulu, lalu bagi.`, bahas: `${a * n - t} + ${t} = ${a * n}. ${a * n} : ${a} = ${n} ${b[0]}.`,
          langkah: [`Kalimatnya: □ × ${a} − ${t} = ${a * n - t}.`, `Kembalikan yang diberikan: ${a * n - t} + ${t} = ${a * n} ${b[1]} mula-mula.`, `Bagi isi setiap ${b[0]}: ${a * n} : ${a} = ${n}.`, ajJadi(`banyak ${b[0]} mula-mula adalah`, n, b[0])] }); },
  ],
  5: [
    () => { const x = acak(2, 20), a = acak(2, 20), b = acak(2, 8); return isian(`(${KOTAK} + ${a}) × ${b} = ${(x + a) * b}<br>Nilai □ adalah …`, x, { bahas: `${(x + a) * b} : ${b} = ${x + a}. ${x + a} − ${a} = ${x}.`,
      langkah: [`Kerjakan mundur. Batalkan "× ${b}" dulu: ${(x + a) * b} : ${b} = ${x + a}. Jadi □ + ${a} = ${x + a}.`, `Batalkan "+ ${a}": □ = ${x + a} − ${a} = ${x}.`, ajCek(`(${x} + ${a}) × ${b} = ${x + a} × ${b}`, (x + a) * b), ajJadi("nilai □ adalah", x)] }); },
    () => { const b = acak(2, 8), q = acak(3, 12), a = acak(2, 20), x = b * q + a; return isian(`(${KOTAK} − ${a}) : ${b} = ${q}<br>Nilai □ adalah …`, x, { bahas: `${q} × ${b} = ${b * q}. ${b * q} + ${a} = ${x}.`,
      langkah: [`Kerjakan mundur. Batalkan ": ${b}" dulu: ${q} × ${b} = ${b * q}. Jadi □ − ${a} = ${b * q}.`, `Batalkan "− ${a}": □ = ${b * q} + ${a} = ${x}.`, ajCek(`(${x} − ${a}) : ${b} = ${b * q} : ${b}`, q), ajJadi("nilai □ adalah", x)] }); },
    /* Mesin ajaib dua langkah */
    () => { const k = acak(2, 6), c = acak(1, 9), x = acak(5, 12), f = v => k * v + c;
      return isian(`Mesin ajaib mengubah setiap bilangan dengan aturan yang sama.<br>Masuk 1 → keluar ${f(1)}<br>Masuk 2 → keluar ${f(2)}<br>Masuk 3 → keluar ${f(3)}<br>Masuk ${KOTAK} → keluar ${f(x)}<br>Nilai □ adalah …`, x,
        { petunjuk: `Bilangan keluar bertambah ${k} setiap bilangan masuk bertambah 1. Coba aturan "dikali ${k}, lalu ditambah …".`, bahas: `Aturannya dikali ${k} lalu ditambah ${c}. ${f(x)} − ${c} = ${k * x}. ${k * x} : ${k} = ${x}.`,
          langkah: [`Bilangan keluar ${f(1)} → ${f(2)} → ${f(3)} selalu bertambah ${k}, jadi aturannya "dikali ${k}, lalu ditambah …".`, `Masuk 1: 1 × ${k} = ${k}. Supaya keluar ${f(1)}, perlu ditambah ${c}. Aturannya: <b>dikali ${k}, lalu ditambah ${c}</b>.`, `Kerjakan mundur: ${f(x)} − ${c} = ${k * x}, lalu ${k * x} : ${k} = ${x}.`, ajCek(`${x} × ${k} + ${c}`, f(x)), ajJadi("nilai □ adalah", x)] }); },
    /* Aku memikirkan sebuah bilangan: kurangi lalu kali */
    () => { const a = acak(2, 15), x = a + acak(2, 15), b = acak(2, 6);
      return isian(`Aku memikirkan sebuah bilangan. Bilangan itu kukurangi ${a}, lalu hasilnya kukali ${b}. Hasil akhirnya ${(x - a) * b}. Bilangan yang kupikirkan adalah …`, x, { petunjuk: "Kerjakan mundur: bagi dulu, lalu tambah.", bahas: `${(x - a) * b} : ${b} = ${x - a}. ${x - a} + ${a} = ${x}.`,
        langkah: [`Kalimatnya: (□ − ${a}) × ${b} = ${(x - a) * b}. Kerjakan mundur dari belakang.`, `Batalkan "× ${b}": ${(x - a) * b} : ${b} = ${x - a}.`, `Batalkan "− ${a}": ${x - a} + ${a} = ${x}.`, ajCek(`(${x} − ${a}) × ${b} = ${x - a} × ${b}`, (x - a) * b), ajJadi("bilangan yang kupikirkan adalah", x)] }); },
    /* Dua kotak sama */
    () => { const x = acak(3, 30), a = acak(2, 20);
      return isian(`${KOTAK} + ${KOTAK} + ${a} = ${2 * x + a}<br>Kedua □ bernilai sama. Nilai □ adalah …`, x, { petunjuk: "Kurangi dulu, lalu bagi 2.", bahas: `${2 * x + a} − ${a} = ${2 * x}. ${2 * x} : 2 = ${x}.`,
        langkah: [`□ + □ sama dengan 2 × □. Jadi 2 × □ + ${a} = ${2 * x + a}.`, `Kurangi: ${2 * x + a} − ${a} = ${2 * x}. Jadi 2 × □ = ${2 * x}.`, `Bagi 2: □ = ${2 * x} : 2 = ${x}.`, ajCek(`${x} + ${x} + ${a}`, 2 * x + a), ajJadi("nilai □ adalah", x)] }); },
    /* □ di belakang tanda kurang dalam kurung */
    () => { const x = acak(2, 15), a = x + acak(2, 15), b = acak(2, 6);
      return isian(`(${a} − ${KOTAK}) × ${b} = ${(a - x) * b}<br>Nilai □ adalah …`, x, { petunjuk: "Bagi dulu untuk mendapat isi kurung.", bahas: `${(a - x) * b} : ${b} = ${a - x}. ${a} − □ = ${a - x}, jadi □ = ${x}.`,
        langkah: [`Bagi dulu untuk mendapat isi kurung: ${(a - x) * b} : ${b} = ${a - x}. Jadi ${a} − □ = ${a - x}.`, `□ = ${a} − ${a - x} = ${x}.`, ajCek(`(${a} − ${x}) × ${b} = ${a - x} × ${b}`, (a - x) * b), ajJadi("nilai □ adalah", x)] }); },
    /* Belanja */
    () => { const y = nama(), n = acak(2, 6), h = acak(2, 10) * 500, b = acak(3, 15) * 1000;
      return isian(`${y} membeli ${n} pensil yang harganya sama dan sebuah buku seharga ${rp(b)}. Seluruhnya ${y} membayar ${rp(n * h + b)}. Harga 1 pensil adalah Rp …`, h, { petunjuk: `${n} × □ + ${fmt(b)} = ${fmt(n * h + b)}.`, bahas: `${rp(n * h + b)} − ${rp(b)} = ${rp(n * h)}. ${rp(n * h)} : ${n} = ${rp(h)}.`,
        langkah: [`Kalimatnya: ${n} × □ + ${fmt(b)} = ${fmt(n * h + b)}.`, `Kurangi harga buku: ${rp(n * h + b)} − ${rp(b)} = ${rp(n * h)}. Itu harga ${n} pensil.`, `Harga 1 pensil = ${rp(n * h)} : ${n} = ${rp(h)}.`, ajJadi("harga 1 pensil adalah", rp(h))] }); },
  ],
  6: [
    () => { const x = acak(5, 40), a = acak(5, 40), b = acak(5, 40), c = x + a - b; if (c <= 0) return isian(`${KOTAK} + 15 = 20 + 12<br>□ = …`, 17, { bahas: "32 − 15 = 17.",
        langkah: ["Hitung ruas kanan dulu: 20 + 12 = 32.", "□ + 15 = 32, jadi □ = 32 − 15 = 17.", ajCek("17 + 15", 32), ajJadi("nilai □ adalah", 17)] });
      return isian(`${KOTAK} + ${a} = ${b} + ${c}<br>Nilai □ adalah …`, x, { petunjuk: "Hitung ruas kanan dulu.", bahas: `${b} + ${c} = ${b + c}. □ = ${b + c} − ${a} = ${x}.`,
        langkah: [`Hitung ruas kanan dulu: ${b} + ${c} = ${b + c}.`, `□ + ${a} = ${b + c}, jadi □ = ${b + c} − ${a} = ${x}.`, ajCek(`${x} + ${a}`, b + c), ajJadi("nilai □ adalah", x)] }); },
    () => { const b = acak(2, 9), c = acak(2, 12), a = pilih([2, 3, 4, 6].filter(v => (b * c) % v === 0)) || 1; return isian(`${a} × ${KOTAK} = ${b} × ${c}<br>Nilai □ adalah …`, b * c / a, { bahas: `${b} × ${c} = ${b * c}. □ = ${b * c} : ${a} = ${b * c / a}.`,
      langkah: [`Hitung ruas kanan dulu: ${b} × ${c} = ${b * c}.`, `${a} × □ = ${b * c}, jadi □ = ${b * c} : ${a} = ${b * c / a}.`, ajCek(`${a} × ${b * c / a}`, b * c), ajJadi("nilai □ adalah", b * c / a)] }); },
  ],
  7: [
    () => { const x = nama(), k = acak(3, 9), h = acak(5, 20) * 500, s = acak(1, 10) * 1000, u = k * h + s;
      return isian(`${x} membeli beberapa buku tulis seharga ${rp(h)} per buku. Ia membayar ${rp(u)} dan menerima kembalian ${rp(s)}. Banyak buku yang dibeli ${x} adalah …`, k, { satuan: "buku", petunjuk: `Buat kalimat: □ × ${fmt(h)} + ${fmt(s)} = ${fmt(u)}.`, bahas: `${rp(u)} − ${rp(s)} = ${rp(k * h)}. ${rp(k * h)} : ${rp(h)} = ${k} buku.`,
        langkah: [`Kalimatnya: □ × ${fmt(h)} + ${fmt(s)} = ${fmt(u)}.`, `Uang yang benar-benar dipakai untuk buku: ${rp(u)} − ${rp(s)} = ${rp(k * h)}.`, `Banyak buku = ${rp(k * h)} : ${rp(h)} = ${k}.`, ajCek(`${k} × ${rp(h)}`, rp(k * h)), ajJadi(`banyak buku yang dibeli ${x} adalah`, k, "buku")] }); },
    () => { const x = acak(5, 30), k = acak(2, 5), t = acak(10, 40); return isian(`Umur ayah ${k} kali umur ${nama()} ditambah ${t} tahun. Jika umur ayah ${k * x + t} tahun, umur anak itu adalah … tahun.`, x, { satuan: "tahun", bahas: `${k * x + t} − ${t} = ${k * x}. ${k * x} : ${k} = ${x} tahun.`,
      langkah: [`Misalkan umur anak □. Kalimatnya: ${k} × □ + ${t} = ${k * x + t}.`, `Kurangi: ${k * x + t} − ${t} = ${k * x}. Jadi ${k} × □ = ${k * x}.`, `Bagi: □ = ${k * x} : ${k} = ${x}.`, ajCek(`${k} × ${x} + ${t}`, k * x + t), ajJadi("umur anak itu adalah", x, "tahun")] }); },
  ],
  8: [
    () => { let a, x, b, c, d, e; do { a = acak(3, 7); x = acak(6, 20); b = acak(1, 20); c = acak(3, 9); d = acak(2, 6); e = a * x - b - c * d; } while (e < 1);
      return isian(`Nilai □ yang memenuhi<br>${a} × ${KOTAK} − ${b} = ${c} × ${d} + ${e}<br>adalah …`, x, { petunjuk: "Hitung ruas kanan, lalu kerjakan mundur.", bahas: `Ruas kanan = ${c * d + e}. ${a} × □ = ${c * d + e} + ${b} = ${a * x}. □ = ${x}.`,
        langkah: [`Hitung ruas kanan (kali dulu): ${c} × ${d} + ${e} = ${c * d} + ${e} = ${c * d + e}.`, `Jadi ${a} × □ − ${b} = ${c * d + e}. Tambah: ${c * d + e} + ${b} = ${a * x}.`, `Bagi: □ = ${a * x} : ${a} = ${x}.`, ajCek(`${a} × ${x} − ${b} = ${a * x} − ${b}`, c * d + e), ajJadi("nilai □ adalah", x)] }); },
    () => { const x = nama(), n = acak(4, 9), h = acak(4, 12) * 1000, t = n * h; return pg(`${x} membeli ${n} buah mangga dengan harga sama dan membayar ${rp(t)}. Kalimat matematika untuk mencari harga 1 mangga (□) adalah …`, `${n} × □ = ${fmt(t)}`, [`□ : ${n} = ${fmt(t)}`, `□ − ${n} = ${fmt(t)}`, `${n} + □ = ${fmt(t)}`, `□ × ${fmt(t)} = ${n}`], { bahas: `${n} buah × harga 1 buah = ${fmt(t)}, jadi ${n} × □ = ${fmt(t)}. □ = ${rp(h)}.`,
      langkah: [`Harga ${n} mangga = banyak mangga × harga 1 mangga.`, `Banyak mangga ${n}, harga 1 mangga □, dan seluruhnya ${fmt(t)}. Jadi ${n} × □ = ${fmt(t)}.`, `(Harga 1 mangga = ${fmt(t)} : ${n} = ${rp(h)}.)`, ajJadi("kalimat matematikanya", `${n} × □ = ${fmt(t)}`)] }); },
  ],
  9: [
    () => { const s = acak(3, 15), c = acak(3, 15), p = 2 * s + c, q = s + c; return isian(`▲ + ▲ + ● = ${p}<br>▲ + ● = ${q}<br>Nilai ● adalah …`, c, { petunjuk: "Bandingkan kedua baris: apa bedanya?", bahas: `Selisih kedua baris = ▲ = ${p} − ${q} = ${s}. ● = ${q} − ${s} = ${c}.`,
      langkah: [`Bandingkan: baris 1 berisi ▲ + ▲ + ●, baris 2 berisi ▲ + ●. Bedanya tepat satu ▲.`, `▲ = ${p} − ${q} = ${s}.`, `Dari baris 2: ● = ${q} − ${s} = ${c}.`, ajCek(`${s} + ${s} + ${c}`, p), ajJadi("nilai ● adalah", c)] }); },
    () => { const s = acak(2, 12), c = acak(2, 12), p = 3 * s, q = s + 2 * c; return isian(`▲ + ▲ + ▲ = ${p}<br>▲ + ● + ● = ${q}<br>Nilai ▲ × ● adalah …`, s * c, { bahas: `▲ = ${p} : 3 = ${s}. ● + ● = ${q - s}, jadi ● = ${c}. ▲ × ● = ${s * c}.`,
      langkah: [`Baris 1: 3 × ▲ = ${p}, jadi ▲ = ${p} : 3 = ${s}.`, `Baris 2: ${s} + ● + ● = ${q}, jadi ● + ● = ${q} − ${s} = ${q - s}, dan ● = ${q - s} : 2 = ${c}.`, `▲ × ● = ${s} × ${c} = ${s * c}.`, ajJadi("nilai ▲ × ● adalah", s * c)] }); },
  ],
  10: [
    () => { const a = acak(2, 12), b = acak(3, 15), c = acak(1, b - 1);
      return isian(`🍎 + 🍎 = ${2 * a}<br>🍎 + 🍌 = ${a + b}<br>🍌 − 🍇 = ${b - c}<br>Nilai 🍎 + 🍌 × 🍇 adalah …`, a + b * c, { petunjuk: "Cari satu per satu dari atas. Ingat: kali dulu, baru tambah!", bahas: `🍎 = ${a}, 🍌 = ${b}, 🍇 = ${c}. ${a} + ${b} × ${c} = ${a + b * c}.`,
        langkah: [`Baris 1: 🍎 = ${2 * a} : 2 = ${a}.`, `Baris 2: 🍌 = ${a + b} − ${a} = ${b}.`, `Baris 3: 🍇 = ${b} − ${b - c} = ${c}.`, `Kali dulu, baru tambah: ${a} + ${b} × ${c} = ${a} + ${b * c} = ${a + b * c}.`, ajJadi("nilai 🍎 + 🍌 × 🍇 adalah", a + b * c)] }); },
    () => { const x = acak(5, 25), y = acak(5, 25); return isian(`Jumlah dua bilangan adalah ${x + y} dan selisihnya ${Math.abs(x - y)}. Bilangan yang <b>lebih besar</b> adalah …`, Math.max(x, y), { petunjuk: "(Jumlah + selisih) : 2", bahas: `(${x + y} + ${Math.abs(x - y)}) : 2 = ${Math.max(x, y)}.`,
      langkah: [`Trik: bilangan yang lebih besar = (jumlah + selisih) : 2.`, `(${x + y} + ${Math.abs(x - y)}) : 2 = ${x + y + Math.abs(x - y)} : 2 = ${Math.max(x, y)}.`, `Cek: bilangan yang lebih kecil = ${x + y} − ${Math.max(x, y)} = ${Math.min(x, y)}, dan ${Math.max(x, y)} − ${Math.min(x, y)} = ${Math.abs(x - y)} ✔`, ajJadi("bilangan yang lebih besar adalah", Math.max(x, y))] }); },
    () => { const k = acak(2, 5), b = acak(3, 10), c = k * b, kd = acak(10, 40); return isian(`Harga ${k} pensil sama dengan harga 1 buku. Harga 3 buku dan 4 pensil adalah ${rp((3 * k + 4) * kd * 100)}. Harga 1 pensil adalah Rp …`, kd * 100, { petunjuk: `Ganti setiap buku dengan ${k} pensil.`, bahas: `3 buku = ${3 * k} pensil. Total ${3 * k + 4} pensil = ${rp((3 * k + 4) * kd * 100)}. 1 pensil = ${rp(kd * 100)}.`,
      langkah: [`Ganti setiap buku dengan ${k} pensil: 3 buku = 3 × ${k} = ${3 * k} pensil.`, `Jadi 3 buku dan 4 pensil = ${3 * k} + 4 = ${3 * k + 4} pensil, harganya ${rp((3 * k + 4) * kd * 100)}.`, `Harga 1 pensil = ${rp((3 * k + 4) * kd * 100)} : ${3 * k + 4} = ${rp(kd * 100)}.`, ajJadi("harga 1 pensil adalah", rp(kd * 100))] }); },
  ],
});
