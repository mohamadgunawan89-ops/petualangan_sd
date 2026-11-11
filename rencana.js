/* Rencana Belajar menuju hari TKA (12 Okt 2026)
   ---------------------------------------------------------------
   Rencana disusun ULANG setiap hari dari kemajuan nyata (jadi hari yang terlewat otomatis dibagi ke hari berikutnya):
   - Pekerjaan = sisa level misi Matematika & Bahasa Indonesia (mapel TKA) + paket Simulasi TKA yang belum tuntas.
   - Hari: belajar (hari belajar pilihan orang tua), simulasi (hari simulasi; satu paket 75 menit, menjelang TKA),
     libur, dan rehat (H-1: istirahat & menyiapkan perlengkapan).
   - Target level per hari = sisa level dibagi hari belajar (7 hari belajar terakhir untuk mengulang materi lemah),
     paling banyak sesuai menit belajar per hari (≈ 1,3 menit per soal).
   Pengaturan (S.atur): menitHarian, hariBelajar [0=Senin…6=Minggu], hariSimulasi.
   S.rencanaAwal (ikut sinkron): titik awal untuk menilai "sesuai jadwal". S.rencanaHari (ikut sinkron sejak 11 Nov 2026): daftar
   tugas hari ini dibekukan sejak pertama dilihat supaya tidak berubah saat dikerjakan. */
"use strict";

const MENIT_PILIHAN = [15, 30, 45, 60, 90];
const HARI_SINGKAT = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const HARI_PENUH = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const PULAU_TKA = ["mtk", "bin"];
const aturRencana = () => { const a = S.atur || {};
  return { menit: MENIT_PILIHAN.includes(+a.menitHarian) ? +a.menitHarian : 30,
    hari: Array.isArray(a.hariBelajar) && a.hariBelajar.length ? a.hariBelajar : [0, 1, 2, 3, 4, 5],
    sim: Array.isArray(a.hariSimulasi) ? a.hariSimulasi : [5],
    // Bahasa Inggris (12 Okt 2026): ikut rencana bila ada tanggal target selesai; hari latihannya sendiri (bawaan = hari belajar)
    ingTarget: /^\d{4}-\d{2}-\d{2}$/.test(a.ingTarget || "") ? a.ingTarget : "",
    ingHari: Array.isArray(a.ingHari) && a.ingHari.length ? a.ingHari : (Array.isArray(a.hariBelajar) && a.hariBelajar.length ? a.hariBelajar : [0, 1, 2, 3, 4, 5]),
    ingSampai: [0, 5, 10].includes(+a.ingSampai) ? +a.ingSampai : 5 }; };   // cakupan target: Dengar & Baca saja (0), + Level 1–5, atau semua level
const CAKUPAN_ING = [[0, "Dengar & Baca saja"], [5, "Dengar & Baca + Level 1–5"], [10, "Dengar & Baca + semua level"]];
/* Pekerjaan Bahasa Inggris: misi yang belum dimulai = 5 sub level Dengar & Baca (biaya 2 = 10 soal), lalu level sampai cakupan target */
const sisaInggris = () => { const maks = aturRencana().ingSampai;
  return MISI.filter(m => m.pulau === "big").flatMap(m => { const lv = dataMisi(m.id).lv, x = ingLihat(m.id);
    const sub = lv > 0 ? [] : [0, 1, 2, 3, 4].filter(n => x.s[n] < ING_LULUS_SUB).map(n => ({ jenis: "sub", m: m.id, n, biaya: 2 }));
    return [...sub, ...Array.from({ length: Math.max(0, maks - lv) }, (_, i) => ({ jenis: "level", m: m.id, L: lv + 1 + i, biaya: 1 }))]; }); };
const unitInggrisSemua = () => MISI.filter(m => m.pulau === "big").length * (10 + aturRencana().ingSampai);
/* Menambah satu butir ke tugas hari itu; butir berurutan dari misi yang sama digabung ("Level 5–6", "sub level 1–2") */
function tambahTugas(h, x) {
  if (x.jenis === "sub") { const sama = h.tugas.find(t => t.jenis === "sub" && t.m === x.m && t.sampai === x.n - 1);
    if (sama) sama.sampai = x.n; else h.tugas.push({ jenis: "sub", m: x.m, dari: x.n, sampai: x.n }); return; }
  const sama = h.tugas.find(t => t.jenis === "level" && t.m === x.m && t.sampai === x.L - 1);
  if (sama) sama.sampai = x.L; else h.tugas.push({ jenis: "level", m: x.m, dari: x.L, sampai: x.L });
}
const jumlahButir = h => h.tugas.filter(t => t.jenis === "level" || t.jenis === "sub").reduce((s, t) => s + t.sampai - t.dari + 1, 0);
const hariKe = tgl => (new Date(tgl + "T00:00:00").getDay() + 6) % 7;
const tambahHari = (tgl, n) => { const d = new Date(tgl + "T00:00:00"); d.setDate(d.getDate() + n); return hariIni(d); };
const menitPerLevel = () => Math.max(4, Math.round(atur().soal * 1.3));
const sisaLevel = pl => MISI.filter(m => m.pulau === pl).flatMap(m => { const lv = dataMisi(m.id).lv; return Array.from({ length: 10 - lv }, (_, i) => ({ m: m.id, L: lv + 1 + i })); });
const simBelum = () => { const P = PULAU_TKA.map(pl => paketTKA(pl).filter(t => terbaikTes(t.id) < BATAS_TES)), r = [];
  for (let i = 0; i < PAKET_TKA; i++) P.forEach(x => x[i] && r.push(x[i])); return r; };
const totalLevelTKA = () => MISI.filter(m => PULAU_TKA.includes(m.pulau)).length * 10;

/* Tabungan belajar (12 Okt 2026, diubah 26 Okt 2026): semua hari bawaannya normal (sesuai rencana). Anak memilih alat
   lalu mengetuk tanggal: 🌴 Libur → hari itu libur pilihan (S.liburPilihan); 🚀 Percepat → hari libur pilihan kembali
   normal, hari normal jadi hari cepat (S.cepatPilihan: +1 level TKA & +1 level Bahasa Inggris). Keduanya tersinkron. */
const liburPilihan = () => (S.liburPilihan || []).filter(t => t >= hariIni());
const cepatPilihan = () => (S.cepatPilihan || []).filter(t => t >= hariIni());
let alatTabungan = null;   // "libur" | "cepat" | null (bawaan: belum memilih, semua hari normal)

/* ---------- Jadwal tes: Pos Tes & Simulasi TKA (11 Nov 2026) ----------
   - Satu tes (30 soal · 75 menit) per hari; hari tes tanpa latihan lain.
   - Tiap pekan satu hari tes di akhir pekan: Sabtu atau Minggu pilihan anak (S.hariTes[senin] = { w: 5|6, t }, bawaan
     Sabtu). Bila hari itu libur pilihan, dipakai hari akhir pekan yang lain. Tes yang tidak muat di akhir pekan memakai
     "hari tes tambahan" dari Pengaturan (S.atur.hariSimulasi).
   - Pos Tes: begitu terbuka, di hari tes paling awal (akhir pekan didahulukan). Simulasi: hari tes terakhir menjelang
     H-1 TKA, berurutan dari paket 1.
   - Nilai di bawah BATAS_TES: tes diulang (simulasi: paket yang sama) paling cepat 7 hari sesudah percobaan terakhir.
     Sampai tes ulang, tiap hari belajar ada Sesi tambahan (bahas soal yang salah + 1 level ulang dari materi terlemah
     di tes itu) dan latihan harian berkurang 1 level. */
const BATAS_TES = 80;
const seninDari = tgl => tambahHari(tgl, -hariKe(tgl));
const hariTesPekan = tgl => { const x = (S.hariTes || {})[seninDari(tgl)]; return x && (x.w === 5 || x.w === 6) ? x.w : 5; };
const tglCoba = x => hariIni(new Date(x.t));
const cobaTerakhir = id => riwayatTes(id).reduce((p, x) => (!p || x.t > p.t ? x : p), null);
const tesRelevan = (t, tka, ingT) => (PULAU_TKA.includes(t.pulau) ? !!tka : t.pulau === "big" && !!ingT && !t.tka);
function aturTes(hari, dari, tka, ingT) {
  const beku = S.rencanaHari && S.rencanaHari.tgl === dari ? S.rencanaHari.tugas : null;   // tugas hari ini yang sudah dibekukan
  const bekuTes = beku ? beku.filter(t => t.jenis === "sim").map(t => t.tid) : [];
  const boleh = h => !h.piknik && h.jenis !== "rehat" && h.jenis !== "hariH" && !(beku && h.tgl === dari);
  const peta = new Map(hari.map(h => [h.tgl, h])), isi = new Map();
  const pasang = (h, t) => { isi.set(h, t.id); h.jenis = "sim"; h.posTes = !t.tka; h.cepat = false; h.tesPekan = !!h.akhirPekan; h.tugas = [{ jenis: "sim", tid: t.id }]; };
  if (bekuTes.length && hari[0] && hari[0].tgl === dari) pasang(hari[0], cariTes(bekuTes[0]));
  // Slot akhir pekan (satu per pekan) dan slot tambahan (hari simulasi dari Pengaturan)
  const pekan = [], tambahan = [];
  for (const h of hari) if (h.w === 5 || h.w === 6) {
    const pilih = hariTesPekan(h.tgl); if (h.w !== pilih) continue;
    const lain = peta.get(tambahHari(h.tgl, pilih === 5 ? 1 : -1)), p = boleh(h) ? h : lain && boleh(lain) ? lain : null;
    if (p) { p.akhirPekan = true; pekan.push(p); }
  }
  for (const h of hari) if (h.jenis === "calon" && !h.akhirPekan && boleh(h)) tambahan.push(h);
  const sah = (h, t) => !isi.has(h) && (PULAU_TKA.includes(t.pulau) ? h.tgl < tka : h.tgl <= ingT);
  const paling = t => { const c = cobaTerakhir(t.id); return c ? tambahHari(tglCoba(c), 7) : dari; };
  const perlu = t => !(bekuTes.includes(t.id) && !riwayatTes(t.id).some(x => tglCoba(x) === dari));   // sudah di hari ini & belum dikerjakan
  // Pos Tes: secepatnya
  let posLebih = 0;
  POS_TES.filter(t => !t.tka && tesRelevan(t, tka, ingT) && tesTerbuka(t) && terbaikTes(t.id) < BATAS_TES && perlu(t)).forEach(t => {
    const m = paling(t), h = pekan.find(x => x.tgl >= m && sah(x, t)) || tambahan.find(x => x.tgl >= m && sah(x, t));
    if (h) pasang(h, t); else posLebih++; });
  // Simulasi: slot terakhir menjelang TKA, paket berurutan; paket yang diulang menunggu 7 hari
  const sims = tka ? simBelum().filter(perlu) : [], slot = [...pekan, ...tambahan].filter(h => sah(h, sims[0] || { pulau: "mtk" })).sort((p, q) => (p.tgl < q.tgl ? -1 : 1));
  const antre = [...sims]; slot.slice(-sims.length || slot.length).forEach(h => { if (!sims.length) return; const k = antre.findIndex(t => paling(t) <= h.tgl); if (k >= 0) pasang(h, antre.splice(k, 1)[0]); });
  return { sims: sims.length, simLebih: antre.length, posLebih };
}
/* Sesi tambahan: tes yang nilai terakhirnya di bawah BATAS_TES dan belum pernah mencapainya */
function remediAktif(hari, tka, ingT) {
  return POS_TES.filter(t => tesRelevan(t, tka, ingT)).map(t => { const c = cobaTerakhir(t.id);
    if (!c || c.nilai >= BATAS_TES || terbaikTes(t.id) >= BATAS_TES) return null;
    const ulang = hari && hari.find(h => h.tgl > tglCoba(c) && h.tugas.some(x => x.jenis === "sim" && x.tid === t.id));
    return { t, c, mulai: tambahHari(tglCoba(c), 1), sampai: ulang ? ulang.tgl : tambahHari(tglCoba(c), 7) }; }).filter(Boolean);
}
/* Materi terlemah di tes itu: pos/jurus dengan persentase benar terendah (di bawah 80%, paling sedikit satu), misi yang sudah dimulai */
function misiRemedi(c, k) {
  const pos = Object.entries(c.pos || {}).map(([pid, [b, n]]) => [pid, n ? b / n : 1]).sort((p, q) => p[1] - q[1]);
  const lemah = pos.filter(p => p[1] < 0.8); if (!lemah.length && pos.length) lemah.push(pos[0]);
  const ms = lemah.flatMap(([pid]) => MISI.filter(m => m.pos === pid && dataMisi(m.id).lv >= 1));
  if (!ms.length) return null;
  const m = ms[k % ms.length], lv = dataMisi(m.id).lv, atas = Math.min(lv, 9);
  return { m: m.id, L: lv >= 7 ? 7 + Math.floor(k / ms.length) % (atas - 6) : lv };
}
function aturRemedi(hari, dari, tka, ingT) {
  const beku = S.rencanaHari && S.rencanaHari.tgl === dari;
  const R = remediAktif(hari, tka, ingT); if (!R.length) return;
  hari.forEach(h => { if (h.jenis !== "belajar" || (beku && h.tgl === dari)) return;
    const c = R.filter(x => h.tgl >= x.mulai && h.tgl < x.sampai); if (!c.length) return;
    const x = c[selisihHari(dari, h.tgl) % c.length], k = selisihHari(x.mulai, h.tgl), mr = misiRemedi(x.c, k);
    h.remedi = true; h.tugas.unshift({ jenis: "remedi", tid: x.t.id, ct: x.c.t, ...(mr || {}) }); });
}
/* Rentang rencana sampai tanggal paling akhir: hari TKA atau target Bahasa Inggris (program Bahasa Inggris boleh
   bertahun-tahun, sesudah TKA). Sebelum TKA materi TKA diutamakan; sesudah TKA seluruh waktu untuk Bahasa Inggris. */
function buatRencana(dari = hariIni()) {
  const a = aturRencana(), tka = S.tka && S.tka > dari ? S.tka : "", ingT = a.ingTarget && a.ingTarget >= dari ? a.ingTarget : "";
  if (!tka && !ingT) return { status: !S.tka ? "tanpa" : S.tka === dari ? "hariH" : "lewat" };
  const ujung = [tka, ingT ? tambahHari(ingT, 1) : ""].sort().pop(), n = selisihHari(dari, ujung), sisaTKA = tka ? selisihHari(dari, tka) : 0, hari = [];
  for (let i = 0; i < n; i++) { const tgl = tambahHari(dari, i), w = hariKe(tgl);
    const jenis = tka && tgl === tka ? "hariH" : tka && tgl < tka ? (sisaTKA > 2 && i === sisaTKA - 1 ? "rehat" : a.sim.includes(w) ? "calon" : a.hari.includes(w) ? "belajar" : "libur")
      : a.hari.includes(w) ? "belajar" : "libur";
    const piknik = liburPilihan().includes(tgl) && (jenis === "belajar" || jenis === "calon");
    hari.push({ tgl, w, jenis: piknik ? "libur" : jenis, piknik, tugas: [] }); }
  const cepatSet = new Set(cepatPilihan());
  const tes = aturTes(hari, dari, tka, ingT);
  hari.forEach(h => { if (h.jenis === "calon") h.jenis = "belajar"; h.cepat = h.jenis === "belajar" && cepatSet.has(h.tgl); });
  aturRemedi(hari, dari, tka, ingT);
  const plus = h => (h.cepat ? 1 : 0);   // hari cepat: +1 level di atas jatah biasa
  const belajar = hari.filter(h => h.jenis === "belajar"), kapasitas = Math.max(1, Math.floor(a.menit / menitPerLevel()));
  const kapH = h => Math.max(0, kapasitas - (h.remedi ? 1 : 0)), sisaCap = new Map(belajar.map(h => [h, kapH(h)]));
  // Bahasa Inggris dulu (punya tanggal target): jatah harian = sisa pekerjaan dibagi hari latihan sampai tanggal target
  let ing = null;
  const adaTKA = !!tka && PULAU_TKA.some(pl => sisaLevel(pl).length);
  // Sebelum TKA (selama materi TKA masih ada) Bahasa Inggris paling banyak separuh waktu; sesudah TKA seluruh waktu
  const maksHari = tgl => (adaTKA && tgl < tka ? Math.max(1, Math.floor(kapasitas / 2)) : kapasitas);
  if (ingT) {
    const E = sisaInggris(), EU = E.reduce((s, x) => s + x.biaya, 0);
    const hariE = belajar.filter(h => h.tgl <= ingT && a.ingHari.includes(h.w)), rata = hariE.length ? Math.ceil(EU / hariE.length) : EU;
    let ei = 0; const pakai = new Map();
    const ekstra = new Map();   // hari cepat: biaya 1 level Bahasa Inggris tambahan (tidak mengurangi jatah waktu TKA)
    const isi = (h, batasH) => { let p = pakai.get(h) || 0; while (ei < E.length && p < batasH) { tambahTugas(h, E[ei]); p += E[ei].biaya; ei++; } pakai.set(h, p); sisaCap.set(h, Math.max(0, kapH(h) - p + (ekstra.get(h) || 0))); };
    const isiCepat = h => { if (!h.cepat || ekstra.has(h) || ei >= E.length) return; const b = E[ei].biaya; isi(h, (pakai.get(h) || 0) + 1); ekstra.set(h, b); sisaCap.set(h, Math.max(0, kapH(h) - pakai.get(h) + b)); };
    // Laju merata sampai tanggal target: jatah kumulatif EU × (k+1)/N (bukan dibulatkan ke atas per hari)
    hariE.forEach((h, k) => { const kum = Math.ceil(EU * (k + 1) / hariE.length), sudah = E.slice(0, ei).reduce((s, x) => s + x.biaya, 0);
      isi(h, Math.min(maksHari(h.tgl), kapH(h), Math.max(0, kum - sudah))); isiCepat(h); });
    if (ei < E.length) hariE.forEach(h => isi(h, Math.min(maksHari(h.tgl), kapH(h)) + (ekstra.get(h) || 0)));   // sisa: pakai jatah penuh hari itu
    const akhirE = [...hariE].reverse().find(h => h.tugas.some(t => t.m && cariMisi(t.m).pulau === "big"));
    // Perkiraan selesai dengan pengaturan sekarang (dihitung terus ke depan, bisa bertahun-tahun)
    let perk = null; { let u = 0; for (let t = dari, k = 0; k < 3650 * 2; t = tambahHari(t, 1), k++) { const w = hariKe(t);
      if (a.hari.includes(w) && a.ingHari.includes(w) && !(tka && t < tka && (a.sim.includes(w) || t === tambahHari(tka, -1))) && t !== tka) u += maksHari(t);
      if (u >= EU) { perk = t; break; } } }
    const kuota = hariE.length ? Math.round(EU / hariE.length * 10) / 10 : 0;
    ing = { batas: ingT, unit: EU, kuota: Math.min(kapasitas, Math.ceil(kuota)), perlu: rata, hari: hariE.length, sisa: E.slice(ei).reduce((s, x) => s + x.biaya, 0),
      selesai: akhirE && akhirE.tgl, perkiraan: perk, menitPerlu: Math.ceil(rata * menitPerLevel() / 5) * 5 };
  }
  // Matematika & Bahasa Indonesia (hanya sebelum TKA): dibagi rata ke hari belajar; 7 hari belajar terakhir untuk mengulang
  const belajarTKA = tka ? belajar.filter(h => h.tgl < tka) : [];
  const Q = tka ? PULAU_TKA.map(sisaLevel) : [[], []], total = Q[0].length + Q[1].length, awalQ = Q.map(q => q.length || 1);
  const cadUlang = belajarTKA.length > 21 ? 7 : belajarTKA.length > 10 ? 3 : 0, efektif = Math.max(1, belajarTKA.length - cadUlang);
  const perlu = Math.ceil(total / efektif), target = Math.min(kapasitas, perlu);
  const ambilTKA = (h, n) => { const it = [];
    for (let k = 0; k < n && (Q[0].length || Q[1].length); k++) it.push(Q[!Q[1].length ? 0 : !Q[0].length ? 1 : (Q[0].length / awalQ[0] >= Q[1].length / awalQ[1] ? 0 : 1)].shift());
    it.sort((p, q) => (p.m === q.m ? p.L - q.L : 0)).forEach(x => tambahTugas(h, { jenis: "level", ...x })); sisaCap.set(h, sisaCap.get(h) - it.length); };
  belajarTKA.forEach(h => ambilTKA(h, Math.min(target, Math.max(0, sisaCap.get(h))) + plus(h)));
  if (Q[0].length || Q[1].length) belajarTKA.forEach(h => ambilTKA(h, sisaCap.get(h)));   // sisa: isi waktu yang masih kosong
  belajarTKA.forEach(h => { if (!h.tugas.length) h.tugas.push({ jenis: "ulang" }); });
  belajar.forEach(h => { if (!h.tugas.length) h.jenis = "bebas"; });   // sesudah TKA tanpa tugas: hari bebas
  const sisaTakTerbagi = Q[0].length + Q[1].length;
  const selesaiMateri = [...belajarTKA].reverse().find(h => h.tugas.some(t => t.jenis === "level" && PULAU_TKA.includes(cariMisi(t.m).pulau)));
  return { status: "ok", tka, ingT, akhir: tambahHari(ujung, -1), hari, total, target, kapasitas, perlu, simLebih: tes.simLebih, sisaTakTerbagi, menit: a.menit, selesaiMateri: selesaiMateri && selesaiMateri.tgl,
    awalSim: (hari.find(h => h.jenis === "sim" && !h.posTes) || {}).tgl, sims: tes.sims, ing,
    posTes: hari.filter(h => h.posTes).map(h => ({ tgl: h.tgl, tid: h.tugas[0].tid })), posLebih: tes.posLebih };
}

/* Titik awal rencana (untuk status "sesuai jadwal") — dibuat ulang bila tanggal TKA berubah */
function titikAwal(r) {
  const sudah = totalLevelTKA() - r.total;
  if (!S.rencanaAwal || S.rencanaAwal.tka !== S.tka || sudah < S.rencanaAwal.sudah) {
    S.rencanaAwal = { tgl: hariIni(), tka: S.tka, sudah, total: r.total, target: r.target, hariBelajar: r.hari.filter(h => (h.jenis === "belajar" || h.piknik) && h.tgl < r.tka).length }; simpanData(false);
  }
  return S.rencanaAwal;
}
function statusJadwal(r) {
  const aw = titikAwal(r), sudahKini = totalLevelTKA() - r.total, dikerjakan = sudahKini - aw.sudah;
  const a = aturRencana(); let lewat = 0; for (let t = aw.tgl; t < hariIni(); t = tambahHari(t, 1)) if (a.hari.includes(hariKe(t))) lewat++;
  /* Hari belajar dari titik awal sampai sebelum H-1 TKA, dihitung dengan aturan yang sama seperti "lewat" (11 Nov 2026).
     Dulu memakai aw.hariBelajar yang tersimpan; bila ada target Bahasa Inggris sesudah TKA, angka itu ikut menghitung
     hari sesudah TKA (mis. 350, bukan ±135), sehingga target Matematika & Bahasa Indonesia jauh terlalu kecil dan
     berbeda antarperangkat. */
  let hariTKA = 0; for (let t = aw.tgl, ujung = tambahHari(aw.tka || r.tka, -1); t < ujung; t = tambahHari(t, 1)) if (a.hari.includes(hariKe(t))) hariTKA++;
  const harap = hariTKA ? Math.round(aw.total * Math.min(1, lewat / Math.max(1, hariTKA - 3))) : 0, selisih = dikerjakan - harap;
  const x = { selisih, harap, dikerjakan, sejak: aw.tgl };
  return selisih >= 3 ? { kls: "cepat", teks: `🚀 Lebih cepat ${selisih} level dari jadwal`, ...x } : selisih >= -1 ? { kls: "pas", teks: "👍 Sesuai jadwal", ...x }
    : { kls: "kejar", teks: `⏳ Tertinggal ${-selisih} level — ayo kejar sedikit demi sedikit`, ...x };
}
/* Target vs nyata Bahasa Inggris: titik awal dibuat ulang bila target/cakupan berubah atau kemajuan berkurang */
function statusIng(r) {
  if (!r.ing) return null;
  const a = aturRencana(), sisa = r.ing.unit, kunci = r.ingT + "|" + a.ingSampai;
  if (!S.rencanaAwalIng || S.rencanaAwalIng.kunci !== kunci || sisa > S.rencanaAwalIng.sisa) { S.rencanaAwalIng = { kunci, tgl: hariIni(), sisa, hari: r.ing.hari }; simpanData(false); }
  const aw = S.rencanaAwalIng; let lewat = 0;
  for (let t = aw.tgl; t < hariIni(); t = tambahHari(t, 1)) { const w = hariKe(t); if (a.hari.includes(w) && a.ingHari.includes(w)) lewat++; }
  const harap = Math.round(aw.sisa * Math.min(1, lewat / Math.max(1, aw.hari))), dikerjakan = aw.sisa - sisa, selisih = dikerjakan - harap;
  return { harap, dikerjakan, selisih, sejak: aw.tgl, kls: selisih >= 3 ? "cepat" : selisih >= -1 ? "pas" : "kejar",
    teks: selisih >= 3 ? `🚀 Lebih cepat ${selisih} tugas` : selisih >= -1 ? "👍 Sesuai jadwal" : `⏳ Tertinggal ${-selisih} tugas` };
}
/* Catatan harian target vs dikerjakan (ikut tersinkron, 60 hari) untuk Dasbor Ortu */
function catatHarian(r) {
  const th = tugasHariIni(r), st = th.tugas.map(statusTugas), c = { t: st.reduce((a, x) => a + x.n, 0), s: st.reduce((a, x) => a + x.sel, 0), j: th.jenis };
  const lama = (S.rencanaCatatan || {})[th.tgl];
  if (!lama || lama.t !== c.t || lama.s !== c.s || lama.j !== c.j) {
    S.rencanaCatatan = Object.fromEntries(Object.entries({ ...(S.rencanaCatatan || {}), [th.tgl]: c }).sort().slice(-60)); simpanData();
  }
  return { th, st, n: c.t, sel: c.s };
}
/* Tugas hari ini dibekukan sejak pertama dilihat */
function tugasHariIni(r) {
  const h = hariIni();
  const kunci = JSON.stringify([S.tka, aturRencana(), liburPilihan(), cepatPilihan(), S.hariTes || {}]);   // pengaturan berubah → susun ulang tugas hari ini
  if (!S.rencanaHari || S.rencanaHari.tgl !== h || S.rencanaHari.kunci !== kunci) {
    const d = r.hari && r.hari[0] && r.hari[0].tgl === h ? r.hari[0] : null;
    S.rencanaHari = { tgl: h, kunci, dibuat: Date.now(), jenis: d ? d.jenis : "libur", tugas: d ? d.tugas : [],
      awal: { tka: totalLevelTKA() - PULAU_TKA.reduce((s, pl) => s + sisaLevel(pl).length, 0), ing: sisaInggris().reduce((s, x) => s + x.biaya, 0) } }; simpanData(false);
  }
  return S.rencanaHari;
}
/* Target di Dasbor Ortu (11 Nov 2026) = kemajuan sampai awal hari ini + tugas hari ini (per mapel).
   Contoh: nyata kemarin 64 level, tugas hari ini 2 level → target 66. Bahasa Inggris dalam "tugas" (sub level = 2).
   Status "lebih cepat/tertinggal" sejak titik awal (statusJadwal) tetap dipakai untuk Tabungan belajar & laporan. */
function targetHariIni(r, x, k) {
  const th = tugasHariIni(r); let n = 0, sel = 0;
  th.tugas.forEach(t => { if (t.jenis !== "level" && t.jenis !== "sub") return;
    const pl = cariMisi(t.m).pulau; if ((k === "tka") !== PULAU_TKA.includes(pl) || (k === "ing" && pl !== "big")) return;
    const st = statusTugas(t), f = t.jenis === "sub" ? 2 : 1; n += st.n * f; sel += st.sel * f; });
  const awalHari = th.awal && th.awal.tka !== undefined ? (k === "tka" ? th.awal.tka - S.rencanaAwal.sudah : S.rencanaAwalIng.sisa - th.awal.ing) : null;
  const sebelum = Math.max(0, Math.min(x.dikerjakan, awalHari !== null ? awalHari : x.dikerjakan - sel));
  const harap = sebelum + n, selisih = x.dikerjakan - harap, sat = k === "tka" ? "level" : "tugas";
  return { ...x, harap, selisih, kls: selisih > 0 ? "cepat" : selisih === 0 ? "pas" : "kejar",
    teks: selisih > 0 ? `🚀 Lebih ${selisih} ${sat} dari target` : selisih === 0 ? (n ? "✅ Target hari ini tercapai" : "👍 Sesuai jadwal") : `⏳ Hari ini kurang ${-selisih} ${sat}` };
}
const logHari = tgl => S.log.filter(x => hariIni(new Date(x.t)) === tgl);
function statusTugas(t) {
  if (t.jenis === "level") { const lv = dataMisi(t.m).lv, n = t.sampai - t.dari + 1, sel = Math.max(0, Math.min(n, lv - t.dari + 1)); return { n, sel, beres: sel >= n }; }
  if (t.jenis === "sub") { const s = ingLihat(t.m).s, n = t.sampai - t.dari + 1; let sel = 0; for (let i = t.dari; i <= t.sampai; i++) if (s[i] >= ING_LULUS_SUB) sel++;
    return { n, sel, beres: sel >= n || dataMisi(t.m).lv > 0 }; }
  if (t.jenis === "sim") { const hari = riwayatTes(t.tid).some(x => hariIni(new Date(x.t)) === hariIni()) || terbaikTes(t.tid) >= BATAS_TES; return { n: 1, sel: hari ? 1 : 0, beres: hari }; }
  if (t.jenis === "remedi") { const ok = t.m ? logHari(hariIni()).some(x => x.m === t.m && x.L === t.L && x.lulus) : !!(S.rencanaHari && S.rencanaHari.remediBaca === hariIni()); return { n: 1, sel: ok ? 1 : 0, beres: ok }; }
  const ada = logHari(hariIni()).length > 0 || (S.harian.tgl === hariIni() && S.harian.selesai); return { n: 1, sel: ada ? 1 : 0, beres: ada };
}
function teksTugas(t) {
  if (t.jenis === "level") { const m = cariMisi(t.m); return { ikon: m.ikon, judul: m.judul, sub: `${cariPulau(m.pulau).judul} · Level ${t.dari}${t.sampai > t.dari ? `–${t.sampai}` : ""}` }; }
  if (t.jenis === "sub") { const m = cariMisi(t.m), nm = NAMA_SUB[jenisIng(lvIng(t.m))];
    return { ikon: m.ikon, judul: m.judul, sub: `Bahasa Inggris · Dengar &amp; Baca · sub level ${t.dari + 1}${t.sampai > t.dari ? `–${t.sampai + 1}` : ` (${nm[t.dari]})`}` }; }
  if (t.jenis === "sim") { const s = cariTes(t.tid); return { ikon: s.tka ? "🎯" : "📝", judul: judulTes(s), sub: `${cariPulau(s.pulau).judul} · ${TES_SOAL} soal · ${TES_MENIT} menit${riwayatTes(t.tid).length ? " · tes ulang" : ""}` }; }
  if (t.jenis === "remedi") { const s = cariTes(t.tid), m = t.m && cariMisi(t.m);
    return { ikon: "🔧", judul: `Sesi tambahan · ${judulTes(s)} ${cariPulau(s.pulau).judul}`, sub: `Bahas soal yang salah${m ? ` + ${m.judul} Level ${t.L}` : ""}` }; }
  return { ikon: "🔁", judul: "Ulangi materi yang masih lemah", sub: "Kerjakan ulang level dengan bintang sedikit, atau Tantangan Harian" };
}
function mulaiTugas(t) {
  if (t.jenis === "sub") { const n = [0, 1, 2, 3, 4].find(i => i >= t.dari && ingLihat(t.m).s[i] < ING_LULUS_SUB);
    return n !== undefined && subTerbuka(t.m, n) ? mulaiSub(t.m, n) : tampil("latih", t.m); }
  if (t.jenis === "level") { const lv = dataMisi(t.m).lv; if (level1Terkunci(t.m)) return tampil("latih", t.m);
    return lv + 1 <= 10 ? mulaiLevel(t.m, Math.max(t.dari, lv + 1)) : tampil("jalur", t.m); }
  if (t.jenis === "sim") return tampil("postes", t.tid);
  if (t.jenis === "remedi") return bukaRemedi(t);
  const lemah = MISI.filter(m => PULAU_TKA.includes(m.pulau) && dataMisi(m.id).total >= 5).sort((a, b) => dataMisi(a.id).benar / dataMisi(a.id).total - dataMisi(b.id).benar / dataMisi(b.id).total)[0];
  return lemah ? tampil("jalur", lemah.id) : mulaiHarian();
}
/* ---------- Sesi tambahan & pengingat tes (11 Nov 2026) ---------- */
const soalSalahTes = ct => (S.salah || []).filter(e => e.sb === "tes" && e.t >= ct && e.t < ct + TES_SOAL);
const tesBerikut = (r, n = 4) => (r.status === "ok" ? r.hari.filter(h => h.jenis === "sim" && h.tugas[0] && h.tugas[0].tid) : []).slice(0, n).map(h => ({ h, t: cariTes(h.tugas[0].tid) }));
const namaTes = t => `${judulTes(t)} ${cariPulau(t.pulau).judul}`;
const kapanTeks = tgl => { const d = selisihHari(hariIni(), tgl); return d === 0 ? "hari ini" : d === 1 ? "besok" : `${d} hari lagi`; };
function bukaRemedi(t) {
  const s = cariTes(t.tid), c = riwayatTes(t.tid).find(x => x.t === t.ct) || cobaTerakhir(t.tid), daftar = soalSalahTes(t.ct), m = t.m && cariMisi(t.m);
  const r = buatRencana(), ulang = r.status === "ok" && r.hari.find(h => h.jenis === "sim" && h.tugas.some(x => x.tid === t.tid));
  const lemah = Object.entries(c.pos || {}).sort((p, q) => p[1][0] / p[1][1] - q[1][0] / q[1][1]).filter(([, [b, n]]) => b / n < 0.8).map(([pid]) => namaPosTes(pid));
  const l = dialog(`<div style="font-size:44px;text-align:center">🔧</div><h2 style="text-align:center">Sesi tambahan</h2>
    <p class="ket">${namaTes(s)}: nilaimu <b>${c.nilai}</b>, belum ${BATAS_TES}. ${lemah.length ? `Materi yang perlu dikuatkan: <b>${lemah.join(", ")}</b>. ` : ""}Pelajari lagi soal yang salah beserta pembahasannya${m ? `, lalu kerjakan <b>${m.judul} Level ${t.L}</b>` : ""}.${ulang ? ` Tes ulang: <b>${HARI_PENUH[hariKe(ulang.tgl)]}, ${tglIndo(ulang.tgl)}</b>.` : ""}</p>
    <div class="remedi-daftar">${daftar.length ? daftar.map(htmlSoalSalah).join("") : '<p class="ket">Contoh soal yang salah tidak tersimpan untuk tes ini. Buka lagi materi pada misi di atas, lalu kerjakan levelnya.</p>'}</div>`,
    [[m ? `Kerjakan ${m.judul} Level ${t.L} ▶` : "Sudah kupelajari ✓", "tbl-utama", () => { if (S.rencanaHari) { S.rencanaHari.remediBaca = hariIni(); simpanData(); }
      if (m) mulaiLevel(t.m, t.L); else tampil(layarKini === "rencana" ? "rencana" : "beranda"); }], ["Nanti", "tbl-putih", null]]);
  l.querySelector(".kotak").classList.add("kotak-panjang");
}
/* Pilihan Sabtu/Minggu untuk tes pekan itu (hanya hari yang belum lewat dan bukan libur pilihan) */
function pilihHariTesHtml(h) {
  if (!h.akhirPekan) return "";
  const sen = seninDari(h.tgl), opsi = [5, 6].map(w => [w, tambahHari(sen, w)]).filter(([, tg]) => tg >= hariIni() && !liburPilihan().includes(tg));
  if (opsi.length < 2) return "";
  return `<span class="pilih-hari pilih-tes" role="group" aria-label="Pilih hari tes">${opsi.map(([w, tg]) => `<button type="button" data-hari-tes="${sen}|${w}" aria-pressed="${h.w === w}">${HARI_PENUH[w]} ${+tg.slice(8)}</button>`).join("")}</span>`;
}
document.addEventListener("click", e => { const b = e.target.closest("[data-hari-tes]"); if (!b) return;
  const [sen, w] = b.dataset.hariTes.split("|"); bunyi.klik();
  S.hariTes = Object.fromEntries(Object.entries({ ...(S.hariTes || {}), [sen]: { w: +w, t: Date.now() } }).filter(([k]) => k >= seninDari(tambahHari(hariIni(), -14))));
  simpanData(); tampilPesan(`📝 Tes pekan ini hari ${HARI_PENUH[+w]}`); const y = window.scrollY; tampil(layarKini, argKini); window.scrollTo(0, y); });
/* Kartu beranda: tes dalam 7 hari ke depan + Sesi tambahan yang sedang berjalan (diingatkan setiap kali beranda dibuka) */
function kartuTesBeranda() {
  if (S.peran === "ortu") return "";
  const r = buatRencana(); if (r.status !== "ok") return "";
  const x = tesBerikut(r, 1)[0], R = remediAktif(r.hari, r.tka, r.ingT);
  const dekat = x && selisihHari(hariIni(), x.h.tgl) <= 7;
  if (!dekat && !R.length) return "";
  return `<div class="kartu tes-beranda">${dekat ? `<div class="tb-baris"><span class="tb-ikon">${x.t.tka ? "🎯" : "📝"}</span><span class="tb-isi"><b>${x.h.tgl === hariIni() ? "Hari ini" : `${HARI_PENUH[x.h.w]}, ${tglIndo(x.h.tgl)}`}: ${namaTes(x.t)}</b>
      <span class="ket">${kapanTeks(x.h.tgl)} · ${TES_SOAL} soal · ${TES_MENIT} menit · hari itu tanpa latihan lain${riwayatTes(x.t.id).length ? " · tes ulang" : ""}</span>
      ${x.h.tgl > hariIni() && pilihHariTesHtml(x.h) ? `<span class="ket">Pilih hari tesmu pekan ini:</span>${pilihHariTesHtml(x.h)}` : ""}</span>
      ${x.h.tgl === hariIni() ? `<button class="tbl tbl-utama tbl-kecil" data-ke="postes" data-arg="${x.t.id}">Mulai ▶</button>` : ""}</div>` : ""}
    ${R.map(z => `<div class="tb-baris tb-remedi"><span class="tb-ikon">🔧</span><span class="tb-isi"><b>Sesi tambahan · ${namaTes(z.t)}</b><span class="ket">Nilai ${z.c.nilai} (belum ${BATAS_TES}). Setiap hari belajar: bahas soal yang salah + 1 level ulang, sampai tes ulang ${tglRingkas(z.sampai)}.</span></span></div>`).join("")}</div>`;
}
/* Pengingat sekali sehari saat aplikasi dibuka: tes dalam 3 hari ke depan */
function ingatkanTes() {
  if (S.peran === "ortu" || !S.profil || layarKini !== "beranda" || document.querySelector(".lapis") || S.pengingatTes === hariIni()) return;
  const r = buatRencana(), x = r.status === "ok" && tesBerikut(r, 1)[0]; if (!x) return;
  const d = selisihHari(hariIni(), x.h.tgl); if (d > 3) return;
  S.pengingatTes = hariIni(); simpanData(false);
  dialog(`<div style="font-size:52px">${x.t.tka ? "🎯" : "📝"}</div><h2>${d === 0 ? "Hari ini ada tes!" : d === 1 ? "Besok ada tes!" : `${d} hari lagi ada tes`}</h2>
    <p class="ket"><b>${namaTes(x.t)}</b><br>${HARI_PENUH[x.h.w]}, ${tglIndo(x.h.tgl)} · ${TES_SOAL} soal · ${TES_MENIT} menit</p>
    <p class="ket" style="text-align:left">✅ Hari tes tidak ada latihan lain, cukup tesnya saja.<br>🕰️ Siapkan waktu 75 menit tanpa gangguan.<br>📖 ${x.t.tka ? "Soalnya seperti TKA sungguhan." : `Materinya: ${cakupanTes(x.t)}.`}<br>🎯 Targetmu nilai <b>${BATAS_TES}</b>. Kalau belum, ada Sesi tambahan lalu tes ulang 7 hari kemudian.${x.h.akhirPekan && d > 0 ? "<br>📅 Kamu boleh memilih Sabtu atau Minggu di kartu beranda." : ""}</p>`,
    [[d === 0 ? "Mulai tes ▶" : "Siap! 💪", "tbl-utama", d === 0 ? () => tampil("postes", x.t.id) : null], ...(d === 0 ? [["Nanti", "tbl-putih", null]] : [])]);
}
/* Kartu di layar Rencana: tes berikutnya, pilihan hari, dan Sesi tambahan */
function kartuJadwalTes(r) {
  const daftar = tesBerikut(r, 4), R = remediAktif(r.hari, r.tka, r.ingT);
  if (!daftar.length && !R.length) return "";
  return `<div class="kartu"><h2 class="rc-h2">📝 Jadwal tes</h2><p class="ket" style="margin:0 0 8px">Pos Tes &amp; Simulasi TKA: ${TES_SOAL} soal · ${TES_MENIT} menit · satu tes di akhir pekan (Sabtu atau Minggu pilihanmu). Hari tes tanpa latihan lain. Targetnya nilai <b>${BATAS_TES}</b>.</p>
    <div class="rc-tugas">${daftar.map(({ h, t }) => `<div class="rc-item"><span class="rc-item-ikon">${t.tka ? "🎯" : "📝"}</span><span class="rc-item-isi"><b>${namaTes(t)}</b><span class="ket">${HARI_PENUH[h.w]}, ${tglIndo(h.tgl)} · ${kapanTeks(h.tgl)}${riwayatTes(t.id).length ? " · tes ulang" : ""}${h.akhirPekan ? "" : " · hari tes tambahan"}</span>${h.tgl > hariIni() ? pilihHariTesHtml(h) : ""}</span></div>`).join("")}</div>
    ${R.length ? `<ul class="ket rc-catatan">${R.map(z => `<li>🔧 <b>Sesi tambahan ${namaTes(z.t)}</b> (nilai ${z.c.nilai}): setiap hari belajar sampai tes ulang ${tglIndo(z.sampai)}; latihan harian berkurang 1 level.</li>`).join("")}</ul>` : ""}</div>`;
}
function kesiapan(r) {
  const lv = totalLevelTKA(), sudah = lv - (r.total ?? PULAU_TKA.reduce((a, pl) => a + sisaLevel(pl).length, 0));
  const sim = PULAU_TKA.reduce((a, pl) => a + paketTKA(pl).filter(t => terbaikTes(t.id) >= TES_TUNTAS).length, 0);
  return Math.round((sudah / lv) * 70 + (sim / (PAKET_TKA * 2)) * 30);
}

/* ---------- Kartu di beranda ---------- */
function kartuRencanaBeranda() {
  if (S.peran === "ortu") return "";
  const r = buatRencana();
  if (r.status === "tanpa") return `<button class="kartu rc-beranda" data-ke="rencana"><span class="rc-ikon">📅</span><span class="rc-isi"><b>Buat rencana belajar</b><span class="ket">Minta orang tua mengisi tanggal TKA atau target Bahasa Inggris, lalu lihat target harianmu.</span></span><span aria-hidden="true">▶️</span></button>`;
  if (r.status !== "ok") return "";
  const { th, n, sel } = catatHarian(r);
  const libur = !th.tugas.length, persen = n ? Math.round(sel / n * 100) : 100;
  return `<button class="kartu rc-beranda ${!libur && sel >= n ? "beres" : ""}" data-ke="rencana"><span class="rc-ikon">${libur ? "😴" : sel >= n ? "✅" : "🎯"}</span>
    <span class="rc-isi"><b>${libur ? (th.jenis === "rehat" ? "Hari rehat sebelum TKA" : th.jenis === "hariH" ? "Hari ini TKA! Semangat!" : th.jenis === "bebas" ? "Tidak ada target hari ini" : "Hari ini libur belajar") : sel >= n ? "Target hari ini tercapai!" : "Target hari ini"}</b>
      <span class="ket">${libur ? "Istirahat yang cukup juga bagian dari persiapan." : th.tugas.map(t => teksTugas(t).judul.split(" · ")[0]).slice(0, 2).join(" · ") + (th.tugas.length > 2 ? ` +${th.tugas.length - 2}` : "")}</span>
      ${libur ? "" : `<span class="batang"><i style="width:${persen}%"></i></span>`}</span><span class="rc-angka">${libur ? "" : `${sel}/${n}`}</span></button>`;
}

/* ---------- Layar Rencana ---------- */
let pilihTgl = null;
function lRencana() {
  pasangKepala(); pasangNav("rencana");
  const r = buatRencana();
  if (r.status !== "ok") {
    layar.innerHTML = `<h1 class="judul-bagian" style="font-size:28px;margin-top:16px">📅 Rencana Belajar</h1>
      <div class="kartu rc-kosong"><div style="font-size:56px">${r.status === "tanpa" ? "🗓️" : r.status === "hariH" ? "🎯" : "✅"}</div>
      <h2>${r.status === "tanpa" ? "Tanggal TKA belum diisi" : r.status === "hariH" ? "Hari ini TKA! Kamu pasti bisa!" : "TKA sudah dilaksanakan"}</h2>
      <p class="ket">${r.status === "tanpa" ? "Rencana belajar harian dibuat otomatis dari tanggal TKA. Minta orang tua mengisinya di <b>Orang Tua → Pengaturan</b>." : r.status === "hariH" ? "Sarapan, bawa perlengkapan, baca soal pelan-pelan, dan periksa lagi jawabanmu." : "Terus berlatih untuk mengumpulkan semua piala!"}</p>
      ${r.status === "tanpa" ? '<button class="tbl tbl-utama" data-ke="ortu">Isi tanggal TKA (Orang Tua)</button>' : ""}</div>`;
    return;
  }
  const { th, st, n, sel } = catatHarian(r);
  const aw = S.rencanaAwal, sj = r.tka ? statusJadwal(r) : null, siap = r.tka ? kesiapan(r) : 0;
  const pIng = (() => { const semua = unitInggrisSemua(); return Math.round((semua - sisaInggris().reduce((s, x) => s + x.biaya, 0)) / semua * 100); })();
  const libur = !th.tugas.length, Hing = r.ingT ? selisihHari(hariIni(), r.ingT) : 0;
  layar.innerHTML = `
    ${r.tka ? `<div class="rc-hero">
      <div class="rc-hero-kiri"><div class="rc-label">MENUJU TKA</div><div class="rc-h">H-${selisihHari(hariIni(), r.tka)}</div>
        <div class="rc-tgl">${HARI_PENUH[hariKe(r.tka)]}, ${tglIndo(r.tka)}</div><span class="rc-chip ${sj.kls}">${sj.teks}</span></div>
      <div class="rc-cincin" style="--p:${siap}"><div><b>${siap}%</b><span>siap TKA</span></div></div></div>` : ""}
    ${r.ingT ? `<div class="rc-hero rc-hero-ing ${r.tka ? "kecil" : ""}">
      <div class="rc-hero-kiri"><div class="rc-label">🌍 PROGRAM BAHASA INGGRIS</div><div class="rc-h">${Hing > 400 ? `${(Hing / 365).toFixed(1).replace(".", ",")} th` : `${Hing} hari`}</div>
        <div class="rc-tgl">target ${tglIndo(r.ingT)} · ${CAKUPAN_ING.find(c => c[0] === aturRencana().ingSampai)[1]}</div>
        ${(() => { const si = statusIng(r); return r.ing && r.ing.sisa ? '<span class="rc-chip kejar">⏳ Belum muat — lihat ringkasan</span>' : `<span class="rc-chip ${si.kls}">${si.teks}</span>`; })()}</div>
      <div class="rc-cincin" style="--p:${pIng}"><div><b>${pIng}%</b><span>tercapai</span></div></div></div>` : ""}

    <div class="kartu rc-hari-ini"><div class="rc-judul"><h2>🎯 Target hari ini</h2><span class="ket">${HARI_PENUH[hariKe(hariIni())]}, ${tglIndo(hariIni())}</span></div>
      ${libur ? `<p class="rc-libur">${th.jenis === "rehat" ? "😌 <b>Hari rehat.</b> Tidur cukup, siapkan alat tulis dan kartu peserta. Besok TKA!" : th.jenis === "hariH" ? "🏁 <b>Hari ini TKA!</b> Sarapan, baca soal pelan-pelan, dan periksa lagi jawabanmu. Semangat!" : th.jenis === "bebas" ? "🎉 <b>Tidak ada target hari ini.</b> Target sudah tercapai lebih awal. Mau tetap berlatih? Coba Tantangan Harian." : "😴 <b>Hari ini libur belajar.</b> Istirahat juga penting. Mau tetap berlatih? Coba Tantangan Harian."}</p>`
        : `<div class="rc-progres"><div class="batang"><i style="width:${n ? Math.round(sel / n * 100) : 0}%"></i></div><b>${sel}/${n}</b></div>
        <div class="rc-tugas">${th.tugas.map((t, i) => { const x = teksTugas(t), s = st[i];
          return `<div class="rc-item ${s.beres ? "beres" : ""}"><span class="rc-cek" aria-hidden="true">${s.beres ? "✓" : ""}</span><span class="rc-item-ikon">${x.ikon}</span>
            <span class="rc-item-isi"><b>${x.judul}</b><span class="ket">${x.sub}${t.jenis === "level" && s.n > 1 ? ` · ${s.sel}/${s.n} level` : ""}</span></span>
            ${s.beres ? '<span class="rc-ok">Beres!</span>' : `<button class="tbl tbl-utama tbl-kecil" data-tugas="${i}">Mulai ▶</button>`}</div>`; }).join("")}</div>
        ${sel >= n ? '<p class="rc-selamat">🎉 Hebat! Target hari ini sudah tercapai. Mau lanjut? Semua tambahan membuat jadwal besok lebih ringan.</p>' : ""}`}</div>

    ${kartuJadwalTes(r)}

    ${kartuTabungan(r, sj)}

    ${r.tka ? garisTKA(r) : ""}
    ${r.ingT ? garisIng(r) : ""}

    <div class="kartu"><h2 class="rc-h2">📆 Minggu ini</h2><div class="rc-minggu">${mingguIni(r)}</div></div>

    <div class="kartu"><div class="rc-judul"><h2 class="rc-h2">🗓️ Kalender belajar</h2><button type="button" class="tbl tbl-putih tbl-kecil" id="rc-lipat-semua">Buka semua</button></div>
      <p class="ket" style="margin:0 0 6px">Ketuk nama bulan untuk membuka atau menutup. Ketuk tanggal untuk melihat tugasnya.</p>
      <div id="rc-kalender">${kalenderRencana(r)}</div>
      <div class="rc-legenda kecil"><span><i class="belajar"></i>Belajar</span><span><i class="sim"></i>Simulasi TKA / Pos Tes</span><span><i class="libur"></i>Libur</span><span><i class="rehat"></i>Rehat</span><span><i class="hariH"></i>Hari H</span></div></div>

    <div class="kartu"><h2 class="rc-h2">📊 Ringkasan rencana</h2>
      <div class="rc-ringkas">${PULAU_TKA.map(pl => { const p = cariPulau(pl), sl = sisaLevel(pl).length, tot = MISI.filter(m => m.pulau === pl).length * 10, sm = paketTKA(pl).filter(t => terbaikTes(t.id) >= TES_TUNTAS).length;
        return `<div class="rc-mapel"><b>${p.ikon} ${p.judul}</b><div class="batang"><i style="width:${Math.round((tot - sl) / tot * 100)}%"></i></div><span class="ket">${tot - sl}/${tot} level · simulasi tuntas ${sm}/${PAKET_TKA}</span></div>`; }).join("")}
        ${(() => { const semua = unitInggrisSemua(), sisa = sisaInggris().reduce((s, x) => s + x.biaya, 0), p = Math.round((semua - sisa) / semua * 100), a = aturRencana();
          return `<div class="rc-mapel"><b>🌍 Bahasa Inggris <small class="ket">(materi tambahan)</small></b><div class="batang"><i style="width:${p}%"></i></div>
            <span class="ket">${p}% dari target "${CAKUPAN_ING.find(c => c[0] === a.ingSampai)[1].replace("&", "&amp;")}" · ${a.ingTarget ? `target selesai <b>${tglIndo(r.ing.batas)}</b> · latihan ${a.ingHari.map(i => HARI_SINGKAT[i]).join(", ")}` : "belum masuk rencana"}</span></div>`; })()}</div>
      <ul class="ket rc-catatan">
        <li>⏱️ Waktu belajar <b>${r.menit} menit</b> sehari (±${r.kapasitas} level) · hari belajar ${aturRencana().hari.map(i => HARI_SINGKAT[i]).join(", ")}${r.tka ? ` · hari simulasi ${aturRencana().sim.map(i => HARI_SINGKAT[i]).join(", ") || "–"}` : ""}.</li>
        ${r.tka ? `<li>🎯 Target <b>${r.target} level</b> per hari belajar${r.selesaiMateri ? ` · materi selesai sekitar <b>${tglIndo(r.selesaiMateri)}</b>` : r.total ? "" : " · semua materi sudah selesai 🎉"}.</li>` : `<li>🗓️ Tanggal TKA belum diisi atau sudah lewat: rencana hanya untuk program Bahasa Inggris.</li>`}
        ${r.posTes.length || r.posLebih ? `<li>📝 Pos Tes terjadwal: ${r.posTes.map(p => `<b>${judulTes(cariTes(p.tid))} ${cariPulau(cariTes(p.tid).pulau).judul}</b> ${tglRingkas(p.tgl)}`).join(", ") || "–"}${r.posLebih ? ` (${r.posLebih} belum kebagian hari)` : ""}. Pos Tes dijadwalkan begitu semua misi di pos itu selesai; hari itu hanya Pos Tes (75 menit).</li>` : ""}
        ${r.tka && r.sims ? `<li>📝 ${r.sims} paket Simulasi TKA dijadwalkan mulai <b>${r.awalSim ? tglIndo(r.awalSim) : "–"}</b>${r.simLebih ? ` (${r.simLebih} paket belum kebagian hari — tambah hari simulasi)` : ""}.</li>` : ""}
        ${r.ing ? (r.ing.sisa ? `<li class="rc-awas">⚠️ Bahasa Inggris tidak cukup waktu sampai ${tglIndo(r.ing.batas)}: perlu ±${r.ing.perlu} tugas per hari latihan (±${r.ing.menitPerlu} menit khusus Bahasa Inggris), sedangkan waktunya ±${r.kapasitas} tugas sehari${r.tka && r.total ? " (sebelum TKA hanya separuh, karena materi TKA diutamakan)" : ""}.
            Dengan pengaturan sekarang, Bahasa Inggris selesai sekitar <b>${r.ing.perkiraan ? tglIndo(r.ing.perkiraan) : "lebih dari 20 tahun lagi"}</b>. Mundurkan target, tambah hari latihan, atau tambah menit belajar.</li>`
          : `<li>🌍 Bahasa Inggris: ±${r.ing.kuota} tugas per hari latihan (${r.ing.hari} hari)${r.ing.selesai ? `, selesai sekitar <b>${tglIndo(r.ing.selesai)}</b>` : ""}. Satu sub level Dengar &amp; Baca dihitung 2 tugas.</li>`)
          : `<li>🌍 Bahasa Inggris belum masuk rencana. Isi <b>Target selesai Bahasa Inggris</b> di Orang Tua → Pengaturan untuk menjadwalkannya.</li>`}
        ${r.tka && r.sisaTakTerbagi ? `<li class="rc-awas">⚠️ Waktunya belum cukup: ${r.sisaTakTerbagi} level belum terjadwal. Perlu ±${r.perlu} level sehari — tambah menit belajar atau hari belajar di <b>Orang Tua → Pengaturan</b>.</li>` : ""}
        <li>💡 Rencana menyesuaikan setiap hari. Hari yang terlewat dibagi otomatis ke hari berikutnya.</li></ul>
      <button class="tbl tbl-putih tbl-lebar" data-ke="ortu">⚙️ Ubah waktu &amp; hari belajar (Orang Tua)</button></div>`;
  pasangTabungan();
  layar.querySelectorAll("[data-tugas]").forEach(b => b.addEventListener("click", () => { bunyi.klik(); mulaiTugas(th.tugas[+b.dataset.tugas]); }));
  const kal = layar.querySelector("#rc-kalender");
  kal.addEventListener("click", e => { const b = e.target.closest("[data-tgl]"); if (!b) return; bunyi.klik(); pilihTgl = b.dataset.tgl;
    kal.querySelectorAll(".dipilih").forEach(x => x.classList.remove("dipilih")); b.classList.add("dipilih"); tampilDetail(r, pilihTgl); });
  const lipat = layar.querySelector("#rc-lipat-semua"), semua = () => [...kal.querySelectorAll("details")];
  const segarLipat = () => { lipat.textContent = semua().every(d => d.open) ? "Tutup semua" : "Buka semua"; };
  lipat.addEventListener("click", () => { bunyi.klik(); const buka = !semua().every(d => d.open); semua().forEach(d => (d.open = buka)); segarLipat(); });
  kal.addEventListener("toggle", segarLipat, true);
  tampilDetail(r, pilihTgl && pilihTgl >= hariIni() && pilihTgl <= r.akhir ? pilihTgl : hariIni());
}
/* ---------- Garis waktu (dua kartu terpisah: TKA dan program Bahasa Inggris) ---------- */
function htmlGaris(mulai, ujung, seg, titik, bendera, tengah) {
  const panjang = Math.max(1, selisihHari(mulai, ujung)), pos = t => Math.max(0, Math.min(100, selisihHari(mulai, t) / panjang * 100)), p = pos(hariIni());
  seg = seg.filter(([, a, b]) => b > a);
  return `<div class="rc-garis">${seg.map(([k, a, b, nm]) => `<div class="rc-seg ${k}" style="left:${pos(a)}%;width:${Math.max(0.6, pos(b) - pos(a))}%" title="${nm}"></div>`).join("")}
      ${titik.map(([tg, kls, nm]) => `<i class="${kls}" style="left:${pos(tg)}%" title="${nm}"></i>`).join("")}
      ${tengah && pos(tengah[0]) < 96 ? `<span class="rc-bendera-tengah" style="left:${pos(tengah[0])}%" title="${tengah[2]}">${tengah[1]}</span>` : ""}
      <div class="rc-kini ${p < 12 ? "kiri" : p > 88 ? "kanan" : ""}" style="left:${p}%"><span>Hari ini</span></div><div class="rc-bendera">${bendera}</div></div>
    <div class="rc-legenda">${seg.filter(s => s[0] !== "lewat").map(([k, a, b, nm]) => `<span><i class="${k}"></i>${nm} <small>${tambahHari(b, -1) <= a ? tglRingkas(a) : `${tglRingkas(a)}–${tglRingkas(tambahHari(b, -1))}`}</small></span>`).join("")}</div>`;
}
function garisTKA(r) {
  const aw = S.rencanaAwal, mulai = aw && aw.tgl < hariIni() ? aw.tgl : hariIni(), akhirMateri = r.selesaiMateri ? tambahHari(r.selesaiMateri, 1) : hariIni();
  const awalSim = r.awalSim || tambahHari(r.tka, -1), rehat = tambahHari(r.tka, -1), mSim = awalSim < akhirMateri ? akhirMateri : awalSim, sims = r.hari.filter(h => h.jenis === "sim" && !h.posTes);
  return `<div class="kartu"><h2 class="rc-h2">🗺️ Perjalanan menuju TKA</h2>
    ${htmlGaris(mulai, tambahHari(r.tka, 1), [["lewat", mulai, hariIni(), "Sudah dilalui"], ["materi", hariIni(), akhirMateri, "Kuasai materi"], ["ulang", akhirMateri, mSim, "Ulang materi"],
      ["sim", mSim, rehat, "Simulasi TKA"], ["rehat", rehat, r.tka, "Rehat"], ["hariH", r.tka, tambahHari(r.tka, 1), "Hari TKA"]], sims.map(h => [h.tgl, "rc-titik-sim", "Simulasi TKA " + tglIndo(h.tgl)]), "🏁")}
    ${r.awalSim ? `<p class="ket" style="margin:6px 0 0">🟣 Titik ungu = hari Simulasi TKA (${sims.length} hari, mulai ${tglIndo(r.awalSim)}).</p>` : ""}</div>`;
}
function garisIng(r) {
  const aw = S.rencanaAwalIng, mulai = aw && aw.tgl < hariIni() ? aw.tgl : hariIni(), selesai = r.ing && r.ing.selesai ? tambahHari(r.ing.selesai, 1) : hariIni(), ujung = tambahHari(r.ingT, 1);
  const bersama = r.tka && r.tka < r.ingT ? (selesai < r.tka ? selesai : r.tka) : null, adaTKA = r.tka && r.total;
  const seg = [["lewat", mulai, hariIni(), "Sudah dilalui"]];
  if (bersama && adaTKA) seg.push(["ingTKA", hariIni(), bersama, "Bersama persiapan TKA (separuh waktu)"], ["ing", tambahHari(r.tka, 1), selesai, "Fokus Bahasa Inggris"]);
  else seg.push(["ing", hariIni(), selesai, "Latihan Bahasa Inggris"]);
  seg.push(["cadangan", selesai, ujung, "Cadangan sebelum target"]);
  return `<div class="kartu"><h2 class="rc-h2">🌍 Perjalanan program Bahasa Inggris</h2>
    ${htmlGaris(mulai, ujung, seg, [], "🎓", r.tka && r.tka < r.ingT ? [r.tka, "🏁", "TKA " + tglIndo(r.tka)] : null)}
    <p class="ket" style="margin:6px 0 0">🎓 Target selesai <b>${tglIndo(r.ingT)}</b>${r.ing && r.ing.selesai ? ` · menurut jadwal selesai ${tglIndo(r.ing.selesai)}` : ""}${r.tka && r.tka < r.ingT ? " · 🏁 = hari TKA" : ""}.</p></div>`;
}
/* ---------- Tabungan belajar: anak memilih memakai kelebihannya ---------- */
function kartuTabungan(r, sj) {
  if (!r.tka) return "";
  const tab = Math.max(0, sj ? sj.selisih : 0), per = Math.max(1, r.target || 1), cukup = Math.floor(tab / per), mode = alatTabungan, pilih = liburPilihan(), cepat = cepatPilihan();
  const calon = r.hari.filter(h => h.tgl < tambahHari(hariIni(), 14) && (h.jenis === "belajar" || h.piknik)).slice(0, 12);
  return `<div class="kartu rc-tabungan"><div class="rc-judul"><h2 class="rc-h2">💰 Tabungan belajar</h2><span class="rc-tab-angka ${tab ? "ada" : ""}">${tab} level</span></div>
    <p class="ket" style="margin:0 0 10px">${tab ? `Kamu sudah <b>lebih cepat ${tab} level</b> dari jadwal. Hebat! Kamu boleh memilih cara memakainya.` : "Kerjakan lebih dari target harian untuk menabung. Tabungan bisa dipakai untuk hari libur (misalnya piknik) atau untuk menyelesaikan materi lebih cepat."}</p>
    <div class="rc-mode" role="radiogroup" aria-label="Cara memakai tabungan">
      <button type="button" role="radio" aria-checked="${mode === "libur"}" data-mode="libur"><b>🌴 Ringankan &amp; boleh libur</b><span>Ketuk tanggal untuk menjadikannya hari libur. Ketuk lagi untuk membatalkan.</span></button>
      <button type="button" role="radio" aria-checked="${mode === "cepat"}" data-mode="cepat"><b>🚀 Percepat selesai</b><span>Ketuk tanggal: hari libur kembali normal, hari normal jadi hari cepat (+1 level TKA dan +1 level Bahasa Inggris).</span></button></div>
    <h3 class="rc-sub">📅 Pilih tanggal (14 hari ke depan)</h3>
    <p class="ket" style="margin:0 0 8px">${mode === "libur" ? "🌴 Ketuk tanggal yang ingin kamu liburkan." : mode === "cepat" ? "🚀 Ketuk tanggal yang ingin kamu percepat, atau hari libur yang ingin kamu batalkan." : "Semua hari normal sesuai rencana. Pilih 🌴 atau 🚀 di atas, lalu ketuk tanggalnya."}</p>
    <div class="rc-libur-pilih">${calon.map(h => `<button type="button" data-libur="${h.tgl}" class="${h.piknik ? "libur" : h.cepat ? "cepat" : ""}" aria-pressed="${h.piknik || h.cepat}"><span>${HARI_SINGKAT[h.w]}</span><b>${+h.tgl.slice(8)}</b><i>${h.piknik ? "🌴" : h.cepat ? "🚀" : h.jenis === "sim" ? "📝" : jumlahButir(h) || ""}</i></button>`).join("") || '<span class="ket">Tidak ada hari belajar dalam 14 hari ke depan.</span>'}</div>
    <p class="ket" style="margin:8px 0 0">${pilih.length ? `🌴 Hari libur pilihanmu: <b>${pilih.map(x => `${HARI_SINGKAT[hariKe(x)]} ${tglRingkas(x)}`).join(", ")}</b>. ` : ""}${cepat.length ? `🚀 Hari cepat: <b>${cepat.map(x => `${HARI_SINGKAT[hariKe(x)]} ${tglRingkas(x)}`).join(", ")}</b>. ` : ""}${tab ? `Tabunganmu cukup untuk ±<b>${cukup} hari libur</b> tanpa menambah target hari lain.` : "Belum ada tabungan: bila tetap libur, target hari lain sedikit naik."}${pilih.length > cukup ? " ⚠️ Libur pilihanmu lebih banyak dari tabungan, jadi target beberapa hari lain sedikit naik." : ""}</p></div>`;
}
function pasangTabungan() {
  const k = layar.querySelector(".rc-tabungan"); if (!k) return;
  k.addEventListener("click", e => {
    const m = e.target.closest("[data-mode]"), l = e.target.closest("[data-libur]");
    if (m) { bunyi.klik(); alatTabungan = alatTabungan === m.dataset.mode ? null : m.dataset.mode;
      tampilPesan(alatTabungan === "libur" ? "🌴 Ketuk tanggal yang ingin kamu liburkan" : alatTabungan === "cepat" ? "🚀 Ketuk tanggal yang ingin kamu percepat" : "Semua hari tetap sesuai pilihanmu"); lRencana(); }
    if (l) { bunyi.klik(); const tg = l.dataset.libur, lib = new Set(liburPilihan()), cep = new Set(cepatPilihan()), nama = `${HARI_PENUH[hariKe(tg)]} ${tglIndo(tg)}`;
      if (!alatTabungan) { tampilPesan("Pilih dulu 🌴 Ringankan atau 🚀 Percepat di atas, lalu ketuk tanggalnya"); return; }
      let pesan;
      if (alatTabungan === "libur") { if (lib.has(tg)) { lib.delete(tg); pesan = `Libur dibatalkan, ${nama} kembali normal`; } else { lib.add(tg); cep.delete(tg); pesan = `🌴 ${nama} jadi hari libur`; } }
      else if (lib.has(tg)) { lib.delete(tg); pesan = `${nama} kembali normal sesuai rencana`; }
      else if (cep.has(tg)) { cep.delete(tg); pesan = `${nama} kembali normal sesuai rencana`; }
      else { cep.add(tg); pesan = `🚀 ${nama} jadi hari cepat: +1 level TKA dan +1 level Bahasa Inggris`; }
      S.liburPilihan = [...lib].sort(); S.cepatPilihan = [...cep].sort(); S.waktu = { ...(S.waktu || {}), rencana: Date.now() }; simpanData();
      tampilPesan(pesan); lRencana(); }
  });
}
const tglRingkas = t => { const [y, m, d] = t.split("-").map(Number); return `${d} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][m - 1]}${y !== new Date().getFullYear() ? " " + y : ""}`; };
function mingguIni(r) {
  const senin = tambahHari(hariIni(), -hariKe(hariIni())), a = aturRencana();
  return Array.from({ length: 7 }, (_, i) => { const tgl = tambahHari(senin, i), kini = tgl === hariIni(), dulu = tgl < hariIni(), h = r.hari.find(x => x.tgl === tgl);
    let ikon, ket, kls;
    if (dulu) { const lg = logHari(tgl).filter(x => x.lulus).length, ts = Object.values(S.posTes || {}).flat().some(x => hariIni(new Date(x.t)) === tgl);
      if (lg || ts) { ikon = "✅"; ket = ts ? "tes" : `${lg} level`; kls = "ok"; } else if (a.hari.includes(i) || a.sim.includes(i)) { ikon = "✖"; ket = "terlewat"; kls = "lewat"; } else { ikon = "😴"; ket = "libur"; kls = "libur"; } }
    else if (tgl === r.tka) { ikon = "🏁"; ket = "TKA"; kls = "hariH"; }
    else if (!h) { ikon = "·"; ket = ""; kls = "kosong"; }
    else { const nL = jumlahButir(h);
      ikon = h.piknik ? "🌴" : h.cepat ? "🚀" : h.jenis === "sim" ? "📝" : h.jenis === "bebas" ? "🎉" : h.jenis === "libur" ? "😴" : h.jenis === "rehat" ? "😌" : nL ? "📘" : "🔁"; ket = h.piknik ? "libur pilihan" : h.posTes ? "Pos Tes" : h.jenis === "sim" ? "simulasi" : h.jenis === "bebas" ? "bebas" : h.jenis === "libur" ? "libur" : h.jenis === "rehat" ? "rehat" : nL ? `${nL} tugas` : "ulang"; kls = h.jenis + (h.cepat ? " cepat" : ""); }
    return `<div class="rc-hari ${kls} ${kini ? "kini" : ""}"><span class="rc-hari-nama">${HARI_SINGKAT[i]}</span><span class="rc-hari-tgl">${+tgl.slice(8)}</span><span class="rc-hari-ikon">${ikon}</span><span class="rc-hari-ket">${ket}</span></div>`; }).join("");
}
/* Kalender dilipat per bulan (12 Okt 2026): bulan ini terbuka, bulan lain hanya judul & ringkasan; rincian tanggal
   tampil di dalam bulannya sendiri supaya tidak perlu menggulir jauh */
const NAMA_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
function kalenderRencana(r) {
  const peta = Object.fromEntries(r.hari.map(h => [h.tgl, h])), awal = hariIni(), akhir = r.akhir, bulanBuka = (pilihTgl && pilihTgl >= awal && pilihTgl <= akhir ? pilihTgl : awal).slice(0, 7);
  let html = "";
  for (let b = awal.slice(0, 7); b <= akhir.slice(0, 7); b = tambahHari(b + "-01", 32).slice(0, 7)) {
    const [y, m] = b.split("-").map(Number), jml = new Date(y, m, 0).getDate(), di = r.hari.filter(h => h.tgl.startsWith(b));
    const nB = di.filter(h => h.jenis === "belajar").length, nS = di.filter(h => h.jenis === "sim").length;
    const nL = di.reduce((s, h) => s + jumlahButir(h), 0);
    html += `<details class="rc-lipat" data-bulan="${b}" ${b === bulanBuka ? "open" : ""}><summary><span class="rc-bulan-nama">${NAMA_BULAN[m - 1]} ${y}</span>
      <span class="rc-bulan-ring">${nB ? `<span>📘 ${nB} hari${nL ? ` · ${nL} tugas` : ""}</span>` : ""}${nS ? `<span>📝 ${nS}</span>` : ""}${r.tka && b === r.tka.slice(0, 7) ? "<span>🏁 TKA</span>" : ""}${r.ingT && b === r.ingT.slice(0, 7) ? "<span>🎓 target B. Inggris</span>" : ""}</span></summary>
      <div class="rc-kal">${HARI_SINGKAT.map(x => `<span class="rc-nama">${x}</span>`).join("")}${'<span class="rc-tg luar"></span>'.repeat(hariKe(b + "-01"))}`;
    for (let d = 1; d <= jml; d++) {
      const t = `${b}-${String(d).padStart(2, "0")}`, h = peta[t];
      if (t < awal || t > akhir) { html += `<span class="rc-tg ${t < awal ? "dulu" : "luar"}">${t < awal ? d : ""}</span>`; continue; }
      const kls = t === r.tka ? "hariH" : h ? h.jenis : "luar", n = h ? jumlahButir(h) : 0;
      html += `<button type="button" class="rc-tg ${kls} ${t === awal ? "kini" : ""} ${t === pilihTgl ? "dipilih" : ""}" data-tgl="${t}" aria-label="${tglIndo(t)}">${d}${h && h.piknik ? "<i>🌴</i>" : h && h.cepat ? `<i>🚀${n || ""}</i>` : kls === "sim" ? "<i>📝</i>" : kls === "hariH" ? "<i>🏁</i>" : n ? `<i>${n}</i>` : ""}</button>`;
    }
    html += `</div><div class="rc-detail" data-detail="${b}"></div></details>`;
  }
  return html;
}
function tampilDetail(r, tgl) {
  layar.querySelectorAll(".rc-detail").forEach(x => (x.innerHTML = ""));
  const el = layar.querySelector(`.rc-detail[data-detail="${tgl.slice(0, 7)}"]`); if (!el) return;
  el.closest("details").open = true;
  const h = r.hari.find(x => x.tgl === tgl);
  const isi = tgl === r.tka ? "<p>🏁 <b>Hari TKA!</b> Sarapan, datang lebih awal, baca soal pelan-pelan, dan periksa kembali jawabanmu.</p>"
    : !h ? "" : h.piknik ? "<p>🌴 <b>Libur pilihanmu.</b> Selamat bersenang-senang! Batalkan di kartu Tabungan belajar bila jadi belajar.</p>" : h.jenis === "bebas" ? "<p>🎉 Tidak ada target (sudah tercapai lebih awal).</p>" : h.jenis === "libur" ? "<p>😴 Libur belajar. Istirahat dan bermain.</p>" : h.jenis === "rehat" ? "<p>😌 Rehat sebelum TKA: tidur cukup, siapkan alat tulis, jangan belajar terlalu berat.</p>"
      : (h.cepat ? "<p>🚀 <b>Hari cepat pilihanmu:</b> +1 level TKA dan +1 level Bahasa Inggris. Batalkan di kartu Tabungan belajar.</p>" : "") + `<ul>${h.tugas.map(t => { const x = teksTugas(t); return `<li><span>${x.ikon}</span><span><b>${x.judul}</b><small>${x.sub}</small></span></li>`; }).join("")}</ul>`;
  el.innerHTML = `<div class="rc-detail-judul">${HARI_PENUH[hariKe(tgl)]}, ${tglIndo(tgl)}${tgl === hariIni() ? " · hari ini" : ""}</div>${isi}`;
}

/* ---------- Dasbor Ortu: target vs kemajuan nyata (12 Okt 2026) ---------- */
function batangBanding(label, harap, nyata, satuan) {
  const maks = Math.max(1, harap, nyata);
  return `<div class="rc-banding"><div class="rc-banding-judul">${label}</div>
    <div class="rc-banding-baris"><span>Target</span><div class="rc-bb"><i class="target" style="width:${harap / maks * 100}%"></i></div><b>${harap} ${satuan}</b></div>
    <div class="rc-banding-baris"><span>Nyata</span><div class="rc-bb"><i class="nyata ${nyata >= harap ? "ok" : ""}" style="width:${nyata / maks * 100}%"></i></div><b>${nyata} ${satuan}</b></div></div>`;
}
function htmlRencanaOrtu() {
  const r = buatRencana();
  if (r.status !== "ok") return `<div class="kartu"><h3>📅 Target vs kemajuan nyata</h3><p class="ket" style="margin:6px 0 0">${r.status === "tanpa" ? "Belum ada rencana. Isi <b>tanggal TKA</b> atau <b>target Bahasa Inggris</b> di tab Pengaturan, lalu target harian anak dibuat otomatis." : "Tidak ada rencana aktif (tanggal TKA sudah lewat)."}</p></div>`;
  const { n, sel } = catatHarian(r), a = aturRencana(), sj0 = r.tka ? statusJadwal(r) : null, si0 = statusIng(r);
  const sj = sj0 && targetHariIni(r, sj0, "tka"), si = si0 && targetHariIni(r, si0, "ing");
  // 14 hari terakhir (sampai hari ini)
  const cat = S.rencanaCatatan || {}, baris = [];
  for (let k = 13; k >= 0; k--) {
    const tg = tambahHari(hariIni(), -k), c = cat[tg], w = hariKe(tg), lv = logHari(tg).filter(x => x.lulus).length, kini = k === 0;
    const pilihan = (S.liburPilihan || []).includes(tg), belajar = a.hari.includes(w) || a.sim.includes(w);
    let ket, kls; const mulaiRencana = [S.rencanaAwal && S.rencanaAwal.tgl, S.rencanaAwalIng && S.rencanaAwalIng.tgl].filter(Boolean).sort()[0] || hariIni();
    if (!c && tg < mulaiRencana) { ket = lv ? "✨ belajar (sebelum rencana)" : "· sebelum ada rencana"; kls = lv ? "ok" : "libur"; }
    else if (c && c.t) { ket = c.s >= c.t ? "✅ tercapai" : c.s ? `🟡 ${Math.round(c.s / c.t * 100)}%` : kini ? "⏳ belum" : "✖ tidak"; kls = c.s >= c.t ? "ok" : c.s ? "sebagian" : kini ? "" : "tidak"; }
    else if (pilihan) { ket = "🌴 libur pilihan"; kls = "libur"; }
    else if (!belajar || (c && !c.t)) { ket = lv ? "✨ belajar ekstra" : "😴 libur"; kls = lv ? "ok" : "libur"; }
    else { ket = lv ? "✅ belajar" : kini ? "⏳ belum dibuka" : "✖ tidak dibuka"; kls = lv ? "ok" : kini ? "" : "tidak"; }
    baris.push(`<tr class="${kls} ${kini ? "kini" : ""}"><td>${HARI_SINGKAT[w]} ${tglRingkas(tg)}</td><td class="angka">${c && c.t ? c.t : "–"}</td><td class="angka">${c && c.t ? c.s : "–"}<small>${lv ? ` · ${lv} level lulus` : ""}</small></td><td>${ket}</td></tr>`);
  }
  const tercapai = Object.entries(cat).filter(([k, c]) => k >= tambahHari(hariIni(), -13) && k < hariIni() && c.t), pctHari = tercapai.length ? Math.round(tercapai.filter(([, c]) => c.s >= c.t).length / tercapai.length * 100) : null;
  return `<div class="kartu rc-ortu"><div class="rc-judul"><h3>📅 Target vs kemajuan nyata</h3><button class="tbl tbl-putih tbl-kecil" data-ke="rencana">Lihat rencana ▶</button></div>
    <div class="rc-ortu-ringkas">
      ${r.tka ? `<div><b>H-${selisihHari(hariIni(), r.tka)}</b>menuju TKA</div><div><b>${kesiapan(r)}%</b>siap TKA</div>` : ""}
      <div><b>${n ? `${sel}/${n}` : "–"}</b>target hari ini</div>${pctHari !== null ? `<div><b>${pctHari}%</b>hari target tercapai (14 hari)</div>` : ""}</div>
    ${r.tka ? `${batangBanding(`📘 Matematika &amp; Bahasa Indonesia · sejak ${tglRingkas(sj.sejak)} <span class="rc-chip-kecil ${sj.kls}">${sj.teks}</span>`, sj.harap, sj.dikerjakan, "level")}
      <p class="ket" style="margin:4px 0 10px">Target ${r.target} level per hari belajar · materi selesai sekitar <b>${r.selesaiMateri ? tglIndo(r.selesaiMateri) : "–"}</b> · simulasi TKA tuntas ${PULAU_TKA.reduce((s, pl) => s + paketTKA(pl).filter(x => terbaikTes(x.id) >= TES_TUNTAS).length, 0)}/${PAKET_TKA * 2}${cepatPilihan().length ? ` · 🚀 ${cepatPilihan().length} hari cepat dipilih anak` : ""}.</p>` : ""}
    ${si ? `${batangBanding(`🌍 Bahasa Inggris · sejak ${tglRingkas(si.sejak)} <span class="rc-chip-kecil ${si.kls}">${si.teks}</span>`, si.harap, si.dikerjakan, "tugas")}
      <p class="ket" style="margin:4px 0 10px">Target selesai <b>${tglIndo(r.ingT)}</b> (${CAKUPAN_ING.find(c => c[0] === a.ingSampai)[1].replace("&", "&amp;")})${r.ing.sisa ? " · ⚠️ belum muat dengan waktu sekarang" : r.ing.selesai ? ` · menurut jadwal selesai ${tglIndo(r.ing.selesai)}` : ""}. Sub level Dengar &amp; Baca = 2 tugas.</p>` : ""}
    <p class="ket" style="margin:0 0 10px">🎯 Target = kemajuan sampai kemarin + tugas hari ini.${sj0 ? ` Dibanding jadwal sejak ${tglRingkas(sj0.sejak)}: ${sj0.teks.replace(/ — .*/, "")}.` : ""}</p>
    ${(() => { const x = tesBerikut(r, 2), R = remediAktif(r.hari, r.tka, r.ingT); if (!x.length && !R.length) return "";
      return `<p class="ket" style="margin:0 0 10px">${x.length ? `📝 Tes berikutnya: ${x.map(({ h, t }) => `<b>${namaTes(t)}</b> ${HARI_SINGKAT[h.w]} ${tglRingkas(h.tgl)}${riwayatTes(t.id).length ? " (ulang)" : ""}`).join(", ")}. Hari tes akhir pekan dipilih anak (Sabtu/Minggu).` : ""}${R.map(z => ` 🔧 Sesi tambahan ${namaTes(z.t)} (nilai ${z.c.nilai}) sampai tes ulang ${tglRingkas(z.sampai)}.`).join("")}</p>`; })()}
    <h4 class="rc-sub">Catatan 14 hari terakhir</h4>
    <div style="overflow-x:auto"><table class="tabel-laporan rc-tabel-harian"><thead><tr><th>Hari</th><th>Target</th><th>Dikerjakan</th><th>Hasil</th></tr></thead><tbody>${baris.join("")}</tbody></table></div>
    <p class="ket" style="margin:8px 0 0">Target dicatat saat aplikasi dibuka pada hari itu. ${liburPilihan().length ? `Libur pilihan anak berikutnya: <b>${liburPilihan().map(x => `${HARI_SINGKAT[hariKe(x)]} ${tglRingkas(x)}`).join(", ")}</b>. ` : ""}${cepatPilihan().length ? `Hari cepat (+1 level TKA &amp; B. Inggris): <b>${cepatPilihan().map(x => `${HARI_SINGKAT[hariKe(x)]} ${tglRingkas(x)}`).join(", ")}</b>. ` : ""}Waktu belajar ${a.menit} menit/hari · hari belajar ${a.hari.map(i => HARI_SINGKAT[i]).join(", ")}.</p></div>`;
}
