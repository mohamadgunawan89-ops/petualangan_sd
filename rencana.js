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
    sim: Array.isArray(a.hariSimulasi) ? a.hariSimulasi : [5] }; };
const hariKe = tgl => (new Date(tgl + "T00:00:00").getDay() + 6) % 7;
const tambahHari = (tgl, n) => { const d = new Date(tgl + "T00:00:00"); d.setDate(d.getDate() + n); return hariIni(d); };
const menitPerLevel = () => Math.max(4, Math.round(atur().soal * 1.3));
const sisaLevel = pl => MISI.filter(m => m.pulau === pl).flatMap(m => { const lv = dataMisi(m.id).lv; return Array.from({ length: 10 - lv }, (_, i) => ({ m: m.id, L: lv + 1 + i })); });
const simBelum = () => { const P = PULAU_TKA.map(pl => paketTKA(pl).filter(t => terbaikTes(t.id) < TES_TUNTAS)), r = [];
  for (let i = 0; i < PAKET_TKA; i++) P.forEach(x => x[i] && r.push(x[i])); return r; };
const totalLevelTKA = () => MISI.filter(m => PULAU_TKA.includes(m.pulau)).length * 10;

function buatRencana(dari = hariIni()) {
  if (!S.tka) return { status: "tanpa" };
  const sisa = selisihHari(dari, S.tka); if (sisa <= 0) return { status: sisa === 0 ? "hariH" : "lewat" };
  const a = aturRencana(), hari = [];
  for (let i = 0; i < sisa; i++) { const tgl = tambahHari(dari, i), w = hariKe(tgl);
    hari.push({ tgl, w, jenis: sisa > 2 && i === sisa - 1 ? "rehat" : a.sim.includes(w) ? "calon" : a.hari.includes(w) ? "belajar" : "libur", tugas: [] }); }
  // Simulasi: paket yang belum tuntas ditaruh di hari simulasi terakhir sebelum H-1, berurutan dari paket 1
  const sims = simBelum(), calon = hari.filter(h => h.jenis === "calon");
  let pakai = calon.slice(-sims.length); if (sims.length > calon.length) pakai = calon;
  const perHari = pakai.length ? Math.min(2, Math.ceil(sims.length / pakai.length)) : 0; let si = 0;
  pakai.forEach(h => { for (let k = 0; k < perHari && si < sims.length; k++) h.tugas.push({ jenis: "sim", tid: sims[si++].id }); if (h.tugas.length) h.jenis = "sim"; });
  const simLebih = sims.length - si;
  hari.forEach(h => { if (h.jenis === "calon") h.jenis = "belajar"; });
  // Level: dibagi rata ke hari belajar; 7 hari belajar terakhir untuk mengulang bila waktunya cukup
  const Q = PULAU_TKA.map(sisaLevel), total = Q[0].length + Q[1].length, awalQ = Q.map(q => q.length || 1);
  const belajar = hari.filter(h => h.jenis === "belajar"), cadUlang = belajar.length > 21 ? 7 : belajar.length > 10 ? 3 : 0;
  const efektif = Math.max(1, belajar.length - cadUlang), kapasitas = Math.max(1, Math.floor(a.menit / menitPerLevel()));
  const perlu = Math.ceil(total / efektif), target = Math.min(perlu, kapasitas);
  belajar.forEach(h => {
    const ambilItem = [];
    for (let k = 0; k < target && (Q[0].length || Q[1].length); k++) {
      const pilihQ = !Q[1].length ? 0 : !Q[0].length ? 1 : (Q[0].length / awalQ[0] >= Q[1].length / awalQ[1] ? 0 : 1);
      ambilItem.push(Q[pilihQ].shift());
    }
    ambilItem.sort((p, q) => (p.m === q.m ? p.L - q.L : 0)).forEach(x => { const sama = h.tugas.find(t => t.m === x.m && t.sampai === x.L - 1);   // satu baris per misi: "Level 5–6"
      if (sama) sama.sampai = x.L; else h.tugas.push({ jenis: "level", m: x.m, dari: x.L, sampai: x.L }); });
    if (!h.tugas.length) h.tugas.push({ jenis: "ulang" });
  });
  const sisaTakTerbagi = Q[0].length + Q[1].length;
  const selesaiMateri = [...belajar].reverse().find(h => h.tugas.some(t => t.jenis === "level"));
  return { status: "ok", hari, total, target, kapasitas, perlu, simLebih, sisaTakTerbagi, menit: a.menit, selesaiMateri: selesaiMateri && selesaiMateri.tgl,
    awalSim: (hari.find(h => h.jenis === "sim") || {}).tgl, sims: sims.length };
}

/* Titik awal rencana (untuk status "sesuai jadwal") — dibuat ulang bila tanggal TKA berubah */
function titikAwal(r) {
  const sudah = totalLevelTKA() - r.total;
  if (!S.rencanaAwal || S.rencanaAwal.tka !== S.tka || sudah < S.rencanaAwal.sudah) {
    S.rencanaAwal = { tgl: hariIni(), tka: S.tka, sudah, total: r.total, hariBelajar: r.hari.filter(h => h.jenis === "belajar").length }; simpanData(false);
  }
  return S.rencanaAwal;
}
function statusJadwal(r) {
  const aw = titikAwal(r), sudahKini = totalLevelTKA() - r.total, dikerjakan = sudahKini - aw.sudah;
  const a = aturRencana(); let lewat = 0; for (let t = aw.tgl; t < hariIni(); t = tambahHari(t, 1)) if (a.hari.includes(hariKe(t))) lewat++;
  const harap = aw.hariBelajar ? Math.round(aw.total * Math.min(1, lewat / Math.max(1, aw.hariBelajar - 3))) : 0, selisih = dikerjakan - harap;
  return selisih >= 3 ? { kls: "cepat", teks: `🚀 Lebih cepat ${selisih} level dari jadwal` } : selisih >= -1 ? { kls: "pas", teks: "👍 Sesuai jadwal" }
    : { kls: "kejar", teks: `⏳ Tertinggal ${-selisih} level — ayo kejar sedikit demi sedikit` };
}
/* Tugas hari ini dibekukan sejak pertama dilihat */
function tugasHariIni(r) {
  const h = hariIni();
  if (!S.rencanaHari || S.rencanaHari.tgl !== h || S.rencanaHari.tka !== S.tka) {
    const d = r.hari && r.hari[0] && r.hari[0].tgl === h ? r.hari[0] : null;
    S.rencanaHari = { tgl: h, tka: S.tka, jenis: d ? d.jenis : "libur", tugas: d ? d.tugas : [] }; simpanData(false);
  }
  return S.rencanaHari;
}
const logHari = tgl => S.log.filter(x => hariIni(new Date(x.t)) === tgl);
function statusTugas(t) {
  if (t.jenis === "level") { const lv = dataMisi(t.m).lv, n = t.sampai - t.dari + 1, sel = Math.max(0, Math.min(n, lv - t.dari + 1)); return { n, sel, beres: sel >= n }; }
  if (t.jenis === "sim") { const hari = riwayatTes(t.tid).some(x => hariIni(new Date(x.t)) === hariIni()) || terbaikTes(t.tid) >= TES_TUNTAS; return { n: 1, sel: hari ? 1 : 0, beres: hari }; }
  const ada = logHari(hariIni()).length > 0 || (S.harian.tgl === hariIni() && S.harian.selesai); return { n: 1, sel: ada ? 1 : 0, beres: ada };
}
function teksTugas(t) {
  if (t.jenis === "level") { const m = cariMisi(t.m); return { ikon: m.ikon, judul: m.judul, sub: `${cariPulau(m.pulau).judul} · Level ${t.dari}${t.sampai > t.dari ? `–${t.sampai}` : ""}` }; }
  if (t.jenis === "sim") { const s = cariTes(t.tid); return { ikon: "🎯", judul: judulTes(s), sub: `${cariPulau(s.pulau).judul} · ${TES_SOAL} soal · ${TES_MENIT} menit` }; }
  return { ikon: "🔁", judul: "Ulangi materi yang masih lemah", sub: "Kerjakan ulang level dengan bintang sedikit, atau Tantangan Harian" };
}
function mulaiTugas(t) {
  if (t.jenis === "level") { const lv = dataMisi(t.m).lv; return lv + 1 <= 10 ? mulaiLevel(t.m, Math.max(t.dari, lv + 1)) : tampil("jalur", t.m); }
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
  if (r.status === "tanpa") return `<button class="kartu rc-beranda" data-ke="rencana"><span class="rc-ikon">📅</span><span class="rc-isi"><b>Buat rencana belajar menuju TKA</b><span class="ket">Minta orang tua mengisi tanggal TKA, lalu lihat target harianmu.</span></span><span aria-hidden="true">▶️</span></button>`;
  if (r.status !== "ok") return "";
  const th = tugasHariIni(r), st = th.tugas.map(statusTugas), n = st.reduce((a, x) => a + x.n, 0), sel = st.reduce((a, x) => a + x.sel, 0);
  const libur = !th.tugas.length, persen = n ? Math.round(sel / n * 100) : 100;
  return `<button class="kartu rc-beranda ${!libur && sel >= n ? "beres" : ""}" data-ke="rencana"><span class="rc-ikon">${libur ? "😴" : sel >= n ? "✅" : "🎯"}</span>
    <span class="rc-isi"><b>${libur ? (th.jenis === "rehat" ? "Hari rehat sebelum TKA" : "Hari ini libur belajar") : sel >= n ? "Target hari ini tercapai!" : "Target hari ini"}</b>
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
  const H = selisihHari(hariIni(), S.tka), th = tugasHariIni(r), st = th.tugas.map(statusTugas), n = st.reduce((a, x) => a + x.n, 0), sel = st.reduce((a, x) => a + x.sel, 0);
  const sj = statusJadwal(r), siap = kesiapan(r), dTka = new Date(S.tka + "T00:00:00"), aw = S.rencanaAwal;
  // Garis waktu: dari awal rencana sampai hari H
  const mulai = aw && aw.tgl < hariIni() ? aw.tgl : hariIni(), panjang = Math.max(1, selisihHari(mulai, S.tka)), pos = t => Math.max(0, Math.min(100, selisihHari(mulai, t) / panjang * 100));
  const akhirMateri = r.selesaiMateri ? tambahHari(r.selesaiMateri, 1) : hariIni(), awalSim = r.awalSim || tambahHari(S.tka, -1), rehat = tambahHari(S.tka, -1);
  const seg = [["lewat", mulai, hariIni(), "Sudah dilalui"], ["materi", hariIni(), akhirMateri, "Kuasai materi"], ["ulang", akhirMateri, awalSim < akhirMateri ? akhirMateri : awalSim, "Ulang materi"], ["sim", awalSim < akhirMateri ? akhirMateri : awalSim, rehat, "Simulasi TKA"], ["rehat", rehat, S.tka, "Rehat"]]
    .filter(([, a, b]) => b > a);
  const libur = !th.tugas.length;
  layar.innerHTML = `
    <div class="rc-hero">
      <div class="rc-hero-kiri"><div class="rc-label">MENUJU TKA</div><div class="rc-h">H-${H}</div>
        <div class="rc-tgl">${HARI_PENUH[hariKe(S.tka)]}, ${tglIndo(S.tka)}</div><span class="rc-chip ${sj.kls}">${sj.teks}</span></div>
      <div class="rc-cincin" style="--p:${siap}"><div><b>${siap}%</b><span>siap TKA</span></div></div></div>

    <div class="kartu rc-hari-ini"><div class="rc-judul"><h2>🎯 Target hari ini</h2><span class="ket">${HARI_PENUH[hariKe(hariIni())]}, ${tglIndo(hariIni())}</span></div>
      ${libur ? `<p class="rc-libur">${th.jenis === "rehat" ? "😌 <b>Hari rehat.</b> Tidur cukup, siapkan alat tulis dan kartu peserta. Besok TKA!" : "😴 <b>Hari ini libur belajar.</b> Istirahat juga penting. Mau tetap berlatih? Coba Tantangan Harian."}</p>`
        : `<div class="rc-progres"><div class="batang"><i style="width:${n ? Math.round(sel / n * 100) : 0}%"></i></div><b>${sel}/${n}</b></div>
        <div class="rc-tugas">${th.tugas.map((t, i) => { const x = teksTugas(t), s = st[i];
          return `<div class="rc-item ${s.beres ? "beres" : ""}"><span class="rc-cek" aria-hidden="true">${s.beres ? "✓" : ""}</span><span class="rc-item-ikon">${x.ikon}</span>
            <span class="rc-item-isi"><b>${x.judul}</b><span class="ket">${x.sub}${t.jenis === "level" && s.n > 1 ? ` · ${s.sel}/${s.n} level` : ""}</span></span>
            ${s.beres ? '<span class="rc-ok">Beres!</span>' : `<button class="tbl tbl-utama tbl-kecil" data-tugas="${i}">Mulai ▶</button>`}</div>`; }).join("")}</div>
        ${sel >= n ? '<p class="rc-selamat">🎉 Hebat! Target hari ini sudah tercapai. Mau lanjut? Semua tambahan membuat jadwal besok lebih ringan.</p>' : ""}`}</div>

    <div class="kartu"><h2 class="rc-h2">🗺️ Perjalanan menuju TKA</h2>
      <div class="rc-garis">${seg.map(([k, a, b, nm]) => `<div class="rc-seg ${k}" style="left:${pos(a)}%;width:${pos(b) - pos(a)}%" title="${nm}"></div>`).join("")}
        ${r.hari.filter(h => h.jenis === "sim").map(h => `<i class="rc-titik-sim" style="left:${pos(h.tgl)}%" title="Simulasi TKA ${tglIndo(h.tgl)}"></i>`).join("")}
        <div class="rc-kini ${pos(hariIni()) < 12 ? "kiri" : pos(hariIni()) > 88 ? "kanan" : ""}" style="left:${pos(hariIni())}%"><span>Hari ini</span></div><div class="rc-bendera">🏁</div></div>
      ${r.awalSim ? `<p class="ket" style="margin:6px 0 0">🟣 Titik ungu = hari Simulasi TKA (${r.hari.filter(h => h.jenis === "sim").length} hari, mulai ${tglIndo(r.awalSim)}).</p>` : ""}
      <div class="rc-legenda">${seg.filter(s => s[0] !== "lewat").map(([k, a, b, nm]) => `<span><i class="${k}"></i>${nm} <small>${tambahHari(b, -1) <= a ? tglRingkas(a) : `${tglRingkas(a)}–${tglRingkas(tambahHari(b, -1))}`}</small></span>`).join("")}</div></div>

    <div class="kartu"><h2 class="rc-h2">📆 Minggu ini</h2><div class="rc-minggu">${mingguIni(r)}</div></div>

    <div class="kartu"><div class="rc-judul"><h2 class="rc-h2">🗓️ Kalender belajar</h2><button type="button" class="tbl tbl-putih tbl-kecil" id="rc-lipat-semua">Buka semua</button></div>
      <p class="ket" style="margin:0 0 6px">Ketuk nama bulan untuk membuka atau menutup. Ketuk tanggal untuk melihat tugasnya.</p>
      <div id="rc-kalender">${kalenderRencana(r)}</div>
      <div class="rc-legenda kecil"><span><i class="belajar"></i>Belajar</span><span><i class="sim"></i>Simulasi TKA</span><span><i class="libur"></i>Libur</span><span><i class="rehat"></i>Rehat</span><span><i class="hariH"></i>Hari H</span></div></div>

    <div class="kartu"><h2 class="rc-h2">📊 Ringkasan rencana</h2>
      <div class="rc-ringkas">${PULAU_TKA.map(pl => { const p = cariPulau(pl), sl = sisaLevel(pl).length, tot = MISI.filter(m => m.pulau === pl).length * 10, sm = paketTKA(pl).filter(t => terbaikTes(t.id) >= TES_TUNTAS).length;
        return `<div class="rc-mapel"><b>${p.ikon} ${p.judul}</b><div class="batang"><i style="width:${Math.round((tot - sl) / tot * 100)}%"></i></div><span class="ket">${tot - sl}/${tot} level · simulasi tuntas ${sm}/${PAKET_TKA}</span></div>`; }).join("")}</div>
      <ul class="ket rc-catatan">
        <li>⏱️ Waktu belajar <b>${r.menit} menit</b> sehari (±${r.kapasitas} level) · hari belajar ${aturRencana().hari.map(i => HARI_SINGKAT[i]).join(", ")} · hari simulasi ${aturRencana().sim.map(i => HARI_SINGKAT[i]).join(", ") || "–"}.</li>
        <li>🎯 Target <b>${r.target} level</b> per hari belajar${r.selesaiMateri ? ` · materi selesai sekitar <b>${tglIndo(r.selesaiMateri)}</b>` : r.total ? "" : " · semua materi sudah selesai 🎉"}.</li>
        ${r.sims ? `<li>📝 ${r.sims} paket Simulasi TKA dijadwalkan mulai <b>${r.awalSim ? tglIndo(r.awalSim) : "–"}</b>${r.simLebih ? ` (${r.simLebih} paket belum kebagian hari — tambah hari simulasi)` : ""}.</li>` : ""}
        ${r.sisaTakTerbagi ? `<li class="rc-awas">⚠️ Waktunya belum cukup: ${r.sisaTakTerbagi} level belum terjadwal. Perlu ±${r.perlu} level sehari — tambah menit belajar atau hari belajar di <b>Orang Tua → Pengaturan</b>.</li>` : ""}
        <li>💡 Rencana menyesuaikan setiap hari. Hari yang terlewat dibagi otomatis ke hari berikutnya.</li></ul>
      <button class="tbl tbl-putih tbl-lebar" data-ke="ortu">⚙️ Ubah waktu &amp; hari belajar (Orang Tua)</button></div>`;
  layar.querySelectorAll("[data-tugas]").forEach(b => b.addEventListener("click", () => { bunyi.klik(); mulaiTugas(th.tugas[+b.dataset.tugas]); }));
  const kal = layar.querySelector("#rc-kalender");
  kal.addEventListener("click", e => { const b = e.target.closest("[data-tgl]"); if (!b) return; bunyi.klik(); pilihTgl = b.dataset.tgl;
    kal.querySelectorAll(".dipilih").forEach(x => x.classList.remove("dipilih")); b.classList.add("dipilih"); tampilDetail(r, pilihTgl); });
  const lipat = layar.querySelector("#rc-lipat-semua"), semua = () => [...kal.querySelectorAll("details")];
  const segarLipat = () => { lipat.textContent = semua().every(d => d.open) ? "Tutup semua" : "Buka semua"; };
  lipat.addEventListener("click", () => { bunyi.klik(); const buka = !semua().every(d => d.open); semua().forEach(d => (d.open = buka)); segarLipat(); });
  kal.addEventListener("toggle", segarLipat, true);
  tampilDetail(r, pilihTgl && pilihTgl >= hariIni() && pilihTgl <= S.tka ? pilihTgl : hariIni());
}
const tglRingkas = t => { const [, m, d] = t.split("-").map(Number); return `${d} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][m - 1]}`; };
function mingguIni(r) {
  const senin = tambahHari(hariIni(), -hariKe(hariIni())), a = aturRencana();
  return Array.from({ length: 7 }, (_, i) => { const tgl = tambahHari(senin, i), kini = tgl === hariIni(), dulu = tgl < hariIni(), h = r.hari.find(x => x.tgl === tgl);
    let ikon, ket, kls;
    if (dulu) { const lg = logHari(tgl).filter(x => x.lulus).length, ts = Object.values(S.posTes || {}).flat().some(x => hariIni(new Date(x.t)) === tgl);
      if (lg || ts) { ikon = "✅"; ket = ts ? "tes" : `${lg} level`; kls = "ok"; } else if (a.hari.includes(i) || a.sim.includes(i)) { ikon = "✖"; ket = "terlewat"; kls = "lewat"; } else { ikon = "😴"; ket = "libur"; kls = "libur"; } }
    else if (tgl === S.tka) { ikon = "🏁"; ket = "TKA"; kls = "hariH"; }
    else if (!h) { ikon = "·"; ket = ""; kls = "kosong"; }
    else { const nL = h.tugas.filter(t => t.jenis === "level").reduce((s, t) => s + t.sampai - t.dari + 1, 0);
      ikon = h.jenis === "sim" ? "📝" : h.jenis === "libur" ? "😴" : h.jenis === "rehat" ? "😌" : nL ? "📘" : "🔁"; ket = h.jenis === "sim" ? "simulasi" : h.jenis === "libur" ? "libur" : h.jenis === "rehat" ? "rehat" : nL ? `${nL} level` : "ulang"; kls = h.jenis; }
    return `<div class="rc-hari ${kls} ${kini ? "kini" : ""}"><span class="rc-hari-nama">${HARI_SINGKAT[i]}</span><span class="rc-hari-tgl">${+tgl.slice(8)}</span><span class="rc-hari-ikon">${ikon}</span><span class="rc-hari-ket">${ket}</span></div>`; }).join("");
}
/* Kalender dilipat per bulan (12 Okt 2026): bulan ini terbuka, bulan lain hanya judul & ringkasan; rincian tanggal
   tampil di dalam bulannya sendiri supaya tidak perlu menggulir jauh */
const NAMA_BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
function kalenderRencana(r) {
  const peta = Object.fromEntries(r.hari.map(h => [h.tgl, h])), awal = hariIni(), akhir = S.tka, bulanBuka = (pilihTgl && pilihTgl >= awal && pilihTgl <= akhir ? pilihTgl : awal).slice(0, 7);
  let html = "";
  for (let b = awal.slice(0, 7); b <= akhir.slice(0, 7); b = tambahHari(b + "-01", 32).slice(0, 7)) {
    const [y, m] = b.split("-").map(Number), jml = new Date(y, m, 0).getDate(), di = r.hari.filter(h => h.tgl.startsWith(b));
    const nB = di.filter(h => h.jenis === "belajar").length, nS = di.filter(h => h.jenis === "sim").length;
    const nL = di.reduce((s, h) => s + h.tugas.filter(x => x.jenis === "level").reduce((a, x) => a + x.sampai - x.dari + 1, 0), 0);
    html += `<details class="rc-lipat" data-bulan="${b}" ${b === bulanBuka ? "open" : ""}><summary><span class="rc-bulan-nama">${NAMA_BULAN[m - 1]} ${y}</span>
      <span class="rc-bulan-ring">${nB ? `<span>📘 ${nB} hari${nL ? ` · ${nL} level` : ""}</span>` : ""}${nS ? `<span>📝 ${nS}</span>` : ""}${b === akhir.slice(0, 7) ? "<span>🏁 TKA</span>" : ""}</span></summary>
      <div class="rc-kal">${HARI_SINGKAT.map(x => `<span class="rc-nama">${x}</span>`).join("")}${'<span class="rc-tg luar"></span>'.repeat(hariKe(b + "-01"))}`;
    for (let d = 1; d <= jml; d++) {
      const t = `${b}-${String(d).padStart(2, "0")}`, h = peta[t];
      if (t < awal || t > akhir) { html += `<span class="rc-tg ${t < awal ? "dulu" : "luar"}">${t < awal ? d : ""}</span>`; continue; }
      const kls = t === akhir ? "hariH" : h ? h.jenis : "luar", n = h ? h.tugas.filter(x => x.jenis === "level").reduce((s, x) => s + x.sampai - x.dari + 1, 0) : 0;
      html += `<button type="button" class="rc-tg ${kls} ${t === awal ? "kini" : ""} ${t === pilihTgl ? "dipilih" : ""}" data-tgl="${t}" aria-label="${tglIndo(t)}">${d}${kls === "sim" ? "<i>📝</i>" : kls === "hariH" ? "<i>🏁</i>" : n ? `<i>${n}</i>` : ""}</button>`;
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
  const isi = tgl === S.tka ? "<p>🏁 <b>Hari TKA!</b> Sarapan, datang lebih awal, baca soal pelan-pelan, dan periksa kembali jawabanmu.</p>"
    : !h ? "" : h.jenis === "libur" ? "<p>😴 Libur belajar. Istirahat dan bermain.</p>" : h.jenis === "rehat" ? "<p>😌 Rehat sebelum TKA: tidur cukup, siapkan alat tulis, jangan belajar terlalu berat.</p>"
      : `<ul>${h.tugas.map(t => { const x = teksTugas(t); return `<li><span>${x.ikon}</span><span><b>${x.judul}</b><small>${x.sub}</small></span></li>`; }).join("")}</ul>`;
  el.innerHTML = `<div class="rc-detail-judul">${HARI_PENUH[hariKe(tgl)]}, ${tglIndo(tgl)}${tgl === hariIni() ? " · hari ini" : ""}</div>${isi}`;
}
