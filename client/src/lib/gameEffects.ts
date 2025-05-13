// Card effect definitions and rarity data

// Rarity weights for character selection
export const rarityWeights: Record<string, number> = {
  Common: 1000,
  Uncommon: 500,
  Rare: 250,
  Epic: 100,
  Legendary: 50,
  Mythic: 10,
  Divine: 1
};

// Card effect functions
export const cardEffects = {
  // Original effects
  Burn: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    enemy.hp -= 2;
    return "🔥 Burn effect deals 2 damage!";
  },
  
  Freeze: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    enemyCard.power = Math.max(0, enemyCard.power - 2);
    return "❄️ Freeze effect reduces enemy card power by 2!";
  },
  
  Steal: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    playerCard.power = enemyCard.power;
    return "🕵️ Steal copies the enemy card's power!";
  },
  
  Shield: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    player.shield = true;
    return "🛡️ Shield protects from damage this turn!";
  },
  
  RevealHand: (playerCard: any, enemyCard: any, player: any, enemy: any, revealEnemyHand: any) => {
    if (revealEnemyHand && typeof revealEnemyHand === 'function') {
      revealEnemyHand();
    }
    return "👁️ Reveal Hand exposes enemy cards for 5 seconds!";
  },
  
  DiceRoll: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    let damage = 0;
    
    if (roll <= 2) damage = 3;
    else if (roll <= 4) damage = 1;
    else damage = 5;
    
    enemy.hp -= damage;
    return `🎲 Dice Roll landed on ${roll} and dealt ${damage} damage!`;
  },
  
  Shock: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    enemyCard.power = 0;
    return "⚡ Shock completely nullifies the enemy card's power!";
  },
  
  Sturdy: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    enemyCard.power = Math.max(0, enemyCard.power - 2);
    return "🗿 Sturdy reduces enemy card power by 2!";
  },
  
  Gust: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    enemyCard.power -= 1;
    return "🌪️ Gust reduces enemy card power by 1!";
  },
  
  Heal: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    player.hp += 3;
    return "💧 Heal restores 3 health points!";
  },
  
  Poison: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    enemy.hp -= 3;
    return "🧪 Poison deals 3 damage over time!";
  },
  
  Protect: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    player.shield = true;
    return "🛡️ Protect creates a shield against damage!";
  },
  
  Spellcast: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    const spell = Math.floor(Math.random() * 3);
    if (spell === 0) {
      enemy.hp -= 3;
      return "🔮 Spellcast: Fireball deals 3 damage!";
    } else if (spell === 1) {
      enemyCard.power = Math.max(0, enemyCard.power - 2);
      return "🔮 Spellcast: Frost reduces enemy card power by 2!";
    } else {
      enemy.hp -= 2;
      enemyCard.power = 0;
      return "🔮 Spellcast: Lightning deals 2 damage and negates enemy card power!";
    }
  },
  
  Summon: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    // Simulate summoning a random creature with random power
    const summonPower = Math.floor(Math.random() * 4) + 1;
    enemy.hp -= summonPower;
    return `🐾 Summon calls a creature that deals ${summonPower} damage!`;
  },
  
  Foresight: (playerCard: any, enemyCard: any, player: any, enemy: any, revealEnemyHand: any) => {
    if (revealEnemyHand && typeof revealEnemyHand === 'function') {
      revealEnemyHand();
    }
    return "🔮 Foresight reveals the enemy's hand for 5 seconds!";
  },
  
  Chaos: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    const temp = playerCard.power;
    playerCard.power = enemyCard.power;
    enemyCard.power = temp;
    return "🌀 Chaos swaps the power of both cards!";
  },
  
  // New effects for the new cards
  Lifesteal: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    const damage = 2;
    enemy.hp -= damage;
    player.hp += damage;
    return `🧛 Lifesteal drains ${damage} health from the enemy!`;
  },
  
  Rewind: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    // Reset enemy card power to original
    enemyCard.power = 0;
    // Draw a new card for player (handled in main game loop)
    return "⏳ Rewind resets the enemy card and grants a bonus draw!";
  },
  
  Infect: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    enemy.hp -= 1;
    enemyCard.power = Math.max(0, enemyCard.power - 1);
    return "🦠 Infect weakens the enemy and their card!";
  },
  
  Fortune: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    // 50% chance to double power
    if (Math.random() > 0.5) {
      playerCard.power *= 2;
      return "💰 Fortune doubles your card's power!";
    }
    return "💰 Fortune didn't smile on you this time!";
  },
  
  Reflect: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    playerCard.power = enemyCard.power;
    return "🪞 Reflect copies the enemy card's power!";
  },
  
  Ethereal: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    player.shield = true;
    return "👻 Ethereal grants you a shield this turn!";
  },
  
  Bombardment: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    const hits = Math.floor(Math.random() * 3) + 1;
    const totalDamage = hits * 2;
    enemy.hp -= totalDamage;
    return `☄️ Bombardment hits ${hits} times for ${totalDamage} damage!`;
  },
  
  ChainLightning: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    enemy.hp -= 3;
    enemyCard.power = 0;
    return "⚡ Chain Lightning deals 3 damage and negates enemy card power!";
  },
  
  Crystallize: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    enemyCard.power = 0;
    player.shield = true;
    return "💎 Crystallize freezes the enemy card and creates a shield!";
  },
  
  SoulHarvest: (playerCard: any, enemyCard: any, player: any, enemy: any) => {
    const damage = Math.min(4, enemy.hp - 1); // Don't kill outright
    enemy.hp -= damage;
    playerCard.power += damage;
    return `💀 Soul Harvest deals ${damage} damage and adds it to your power!`;
  }
};
