import { GameState, STAGE_CONFIGS } from "@/game/types";
import { loadSettings } from "@/game/settings";

interface HudProps {
  state: GameState;
}

export function Hud({ state }: HudProps) {
  const playerName = loadSettings().playerName || "Pahlawan";
  const hearts = Array.from({ length: state.hero.maxHp }, (_, i) => i < state.hero.hp);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-2 p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        {/* Hearts + name */}
        <div className="flex flex-col gap-1">
          <span className="w-fit rounded-full border border-white/50 bg-white/80 px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-sm backdrop-blur-sm sm:text-xs truncate max-w-[120px]">
            👤 {playerName}
          </span>
          <div className="flex gap-1">
            {hearts.map((on, i) => (
              <span
                key={i}
                className={`text-xl drop-shadow-sm sm:text-2xl ${on ? "" : "opacity-30 grayscale"}`}
                aria-label={on ? "HP penuh" : "HP hilang"}
              >
                {on ? "❤️" : "🖤"}
              </span>
            ))}
          </div>
        </div>

        {/* Pollution meter */}
        <div className="flex max-w-md flex-1 flex-col items-center gap-1">
          <span className="rounded-full border border-white/50 bg-white/80 px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-sm backdrop-blur-sm">
            🌊 POLUSI
          </span>
          <div className="h-3.5 w-full overflow-hidden rounded-full border border-white/40 bg-black/20 shadow-inner sm:h-4">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                state.pollution < 50
                  ? "bg-emerald-400"
                  : state.pollution < 80
                  ? "bg-yellow-400"
                  : "bg-red-500 animate-flash"
              }`}
              style={{ width: `${state.pollution}%` }}
            />
          </div>
        </div>

        {/* Wave indicator */}
        <div className="rounded-full border border-white/50 bg-white/80 px-3 py-1 text-[10px] font-bold text-slate-800 shadow-sm backdrop-blur-sm">
          {state.boss.active ? "👹 BOSS" : `🌊 WAVE ${state.wave}/3`}
        </div>
      </div>

      {/* Special meter */}
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-white/50 bg-white/80 px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-sm backdrop-blur-sm">
          ✨ CLEAN WAVE
        </span>
        <div className="h-2.5 flex-1 max-w-xs overflow-hidden rounded-full border border-white/40 bg-black/20 shadow-inner">
          <div
            className={`h-full rounded-full transition-all ${
              state.special >= 100 ? "bg-sky-400 animate-flash" : "bg-sky-400/70"
            }`}
            style={{ width: `${state.special}%` }}
          />
        </div>
      </div>

      {/* Boss HP bar */}
      {state.boss.active && !state.boss.defeated && (
        <div className="absolute inset-x-0 bottom-2 mx-auto flex max-w-lg flex-col items-center gap-1 px-4">
          <span className="text-[10px] font-bold text-red-200 text-shadow-pixel sm:text-xs">
            {STAGE_CONFIGS[state.stage].bossName}
          </span>
          <div className="h-4 w-full overflow-hidden rounded-full border-2 border-white/40 bg-black/30 shadow-lg sm:h-5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
              style={{ width: `${(state.boss.hp / state.boss.maxHp) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
