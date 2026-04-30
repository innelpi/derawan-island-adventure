import { useState } from "react";
import type { StageId } from "@/game/types";

interface CutsceneProps {
  onFinish: () => void;
  stage?: StageId;
}

const PANELS_STAGE1 = [
  {
    bg: "from-sky via-sky to-sea-deep",
    text: "Akhirnya liburan ke Pulau Derawan! Pantainya cantik banget…",
    showHero: true,
    showDark: false,
  },
  {
    bg: "from-trash via-trash-glow to-sea-deep",
    text: "Eh, tunggu… energi gelap apa itu?! Mereka menyebar sampah di mana-mana!",
    showHero: true,
    showDark: true,
  },
  {
    bg: "from-trash via-destructive to-sea-deep",
    text: "Aku harus menghentikan mereka sebelum pantainya hancur! Saatnya jadi PAHLAWAN!",
    showHero: true,
    showDark: true,
    showFist: true,
  },
];

const PANELS_STAGE2 = [
  {
    bg: "from-primary via-sea to-sea-deep",
    text: "Wow, di bawah laut Derawan terumbu karangnya warna-warni! Banyak ikan kecil berenang…",
    showHero: true,
    showDark: false,
  },
  {
    bg: "from-sea-deep via-trash to-trash",
    text: "Astaga! Ada jaring nelayan terbuang & tumpahan oli yang bikin karang sakit!",
    showHero: true,
    showDark: true,
  },
  {
    bg: "from-trash via-trash-glow to-sea-deep",
    text: "Kalau dibiarkan, ikan-ikan terjebak & karangnya mati! Saatnya beraksi lagi, Pahlawan!",
    showHero: true,
    showDark: true,
    showFist: true,
  },
];

export function Cutscene({ onFinish, stage = 1 }: CutsceneProps) {
  const PANELS = stage === 2 ? PANELS_STAGE2 : PANELS_STAGE1;
  const [idx, setIdx] = useState(0);
  const panel = PANELS[idx];

  const next = () => {
    if (idx < PANELS.length - 1) setIdx(idx + 1);
    else onFinish();
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      <button
        onClick={onFinish}
        className="absolute right-4 top-4 z-20 rounded border-2 border-foreground bg-card px-3 py-1 font-pixel text-[10px] shadow-pixel"
      >
        SKIP ▶▶
      </button>

      {/* Panel area */}
      <div className={`relative flex-1 overflow-hidden bg-gradient-to-b ${panel.bg}`}>
        {/* Pier */}
        <div className="absolute inset-x-0 bottom-1/3 mx-auto h-3 w-3/4 max-w-md bg-coconut" />
        {[10, 30, 50, 70, 90].map((p) => (
          <div
            key={p}
            className="absolute bottom-1/4 h-12 w-2 bg-coconut"
            style={{ left: `${p}%` }}
          />
        ))}

        {/* Suitcase + hero */}
        {panel.showHero && (
          <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/4 animate-bob">
            <div className="relative">
              <svg
                viewBox="0 0 16 18"
                className="h-40 w-40 sm:h-56 sm:w-56"
                shapeRendering="crispEdges"
              >
                <g fill="#ffd84d">
                  <rect x="4" y="0" width="8" height="1" />
                  <rect x="3" y="1" width="10" height="2" />
                </g>
                <g fill="#e6a82a">
                  <rect x="2" y="2" width="12" height="1" />
                </g>
                <g fill="#5a3a1a">
                  <rect x="3" y="3" width="10" height="1" />
                </g>
                <g fill="#f4c89a">
                  <rect x="3" y="4" width="10" height="5" />
                </g>
                <g fill="#222233">
                  <rect x="5" y="5" width="2" height="1" />
                  <rect x="9" y="5" width="2" height="1" />
                  <rect x="6" y="7" width="4" height="1" />
                </g>
                <g fill="#e8423a">
                  <rect x="2" y="9" width="12" height="4" />
                </g>
                <g fill="#3a4a8a">
                  <rect x="2" y="13" width="12" height="3" />
                </g>
                <g fill="#222233">
                  <rect x="3" y="16" width="3" height="2" />
                  <rect x="10" y="16" width="3" height="2" />
                </g>
                {panel.showFist && (
                  <g fill="#f4c89a">
                    <rect x="6" y="6" width="4" height="3" />
                  </g>
                )}
              </svg>
              {/* suitcase */}
              {!panel.showFist && (
                <div className="absolute -right-4 bottom-2 h-8 w-10 border-4 border-foreground bg-secondary sm:-right-6 sm:h-12 sm:w-14">
                  <div className="absolute inset-x-2 -top-2 h-2 border-x-4 border-t-4 border-foreground" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dark energy / monsters */}
        {panel.showDark && (
          <>
            <div className="absolute right-4 top-4 h-32 w-32 animate-flash rounded-full bg-trash-glow/60 blur-2xl sm:right-12 sm:top-12 sm:h-48 sm:w-48" />
            <div className="absolute bottom-1/3 right-8 animate-bob sm:right-20">
              <PixelMonster />
            </div>
            <div
              className="absolute bottom-1/3 left-8 animate-bob sm:left-20"
              style={{ animationDelay: "0.3s" }}
            >
              <PixelMonster small />
            </div>
          </>
        )}
      </div>

      {/* Dialog box */}
      <div className="z-10 border-t-4 border-foreground bg-card p-4 sm:p-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 inline-block rounded border-2 border-foreground bg-secondary px-2 py-0.5 font-pixel text-[8px] uppercase">
            Pahlawan
          </div>
          <p className="mb-3 font-body text-sm leading-relaxed text-foreground sm:text-base">
            {panel.text}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[8px] text-muted-foreground">
              {idx + 1} / {PANELS.length}
            </span>
            <button
              onClick={next}
              className="pixel-btn rounded border-4 border-foreground bg-primary px-5 py-2 font-pixel text-xs text-primary-foreground shadow-pixel active:translate-y-1"
            >
              {idx < PANELS.length - 1 ? "LANJUT ▶" : "MULAI ⚔"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PixelMonster({ small }: { small?: boolean }) {
  const size = small ? "h-16 w-16 sm:h-24 sm:w-24" : "h-24 w-24 sm:h-32 sm:w-32";
  return (
    <svg viewBox="0 0 12 12" className={size} shapeRendering="crispEdges">
      <g fill="#7d2db5">
        <rect x="3" y="0" width="6" height="1" />
        <rect x="2" y="1" width="8" height="1" />
      </g>
      <g fill="#b96bff">
        <rect x="3" y="1" width="6" height="1" />
        <rect x="2" y="2" width="8" height="1" />
      </g>
      <g fill="#222233">
        <rect x="3" y="2" width="2" height="1" />
        <rect x="7" y="2" width="2" height="1" />
      </g>
      <g fill="#86bf3a">
        <rect x="2" y="3" width="8" height="2" />
      </g>
      <g fill="#3a3550">
        <rect x="1" y="5" width="10" height="5" />
      </g>
      <g fill="#9a9a9a">
        <rect x="2" y="6" width="2" height="2" />
        <rect x="6" y="7" width="2" height="1" />
      </g>
      <g fill="#222233">
        <rect x="2" y="10" width="2" height="2" />
        <rect x="8" y="10" width="2" height="2" />
      </g>
    </svg>
  );
}
