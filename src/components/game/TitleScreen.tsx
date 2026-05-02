import { useEffect, useMemo } from "react";
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

  // Pre-compute random sparkles & fish so they don't re-roll every render
  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        left: (i * 53) % 100,
        top: (i * 37) % 70,
        delay: (i * 0.27) % 4,
        size: 2 + ((i * 7) % 4),
      })),
    []
  );

  const fish = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        top: 62 + ((i * 11) % 20),
        delay: i * 1.6,
        duration: 14 + ((i * 3) % 8),
        // arah berenang: true = kanan (default), false = kiri (perlu di-flip + animasi balik)
        goesRight: i % 2 === 0,
        color: ["hsl(15,90%,60%)", "hsl(45,95%,60%)", "hsl(195,90%,55%)", "hsl(330,80%,65%)", "hsl(280,70%,65%)"][i],
      })),
    []
  );

  const clouds = useMemo(
    () =>
      [
        { top: 8, delay: 0, duration: 60 },
        { top: 16, delay: 12, duration: 80 },
        { top: 4, delay: 30, duration: 70 },
      ],
    []
  );

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[hsl(15,85%,65%)]"
      onPointerDown={startMenuMusic}
    >
      {/* ============ SKY GRADIENT (sunset) ============ */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(280,70%,40%) 0%, hsl(320,75%,55%) 18%, hsl(15,90%,60%) 38%, hsl(38,95%,65%) 55%, hsl(195,80%,55%) 70%, hsl(210,80%,40%) 85%, hsl(220,70%,28%) 100%)",
        }}
      />

      {/* ============ SUN with glow rings ============ */}
      <div className="absolute" style={{ top: "18%", left: "62%" }}>
        <div className="relative">
          {/* outer glow */}
          <div
            className="absolute -inset-32 rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(45,100%,75%) 0%, transparent 70%)" }}
          />
          {/* glow rings rotating */}
          <div className="absolute -inset-20 turtle-swirl">
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, hsl(45,100%,80%,0.4) 25%, transparent 50%, hsl(45,100%,80%,0.4) 75%, transparent 100%)",
              }}
            />
          </div>
          {/* sun core */}
          <div
            className="relative h-32 w-32 rounded-full sm:h-40 sm:w-40"
            style={{
              background: "radial-gradient(circle at 35% 35%, hsl(50,100%,92%), hsl(40,100%,65%) 60%, hsl(20,100%,55%) 100%)",
              boxShadow: "0 0 80px hsl(40,100%,65%), 0 0 140px hsl(20,100%,55%,0.6)",
            }}
          />
        </div>
      </div>

      {/* ============ CLOUDS (parallax) ============ */}
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute cloud-drift"
          style={{
            top: `${c.top}%`,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <div className="flex items-center gap-1 opacity-80">
            <div className="h-3 w-10 rounded-sm bg-white sm:h-4 sm:w-14" />
            <div className="h-4 w-14 rounded-sm bg-white sm:h-5 sm:w-20" />
            <div className="h-3 w-8 rounded-sm bg-white sm:h-4 sm:w-12" />
          </div>
        </div>
      ))}

      {/* ============ DISTANT MOUNTAINS / ISLANDS ============ */}
      <svg
        viewBox="0 0 1280 200"
        preserveAspectRatio="none"
        className="absolute left-0 right-0 h-[12%] w-full"
        style={{ top: "48%" }}
      >
        <polygon points="0,200 120,90 240,140 360,70 500,150 640,100 780,160 920,80 1080,140 1280,110 1280,200" fill="hsl(280,40%,25%)" opacity="0.85" />
        <polygon points="0,200 180,140 340,170 520,130 700,180 880,150 1060,180 1280,160 1280,200" fill="hsl(260,45%,18%)" opacity="0.9" />
      </svg>

      {/* ============ SEA LAYERS (parallax waves) ============ */}
      <div className="absolute bottom-0 left-0 right-0 h-[42%]">
        {/* deep sea base */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, hsl(195,90%,55%) 0%, hsl(210,85%,42%) 50%, hsl(220,80%,28%) 100%)",
          }}
        />

        {/* wave layer 1 (back, slow) */}
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute left-0 right-0 top-[6%] h-8 w-[200%] wave-slide-slow"
        >
          <path
            d="M0,40 Q180,10 360,40 T720,40 T1080,40 T1440,40 L1440,80 L0,80 Z M1440,40 Q1620,10 1800,40 T2160,40 T2520,40 T2880,40 L2880,80 L1440,80 Z"
            fill="hsl(195,100%,75%)"
            opacity="0.5"
          />
        </svg>

        {/* wave layer 2 (mid) */}
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute left-0 right-0 top-[18%] h-10 w-[200%] wave-slide-mid"
        >
          <path
            d="M0,40 Q180,15 360,40 T720,40 T1080,40 T1440,40 L1440,80 L0,80 Z M1440,40 Q1620,15 1800,40 T2160,40 T2520,40 T2880,40 L2880,80 L1440,80 Z"
            fill="hsl(195,95%,65%)"
            opacity="0.6"
          />
        </svg>

        {/* wave layer 3 (front, fast) */}
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="absolute left-0 right-0 top-[32%] h-12 w-[200%] wave-slide-fast"
        >
          <path
            d="M0,40 Q180,5 360,40 T720,40 T1080,40 T1440,40 L1440,80 L0,80 Z M1440,40 Q1620,5 1800,40 T2160,40 T2520,40 T2880,40 L2880,80 L1440,80 Z"
            fill="hsl(195,100%,82%)"
            opacity="0.75"
          />
        </svg>

        {/* swimming fish */}
        {fish.map((f, i) => (
          <div
            key={i}
            className="absolute fish-swim"
            style={{
              top: `${f.top}%`,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              transform: f.flip ? "scaleX(-1)" : undefined,
            }}
          >
            <svg width="28" height="14" viewBox="0 0 28 14">
              <ellipse cx="10" cy="7" rx="9" ry="5" fill={f.color} />
              <polygon points="19,7 27,2 27,12" fill={f.color} />
              <circle cx="6" cy="6" r="1.2" fill="white" />
              <circle cx="6" cy="6" r="0.6" fill="hsl(220,40%,15%)" />
            </svg>
          </div>
        ))}
      </div>

      {/* ============ SAND ISLAND (pixel) ============ */}
      <div className="absolute bottom-0 left-1/2 w-[78%] -translate-x-1/2 sm:w-[60%]">
        <svg viewBox="0 0 600 160" preserveAspectRatio="none" className="h-32 w-full sm:h-44">
          <defs>
            <linearGradient id="sandG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(45,90%,82%)" />
              <stop offset="100%" stopColor="hsl(35,70%,55%)" />
            </linearGradient>
          </defs>
          <ellipse cx="300" cy="160" rx="320" ry="80" fill="url(#sandG)" />
          <ellipse cx="300" cy="155" rx="280" ry="60" fill="hsl(48,95%,88%)" opacity="0.6" />
          {/* speckles */}
          {Array.from({ length: 25 }).map((_, i) => (
            <rect
              key={i}
              x={60 + ((i * 41) % 480)}
              y={110 + ((i * 17) % 40)}
              width="3"
              height="3"
              fill="hsl(28,55%,40%)"
              opacity="0.5"
            />
          ))}
        </svg>
      </div>

      {/* ============ PALM TREES ============ */}
      {/* LEFT PALM */}
      <div className="absolute bottom-[12%] left-[6%] sm:left-[10%]" style={{ transformOrigin: "bottom center" }}>
        <div className="palm-sway">
          <svg width="140" height="240" viewBox="0 0 140 240" className="drop-shadow-[4px_4px_0_hsl(220,40%,15%,0.3)]">
            {/* trunk segments */}
            <g>
              {Array.from({ length: 9 }).map((_, i) => (
                <g key={i}>
                  <rect x="62" y={60 + i * 20} width="20" height="18" fill="hsl(28,55%,32%)" />
                  <rect x="60" y={60 + i * 20} width="4" height="18" fill="hsl(28,65%,22%)" />
                  <rect x="78" y={60 + i * 20} width="4" height="18" fill="hsl(28,70%,42%)" />
                  <rect x="62" y={76 + i * 20} width="20" height="2" fill="hsl(28,70%,18%)" />
                </g>
              ))}
            </g>
            {/* coconuts */}
            <circle cx="56" cy="60" r="7" fill="hsl(28,65%,18%)" />
            <circle cx="86" cy="56" r="7" fill="hsl(28,65%,18%)" />
            <circle cx="56" cy="60" r="2" fill="hsl(28,70%,35%)" />
            {/* fronds */}
            <g fill="hsl(145,75%,32%)">
              <ellipse cx="70" cy="50" rx="60" ry="14" transform="rotate(-25 70 50)" />
              <ellipse cx="70" cy="50" rx="60" ry="14" transform="rotate(25 70 50)" />
              <ellipse cx="70" cy="50" rx="55" ry="12" transform="rotate(-55 70 50)" />
              <ellipse cx="70" cy="50" rx="55" ry="12" transform="rotate(55 70 50)" />
              <ellipse cx="70" cy="50" rx="50" ry="10" transform="rotate(-85 70 50)" />
              <ellipse cx="70" cy="50" rx="50" ry="10" transform="rotate(85 70 50)" />
            </g>
            <g fill="hsl(145,80%,48%)">
              <ellipse cx="70" cy="48" rx="40" ry="4" transform="rotate(-25 70 48)" />
              <ellipse cx="70" cy="48" rx="40" ry="4" transform="rotate(25 70 48)" />
              <ellipse cx="70" cy="48" rx="35" ry="3" transform="rotate(-55 70 48)" />
              <ellipse cx="70" cy="48" rx="35" ry="3" transform="rotate(55 70 48)" />
            </g>
          </svg>
        </div>
      </div>

      {/* RIGHT PALM */}
      <div className="absolute bottom-[10%] right-[5%] sm:right-[8%]" style={{ transformOrigin: "bottom center" }}>
        <div className="palm-sway-rev">
          <svg width="160" height="270" viewBox="0 0 140 240" className="drop-shadow-[4px_4px_0_hsl(220,40%,15%,0.3)]">
            <g>
              {Array.from({ length: 10 }).map((_, i) => (
                <g key={i}>
                  <rect x="62" y={50 + i * 20} width="20" height="18" fill="hsl(28,55%,32%)" />
                  <rect x="60" y={50 + i * 20} width="4" height="18" fill="hsl(28,65%,22%)" />
                  <rect x="78" y={50 + i * 20} width="4" height="18" fill="hsl(28,70%,42%)" />
                  <rect x="62" y={66 + i * 20} width="20" height="2" fill="hsl(28,70%,18%)" />
                </g>
              ))}
            </g>
            <circle cx="56" cy="50" r="7" fill="hsl(28,65%,18%)" />
            <circle cx="86" cy="46" r="7" fill="hsl(28,65%,18%)" />
            <g fill="hsl(145,75%,32%)">
              <ellipse cx="70" cy="40" rx="60" ry="14" transform="rotate(-25 70 40)" />
              <ellipse cx="70" cy="40" rx="60" ry="14" transform="rotate(25 70 40)" />
              <ellipse cx="70" cy="40" rx="55" ry="12" transform="rotate(-55 70 40)" />
              <ellipse cx="70" cy="40" rx="55" ry="12" transform="rotate(55 70 40)" />
              <ellipse cx="70" cy="40" rx="50" ry="10" transform="rotate(-85 70 40)" />
              <ellipse cx="70" cy="40" rx="50" ry="10" transform="rotate(85 70 40)" />
            </g>
            <g fill="hsl(145,80%,48%)">
              <ellipse cx="70" cy="38" rx="40" ry="4" transform="rotate(-25 70 38)" />
              <ellipse cx="70" cy="38" rx="40" ry="4" transform="rotate(25 70 38)" />
            </g>
          </svg>
        </div>
      </div>

      {/* ============ TURTLE TORA (chibi, lebih ekspresif) ============ */}
      <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 animate-bob">
        {/* splash water under turtle */}
        <div className="absolute -bottom-2 left-1/2 h-3 w-32 -translate-x-1/2 rounded-full bg-white/40 blur-sm" />
        <svg width="180" height="140" viewBox="0 0 180 140" className="drop-shadow-[6px_6px_0_hsl(220,40%,15%,0.4)]">
          {/* shadow */}
          <ellipse cx="90" cy="130" rx="70" ry="6" fill="hsl(220,40%,15%)" opacity="0.3" />
          {/* back legs */}
          <rect x="20" y="90" width="22" height="16" fill="hsl(145,55%,40%)" rx="3" />
          <rect x="138" y="90" width="22" height="16" fill="hsl(145,55%,40%)" rx="3" />
          {/* shell back */}
          <ellipse cx="90" cy="78" rx="60" ry="38" fill="hsl(145,60%,32%)" />
          <ellipse cx="90" cy="74" rx="56" ry="34" fill="hsl(145,65%,42%)" />
          {/* shell pattern (hexagons) */}
          <g fill="hsl(35,75%,55%)" stroke="hsl(28,60%,25%)" strokeWidth="2">
            <polygon points="90,55 105,63 105,79 90,87 75,79 75,63" />
            <polygon points="65,68 78,75 78,89 65,96 52,89 52,75" />
            <polygon points="115,68 128,75 128,89 115,96 102,89 102,75" />
          </g>
          {/* front legs */}
          <rect x="32" y="78" width="20" height="14" fill="hsl(145,55%,45%)" rx="3" />
          <rect x="128" y="78" width="20" height="14" fill="hsl(145,55%,45%)" rx="3" />
          {/* head */}
          <ellipse cx="155" cy="72" rx="22" ry="18" fill="hsl(145,55%,50%)" />
          <ellipse cx="155" cy="68" rx="20" ry="14" fill="hsl(145,60%,58%)" />
          {/* cheeks */}
          <circle cx="148" cy="76" r="3" fill="hsl(0,75%,65%)" opacity="0.6" />
          <circle cx="166" cy="76" r="3" fill="hsl(0,75%,65%)" opacity="0.6" />
          {/* eyes */}
          <circle cx="150" cy="68" r="4" fill="white" />
          <circle cx="164" cy="68" r="4" fill="white" />
          <circle cx="151" cy="69" r="2.5" fill="hsl(220,50%,15%)" />
          <circle cx="165" cy="69" r="2.5" fill="hsl(220,50%,15%)" />
          <circle cx="151.5" cy="68" r="0.8" fill="white" />
          <circle cx="165.5" cy="68" r="0.8" fill="white" />
          {/* smile */}
          <path d="M 152 78 Q 157 82 162 78" stroke="hsl(220,50%,15%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* ============ SPARKLES (floating particles) ============ */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          className="absolute sparkle"
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
              boxShadow: `0 0 ${s.size * 3}px hsl(45,100%,75%)`,
            }}
          />
        </div>
      ))}

      {/* ============ FOREGROUND VIGNETTE ============ */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />

      {/* ============ TITLE & MENU ============ */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-4 sm:p-6">
        {/* TITLE */}
        <div className="mt-4 text-center sm:mt-8">
          <div className="title-pop relative inline-block">
            {/* glow halo */}
            <div className="absolute -inset-6 rounded-full bg-[hsl(45,100%,70%)] opacity-40 blur-2xl" />
            {/* badge */}
            <div className="relative">
              {/* shadow stack for 3D pixel look */}
              <h1
                className="font-pixel text-3xl leading-tight sm:text-5xl md:text-6xl"
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
                <span className="title-letter inline-block" style={{ animationDelay: "0s" }}>D</span>
                <span className="title-letter inline-block" style={{ animationDelay: "0.08s" }}>E</span>
                <span className="title-letter inline-block" style={{ animationDelay: "0.16s" }}>R</span>
                <span className="title-letter inline-block" style={{ animationDelay: "0.24s" }}>A</span>
                <span className="title-letter inline-block" style={{ animationDelay: "0.32s" }}>W</span>
                <span className="title-letter inline-block" style={{ animationDelay: "0.4s" }}>A</span>
                <span className="title-letter inline-block" style={{ animationDelay: "0.48s" }}>N</span>
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
              {/* shine sweep */}
              <div className="title-shine pointer-events-none absolute inset-0 overflow-hidden">
                <div className="shine-bar" />
              </div>
            </div>
            {/* subtitle ribbon */}
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
