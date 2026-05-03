import { useEffect, useMemo } from "react";
import titleBg from "@/assets/title-bg.png";
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
      {/* ============ BACKGROUND IMAGE (HD custom) ============ */}
      <img
        src={titleBg}
        alt="Pulau Derawan"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

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

      {/* ============ TITLE & MENU ============ */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-4 sm:p-6">
        {/* TITLE */}
        <div className="mt-4 text-center sm:mt-8">
          <div className="title-pop relative inline-block">
            <div className="absolute -inset-6 rounded-full bg-[hsl(45,100%,70%)] opacity-40 blur-2xl" />
            <div className="relative">
              <h1
                className="whitespace-nowrap font-pixel text-3xl leading-tight sm:text-5xl md:text-6xl"
                style={{
                  color: "hsl(45,100%,65%)",
                  textShadow: `
                    2px 0 0 hsl(220,50%,12%),
                    -2px 0 0 hsl(220,50%,12%),
                    0 2px 0 hsl(220,50%,12%),
                    0 -2px 0 hsl(220,50%,12%),
                    4px 4px 0 hsl(15,85%,40%),
                    6px 6px 0 hsl(220,50%,12%),
                    8px 8px 20px hsl(220,50%,12%,0.6)
                  `,
                }}
              >
                {"DERAWAN".split("").map((ch, i) => (
                  <span key={i} className="title-letter inline-block" style={{ animationDelay: `${i * 0.08}s` }}>
                    {ch}
                  </span>
                ))}
              </h1>
              <h1
                className="font-pixel text-2xl leading-tight sm:text-4xl md:text-5xl"
                style={{
                  color: "hsl(195,100%,70%)",
                  textShadow: `
                    2px 0 0 hsl(220,50%,12%),
                    -2px 0 0 hsl(220,50%,12%),
                    0 2px 0 hsl(220,50%,12%),
                    0 -2px 0 hsl(220,50%,12%),
                    4px 4px 0 hsl(195,80%,30%),
                    6px 6px 0 hsl(220,50%,12%)
                  `,
                }}
              >
                HERO
              </h1>
              <div className="title-shine pointer-events-none absolute inset-0 overflow-hidden">
                <div className="shine-bar" />
              </div>
            </div>
            <div className="mx-auto mt-3 inline-block rotate-[-2deg] rounded-sm border-2 border-foreground bg-[hsl(0,80%,55%)] px-3 py-1 shadow-pixel">
              <p className="font-pixel text-[9px] uppercase tracking-widest text-white sm:text-xs">
                ⭐ Petualangan Pulau Derawan ⭐
              </p>
            </div>
          </div>
        </div>

        {/* MENU BUTTONS */}
        <div className="mb-6 flex w-full max-w-[280px] flex-col gap-4 sm:mb-10">
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

          <div className="mt-1 flex items-center justify-center gap-2 rounded-sm border-2 border-foreground bg-card/85 px-3 py-1.5 backdrop-blur-sm">
            <span className="text-sm">🌊</span>
            <p className="font-pixel text-[8px] text-foreground sm:text-[10px]">
              GAME EDUKASI KONSERVASI LAUT
            </p>
            <span className="text-sm">🐢</span>
          </div>
        </div>
      </div>
    </div>
  );
}
