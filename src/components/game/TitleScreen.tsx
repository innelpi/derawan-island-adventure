import { useEffect, useMemo, useState } from "react";
import bgSkySea from "@/assets/bg-sky-sea.png";
import logoTitle from "@/assets/title-game.png";
import turtleFrame1 from "@/assets/turtle-frame1.png";
import turtleFrame2 from "@/assets/turtle-frame2.png";
import beachItems from "@/assets/set-up-pixels.png";
import { SFX, unlockAudio } from "@/game/audio";
import { playMusic, setMusicMuted, setMusicVolume } from "@/game/music";
import { loadSettings } from "@/game/settings";

interface TitleScreenProps {
  onPlay: () => void;
  onSettings: () => void;
}

export function TitleScreen({ onPlay, onSettings }: TitleScreenProps) {
  const [turtleFrame, setTurtleFrame] = useState(0);

  useEffect(() => {
    const s = loadSettings();
    setMusicVolume(s.musicVolume);
    setMusicMuted(s.muted);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTurtleFrame((f) => (f + 1) % 2), 350);
    return () => clearInterval(id);
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

        {/* 2. Logo Judul + Penyu — center konsisten di semua layar */}
        <div
          className="absolute top-[8%] sm:top-[10%] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center gap-0 pointer-events-none"
          style={{ width: "min(92vw, 760px)" }}
        >
          <img
            src={logoTitle}
            className="w-[78%] sm:w-[80%] h-auto animate-float-soft pixelated"
            alt="Derawan Heroes Title"
            draggable={false}
          />
          <div
            className="relative shrink-0 -ml-3 sm:-ml-4 animate-float-soft"
            style={{ width: "min(20vw, 160px)", aspectRatio: "1 / 1" }}
          >
            <img
              src={turtleFrame1}
              className="absolute inset-0 w-full h-full pixelated drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)] transition-opacity duration-75"
              style={{ opacity: turtleFrame === 0 ? 1 : 0 }}
              alt="Turtle Character"
              draggable={false}
            />
            <img
              src={turtleFrame2}
              className="absolute inset-0 w-full h-full pixelated drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)] transition-opacity duration-75"
              style={{ opacity: turtleFrame === 1 ? 1 : 0 }}
              alt=""
              aria-hidden
              draggable={false}
            />
          </div>
        </div>


        {/* 4. Properti Pantai (Tas + Kacamata) — pojok kiri di pasir. Di HP boleh terpotong/hilang */}
        <img
          src={beachItems}
          className="absolute bottom-[2%] left-[10%] w-[320px] sm:w-[440px] md:w-[560px] h-auto pixelated z-10 hidden sm:block"
          style={{ transform: "translateY(50px)" }}
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
      <div className="relative z-10 h-full w-full flex flex-col items-center justify-end p-4 sm:p-6">
        {/* MENU BUTTONS — center konsisten di semua layar */}
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
