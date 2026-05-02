import type { StageId } from "@/game/types";
import { loadSettings } from "@/game/settings";

interface EndScreenProps {
  variant: "win" | "lose";
  stage?: StageId;
  onRestart: () => void;
  onMenu: () => void;
  onNextStage?: () => void;
}

export function EndScreen({ variant, stage = 1, onRestart, onMenu, onNextStage }: EndScreenProps) {
  if (variant === "win") return <WinScreen stage={stage} onRestart={onRestart} onMenu={onMenu} onNextStage={onNextStage} />;
  return <LoseScreen onRestart={onRestart} onMenu={onMenu} />;
}

function WinScreen({ stage, onRestart, onMenu, onNextStage }: { stage: StageId; onRestart: () => void; onMenu: () => void; onNextStage?: () => void }) {
  const title =
    stage === 1 ? "PANTAI KEMBALI BERSIH!"
    : stage === 2 ? "TERUMBU KARANG SELAMAT!"
    : "LAUT DERAWAN PULIH SELAMANYA!";
  const subtitle = `STAGE ${stage} CLEAR`;
  const message =
    stage === 1
      ? "Sampah kecil maupun besar sama bahayanya. Kalau terbawa ombak, butuh ratusan tahun untuk hancur dan bisa meracuni laut kita!"
      : stage === 2
      ? "Jaring hantu menjebak ribuan hewan laut tiap tahun, dan tumpahan oli bisa membunuh karang. Selalu jaga laut kita ya!"
      : "Mikroplastik adalah musuh tak kasat mata — masuk ke ikan, lalu ke tubuh kita. Kurangi plastik sekali pakai mulai dari sekarang!";
  const reward =
    stage === 1 ? "Pecahan Kristal Terumbu"
    : stage === 2 ? "Mahkota Penjaga Karang"
    : "Cahaya Abadi Derawan";
  const rewardDesc =
    stage === 1 ? "Berguna untuk perjalanan ke Karang Derawan!"
    : stage === 2 ? "Membuka jalan ke palung laut dalam!"
    : "Tanda kamu PAHLAWAN SEJATI seluruh Pulau Derawan!";
  const isFinal = stage === 3;
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-sky to-primary/30 p-4">
      {/* Sparkles */}
      <SparkleField />

      <div className="relative z-10 my-auto w-full max-w-md animate-pop-in space-y-4">
        <div className="rounded-md border-4 border-foreground bg-secondary p-4 text-center shadow-pixel-lg">
          <div className="font-pixel text-[10px] uppercase tracking-widest text-secondary-foreground">
            {subtitle}
          </div>
          <h2 className="mt-2 font-pixel text-2xl leading-tight text-destructive text-shadow-pixel sm:text-3xl">
            {title}
          </h2>
        </div>

        <div className="rounded-md border-4 border-foreground bg-card p-4 shadow-pixel">
          <div className="mb-2 inline-block rounded border-2 border-foreground bg-accent px-2 py-0.5 font-pixel text-[8px] uppercase text-accent-foreground">
            💡 Pesan Edukasi
          </div>
          <p className="font-body text-sm leading-relaxed text-card-foreground sm:text-base">
            <strong>{loadSettings().playerName || "Pahlawan"}!</strong> {message}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-md border-4 border-foreground bg-primary/20 p-3 shadow-pixel">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border-4 border-foreground bg-primary">
            <CrystalSvg />
          </div>
          <div>
            <div className="font-pixel text-[10px] uppercase">Reward</div>
            <div className="font-body text-sm font-semibold">{reward}</div>
            <div className="font-body text-xs text-muted-foreground">{rewardDesc}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {onNextStage && (
            <button
              onClick={onNextStage}
              className="pixel-btn flex-1 rounded border-4 border-foreground bg-secondary px-4 py-3 font-pixel text-xs text-secondary-foreground shadow-pixel active:translate-y-1"
            >
              ▶▶ STAGE 2
            </button>
          )}
          <button
            onClick={onRestart}
            className="pixel-btn flex-1 rounded border-4 border-foreground bg-primary px-4 py-3 font-pixel text-xs text-primary-foreground shadow-pixel active:translate-y-1"
          >
            ↻ MAIN LAGI
          </button>
          <button
            onClick={onMenu}
            className="pixel-btn flex-1 rounded border-4 border-foreground bg-card px-4 py-3 font-pixel text-xs text-card-foreground shadow-pixel active:translate-y-1"
          >
            ⌂ MENU
          </button>
        </div>

        {!isStage1 && (
          <p className="text-center font-body text-xs text-muted-foreground">
            🎉 Kamu sudah menamatkan semua stage MVP! Mantap, Pahlawan!
          </p>
        )}
      </div>
    </div>
  );
}

function LoseScreen({ onRestart, onMenu }: { onRestart: () => void; onMenu: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-trash to-destructive/40 p-4">
      <div className="relative z-10 w-full max-w-md animate-pop-in space-y-4 text-center">
        <h2 className="font-pixel text-3xl text-destructive text-shadow-pixel sm:text-4xl">
          GAME OVER
        </h2>
        <div className="rounded-md border-4 border-foreground bg-card p-5 shadow-pixel-lg">
          <p className="font-body text-base text-card-foreground sm:text-lg">
            Yah, {loadSettings().playerName || "Pahlawan"}, pantainya belum bersih...
          </p>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Tora si penyu masih percaya kamu! Coba lagi ya 💪
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={onRestart}
            className="pixel-btn flex-1 rounded border-4 border-foreground bg-secondary px-4 py-3 font-pixel text-xs text-secondary-foreground shadow-pixel active:translate-y-1"
          >
            ↻ COBA LAGI
          </button>
          <button
            onClick={onMenu}
            className="pixel-btn flex-1 rounded border-4 border-foreground bg-card px-4 py-3 font-pixel text-xs text-card-foreground shadow-pixel active:translate-y-1"
          >
            ⌂ MENU
          </button>
        </div>
      </div>
    </div>
  );
}

function CrystalSvg() {
  return (
    <svg viewBox="0 0 12 12" className="h-10 w-10" shapeRendering="crispEdges">
      <g fill="#7adfff">
        <rect x="5" y="0" width="2" height="1" />
        <rect x="3" y="1" width="6" height="1" />
        <rect x="2" y="2" width="8" height="6" />
        <rect x="3" y="8" width="6" height="2" />
        <rect x="5" y="10" width="2" height="1" />
      </g>
      <g fill="#fff">
        <rect x="4" y="2" width="1" height="3" />
        <rect x="3" y="3" width="1" height="1" />
      </g>
      <g fill="#3a8fcc">
        <rect x="8" y="3" width="1" height="4" />
        <rect x="7" y="7" width="2" height="1" />
      </g>
    </svg>
  );
}

function SparkleField() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 animate-flash bg-secondary"
          style={{
            left: `${(i * 37) % 95 + 2}%`,
            top: `${(i * 53) % 90 + 5}%`,
            animationDelay: `${(i * 0.13) % 1}s`,
          }}
        />
      ))}
    </div>
  );
}
