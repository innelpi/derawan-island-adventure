import { useEffect, useState } from "react";

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background pixel scene */}
      <PixelBeach />

      {/* Title */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-between p-6 sm:p-10">
        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-16">
          <div className="rounded-md border-4 border-foreground bg-card/90 px-4 py-1 font-pixel text-[10px] uppercase tracking-widest text-foreground sm:text-xs">
            Stage 1 — Pantai Derawan
          </div>
          <h1 className="font-pixel text-4xl leading-[1.1] text-secondary text-shadow-pixel sm:text-6xl md:text-7xl">
            DERAWAN
          </h1>
          <h1 className="font-pixel text-3xl leading-[1.1] text-destructive text-shadow-pixel sm:text-5xl md:text-6xl">
            HERO
          </h1>
          <p className="mt-2 max-w-xs text-center font-body text-sm text-foreground sm:text-base">
            Selamatkan pantai dari monster sampah!
          </p>
        </div>

        {/* Hero waving */}
        <div className="my-4 animate-bob">
          <HeroSvg />
        </div>

        {/* Buttons */}
        <div className="z-20 flex w-full max-w-xs flex-col gap-3 pb-2">
          <button
            onClick={onStart}
            className="pixel-btn rounded-md border-4 border-foreground bg-secondary px-6 py-4 font-pixel text-base text-secondary-foreground shadow-pixel-lg active:translate-y-1 active:shadow-pixel sm:text-lg"
          >
            ▶ BERMAIN
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="pixel-btn rounded-md border-4 border-foreground bg-card px-6 py-3 font-pixel text-sm text-card-foreground shadow-pixel active:translate-y-1"
          >
            ⚙ PENGATURAN
          </button>
        </div>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/60 p-4">
      <div className="w-full max-w-sm animate-pop-in rounded-md border-4 border-foreground bg-card p-5 shadow-pixel-lg">
        <h2 className="mb-4 font-pixel text-base">PENGATURAN</h2>
        <div className="space-y-3 font-body text-sm">
          <div>
            <h3 className="font-pixel text-[10px] uppercase">Kontrol Desktop</h3>
            <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">
              <li>WASD / panah — gerak</li>
              <li>Spasi — serang</li>
              <li>E — Clean Wave (special)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-pixel text-[10px] uppercase">Kontrol Mobile</h3>
            <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">
              <li>Joystick kiri bawah — gerak</li>
              <li>Tombol kanan bawah — serang</li>
              <li>Tombol biru muncul kalau Clean Wave penuh</li>
            </ul>
          </div>
          <div>
            <h3 className="font-pixel text-[10px] uppercase">Tujuan</h3>
            <p className="text-xs text-muted-foreground">
              Kalahkan semua monster sampah & boss Litter King sebelum bar polusi penuh!
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="pixel-btn mt-5 w-full rounded border-4 border-foreground bg-primary py-2 font-pixel text-xs text-primary-foreground shadow-pixel"
        >
          OK
        </button>
      </div>
    </div>
  );
}

function PixelBeach() {
  return (
    <div className="absolute inset-0">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky to-primary/40" />
      {/* Sun */}
      <div className="absolute right-10 top-10 h-16 w-16 rounded-full bg-secondary shadow-[0_0_40px_hsl(var(--secondary))] sm:right-20 sm:top-16 sm:h-20 sm:w-20" />
      {/* Sea */}
      <div className="absolute inset-x-0 bottom-1/3 h-1/4 bg-gradient-to-b from-sea to-sea-deep">
        <SeaWaves />
      </div>
      {/* Sand */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-sand to-sand-dark" />
      {/* Trees */}
      <div className="absolute bottom-1/3 left-4 sm:left-12">
        <CoconutSvg />
      </div>
      <div className="absolute bottom-1/3 right-4 sm:right-12">
        <CoconutSvg flipped />
      </div>
    </div>
  );
}

function SeaWaves() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), 200);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-1 w-12 bg-white/60"
          style={{
            left: `${(i * 17 + t * 3) % 100}%`,
            top: `${15 + (i * 13) % 60}%`,
          }}
        />
      ))}
    </div>
  );
}

function CoconutSvg({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 14 20"
      className="h-32 w-24 sm:h-48 sm:w-32"
      shapeRendering="crispEdges"
      style={{ transform: flipped ? "scaleX(-1)" : undefined }}
    >
      {/* leaves */}
      <g fill="#3fbf6a">
        <rect x="0" y="0" width="2" height="3" />
        <rect x="2" y="1" width="3" height="2" />
        <rect x="5" y="0" width="4" height="3" />
        <rect x="9" y="1" width="3" height="2" />
        <rect x="12" y="0" width="2" height="3" />
        <rect x="3" y="3" width="8" height="2" />
        <rect x="4" y="5" width="6" height="2" />
        <rect x="5" y="7" width="4" height="2" />
      </g>
      <g fill="#1f7a3a">
        <rect x="6" y="2" width="2" height="3" />
        <rect x="2" y="3" width="2" height="1" />
        <rect x="10" y="3" width="2" height="1" />
      </g>
      {/* trunk */}
      <g fill="#6b4a22">
        <rect x="6" y="9" width="2" height="11" />
        <rect x="5" y="11" width="1" height="1" />
        <rect x="8" y="13" width="1" height="1" />
        <rect x="5" y="15" width="1" height="1" />
        <rect x="8" y="17" width="1" height="1" />
      </g>
    </svg>
  );
}

function HeroSvg() {
  return (
    <svg viewBox="0 0 16 18" className="h-32 w-32 sm:h-48 sm:w-48" shapeRendering="crispEdges">
      {/* hat */}
      <g fill="#ffd84d">
        <rect x="4" y="0" width="8" height="1" />
        <rect x="3" y="1" width="10" height="2" />
      </g>
      <g fill="#e6a82a">
        <rect x="2" y="2" width="12" height="1" />
      </g>
      {/* hair */}
      <g fill="#5a3a1a">
        <rect x="3" y="3" width="10" height="1" />
        <rect x="2" y="4" width="1" height="1" />
        <rect x="13" y="4" width="1" height="1" />
      </g>
      {/* face */}
      <g fill="#f4c89a">
        <rect x="3" y="4" width="10" height="5" />
      </g>
      {/* eyes */}
      <g fill="#222233">
        <rect x="5" y="5" width="2" height="1" />
        <rect x="9" y="5" width="2" height="1" />
      </g>
      {/* mouth */}
      <g fill="#222233">
        <rect x="6" y="7" width="4" height="1" />
      </g>
      {/* shirt */}
      <g fill="#e8423a">
        <rect x="2" y="9" width="12" height="4" />
      </g>
      <g fill="#a82820">
        <rect x="2" y="9" width="1" height="4" />
        <rect x="13" y="9" width="1" height="4" />
      </g>
      {/* arms (waving) */}
      <g fill="#f4c89a">
        <rect x="2" y="9" width="2" height="2" />
        <rect x="13" y="6" width="2" height="2" />
      </g>
      {/* shorts */}
      <g fill="#3a4a8a">
        <rect x="2" y="13" width="5" height="3" />
        <rect x="9" y="13" width="5" height="3" />
      </g>
      {/* legs */}
      <g fill="#222233">
        <rect x="3" y="16" width="3" height="2" />
        <rect x="10" y="16" width="3" height="2" />
      </g>
    </svg>
  );
}
