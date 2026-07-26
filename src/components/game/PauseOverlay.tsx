import { SFX } from "@/game/audio";

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export function PauseOverlay({ onResume, onRestart, onMenu }: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xs animate-pop-in space-y-3 rounded-2xl border border-white/30 bg-white p-6 text-center shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <div className="text-xl font-bold text-slate-800">⏸ JEDA</div>
        <p className="text-xs text-slate-500">Game tetap aman, Pahlawan!</p>

        <button
          onClick={() => {
            SFX.click();
            onResume();
          }}
          className="w-full rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:translate-y-1"
        >
          ▶ Lanjutkan
        </button>
        <button
          onClick={() => {
            SFX.click();
            onRestart();
          }}
          className="w-full rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 py-3 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02] active:translate-y-1"
        >
          ↻ Ulang Stage
        </button>
        <button
          onClick={() => {
            SFX.click();
            onMenu();
          }}
          className="w-full rounded-xl bg-slate-200 py-3 text-sm font-bold text-slate-700 shadow-md transition-all hover:scale-[1.02] active:translate-y-1"
        >
          ⌂ Menu Utama
        </button>

        <p className="text-[10px] text-slate-400">
          Tekan <strong>ESC</strong> atau <strong>P</strong> untuk lanjut
        </p>
      </div>
    </div>
  );
}
