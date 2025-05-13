import { useState, useEffect, useCallback } from "react";
import { useCardGame } from "@/lib/stores/useCardGame";
import { useAudio } from "@/lib/stores/useAudio";

// Hook for handling game logic and audio
export function useGameLogic() {
  const { 
    gameState, 
    player, 
    enemy,
    playCard, 
    drawHands 
  } = useCardGame();
  
  const { playHit, playSuccess } = useAudio();
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle card selection and play
  const handleCardPlay = useCallback((cardIndex: number) => {
    if (!isPlayerTurn || isAnimating) return;
    
    setIsAnimating(true);
    playHit(); // Play sound effect
    
    // Animate card play
    setTimeout(() => {
      playCard(cardIndex);
      setIsPlayerTurn(false);
      
      // Enemy turn after delay
      setTimeout(() => {
        setIsAnimating(false);
        
        // Check if game is over after player's turn
        if (gameState === "battle") {
          setIsPlayerTurn(true);
        } else {
          // Game over sound
          playSuccess();
        }
      }, 1500);
    }, 500);
  }, [isPlayerTurn, isAnimating, playHit, playCard, gameState, playSuccess]);

  // Initial setup
  useEffect(() => {
    if (gameState === "battle" && player && enemy) {
      drawHands();
      setIsPlayerTurn(true);
    }
  }, [gameState, player, enemy, drawHands]);
  
  return {
    isPlayerTurn,
    isAnimating,
    handleCardPlay
  };
}
