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
    const characterWeights = characters.map(c => rarityWeights[c.rarity]);
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
      logs: [] 
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
      
      // Log card played
      newState.logs = [
        ...newState.logs, 
        `You played: ${playerCard.name} (${playerCard.ability})`,
        `Enemy played: ${enemyCard.name} (${enemyCard.ability})`
      ];
      
      // Apply card effects
      applyEffect(playerCard, enemyCard, updatedPlayer, updatedEnemy, newState);
      applyEffect(enemyCard, playerCard, updatedEnemy, updatedPlayer, newState);
      
      // Calculate damage
      if (!updatedPlayer.shield) {
        const damageToPlayer = Math.max(0, enemyCard.power - updatedPlayer.defense);
        updatedPlayer.hp -= damageToPlayer;
        newState.logs.push(`You took ${damageToPlayer} damage (reduced by ${updatedPlayer.defense} defense)`);
      } else {
        newState.logs.push(`You were shielded and took no damage`);
      }
      
      if (!updatedEnemy.shield) {
        const damageToEnemy = Math.max(0, playerCard.power - updatedEnemy.defense);
        updatedEnemy.hp -= damageToEnemy;
        newState.logs.push(`Enemy took ${damageToEnemy} damage (reduced by ${updatedEnemy.defense} defense)`);
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
          set({ gameState: "title", player: null, enemy: null, logs: [] });
        }, 500);
      } else if (updatedEnemy.hp <= 0) {
        newState.logs.push(`Victory! You have defeated your opponent.`);
        
        // Unlock the first victory achievement
        get().unlockAchievement('first_win');
        
        // Check for rare collector achievement
        if (player.rarity === 'Legendary' || player.rarity === 'Mythic' || player.rarity === 'Divine') {
          get().unlockAchievement('rare_collector');
        }
        
        setTimeout(() => {
          alert("Victory! You have vanquished your foe!");
          set({ gameState: "title", player: null, enemy: null, logs: [] });
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
          alert(`🏆 Achievement Unlocked: ${achievement.name}\n${achievement.description}`);
        }, 1000);
      }
      
      return { achievements: updatedAchievements };
    });
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
  
  return defenseValues[rarity] || 0;
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

function applyEffect(playerCard: Card, enemyCard: Card, self: Character, opponent: Character, state: any): void {
  if (playerCard.effect && cardEffects[playerCard.effect]) {
    try {
      cardEffects[playerCard.effect](playerCard, enemyCard, self, opponent, () => {
        state.logs.push("Enemy hand revealed!");
      });
    } catch (error) {
      console.error(`Error applying effect of ${playerCard.name}:`, error);
    }
  }
}
