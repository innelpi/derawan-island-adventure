
# Derawan Hero — MVP Stage 1: Pantai Derawan

Game edukasi pixel art bertema konservasi laut Pulau Derawan untuk anak SD. MVP ini fokus ke **Stage 1 (Pantai Derawan)** dengan gameplay yang sengaja disederhanakan — anak tinggal gerak & tap/pencet untuk bersihin sampah dan kalahin boss Litter King. Stage 2 (Kakaban) & Stage 3 (Maratua) menyusul setelah Stage 1 ke-polish.

## Yang akan dibangun

### 1. Halaman Title Screen
- Judul besar **"DERAWAN HERO"** dengan style pixel chibi warna cerah
- Background pantai pixel: pasir, ombak biru, langit, pohon kelapa
- Tombol **BERMAIN** dan **PENGATURAN** (sound on/off, kontrol)
- Karakter utama (anak chibi pakai topi pantai) dadah-dadah sebagai animasi sambutan

### 2. Cutscene Awal (komik 2 panel)
- **Panel 1:** Karakter sampai di dermaga Derawan bawa koper, ekspresi senang
- **Panel 2:** Langit menggelap, energi gelap muncul muntahin monster sampah ke pantai
- Kotak dialog di bawah + tombol **[Skip]** dan **[Lanjut]**
- Dialog: *"Akhirnya liburan ke Derawan! Eh… energi gelap apa itu? Aku harus hentikan mereka sebelum pantainya hancur!"*

### 3. Gameplay Stage 1 — Pantai Derawan (disederhanain)
**Mekanik super simpel (cocok SD kelas 1–6):**
- **Gerak:** WASD/panah (desktop) atau joystick virtual (mobile)
- **Serang:** 1 tombol (Spasi/klik di desktop, tombol besar di mobile) — sekali pencet = serang ke arah hadap karakter
- **Special "Clean Wave":** isi otomatis tiap kalahin musuh, sekali penuh bisa dipakai untuk sapu semua musuh di layar (tombol khusus muncul kalau gauge full)
- ❌ Tidak ada light/heavy/combo/dodge — terlalu ribet untuk anak SD

**Musuh:**
- **Trash Goblin** (gerak lambat, 1× pukul mati) — dari sampah botol
- **Bottle Beast** (lebih cepat, 2× pukul mati) — dari kaleng & sedotan
- Musuh muncul bertahap dalam **3 wave**, makin banyak tiap wave

**UI di layar:**
- Kiri atas: Health Bar karakter (3 hati ❤️❤️❤️)
- Tengah atas: **Pollution Meter** (hijau → kuning → merah). Naik kalau musuh kelamaan dibiarin. Kalau penuh = game over
- Kanan bawah: tombol Serang + tombol Special (kalau penuh)
- Kiri bawah: joystick virtual (mobile only)

**Boss Fight — Litter King:**
- Muncul setelah wave 3 selesai, layar bergetar
- Boss besar dari tumpukan jaring + botol, lempar proyektil sampah
- HP bar besar di bawah dengan tulisan **"LITTER KING"**
- Karakter harus gerak hindarin proyektil + serang pas ada celah
- Kalahin pakai serangan biasa + Special "Clean Wave"

### 4. Layar Kemenangan & Edukasi
- Animasi Litter King meledak jadi gelembung, langit cerah, laut biru
- Pop-up besar: **"STAGE CLEAR: PANTAI KEMBALI BERSIH!"**
- **Pesan edukasi** (bahasa anak SD): *"Pahlawan! Sampah kecil maupun besar sama bahayanya. Kalau terbawa ombak, butuh ratusan tahun untuk hancur dan bisa meracuni laut kita!"*
- **Reward Box:** ikon "Pecahan Kristal Terumbu" + tulisan *"Berguna untuk perjalanan ke Kakaban nanti!"*
- Tombol **Main Lagi** dan **Kembali ke Menu**

### 5. Layar Game Over
- Kalau HP habis atau Pollution Meter penuh
- Pesan ramah: *"Yah, pantainya belum bersih. Coba lagi ya, Pahlawan!"*
- Tombol **Coba Lagi** dan **Menu**

## Gaya Visual
- **Pixel art chibi** warna cerah & lucu (bukan 8-bit jadul yang serem)
- Palet: biru laut cerah, pasir krem, hijau kelapa, monster sampah warna gelap tapi tetap lucu (mata besar, ekspresi "nakal" bukan "horor")
- Font pixel yang masih kebaca jelas untuk anak
- Animasi: sprite walk, attack, dan idle sederhana (2–4 frame)

## Kontrol Responsif
- **Desktop:** WASD/panah gerak, Spasi serang, E special
- **Mobile/tablet:** joystick virtual kiri bawah, tombol serang & special kanan bawah
- Auto-detect device, layout UI nyesuain

## Catatan Teknis (untuk yang penasaran)
- React + Canvas/HTML game loop sederhana (tanpa engine berat)
- Sprite pixel digambar via Canvas 2D, scaling crisp (image-rendering: pixelated)
- State stage di-manage via React state; loop game pakai requestAnimationFrame
- Asset pixel digenerate sebagai SVG/PNG sederhana dulu — bisa diganti dengan asset custom belakangan
- Tidak butuh backend/database untuk MVP (skor & progres disimpan di localStorage)

## Yang BELUM dibangun di MVP ini
- Stage 2 (Danau Kakaban + Oil Kraken)
- Stage 3 (Maratua + Iron Leviathan)
- Sistem save progres antar-stage
- Background music & sound effect (bisa ditambah setelah gameplay solid)
- Leaderboard / multi-pemain

Ketiga hal ini bakal aku tambahin di iterasi berikutnya setelah Stage 1 jalan mulus dan kamu udah test sendiri rasanya.
