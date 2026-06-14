import { useState } from "react";
import { SFX } from "@/game/audio";
import { loadSettings } from "@/game/settings";
import type { StageId } from "@/game/types";

interface CutsceneProps {
  onFinish: () => void;
  stage?: StageId;
}

type Speaker = "hero" | "turtle" | "narrator";
interface Panel {
  bg: string;
  speaker: Speaker;
  text: (name: string) => string;
  showHero?: boolean;
  showTurtle?: boolean;
  showDark?: boolean;
  showFist?: boolean;
  emoji?: string;
}

const PANELS_STAGE1: Panel[] = [
  {
    bg: "from-sky via-sand to-secondary",
    speaker: "hero",
    text: (n) => `Akhirnya sampai juga di Pulau Derawan! Lihat deh, pasirnya putih banget, lautnya jernih… aku, ${n}, beruntung banget bisa liburan ke sini!`,
    showHero: true,
    emoji: "✨",
  },
  {
    bg: "from-sky via-primary/40 to-sea-deep",
    speaker: "turtle",
    text: () => `Halo Pahlawan kecil… aku Tora, penyu tertua di pantai ini. Tolong dengarkan aku — pantai kami sedang dalam bahaya!`,
    showHero: true,
    showTurtle: true,
    emoji: "🐢",
  },
  {
    bg: "from-trash via-trash-glow to-sea-deep",
    speaker: "narrator",
    text: () => `Tiba-tiba langit menggelap… energi gelap muncul dari laut, memuntahkan monster-monster sampah ke pantai!`,
    showHero: true,
    showDark: true,
    emoji: "⚡",
  },
  {
    bg: "from-trash via-destructive/60 to-sea-deep",
    speaker: "hero",
    text: (n) => `Astaga! Sampah-sampah ini hidup?! Kalau dibiarkan, penyu seperti Tora bisa makan plastik & sakit. Aku harus bertindak!`,
    showHero: true,
    showDark: true,
    emoji: "😱",
  },
  {
    bg: "from-secondary via-primary to-sea",
    speaker: "hero",
    text: (n) => `Tunggu di sini ya, Tora. ${n} akan bersihkan pantai ini sampai bersih! Saatnya jadi PAHLAWAN DERAWAN! ⚔️`,
    showHero: true,
    showTurtle: true,
    showFist: true,
    emoji: "💪",
  },
];

const PANELS_STAGE2: Panel[] = [
  {
    bg: "from-yellow-200 via sky-sky-300 to-sky-500", 
    speaker: "hero",
    text: (n) => `Pantainya sudah bersih, tapi Tora bilang bahaya berikutnya ada di bawah laut… Saatnya menyelam!`,
    showHero: true,
    emoji: "🌞",
  },
  {
    bg: "from-sea via-sea-deep to-trash",
    speaker: "narrator",
    text: () => `Di kedalaman karang Derawan, ${"".length === 0 ? "ribuan" : ""} ikan kecil berenang ketakutan. Sesuatu yang besar telah datang…`,
    showHero: true,
    emoji: "🌊",
  },
  {
    bg: "from-sea-deep via-trash to-trash-glow",
    speaker: "hero",
    text: (n) => `Jaring-jaring hantu! Tumpahan oli! Karang yang dulu warna-warni jadi pucat semua… Ini lebih parah dari pantai!`,
    showHero: true,
    showDark: true,
    emoji: "💔",
  },
  {
    bg: "from-trash via-destructive/60 to-sea-deep",
    speaker: "hero",
    text: (n) => `Tidak ada waktu untuk menyerah, ${n}! Karang-karang ini rumah bagi ratusan jenis ikan. Aku akan selamatkan mereka semua!`,
    showHero: true,
    showDark: true,
    showFist: true,
    emoji: "🔥",
  },
];

const PANELS_STAGE3: Panel[] = [
  {
    bg: "from-sea-deep via-trash to-foreground",
    speaker: "narrator",
    text: () => `Jauh di palung gelap Derawan, sumber semua pencemaran bersembunyi… seekor raksasa dari plastik bertahun-tahun lamanya.`,
    showHero: true,
    emoji: "🌌",
  },
  {
    bg: "from-foreground via-trash to-trash-glow",
    speaker: "turtle",
    text: (n) => `${n}, ini misi terakhirmu. Kalau Plastic Tyrant kalah, laut Derawan akan benar-benar pulih untuk selamanya.`,
    showHero: true,
    showTurtle: true,
    emoji: "🐢",
  },
  {
    bg: "from-trash via-destructive to-trash-glow",
    speaker: "hero",
    text: () => `Aku sudah bersihkan pantai dan terumbunya. Sekarang giliran sumbernya. Aku takut… tapi aku harus berani!`,
    showHero: true,
    showDark: true,
    emoji: "💧",
  },
  {
    bg: "from-trash-glow via-destructive to-foreground",
    speaker: "hero",
    text: (n) => `Demi Tora, demi semua ikan, demi Pulau Derawan… ${n} siap! AYO HABISI PLASTIC TYRANT! ⚡`,
    showHero: true,
    showFist: true,
    showDark: true,
    emoji: "⚡",
  },
];

export function Cutscene({ onFinish, stage = 1 }: CutsceneProps) {
  const PANELS = stage === 3 ? PANELS_STAGE3 : stage === 2 ? PANELS_STAGE2 : PANELS_STAGE1;
  const playerName = loadSettings().playerName || "Pahlawan";
  const [idx, setIdx] = useState(0);
  const panel = PANELS[idx];

  const next = () => {
    SFX.click();
    if (idx < PANELS.length - 1) setIdx(idx + 1);
    else onFinish();
  };

  const skip = () => {
    SFX.click();
    onFinish();
  };

  const speakerName =
    panel.speaker === "hero" ? playerName.toUpperCase()
    : panel.speaker === "turtle" ? "TORA SI PENYU"
    : "NARATOR";
  const speakerColor =
    panel.speaker === "hero" ? "bg-secondary text-secondary-foreground"
    : panel.speaker === "turtle" ? "bg-accent text-accent-foreground"
    : "bg-foreground text-card";

  return (
    <div className="relative flex h-full w-full flex-col">
      <button
        onClick={skip}
        className="absolute right-4 top-4 z-20 rounded border-2 border-foreground bg-card px-3 py-1 font-pixel text-[10px] shadow-pixel hover:bg-secondary"
      >
        SKIP ▶▶
      </button>

      {/* Stage indicator */}
      <div className="absolute left-4 top-4 z-20 rounded border-2 border-foreground bg-card px-3 py-1 font-pixel text-[10px] shadow-pixel">
        STAGE {stage}
      </div>

      {/* Panel area */}
      <div
        key={idx}
        className={`relative flex-1 overflow-hidden bg-gradient-to-b ${panel.bg} animate-pop-in`}
      >
        {/* Beach floor */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-sand to-sand-dark" />

        {/* Wave hints */}
        <div className="absolute inset-x-0 bottom-1/4 h-2 bg-primary/40" />

        {/* Big emoji floating */}
        {panel.emoji && (
          <div className="absolute left-1/2 top-8 -translate-x-1/2 animate-bob text-5xl sm:text-6xl">
            {panel.emoji}
          </div>
        )}

        {/* Hero */}
        {panel.showHero && (
          <div className="absolute bottom-[20%] left-[25%] -translate-x-1/2 animate-bob">
            <PixelHero showFist={panel.showFist} />
            <div className="mt-1 text-center font-pixel text-[8px] text-foreground/80 bg-card/70 rounded px-1">
              {playerName}
            </div>
          </div>
        )}

        {/* Turtle */}
        {panel.showTurtle && (
          <div
            className="absolute bottom-[18%] right-[22%] translate-x-1/2 animate-bob"
            style={{ animationDelay: "0.4s" }}
          >
            <PixelTurtle />
            <div className="mt-1 text-center font-pixel text-[8px] text-foreground/80 bg-card/70 rounded px-1">
              Tora
            </div>
          </div>
        )}

        {/* Dark monsters */}
        {panel.showDark && (
          <>
            <div className="absolute right-4 top-4 h-32 w-32 animate-flash rounded-full bg-trash-glow/60 blur-2xl sm:right-12 sm:top-12 sm:h-48 sm:w-48" />
            <div className="absolute bottom-[22%] right-[10%] animate-bob">
              <PixelMonster />
            </div>
            <div
              className="absolute bottom-[22%] left-[10%] animate-bob"
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
          <div className={`mb-2 inline-block rounded border-2 border-foreground px-2 py-0.5 font-pixel text-[8px] uppercase ${speakerColor}`}>
            {speakerName}
          </div>
          <p
            key={idx}
            className="mb-3 font-body text-sm leading-relaxed text-foreground animate-pop-in sm:text-base"
          >
            {panel.text(playerName)}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-pixel text-[8px] text-muted-foreground">
              {idx + 1} / {PANELS.length}
            </span>
            <button
              onClick={next}
              className="pixel-btn rounded border-4 border-foreground bg-primary px-5 py-2 font-pixel text-xs text-primary-foreground shadow-pixel active:translate-y-1 hover:scale-105"
            >
              {idx < PANELS.length - 1 ? "LANJUT ▶" : "MULAI ⚔"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PixelHero({ showFist }: { showFist?: boolean }) {
  return (
    <svg viewBox="0 0 16 18" className="h-32 w-32 sm:h-40 sm:w-40" shapeRendering="crispEdges">
      <g fill="#ffd84d"><rect x="4" y="0" width="8" height="1" /><rect x="3" y="1" width="10" height="2" /></g>
      <g fill="#e6a82a"><rect x="2" y="2" width="12" height="1" /></g>
      <g fill="#5a3a1a"><rect x="3" y="3" width="10" height="1" /></g>
      <g fill="#f4c89a"><rect x="3" y="4" width="10" height="5" /></g>
      <g fill="#222233">
        <rect x="5" y="5" width="2" height="1" />
        <rect x="9" y="5" width="2" height="1" />
        <rect x="6" y="7" width="4" height="1" />
      </g>
      <g fill="#e8423a"><rect x="2" y="9" width="12" height="4" /></g>
      <g fill="#3a4a8a"><rect x="2" y="13" width="12" height="3" /></g>
      <g fill="#222233"><rect x="3" y="16" width="3" height="2" /><rect x="10" y="16" width="3" height="2" /></g>
      {showFist && <g fill="#f4c89a"><rect x="6" y="6" width="4" height="3" /></g>}
    </svg>
  );
}

function PixelTurtle() {
  return (
    <svg viewBox="0 0 18 12" className="h-24 w-32 sm:h-28 sm:w-40" shapeRendering="crispEdges">
      <g fill="hsl(145, 60%, 30%)">
        <rect x="3" y="3" width="11" height="6" />
        <rect x="4" y="2" width="9" height="1" />
      </g>
      <g fill="hsl(145, 65%, 45%)">
        <rect x="4" y="4" width="3" height="2" />
        <rect x="8" y="4" width="3" height="2" />
        <rect x="4" y="7" width="3" height="2" />
        <rect x="8" y="7" width="3" height="2" />
      </g>
      <g fill="hsl(145, 50%, 45%)">
        <rect x="14" y="4" width="3" height="3" />
      </g>
      <rect x="15" y="5" width="1" height="1" fill="#222" />
      <g fill="hsl(145, 50%, 35%)">
        <rect x="2" y="9" width="3" height="2" />
        <rect x="12" y="9" width="3" height="2" />
        <rect x="3" y="2" width="2" height="1" />
        <rect x="12" y="2" width="2" height="1" />
      </g>
    </svg>
  );
}

function PixelMonster({ small }: { small?: boolean }) {
  const size = small ? "h-16 w-16 sm:h-24 sm:w-24" : "h-24 w-24 sm:h-32 sm:w-32";
  return (
    <svg viewBox="0 0 12 12" className={size} shapeRendering="crispEdges">
      <g fill="#7d2db5"><rect x="3" y="0" width="6" height="1" /><rect x="2" y="1" width="8" height="1" /></g>
      <g fill="#b96bff"><rect x="3" y="1" width="6" height="1" /><rect x="2" y="2" width="8" height="1" /></g>
      <g fill="#222233"><rect x="3" y="2" width="2" height="1" /><rect x="7" y="2" width="2" height="1" /></g>
      <g fill="#86bf3a"><rect x="2" y="3" width="8" height="2" /></g>
      <g fill="#3a3550"><rect x="1" y="5" width="10" height="5" /></g>
      <g fill="#9a9a9a"><rect x="2" y="6" width="2" height="2" /><rect x="6" y="7" width="2" height="1" /></g>
      <g fill="#222233"><rect x="2" y="10" width="2" height="2" /><rect x="8" y="10" width="2" height="2" /></g>
    </svg>
  );
}
