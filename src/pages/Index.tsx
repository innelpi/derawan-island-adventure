import { useState } from "react";
import { Cutscene } from "@/components/game/Cutscene";
import { EndScreen } from "@/components/game/EndScreen";
import { GameScreen } from "@/components/game/GameScreen";
import { TitleScreen } from "@/components/game/TitleScreen";
import type { GameScene } from "@/game/types";

const Index = () => {
  const [scene, setScene] = useState<GameScene>("title");
  // gameKey forces a fresh GameScreen mount (resets state) when restarting
  const [gameKey, setGameKey] = useState(0);

  return (
    <main className="fixed inset-0 h-[100dvh] w-screen overflow-hidden bg-background">
      <h1 className="sr-only">Derawan Hero — Game Edukasi Pulau Derawan</h1>

      {scene === "title" && <TitleScreen onStart={() => setScene("cutscene")} />}

      {scene === "cutscene" && (
        <Cutscene
          onFinish={() => {
            setGameKey((k) => k + 1);
            setScene("playing");
          }}
        />
      )}

      {scene === "playing" && (
        <GameScreen
          key={gameKey}
          onWin={() => setScene("win")}
          onLose={() => setScene("gameover")}
        />
      )}

      {scene === "win" && (
        <EndScreen
          variant="win"
          onRestart={() => {
            setGameKey((k) => k + 1);
            setScene("playing");
          }}
          onMenu={() => setScene("title")}
        />
      )}

      {scene === "gameover" && (
        <EndScreen
          variant="lose"
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
