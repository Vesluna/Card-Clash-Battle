import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCardGame } from "@/lib/stores/useCardGame";
import Card from "./Card";
import HealthBar from "./HealthBar";
import GameLog from "./GameLog";
import { useAudio } from "@/lib/stores/useAudio";
import { toast } from "sonner";

const GameBoard = () => {
  const { 
    player, 
    enemy, 
    drawHands, 
    playCard, 
    backToTitle, 
    logs, 
    gameMode,
    enemyHandRevealed,
    revealEnemyHand
  } = useCardGame();
  
  const [enemyHandVisible, setEnemyHandVisible] = useState(false);
  const [enemyCardPlaying, setEnemyCardPlaying] = useState<number | null>(null);
  const [playerCardPlaying, setPlayerCardPlaying] = useState<number | null>(null);
  const [gameAction, setGameAction] = useState<'idle' | 'player-turn' | 'enemy-turn' | 'round-complete'>('idle');
  const { playHit, playSuccess, toggleMute, isMuted } = useAudio();

  useEffect(() => {
    // Draw initial hands when component mounts
    drawHands();
  }, [drawHands]);
  
  // Listen for enemy hand reveal state changes
  useEffect(() => {
    if (enemyHandRevealed) {
      setEnemyHandVisible(true);
      playSuccess();
      toast.info("👁️ Enemy hand revealed!", {
        description: "You can see the enemy's cards for 5 seconds.",
        duration: 3000
      });
      
      // Hide again after timeout
      const hideTimer = setTimeout(() => {
        setEnemyHandVisible(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    }
  }, [enemyHandRevealed, playSuccess]);

  // Function to handle playing a card
  const handlePlayCard = (index: number) => {
    if (gameAction !== 'idle') return;
    
    // Start the card play sequence
    setGameAction('player-turn');
    setPlayerCardPlaying(index);
    
    // Play sound effect
    playHit();
    
    // Apply game mode effects to the card if needed before playing
    if (player && player.hand[index]) {
      // Make a temporary copy of the card to show game mode changes
      const modifiedCard = { ...player.hand[index] };
      
      // Apply game mode effects
      if (gameMode === 'blitz') {
        // In Blitz mode, cards deal double damage
        modifiedCard.power *= 2;
        toast.info(`🔥 Blitz Mode: Card power doubled to ${modifiedCard.power}!`, {
          duration: 2000
        });
      } else if (gameMode === 'tactical') {
        // In Tactical mode, abilities are stronger but base damage is reduced
        modifiedCard.power = Math.max(1, Math.floor(modifiedCard.power * 0.7));
        toast.info(`🧠 Tactical Mode: Abilities enhanced, base damage reduced to ${modifiedCard.power}`, {
          duration: 2000
        });
      }
    }
    
    // After a short delay for animation, execute the card action
    setTimeout(() => {
      // Choose a random enemy card
      const enemyIndex = Math.floor(Math.random() * (enemy?.hand?.length || 1));
      setEnemyCardPlaying(enemyIndex);
      setGameAction('enemy-turn');
      
      // After enemy card animation, complete the play
      setTimeout(() => {
        // Play appropriate sound based on card effect
        if (player && player.hand[index]) {
          const cardEffect = player.hand[index].effect;
          
          if (cardEffect) {
            // Play special sound for shield-related abilities
            if (cardEffect === 'Shield' || cardEffect === 'Protect' || 
                cardEffect === 'Ethereal' || cardEffect === 'Crystallize') {
              useAudio.getState().playShield();
            }
            // Play special sound for reveal/foresight abilities
            else if (cardEffect === 'RevealHand' || cardEffect === 'Foresight') {
              useAudio.getState().playSpecial();
              // Ensure we trigger the reveal
              revealEnemyHand();
            }
            // Play special sounds for other abilities
            else {
              useAudio.getState().playSpecial();
            }
          } else {
            // Play regular card sound for normal cards
            useAudio.getState().playCard();
          }
        }
        
        // Execute the card play in game state
        playCard(index);
        setGameAction('round-complete');
        
        // Reset for next turn
        setTimeout(() => {
          setPlayerCardPlaying(null);
          setEnemyCardPlaying(null);
          // Only reset enemy hand visibility if it's not revealed by a card effect
          if (!enemyHandRevealed) {
            setEnemyHandVisible(false);
          }
          setGameAction('idle');
        }, 1000);
      }, 1000);
    }, 1000);
  };

  if (!player || !enemy) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <motion.div 
      className="flex flex-col h-full w-full p-2 md:p-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Current Round Indicator */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-amber-800/80 px-4 py-1 rounded-full text-amber-100 text-sm font-medievalsharp shadow-lg z-10">
        {gameMode === 'standard' ? 'Standard Battle' : 
         gameMode === 'blitz' ? 'Blitz Mode' : 
         gameMode === 'tactical' ? 'Tactical Mode' : 
         'Survival Mode'}
      </div>
      
      {/* Battle header with health bars */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-lg p-2 md:p-4 mb-2 md:mb-4 shadow-lg backdrop-blur-sm">
        <div className="flex flex-row justify-between items-center gap-2 md:gap-4">
          <div className="w-5/12 flex flex-col">
            <div className="font-medievalsharp text-sm md:text-lg text-amber-300 truncate">
              {player.name} <span className="text-amber-200">{getRarityBadge(player.rarity)}</span>
            </div>
            <HealthBar 
              current={player.hp} 
              max={getBaseHP(player.name)} 
              player={true} 
              shield={player.shield}
            />
          </div>
          
          <div className="text-amber-400 font-bold text-sm md:text-lg">VS</div>
          
          <div className="w-5/12 flex flex-col">
            <div className="font-medievalsharp text-sm md:text-lg text-red-300 truncate">
              {enemy.name} <span className="text-red-200">{getRarityBadge(enemy.rarity)}</span>
            </div>
            <HealthBar 
              current={enemy.hp} 
              max={getBaseHP(enemy.name)} 
              player={false} 
              shield={enemy.shield}
            />
          </div>
        </div>
      </div>
      
      {/* Game area */}
      <div className="flex-grow flex flex-col md:flex-row gap-2 md:gap-4 overflow-hidden">
        {/* Enemy hand area */}
        <div className="w-full md:w-1/4 h-[30vh] md:h-auto">
          <motion.div 
            className="bg-gradient-to-b from-gray-900/70 to-gray-800/70 h-full rounded-lg p-2 md:p-4 shadow-lg backdrop-blur-sm overflow-y-auto"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-red-300 font-medievalsharp text-sm md:text-base mb-2">Enemy Cards</h3>
            
            {enemyHandVisible ? (
              <div className="space-y-2">
                {enemy.hand.map((card, idx) => (
                  <motion.div 
                    key={`enemy-card-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: enemyCardPlaying === idx ? 1.05 : 1,
                      boxShadow: enemyCardPlaying === idx ? 
                        "0 0 15px rgba(220, 38, 38, 0.7)" : "none"
                    }}
                    transition={{ delay: idx * 0.1 }}
                    className="transform-gpu"
                  >
                    <Card card={card} isEnemy={true} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)]">
                <p className="text-gray-400 text-center text-sm mb-2 md:mb-4">Enemy's hand is hidden</p>
                {enemy.hand.map((_, idx) => (
                  <motion.div 
                    key={`enemy-back-${idx}`}
                    className="w-full h-12 md:h-16 mb-2 bg-gradient-to-r from-red-900 to-red-800 rounded border border-red-700 flex items-center justify-center text-xl md:text-2xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    🎴
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
        
        {/* Battle log area */}
        <motion.div 
          className="flex-grow h-[30vh] md:h-auto overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GameLog logs={logs} />
        </motion.div>
        
        {/* Player hand area */}
        <div className="w-full md:w-1/3 h-[35vh] md:h-auto">
          <motion.div 
            className="bg-gradient-to-b from-gray-900/70 to-gray-800/70 h-full rounded-lg p-2 md:p-4 shadow-lg backdrop-blur-sm overflow-y-auto"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-amber-300 font-medievalsharp text-sm md:text-base mb-2">Your Cards</h3>
            
            <div className="space-y-2">
              {player.hand.map((card, idx) => (
                <AnimatePresence key={`player-card-${idx}`} mode="popLayout">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: playerCardPlaying === idx ? 1.05 : 1,
                      boxShadow: playerCardPlaying === idx ? 
                        "0 0 15px rgba(245, 158, 11, 0.7)" : "none"
                    }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: gameAction === 'idle' ? 1.02 : 1 }}
                    className="transform-gpu"
                  >
                    <Card 
                      card={card} 
                      onClick={() => gameAction === 'idle' && handlePlayCard(idx)} 
                      disabled={gameAction !== 'idle'}
                    />
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Game controls */}
      <motion.div 
        className="mt-2 md:mt-4 flex justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button 
          onClick={backToTitle}
          className="text-amber-300 hover:text-amber-100 transition-colors text-sm md:text-base px-3 py-1 border border-amber-800 rounded-lg hover:bg-amber-900/30"
        >
          Abandon Battle
        </button>
        
        <button 
          onClick={() => toggleMute()}
          className="text-amber-300 hover:text-amber-100 transition-colors text-sm md:text-base px-3 py-1 border border-amber-800 rounded-lg hover:bg-amber-900/30"
        >
          {useAudio.getState().isMuted ? "🔇 Unmute" : "🔊 Mute"}
        </button>
      </motion.div>
    </motion.div>
  );
};

// Helper functions
const getBaseHP = (name: string): number => {
  const charMap: Record<string, number> = {
    'Squire': 30,
    'Rogue': 28,
    'Mage': 25,
    'Knight': 35,
    'Dragon Lord': 40,
    'Phoenix Rider': 38,
    'Celestial Guardian': 45,
    'Forest Druid': 32,
    'Berserker': 33,
    'Necromancer': 27,
    'Paladin': 36,
    'Warlock': 29,
    'Valkyrie': 37,
    'Titan': 42,
    'Monk': 31,
    'Assassin': 26
  };
  
  return charMap[name] || 30;
};

const getRarityBadge = (rarity: string) => {
  const colors: Record<string, string> = {
    'Common': 'text-gray-300',
    'Uncommon': 'text-green-300',
    'Rare': 'text-blue-300',
    'Epic': 'text-purple-300',
    'Legendary': 'text-amber-300',
    'Mythic': 'text-pink-300',
    'Divine': 'text-yellow-300'
  };
  
  return <span className={`text-xs ${colors[rarity]}`}>({rarity})</span>;
};

export default GameBoard;
