import { motion } from "framer-motion";
import { useCardGame } from "@/lib/stores/useCardGame";
import { useAudio } from "@/lib/stores/useAudio";

const TitleScreen = () => {
  const { startCharacterSelection, startTutorial } = useCardGame();
  const { toggleMute, isMuted } = useAudio();

  const handleStart = () => {
    startCharacterSelection();
    if (isMuted) {
      toggleMute(); // Unmute sounds when starting the game
    }
  };

  const handleTutorial = () => {
    startTutorial();
    if (isMuted) {
      toggleMute(); // Unmute sounds when starting tutorial
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
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
        className="flex flex-col gap-4"
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
          onClick={toggleMute}
          className="mt-4 flex items-center justify-center gap-2 text-amber-300 hover:text-amber-100 transition-colors"
        >
          {isMuted ? "🔇 Unmute Sounds" : "🔊 Mute Sounds"}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default TitleScreen;
