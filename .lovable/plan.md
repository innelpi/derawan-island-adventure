## Rencana: Background HD Custom + Tutorial Cara Bermain

### 1. Upload Gambar HD Background
- Kamu upload gambar HD-mu via tombol **+** (Attach) di chat. Format PNG/JPG, idealnya rasio landscape (~16:9, min 1920×1080) biar tajam di semua layar.
- Setelah upload, gambar akan disimpan ke `src/assets/title-bg-custom.png` (atau nama sesuai file-mu).

### 2. Revamp Title Screen (`src/components/game/TitleScreen.tsx`)
- Pasang gambarmu sebagai **background full-screen** (`background-size: cover`, `background-position: center`).
- **Hapus** layer berat: gradient sunset, gunung SVG, pulau pasir, palm trees, turtle Tora besar, ikan-ikan, awan.
- **Pertahankan overlay tipis** biar tetap hidup tapi tidak ramai:
  - Sparkle/partikel cahaya halus (~10 buah, opacity rendah)
  - 1 layer wave SVG transparan di bawah (opacity ~25%)
  - Dark vignette tipis di bawah biar teks judul kontras
- Judul "DERAWAN HERO" + 2 tombol (Bermain, Pengaturan) tetap di posisi yang sama dengan animasi yang sudah ada.

### 3. Tutorial Cara Bermain (Auto-show sebelum Stage 1)
File baru: **`src/components/game/HowToPlay.tsx`** — overlay popup pixel-art bergaya kartu, isi 4 tab/halaman:

1. **🎮 Kontrol** — WASD/Arrow untuk gerak, Space/J untuk serang, ESC/P untuk pause.
2. **🎯 Tujuan Tiap Stage** — Stage 1 (Pantai: Litter King), Stage 2 (Laut Dangkal: Net Master), Stage 3 (Laut Dalam: Plastic Tyrant). Bersihkan sampah & kalahkan boss untuk dapat kode rahasia.
3. **👾 Musuh & Item** — preview sprite Trash Goblin, Bottle Beast, Net Master, Microplastic, Dark Jelly + power-up (heart, koin).
4. **💡 Tips & Trik** — jaga jarak dari boss, kumpulkan sampah berturut untuk kombo, hindari proyektil, manfaatkan dash.

Navigasi: tombol **‹ Prev / Next ›**, indikator titik halaman, tombol **"MULAI MAIN!"** di halaman terakhir, tombol **× Skip** di pojok.

### 4. Persistensi & Trigger
- Tambah flag `tutorialSeen: boolean` di `src/game/settings.ts` (localStorage).
- Di `src/pages/Index.tsx`: sebelum render Stage 1 pertama kali → cek flag. Kalau `false`, tampilkan `<HowToPlay />`. Setelah klik "MULAI MAIN!" → set `true` dan lanjut ke gameplay.
- Tambah checkbox "**Jangan tampilkan lagi**" (default tercentang) supaya user yang penasaran tetap bisa lihat ulang.
- Bonus: tambah opsi **"Lihat Cara Bermain"** di Settings screen biar bisa dibuka lagi kapan saja.

### Detail Teknis
- Gambar di-import sebagai modul Vite: `import bgImage from "@/assets/title-bg-custom.png"` agar di-hash & cache-friendly.
- `HowToPlay.tsx` pakai state `useState<number>(0)` untuk halaman aktif, animasi `animate-scale-in` saat muncul.
- Tutorial overlay full-screen dengan backdrop `bg-black/70 backdrop-blur-sm`, kartu di tengah max-width ~520px, scrollable di mobile.

### Yang Perlu Kamu Lakukan Dulu
**Upload gambar HD-mu sekarang** (drag ke chat atau klik **+ Attach**). Setelah ke-approve plan ini, aku akan minta gambarnya kalau belum ada, lalu langsung eksekusi semuanya.