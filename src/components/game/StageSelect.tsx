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
  const stage3Locked = !settings.stage3Unlocked;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 overflow-y-auto bg-gradient-to-b from-sky-200 to-teal-100 p-6">
      <button
        onClick={() => {
          SFX.click();
          onBack();
        }}
        className="absolute left-4 top-4 z-10 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white"
      >
        ◀ KEMBALI
      </button>

      <h2 className="text-3xl font-bold text-amber-500 text-shadow-pixel sm:text-4xl">
        PILIH STAGE
      </h2>
      <p className="max-w-md text-center text-sm text-slate-700">
        Halo, <strong>{settings.playerName}</strong>! Kamu mau jadi pahlawan di mana hari ini?
      </p>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        <StageCard
          number={1}
          title="Pantai Derawan"
          desc="Bersihkan pantai dari monster sampah & kalahkan Litter King!"
          gradient="bg-gradient-to-br from-sky-200 to-amber-100"
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
          gradient="bg-gradient-to-br from-teal-200 to-cyan-100"
          emoji="🪸"
          locked={stage2Locked}
          onClick={() => {
            if (stage2Locked) return;
            SFX.click();
            onPick(2);
          }}
        />
        <StageCard
          number={3}
          title="Laut Dalam"
          desc="Hadapi sang Plastic Tyrant di palung gelap, akhiri pencemaran selamanya!"
          gradient="bg-gradient-to-br from-indigo-200 to-violet-100"
          emoji="🌌"
          locked={stage3Locked}
          onClick={() => {
            if (stage3Locked) return;
            SFX.click();
            onPick(3);
          }}
        />
      </div>

      {(stage2Locked || stage3Locked) && (
        <p className="text-center text-xs text-slate-600">
          🔒 Selesaikan stage sebelumnya untuk membuka stage berikutnya!
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
      className={`group relative overflow-hidden rounded-2xl border-2 border-white/50 p-5 text-left shadow-lg transition-all ${gradient} ${
        locked ? "opacity-60 cursor-not-allowed" : "hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-4xl" aria-hidden>{emoji}</span>
        <div>
          <div className="text-[10px] font-bold uppercase text-slate-600">
            STAGE {number}
          </div>
          <div className="text-base font-bold text-slate-800 sm:text-lg">{title}</div>
        </div>
      </div>
      <p className="mt-3 text-xs leading-snug text-slate-700 sm:text-sm">
        {desc}
      </p>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-slate-900/30 backdrop-blur-[2px]">
          <span className="text-4xl drop-shadow-lg">🔒</span>
        </div>
      )}
    </button>
  );
}
