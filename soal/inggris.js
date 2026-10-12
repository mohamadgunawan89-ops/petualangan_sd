/* Soal Bahasa Inggris — Petualangan TKA SD (11 Okt 2026)
   ---------------------------------------------------------------
   Materi disalin dari English Reading (tahapan umum Tahap 0 "Fondasi" & Tahap 1 "Kalimat Sederhana"):
   soal/inggris-data.js (INGGRIS) dan soal/inggris-pola.js (window.POLA_GEN).
   Pulau Bahasa Inggris = materi tambahan, BUKAN materi TKA SD: tidak ikut syarat Piala Raksasa (tka: false).

   Bentuk soal mengikuti Bahasa Indonesia: level 1–5 pilihan ganda (3 opsi di level 1–2, 4 opsi di 3–5);
   level 6–10 bentuk TKA: pilihan ganda, benar–salah, pilihan ganda kompleks, dan "kecuali".
   Soal dengar membawa s.suara (teks Inggris yang dibacakan suara peramban, tombol 🔊 di app.js);
   bila perangkat tidak punya suara bahasa Inggris, soal dengar diganti soal tulis. */
"use strict";

PULAU.push({ id: "big", judul: "Bahasa Inggris", ikon: "🌍", tka: false,
  ket: "Kosakata, kalimat, dan bacaan bahasa Inggris dasar. Ada soal <b>dengar</b> 🔊 — nyalakan suara HP. Materi tambahan (bukan materi TKA)." });
POS.push(
  { id: "e-aku", pulau: "big", no: 1, judul: "Aku & Keluargaku", ikon: "👋", ket: "Sapaan, keluarga, tubuh, perasaan" },
  { id: "e-angka", pulau: "big", no: 2, judul: "Angka & Waktu", ikon: "🔢", ket: "Angka, hari, bulan, jam" },
  { id: "e-rumah", pulau: "big", no: 3, judul: "Rumah & Sekolah", ikon: "🏫", ket: "Benda, ruangan, tempat, kendaraan" },
  { id: "e-giat", pulau: "big", no: 4, judul: "Kegiatan & Dunia Sekitar", ikon: "⚽", ket: "Kata kerja, hobi, makanan, hewan" },
  { id: "e-tata", pulau: "big", no: 5, judul: "Kata Penting", ikon: "🧩", ket: "Kata sifat, kata tanya, penghubung, modal" },
  { id: "e-baca", pulau: "big", no: 6, judul: "Kalimat & Bacaan", ikon: "📘", ket: "Pola kalimat dan bacaan pendek" },
  { id: "e-teks", pulau: "big", no: 7, judul: "Teks Pendek", ikon: "📨", ket: "Masa lalu, can/must, masa depan; cerita, resep, pengumuman, undangan, pesan" },
);

const EN = INGGRIS;
const enLevel = id => EN.LEVEL.find(x => x.id === id);
const besar1 = s => s.charAt(0).toUpperCase() + s.slice(1);
const rapi = (...x) => x.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
const miring = s => `<i>${s}</i>`;
const tanpaTitik = s => String(s).replace(/[.!?]+$/, "");

/* ---------- Suara (speechSynthesis) ---------- */
function adaSuaraInggris() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return false;
  const v = window.speechSynthesis.getVoices();
  return !v.length || v.some(x => /^en/i.test(x.lang));     // daftar suara belum dimuat = anggap ada
}
if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.getVoices();

/* ---------- Kosakata ---------- */
const POS_KOSAKATA = {
  "e-aku": ["greetings", "pronouns", "family-words", "body-parts", "feelings", "clothes", "colors"],
  "e-angka": ["numbers", "numbers-100", "big-numbers", "ordinal-numbers", "ordinal-numbers-2", "time-days", "days-week", "months", "telling-time"],
  "e-rumah": ["classroom", "rooms", "classroom-expressions", "prepositions", "places", "transport"],
  "e-giat": ["verbs-1", "verbs-2", "daily-activities", "hobbies", "food-drinks", "money-shopping", "weather", "animals", "jobs"],
  "e-tata": ["adjectives", "question-words", "conjunctions", "modals"],
};
const IKON_EN = { greetings: "👋", pronouns: "🙋", "family-words": "👨‍👩‍👧", "body-parts": "🦶", feelings: "😊", clothes: "👕", colors: "🎨",
  numbers: "1️⃣", "numbers-100": "💯", "big-numbers": "🔢", "ordinal-numbers": "🥇", "ordinal-numbers-2": "🏅", "time-days": "📅", "days-week": "🗓️",
  months: "🌙", "telling-time": "⏰", classroom: "✏️", rooms: "🏠", "classroom-expressions": "🙋‍♀️", prepositions: "📦", places: "🧭", transport: "🚌",
  "verbs-1": "🏃", "verbs-2": "🛠️", "daily-activities": "🪥", hobbies: "⚽", "food-drinks": "🍚", "money-shopping": "🛒", weather: "🌦️", animals: "🐘", jobs: "👩‍⚕️",
  adjectives: "📏", "question-words": "❓", conjunctions: "🔗", modals: "🧰",
  "pola-i-am": "🙂", "pola-there-is": "📍", "pola-present": "🔁", "pola-want": "💭", "pola-questions": "💬",
  "hello-budi": "👦", "my-family": "👪", "my-school": "🏫", "my-day": "🌞",
  "pola-past": "⏪", "pola-can-must": "✅", "pola-future": "⏩", "best-friend": "👭", "a-rainy-morning": "🌧️", "holiday-pangandaran": "🏖️",
  "make-tea": "🍵", announcement: "📢", "birthday-invitation": "🎂", "message-from-mom": "💌" };

/* kata = { k: kata Inggris, a: arti, c: contoh, ca: arti contoh, lv } */
const kataLevel = lv => lv.kosakata.map(w => ({ k: w[0], a: w[1], c: w[2], ca: w[3], lv: lv.id }));
const posDari = id => Object.keys(POS_KOSAKATA).find(p => POS_KOSAKATA[p].includes(id));
/* Pengecoh: dari level yang sama dulu; level 8+ juga dari level lain di pos yang sama (lebih sulit) */
function pengecohKata(lv, w, medan, L, n = 4) {
  const sama = kataLevel(lv).filter(x => x[medan] !== w[medan]).map(x => x[medan]);
  const lain = L >= 8 ? POS_KOSAKATA[posDari(lv.id)].filter(id => id !== lv.id).flatMap(id => kataLevel(enLevel(id))).map(x => x[medan]) : [];
  const mirip = (lv.mirip || []).filter(x => x !== w[medan]);
  return [...new Set([...kocok(mirip), ...kocok(sama), ...kocok(lain)])].filter(x => x !== w[medan]).slice(0, n + 2);
}
const bahasKata = w => `<b>${w.k}</b> artinya <b>${w.a}</b>. Contoh: ${miring(w.c)} (${tanpaTitik(w.ca)}).`;
/* Kalimat contoh (contoh utama + contohLain) yang memuat kata itu */
function kalimatKata(lv, w, L) {
  const semua = [[w.c, w.ca], ...(((lv.contohLain || {})[w.k]) || [])];
  const pakai = L >= 7 && semua.length > 1 ? semua.slice(1) : semua;
  return pilih(pakai);
}
const rxKata = k => new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");

const KS = {
  kataArti: (lv, L) => { const w = pilih(kataLevel(lv)); return pgL(`Apa arti kata <b>${w.k}</b>?`, w.a, pengecohKata(lv, w, "a", L), L, { bahas: bahasKata(w) }); },
  artiKata: (lv, L) => { const w = pilih(kataLevel(lv)); return pgL(`Bahasa Inggris dari <b>${w.a}</b> adalah …`, w.k, pengecohKata(lv, w, "k", L), L, { bahas: bahasKata(w) }); },
  dengarKata: (lv, L) => { if (!adaSuaraInggris()) return KS.artiKata(lv, L); const w = pilih(kataLevel(lv));
    return pgL("Dengarkan, lalu pilih kata yang diucapkan.", w.k, pengecohKata(lv, w, "k", L), L, { suara: w.k, bahas: `Yang diucapkan: <b>${w.k}</b> (${w.a}).` }); },
  dengarArti: (lv, L) => { if (!adaSuaraInggris()) return KS.kataArti(lv, L); const w = pilih(kataLevel(lv));
    return pgL("Dengarkan. Apa artinya?", w.a, pengecohKata(lv, w, "a", L), L, { suara: w.k, bahas: `Yang diucapkan: <b>${w.k}</b>, artinya <b>${w.a}</b>.` }); },
  /* Soal bergambar (12 Okt 2026): level dengan peta ikon dari English Reading (perasaan, pakaian, cuaca, kendaraan, hobi, hewan, profesi, ungkapan kelas) */
  gambarKata: (lv, L) => { const ik = lv.ikon || {}, n = {}; Object.values(ik).forEach(e => (n[e] = (n[e] || 0) + 1));
    const W = kataLevel(lv).filter(w => ik[w.k] && n[ik[w.k]] === 1);   // hanya ikon yang unik (ungkapan kelas memakai ikon guru/siswa yang sama)
    if (W.length < 3) return KS.kataArti(lv, L); const w = pilih(W);
    return pgL("Gambar ini dalam bahasa Inggris adalah …", w.k, pengecohKata(lv, w, "k", L), L, { gambar: `<div class="em-besar" role="img" aria-label="gambar">${lv.ikon[w.k]}</div>`, bahas: bahasKata(w) }); },
  rumpang: (lv, L) => { for (let i = 0; i < 12; i++) { const w = pilih(kataLevel(lv)), [en, id] = kalimatKata(lv, w, L), rx = rxKata(w.k);
      if (!rx.test(en)) continue;
      return pgL(`Lengkapi kalimat:<br>${miring(en.replace(rx, "______"))}${L <= 5 ? `<br><span class="ket">(${id})</span>` : ""}`, w.k, pengecohKata(lv, w, "k", L), L,
        { bahas: `${miring(en)} — ${id}` }); }
    return KS.artiKata(lv, L); },
  artiKalimat: (lv, L) => { const w = pilih(kataLevel(lv)), [en, id] = kalimatKata(lv, w, L);
    const lain = kataLevel(lv).filter(x => x.k !== w.k).map(x => kalimatKata(lv, x, L)[1]);
    return pgL(`Apa arti kalimat ${miring("“" + en + "”")}?`, id, lain, L, { bahas: `${miring(en)} artinya “${id}”. Kata <b>${w.k}</b> = ${w.a}.` }); },
  dengarKalimat: (lv, L) => { if (!adaSuaraInggris()) return KS.artiKalimat(lv, L); const w = pilih(kataLevel(lv)), [en, id] = kalimatKata(lv, w, L);
    const lain = kataLevel(lv).filter(x => x.k !== w.k).map(x => kalimatKata(lv, x, L)[1]);
    return pgL("Dengarkan kalimatnya. Apa artinya?", id, lain, L, { suara: en, bahas: `Yang diucapkan: ${miring(en)} — “${id}”.` }); },
  situasi: (lv, L) => { if (!(lv.situasi || []).length) return KS.rumpang(lv, L); const s = pilih(lv.situasi), w = kataLevel(lv).find(x => x.k === s.j) || { k: s.j, a: "" };
    const tolak = new Set([s.j, ...(s.juga || [])]);
    return pgL(`${s.s}<br><b>Apa yang tepat kamu ucapkan?</b>`, s.j, pengecohKata(lv, w, "k", L).filter(x => !tolak.has(x)), L,
      { bahas: `Yang paling tepat: <b>${s.j}</b>${w.a ? ` (${w.a})` : ""}.` }); },
};
/* Bentuk TKA (level 6–10) */
function pasanganKata(lv, L, n) {
  const W = ambil(kataLevel(lv), n), nilai = campurBS(W.length);
  return W.map((w, i) => { const salah = pilih(pengecohKata(lv, w, "a", L)); return { t: `<b>${w.k}</b> artinya ${nilai[i] ? w.a : salah}`, b: nilai[i], w, salah }; });
}
const bahasPasangan = bt => bt.map(x => `${x.b ? "✔" : "✘"} <b>${x.w.k}</b> = ${x.w.a}`).join("<br>");
function soalKosakataTKA(lv, L) {
  const b = bentukSoalL(L);
  if (b === "bs") { const bt = pasanganKata(lv, L, L <= 7 ? 3 : 4); return bs("Tentukan <b>Benar</b> atau <b>Salah</b> arti setiap kata.", bt, { bahas: bahasPasangan(bt) }); }
  if (b === "pgk") { const bt = pasanganKata(lv, L, L >= 9 ? 5 : 4); return pgk("Pilih <b>semua</b> pasangan kata dan arti yang benar.", bt, { bahas: bahasPasangan(bt) }); }
  if (b === "kecuali") { const W = ambil(kataLevel(lv), 4), x = W[0], sl = pilih(pengecohKata(lv, x, "a", L));
    return pg("Pasangan kata dan arti berikut benar, <b>kecuali</b> …", `${x.k} = ${sl}`, W.slice(1).map(w => `${w.k} = ${w.a}`), { bahas: `<b>${x.k}</b> artinya ${x.a}, bukan ${sl}.` }); }
  const kumpulan = L === 6 ? [KS.situasi, KS.rumpang, KS.dengarKalimat] : L <= 8 ? [KS.situasi, KS.rumpang, KS.artiKalimat, KS.dengarKalimat]
    : [KS.situasi, KS.rumpang, KS.artiKalimat, KS.dengarKalimat, KS.dengarArti];
  return pilih(kumpulan)(lv, L);
}
const LEVEL_KOSAKATA = { 1: [KS.kataArti], 2: [KS.kataArti, KS.artiKata], 3: [KS.artiKata, KS.kataArti, KS.dengarKata],
  4: [KS.dengarKata, KS.dengarArti, KS.rumpang], 5: [KS.rumpang, KS.artiKalimat, KS.situasi] };
function tingkatKosakata(id) {
  const lv = enLevel(id), t = {};
  for (let L = 1; L <= 10; L++) t[L] = L <= 5 ? [...LEVEL_KOSAKATA[L], ...(lv.ikon && L <= 3 ? [KS.gambarKata] : [])].map(f => () => f(lv, L)) : [() => soalKosakataTKA(lv, L)];
  return t;
}
Object.entries(POS_KOSAKATA).forEach(([pos, ids]) => ids.forEach(id => { const lv = enLevel(id);
  daftarMisi(pos, "en-" + id, `${lv.judul} · ${lv.kelompok}`, IKON_EN[id] || "🔤", tingkatKosakata(id)); }));

/* ---------- Pola kalimat (Tahap 1) ---------- */
const POLA_EN = ["pola-i-am", "pola-there-is", "pola-present", "pola-want", "pola-questions"];
function kalimatPola(gid) {
  const x = window.POLA_GEN[gid]();
  // There is/are hanya punya dua pilihan: tambah "am" supaya paling sedikit tiga pilihan
  const salah = x.salah.length >= 2 ? x.salah : [...x.salah, /^[A-Z]/.test(x.kunci) ? "Am" : "am"].filter(s => s !== x.kunci);
  return { ...x, salah, utuh: besar1(rapi(x.pre, x.kunci, x.post)), keliru: salah.map(s => besar1(rapi(x.pre, s, x.post))) };
}
function lainPola(gid, x, n, medan) { const set = new Set(); for (let i = 0; i < 30 && set.size < n; i++) { const y = kalimatPola(gid); if (y[medan] !== x[medan]) set.add(y[medan]); } return [...set]; }
const bahasPola = x => `${miring(x.utuh)} — ${x.id}<br>${x.alasan}`;
const PS = {
  lengkapi: (g, L) => { const x = kalimatPola(g); return pgL(`Lengkapi kalimat:<br>${miring(rapi(x.pre, "______", x.post))}${L <= 4 ? `<br><span class="ket">(${x.id})</span>` : ""}`, x.kunci, x.salah, L, { bahas: bahasPola(x) }); },
  arti: (g, L) => { const x = kalimatPola(g); return pgL(`Apa arti kalimat ${miring("“" + x.utuh + "”")}?`, x.id, lainPola(g, x, 4, "id"), L, { bahas: bahasPola(x) }); },
  benar: (g, L) => { const x = kalimatPola(g); return pgL(`Kalimat mana yang <b>benar</b> untuk arti “${x.id}”?`, x.utuh, [...x.keliru, ...lainPola(g, x, 3, "keliru").flat()].filter(k => k !== x.utuh), L, { bahas: bahasPola(x) }); },
  dengar: (g, L) => { if (!adaSuaraInggris()) return PS.arti(g, L); const x = kalimatPola(g);
    return pgL("Dengarkan kalimatnya. Apa artinya?", x.id, lainPola(g, x, 4, "id"), L, { suara: x.utuh, bahas: `Yang diucapkan: ${bahasPola(x)}` }); },
};
function kalimatBS(g, n) {
  const nilai = campurBS(n), X = []; for (let i = 0; i < 30 && X.length < n; i++) { const x = kalimatPola(g); if (!X.some(y => y.utuh === x.utuh)) X.push(x); }
  return X.map((x, i) => ({ t: `${miring(nilai[i] ? x.utuh : pilih(x.keliru))}<br><span class="ket">= ${x.id}</span>`, b: nilai[i], x }));
}
const bahasKalimat = bt => bt.map(y => `${y.b ? "✔" : "✘"} ${y.b ? "" : `Yang benar: `}${miring(y.x.utuh)}`).join("<br>") + `<br>${bt[0].x.alasan.split(". ").slice(-1)[0]}`;
function soalPolaTKA(g, L) {
  const b = bentukSoalL(L);
  if (b === "bs") { const bt = kalimatBS(g, L <= 7 ? 3 : 4); return bs("Apakah kalimat bahasa Inggris berikut <b>Benar</b> atau <b>Salah</b> untuk artinya?", bt, { bahas: bahasKalimat(bt) }); }
  if (b === "pgk") { const bt = kalimatBS(g, L >= 9 ? 5 : 4); return pgk("Pilih <b>semua</b> kalimat yang benar untuk artinya.", bt, { bahas: bahasKalimat(bt) }); }
  if (b === "kecuali") { const bt = kalimatBS(g, 4), x = bt[0].x, salah = pilih(x.keliru);
    return pg("Kalimat berikut benar sesuai artinya, <b>kecuali</b> …", `${salah}<br><span class="ket">= ${x.id}</span>`, bt.slice(1).map(y => `${y.x.utuh}<br><span class="ket">= ${y.x.id}</span>`), { bahas: `${miring(salah)} keliru. Yang benar: ${miring(x.utuh)}<br>${x.alasan}` }); }
  return pilih(L <= 7 ? [PS.lengkapi, PS.benar, PS.dengar] : [PS.lengkapi, PS.benar, PS.arti, PS.dengar])(g, L);
}
const LEVEL_POLA = { 1: [PS.lengkapi], 2: [PS.lengkapi], 3: [PS.lengkapi, PS.arti], 4: [PS.benar, PS.arti, PS.dengar], 5: [PS.benar, PS.lengkapi, PS.dengar] };
const tingkatPola = g => { const t = {}; for (let L = 1; L <= 10; L++) t[L] = L <= 5 ? LEVEL_POLA[L].map(f => () => f(g, L)) : [() => soalPolaTKA(g, L)]; return t; };

/* ---------- Bacaan pendek (Tahap 1) ---------- */
const BACAAN_EN = ["hello-budi", "my-family", "my-school", "my-day"];
const pecahKalimat = t => (String(t).match(/[^.!?]+[.!?]+["”]?/g) || [t]).map(s => s.trim());
const bacaanEN = (b, sembunyi) => sembunyi
  ? `<h4>${b.judul}</h4><p class="ket">🔊 Bacaan ini hanya <b>diperdengarkan</b>. Tekan tombol 🔊 untuk mendengar lagi.</p>`
  : `<h4>${b.judul}</h4><p lang="en">${b.teks}</p>`;
function dasarBacaan(b, L) {
  const dengar = L >= 9 && adaSuaraInggris() && ya(0.5);
  return { bacaan: bacaanEN(b, dengar), ...(dengar ? { suara: b.teks } : {}), petunjuk: "Baca (atau dengarkan) bacaannya, lalu cari kalimat yang membicarakan hal yang ditanyakan." };
}
const BS_ = {
  kata: (b, L) => { const K = EN.KATA[b.id] || [], [k, a] = pilih(K);
    return pgL(`Dalam bacaan, kata <b>${k}</b> artinya …`, a, K.filter(x => x[1] !== a).map(x => x[1]), L, { ...dasarBacaan(b, 1), bahas: `<b>${k}</b> = ${a}.` }); },
  soal: (b, L) => { const q = pilih(EN.SOAL[b.id] || []);
    return pgL(q.t, q.p[q.j], q.p.filter((_, i) => i !== q.j), L, { ...dasarBacaan(b, L), bahas: q.b }); },
  kalimat: (b, L) => { const en = pecahKalimat(b.teks), id = pecahKalimat(b.arti), i = acak(0, Math.min(en.length, id.length) - 1);
    return pgL(`Apa arti kalimat ${miring("“" + en[i] + "”")}?`, id[i], id.filter((_, j) => j !== i), L, { ...dasarBacaan(b, 1), bahas: `${miring(en[i])} — ${id[i]}` }); },
};
function soalBacaanTKA(b, L) {
  const bt = EN.BS[b.id] || [], f = bentukSoalL(L), dasar = dasarBacaan(b, L);
  const butir = n => { const nilai = campurBS(n);
    const benar = kocok(bt.filter(x => x[1])), salah = kocok(bt.filter(x => !x[1])); let ib = 0, is = 0;
    return nilai.map(v => { const x = v ? benar[ib++ % benar.length] : salah[is++ % salah.length]; return { t: x[0], b: x[1], alasan: x[2] }; })
      .filter((x, i, a) => a.findIndex(y => y.t === x.t) === i); };
  const bahas = B => B.map(x => `${x.b ? "✔" : "✘"} ${x.t} — ${x.alasan}`).join("<br>");
  if (bt.some(x => x[1]) && bt.some(x => !x[1])) {
    if (f === "bs") { const B = butir(L <= 7 ? 3 : 4); if (B.length >= 3) return bs("Tentukan <b>Benar</b> atau <b>Salah</b> setiap pernyataan berdasarkan bacaan.", B, { ...dasar, bahas: bahas(B) }); }
    if (f === "pgk") { const B = butir(4); if (B.length >= 3) return pgk("Pilih <b>semua</b> pernyataan yang sesuai dengan bacaan.", B, { ...dasar, bahas: bahas(B) }); }
    if (f === "kecuali" && bt.filter(x => x[1]).length >= 3) { const s = pilih(bt.filter(x => !x[1])), bnr = ambil(bt.filter(x => x[1]), 3);
      return pg("Pernyataan berikut sesuai dengan bacaan, <b>kecuali</b> …", s[0], bnr.map(x => x[0]), { ...dasar, bahas: `${s[0]} — ${s[2]}` }); }
  }
  return BS_.soal(b, L);
}
const LEVEL_BACAAN = { 1: [BS_.kata], 2: [BS_.kata, BS_.kalimat], 3: [BS_.soal, BS_.kata], 4: [BS_.soal, BS_.kalimat], 5: [BS_.soal, BS_.kalimat] };
const tingkatBacaan = id => { const b = enLevel(id), t = {}; for (let L = 1; L <= 10; L++) t[L] = L <= 5 ? LEVEL_BACAAN[L].map(f => () => f(b, L)) : [() => soalBacaanTKA(b, L)]; return t; };

/* Urutan Tahap 1 (Pos 6) dan Tahap 2 (Pos 7, 11 Okt 2026) sama dengan English Reading */
EN.LEVEL.filter(l => (l.tahap === 1 || l.tahap === 2) && (l.pola || l.teks)).forEach(l =>
  daftarMisi(l.tahap === 1 ? "e-baca" : "e-teks", "en-" + l.id, l.pola ? l.judul.replace(/^Pattern:\s*/, "Pola: ") : `Bacaan: ${l.judul}`, IKON_EN[l.id] || "📘",
    l.pola ? tingkatPola(l.id) : tingkatBacaan(l.id)));
