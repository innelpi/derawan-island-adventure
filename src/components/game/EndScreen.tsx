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
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-sky-200 to-teal-100 p-4">
      <SparkleField />

      <div className="relative z-10 my-auto w-full max-w-md animate-pop-in space-y-4">
        <div className="rounded-2xl border border-white/50 bg-white/90 p-4 text-center shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-sm">
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
            {subtitle}
          </div>
          <h2 className="mt-2 text-2xl font-bold leading-tight text-emerald-600 sm:text-3xl">
            {title}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/90 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-sm">
          <div className="mb-2 inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
            💡 Pesan Edukasi
          </div>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            <strong>{loadSettings().playerName || "Pahlawan"}!</strong> {message}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/90 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-sm">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-3xl shadow-md">
            💎
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase text-slate-500">Reward</div>
            <div className="text-sm font-bold text-slate-800">{reward}</div>
            <div className="text-xs text-slate-500">{rewardDesc}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {onNextStage && (
            <button
              onClick={onNextStage}
              className="flex-1 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] active:translate-y-1"
            >
              ▶▶ STAGE {stage + 1}
            </button>
          )}
          <button
            onClick={onRestart}
            className="flex-1 rounded-xl bg-gradient-to-b from-sky-400 to-sky-600 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] active:translate-y-1"
          >
            ↻ MAIN LAGI
          </button>
          <button
            onClick={onMenu}
            className="flex-1 rounded-xl bg-slate-200 px-4 py-3 text-xs font-bold text-slate-700 shadow-md transition hover:bg-slate-300 active:translate-y-1"
          >
            ⌂ MENU
          </button>
        </div>

        {isFinal && (
          <p className="text-center text-xs text-slate-600">
            🎉 Kamu sudah menamatkan SEMUA stage Derawan Hero! Pahlawan sejati! 🏆
          </p>
        )}
      </div>
    </div>
  );
}

function LoseScreen({ onRestart, onMenu }: { onRestart: () => void; onMenu: () => void }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-slate-800 to-red-900 p-4">
      <div className="relative z-10 w-full max-w-md animate-pop-in space-y-4 text-center">
        <h2 className="text-3xl font-bold text-red-200 sm:text-4xl">
          GAME OVER
        </h2>
        <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-sm">
          <p className="text-base text-white sm:text-lg">
            Yah, {loadSettings().playerName || "Pahlawan"}, pantainya belum bersih...
          </p>
          <p className="mt-2 text-sm text-red-100">
            Tora si penyu masih percaya kamu! Coba lagi ya 💪
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            onClick={onRestart}
            className="flex-1 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:scale-[1.02] active:translate-y-1"
          >
            ↻ COBA LAGI
          </button>
          <button
            onClick={onMenu}
            className="flex-1 rounded-xl bg-slate-200 px-4 py-3 text-xs font-bold text-slate-700 shadow-md transition hover:bg-slate-300 active:translate-y-1"
          >
            ⌂ MENU
          </button>
        </div>
      </div>
    </div>
  );
}

function SparkleField() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 animate-flash rounded-full bg-yellow-300"
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
