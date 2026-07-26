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
      <div className="space-y-3 text-sm">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">💻 Desktop</p>
          <ul className="space-y-1.5 text-xs text-slate-700">
            <li><kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm font-bold">WASD</kbd> / <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm font-bold">↑←↓→</kbd> — Bergerak</li>
            <li><kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm font-bold">SPASI</kbd> / <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm font-bold">J</kbd> — Serang</li>
            <li><kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm font-bold">E</kbd> — Clean Wave (jurus area)</li>
            <li><kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm font-bold">ESC</kbd> / <kbd className="rounded bg-white px-1.5 py-0.5 shadow-sm font-bold">P</kbd> — Pause</li>
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-[10px] font-bold uppercase text-slate-500">📱 HP / Mobile</p>
          <ul className="space-y-1.5 text-xs text-slate-700">
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
      <div className="space-y-2.5 text-sm">
        <div className="rounded-xl border border-slate-200 bg-amber-50 p-3">
          <p className="text-[10px] font-bold text-amber-700">🏖️ STAGE 1 — PANTAI</p>
          <p className="mt-1 text-xs text-slate-700">Bersihkan sampah & kalahkan <strong>Litter King</strong>.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-sky-50 p-3">
          <p className="text-[10px] font-bold text-sky-700">🌊 STAGE 2 — LAUT DANGKAL</p>
          <p className="mt-1 text-xs text-slate-700">Hadapi <strong>Net Master</strong> & lepaskan biota laut yang terjerat jaring.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-violet-50 p-3">
          <p className="text-[10px] font-bold text-violet-700">🌑 STAGE 3 — LAUT DALAM</p>
          <p className="mt-1 text-xs text-slate-700">Boss terakhir <strong>Plastic Tyrant</strong>. Selamatkan Pulau Derawan!</p>
        </div>
      </div>
    ),
  },
  {
    icon: "👾",
    title: "MUSUH & ITEM",
    body: (
      <div className="space-y-2 text-sm">
        <p className="text-[10px] font-bold uppercase text-slate-500">Musuh Utama</p>
        <ul className="space-y-1.5 text-xs text-slate-700">
          <li>🗑️ <strong>Trash Goblin</strong> — Lemah, suka berkelompok.</li>
          <li>🧴 <strong>Bottle Beast</strong> — Bertubuh tebal, perlu beberapa pukulan.</li>
          <li>🕸️ <strong>Net Master</strong> — Boss Stage 2, melempar jaring.</li>
          <li>🦠 <strong>Microplastic</strong> — Cepat & menyebar di Stage 3.</li>
          <li>🪼 <strong>Dark Jelly</strong> — Mengambang, sulit dipukul.</li>
        </ul>
        <p className="mt-3 text-[10px] font-bold uppercase text-slate-500">Power-up</p>
        <ul className="space-y-1.5 text-xs text-slate-700">
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
      <div className="space-y-2 text-sm">
        <ul className="space-y-2 text-xs text-slate-700">
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            🎯 <strong>Jaga jarak dari boss</strong> — pelajari pola seranganya sebelum menyerang balik.
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            🔥 <strong>Kombo!</strong> Kalahkan musuh berturut-turut untuk skor lebih tinggi.
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            🏃 <strong>Selalu bergerak</strong> — diam = sasaran empuk untuk proyektil musuh.
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
            🧠 <strong>Jawab kuis</strong> dengan benar untuk dapat <strong>+1 nyawa</strong>!
          </li>
          <li className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="relative w-full max-w-[520px] animate-pop-in rounded-2xl border border-white/30 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden">
        {/* Skip button */}
        <button
          onClick={finish}
          aria-label="Tutup tutorial"
          className="absolute right-3 top-3 z-10 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 transition hover:bg-slate-200"
        >
          ✕
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-sky-400 to-sky-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{current.icon}</span>
            <div>
              <p className="text-[10px] font-bold uppercase opacity-80">Cara Bermain</p>
              <h2 className="text-lg font-bold sm:text-xl">{current.title}</h2>
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
              className={`h-2.5 rounded-full transition-all ${
                i === page ? "w-6 bg-sky-500" : "w-2.5 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50 p-3 sm:p-4">
          {showDontShowAgain && isLast && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={dontShow}
                onChange={(e) => setDontShow(e.target.checked)}
                className="h-4 w-4 accent-sky-500"
              />
              Jangan tampilkan lagi
            </label>
          )}
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={page === 0}
              className="rounded-xl bg-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition disabled:opacity-40 hover:bg-slate-300"
            >
              ‹ PREV
            </button>
            <button
              onClick={next}
              className="flex-1 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 px-3 py-2 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] active:translate-y-1"
            >
              {isLast ? "🚀 MULAI MAIN!" : "NEXT ›"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
