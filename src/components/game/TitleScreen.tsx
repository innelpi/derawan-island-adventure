import { useEffect } from "react";
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
    // Music starts after first user interaction (browser policy)
    // We'll trigger it on the play/settings buttons.
  }, []);

  const startMenuMusic = () => {
    unlockAudio();
    playMusic("menu");
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      onPointerDown={startMenuMusic}
    >
      {/* SCENE — pure SVG, no broken raster background */}
      <svg
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(195, 95%, 78%)" />
            <stop offset="60%" stopColor="hsl(38, 95%, 75%)" />
            <stop offset="100%" stopColor="hsl(38, 95%, 65%)" />
          </linearGradient>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(195, 90%, 55%)" />
            <stop offset="100%" stopColor="hsl(210, 80%, 35%)" />
          </linearGradient>
          <linearGradient id="sand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(45, 75%, 80%)" />
            <stop offset="100%" stopColor="hsl(35, 60%, 65%)" />
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(50, 100%, 90%)" />
            <stop offset="60%" stopColor="hsl(45, 100%, 70%)" />
            <stop offset="100%" stopColor="hsl(40, 100%, 55%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="1280" height="500" fill="url(#sky)" />
        {/* Sun */}
        <circle cx="950" cy="220" r="180" fill="url(#sun)" />
        <circle cx="950" cy="220" r="70" fill="hsl(50, 100%, 90%)" />

        {/* Sea */}
        <rect y="380" width="1280" height="180" fill="url(#sea)" />
        {/* Wave crests */}
        <g fill="hsl(195, 100%, 90%)" opacity="0.7">
          <rect x="0" y="380" width="1280" height="3" />
          <rect x="80" y="395" width="120" height="2" />
          <rect x="280" y="402" width="180" height="2" />
          <rect x="540" y="395" width="100" height="2" />
          <rect x="720" y="408" width="200" height="2" />
          <rect x="980" y="398" width="140" height="2" />
        </g>

        {/* Sand */}
        <rect y="540" width="1280" height="180" fill="url(#sand)" />
        {/* Sand pixel speckles */}
        <g fill="hsl(35, 60%, 55%)" opacity="0.5">
          {Array.from({ length: 60 }).map((_, i) => (
            <rect
              key={i}
              x={(i * 73) % 1280}
              y={550 + ((i * 37) % 160)}
              width="4"
              height="4"
            />
          ))}
        </g>

        {/* Distant island silhouette */}
        <g fill="hsl(180, 50%, 30%)" opacity="0.6">
          <rect x="100" y="370" width="180" height="14" />
          <rect x="120" y="362" width="140" height="10" />
          <rect x="140" y="356" width="100" height="8" />
        </g>

        {/* LEFT PALM — animated sway */}
        <g style={{ transformOrigin: "200px 540px" }} className="palm-sway">
          {/* trunk */}
          <g fill="hsl(28, 50%, 28%)">
            <rect x="195" y="320" width="14" height="220" />
            <rect x="190" y="320" width="4" height="220" fill="hsl(28, 60%, 20%)" />
          </g>
          {/* coconuts */}
          <g fill="hsl(28, 60%, 18%)">
            <rect x="180" y="312" width="12" height="12" />
            <rect x="212" y="316" width="10" height="10" />
          </g>
          {/* leaves (pixel-style fronds) */}
          <g fill="hsl(145, 70%, 35%)">
            {/* top frond */}
            <rect x="200" y="300" width="6" height="14" />
            {/* left frond */}
            <rect x="120" y="306" width="80" height="8" />
            <rect x="130" y="298" width="60" height="6" />
            <rect x="145" y="290" width="40" height="6" />
            {/* right frond */}
            <rect x="200" y="306" width="80" height="8" />
            <rect x="210" y="298" width="60" height="6" />
            <rect x="215" y="290" width="40" height="6" />
            {/* down-left frond */}
            <rect x="130" y="318" width="70" height="6" />
            <rect x="140" y="326" width="55" height="6" />
            {/* down-right frond */}
            <rect x="200" y="318" width="70" height="6" />
            <rect x="205" y="326" width="55" height="6" />
          </g>
          {/* leaf highlights */}
          <g fill="hsl(145, 70%, 50%)">
            <rect x="135" y="306" width="50" height="2" />
            <rect x="215" y="306" width="50" height="2" />
          </g>
        </g>

        {/* RIGHT PALM — opposite sway */}
        <g style={{ transformOrigin: "1100px 540px" }} className="palm-sway-rev">
          <g fill="hsl(28, 50%, 28%)">
            <rect x="1095" y="340" width="14" height="200" />
            <rect x="1090" y="340" width="4" height="200" fill="hsl(28, 60%, 20%)" />
          </g>
          <g fill="hsl(28, 60%, 18%)">
            <rect x="1080" y="332" width="12" height="12" />
            <rect x="1112" y="336" width="10" height="10" />
          </g>
          <g fill="hsl(145, 70%, 35%)">
            <rect x="1100" y="320" width="6" height="14" />
            <rect x="1020" y="326" width="80" height="8" />
            <rect x="1030" y="318" width="60" height="6" />
            <rect x="1045" y="310" width="40" height="6" />
            <rect x="1100" y="326" width="80" height="8" />
            <rect x="1110" y="318" width="60" height="6" />
            <rect x="1115" y="310" width="40" height="6" />
            <rect x="1030" y="338" width="70" height="6" />
            <rect x="1040" y="346" width="55" height="6" />
            <rect x="1100" y="338" width="70" height="6" />
            <rect x="1105" y="346" width="55" height="6" />
          </g>
          <g fill="hsl(145, 70%, 50%)">
            <rect x="1035" y="326" width="50" height="2" />
            <rect x="1115" y="326" width="50" height="2" />
          </g>
        </g>

        {/* TURTLE on the sand — bobbing softly */}
        <g style={{ transformOrigin: "640px 620px" }} className="animate-bob">
          {/* shadow */}
          <ellipse cx="640" cy="675" rx="60" ry="6" fill="hsl(28, 30%, 30%)" opacity="0.3" />
          {/* shell */}
          <g fill="hsl(145, 60%, 30%)">
            <rect x="585" y="620" width="110" height="40" />
            <rect x="595" y="612" width="90" height="8" />
            <rect x="605" y="606" width="70" height="6" />
          </g>
          {/* shell pattern */}
          <g fill="hsl(145, 65%, 45%)">
            <rect x="610" y="618" width="20" height="14" />
            <rect x="640" y="618" width="20" height="14" />
            <rect x="610" y="638" width="20" height="14" />
            <rect x="640" y="638" width="20" height="14" />
          </g>
          {/* head */}
          <g fill="hsl(145, 50%, 45%)">
            <rect x="690" y="630" width="30" height="22" />
            <rect x="715" y="635" width="8" height="12" />
          </g>
          {/* eye */}
          <rect x="710" y="636" width="4" height="4" fill="hsl(220, 40%, 15%)" />
          {/* legs */}
          <g fill="hsl(145, 50%, 35%)">
            <rect x="580" y="650" width="22" height="14" />
            <rect x="678" y="650" width="22" height="14" />
            <rect x="585" y="600" width="14" height="10" />
            <rect x="681" y="600" width="14" height="10" />
          </g>
        </g>

        {/* Bubbles drifting up around turtle */}
        <g fill="white" opacity="0.7">
          <circle cx="560" cy="640" r="3" className="bubble bubble-1" />
          <circle cx="720" cy="640" r="4" className="bubble bubble-2" />
          <circle cx="600" cy="600" r="2" className="bubble bubble-3" />
          <circle cx="700" cy="610" r="3" className="bubble bubble-4" />
        </g>

        {/* Birds */}
        <g fill="hsl(220, 40%, 15%)" className="animate-bob" style={{ animationDuration: "3s" }}>
          <path d="M 300 180 q 8 -8 16 0 q 8 -8 16 0" stroke="hsl(220, 40%, 15%)" strokeWidth="2" fill="none" />
          <path d="M 700 130 q 6 -6 12 0 q 6 -6 12 0" stroke="hsl(220, 40%, 15%)" strokeWidth="2" fill="none" />
          <path d="M 480 90 q 5 -5 10 0 q 5 -5 10 0" stroke="hsl(220, 40%, 15%)" strokeWidth="2" fill="none" />
        </g>
      </svg>

      {/* TITLE & MENU OVERLAY */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-4 sm:p-8">
        {/* Title */}
        <div className="mt-6 text-center animate-title-fade-up sm:mt-10">
          <div className="inline-block rounded-md border-4 border-foreground bg-card/90 px-4 py-2 shadow-pixel-lg backdrop-blur-sm sm:px-6 sm:py-3">
            <h1 className="font-pixel text-2xl leading-tight text-primary text-shadow-pixel sm:text-4xl">
              DERAWAN HERO
            </h1>
            <p className="mt-1 font-body text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
              Petualangan Pulau Derawan
            </p>
          </div>
        </div>

        {/* Menu buttons — floating gently */}
        <div className="mb-8 flex w-full max-w-[260px] flex-col gap-3 sm:mb-12">
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
                unlockAudio();
                SFX.click();
                onSettings();
              }}
              className="pixel-btn w-full rounded-md border-4 border-foreground bg-primary px-6 py-3 font-pixel text-sm text-primary-foreground shadow-pixel transition-transform hover:scale-[1.03] active:translate-y-1"
            >
              ⚙ PENGATURAN
            </button>
          </div>
          <p className="text-center font-body text-[10px] text-foreground/70">
            🎮 Game Edukasi Konservasi Laut
          </p>
        </div>
      </div>
    </div>
  );
}
