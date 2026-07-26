Rencana Perubahan Visual: Pixel-art → Hand-drawn Illustration
================================================================

Tujuan
------
Mengganti seluruh tampilan grafik game dari pixel-art menjadi gaya ilustrasi tangan digital (hand-drawn) yang lebih hidup, lembut, dan menarik untuk anak SD, tanpa mengubah gameplay inti, struktur stage, atau mekanik yang sudah ada.

Lingkup Kerja
-------------
Area yang akan diubah visualnya:
1. Title Screen (background, logo, karakter penyu, properti pantai, tombol menu)
2. Cutscene / Story Panels (karakter hero, penyu, monster, latar panel)
3. In-game Canvas (karakter hero, musuh, boss, latar stage, pohon kelapa, proyektil, partikel)
4. UI Overlay (HUD, popup kuis, popup edukasi, pause overlay, settings, stage select, end screen)

Yang TIDAK diubah:
- Mekanik gerak, serangan, special, HP, pollution, wave, boss
- Struktur 3 stage dan urutan cutscene
- Audio / SFX / BGM
- Sistem kuis, edukasi, leaderboard, settings

Aset yang Akan Dibuat
-----------------------
Semua aset baru digenerate via AI image generation dalam proyek ini, dengan fallback SVG sederhana jika diperlukan. Daftar aset utama:

Fase 1 — Title Screen
- `title-bg.jpg` — latar pulau Derawan (laut, pasir, langit, awan, pohon kelapa)
- `title-logo.png` — logo "Derawan Heroes!" bergaya kayu/papan dengan tulisan hand-drawn
- `turtle-idle.png` — karakter penyu Tora (senyum, pipi merah, pose mengambang)
- `turtle-wave.png` — varian pose Tora sedang melambai
- `beach-bag.png` — tas jinjing bergaris biru-putih
- `sunglasses.png` — kacamata hitam pantai

Fase 2 — Cutscene
- `hero-cutscene.png` — karakter anak chibi (topi kuning, kaos merah, celana biru)
- `tora-cutscene.png` — penyu Tora dalam pose berbicara/dramatis
- `monster-shadow.png` — siluet monster sampah gelap
- `bg-panel-beach.jpg`, `bg-panel-sea.jpg`, `bg-panel-dark.jpg` — latar panel cerita

Fase 3 — In-Game Canvas
- `hero-handdrawn.png` — sprite sheet atau set pose karakter (idle, walk, attack)
- `enemy-goblin.png` — monster sampah kecil (botol/kaleng)
- `enemy-beast.png` — monster kaleng/botol besar
- `enemy-ghostnet.png` — jaring hantu
- `enemy-oilslick.png` — gumpalan oli
- `enemy-microplastic.png` — butiran microplastic hidup
- `boss-litterking.png` — boss Stage 1
- `boss-netmaster.png` — boss Stage 2
- `boss-plastictyrant.png` — boss Stage 3
- `coconut-tree.png` — pohon kelapa hand-drawn
- `bg-stage1.jpg` — pantai Derawan
- `bg-stage2.jpg` — bawah laut Danau Kakaban
- `bg-stage3.jpg` — palung laut dalam

Fase 4 — UI Overlay
- Ganti border pixel tebal dan font `Press Start 2P` menjadi komponen rounded/soft dengan font `Fredoka` + icon/ilustrasi kecil
- Ganti popup, tombol, bar HP, special gauge, pollution meter menjadi gaya kartun lembut

Tahapan Implementasi
--------------------

Fase 1: Title Screen Baru
- Generate aset latar, logo, Tora, tas, kacamata
- Rewrite `TitleScreen.tsx`:
  - Hapus referensi pixel-art lama
  - Gunakan `title-bg.jpg` sebagai full-screen background
  - Tempatkan logo di tengah atas dengan penyu Tora di samping kanan (animate float/halus)
  - Tempatkan tas & kacamata di pojok kiri bawah pasir
  - Ganti tombol BERMAIN/PENGATURAN dengan style hand-drawn: rounded, soft shadow, gradient, icon
- Update CSS: hapus animasi pixel terlalu tajam (shine-sweep, pixel border), pertahankan float/bob halus

Fase 2: Cutscene Baru
- Generate aset karakter hero, Tora, monster, latar panel
- Rewrite `Cutscene.tsx`:
  - Ganti SVG `PixelHero`, `PixelTurtle`, `PixelMonster` dengan gambar PNG
  - Gunakan `bg-panel-*.jpg` sebagai latar tiap panel
  - Pertahankan dialog box, nama speaker, indikator stage, tombol SKIP/LANJUT
  - Tambahkan animasi fade/pop-in halus pada gambar karakter

Fase 3: In-Game Canvas Baru
- Modifikasi `src/game/render.ts`:
  - Ganti `drawSprite()` untuk sprite pixel menjadi `drawImage()` menggunakan PNG hand-drawn
  - Tambahkan helper `drawImageCentered()` untuk render karakter/musuh dengan posisi & flip
  - Ganti background gradient menjadi `drawImage()` dari `bg-stage*.jpg` (dengan pollution overlay tetap)
  - Ganti proyektil pixel menjadi partikel/gambar kecil
- Modifikasi `src/game/sprites.ts`:
  - Hapus atau pindahkan sprite pixel menjadi fallback
  - Buat konfigurasi `SPRITE_ASSETS` yang memetakan entity ke file PNG + ukuran tampil
- Pastikan animasi tetap bekerja: hero idle/walk/attack pakai swap gambar atau sedikit transformasi (skew/scale) kalau tidak ada sprite sheet
- Pastikan `imageSmoothingEnabled = true` untuk hasil hand-drawn yang halus

Fase 4: UI Overlay Baru
- Update komponen:
  - `Hud.tsx` — bar HP jadi hati bertumpuk, pollution meter jadi ikon gelombang/sampah, special gauge jadi bar berwarna laut
  - `QuizPopup.tsx`, `EduPopup.tsx` — card rounded, ilustrasi kecil, font besar & mudah dibaca
  - `PauseOverlay.tsx`, `SettingsScreen.tsx`, `StageSelect.tsx`, `EndScreen.tsx` — ganti pixel border menjadi soft shadow, rounded, ilustrasi icon
- Update `src/index.css`:
  - Hapus/reduce `pixel-border`, `pixel-btn`, `font-pixel` di UI
  - Pertahankan `font-pixel` hanya untuk label kecil retro (opsional) atau hapus sepenuhnya
  - Tambahkan utility animasi baru: `float-soft`, `bob`, `pop-in` tanpa efek pixel blocky

Fase 5: Integrasi & Quality Check
- Pastikan semua import PNG/PNG baru benar
- Jalankan `bun run build` untuk cek error
- Cek di desktop & mobile:
  - Title screen tidak berantakan
  - Cutscene teks masih terbaca
  - Canvas game tidak berat / frame drop
  - Tombol tetap klikable
  - Tidak ada overlap di layar kecil
- Kalau performa turun karena banyak gambar, lakukan lazy load / preloader sederhana

Keputusan Desain yang Sudah Final
----------------------------------
- Gaya: Hand-drawn illustration
- Tingkat detail: Cukup detail
- Sumber aset: Campuran (AI generate aset utama, SVG/CSS untuk elemen UI kecil)
- Font utama: `Fredoka` (sudah dipakai di project) untuk teks, dengan kemungkinan heading playful tambahan
- Color palette: Tetap warm-tropical (biru laut, kuning matahari, hijau kelapa, pasir krem) dengan sentuhan lembut hand-drawn

Risiko & Mitigasi
-----------------
- Risiko: Aset AI generate banyak membutuhkan waktu & iterasi.
  Mitigasi: Generate per fase; kalau terlalu banyak, prioritas Fase 1 & 2 dulu.
- Risiko: Gambar PNG hand-drawn di canvas bisa terlihat blur/pecah saat di-scale.
  Mitigasi: Buat ukuran dasar cukup besar (min 256px per karakter), gunakan `imageSmoothingEnabled = true`.
- Risiko: File size besar memperlambat loading.
  Mitigasi: Kompresi JPG untuk background, PNG untuk karakter transparan, gunakan Lovable Assets CDN untuk file besar.
- Risiko: Mobile layout rusak karena elemen baru beda proporsi.
  Mitigasi: Setiap fase di-test responsif sebelum lanjut.

Pertanyaan Konfirmasi sebelum Mulai
------------------------------------
1. Apakah kamu setuju dengan fase di atas, atau ingin fokus ke Title Screen + Cutscene saja dulu?
2. Untuk karakter hero di game, apakah mau satu gambar statis yang diputar/flip saja, atau lebih baik aku buat 3 pose (idle, walk, attack)?
3. Untuk musuh/boss, apakah satu gambar per musuh cukup (dengan efek getar/flash saat terkena serangan), atau perlu animasi sederhana?

Setelah kamu konfirmasi, aku mulai generate aset dan implementasi Fase 1.