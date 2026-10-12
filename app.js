/* Petualangan TKA SD — logika permainan
   Semua kemajuan disimpan di perangkat (localStorage). Tombol "Unduh cadangan"
   di halaman Orang Tua memindahkannya ke perangkat lain. */
"use strict";

const KUNCI_SIMPAN = "ptka_sd_v1";
const WAKTU_SOAL_MAKS = 300;   // detik; lebih lama dari ini dianggap HP ditinggal
const SOAL_HARIAN = 5, RIWAYAT_MAKS = 400, PIN_ORTU = "ortu2026";
const PILIHAN_SOAL = [5, 10, 15, 20], TOLERANSI_MAKS = 5;
const AVATAR = ["🦊", "🐼", "🐯", "🐰", "🐸", "🦁", "🐧", "🐨", "🐱", "🐶", "🦄", "🐵"];
const TINGKAT = [null, ["Sangat Mudah", "k1"], ["Sangat Mudah", "k1"], ["Mudah", "k2"], ["Mudah", "k2"], ["Sedang", "k3"], ["Sedang", "k3"],
  ["Sulit", "k4"], ["Setara TKA", "k5"], ["Di Atas TKA", "k6"], ["Bos Terakhir", "k6"]];
const GELAR = [[0, "Penjelajah Pemula"], [300, "Petualang Muda"], [1000, "Penjelajah Hebat"], [2500, "Kapten Pulau"], [5000, "Master Angka"], [9000, "Legenda TKA"]];
const PUJIAN = ["Hebat!", "Keren!", "Mantap!", "Luar biasa!", "Pintar!", "Tepat sekali!", "Jago!", "Super!", "Cerdas!"];
const SEMANGAT = ["Tidak apa-apa, kita belajar dari kesalahan!", "Hampir! Baca pembahasannya pelan-pelan ya.", "Ayo, soal berikutnya pasti bisa!", "Salah itu bagian dari belajar. Semangat!"];
const SARAN_UMUM = "Baca soalnya pelan-pelan. Garis bawahi angka dan kata pentingnya, lalu tulis langkahnya di kertas coretan.";

/* ================= Data tersimpan ================= */
const bawaan = () => ({ v: 1, profil: null, tka: "", suara: true, koin: 0, api: { n: 0, tgl: "" }, misi: {}, piala: {}, posTes: {}, harian: { tgl: "", selesai: false }, riwayat: {}, log: [], atur: { soal: 5, toleransi: 1, ulang: true } });
function muatData() { try { const x = JSON.parse(localStorage.getItem(KUNCI_SIMPAN)); if (x && x.v === 1) return Object.assign(bawaan(), x); } catch (e) { /* kosong */ } return bawaan(); }
let S = muatData();
/* Pindah alamat (11 Okt 2026): situs lama mengirim kemajuan perangkat lewat #pindah=… (tidak dikirim ke server mana pun).
   Diambil bila perangkat ini belum punya kemajuan di alamat baru; Kode Anak ikut, lalu sinkron menggabungkan dengan server. */
(function terimaPindahan() {
  const m = /^#pindah=(.+)$/.exec(location.hash); if (!m) return;
  try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* biarkan */ }
  try {
    const x = JSON.parse(decodeURIComponent(m[1]));
    if (!x || x.v !== 1 || !x.profil || adaKemajuan(S)) return;
    S = Object.assign(bawaan(), x); simpanData(false);
  } catch (e) { /* data pindahan rusak: mulai seperti biasa */ }
})();
/* Aturan level dari halaman Orang Tua: jumlah soal, batas kesalahan, ulangi nomor yang salah, dan mode ujian
   (mode ujian: tanpa tanda benar/salah dan tanpa pengulangan; hasil dan pembahasan baru tampil di akhir level).
   Batas kesalahan terpisah per mode (5 Okt 2026): S.atur.toleransi untuk mode belajar (lewat batas = ulang dari
   nomor 1), S.atur.toleransiUjian untuk mode ujian (lewat batas = belum lulus); data lama tanpa toleransiUjian
   memakai nilai toleransi yang sama. atur().toleransi = batas mode yang sedang aktif. */
const atur = () => { const a = S.atur || {}, soal = PILIHAN_SOAL.includes(+a.soal) ? +a.soal : 5,
    batas = (x, cad) => Math.max(0, Math.min(TOLERANSI_MAKS, soal - 1, Number.isInteger(+x) ? +x : cad)),
    tolBelajar = batas(a.toleransi, 1), tolUjian = batas(a.toleransiUjian, tolBelajar), ujian = a.ujian === true;
  return { soal, tolBelajar, tolUjian, toleransi: ujian ? tolUjian : tolBelajar, ulang: a.ulang !== false, ujian, lanjut: a.lewatBatas === "lanjut" }; };   // lanjut: lewat batas tidak diulang dari nomor 1 (12 Okt 2026)
let gagalSimpan = false;
function simpanData(jadwal = true) { try { localStorage.setItem(KUNCI_SIMPAN, JSON.stringify(S)); gagalSimpan = false; if (jadwal && typeof jadwalSinkron === "function") jadwalSinkron(); } catch (e) { gagalSimpan = true; tampilPesan("⚠️ Kemajuan belum bisa disimpan di perangkat ini."); } }
/* Muat ulang dari penyimpanan supaya tab/halaman yang lama terbuka memakai kemajuan terbaru
   (dan tidak menimpa kemajuan anak dengan data lama). Tidak dilakukan saat sedang mengerjakan soal. */
function segarkanData() { if (M || T || LT || gagalSimpan) return false; const baru = muatData(); if (!baru.profil) return false; S = baru; return true; }

const hariIni = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const selisihHari = (a, b) => Math.round((Date.parse(b + "T00:00:00") - Date.parse(a + "T00:00:00")) / 864e5);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const hashTeks = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
const acakDari = arr => arr[Math.floor(Math.random() * arr.length)];

function dataMisi(id) { return (S.misi[id] ||= { lv: 0, bin: Array(10).fill(0), benar: 0, total: 0 }); }
const bintangMisi = id => dataMisi(id).bin.reduce((a, b) => a + b, 0);
const totalBintang = () => MISI.reduce((s, m) => s + bintangMisi(m.id), 0);
const misiSelesai = id => dataMisi(id).lv >= 10;
const posSelesai = pid => MISI.filter(m => m.pos === pid).every(m => misiSelesai(m.id));
const misiPulau = pid => MISI.filter(m => m.pulau === pid);
const cariPulau = pid => PULAU.find(p => p.id === pid) || PULAU[0];
const pulauSelesai = pid => misiPulau(pid).every(m => misiSelesai(m.id));
/* Piala Raksasa Juara TKA: hanya pulau materi TKA (Bahasa Inggris = materi tambahan, tka: false) */
const semuaSelesai = () => MISI.filter(m => cariPulau(m.pulau).tka !== false).every(m => misiSelesai(m.id));
const SINGKAT_PULAU = { mtk: "MTK", bin: "B. Indo", big: "B. Inggris" };
const pakaiNoPos = pid => pid !== "bin";          // "Pos 1 · …" untuk Matematika & Bahasa Inggris; Bahasa Indonesia memakai "Jurus"
/* Soal dengar (Bahasa Inggris, 11 Okt 2026): s.suara dibacakan suara peramban (en-US), tombol 🔊 untuk mengulang */
function ucapInggris(teks) {
  try {
    const ss = window.speechSynthesis; if (!ss || !teks) return;
    ss.cancel();
    const u = new SpeechSynthesisUtterance(teks), v = ss.getVoices();
    u.lang = "en-US"; u.rate = 0.85;
    try { u.voice = v.find(x => /^en[-_]US/i.test(x.lang)) || v.find(x => /^en/i.test(x.lang)) || null; } catch (e) { /* suara bawaan */ }
    ss.speak(u);
  } catch (e) { /* tanpa suara */ }
}
const tombolSuara = s => s.suara ? `<button type="button" class="tbl-suara" data-suara="${encodeURIComponent(s.suara)}">🔊 Dengarkan${s.suara.length > 60 ? " bacaan" : ""}</button>` : "";
document.addEventListener("click", e => { const b = e.target.closest && e.target.closest(".tbl-suara"); if (b) ucapInggris(decodeURIComponent(b.dataset.suara)); });
const gelar = () => GELAR.filter(g => S.koin >= g[0]).pop()[1];
const apiAktif = () => S.api.tgl && selisihHari(S.api.tgl, hariIni()) <= 1;

/* ================= Suara ================= */
let AC = null;
function nada(urutan, tipe = "sine", jeda = 0.11, lama = 0.16, vol = 0.18) {
  if (!S.suara) return;
  try {
    AC ||= new (window.AudioContext || window.webkitAudioContext)(); const t0 = AC.currentTime + 0.02;
    urutan.forEach((f, i) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = tipe; o.frequency.value = f; o.connect(g); g.connect(AC.destination);
      const t = t0 + i * jeda; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + lama); o.start(t); o.stop(t + lama + 0.05); });
  } catch (e) { /* tanpa suara */ }
}
const bunyi = {
  klik: () => nada([520], "triangle", 0.05, 0.06, 0.08),
  benar: () => nada([660, 880, 1175], "sine", 0.09, 0.18),
  salah: () => nada([260, 196], "triangle", 0.14, 0.22, 0.15),
  lulus: () => nada([523, 659, 784, 1047], "sine", 0.12, 0.25),
  gagal: () => nada([392, 330, 262], "triangle", 0.16, 0.25, 0.14),
  piala: () => nada([523, 523, 523, 698, 880, 784, 1047], "square", 0.13, 0.2, 0.08),
};

/* ================= Konfeti ================= */
function konfeti(detik = 2.6) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const kv = document.getElementById("konfeti"), cx = kv.getContext("2d"); kv.hidden = false;
  kv.width = innerWidth * devicePixelRatio; kv.height = innerHeight * devicePixelRatio; cx.scale(devicePixelRatio, devicePixelRatio);
  const warna = ["#F2B92E", "#2E9E5B", "#2F7FD8", "#E5484D", "#7B4FD6", "#19A3A3", "#FF8BC2"];
  const P = Array.from({ length: 160 }, () => ({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.5, vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4,
    r: 5 + Math.random() * 6, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, w: warna[Math.floor(Math.random() * warna.length)] }));
  const akhir = performance.now() + detik * 1000;
  (function gerak(t) {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    P.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.a += p.va; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.fillStyle = p.w; cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); cx.restore(); });
    if (t < akhir) requestAnimationFrame(gerak); else { cx.clearRect(0, 0, innerWidth, innerHeight); kv.hidden = true; }
  })(performance.now());
}

/* ================= Gambar piala ================= */
let nomorGrad = 0;
const LOGAM = { perunggu: ["#F3C08E", "#B5703A", "#7E4A20"], perak: ["#FFFFFF", "#B8C2CE", "#7D8896"], emas: ["#FFF0A8", "#F2B92E", "#A8740E"], raksasa: ["#FFF6C9", "#FFC83D", "#B07A05"] };
function pialaSVG(jenis, ikon = "") {
  const id = "g" + (++nomorGrad);
  if (jenis === "kosong") return `<svg viewBox="0 0 100 124" role="img" aria-label="piala belum didapat"><path d="M22 12H78V40Q78 70 50 75Q22 70 22 40Z" fill="#CDBFA8" opacity=".55"/><path d="M22 20H10Q6 20 8 32Q12 47 25 50M78 20H90Q94 20 92 32Q88 47 75 50" fill="none" stroke="#CDBFA8" stroke-width="6" opacity=".55"/><rect x="44" y="74" width="12" height="14" fill="#CDBFA8" opacity=".55"/><rect x="30" y="88" width="40" height="9" rx="3" fill="#CDBFA8" opacity=".55"/><text x="50" y="52" text-anchor="middle" font-size="24" fill="#fff" opacity=".9">?</text></svg>`;
  const [t, m, g] = LOGAM[jenis];
  return `<svg viewBox="0 0 100 124" role="img" aria-label="piala ${jenis}"><defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="${m}"/><stop offset=".35" stop-color="${t}"/><stop offset="1" stop-color="${g}"/></linearGradient></defs>
    ${jenis === "raksasa" ? `<path d="M34 10L40 0L50 8L60 0L66 10Z" fill="#E5484D" stroke="${g}" stroke-width="2"/>` : ""}
    <path d="M22 20H10Q6 20 8 32Q12 47 25 50M78 20H90Q94 20 92 32Q88 47 75 50" fill="none" stroke="url(#${id})" stroke-width="6" stroke-linecap="round"/>
    <path d="M22 12H78V40Q78 70 50 75Q22 70 22 40Z" fill="url(#${id})" stroke="${g}" stroke-width="2"/>
    <path d="M30 18Q30 46 44 62" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/>
    <rect x="44" y="74" width="12" height="14" fill="url(#${id})" stroke="${g}" stroke-width="1.5"/><rect x="30" y="87" width="40" height="9" rx="3" fill="url(#${id})" stroke="${g}" stroke-width="1.5"/>
    <rect x="24" y="96" width="52" height="22" rx="4" fill="#5C3A20"/><rect x="32" y="102" width="36" height="10" rx="2" fill="${t}" opacity=".8"/>
    ${ikon ? `<text x="50" y="50" text-anchor="middle" font-size="24">${ikon}</text>` : ""}</svg>`;
}

/* ================= Kerangka layar ================= */
const layar = document.getElementById("layar"), kepala = document.getElementById("kepala"), kepalaIsi = document.getElementById("kepala-isi"), nav = document.getElementById("nav");
let layarKini = "", argKini, izinOrtu = false;
function pasangKepala(kembali, arg) {
  kepala.hidden = false;
  kepalaIsi.innerHTML = `${kembali ? `<button class="kembali" data-ke="${kembali}"${arg ? ` data-arg="${arg}"` : ""} aria-label="Kembali">←</button>` : ""}
    <div class="avatar" aria-hidden="true">${S.profil.avatar}</div>
    <div style="min-width:0"><div class="nama">${esc(S.profil.nama)}</div><div class="gelar">${gelar()}</div></div>
    <div class="kanan"><span class="chip" title="Koin">💰 ${fmt(S.koin)}</span><span class="chip ${apiAktif() ? "" : "api-mati"}" title="Hari berturut-turut">🔥 ${apiAktif() ? S.api.n : 0}</span></div>`;
}
function pasangNav(aktif) { nav.hidden = !aktif; nav.querySelectorAll("button").forEach(b => { if (b.dataset.ke === aktif) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); }); }
function tampil(nama_, arg) {
  hentikanSuaraLatih();   // suara/mikrofon Dengar & Baca (latih-inggris.js) berhenti saat pindah layar
  if (nama_ !== "sambut") segarkanData();
  if (nama_ === "ortu" && !izinOrtu && S.peran !== "ortu") return mintaPin();   // PIN hanya di HP anak; HP orang tua langsung masuk
  izinOrtu = false; layarKini = nama_; argKini = arg; window.scrollTo(0, 0);
  ({ sambut: lSambut, beranda: lBeranda, pulau: lPulau, jalur: lJalur, latih: lLatih, materi: lMateri, rencana: lRencana, postes: lPosTes, piala: lPiala, ortu: lOrtu }[nama_])(arg);
}
document.addEventListener("click", e => { const b = e.target.closest("[data-ke]"); if (b) { bunyi.klik(); tampil(b.dataset.ke, b.dataset.arg); } });
function tampilPesan(t, ms = 2600) { document.querySelectorAll(".pesan").forEach(x => x.remove()); const d = document.createElement("div"); d.className = "pesan"; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), ms); }

function mintaPin() {
  const l = dialog(`<div style="font-size:48px">🔐</div><h2>Khusus orang tua</h2><p class="ket">Masukkan PIN untuk membuka halaman Orang Tua.</p><input class="isian-teks" id="pin-ortu" type="password" autocomplete="off" aria-label="PIN orang tua">`,
    [["Buka", "tbl-utama", () => { if (pin === PIN_ORTU) { izinOrtu = true; tampil("ortu"); } else { bunyi.salah(); tampilPesan("PIN salah."); mintaPin(); } }], ["Batal", "tbl-putih", null]]);
  let pin = ""; const i = l.querySelector("#pin-ortu");
  i.addEventListener("input", e => (pin = e.target.value.trim())); i.addEventListener("keydown", e => { if (e.key === "Enter") l.querySelector("button[data-i='0']").click(); }); i.focus();
}

/* ================= Sambutan (pertama kali) ================= */
function lSambut() {
  kepala.hidden = true; pasangNav(null); let pilihAv = S.profil?.avatar || AVATAR[0];
  layar.innerHTML = `<div class="sambut-hero"><div class="maskot">🦉</div><h1>Halo, Petualang!</h1><p>Aku <b>Kiko si Burung Hantu</b>. Ayo jelajahi pulau-pulau ilmu dan kumpulkan piala sebelum hari TKA!</p></div>
    <div class="kartu"><label class="lbl-isian" for="in-nama">Siapa namamu?</label><input id="in-nama" class="isian-teks" maxlength="20" autocomplete="off" placeholder="Tulis namamu" value="${esc(S.profil?.nama || "")}">
      <span class="lbl-isian">Pilih teman petualanganmu</span><div class="pilih-avatar" id="av">${AVATAR.map(a => `<button type="button" aria-pressed="${a === pilihAv}" data-av="${a}">${a}</button>`).join("")}</div>
      <label class="lbl-isian" for="in-tka">Tanggal TKA <span class="ket">(boleh diisi nanti oleh orang tua)</span></label><input id="in-tka" type="date" class="isian-teks" value="${S.tka}">
      <button class="tbl tbl-utama tbl-lebar" id="mulai" style="margin-top:20px">Mulai Petualangan 🚀</button>
      <button class="tbl tbl-putih tbl-lebar" id="punya-kode" style="margin-top:10px">☁️ Sudah punya Kode Anak?</button></div>`;
  layar.querySelector("#punya-kode").addEventListener("click", () => { bunyi.klik();
    const l = dialog(`<div style="font-size:48px">☁️</div><h2>Masukkan Kode Anak</h2><p class="ket">Ketik Kode Anak dari HP anak (lihat di HP anak: <b>Orang Tua → Pengaturan → Kode Anak</b>).</p><input class="isian-teks" id="kode-sambut" maxlength="9" autocomplete="off" placeholder="XXXX-XXXX" style="text-align:center;letter-spacing:.1em">`,
      [["Sambungkan", "tbl-utama", () => sambungkanKode(kode)], ["Batal", "tbl-putih", null]]);
    let kode = ""; const i = l.querySelector("#kode-sambut"); i.addEventListener("input", e => (kode = e.target.value)); i.addEventListener("keydown", e => { if (e.key === "Enter") l.querySelector("button[data-i='0']").click(); }); i.focus(); });
  layar.querySelector("#av").addEventListener("click", e => { const b = e.target.closest("[data-av]"); if (!b) return; pilihAv = b.dataset.av; bunyi.klik(); layar.querySelectorAll("[data-av]").forEach(x => x.setAttribute("aria-pressed", x === b)); });
  layar.querySelector("#mulai").addEventListener("click", () => {
    const n = layar.querySelector("#in-nama").value.trim(); if (!n) { tampilPesan("Tulis namamu dulu, ya 😊"); layar.querySelector("#in-nama").focus(); return; }
    S.profil = { nama: n, avatar: pilihAv }; S.tka = layar.querySelector("#in-tka").value || ""; simpanData(); bunyi.lulus(); tampil("beranda");
  });
}

/* ================= Beranda ================= */
function lBeranda() {
  pasangKepala(); pasangNav("beranda");
  const selesai = MISI.filter(m => misiSelesai(m.id)).length, persen = Math.round(selesai / MISI.length * 100);
  let hm;
  if (S.tka) { const d = selisihHari(hariIni(), S.tka);
    hm = d > 0 ? `<div class="angka">${d}</div><div class="teks"><b>hari lagi menuju TKA</b><span>${selesai} dari ${MISI.length} piala misi terkumpul</span><div class="batang"><i style="width:${persen}%"></i></div></div>`
      : d === 0 ? `<div class="angka">🎯</div><div class="teks"><b>Hari ini TKA! Kamu pasti bisa!</b><span>Tarik napas, baca soal pelan-pelan.</span></div>`
        : `<div class="angka">✅</div><div class="teks"><b>TKA sudah dilaksanakan</b><span>Terus berlatih untuk mengumpulkan semua piala!</span></div>`; }
  else hm = `<div class="angka">⏳</div><div class="teks"><b>Kapan TKA-mu?</b><span>Minta orang tua mengisi tanggalnya di menu Orang Tua.</span><div class="batang"><i style="width:${persen}%"></i></div></div>`;
  const sudahHarian = S.harian.tgl === hariIni() && S.harian.selesai;
  const terakhir = S.log.length ? S.log[S.log.length - 1] : null, mTer = terakhir && cariMisi(terakhir.m);
  const lanjut = mTer ? (() => { const L = Math.min(10, dataMisi(mTer.id).lv + 1); return misiSelesai(mTer.id) ? "" : `<button class="kartu misi" data-ke="jalur" data-arg="${mTer.id}" style="margin:0"><div class="ikon">${mTer.ikon}</div><div class="tengah"><div class="status">LANJUTKAN</div><h3>${mTer.judul}</h3><div class="status">Level ${L} · ${TINGKAT[L][0]}</div></div><div class="kanan" style="font-size:28px">▶️</div></button>`; })() : "";
  layar.innerHTML = `${S.peran === "ortu" ? `<div class="kartu banner-ortu"><div>👀 <b>HP orang tua</b> — hanya untuk memantau. Latihan dikerjakan di HP anak.</div><button class="tbl tbl-biru tbl-kecil" data-ke="ortu">Buka Dasbor Ortu</button></div>` : ""}
    <div class="hitung-mundur">${hm}<div class="piala-mini">${pialaSVG(S.piala.raksasa ? "raksasa" : "kosong", S.piala.raksasa ? "👑" : "")}</div></div>
    ${kartuRencanaBeranda()}
    ${lanjut}
    <button class="kartu harian ${sudahHarian ? "sudah" : ""}" id="harian" style="width:100%;text-align:left"><div class="ikon-besar">${sudahHarian ? "✅" : "🎁"}</div><div><h3>${sudahHarian ? "Tantangan Harian selesai!" : "Tantangan Harian"}</h3><div class="ket">${sudahHarian ? "Kembali lagi besok untuk hadiah berikutnya." : `${SOAL_HARIAN} soal campuran · hadiah <b>+50 💰</b> dan api semangat 🔥`}</div></div></button>
    <h2 class="judul-bagian">🗺️ Pilih Pulau</h2>
    <div class="pulau-grid">${PULAU.map(p => { const ms = misiPulau(p.id), pr = Math.round(ms.filter(m => misiSelesai(m.id)).length / ms.length * 100), bt = ms.reduce((s, m) => s + bintangMisi(m.id), 0);
      return `<button class="pulau ${p.id}" data-ke="pulau" data-arg="${p.id}"><span class="gbr-pulau">${p.ikon}</span><h3>Pulau ${p.judul}</h3><span class="sub">${ms.length} misi · ${pr}% dijelajahi · ⭐ ${bt}/${ms.length * 30}</span><div class="batang"><i style="width:${pr}%"></i></div></button>`; }).join("")}
    </div>`;
  layar.querySelector("#harian").addEventListener("click", () => { if (sudahHarian) { tampilPesan("Tantangan hari ini sudah selesai. Sampai besok! 👋"); return; } bunyi.klik(); mulaiHarian(); });
}

/* ================= Pulau ================= */
function lPulau(pid) {
  const pl = cariPulau(pid); pasangKepala("beranda"); pasangNav("beranda");
  layar.innerHTML = `<h1 class="judul-bagian" style="font-size:28px;margin-top:16px">${pl.ikon} Pulau ${pl.judul}</h1><p class="ket">${pl.ket}</p>` +
    POS.filter(p => p.pulau === pl.id).map(p => { const ms = MISI.filter(m => m.pos === p.id), sel = ms.filter(m => misiSelesai(m.id)).length;
      return `<div class="pos-kepala"><div class="bulat">${p.ikon}</div><div><h2>Pos ${p.no} · ${p.judul}</h2><div class="ket">${p.ket} · ${sel}/${ms.length} misi selesai</div></div><div class="piala-pos" title="Piala pos">${pialaSVG(S.piala["pos-" + p.id] ? "perak" : "kosong", S.piala["pos-" + p.id] ? p.ikon : "")}</div></div>` +
        ms.map(m => { const d = dataMisi(m.id), L = Math.min(10, d.lv + 1), done = misiSelesai(m.id), emas = S.piala["emas-" + m.id];
          const pips = d.bin.map((b, i) => `<i class="${b ? "b" + b : i === d.lv && !done ? "kini" : ""}">${i + 1}</i>`).join("");
          return `<button class="misi ${done ? "selesai" : ""}" data-ke="jalur" data-arg="${m.id}"><div class="ikon">${m.ikon}${done ? '<span class="centang">✓</span>' : ""}</div><div class="tengah"><h3>${m.judul}</h3><div class="pips">${pips}</div>
            <div class="status">${done ? `Selesai! ⭐ ${bintangMisi(m.id)}/30${emas ? " · Piala emas!" : " · kumpulkan 30⭐ untuk piala emas"}` : level1Terkunci(m.id) ? `🎧 Dengar &amp; Baca · ${subTuntas(m.id)}/5 sub level` : `Level ${L} · ${TINGKAT[L][0]}`}</div></div><div class="kanan">${done ? pialaSVG(emas ? "emas" : "perunggu", m.ikon) : '<span style="font-size:26px">▶️</span>'}</div></button>`; }).join("") + kartuTesPulau(p);
    }).join("") + htmlPosTKA(pl.id);   // Pos TKA: 10 paket simulasi (postes.js)
}

/* ================= Jalur level ================= */
const XJALUR = [50, 74, 80, 62, 38, 22, 30, 54, 74, 50];
function lJalur(id) {
  const m = cariMisi(id); if (!m) return tampil("beranda"); pasangKepala("pulau", m.pulau); pasangNav("beranda");
  const d = dataMisi(id), H = 112, pts = XJALUR.map((x, i) => `${x} ${i * H + H / 2}`), kunci1 = level1Terkunci(id);   // Bahasa Inggris: Dengar & Baca dulu
  layar.innerHTML = `<div class="jalur-kepala"><div class="ikon-misi">${m.ikon}</div><h1>${m.judul}</h1><p class="ket">⭐ ${bintangMisi(id)}/30 · ${misiSelesai(id) ? (S.piala["emas-" + id] ? "🏆 Piala emas sudah didapat!" : "🏆 Piala didapat! Raih 30⭐ untuk piala emas.") : "Selesaikan Level 10 untuk mendapat piala 🏆"}</p></div>
    ${misiInggris(id) ? kartuLatihJalur(id) : adaMateri(id) ? kartuMateriJalur(id) : ""}
    <div class="jalur" style="height:${10 * H}px"><svg class="lintasan" viewBox="0 0 100 ${10 * H}" preserveAspectRatio="none" aria-hidden="true"><path d="M${pts.join(" L")}" vector-effect="non-scaling-stroke"/></svg>
    ${XJALUR.map((x, i) => { const L = i + 1, b = d.bin[i], buka = L <= d.lv + 1 && !(L === 1 && kunci1), lulus = L <= d.lv, cls = lulus ? "lulus" : buka ? "buka" : "kunci";
      return `<div class="simpul-baris ${x > 50 ? "kanan" : "kiri"}" style="position:absolute;top:${i * H}px;left:0;right:0;height:${H}px"><button class="simpul ${cls} ${L === 10 ? "bos" : ""}" data-level="${L}" style="position:absolute;left:${x}%;transform:translateX(-50%)" aria-label="Level ${L}${buka ? "" : ", terkunci"}">
        ${buka ? (L === 10 ? "👑" : L) : "🔒"}${lulus ? `<span class="bintang-simpul">${"⭐".repeat(b)}${"☆".repeat(3 - b)}</span>` : ""}<span class="label-simpul ${TINGKAT[L][1]}">${TINGKAT[L][0]}</span></button></div>`; }).join("")}</div>`;
  layar.querySelector(".jalur").addEventListener("click", e => { const b = e.target.closest("[data-level]"); if (!b) return; const L = +b.dataset.level;
    if (L === 1 && kunci1) { bunyi.salah(); tampilPesan("🎧 Selesaikan Dengar & Baca (5 sub level) dulu, ya!"); return; }
    if (L > d.lv + 1) { bunyi.salah(); tampilPesan("🔒 Selesaikan level sebelumnya dulu, ya!"); return; } bunyi.klik(); mulaiLevel(id, L); });
  const kini = layar.querySelector(".simpul.buka"); if (kini && !kunci1) setTimeout(() => kini.scrollIntoView({ block: "center", behavior: "smooth" }), 120);
}

/* ================= Bermain ================= */
let M = null;
/* dipakai = kalimat soal yang sudah muncul di level ini: soal dengan kalimat sama (hanya angka/gambar beda)
   terlihat seperti soal yang diulang, jadi diutamakan kalimat lain bila misi itu punya */
const kalimatSoal = s => (s.bacaan || "") + "|" + s.teks;
function ambilSoal(id, L, dipakai) {
  const rw = new Set(S.riwayat[id] || []); let s, h, cadangan = null;
  for (let i = 0; i < 40; i++) {
    s = buatSoal(id, L, null); h = hashTeks(s.kunciUnik);
    if (rw.has(h)) continue;
    if (!dipakai || !dipakai.has(kalimatSoal(s))) { cadangan = null; break; }
    cadangan ||= [s, h];
  }
  if (cadangan) [s, h] = cadangan;
  dipakai?.add(kalimatSoal(s));
  (S.riwayat[id] ||= []).push(h); if (S.riwayat[id].length > RIWAYAT_MAKS) S.riwayat[id].splice(0, S.riwayat[id].length - RIWAYAT_MAKS);
  return s;
}
/* Latihan: hanya di HP anak dan harus tersambung ke database (lihat bolehLatihan di sinkron.js).
   Uji coba orang tua (coba) tidak memerlukan keduanya karena tidak dihitung. */
async function mulaiLevel(id, L, coba = false) { if (coba) return mulaiLevelLangsung(id, L, true); if (await bolehLatihan(() => mulaiLevel(id, L))) mulaiLevelLangsung(id, L); }
async function mulaiHarian() { if (await bolehLatihan(() => mulaiHarian())) mulaiHarianLangsung(); }
function mulaiLevelLangsung(id, L, coba = false) { const a = atur(); M = { misi: id, L, coba, i: 0, n: a.soal, toleransi: a.toleransi, ulang: a.ulang && !a.ujian, ujian: a.ujian, lanjut: a.lanjut, rekam: [], salah: 0, tanda: [], petunjuk: false, harian: false }; soalBerikut(); }
function mulaiHarianLangsung() {
  const buka = MISI.filter(m => !misiSelesai(m.id)), sumber = buka.length >= 3 ? buka : MISI;
  const antrian = Array.from({ length: SOAL_HARIAN }, () => { const m = acakDari(sumber), d = dataMisi(m.id); return { misi: m.id, L: Math.max(1, Math.min(10, d.lv + 1)) }; });
  M = { harian: true, antrian, i: 0, n: SOAL_HARIAN, toleransi: SOAL_HARIAN, ulang: false, salah: 0, tanda: [], petunjuk: false }; soalBerikut();
}
function soalBerikut() {
  if (M.i >= M.n) return selesaiLevel();
  const id = M.harian ? M.antrian[M.i].misi : M.misi, L = M.harian ? M.antrian[M.i].L : M.L;
  M.soal = M.coba ? buatSoal(id, L, null) : ambilSoal(id, L, M.kalimat ||= new Set()); M.idKini = id; M.LKini = L; M.diperiksa = false; M.tSoal = Date.now();
  M.jawab = M.soal.bentuk === "isian" ? "" : M.soal.bentuk === "pg" ? null : M.soal.bentuk === "pgk" ? M.soal.opsi.map(() => false) : M.soal.pernyataan.map(() => null);
  lMain();
}
function lMain() {
  kepala.hidden = true; pasangNav(null); layarKini = "main";
  const s = M.soal, m = cariMisi(M.idKini), L = M.LKini, t = TINGKAT[L];
  const titik = Array.from({ length: M.n }, (_, i) => `<i class="${i === M.i ? "kini" : M.ujian ? (M.tanda[i] ? "isi" : "") : M.tanda[i] || ""}"></i>`).join("");
  const sisa = M.harian ? "" : M.ujian ? `<div class="sisa-salah">📝 Mode ujian · ${M.toleransi ? `boleh salah ${M.toleransi}×` : "harus benar semua"} · hasilnya dilihat di akhir</div>` : `<div class="sisa-salah ${M.salah ? "ada" : ""}">${M.toleransi ? `Boleh salah ${M.toleransi}× · sudah ${M.salah}×` : "Harus benar semua"}${M.lanjut && M.salah > M.toleransi ? " · lewat batas, belum lulus" : ""}${M.ulang ? " · nomor yang salah diulang" : ""}${M.putaran ? ` · percobaan ke-${M.putaran + 1}` : ""}</div>`;
  layar.innerHTML = `<div class="main-atas"><button class="tutup" id="keluar" aria-label="Keluar">✕</button><div class="info"><b>${M.harian ? "🎁 Tantangan Harian" : m.ikon + " " + m.judul}</b>
      ${M.harian ? `<span class="ket">${m.ikon} ${m.judul}</span>` : `<span class="lencana ${t[1]}">Level ${L} · ${t[0]}</span>`}</div>${M.coba ? '<span class="chip" style="background:var(--ungu-muda);color:var(--ungu)">🧪 Uji coba</span>' : `<span class="chip" style="background:var(--emas-muda);color:var(--emas-teks)">💰 ${fmt(S.koin)}</span>`}</div>
    <div class="titik-soal" aria-label="Soal ${M.i + 1} dari ${M.n}">${titik}</div>${sisa}
    <div class="kartu kartu-soal" id="kartu-soal"><div class="nomor">SOAL ${M.i + 1} DARI ${M.n}${M.ulangKe ? " · ULANGAN" : ""}</div>${s.bacaan ? `<div class="bacaan">${s.bacaan}</div>` : ""}${tombolSuara(s)}<div class="teks-soal">${s.teks}</div>${s.gambar ? `<div class="wadah-gambar">${s.gambar}</div>` : ""}
      <div id="area-jawab">${areaJawab(s)}</div>
      <div class="aksi-soal">${M.ujian ? "" : '<button class="tbl tbl-burung" id="tbl-petunjuk" aria-label="Minta petunjuk Kiko" title="Petunjuk">🦉</button>'}<button class="tbl tbl-hijau tbl-periksa" id="tbl-periksa">${M.ujian ? (M.i + 1 >= M.n ? "Selesai ✔" : "Berikutnya ▶") : "Periksa ✔"}</button></div>
      <div id="gelembung"></div><div id="umpan"></div></div>`;
  pasangJawab(s);
  if (s.suara) setTimeout(() => ucapInggris(s.suara), 350);
  layar.querySelector("#keluar").addEventListener("click", konfirmasiKeluar);
  layar.querySelector("#tbl-petunjuk")?.addEventListener("click", tunjukPetunjuk);
  layar.querySelector("#tbl-periksa").addEventListener("click", () => (M.diperiksa ? lanjutSoal() : periksaJawab()));
}
function areaJawab(s) {
  if (s.bentuk === "isian") {
    const pcs = !!s.pecahan;
    return `<div class="layar-jawab" aria-live="polite"><span class="isi" id="isi-jawab"></span><span class="kursor"></span>${s.satuan ? `<span class="satuan">${s.satuan}</span>` : ""}</div>
      ${pcs ? `<div class="saran-pc">Pecahan ditulis <b>3/4</b>. Pecahan campuran: <b>1 ␣ 1/2</b>. Tulis bentuk paling sederhana.</div>` : ""}
      <div class="papan" id="papan">${["7", "8", "9", "⌫", "4", "5", "6", ",", "1", "2", "3", pcs ? "/" : "", "", "0", pcs ? "␣" : "", ""].map(k => k === "" ? "<span></span>" : `<button type="button" data-k="${k}" class="${k === "⌫" ? "fn hapus" : /[,/␣]/.test(k) ? "fn" : ""}" aria-label="${k === "⌫" ? "hapus" : k === "␣" ? "spasi" : k}">${k}</button>`).join("")}</div>`;
  }
  if (s.bentuk === "pg") return `<div class="opsi-daftar" role="radiogroup">${s.opsi.map((o, i) => `<button type="button" class="opsi" role="radio" aria-checked="false" data-i="${i}"><span class="huruf">${"ABCDE"[i]}</span><span>${o}</span></button>`).join("")}</div>`;
  if (s.bentuk === "pgk") return `<div class="petunjuk-pilih">☑️ Jawaban benar bisa lebih dari satu. Pilih semuanya!</div><div class="opsi-daftar">${s.opsi.map((o, i) => `<button type="button" class="opsi kotak-centang" role="checkbox" aria-checked="false" data-i="${i}"><span class="huruf"></span><span>${o}</span></button>`).join("")}</div>`;
  return `<div class="petunjuk-pilih">Tentukan <b>Benar</b> atau <b>Salah</b> untuk setiap pernyataan.</div>${s.pernyataan.map((p, i) => `<div class="bs-baris"><span>${p}</span><span class="bs-tombol" data-i="${i}"><button type="button" class="b" aria-pressed="false" data-v="1">Benar</button><button type="button" class="s" aria-pressed="false" data-v="0">Salah</button></span></div>`).join("")}`;
}
function tulisIsian() { const el = document.getElementById("isi-jawab"); if (el) el.textContent = M.jawab.replace(/ /g, " "); }
function ketik(k) {
  if (M.diperiksa) return;
  if (k === "⌫") M.jawab = M.jawab.slice(0, -1);
  else if (k === "␣") { if (/\d$/.test(M.jawab) && !M.jawab.includes(" ")) M.jawab += " "; }
  else if (k === "/") { if (/\d$/.test(M.jawab) && !M.jawab.includes("/") && !M.jawab.includes(",")) M.jawab += "/"; }
  else if (k === ",") { if (/\d$/.test(M.jawab) && !/[,/ ]/.test(M.jawab)) M.jawab += ","; }
  else if (/^\d$/.test(k) && M.jawab.replace(/\D/g, "").length < 10) M.jawab += k;
  bunyi.klik(); tulisIsian();
}
function pasangJawab(s) {
  const area = document.getElementById("area-jawab");
  if (s.bentuk === "isian") { area.querySelector("#papan").addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (b) ketik(b.dataset.k); }); return; }
  if (s.bentuk === "pg") area.addEventListener("click", e => { const b = e.target.closest(".opsi"); if (!b || M.diperiksa) return; bunyi.klik(); M.jawab = +b.dataset.i; area.querySelectorAll(".opsi").forEach(x => x.setAttribute("aria-checked", x === b)); });
  if (s.bentuk === "pgk") area.addEventListener("click", e => { const b = e.target.closest(".opsi"); if (!b || M.diperiksa) return; bunyi.klik(); const i = +b.dataset.i; M.jawab[i] = !M.jawab[i]; b.setAttribute("aria-checked", M.jawab[i]); });
  if (s.bentuk === "bs") area.addEventListener("click", e => { const b = e.target.closest("button[data-v]"); if (!b || M.diperiksa) return; bunyi.klik(); const g = b.parentElement, i = +g.dataset.i; M.jawab[i] = b.dataset.v === "1"; g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); });
}
document.addEventListener("keydown", e => {
  if (layarKini !== "main" || !M || document.querySelector(".lapis")) return;
  if (e.key === "Enter") { e.preventDefault(); document.getElementById("tbl-periksa")?.click(); return; }
  const s = M.soal; if (M.diperiksa) return;
  if (s.bentuk === "isian") { const k = e.key === "Backspace" ? "⌫" : e.key === " " ? "␣" : e.key === "." ? "," : e.key; if (/^[\d,/⌫␣]$/.test(k)) { e.preventDefault(); if ((k === "/" || k === "␣") && !s.pecahan) return; ketik(k); } }
  else if (s.bentuk === "pg") { const i = "abcde".indexOf(e.key.toLowerCase()); const j = i >= 0 ? i : "12345".indexOf(e.key); if (j >= 0 && j < s.opsi.length) document.querySelectorAll(".opsi")[j]?.click(); }
});
function gelembung(teks) { document.getElementById("gelembung").innerHTML = `<div class="maskot-gelembung"><div class="burung">🦉</div><div class="gelembung">${teks}</div></div>`; }
function tunjukPetunjuk() { if (M.diperiksa) return; bunyi.klik(); M.petunjuk = true; gelembung(M.soal.petunjuk || SARAN_UMUM); }
function sudahDijawab() { const s = M.soal, j = M.jawab; return s.bentuk === "isian" ? j.trim() !== "" && !/[,/ ]$/.test(j) : s.bentuk === "pg" ? j !== null : s.bentuk === "pgk" ? j.some(Boolean) : j.every(x => x !== null); }
function periksaJawab() {
  if (!sudahDijawab()) { const k = document.getElementById("kartu-soal"); k.classList.remove("goyang"); void k.offsetWidth; k.classList.add("goyang"); gelembung(M.soal.bentuk === "bs" ? "Isi semua pernyataan dulu, ya!" : "Isi jawabanmu dulu, ya!"); return; }
  const s = M.soal, r = periksa(s, M.jawab), d = dataMisi(M.idKini); M.diperiksa = true; if (!r.benar) { M.salah++; M.salahTotal = (M.salahTotal || 0) + 1; }   // salahTotal tidak direset saat ulang dari nomor 1
  const dt = Math.min(WAKTU_SOAL_MAKS, Math.max(0, Math.round((Date.now() - (M.tSoal || Date.now())) / 1000))); M.detik = (M.detik || 0) + dt;
  M.tanda[M.i] = r.benar ? (M.tanda[M.i] === "salah" ? "pulih" : "benar") : "salah";
  if (!M.coba) { d.total++; d.detik = (d.detik || 0) + dt; if (r.benar) { d.benar++; S.koin += 10; } }
  if (M.ujian) { M.rekam.push({ s, j: M.jawab, benar: r.benar }); bunyi.klik(); simpanData(); M.i++; return soalBerikut(); }
  document.getElementById("gelembung").innerHTML = "";
  const u = document.getElementById("umpan");
  if (r.benar) { bunyi.benar(); if (!M.coba) terbangKoin("+10 💰"); u.innerHTML = `<div class="umpan benar"><h3>✅ ${acakDari(PUJIAN)}</h3>${htmlBahas(s)}</div>`; }
  else { bunyi.salah(); u.innerHTML = `<div class="umpan salah"><h3>❌ Belum tepat</h3>${r.catatan ? `<div class="catatan">${r.catatan}</div>` : ""}<div>Jawaban yang benar:</div><div class="kunci-jawab">${tulisKunci(s)}</div>${htmlBahas(s)}<div class="ket" style="margin-top:8px">🦉 ${acakDari(SEMANGAT)}</div></div>`; }
  tandaiPilihan(s);
  const lewat = !M.harian && M.salah > M.toleransi, habis = lewat && !M.lanjut; M.ulangi = !r.benar && M.ulang && !habis; M.habis = habis;
  if (lewat && M.lanjut && !r.benar && M.salah === M.toleransi + 1) u.insertAdjacentHTML("beforeend", `<div class="umpan ulang-awal"><h3>➡️ Lanjutkan sampai selesai</h3><div>Kesalahan sudah ${M.salah}×, melebihi batas ${M.toleransi ? M.toleransi + "×" : "(harus benar semua)"}. Level ini belum lulus, tetapi teruskan latihannya sampai nomor terakhir, lalu coba lagi ya!</div></div>`);
  if (habis) u.insertAdjacentHTML("beforeend", `<div class="umpan ulang-awal"><h3>🔁 Ulangi dari nomor 1</h3><div>Kesalahan sudah ${M.salah}×, melebihi batas ${M.toleransi ? M.toleransi + "×" : "(harus benar semua)"}. Baca pembahasannya dulu, lalu kita mulai lagi dari nomor 1 dengan soal baru. Kamu pasti bisa!</div></div>`);
  const t = document.getElementById("tbl-periksa"); t.textContent = habis ? "Ulangi dari nomor 1 🔁" : M.ulangi ? "Ulangi nomor ini 🔁" : M.i + 1 >= M.n ? "Lihat hasil 🏁" : "Lanjut ➜"; t.className = "tbl tbl-biru tbl-periksa";
  document.getElementById("tbl-petunjuk").disabled = true; simpanData();
  setTimeout(() => u.scrollIntoView({ block: "nearest", behavior: "smooth" }), 60);
}
function tandaiPilihan(s) {
  if (s.bentuk === "pg") document.querySelectorAll(".opsi").forEach((b, i) => { if (i === s.kunci) b.style.borderColor = "var(--hijau)"; else if (i === M.jawab) b.style.borderColor = "var(--merah)"; });
  if (s.bentuk === "pgk") document.querySelectorAll(".opsi").forEach((b, i) => { b.style.borderColor = s.kunci[i] ? "var(--hijau)" : M.jawab[i] ? "var(--merah)" : ""; });
  if (s.bentuk === "bs") document.querySelectorAll(".bs-tombol").forEach((g, i) => { g.querySelector(s.kunci[i] ? ".b" : ".s").style.outline = "3px solid var(--hijau)"; });
}
function terbangKoin(t) { const b = document.getElementById("tbl-periksa").getBoundingClientRect(), d = document.createElement("div"); d.className = "koin-terbang"; d.textContent = t; d.style.left = b.left + b.width / 2 - 30 + "px"; d.style.top = b.top - 10 + "px"; document.body.appendChild(d); setTimeout(() => d.remove(), 1000); }
/* Nomor yang salah diulang dengan soal serupa (misi dan level sama), karena kuncinya sudah ditampilkan */
/* Kesalahan melewati batas: level diulang dari nomor 1 dengan soal baru (hitungan salah, tanda, dan petunjuk direset) */
function lanjutSoal() {
  if (M.habis) { Object.assign(M, { i: 0, salah: 0, tanda: [], petunjuk: false, ulangKe: 0, habis: false, putaran: (M.putaran || 0) + 1 }); tampilPesan("🔁 Mulai lagi dari nomor 1. Semangat!"); }
  else if (M.ulangi) M.ulangKe = (M.ulangKe || 0) + 1; else { M.i++; M.ulangKe = 0; }
  soalBerikut();
}
function konfirmasiKeluar() {
  dialog(`<div style="font-size:54px">🦉</div><h2>Mau berhenti?</h2><p class="ket">Kemajuan di level ini belum disimpan. Koin yang sudah didapat tetap milikmu.</p>`,
    [["Lanjut bermain", "tbl-hijau", null], ["Keluar", "tbl-putih", () => { if (M.coba) return kembaliKeMateri(M.misi); const id = M.harian ? null : M.misi; M = null; id ? tampil("jalur", id) : tampil("beranda"); }]]);
}

/* ================= Selesai level ================= */
function catatApi() { const h = hariIni(); if (S.api.tgl === h) return; S.api.n = S.api.tgl && selisihHari(S.api.tgl, h) === 1 ? S.api.n + 1 : 1; S.api.tgl = h; }
function selesaiLevel() {
  if (M.coba) return hasilCoba();
  const benar = M.tanda.filter(x => x === "benar").length; catatApi();
  const antrean = [];
  if (M.harian) {
    S.harian = { tgl: hariIni(), selesai: true }; S.koin += 50; simpanData(); bunyi.lulus(); konfeti(1.8);
    layar.innerHTML = `<div class="kartu hasil"><div style="font-size:64px">🎁</div><h1>Tantangan Harian Selesai!</h1><div class="ringkas"><div><b>${benar}/${M.n}</b>benar</div><div><b>+${50 + benar * 10}</b>koin 💰</div><div><b>${S.api.n} 🔥</b>hari berturut-turut</div></div>
      <p class="ket">Kembali lagi besok untuk menjaga api semangatmu tetap menyala!</p><div class="tombol-tumpuk"><button class="tbl tbl-utama" data-ke="beranda">Kembali ke Peta 🗺️</button></div></div>`;
    M = null; return;
  }
  const { misi: id, L, n, toleransi, salah } = M, d = dataMisi(id), lulus = salah <= toleransi, koinSoal = M.tanda.filter(x => x !== "salah").length * 10;
  let bintang = lulus ? (salah === 0 ? 3 : 2) - (M.petunjuk ? 1 : 0) : 0; if (lulus) bintang = Math.max(1, bintang);
  const pertama = lulus && d.lv < L, naikBintang = bintang > d.bin[L - 1];
  if (naikBintang) d.bin[L - 1] = bintang; if (pertama) d.lv = L;
  const bonus = lulus ? (pertama ? 20 + L * 5 : 5) : 0; S.koin += bonus;
  S.log.push({ t: Date.now(), m: id, L, b: benar, n, lulus, dt: M.detik || 0, s: M.salahTotal || 0 }); if (S.log.length > 600) S.log.splice(0, S.log.length - 600);
  if (pertama && L === 10 && !S.piala["misi-" + id]) { S.piala["misi-" + id] = hariIni(); antrean.push(["perunggu", cariMisi(id).ikon, "Piala Misi!", `Kamu menaklukkan semua level <b>${cariMisi(id).judul}</b>. Piala kecil ini milikmu!`]); }
  if (bintangMisi(id) === 30 && !S.piala["emas-" + id]) { S.piala["emas-" + id] = hariIni(); antrean.push(["emas", cariMisi(id).ikon, "Piala Emas!", `Sempurna! 30 bintang di <b>${cariMisi(id).judul}</b>. Pialamu berubah menjadi emas!`]); }
  const pos = POS.find(p => p.id === cariMisi(id).pos);
  if (posSelesai(pos.id) && !S.piala["pos-" + pos.id]) { S.piala["pos-" + pos.id] = hariIni(); antrean.push(["perak", pos.ikon, "Piala Pos!", `Semua misi di <b>Pos ${pos.no} · ${pos.judul}</b> selesai. Hebat sekali!`]); }
  const pl = cariPulau(cariMisi(id).pulau);
  if (pulauSelesai(pl.id) && !S.piala["pulau-" + pl.id]) { S.piala["pulau-" + pl.id] = hariIni(); antrean.push(["emas", pl.ikon, `Piala Besar Pulau ${pl.judul}!`, `Seluruh Pulau ${pl.judul} sudah kamu jelajahi!`]); }
  if (semuaSelesai() && !S.piala.raksasa) { S.piala.raksasa = hariIni(); const sisa = S.tka ? selisihHari(hariIni(), S.tka) : null;
    antrean.push(["raksasa", "👑", "PIALA RAKSASA JUARA TKA!", sisa > 0 ? `Kamu meraihnya <b>${sisa} hari sebelum TKA</b>. Kamu benar-benar siap!` : "Kamu adalah Juara TKA sejati!"]); }
  simpanData();
  const t = TINGKAT[L], m = cariMisi(id);
  layar.innerHTML = `<div class="kartu hasil">${lulus ? `<div class="bintang-besar">${[1, 2, 3].map(i => `<span class="${i <= bintang ? "nyala" : ""}">⭐</span>`).join("")}</div><h1>${L === 10 ? "Bos Terakhir dikalahkan!" : bintang === 3 ? "Sempurna!" : "Level selesai!"}</h1>`
    : `<div style="font-size:64px">💪</div><h1>Hampir berhasil!</h1><p class="ket">${toleransi ? `Kesalahan paling banyak <b>${toleransi}×</b>` : "Semua soal harus <b>benar</b>"} untuk naik level. Baca ${M.ujian ? "pembahasan di bawah" : "lagi pembahasannya"}, lalu coba lagi!</p>`}
    <div class="ringkas"><div><b>${benar}/${n}</b>benar${M.ujian ? "" : " langsung"}</div><div><b>${salah}×</b>salah</div><div><b>+${koinSoal + bonus}</b>koin 💰</div><div><b>${m.ikon} ${L}</b>${t[0]}</div></div>
    ${lulus && M.petunjuk ? `<p class="ket">🦉 Coba tanpa petunjuk untuk mendapat ${salah === 0 ? "3" : "lebih banyak"} bintang!</p>` : ""}
    ${lulus && salah > 0 && !M.petunjuk ? `<p class="ket">Jawab semua benar tanpa salah untuk 3 bintang ⭐⭐⭐</p>` : ""}
    ${ulasUjian()}
    <div class="tombol-tumpuk">${lulus && L < 10 ? `<button class="tbl tbl-utama" id="h-lanjut">Lanjut ke Level ${L + 1} ▶</button>` : ""}
      <button class="tbl ${lulus ? "tbl-putih" : "tbl-utama"}" id="h-ulang">${lulus ? "Ulangi untuk bintang lebih" : "Coba lagi 🔁"}</button>
      ${!lulus && adaMateri(id) ? `<button class="tbl tbl-putih" data-ke="materi" data-arg="${id}">📖 Pelajari materinya dulu</button>` : ""}
      <button class="tbl tbl-putih" data-ke="jalur" data-arg="${id}">Kembali ke jalur level</button></div></div>`;
  layar.querySelector("#h-lanjut")?.addEventListener("click", () => { bunyi.klik(); mulaiLevel(id, L + 1); });
  layar.querySelector("#h-ulang").addEventListener("click", () => { bunyi.klik(); mulaiLevel(id, L); });
  M = null; layarKini = "hasil";
  if (lulus) { bunyi.lulus(); if (bintang === 3 || L === 10) konfeti(1.6); } else bunyi.gagal();
  if (antrean.length) setTimeout(() => tunjukPiala(antrean), lulus ? 1300 : 300);
}
/* Mode ujian: semua soal beserta jawaban, kunci, dan pembahasan, baru ditampilkan setelah level selesai */
function ulasUjian() {
  if (!M.ujian || !M.rekam.length) return "";
  const nSalah = M.rekam.filter(x => !x.benar).length;
  return `<details class="ulas-level"${nSalah ? " open" : ""}><summary>🔍 Pembahasan${nSalah ? ` · ${nSalah} soal salah` : " · semua benar 🎉"}</summary>` + M.rekam.map((x, k) => { const s = x.s;
    const opsi = s.bentuk === "pg" || s.bentuk === "pgk" ? `<ol class="contoh-opsi" type="A">${s.opsi.map(o => `<li>${o}</li>`).join("")}</ol>` : "";
    return `<div class="kartu ulas-tes ${x.benar ? "benar" : "salah"}"><div class="nomor">NOMOR ${k + 1} · ${x.benar ? "✅ Benar" : "❌ Salah"}</div>
      ${s.bacaan ? `<details class="contoh-bacaan"><summary>Lihat bacaan</summary><div class="bacaan">${s.bacaan}</div></details>` : ""}
      ${tombolSuara(s)}<div class="teks-soal">${s.teks}</div>${s.gambar ? `<div class="wadah-gambar">${s.gambar}</div>` : ""}${opsi}
      <div class="ulas-jawab"><b>Jawabanmu:</b><div>${jawabanTeks(s, x.j)}</div></div>
      <div class="contoh-kunci"><b>Kunci:</b><div>${s.bentuk === "pg" ? `${"ABCDE"[s.kunci]}. ` : ""}${tulisKunci(s)}</div></div>
      ${htmlBahas(s, "bahas-tes")}</div>`; }).join("") + "</details>";
}
function tunjukPiala(antrean) {
  const [jenis, ikon, judul, teks] = antrean.shift(); bunyi.piala(); konfeti(3.2);
  dialog(`<div class="sinar"><div class="piala-besar">${pialaSVG(jenis, ikon)}</div></div><h2>${judul}</h2><p>${teks}</p>`,
    [[antrean.length ? "Lanjut ✨" : "Lihat lemari piala 🏆", "tbl-utama", () => (antrean.length ? tunjukPiala(antrean) : tampil("piala"))], ["Nanti saja", "tbl-putih", () => antrean.length && tunjukPiala(antrean)]]);
}
function dialog(html, tombol) {
  document.querySelectorAll(".lapis").forEach(x => x.remove());
  const l = document.createElement("div"); l.className = "lapis"; l.setAttribute("role", "dialog"); l.setAttribute("aria-modal", "true");
  l.innerHTML = `<div class="kotak">${html}<div class="tombol-tumpuk">${tombol.map((t, i) => `<button class="tbl ${t[1]}" data-i="${i}">${t[0]}</button>`).join("")}</div></div>`;
  l.addEventListener("click", e => { const b = e.target.closest("button[data-i]"); if (!b) return; l.remove(); const f = tombol[+b.dataset.i][2]; if (f) f(); });
  document.body.appendChild(l); l.querySelector("button").focus();
  return l;
}

/* ================= Lemari piala ================= */
function lPiala() {
  pasangKepala(); pasangNav("piala");
  const jml = Object.keys(S.piala).length;
  layar.innerHTML = `<h1 class="judul-bagian" style="font-size:28px;margin-top:16px">🏆 Lemari Piala</h1><p class="ket">${jml ? `Kamu sudah mengumpulkan <b>${jml} piala</b>. Terus kumpulkan sampai Piala Raksasa!` : "Lemari masih kosong. Selesaikan Level 10 sebuah misi untuk mendapat piala pertamamu!"}</p>
    <div class="lemari">
      <div class="raksasa">${pialaSVG(S.piala.raksasa ? "raksasa" : "kosong", S.piala.raksasa ? "👑" : "")}<h3>Piala Raksasa Juara TKA</h3><div class="ket">${S.piala.raksasa ? "Diraih " + tglIndo(S.piala.raksasa) : `Selesaikan pulau ${PULAU.filter(p => p.tka !== false).map(p => p.judul).join(" & ")}${S.tka ? " sebelum " + tglIndo(S.tka) : " sebelum hari TKA"}`}</div></div>
      <div class="rak"><h3>Piala Pulau</h3><div class="barisan">${PULAU.map(p => `<div class="slot-piala besar">${pialaSVG(S.piala["pulau-" + p.id] ? "emas" : "kosong", S.piala["pulau-" + p.id] ? p.ikon : "")}${p.judul}</div>`).join("")}</div></div>
      <div class="rak"><h3>🎯 Simulasi TKA</h3><div class="barisan">${Object.keys(KISI_TKA).map(pl => `<div class="slot-piala besar" title="Semua 10 paket tuntas">${pialaSVG(S.piala["tka-" + pl] ? "emas" : "kosong", S.piala["tka-" + pl] ? "🎯" : "")}Juara ${SINGKAT_PULAU[pl]}</div>`).join("")}
        ${POS_TES.filter(t => t.tka).map(t => `<div class="slot-piala" title="${judulTes(t)} ${cariPulau(t.pulau).judul}">${pialaSVG(S.piala["tes-" + t.id] ? "perak" : "kosong", S.piala["tes-" + t.id] ? "🎯" : "")}${SINGKAT_PULAU[t.pulau]} ${t.paket}</div>`).join("")}</div></div>
      <div class="rak"><h3>📝 Pos Tes</h3><div class="barisan">${POS_TES.filter(t => !t.tka).map(t => `<div class="slot-piala" title="${judulTes(t)} ${cariPulau(t.pulau).judul}">${pialaSVG(S.piala["tes-" + t.id] ? "perak" : "kosong", S.piala["tes-" + t.id] ? "📝" : "")}${SINGKAT_PULAU[t.pulau] || t.pulau} ${t.no}</div>`).join("")}</div></div>
      ${POS.map(p => `<div class="rak"><h3>${p.ikon} ${pakaiNoPos(p.pulau) ? `Pos ${p.no} · ` : ""}${p.judul}</h3><div class="barisan"><div class="slot-piala">${pialaSVG(S.piala["pos-" + p.id] ? "perak" : "kosong", S.piala["pos-" + p.id] ? p.ikon : "")}Piala Pos</div>
        ${MISI.filter(m => m.pos === p.id).map(m => `<div class="slot-piala" title="${m.judul}">${pialaSVG(S.piala["emas-" + m.id] ? "emas" : S.piala["misi-" + m.id] ? "perunggu" : "kosong", S.piala["misi-" + m.id] ? m.ikon : "")}${m.judul.split(/[ ,&]/)[0]}</div>`).join("")}</div></div>`).join("")}
    </div>
    <div class="kartu"><h3>Cara mendapat piala</h3><ul class="ket" style="margin:8px 0 0;padding-left:20px"><li>🥉 <b>Piala kecil</b>: selesaikan Level 10 sebuah misi.</li><li>🥇 <b>Piala emas kecil</b>: kumpulkan 30⭐ di satu misi.</li><li>🥈 <b>Piala pos</b>: selesaikan semua misi di satu pos.</li><li>📝 <b>Piala Pos Tes</b>: raih nilai ${TES_TUNTAS} atau lebih di Pos Tes (30 soal, 75 menit).</li><li>🏆 <b>Piala pulau</b>: jelajahi seluruh pulau.</li><li>👑 <b>Piala Raksasa</b>: semua pulau selesai sebelum hari TKA!</li></ul></div>`;
}
const tglIndo = t => { const [y, m, d] = t.split("-").map(Number); return `${d} ${["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][m - 1]} ${y}`; };

/* ================= Orang tua: Dasbor, Materi & Level Soal, Pengaturan ================= */
let tabOrtu = "dasbor", bukaMisi = null;
const TAB_ORTU = [["dasbor", "📊", "Dasbor Ortu"], ["materi", "📚", "Materi & Level Soal"], ["atur", "⚙️", "Pengaturan"]];
function lOrtu() {
  pasangKepala(); pasangNav("ortu");
  layar.innerHTML = `<h1 class="judul-bagian" style="font-size:28px;margin-top:16px">👨‍👩‍👧 Untuk Orang Tua</h1>
    <div class="tab-ortu" role="tablist">${TAB_ORTU.map(([k, i, t]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${k === tabOrtu}"><span aria-hidden="true">${i}</span>${t}</button>`).join("")}</div>
    <div id="isi-ortu" role="tabpanel"></div>`;
  layar.querySelector(".tab-ortu").addEventListener("click", e => { const b = e.target.closest("[data-tab]"); if (!b || b.dataset.tab === tabOrtu) return;
    bunyi.klik(); tabOrtu = b.dataset.tab; layar.querySelectorAll("[data-tab]").forEach(x => x.setAttribute("aria-selected", x === b)); isiOrtu(); });
  isiOrtu();
}
function isiOrtu() { ({ dasbor: ortuDasbor, materi: ortuMateri, atur: ortuAtur })[tabOrtu](document.getElementById("isi-ortu")); }

/* Lama dalam detik → "45 dtk", "12 mnt", "1 j 5 mnt" */
const lamaTeks = (dtk, kosong = "–") => { dtk = Math.round(dtk || 0); if (!dtk) return kosong; if (dtk < 60) return dtk + " dtk"; const m = Math.round(dtk / 60); return m < 60 ? m + " mnt" : `${Math.floor(m / 60)} j${m % 60 ? " " + (m % 60) + " mnt" : ""}`; };
function ortuDasbor(el) {
  const tot = MISI.reduce((s, m) => s + dataMisi(m.id).total, 0), ben = MISI.reduce((s, m) => s + dataMisi(m.id).benar, 0);
  const logMinggu = S.log.filter(x => Date.now() - x.t < 7 * 864e5), minggu = logMinggu.length;
  const detikTotal = MISI.reduce((s, m) => s + (dataMisi(m.id).detik || 0), 0), detikMinggu = logMinggu.reduce((s, x) => s + (x.dt || 0), 0);
  const posisi = (m, d) => (misiSelesai(m.id) ? "Selesai 🏆" : level1Terkunci(m.id) ? `🎧 ${subTuntas(m.id)}/5<small>Dengar &amp; Baca${ingLihat(m.id).b ? ` · baca ${ingLihat(m.id).b}%` : ""}</small>`
    : !d.lv && !d.total ? "–" : `Level ${d.lv + 1}<small>${d.lv} lulus</small>`);
  const baris = PULAU.map(p => `<tr class="kelompok"><td colspan="5">${p.ikon} ${p.judul}</td></tr>` + misiPulau(p.id).map(m => { const d = dataMisi(m.id); return `<tr><td>${m.ikon} ${m.judul}</td><td class="angka posisi">${posisi(m, d)}</td><td class="angka">${bintangMisi(m.id)}</td><td class="angka posisi">${d.total ? `${Math.round(d.benar / d.total * 100)}%<small>${d.total - d.benar}× salah</small>` : "–"}</td><td class="angka">${lamaTeks(d.detik)}</td></tr>`; }).join("")).join("");
  const jamTgl = x => { const d = new Date(x); return `${tglIndo(hariIni(d))}, ${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`; };
  const akhir = S.log.slice(-8).reverse().map(x => { const m = cariMisi(x.m); if (!m) return ""; const hasil = x.lulus === undefined ? `${x.b} benar` : x.lulus ? `✅ lulus · ${x.b}/${x.n} benar langsung` : "belum lulus";
    const lama = (x.s !== undefined ? ` · ❌ ${x.s}× salah` : "") + (x.dt ? ` · ⏱️ ${lamaTeks(x.dt)}` : "");
    return `<li><span class="ket">${jamTgl(x.t)}</span><span>${m.ikon} ${m.judul} · <b>Level ${x.L}</b></span><span class="ket">${hasil}${lama}</span></li>`; }).join("");
  const lemah = MISI.filter(m => dataMisi(m.id).total >= 10).sort((a, b) => dataMisi(a.id).benar / dataMisi(a.id).total - dataMisi(b.id).benar / dataMisi(b.id).total).slice(0, 3);
  el.innerHTML = `<div class="kartu"><div class="statistik"><div><b>${fmt(tot)}</b>soal dikerjakan</div><div><b>${tot ? Math.round(ben / tot * 100) : 0}%</b>jawaban benar</div><div><b>${minggu}</b>level minggu ini</div></div>
      <p class="ket" style="margin:12px 0 0">⏱️ Waktu belajar: <b>${lamaTeks(detikTotal, "belum tercatat")}</b>${detikMinggu ? ` · minggu ini <b>${lamaTeks(detikMinggu)}</b>` : ""}</p>
      ${lemah.length ? `<p class="ket" style="margin:12px 0 0">Perlu latihan tambahan: <b>${lemah.map(m => m.judul).join(", ")}</b> (akurasi terendah).</p>` : ""}
      ${S.sinkron?.kode ? `<p class="ket" style="margin:12px 0 0">☁️ Tersimpan online (Kode Anak <b>${kodeTampil(S.sinkron.kode)}</b>)${S.sinkron.terakhir ? `, terakhir ${jamPendek(S.sinkron.terakhir)}` : ""}${S.sinkron.tertunda ? " · ada perubahan yang belum terkirim" : ""}.</p>`
        : `<p class="ket" style="margin:12px 0 0">${S.sinkronMati ? "📱 Penyimpanan online dimatikan di perangkat ini; data hanya ada di perangkat ini. Nyalakan lagi di <b>Pengaturan → Kode Anak</b>." : "⏳ Kode Anak dibuat otomatis begitu perangkat ini tersambung internet. Untuk melihat kemajuan dari HP anak di sini, pilih <b>Pengaturan → Sudah punya Kode Anak?</b>."}</p>`}</div>
    ${htmlRencanaOrtu()}
    ${htmlPosTesOrtu()}
    <div class="kartu"><h3>Aktivitas terakhir</h3>${akhir ? `<ul class="daftar-aktivitas">${akhir}</ul>` : '<p class="ket" style="margin:6px 0 0">Belum ada level yang diselesaikan di perangkat ini.</p>'}</div>
    <div class="kartu"><h3>Kemajuan per misi</h3><p class="ket" style="margin:4px 0 8px"><b>Posisi</b> = level yang sedang dikerjakan (dan banyak level yang sudah lulus) · <b>Hasil</b> = persen jawaban benar dan berapa kali salah · <b>Waktu</b> = lama mengerjakan soal di misi itu (satu soal dihitung paling lama 5 menit).</p><div style="overflow-x:auto"><table class="tabel-laporan"><thead><tr><th>Misi</th><th>Posisi</th><th>⭐</th><th>Hasil</th><th>Waktu</th></tr></thead><tbody>${baris}</tbody></table></div></div>`;
}

/* Materi & Level Soal: susunan pulau → pos → misi → 10 level, dengan contoh soal dan uji coba */
const BENTUK = { isian: "Isian singkat", pg: "Pilihan ganda", bs: "Benar–salah", pgk: "PG kompleks" };
function ortuMateri(el) {
  const a = atur();
  el.innerHTML = `<div class="materi"><div class="kartu"><p class="ket" style="margin:0">Setiap misi punya <b>10 level</b>: level 1–2 sangat mudah, 3–4 mudah, 5–6 sedang, 7 sulit, <b>8 setara TKA</b>, 9–10 di atas TKA. Mulai level 6 bentuk soalnya seperti TKA.
      Aturan saat ini: <b>${a.soal} soal</b> per level, ${a.toleransi ? `boleh salah <b>${a.toleransi}×</b>` : "<b>harus benar semua</b>"}, ${a.ujian ? "<b>mode ujian</b> (tanpa tanda benar/salah, tidak diulang, pembahasan di akhir; lewat batas = belum lulus)" : `nomor yang salah ${a.ulang ? "<b>diulang</b>" : "<b>tidak diulang</b>"}; bila salah melebihi batas, ${a.lanjut ? "anak <b>melanjutkan sampai selesai</b> (belum lulus)" : "level <b>diulang dari nomor 1</b>"}`} (ubah di tab Pengaturan).</p>
      <p class="ket" style="margin:8px 0 0">Setelah tiap pos/jurus ada <b>Pos Tes</b> (30 soal, 75 menit, setara TKA) yang menguji semua pos sebelumnya. Buka sebuah misi, lalu tekan <b>Contoh</b> untuk melihat soal acak beserta kuncinya, atau <b>Coba</b> untuk mengerjakan level itu sendiri. Uji coba tidak mengubah kemajuan dan koin anak.</p></div>` +
    PULAU.map(p => { const ms = misiPulau(p.id), ps = POS.filter(x => x.pulau === p.id);
      return `<div class="kartu modul-kartu modul-${p.id}"><div class="modul-kepala"><span class="md" aria-hidden="true">${p.ikon}</span><div><h2>Pulau ${p.judul}</h2><p>${ps.length} pos · ${ms.length} misi · ${ms.length * 10} level</p></div></div>` +
        ps.map(pos => `<div class="pos-sub">${pos.ikon} ${pakaiNoPos(p.id) ? `Pos ${pos.no} · ` : ""}${pos.judul}</div>` + MISI.filter(m => m.pos === pos.id).map(m =>
          `<details class="tk-baris" data-misi="${m.id}"><summary><span class="tk-no" aria-hidden="true">${m.ikon}</span><span class="tk-nama"><b>${m.judul}</b><span>Anak lulus ${dataMisi(m.id).lv}/10 level · ⭐ ${bintangMisi(m.id)}/30</span></span><span class="tk-panah" aria-hidden="true"></span></summary><div class="tk-isi"></div></details>`).join("")).join("") + htmlPosTesMateri(p.id) + `</div>`; }).join("") +
    `<p class="ket" style="text-align:center">Materi mengikuti Kurikulum Merdeka Fase C. Level 8 setara soal TKA, level 9–10 di atasnya.<br>Cocokkan dengan kisi-kisi resmi TKA SD/MI dari Pusmendik.</p></div>`;
  const w = el.querySelector(".materi");
  // Daftar level baru dibuat saat misi dibuka (bentuk soal ditentukan dari beberapa soal acak)
  w.addEventListener("toggle", e => { const d = e.target; if (d.matches?.("details[data-misi]") && d.open && !d.dataset.isi) { d.dataset.isi = 1; isiLevelMisi(d.querySelector(".tk-isi"), d.dataset.misi); } }, true);
  w.addEventListener("click", e => { const bt = e.target.closest("[data-coba-tes]"); if (bt) { bunyi.klik(); return mulaiTes(bt.dataset.cobaTes, true); }
    const b = e.target.closest("[data-contoh],[data-coba]"); if (!b) return; const id = b.closest("[data-misi]").dataset.misi; bunyi.klik();
    if (b.dataset.coba) return mulaiLevel(id, +b.dataset.coba, true);
    const L = +b.dataset.contoh, box = document.getElementById(`c-${id}-${L}`);
    box.innerHTML = Array.from({ length: 3 }, () => contohHtml(buatSoal(id, L, null))).join(""); box.hidden = false; b.textContent = "Contoh lain"; });
  if (bukaMisi) { const d = w.querySelector(`details[data-misi="${bukaMisi}"]`); bukaMisi = null; if (d) { d.open = true; setTimeout(() => d.scrollIntoView({ block: "start" }), 60); } }
}
function isiLevelMisi(box, id) {
  const d = dataMisi(id);
  box.innerHTML = (adaMateri(id) ? `<div class="lv-baris"><span class="kt"><b>📖 Materi singkat &amp; contoh bertahap</b><small>Yang dilihat anak sebelum mengerjakan level</small></span><span class="lv-tombol"><button type="button" class="tbl tbl-biru tbl-kecil" data-ke="materi" data-arg="${id}">Buka</button></span></div>` : "") + Array.from({ length: 10 }, (_, i) => { const L = i + 1, t = TINGKAT[L], ada = new Set();
    for (let k = 0; k < 8; k++) ada.add(buatSoal(id, L, null).bentuk);
    const bentuk = Object.keys(BENTUK).filter(b => ada.has(b)).map(b => BENTUK[b]).join(", ");
    const status = L <= d.lv ? `<span class="lv-bintang" title="Bintang anak">${"⭐".repeat(d.bin[i])}${"☆".repeat(3 - d.bin[i])}</span>` : L === d.lv + 1 ? '<span class="lv-bintang kini">sedang</span>' : '<span class="lv-bintang">belum</span>';
    return `<div class="lv-baris"><span class="lencana ${t[1]}">Level ${L}</span><span class="kt"><b>${t[0]}</b><small>${bentuk}</small></span>${status}
      <span class="lv-tombol"><button type="button" class="tbl tbl-putih tbl-kecil" data-contoh="${L}">Contoh</button><button type="button" class="tbl tbl-biru tbl-kecil" data-coba="${L}">Coba</button></span></div>
      <div class="contoh-soal" id="c-${id}-${L}" hidden></div>`; }).join("");
}
function contohHtml(s) {
  const opsi = s.bentuk === "pg" || s.bentuk === "pgk" ? `<ol class="contoh-opsi" type="A">${s.opsi.map(o => `<li>${o}</li>`).join("")}</ol>` : "";
  const kunci = s.bentuk === "pg" ? `${"ABCDE"[s.kunci]}. ${s.opsi[s.kunci]}` : s.bentuk === "pgk" ? s.opsi.map((o, i) => (s.kunci[i] ? `${"ABCDE"[i]}. ${o}` : "")).filter(Boolean).join("<br>") : tulisKunci(s);
  return `<div class="contoh-satu">${s.bacaan ? `<details class="contoh-bacaan"><summary>Lihat bacaan</summary><div class="bacaan">${s.bacaan}</div></details>` : ""}
    ${tombolSuara(s)}<div class="teks-soal">${s.teks}</div>${s.gambar ? `<div class="wadah-gambar">${s.gambar}</div>` : ""}${opsi}<div class="contoh-kunci"><b>Kunci:</b><div>${kunci}</div></div>${htmlBahas(s, "bahas-tes")}</div>`;
}

const pilihanTol = pilih => Array.from({ length: TOLERANSI_MAKS + 1 }, (_, i) => `<option value="${i}" ${i === pilih ? "selected" : ""}>${i ? i + "× salah" : "Tanpa salah"}</option>`).join("");
function ortuAtur(el) {
  el.innerHTML = `<div class="kartu"><h3>Profil &amp; aturan level</h3>
      <div class="baris-set"><label for="o-nama"><b>Nama anak</b></label><input id="o-nama" class="isian-teks" style="max-width:220px;min-height:44px" maxlength="20" value="${esc(S.profil.nama)}"></div>
      <div class="baris-set"><b>Teman petualangan</b><select id="o-av" class="isian-teks" style="max-width:120px;min-height:44px;font-size:24px">${AVATAR.map(a => `<option ${a === S.profil.avatar ? "selected" : ""}>${a}</option>`).join("")}</select></div>
      <div class="baris-set"><label for="o-tka"><b>Tanggal TKA</b><div class="ket">Untuk hitung mundur di beranda</div></label><input id="o-tka" type="date" class="isian-teks" style="max-width:200px;min-height:44px" value="${S.tka}"></div>
      <div class="baris-set"><label for="o-soal"><b>Jumlah soal per level</b></label><select id="o-soal" class="isian-teks" style="max-width:130px;min-height:44px">${PILIHAN_SOAL.map(n => `<option value="${n}" ${n === atur().soal ? "selected" : ""}>${n} soal</option>`).join("")}</select></div>
      <div class="baris-set"><span><b>Mode level</b><div class="ket">Ujian: tanpa tanda benar/salah dan tidak diulang, terus sampai selesai; nilai dan pembahasan di akhir level</div></span><button class="tbl tbl-kecil ${atur().ujian ? "tbl-biru" : "tbl-putih"}" id="o-ujian" aria-pressed="${atur().ujian}">${atur().ujian ? "📝 Ujian" : "📖 Belajar"}</button></div>
      <div class="baris-set" id="o-tol-baris"${atur().ujian ? ' style="opacity:.5"' : ""}><label for="o-tol"><b>Toleransi kesalahan mode belajar</b><div class="ket">Batas salah agar level lulus</div></label><select id="o-tol" class="isian-teks" style="max-width:160px;min-height:44px">${pilihanTol(atur().tolBelajar)}</select></div>
      <div class="baris-set" id="o-lewat-baris"${atur().ujian ? ' style="opacity:.5"' : ""}><label for="o-lewat"><b>Bila salah melebihi batas</b><div class="ket">Mode belajar. Lanjut: soal diteruskan sampai selesai, hasilnya belum lulus</div></label><select id="o-lewat" class="isian-teks" style="width:auto;max-width:100%;min-height:44px;font-size:17px;padding-right:8px"><option value="ulang" ${atur().lanjut ? "" : "selected"}>🔁 Ulang dari nomor 1</option><option value="lanjut" ${atur().lanjut ? "selected" : ""}>➡️ Lanjut sampai akhir</option></select></div>
      <div class="baris-set" id="o-tolu-baris"${atur().ujian ? "" : ' style="opacity:.5"'}><label for="o-tolu"><b>Toleransi kesalahan mode ujian</b><div class="ket">Lewat batas, level belum lulus</div></label><select id="o-tolu" class="isian-teks" style="max-width:160px;min-height:44px">${pilihanTol(atur().tolUjian)}</select></div>
      <div class="baris-set" id="o-ulang-baris"${atur().ujian ? ' style="opacity:.5"' : ""}><span><b>Ulangi nomor yang salah</b><div class="ket">Anak mengerjakan soal serupa di nomor itu sampai benar (hanya mode belajar)</div></span><button class="tbl tbl-kecil ${atur().ulang ? "tbl-hijau" : "tbl-putih"}" id="o-ulang" aria-pressed="${atur().ulang}">${atur().ulang ? "✅ Nyala" : "⏭️ Mati"}</button></div>
      <div class="baris-set"><b>Suara</b><button class="tbl tbl-kecil ${S.suara ? "tbl-hijau" : "tbl-putih"}" id="o-suara">${S.suara ? "🔊 Nyala" : "🔇 Mati"}</button></div>
      <h3 style="margin-top:18px">📅 Rencana belajar menuju TKA</h3>
      <div class="baris-set"><label for="o-menit"><b>Waktu belajar per hari</b><div class="ket">Menentukan target level harian</div></label><select id="o-menit" class="isian-teks" style="width:auto;min-height:44px">${MENIT_PILIHAN.map(m => `<option value="${m}" ${m === aturRencana().menit ? "selected" : ""}>${m} menit</option>`).join("")}</select></div>
      <div class="baris-set"><span><b>Hari belajar</b><div class="ket">Hari lainnya libur</div></span><span class="pilih-hari" id="o-hb">${HARI_SINGKAT.map((h, i) => `<button type="button" data-hari="${i}" aria-pressed="${aturRencana().hari.includes(i)}">${h}</button>`).join("")}</span></div>
      <div class="baris-set"><span><b>Hari simulasi TKA</b><div class="ket">Satu paket 75 menit, dijadwalkan menjelang TKA</div></span><span class="pilih-hari" id="o-hs">${HARI_SINGKAT.map((h, i) => `<button type="button" data-hari="${i}" aria-pressed="${aturRencana().sim.includes(i)}">${h}</button>`).join("")}</span></div>
      <div class="baris-set"><label for="o-ingtarget"><b>Target selesai Bahasa Inggris</b><div class="ket">Program belajar: boleh sesudah TKA, bahkan beberapa tahun. Kosongkan bila tidak ikut rencana.</div></label>
        <span style="display:flex;gap:6px;align-items:center"><input id="o-ingtarget" type="date" class="isian-teks" style="width:auto;min-height:44px" value="${aturRencana().ingTarget}" min="${hariIni()}"><button type="button" class="tbl tbl-putih tbl-kecil" id="o-ingtarget-hapus" aria-label="Kosongkan target">✕</button></span></div>
      <div class="baris-set"><label for="o-ingsampai"><b>Cakupan target Bahasa Inggris</b><div class="ket">Untuk 54 misi. Dengar &amp; Baca = 5 sub level per misi</div></label><select id="o-ingsampai" class="isian-teks" style="width:auto;max-width:100%;min-height:44px;font-size:16px">${CAKUPAN_ING.map(([v, t]) => `<option value="${v}" ${v === aturRencana().ingSampai ? "selected" : ""}>${t}</option>`).join("")}</select></div>
      <div class="baris-set"><span><b>Hari latihan Bahasa Inggris</b><div class="ket">Hanya di hari belajar; bawaan sama dengan hari belajar</div></span><span class="pilih-hari" id="o-ih">${HARI_SINGKAT.map((h, i) => `<button type="button" data-hari="${i}" aria-pressed="${aturRencana().ingHari.includes(i)}">${h}</button>`).join("")}</span></div>
      <h3 style="margin-top:18px">🌍 Bahasa Inggris · Dengar &amp; Baca</h3>
      ${[["dengar", "Wajib dengar seluruh teks", "Sebelum sub level 1 terbuka"],
        ["baca", `Wajib Baca &amp; Koreksi ≥ ${ING_LULUS_BACA}%`, "Anak membaca keras, dinilai mikrofon. Matikan bila kelas ramai atau mikrofon HP kurang baik"],
        ["ucap", "Sub level Ucapkan memakai mikrofon", "Mati: diganti mengetik atau menyusun kata"],
        ["syarat", "Level 1 terbuka setelah Dengar &amp; Baca tuntas", "Hanya untuk misi yang belum dimulai"]].map(([k, j, ket]) =>
        `<div class="baris-set"><span><b>${j}</b><div class="ket">${ket}</div></span><button class="tbl tbl-kecil ${aturIng()[k] ? "tbl-hijau" : "tbl-putih"}" data-ing="${k}" aria-pressed="${aturIng()[k]}">${aturIng()[k] ? "✅ Nyala" : "⏭️ Mati"}</button></div>`).join("")}
      ${bisaMikEN() ? "" : '<p class="ket">ℹ️ Peramban ini tidak punya pengenal suara: langkah mikrofon dilewati otomatis. Pakai Chrome di Android untuk fitur bicara.</p>'}
      <p class="ket" style="margin:10px 0 0">💾 Setiap perubahan langsung tersimpan.</p><button class="tbl tbl-biru tbl-lebar" id="o-simpan" style="margin-top:8px">Simpan pengaturan</button></div>
    <div class="kartu" id="kartu-sinkron">${isiKartuSinkron()}</div>
    <div class="kartu"><h3>Cadangan kemajuan</h3><p class="ket">Kemajuan tersimpan di peramban perangkat ini. Unduh cadangan secara berkala, atau untuk pindah ke perangkat lain.</p>
      <div class="baris-set"><button class="tbl tbl-putih tbl-kecil" id="o-unduh">⬇️ Unduh cadangan</button><label class="tbl tbl-putih tbl-kecil" style="cursor:pointer">⬆️ Pulihkan dari berkas<input type="file" id="o-pulih" accept=".json,application/json" hidden></label></div>
      <div class="baris-set"><span class="ket">Mulai dari awal (semua kemajuan dihapus)</span><button class="tbl tbl-merah tbl-kecil" id="o-hapus">Hapus kemajuan</button></div></div>`;
  const $ = q => el.querySelector(q);
  pasangKartuSinkron($("#kartu-sinkron"));
  $("#o-suara").addEventListener("click", e => { S.suara = !S.suara; e.target.textContent = S.suara ? "🔊 Nyala" : "🔇 Mati"; e.target.className = "tbl tbl-kecil " + (S.suara ? "tbl-hijau" : "tbl-putih"); simpanData(); bunyi.klik(); });
  let ulang = atur().ulang, ujian = atur().ujian;
  $("#o-ujian").addEventListener("click", e => { ujian = !ujian; e.target.textContent = ujian ? "📝 Ujian" : "📖 Belajar"; e.target.className = "tbl tbl-kecil " + (ujian ? "tbl-biru" : "tbl-putih"); e.target.setAttribute("aria-pressed", ujian); ["#o-ulang-baris", "#o-tol-baris", "#o-lewat-baris"].forEach(q => $(q).style.opacity = ujian ? ".5" : ""); $("#o-tolu-baris").style.opacity = ujian ? "" : ".5"; bunyi.klik(); simpanAtur(true); });
  const rc = aturRencana(), hb = new Set(rc.hari), hs = new Set(rc.sim), ih = new Set(rc.ingHari);
  $("#o-ingtarget-hapus").addEventListener("click", () => { $("#o-ingtarget").value = ""; bunyi.klik(); simpanAtur(true); });
  [["#o-hb", hb], ["#o-hs", hs], ["#o-ih", ih]].forEach(([q, set]) => $(q).addEventListener("click", e => { const b = e.target.closest("[data-hari]"); if (!b) return; const i = +b.dataset.hari;
    if (set.has(i)) { if (set !== hs && set.size === 1) return tampilPesan("Pilih paling sedikit satu hari."); set.delete(i); } else set.add(i);
    b.setAttribute("aria-pressed", set.has(i)); bunyi.klik(); simpanAtur(true); }));
  const ing = aturIng();
  el.querySelectorAll("[data-ing]").forEach(b => b.addEventListener("click", () => { const k = b.dataset.ing; ing[k] = !ing[k];
    b.textContent = ing[k] ? "✅ Nyala" : "⏭️ Mati"; b.className = "tbl tbl-kecil " + (ing[k] ? "tbl-hijau" : "tbl-putih"); b.setAttribute("aria-pressed", ing[k]); bunyi.klik(); simpanAtur(true); }));
  $("#o-ulang").addEventListener("click", e => { ulang = !ulang; e.target.textContent = ulang ? "✅ Nyala" : "⏭️ Mati"; e.target.className = "tbl tbl-kecil " + (ulang ? "tbl-hijau" : "tbl-putih"); e.target.setAttribute("aria-pressed", ulang); bunyi.klik(); simpanAtur(true); });
  /* Tersimpan otomatis setiap ada perubahan (12 Okt 2026): dulu hanya lewat tombol Simpan di bawah, sehingga perubahan
     (mis. tanggal TKA) hilang bila halaman ditinggalkan sebelum menekannya */
  const simpanAtur = otomatis => { const n = $("#o-nama").value.trim(); if (!n) return tampilPesan("Nama tidak boleh kosong.");
    const soal = +$("#o-soal").value, tol = +$("#o-tol").value, tolU = +$("#o-tolu").value;
    if (tol >= soal) return tampilPesan("Toleransi mode belajar harus lebih kecil dari jumlah soal.");
    if (tolU >= soal) return tampilPesan("Toleransi mode ujian harus lebih kecil dari jumlah soal.");
    S.profil.nama = n; S.profil.avatar = $("#o-av").value; S.tka = $("#o-tka").value || ""; S.atur = { soal, toleransi: tol, toleransiUjian: tolU, ulang, ujian, lewatBatas: $("#o-lewat").value, menitHarian: +$("#o-menit").value, hariBelajar: [...hb].sort(), hariSimulasi: [...hs].sort(), ingTarget: $("#o-ingtarget").value || "", ingHari: [...ih].sort(), ingSampai: +$("#o-ingsampai").value,ingDengar: ing.dengar, ingBaca: ing.baca, ingUcap: ing.ucap, ingSyarat: ing.syarat }; S.waktu = { ...(S.waktu || {}), atur: Date.now() }; simpanData(); pasangKepala(); tampilPesan(otomatis ? "✅ Tersimpan" : "✅ Pengaturan disimpan", otomatis ? 1400 : 2600); };
  $("#o-simpan").addEventListener("click", () => simpanAtur(false));
  ["#o-nama", "#o-av", "#o-tka", "#o-soal", "#o-tol", "#o-tolu", "#o-lewat", "#o-menit", "#o-ingtarget", "#o-ingsampai"].forEach(q => $(q).addEventListener("change", () => simpanAtur(true)));
  $("#o-unduh").addEventListener("click", async () => { const nm = `petualangan-tka-${S.profil.nama.replace(/\W+/g, "-").toLowerCase()}-${hariIni()}.json`; try { await simpanBerkas(JSON.stringify(S), nm, "application/json"); tampilPesan(pesanSimpan("diunduh", nm), 4000); } catch (e) { tampilPesan("Unduhan gagal. Jika memakai VPN atau ekstensi peramban, matikan dulu lalu coba lagi.", 5000); } });
  $("#o-pulih").addEventListener("change", e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const x = JSON.parse(r.result); if (x.v !== 1 || !x.profil) throw 0;
      dialog(`<div style="font-size:48px">⬆️</div><h2>Pulihkan cadangan?</h2><p class="ket">Kemajuan <b>${esc(x.profil.nama)}</b> akan menggantikan kemajuan di perangkat ini.</p>`, [["Ya, pulihkan", "tbl-utama", () => { S = Object.assign(bawaan(), x); simpanData(); tampilPesan("✅ Cadangan dipulihkan"); tampil("beranda"); }], ["Batal", "tbl-putih", null]]);
    } catch (er) { tampilPesan("Berkas ini bukan cadangan Petualangan TKA."); } }; r.readAsText(f); });
  $("#o-hapus").addEventListener("click", () => { const l = dialog(`<div style="font-size:48px">⚠️</div><h2>Hapus semua kemajuan?</h2><p class="ket">Ketik <b>HAPUS</b> untuk memastikan. Unduh cadangan dulu bila perlu.</p><input class="isian-teks" id="konf-hapus" autocomplete="off">`,
    [["Hapus", "tbl-merah", () => { if (konf !== "HAPUS") { tampilPesan("Tidak dihapus: ketik HAPUS dengan huruf besar."); return; } localStorage.removeItem(KUNCI_SIMPAN); S = bawaan(); tampil("sambut"); }], ["Batal", "tbl-putih", null]]);
    let konf = ""; l.querySelector("#konf-hapus").addEventListener("input", e => (konf = e.target.value.trim())); l.querySelector("#konf-hapus").focus(); });
}

/* Uji coba orang tua: tidak memakai riwayat soal, tidak mengubah kemajuan, koin, maupun api */
function kembaliKeMateri(id) { M = null; izinOrtu = true; tabOrtu = "materi"; bukaMisi = id; tampil("ortu"); }
function hasilCoba() {
  const { misi: id, L, n, toleransi, salah } = M, benar = M.tanda.filter(x => x === "benar").length, lulus = salah <= toleransi, m = cariMisi(id);
  layar.innerHTML = `<div class="kartu hasil"><div style="font-size:64px">🧪</div><h1>Uji coba ${lulus ? "lulus" : "belum lulus"}</h1><p class="ket">${m.ikon} ${m.judul} · Level ${L} · ${TINGKAT[L][0]}<br>Hasil uji coba tidak mengubah kemajuan dan koin anak.</p>
    <div class="ringkas"><div><b>${benar}/${n}</b>benar${M.ujian ? "" : " langsung"}</div><div><b>${salah}×</b>salah</div><div><b>${toleransi}×</b>batas salah</div></div>
    ${ulasUjian()}
    <div class="tombol-tumpuk"><button class="tbl tbl-utama" id="h-ulang">Coba lagi 🔁</button><button class="tbl tbl-putih" id="h-materi">Kembali ke Materi &amp; Level Soal</button></div></div>`;
  layar.querySelector("#h-ulang").addEventListener("click", () => { bunyi.klik(); mulaiLevel(id, L, true); });
  layar.querySelector("#h-materi").addEventListener("click", () => { bunyi.klik(); kembaliKeMateri(id); });
  M = null; layarKini = "hasil"; if (lulus) bunyi.lulus(); else bunyi.gagal();
}

/* Kemajuan berubah di tab lain, atau aplikasi kembali dibuka: tampilkan data terbaru.
   Pengaturan dan Materi tidak digambar ulang supaya isian/bagian yang terbuka tidak hilang. */
function perbaruiTampilan() {
  if (!segarkanData() || document.querySelector(".lapis")) return;
  if (layarKini === "ortu") { if (tabOrtu === "dasbor") { pasangKepala(); isiOrtu(); } else pasangKepala(); return; }
  if (["beranda", "piala", "pulau", "jalur", "rencana"].includes(layarKini)) { const y = window.scrollY; tampil(layarKini, argKini); window.scrollTo(0, y); }
}
window.addEventListener("storage", e => { if (e.key === KUNCI_SIMPAN) perbaruiTampilan(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") { perbaruiTampilan(); sinkronkan(); } });

/* ================= Mulai ================= */
tampil(S.profil ? "beranda" : "sambut");
if (S.profil && S.peran === "ortu") tampil("ortu");   // HP orang tua langsung ke halaman Orang Tua (tanpa PIN)
cekTesTertunda();   // Pos Tes yang belum dikumpulkan saat aplikasi ditutup
setTimeout(() => sinkronkan(), 800);
