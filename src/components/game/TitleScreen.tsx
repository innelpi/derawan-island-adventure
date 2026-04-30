import { useEffect, useState } from "react";
import titleBg from "@/assets/title-bg.png";
import { SFX, unlockAudio } from "@/game/audio";

interface TitleScreenProps {
  onPlay: () => void;
  onSettings: () => void;
}

export function TitleScreen({ onPlay, onSettings }: TitleScreenProps) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = titleBg;
    img.onload = () => setLoaded(true);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-secondary">
      {/* Background image — pixel art beach */}
      <img
        src={titleBg}
        alt="Pulau Derawan pantai pixel art dengan penyu dan logo Derawan Island"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
        style={{ imageRendering: "pixelated" }}
      />

      {/* Overlay animasi — air berputar di belakang penyu + palem swaying */}
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1280 720"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* Posisi penyu di gambar referensi (~ 78%, 47%) */}
          <defs>
            <radialGradient id="waterRing" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="60%" stopColor="rgba(173,232,255,0.55)" />
              <stop offset="80%" stopColor="rgba(120,200,240,0.35)" />
              <stop offset="100%" stopColor="rgba(120,200,240,0)" />
            </radialGradient>
          </defs>

          {/* Cincin air berputar di belakang penyu */}
          <g transform="translate(1000 340)" className="origin-center">
            <g className="turtle-swirl">
              <circle r="90" fill="url(#waterRing)" />
              <ellipse cx="0" cy="0" rx="95" ry="22" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" />
              <ellipse cx="0" cy="0" rx="70" ry="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            </g>
            <g className="turtle-swirl-rev">
              <ellipse cx="0" cy="0" rx="115" ry="28" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="14 10" />
            </g>
            {/* Gelembung kecil */}
            <circle cx="-40" cy="-70" r="4" fill="rgba(255,255,255,0.7)" className="bubble bubble-1" />
            <circle cx="60" cy="-50" r="3" fill="rgba(255,255,255,0.6)" className="bubble bubble-2" />
            <circle cx="20" cy="-90" r="5" fill="rgba(255,255,255,0.7)" className="bubble bubble-3" />
            <circle cx="-60" cy="-30" r="3" fill="rgba(255,255,255,0.5)" className="bubble bubble-4" />
          </g>
        </svg>

        {/* Palem kiri — swaying lembut dari pangkal bawah */}
        <div className="absolute left-0 top-0 h-[55%] w-[28%] origin-bottom-left palm-sway" />
        {/* Palem kanan */}
        <div className="absolute right-0 top-0 h-[55%] w-[28%] origin-bottom-right palm-sway-rev" />
      </div>

      {/* Buttons positioned over the existing button area in the image */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-3 pb-[6%] sm:pb-[8%]">
        <div className="flex w-full max-w-[260px] flex-col gap-3 px-4">
          <div className="animate-float-soft" style={{ animationDelay: "0s" }}>
            <button
              onClick={() => {
                unlockAudio();
                SFX.click();
                onPlay();
              }}
              className="pixel-btn w-full rounded-md border-4 border-foreground bg-secondary px-6 py-3 font-pixel text-base text-secondary-foreground shadow-pixel-lg transition-transform hover:scale-[1.03] active:translate-y-1 active:shadow-pixel"
              aria-label="Mulai bermain"
            >
              ▶ BERMAIN
            </button>
          </div>
          <div className="animate-float-soft" style={{ animationDelay: "0.8s" }}>
            <button
              onClick={() => {
                SFX.click();
                onSettings();
              }}
              className="pixel-btn w-full rounded-md border-4 border-foreground bg-primary px-6 py-3 font-pixel text-sm text-primary-foreground shadow-pixel transition-transform hover:scale-[1.03] active:translate-y-1"
            >
              ⚙ PENGATURAN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
