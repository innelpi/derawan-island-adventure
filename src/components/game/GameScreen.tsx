import { useEffect, useRef, useState } from "react";
import { ActionButton, VirtualJoystick } from "./Controls";
import { EduPopup } from "./EduPopup";
import { Hud } from "./Hud";
import { SFX, isMuted, setMuted, unlockAudio } from "@/game/audio";
import { BOSS_INTRO_FACT, EDU_FACTS, EduFact } from "@/game/edukasi";
import { updateGame } from "@/game/engine";
import { renderGame } from "@/game/render";
import { GameEvent, GameState, makeInitialState } from "@/game/types";
import { useInput } from "@/game/useInput";

interface GameScreenProps {
  onWin: () => void;
  onLose: () => void;
}

export function GameScreen({ onWin, onLose }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState>(makeInitialState());
  const { read } = useInput();
  const touch = useRef({ mx: 0, my: 0, attack: false, special: false });
  const [, force] = useState(0);
  const [muted, setMutedState] = useState(isMuted());
  const [eduFact, setEduFact] = useState<EduFact | null>(null);
  const pausedRef = useRef(false);
  const factIdxRef = useRef(0);
  const isMobile = typeof window !== "undefined" && "ontouchstart" in window;

  useEffect(() => {
    unlockAudio();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    let endHandled = false;

    const resize = () => {
      const c = containerRef.current!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = c.clientWidth * dpr;
      canvas.height = c.clientHeight * dpr;
      canvas.style.width = c.clientWidth + "px";
      canvas.style.height = c.clientHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleEvent = (ev: GameEvent) => {
      switch (ev) {
        case "attack": SFX.attack(); break;
        case "hit": SFX.hit(); break;
        case "enemyDie": SFX.enemyDie(); break;
        case "heroHurt": SFX.heroHurt(); break;
        case "special": SFX.special(); break;
        case "bossIntro":
          SFX.bossIntro();
          pausedRef.current = true;
          setEduFact(BOSS_INTRO_FACT);
          break;
        case "bossShoot": SFX.bossShoot(); break;
        case "waveClear":
          SFX.waveClear();
          pausedRef.current = true;
          setEduFact(EDU_FACTS[factIdxRef.current % EDU_FACTS.length]);
          factIdxRef.current++;
          break;
        case "win": SFX.win(); break;
        case "lose": SFX.lose(); break;
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (!pausedRef.current) {
        const input = read({
          mx: touch.current.mx,
          my: touch.current.my,
          attack: touch.current.attack,
          special: touch.current.special,
        });
        touch.current.attack = false;
        touch.current.special = false;
        updateGame(stateRef.current, input, dt);
        for (const ev of stateRef.current.events) handleEvent(ev);
      }

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderGame(ctx, stateRef.current, w, h);

      // re-render React HUD periodically
      if (Math.floor(now / 100) !== Math.floor((now - dt * 1000) / 100)) {
        force((x) => x + 1);
      }

      if (stateRef.current.ended && !endHandled) {
        endHandled = true;
        const result = stateRef.current.ended;
        setTimeout(() => {
          if (result === "win") onWin();
          else onLose();
        }, 600);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [onWin, onLose, read]);

  const closeEdu = () => {
    SFX.click();
    setEduFact(null);
    pausedRef.current = false;
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) SFX.click();
  };

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-foreground">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <Hud state={stateRef.current} />

      {/* Mute toggle */}
      <button
        onClick={toggleMute}
        aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
        className="pixel-btn absolute right-3 top-3 z-30 rounded border-2 border-foreground bg-card px-2 py-1 font-pixel text-[10px] text-card-foreground shadow-pixel sm:text-xs"
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Touch controls */}
      {isMobile && (
        <>
          <VirtualJoystick
            onChange={(x, y) => {
              touch.current.mx = x;
              touch.current.my = y;
            }}
          />
          <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3">
            {stateRef.current.special >= 100 && (
              <ActionButton
                label="WAVE"
                className="animate-flash bg-primary text-primary-foreground"
                onPress={() => (touch.current.special = true)}
              />
            )}
            <ActionButton
              big
              label="HIT!"
              className="bg-destructive text-destructive-foreground"
              onPress={() => (touch.current.attack = true)}
            />
          </div>
        </>
      )}

      {/* Desktop hint */}
      {!isMobile && (
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded border-2 border-foreground bg-card/90 px-3 py-1 font-pixel text-[8px] text-card-foreground sm:text-[10px]">
          WASD gerak · SPASI serang · E clean wave
        </div>
      )}

      {/* Edu popup overlay (pauses game) */}
      {eduFact && <EduPopup fact={eduFact} onClose={closeEdu} />}
    </div>
  );
}
