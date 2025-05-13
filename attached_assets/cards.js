// Define effect functions separately to avoid cloning issues
const cardEffects = {
  Burn: (playerCard, enemyCard, player, enemy) => {
    enemy.hp -= 2;
    return "Burn effect deals 2 damage";
  },
  Freeze: (playerCard, enemyCard, player, enemy) => {
    enemyCard.power = Math.max(0, enemyCard.power - 2);
    return "Freeze effect reduces enemy power by 2";
  },
  Steal: (playerCard, enemyCard, player, enemy) => {
    playerCard.power = enemyCard.power;
    return "Copied enemy card's power";
  },
  Shield: (playerCard, enemyCard, player, enemy) => {
    player.shield = true;
    return "Shield activated";
  },
  RevealHand: (playerCard, enemyCard, player, enemy, revealEnemyHand) => {
    revealEnemyHand();
    return "Enemy hand revealed";
  },
  DiceRoll: (playerCard, enemyCard, player, enemy) => {
    const roll = Math.floor(Math.random() * 6) + 1;
    if (roll <= 2) {
      enemy.hp -= 3;
      return `Rolled ${roll}: Deals 3 damage`;
    } else if (roll <= 4) {
      enemy.hp -= 1;
      return `Rolled ${roll}: Deals 1 damage`;
    } else {
      enemy.hp -= 5;
      return `Rolled ${roll}: Deals 5 damage`;
    }
  },
  Shock: (playerCard, enemyCard, player, enemy) => {
    enemyCard.power = 0;
    return "Enemy card power reduced to 0";
  },
  Sturdy: (playerCard, enemyCard, player, enemy) => {
    enemyCard.power = Math.max(0, enemyCard.power - 2);
    return "Reduced enemy power by 2";
  },
  Gust: (playerCard, enemyCard, player, enemy) => {
    enemyCard.power -= 1;
    return "Reduced enemy power by 1";
  },
  Heal: (playerCard, enemyCard, player, enemy) => {
    player.hp += 3;
    return "Healed 3 HP";
  },
  Poison: (playerCard, enemyCard, player, enemy) => {
    enemy.hp -= 3;
    return "Poison deals 3 damage";
  },
  Protect: (playerCard, enemyCard, player, enemy) => {
    player.shield = true;
    return "Protection shield activated";
  },
  Spellcast: (playerCard, enemyCard, player, enemy) => {
    const spell = Math.floor(Math.random() * 3);
    if (spell === 0) {
      enemy.hp -= 3;
      return "Fireball deals 3 damage";
    } else if (spell === 1) {
      enemyCard.power = Math.max(0, enemyCard.power - 2);
      return "Frost reduces enemy power by 2";
    } else {
      enemy.hp -= 2;
      enemyCard.power = 0;
      return "Lightning deals 2 damage and nullifies power";
    }
  }
};
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    enemy.hp -= randomCard.power;
  },
  Foresight: (playerCard, enemyCard, player, enemy, revealEnemyHand) => revealEnemyHand(),
  Chaos: (playerCard, enemyCard, player, enemy) => {
    const temp = playerCard.power;
    playerCard.power = enemyCard.power;
    enemyCard.power = temp;
  }
};

const cards = [
  { name: "Flame Warrior", emoji: "🔥", power: 5, ability: "Burn", effect: "Burn" },
  { name: "Ice Mage", emoji: "❄️", power: 4, ability: "Freeze", effect: "Freeze" },
  { name: "Shadow Thief", emoji: "🕵️", power: 3, ability: "Steal", effect: "Steal" },
  { name: "Guardian Knight", emoji: "🛡️", power: 6, ability: "Shield", effect: "Shield" },
  { name: "Mind Seer", emoji: "👁️", power: 2, ability: "Reveal Hand", effect: "RevealHand" },
  { name: "Dice Goblin", emoji: "🎲", power: 1, ability: "Dice Roll", effect: "DiceRoll" },
  { name: "Thunder Archer", emoji: "🏹", power: 4, ability: "Shock", effect: "Shock" },
  { name: "Earth Golem", emoji: "🗿", power: 7, ability: "Sturdy", effect: "Sturdy" },
  { name: "Wind Sprite", emoji: "🌪️", power: 3, ability: "Gust", effect: "Gust" },
  { name: "Water Healer", emoji: "💧", power: 2, ability: "Heal", effect: "Heal" },
  { name: "Dark Assassin", emoji: "🗡️", power: 5, ability: "Poison", effect: "Poison" },
  { name: "Light Paladin", emoji: "⚔️", power: 6, ability: "Protect", effect: "Protect" },
  { name: "Arcane Wizard", emoji: "🧙", power: 4, ability: "Spellcast", effect: "Spellcast" },
  { name: "Beast Tamer", emoji: "🐾", power: 3, ability: "Summon", effect: "Summon" },
  { name: "Mystic Oracle", emoji: "🔮", power: 2, ability: "Foresight", effect: "Foresight" },
  { name: "Chaos Sorcerer", emoji: "🌀", power: 5, ability: "Chaos", effect: "Chaos" }
];