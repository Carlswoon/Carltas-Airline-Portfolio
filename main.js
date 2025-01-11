import { showPopup } from './functions.js';
import { setRandomHeight } from './titleScreen.js';
import { calculateAisle } from './game.js';

const game = {
  state : {
    map: [
      [1, 1, 1, 1, 1, 1, 8, 1, 1],
      [1, 9, 1, 1, 1, 1, 1, 1, 1],
      [-21, -1, -1, -1, -1, 2, -1, -1, 3],
      [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      [201, 201, -101, 201, 201, 201, -101, 201, 201],
      [202, 202, -102, 202, 202, 202, -102, 202, 202],
      [203, 203, -103, 203, 203, 203, -103, 203, 203],
      [204, 204, -104, 204, 204, 204, -104, 204, 204],
      [0, 0, 0, 0, 0, 0, 11, 0, 0],
    ],
    gridSize: 64, // Size of each grid cell
    position: { x: 0, y: 128 }, // Starting position
    player: document.querySelector(".player"),
    isMoving: false, // Track if animation is in progress
    currentDirection: "down", // Default direction
    moveDuration: 0.3, // Movement duration in seconds
    idleTimeout: null, // Timer for inactivity
  }, 
  progress: {
    region: 1, // Current airplane region
    totalRegions: 3, // Total regions
    secretsDiscovered: new Set(), // Set to track unique interactions
    totalSecrets: 15, // Total secrets
  }
}

function generateMap(mapArray) {
  const plane = document.querySelector(".grid");

  plane.innerHTML = "";

  // Iterate over the map array
  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      const div = document.createElement("div");

      if (mapArray[i][j] === 1) {
        div.classList.add("wall");
      } else if (mapArray[i][j] === 2) {
        div.classList.add("stewardess1");
      } else if (mapArray[i][j] === 3) {
        div.classList.add("stewardess2");
      } else if (mapArray[i][j] === 4) {
        div.classList.add("pilot");
      } else if (mapArray[i][j] === 8) {
        div.classList.add("airplane_logo");
      } else if (mapArray[i][j] === 9) {
        div.classList.add("upper_door", "cockpit-text");
          div.textContent = "Cockpit";
      } else if (mapArray[i][j] > 200 && mapArray[i][j] < 300) {
        div.classList.add("seat");
      } else if (mapArray[i][j] === -1) {
        div.classList.add("floor");
      } else if (mapArray[i][j] < -100 && mapArray[i][j] > -200) {
        div.classList.add("aisle");
        const letter = calculateAisle(-mapArray[i][j]);
        if (letter) div.textContent = letter;
      } else if (mapArray[i][j] === -21) {
        div.classList.add("player");
      } else if (mapArray[i][j] < 20 && mapArray[i][j] >= 10) {
        div.classList.add("lower_door");
      }
      
      plane.appendChild(div);
    }
  }
  game.state.player = document.querySelector(".player");
}

generateMap(game.state.map);

// Check if the player can move to the new position
function canMoveTo(newX, newY) {
  const gridX = newX / game.state.gridSize;
  const gridY = newY / game.state.gridSize;

  // Ensure the coordinates are within the grid and the tile is walkable
  return (
    gridX >= 0 &&
    gridY >= 0 &&
    gridY < game.state.map.length &&
    gridX < game.state.map[0].length &&
    game.state.map[gridY][gridX] < 0
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button');
  const helpButton = document.getElementById('help-button');
  const titlePage = document.getElementById('title-page');
  const gameContainer = document.getElementById('game-container');
  let isGameActive = false;

  startButton.addEventListener('click', () => {
    titlePage.classList.add('hidden');
    gameContainer.style.display = 'block';
    isGameActive = true;
  });

  helpButton.addEventListener('click', () => {
    createModal({
      title: 'Help Me',
      imageSrc: './assets/content/aisleA.jpg',
      facts: [
        'Name: Carlson',
        'Hobbies: Dancing, programming, and learning languages',
        'Languages: English, Korean, Chinese, Tagalog, Ilonggo',
        'Current Studies: Computer Science at UNSW',
        'Fun Fact: I started learning Korean in 2024!'
      ],
    });
  });

  document.addEventListener('keydown', async (event) => {
    if (!isGameActive) return;

    if (game.state.isMoving) return; 
    let newX = game.state.position.x;
    let newY = game.state.position.y;

    switch (event.key.toLowerCase()) {
      case "w": // Move up
        newY -= game.state.gridSize;
        game.state.currentDirection = "up";
        break;
      case "a": // Move left
        newX -= game.state.gridSize;
        game.state.currentDirection = "left";
        break;
      case "s": // Move down
        newY += game.state.gridSize;
        game.state.currentDirection = "down";
        break;
      case "d": // Move right
        newX += game.state.gridSize;
        game.state.currentDirection = "right";
        break;
      case "e":
        handleInteraction();
        return;
      default:
        return;
    }

    if (canMoveTo(newX, newY)) {
      game.state.position.x = newX;
      game.state.position.y = newY;
      movePlayer();
    } else {
      setIdleAnimation(game.state.currentDirection);
    }
  });
});

function movePlayer() {
  game.state.isMoving = true;

  if (game.state.idleTimeout) {
    clearTimeout(game.state.idleTimeout);
    game.state.idleTimeout = null;
  }

  switch (game.state.currentDirection) {
    case "up":
      game.state.player.style.backgroundPosition = "0px -512px"; // Row 9
      game.state.player.style.animation = "moveUp 0.3s steps(9) infinite";
      break;
    case "left":
      game.state.player.style.backgroundPosition = "0px -576px"; // Row 10
      game.state.player.style.animation = "moveLeft 0.3s steps(9) infinite";
      break;
    case "down":
      game.state.player.style.backgroundPosition = "0px -640px"; // Row 11
      game.state.player.style.animation = "moveDown 0.3s steps(9) infinite";
      break;
    case "right":
      game.state.player.style.backgroundPosition = "0px -704px"; // Row 12
      game.state.player.style.animation = "moveRight 0.3s steps(9) infinite";
      break;
  }

  // Move the player smoothly to the new position
  game.state.player.style.transition = `transform ${game.state.moveDuration}s linear`;
  game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;


  // Stop animation and return to idle after movement
  setTimeout(() => {
    game.state.isMoving = false;

    game.state.idleTimeout = setTimeout(() => {
      // Set the idle animation and direction based on the last input
      setIdleAnimation(game.state.currentDirection);
    }, 50); // Trigger idle after 50ms of inactivity
  }, game.state.moveDuration * 750);
}


function setIdleAnimation(direction) {
  const idleAnimations = {
    up: "idleAnimationUp 1s steps(2) infinite",
    left: "idleAnimationLeft 1s steps(2) infinite",
    down: "idleAnimationDown 1s steps(2) infinite",
    right: "idleAnimationRight 1s steps(2) infinite",
  };

  if (idleAnimations[direction]) {
    game.state.player.style.animation = idleAnimations[direction];
  }
}

function handleInteraction() {
  const gridX = game.state.position.x / game.state.gridSize;
  const gridY = game.state.position.y / game.state.gridSize;

  let targetX = gridX;
  let targetY = gridY;

  // Determine the tile in front of the player based on direction
  if (game.state.currentDirection === "up") {
    targetY -= 1;
  } else if (game.state.currentDirection === "down") {
    targetY += 1;
  } else if (game.state.currentDirection === "left") {
    targetX -= 1;
  } else if (game.state.currentDirection === "right") {
    targetX += 1;
  }

  // Ensure the target coordinates are within the grid bounds
  if (
    targetX >= 0 &&
    targetY >= 0 &&
    targetY < game.state.map.length &&
    targetX < game.state.map[0].length
  ) {
    const targetTile = game.state.map[targetY][targetX];

    const dialogBox = document.getElementById("dialog-box");
    const dialogName = document.getElementById("dialog-name");
    const dialogText = document.getElementById("dialog-text");
    // Handle interaction based on tile type
    if (targetTile === 2) {
      dialogName.textContent = "Stewardess";
      dialogText.textContent = "Welcome aboard! How can I assist you?";
      showDialog(dialogBox, ["I need a tutorial please", "I am all goodies :)"], (response) => {
        if (response === "I need a tutorial please") {
          dialogText.textContent = "You can use W, A, S, D keys to move around. Use E key the interact with npc and the secrets hidden in this plane. Do you have anymore questions?";
          game.state.isDialogTransitioning = true;
            showDialog(dialogBox, ["No"], (response) => {
              game.state.isDialogTransitioning = false;
            });
        } else if (response === "I am all goodies :)") {
          dialogText.textContent = "Alright, let me know if you change your mind.";
          game.state.isDialogTransitioning = true;
          showDialog(dialogBox, ["Continue"], (response) => {
            game.state.isDialogTransitioning = false;
          });
        }
      });
    } else if (targetTile === 3) {
      dialogName.textContent = "空姐";
      dialogText.textContent = "欢迎登机！我能为您提供什么帮助？";
      showDialog(dialogBox, ["我需要一个教程，请", "我没事"], (response) => {
        if (response === "我需要一个教程，请") {
          dialogText.textContent = "你可以使用 W、A、S、D 键来移动。使用 E 键与 NPC 互动，并探索这个平面中隐藏的秘密。你还有其他问题吗？";
          game.state.isDialogTransitioning = true;
            showDialog(dialogBox, ["不"], (response) => {
              game.state.isDialogTransitioning = false;
            });
        } else if (response === "我没事") {
          dialogText.textContent = "好的，如果你改变主意，请告诉我。";
          game.state.isDialogTransitioning = true;
          showDialog(dialogBox, ["好的"], (response) => {
            game.state.isDialogTransitioning = false;
          });
        }
      });
    } else if (targetTile === 201) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle A - About Me', 'Hi my name is Carlson and am a second year studying computer science at UNSW.', './assets/content/aisleA.jpg');
    } else if (targetTile === 202) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle B - Beliefs', 'I strongly believe that everyone\'s purpose is to help each other grow', './assets/content/aisleB.avif');
    } else if (targetTile === 203) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle C - Characteristics', 'Considerate, Dilligent, Easygoing, Funny, Honest', './assets/content/aisleC.png');
    } else if (targetTile === 204) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle D - Dreams', 'I want to create a language learning app (better than duolingo) that will actually help people learn languages and become fluent in them.', './assets/content/aisleD.jpg');
    } else if (targetTile === 205) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle E - Energy Sources', 'Chocolate, Kpop (good music in general), MEMES', './assets/content/aisleE.gif');
    } else if (targetTile === 206) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle F - Fears', 'I am afraid of bugs. Both in real life and in coding. Why do they have such weird looking legs TwT', './assets/content/aisleF.JPG');
    } else if (targetTile === 207) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle G - Gratitude', 'Grateful to my older brother to telling me to watch Harvard\'s CS50 before I was about to choose chemical engineering to study at UNSW', './assets/content/aisleG.avif');
    } else if (targetTile === 208) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle H - Hobbies', 'Language learning. I am currently learning Chinese (doing ARTS2450 and ARTS2451 this year!) and Korean. Would like to become a polyglot. Also like dancing.', './assets/content/aisleH.jpg');
    } else if (targetTile === 209) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle I - Incredible Puns', 'If I don\'t get arrays from my boss I will error 404', './assets/content/aisleI.jpg');
    } else if (targetTile === 210) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle J - Joke Time', '01101100 01100101 01110100 00100000 01101000 01101001 01101101 00100000 01100011 01101111 01101111 01101011', './assets/content/aisleJ.png');
    } else if (targetTile === 211) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle K - Kidding Time part 2', 'Yo computer science teaching mama so fat, she can flatten a binary tree in O(1). (this is not targeted at your mum)', './assets/content/aisleK.png');
    } else if (targetTile === 212) {
      if (!game.progress.secretsDiscovered.has(targetTile)) {
        game.progress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle L - Laugh with me Part 3', 'I once went to a fortune teller for him that for the next 20 years I will be poor and lonely. Jokes on him. I had no money to pay him :p', './assets/content/aisleL.jpg');
    } else if (targetTile === 11) {
      game.progress.region = 2; // Example: Change to region 2
      updateGameInfo();
      const overlay = document.getElementById("transition-overlay");
      const textElement = document.getElementById("transition-text");
    
      // Set the transition message
      textElement.textContent = "Travelling to a new plane region...";
      
      // Start fade-in animation
      overlay.classList.add("fade-in");
    
      // Wait for fade-in animation to complete
      setTimeout(() => {
        // Define the new game state
        const gameState2 = {
          map: [
            [1, 1, 8, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 10, 1, 1],
            [-21, -1, -1, -1, -1, 2, -1, -1, 3],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [205, 205, -105, 205, 205, 205, -105, 205, 205],
            [206, 206, -106, 206, 206, 206, -106, 206, 206],
            [207, 207, -107, 207, 207, 207, -107, 207, 207],
            [208, 208, -108, 208, 208, 208, -108, 208, 208],
            [0, 0, 0, 0, 0, 0, 12, 0, 0],
          ],
          gridSize: 64, // Size of each grid cell
          player: null, // Will be updated after generating the map
          isMoving: false, // Track if animation is in progress
          currentDirection: "down", // Default direction
          moveDuration: 0.3, // Movement duration in seconds
          idleTimeout: null, // Timer for inactivity
        };
        
        if (game.state.currentDirection === "down") {
          game.state.position = { x: 384, y: 128 };
            // Generate the new map
          generateMap(gameState2.map);
      
          // Update the global game.state
          Object.assign(game.state, gameState2);
      
          // Update the player reference
          game.state.player = document.querySelector(".player");
      
          // Update the player's position
          game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;
            
        } else {
          game.state.position = { x: 384, y: 448 };
          // Generate the new map
          generateMap(gameState2.map);
    
          // Update the global game.state
          Object.assign(game.state, gameState2);
    
          // Update the player reference
          game.state.player = document.querySelector(".player");
    
          // Update the player's position
          game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;
          setIdleAnimation("up");
        }
        
        // Start fade-out animation after loading the map
        setTimeout(() => {
          overlay.classList.remove("fade-in");
          overlay.classList.add("fade-out");
    
          // Remove fade-out class after animation completes
          setTimeout(() => {
            overlay.classList.remove("fade-out");
          }, 800); // Match the duration of the fade-out transition
        }, 1000); // Short delay to ensure the map is fully loaded
      }, 800); // Match the duration of the fade-in animation
    } else if (targetTile === 12) {
      game.progress.region = 3; // Example: Change to region 2
      updateGameInfo();
      const overlay = document.getElementById("transition-overlay");
      const textElement = document.getElementById("transition-text");
    
      // Set the transition message
      textElement.textContent = "Travelling to a new part of the plane...";
      
      // Start fade-in animation
      overlay.classList.add("fade-in");
    
      // Wait for fade-in animation to complete
      setTimeout(() => {
        // Define the new game state
        const gameState2 = {
          map: [
            [1, 1, 8, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 11, 1, 1],
            [-21, -1, -1, -1, -1, 2, -1, -1, 3],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [209, 209, -109, 209, 209, 209, -109, 209, 209],
            [210, 210, -110, 210, 210, 210, -110, 210, 210],
            [211, 211, -111, 211, 211, 211, -111, 211, 211],
            [212, 212, -112, 212, 212, 212, -112, 212, 212],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
          ],
          gridSize: 64, // Size of each grid cell
          position: { x: 384, y: 128 }, // Starting position
          player: null, // Will be updated after generating the map
          isMoving: false, // Track if animation is in progress
          currentDirection: "down", // Default direction
          moveDuration: 0.3, // Movement duration in seconds
          idleTimeout: null, // Timer for inactivity
        };
    
        // Generate the new map
        generateMap(gameState2.map);
    
        // Update the global game.state
        Object.assign(game.state, gameState2);
    
        // Update the player reference
        game.state.player = document.querySelector(".player");
    
        // Update the player's position
        game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;
    
        // Start fade-out animation after loading the map
        setTimeout(() => {
          overlay.classList.remove("fade-in");
          overlay.classList.add("fade-out");
    
          // Remove fade-out class after animation completes
          setTimeout(() => {
            overlay.classList.remove("fade-out");
          }, 800); // Match the duration of the fade-out transition
        }, 1000); // Short delay to ensure the map is fully loaded
      }, 800); // Match the duration of the fade-in animation
    } else if (targetTile === 10) {
      game.progress.region = 1; // Example: Change to region 2
      updateGameInfo();
      const overlay = document.getElementById("transition-overlay");
      const textElement = document.getElementById("transition-text");
    
      // Set the transition message
      textElement.textContent = "Travelling to a new part of the plane...";
      
      // Start fade-in animation
      overlay.classList.add("fade-in");
    
      // Wait for fade-in animation to complete
      setTimeout(() => {
        // Define the new game state
        const gameState2 = {
          map: [
            [1, 1, 1, 1, 1, 1, 8, 1, 1],
            [1, 9, 1, 1, 1, 1, 1, 1, 1],
            [-21, -1, -1, -1, -1, 2, -1, -1, 3],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [201, 201, -101, 201, 201, 201, -101, 201, 201],
            [202, 202, -102, 202, 202, 202, -102, 202, 202],
            [203, 203, -103, 203, 203, 203, -103, 203, 203],
            [204, 204, -104, 204, 204, 204, -104, 204, 204],
            [0, 0, 0, 0, 0, 0, 11, 0, 0],
          ],
          gridSize: 64, // Size of each grid cell
          position: { x: 384, y: 448 }, // Starting position
          player: null, // Will be updated after generating the map
          isMoving: false, // Track if animation is in progress
          currentDirection: "up", // Default direction
          moveDuration: 0.3, // Movement duration in seconds
          idleTimeout: null, // Timer for inactivity
        };
    
        // Generate the new map
        generateMap(gameState2.map);
    
        // Update the global game.state
        Object.assign(game.state, gameState2);
    
        // Update the player reference
        game.state.player = document.querySelector(".player");
    
        // Update the player's position
        game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;
        setIdleAnimation("up");
        // Start fade-out animation after loading the map
        setTimeout(() => {
          overlay.classList.remove("fade-in");
          overlay.classList.add("fade-out");
    
          // Remove fade-out class after animation completes
          setTimeout(() => {
            overlay.classList.remove("fade-out");
          }, 800); // Match the duration of the fade-out transition
        }, 1000); // Short delay to ensure the map is fully loaded
      }, 800); // Match the duration of the fade-in animation
    } else if (targetTile === 9) {
      if (!(game.progress.secretsDiscovered.size >= 12)) {
        showPopup("locked", "come back when you have discovered at least 12 secrets");
      } else {
        game.progress.region = 0;
        updateGameInfo();
        const overlay = document.getElementById("transition-overlay");
        const textElement = document.getElementById("transition-text");
    
        // Set the transition message
        textElement.textContent = "Entering the cockpit...";
        
        // Start fade-in animation
        overlay.classList.add("fade-in");
      
        // Wait for fade-in animation to complete
        setTimeout(() => {
          // Define the new game state
          const gameState2 = {
            map: [
              [1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1],
              [-21, -1, -1, -1, -1, -1, -1, -1, -1],
              [-1, -1, -1, -1, -1, -1, -1, -1, -1],
              [-1, -1, -1, -1, -1, -1, -1, -1, 4],
              [-1, -1, -1, -1, -1, -1, -1, -1, -1],
              [-1, -1, -1, -1, -1, -1, -1, -1, -1],
              [-1, -1, -1, -1, -1, -1, -1, -1, -1],
              [0, 10, 0, 0, 0, 0, 0, 0, 0],
            ],
            gridSize: 64, // Size of each grid cell
            position: { x: 64, y: 448 }, // Starting position
            player: null, // Will be updated after generating the map
            isMoving: false, // Track if animation is in progress
            currentDirection: "up", // Default direction
            moveDuration: 0.3, // Movement duration in seconds
            idleTimeout: null, // Timer for inactivity
          };
      
          // Generate the new map
          generateMap(gameState2.map);
      
          // Update the global game.state
          Object.assign(game.state, gameState2);
      
          // Update the player reference
          game.state.player = document.querySelector(".player");
      
          // Update the player's position
          game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;
          setIdleAnimation("up");
          // Start fade-out animation after loading the map
          setTimeout(() => {
            overlay.classList.remove("fade-in");
            overlay.classList.add("fade-out");
      
            // Remove fade-out class after animation completes
            setTimeout(() => {
              overlay.classList.remove("fade-out");
            }, 800); // Match the duration of the fade-out transition
          }, 1000); // Short delay to ensure the map is fully loaded
        }, 800); // Match the duration of the fade-in animation
      }
    } if (targetTile === 4) {
      dialogName.textContent = "Pilot Carlson";
      dialogText.textContent = "ah you have finally found me! Now that you know all about me I guess I really don't have anything else to say...";
      showDialog(dialogBox, ["Continue"], (response) => {
        if (response === "Continue") {
          dialogText.textContent = "BUT! If you have anymore questions, here is my email address which you can contact me at: carlson280306@gmail.com";
          game.state.isDialogTransitioning = true;
            showDialog(dialogBox, ["Ok thanks "], (response) => {
              game.state.isDialogTransitioning = false;
            });
        }
      });
    }
  }
}

document.addEventListener("keydown", handleDialogInput);
function handleDialogInput(event) {
  
  let selectedIndex = game.state.dialog.selectedIndex || 0;
  const responses = game.state.dialog.responses;

  if (event.key === "ArrowUp") {
    selectedIndex = (selectedIndex - 1 + responses.length) % responses.length;
    updateDialogSelection(selectedIndex);
  } else if (event.key === "ArrowDown") {
    selectedIndex = (selectedIndex + 1) % responses.length;
    updateDialogSelection(selectedIndex);
  } else if (event.key === "Enter") {
    const selectedResponse = responses[selectedIndex];
    if (game.state.dialog.onResponse) {
      game.state.dialog.onResponse(selectedResponse); // Trigger callback
    }
    if (!game.state.isDialogTransitioning) closeDialog(); // Only close if not transitioning
  }

  game.state.dialog.selectedIndex = selectedIndex; // Update the selected index
}

function updateDialogSelection(selectedIndex) {
  const dialogBox = document.getElementById("dialog-box");
  const responseList = dialogBox.querySelectorAll("#dialog-responses li");

  responseList.forEach((item, index) => {
    if (index === selectedIndex) {
      item.textContent = `> ${game.state.dialog.responses[index]}`; // Add arrow to selected
      item.classList.add("selected");
    } else {
      item.textContent = `  ${game.state.dialog.responses[index]}`; // Remove arrow from others
      item.classList.remove("selected");
    }
  });
}

function showDialog(dialogBox, responses = [], onResponse = null) {
  // Mark dialog as open
  game.state.isDialogOpen = true;
  game.state.dialog = { responses, onResponse, selectedIndex: 0 };

  // Remove hidden class to display the dialog
  dialogBox.classList.remove("hidden");

  // Clear any existing response container
  let responseContainer = dialogBox.querySelector("#dialog-responses");
  if (!responseContainer) {
    responseContainer = document.createElement("div");
    responseContainer.id = "dialog-responses";
    dialogBox.appendChild(responseContainer);
  }
  responseContainer.innerHTML = ""; // Clear old responses

  // Create a list for responses
  const responseList = document.createElement("ul");
  responseContainer.appendChild(responseList);

  // Add responses as list items
  responses.forEach((response, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index === 0 ? "> " : "  "} ${response}`; // Add arrow to the first item
    listItem.className = index === 0 ? "selected" : ""; // Highlight the first item
    responseList.appendChild(listItem);
  });
}

function closeDialog() {
  const dialogBox = document.getElementById("dialog-box");
  dialogBox.classList.add("hidden");
  game.state.isDialogOpen = false;
  game.state.dialog = null;
}


function scaleGame() {
  const plane = document.querySelector("#plane");

  // Get the screen dimensions
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // Get the game's natural dimensions
  const planeWidth = plane.offsetWidth;
  const planeHeight = plane.offsetHeight;

  // Calculate the scale factor to fill 80% of the screen
  const scaleWidth = screenWidth * 0.8 / planeWidth;
  const scaleHeight = screenHeight * 0.8 / planeHeight;

  // Use the smaller scale to maintain aspect ratio
  const scale = Math.min(scaleWidth, scaleHeight);

  // Apply the scale
  plane.style.transform = `scale(${scale})`;
  plane.style.transformOrigin = "center";
}

// Scale the game on load and resize
window.addEventListener("load", scaleGame);
window.addEventListener("resize", scaleGame);


function updateGameInfo() {
  document.getElementById("region-info").textContent = `Airplane Region: ${game.progress.region}/${game.progress.totalRegions}`;
  document.getElementById("secrets-info").textContent = `Secrets Discovered: ${game.progress.secretsDiscovered.size}/${game.progress.totalSecrets}`;
}


function createModal({ title, imageSrc, facts }) {
  // Create the modal container
  const modal = document.createElement('div');
  modal.id = 'fact-sheet-modal';
  modal.className = 'hidden';

  // Modal content
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-button">x</button>
      <div class="modal-header">
        <div class="modal-pic">
          <img src="${imageSrc}" alt="Picture" />
        </div>
        <h1 class="modal-title">${title}</h1>
      </div>
      <div class="modal-body">
        <ul>
          ${facts.map((fact) => `<li>${fact}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  // Add close functionality
  modal.querySelector('.close-button').addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.remove(); // Remove modal from DOM after closing
  });

  // Optional: Close modal when clicking outside the content
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
      modal.remove(); // Remove modal from DOM after closing
    }
  });

  // Append the modal to the body
  document.body.appendChild(modal);

  // Show the modal by removing the "hidden" class
  modal.classList.remove('hidden');
}
// Set initial random height
setRandomHeight();


const destinationsGrid = document.getElementById('destinations-grid');
const modal = document.getElementById('destinations-modal');
const closeModalButton = document.getElementById('close-modal');


// Show the modal
document.getElementById('destinations-button').addEventListener('click', () => {
  modal.classList.remove('hidden');
});

// Close the modal
closeModalButton.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Handle destination clicks
destinationsGrid.addEventListener('click', (e) => {
  const destinationItem = e.target.closest('.destination-item');
  if (destinationItem) {
    const country = destinationItem.dataset.country;
    const countryDetails = {
      Australia: {
        title: 'Australia',
        text: 'I live in Sydney, and I study Computer Science at UNSW.',
        image: './assets/flags/Australia.png',
      },
      China: {
        title: 'China',
        text: "I'm learning Mandarin and love Chinese cuisine like dumplings and hotpot.",
        image: './assets/flags/China.png',
      },
      America: {
        title: 'America',
        text: "I've always admired Silicon Valley and the tech scene in the US!",
        image: './assets/flags/America.png',
      },
      Korea: {
        title: 'Korea',
        text: 'Kdrama!',
        image: './assets/flags/Korea.png',
      },
      Philippines: {
        title: 'Philippines',
        text: 'I\'m filo lol',
        image: './assets/flags/Philippines.png',
      },
    };

    // Get the content for the selected country
    const details = countryDetails[country];
    if (details) {
      createModal({
        title: details.title,
        imageSrc: details.image,
        facts: [
          details.text
        ],
      });
    }
  }
});