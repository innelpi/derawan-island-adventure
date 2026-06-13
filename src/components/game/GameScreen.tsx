import { useEffect, useRef, useState } from "react";
import { ActionButton, VirtualJoystick } from "./Controls";
import { Hud } from "./Hud";
import { PauseOverlay } from "./PauseOverlay";
import { QuizPopup } from "./QuizPopup";
import { SFX, isMuted, setMuted, setSfxVolume, unlockAudio } from "@/game/audio";
import { addHeartReward, updateGame } from "@/game/engine";
import { playMusic, setMusicMuted, setMusicVolume } from "@/game/music";
import { QuizQuestion, shuffleQuiz } from "@/game/quiz";
import { renderGame } from "@/game/render";
import { loadSettings, saveSettings } from "@/game/settings";
import { GameEvent, GameState, makeInitialState, StageId } from "@/game/types";
import { useInput } from "@/game/useInput";

interface GameScreenProps {
  stage: StageId;
  onWin: () => void;
  onLose: () => void;
  onMenu: () => void;
  onRestart: () => void;
}

export function GameScreen({ stage, onWin, onLose, onMenu, onRestart }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState>(makeInitialState(stage));
  const { read } = useInput();
  const touch = useRef({ mx: 0, my: 0, attack: false, special: false });
  const [, force] = useState(0);
  const [muted, setMutedState] = useState(isMuted());
  const [quiz, setQuiz] = useState<QuizQuestion | null>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const quizPoolRef = useRef<QuizQuestion[]>(shuffleQuiz());
  const quizIdxRef = useRef(0);
  const isMobile = typeof window !== "undefined" && "ontouchstart" in window;

  // Apply user audio settings on mount + start stage music
  useEffect(() => {
    const s = loadSettings();
    setSfxVolume(s.sfxVolume);
    setMusicVolume(s.musicVolume);
    setMuted(s.muted);
    setMusicMuted(s.muted);
    setMutedState(s.muted);
    playMusic(stage === 2 ? "ocean" : "beach");
    return () => {
      // when leaving game, music control handed back to Index
    };
  }, [stage]);

  // ESC / P → toggle pause
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause when tab hidden — game state preserved
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && !pausedRef.current) {
        pausedRef.current = true;
        setPaused(true);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const togglePause = () => {
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    SFX.click();
  };

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

    const showNextQuiz = () => {
      const q = quizPoolRef.current[quizIdxRef.current % quizPoolRef.current.length];
      quizIdxRef.current++;
      pausedRef.current = true;
      setQuiz(q);
    };

    const handleEvent = (ev: GameEvent) => {
      switch (ev) {
        case "attack": SFX.attack(); break;
        case "hit": SFX.hit(); break;
        case "enemyDie": SFX.enemyDie(); break;
        case "heroHurt": SFX.heroHurt(); break;
        case "special": SFX.special(); break;
        case "bossIntro":
          SFX.bossIntro();
          showNextQuiz();
          break;
        case "bossShoot": SFX.bossShoot(); break;
        case "waveClear":
          SFX.waveClear();
          showNextQuiz();
          break;
        case "win":
          SFX.win();
          // Unlock stage 2 if just finished stage 1
          if (stateRef.current.stage === 1) saveSettings({ stage2Unlocked: true });
          break;
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

  const handleQuizAnswered = (correct: boolean) => {
    if (correct) {
      SFX.correct();
      addHeartReward(stateRef.current);
      // small delayed bonus chime
      setTimeout(() => SFX.hpUp(), 250);
    } else {
      SFX.wrong();
    }
    setQuiz(null);
    pausedRef.current = false;
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMusicMuted(next);
    setMutedState(next);
    saveSettings({ muted: next });
    if (!next) SFX.click();
  };

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-foreground">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <Hud state={stateRef.current} />

      {/* Top-right buttons */}
      <div className="fixed left-4 top-20 z-[60] flex gap-2 sm:top-24">
  <button
    onClick={togglePause}
    aria-label={paused ? "Lanjutkan permainan" : "Jeda permainan"}
    title={paused ? "Lanjutkan permainan" : "Jeda permainan"}
    className="pixel-btn min-h-11 min-w-[96px] rounded border-2 border-foreground bg-card px-3 py-2 font-pixel text-[10px] text-card-foreground shadow-pixel transition-transform duration-150 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-1 sm:text-xs"
  >
    {paused ? "▶ LANJUT" : "⏸ PAUSE"}
  </button>
</div>
        <button
          onClick={toggleMute}
          aria-label={muted ? "Aktifkan suara" : "Matikan suara"}
          className="pixel-btn rounded border-2 border-foreground bg-card px-2 py-1 font-pixel text-[10px] text-card-foreground shadow-pixel sm:text-xs"
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>

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

      {/* Quiz overlay (pauses game) */}
      {quiz && <QuizPopup question={quiz} onAnswered={handleQuizAnswered} />}

      {/* Pause overlay */}
      {paused && !quiz && (
        <PauseOverlay
          onResume={togglePause}
          onRestart={() => {
            setPaused(false);
            pausedRef.current = false;
            onRestart();
          }}
          onMenu={() => {
            setPaused(false);
            pausedRef.current = false;
            onMenu();
          }}
        />
      )}
    </div>
  );
}
