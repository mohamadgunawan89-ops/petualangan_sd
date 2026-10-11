// Pemeriksa pembahasan bertahap & materi Matematika.
//   node alat/cek-langkah.js            (semua pos Matematika)
//   node alat/cek-langkah.js bil        (satu pos: bil | alj | ukr | dat)
// Memeriksa: setiap soal (setiap misi × level × banyak sampel) punya `langkah` (≥ 2 butir, HTML seimbang,
// tanpa "undefined"/"NaN"), tidak galat, dan MATERI[misi] lengkap (ringkas ≥ 2, contoh ≥ 2 dengan langkah ≥ 2).
const fs = require("fs"), vm = require("vm"), path = require("path");
const R = path.join(__dirname, "..");
const BERKAS = ["inti", "bilangan", "aljabar", "ukur", "data", "materi-bil", "materi-alj", "materi-ukr", "materi-dat"]
  .map(f => path.join(R, "soal", f + ".js")).filter(f => fs.existsSync(f));
const ctx = { console, Math, window: {}, navigator: {}, document: {} }; vm.createContext(ctx);
vm.runInContext(BERKAS.map(f => fs.readFileSync(f, "utf8")).join("\n;\n") + "\n;globalThis.__ = { MISI, MATERI, buatSoal };", ctx);
const { MISI, MATERI, buatSoal } = ctx.__, pos = process.argv[2], N = +(process.argv[3] || 60);
const polos = h => String(h).replace(/<[^>]+>/g, "");
const seimbang = h => { const t = []; for (const m of String(h).matchAll(/<\/?([a-z0-9]+)[^>]*?(\/?)>/gi)) { const n = m[1].toLowerCase();
  if (m[2] === "/" || ["br", "img", "path", "rect", "circle", "line", "polygon", "polyline", "ellipse", "stop", "use"].includes(n)) continue;
  if (m[0][1] === "/") { if (t.pop() !== n) return false; } else t.push(n); } return !t.length; };
const salah = []; let n = 0;
const catat = (id, L, why, s) => { if (salah.length < 40) salah.push(`${id} L${L}: ${why}${s ? " — " + polos(s.teks).slice(0, 70) : ""}`); };
for (const m of MISI.filter(m => m.pulau === "mtk" && (!pos || m.pos === pos))) {
  for (let L = 1; L <= 10; L++) for (let i = 0; i < N; i++) {
    let s; try { s = buatSoal(m.id, L, null); } catch (e) { catat(m.id, L, "GALAT " + e.message); continue; }
    n++;
    if (!Array.isArray(s.langkah) || s.langkah.length < 2) { catat(m.id, L, "tanpa langkah (≥2)", s); continue; }
    const g = s.langkah.join(" ");
    if (/undefined|NaN|\[object/.test(g)) catat(m.id, L, "langkah memuat undefined/NaN", s);
    else if (!s.langkah.every(seimbang)) catat(m.id, L, "tag HTML langkah tidak seimbang", s);
  }
  const mt = MATERI[m.id];
  if (!mt) { salah.push(`${m.id}: MATERI belum ada`); continue; }
  if (!Array.isArray(mt.ringkas) || mt.ringkas.length < 2 || !mt.ringkas.every(x => x.judul && x.isi)) salah.push(`${m.id}: MATERI.ringkas kurang (≥2, judul & isi)`);
  if (!Array.isArray(mt.contoh) || mt.contoh.length < 2 || !mt.contoh.every(x => x.soal && x.jawab && Array.isArray(x.langkah) && x.langkah.length >= 2)) salah.push(`${m.id}: MATERI.contoh kurang (≥2, soal/langkah/jawab)`);
  const semua = JSON.stringify(mt); if (/undefined|NaN/.test(semua)) salah.push(`${m.id}: MATERI memuat undefined/NaN`);
}
console.log(`${n} soal diperiksa${pos ? " (pos " + pos + ")" : ""}. Masalah: ${salah.length ? "\n  " + salah.join("\n  ") : "tidak ada ✓"}`);
process.exit(salah.length ? 1 : 0);
