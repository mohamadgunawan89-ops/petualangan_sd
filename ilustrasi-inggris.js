/* Ilustrasi Bahasa Inggris (12 Okt 2026) — DISALIN dari English Reading (app.js "Ilustrasi level", 10 Okt 2026)
   Level kosakata dengan `ilustrasi` (soal/inggris-data.js) mendapat gambar bantu interaktif di layar Dengar & Baca:
   jam, pekan, kalender, toko (belanja), tubuh, kisi ikon, denah rumah, preposisi, warna, pohon keluarga, peta.
   Ketuk bagian gambar: kalimatnya tampil di kotak .ilus-ucap dan dibacakan (ucapEN, kecepatan dari layar).
   Perbedaan dari aslinya: $ dicari di dalam wadah ilustrasi, ucapLatih → ucapEN, ordinalKata → urutanKata.
   Dipakai latih-inggris.js lewat ILUS_EN.html(lv) dan ILUS_EN.pasang(lv, wadah). */
"use strict";

const ILUS_EN = (() => {
  let akar = null; const $ = q => akar && akar.querySelector(q);
  const ucapLatih = teks => ucapEN(teks, lajuEN());
  const ordinalKata = urutanKata;

  // ---------- Jam ----------
  const KATA_MENIT = { 5: "five", 10: "ten", 15: "a quarter", 20: "twenty", 25: "twenty-five" };
  const LABEL_MENIT = { 0: "o'clock", 30: "half past", 15: "quarter past", 45: "quarter to" };
  const labelMenit = m => LABEL_MENIT[m] || (m < 30 ? `${KATA_MENIT[m]} past` : `${KATA_MENIT[60 - m]} to`);
  const NAMA_JAM = SATUAN.slice(0, 13);
  function kalimatJam(h, m) {
    const j = NAMA_JAM[h], b = NAMA_JAM[h % 12 + 1];
    if (m === 0) return `It's ${j} o'clock.`;
    if (m === 30) return `It's half past ${j}.`;
    return m < 30 ? `It's ${KATA_MENIT[m]} past ${j}.` : `It's ${KATA_MENIT[60 - m]} to ${b}.`;
  }
  const digitalJam = (h, m) => `${h}:${String(m).padStart(2, "0")}`;
  function htmlJam() {
    const cx = 260, cy = 190, R = 105;
    const titik = (r, m) => [cx + r * Math.sin(m * Math.PI / 30), cy - r * Math.cos(m * Math.PI / 30)];
    let svg = `<circle class="jam-muka" cx="${cx}" cy="${cy}" r="${R}"/>
      <path class="jam-past" d="M${cx} ${cy - R} A${R} ${R} 0 0 1 ${cx} ${cy + R} Z"/>
      <path class="jam-to" d="M${cx} ${cy + R} A${R} ${R} 0 0 1 ${cx} ${cy - R} Z"/>
      <circle class="jam-bingkai" cx="${cx}" cy="${cy}" r="${R}"/>`;
    for (let i = 0; i < 60; i++) {
      const [x1, y1] = titik(R - (i % 5 ? 5 : 10), i), [x2, y2] = titik(R - 1, i);
      svg += `<line class="jam-garis${i % 5 ? "" : " tebal"}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }
    for (let h = 1; h <= 12; h++) { const [x, y] = titik(R - 24, h * 5); svg += `<text class="jam-angka" x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}">${h}</text>`; }
    for (let m = 0; m < 60; m += 5) {
      const [x, y] = titik(R + 22, m), jangkar = m === 0 || m === 30 ? "middle" : m < 30 ? "start" : "end", geser = m === 0 ? -6 : m === 30 ? 14 : 5, [hx, hy] = titik(R - 1, m);
      svg += `<g class="jam-pilih" data-m="${m}" role="button" tabindex="0" aria-label="${labelMenit(m)}">
        <circle class="jam-sentuh" cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="13"/>
        <text class="jam-label ${m === 0 ? "" : m <= 30 ? "l-past" : "l-to"}" x="${x.toFixed(1)}" y="${(y + geser).toFixed(1)}" text-anchor="${jangkar}">${labelMenit(m)}</text></g>`;
    }
    svg += `<line class="jam-jarum-jam" id="jarum-jam" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 55}"/>
      <line class="jam-jarum-menit" id="jarum-menit" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 88}"/><circle class="jam-poros" cx="${cx}" cy="${cy}" r="5"/>`;
    return `<section class="kartu ilustrasi" id="ilustrasi-jam">
      <h2>🕒 Cara membaca jam</h2>
      <p class="ilus-ket"><span class="ket-past">past = lewat</span> (menit 1–30, sisi kanan, jam yang sekarang) ·
        <span class="ket-to">to = kurang</span> (menit 31–59, sisi kiri, jam <b>berikutnya</b>) · quarter = 15 menit · half = 30 menit.</p>
      <svg class="jam-svg" viewBox="40 40 452 306" role="img" aria-label="Muka jam dengan sebutan tiap lima menit">${svg}</svg>
      <div class="jam-sekarang"><b id="jam-digital"></b> <span id="jam-kalimat"></span>
        <button class="tbl tbl-putih tbl-kecil" id="jam-putar" aria-label="Dengarkan">🔊</button></div>
      <div class="jam-atur">Contoh untuk jam <button class="tbl tbl-putih tbl-kecil" id="jam-kurang" aria-label="Jam sebelumnya">◀</button>
        <b id="jam-pilihan"></b> <button class="tbl tbl-putih tbl-kecil" id="jam-tambah" aria-label="Jam berikutnya">▶</button></div>
      <div class="jam-contoh" id="jam-contoh"></div>
      <p class="ilus-ket">Ketuk sebutan di sekeliling jam atau salah satu contoh: jarumnya bergerak dan kalimatnya dibacakan.</p></section>`;
  }
  function pasangJam(el) {
    const st = { h: 2, m: 0 };
    const tampilJam = bicara => {
      $("#jarum-menit").style.transform = `rotate(${st.m * 6}deg)`;
      $("#jarum-jam").style.transform = `rotate(${(st.h % 12) * 30 + st.m / 2}deg)`;
      $("#jam-digital").textContent = digitalJam(st.h, st.m); $("#jam-kalimat").textContent = kalimatJam(st.h, st.m); $("#jam-pilihan").textContent = st.h;
      el.querySelectorAll(".jam-pilih").forEach(g => g.classList.toggle("aktif", +g.dataset.m === st.m));
      el.querySelectorAll(".jam-baris").forEach(x => x.classList.toggle("aktif", +x.dataset.m === st.m));
      if (bicara) ucapLatih(kalimatJam(st.h, st.m));
    };
    const isiContoh = () => { $("#jam-contoh").innerHTML = Array.from({ length: 12 }, (_, i) => i * 5).map(m =>
      `<button class="jam-baris" data-m="${m}"><b>${digitalJam(st.h, m)}</b> <span>${esc(kalimatJam(st.h, m))}</span></button>`).join(""); };
    const pilihM = m => { st.m = m; tampilJam(true); };
    el.onclick = e => { const p = e.target.closest("[data-m]"); if (p) { pilihM(+p.dataset.m); return; }
      if (e.target.closest("#jam-putar")) tampilJam(true);
      else if (e.target.closest("#jam-kurang") || e.target.closest("#jam-tambah")) { st.h = (st.h + (e.target.closest("#jam-tambah") ? 0 : 10)) % 12 + 1; isiContoh(); tampilJam(false); } };
    el.onkeydown = e => { const p = e.target.closest(".jam-pilih"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); pilihM(+p.dataset.m); } };
    isiContoh(); tampilJam(false);
  }

  // ---------- Ilustrasi lain ----------
  const kataDi = b => b.kosakata.map(k => k[0]);
  const entri = (b, w) => b.kosakata.find(k => k[0] === w);
  const tulisAngka = n => angkaKata(n).replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety) (one|two|three|four|five|six|seven|eight|nine)\b/g, "$1-$2");
  const tulisOrdinal = n => ordinalKata(n).replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety) (\w+)$/, "$1-$2");
  const rpTulis = n => "Rp" + n.toLocaleString("id-ID");
  function ucapIlus(teks, arti) {
    const el = $("#ilus-ucap");
    if (el) { el.classList.remove("kosong"); el.innerHTML = `${esc(teks)}${arti ? ` <small>(${esc(arti)})</small>` : ""}`; }
    ucapLatih(teks);
  }
  const tandaiIlus = (wadah, el) => { wadah.querySelectorAll(".aktif").forEach(x => x.classList.remove("aktif")); if (el) el.classList.add("aktif"); };
  function ketukSvg(svg, sel, fn) {
    svg.onclick = e => { const g = e.target.closest(sel); if (g) fn(g); };
    svg.onkeydown = e => { const g = e.target.closest(sel); if (g && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); fn(g); } };
  }
  const HARI_EN = [["Monday", "Senin"], ["Tuesday", "Selasa"], ["Wednesday", "Rabu"], ["Thursday", "Kamis"], ["Friday", "Jumat"], ["Saturday", "Sabtu"], ["Sunday", "Minggu"]];
  const BULAN_ID = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const BULAN_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const HARI_BESAR = { "0-1": "New Year", "3-21": "Kartini Day", "4-1": "Labour Day", "5-1": "Pancasila Day", "7-17": "Independence Day",
    "9-28": "Youth Pledge Day", "10-25": "Teachers' Day", "11-25": "Christmas" };

  const ILUS = {
    pekan: {
      judul: "📅 Hari dalam sepekan",
      html: () => `<div class="il-pekan" id="il-pekan"></div>
        <p class="ilus-ket">Hari ini ditandai emas. Sabtu–Minggu (hijau) = <b>weekend</b>; Senin–Jumat = <b>weekday</b>.</p>`,
      pasang() {
        const w = $("#il-pekan"), ini = (new Date().getDay() + 6) % 7;
        const rel = i => (i === ini ? "today" : i === (ini + 6) % 7 ? "yesterday" : i === (ini + 1) % 7 ? "tomorrow" : "");
        w.innerHTML = HARI_EN.map(([en, id], i) => `<button class="il-hari${i >= 5 ? " libur" : ""}${i === ini ? " ini" : ""}" data-i="${i}">
          <span class="il-tanda">${rel(i)}</span><b>${en.slice(0, 3)}</b><small>${id}</small></button>`).join("");
        w.onclick = e => { const t = e.target.closest(".il-hari"); if (!t) return;
          const i = +t.dataset.i, en = HARI_EN[i][0], r = rel(i); tandaiIlus(w, t);
          ucapIlus((r === "today" ? `Today is ${en}.` : r === "yesterday" ? `Yesterday was ${en}.` : r === "tomorrow" ? `Tomorrow is ${en}.`
            : `${en} is the ${ordinalKata(i + 1)} day of the week.`) + (i >= 5 ? " It is the weekend." : ""), HARI_EN[i][1]); };
      }
    },
    kalender: {
      judul: "🗓️ Kalender",
      html: () => `<div class="il-pita" id="il-pita"></div><div class="il-kal" id="il-kal"></div>
        <p class="ilus-ket">Ketuk bulan atau tanggal. Tanggal dibaca dengan bilangan bertingkat: <b>the seventeenth of August</b>. Tanggal bertanda merah muda = hari besar.</p>`,
      pasang() {
        const kini = new Date(), th = kini.getFullYear(); let bln = kini.getMonth();
        const pita = $("#il-pita"), kal = $("#il-kal");
        const gambar = () => {
          pita.innerHTML = BULAN_EN.map((en, i) => `<button data-b="${i}" class="${i === bln ? "aktif" : ""}">${en.slice(0, 3)}</button>`).join("");
          const awal = (new Date(th, bln, 1).getDay() + 6) % 7, jml = new Date(th, bln + 1, 0).getDate();
          let h = HARI_EN.map(([en]) => `<span class="il-nama">${en.slice(0, 3)}</span>`).join("") + "<span></span>".repeat(awal);
          for (let d = 1; d <= jml; d++) {
            const k = [bln === kini.getMonth() && d === kini.getDate() ? "hariini" : "", (awal + d - 1) % 7 === 6 ? "minggu" : "", HARI_BESAR[bln + "-" + d] ? "besar" : ""].join(" ");
            h += `<button class="${k}" data-d="${d}">${d}</button>`;
          }
          kal.innerHTML = h;
        };
        pita.onclick = e => { const t = e.target.closest("[data-b]"); if (!t) return; bln = +t.dataset.b; gambar();
          ucapIlus(`${BULAN_EN[bln]} is the ${ordinalKata(bln + 1)} month of the year.`, BULAN_ID[bln]); };
        kal.onclick = e => { const t = e.target.closest("[data-d]"); if (!t) return;
          const d = +t.dataset.d, hari = HARI_EN[(new Date(th, bln, d).getDay() + 6) % 7][0], besar = HARI_BESAR[bln + "-" + d]; tandaiIlus(kal, t);
          ucapIlus(`It's ${hari}, the ${tulisOrdinal(d)} of ${BULAN_EN[bln]}.` + (besar ? ` It is ${besar}.` : ""), `${d} ${BULAN_ID[bln]}`); };
        gambar();
      }
    },
    belanja: {
      judul: "🛒 Toko sekolah",
      html: () => `<div class="il-toko"><div class="il-rak" id="il-rak"></div><div class="il-struk" id="il-struk"></div></div>
        <p class="ilus-ket">Ketuk barang untuk bertanya harganya dan memasukkannya ke struk, lalu bayar untuk melihat kembaliannya (<b>change</b>).</p>`,
      pasang() {
        const BARANG = [["📒", "notebook", 5000], ["✏️", "pencil", 2000], ["📏", "ruler", 3000], ["🍞", "bread", 8000],
          ["🥤", "bottle of water", 4000], ["🍦", "ice cream", 10000], ["🎒", "bag", 150000], ["👟", "pair of shoes", 250000]];
        const rak = $("#il-rak"), struk = $("#il-struk"); let isi = [];
        const total = () => isi.reduce((a, i) => a + BARANG[i][2], 0);
        rak.innerHTML = BARANG.map(([e, n, h], i) => `<button class="il-barang" data-i="${i}"><span class="il-em">${e}</span><b>${n}</b><span class="il-harga">${rpTulis(h)}</span></button>`).join("");
        const gambar = bayar => {
          struk.innerHTML = `<h4>TOKO SEKOLAH</h4>${isi.length ? isi.map(i => `<div class="il-baris"><span>${BARANG[i][1]}</span><span>${BARANG[i][2].toLocaleString("id-ID")}</span></div>`).join("") : '<div class="il-baris"><span>(kosong)</span></div>'}
            <hr><div class="il-baris"><b>TOTAL</b><b>${total().toLocaleString("id-ID")}</b></div>
            ${bayar ? `<div class="il-baris"><span>PAY</span><span>${bayar.toLocaleString("id-ID")}</span></div><div class="il-baris"><b>CHANGE</b><b>${(bayar - total()).toLocaleString("id-ID")}</b></div>` : ""}
            <div class="il-aksi">${[50000, 100000, 500000].map(v => `<button data-bayar="${v}">Pay ${rpTulis(v)}</button>`).join("")}<button data-hapus>Clear</button></div>`;
        };
        rak.onclick = e => { const t = e.target.closest(".il-barang"); if (!t) return; const [, n, h] = BARANG[+t.dataset.i];
          isi.push(+t.dataset.i); gambar(); ucapIlus(`How much is the ${n}? It costs ${tulisAngka(h)} rupiah.`, rpTulis(h)); };
        struk.onclick = e => {
          if (e.target.closest("[data-hapus]")) { isi = []; gambar(); return; }
          const t = e.target.closest("[data-bayar]"); if (!t) return; const tot = total(), bayar = +t.dataset.bayar;
          if (!tot) { ucapIlus("Please choose something to buy first.", "pilih barang dulu"); return; }
          if (bayar < tot) { gambar(); ucapIlus(`Sorry, the total is ${tulisAngka(tot)} rupiah. ${besar1(tulisAngka(bayar))} rupiah is not enough.`, "uangnya kurang"); return; }
          gambar(bayar); ucapIlus(`The total is ${tulisAngka(tot)} rupiah. Here is your change: ${tulisAngka(bayar - tot)} rupiah.`, `kembalian ${rpTulis(bayar - tot)}`);
        };
        gambar();
      }
    },
    tubuh: {
      judul: "🧍 Anggota tubuh",
      LABEL: [["head", 200, 30, 330, 22, "end"], ["eye", 212, 55, 330, 52, "end"], ["nose", 199, 66, 330, 80, "end"], ["mouth", 205, 79, 330, 108, "end"],
        ["stomach", 215, 160, 330, 160, "end"], ["foot", 230, 268, 330, 276, "end"], ["ear", 166, 60, 70, 52, "start"], ["arm", 152, 148, 70, 128, "start"],
        ["hand", 132, 192, 70, 200, "start"], ["leg", 178, 232, 70, 244, "start"]],
      html(b) {
        const ada = kataDi(b);
        return `<svg class="il-svg" viewBox="0 0 400 290" id="il-tubuh" role="img" aria-label="Gambar tubuh dengan label">
          <rect class="il-baju" x="168" y="102" width="64" height="88" rx="16"/>
          <path class="il-kulit" d="M170 112 L132 178 L142 184 L178 124 Z"/><path class="il-kulit" d="M230 112 L268 178 L258 184 L222 124 Z"/>
          <circle class="il-kulit" cx="136" cy="188" r="11"/><circle class="il-kulit" cx="264" cy="188" r="11"/>
          <rect class="il-celana" x="172" y="186" width="24" height="76" rx="8"/><rect class="il-celana" x="204" y="186" width="24" height="76" rx="8"/>
          <ellipse class="il-tinta" cx="180" cy="268" rx="18" ry="8"/><ellipse class="il-tinta" cx="220" cy="268" rx="18" ry="8"/>
          <rect class="il-kulit" x="190" y="88" width="20" height="18" rx="4"/>
          <ellipse class="il-kulit" cx="168" cy="58" rx="7" ry="11"/><ellipse class="il-kulit" cx="232" cy="58" rx="7" ry="11"/>
          <circle class="il-kulit" cx="200" cy="56" r="33"/>
          <path class="il-tinta" d="M168 46 Q200 8 232 46 Q216 30 200 32 Q184 30 168 46 Z"/>
          <circle class="il-tinta" cx="188" cy="55" r="3.5"/><circle class="il-tinta" cx="212" cy="55" r="3.5"/>
          <path class="il-garis" d="M200 58 L196 68 L202 69"/><path class="il-garis" d="M189 76 Q200 84 211 76"/>
          ${this.LABEL.filter(l => ada.includes(l[0])).map(([k, x, y, lx, ly, r]) => `<g class="il-ketuk" data-k="${esc(k)}" tabindex="0" role="button" aria-label="${esc(k)}">
            <line class="il-garis-label" x1="${x}" y1="${y}" x2="${r === "end" ? lx - 46 : lx + 40}" y2="${ly - 5}"/>
            <circle class="il-titik" cx="${x}" cy="${y}" r="4"/>
            <text class="il-label" x="${r === "end" ? lx + 54 : lx - 52}" y="${ly}" text-anchor="${r}">${esc(k)}</text></g>`).join("")}</svg>`;
      },
      pasang(b) { const s = $("#il-tubuh"); ketukSvg(s, ".il-ketuk", g => { const k = entri(b, g.dataset.k); tandaiIlus(s, g); ucapIlus(`This is my ${k[0]}.`, k[1]); }); }
    },
    kisi: {
      judul: "👆 Ketuk gambarnya",
      html: b => `<div class="il-kisi" id="il-kisi">${b.kosakata.filter(k => (b.ikon || {})[k[0]]).map(k =>
        `<button class="il-ikon" data-k="${esc(k[0])}"><span class="il-em" aria-hidden="true">${b.ikon[k[0]]}</span><b>${esc(k[0])}</b></button>`).join("")}</div>
        ${b.catatanIlus ? `<p class="ilus-ket">${esc(b.catatanIlus)}</p>` : ""}`,
      pasang(b) { const w = $("#il-kisi"); w.onclick = e => { const t = e.target.closest(".il-ikon"); if (!t) return; const k = entri(b, t.dataset.k); tandaiIlus(w, t); ucapIlus(k[2], `${k[0]} = ${k[1]}`); }; }
    },
    denah: {
      judul: "🏠 Denah rumah",
      RUANG: { "garden": [10, 10, 80, 240, "🌳"], "terrace": [90, 10, 90, 70, "🪑"], "study room": [90, 80, 90, 90, "📚"], "bedroom": [90, 170, 90, 80, "🛏️"],
        "living room": [180, 10, 130, 110, "🛋️"], "dining room": [180, 120, 130, 70, "🍽️"], "kitchen": [180, 190, 70, 60, "🍳"], "bathroom": [250, 190, 60, 60, "🛁"],
        "garage": [310, 10, 80, 110, "🚗"], "prayer room": [310, 120, 80, 130, "🕌"] },
      html(b) {
        return `<svg class="il-svg" viewBox="0 0 400 260" id="il-denah" role="img" aria-label="Denah rumah">${kataDi(b).filter(k => this.RUANG[k]).map(k => { const [x, y, w, h, e] = this.RUANG[k];
          return `<g class="il-ruang il-ketuk" data-k="${esc(k)}" tabindex="0" role="button" aria-label="${esc(k)}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/>
            <text class="il-em-svg" x="${x + w / 2}" y="${y + h / 2 + 2}" text-anchor="middle">${e}</text>
            <text class="il-label kecil" x="${x + w / 2}" y="${y + h / 2 + 22}" text-anchor="middle">${esc(k)}</text></g>`; }).join("")}</svg>`;
      },
      pasang(b) { const s = $("#il-denah"); ketukSvg(s, ".il-ruang", g => { const k = entri(b, g.dataset.k); tandaiIlus(s, g); ucapIlus(`This is the ${k[0]}. ${k[2]}`, k[1]); }); }
    },
    preposisi: {
      judul: "📦 Di mana bolanya?",
      POS: { "in": [214, 104, 18], "on": [214, 62, 22], "under": [200, 190, 22], "next to": [320, 168, 22], "behind": [238, 78, 22], "in front of": [200, 192, 26], "between": [214, 168, 22] },
      html(b) {
        const kotak = id => `<g id="${id}"><path class="il-kotak-atas" d="M150 110 L180 85 L280 85 L250 110 Z"/><path class="il-kotak-dalam" d="M160 106 L183 89 L270 89 L247 106 Z"/>
          <path class="il-kotak" d="M250 110 L280 85 L280 165 L250 190 Z"/><rect class="il-kotak" x="150" y="110" width="100" height="80"/></g>`;
        return `<div class="il-pilih" id="il-prep">${kataDi(b).filter(k => this.POS[k]).map(k => `<button data-k="${esc(k)}">${esc(k)}</button>`).join("")}</div>
          <svg class="il-svg" viewBox="0 0 400 220" id="il-prep-svg" role="img" aria-label="Bola dan kotak">
            <line class="il-lantai" x1="10" y1="212" x2="390" y2="212"/><g id="il-blk"></g>${kotak("il-k1")}<g id="il-k2wadah" style="display:none">${kotak("il-k2")}</g>
            <g id="il-dpn"><circle class="il-bola" id="il-bola" cx="0" cy="0" r="22" style="transform: translate(320px, 168px)"/></g><g id="il-tutup"></g></svg>`;
      },
      pasang(b) {
        const P = this.POS, w = $("#il-prep"), bola = $("#il-bola");
        w.onclick = e => {
          const t = e.target.closest("[data-k]"); if (!t) return;
          const k = t.dataset.k, [x, y, r] = P[k], dua = k === "between";
          $("#il-k1").setAttribute("transform", dua ? "translate(-95 0)" : ""); $("#il-k2wadah").style.display = dua ? "" : "none"; $("#il-k2").setAttribute("transform", "translate(95 0)");
          bola.style.display = k === "under" ? "none" : ""; bola.setAttribute("r", r);
          $(k === "behind" ? "#il-blk" : "#il-dpn").appendChild(bola); bola.style.transform = `translate(${x}px, ${y}px)`;
          $("#il-tutup").innerHTML = k === "in" ? '<rect class="il-kotak" x="150" y="110" width="100" height="80"/>' : "";   // bola tampak di dalam kotak
          tandaiIlus(w, t);
          const kal = k === "between" ? "The ball is between the boxes." : `The ball is ${k} the box.`;
          ucapIlus(kal + (k === "under" ? " We cannot see it." : ""), entri(b, k)[1]);
        };
      }
    },
    warna: {
      judul: "🎨 Palet warna",
      WARNA: { red: ["#E53935", "🍎"], blue: ["#1E73D8", "🌊"], green: ["#2E9E5B", "🍃"], yellow: ["#F7C51E", "🍌"], black: ["#1B1B1B", "🐈‍⬛"], white: ["#FFFFFF", "🥛"],
        orange: ["#F57C1F", "🍊"], purple: ["#8E44AD", "🍇"], brown: ["#8D5524", "🍫"], pink: ["#F48FB1", "🌸"] },
      html(b) { return `<div class="il-palet" id="il-palet">${kataDi(b).filter(k => this.WARNA[k]).map(k => `<button class="il-warna" data-k="${k}"><i style="background:${this.WARNA[k][0]}"></i><b>${k} ${this.WARNA[k][1]}</b></button>`).join("")}</div>`; },
      pasang(b) { const w = $("#il-palet"); w.onclick = e => { const t = e.target.closest(".il-warna"); if (!t) return; const k = entri(b, t.dataset.k); tandaiIlus(w, t); ucapIlus(`This is ${k[0]}. ${k[2]}`, k[1]); }; }
    },
    keluarga: {
      judul: "👪 Pohon keluarga",
      ORANG: [["grandfather", 190, 34, "👴"], ["grandmother", 300, 34, "👵"], ["father", 70, 130, "👨"], ["mother", 165, 130, "👩"], ["uncle", 335, 130, "🧔"], ["aunt", 430, 130, "👩‍🦱"],
        ["brother", 50, 228, "👦"], ["me", 145, 228, "🧑"], ["sister", 240, 228, "👧"], ["son", 335, 228, "👦"], ["daughter", 430, 228, "👧"]],
      html() {
        return `<svg class="il-svg" viewBox="0 0 480 262" id="il-pohon" role="img" aria-label="Pohon keluarga">
          <path class="il-garis-kel" d="M233 34 H257 M113 130 H122 M378 130 H387 M245 34 V84 H70 V104 M245 84 H335 V104 M117 130 V178 H50 V202 M117 178 H240 V202 M145 178 V202 M382 130 V178 H335 V202 M382 178 H430 V202"/>
          ${this.ORANG.map(([n, x, y, e]) => `<g class="il-orang il-ketuk${n === "me" ? " aku" : ""}" data-k="${n}" tabindex="0" role="button" aria-label="${n}">
            <rect x="${x - 43}" y="${y - 26}" width="86" height="56" rx="12"/><text class="il-em-svg" x="${x}" y="${y + 2}" text-anchor="middle">${e}</text>
            <text class="il-label kecil" x="${x}" y="${y + 22}" text-anchor="middle">${n}</text></g>`).join("")}</svg>
          <p class="ilus-ket"><b>son</b> dan <b>daughter</b> di sini adalah anak paman dan bibi (sepupu “aku”).</p>`;
      },
      pasang(b) {
        const s = $("#il-pohon"), KAL = { me: ["This is me!", "aku"], son: ["This is my uncle's son.", "anak laki-laki paman"], daughter: ["This is my uncle's daughter.", "anak perempuan paman"] };
        ketukSvg(s, ".il-orang", g => { const n = g.dataset.k, k = entri(b, n); tandaiIlus(s, g); const [kal, arti] = KAL[n] || [`This is my ${n}.`, k ? k[1] : ""]; ucapIlus(kal, arti); });
      }
    },
    peta: {
      judul: "🗺️ Peta kecil",
      TEMPAT: [["home", 60, 200, "🏠", "", "This is my home."],
        ["school", 200, 140, "🏫", "M60 200 H200 V160", "Go straight, then turn left. The school is on your right. It is near."],
        ["mosque", 330, 225, "🕌", "M60 200 H310", "Go straight. The mosque is on your right, near the corner."],
        ["market", 270, 45, "🏪", "M60 200 H200 V70 H250", "Go straight, turn left, then turn right. The market is on your left."],
        ["hospital", 360, 130, "🏥", "M60 200 H330 V150", "Go straight, then turn left at the second corner. The hospital is on your right. It is far."],
        ["library", 120, 45, "📚", "M60 200 H200 V70 H140", "Go straight, turn left, then turn left again. The library is on your right."]],
      html() {
        return `<svg class="il-svg" viewBox="0 0 400 285" id="il-peta" role="img" aria-label="Peta kecil">
          <path class="il-jalan" d="M20 200 H380 M200 200 V70 M20 70 H380 M330 200 V70"/><path class="il-jalan-garis" d="M20 200 H380 M200 200 V70 M20 70 H380 M330 200 V70"/>
          <path class="il-rute" id="il-rute" d=""/>
          ${this.TEMPAT.map(([n, x, y, e]) => `<g class="il-tempat il-ketuk" data-k="${n}" tabindex="0" role="button" aria-label="${n}">
            <circle cx="${x}" cy="${y}" r="22"/><text class="il-em-svg" x="${x}" y="${y + 9}" text-anchor="middle">${e}</text>
            <text class="il-label kecil" x="${x}" y="${y + 38}" text-anchor="middle">${n}</text></g>`).join("")}</svg>
          <p class="ilus-ket">Ketuk tujuan untuk melihat rute dari rumah: <b>turn left</b> (belok kiri), <b>turn right</b> (belok kanan), <b>near</b> (dekat), <b>far</b> (jauh).</p>`;
      },
      pasang(b) {
        const s = $("#il-peta"), T = this.TEMPAT;
        ketukSvg(s, ".il-tempat", g => { const t = T.find(x => x[0] === g.dataset.k), k = entri(b, t[0]); $("#il-rute").setAttribute("d", t[4]); tandaiIlus(s, g); ucapIlus(t[5], k ? `ke ${k[1]}` : ""); });
      }
    },
  };

  return {
    ada: lv => !!(lv && (lv.ilustrasi === "jam" || ILUS[lv.ilustrasi])),
    html(lv) {
      if (lv.ilustrasi === "jam") return htmlJam();
      const f = ILUS[lv.ilustrasi]; if (!f) return "";
      return `<section class="kartu ilustrasi" id="ilustrasi"><h2>${f.judul}</h2>${f.html(lv)}
        <div class="ilus-ucap kosong" id="ilus-ucap">Ketuk bagian gambar untuk mendengar kalimatnya.</div></section>`;
    },
    pasang(lv, wadah) {
      akar = wadah; if (!akar) return;
      if (lv.ilustrasi === "jam") return pasangJam(akar.querySelector("#ilustrasi-jam"));
      const f = ILUS[lv.ilustrasi]; if (f && akar.querySelector("#ilustrasi")) f.pasang(lv, akar.querySelector("#ilustrasi"));
    },
  };
})();
