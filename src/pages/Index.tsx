import { useEffect, useState } from "react";
import { Cutscene } from "@/components/game/Cutscene";
import { EndScreen } from "@/components/game/EndScreen";
import { GameScreen } from "@/components/game/GameScreen";
import { HowToPlay } from "@/components/game/HowToPlay";
import { SettingsScreen } from "@/components/game/SettingsScreen";
import { StageSelect } from "@/components/game/StageSelect";
import { TitleScreen } from "@/components/game/TitleScreen";
import { playMusic, setMusicMuted, setMusicVolume } from "@/game/music";
import { loadSettings, unlockStage3 } from "@/game/settings";
import type { GameScene, StageId } from "@/game/types";

const Index = () => {
  const [scene, setScene] = useState<GameScene>("title");
  const [stage, setStage] = useState<StageId>(1);
  const [gameKey, setGameKey] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  // Apply music settings on mount
  useEffect(() => {
    const s = loadSettings();
    setMusicVolume(s.musicVolume);
    setMusicMuted(s.muted);
  }, []);

  // Switch background music per scene
  useEffect(() => {
    if (scene === "playing") return; // GameScreen owns its music
    if (scene === "title" || scene === "settings" || scene === "stageSelect") {
      playMusic("menu");
    } else if (scene === "cutscene") {
      playMusic(stage === 1 ? "beach" : "ocean");
    } else if (scene === "win") {
      // Unlock next stage when winning
      if (stage === 2) unlockStage3();
      playMusic("menu");
    } else if (scene === "gameover") {
      playMusic("menu");
    }
  }, [scene, stage]);

  const startStage = (s: StageId) => {
    setStage(s);
    setGameKey((k) => k + 1);
    const seen = loadSettings().tutorialSeen;
    if (!seen) {
      setShowTutorial(true);
    } else {
      setScene("cutscene");
    }
  };

  const restartCurrent = () => {
    setGameKey((k) => k + 1);
    setScene("playing");
  };

  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-background">
      <h1 className="sr-only">Derawan Island — Game Edukasi Pulau Derawan untuk Anak SD</h1>

      {scene === "title" && (
        <TitleScreen
          onPlay={() => setScene("stageSelect")}
          onSettings={() => setScene("settings")}
        />
      )}

      {scene === "settings" && <SettingsScreen onBack={() => setScene("title")} />}

      {scene === "stageSelect" && (
        <StageSelect onPick={startStage} onBack={() => setScene("title")} />
      )}

      {scene === "cutscene" && (
        <Cutscene
          stage={stage}
          onFinish={() => setScene("playing")}
        />
      )}

      {scene === "playing" && (
        <GameScreen
          key={gameKey}
          stage={stage}
          onWin={() => setScene("win")}
          onLose={() => setScene("gameover")}
          onMenu={() => setScene("title")}
          onRestart={restartCurrent}
        />
      )}

      {scene === "win" && (
        <EndScreen
          variant="win"
          stage={stage}
          onRestart={restartCurrent}
          onMenu={() => setScene("title")}
          onNextStage={
            stage === 1 ? () => startStage(2)
            : stage === 2 ? () => startStage(3)
            : undefined
          }
        />
      )}

      {scene === "gameover" && (
        <EndScreen
          variant="lose"
          stage={stage}
          onRestart={restartCurrent}
          onMenu={() => setScene("title")}
        />
      )}

      {showTutorial && (
        <HowToPlay
          onClose={() => {
            setShowTutorial(false);
            setScene("cutscene");
          }}
        />
      )}
    </main>
  );
};

export default Index;
