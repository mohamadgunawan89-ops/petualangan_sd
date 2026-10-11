/* Materi & pembahasan bertahap Matematika (11 Okt 2026)
   - htmlBahas(s): pembahasan setelah menjawab (benar maupun salah). Soal yang punya s.langkah ditampilkan
     langkah demi langkah (muncul berurutan); soal lain tetap memakai s.bahas.
   - Layar "materi" (tampil("materi", idMisi)): teori singkat bergambar (MATERI[id].ringkas), contoh soal yang
     langkahnya dibuka satu per satu (MATERI[id].contoh), lalu contoh acak dari bank soal misi itu. */
"use strict";

const adaMateri = id => !!(typeof MATERI !== "undefined" && MATERI[id]);
function htmlBahas(s, kelas = "bahas") {
  if (Array.isArray(s.langkah) && s.langkah.length) return `<div class="pembahasan"><div class="pb-judul">📝 Pembahasan langkah demi langkah</div>
    <ol class="langkah">${s.langkah.map((x, i) => `<li style="animation-delay:${0.15 + i * 0.35}s">${x}</li>`).join("")}</ol></div>`;
  return s.bahas ? (kelas === "bahas" ? `<div class="bahas">${s.bahas}</div>` : `<div class="${kelas}">💡 ${s.bahas}</div>`) : "";
}

/* Kartu di jalur misi */
function kartuMateriJalur(id) {
  const mt = MATERI[id];
  return `<button class="kartu lt-kartu-jalur mt-kartu-jalur" data-ke="materi" data-arg="${id}"><span class="lt-ikon" aria-hidden="true">📖</span>
    <span class="lt-kj-isi"><b>Pelajari dulu</b><span class="ket">${mt.ringkas.length} materi singkat · ${mt.contoh.length} contoh soal langkah demi langkah</span></span>
    <span class="lt-panah" aria-hidden="true">▶️</span></button>`;
}

/* Satu contoh dengan langkah yang dibuka bertahap. data = { soal, gambar?, langkah[], jawab, kunciHtml? } */
let nomorContoh = 0;
function htmlContohBertahap(c, label) {
  const k = "ct" + (++nomorContoh);
  return `<div class="kartu mt-contoh" id="${k}" data-buka="0" data-n="${c.langkah.length}">
    <div class="mt-label">${label}</div>
    <div class="teks-soal">${c.soal}</div>${c.gambar ? `<div class="wadah-gambar">${c.gambar}</div>` : ""}${c.kunciHtml || ""}
    <ol class="langkah mt-langkah">${c.langkah.map((x, i) => `<li hidden data-i="${i}">${x}</li>`).join("")}</ol>
    <div class="mt-jawab" hidden><b>Jawaban:</b> ${c.jawab}</div>
    <div class="mt-aksi"><button type="button" class="tbl tbl-biru" data-langkah>Lihat langkah 1 ▶</button><button type="button" class="tbl tbl-putih tbl-kecil" data-semua>Tampilkan semua</button></div></div>`;
}
function pasangContohBertahap(wadah) {
  wadah.addEventListener("click", e => {
    const b = e.target.closest("[data-langkah],[data-semua]"); if (!b) return; const kt = b.closest(".mt-contoh"); bunyi.klik();
    const n = +kt.dataset.n, sampai = b.hasAttribute("data-semua") ? n : +kt.dataset.buka + 1;
    kt.querySelectorAll(".mt-langkah li").forEach((li, i) => { if (i < sampai && li.hidden) { li.hidden = false; li.classList.add("muncul"); } });
    kt.dataset.buka = sampai;
    const tbl = kt.querySelector("[data-langkah]");
    if (sampai >= n) { kt.querySelector(".mt-jawab").hidden = false; kt.querySelector(".mt-aksi").hidden = true; bunyi.benar(); }
    else tbl.textContent = `Lihat langkah ${sampai + 1} ▶`;
    kt.querySelector(`.mt-langkah li[data-i="${sampai - 1}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
}
/* Contoh acak dari bank soal (level 2–6) beserta kuncinya */
function contohAcak(id) {
  const L = acak(2, 6), s = buatSoal(id, L, null);
  const opsi = s.bentuk === "pg" || s.bentuk === "pgk" ? `<ol class="contoh-opsi" type="A">${s.opsi.map(o => `<li>${o}</li>`).join("")}</ol>`
    : s.bentuk === "bs" ? `<ul class="contoh-opsi">${s.pernyataan.map(p => `<li>${p}</li>`).join("")}</ul>` : "";
  const jawab = s.bentuk === "pg" ? `${"ABCDE"[s.kunci]}. ${s.opsi[s.kunci]}` : tulisKunci(s);   // tulisKunci sudah menyertakan satuan
  const langkah = Array.isArray(s.langkah) && s.langkah.length ? s.langkah : [s.bahas || "Perhatikan kembali soalnya."];
  return { soal: (s.bacaan ? `<div class="bacaan">${s.bacaan}</div>` : "") + s.teks, gambar: s.gambar, kunciHtml: opsi, langkah, jawab, L };
}

function lMateri(id) {
  const m = cariMisi(id); if (!m || !adaMateri(id)) return tampil("beranda");
  pasangKepala("jalur", id); pasangNav("beranda");
  const mt = MATERI[id], d = dataMisi(id), L = Math.min(10, d.lv + 1);
  layar.innerHTML = `<div class="jalur-kepala"><div class="ikon-misi">${m.ikon}</div><h1>${m.judul}</h1><p class="ket">📖 Pelajari dulu, lalu coba soalnya!</p></div>
    <h2 class="judul-bagian">💡 Materi singkat</h2>
    ${mt.ringkas.map((r, i) => `<div class="kartu mt-ringkas"><h3><span class="mt-no">${i + 1}</span>${r.judul}</h3><div class="mt-isi">${r.isi}</div>${r.gambar ? `<div class="wadah-gambar mt-gambar">${r.gambar}</div>` : ""}</div>`).join("")}
    <h2 class="judul-bagian">✏️ Contoh soal &amp; pembahasan</h2>
    <p class="ket">Coba pikirkan dulu jawabannya, lalu buka langkahnya satu per satu.</p>
    <div id="mt-contoh">${mt.contoh.map((c, i) => htmlContohBertahap(c, `Contoh ${i + 1}`)).join("")}</div>
    <h2 class="judul-bagian">🎲 Latihan contoh dari bank soal</h2>
    <div id="mt-acak"></div>
    <div class="tombol-tumpuk" style="margin:8px 0 24px"><button class="tbl tbl-putih" id="mt-acak-lagi">🎲 Contoh soal lain</button>
      <button class="tbl tbl-utama" id="mt-mulai">${misiSelesai(id) ? "Ke jalur level 🏆" : `Mulai Level ${L} ▶`}</button></div>`;
  const acakBaru = () => { const c = contohAcak(id); layar.querySelector("#mt-acak").innerHTML = htmlContohBertahap(c, `Contoh acak · Level ${c.L}`); };
  acakBaru();
  pasangContohBertahap(layar.querySelector("#mt-contoh")); pasangContohBertahap(layar.querySelector("#mt-acak"));
  layar.querySelector("#mt-acak-lagi").addEventListener("click", () => { bunyi.klik(); acakBaru(); layar.querySelector("#mt-acak").scrollIntoView({ block: "start", behavior: "smooth" }); });
  layar.querySelector("#mt-mulai").addEventListener("click", () => { bunyi.klik(); misiSelesai(id) || level1Terkunci(id) ? tampil("jalur", id) : mulaiLevel(id, L); });
}
