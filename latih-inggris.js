/* Latihan Dengar & Baca — Pulau Bahasa Inggris (11 Okt 2026)
   ---------------------------------------------------------------
   Meniru alur English Reading, sebagai TAMBAHAN di depan 10 level setiap misi Bahasa Inggris:
     1. Dengarkan seluruh teks (speechSynthesis; kalimat yang dibacakan disorot, kata bisa diketuk).
     2. Baca & Koreksi: anak membaca keras, mikrofon (SpeechRecognition) menilai tiap kata;
        teks harus dibaca sampai habis dengan akurasi ≥ 75% (bisa diubah orang tua: S.atur.ingBacaMin).
     3. Lima sub level (10 soal). Nilai = jawaban benar pada percobaan pertama; soal yang salah diulang
        dengan soal lain di akhir tanpa menambah nilai. Sub level berikutnya terbuka bila nilai ≥ 80%.
   Pengaturan orang tua (S.atur): ingDengar, ingBaca, ingUcap, ingSyarat (Level 1 baru terbuka setelah
   kelima sub level tuntas; hanya misi yang belum dimulai). Perangkat tanpa suara/mikrofon: langkah itu
   dilewati, dan soal ucapan diganti mengetik atau menyusun kata.
   Kemajuan: S.ing[idMisi] = { d: 1 bila seluruh teks sudah didengar, dh: kalimat yang sudah didengar,
   b: skor Baca & Koreksi terbaik, s: [nilai terbaik sub level 1–5] } — ikut tersinkron (gabung: nilai terbesar). */
"use strict";

const ING_LULUS_SUB = 80, ING_LULUS_BACA = 75, ING_SOAL_SUB = 10;
const SR_ING = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition || null) : null;
const LAJU_EN = [[0.6, "Sangat pelan"], [0.75, "Pelan"], [0.9, "Sedang"], [1, "Normal"]];
const NAMA_SUB = {
  kata: ["Kenali", "Dengar", "Situasi", "Lengkapi & susun", "Ucapkan"],
  pola: ["Pilih bentuk", "Benar atau salah", "Dengar", "Susun kalimat", "Ucapkan"],
  bacaan: ["Kosakata bacaan", "Dengar & pahami", "Urutkan", "Pemahaman", "Ucapkan kalimat"],
};
const IKON_SUB = ["👀", "👂", "💬", "🧩", "🎤"];

const misiInggris = id => /^en-/.test(id || "") && !!enLevel(id.slice(3));
const lvIng = id => enLevel(id.slice(3));
const jenisIng = lv => (lv.kosakata ? "kata" : lv.pola ? "pola" : "bacaan");
const aturIng = () => { const a = S.atur || {}; return { dengar: a.ingDengar !== false, baca: a.ingBaca !== false, ucap: a.ingUcap !== false, syarat: a.ingSyarat !== false }; };
/* Akurasi minimal Baca & Koreksi diatur orang tua (S.atur.ingBacaMin, bawaan 75%) */
const PILIHAN_BACA = [50, 60, 65, 70, 75, 80, 85, 90, 95];
const bacaMin = () => { const v = +(S.atur || {}).ingBacaMin; return PILIHAN_BACA.includes(v) ? v : ING_LULUS_BACA; };
const bisaDengarEN = () => typeof window !== "undefined" && "speechSynthesis" in window && adaSuaraInggris();
const bisaMikEN = () => !!SR_ING;
const lajuEN = () => (LAJU_EN.some(x => x[0] === S.lajuEn) ? S.lajuEn : 0.75);
const ingLihat = id => { const x = (S.ing && S.ing[id]) || {}; return { d: x.d || 0, dh: x.dh || [], b: x.b || 0, s: [0, 1, 2, 3, 4].map(i => (x.s && x.s[i]) || 0) }; };
function dataIng(id) { const x = ((S.ing ||= {})[id] ||= {}); x.s ||= [0, 0, 0, 0, 0]; return x; }
const bolehSimpanIng = () => S.peran !== "ortu";
const perluDengar = id => aturIng().dengar && bisaDengarEN() && !ingLihat(id).d;
const perluBaca = id => aturIng().baca && bisaMikEN() && ingLihat(id).b < bacaMin();
const subTerbuka = (id, n) => (n === 0 ? !perluDengar(id) && !perluBaca(id) : ingLihat(id).s[n - 1] >= ING_LULUS_SUB);
const subTuntas = id => ingLihat(id).s.filter(v => v >= ING_LULUS_SUB).length;
const latihTuntas = id => subTuntas(id) === 5;
const level1Terkunci = id => misiInggris(id) && aturIng().syarat && dataMisi(id).lv === 0 && !latihTuntas(id);

/* ---------- Teks latihan: daftar kalimat { en, id, kata } ---------- */
function kalimatIng(lv) {
  if (lv.kosakata) return lv.kosakata.flatMap(w => [{ en: besar1(w[0]) + ".", id: w[1], kata: true }, { en: w[2], id: w[3] }]);
  const en = pecahKalimat(lv.teks), id = pecahKalimat(lv.arti || "");
  return en.map((e, i) => ({ en: e, id: id[i] || "" }));
}

/* ---------- Pencocokan ucapan ---------- */
const SATUAN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const PULUHAN = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function angkaKata(n) {
  if (n < 20) return SATUAN[n];
  if (n < 100) return PULUHAN[Math.floor(n / 10)] + (n % 10 ? " " + SATUAN[n % 10] : "");
  if (n < 1000) return SATUAN[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + angkaKata(n % 100) : "");
  if (n < 1e6) return angkaKata(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + angkaKata(n % 1000) : "");
  return String(n);
}
const URUTAN_KHUSUS = { one: "first", two: "second", three: "third", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth" };
function urutanKata(n) {
  const w = angkaKata(n).split(" "), akhir = w.pop();
  return [...w, URUTAN_KHUSUS[akhir] || (/y$/.test(akhir) ? akhir.slice(0, -1) + "ieth" : akhir + "th")].join(" ");
}
const SINGKATAN = { "i'm": "i am", "you're": "you are", "we're": "we are", "they're": "they are", "he's": "he is", "she's": "she is", "it's": "it is",
  "that's": "that is", "there's": "there is", "what's": "what is", "where's": "where is", "who's": "who is", "let's": "let us", "i'll": "i will",
  "you'll": "you will", "we'll": "we will", "they'll": "they will", "he'll": "he will", "she'll": "she will", "it'll": "it will", "i've": "i have",
  "you've": "you have", "we've": "we have", "they've": "they have", "i'd": "i would", "don't": "do not", "doesn't": "does not", "didn't": "did not",
  "isn't": "is not", "aren't": "are not", "wasn't": "was not", "weren't": "were not", "can't": "can not", "cannot": "can not", "won't": "will not",
  "shouldn't": "should not", "mustn't": "must not", "haven't": "have not", "hasn't": "has not", "couldn't": "could not", "wouldn't": "would not",
  im: "i am", dont: "do not", doesnt: "does not", didnt: "did not", isnt: "is not", arent: "are not", cant: "can not", wont: "will not",   // pengenal suara kadang tanpa tanda petik
  mr: "mister", mrs: "missus", ms: "miss" };
const HOMOFON = { two: "to", too: "to", four: "for", hour: "our", write: "right", ate: "eight", won: "one", know: "no", sea: "see", son: "sun",
  buy: "by", bye: "by", here: "hear", their: "there", flour: "flower", meat: "meet", weak: "week", blew: "blue", eye: "i", wood: "would", whole: "hole",
  dear: "deer", pair: "pear", piece: "peace", tail: "tale", mail: "male", knight: "night", new: "knew", red: "read", ok: "okay" };
function tokenEN(teks) {
  let t = " " + String(teks || "").toLowerCase().replace(/[’‘`]/g, "'").replace(/-/g, " ") + " ";
  t = t.replace(/\b(\d{1,2}):(\d{2})\b/g, (_, h, m) => ` ${angkaKata(+h)}${+m ? " " + angkaKata(+m) : ""} `);
  t = t.replace(/\b(\d+)(st|nd|rd|th)\b/g, (_, n) => ` ${urutanKata(+n)} `);
  t = t.replace(/\d[\d.,]*/g, x => { const n = +x.replace(/[.,]/g, ""); return Number.isFinite(n) ? ` ${angkaKata(n)} ` : " "; });
  t = t.replace(/[a-z']+/g, w => SINGKATAN[w] || w);
  return t.replace(/[^a-z' ]/g, " ").replace(/'/g, "").split(/\s+/).filter(Boolean).map(w => HOMOFON[w] || w);
}
function miripTeks(a, b) {
  if (a === b) return 1; if (!a.length || !b.length) return 0;
  let p = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) { const q = [i]; for (let j = 1; j <= b.length; j++) q[j] = Math.min(p[j] + 1, q[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = q; }
  return 1 - p[b.length] / Math.max(a.length, b.length);
}
const cocokKata = (a, b) => a === b || (a.length >= 4 && miripTeks(a, b) >= 0.8);
/* Penjajaran urut (LCS): target [{t}], ucapan [{t, y}] → pasangan indeks ucapan per target (-1 = tidak cocok) */
function jajarkan(target, ucap) {
  const n = target.length, m = ucap.length, D = Array.from({ length: n + 1 }, () => new Int16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) D[i][j] = cocokKata(target[i].t, ucap[j].t) ? D[i + 1][j + 1] + 1 : Math.max(D[i + 1][j], D[i][j + 1]);
  const pas = Array(n).fill(-1); let i = 0, j = 0;
  while (i < n && j < m) { if (cocokKata(target[i].t, ucap[j].t) && D[i][j] === D[i + 1][j + 1] + 1) { pas[i] = j; i++; j++; } else if (D[i + 1][j] >= D[i][j + 1]) i++; else j++; }
  return { pas, cocok: D[0][0] };
}
/* Skor per token target: cocok = keyakinan (min 60; tanpa keyakinan = 100); terlewat = kemiripan (maks 84); belum dibaca = null */
function nilaiToken(target, ucap) {
  const { pas } = jajarkan(target, ucap), akhir = pas.reduce((a, j, i) => (j >= 0 ? i : a), -1);
  return target.map((x, i) => {
    if (pas[i] >= 0) { const y = ucap[pas[i]].y; return y > 0 ? Math.max(60, Math.round(y * 100)) : 100; }
    if (i > akhir) return null;
    return Math.min(84, Math.round(Math.max(0, ...ucap.map(u => miripTeks(x.t, u.t))) * 100));
  });
}
/* Satu kata/frasa: alternatif pertama cocok = lulus penuh; alternatif lain = 75; tidak cocok = kemiripan (maks 69 → belum lulus) */
function nilaiUcapanKata(targets, alts) {
  let best = 0;
  for (const tg of targets) {
    const t = tokenEN(tg).join(" "); if (!t) continue;
    for (const [k, a] of alts.entries()) {
      const u = tokenEN(a.t).join(" ");
      if ((" " + u + " ").includes(" " + t + " ")) best = Math.max(best, k === 0 ? Math.max(85, Math.round((a.y || 1) * 100)) : 75);
      else best = Math.max(best, Math.min(69, Math.round(miripTeks(t, u) * 100)));
    }
  }
  return best;
}
/* Kalimat: lulus bila kata yang terlewat paling banyak 20% (minimal 1 kata boleh terlewat) */
function nilaiUcapanKalimat(target, alts) {
  const tt = tokenEN(target).map(t => ({ t })); let best = { ok: false, persen: 0, ucap: "" };
  for (const a of alts) { const u = tokenEN(a.t).map(t => ({ t })), { cocok } = jajarkan(tt, u), persen = Math.round(cocok * 100 / tt.length);
    const ok = tt.length - cocok <= Math.max(1, Math.round(tt.length * 0.2)); if ((ok && !best.ok) || (ok === best.ok && persen > best.persen)) best = { ok, persen, ucap: a.t }; }
  return best;
}

/* ---------- Suara ---------- */
function suaraEN() {
  try { const v = window.speechSynthesis.getVoices();
    return v.find(x => /^en[-_]US/i.test(x.lang) && /Google|Natural|Online/i.test(x.name)) || v.find(x => /^en[-_]US/i.test(x.lang)) || v.find(x => /^en/i.test(x.lang)) || null; }
  catch (e) { return null; }
}
function ucapEN(teks, laju, selesai) {
  const ss = window.speechSynthesis; let sudah = false; const akhir = ok => { if (!sudah) { sudah = true; if (selesai) selesai(ok); } };
  if (!ss || !teks) return akhir(false);
  try { const u = new SpeechSynthesisUtterance(teks); u.lang = "en-US"; u.rate = laju; const v = suaraEN(); if (v) u.voice = v;
    u.onend = () => akhir(true); u.onerror = () => akhir(false); ss.speak(u); }
  catch (e) { akhir(false); }
}
/* Dengar satu kali (kata/kalimat): cb(alternatif[] | null, galat) */
function dengarSekali(maksMs, cb) {
  let hasil = null, sel = false, r;
  const akhir = (h, g) => { if (sel) return; sel = true; clearTimeout(t); cb(h, g); };
  const t = setTimeout(() => { try { r.stop(); } catch (e) { /* sudah berhenti */ } }, maksMs);
  try { r = new SR_ING(); r.lang = "en-US"; r.continuous = false; r.interimResults = false; r.maxAlternatives = 5;
    r.onresult = e => { hasil = Array.from(e.results[0]).map(a => ({ t: a.transcript, y: a.confidence })); };
    r.onerror = e => akhir(null, e.error); r.onend = () => akhir(hasil, null); r.start(); }
  catch (e) { akhir(null, "start"); }
  return { berhenti: () => { try { r.stop(); } catch (e) { /* sudah berhenti */ } } };
}
const pesanMik = g => (g === "not-allowed" || g === "service-not-allowed" ? "Mikrofon belum diizinkan. Izinkan mikrofon untuk situs ini di pengaturan peramban."
  : g === "no-speech" ? "Belum terdengar suara. Dekatkan HP lalu coba lagi." : g === "network" ? "Pengenal suara butuh internet. Periksa sambungan, lalu coba lagi." : "Mikrofon belum bisa dipakai. Coba lagi.");

/* ================= Layar Dengar & Baca ================= */
let LB = null;      // layar latihan yang terbuka: { id, unit, kata[], main, token, rek }
function hentikanSuaraLatih() {
  if (LB) { LB.main = false; LB.token++; if (LB.rek) { LB.rek.aktif = false; try { LB.rek.r.stop(); } catch (e) { /* sudah berhenti */ } LB.rek = null; } }
  try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* tanpa suara */ }
}
function htmlTeksLatih(lv, unit) {
  let w = 0; const kata = [];
  const kal = (u, i) => { const isi = u.en.split(/\s+/).filter(Boolean).map(x => { const tk = tokenEN(x); kata.push({ teks: x, tk, kal: i }); return `<span class="lt-kata" data-w="${w++}">${esc(x)}</span>`; }).join(" ");
    return `<div class="lt-kal${u.kata ? " lt-judul-kata" : ""}" data-k="${i}"><span lang="en">${isi}</span>${u.kata ? ` <span class="lt-arti-kata">· ${esc(u.id)}</span>` : u.id ? `<div class="lt-arti">${esc(u.id)}</div>` : ""}</div>`; };
  let html;
  if (lv.kosakata) { html = ""; for (let i = 0; i < unit.length; i += 2) html += `<div class="lt-kartu-kata">${kal(unit[i], i)}${unit[i + 1] ? kal(unit[i + 1], i + 1) : ""}</div>`; }
  else html = `<div class="lt-teks">${unit.map(kal).join("")}</div>`;
  return { html, kata };
}
function lLatih(id) {
  const m = cariMisi(id); if (!m || !misiInggris(id)) return tampil("beranda");
  hentikanSuaraLatih(); pasangKepala("jalur", id); pasangNav("beranda");
  const lv = lvIng(id), unit = kalimatIng(lv), { html, kata } = htmlTeksLatih(lv, unit);
  LB = { id, unit, kata, main: false, token: 0, mulai: 0, rek: null };
  const mik = bisaMikEN(), tts = bisaDengarEN();   // Baca & Koreksi tetap bisa dipakai walau tidak diwajibkan
  layar.innerHTML = `<div class="jalur-kepala"><div class="ikon-misi">${m.ikon}</div><h1>${m.judul}</h1><p class="ket">🎧 Dengar &amp; Baca · ${subTuntas(id)}/5 sub level tuntas</p></div>
    ${S.peran === "ortu" ? '<div class="kartu banner-ortu"><div>👀 <b>HP orang tua</b> — boleh mencoba, tetapi hasilnya tidak disimpan.</div></div>' : ""}
    ${ILUS_EN.ada(lv) ? ILUS_EN.html(lv) : ""}
    ${lv.pola ? `<div class="kartu lt-pola"><div class="lt-pola-label">Pola</div><div class="lt-pola-rumus" lang="en">${lv.pola}</div>${lv.catatan ? `<p class="ket">${lv.catatan}</p>` : ""}</div>` : ""}
    <div class="kartu lt-panel">
      <div class="lt-tombol">${tts ? '<button class="tbl tbl-utama" id="lt-dengar">▶ Dengarkan</button>' : ""}${mik ? '<button class="tbl tbl-biru" id="lt-baca">🎤 Baca &amp; Koreksi</button>' : ""}</div>
      <div class="lt-setel">${tts ? `<label>Kecepatan <select id="lt-laju" class="isian-teks">${LAJU_EN.map(([v, t]) => `<option value="${v}" ${v === lajuEN() ? "selected" : ""}>${t}</option>`).join("")}</select></label>` : ""}
        <button type="button" class="tbl tbl-putih tbl-kecil" id="lt-arti-tbl" aria-pressed="${S.artiEn !== false}">${S.artiEn !== false ? "Sembunyikan terjemahan" : "Tampilkan terjemahan"}</button></div>
      <p class="ket" id="lt-petunjuk">${tts ? "Ketuk sebuah kata untuk mendengarnya. " : "Suara bahasa Inggris tidak tersedia di perangkat ini. "}${mik ? "Tekan <b>Baca &amp; Koreksi</b>, lalu baca teks dengan suara keras sampai habis." : ""}</p>
      <div id="lt-isi" class="${S.artiEn !== false ? "" : "tanpa-arti"}">${html}</div>
      <div id="lt-hasil"></div></div>
    <div class="kartu" id="lt-tangga">${htmlTangga(id)}</div>
    <div class="tombol-tumpuk" style="margin-bottom:24px"><button class="tbl tbl-putih" data-ke="jalur" data-arg="${id}">Ke jalur Level 1–10</button></div>`;
  const $ = q => layar.querySelector(q);
  $("#lt-dengar")?.addEventListener("click", () => { bunyi.klik(); if (LB.main) hentikanDengar(); else mulaiDengar(LB.mulai); });
  $("#lt-baca")?.addEventListener("click", () => { bunyi.klik(); LB.rek ? selesaiBaca() : mulaiBaca(); });
  $("#lt-laju")?.addEventListener("change", e => { S.lajuEn = +e.target.value; simpanData(false); });
  $("#lt-arti-tbl").addEventListener("click", e => { S.artiEn = S.artiEn === false; simpanData(false); $("#lt-isi").classList.toggle("tanpa-arti", S.artiEn === false);
    e.target.textContent = S.artiEn !== false ? "Sembunyikan terjemahan" : "Tampilkan terjemahan"; e.target.setAttribute("aria-pressed", S.artiEn !== false); });
  $("#lt-isi").addEventListener("click", e => { const k = e.target.closest(".lt-kata"); if (!k || LB.rek) return;
    const w = LB.kata[+k.dataset.w]; hentikanDengar(); LB.mulai = w.kal; ucapEN(w.teks.replace(/[^\w'’\- ]/g, ""), Math.min(lajuEN(), 0.8));
    layar.querySelectorAll(".lt-kata.aktif").forEach(x => x.classList.remove("aktif")); k.classList.add("aktif");
    const b = $("#lt-dengar"); if (b) b.textContent = `▶ Dengarkan dari kalimat ${w.kal + 1}`; });
  pasangTangga(id);
  if (ILUS_EN.ada(lv)) ILUS_EN.pasang(lv, layar);   // gambar bantu interaktif (ilustrasi-inggris.js)
}
function htmlTangga(id) {
  const x = ingLihat(id), nama = NAMA_SUB[jenisIng(lvIng(id))], a = aturIng();
  const syarat = [];
  if (a.dengar && bisaDengarEN()) syarat.push([!!x.d, `Dengarkan seluruh teks${x.d ? "" : x.dh.length ? ` (${x.dh.length}/${LB && LB.id === id ? LB.unit.length : "…"} kalimat)` : ""}`]);
  if (a.baca && bisaMikEN()) syarat.push([x.b >= bacaMin(), `Baca &amp; Koreksi sampai habis, akurasi ≥ ${bacaMin()}%${x.b ? ` (terbaik ${x.b}%)` : ""}`]);
  return `<h3>🧩 Latihan bertahap</h3>
    ${syarat.length && !subTerbuka(id, 0) ? `<div class="lt-syarat"><b>🔒 Sebelum sub level 1 terbuka:</b>${syarat.map(([ok, t]) => `<div class="${ok ? "ok" : ""}"><span>${ok ? "✓" : ""}</span>${t}</div>`).join("")}</div>` : ""}
    <div class="lt-tangga">${nama.map((nm, n) => { const v = x.s[n], lulus = v >= ING_LULUS_SUB, buka = subTerbuka(id, n);
      return `<button type="button" class="lt-sub ${lulus ? "lulus" : buka ? "buka" : "kunci"}" data-sub="${n}" ${buka ? "" : `title="Luluskan ${n ? "sub level " + n : "syarat di atas"} dulu"`}>
        <span class="lt-bulat">${lulus ? "✓" : buka ? n + 1 : "🔒"}</span><span class="lt-sub-nama">${IKON_SUB[n]} ${nm}</span><span class="lt-sub-nilai">${v ? `terbaik ${v}%` : buka ? "siap" : "terkunci"}</span></button>`; }).join("")}</div>
    <p class="ket" style="margin:10px 0 0">Setiap sub level 10 soal. Nilai ≥ ${ING_LULUS_SUB}% membuka sub level berikutnya.${a.syarat && dataMisi(id).lv === 0 ? " Setelah kelima sub level tuntas, <b>Level 1</b> terbuka." : ""}</p>`;
}
function pasangTangga(id) {
  const t = layar.querySelector("#lt-tangga"); if (!t) return;
  t.innerHTML = htmlTangga(id);
  t.querySelector(".lt-tangga").addEventListener("click", e => { const b = e.target.closest("[data-sub]"); if (!b) return; const n = +b.dataset.sub;
    if (!subTerbuka(id, n)) { bunyi.salah(); tampilPesan(n ? `🔒 Luluskan sub level ${n} dulu (≥ ${ING_LULUS_SUB}%).` : "🔒 Dengarkan dan baca teksnya dulu."); return; }
    bunyi.klik(); mulaiSub(id, n); });
}

/* ---------- Dengarkan ---------- */
function hentikanDengar() {
  if (!LB) return; LB.main = false; LB.token++;
  try { window.speechSynthesis.cancel(); } catch (e) { /* tanpa suara */ }
  layar.querySelectorAll(".lt-kal.dibaca").forEach(x => x.classList.remove("dibaca"));
  const b = layar.querySelector("#lt-dengar"); if (b) b.textContent = LB.mulai ? `▶ Dengarkan dari kalimat ${LB.mulai + 1}` : "▶ Dengarkan";
}
function mulaiDengar(dari) {
  if (!LB || LB.rek) return; hentikanDengar(); LB.main = true; const tok = ++LB.token;
  const b = layar.querySelector("#lt-dengar"); if (b) b.textContent = "⏹ Berhenti";
  const lanjut = i => {
    if (!LB || !LB.main || LB.token !== tok) return;
    layar.querySelectorAll(".lt-kal.dibaca").forEach(x => x.classList.remove("dibaca"));
    if (i >= LB.unit.length) { LB.mulai = 0; hentikanDengar(); return; }
    const el = layar.querySelector(`.lt-kal[data-k="${i}"]`); if (el) { el.classList.add("dibaca"); el.scrollIntoView({ block: "center", behavior: "smooth" }); }
    ucapEN(LB.unit[i].en, lajuEN(), ok => { if (!LB || LB.token !== tok) return; if (ok) tandaiDengar(i); lanjut(i + 1); });
  };
  lanjut(dari || 0);
}
function tandaiDengar(i) {
  if (!bolehSimpanIng()) return;
  const x = dataIng(LB.id); if (x.d) return;
  x.dh = [...new Set([...(x.dh || []), i])];
  if (x.dh.length >= LB.unit.length) { x.d = 1; delete x.dh; simpanData(); tampilPesan("🎧 Seluruh teks sudah kamu dengarkan!"); }
  else simpanData(false);
  pasangTangga(LB.id);
}

/* ---------- Baca & Koreksi ---------- */
function targetBaca() { const t = []; LB.kata.forEach((k, wi) => k.tk.forEach(x => t.push({ t: x, wi }))); return t; }
function nilaiBacaSekarang() {
  const r = LB.rek, ucap = [...r.tetap, ...r.sesi, ...r.sementara], target = targetBaca(), sk = nilaiToken(target, ucap);
  const perKata = LB.kata.map(() => undefined);
  target.forEach((x, i) => { const v = sk[i], a = perKata[x.wi]; perKata[x.wi] = v === null ? (a === undefined ? null : a) : a == null ? v : Math.min(a, v); });
  return perKata;
}
const kelasNilai = v => (v == null ? "" : v >= 85 ? "lt-b" : v >= 60 ? "lt-s" : "lt-k");
function warnaiBaca(perKata) {
  layar.querySelectorAll(".lt-kata").forEach((el, i) => { el.classList.remove("lt-b", "lt-s", "lt-k"); const c = kelasNilai(perKata[i]); if (c) el.classList.add(c); });
}
function mulaiBaca() {
  if (!LB || !SR_ING) return; hentikanDengar();
  const r = new SR_ING(); r.lang = "en-US"; r.continuous = true; r.interimResults = true; r.maxAlternatives = 1;
  LB.rek = { r, aktif: true, tetap: [], sesi: [], sementara: [] };
  const rek = LB.rek, potong = (teks, y) => tokenEN(teks).map(t => ({ t, y }));
  r.onresult = e => { if (LB?.rek !== rek) return; const tetap = [], sem = [];
    for (let i = 0; i < e.results.length; i++) { const a = e.results[i][0]; (e.results[i].isFinal ? tetap : sem).push(...potong(a.transcript, e.results[i].isFinal ? a.confidence : 0)); }
    rek.sesi = tetap; rek.sementara = sem; warnaiBaca(nilaiBacaSekarang()); };
  r.onerror = e => { if (e.error === "not-allowed" || e.error === "service-not-allowed" || e.error === "network") { rek.aktif = false; tampilPesan(pesanMik(e.error), 5000); } };
  r.onend = () => { if (LB?.rek !== rek) return; rek.tetap.push(...rek.sesi, ...rek.sementara); rek.sesi = []; rek.sementara = [];
    if (rek.aktif) { try { r.start(); return; } catch (e) { /* tidak bisa lanjut */ } } akhiriBaca(); };
  try { r.start(); } catch (e) { LB.rek = null; tampilPesan(pesanMik("start")); return; }
  layar.querySelectorAll(".lt-kata").forEach(el => el.classList.remove("lt-b", "lt-s", "lt-k", "aktif"));
  layar.querySelector("#lt-hasil").innerHTML = "";
  const b = layar.querySelector("#lt-baca"); b.textContent = "⏹ Selesai membaca"; b.classList.add("merekam");
  layar.querySelector("#lt-petunjuk").innerHTML = "🎙️ Mikrofon menyala. Baca teks di bawah dengan suara keras dan jelas, dari awal sampai akhir. Tekan <b>Selesai membaca</b> bila sudah.";
  layar.querySelector(".lt-kal")?.scrollIntoView({ block: "center", behavior: "smooth" });
}
function selesaiBaca() {
  const rek = LB?.rek; if (!rek) return; rek.aktif = false;
  try { rek.r.stop(); } catch (e) { /* sudah berhenti */ }
  setTimeout(() => { if (LB?.rek === rek) { rek.tetap.push(...rek.sesi, ...rek.sementara); rek.sesi = []; rek.sementara = []; akhiriBaca(); } }, 1800);   // bila onend tidak datang
}
function akhiriBaca() {
  if (!LB || !LB.rek) return;
  const perKata = nilaiBacaSekarang(); LB.rek = null; warnaiBaca(perKata);
  const b = layar.querySelector("#lt-baca"); if (b) { b.textContent = "🎤 Baca & Koreksi"; b.classList.remove("merekam"); }
  layar.querySelector("#lt-petunjuk").innerHTML = "Warna kata: <span class='lt-b'>hijau ≥ 85%</span> · <span class='lt-s'>kuning 60–84%</span> · <span class='lt-k'>merah &lt; 60%</span>. Ketuk kata untuk mendengar cara membacanya.";
  const nilai = perKata.filter(v => v !== undefined), dibaca = nilai.filter(v => v !== null), total = nilai.length, sisa = total - dibaca.length;
  const persen = dibaca.length ? Math.round(dibaca.reduce((a, v) => a + v, 0) / dibaca.length) : 0, lengkap = dibaca.length > 0 && sisa <= Math.max(2, Math.round(total * 0.05));
  const tepat = dibaca.filter(v => v >= 85).length, x = ingLihat(LB.id);
  let baru = false;
  if (lengkap && persen > x.b && bolehSimpanIng()) { dataIng(LB.id).b = persen; baru = true; simpanData(); }
  const pujian = persen >= 95 ? "Excellent! 🎉" : persen >= 85 ? "Great job! 👍" : persen >= 60 ? "Good, keep practicing!" : "Keep trying, you can do it!";
  const lemah = [...new Map(LB.kata.map((k, i) => [k.tk.join(" "), { k, v: perKata[i] }]).filter(([kk, o]) => kk && o.v != null && o.v < 85)).values()].sort((a, b) => a.v - b.v).slice(0, 8);
  layar.querySelector("#lt-hasil").innerHTML = !dibaca.length ? `<div class="umpan salah"><h3>Belum terdengar</h3><div>Aplikasi belum menangkap bacaanmu. Dekatkan HP, baca lebih keras, lalu coba lagi.</div></div>`
    : `<div class="lt-skor ${persen >= bacaMin() && lengkap ? "lulus" : ""}"><div class="lt-cincin">${persen}%</div><div><b>${lengkap ? pujian : "Bacaan belum sampai akhir"}</b>
        <div class="ket">${lengkap ? `${tepat} dari ${total} kata dibaca dengan tepat` : `${sisa} kata belum dibaca. Skor dicatat bila teks dibaca sampai habis.`}</div>
        ${lengkap ? `<div class="ket"><b>${baru ? "🏅 Skor terbaik baru! " : ""}${persen >= bacaMin() ? `Syarat ${bacaMin()}% terpenuhi.` : `Perlu ${bacaMin()}% untuk membuka sub level 1.`}</b></div>` : ""}</div></div>
      ${lemah.length ? `<div class="lt-lemah"><b>Latih kata yang belum tepat</b>${lemah.map(({ k, v }, i) => `<div class="lt-lemah-baris"><span class="${kelasNilai(v)}">${esc(k.teks.replace(/[.,!?;:"“”]/g, ""))} <small>· ${v}%</small></span>
        <button type="button" class="tbl tbl-putih tbl-kecil" data-dengar="${i}" aria-label="Dengarkan">🔊</button><button type="button" class="tbl tbl-biru tbl-kecil" data-ulang="${i}" aria-label="Ucapkan lagi">🎤</button><span class="lt-lemah-hasil" id="lt-lh-${i}"></span></div>`).join("")}</div>` : ""}`;
  layar.querySelector("#lt-hasil").onclick = e => { const d = e.target.closest("[data-dengar]"), u = e.target.closest("[data-ulang]"); if (!d && !u) return; const k = lemah[+(d || u).dataset[d ? "dengar" : "ulang"]].k, kata = k.teks.replace(/[^\w'’\- :]/g, "");
    if (d) return ucapEN(kata, Math.min(lajuEN(), 0.8));
    const out = layar.querySelector(`#lt-lh-${u.dataset.ulang}`); out.textContent = "🎙️ Ucapkan…";
    dengarSekali(6000, (alts, g) => { if (!alts) { out.textContent = pesanMik(g || "no-speech"); return; } const v = nilaiUcapanKata([kata], alts);
      out.innerHTML = v >= 70 ? `<span class="lt-b">✓ Bagus! (${v}%)</span>` : `<span class="lt-k">Coba lagi (${v}%) · terdengar: “${esc(alts[0].t)}”</span>`; }); };
  pasangTangga(LB.id);
  if (lengkap && persen >= bacaMin()) { bunyi.lulus(); } else if (dibaca.length) bunyi.klik();
  layar.querySelector("#lt-hasil").scrollIntoView({ block: "center", behavior: "smooth" });
}

/* ================= Soal sub level ================= */
const pakaiMik = () => aturIng().ucap && bisaMikEN() && !(LT && LT.tanpaMik);
const kataUntaian = s => String(s).split(/\s+/).filter(Boolean);
function soalSusun(teks, kalimat, o = {}) {
  const k = kataUntaian(kalimat); let acakan = kocok(k);
  for (let i = 0; i < 6 && acakan.join(" ") === k.join(" "); i++) acakan = kocok(k);
  return { bentuk: "susun", teks, ubin: acakan, kunci: k.join(" "), ucapKunci: kalimat, ...o };
}
const panjangPas = (s, a = 3, b = 10) => { const n = kataUntaian(s).length; return n >= a && n <= b; };
function kalimatPendek(daftar, a = 3, b = 10) { const ok = daftar.filter(x => panjangPas(x.en, a, b)); return ok.length ? pilih(ok) : pilih(daftar); }
const bahasTarget = (en, id) => `${miring(en)}${id ? ` — ${id}` : ""}`;
const SUB_ING = {
  kata: [
    lv => pilih(lv.ikon ? [KS.kataArti, KS.artiKata, KS.gambarKata, KS.gambarKata] : [KS.kataArti, KS.artiKata])(lv, 3),
    lv => pilih([KS.dengarKata, KS.dengarArti, KS.dengarKalimat])(lv, 4),
    lv => ((lv.situasi || []).length ? pilih([KS.situasi, KS.situasi, KS.artiKalimat]) : pilih([KS.artiKalimat, KS.rumpang]))(lv, 5),
    lv => { if (ya()) return KS.rumpang(lv, 5);
      const c = kalimatPendek(kataLevel(lv).map(w => ({ en: w.c, id: w.ca })));
      return soalSusun(`Susun kata-kata menjadi kalimat yang artinya:<br>“${esc(c.id)}”`, c.en, { bahas: bahasTarget(c.en, c.id) }); },
    lv => { const w = pilih(kataLevel(lv)), sit = (lv.situasi || []).filter(s => s.j === w.k), s = sit.length && ya() ? pilih(sit) : null;
      const teks = s ? `${s.s}<br><b>Apa yang kamu ucapkan dalam bahasa Inggris?</b>` : `Bahasa Inggrisnya <b>${w.a}</b> adalah …`;
      const target = s ? [s.j, ...(s.juga || [])] : [w.k];
      if (pakaiMik()) return { bentuk: "ucap", teks, target, satuKata: true, ucapKunci: w.k, kunciTeks: w.k, bahas: bahasKata(w) };
      return { bentuk: "ketik", teks: teks + '<br><span class="ket">Ketik jawabanmu dalam bahasa Inggris.</span>', target, ucapKunci: w.k, kunciTeks: w.k, bahas: bahasKata(w) }; },
  ],
  pola: [
    (lv) => PS.lengkapi(lv.id, 3),
    (lv) => { const x = kalimatPola(lv.id), benar = ya(), kal = benar ? x.utuh : pilih(x.keliru);
      return { bentuk: "pg", teks: `Apakah kalimat ini <b>benar</b> untuk arti “${esc(x.id)}”?<br><span lang="en">${miring(kal)}</span>`, opsi: ["Benar", "Salah"], kunci: benar ? 0 : 1,
        bahas: benar ? bahasPola(x) : `Kalimat itu keliru. Yang benar: ${bahasPola(x)}` }; },
    (lv) => { if (!bisaDengarEN()) return PS.arti(lv.id, 4); if (ya()) return PS.dengar(lv.id, 4);
      const x = kalimatPola(lv.id); return soalSusun("Dengarkan, lalu susun kata-kata sesuai yang kamu dengar.", x.utuh, { suara: x.utuh, bahas: bahasPola(x) }); },
    (lv) => { const x = kalimatPola(lv.id); return soalSusun(`Susun kata-kata menjadi kalimat yang artinya:<br>“${esc(x.id)}”`, x.utuh, { bahas: bahasPola(x) }); },
    (lv) => { const x = kalimatPola(lv.id);
      if (!pakaiMik()) return soalSusun(`Susun kata-kata menjadi kalimat yang artinya:<br>“${esc(x.id)}”`, x.utuh, { bahas: bahasPola(x) });
      return { bentuk: "ucap", teks: `Ucapkan dalam bahasa Inggris:<br>“${esc(x.id)}”<div class="lt-petunjuk-kata">Petunjuk kata: ${kocok(kataUntaian(x.utuh)).map(k => `<span>${esc(k)}</span>`).join("")}</div>`,
        target: x.utuh, satuKata: false, ucapKunci: x.utuh, kunciTeks: x.utuh, bahas: bahasPola(x) }; },
  ],
  bacaan: [
    (lv) => BS_.kata(lv, 3),
    (lv) => { if (!bisaDengarEN()) return BS_.kalimat(lv, 4); const u = kalimatIng(lv), i = acak(0, u.length - 1);
      return pgL("Dengarkan kalimat dari bacaan. Apa artinya?", u[i].id, u.filter((_, j) => j !== i).map(x => x.id), 4, { suara: u[i].en, bahas: bahasTarget(u[i].en, u[i].id) }); },
    (lv) => { const u = kalimatIng(lv), i = acak(0, u.length - 2);
      return pgL(`Dalam bacaan <b>${esc(lv.judul)}</b>, kalimat apa yang muncul tepat <b>sesudah</b> kalimat ini?<br><span lang="en">${miring(u[i].en)}</span>`, u[i + 1].en, u.filter((_, j) => j !== i && j !== i + 1).map(x => x.en), 4,
        { bahas: `Urutannya: ${miring(u[i].en)} → ${miring(u[i + 1].en)}` }); },
    (lv) => { const bt = EN.BS[lv.id] || [];
      if (bt.length && ya(0.4)) { const x = pilih(bt);
        return { bentuk: "pg", teks: `Berdasarkan bacaan, pernyataan ini <b>benar</b> atau <b>salah</b>?<br>${x[0]}`, opsi: ["Benar", "Salah"], kunci: x[1] ? 0 : 1, bahas: x[2], ...dasarBacaan(lv, 4) }; }
      return BS_.soal(lv, 4); },
    (lv) => { const c = kalimatPendek(kalimatIng(lv), 3, 14);
      if (!pakaiMik()) return soalSusun(`Susun kata-kata menjadi kalimat dari bacaan yang artinya:<br>“${esc(c.id)}”`, c.en, { bahas: bahasTarget(c.en, c.id) });
      return { bentuk: "ucap", teks: `Bacalah kalimat ini dengan suara keras:<div class="lt-ucap-kalimat" lang="en">${esc(c.en)}</div><span class="ket">(${esc(c.id)})</span>`,
        target: c.en, satuKata: false, ucapKunci: c.en, kunciTeks: c.en, bahas: bahasTarget(c.en, c.id) }; },
  ],
};

let LT = null;      // sub level yang sedang dikerjakan
async function mulaiSub(id, n) {
  if (!subTerbuka(id, n)) return;
  if (S.peran !== "ortu" && !(await bolehLatihan(() => mulaiSub(id, n)))) return;
  hentikanSuaraLatih();
  LT = { id, n, lv: lvIng(id), i: 0, benar: 0, sisaUlang: 0, mode: "hitung", sudah: new Set(), tanda: [], tanpaMik: false, coba: S.peran === "ortu" };
  soalLatih();
}
function buatSoalSub() {
  const f = SUB_ING[jenisIng(LT.lv)][LT.n]; let s, k;
  for (let i = 0; i < 15; i++) { s = f(LT.lv); k = (s.teks || "") + "|" + (s.opsi || s.ubin || []).slice().sort().join("|") + "|" + (s.kunciTeks || s.kunci); if (!LT.sudah.has(k)) break; }
  LT.sudah.add(k); return s;
}
function soalLatih() {
  if (LT.i < ING_SOAL_SUB) LT.mode = "hitung";
  else if (LT.sisaUlang > 0) { LT.mode = "ulang"; LT.sisaUlang--; }
  else return hasilSub();
  LT.soal = buatSoalSub(); LT.diperiksa = false; LT.pilih = []; tampilSoalLatih();
}
function tampilSoalLatih() {
  kepala.hidden = true; pasangNav(null); layarKini = "latihsoal";
  const s = LT.soal, m = cariMisi(LT.id), nama = NAMA_SUB[jenisIng(LT.lv)][LT.n], persen = Math.round(Math.min(LT.i, ING_SOAL_SUB) * 100 / ING_SOAL_SUB);
  layar.innerHTML = `<div class="main-atas"><button class="tutup" id="lt-keluar" aria-label="Keluar">✕</button><div class="info"><b>${m.ikon} ${m.judul}</b><span class="lencana k2">Sub level ${LT.n + 1} · ${IKON_SUB[LT.n]} ${nama}</span></div>${LT.coba ? '<span class="chip" style="background:var(--ungu-muda);color:var(--ungu)">🧪 Uji coba</span>' : ""}</div>
    <div class="lt-jalur" aria-hidden="true"><i style="width:${persen}%"></i></div>
    <div class="lt-hitung">${LT.mode === "hitung" ? `Soal ${LT.i + 1} dari ${ING_SOAL_SUB}` : "🔁 Ulangi dengan soal lain (tidak menambah nilai)"}<span>benar langsung: ${LT.benar}</span></div>
    <div class="kartu kartu-soal">${s.bacaan ? `<div class="bacaan">${s.bacaan}</div>` : ""}${tombolSuara(s)}<div class="teks-soal">${s.teks}</div>
      <div id="lt-jawab">${areaLatih(s)}</div><div id="lt-umpan"></div><div class="aksi-soal" id="lt-aksi">${s.bentuk === "pg" ? "" : `<button class="tbl tbl-hijau tbl-periksa" id="lt-periksa">Periksa ✔</button>`}</div></div>`;
  layar.querySelector("#lt-keluar").addEventListener("click", () => dialog(`<div style="font-size:54px">🦉</div><h2>Mau berhenti?</h2><p class="ket">Nilai sub level ini belum disimpan.</p>`,
    [["Lanjut berlatih", "tbl-hijau", null], ["Keluar", "tbl-putih", () => { const id = LT.id; LT = null; tampil("latih", id); }]]));
  pasangJawabLatih(s);
  if (s.suara) setTimeout(() => { if (LT && LT.soal === s) ucapEN(s.suara, Math.min(lajuEN(), 0.85)); }, 350);
}
function areaLatih(s) {
  if (s.bentuk === "pg") return `<div class="opsi-daftar">${s.opsi.map((o, i) => `<button type="button" class="opsi" data-i="${i}"><span class="huruf">${"ABCDE"[i]}</span><span>${o}</span></button>`).join("")}</div>`;
  if (s.bentuk === "susun") return `<div class="lt-susun-jawab" id="lt-sj" aria-label="Kalimatmu"></div><div class="lt-susun-bank" id="lt-sb">${s.ubin.map((k, i) => `<button type="button" class="lt-ubin" data-u="${i}" lang="en">${esc(k)}</button>`).join("")}</div>`;
  if (s.bentuk === "ketik") return `<input class="isian-teks" id="lt-ketik" lang="en" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Tulis dalam bahasa Inggris" aria-label="Jawaban">`;
  return `<div class="lt-ucap"><button type="button" class="lt-mik" id="lt-mik" aria-label="Tekan lalu ucapkan">🎤</button><div class="ket" id="lt-mik-ket">Tekan tombol, lalu ucapkan dengan jelas.</div><div id="lt-terdengar"></div>
    <button type="button" class="tbl tbl-putih tbl-kecil" id="lt-tanpa-mik">Tidak bisa bicara sekarang? ${LT.lv.kosakata ? "Ketik saja" : "Susun kata saja"}</button></div>`;
}
function pasangJawabLatih(s) {
  const area = layar.querySelector("#lt-jawab"), periksa = layar.querySelector("#lt-periksa");
  if (s.bentuk === "pg") area.addEventListener("click", e => { const b = e.target.closest(".opsi"); if (!b || LT.diperiksa) return; const i = +b.dataset.i, ok = i === s.kunci;
    area.querySelectorAll(".opsi").forEach((x, j) => { if (j === s.kunci) x.classList.add("lt-kunci"); else if (j === i) x.classList.add("lt-keliru"); });
    nilaiLatih(ok, s.opsi[s.kunci]); });
  if (s.bentuk === "susun") {
    const sj = area.querySelector("#lt-sj"), sb = area.querySelector("#lt-sb");
    area.addEventListener("click", e => { const u = e.target.closest(".lt-ubin"); if (!u || LT.diperiksa) return; bunyi.klik();
      (u.parentElement === sb ? sj : sb).appendChild(u); });
    periksa.addEventListener("click", () => { if (LT.diperiksa) return lanjutLatih();
      if (sb.children.length) { tampilPesan("Pakai semua kata dulu, ya!"); return; }
      const jawab = [...sj.children].map(x => x.textContent).join(" "); nilaiLatih(jawab === s.kunci, s.kunci); });
  }
  if (s.bentuk === "ketik") { const inp = area.querySelector("#lt-ketik"); inp.focus();
    inp.addEventListener("keydown", e => { if (e.key === "Enter") periksa.click(); });
    periksa.addEventListener("click", () => { if (LT.diperiksa) return lanjutLatih(); const v = inp.value.trim(); if (!v) { tampilPesan("Tulis jawabanmu dulu, ya!"); return; }
      const u = tokenEN(v).join(" "), ok = s.target.some(t => { const tt = tokenEN(t).join(" "); return u === tt || (tt.length >= 5 && miripTeks(u, tt) >= 0.85); });
      inp.disabled = true; nilaiLatih(ok, s.kunciTeks); });
  }
  if (s.bentuk === "ucap") {
    const mik = area.querySelector("#lt-mik"), ket = area.querySelector("#lt-mik-ket"), out = area.querySelector("#lt-terdengar");
    periksa.hidden = true;
    area.querySelector("#lt-tanpa-mik").addEventListener("click", () => { LT.tanpaMik = true; bunyi.klik(); LT.soal = buatSoalSub(); tampilSoalLatih(); });
    mik.addEventListener("click", () => { if (LT.diperiksa || LT.dengar) return; mik.classList.add("merekam"); ket.textContent = "🎙️ Mendengarkan…";
      LT.dengar = dengarSekali(s.satuKata ? 6000 : 12000, (alts, g) => { LT.dengar = null; mik.classList.remove("merekam");
        if (!LT || LT.soal !== s || LT.diperiksa) return;
        if (!alts || !alts.length) { ket.textContent = pesanMik(g || "no-speech"); if (g === "not-allowed" || g === "service-not-allowed") { LT.tanpaMik = true; ket.textContent += " Soal ini diganti."; setTimeout(() => { if (LT && LT.soal === s) { LT.soal = buatSoalSub(); tampilSoalLatih(); } }, 1600); } return; }
        if (s.satuKata) { const v = nilaiUcapanKata(s.target, alts); out.innerHTML = `<div class="ket">Terdengar: “${esc(alts[0].t)}” · ${v}%</div>`; nilaiLatih(v >= 70, s.kunciTeks); }
        else { const h = nilaiUcapanKalimat(s.target, alts); out.innerHTML = `<div class="ket">Terdengar: “${esc(h.ucap || alts[0].t)}” · ${h.persen}% kata cocok</div>`; nilaiLatih(h.ok, s.kunciTeks); } }); });
  }
}
function nilaiLatih(ok, kunciTeks) {
  if (LT.diperiksa) return; LT.diperiksa = true; const s = LT.soal;
  if (LT.mode === "hitung") { if (ok) LT.benar++; else LT.sisaUlang++; LT.tanda.push(ok); }
  const u = layar.querySelector("#lt-umpan");
  if (ok) { bunyi.benar(); u.innerHTML = `<div class="umpan benar"><h3>✅ ${acakDari(PUJIAN)}</h3>${s.bahas ? `<div class="bahas">${s.bahas}</div>` : ""}</div>`; }
  else { bunyi.salah(); u.innerHTML = `<div class="umpan salah"><h3>❌ Belum tepat</h3><div>Jawaban yang tepat:</div><div class="kunci-jawab">${kunciTeks}</div>${s.bahas ? `<div class="bahas">${s.bahas}</div>` : ""}
      ${LT.mode === "hitung" ? '<div class="ket" style="margin-top:8px">🔁 Nanti kamu mendapat soal serupa lagi untuk berlatih.</div>' : ""}</div>`;
    if (s.ucapKunci) setTimeout(() => ucapEN(s.ucapKunci, Math.min(lajuEN(), 0.85)), 500); }
  if (s.ucapKunci && s.bentuk !== "pg") u.firstElementChild.insertAdjacentHTML("beforeend", `<button type="button" class="tbl-suara" data-suara="${encodeURIComponent(s.ucapKunci)}">🔊 Dengarkan</button>`);
  const aksi = layar.querySelector("#lt-aksi");
  aksi.innerHTML = `<button class="tbl tbl-biru tbl-periksa" id="lt-lanjut">${LT.mode === "hitung" && LT.i + 1 >= ING_SOAL_SUB && !LT.sisaUlang ? "Lihat hasil 🏁" : "Lanjut ➜"}</button>`;
  aksi.querySelector("#lt-lanjut").addEventListener("click", lanjutLatih);
  setTimeout(() => u.scrollIntoView({ block: "nearest", behavior: "smooth" }), 60);
}
function lanjutLatih() { if (!LT) return; if (LT.mode === "hitung") LT.i++; soalLatih(); }
function hasilSub() {
  const { id, n, benar, coba } = LT, persen = Math.round(benar * 100 / ING_SOAL_SUB), lulus = persen >= ING_LULUS_SUB, nama = NAMA_SUB[jenisIng(LT.lv)];
  const lama = ingLihat(id).s[n], pertama = lulus && lama < ING_LULUS_SUB, terbaik = persen > lama; let koin = 0;
  if (!coba) { const x = dataIng(id); if (terbaik) x.s[n] = persen; koin = benar * 5 + (pertama ? 30 : 0); S.koin += koin; catatApi(); simpanData(); }
  const tuntas = !coba && latihTuntas(id), m = cariMisi(id);
  LT = null; layarKini = "hasil"; kepala.hidden = true; pasangNav(null);
  layar.innerHTML = `<div class="kartu hasil"><div class="lt-label-hasil">${m.ikon} ${m.judul} · Sub level ${n + 1} · ${nama[n]}</div>
    <div class="lt-cincin besar ${lulus ? "lulus" : ""}">${persen}%</div>
    <h1>${lulus ? (tuntas && pertama ? "Dengar & Baca tuntas! 🎉" : "Lulus!") : "Hampir!"}</h1>
    <p class="ket">${benar} dari ${ING_SOAL_SUB} benar pada percobaan pertama${terbaik && !coba ? " · 🏅 skor terbaik" : ""}</p>
    ${lulus ? (n < 4 ? `<p class="ket">🔓 Sub level ${n + 2} · ${nama[n + 1]} sudah terbuka.</p>` : tuntas && dataMisi(id).lv === 0 ? "<p class=\"ket\">🔓 <b>Level 1</b> di jalur misi ini sudah terbuka!</p>" : "")
      : `<p class="ket">Perlu ${ING_LULUS_SUB}% untuk lulus. Soalnya akan berbeda saat diulang.</p>`}
    ${coba ? '<p class="ket">🧪 HP orang tua: hasil tidak disimpan.</p>' : `<div class="ringkas"><div><b>+${koin}</b>koin 💰</div><div><b>${subTuntas(id)}/5</b>sub level tuntas</div></div>`}
    <div class="tombol-tumpuk">${lulus && n < 4 ? `<button class="tbl tbl-utama" id="h-lanjut">Lanjut: ${IKON_SUB[n + 1]} ${nama[n + 1]} ▶</button>` : ""}
      ${lulus && n === 4 && !coba ? `<button class="tbl tbl-utama" id="h-level">Mulai Level 1 ▶</button>` : ""}
      <button class="tbl ${lulus ? "tbl-putih" : "tbl-utama"}" id="h-ulang">↻ Ulangi sub level ini</button>
      <button class="tbl tbl-putih" data-ke="latih" data-arg="${id}">Kembali ke Dengar &amp; Baca</button></div></div>`;
  layar.querySelector("#h-lanjut")?.addEventListener("click", () => { bunyi.klik(); mulaiSub(id, n + 1); });
  layar.querySelector("#h-level")?.addEventListener("click", () => { bunyi.klik(); tampil("jalur", id); });
  layar.querySelector("#h-ulang").addEventListener("click", () => { bunyi.klik(); mulaiSub(id, n); });
  if (lulus) { bunyi.lulus(); if (pertama) konfeti(tuntas ? 2.4 : 1.4); } else bunyi.gagal();
}

/* Kartu di jalur misi (app.js lJalur) */
function kartuLatihJalur(id) {
  const n = subTuntas(id), kunci = level1Terkunci(id);
  return `<button class="kartu lt-kartu-jalur ${n === 5 ? "tuntas" : ""}" data-ke="latih" data-arg="${id}"><span class="lt-ikon" aria-hidden="true">🎧</span>
    <span class="lt-kj-isi"><b>Dengar &amp; Baca</b><span class="ket">${n === 5 ? "Tuntas ✓ · 5/5 sub level" : `${n}/5 sub level tuntas`}${kunci ? " · selesaikan dulu untuk membuka Level 1" : ""}</span><span class="batang"><i style="width:${n * 20}%"></i></span></span>
    <span class="lt-panah" aria-hidden="true">▶️</span></button>`;
}
