import { useEffect, useMemo, useState } from "react";
import titleBg from "@/assets/title-bg.jpg";
import titleLogo from "@/assets/title-logo.png";
import turtleIdle from "@/assets/turtle-idle.png";
import turtleWave from "@/assets/turtle-wave.png";
import beachBag from "@/assets/beach-bag.png";
import sunglasses from "@/assets/sunglasses.png";
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
    const id = setInterval(() => setTurtleFrame((f) => (f + 1) % 2), 600);
    return () => clearInterval(id);
  }, []);

  const startMenuMusic = () => {
    unlockAudio();
    playMusic("menu");
  };

  const sparkles = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        left: (i * 53) % 100,
        top: (i * 37) % 90,
        delay: (i * 0.31) % 4,
        size: 2 + ((i * 5) % 3),
      })),
    []
  );

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onPointerDown={startMenuMusic}
    >
      {/* Background pantai Derawan */}
      <img
        src={titleBg}
        className="absolute inset-0 h-full w-full object-cover"
        alt="Pulau Derawan"
        draggable={false}
      />

      {/* Logo + Penyu — selalu center, penyu di samping kanan */}
      <div className="absolute left-1/2 top-[8%] z-20 flex -translate-x-1/2 items-start justify-center sm:top-[2%]">
        <img
          src={titleLogo}
          className="h-auto w-[85vw] max-w-[700px] animate-float-soft drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
          alt="Derawan Heroes"
          draggable={false}
        />
        <div
          className="relative -ml-10 sm:-ml-16 animate-float-soft"
          style={{ width: "clamp(100px, 28vw, 190px)", aspectRatio: "1 / 1" }}
        >
          <img
            src={turtleIdle}
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-200"
            style={{ opacity: turtleFrame === 0 ? 1 : 0 }}
            alt="Tora si penyu"
            draggable={false}
          />
          <img
            src={turtleWave}
            className="absolute inset-0 h-full w-full object-contain transition-opacity duration-200"
            style={{ opacity: turtleFrame === 1 ? 1 : 0 }}
            alt=""
            aria-hidden
            draggable={false}
          />
        </div>
      </div>

      {/* Properti pantai pojok kiri bawah */}
      <div className="pointer-events-none absolute bottom-[3%] left-[3%] z-10 hidden items-end gap-2 sm:flex">
        <img
          src={beachBag}
          className="h-auto w-[clamp(90px,18vw,220px)] animate-float-soft drop-shadow-[0_6px_12px_rgba(0,0,0,0.25)]"
          alt="Tas pantai"
          draggable={false}
        />
        <img
          src={sunglasses}
          className="mb-2 h-auto w-[clamp(50px,10vw,120px)] animate-float-soft drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
          style={{ animationDelay: "0.3s" }}
          alt="Kacamata"
          draggable={false}
        />
      </div>

      {/* Sparkle lembut */}
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
              opacity: 0.6,
            }}
          />
        </div>
      ))}

      {/* Vignette halus */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Menu tombol */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end p-4 sm:p-6">
        <div className="mb-16 flex w-full max-w-[320px] flex-col gap-4 sm:mb-24">
          <button
            onClick={() => {
              unlockAudio();
              SFX.click();
              onPlay();
            }}
            className="group relative w-full rounded-2xl border-2 border-white/40 px-6 py-4 font-bold text-white shadow-[0_6px_0_#145c32,0_10px_20px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-1 hover:scale-[1.03] active:translate-y-1 active:shadow-[0_2px_0_#145c32,0_4px_8px_rgba(0,0,0,0.25)] sm:text-lg"
            style={{
              background: "linear-gradient(180deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)",
            }}
            aria-label="Mulai bermain"
          >
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
            className="group relative w-full rounded-2xl border-2 border-white/40 px-6 py-3 font-bold text-white shadow-[0_6px_0_#5b21b6,0_10px_20px_rgba(0,0,0,0.25)] transition-all hover:-translate-y-1 hover:scale-[1.03] active:translate-y-1 active:shadow-[0_2px_0_#5b21b6,0_4px_8px_rgba(0,0,0,0.25)] sm:text-base"
            style={{
              background: "linear-gradient(180deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)",
            }}
            aria-label="Pengaturan"
          >
            <span className="relative flex items-center justify-center gap-2">
              <span>⚙</span> PENGATURAN
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
