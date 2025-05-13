import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCardGame } from "@/lib/stores/useCardGame";
import { characters } from "@/lib/characterData";
import { rarityWeights } from "@/lib/gameEffects";

const CharacterSelection = () => {
  const { selectCharacter, backToTitle } = useCardGame();
  const [hoveredChar, setHoveredChar] = useState<number | null>(null);
  
  // Select 3 characters with weighted randomness - memoized to prevent re-calculation on hover
  const charChoices = useMemo(() => {
    const choices = [];
    const tempChars = [...characters];
    const tempWeights = tempChars.map(char => {
      // Type safety check for rarity
      if (char.rarity in rarityWeights) {
        return rarityWeights[char.rarity as keyof typeof rarityWeights];
      }
      return 0; // Default weight if rarity is not found
    });
    
    for (let i = 0; i < 3; i++) {
      if (tempChars.length === 0) break;
      
      const totalWeight = tempWeights.reduce((sum, weight) => sum + weight, 0);
      const rand = Math.random() * totalWeight;
      let cumulative = 0;
      
      for (let j = 0; j < tempChars.length; j++) {
        cumulative += tempWeights[j];
        if (rand < cumulative) {
          choices.push(tempChars[j]);
          tempChars.splice(j, 1);
          tempWeights.splice(j, 1);
          break;
        }
      }
    }
    
    return choices;
  }, []); // Empty dependency array means this only runs once when component mounts
  
  // Color mapping for rarity
  const rarityColors = {
    Common: "bg-gray-200 border-gray-400 text-gray-800",
    Uncommon: "bg-green-100 border-green-500 text-green-800",
    Rare: "bg-blue-100 border-blue-500 text-blue-800",
    Epic: "bg-purple-100 border-purple-500 text-purple-800",
    Legendary: "bg-amber-100 border-amber-500 text-amber-800",
    Mythic: "bg-pink-100 border-pink-500 text-pink-800",
    Divine: "bg-gradient-to-br from-amber-100 to-yellow-200 border-yellow-500 text-amber-800"
  };
  
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h2 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-medievalsharp text-amber-300 mb-8"
      >
        Choose Your Champion
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        {charChoices.map((char, index) => {
          // Type safety checks for rarities
          const colorClass = char.rarity in rarityColors 
            ? rarityColors[char.rarity as keyof typeof rarityColors] 
            : "bg-gray-200 border-gray-400 text-gray-800";
          
          const defenseValue = char.rarity in rarityDefense 
            ? rarityDefense[char.rarity as keyof typeof rarityDefense] 
            : 0;
          
          return (
            <motion.div
              key={`${char.name}-${index}`}
              className={`relative rounded-lg shadow-xl p-6 cursor-pointer h-full
                        border-2 ${colorClass} 
                        transform transition-all duration-200`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: hoveredChar === index ? 1.05 : 1,
                boxShadow: hoveredChar === index ? 
                  "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" : 
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              }}
              transition={{ delay: index * 0.1 + 0.2 }}
              onClick={() => selectCharacter(char)}
              onMouseEnter={() => setHoveredChar(index)}
              onMouseLeave={() => setHoveredChar(null)}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-medievalsharp mb-2">{char.name}</h3>
                
                <div className="my-3 text-5xl">
                  {getCharacterEmoji(char.name)}
                </div>
                
                <div className="badge mb-3 px-3 py-1 rounded-full text-sm font-bold" 
                  style={getRarityStyle(char.rarity)}>
                  {char.rarity}
                </div>
                
                <div className="stats space-y-2 w-full">
                  <div className="flex justify-between">
                    <span>Health:</span>
                    <span className="font-bold">{char.baseHP}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Defense:</span>
                    <span className="font-bold">{defenseValue}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={backToTitle}
        className="mt-8 text-amber-300 hover:text-amber-100 transition-colors"
      >
        ← Back to Title Screen
      </motion.button>
    </motion.div>
  );
};

// Helper function to get character emoji
const getCharacterEmoji = (name: string): string => {
  const emojiMap: Record<string, string> = {
    'Squire': '🛡️',
    'Rogue': '🗡️',
    'Mage': '🔮',
    'Knight': '⚔️',
    'Dragon Lord': '🐉',
    'Phoenix Rider': '🔥',
    'Celestial Guardian': '✨',
    'Forest Druid': '🌿',
    'Berserker': '💢',
    'Necromancer': '💀',
    'Paladin': '🌟',
    'Warlock': '📜',
    'Valkyrie': '👸',
    'Titan': '👑',
    'Monk': '🧘',
    'Assassin': '🥷'
  };
  
  return emojiMap[name] || '👤';
};

// Helper for rarity styling
const getRarityStyle = (rarity: string) => {
  const styles: Record<string, any> = {
    Common: { backgroundColor: '#9e9e9e', color: 'white' },
    Uncommon: { backgroundColor: '#4caf50', color: 'white' },
    Rare: { backgroundColor: '#2196f3', color: 'white' },
    Epic: { backgroundColor: '#9c27b0', color: 'white' },
    Legendary: { backgroundColor: '#ff9800', color: 'white' },
    Mythic: { backgroundColor: '#e91e63', color: 'white' },
    Divine: { 
      background: 'linear-gradient(45deg, #f6b73c, #ffd700)',
      color: '#000',
      boxShadow: '0 0 10px rgba(255, 215, 0, 0.7)'
    }
  };
  
  return styles[rarity] || {};
};

// Defense values based on rarity
const rarityDefense = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 5,
  Mythic: 7,
  Divine: 10
};

export default CharacterSelection;
