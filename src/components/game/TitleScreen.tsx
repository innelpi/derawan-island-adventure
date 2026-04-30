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

      {/* Buttons positioned over the existing button area in the image */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-3 pb-[6%] sm:pb-[8%]">
        <div className="flex w-full max-w-[260px] flex-col gap-3 px-4">
          <button
            onClick={() => {
              unlockAudio();
              SFX.click();
              onPlay();
            }}
            className="pixel-btn rounded-md border-4 border-foreground bg-secondary px-6 py-3 font-pixel text-base text-secondary-foreground shadow-pixel-lg active:translate-y-1 active:shadow-pixel"
            aria-label="Mulai bermain"
          >
            ▶ BERMAIN
          </button>
          <button
            onClick={() => {
              SFX.click();
              onSettings();
            }}
            className="pixel-btn rounded-md border-4 border-foreground bg-primary px-6 py-3 font-pixel text-sm text-primary-foreground shadow-pixel active:translate-y-1"
          >
            ⚙ PENGATURAN
          </button>
        </div>
      </div>
    </div>
  );
}
