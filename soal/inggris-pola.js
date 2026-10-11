/* DISALIN dari English Reading/pola.js (2026-10-11) — perakit kalimat pola (window.POLA_GEN).
   Jangan diubah di sini: ubah di English Reading lalu salin ulang. */
/* Perakit kalimat untuk Latihan bertahap level Pola kalimat.
   Tiap pola = fungsi yang merakit satu kalimat acak dari daftar subjek, kata kerja,
   keterangan, dan artinya, lalu menandai bagian yang diuji (fokus):
     { pre, kunci, post, salah: [bentuk keliru], dasar, id, alasan, alt? }
   Kalimat utuh = pre + kunci + post. salah dipakai sebagai pengecoh dan kalimat keliru;
   dasar = petunjuk saat siswa mengetik; id = arti bahasa Indonesia; alasan = aturan yang
   ditampilkan bila jawaban keliru; alt = kalimat lain yang juga tepat untuk arti yang sama
   ({ en, fokus }), dipakai di sub level Terjemahkan & ucapkan.
   Menambah variasi: tambah baris di daftar (subjek, kata kerja, keterangan). Tulis angka
   dengan huruf dan hindari singkatan bertitik. */
(function () {
  'use strict';
  const A = a => a[Math.floor(Math.random() * a.length)];
  const p = x => Math.random() < x;
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const lain = (kunci, semua) => semua.filter(x => x !== kunci);
  // Bentuk kata kerja
  const KHUSUS_S = { have: 'has', do: 'does', go: 'goes', be: 'is' };
  const bentukS = v => KHUSUS_S[v] || (/(s|sh|ch|x|o)$/.test(v) ? v + 'es' : /[^aeiou]y$/.test(v) ? v.slice(0, -1) + 'ies' : v + 's');
  const KHUSUS_ING = { swim: 'swimming', run: 'running', get: 'getting', sit: 'sitting', be: 'being' };
  const bentukIng = v => KHUSUS_ING[v] || (/[^e]e$/.test(v) ? v.slice(0, -1) + 'ing' : v + 'ing');
  const pecahFrasa = f => { const i = f.indexOf(' '); return i < 0 ? [f, ''] : [f.slice(0, i), f.slice(i + 1)]; };
  const gabung = (...x) => x.filter(Boolean).join(' ');

  // Subjek: en, be (am/is/are), ketiga (he/she/it → -s), jamak, id
  const SUBJEK = [
    { en: 'I', be: 'am', id: 'saya' },
    { en: 'you', be: 'are', id: 'kamu' },
    { en: 'we', be: 'are', jamak: true, id: 'kami' },
    { en: 'they', be: 'are', jamak: true, id: 'mereka' },
    { en: 'he', be: 'is', ketiga: true, id: 'dia (laki-laki)' },
    { en: 'she', be: 'is', ketiga: true, id: 'dia (perempuan)' },
    { en: 'Budi', be: 'is', ketiga: true, id: 'Budi' },
    { en: 'Rina', be: 'is', ketiga: true, id: 'Rina' },
    { en: 'my mother', be: 'is', ketiga: true, id: 'ibuku' },
    { en: 'my father', be: 'is', ketiga: true, id: 'ayahku' },
    { en: 'my sister', be: 'is', ketiga: true, id: 'saudara perempuanku' },
    { en: 'my friends', be: 'are', jamak: true, id: 'teman-temanku' },
    { en: 'the students', be: 'are', jamak: true, id: 'para siswa' },
    { en: 'Andi and Dina', be: 'are', jamak: true, id: 'Andi dan Dina' }
  ];
  const subjAwal = s => cap(s.en);
  const ATURAN_BE = 'I → am; you, we, they, dan subjek jamak → are; he, she, it, dan subjek tunggal → is.';
  const ATURAN_DO = 'I, you, we, they, dan subjek jamak → do; he, she, it, dan subjek tunggal → does. Kata kerja sesudahnya tetap bentuk dasar.';
  const BE = ['am', 'is', 'are'];

  // ---------- I am / You are / She is ----------
  const SIFAT = [['happy', 'senang'], ['tired', 'lelah'], ['hungry', 'lapar'], ['tall', 'tinggi'], ['busy', 'sibuk'], ['sick', 'sakit'],
    ['ready', 'siap'], ['late', 'terlambat'], ['sad', 'sedih'], ['thirsty', 'haus'], ['sleepy', 'mengantuk'], ['angry', 'marah'], ['smart', 'pintar']];
  const TEMPAT_ORANG = [['at home', 'di rumah'], ['in the library', 'di perpustakaan'], ['in the classroom', 'di kelas'], ['at school', 'di sekolah'],
    ['in the garden', 'di kebun'], ['at the market', 'di pasar'], ['in the canteen', 'di kantin']];
  const PROFESI = [['a student', 'students', 'seorang pelajar', 'pelajar'], ['a teacher', 'teachers', 'seorang guru', 'guru'],
    ['a good friend', 'good friends', 'teman yang baik', 'teman yang baik'], ['a doctor', 'doctors', 'seorang dokter', 'dokter'],
    ['a farmer', 'farmers', 'seorang petani', 'petani'], ['a nurse', 'nurses', 'seorang perawat', 'perawat']];
  const HEWAN = [{ en: 'the cat', be: 'is', id: 'kucing itu' }, { en: 'the dog', be: 'is', id: 'anjing itu' }, { en: 'the birds', be: 'are', id: 'burung-burung itu' }];
  const SIFAT_HEWAN = [['hungry', 'lapar'], ['sleepy', 'mengantuk'], ['sick', 'sakit'], ['happy', 'senang'], ['small', 'kecil'], ['very cute', 'sangat lucu']];
  const TEMPAT_HEWAN = [['under the table', 'di bawah meja'], ['in the garden', 'di kebun'], ['on the roof', 'di atas atap']];
  const WAKTU_KINI = [['today', 'hari ini'], ['now', 'sekarang']];

  function polaIAm() {
    const hewan = p(0.2);
    const s = hewan ? A(HEWAN) : A(SUBJEK);
    const jenis = A(hewan ? ['sifat', 'tempat'] : ['sifat', 'sifat', 'tempat', 'profesi']);
    let en, id, idTidak;
    if (jenis === 'sifat') { const x = A(hewan ? SIFAT_HEWAN : SIFAT); en = x[0]; id = x[1]; idTidak = 'tidak ' + x[1]; }
    else if (jenis === 'tempat') { const x = A(hewan ? TEMPAT_HEWAN : TEMPAT_ORANG); en = x[0]; id = 'ada ' + x[1]; idTidak = 'tidak ada ' + x[1]; }
    else { const x = A(PROFESI); en = s.jamak ? x[1] : x[0]; id = s.jamak ? x[3] : x[2]; idTidak = 'bukan ' + x[3]; }
    const alasan = `"${cap(s.en)}" memakai ${s.be}. ${ATURAN_BE}`;
    const r = Math.random();
    if (r < 0.2) {
      return { pre: '', kunci: cap(s.be), post: `${s.en === 'I' ? 'I' : s.en} ${en}?`, salah: lain(s.be, BE).map(cap), dasar: 'be',
        id: `Apakah ${s.id} ${id}?`, alasan };
    }
    if (r < 0.4) {
      return { pre: cap(s.en), kunci: s.be, post: `not ${en}.`, salah: lain(s.be, BE), dasar: 'be', id: cap(`${s.id} ${idTidak}.`), alasan };
    }
    const w = jenis === 'sifat' && p(0.4) ? A(WAKTU_KINI) : null;
    return { pre: cap(s.en), kunci: s.be, post: gabung(en, w && w[0]) + '.', salah: lain(s.be, BE), dasar: 'be',
      id: cap(gabung(s.id, id, w && w[1]) + '.'), alasan };
  }

  // ---------- There is / There are ----------
  const TEMPAT = {
    meja: ['on the table', 'di atas meja'], kursi: ['under the chair', 'di bawah kursi'], tas: ['in my bag', 'di dalam tasku'],
    halaman: ['in the yard', 'di halaman'], kelas: ['in my class', 'di kelasku'], kebun: ['in the garden', 'di kebun'],
    pohon: ['in the tree', 'di pohon'], kulkas: ['in the fridge', 'di dalam kulkas'], jalan: ['on the street', 'di jalan'],
    sekolah: ['in our school', 'di sekolah kami'], langit: ['in the sky', 'di langit'], dinding: ['on the wall', 'di dinding']
  };
  const BENDA = [
    { sg: ['a book', 'sebuah buku'], pl: [['two books', 'dua buku'], ['many books', 'banyak buku'], ['some books', 'beberapa buku']], t: ['meja', 'tas', 'kelas'] },
    { sg: ['a pen', 'sebuah pulpen'], pl: [['three pens', 'tiga pulpen'], ['some pens', 'beberapa pulpen']], t: ['meja', 'tas'] },
    { sg: ['a cat', 'seekor kucing'], pl: [['two cats', 'dua ekor kucing'], ['many cats', 'banyak kucing']], t: ['kursi', 'halaman', 'kebun'] },
    { sg: ['a tree', 'sebatang pohon'], pl: [['many trees', 'banyak pohon'], ['five trees', 'lima pohon']], t: ['halaman', 'kebun', 'sekolah'] },
    { sg: ['a bird', 'seekor burung'], pl: [['many birds', 'banyak burung'], ['three birds', 'tiga ekor burung']], t: ['pohon', 'langit', 'kebun'] },
    { sg: ['an apple', 'sebuah apel'], pl: [['some apples', 'beberapa apel'], ['six apples', 'enam apel']], t: ['meja', 'kulkas', 'tas'] },
    { sg: ['a new student', 'seorang siswa baru'], pl: [['thirty students', 'tiga puluh siswa'], ['many students', 'banyak siswa']], t: ['kelas', 'sekolah'] },
    { sg: ['a car', 'sebuah mobil'], pl: [['many cars', 'banyak mobil'], ['two cars', 'dua mobil']], t: ['jalan'] },
    { sg: ['a clock', 'sebuah jam dinding'], pl: [['two clocks', 'dua jam dinding']], t: ['kelas'] },
    { sg: ['a library', 'sebuah perpustakaan'], pl: [['two canteens', 'dua kantin']], t: ['sekolah'] },
    { sg: ['an egg', 'sebutir telur'], pl: [['ten eggs', 'sepuluh butir telur'], ['some eggs', 'beberapa butir telur']], t: ['kulkas'] },
    { sg: ['a big cloud', 'segumpal awan besar'], pl: [['many clouds', 'banyak awan']], t: ['langit'] },
    { sg: ['a picture', 'sebuah gambar'], pl: [['two pictures', 'dua gambar'], ['many pictures', 'banyak gambar']], t: ['dinding', 'kelas'] }
  ];
  function polaThereIs() {
    const b = A(BENDA);
    const jamak = p(0.5);
    const [en, idB] = jamak ? A(b.pl) : b.sg;
    const [tEn, tId] = TEMPAT[A(b.t)];
    const kunci = jamak ? 'are' : 'is';
    const alasan = `${jamak ? 'Lebih dari satu benda' : 'Satu benda'} → there ${kunci}. Satu benda → there is; lebih dari satu → there are.`;
    if (p(0.25)) {
      return { pre: '', kunci: cap(kunci), post: `there ${en} ${tEn}?`, salah: [cap(lain(kunci, ['is', 'are'])[0])], dasar: 'be',
        id: `Apakah ada ${idB} ${tId}?`, alasan };
    }
    return { pre: 'There', kunci, post: `${en} ${tEn}.`, salah: lain(kunci, ['is', 'are']), dasar: 'be', id: `Ada ${idB} ${tId}.`, alasan };
  }

  // ---------- Simple present (kebiasaan) ----------
  const WAKTU_RUTIN = [['every day', 'setiap hari'], ['every morning', 'setiap pagi'], ['in the evening', 'pada sore hari'],
    ['on Sunday', 'pada hari Minggu'], ['at night', 'pada malam hari'], ['every week', 'setiap minggu'], ['every afternoon', 'setiap sore']];
  const HARI_SEKOLAH = [['every day', 'setiap hari'], ['every morning', 'setiap pagi'], ['on Monday', 'pada hari Senin']];
  const KEGIATAN = [
    ['play football', 'bermain sepak bola'], ['read a book', 'membaca buku'], ['watch television', 'menonton televisi'],
    ['drink milk', 'minum susu'], ['go to school', 'pergi ke sekolah', HARI_SEKOLAH], ['study English', 'belajar bahasa Inggris'],
    ['wash the dishes', 'mencuci piring'], ['cook rice', 'memasak nasi'], ['clean the room', 'membersihkan kamar'],
    ['ride a bicycle', 'naik sepeda'], ['walk to school', 'berjalan kaki ke sekolah', HARI_SEKOLAH], ['listen to music', 'mendengarkan musik'],
    ['wake up early', 'bangun pagi-pagi', [['every day', 'setiap hari'], ['on Monday', 'pada hari Senin']]], ['take a bath', 'mandi'],
    ['help the teacher', 'membantu guru'], ['eat breakfast', 'sarapan', [['every day', 'setiap hari'], ['every morning', 'setiap pagi']]],
    ['write in a diary', 'menulis di buku harian'], ['fly a kite', 'bermain layang-layang'], ['feed the cat', 'memberi makan kucing']
  ];
  function polaPresent() {
    const s = A(SUBJEK);
    const k = A(KEGIATAN);
    const [v, obj] = pecahFrasa(k[0]);
    const [wEn, wId] = A(k[2] || WAKTU_RUTIN);
    const vs = s.ketiga ? bentukS(v) : v;
    const bantu = s.ketiga ? 'does' : 'do';
    const r = Math.random();
    if (r < 0.2) {
      return { pre: '', kunci: cap(bantu), post: `${s.en} ${gabung(v, obj, wEn)}?`, salah: [cap(lain(bantu, ['do', 'does'])[0]), s.ketiga ? 'Is' : 'Are'],
        dasar: 'do/does', id: `Apakah ${s.id} ${k[1]} ${wId}?`, alasan: `"${s.en}" → ${bantu}. ${ATURAN_DO}` };
    }
    if (r < 0.4) {
      return { pre: subjAwal(s), kunci: bantu, post: `not ${gabung(v, obj, wEn)}.`, salah: [lain(bantu, ['do', 'does'])[0], s.ketiga ? 'is' : 'are'],
        dasar: 'do/does', id: cap(`${s.id} tidak ${k[1]} ${wId}.`), alasan: `"${s.en}" → ${bantu} not. ${ATURAN_DO}` };
    }
    return { pre: subjAwal(s), kunci: vs, post: gabung(obj, wEn) + '.', salah: [...new Set([s.ketiga ? v : bentukS(v), bentukIng(v)])], dasar: v,
      id: cap(`${s.id} ${k[1]} ${wId}.`),
      alasan: s.ketiga ? `"${s.en}" adalah orang ketiga tunggal → kata kerja + s/es: ${vs}.` : `"${s.en}" → kata kerja bentuk dasar: ${v}. Hanya he, she, it, dan subjek tunggal yang ditambah s/es.` };
  }

  // ---------- want to / need to / like to ----------
  const MAU = { want: 'ingin', need: 'perlu', like: 'suka' };
  const TUJUAN = [
    ['learn English', 'belajar bahasa Inggris', ['want', 'need', 'like']], ['play football', 'bermain sepak bola', ['want', 'like']],
    ['read stories', 'membaca cerita', ['want', 'like']], ['go home', 'pulang', ['want', 'need']], ['buy a new bag', 'membeli tas baru', ['want', 'need']],
    ['eat fried rice', 'makan nasi goreng', ['want', 'like']], ['watch a movie', 'menonton film', ['want', 'like']],
    ['sing a song', 'menyanyikan lagu', ['want', 'like']], ['drink some water', 'minum air', ['want', 'need']],
    ['finish the homework', 'menyelesaikan PR', ['want', 'need']], ['sleep early', 'tidur lebih awal', ['want', 'need']],
    ['ride a bicycle', 'naik sepeda', ['want', 'like']], ['swim in the river', 'berenang di sungai', ['want', 'like']],
    ['speak English', 'berbicara bahasa Inggris', ['want', 'need', 'like']], ['visit the museum', 'mengunjungi museum', ['want', 'like']],
    ['cook noodles', 'memasak mi', ['want', 'like']], ['see a doctor', 'pergi ke dokter', ['need']], ['study hard', 'belajar dengan giat', ['need']]
  ];
  function polaWant() {
    const s = A(SUBJEK);
    const t = A(TUJUAN);
    const m = A(t[2]);
    const [v, obj] = pecahFrasa(t[0]);
    const ms = s.ketiga ? bentukS(m) : m;
    const idK = cap(`${s.id} ${MAU[m]} ${t[1]}.`);
    const aturanTo = 'Sesudah "to", kata kerja tetap bentuk dasar (tanpa s, tanpa -ing).';
    const r = Math.random();
    if (r < 0.2) {
      const bantu = s.ketiga ? 'does' : 'do';
      return { pre: `${cap(bantu)} ${s.en} ${m} to`, kunci: v, post: (obj ? obj : '') + '?', salah: [bentukS(v), bentukIng(v)], dasar: v,
        id: `Apakah ${s.id} ${MAU[m]} ${t[1]}?`, alasan: aturanTo, rapat: !obj };
    }
    if (r < 0.55) {
      return { pre: subjAwal(s), kunci: ms, post: `to ${t[0]}.`, salah: [s.ketiga ? m : bentukS(m)], dasar: m, id: idK,
        alasan: s.ketiga ? `"${s.en}" adalah orang ketiga tunggal → ${ms}.` : `"${s.en}" → ${m} (tanpa s).` };
    }
    return { pre: `${subjAwal(s)} ${ms} to`, kunci: v, post: (obj ? obj : '') + '.', salah: [bentukS(v), bentukIng(v)], dasar: v, id: idK,
      alasan: aturanTo, rapat: !obj };
  }

  // ---------- Kata tanya + do/does ----------
  const TANYA = [
    { q: 'Where', f: 'live', id: 'Di mana {s} tinggal?' }, { q: 'How', f: 'go to school', id: 'Bagaimana {s} pergi ke sekolah?' },
    { q: 'What', f: 'do after school', id: 'Apa yang {s} lakukan sepulang sekolah?' }, { q: 'When', f: 'wake up', id: 'Kapan {s} bangun tidur?' },
    { q: 'What', f: 'eat for breakfast', id: 'Apa yang {s} makan untuk sarapan?' }, { q: 'Where', f: 'study', id: 'Di mana {s} belajar?' },
    { q: 'When', f: 'go to bed', id: 'Kapan {s} tidur?' }, { q: 'What', f: 'like to read', id: 'Apa yang {s} suka baca?' },
    { q: 'Where', f: 'buy vegetables', id: 'Di mana {s} membeli sayuran?' }, { q: 'How', f: 'come home', id: 'Bagaimana {s} pulang ke rumah?' },
    { q: 'When', f: 'play football', id: 'Kapan {s} bermain sepak bola?' }, { q: 'What', f: 'want', id: 'Apa yang {s} inginkan?' },
    { q: 'Where', f: 'go on Sunday', id: 'Ke mana {s} pergi pada hari Minggu?' }, { q: 'How', f: 'make fried rice', id: 'Bagaimana {s} membuat nasi goreng?' },
    { q: 'When', f: 'wash the dishes', id: 'Kapan {s} mencuci piring?' }, { q: 'What', f: 'drink in the morning', id: 'Apa yang {s} minum di pagi hari?' }
  ];
  const SUBJEK_TANYA = [
    { en: 'you', id: 'kamu' }, { en: 'they', id: 'mereka' }, { en: 'we', id: 'kita' }, { en: 'your friends', id: 'teman-temanmu' },
    { en: 'he', ketiga: true, id: 'dia (laki-laki)' }, { en: 'she', ketiga: true, id: 'dia (perempuan)' }, { en: 'Budi', ketiga: true, id: 'Budi' },
    { en: 'your sister', ketiga: true, id: 'saudara perempuanmu' }, { en: 'your father', ketiga: true, id: 'ayahmu' }
  ];
  const KATA_TANYA = ['What', 'Where', 'When', 'How'];
  function polaTanya() {
    const t = A(TANYA);
    const s = A(SUBJEK_TANYA);
    const bantu = s.ketiga ? 'does' : 'do';
    const id = cap(t.id.replace('{s}', s.id));
    if (p(0.5)) {
      return { pre: '', kunci: t.q, post: `${bantu} ${s.en} ${t.f}?`, salah: lain(t.q, KATA_TANYA), dasar: 'kata tanya', id,
        alasan: 'Apa → What; Di mana / Ke mana → Where; Kapan → When; Bagaimana → How.' };
    }
    return { pre: t.q, kunci: bantu, post: `${s.en} ${t.f}?`, salah: [lain(bantu, ['do', 'does'])[0], s.ketiga ? 'is' : 'are'], dasar: 'do/does', id,
      alasan: `"${s.en}" → ${bantu}. ${ATURAN_DO}` };
  }

  // ---------- Simple past ----------
  // [dasar, lampau, pelengkap, arti, lampau keliru (untuk kata kerja tak beraturan)]
  const LAMPAU = [
    ['go', 'went', 'to the market', 'pergi ke pasar', 'goed'], ['eat', 'ate', 'fried rice', 'makan nasi goreng', 'eated'],
    ['visit', 'visited', 'my grandmother', 'mengunjungi nenekku'], ['watch', 'watched', 'a movie', 'menonton film'],
    ['play', 'played', 'badminton', 'bermain bulu tangkis'], ['cook', 'cooked', 'dinner', 'memasak makan malam'],
    ['buy', 'bought', 'a new book', 'membeli buku baru', 'buyed'], ['write', 'wrote', 'a letter', 'menulis surat', 'writed'],
    ['drink', 'drank', 'hot tea', 'minum teh panas', 'drinked'], ['see', 'saw', 'a rainbow', 'melihat pelangi', 'seed'],
    ['clean', 'cleaned', 'the classroom', 'membersihkan kelas'], ['study', 'studied', 'for the test', 'belajar untuk ujian'],
    ['swim', 'swam', 'in the river', 'berenang di sungai', 'swimmed'], ['make', 'made', 'a cake', 'membuat kue', 'maked'],
    ['come', 'came', 'home late', 'pulang terlambat', 'comed'], ['take', 'took', 'many photos', 'mengambil banyak foto', 'taked'],
    ['help', 'helped', 'my father', 'membantu ayahku'], ['walk', 'walked', 'to the park', 'berjalan ke taman'],
    ['get', 'got', 'a present', 'mendapat hadiah', 'getted'], ['sleep', 'slept', 'early', 'tidur lebih awal', 'sleeped'],
    ['wash', 'washed', 'the car', 'mencuci mobil'], ['bring', 'brought', 'an umbrella', 'membawa payung', 'bringed']
  ];
  const WAKTU_LALU = [['yesterday', 'kemarin'], ['last night', 'tadi malam'], ['last week', 'minggu lalu'], ['this morning', 'tadi pagi'],
    ['two days ago', 'dua hari yang lalu'], ['last Sunday', 'hari Minggu lalu']];
  function polaPast() {
    const s = A(SUBJEK);
    const [v, lalu, obj, idV, keliru] = A(LAMPAU);
    const [wEn, wId] = A(WAKTU_LALU);
    const aturanDid = 'Sesudah did / did not, kata kerja kembali ke bentuk dasar.';
    const r = Math.random();
    if (r < 0.2) {
      // Pertanyaan tentang diri sendiri ("Did I …?") janggal; pakai subjek lain.
      if (s.en === 'I' || s.en === 'we') return polaPast();
      return { pre: `Did ${s.en}`, kunci: v, post: `${gabung(obj, wEn)}?`, salah: [lalu, bentukS(v)], dasar: v,
        id: `Apakah ${s.id} ${idV} ${wId}?`, alasan: aturanDid };
    }
    if (r < 0.4) {
      return { pre: `${subjAwal(s)} did not`, kunci: v, post: `${gabung(obj, wEn)}.`, salah: [lalu, bentukS(v)], dasar: v,
        id: cap(`${s.id} tidak ${idV} ${wId}.`), alasan: aturanDid };
    }
    return { pre: subjAwal(s), kunci: lalu, post: `${gabung(obj, wEn)}.`, salah: keliru ? [v, keliru] : [v, bentukS(v)], dasar: v,
      id: cap(`${s.id} ${idV} ${wId}.`),
      alasan: keliru ? `"${v}" kata kerja tak beraturan: bentuk lampaunya ${lalu}.` : `Kata kerja beraturan: bentuk lampau = + ed (${lalu}).` };
  }

  // ---------- can / must / should ----------
  const MODAL = {
    can: { id: 'bisa', f: [['swim', 'berenang'], ['ride a bicycle', 'naik sepeda'], ['speak English', 'berbicara bahasa Inggris'], ['play the guitar', 'bermain gitar'],
      ['cook fried rice', 'memasak nasi goreng'], ['run fast', 'berlari cepat'], ['draw a cat', 'menggambar kucing'], ['climb a tree', 'memanjat pohon']] },
    must: { id: 'harus', f: [['wear a uniform on Monday', 'memakai seragam pada hari Senin'], ['wear a helmet', 'memakai helm'], ['come on time', 'datang tepat waktu'],
      ['finish the homework', 'menyelesaikan PR'], ['stop at the red light', 'berhenti di lampu merah'], ['keep the classroom clean', 'menjaga kelas tetap bersih']] },
    'must not': { id: 'tidak boleh', f: [['use phones during the test', 'menggunakan telepon selama ujian'], ['run in the classroom', 'berlari di dalam kelas'],
      ['throw rubbish in the river', 'membuang sampah ke sungai'], ['cheat on the test', 'mencontek saat ujian'], ['be late', 'terlambat']] },
    should: { id: 'sebaiknya', f: [['eat more vegetables', 'makan lebih banyak sayuran'], ['drink more water', 'minum lebih banyak air'], ['sleep early', 'tidur lebih awal'],
      ['read every day', 'membaca setiap hari'], ['see a doctor', 'pergi ke dokter'], ['protect the environment', 'menjaga lingkungan'], ['exercise every morning', 'berolahraga setiap pagi']] }
  };
  MODAL.cannot = { id: 'tidak bisa', f: MODAL.can.f };
  const NAMA_MODAL = ['can', 'cannot', 'must', 'must not', 'should'];
  function polaModal() {
    const m = A(NAMA_MODAL);
    const [fEn, fId] = A(MODAL[m].f);
    const s = A(SUBJEK);
    const [v, obj] = pecahFrasa(fEn);
    const id = cap(`${s.id} ${MODAL[m].id} ${fId}.`);
    if (p(0.5)) {
      return { pre: subjAwal(s), kunci: m, post: `${fEn}.`, salah: lain(m, NAMA_MODAL), dasar: MODAL[m].id, id,
        alasan: 'can = bisa; cannot = tidak bisa; must = harus; must not = tidak boleh; should = sebaiknya.' };
    }
    return { pre: `${subjAwal(s)} ${m}`, kunci: v, post: (obj || '') + '.', salah: [v === 'be' ? 'is' : bentukS(v), 'to ' + v], dasar: v, id,
      alasan: 'Sesudah can, must, dan should, kata kerja tetap bentuk dasar tanpa to.', rapat: !obj };
  }

  // ---------- will / be going to ----------
  const RENCANA = [
    ['visit', 'visited', 'the museum', 'mengunjungi museum'], ['buy', 'bought', 'a new bag', 'membeli tas baru'], ['play', 'played', 'football', 'bermain sepak bola'],
    ['go', 'went', 'to Bandung', 'pergi ke Bandung'], ['clean', 'cleaned', 'the room', 'membersihkan kamar'], ['cook', 'cooked', 'dinner', 'memasak makan malam'],
    ['watch', 'watched', 'the match', 'menonton pertandingan'], ['join', 'joined', 'the competition', 'mengikuti lomba'], ['help', 'helped', 'my mother', 'membantu ibuku'],
    ['study', 'studied', 'for the test', 'belajar untuk ujian'], ['call', 'called', 'my grandmother', 'menelepon nenekku'], ['write', 'wrote', 'a story', 'menulis cerita'],
    ['travel', 'traveled', 'to Bali', 'bepergian ke Bali'], ['plant', 'planted', 'some trees', 'menanam beberapa pohon']
  ];
  const WAKTU_DEPAN = [['tomorrow', 'besok'], ['next week', 'minggu depan'], ['tonight', 'nanti malam'], ['this afternoon', 'sore ini'],
    ['next Sunday', 'hari Minggu depan'], ['next year', 'tahun depan']];
  function polaFuture() {
    const s = A(SUBJEK);
    const [v, lalu, obj, idV] = A(RENCANA);
    const [wEn, wId] = A(WAKTU_DEPAN);
    const ekor = gabung(obj, wEn);
    const id = cap(`${s.id} akan ${idV} ${wId}.`);
    const kalWill = `${subjAwal(s)} will ${v} ${ekor}.`;
    const kalGoing = `${subjAwal(s)} ${s.be} going to ${v} ${ekor}.`;
    const r = Math.random();
    if (r < 0.35) {
      return { pre: `${subjAwal(s)} will`, kunci: v, post: `${ekor}.`, salah: [bentukS(v), lalu], dasar: v, id,
        alasan: 'Sesudah will, kata kerja tetap bentuk dasar.', alt: [{ en: kalGoing, fokus: v }] };
    }
    if (r < 0.7) {
      return { pre: subjAwal(s), kunci: s.be, post: `going to ${v} ${ekor}.`, salah: lain(s.be, BE), dasar: 'be', id,
        alasan: `"${s.en}" memakai ${s.be} going to. ${ATURAN_BE}`, alt: [{ en: kalWill, fokus: 'will' }] };
    }
    if (r < 0.85) {
      return { pre: `${subjAwal(s)} ${s.be} going to`, kunci: v, post: `${ekor}.`, salah: [bentukS(v), bentukIng(v)], dasar: v, id,
        alasan: 'Sesudah going to, kata kerja tetap bentuk dasar.', alt: [{ en: kalWill, fokus: v }] };
    }
    return { pre: `Will ${s.en}`, kunci: v, post: `${ekor}?`, salah: [bentukS(v), lalu], dasar: v, id: `Apakah ${s.id} akan ${idV} ${wId}?`,
      alasan: 'Sesudah will, kata kerja tetap bentuk dasar.', alt: [{ en: `${cap(s.be)} ${s.en} going to ${v} ${ekor}?`, fokus: v }] };
  }

  // ---------- Pendapat dan kata penghubung ----------
  const SEBAB = [
    ['we stayed at home', 'kami tinggal di rumah', 'it was raining', 'hujan turun'],
    ['I was late for school', 'saya terlambat ke sekolah', 'I woke up late', 'saya bangun kesiangan'],
    ['she was very happy', 'dia sangat senang', 'she got a good score', 'dia mendapat nilai bagus'],
    ['he went to the doctor', 'dia pergi ke dokter', 'he was sick', 'dia sakit'],
    ['I drank a lot of water', 'saya minum banyak air', 'I was very thirsty', 'saya sangat haus'],
    ['the students were tired', 'para siswa lelah', 'they ran around the field', 'mereka berlari mengelilingi lapangan'],
    ['we cleaned the classroom', 'kami membersihkan kelas', 'it was very dirty', 'kelasnya sangat kotor'],
    ['I could not sleep', 'saya tidak bisa tidur', 'it was very hot', 'udaranya sangat panas'],
    ['my mother bought an umbrella', 'ibuku membeli payung', 'the rainy season started', 'musim hujan dimulai'],
    ['she studied hard', 'dia belajar dengan giat', 'she wanted to pass the test', 'dia ingin lulus ujian'],
    ['the library is quiet', 'perpustakaan itu tenang', 'everyone is reading', 'semua orang sedang membaca'],
    ['I brought my jacket', 'saya membawa jaket', 'the weather was cold', 'cuacanya dingin']
  ];
  const KONTRAS = [
    ['the test was difficult', 'ujiannya sulit', 'I passed it', 'saya lulus'],
    ['it was raining', 'hujan turun', 'we still played football', 'kami tetap bermain sepak bola'],
    ['the bag is small', 'tas itu kecil', 'it is very heavy', 'tas itu sangat berat'],
    ['he was tired', 'dia lelah', 'he finished his homework', 'dia menyelesaikan PR-nya'],
    ['the food was simple', 'makanannya sederhana', 'it was delicious', 'makanan itu enak'],
    ['my house is far from school', 'rumahku jauh dari sekolah', 'I am never late', 'saya tidak pernah terlambat'],
    ['she is only ten years old', 'dia baru berumur sepuluh tahun', 'she can speak English well', 'dia bisa berbahasa Inggris dengan baik'],
    ['the movie was long', 'filmnya panjang', 'we enjoyed it', 'kami menikmatinya']
  ];
  const OPINI = [
    ['English is important', 'bahasa Inggris penting', 'it helps us talk to more people', 'bahasa Inggris membantu kita berbicara dengan lebih banyak orang'],
    ['reading every day is a good habit', 'membaca setiap hari adalah kebiasaan yang baik', 'it improves our vocabulary', 'membaca menambah kosakata kita'],
    ['students should sleep early', 'siswa sebaiknya tidur lebih awal', 'they need energy for school', 'mereka butuh tenaga untuk sekolah'],
    ['plastic bags are bad for the environment', 'kantong plastik buruk bagi lingkungan', 'they are hard to recycle', 'kantong plastik sulit didaur ulang'],
    ['sports are good for us', 'olahraga baik untuk kita', 'they keep our bodies healthy', 'olahraga menjaga tubuh kita tetap sehat'],
    ['mobile phones are useful', 'telepon genggam bermanfaat', 'we can learn many things from them', 'kita bisa belajar banyak hal darinya'],
    ['we should save water', 'kita sebaiknya menghemat air', 'clean water is limited', 'air bersih terbatas'],
    ['breakfast is important', 'sarapan itu penting', 'it gives us energy in the morning', 'sarapan memberi kita tenaga di pagi hari']
  ];
  const PEMBUKA = [['I think', 'Menurut saya'], ['I believe that', 'Saya yakin bahwa'], ['I agree that', 'Saya setuju bahwa']];
  const PENGHUBUNG = ['because', 'so', 'although', 'but'];
  const ATURAN_HUBUNG = 'because = karena (sebab); so = jadi (akibat); although = walaupun; but = tetapi.';
  const pilihHubung = (kunci, awal) => lain(kunci, PENGHUBUNG).map(x => (awal ? cap(x) : x));
  function polaOpini() {
    const r = Math.random();
    if (r < 0.3) {
      const [a, aId, b, bId] = A(SEBAB);
      return { pre: cap(a), kunci: 'because', post: `${b}.`, salah: pilihHubung('because'), dasar: 'kata penghubung',
        id: cap(`${aId} karena ${bId}.`), alasan: ATURAN_HUBUNG };
    }
    if (r < 0.55) {
      const [a, aId, b, bId] = A(SEBAB);
      return { pre: `${cap(b)},`, kunci: 'so', post: `${a}.`, salah: pilihHubung('so'), dasar: 'kata penghubung',
        id: cap(`${bId}, jadi ${aId}.`), alasan: ATURAN_HUBUNG };
    }
    if (r < 0.7) {
      const [a, aId, b, bId] = A(KONTRAS);
      return { pre: '', kunci: 'Although', post: `${a}, ${b}.`, salah: pilihHubung('although', true), dasar: 'kata penghubung',
        id: `Walaupun ${aId}, ${bId}.`, alasan: ATURAN_HUBUNG };
    }
    if (r < 0.85) {
      const [a, aId, b, bId] = A(KONTRAS);
      return { pre: `${cap(a)},`, kunci: 'but', post: `${b}.`, salah: pilihHubung('but'), dasar: 'kata penghubung',
        id: cap(`${aId}, tetapi ${bId}.`), alasan: ATURAN_HUBUNG };
    }
    const [c, cId, rs, rId] = A(OPINI);
    const [pb, pbId] = A(PEMBUKA);
    return { pre: `${pb} ${c}`, kunci: 'because', post: `${rs}.`, salah: pilihHubung('because'), dasar: 'kata penghubung',
      id: `${pbId} ${cId} karena ${rId}.`, alasan: ATURAN_HUBUNG };
  }

  window.POLA_GEN = {
    'pola-i-am': polaIAm,
    'pola-there-is': polaThereIs,
    'pola-present': polaPresent,
    'pola-want': polaWant,
    'pola-questions': polaTanya,
    'pola-past': polaPast,
    'pola-can-must': polaModal,
    'pola-future': polaFuture,
    'pola-opinion': polaOpini
  };
})();
