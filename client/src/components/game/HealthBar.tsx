import { motion } from "framer-motion";

interface HealthBarProps {
  current: number;
  max: number;
  player: boolean;
  shield?: boolean;
}

const HealthBar = ({ current, max, player, shield = false }: HealthBarProps) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  // Determine health bar color based on health percentage
  const getHealthBarColor = () => {
    if (percentage > 75) return player ? "bg-green-500" : "bg-red-500";
    if (percentage > 35) return player ? "bg-yellow-500" : "bg-orange-500";
    return player ? "bg-red-500" : "bg-red-800";
  };
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-300 mb-1">
        <span>HP: {current}/{max}</span>
        {shield && (
          <motion.span
            className="inline-flex items-center text-amber-300"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring" }}
          >
            🛡️ Shielded
          </motion.span>
        )}
      </div>
      <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden relative">
        <motion.div
          className={`h-full ${getHealthBarColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
        
        {/* Decorative health bar segments */}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div 
              key={i} 
              className="flex-1 border-r border-gray-700 last:border-r-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthBar;
