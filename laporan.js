/* Laporan untuk keluarga (18 Okt 2026) — kartu di Dasbor Ortu.
   Ringkasan 7 hari terakhir + saran, disusun dari data anak dengan aturan sederhana (tanpa server/AI), dalam format
   teks WhatsApp (*tebal*, _miring_). Orang tua boleh mengubah teksnya, lalu mengirim lewat wa.me (memilih grup
   keluarga di WhatsApp), menu Bagikan perangkat, atau menyalin. Kode Anak sengaja TIDAK ikut dikirim: siapa pun
   yang memegang kode itu bisa mengubah kemajuan anak.
   Sumber angka:
   - Kebiasaan: tanggal di S.log (level) dan S.rencanaCatatan (tugas harian, termasuk Dengar & Baca).
   - Jawaban & waktu minggu ini: S.log (k = jawaban diperiksa; catatan lama b + s). Tantangan Harian tidak tercatat di log.
   - Akurasi per mapel & per misi: S.misi (sepanjang waktu, termasuk Tantangan Harian).
   - Menebak: level dengan salah ≥ jumlah soal dan rata-rata < 8 detik per jawaban. */
"use strict";
const LP_HARI = 7, LP_MENEBAK_DTK = 8;
let lpUbahan = null, lpBuka = false;   // teks yang sudah diubah orang tua tetap ada saat dasbor diperbarui (sinkron)

const lpAkurasi = ms => { const t = ms.reduce((a, m) => a + dataMisi(m.id).total, 0), b = ms.reduce((a, m) => a + dataMisi(m.id).benar, 0); return t ? { t, b, p: Math.round(b / t * 100) } : null; };
const lpMisi = m => `${cariPulau(m.pulau).judul} – ${m.judul}`;

function susunLaporan() {
  const kini = hariIni(), awal = tambahHari(kini, -(LP_HARI - 1)), tAwal = Date.parse(awal + "T00:00:00");
  const nama = (S.profil?.nama || "Ananda").trim(), log = (S.log || []).filter(x => x.t >= tAwal && cariMisi(x.m));
  const hariAktif = new Set(log.map(x => hariIni(new Date(x.t))));
  for (const [tg, c] of Object.entries(S.rencanaCatatan || {})) if (tg >= awal && c.s > 0) hariAktif.add(tg);
  const target = Object.entries(S.rencanaCatatan || {}).filter(([tg, c]) => tg >= awal && tg < kini && c.t), tercapai = target.filter(([, c]) => c.s >= c.t).length;
  const jaw = log.reduce((a, x) => a + (x.k ?? (x.b || 0) + (x.s || 0)), 0), sal = log.reduce((a, x) => a + Math.min(x.s || 0, x.k ?? (x.b || 0) + (x.s || 0)), 0);
  const lulus = log.filter(x => x.lulus), menit = Math.round(log.reduce((a, x) => a + (x.dt || 0), 0) / 60 / LP_HARI), aR = aturRencana();
  const menebak = log.filter(x => x.s >= x.n && x.dt && x.dt / Math.max(1, (x.k ?? (x.b || 0) + x.s)) < LP_MENEBAK_DTK);
  const api = apiAktif() ? S.api.n : 0, B = [];
  const L = (...a) => B.push(...a);

  L(`📚 *Laporan Belajar ${nama}*`, `Petualangan TKA SD · ${tglIndo(kini)}`, "", "@@KESIMPULAN@@", "");
  // Gambaran keseluruhan (sepanjang waktu)
  const semua = lpAkurasi(MISI), mulai = MISI.filter(m => dataMisi(m.id).total);
  L("📊 *Gambaran keseluruhan*");
  if (semua) L(`• ${fmt(semua.t)} soal dijawab sejak mulai, ${semua.p}% benar · waktu mengerjakan soal ${lamaTeks(MISI.reduce((a, m) => a + (dataMisi(m.id).detik || 0), 0), "–")}`);
  for (const pl of PULAU) { const ms = misiPulau(pl.id), ak = lpAkurasi(ms); if (!ak) continue;
    const lv = ms.reduce((a, m) => a + dataMisi(m.id).lv, 0), sel = ms.filter(m => misiSelesai(m.id)).length;
    L(`• ${pl.ikon} ${pl.judul}: ${lv} dari ${ms.length * 10} level lulus · ${ak.p}% benar${sel ? ` · ${sel} misi selesai 🏆` : ""}`); }
  if (!semua) L("• Belum ada soal yang dikerjakan");
  L("", `🗓️ *Minggu ini (${tglRingkas(awal)}–${tglRingkas(kini)})*`, `• Belajar ${hariAktif.size} dari ${LP_HARI} hari${api >= 3 ? ` · 🔥 ${api} hari berturut-turut` : ""}`);
  if (target.length) L(`• Target harian tercapai penuh ${tercapai} dari ${target.length} hari`);
  L(jaw ? `• ${fmt(jaw)} soal dijawab di level misi, ${Math.round((jaw - sal) / jaw * 100)}% benar · ${lulus.length} level lulus` : "• Belum ada level yang dikerjakan minggu ini");
  if (jaw) L(`• Waktu mengerjakan soal level ±${menit} menit/hari${S.tka || aR.ingTarget ? ` (rencana ${aR.menit} menit)` : ""}`);

  // Menuju TKA
  let r = null, sj = null, simTuntas = 0, simDicoba = 0;
  if (S.tka && selisihHari(kini, S.tka) > 0) {
    r = buatRencana(); if (r.status === "ok" && r.tka) sj = statusJadwal(r);
    for (const pl of PULAU_TKA) for (const t of paketTKA(pl)) { if (riwayatTes(t.id).length) simDicoba++; if (terbaikTes(t.id) >= TES_TUNTAS) simTuntas++; }
    const sudah = MISI.filter(m => PULAU_TKA.includes(m.pulau)).reduce((a, m) => a + dataMisi(m.id).lv, 0);
    L("", "🎯 *Menuju TKA*", `• H-${selisihHari(kini, S.tka)} (${tglIndo(S.tka)})`, `• ${sudah} dari ${totalLevelTKA()} level Matematika & Bahasa Indonesia lulus${sj ? ` · ${sj.teks.replace(/ — .*/, "")}` : ""}`,
      `• Simulasi TKA: ${simDicoba ? `${simTuntas} dari ${PAKET_TKA * 2} paket tuntas` : "belum pernah dicoba"}`);
  }

  // Sudah dikuasai
  const kuasai = [];
  for (const m of MISI) { const k = S.piala["misi-" + m.id]; if (k && k >= awal) kuasai.push(`• 🏆 ${lpMisi(m)} selesai (${tglRingkas(k)})`); }
  MISI.filter(m => !misiSelesai(m.id) && dataMisi(m.id).total >= 20 && dataMisi(m.id).benar / dataMisi(m.id).total >= 0.85)
    .forEach(m => kuasai.push(`• ${lpMisi(m)}: ${Math.round(dataMisi(m.id).benar / dataMisi(m.id).total * 100)}% benar, sudah Level ${dataMisi(m.id).lv}`));
  const mtk = lpAkurasi(misiPulau("mtk")), bin = lpAkurasi(misiPulau("bin"));
  if (kuasai.length) L("", "👏 *Sudah dikuasai*", ...kuasai.slice(0, 4));

  // Perlu bantuan: yang masih aktif lebih dulu; kesulitan yang sudah teratasi digabung satu baris
  const lemah = titikLemah(6), aktif = lemah.filter(a => a.L > dataMisi(a.m).lv), teratasi = lemah.filter(a => a.L <= dataMisi(a.m).lv), bantu = [];
  const pctMisi = m => Math.round(dataMisi(m.id).benar / dataMisi(m.id).total * 100);
  const rendah = MISI.filter(m => !misiSelesai(m.id) && !aktif.some(a => a.m === m.id) && dataMisi(m.id).total >= 20 && pctMisi(m) < 65);
  for (const a of aktif) bantu.push(`• ${lpMisi(cariMisi(a.m))} Level ${a.L}: ${a.gagal ? `${a.gagal}× belum lulus` : `${Math.round(a.acc * 100)}% benar`}${a.nyangkut ? " (masih tertahan)" : ""}`);
  rendah.forEach(m => bantu.push(`• ${lpMisi(m)}: baru ${pctMisi(m)}% benar, sekarang Level ${dataMisi(m.id).lv + 1}`));
  if (mtk && bin && mtk.t >= 20 && bin.t >= 20 && Math.abs(mtk.p - bin.p) >= 15)
    bantu.push(`• ${mtk.p < bin.p ? `Matematika (${mtk.p}% benar) masih jauh di bawah Bahasa Indonesia (${bin.p}%)` : `Bahasa Indonesia (${bin.p}% benar) masih jauh di bawah Matematika (${mtk.p}%)`}`);
  if (menebak.length) bantu.push(`• ⚠️ ${menebak.length}× menjawab sangat cepat dengan banyak salah, tanda menebak saat soal terasa sulit`);
  const grup = [...new Set(teratasi.map(a => a.m))].map(id => `${cariMisi(id).judul} ${teratasi.filter(a => a.m === id).sort((p, q) => q.L - p.L).map(a => `Level ${a.L}${a.gagal ? ` (${a.gagal}×)` : ""}`).join(", ")}`);
  if (grup.length) bantu.push(`• Sempat tertahan, tetapi akhirnya lulus: ${grup.join("; ")}`);
  if (bantu.length) L("", "🧩 *Perlu bantuan*", ...bantu.slice(0, 5));

  // Saran (paling banyak 4, lalu pujian)
  const saran = [], utama = aktif.find(a => a.nyangkut) || aktif[0], pelajari = id => (adaMateri(id) ? "; buka 📖 _Pelajari dulu_ sebelum mengerjakan" : "");
  if (utama) saran.push(`Dampingi 1–2 sesi di *${cariMisi(utama.m).judul}* Level ${utama.L}${pelajari(utama.m)}.`);
  else if (rendah.length) saran.push(`Dampingi 1–2 sesi di *${rendah[0].judul}*${pelajari(rendah[0].id)}.`);
  if (menebak.length) saran.push("Ingatkan: kalau salah dua kali, berhenti sebentar dan baca pembahasannya, jangan asal menebak.");
  if (hariAktif.size <= 3) saran.push("Sepakati jam belajar tetap setiap hari, misalnya sesudah makan malam.");
  else if (jaw && (S.tka || aR.ingTarget) && menit < aR.menit / 2) saran.push(`Waktu mengerjakan soal ±${menit} menit/hari, jauh di bawah rencana ${aR.menit} menit. Tambah waktunya, atau sesuaikan _menit harian_ di Pengaturan supaya rencananya realistis.`);
  if (sj && sj.kls === "kejar") saran.push(`Jadwal tertinggal ${-sj.selisih} level: tambah 1 level per hari sampai terkejar.`);
  if (r && !simDicoba && lulus.length) { const kuat = mtk && bin && bin.t >= 20 && mtk.t >= 20 ? (bin.p >= mtk.p ? "Bahasa Indonesia" : "Matematika") : bin && bin.t >= 20 ? "Bahasa Indonesia" : "Matematika";
    saran.push(`Coba 1 Simulasi TKA ${kuat} sebagai patokan awal.`); }
  const libur = liburPilihan().filter(t => t <= tambahHari(kini, 7));
  if (libur.length >= 3) saran.push(`Ada ${libur.length} hari libur pilihan dalam seminggu ke depan (${libur.map(tglRingkas).join(", ")}). Boleh, asal irama belajarnya tidak putus.`);
  if (!saran.length) saran.push("Pertahankan iramanya. Belajarnya sudah teratur dan hasilnya baik.");
  const puji = api >= 3 ? `${api} hari berturut-turut belajar` : kuasai.length ? "misi yang sudah dikuasai" : hariAktif.size >= 4 ? "kerajinannya minggu ini" : "";
  const daftar = saran.slice(0, 4); if (puji) daftar.push(`Beri ${nama} pujian di grup untuk ${puji} 💪`);
  L("", "💡 *Saran minggu ini*", ...daftar.map((s, i) => `${i + 1}. ${s}`), "", "_Dikirim dari aplikasi Petualangan TKA SD_");
  // Kesimpulan satu kalimat di atas
  const rajin = hariAktif.size >= 5 ? "rajin berlatih" : hariAktif.size >= 3 ? "cukup rutin berlatih" : hariAktif.size ? "belum rutin berlatih" : "belum berlatih minggu ini";
  const ada = [mtk && mtk.t >= 20 && { n: "Matematika", p: mtk.p }, bin && bin.t >= 20 && { n: "Bahasa Indonesia", p: bin.p }].filter(Boolean).sort((a, b) => b.p - a.p);
  let isi = "";
  if (ada.length === 2 && ada[0].p - ada[1].p >= 15) isi = `; ${ada[0].n} kuat (${ada[0].p}% benar), ${ada[1].n} masih perlu didampingi (${ada[1].p}%)`;
  else if (ada.length && ada.every(x => x.p >= 80)) isi = "; hasilnya baik";
  else if (ada.some(x => x.p < 65)) isi = `; ${ada.filter(x => x.p < 65).map(x => x.n).join(" dan ")} masih perlu didampingi`;
  B[B.indexOf("@@KESIMPULAN@@")] = `*Kesimpulan:* ${nama} ${rajin}${isi}.${sj ? ` Jadwal TKA: ${sj.teks.replace(/ — .*/, "")}.` : ""}`;
  return B.join("\n");
}

function htmlLaporanOrtu() {
  const teks = lpUbahan ?? susunLaporan();
  return `<div class="kartu lp-kartu"><h3>📲 Laporan untuk keluarga</h3>
    <p class="ket" style="margin:4px 0 10px">Ringkasan 7 hari terakhir dan saran, siap dikirim ke grup WhatsApp keluarga. Teksnya boleh diubah dulu. Kode Anak tidak ikut terkirim.</p>
    <details class="ks-item lp-isi"${lpBuka ? " open" : ""}><summary><span class="ks-judul"><b>Lihat &amp; ubah isi pesan</b>${lpUbahan !== null ? '<span class="ks-tanda pulih">sudah diubah</span>' : ""}</span></summary>
      <div class="ks-isi"><textarea class="isian-teks lp-teks" rows="16" aria-label="Isi laporan">${esc(teks)}</textarea>
      ${lpUbahan !== null ? '<button type="button" class="tbl tbl-putih tbl-kecil" data-lp="ulang">↺ Susun ulang dari data terbaru</button>' : ""}</div></details>
    <div class="lp-tombol"><button type="button" class="tbl tbl-hijau tbl-kecil" data-lp="wa">💬 Kirim via WhatsApp</button>
      ${navigator.share ? '<button type="button" class="tbl tbl-biru tbl-kecil" data-lp="bagi">📤 Bagikan…</button>' : ""}
      <button type="button" class="tbl tbl-putih tbl-kecil" data-lp="salin">📋 Salin teks</button></div></div>`;
}
async function salinTeks(t) {
  try { await navigator.clipboard.writeText(t); return true; } catch (e) { /* cara lama */ }
  const a = document.createElement("textarea"); a.value = t; a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select();
  let ok = false; try { ok = document.execCommand("copy"); } catch (e) { /* gagal */ } a.remove(); return ok;
}
function pasangLaporanOrtu(el) {
  const k = el.querySelector(".lp-kartu"); if (!k) return;
  const ta = k.querySelector(".lp-teks"), teks = () => ta.value.trim();
  ta.addEventListener("input", () => { lpUbahan = ta.value; });
  k.querySelector(".lp-isi").addEventListener("toggle", e => { lpBuka = e.target.open; });
  k.addEventListener("click", async e => { const b = e.target.closest("[data-lp]"); if (!b) return; bunyi.klik();
    const aksi = b.dataset.lp;
    if (aksi === "ulang") { lpUbahan = null; ta.value = susunLaporan(); b.remove(); k.querySelector(".lp-isi .ks-tanda")?.remove(); return; }
    if (aksi === "wa") return void window.open("https://wa.me/?text=" + encodeURIComponent(teks()), "_blank", "noopener");
    if (aksi === "bagi") { try { await navigator.share({ text: teks() }); } catch (e) { /* dibatalkan */ } return; }
    tampilPesan((await salinTeks(teks())) ? "📋 Teks laporan disalin. Tempel di grup WhatsApp keluarga." : "Belum bisa menyalin. Tekan lama teksnya, lalu Salin.");
  });
}
