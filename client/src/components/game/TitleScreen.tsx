import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCardGame } from "@/lib/stores/useCardGame";
import { useAudio } from "@/lib/stores/useAudio";
import AchievementDisplay from "./AchievementDisplay";

// Game modes definition
interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const gameModes: GameMode[] = [
  {
    id: 'standard',
    name: 'Standard Battle',
    description: 'The classic card battle experience. Play cards, use abilities, and defeat your opponent!',
    icon: '⚔️'
  },
  {
    id: 'blitz',
    name: 'Blitz Mode',
    description: 'Fast-paced action! All cards deal double damage, but you start with less health.',
    icon: '⚡'
  },
  {
    id: 'tactical',
    name: 'Tactical Mode',
    description: 'A strategic challenge. Card abilities are more powerful, but base damage is reduced.',
    icon: '🧠'
  },
  {
    id: 'survival',
    name: 'Survival Mode',
    description: 'How long can you last? Face increasingly powerful enemies with each victory.',
    icon: '🛡️'
  }
];

const TitleScreen = () => {
  const { startCharacterSelection, startTutorial, setGameMode, viewAchievements } = useCardGame();
  const { toggleMute, isMuted } = useAudio();
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [selectedMode, setSelectedMode] = useState<string>('standard');
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  useEffect(() => {
    // Set up title screen background music info
    document.title = "Card Clash: Battle";
    
    // Music info for the developer to add
    console.log("Title Music Info: Ancient Legends - Medieval fantasy orchestral with lutes, harps, drums and fantasy choir elements");
  }, []);

  const handleStart = () => {
    if (showModeSelect) {
      // Start game with selected mode
      setGameMode(selectedMode);
      startCharacterSelection();
    } else {
      // Show mode selection first
      setShowModeSelect(true);
    }
    
    // Ensure sound is on when starting game
    if (isMuted) {
      toggleMute();
    }
  };

  const handleTutorial = () => {
    startTutorial();
    if (isMuted) {
      toggleMute(); // Unmute sounds when starting tutorial
    }
  };
  
  const handleViewAchievements = () => {
    setIsAchievementsOpen(true);
  };
  
  const handleBackToTitle = () => {
    setShowModeSelect(false);
    setIsAchievementsOpen(false);
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full text-center px-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      {/* Decorative floating cards in the background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 12 }).map((_, index) => (
          <motion.div
            key={`floating-card-${index}`}
            className="absolute w-16 h-24 bg-gradient-to-br from-amber-800/30 to-amber-900/30 rounded-lg border border-amber-500/20"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              rotate: Math.random() * 60 - 30,
              opacity: 0.3 + Math.random() * 0.4
            }}
            animate={{ 
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              rotate: [Math.random() * 60 - 30, Math.random() * 60 - 30]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 10 + Math.random() * 20,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Main Title Screen */}
        {!showModeSelect && !isAchievementsOpen && (
          <motion.div
            key="title-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            >
              <h1 className="text-5xl md:text-7xl font-medievalsharp text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                ⚔️ Card Clash: Battle ⚔️
              </h1>
              <p className="text-xl md:text-2xl text-amber-200 mb-12 font-medievalsharp">
                Forge Your Legend in the Realm of Cards!
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="flex flex-col gap-4 min-w-[300px]"
            >
              <button 
                onClick={handleStart}
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold py-3 px-8 text-xl rounded-lg shadow-lg hover:from-amber-500 hover:to-amber-400 transform hover:scale-105 transition duration-200"
              >
                Begin Your Quest
              </button>
              
              <button 
                onClick={handleTutorial}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 px-8 text-xl rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-400 transform hover:scale-105 transition duration-200"
              >
                Tutorial
              </button>
              
              <button 
                onClick={handleViewAchievements}
                className="bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-3 px-8 text-xl rounded-lg shadow-lg hover:from-purple-500 hover:to-purple-400 transform hover:scale-105 transition duration-200"
              >
                Achievements
              </button>
              
              <button
                onClick={toggleMute}
                className="mt-4 flex items-center justify-center gap-2 text-amber-300 hover:text-amber-100 transition-colors"
              >
                {isMuted ? "🔇 Unmute Sounds" : "🔊 Mute Sounds"}
              </button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 text-sm text-amber-400/60"
            >
              Version 1.2.0 • Created with ❤️
            </motion.div>
          </motion.div>
        )}
        
        {/* Game Mode Selection */}
        {showModeSelect && (
          <motion.div
            key="mode-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-b from-gray-900/90 to-gray-800/90 p-6 rounded-xl max-w-2xl w-full"
          >
            <h2 className="text-2xl font-medievalsharp text-amber-300 mb-4">Select Game Mode</h2>
            
            <div className="grid gap-3 mb-6">
              {gameModes.map((mode) => (
                <motion.div
                  key={mode.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedMode === mode.id
                      ? "bg-amber-800/50 border-2 border-amber-500"
                      : "bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50"
                  }`}
                  onClick={() => setSelectedMode(mode.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{mode.icon}</span>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-amber-200">{mode.name}</h3>
                      <p className="text-sm text-gray-300">{mode.description}</p>
                    </div>
                    {selectedMode === mode.id && (
                      <div className="text-amber-400 text-xl">✓</div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleBackToTitle}
                className="px-5 py-2 text-amber-300 hover:text-amber-100 transition-colors"
              >
                ← Back
              </button>
              
              <button
                onClick={() => {
                  setGameMode(selectedMode);
                  startCharacterSelection();
                }}
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold py-2 px-6 text-lg rounded-lg shadow-lg hover:from-amber-500 hover:to-amber-400 transition duration-200"
              >
                Start Game
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Achievements View */}
        {isAchievementsOpen && (
          <motion.div
            key="achievements-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-b from-gray-900/90 to-gray-800/90 p-6 rounded-xl max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-medievalsharp text-amber-300">Achievements</h2>
              <button
                onClick={handleBackToTitle}
                className="text-amber-300 hover:text-amber-100 transition-colors"
              >
                ← Back
              </button>
            </div>
            
            <div className="px-2 py-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-gray-800">
              <AchievementDisplay inTitleScreen={true} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TitleScreen;
