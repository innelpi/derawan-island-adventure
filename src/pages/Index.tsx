import { useState } from "react";
import { Cutscene } from "@/components/game/Cutscene";
import { EndScreen } from "@/components/game/EndScreen";
import { GameScreen } from "@/components/game/GameScreen";
import { SettingsScreen } from "@/components/game/SettingsScreen";
import { StageSelect } from "@/components/game/StageSelect";
import { TitleScreen } from "@/components/game/TitleScreen";
import type { GameScene, StageId } from "@/game/types";

const Index = () => {
  const [scene, setScene] = useState<GameScene>("title");
  const [stage, setStage] = useState<StageId>(1);
  const [gameKey, setGameKey] = useState(0);

  const startStage = (s: StageId) => {
    setStage(s);
    setGameKey((k) => k + 1);
    setScene("cutscene");
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
        />
      )}

      {scene === "win" && (
        <EndScreen
          variant="win"
          stage={stage}
          onRestart={() => {
            setGameKey((k) => k + 1);
            setScene("playing");
          }}
          onMenu={() => setScene("title")}
          onNextStage={
            stage === 1 ? () => startStage(2) : undefined
          }
        />
      )}

      {scene === "gameover" && (
        <EndScreen
          variant="lose"
          stage={stage}
          onRestart={() => {
            setGameKey((k) => k + 1);
            setScene("playing");
          }}
          onMenu={() => setScene("title")}
        />
      )}
    </main>
  );
};

export default Index;
