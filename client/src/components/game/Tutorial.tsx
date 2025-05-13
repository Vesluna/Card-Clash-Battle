import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCardGame } from "@/lib/stores/useCardGame";
import Card from "./Card";
import HealthBar from "./HealthBar";
import GameLog from "./GameLog";
import { useAudio } from "@/lib/stores/useAudio";

// Tutorial steps
const tutorialSteps = [
  {
    title: "Welcome to Card Clash!",
    content: "In this tutorial, you'll learn how to play the game. Follow the steps to master the basics.",
    action: "Next"
  },
  {
    title: "Game Objective",
    content: "The goal is to reduce your opponent's health to zero by playing cards with different powers and abilities.",
    action: "Next"
  },
  {
    title: "Your Hand",
    content: "You start with 4 cards in your hand. After playing a card, a new one will be drawn to replace it.",
    action: "Next"
  },
  {
    title: "Card Abilities",
    content: "Each card has a power value and a special ability. Abilities can deal extra damage, shield you, or affect enemy cards.",
    action: "Next"
  },
  {
    title: "Combat",
    content: "When you play a card, the enemy plays one too. The power values are compared and damage is calculated after applying abilities.",
    action: "Next"
  },
  {
    title: "Defense",
    content: "Characters have defense values that reduce damage. Rarer characters have higher defense values.",
    action: "Next"
  },
  {
    title: "Let's Practice!",
    content: "Now try playing a card from your hand. Select a card to play it against the training dummy.",
    action: "Play a Card"
  },
  {
    title: "Well Done!",
    content: "You've completed the basic tutorial. Now you're ready to start a real battle!",
    action: "Finish Tutorial"
  }
];

const Tutorial = () => {
  const { player, enemy, logs, tutorialStep, nextTutorialStep, backToTitle, drawHands, playCard } = useCardGame();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const { playHit } = useAudio();
  
  // Initialize hands when the tutorial starts
  useEffect(() => {
    if (tutorialStep === 1) {
      drawHands();
    }
  }, [tutorialStep, drawHands]);
  
  const handleNextStep = () => {
    nextTutorialStep();
    
    // If we just reached the practice step, play a hit sound to draw attention
    if (tutorialStep === 6) {
      playHit();
    }
  };
  
  const handleCardPlay = (index: number) => {
    if (tutorialStep !== 7) return; // Only allow card play in the practice step
    
    setSelectedCard(index);
    playHit();
    
    // After a short delay, execute the card action and move to the next step
    setTimeout(() => {
      playCard(index);
      nextTutorialStep();
      setSelectedCard(null);
    }, 1000);
  };
  
  const handleFinishTutorial = () => {
    backToTitle();
  };
  
  // Render the appropriate button based on current step
  const renderActionButton = () => {
    const currentStep = tutorialSteps[tutorialStep - 1];
    
    if (tutorialStep === 7) {
      // In the practice step, don't show a button - player must click a card
      return null; 
    }
    
    if (tutorialStep === 8) {
      // Final step - finish button
      return (
        <button
          onClick={handleFinishTutorial}
          className="mt-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold py-3 px-8 text-xl rounded-lg shadow-lg hover:from-green-500 hover:to-green-400 transform hover:scale-105 transition duration-200"
        >
          {currentStep.action}
        </button>
      );
    }
    
    // Default next button
    return (
      <button
        onClick={handleNextStep}
        className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 px-8 text-xl rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-400 transform hover:scale-105 transition duration-200"
      >
        {currentStep.action}
      </button>
    );
  };
  
  if (!player || !enemy) {
    return <div className="text-white">Loading tutorial...</div>;
  }
  
  const currentStep = tutorialSteps[tutorialStep - 1];
  
  return (
    <motion.div 
      className="flex flex-col h-full w-full p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Tutorial header with health bars */}
      <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-lg p-4 mb-4 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-5/12 flex flex-col">
            <div className="font-medievalsharp text-lg text-amber-300">
              {player.name} <span className="text-amber-200">(Tutorial)</span>
            </div>
            <HealthBar 
              current={player.hp} 
              max={30} 
              player={true} 
              shield={player.shield}
            />
          </div>
          
          <div className="text-amber-400 font-bold text-lg">VS</div>
          
          <div className="w-full md:w-5/12 flex flex-col">
            <div className="font-medievalsharp text-lg text-red-300">
              {enemy.name} <span className="text-red-200">(Tutorial)</span>
            </div>
            <HealthBar 
              current={enemy.hp} 
              max={20} 
              player={false} 
              shield={enemy.shield}
            />
          </div>
        </div>
      </div>
      
      {/* Tutorial content */}
      <div className="flex-grow flex flex-col md:flex-row gap-4">
        {/* Tutorial instruction panel */}
        <motion.div 
          className="w-full md:w-1/2 bg-gradient-to-b from-blue-900/70 to-blue-800/70 rounded-lg p-6 shadow-lg backdrop-blur-sm"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-medievalsharp text-blue-300 mb-4">
            {currentStep.title}
          </h2>
          
          <p className="text-gray-100 mb-6 text-lg">
            {currentStep.content}
          </p>
          
          {renderActionButton()}
          
          <div className="mt-6 text-sm text-blue-200">
            Step {tutorialStep} of {tutorialSteps.length}
          </div>
        </motion.div>
        
        {/* Game area */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          {/* Battle log area */}
          <motion.div 
            className="flex-grow"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <GameLog logs={logs} />
          </motion.div>
          
          {/* Player hand area */}
          <div className="w-full">
            <motion.div 
              className="bg-gradient-to-b from-gray-900/70 to-gray-800/70 rounded-lg p-4 shadow-lg backdrop-blur-sm overflow-y-auto"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-amber-300 font-medievalsharp mb-2">Your Cards</h3>
              
              <div className="space-y-2">
                {player.hand.map((card, idx) => (
                  <motion.div
                    key={`tutorial-card-${idx}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: selectedCard === idx ? 1.05 : 1,
                      boxShadow: selectedCard === idx ? 
                        "0 0 15px rgba(245, 158, 11, 0.7)" : "none"
                    }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: tutorialStep === 7 ? 1.02 : 1 }}
                  >
                    <Card 
                      card={card} 
                      onClick={() => tutorialStep === 7 && handleCardPlay(idx)} 
                      disabled={tutorialStep !== 7}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Tutorial;