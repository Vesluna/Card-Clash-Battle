import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GameLogProps {
  logs: string[];
}

const GameLog = ({ logs }: GameLogProps) => {
  const logRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever logs update
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);
  
  return (
    <div className="bg-gradient-to-b from-gray-900/80 to-gray-800/80 h-full rounded-lg p-4 shadow-lg backdrop-blur-sm overflow-hidden flex flex-col">
      <h3 className="text-amber-300 font-medievalsharp mb-2">Battle Log</h3>
      
      <div 
        ref={logRef}
        className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-gray-800 p-2 bg-black/30 rounded-md"
      >
        <AnimatePresence initial={false}>
          {logs.map((log, index) => (
            <motion.div
              key={`log-${index}`}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-1 last:mb-0"
            >
              <LogEntry message={log} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {logs.length === 0 && (
          <div className="text-gray-500 text-sm italic text-center p-4">
            The battle has not yet begun...
          </div>
        )}
      </div>
    </div>
  );
};

const LogEntry = ({ message, index }: { message: string; index: number }) => {
  // Determine message type and style accordingly
  const getMessageStyle = () => {
    if (message.includes("played:")) return "text-blue-300";
    if (message.includes("took")) return "text-red-300";
    if (message.includes("revealed")) return "text-purple-300";
    if (message.includes("Enemy took")) return "text-green-300";
    return "text-gray-300";
  };
  
  // Add emoji based on message content
  const getEmoji = () => {
    if (message.includes("played:")) return "🃏";
    if (message.includes("took") && !message.includes("Enemy")) return "💥";
    if (message.includes("revealed")) return "👁️";
    if (message.includes("Enemy took")) return "⚔️";
    if (message.includes("Shielded")) return "🛡️";
    return "📜";
  };
  
  return (
    <div className="flex items-start space-x-2 text-sm">
      <span className="text-gray-500 whitespace-nowrap">{`[${index + 1}]`}</span>
      <span className="mr-1">{getEmoji()}</span>
      <span className={getMessageStyle()}>{message}</span>
    </div>
  );
};

export default GameLog;
