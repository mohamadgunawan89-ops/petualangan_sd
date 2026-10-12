/* Rencana Belajar menuju hari TKA (12 Okt 2026)
   ---------------------------------------------------------------
   Rencana disusun ULANG setiap hari dari kemajuan nyata (jadi hari yang terlewat otomatis dibagi ke hari berikutnya):
   - Pekerjaan = sisa level misi Matematika & Bahasa Indonesia (mapel TKA) + paket Simulasi TKA yang belum tuntas.
   - Hari: belajar (hari belajar pilihan orang tua), simulasi (hari simulasi; satu paket 75 menit, menjelang TKA),
     libur, dan rehat (H-1: istirahat & menyiapkan perlengkapan).
   - Target level per hari = sisa level dibagi hari belajar (7 hari belajar terakhir untuk mengulang materi lemah),
     paling banyak sesuai menit belajar per hari (≈ 1,3 menit per soal).
   Pengaturan (S.atur): menitHarian, hariBelajar [0=Senin…6=Minggu], hariSimulasi.
   S.rencanaAwal (ikut sinkron): titik awal untuk menilai "sesuai jadwal". S.rencanaHari (perangkat ini): daftar
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
const simBelum = () => { const P = PULAU_TKA.map(pl => paketTKA(pl).filter(t => terbaikTes(t.id) < TES_TUNTAS)), r = [];
  for (let i = 0; i < PAKET_TKA; i++) P.forEach(x => x[i] && r.push(x[i])); return r; };
const totalLevelTKA = () => MISI.filter(m => PULAU_TKA.includes(m.pulau)).length * 10;

/* Tabungan belajar (12 Okt 2026): kelebihan dari jadwal diserahkan ke anak — dipakai untuk hari libur pilihan
   (S.liburPilihan, mis. piknik) atau mode "percepat" (S.rencanaMode: target harian awal dipertahankan supaya materi
   selesai lebih cepat). Bawaan "ringan": kelebihan meringankan target harian berikutnya. Keduanya ikut tersinkron. */
const modeRencana = () => (S.rencanaMode === "percepat" ? "percepat" : "ringan");
const liburPilihan = () => (S.liburPilihan || []).filter(t => t >= hariIni());
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
  // Simulasi: paket yang belum tuntas ditaruh di hari simulasi terakhir sebelum H-1, berurutan dari paket 1
  const sims = tka ? simBelum() : [], calon = hari.filter(h => h.jenis === "calon");
  let pakai = calon.slice(-sims.length); if (sims.length > calon.length) pakai = calon;
  const perHari = pakai.length ? Math.min(2, Math.ceil(sims.length / pakai.length)) : 0; let si = 0;
  pakai.forEach(h => { for (let k = 0; k < perHari && si < sims.length; k++) h.tugas.push({ jenis: "sim", tid: sims[si++].id }); if (h.tugas.length) h.jenis = "sim"; });
  const simLebih = sims.length - si;
  hari.forEach(h => { if (h.jenis === "calon") h.jenis = "belajar"; });
  const belajar = hari.filter(h => h.jenis === "belajar"), kapasitas = Math.max(1, Math.floor(a.menit / menitPerLevel()));
  const sisaCap = new Map(belajar.map(h => [h, kapasitas]));
  // Bahasa Inggris dulu (punya tanggal target): jatah harian = sisa pekerjaan dibagi hari latihan sampai tanggal target
  let ing = null;
  const adaTKA = !!tka && PULAU_TKA.some(pl => sisaLevel(pl).length);
  // Sebelum TKA (selama materi TKA masih ada) Bahasa Inggris paling banyak separuh waktu; sesudah TKA seluruh waktu
  const maksHari = tgl => (adaTKA && tgl < tka ? Math.max(1, Math.floor(kapasitas / 2)) : kapasitas);
  if (ingT) {
    const E = sisaInggris(), EU = E.reduce((s, x) => s + x.biaya, 0);
    const hariE = belajar.filter(h => h.tgl <= ingT && a.ingHari.includes(h.w)), rata = hariE.length ? Math.ceil(EU / hariE.length) : EU;
    let ei = 0; const pakai = new Map();
    const isi = (h, batasH) => { let p = pakai.get(h) || 0; while (ei < E.length && p < batasH) { tambahTugas(h, E[ei]); p += E[ei].biaya; ei++; } pakai.set(h, p); sisaCap.set(h, Math.max(0, kapasitas - p)); };
    // Laju merata sampai tanggal target: jatah kumulatif EU × (k+1)/N (bukan dibulatkan ke atas per hari)
    hariE.forEach((h, k) => { const kum = Math.ceil(EU * (k + 1) / hariE.length), sudah = E.slice(0, ei).reduce((s, x) => s + x.biaya, 0);
      isi(h, Math.min(maksHari(h.tgl), Math.max(0, kum - sudah))); });
    if (ei < E.length) hariE.forEach(h => isi(h, maksHari(h.tgl)));   // sisa: pakai jatah penuh hari itu
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
  const perlu = Math.ceil(total / efektif), tetap = modeRencana() === "percepat" && S.rencanaAwal && S.rencanaAwal.tka === S.tka ? S.rencanaAwal.target || 0 : 0;
  const target = Math.min(kapasitas, Math.max(perlu, tetap));   // percepat: target awal dipertahankan → materi selesai lebih cepat
  const ambilTKA = (h, n) => { const it = [];
    for (let k = 0; k < n && (Q[0].length || Q[1].length); k++) it.push(Q[!Q[1].length ? 0 : !Q[0].length ? 1 : (Q[0].length / awalQ[0] >= Q[1].length / awalQ[1] ? 0 : 1)].shift());
    it.sort((p, q) => (p.m === q.m ? p.L - q.L : 0)).forEach(x => tambahTugas(h, { jenis: "level", ...x })); sisaCap.set(h, sisaCap.get(h) - it.length); };
  belajarTKA.forEach(h => ambilTKA(h, Math.min(target, sisaCap.get(h))));
  if (Q[0].length || Q[1].length) belajarTKA.forEach(h => ambilTKA(h, sisaCap.get(h)));   // sisa: isi waktu yang masih kosong
  belajarTKA.forEach(h => { if (!h.tugas.length) h.tugas.push({ jenis: "ulang" }); });
  belajar.forEach(h => { if (!h.tugas.length) h.jenis = "bebas"; });   // sesudah TKA tanpa tugas: hari bebas
  const sisaTakTerbagi = Q[0].length + Q[1].length;
  const selesaiMateri = [...belajarTKA].reverse().find(h => h.tugas.some(t => t.jenis === "level" && PULAU_TKA.includes(cariMisi(t.m).pulau)));
  return { status: "ok", tka, ingT, akhir: tambahHari(ujung, -1), hari, total, target, kapasitas, perlu, simLebih, sisaTakTerbagi, menit: a.menit, selesaiMateri: selesaiMateri && selesaiMateri.tgl,
    awalSim: (hari.find(h => h.jenis === "sim") || {}).tgl, sims: sims.length, ing };
}

/* Titik awal rencana (untuk status "sesuai jadwal") — dibuat ulang bila tanggal TKA berubah */
function titikAwal(r) {
  const sudah = totalLevelTKA() - r.total;
  if (!S.rencanaAwal || S.rencanaAwal.tka !== S.tka || sudah < S.rencanaAwal.sudah) {
    S.rencanaAwal = { tgl: hariIni(), tka: S.tka, sudah, total: r.total, target: r.target, hariBelajar: r.hari.filter(h => h.jenis === "belajar" || h.piknik).length }; simpanData(false);
  }
  return S.rencanaAwal;
}
function statusJadwal(r) {
  const aw = titikAwal(r), sudahKini = totalLevelTKA() - r.total, dikerjakan = sudahKini - aw.sudah;
  const a = aturRencana(); let lewat = 0; for (let t = aw.tgl; t < hariIni(); t = tambahHari(t, 1)) if (a.hari.includes(hariKe(t))) lewat++;
  const harap = aw.hariBelajar ? Math.round(aw.total * Math.min(1, lewat / Math.max(1, aw.hariBelajar - 3))) : 0, selisih = dikerjakan - harap;
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
  const kunci = JSON.stringify([S.tka, aturRencana(), liburPilihan(), modeRencana()]);   // pengaturan berubah → susun ulang tugas hari ini
  if (!S.rencanaHari || S.rencanaHari.tgl !== h || S.rencanaHari.kunci !== kunci) {
    const d = r.hari && r.hari[0] && r.hari[0].tgl === h ? r.hari[0] : null;
    S.rencanaHari = { tgl: h, kunci, jenis: d ? d.jenis : "libur", tugas: d ? d.tugas : [] }; simpanData(false);
  }
  return S.rencanaHari;
}
const logHari = tgl => S.log.filter(x => hariIni(new Date(x.t)) === tgl);
function statusTugas(t) {
  if (t.jenis === "level") { const lv = dataMisi(t.m).lv, n = t.sampai - t.dari + 1, sel = Math.max(0, Math.min(n, lv - t.dari + 1)); return { n, sel, beres: sel >= n }; }
  if (t.jenis === "sub") { const s = ingLihat(t.m).s, n = t.sampai - t.dari + 1; let sel = 0; for (let i = t.dari; i <= t.sampai; i++) if (s[i] >= ING_LULUS_SUB) sel++;
    return { n, sel, beres: sel >= n || dataMisi(t.m).lv > 0 }; }
  if (t.jenis === "sim") { const hari = riwayatTes(t.tid).some(x => hariIni(new Date(x.t)) === hariIni()) || terbaikTes(t.tid) >= TES_TUNTAS; return { n: 1, sel: hari ? 1 : 0, beres: hari }; }
  const ada = logHari(hariIni()).length > 0 || (S.harian.tgl === hariIni() && S.harian.selesai); return { n: 1, sel: ada ? 1 : 0, beres: ada };
}
function teksTugas(t) {
  if (t.jenis === "level") { const m = cariMisi(t.m); return { ikon: m.ikon, judul: m.judul, sub: `${cariPulau(m.pulau).judul} · Level ${t.dari}${t.sampai > t.dari ? `–${t.sampai}` : ""}` }; }
  if (t.jenis === "sub") { const m = cariMisi(t.m), nm = NAMA_SUB[jenisIng(lvIng(t.m))];
    return { ikon: m.ikon, judul: m.judul, sub: `Bahasa Inggris · Dengar &amp; Baca · sub level ${t.dari + 1}${t.sampai > t.dari ? `–${t.sampai + 1}` : ` (${nm[t.dari]})`}` }; }
  if (t.jenis === "sim") { const s = cariTes(t.tid); return { ikon: "🎯", judul: judulTes(s), sub: `${cariPulau(s.pulau).judul} · ${TES_SOAL} soal · ${TES_MENIT} menit` }; }
  return { ikon: "🔁", judul: "Ulangi materi yang masih lemah", sub: "Kerjakan ulang level dengan bintang sedikit, atau Tantangan Harian" };
}
function mulaiTugas(t) {
  if (t.jenis === "sub") { const n = [0, 1, 2, 3, 4].find(i => i >= t.dari && ingLihat(t.m).s[i] < ING_LULUS_SUB);
    return n !== undefined && subTerbuka(t.m, n) ? mulaiSub(t.m, n) : tampil("latih", t.m); }
  if (t.jenis === "level") { const lv = dataMisi(t.m).lv; if (level1Terkunci(t.m)) return tampil("latih", t.m);
    return lv + 1 <= 10 ? mulaiLevel(t.m, Math.max(t.dari, lv + 1)) : tampil("jalur", t.m); }
  if (t.jenis === "sim") return tampil("postes", t.tid);
  const lemah = MISI.filter(m => PULAU_TKA.includes(m.pulau) && dataMisi(m.id).total >= 5).sort((a, b) => dataMisi(a.id).benar / dataMisi(a.id).total - dataMisi(b.id).benar / dataMisi(b.id).total)[0];
  return lemah ? tampil("jalur", lemah.id) : mulaiHarian();
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

    ${kartuTabungan(r, sj)}

    ${r.tka ? garisTKA(r) : ""}
    ${r.ingT ? garisIng(r) : ""}

    <div class="kartu"><h2 class="rc-h2">📆 Minggu ini</h2><div class="rc-minggu">${mingguIni(r)}</div></div>

    <div class="kartu"><div class="rc-judul"><h2 class="rc-h2">🗓️ Kalender belajar</h2><button type="button" class="tbl tbl-putih tbl-kecil" id="rc-lipat-semua">Buka semua</button></div>
      <p class="ket" style="margin:0 0 6px">Ketuk nama bulan untuk membuka atau menutup. Ketuk tanggal untuk melihat tugasnya.</p>
      <div id="rc-kalender">${kalenderRencana(r)}</div>
      <div class="rc-legenda kecil"><span><i class="belajar"></i>Belajar</span><span><i class="sim"></i>Simulasi TKA</span><span><i class="libur"></i>Libur</span><span><i class="rehat"></i>Rehat</span><span><i class="hariH"></i>Hari H</span></div></div>

    <div class="kartu"><h2 class="rc-h2">📊 Ringkasan rencana</h2>
      <div class="rc-ringkas">${PULAU_TKA.map(pl => { const p = cariPulau(pl), sl = sisaLevel(pl).length, tot = MISI.filter(m => m.pulau === pl).length * 10, sm = paketTKA(pl).filter(t => terbaikTes(t.id) >= TES_TUNTAS).length;
        return `<div class="rc-mapel"><b>${p.ikon} ${p.judul}</b><div class="batang"><i style="width:${Math.round((tot - sl) / tot * 100)}%"></i></div><span class="ket">${tot - sl}/${tot} level · simulasi tuntas ${sm}/${PAKET_TKA}</span></div>`; }).join("")}
        ${(() => { const semua = unitInggrisSemua(), sisa = sisaInggris().reduce((s, x) => s + x.biaya, 0), p = Math.round((semua - sisa) / semua * 100), a = aturRencana();
          return `<div class="rc-mapel"><b>🌍 Bahasa Inggris <small class="ket">(materi tambahan)</small></b><div class="batang"><i style="width:${p}%"></i></div>
            <span class="ket">${p}% dari target "${CAKUPAN_ING.find(c => c[0] === a.ingSampai)[1].replace("&", "&amp;")}" · ${a.ingTarget ? `target selesai <b>${tglIndo(r.ing.batas)}</b> · latihan ${a.ingHari.map(i => HARI_SINGKAT[i]).join(", ")}` : "belum masuk rencana"}</span></div>`; })()}</div>
      <ul class="ket rc-catatan">
        <li>⏱️ Waktu belajar <b>${r.menit} menit</b> sehari (±${r.kapasitas} level) · hari belajar ${aturRencana().hari.map(i => HARI_SINGKAT[i]).join(", ")}${r.tka ? ` · hari simulasi ${aturRencana().sim.map(i => HARI_SINGKAT[i]).join(", ") || "–"}` : ""}.</li>
        ${r.tka ? `<li>🎯 Target <b>${r.target} level</b> per hari belajar${r.selesaiMateri ? ` · materi selesai sekitar <b>${tglIndo(r.selesaiMateri)}</b>` : r.total ? "" : " · semua materi sudah selesai 🎉"}.</li>` : `<li>🗓️ Tanggal TKA belum diisi atau sudah lewat: rencana hanya untuk program Bahasa Inggris.</li>`}
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
  const awalSim = r.awalSim || tambahHari(r.tka, -1), rehat = tambahHari(r.tka, -1), mSim = awalSim < akhirMateri ? akhirMateri : awalSim, sims = r.hari.filter(h => h.jenis === "sim");
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
  const tab = Math.max(0, sj ? sj.selisih : 0), per = Math.max(1, r.target || 1), cukup = Math.floor(tab / per), mode = modeRencana(), pilih = liburPilihan();
  const calon = r.hari.filter(h => h.tgl < tambahHari(hariIni(), 14) && (h.jenis === "belajar" || h.piknik)).slice(0, 12);
  return `<div class="kartu rc-tabungan"><div class="rc-judul"><h2 class="rc-h2">💰 Tabungan belajar</h2><span class="rc-tab-angka ${tab ? "ada" : ""}">${tab} level</span></div>
    <p class="ket" style="margin:0 0 10px">${tab ? `Kamu sudah <b>lebih cepat ${tab} level</b> dari jadwal. Hebat! Kamu boleh memilih cara memakainya.` : "Kerjakan lebih dari target harian untuk menabung. Tabungan bisa dipakai untuk hari libur (misalnya piknik) atau untuk menyelesaikan materi lebih cepat."}</p>
    <div class="rc-mode" role="radiogroup" aria-label="Cara memakai tabungan">
      <button type="button" role="radio" aria-checked="${mode === "ringan"}" data-mode="ringan"><b>🌴 Ringankan &amp; boleh libur</b><span>Target harian berikutnya ikut ringan, dan kamu bisa memilih hari libur.</span></button>
      <button type="button" role="radio" aria-checked="${mode === "percepat"}" data-mode="percepat"><b>🚀 Percepat selesai</b><span>Target harian tetap ${S.rencanaAwal && S.rencanaAwal.target ? S.rencanaAwal.target + " level" : "seperti awal"}, materi selesai lebih cepat, waktu mengulang lebih banyak.</span></button></div>
    <h3 class="rc-sub">🌴 Pilih hari libur (14 hari ke depan)</h3>
    <div class="rc-libur-pilih">${calon.map(h => `<button type="button" data-libur="${h.tgl}" aria-pressed="${h.piknik}"><span>${HARI_SINGKAT[h.w]}</span><b>${+h.tgl.slice(8)}</b><i>${h.piknik ? "🌴" : h.jenis === "sim" ? "📝" : jumlahButir(h) || ""}</i></button>`).join("") || '<span class="ket">Tidak ada hari belajar dalam 14 hari ke depan.</span>'}</div>
    <p class="ket" style="margin:8px 0 0">${pilih.length ? `Hari libur pilihanmu: <b>${pilih.map(x => `${HARI_SINGKAT[hariKe(x)]} ${tglRingkas(x)}`).join(", ")}</b>. ` : ""}${tab ? `Tabunganmu cukup untuk ±<b>${cukup} hari libur</b> tanpa menambah target hari lain.` : "Belum ada tabungan: bila tetap libur, target hari lain sedikit naik."}${pilih.length > cukup ? " ⚠️ Libur pilihanmu lebih banyak dari tabungan, jadi target beberapa hari lain sedikit naik." : ""}</p></div>`;
}
function pasangTabungan() {
  const k = layar.querySelector(".rc-tabungan"); if (!k) return;
  k.addEventListener("click", e => {
    const m = e.target.closest("[data-mode]"), l = e.target.closest("[data-libur]");
    if (m) { bunyi.klik(); S.rencanaMode = m.dataset.mode; S.waktu = { ...(S.waktu || {}), rencana: Date.now() }; simpanData(); tampilPesan(m.dataset.mode === "percepat" ? "🚀 Mode percepat: target harian tetap, materi selesai lebih cepat" : "🌴 Mode ringan: target harian menyesuaikan"); lRencana(); }
    if (l) { bunyi.klik(); const tg = l.dataset.libur, s = new Set(liburPilihan());
      if (s.has(tg)) s.delete(tg); else s.add(tg); S.liburPilihan = [...s].sort(); S.waktu = { ...(S.waktu || {}), rencana: Date.now() }; simpanData();
      tampilPesan(s.has(tg) ? `🌴 ${HARI_PENUH[hariKe(tg)]} ${tglIndo(tg)} jadi hari libur` : "Libur dibatalkan, kembali jadi hari belajar"); lRencana(); }
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
      ikon = h.piknik ? "🌴" : h.jenis === "sim" ? "📝" : h.jenis === "bebas" ? "🎉" : h.jenis === "libur" ? "😴" : h.jenis === "rehat" ? "😌" : nL ? "📘" : "🔁"; ket = h.piknik ? "libur pilihan" : h.jenis === "sim" ? "simulasi" : h.jenis === "bebas" ? "bebas" : h.jenis === "libur" ? "libur" : h.jenis === "rehat" ? "rehat" : nL ? `${nL} tugas` : "ulang"; kls = h.jenis; }
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
      html += `<button type="button" class="rc-tg ${kls} ${t === awal ? "kini" : ""} ${t === pilihTgl ? "dipilih" : ""}" data-tgl="${t}" aria-label="${tglIndo(t)}">${d}${h && h.piknik ? "<i>🌴</i>" : kls === "sim" ? "<i>📝</i>" : kls === "hariH" ? "<i>🏁</i>" : n ? `<i>${n}</i>` : ""}</button>`;
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
      : `<ul>${h.tugas.map(t => { const x = teksTugas(t); return `<li><span>${x.ikon}</span><span><b>${x.judul}</b><small>${x.sub}</small></span></li>`; }).join("")}</ul>`;
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
  const { n, sel } = catatHarian(r), a = aturRencana(), sj = r.tka ? statusJadwal(r) : null, si = statusIng(r);
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
      <p class="ket" style="margin:4px 0 10px">Target ${r.target} level per hari belajar · materi selesai sekitar <b>${r.selesaiMateri ? tglIndo(r.selesaiMateri) : "–"}</b> · simulasi TKA tuntas ${PULAU_TKA.reduce((s, pl) => s + paketTKA(pl).filter(x => terbaikTes(x.id) >= TES_TUNTAS).length, 0)}/${PAKET_TKA * 2}${modeRencana() === "percepat" ? " · mode 🚀 percepat" : ""}.</p>` : ""}
    ${si ? `${batangBanding(`🌍 Bahasa Inggris · sejak ${tglRingkas(si.sejak)} <span class="rc-chip-kecil ${si.kls}">${si.teks}</span>`, si.harap, si.dikerjakan, "tugas")}
      <p class="ket" style="margin:4px 0 10px">Target selesai <b>${tglIndo(r.ingT)}</b> (${CAKUPAN_ING.find(c => c[0] === a.ingSampai)[1].replace("&", "&amp;")})${r.ing.sisa ? " · ⚠️ belum muat dengan waktu sekarang" : r.ing.selesai ? ` · menurut jadwal selesai ${tglIndo(r.ing.selesai)}` : ""}. Sub level Dengar &amp; Baca = 2 tugas.</p>` : ""}
    <h4 class="rc-sub">Catatan 14 hari terakhir</h4>
    <div style="overflow-x:auto"><table class="tabel-laporan rc-tabel-harian"><thead><tr><th>Hari</th><th>Target</th><th>Dikerjakan</th><th>Hasil</th></tr></thead><tbody>${baris.join("")}</tbody></table></div>
    <p class="ket" style="margin:8px 0 0">Target dicatat saat aplikasi dibuka pada hari itu. ${liburPilihan().length ? `Libur pilihan anak berikutnya: <b>${liburPilihan().map(x => `${HARI_SINGKAT[hariKe(x)]} ${tglRingkas(x)}`).join(", ")}</b>. ` : ""}Waktu belajar ${a.menit} menit/hari · hari belajar ${a.hari.map(i => HARI_SINGKAT[i]).join(", ")}.</p></div>`;
}
