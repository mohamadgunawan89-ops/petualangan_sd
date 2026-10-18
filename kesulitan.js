/* Di mana anak kesulitan (18 Okt 2026) — kartu di Dasbor Ortu.
   - Titik lemah per misi & level dihitung dari S.log (riwayat level, sudah digabung antar-perangkat):
     akurasi = (dijawab − salah) / dijawab. Catatan baru menyimpan k = banyak jawaban yang diperiksa; catatan lama
     tanpa k memakai b + s (benar langsung + salah), jadi riwayat sebelum fitur ini ikut terhitung
     (sedikit lebih rendah bila ada nomor yang diulang sampai benar).
   - S.salah: soal yang terakhir dijawab salah (latihan level, tantangan harian, dan Pos Tes), paling banyak
     SALAH_PER_MISI per misi dan SALAH_MAKS seluruhnya, disimpan sebagai HTML siap tampil (soal, jawaban anak,
     kunci, pembahasan). Ikut sinkron, jadi terlihat di HP orang tua. Server membatasi data 300 KB per anak,
     karena itu tiap catatan dibatasi SALAH_ENTRI_MAKS karakter.
   - Pos Tes: benar/jumlah per pos/jurus dari 3 hasil terakhir tiap tes (rek.pos di postes.js). */
"use strict";
const SALAH_PER_MISI = 3, SALAH_MAKS = 30, SALAH_ENTRI_MAKS = 2500, SALAH_PER_TES = 6;

const teksPolos = h => { const d = document.createElement("template"); d.innerHTML = h; return (d.content.textContent || "").replace(/\s+/g, " ").trim(); };
/* Isi S.salah bisa datang dari server (sinkron), jadi dibersihkan sebelum ditampilkan */
function bersihHtml(h) {
  const t = document.createElement("template"); t.innerHTML = String(h || "");
  t.content.querySelectorAll("script,iframe,object,embed,link,meta,style,base,form,foreignObject").forEach(x => x.remove());
  t.content.querySelectorAll("*").forEach(el => [...el.attributes].forEach(a => {
    if (/^on/i.test(a.name) || (/(^|:)(href|src|action)$/i.test(a.name) && /^\s*(javascript|data):/i.test(a.value))) el.removeAttribute(a.name); }));
  return t.innerHTML;
}

function catatSalah(s, j, sumber, t = Date.now()) {
  if (!s || !s.misi || !cariMisi(s.misi)) return;
  const opsi = s.bentuk === "pg" || s.bentuk === "pgk" ? `<ol class="contoh-opsi" type="A">${s.opsi.map(o => `<li>${o}</li>`).join("")}</ol>` : "";
  const e = { t, m: s.misi, L: s.level, sb: sumber, x: s.teks + opsi, j: jawabanTeks(s, j), k: (s.bentuk === "pg" ? `${"ABCDE"[s.kunci]}. ` : "") + tulisKunci(s), bh: htmlBahas(s, "bahas-tes") };
  if (s.bacaan) e.bc = s.bacaan; if (s.gambar) e.gb = s.gambar; if (s.suara) e.sr = s.suara;
  const besar = () => JSON.stringify(e).length > SALAH_ENTRI_MAKS;
  if (besar() && e.bc) e.bc = esc(teksPolos(e.bc).slice(0, 500)) + "…";
  if (besar() && e.gb) { delete e.gb; e.tg = 1; }
  if (besar()) e.bh = esc(teksPolos(e.bh).slice(0, 400)) + "…";
  S.salah = rapikanSalah([...(S.salah || []), e]);
}
/* Pos Tes: paling banyak SALAH_PER_TES soal salah, dari misi yang berbeda lebih dulu */
function catatSalahTes(soal, jawab, hasil, mulai) {
  const salah = soal.map((s, k) => ({ s, k })).filter(x => hasil[x.k] === "salah"), dipilih = [], misi = new Set();
  for (const x of salah) if (dipilih.length < SALAH_PER_TES && !misi.has(x.s.misi)) { misi.add(x.s.misi); dipilih.push(x); }
  for (const x of salah) if (dipilih.length < SALAH_PER_TES && !dipilih.includes(x)) dipilih.push(x);
  dipilih.sort((a, b) => a.k - b.k).forEach(x => catatSalah(x.s, jawab[x.k], "tes", mulai + x.k));
}
function rapikanSalah(arr) {
  const unik = new Map(); for (const x of arr) if (x && x.m && x.t) unik.set(`${x.t}|${x.m}`, x);
  const urut = [...unik.values()].sort((a, b) => a.t - b.t), per = {}, simpan = [];
  for (let i = urut.length - 1; i >= 0 && simpan.length < SALAH_MAKS; i--) { const x = urut[i]; if ((per[x.m] = (per[x.m] || 0) + 1) <= SALAH_PER_MISI) simpan.push(x); }
  return simpan.reverse();
}
const gabungSalah = (a, b) => rapikanSalah([...(a || []), ...(b || [])]);

/* Misi & level yang paling menyulitkan: akurasi rendah dan/atau berkali-kali belum lulus */
function titikLemah(maks = 6) {
  const g = new Map();
  for (const x of S.log || []) {
    if (!cariMisi(x.m) || !(x.L >= 1 && x.L <= 10)) continue;
    const kunci = x.m + "|" + x.L, a = g.get(kunci) || { m: x.m, L: x.L, coba: 0, gagal: 0, jaw: 0, sal: 0 };
    a.coba++; if (x.lulus === false) a.gagal++;
    const jaw = x.k ?? (x.s !== undefined ? (x.b || 0) + x.s : 0); if (jaw) { a.jaw += jaw; a.sal += Math.min(x.s || 0, jaw); }
    g.set(kunci, a);
  }
  return [...g.values()].map(a => { const acc = a.jaw ? (a.jaw - a.sal) / a.jaw : null, nyangkut = a.L > dataMisi(a.m).lv && a.gagal > 0;
      return { ...a, acc, nyangkut, skor: (acc === null ? 0.3 : 1 - acc) + 0.15 * Math.min(a.gagal, 4) + (nyangkut ? 0.3 : 0) }; })
    .filter(a => (a.jaw >= 5 && a.acc < 0.7) || a.gagal >= 2)
    .sort((p, q) => q.skor - p.skor).slice(0, maks);
}
/* Pos/jurus dari 3 hasil terakhir tiap Pos Tes & Simulasi TKA, per pulau, dari yang terlemah */
function posTesPerPos() {
  const agg = {};
  for (const [tid, rw] of Object.entries(S.posTes || {})) { if (!cariTes(tid)) continue;
    for (const r of rw.slice(-3)) for (const [pid, v] of Object.entries(r.pos || {})) { if (!POS.find(p => p.id === pid) || !Array.isArray(v)) continue;
      const a = (agg[pid] ||= [0, 0]); a[0] += +v[0] || 0; a[1] += +v[1] || 0; } }
  return PULAU.map(p => ({ p, baris: POS.filter(x => x.pulau === p.id && agg[x.id]?.[1]).map(x => ({ pid: x.id, b: agg[x.id][0], n: agg[x.id][1], pr: agg[x.id][0] / agg[x.id][1] })).sort((a, b) => a.pr - b.pr) }))
    .filter(x => x.baris.length);
}

function htmlSoalSalah(e) {
  const m = cariMisi(e.m), L = +e.L, t = TINGKAT[L];
  return bersihHtml(`<div class="kartu ulas-tes salah ks-soal"><div class="nomor">${tglIndo(hariIni(new Date(e.t)))} · ${m.ikon} ${m.judul}${t ? ` · Level ${L}` : ""}${e.sb === "tes" ? " · 📝 Pos Tes" : ""}</div>
    ${e.bc ? `<details class="contoh-bacaan"><summary>Lihat bacaan</summary><div class="bacaan">${e.bc}</div></details>` : ""}${e.sr ? tombolSuara({ suara: String(e.sr) }) : ""}
    <div class="teks-soal">${e.x}</div>${e.gb ? `<div class="wadah-gambar">${e.gb}</div>` : e.tg ? '<p class="ket">(gambar soal tidak disimpan)</p>' : ""}
    <div class="ulas-jawab"><b>Jawaban anak:</b><div>${e.j}</div></div><div class="contoh-kunci"><b>Kunci:</b><div>${e.k}</div></div>${e.bh || ""}</div>`);
}
const ksBuka = new Set();   // bagian yang sedang dibuka orang tua tetap terbuka saat dasbor diperbarui (sinkron)
function htmlKesulitanOrtu() {
  const lemah = titikLemah(), pos = posTesPerPos(), salah = (S.salah || []).filter(e => cariMisi(e.m));
  const buka = k => (ksBuka.has(k) ? " open" : "");
  const batang = pr => `<div class="batang ks-batang ${pr < 0.6 ? "rendah" : pr < 0.75 ? "sedang" : ""}"><i style="width:${Math.round(pr * 100)}%"></i></div>`;
  const itemLemah = a => { const m = cariMisi(a.m), t = TINGKAT[a.L], k = `l-${a.m}-${a.L}`;
    const contoh = salah.filter(e => e.m === a.m).sort((p, q) => (q.L === a.L) - (p.L === a.L) || q.t - p.t);
    const status = a.nyangkut ? '<b class="ks-tanda nyangkut">masih tersangkut</b>' : a.gagal && a.L <= dataMisi(a.m).lv ? '<b class="ks-tanda pulih">sudah lulus</b>' : "";
    return `<details class="ks-item" data-ks="${k}"${buka(k)}><summary><span class="ks-judul"><span>${m.ikon} <b>${m.judul}</b> · Level ${a.L}</span><span class="lencana ${t[1]}">${t[0]}</span></span>
        <span class="ks-ket">${a.acc !== null ? `akurasi <b>${Math.round(a.acc * 100)}%</b> (${a.jaw - a.sal}/${a.jaw} jawaban)` : `${a.coba}× dicoba`}${a.gagal ? ` · <b>${a.gagal}× belum lulus</b>` : ""} ${status}</span>
        ${a.acc !== null ? batang(a.acc) : ""}</summary>
      <div class="ks-isi">${contoh.length ? `<p class="ket">Soal yang terakhir dijawab salah di misi ini:</p>${contoh.map(htmlSoalSalah).join("")}`
        : '<p class="ket">Belum ada contoh soal salah yang tersimpan untuk misi ini (contoh mulai dicatat sejak 18 Oktober 2026).</p>'}
        <div class="ks-aksi"><button type="button" class="tbl tbl-biru tbl-kecil" data-ks-materi="${a.m}">📚 Lihat contoh soal &amp; coba level ini</button></div></div></details>`; };
  const tabelPos = pos.map(({ p, baris }) => `<tr class="kelompok"><td colspan="3">${p.ikon} ${p.judul}</td></tr>` + baris.map(x =>
    `<tr><td>${namaPosTes(x.pid)}${x.pr < 0.6 ? ' <b class="ks-tanda nyangkut">perlu diperkuat</b>' : ""}</td><td class="batang-sel">${batang(x.pr)}</td><td class="angka">${Math.round(x.pr * 100)}%<small class="ket" style="display:block;font-weight:600">${x.b}/${x.n}</small></td></tr>`).join("")).join("");
  return `<div class="kartu ks-kartu"><h3>🔍 Di mana anak kesulitan</h3>
    <p class="ket" style="margin:4px 0 10px">Disusun dari riwayat level dan Pos Tes. Buka satu baris untuk melihat soal yang dijawab salah, jawaban anak, kunci, dan pembahasannya.</p>
    <h4 class="ks-sub">Misi &amp; level yang paling sulit</h4>
    ${lemah.length ? lemah.map(itemLemah).join("") : `<p class="ket">${(S.log || []).length ? "👍 Belum ada misi yang menyulitkan: akurasi tiap level 70% ke atas dan tidak ada level yang berkali-kali belum lulus." : "Belum ada level yang dikerjakan."}</p>`}
    <h4 class="ks-sub">Pos/jurus di Pos Tes &amp; Simulasi TKA</h4>
    ${tabelPos ? `<p class="ket" style="margin:0 0 6px">Persen benar per pos/jurus dari 3 hasil terakhir tiap tes, dari yang terlemah.</p><div style="overflow-x:auto"><table class="tabel-laporan"><thead><tr><th>Pos/jurus</th><th></th><th>Benar</th></tr></thead><tbody>${tabelPos}</tbody></table></div>`
      : '<p class="ket">Belum ada Pos Tes atau Simulasi TKA yang dikerjakan.</p>'}
    <details class="ks-item ks-semua" data-ks="semua"${buka("semua")}><summary><span class="ks-judul"><b>❌ Soal yang terakhir dijawab salah</b><span class="ket">${salah.length} soal</span></span></summary>
      <div class="ks-isi">${salah.length ? salah.slice(-10).reverse().map(htmlSoalSalah).join("") + (salah.length > 10 ? `<p class="ket">Ditampilkan 10 terbaru. Contoh lain ada di baris misi di atas.</p>` : "")
        : '<p class="ket">Belum ada soal salah yang tercatat (mulai dicatat sejak 18 Oktober 2026).</p>'}</div></details></div>`;
}
function pasangKesulitanOrtu(el) {
  const k = el.querySelector(".ks-kartu"); if (!k) return;
  k.addEventListener("toggle", e => { const d = e.target; if (d.dataset?.ks) d.open ? ksBuka.add(d.dataset.ks) : ksBuka.delete(d.dataset.ks); }, true);
  k.addEventListener("click", e => { const b = e.target.closest("[data-ks-materi]"); if (!b) return; bunyi.klik(); tabOrtu = "materi"; bukaMisi = b.dataset.ksMateri; izinOrtu = true; tampil("ortu"); });
}
