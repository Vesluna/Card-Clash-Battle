import { motion } from "framer-motion";

interface CardProps {
  card: {
    name: string;
    emoji: string;
    power: number;
    ability: string;
    effect?: string;
  };
  onClick?: () => void;
  disabled?: boolean;
  isEnemy?: boolean;
}

const Card = ({ card, onClick, disabled = false, isEnemy = false }: CardProps) => {
  const getAbilityColor = (ability: string) => {
    const abilityColors: Record<string, string> = {
      Burn: "text-red-500",
      Freeze: "text-blue-500",
      Steal: "text-purple-500",
      Shield: "text-amber-500",
      "Reveal Hand": "text-teal-500",
      "Dice Roll": "text-indigo-500",
      Shock: "text-yellow-500",
      Sturdy: "text-gray-500",
      Gust: "text-cyan-500",
      Heal: "text-green-500",
      Poison: "text-emerald-500",
      Protect: "text-amber-500",
      Spellcast: "text-pink-500",
      Summon: "text-orange-500",
      Foresight: "text-teal-500",
      Chaos: "text-purple-500"
    };
    
    return abilityColors[ability] || "text-gray-300";
  };
  
  return (
    <motion.div
      className={`relative ${isEnemy ? 'bg-gradient-to-br from-red-800 to-red-950' : 'bg-gradient-to-br from-amber-800 to-amber-950'} 
                rounded-md border ${isEnemy ? 'border-red-700' : 'border-amber-700'} 
                shadow-md p-3 cursor-pointer transition-all
                ${disabled ? 'opacity-70' : 'hover:shadow-lg'}`}
      onClick={!disabled && onClick ? onClick : undefined}
      whileHover={!disabled ? { y: -4, boxShadow: "0 8px 15px rgba(0,0,0,0.2)" } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <div className="flex justify-between items-start">
        <div className="text-2xl">{card.emoji}</div>
        <div className={`px-2 py-0.5 text-xs font-bold rounded-full ${isEnemy ? 'bg-red-600' : 'bg-amber-600'} text-white`}>
          {card.power}
        </div>
      </div>
      
      <h3 className={`font-medievalsharp text-base mt-1 ${isEnemy ? 'text-red-200' : 'text-amber-200'}`}>
        {card.name}
      </h3>
      
      <div className={`rounded-md mt-1 px-2 py-1 text-xs font-bold ${getAbilityColor(card.ability)}`}>
        {card.ability}
      </div>
      
      <div className="border-t border-gray-600 mt-2 pt-1">
        <p className="text-xs text-gray-300">Power: {card.power}</p>
      </div>
    </motion.div>
  );
};

export default Card;
