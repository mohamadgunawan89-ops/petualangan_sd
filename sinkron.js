/* Penyimpanan online (Kode Anak) — Petualangan TKA SD
   Kemajuan juga disimpan di database Supabase sendiri (tabel pts_anak, lewat fungsi pts_*). Game tidak
   punya akun, jadi tiap anak ditandai Kode Anak 8 huruf yang dibuat otomatis; HP orang tua
   memakai kode itu sekali untuk tersambung. Game tetap bisa dimainkan tanpa internet;
   sinkron menyusul saat tersambung. Kemajuan dua perangkat digabung: level & bintang
   tertinggi, piala & riwayat aktivitas disatukan, pengaturan orang tua yang terbaru. */
"use strict";

// Alamat server di config.js (sama dengan aplikasi lain); tanpa config.js game tetap jalan, hanya tidak sinkron.
const SINKRON_DB = window.TKA_SUPABASE && window.TKA_SUPABASE.url ? window.TKA_SUPABASE : null;
const BAGIAN_LOKAL = ["riwayat", "suara", "sinkron", "sinkronMati", "peran"];   // peran: "anak" (bawaan) atau "ortu"   // tetap di perangkat ini, tidak dikirim
let sedangSinkron = false, jedaSinkron = null;

async function rpcPts(fn, arg) {
  if (!SINKRON_DB) throw new Error("Server belum diatur (config.js).");
  let r; const henti = new AbortController(), batas = setTimeout(() => henti.abort(), 12000);
  try {
    r = await fetch(`${SINKRON_DB.url}/rest/v1/rpc/${fn}`, { method: "POST", signal: henti.signal,
      headers: { "Content-Type": "application/json", apikey: SINKRON_DB.key, ...(/^eyJ[\w-]*\.[\w-]+\.[\w-]*$/.test(SINKRON_DB.key) ? { Authorization: "Bearer " + SINKRON_DB.key } : {}) }, body: JSON.stringify(arg) });
  } catch (e) { throw new Error("Tidak tersambung ke internet."); } finally { clearTimeout(batas); }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(String(j.message || "Server menolak permintaan.").replace("Kode sinkron", "Kode Anak"));
  return j;
}
const kodeTampil = k => (k ? k.slice(0, 4) + "-" + k.slice(4) : "");
const kodeBersih = k => String(k || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
function dataKirim(x) { const d = {}; for (const k in x) if (!BAGIAN_LOKAL.includes(k)) d[k] = x[k]; return d; }
const adaKemajuan = x => !!(x && x.profil && (x.log?.length || Object.values(x.misi || {}).some(m => m.total) || Object.keys(x.posTes || {}).length));

/* a = kemajuan di perangkat ini, b = kemajuan di server */
function gabungKemajuan(a, b) {
  const g = Object.assign(bawaan(), a, { misi: {}, piala: {}, posTes: {} });
  const ta = a.waktu?.atur || 0, tb = b.waktu?.atur || 0;
  if (!a.profil || tb > ta) { g.profil = b.profil || a.profil; g.tka = b.tka || ""; if (b.atur) g.atur = b.atur; g.waktu = { ...(a.waktu || {}), atur: tb }; }
  for (const id of new Set([...Object.keys(a.misi || {}), ...Object.keys(b.misi || {})])) {
    const x = a.misi?.[id], y = b.misi?.[id];
    if (!x || !y) { g.misi[id] = JSON.parse(JSON.stringify(x || y)); continue; }
    const banyak = (y.total || 0) > (x.total || 0) ? y : x;
    g.misi[id] = { lv: Math.max(x.lv || 0, y.lv || 0), bin: Array.from({ length: 10 }, (_, i) => Math.max(x.bin?.[i] || 0, y.bin?.[i] || 0)), benar: banyak.benar || 0, total: banyak.total || 0, detik: banyak.detik || 0 };
  }
  for (const src of [a.piala || {}, b.piala || {}]) for (const k in src) if (!g.piala[k] || src[k] < g.piala[k]) g.piala[k] = src[k];
  for (const id of new Set([...Object.keys(a.posTes || {}), ...Object.keys(b.posTes || {})])) {   // hasil Pos Tes: gabungan kedua perangkat
    const r = new Map(); for (const x of [...(a.posTes?.[id] || []), ...(b.posTes?.[id] || [])]) r.set(x.t, x);
    g.posTes[id] = [...r.values()].sort((p, q) => p.t - q.t).slice(-30);
  }
  g.koin = Math.max(a.koin || 0, b.koin || 0);
  const api = [a.api, b.api].filter(x => x && x.tgl).sort((p, q) => (p.tgl === q.tgl ? q.n - p.n : p.tgl < q.tgl ? 1 : -1))[0];
  g.api = api ? { ...api } : { n: 0, tgl: "" };
  const ha = a.harian || {}, hb = b.harian || {};
  g.harian = ha.tgl === hb.tgl ? { tgl: ha.tgl || "", selesai: !!(ha.selesai || hb.selesai) } : (ha.tgl || "") > (hb.tgl || "") ? { ...ha } : { ...hb };
  const log = new Map();
  for (const x of [...(a.log || []), ...(b.log || [])]) log.set(`${x.t}|${x.m}|${x.L}`, x);
  g.log = [...log.values()].sort((p, q) => p.t - q.t).slice(-600);
  return g;
}

/* Kode Anak dibuat otomatis begitu ada profil dan internet tersambung,
   kecuali orang tua mematikannya di perangkat ini (S.sinkronMati). */
async function buatKodeAnak() {
  const r = await rpcPts("pts_buat", { p_data: dataKirim(S) });
  S.sinkron = { kode: r.kode, terakhir: Date.now(), tertunda: false }; delete S.sinkronMati; simpanData(false);
}

/* Ambil dari server → gabung → simpan di perangkat → kirim gabungan ke server */
async function sinkronkan({ diam = true } = {}) {
  if (sedangSinkron || !S.profil) return false;
  if (!S.sinkron?.kode) {
    if (S.sinkronMati) return false;
    sedangSinkron = true;
    try { await buatKodeAnak(); if (layarKini === "ortu") { pasangKepala(); segarkanKartuSinkron(); } return true; }
    catch (e) { if (!diam) tampilPesan("⚠️ Kode Anak belum bisa dibuat: " + e.message, 4000); return false; }
    finally { sedangSinkron = false; }
  }
  if (M || T) { S.sinkron.tertunda = true; return false; }   // jangan mengganti data saat anak mengerjakan soal atau Pos Tes
  sedangSinkron = true;
  try {
    const srv = await rpcPts("pts_ambil", { p_kode: S.sinkron.kode });
    if (M || T) { S.sinkron.tertunda = true; return false; }
    const sebelum = JSON.stringify(dataKirim(S)), g = gabungKemajuan(S, srv.data || {});
    g.riwayat = S.riwayat; g.suara = S.suara; g.sinkron = S.sinkron;
    await rpcPts("pts_simpan", { p_kode: S.sinkron.kode, p_data: dataKirim(g) });
    if (M || T) return false;
    S = g; Object.assign(S.sinkron, { terakhir: Date.now(), tertunda: false, galat: "" }); simpanData(false);
    if (JSON.stringify(dataKirim(S)) !== sebelum) perbaruiTampilan();
    if (layarKini === "ortu") segarkanKartuSinkron();
    if (!diam) tampilPesan("☁️ Kemajuan sudah diperbarui");
    return true;
  } catch (e) {
    if (S.sinkron) { S.sinkron.tertunda = true; S.sinkron.galat = e.message; simpanData(false); }
    if (layarKini === "ortu") segarkanKartuSinkron();
    if (!diam) tampilPesan("⚠️ Belum tersimpan online: " + e.message, 4000);
    return false;
  } finally { sedangSinkron = false; }
}
/* Dipanggil setiap kali kemajuan disimpan: kirim beberapa detik kemudian (tidak di tiap jawaban) */
function jadwalSinkron() {
  if (!S.profil || (!S.sinkron?.kode && S.sinkronMati)) return;
  if (S.sinkron) S.sinkron.tertunda = true;
  clearTimeout(jedaSinkron); jedaSinkron = setTimeout(() => sinkronkan(), 4000);
}
window.addEventListener("online", () => sinkronkan());

/* ---------- Tampilan di tab Pengaturan ---------- */
const jamPendek = t => { const d = new Date(t); return `${tglIndo(hariIni(d))}, ${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`; };
const isianSambung = `<div class="baris-set" style="margin-top:8px"><label for="s-kode"><b>Sudah punya Kode Anak?</b><div class="ket">Ketik kode dari HP anak untuk menyambungkan perangkat ini</div></label>
      <span class="sambung-kode"><input id="s-kode" class="isian-teks" maxlength="9" autocomplete="off" placeholder="XXXX-XXXX"><button class="tbl tbl-putih tbl-kecil" id="s-sambung">Sambungkan</button></span></div>`;
const barisPeran = () => `<div class="baris-set"><span><b>Perangkat ini</b><div class="ket">${S.peran === "ortu" ? "👨‍👩‍👧 HP orang tua — hanya memantau" : "👦 HP anak — untuk latihan (harus tersambung internet)"}</div></span><button class="tbl tbl-putih tbl-kecil" id="s-peran">Ubah</button></div>`;
function isiKartuSinkron() { return barisPeran() + isiKodeAnak(); }
function isiKodeAnak() {
  const s = S.sinkron;
  if (!s?.kode && S.sinkronMati) return `<h3>☁️ Kode Anak</h3><p class="ket">Penyimpanan online <b>dimatikan</b> di perangkat ini. Kemajuan hanya tersimpan di perangkat ini.</p>
    <button class="tbl tbl-biru tbl-lebar" id="s-aktif">Nyalakan lagi</button>${isianSambung}`;
  if (!s?.kode) return `<h3>☁️ Kode Anak</h3><p class="ket">⏳ Kode Anak dibuat otomatis begitu perangkat ini tersambung internet. Setelah itu kemajuan anak tersimpan online dan bisa dilihat dari HP orang tua.</p>
    <button class="tbl tbl-biru tbl-lebar" id="s-aktif">Buat sekarang</button>${isianSambung}`;
  const status = s.galat && s.tertunda ? `<span class="status-sinkron tunda">⚠️ Belum tersimpan online (${esc(s.galat)})</span>` : s.tertunda ? '<span class="status-sinkron tunda">⏳ Menunggu dikirim</span>' : '<span class="status-sinkron">✅ Tersimpan online</span>';
  return `<h3>☁️ Kode Anak</h3>
    <div class="kode-sinkron"><span class="ket">Kode Anak</span><b id="s-teks">${kodeTampil(s.kode)}</b><button class="tbl tbl-putih tbl-kecil" id="s-salin">Salin</button></div>
    <p class="ket" style="margin:6px 0">${status}${s.terakhir ? ` · terakhir ${jamPendek(s.terakhir)}` : ""}</p>
    <p class="ket" style="margin:0 0 8px">Kemajuan otomatis tersimpan online. Agar terlihat di <b>HP orang tua</b>: buka game di HP itu, pilih <b>"Sudah punya Kode Anak?"</b>, lalu ketik kode di atas (cukup sekali). Jaga kode ini seperti kata sandi.</p>
    <div class="baris-set"><button class="tbl tbl-biru tbl-kecil" id="s-sekarang">🔄 Perbarui sekarang</button>${S.peran === "ortu" ? '<button class="tbl tbl-putih tbl-kecil" id="s-putus">Matikan di perangkat ini</button>' : ""}</div>
    <div class="baris-set"><span class="ket">Hapus kemajuan dari server (kemajuan di perangkat tetap ada)</span><button class="tbl tbl-merah tbl-kecil" id="s-hapus">Hapus dari server</button></div>
    <details class="sambung-lain"><summary>🔗 Masukkan Kode Anak lain</summary><p class="ket" style="margin:6px 0 0">Pakai ini bila perangkat ini harus memantau atau melanjutkan kemajuan anak dengan kode lain (mis. kode dari HP anak). Kode perangkat ini yang belum berisi kemajuan akan dihapus.</p>${isianSambung}</details>`;
}
function segarkanKartuSinkron() { const k = document.getElementById("kartu-sinkron"); if (k) { k.innerHTML = isiKartuSinkron(); pasangKartuSinkron(k); } }
function pasangKartuSinkron(k) {
  const $ = q => k.querySelector(q), sibuk = (b, ya) => { if (b) { b.disabled = ya; b.style.opacity = ya ? 0.6 : ""; } };
  $("#s-peran")?.addEventListener("click", () => pilihPeran(() => segarkanKartuSinkron()));
  $("#s-aktif")?.addEventListener("click", async e => { sibuk(e.target, true); delete S.sinkronMati; simpanData(false); await sinkronkan({ diam: false }); segarkanKartuSinkron(); });
  $("#s-sambung")?.addEventListener("click", e => sambungkanKode($("#s-kode").value, e.target));
  $("#s-kode")?.addEventListener("keydown", e => { if (e.key === "Enter") $("#s-sambung").click(); });
  $("#s-salin")?.addEventListener("click", async () => { try { await navigator.clipboard.writeText(kodeTampil(S.sinkron.kode)); tampilPesan("Kode Anak disalin"); } catch (er) { tampilPesan("Kode Anak: " + kodeTampil(S.sinkron.kode), 4000); } });
  $("#s-sekarang")?.addEventListener("click", async e => { sibuk(e.target, true); await sinkronkan({ diam: false }); segarkanKartuSinkron(); });
  $("#s-putus")?.addEventListener("click", () => dialog(`<div style="font-size:48px">🔌</div><h2>Matikan di perangkat ini?</h2><p class="ket">Perangkat ini berhenti menyimpan online. Kemajuan di perangkat dan di server tetap ada; sambungkan lagi kapan saja dengan Kode Anak <b>${kodeTampil(S.sinkron.kode)}</b>.</p>`,
    [["Matikan", "tbl-merah", () => { delete S.sinkron; S.sinkronMati = true; simpanData(false); segarkanKartuSinkron(); }], ["Batal", "tbl-putih", null]]));
  $("#s-hapus")?.addEventListener("click", () => dialog(`<div style="font-size:48px">🗑️</div><h2>Hapus dari server?</h2><p class="ket">Kemajuan dengan Kode Anak <b>${kodeTampil(S.sinkron.kode)}</b> dihapus dari server dan kode tidak bisa dipakai lagi oleh perangkat mana pun. Penyimpanan online di perangkat ini dimatikan; kemajuan di perangkat tetap ada.</p>`,
    [["Hapus dari server", "tbl-merah", async () => { try { await rpcPts("pts_hapus", { p_kode: S.sinkron.kode }); delete S.sinkron; S.sinkronMati = true; simpanData(false); tampilPesan("Data di server sudah dihapus"); } catch (er) { tampilPesan("⚠️ " + er.message, 4000); } segarkanKartuSinkron(); }], ["Batal", "tbl-putih", null]]));
}

/* Menyambungkan perangkat ini ke Kode Anak yang sudah ada (dari Pengaturan atau layar sambutan) */
async function sambungkanKode(teks, tombol) {
  const kode = kodeBersih(teks);
  if (kode.length !== 8) { tampilPesan("Kode Anak terdiri atas 8 huruf/angka, mis. KIKO-7QX3."); return; }
  if (tombol) tombol.disabled = true;
  let srv;
  try { srv = await rpcPts("pts_ambil", { p_kode: kode }); }
  catch (er) { tampilPesan("⚠️ " + er.message, 4000); if (tombol) tombol.disabled = false; return; }
  if (tombol) tombol.disabled = false;
  const d = srv.data || {}, namaSrv = d.profil?.nama || "(tanpa nama)";
  const kodeLama = S.sinkron?.kode !== srv.kode && !adaKemajuan(S) ? S.sinkron?.kode : null;
  const pakai = gabung => {
    const lokal = { riwayat: S.riwayat || {}, suara: S.suara !== false };
    S = gabung && S.profil ? gabungKemajuan(S, d) : Object.assign(bawaan(), d);
    Object.assign(S, lokal, { sinkron: { kode: srv.kode, terakhir: Date.now(), tertunda: gabung } }); delete S.sinkronMati; simpanData(false);
    if (kodeLama) rpcPts("pts_hapus", { p_kode: kodeLama }).catch(() => {});   // kode kosong milik perangkat ini tidak dipakai lagi
    tampilPesan(`☁️ Tersambung dengan kemajuan ${namaSrv}`, 3500);
    if (gabung) sinkronkan();
    const dariOrtu = layarKini === "ortu";
    pilihPeran(() => { if (S.peran === "ortu") { tampil("beranda"); izinOrtu = dariOrtu; tabOrtu = "dasbor"; tampil("ortu"); } else tampil("beranda"); });
  };
  if (!adaKemajuan(S)) return pakai(false);
  if (S.profil.nama.trim().toLowerCase() === namaSrv.trim().toLowerCase()) return pakai(true);
  dialog(`<div style="font-size:48px">⚠️</div><h2>Nama berbeda</h2><p class="ket">Kode Anak ini berisi kemajuan <b>${esc(namaSrv)}</b>, sedangkan perangkat ini berisi kemajuan <b>${esc(S.profil.nama)}</b>. Bila diteruskan, kemajuan di perangkat ini <b>diganti</b> dengan kemajuan ${esc(namaSrv)}. Unduh cadangan dulu bila perlu.</p>`,
    [[`Ganti dengan ${esc(namaSrv)}`, "tbl-merah", () => pakai(false)], ["Batal", "tbl-putih", null]]);
}

/* ---------- Peran perangkat & syarat latihan ---------- */
function pilihPeran(lanjut) {
  dialog(`<div style="font-size:48px">📱</div><h2>Perangkat ini dipakai oleh siapa?</h2><p class="ket"><b>HP anak</b> dipakai untuk latihan dan harus tersambung internet. <b>HP orang tua</b> hanya untuk memantau perkembangan; latihan tidak bisa dikerjakan di sana.</p>`,
    [["👦 HP anak — untuk latihan", "tbl-utama", () => { S.peran = "anak"; simpanData(false); lanjut(); }],
     ["👨‍👩‍👧 HP orang tua — hanya memantau", "tbl-biru", () => { S.peran = "ortu"; simpanData(false); lanjut(); }]]);
}
const jeda = ms => new Promise(r => setTimeout(r, ms));
/* Latihan hanya di HP anak, dan kemajuan harus berhasil tersimpan ke database sebelum mulai.
   ulangi = fungsi untuk tombol "Coba lagi". */
async function bolehLatihan(ulangi) {
  if (S.peran === "ortu") {
    bunyi.salah();
    dialog(`<div style="font-size:48px">👀</div><h2>HP orang tua</h2><p class="ket">Perangkat ini disetel sebagai <b>HP orang tua</b> untuk memantau saja. Latihan dikerjakan di HP anak.</p><p class="ket">Ingin mencoba soal? Pakai <b>Orang Tua → Materi &amp; Level Soal → Coba</b> (tidak dihitung sebagai kemajuan anak).</p>`, [["Mengerti", "tbl-utama", null]]);
    return false;
  }
  if (S.sinkronMati) {
    bunyi.salah();
    dialog(`<div style="font-size:48px">☁️</div><h2>Penyimpanan online mati</h2><p class="ket">Latihan memerlukan penyimpanan online supaya kemajuan bisa dipantau orang tua. Minta orang tua menyalakannya di <b>Orang Tua → Pengaturan → Kode Anak</b>.</p>`, [["Mengerti", "tbl-utama", null]]);
    return false;
  }
  tampilPesan("☁️ Menyimpan kemajuan…", 15000);
  for (let i = 0; sedangSinkron && i < 150; i++) await jeda(100);
  const ok = await sinkronkan();
  document.querySelectorAll(".pesan").forEach(x => x.remove());
  if (ok) return true;
  bunyi.salah();
  dialog(`<div style="font-size:48px">📶</div><h2>Belum tersambung internet</h2><p class="ket">Latihan memerlukan internet supaya kemajuan langsung tersimpan dan bisa dipantau orang tua. Nyalakan data seluler atau Wi-Fi, lalu coba lagi.</p>${S.sinkron?.galat ? `<p class="ket" style="font-size:13px">(${esc(S.sinkron.galat)})</p>` : ""}`,
    [["Coba lagi", "tbl-utama", ulangi], ["Tutup", "tbl-putih", null]]);
  return false;
}
