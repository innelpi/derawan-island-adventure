import { SFX } from "@/game/audio";

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

export function PauseOverlay({ onResume, onRestart, onMenu }: PauseOverlayProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xs animate-pop-in space-y-3 rounded-md border-4 border-foreground bg-card p-5 text-center shadow-pixel-lg">
        <div className="font-pixel text-lg text-foreground">⏸ JEDA</div>
        <p className="font-body text-xs text-muted-foreground">Game tetap aman, Pahlawan!</p>

        <button
          onClick={() => {
            SFX.click();
            onResume();
          }}
          className="pixel-btn w-full rounded border-4 border-foreground bg-primary py-3 font-pixel text-xs text-primary-foreground shadow-pixel active:translate-y-1"
        >
          ▶ LANJUTKAN
        </button>
        <button
          onClick={() => {
            SFX.click();
            onRestart();
          }}
          className="pixel-btn w-full rounded border-4 border-foreground bg-secondary py-3 font-pixel text-xs text-secondary-foreground shadow-pixel active:translate-y-1"
        >
          ↻ ULANG STAGE
        </button>
        <button
          onClick={() => {
            SFX.click();
            onMenu();
          }}
          className="pixel-btn w-full rounded border-4 border-foreground bg-card py-3 font-pixel text-xs text-card-foreground shadow-pixel active:translate-y-1"
        >
          ⌂ MENU UTAMA
        </button>

        <p className="font-body text-[10px] text-muted-foreground">
          Tekan <strong>ESC</strong> atau <strong>P</strong> untuk lanjut
        </p>
      </div>
    </div>
  );
}
