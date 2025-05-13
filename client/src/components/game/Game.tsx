import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useCardGame } from "@/lib/stores/useCardGame";
import { useAudio } from "@/lib/stores/useAudio";
import TitleScreen from "./TitleScreen";
import CharacterSelection from "./CharacterSelection";
import GameBoard from "./GameBoard";

const Game = () => {
  const gameState = useCardGame(state => state.gameState);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Load audio assets
  useEffect(() => {
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.5;
    setBackgroundMusic(bgMusic);

    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.3;
    setHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.5;
    setSuccessSound(success);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-indigo-800 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full">
        <AnimatePresence mode="wait">
          {gameState === "title" && <TitleScreen key="title" />}
          {gameState === "selection" && <CharacterSelection key="selection" />}
          {gameState === "battle" && <GameBoard key="battle" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Game;
