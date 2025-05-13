import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useCardGame } from "@/lib/stores/useCardGame";
import { useAudio } from "@/lib/stores/useAudio";
import TitleScreen from "./TitleScreen";
import CharacterSelection from "./CharacterSelection";
import GameBoard from "./GameBoard";
import Tutorial from "./Tutorial";
import AchievementDisplay from "./AchievementDisplay";

// Achievement notification component
import { toast } from "sonner";

const Game = () => {
  const gameState = useCardGame(state => state.gameState);
  const achievements = useCardGame(state => state.achievements);
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();
  const [prevAchievements, setPrevAchievements] = useState<typeof achievements>([]);

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

  // Track achievement unlocks
  useEffect(() => {
    // Check for newly unlocked achievements
    achievements.forEach((achievement) => {
      const prevAchievement = prevAchievements.find(a => a.id === achievement.id);
      
      // If this achievement was just unlocked
      if (achievement.unlocked && (!prevAchievement || !prevAchievement.unlocked)) {
        // Show toast notification instead of alert
        toast(`🏆 Achievement Unlocked: ${achievement.name}`, {
          description: achievement.description,
          duration: 5000,
          icon: achievement.icon
        });
      }
    });
    
    // Update previous achievements state
    setPrevAchievements(achievements);
  }, [achievements, prevAchievements]);

  return (
    <div className="h-screen w-screen bg-gradient-to-b from-indigo-900 via-purple-800 to-indigo-800 overflow-hidden">
      {/* Achievement display - always visible */}
      {gameState !== "title" && <AchievementDisplay />}
      
      <div className="max-w-7xl mx-auto h-full">
        <AnimatePresence mode="wait">
          {gameState === "title" && <TitleScreen key="title" />}
          {gameState === "selection" && <CharacterSelection key="selection" />}
          {gameState === "battle" && <GameBoard key="battle" />}
          {gameState === "tutorial" && <Tutorial key="tutorial" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Game;
