// Rarity weights for character selection (tuned for ~0.1% Divine chance)
const rarityWeights = {
  Common: 1000,
  Uncommon: 500,
  Rare: 250,
  Epic: 100,
  Legendary: 50,
  Mythic: 10,
  Divine: 1
};

// Defense values based on rarity
const rarities = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 5,
  Mythic: 7,
  Divine: 10
};

// Character pool
const characters = [
  { name: "Squire", baseHP: 30, rarity: "Common" },
  { name: "Rogue", baseHP: 28, rarity: "Uncommon" },
  { name: "Mage", baseHP: 25, rarity: "Rare" },
  { name: "Knight", baseHP: 35, rarity: "Epic" },
  { name: "Dragon Lord", baseHP: 40, rarity: "Legendary" },
  { name: "Phoenix Rider", baseHP: 38, rarity: "Mythic" },
  { name: "Celestial Guardian", baseHP: 45, rarity: "Divine" },
  { name: "Forest Druid", baseHP: 32, rarity: "Common" },
  { name: "Berserker", baseHP: 33, rarity: "Uncommon" },
  { name: "Necromancer", baseHP: 27, rarity: "Rare" },
  { name: "Paladin", baseHP: 36, rarity: "Epic" },
  { name: "Warlock", baseHP: 29, rarity: "Legendary" },
  { name: "Valkyrie", baseHP: 37, rarity: "Mythic" },
  { name: "Titan", baseHP: 42, rarity: "Divine" },
  { name: "Monk", baseHP: 31, rarity: "Common" },
  { name: "Assassin", baseHP: 26, rarity: "Uncommon" }
];

let player;
let enemy;

function createCharacter(char) {
  try {
    if (!char || !char.name || !char.baseHP || !char.rarity) {
      throw new Error("Invalid character data");
    }
    return {
      name: char.name,
      hp: char.baseHP,
      defense: rarities[char.rarity],
      rarity: char.rarity,
      hand: [],
      shield: false
    };
  } catch (error) {
    console.error("Error creating character:", error);
    throw error;
  }
}

function weightedRandomSelect(items, weights, k) {
  try {
    if (items.length !== weights.length) throw new Error("Items and weights must have the same length");
    if (k > items.length) throw new Error("Cannot select more items than available");
    const selected = [];
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
  } catch (error) {
    console.error("Error in weightedRandomSelect:", error);
    throw error;
  }
}

function showCharacterSelection() {
  try {
    document.getElementById("title-screen").classList.add("hidden");
    document.getElementById("character-selection").classList.remove("hidden");
    const characterWeights = characters.map(char => rarityWeights[char.rarity]);
    const playerChoices = weightedRandomSelect(characters, characterWeights, 3);
    renderCharacterList(playerChoices);
  } catch (error) {
    console.error("Error showing character selection:", error);
    alert("Failed to load character selection: " + error.message);
  }
}

function renderCharacterList(charList) {
  try {
    const listDiv = document.getElementById("character-list");
    if (!listDiv) throw new Error("Character list container not found");
    listDiv.innerHTML = '';
    charList.forEach(char => {
      const div = document.createElement("div");
      div.className = "character-card";
      div.innerHTML = `
        <h3>${char.name}</h3>
        <p>Rarity: ${char.rarity}</p>
        <p>HP: ${char.baseHP}</p>
        <p>Defense: ${rarities[char.rarity]}</p>
        <button onclick="selectCharacter(${JSON.stringify(char)})">Choose</button>
      `;
      listDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error rendering character list:", error);
    alert("Error displaying characters: " + error.message);
  }
}

function selectCharacter(char) {
  try {
    player = createCharacter(char);
    const characterWeights = characters.map(c => rarityWeights[c.rarity]);
    const enemyChar = weightedRandomSelect(characters, characterWeights, 1)[0];
    enemy = createCharacter(enemyChar);

    document.getElementById("character-selection").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    document.getElementById("player-name").textContent = player.name;
    document.getElementById("enemy-name").textContent = enemy.name;

    drawHands();
    updateHP();
    renderHands();
  } catch (error) {
    console.error("Error selecting character:", error);
    alert("Error starting game: " + error.message);
  }
}

function drawHands() {
  try {
    player.hand = [];
    enemy.hand = [];
    for (let i = 0; i < 4; i++) {
      player.hand.push(randomCard());
      enemy.hand.push(randomCard());
    }
  } catch (error) {
    console.error("Error drawing hands:", error);
    alert("Error creating hands: " + error.message);
  }
}

function randomCard() {
  try {
    if (!cards || cards.length === 0) throw new Error("Card deck is empty or undefined");
    return structuredClone(cards[Math.floor(Math.random() * cards.length)]);
  } catch (error) {
    console.error("Error selecting random card:", error);
    throw error;
  }
}

function renderHands() {
  try {
    const handDiv = document.getElementById("player-hand");
    const enemyHandDiv = document.getElementById("enemy-hand");
    if (!handDiv || !enemyHandDiv) throw new Error("Hand display areas not found");

    enemyHandDiv.classList.add("hidden");
    handDiv.innerHTML = '';

    player.hand.forEach((card, index) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <span class="emoji">${card.emoji}</span>
        <h3>${card.name}</h3>
        <p>${card.ability}</p>
        <p>Power: ${card.power}</p>
      `;
      div.onclick = () => playCard(index);
      handDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error rendering hands:", error);
    alert("Error rendering hands: " + error.message);
  }
}

function playCard(index) {
  try {
    if (index < 0 || index >= player.hand.length) throw new Error("Invalid card index");
    const card = player.hand[index];
    log(`You played: ${card.name} (${card.ability})`);

    const enemyCardIndex = Math.floor(Math.random() * enemy.hand.length);
    const enemyCard = enemy.hand[enemyCardIndex];
    log(`Enemy played: ${enemyCard.name} (${enemyCard.ability})`);

    applyEffect(card, enemyCard, player, enemy, revealEnemyHand);
    applyEffect(enemyCard, card, enemy, player, () => {});

    const playerFinal = card.power;
    const enemyFinal = enemyCard.power;

    if (!player.shield) {
      const damageToPlayer = Math.max(0, enemyFinal - player.defense);
      player.hp -= damageToPlayer;
      log(`You took ${damageToPlayer} damage (reduced by ${player.defense} defense)`);
    }
    if (!enemy.shield) {
      const damageToEnemy = Math.max(0, playerFinal - enemy.defense);
      enemy.hp -= damageToEnemy;
      log(`Enemy took ${damageToEnemy} damage (reduced by ${enemy.defense} defense)`);
    }

    player.shield = false;
    enemy.shield = false;

    updateHP();
    checkGameOver();

    drawHands();
    renderHands();
  } catch (error) {
    console.error("Error playing card:", error);
    alert("Error playing card: " + error.message);
  }
}

function applyEffect(playerCard, enemyCard, self, opponent, revealFunc = () => {}) {
  try {
    if (playerCard.effect && cardEffects[playerCard.effect]) {
      cardEffects[playerCard.effect](playerCard, enemyCard, self, opponent, revealFunc);
    }
  } catch (error) {
    console.error(`Error applying effect of ${playerCard.name}:`, error);
    log(`Effect of ${playerCard.name} failed: ${error.message}`);
  }
}

function revealEnemyHand() {
  try {
    const enemyHandDiv = document.getElementById("enemy-hand");
    if (!enemyHandDiv) throw new Error("Enemy hand container not found");
    enemyHandDiv.classList.remove("hidden");
    enemyHandDiv.innerHTML = "<h3>Enemy Hand</h3>";
    enemy.hand.forEach(card => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <span class="emoji">${card.emoji}</span>
        <h3>${card.name}</h3>
        <p>${card.ability}</p>
        <p>Power: ${card.power}</p>
      `;
      enemyHandDiv.appendChild(div);
    });
    log("Enemy hand revealed!");
  } catch (error) {
    console.error("Error revealing enemy hand:", error);
    log("Failed to reveal enemy hand: " + error.message);
  }
}

function updateHP() {
  try {
    const playerHPDiv = document.getElementById("player-hp");
    const enemyHPDiv = document.getElementById("enemy-hp");
    if (!playerHPDiv || !enemyHPDiv) throw new Error("HP display elements not found");
    playerHPDiv.textContent = player.hp;
    enemyHPDiv.textContent = enemy.hp;
  } catch (error) {
    console.error("Error updating HP:", error);
    alert("Error updating HP: " + error.message);
  }
}

function checkGameOver() {
  try {
    if (player.hp <= 0) {
      alert("Defeat! The enemy has prevailed.");
      location.reload();
    } else if (enemy.hp <= 0) {
      alert("Victory! You have vanquished your foe!");
      location.reload();
    }
  } catch (error) {
    console.error("Error checking game over:", error);
    alert("Error checking game status: " + error.message);
  }
}

function log(message) {
  try {
    const logDiv = document.getElementById("log");
    if (!logDiv) throw new Error("Log container not found");
    logDiv.innerHTML += `<p>${message}</p>`;
    logDiv.scrollTop = logDiv.scrollHeight;
  } catch (error) {
    console.error("Error logging message:", error);
  }
}