import { GameState } from "@/game/types";

interface HudProps {
  state: GameState;
}

export function Hud({ state }: HudProps) {
  const hearts = Array.from({ length: state.hero.maxHp }, (_, i) => i < state.hero.hp);
  const pollutionColor =
    state.pollution < 50
      ? "bg-success"
      : state.pollution < 80
      ? "bg-warning"
      : "bg-destructive animate-flash";

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-2 p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        {/* Hearts */}
        <div className="flex gap-1.5">
          {hearts.map((on, i) => (
            <div
              key={i}
              className={`h-7 w-7 sm:h-9 sm:w-9 transition-transform ${
                on ? "" : "opacity-30"
              }`}
              aria-label={on ? "HP penuh" : "HP hilang"}
            >
              <HeartIcon full={on} />
            </div>
          ))}
        </div>

        {/* Pollution meter */}
        <div className="flex flex-1 max-w-md flex-col items-center gap-1.5">
          <span className="rounded border-2 border-foreground bg-card px-2 py-0.5 font-pixel text-[8px] sm:text-[10px] text-foreground">
            POLUSI
          </span>
          <div className="h-4 w-full border-2 border-foreground bg-foreground/40 sm:h-5">
            <div
              className={`h-full transition-all duration-200 ${pollutionColor}`}
              style={{ width: `${state.pollution}%` }}
            />
          </div>
        </div>

        {/* Wave indicator */}
        <div className="rounded border-2 border-foreground bg-card px-2 py-1 font-pixel text-[8px] sm:text-[10px]">
          {state.boss.active ? "BOSS" : `WAVE ${state.wave}/3`}
        </div>
      </div>

      {/* Special meter */}
      <div className="flex items-center gap-2">
        <span className="rounded border-2 border-foreground bg-card px-1.5 py-0.5 font-pixel text-[8px] sm:text-[10px]">CLEAN WAVE</span>
        <div className="h-3 flex-1 max-w-xs border-2 border-foreground bg-foreground/40">
          <div
            className={`h-full transition-all ${
              state.special >= 100 ? "bg-primary animate-flash" : "bg-primary/70"
            }`}
            style={{ width: `${state.special}%` }}
          />
        </div>
      </div>

      {/* Boss HP bar */}
      {state.boss.active && !state.boss.defeated && (
        <div className="absolute inset-x-0 bottom-2 mx-auto flex max-w-lg flex-col items-center gap-1 px-4">
          <span className="font-pixel text-[10px] sm:text-xs text-destructive text-shadow-pixel">
            LITTER KING
          </span>
          <div className="h-5 w-full border-4 border-foreground bg-foreground/40">
            <div
              className="h-full bg-destructive transition-all"
              style={{ width: `${(state.boss.hp / state.boss.maxHp) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function HeartIcon({ full }: { full: boolean }) {
  return (
    <svg viewBox="0 0 8 7" className="h-full w-full" shapeRendering="crispEdges">
      <g fill={full ? "#ff5577" : "#444"}>
        <rect x="1" y="0" width="2" height="1" />
        <rect x="5" y="0" width="2" height="1" />
        <rect x="0" y="1" width="8" height="1" />
        <rect x="0" y="2" width="8" height="1" />
        <rect x="0" y="3" width="8" height="1" />
        <rect x="1" y="4" width="6" height="1" />
        <rect x="2" y="5" width="4" height="1" />
        <rect x="3" y="6" width="2" height="1" />
      </g>
      {full && (
        <g fill="#cc2244">
          <rect x="0" y="1" width="1" height="1" />
          <rect x="7" y="1" width="1" height="1" />
        </g>
      )}
    </svg>
  );
}
