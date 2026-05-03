import { useState } from "react";
import { SFX } from "@/game/audio";
import { saveSettings } from "@/game/settings";

interface HowToPlayProps {
  onClose: () => void;
  showDontShowAgain?: boolean;
}

interface Page {
  icon: string;
  title: string;
  body: React.ReactNode;
}

const PAGES: Page[] = [
  {
    icon: "🎮",
    title: "KONTROL",
    body: (
      <div className="space-y-3 font-body text-sm">
        <div className="rounded border-2 border-foreground bg-muted p-3">
          <p className="mb-2 font-pixel text-[10px] uppercase">💻 Desktop</p>
          <ul className="space-y-1.5">
            <li><kbd className="rounded border border-foreground bg-background px-1.5 py-0.5 font-pixel text-[10px]">W A S D</kbd> / <kbd className="rounded border border-foreground bg-background px-1.5 py-0.5 font-pixel text-[10px]">↑ ← ↓ →</kbd> — Bergerak</li>
            <li><kbd className="rounded border border-foreground bg-background px-1.5 py-0.5 font-pixel text-[10px]">SPASI</kbd> / <kbd className="rounded border border-foreground bg-background px-1.5 py-0.5 font-pixel text-[10px]">J</kbd> — Serang</li>
            <li><kbd className="rounded border border-foreground bg-background px-1.5 py-0.5 font-pixel text-[10px]">E</kbd> — Clean Wave (jurus area)</li>
            <li><kbd className="rounded border border-foreground bg-background px-1.5 py-0.5 font-pixel text-[10px]">ESC</kbd> / <kbd className="rounded border border-foreground bg-background px-1.5 py-0.5 font-pixel text-[10px]">P</kbd> — Pause</li>
          </ul>
        </div>
        <div className="rounded border-2 border-foreground bg-muted p-3">
          <p className="mb-2 font-pixel text-[10px] uppercase">📱 HP / Mobile</p>
          <ul className="space-y-1.5">
            <li>🕹️ <strong>Joystick kiri</strong> — Gerak ke segala arah</li>
            <li>👊 <strong>Tombol kanan</strong> — Serang & jurus</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    icon: "🎯",
    title: "TUJUAN TIAP STAGE",
    body: (
      <div className="space-y-2.5 font-body text-sm">
        <div className="rounded border-2 border-foreground bg-[hsl(45,90%,90%)] p-3">
          <p className="font-pixel text-[10px] text-[hsl(15,80%,40%)]">🏖️ STAGE 1 — PANTAI</p>
          <p className="mt-1 text-xs">Bersihkan sampah & kalahkan <strong>Litter King</strong>. Dapat kode rahasia ke Stage 2!</p>
        </div>
        <div className="rounded border-2 border-foreground bg-[hsl(195,80%,88%)] p-3">
          <p className="font-pixel text-[10px] text-[hsl(210,80%,30%)]">🌊 STAGE 2 — LAUT DANGKAL</p>
          <p className="mt-1 text-xs">Hadapi <strong>Net Master</strong> & lepaskan biota laut yang terjerat jaring.</p>
        </div>
        <div className="rounded border-2 border-foreground bg-[hsl(280,40%,85%)] p-3">
          <p className="font-pixel text-[10px] text-[hsl(280,60%,25%)]">🌑 STAGE 3 — LAUT DALAM</p>
          <p className="mt-1 text-xs">Boss terakhir <strong>Plastic Tyrant</strong>. Selamatkan Pulau Derawan!</p>
        </div>
      </div>
    ),
  },
  {
    icon: "👾",
    title: "MUSUH & ITEM",
    body: (
      <div className="space-y-2 font-body text-sm">
        <p className="font-pixel text-[10px] uppercase text-muted-foreground">Musuh Utama</p>
        <ul className="space-y-1.5 text-xs">
          <li>🗑️ <strong>Trash Goblin</strong> — Lemah, suka berkelompok.</li>
          <li>🧴 <strong>Bottle Beast</strong> — Bertubuh tebal, perlu beberapa pukulan.</li>
          <li>🕸️ <strong>Net Master</strong> — Boss Stage 2, melempar jaring.</li>
          <li>🦠 <strong>Microplastic</strong> — Cepat & menyebar di Stage 3.</li>
          <li>🪼 <strong>Dark Jelly</strong> — Mengambang, sulit dipukul.</li>
        </ul>
        <p className="mt-3 font-pixel text-[10px] uppercase text-muted-foreground">Power-up</p>
        <ul className="space-y-1.5 text-xs">
          <li>❤️ <strong>Heart</strong> — Pulihkan 1 nyawa.</li>
          <li>🪙 <strong>Koin</strong> — Tambah skor & kombo.</li>
          <li>⭐ <strong>Bintang</strong> — Power attack sementara.</li>
        </ul>
      </div>
    ),
  },
  {
    icon: "💡",
    title: "TIPS & TRIK",
    body: (
      <div className="space-y-2 font-body text-sm">
        <ul className="space-y-2 text-xs">
          <li className="rounded border-2 border-foreground bg-muted p-2.5">
            🎯 <strong>Jaga jarak dari boss</strong> — pelajari pola seranganya sebelum menyerang balik.
          </li>
          <li className="rounded border-2 border-foreground bg-muted p-2.5">
            🔥 <strong>Kombo!</strong> Kalahkan musuh berturut-turut untuk skor lebih tinggi.
          </li>
          <li className="rounded border-2 border-foreground bg-muted p-2.5">
            🏃 <strong>Selalu bergerak</strong> — diam = sasaran empuk untuk proyektil musuh.
          </li>
          <li className="rounded border-2 border-foreground bg-muted p-2.5">
            🧠 <strong>Jawab kuis</strong> dengan benar untuk dapat <strong>+1 nyawa</strong>!
          </li>
          <li className="rounded border-2 border-foreground bg-muted p-2.5">
            💥 Simpan <strong>Clean Wave (E)</strong> untuk situasi darurat saat dikepung.
          </li>
        </ul>
      </div>
    ),
  },
];

export function HowToPlay({ onClose, showDontShowAgain = true }: HowToPlayProps) {
  const [page, setPage] = useState(0);
  const [dontShow, setDontShow] = useState(true);
  const isLast = page === PAGES.length - 1;

  const finish = () => {
    if (showDontShowAgain && dontShow) {
      saveSettings({ tutorialSeen: true });
    }
    SFX.click();
    onClose();
  };

  const next = () => {
    SFX.click();
    if (isLast) finish();
    else setPage((p) => p + 1);
  };
  const prev = () => {
    SFX.click();
    setPage((p) => Math.max(0, p - 1));
  };

  const current = PAGES[page];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6">
      <div className="animate-scale-in relative w-full max-w-[520px] rounded-md border-4 border-foreground bg-card shadow-pixel-lg">
        {/* Skip button */}
        <button
          onClick={finish}
          aria-label="Tutup tutorial"
          className="absolute right-2 top-2 z-10 rounded border-2 border-foreground bg-background px-2 py-1 font-pixel text-[10px] hover:bg-destructive hover:text-destructive-foreground"
        >
          ✕ SKIP
        </button>

        {/* Header */}
        <div className="rounded-t-sm border-b-4 border-foreground bg-gradient-to-r from-primary to-primary/70 p-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{current.icon}</span>
            <div>
              <p className="font-pixel text-[9px] uppercase opacity-75">Cara Bermain</p>
              <h2 className="font-pixel text-base sm:text-lg">{current.title}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-h-[55vh] overflow-y-auto p-4 sm:p-5">{current.body}</div>

        {/* Page dots */}
        <div className="flex items-center justify-center gap-2 px-4 py-2">
          {PAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                SFX.click();
                setPage(i);
              }}
              aria-label={`Halaman ${i + 1}`}
              className={`h-2.5 rounded-full border-2 border-foreground transition-all ${
                i === page ? "w-6 bg-primary" : "w-2.5 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t-4 border-foreground bg-muted p-3 sm:p-4">
          {showDontShowAgain && isLast && (
            <label className="flex cursor-pointer items-center gap-2 font-body text-xs">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Jangan tampilkan lagi
            </label>
          )}
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={page === 0}
              className="rounded border-4 border-foreground bg-background px-3 py-2 font-pixel text-[10px] shadow-pixel disabled:opacity-40"
            >
              ‹ PREV
            </button>
            <button
              onClick={next}
              className="flex-1 rounded border-4 border-foreground bg-primary px-3 py-2 font-pixel text-[11px] text-primary-foreground shadow-pixel active:translate-y-1"
            >
              {isLast ? "🚀 MULAI MAIN!" : "NEXT ›"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
