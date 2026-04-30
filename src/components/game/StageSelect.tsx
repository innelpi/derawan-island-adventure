import { SFX } from "@/game/audio";
import { loadSettings } from "@/game/settings";
import type { StageId } from "@/game/types";

interface StageSelectProps {
  onPick: (stage: StageId) => void;
  onBack: () => void;
}

export function StageSelect({ onPick, onBack }: StageSelectProps) {
  const settings = loadSettings();
  const stage2Locked = !settings.stage2Unlocked;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-b from-sky to-sea-deep p-6">
      <button
        onClick={() => {
          SFX.click();
          onBack();
        }}
        className="absolute left-4 top-4 z-10 rounded border-2 border-foreground bg-card px-3 py-1 font-pixel text-[10px] shadow-pixel"
      >
        ◀ KEMBALI
      </button>

      <h2 className="font-pixel text-2xl text-secondary text-shadow-pixel sm:text-3xl">
        PILIH STAGE
      </h2>
      <p className="font-body text-sm text-card-foreground/90 text-center max-w-md">
        Halo, <strong>{settings.playerName}</strong>! Kamu mau jadi pahlawan di mana hari ini?
      </p>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <StageCard
          number={1}
          title="Pantai Derawan"
          desc="Bersihkan pantai dari monster sampah & kalahkan Litter King!"
          gradient="from-sky to-sand"
          emoji="🏖️"
          onClick={() => {
            SFX.click();
            onPick(1);
          }}
        />
        <StageCard
          number={2}
          title="Karang Derawan"
          desc="Selamatkan terumbu karang dari jaring hantu & tumpahan oli!"
          gradient="from-primary to-sea-deep"
          emoji="🪸"
          locked={stage2Locked}
          onClick={() => {
            if (stage2Locked) return;
            SFX.click();
            onPick(2);
          }}
        />
      </div>

      {stage2Locked && (
        <p className="font-body text-xs text-card-foreground/80">
          🔒 Stage 2 terbuka setelah kamu menyelesaikan Stage 1!
        </p>
      )}
    </div>
  );
}

function StageCard({
  number,
  title,
  desc,
  gradient,
  emoji,
  onClick,
  locked,
}: {
  number: number;
  title: string;
  desc: string;
  gradient: string;
  emoji: string;
  onClick: () => void;
  locked?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`pixel-btn group relative overflow-hidden rounded-md border-4 border-foreground bg-gradient-to-br ${gradient} p-5 text-left shadow-pixel-lg transition-transform active:translate-y-1 active:shadow-pixel ${
        locked ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl" aria-hidden>{emoji}</span>
        <div>
          <div className="font-pixel text-[10px] uppercase text-card-foreground/90">
            STAGE {number}
          </div>
          <div className="font-pixel text-base text-foreground sm:text-lg">{title}</div>
        </div>
      </div>
      <p className="mt-3 font-body text-xs leading-snug text-card-foreground sm:text-sm">
        {desc}
      </p>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 backdrop-blur-[1px]">
          <span className="font-pixel text-2xl">🔒</span>
        </div>
      )}
    </button>
  );
}
