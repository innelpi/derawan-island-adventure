import { useState } from "react";
import { SFX } from "@/game/audio";
import { loadSettings } from "@/game/settings";
import type { StageId } from "@/game/types";
import bgPanelBeach from "@/assets/bg-panel-beach.jpg";
import bgPanelSea from "@/assets/bg-panel-sea.jpg";
import bgPanelDark from "@/assets/bg-panel-dark.jpg";
import heroCutscene from "@/assets/hero-cutscene.png";
import toraCutscene from "@/assets/tora-cutscene.png";
import monsterShadow from "@/assets/monster-shadow.png";

interface CutsceneProps {
  onFinish: () => void;
  stage?: StageId;
}

type Speaker = "hero" | "turtle" | "narrator";
interface Panel {
  bg: "beach" | "sea" | "dark";
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
    bg: "beach",
    speaker: "hero",
    text: (n) => `Akhirnya sampai juga di Pulau Derawan! Lihat deh, pasirnya putih banget, lautnya jernih… aku, ${n}, beruntung banget bisa liburan ke sini!`,
    showHero: true,
    emoji: "✨",
  },
  {
    bg: "sea",
    speaker: "turtle",
    text: () => `Halo Pahlawan kecil… aku Tora, penyu tertua di pantai ini. Tolong dengarkan aku — pantai kami sedang dalam bahaya!`,
    showHero: true,
    showTurtle: true,
    emoji: "🐢",
  },
  {
    bg: "dark",
    speaker: "narrator",
    text: () => `Tiba-tiba langit menggelap… energi gelap muncul dari laut, memuntahkan monster-monster sampah ke pantai!`,
    showHero: true,
    showDark: true,
    emoji: "⚡",
  },
  {
    bg: "dark",
    speaker: "hero",
    text: (n) => `Astaga! Sampah-sampah ini hidup?! Kalau dibiarkan, penyu seperti Tora bisa makan plastik & sakit. Aku harus bertindak!`,
    showHero: true,
    showDark: true,
    emoji: "😱",
  },
  {
    bg: "beach",
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
    bg: "beach",
    speaker: "hero",
    text: (n) => `Pantainya sudah bersih, tapi Tora bilang bahaya berikutnya ada di bawah laut… Saatnya menyelam!`,
    showHero: true,
    emoji: "🌞",
  },
  {
    bg: "sea",
    speaker: "narrator",
    text: () => `Di kedalaman karang Derawan, ribuan ikan kecil berenang ketakutan. Sesuatu yang besar telah datang…`,
    showHero: true,
    emoji: "🌊",
  },
  {
    bg: "dark",
    speaker: "hero",
    text: (n) => `Jaring-jaring hantu! Tumpahan oli! Karang yang dulu warna-warni jadi pucat semua… Ini lebih parah dari pantai!`,
    showHero: true,
    showDark: true,
    emoji: "💔",
  },
  {
    bg: "dark",
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
    bg: "dark",
    speaker: "narrator",
    text: () => `Jauh di palung gelap Derawan, sumber semua pencemaran bersembunyi… seekor raksasa dari plastik bertahun-tahun lamanya.`,
    showHero: true,
    emoji: "🌌",
  },
  {
    bg: "dark",
    speaker: "turtle",
    text: (n) => `${n}, ini misi terakhirmu. Kalau Plastic Tyrant kalah, laut Derawan akan benar-benar pulih untuk selamanya.`,
    showHero: true,
    showTurtle: true,
    emoji: "🐢",
  },
  {
    bg: "dark",
    speaker: "hero",
    text: () => `Aku sudah bersihkan pantai dan terumbunya. Sekarang giliran sumbernya. Aku takut… tapi aku harus berani!`,
    showHero: true,
    showDark: true,
    emoji: "💧",
  },
  {
    bg: "dark",
    speaker: "hero",
    text: (n) => `Demi Tora, demi semua ikan, demi Pulau Derawan… ${n} siap! AYO HABISI PLASTIC TYRANT! ⚡`,
    showHero: true,
    showFist: true,
    showDark: true,
    emoji: "⚡",
  },
];

const BG_MAP = {
  beach: bgPanelBeach,
  sea: bgPanelSea,
  dark: bgPanelDark,
};

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
    panel.speaker === "hero" ? "bg-yellow-400 text-slate-900"
    : panel.speaker === "turtle" ? "bg-emerald-500 text-white"
    : "bg-slate-800 text-white";

  const bgImage = BG_MAP[panel.bg];

  return (
    <div className="relative flex h-full w-full flex-col">
      <button
        onClick={skip}
        className="absolute right-4 top-4 z-20 rounded-full border-2 border-white/50 bg-black/40 px-4 py-1.5 font-bold text-xs text-white shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-black/60"
      >
        SKIP ▶▶
      </button>

      {/* Stage indicator */}
      <div className="absolute left-4 top-4 z-20 rounded-full border-2 border-white/50 bg-black/40 px-4 py-1.5 font-bold text-xs text-white shadow-lg backdrop-blur-sm">
        STAGE {stage}
      </div>

      {/* Panel area */}
      <div
        key={idx}
        className="relative flex-1 overflow-hidden animate-pop-in"
      >
        <img
          src={bgImage}
          className="absolute inset-0 h-full w-full object-cover"
          alt="Latar cerita"
          draggable={false}
        />

        {/* Dark overlay for dark panels */}
        {panel.bg === "dark" && (
          <div className="absolute inset-0 bg-indigo-950/40" />
        )}

        {/* Big emoji floating */}
        {panel.emoji && (
          <div className="absolute left-1/2 top-6 -translate-x-1/2 animate-bob text-5xl sm:text-6xl drop-shadow-lg">
            {panel.emoji}
          </div>
        )}

        {/* Hero */}
        {panel.showHero && (
          <div
            className={`absolute bottom-[12%] left-[18%] z-10 -translate-x-1/2 animate-float-soft ${panel.showFist ? "rotate-[-2deg]" : ""}`}
            style={{ width: "clamp(110px, 22vh, 220px)" }}
          >
            <img
              src={heroCutscene}
              className="h-auto w-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
              alt={playerName}
              draggable={false}
            />
            <div className="mt-1 rounded-full bg-white/90 px-3 py-1 text-center text-xs font-bold text-slate-800 shadow-sm">
              {playerName}
            </div>
          </div>
        )}

        {/* Turtle */}
        {panel.showTurtle && (
          <div
            className="absolute bottom-[12%] right-[14%] z-10 translate-x-1/2 animate-float-soft"
            style={{ animationDelay: "0.4s", width: "clamp(110px, 22vh, 220px)" }}
          >
            <img
              src={toraCutscene}
              className="h-auto w-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
              alt="Tora"
              draggable={false}
            />
            <div className="mt-1 rounded-full bg-white/90 px-3 py-1 text-center text-xs font-bold text-slate-800 shadow-sm">
              Tora
            </div>
          </div>
        )}

        {/* Dark monsters */}
        {panel.showDark && (
          <>
            <div className="absolute right-4 top-4 h-32 w-32 animate-flash rounded-full bg-purple-500/50 blur-2xl sm:right-12 sm:top-12 sm:h-48 sm:w-48" />
            <div className="absolute bottom-[22%] right-[8%] w-[clamp(90px,18vh,180px)] animate-float-soft">
              <img
                src={monsterShadow}
                className="h-auto w-full drop-shadow-[0_8px_20px_rgba(124,58,237,0.5)]"
                alt="Monster sampah"
                draggable={false}
              />
            </div>
            <div
              className="absolute bottom-[24%] left-[8%] w-[clamp(60px,12vh,120px)] animate-float-soft"
              style={{ animationDelay: "0.3s" }}
            >
              <img
                src={monsterShadow}
                className="h-auto w-full opacity-75 drop-shadow-[0_6px_16px_rgba(124,58,237,0.4)]"
                alt="Monster sampah"
                draggable={false}
              />
            </div>
          </>
        )}
      </div>

      {/* Dialog box */}
      <div className="z-10 border-t-4 border-slate-800 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] sm:p-6">
        <div className="mx-auto max-w-2xl">
          <div className={`mb-2 inline-block rounded-full border-2 border-slate-800 px-3 py-1 text-[10px] font-bold uppercase ${speakerColor}`}>
            {speakerName}
          </div>
          <p
            key={idx}
            className="mb-3 text-sm leading-relaxed text-slate-800 animate-pop-in sm:text-base"
          >
            {panel.text(playerName)}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500">
              {idx + 1} / {PANELS.length}
            </span>
            <button
              onClick={next}
              className="rounded-full bg-gradient-to-b from-sky-400 to-sky-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition hover:scale-105 active:translate-y-1"
            >
              {idx < PANELS.length - 1 ? "LANJUT ▶" : "MULAI ⚔"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
