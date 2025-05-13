import { create } from "zustand";
import { characters } from "../characterData";
import { cards } from "../cardData";
import { cardEffects, rarityWeights } from "../gameEffects";

// Game state types
type GameState = "title" | "selection" | "battle" | "result" | "tutorial";

interface Character {
  name: string;
  hp: number;
  defense: number;
  rarity: string;
  hand: Card[];
  shield: boolean;
}

interface Card {
  name: string;
  emoji: string;
  power: number;
  ability: string;
  effect?: string;
}

// Achievement system
interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

interface GameStore {
  // State
  gameState: GameState;
  player: Character | null;
  enemy: Character | null;
  logs: string[];
  achievements: Achievement[];
  tutorialStep: number;
  shieldCounter: number;
  burnCounter: number;
  freezeCounter: number;
  gameMode: string;
  enemyHandRevealed: boolean;
  
  // Actions
  startCharacterSelection: () => void;
  startTutorial: () => void;
  nextTutorialStep: () => void;
  selectCharacter: (char: any) => void;
  backToTitle: () => void;
  drawHands: () => void;
  playCard: (index: number) => void;
  addLog: (message: string) => void;
  unlockAchievement: (id: string) => void;
  setGameMode: (mode: string) => void;
  viewAchievements: () => void;
  revealEnemyHand: () => void;
}

// Initial achievements
const initialAchievements: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first battle',
    unlocked: false,
    icon: '🏆'
  },
  {
    id: 'shield_master',
    name: 'Shield Master',
    description: 'Block damage 3 times in a single game',
    unlocked: false,
    icon: '🛡️'
  },
  {
    id: 'fire_wizard',
    name: 'Fire Wizard',
    description: 'Deal burn damage 5 times',
    unlocked: false,
    icon: '🔥'
  },
  {
    id: 'ice_mage',
    name: 'Ice Mage',
    description: 'Freeze enemies 5 times',
    unlocked: false,
    icon: '❄️'
  },
  {
    id: 'rare_collector',
    name: 'Rare Collector',
    description: 'Select a Legendary or higher character',
    unlocked: false,
    icon: '✨'
  },
  {
    id: 'lucky_draw',
    name: 'Lucky Draw',
    description: 'Get a Divine character in character selection',
    unlocked: false,
    icon: '🎰'
  }
];

export const useCardGame = create<GameStore>((set, get) => ({
  gameState: "title",
  player: null,
  enemy: null,
  logs: [],
  achievements: initialAchievements,
  tutorialStep: 0,
  shieldCounter: 0,
  burnCounter: 0,
  freezeCounter: 0,
  gameMode: "standard",
  enemyHandRevealed: false,
  
  startCharacterSelection: () => {
    set({ gameState: "selection" });
  },

  startTutorial: () => {
    // Create preset characters for tutorial
    const tutorialPlayer = createCharacter({
      name: "Apprentice",
      baseHP: 30,
      rarity: "Common"
    });
    
    const tutorialEnemy = createCharacter({
      name: "Training Dummy",
      baseHP: 20,
      rarity: "Common"
    });
    
    set({ 
      gameState: "tutorial", 
      player: tutorialPlayer,
      enemy: tutorialEnemy,
      tutorialStep: 1,
      logs: ["Welcome to the tutorial! Follow the instructions to learn how to play."]
    });
  },
  
  nextTutorialStep: () => {
    const { tutorialStep } = get();
    set({ tutorialStep: tutorialStep + 1 });
  },
  
  selectCharacter: (char) => {
    // Create player character
    const player = createCharacter(char);
    
    // Select random enemy
    const characterWeights = characters.map(c => {
      // Make TypeScript happy with this type assertion
      const rarity = c.rarity as keyof typeof rarityWeights;
      return rarityWeights[rarity] || 1; // Fallback to 1 if rarity not found
    });
    
    const enemyChar = weightedRandomSelect(characters, characterWeights, 1)[0];
    const enemy = createCharacter(enemyChar);
    
    set({ 
      gameState: "battle", 
      player, 
      enemy, 
      logs: [`You selected ${player.name} (${player.rarity})`, `Your opponent is ${enemy.name} (${enemy.rarity})`] 
    });
  },
  
  backToTitle: () => {
    set({ 
      gameState: "title", 
      player: null, 
      enemy: null, 
      logs: [],
      // Reset counters when going back to title
      shieldCounter: 0,
      burnCounter: 0,
      freezeCounter: 0
    });
  },
  
  drawHands: () => {
    set(state => {
      if (!state.player || !state.enemy) return state;
      
      // Create new hands
      const playerHand = [];
      const enemyHand = [];
      
      for (let i = 0; i < 4; i++) {
        playerHand.push(structuredClone(cards[Math.floor(Math.random() * cards.length)]));
        enemyHand.push(structuredClone(cards[Math.floor(Math.random() * cards.length)]));
      }
      
      return {
        player: {
          ...state.player,
          hand: playerHand
        },
        enemy: {
          ...state.enemy,
          hand: enemyHand
        },
        logs: [...state.logs, "New cards drawn"]
      };
    });
  },
  
  playCard: (index) => {
    const { player, enemy } = get();
    if (!player || !enemy) return;
    
    set(state => {
      const newState = { ...state };
      
      // Clone current state for modifications
      const updatedPlayer = { ...player };
      const updatedEnemy = { ...enemy };
      
      // Get cards to play
      const playerCard = updatedPlayer.hand[index];
      const enemyCardIndex = Math.floor(Math.random() * updatedEnemy.hand.length);
      const enemyCard = updatedEnemy.hand[enemyCardIndex];
      
      // Track effect counters for achievements
      let shieldUsed = false;
      let burnUsed = false;
      let freezeUsed = false;
      
      // Log card played
      newState.logs = [
        ...newState.logs, 
        `You played: ${playerCard.name} (${playerCard.ability})`,
        `Enemy played: ${enemyCard.name} (${enemyCard.ability})`
      ];
      
      // Apply player card effects first
      if (playerCard.effect && typeof playerCard.effect === 'string') {
        const effectKey = playerCard.effect as keyof typeof cardEffects;
        if (cardEffects[effectKey]) {
          try {
            // Apply the effect and get the result message
            const resultMessage = cardEffects[effectKey](
              playerCard, 
              enemyCard, 
              updatedPlayer, 
              updatedEnemy, 
              () => { newState.logs.push("Enemy hand revealed!"); }
            );
            
            // Log the effect result
            newState.logs.push(resultMessage);
            
            // Track effects for achievements
            if (playerCard.effect === 'Shield' || playerCard.effect === 'Protect' || 
                playerCard.effect === 'Ethereal' || playerCard.effect === 'Crystallize') {
              shieldUsed = true;
            }
            
            if (playerCard.effect === 'Burn') {
              burnUsed = true;
            }
            
            if (playerCard.effect === 'Freeze') {
              freezeUsed = true;
            }
            
            // Handle special case for Rewind effect - add another card
            if (playerCard.effect === 'Rewind') {
              updatedPlayer.hand.push(structuredClone(cards[Math.floor(Math.random() * cards.length)]));
            }
          } catch (error) {
            console.error(`Error applying effect of ${playerCard.name}:`, error);
            newState.logs.push(`Effect of ${playerCard.name} failed!`);
          }
        }
      }
      
      // Then apply enemy card effects
      if (enemyCard.effect && typeof enemyCard.effect === 'string') {
        const effectKey = enemyCard.effect as keyof typeof cardEffects;
        if (cardEffects[effectKey]) {
          try {
            // Apply the effect and get the result message
            const resultMessage = cardEffects[effectKey](
              enemyCard, 
              playerCard, 
              updatedEnemy, 
              updatedPlayer, 
              () => {}
            );
            
            // Log the effect result
            newState.logs.push(`Enemy's ${resultMessage}`);
          } catch (error) {
            console.error(`Error applying effect of ${enemyCard.name}:`, error);
            newState.logs.push(`Enemy's effect of ${enemyCard.name} failed!`);
          }
        }
      }
      
      // Calculate damage
      if (!updatedPlayer.shield) {
        const damageToPlayer = Math.max(0, enemyCard.power - updatedPlayer.defense);
        updatedPlayer.hp -= damageToPlayer;
        newState.logs.push(`You took ${damageToPlayer} damage (reduced by ${updatedPlayer.defense} defense)`);
      } else {
        newState.logs.push(`You were shielded and took no damage`);
        
        // Count towards shield master achievement if player used shield
        if (shieldUsed) {
          // We'll track this in game state to count the 3 needed for achievement
          state.shieldCounter = (state.shieldCounter || 0) + 1;
          
          // If we've blocked 3 times, unlock the achievement
          if (state.shieldCounter >= 3) {
            get().unlockAchievement('shield_master');
          }
        }
      }
      
      if (!updatedEnemy.shield) {
        const damageToEnemy = Math.max(0, playerCard.power - updatedEnemy.defense);
        updatedEnemy.hp -= damageToEnemy;
        newState.logs.push(`Enemy took ${damageToEnemy} damage (reduced by ${updatedEnemy.defense} defense)`);
        
        // Track fire wizard and ice mage achievements
        if (burnUsed) {
          state.burnCounter = (state.burnCounter || 0) + 1;
          if (state.burnCounter >= 5) {
            get().unlockAchievement('fire_wizard');
          }
        }
        
        if (freezeUsed) {
          state.freezeCounter = (state.freezeCounter || 0) + 1;
          if (state.freezeCounter >= 5) {
            get().unlockAchievement('ice_mage');
          }
        }
      } else {
        newState.logs.push(`Enemy was shielded and took no damage`);
      }
      
      // Reset shields
      updatedPlayer.shield = false;
      updatedEnemy.shield = false;
      
      // Check for game over
      if (updatedPlayer.hp <= 0) {
        newState.logs.push(`Defeat! You have been defeated.`);
        setTimeout(() => {
          alert("Defeat! The enemy has prevailed.");
          set({ 
            gameState: "title", 
            player: null, 
            enemy: null, 
            logs: [],
            shieldCounter: 0,
            burnCounter: 0,
            freezeCounter: 0
          });
        }, 500);
      } else if (updatedEnemy.hp <= 0) {
        newState.logs.push(`Victory! You have defeated your opponent.`);
        
        // Unlock the first victory achievement
        get().unlockAchievement('first_win');
        
        // Check for rare collector achievement
        if (player.rarity === 'Legendary' || player.rarity === 'Mythic' || player.rarity === 'Divine') {
          get().unlockAchievement('rare_collector');
        }
        
        // Check for lucky draw achievement in character selection
        if (player.rarity === 'Divine') {
          get().unlockAchievement('lucky_draw');
        }
        
        setTimeout(() => {
          alert("Victory! You have vanquished your foe!");
          set({ 
            gameState: "title", 
            player: null, 
            enemy: null, 
            logs: [],
            shieldCounter: 0,
            burnCounter: 0,
            freezeCounter: 0
          });
        }, 500);
      }
      
      // Update state with modified player/enemy
      newState.player = updatedPlayer;
      newState.enemy = updatedEnemy;
      
      // Draw new cards
      const newPlayerHand = updatedPlayer.hand.filter((_, i) => i !== index);
      const newEnemyHand = updatedEnemy.hand.filter((_, i) => i !== enemyCardIndex);
      
      // Add a new card to each hand if there are less than 4 cards
      if (newPlayerHand.length < 4) {
        newPlayerHand.push(structuredClone(cards[Math.floor(Math.random() * cards.length)]));
      }
      
      if (newEnemyHand.length < 4) {
        newEnemyHand.push(structuredClone(cards[Math.floor(Math.random() * cards.length)]));
      }
      
      newState.player.hand = newPlayerHand;
      newState.enemy.hand = newEnemyHand;
      
      return newState;
    });
  },
  
  addLog: (message) => {
    set(state => ({
      logs: [...state.logs, message]
    }));
  },
  
  unlockAchievement: (id) => {
    set(state => {
      // Find the achievement and mark it as unlocked
      const updatedAchievements = state.achievements.map(achievement => 
        achievement.id === id ? { ...achievement, unlocked: true } : achievement
      );
      
      // Show achievement unlock notification
      const achievement = state.achievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        // Only notify if it wasn't already unlocked
        setTimeout(() => {
          // Use toast instead of alert for a nicer user experience
          import('sonner').then(({ toast }) => {
            toast.success(`🏆 Achievement Unlocked: ${achievement.name}`, {
              description: achievement.description,
              duration: 5000,
              position: 'bottom-right',
              icon: achievement.icon
            });
          });
        }, 1000);
      }
      
      return { achievements: updatedAchievements };
    });
  },
  
  setGameMode: (mode) => {
    set({ gameMode: mode });
  },
  
  viewAchievements: () => {
    // This is a placeholder function that will be used by the TitleScreen component
    // The actual implementation happens in the TitleScreen component with useState
  },
  
  revealEnemyHand: () => {
    set({ enemyHandRevealed: true });
    
    setTimeout(() => {
      set({ enemyHandRevealed: false });
    }, 5000); // Hide enemy hand after 5 seconds
  }
}));

// Helper functions
function createCharacter(char: any): Character {
  return {
    name: char.name,
    hp: char.baseHP,
    defense: getRarityDefense(char.rarity),
    rarity: char.rarity,
    hand: [],
    shield: false
  };
}

function getRarityDefense(rarity: string): number {
  const defenseValues: Record<string, number> = {
    Common: 0,
    Uncommon: 1,
    Rare: 2,
    Epic: 3,
    Legendary: 5,
    Mythic: 7,
    Divine: 10
  };
  
  // TypeScript safety check
  return (defenseValues as Record<string, number>)[rarity] || 0;
}

function weightedRandomSelect(items: any[], weights: number[], k: number): any[] {
  if (items.length !== weights.length) {
    throw new Error("Items and weights must have the same length");
  }
  
  if (k > items.length) {
    throw new Error("Cannot select more items than available");
  }
  
  const selected: any[] = [];
  const tempWeights = [...weights];
  let totalWeight = tempWeights.reduce((sum, w) => sum + w, 0);
  
  while (selected.length < k) {
    const rand = Math.random() * totalWeight;
    let cumulative = 0;
    
    for (let i = 0; i < items.length; i++) {
      if (tempWeights[i] === 0) continue;
      
      cumulative += tempWeights[i];
      
      if (rand < cumulative) {
        selected.push(items[i]);
        totalWeight -= tempWeights[i];
        tempWeights[i] = 0;
        break;
      }
    }
  }
  
  return selected;
}

// This function has been replaced with a more robust implementation directly in playCard
// Keeping this as a reference but it's no longer used
function applyEffect(playerCard: Card, enemyCard: Card, self: Character, opponent: Character, state: any): void {
  if (playerCard.effect && typeof playerCard.effect === 'string') {
    const effectKey = playerCard.effect as keyof typeof cardEffects;
    if (cardEffects[effectKey]) {
      try {
        cardEffects[effectKey](playerCard, enemyCard, self, opponent, () => {
          state.logs.push("Enemy hand revealed!");
        });
      } catch (error) {
        console.error(`Error applying effect of ${playerCard.name}:`, error);
      }
    }
  }
}
