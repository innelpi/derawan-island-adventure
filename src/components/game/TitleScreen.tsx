import { useEffect, useMemo } from "react";
import bgSkySea from "@/assets/bg-sky-sea.png";
import logoTitle from "@/assets/title-game.png";
import turtle from "@/assets/turtle.png";
import beachItems from "@/assets/set-up-pixels.png";
import { SFX, unlockAudio } from "@/game/audio";
import { playMusic, setMusicMuted, setMusicVolume } from "@/game/music";
import { loadSettings } from "@/game/settings";

interface TitleScreenProps {
  onPlay: () => void;
  onSettings: () => void;
}

export function TitleScreen({ onPlay, onSettings }: TitleScreenProps) {
  useEffect(() => {
    const s = loadSettings();
    setMusicVolume(s.musicVolume);
    setMusicMuted(s.muted);
  }, []);

  const startMenuMusic = () => {
    unlockAudio();
    playMusic("menu");
  };

  // Sparkle halus untuk overlay
  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        left: (i * 53) % 100,
        top: (i * 37) % 90,
        delay: (i * 0.31) % 4,
        size: 2 + ((i * 5) % 3),
      })),
    []
  );

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[hsl(220,40%,15%)]"
      onPointerDown={startMenuMusic}
    >
{/* ============ BACKGROUND TERPISAH (ANIMASI) ============ */}
      <div className="absolute inset-0 h-full w-full">
        {/* 1. Background Langit & Laut (Statis) */}
        <img 
          src={bgSkySea} 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Background" 
          draggable={false} 
        />

        {/* 2. Logo Judul + Penyu Tora — sejajar, di tengah, tanpa jarak */}
        <div className="absolute top-[6%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-0 w-[95%] max-w-[1000px] z-20">
          <img
            src={logoTitle}
            className="w-[70%] animate-float-soft pixelated"
            alt="Derawan Heroes Title"
            draggable={false}
          />
          <img
            src={turtle}
            className="w-[28%] -ml-2 animate-float-soft pixelated"
            alt="Turtle Character"
            draggable={false}
          />
        </div>

        {/* 4. Properti Pantai (Tas + Kacamata) — pojok kiri, super gede */}
        <img 
          src={beachItems} 
          className="absolute bottom-[2%] left-[1%] w-[380px] sm:w-[500px] md:w-[620px] h-auto pixelated z-10" 
          alt="Beach Items" 
          draggable={false} 
        />
      </div>
      {/* ============ OVERLAY: gelombang transparan tipis ============ */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[20%]">
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute left-0 right-0 top-1/4 h-10 w-[200%] wave-slide-slow"
        >
          <path
            d="M0,40 Q180,15 360,40 T720,40 T1080,40 T1440,40 L1440,80 L0,80 Z M1440,40 Q1620,15 1800,40 T2160,40 T2520,40 T2880,40 L2880,80 L1440,80 Z"
            fill="white"
            opacity="0.18"
          />
        </svg>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute left-0 right-0 top-1/2 h-10 w-[200%] wave-slide-fast"
        >
          <path
            d="M0,40 Q180,5 360,40 T720,40 T1080,40 T1440,40 L1440,80 L0,80 Z M1440,40 Q1620,5 1800,40 T2160,40 T2520,40 T2880,40 L2880,80 L1440,80 Z"
            fill="white"
            opacity="0.22"
          />
        </svg>
      </div>

      {/* ============ OVERLAY: sparkle cahaya ============ */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="pointer-events-none absolute sparkle"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <div
            className="rounded-full bg-white"
            style={{
              width: s.size,
              height: s.size,
              boxShadow: `0 0 ${s.size * 4}px hsl(45,100%,80%)`,
              opacity: 0.7,
            }}
          />
        </div>
      ))}

      {/* ============ VIGNETTE biar teks kontras ============ */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55" />

      {/* ============ MENU ============ */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end p-4 sm:p-6">
        {/* MENU BUTTONS */}
        <div className="mb-16 flex w-full max-w-[280px] flex-col gap-4 sm:mb-24">
          <button
            onClick={() => {
              unlockAudio();
              SFX.click();
              onPlay();
            }}
            className="menu-btn group relative w-full rounded-md border-4 border-foreground px-6 py-4 font-pixel text-base text-white shadow-pixel-lg transition-all hover:scale-[1.05] hover:rotate-[-1deg] active:translate-y-1 active:shadow-pixel sm:text-lg"
            style={{
              background: "linear-gradient(180deg, hsl(145,80%,50%) 0%, hsl(145,75%,38%) 100%)",
              animationDelay: "0s",
            }}
            aria-label="Mulai bermain"
          >
            <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-sm bg-white/25" />
            <span className="relative flex items-center justify-center gap-2">
              <span className="text-xl">▶</span> BERMAIN
            </span>
          </button>

          <button
            onClick={() => {
              unlockAudio();
              SFX.click();
              onSettings();
            }}
            className="menu-btn group relative w-full rounded-md border-4 border-foreground px-6 py-3 font-pixel text-sm text-white shadow-pixel transition-all hover:scale-[1.05] hover:rotate-[1deg] active:translate-y-1 sm:text-base"
            style={{
              background: "linear-gradient(180deg, hsl(280,70%,60%) 0%, hsl(280,65%,42%) 100%)",
              animationDelay: "0.15s",
            }}
          >
            <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-sm bg-white/25" />
            <span className="relative flex items-center justify-center gap-2">
              <span>⚙</span> PENGATURAN
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
