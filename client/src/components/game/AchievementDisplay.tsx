import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCardGame } from "@/lib/stores/useCardGame";

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

const AchievementDisplay = () => {
  const achievements = useCardGame(state => state.achievements);
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => setIsOpen(!isOpen);
  
  const unlockedCount = achievements.filter(ach => ach.unlocked).length;
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={toggleOpen}
        className="bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:from-amber-500 hover:to-amber-400 transition duration-200 flex items-center gap-2"
      >
        <span className="text-xl">🏆</span>
        <span>{unlockedCount}/{achievements.length}</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ type: "spring", damping: 20 }}
            className="absolute top-14 right-0 w-72 bg-gradient-to-b from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4 overflow-y-auto max-h-[80vh]"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
              <h3 className="text-lg font-medievalsharp text-amber-300">Achievements</h3>
              <button onClick={toggleOpen} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <AchievementItem key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AchievementItem = ({ achievement }: { achievement: Achievement }) => {
  return (
    <motion.div
      className={`p-3 rounded-lg ${
        achievement.unlocked 
          ? "bg-gradient-to-r from-amber-900/50 to-amber-800/50 border border-amber-700"
          : "bg-gray-800/50 border border-gray-700"
      }`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      <div className="flex items-center gap-3">
        <div className={`text-2xl ${achievement.unlocked ? "" : "opacity-50 grayscale"}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <div className={`font-bold ${achievement.unlocked ? "text-amber-300" : "text-gray-400"}`}>
            {achievement.name}
          </div>
          <div className={`text-xs ${achievement.unlocked ? "text-gray-300" : "text-gray-500"}`}>
            {achievement.description}
          </div>
        </div>
        {achievement.unlocked && (
          <div className="text-amber-400 text-xl">✓</div>
        )}
      </div>
    </motion.div>
  );
};

export default AchievementDisplay;