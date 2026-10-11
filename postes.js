/* Pos Tes — Petualangan TKA SD
   ---------------------------------------------------------------
   Setiap pos Matematika / jurus Bahasa Indonesia diakhiri Pos Tes yang
   menguji semua pos sebelumnya (Pos Tes 2 = Pos 1 + Pos 2, dst.).
   Format mengikuti TKA SD/MI: 30 soal, 75 menit per mata pelajaran,
   soal setara TKA (level 7–9), jawaban baru diperiksa setelah dikumpulkan.
   Tes yang sedang berjalan disimpan di perangkat (KUNCI_TES) supaya bisa
   dilanjutkan bila aplikasi tertutup; waktunya tetap berjalan seperti ujian.
   Hasil disimpan di S.posTes[idTes] = [{ t, nilai, b, n, dt, pos: {idPos: [benar, jumlah]} }]. */
"use strict";

const TES_SOAL = 30, TES_MENIT = 75, TES_TUNTAS = 70, TES_RIWAYAT = 30, KUNCI_TES = "ptka_sd_tes";
/* Bobot materi per pos (dibagi ulang sesuai pos yang diuji) */
const BOBOT_TES = { bil: 12, alj: 5, ukr: 8, dat: 5, tem: 9, pah: 11, nal: 10,
  "e-aku": 5, "e-angka": 6, "e-rumah": 4, "e-giat": 6, "e-tata": 3, "e-baca": 6, "e-teks": 6 };   // Bahasa Inggris (11 Okt 2026)
/* Sebaran tingkat: 8 soal sulit, 16 setara TKA, 6 di atas TKA */
const LEVEL_TES = [[7, 8], [8, 16], [9, 6]];
const POS_TES = PULAU.flatMap(pl => { const ps = POS.filter(p => p.pulau === pl.id);
  return ps.map((p, i) => ({ id: `${pl.id}-${p.no}`, pulau: pl.id, no: p.no, pos: ps.slice(0, i + 1).map(x => x.id) })); });
const cariTes = id => POS_TES.find(t => t.id === id);
const tesUntukPos = p => POS_TES.find(t => t.pulau === p.pulau && t.no === p.no);
const judulTes = t => `Pos Tes ${t.no}`;
const namaPosTes = pid => { const p = POS.find(x => x.id === pid); return p.pulau !== "bin" ? `Pos ${p.no} · ${p.judul}` : p.judul; };
const cakupanTes = t => (t.pos.length === 1 ? namaPosTes(t.pos[0]) : t.pulau !== "bin" ? `Pos 1–${t.no}` : t.pos.map(id => POS.find(p => p.id === id).judul.replace("Jurus ", "")).join(", "));
const riwayatTes = id => (S.posTes && S.posTes[id]) || [];
const terbaikTes = id => riwayatTes(id).reduce((a, x) => Math.max(a, x.nilai), -1);
const tesTerbuka = t => t.pos.every(posSelesai);
const predikatTes = n => (n >= 85 ? "Istimewa 🌟" : n >= TES_TUNTAS ? "Baik 👍" : n >= 55 ? "Cukup 🙂" : "Perlu belajar lagi 💪");
const jamTes = dtk => { dtk = Math.max(0, Math.ceil(dtk)); return `${String(Math.floor(dtk / 60)).padStart(2, "0")}:${String(dtk % 60).padStart(2, "0")}`; };

/* ---------- Menyusun soal ---------- */
function bagiSoalTes(t) {
  const total = t.pos.reduce((s, id) => s + BOBOT_TES[id], 0);
  const jatah = t.pos.map(id => { const x = TES_SOAL * BOBOT_TES[id] / total; return { id, n: Math.floor(x), sisa: x % 1 }; });
  let kurang = TES_SOAL - jatah.reduce((s, x) => s + x.n, 0);
  jatah.slice().sort((a, b) => b.sisa - a.sisa).forEach(x => { if (kurang > 0) { x.n++; kurang--; } });
  return jatah;
}
function susunSoalTes(t, coba) {
  const level = kocok(LEVEL_TES.flatMap(([L, n]) => Array(n).fill(L))), ada = new Set(), hasil = [];
  let k = 0;
  for (const { id: pid, n } of bagiSoalTes(t)) {
    const ms = kocok(MISI.filter(m => m.pos === pid)), bag = [];
    for (let i = 0; i < n; i++) {
      const m = ms[i % ms.length], L = level[k++]; let s;
      for (let c = 0; c < 12; c++) { s = coba ? buatSoal(m.id, L, null) : ambilSoal(m.id, L); if (!ada.has(s.kunciUnik)) break; }
      ada.add(s.kunciUnik); s.pos = pid; bag.push(s);
    }
    bag.sort((a, b) => a.level - b.level); hasil.push(...bag);
  }
  return hasil;
}
const jawabKosong = s => (s.bentuk === "isian" ? "" : s.bentuk === "pg" ? null : s.bentuk === "pgk" ? s.opsi.map(() => false) : s.pernyataan.map(() => null));
const terisi = (s, j) => (s.bentuk === "isian" ? !!j && j.trim() !== "" && !/[,/ ]$/.test(j) : s.bentuk === "pg" ? j !== null && j !== undefined : s.bentuk === "pgk" ? j.some(Boolean) : j.every(x => x !== null));

/* ---------- Tes yang sedang berjalan ---------- */
let T = null, jamTesId = null;
function bacaTesJalan() { try { const x = JSON.parse(localStorage.getItem(KUNCI_TES)); return x && x.tid && Array.isArray(x.soal) ? x : null; } catch (e) { return null; } }
function simpanTesJalan() { if (!T || T.coba) return; try { localStorage.setItem(KUNCI_TES, JSON.stringify(T)); } catch (e) { /* tes tetap berjalan di memori */ } }
function hapusTesJalan() { try { localStorage.removeItem(KUNCI_TES); } catch (e) { /* kosong */ } }
const sisaDetikTes = x => (x.akhir - Date.now()) / 1000;

async function mulaiTes(tid, coba = false) {
  const t = cariTes(tid); if (!t) return;
  if (!coba) {
    const jalan = bacaTesJalan();
    if (jalan) { if (jalan.tid === tid) return lanjutkanTes(jalan); tampilPesan(`Selesaikan dulu ${judulTes(cariTes(jalan.tid))} yang sedang berjalan.`); return; }
    if (!tesTerbuka(t)) { bunyi.salah(); tampilPesan("🔒 Selesaikan semua misi di pos yang diuji dulu, ya!"); return; }
    if (!(await bolehLatihan(() => mulaiTes(tid)))) return;
  }
  const soal = susunSoalTes(t, coba), mulai = Date.now();
  T = { tid, coba, soal, jawab: soal.map(jawabKosong), ragu: soal.map(() => false), i: 0, mulai, akhir: mulai + TES_MENIT * 60000 };
  if (!coba) { simpanData(); simpanTesJalan(); }
  tampilPesan(`⏱️ Waktu ${TES_MENIT} menit dimulai. Semangat!`);
  jalankanJamTes(); lTes();
}
function lanjutkanTes(x) {
  if (sisaDetikTes(x) <= 0) { T = x; return kumpulkanTes(true); }
  T = x; jalankanJamTes(); lTes();
}
function jalankanJamTes() {
  clearInterval(jamTesId);
  jamTesId = setInterval(() => {
    if (!T) return clearInterval(jamTesId);
    const sisa = sisaDetikTes(T), el = document.getElementById("jam-tes");
    if (el) { el.textContent = "⏱️ " + jamTes(sisa); el.classList.toggle("hampir", sisa <= 300); }
    if (sisa <= 0) { document.querySelectorAll(".lapis").forEach(x => x.remove()); kumpulkanTes(true); }
  }, 1000);
}

/* ---------- Layar mengerjakan ---------- */
function lTes() {
  kepala.hidden = true; pasangNav(null); layarKini = "tes"; window.scrollTo(0, 0);
  const t = cariTes(T.tid), s = T.soal[T.i], akhir = T.i === T.soal.length - 1;
  layar.innerHTML = `<div class="main-atas"><button class="tutup" id="t-keluar" aria-label="Keluar">✕</button><div class="info"><b>📝 ${judulTes(t)} · ${cariPulau(t.pulau).judul}</b>
      <span class="ket">${T.coba ? "🧪 Uji coba · " : ""}${cakupanTes(t)}</span></div><span class="chip jam-tes" id="jam-tes" role="timer" aria-label="Sisa waktu">⏱️ ${jamTes(sisaDetikTes(T))}</span></div>
    <div class="nomor-tes" id="nomor-tes" aria-label="Nomor soal">${T.soal.map((x, k) => `<button type="button" data-no="${k}" aria-label="Soal ${k + 1}">${k + 1}</button>`).join("")}</div>
    <p class="ket keterangan-nomor"><i class="isi"></i>sudah dijawab <i class="ragu"></i>ragu-ragu <i></i>belum</p>
    <div class="kartu kartu-soal" id="kartu-soal"><div class="nomor">SOAL ${T.i + 1} DARI ${T.soal.length}</div>${s.bacaan ? `<div class="bacaan">${s.bacaan}</div>` : ""}${tombolSuara(s)}<div class="teks-soal">${s.teks}</div>${s.gambar ? `<div class="wadah-gambar">${s.gambar}</div>` : ""}
      <div id="area-jawab">${areaJawab(s)}</div>
      <div class="aksi-tes"><button class="tbl tbl-putih" id="t-mundur" ${T.i ? "" : "disabled"} aria-label="Soal sebelumnya">◀</button>
        <button class="tbl ${T.ragu[T.i] ? "tbl-utama" : "tbl-putih"}" id="t-ragu" aria-pressed="${T.ragu[T.i]}" aria-label="Tandai ragu-ragu">🤔 Ragu</button>
        <button class="tbl ${akhir ? "tbl-hijau" : "tbl-biru"}" id="t-maju">${akhir ? "Selesai ✔" : "Berikutnya ▶"}</button></div></div>
    <button class="tbl tbl-putih tbl-lebar" id="t-kumpul">📤 Kumpulkan jawaban</button>`;
  tandaiNomorTes(); pasangJawabTes(s);
  layar.querySelector("#nomor-tes").addEventListener("click", e => { const b = e.target.closest("[data-no]"); if (b) keNomorTes(+b.dataset.no); });
  layar.querySelector("#t-mundur").addEventListener("click", () => keNomorTes(T.i - 1));
  layar.querySelector("#t-maju").addEventListener("click", () => (akhir ? konfirmasiKumpul() : keNomorTes(T.i + 1)));
  layar.querySelector("#t-ragu").addEventListener("click", e => { bunyi.klik(); T.ragu[T.i] = !T.ragu[T.i]; e.currentTarget.className = "tbl " + (T.ragu[T.i] ? "tbl-utama" : "tbl-putih"); e.currentTarget.setAttribute("aria-pressed", T.ragu[T.i]); tandaiNomorTes(); simpanTesJalan(); });
  layar.querySelector("#t-kumpul").addEventListener("click", konfirmasiKumpul);
  layar.querySelector("#t-keluar").addEventListener("click", keluarTes);
}
function keNomorTes(k) { if (k < 0 || k >= T.soal.length || k === T.i) return; bunyi.klik(); T.i = k; simpanTesJalan(); lTes(); }
function tandaiNomorTes() {
  document.querySelectorAll("#nomor-tes [data-no]").forEach(b => { const k = +b.dataset.no;
    b.className = (k === T.i ? "kini " : "") + (T.ragu[k] ? "ragu" : terisi(T.soal[k], T.jawab[k]) ? "isi" : ""); });
}
/* Jawaban disimpan di T.jawab (bukan M) dan tampilan dipulihkan saat kembali ke nomor itu */
function pasangJawabTes(s) {
  const area = document.getElementById("area-jawab"), k = T.i, ubah = () => { tandaiNomorTes(); simpanTesJalan(); };
  if (s.bentuk === "isian") {
    const tulis = () => { document.getElementById("isi-jawab").textContent = T.jawab[k].replace(/ /g, " "); };
    tulis();
    area.querySelector("#papan").addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (b) { ketikTes(b.dataset.k); tulis(); ubah(); } });
    return;
  }
  if (s.bentuk === "pg") {
    area.querySelectorAll(".opsi").forEach((b, i) => b.setAttribute("aria-checked", T.jawab[k] === i));
    area.addEventListener("click", e => { const b = e.target.closest(".opsi"); if (!b) return; bunyi.klik(); T.jawab[k] = +b.dataset.i; area.querySelectorAll(".opsi").forEach(x => x.setAttribute("aria-checked", x === b)); ubah(); });
  }
  if (s.bentuk === "pgk") {
    area.querySelectorAll(".opsi").forEach((b, i) => b.setAttribute("aria-checked", !!T.jawab[k][i]));
    area.addEventListener("click", e => { const b = e.target.closest(".opsi"); if (!b) return; bunyi.klik(); const i = +b.dataset.i; T.jawab[k][i] = !T.jawab[k][i]; b.setAttribute("aria-checked", T.jawab[k][i]); ubah(); });
  }
  if (s.bentuk === "bs") {
    area.querySelectorAll(".bs-tombol").forEach((g, i) => { const v = T.jawab[k][i]; if (v !== null) g.querySelector(v ? ".b" : ".s").setAttribute("aria-pressed", "true"); });
    area.addEventListener("click", e => { const b = e.target.closest("button[data-v]"); if (!b) return; bunyi.klik(); const g = b.parentElement; T.jawab[k][+g.dataset.i] = b.dataset.v === "1"; g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); ubah(); });
  }
}
function ketikTes(t) {
  const s = T.soal[T.i]; let j = T.jawab[T.i];
  if (t === "⌫") j = j.slice(0, -1);
  else if (t === "␣") { if (s.pecahan && /\d$/.test(j) && !j.includes(" ")) j += " "; }
  else if (t === "/") { if (s.pecahan && /\d$/.test(j) && !j.includes("/") && !j.includes(",")) j += "/"; }
  else if (t === ",") { if (/\d$/.test(j) && !/[,/ ]/.test(j)) j += ","; }
  else if (/^\d$/.test(t) && j.replace(/\D/g, "").length < 10) j += t;
  T.jawab[T.i] = j; bunyi.klik();
}
document.addEventListener("keydown", e => {
  if (layarKini !== "tes" || !T || document.querySelector(".lapis")) return;
  const s = T.soal[T.i];
  if (e.key === "ArrowRight" && s.bentuk !== "isian") return keNomorTes(T.i + 1);
  if (e.key === "ArrowLeft" && s.bentuk !== "isian") return keNomorTes(T.i - 1);
  if (s.bentuk === "isian") { const k = e.key === "Backspace" ? "⌫" : e.key === " " ? "␣" : e.key === "." ? "," : e.key;
    if (/^[\d,/⌫␣]$/.test(k)) { e.preventDefault(); ketikTes(k); document.getElementById("isi-jawab").textContent = T.jawab[T.i].replace(/ /g, " "); tandaiNomorTes(); simpanTesJalan(); } }
  else if (s.bentuk === "pg") { const i = "abcde".indexOf(e.key.toLowerCase()); if (i >= 0 && i < s.opsi.length) document.querySelectorAll("#area-jawab .opsi")[i]?.click(); }
});
function konfirmasiKumpul() {
  bunyi.klik();
  const kosong = T.soal.filter((s, k) => !terisi(s, T.jawab[k])).length, ragu = T.ragu.filter(Boolean).length;
  dialog(`<div style="font-size:48px">📤</div><h2>Kumpulkan jawaban?</h2><p class="ket">${kosong ? `Masih ada <b>${kosong} soal belum dijawab</b>. ` : "Semua soal sudah dijawab. "}${ragu ? `Ada <b>${ragu} soal ragu-ragu</b>. ` : ""}Sisa waktu <b>${jamTes(sisaDetikTes(T))}</b>.</p><p class="ket">Setelah dikumpulkan, jawaban tidak bisa diubah.</p>`,
    [["Ya, kumpulkan", "tbl-hijau", () => kumpulkanTes(false)], ["Periksa lagi", "tbl-putih", null]]);
}
function keluarTes() {
  if (T.coba) return dialog(`<div style="font-size:48px">🧪</div><h2>Hentikan uji coba?</h2>`, [["Lanjut mengerjakan", "tbl-hijau", null], ["Keluar", "tbl-putih", () => { clearInterval(jamTesId); T = null; kembaliKeMateri(null); }]]);
  const t = cariTes(T.tid);
  dialog(`<div style="font-size:48px">⏱️</div><h2>Keluar sebentar?</h2><p class="ket">Jawabanmu tersimpan, tetapi <b>waktu tetap berjalan</b> (sisa ${jamTes(sisaDetikTes(T))}). Lanjutkan dari kartu ${judulTes(t)} di Pulau ${cariPulau(t.pulau).judul} sebelum waktu habis.</p>`,
    [["Lanjut mengerjakan", "tbl-hijau", null], ["Keluar sementara", "tbl-putih", () => { simpanTesJalan(); clearInterval(jamTesId); T = null; tampil("pulau", t.pulau); }]]);
}

/* ---------- Menilai ---------- */
function kumpulkanTes(waktuHabis) {
  clearInterval(jamTesId);
  const x = T, t = cariTes(x.tid);
  const hasil = x.soal.map((s, k) => (terisi(s, x.jawab[k]) ? (periksa(s, x.jawab[k]).benar ? "benar" : "salah") : "kosong"));
  const b = hasil.filter(h => h === "benar").length, n = x.soal.length, nilai = Math.round(b / n * 100);
  const pos = {}; x.soal.forEach((s, k) => { const p = (pos[s.pos] ||= [0, 0]); p[1]++; if (hasil[k] === "benar") p[0]++; });
  const dt = Math.round(Math.min(TES_MENIT * 60, (Math.min(Date.now(), x.akhir) - x.mulai) / 1000));
  const rek = { t: x.mulai, nilai, b, n, dt, pos };
  let koin = 0, antrean = [];
  if (!x.coba) {
    const terbaikLama = terbaikTes(x.tid);
    (S.posTes ||= {})[x.tid] = [...riwayatTes(x.tid), { ...rek }].slice(-TES_RIWAYAT);
    koin = b * 5;
    if (nilai >= TES_TUNTAS && !S.piala["tes-" + x.tid]) { S.piala["tes-" + x.tid] = hariIni(); koin += 100;
      antrean.push(["perak", "📝", `Piala ${judulTes(t)}!`, `Nilaimu <b>${nilai}</b> di ${judulTes(t)} ${cariPulau(t.pulau).judul}. Kamu siap menghadapi soal TKA!`]); }
    rek.rekor = terbaikLama >= 0 && nilai > terbaikLama;
    S.koin += koin; catatApi(); simpanData(); hapusTesJalan();
  }
  T = null; ULAS = { tid: x.tid, coba: x.coba, soal: x.soal, jawab: x.jawab, hasil, saring: false, ringkas: [rek, koin, waktuHabis] };
  lHasilTes(rek, koin, waktuHabis);
  if (antrean.length) setTimeout(() => tunjukPiala(antrean), 1300);
}
let ULAS = null;
function lHasilTes(rek, koin, waktuHabis, ulang = false) {
  const t = cariTes(ULAS.tid), kosong = ULAS.hasil.filter(h => h === "kosong").length;
  kepala.hidden = true; pasangNav(null); layarKini = "hasil"; window.scrollTo(0, 0);
  const baris = Object.entries(rek.pos).map(([pid, [b, n]]) => { const p = Math.round(b / n * 100);
    return `<tr><td>${namaPosTes(pid)}</td><td class="angka">${b}/${n}</td><td class="batang-sel"><div class="batang"><i style="width:${p}%"></i></div></td><td class="angka">${p}%</td></tr>`; }).join("");
  const lemah = Object.entries(rek.pos).filter(([, [b, n]]) => b / n < 0.6).map(([pid]) => namaPosTes(pid));
  layar.innerHTML = `<div class="kartu hasil">${waktuHabis ? '<p class="ket" style="margin:0 0 6px">⏰ <b>Waktu habis</b> — jawaban dikumpulkan otomatis.</p>' : ""}
      <div style="font-size:56px">${rek.nilai >= TES_TUNTAS ? "🎉" : "📝"}</div><h1>${judulTes(t)} selesai!</h1><p class="ket">${ULAS.coba ? "🧪 Uji coba · " : ""}${cariPulau(t.pulau).judul} · ${cakupanTes(t)}</p>
      <div class="nilai-tes ${rek.nilai >= TES_TUNTAS ? "tuntas" : ""}"><b>${rek.nilai}</b><span>${predikatTes(rek.nilai)}</span></div>
      ${rek.rekor ? '<p class="ket">🏅 <b>Rekor baru!</b> Nilai terbaikmu naik.</p>' : ""}
      <div class="ringkas"><div><b>${rek.b}/${rek.n}</b>benar</div><div><b>${rek.n - rek.b - kosong}</b>salah</div><div><b>${kosong}</b>kosong</div><div><b>${lamaTeks(rek.dt, "0 dtk")}</b>dari ${TES_MENIT} mnt</div>${ULAS.coba ? "" : `<div><b>+${koin}</b>koin 💰</div>`}</div>
      <div style="overflow-x:auto"><table class="tabel-laporan tabel-tes"><thead><tr><th>Materi</th><th>Benar</th><th></th><th>%</th></tr></thead><tbody>${baris}</tbody></table></div>
      <p class="ket">${rek.nilai >= TES_TUNTAS ? "Hebat! Pertahankan dengan sering berlatih." : `Raih nilai <b>${TES_TUNTAS}</b> untuk mendapat Piala ${judulTes(t)}.`}${lemah.length ? ` Ulangi misi di <b>${lemah.join(", ")}</b> supaya makin kuat.` : ""}</p>
      <div class="tombol-tumpuk"><button class="tbl tbl-utama" id="h-ulas">🔍 Lihat pembahasan</button>
        ${ULAS.coba ? '<button class="tbl tbl-putih" id="h-materi">Kembali ke Materi &amp; Level Soal</button>' : `<button class="tbl tbl-putih" data-ke="pulau" data-arg="${t.pulau}">Kembali ke Pulau ${cariPulau(t.pulau).judul}</button>`}</div></div>`;
  layar.querySelector("#h-ulas").addEventListener("click", () => { bunyi.klik(); lUlasTes(); });
  layar.querySelector("#h-materi")?.addEventListener("click", () => { bunyi.klik(); kembaliKeMateri(null); });
  if (ulang) return;   // kembali dari pembahasan: tanpa suara dan konfeti lagi
  if (rek.nilai >= TES_TUNTAS) { bunyi.lulus(); konfeti(1.6); } else bunyi.gagal();
}

/* ---------- Pembahasan ---------- */
function jawabanTeks(s, j) {
  if (!terisi(s, j)) return "<i>tidak dijawab</i>";
  if (s.bentuk === "isian") return esc(j) + (s.satuan ? " " + s.satuan : "");
  if (s.bentuk === "pg") return `${"ABCDE"[j]}. ${s.opsi[j]}`;
  if (s.bentuk === "pgk") return s.opsi.map((o, i) => (j[i] ? `${"ABCDE"[i]}. ${o}` : "")).filter(Boolean).join("<br>");
  return s.pernyataan.map((p, i) => `${j[i] === null ? "–" : j[i] ? "Benar" : "Salah"} — ${p}`).join("<br>");
}
function lUlasTes() {
  layarKini = "hasil"; window.scrollTo(0, 0);
  const t = cariTes(ULAS.tid), ikon = { benar: "✅ Benar", salah: "❌ Salah", kosong: "⬜ Kosong" };
  const item = ULAS.soal.map((s, k) => { const h = ULAS.hasil[k]; if (ULAS.saring && h === "benar") return "";
    const opsi = s.bentuk === "pg" || s.bentuk === "pgk" ? `<ol class="contoh-opsi" type="A">${s.opsi.map(o => `<li>${o}</li>`).join("")}</ol>` : "";
    return `<div class="kartu ulas-tes ${h}"><div class="nomor">NOMOR ${k + 1} · ${ikon[h]} <span class="ket">· ${namaPosTes(s.pos)}</span></div>
      ${s.bacaan ? `<details class="contoh-bacaan"><summary>Lihat bacaan</summary><div class="bacaan">${s.bacaan}</div></details>` : ""}
      ${tombolSuara(s)}<div class="teks-soal">${s.teks}</div>${s.gambar ? `<div class="wadah-gambar">${s.gambar}</div>` : ""}${opsi}
      <div class="ulas-jawab"><b>Jawabanmu:</b><div>${jawabanTeks(s, ULAS.jawab[k])}</div></div>
      <div class="contoh-kunci"><b>Kunci:</b><div>${s.bentuk === "pg" ? `${"ABCDE"[s.kunci]}. ` : ""}${tulisKunci(s)}</div></div>
      ${s.bahas ? `<div class="bahas-tes">💡 ${s.bahas}</div>` : ""}</div>`; }).join("");
  layar.innerHTML = `<div class="main-atas"><button class="tutup" id="u-kembali" aria-label="Kembali ke hasil">←</button><div class="info"><b>🔍 Pembahasan ${judulTes(t)}</b><span class="ket">${cariPulau(t.pulau).judul} · ${cakupanTes(t)}</span></div></div>
    <div class="baris-set" style="border:0"><span class="ket">${ULAS.saring ? "Hanya soal yang salah atau kosong" : "Semua soal"}</span><button class="tbl tbl-putih tbl-kecil" id="u-saring">${ULAS.saring ? "Tampilkan semua" : "Hanya yang salah"}</button></div>
    ${item || '<div class="kartu"><p class="ket" style="margin:0">Tidak ada soal yang salah. Sempurna! 🎉</p></div>'}
    <div class="tombol-tumpuk" style="display:grid;gap:10px;margin:16px 0">${ULAS.coba ? '<button class="tbl tbl-utama" id="u-materi">Kembali ke Materi &amp; Level Soal</button>' : `<button class="tbl tbl-utama" data-ke="pulau" data-arg="${t.pulau}">Kembali ke Pulau ${cariPulau(t.pulau).judul}</button>`}</div>`;
  layar.querySelector("#u-saring").addEventListener("click", () => { bunyi.klik(); ULAS.saring = !ULAS.saring; lUlasTes(); });
  layar.querySelector("#u-kembali").addEventListener("click", () => { bunyi.klik(); lHasilTes(...ULAS.ringkas, true); });
  layar.querySelector("#u-materi")?.addEventListener("click", () => { bunyi.klik(); kembaliKeMateri(null); });
}

/* ---------- Kartu di Pulau & layar pembuka ---------- */
function kartuTesPulau(p) {
  const t = tesUntukPos(p); if (!t) return "";
  const buka = tesTerbuka(t), terbaik = terbaikTes(t.id), kali = riwayatTes(t.id).length, jalan = bacaTesJalan(), piala = S.piala["tes-" + t.id];
  const status = jalan && jalan.tid === t.id ? (sisaDetikTes(jalan) > 0 ? `⏱️ Sedang dikerjakan · sisa ${jamTes(sisaDetikTes(jalan))}` : "⏰ Waktu habis · lihat hasil")
    : !buka ? `🔒 Selesaikan semua misi ${t.pos.length > 1 ? (t.pulau !== "bin" ? `Pos 1–${t.no}` : "jurus 1–" + t.no) : "di pos ini"} dulu`
      : terbaik >= 0 ? `Nilai terbaik <b>${terbaik}</b> · ${kali}× dikerjakan` : "Siap dikerjakan! Uji semua yang sudah kamu pelajari.";
  return `<button class="kartu-tes ${buka ? "" : "kunci"}" data-ke="postes" data-arg="${t.id}"><div class="ikon">📝</div><div class="tengah"><h3>${judulTes(t)} <span class="lencana k5">${cakupanTes(t)}</span></h3>
    <div class="status">${TES_SOAL} soal · ${TES_MENIT} menit · setara TKA</div><div class="status">${status}</div></div><div class="kanan">${piala ? pialaSVG("perak", "📝") : buka ? '<span style="font-size:26px">▶️</span>' : '<span style="font-size:24px">🔒</span>'}</div></button>`;
}
function lPosTes(tid) {
  const t = cariTes(tid); if (!t) return tampil("beranda");
  const jalan = bacaTesJalan();
  if (jalan && jalan.tid === tid && sisaDetikTes(jalan) <= 0) return lanjutkanTes(jalan);   // waktu habis saat aplikasi tertutup: nilai sekarang
  pasangKepala("pulau", t.pulau); pasangNav("beranda");
  const buka = tesTerbuka(t), rw = riwayatTes(tid), terbaik = terbaikTes(tid), lain = jalan && jalan.tid !== tid ? cariTes(jalan.tid) : null;
  const materi = t.pos.map(pid => { const ms = MISI.filter(m => m.pos === pid), sel = ms.filter(m => misiSelesai(m.id)).length;
    return `<li>${sel === ms.length ? "✅" : "⬜"} <b>${namaPosTes(pid)}</b> <span class="ket">· ${sel}/${ms.length} misi selesai · ±${bagiSoalTes(t).find(x => x.id === pid).n} soal</span></li>`; }).join("");
  const riwayat = rw.slice(-5).reverse().map(x => `<li><span>${tglIndo(hariIni(new Date(x.t)))}</span><b>${x.nilai}</b><span class="ket">${x.b}/${x.n} benar · ${lamaTeks(x.dt)}</span></li>`).join("");
  const tombol = jalan && jalan.tid === tid ? `<button class="tbl tbl-utama tbl-lebar" id="t-mulai">Lanjutkan tes ▶ (sisa ${jamTes(sisaDetikTes(jalan))})</button>`
    : lain ? `<button class="tbl tbl-utama tbl-lebar" disabled>Selesaikan dulu ${judulTes(lain)} ${cariPulau(lain.pulau).judul}</button>`
      : `<button class="tbl tbl-utama tbl-lebar" id="t-mulai" ${buka ? "" : "disabled"}>${buka ? `Mulai ${judulTes(t)} 🚀` : "🔒 Belum terbuka"}</button>`;
  layar.innerHTML = `<div class="jalur-kepala"><div class="ikon-misi">📝</div><h1>${judulTes(t)}</h1><p class="ket">${cariPulau(t.pulau).ikon} ${cariPulau(t.pulau).judul} · ${cakupanTes(t)}${terbaik >= 0 ? ` · nilai terbaik <b>${terbaik}</b>` : ""}</p></div>
    <div class="kartu"><h3>Materi yang diuji</h3><ul class="daftar-tes">${materi}</ul>${buka ? "" : '<p class="ket" style="margin:8px 0 0">🔒 Pos Tes terbuka setelah <b>semua misi</b> di pos yang diuji selesai (sampai Level 10).</p>'}</div>
    <div class="kartu"><h3>Aturan seperti TKA</h3><ul class="ket aturan-tes">
      <li>📄 <b>${TES_SOAL} soal</b> setara TKA SD (sulit, setara TKA, dan di atas TKA).</li>
      <li>⏱️ Waktu <b>${TES_MENIT} menit</b>. Waktu tetap berjalan walau aplikasi ditutup; bila habis, jawaban dikumpulkan otomatis.</li>
      <li>🔀 Boleh pindah nomor dan menandai <b>ragu-ragu</b>. Tidak ada petunjuk Kiko.</li>
      <li>✔️ Jawaban baru diperiksa setelah dikumpulkan. PG kompleks dan benar–salah dihitung benar bila semua pilihannya tepat.</li>
      <li>💰 5 koin setiap jawaban benar. Nilai <b>${TES_TUNTAS}</b> ke atas pertama kali: <b>Piala ${judulTes(t)}</b> + 100 koin.</li></ul></div>
    ${riwayat ? `<div class="kartu"><h3>Nilai sebelumnya</h3><ul class="riwayat-tes">${riwayat}</ul></div>` : ""}
    ${tombol}<p class="ket" style="text-align:center">Siapkan kertas coretan dan cari tempat yang tenang 🦉</p>`;
  layar.querySelector("#t-mulai")?.addEventListener("click", () => { bunyi.klik(); mulaiTes(tid); });
}
/* Dipanggil saat aplikasi dibuka: tawarkan melanjutkan tes yang belum dikumpulkan */
function cekTesTertunda() {
  const x = bacaTesJalan(); if (!x || !S.profil || S.peran === "ortu") return;
  const t = cariTes(x.tid); if (!t) return hapusTesJalan();
  if (sisaDetikTes(x) <= 0) return lanjutkanTes(x);
  dialog(`<div style="font-size:48px">📝</div><h2>${judulTes(t)} belum selesai</h2><p class="ket">${cariPulau(t.pulau).judul} · sisa waktu <b>${jamTes(sisaDetikTes(x))}</b>. Waktu terus berjalan.</p>`,
    [["Lanjutkan tes ▶", "tbl-utama", () => lanjutkanTes(bacaTesJalan() || x)], ["Nanti", "tbl-putih", null]]);
}

/* ---------- Untuk orang tua ---------- */
function htmlPosTesOrtu() {
  const baris = PULAU.map(p => `<tr class="kelompok"><td colspan="4">${p.ikon} ${p.judul}</td></tr>` + POS_TES.filter(t => t.pulau === p.id).map(t => { const rw = riwayatTes(t.id), akhir = rw[rw.length - 1], tb = terbaikTes(t.id);
    return `<tr><td>📝 ${judulTes(t)}<small class="ket" style="display:block">${cakupanTes(t)}</small></td><td class="angka">${rw.length || "–"}</td><td class="angka">${tb >= 0 ? tb + (S.piala["tes-" + t.id] ? " 🏆" : "") : "–"}</td>
      <td class="angka posisi">${akhir ? `${akhir.nilai}<small>${tglIndo(hariIni(new Date(akhir.t)))} · ${lamaTeks(akhir.dt)}</small>` : tesTerbuka(t) ? "<small>siap</small>" : "<small>🔒</small>"}</td></tr>`; }).join("")).join("");
  return `<div class="kartu"><h3>Pos Tes</h3><p class="ket" style="margin:4px 0 8px">Tes ${TES_SOAL} soal · ${TES_MENIT} menit setara TKA SD setelah tiap pos/jurus selesai; menguji semua pos sebelumnya. Nilai 0–100, tuntas ${TES_TUNTAS}.</p>
    <div style="overflow-x:auto"><table class="tabel-laporan"><thead><tr><th>Tes</th><th>Kali</th><th>Terbaik</th><th>Terakhir</th></tr></thead><tbody>${baris}</tbody></table></div></div>`;
}
const htmlPosTesMateri = pulau => `<div class="pos-sub">📝 Pos Tes · ${TES_SOAL} soal · ${TES_MENIT} menit</div><div class="tk-isi">` +
  POS_TES.filter(t => t.pulau === pulau).map(t => `<div class="lv-baris"><span class="lencana k5">${judulTes(t)}</span><span class="kt"><b>${cakupanTes(t)}</b><small>Level 7–9 · ${bagiSoalTes(t).map(x => `${POS.find(p => p.id === x.id).judul.replace("Jurus ", "")} ${x.n}`).join(" · ")}</small></span>
    <span class="lv-bintang">${terbaikTes(t.id) >= 0 ? "terbaik " + terbaikTes(t.id) : tesTerbuka(t) ? "siap" : "terkunci"}</span><span class="lv-tombol"><button type="button" class="tbl tbl-biru tbl-kecil" data-coba-tes="${t.id}">Coba</button></span></div>`).join("") + `</div>`;
