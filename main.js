const gameProgress = {
  region: 1, // Current airplane region
  totalRegions: 3, // Total regions
  secretsDiscovered: new Set(), // Set to track unique interactions
  totalSecrets: 15, // Total secrets
};

const gameState = {
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
};

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
      } else if (mapArray[i][j] === mapArray[i][j] < 20 && mapArray[i][j] >= 10) {
        div.classList.add("lower_door");
      }
      
      plane.appendChild(div);
    }
  }
  gameState.player = document.querySelector(".player");
}

generateMap(gameState.map);

// Check if the player can move to the new position
function canMoveTo(newX, newY) {
  const gridX = newX / gameState.gridSize;
  const gridY = newY / gameState.gridSize;

  // Ensure the coordinates are within the grid and the tile is walkable
  return (
    gridX >= 0 &&
    gridY >= 0 &&
    gridY < gameState.map.length &&
    gridX < gameState.map[0].length &&
    gameState.map[gridY][gridX] < 0
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

    if (gameState.isMoving) return; 
    let newX = gameState.position.x;
    let newY = gameState.position.y;

    switch (event.key.toLowerCase()) {
      case "w": // Move up
        newY -= gameState.gridSize;
        gameState.currentDirection = "up";
        break;
      case "a": // Move left
        newX -= gameState.gridSize;
        gameState.currentDirection = "left";
        break;
      case "s": // Move down
        newY += gameState.gridSize;
        gameState.currentDirection = "down";
        break;
      case "d": // Move right
        newX += gameState.gridSize;
        gameState.currentDirection = "right";
        break;
      case "e":
        handleInteraction();
        return;
      default:
        return;
    }

    if (canMoveTo(newX, newY)) {
      gameState.position.x = newX;
      gameState.position.y = newY;
      movePlayer();
    } else {
      setIdleAnimation(gameState.currentDirection);
    }
  });
});

function movePlayer() {
  gameState.isMoving = true;

  if (gameState.idleTimeout) {
    clearTimeout(gameState.idleTimeout);
    gameState.idleTimeout = null;
  }

  switch (gameState.currentDirection) {
    case "up":
      gameState.player.style.backgroundPosition = "0px -512px"; // Row 9
      gameState.player.style.animation = "moveUp 0.3s steps(9) infinite";
      break;
    case "left":
      gameState.player.style.backgroundPosition = "0px -576px"; // Row 10
      gameState.player.style.animation = "moveLeft 0.3s steps(9) infinite";
      break;
    case "down":
      gameState.player.style.backgroundPosition = "0px -640px"; // Row 11
      gameState.player.style.animation = "moveDown 0.3s steps(9) infinite";
      break;
    case "right":
      gameState.player.style.backgroundPosition = "0px -704px"; // Row 12
      gameState.player.style.animation = "moveRight 0.3s steps(9) infinite";
      break;
  }

  // Move the player smoothly to the new position
  gameState.player.style.transition = `transform ${gameState.moveDuration}s linear`;
  gameState.player.style.transform = `translate(${gameState.position.x}px, ${gameState.position.y}px) translateY(-260%) scale(1.5)`;


  // Stop animation and return to idle after movement
  setTimeout(() => {
    gameState.isMoving = false;

    gameState.idleTimeout = setTimeout(() => {
      // Set the idle animation and direction based on the last input
      setIdleAnimation(gameState.currentDirection);
    }, 50); // Trigger idle after 50ms of inactivity
  }, gameState.moveDuration * 750);
}


function setIdleAnimation(direction) {
  const idleAnimations = {
    up: "idleAnimationUp 1s steps(2) infinite",
    left: "idleAnimationLeft 1s steps(2) infinite",
    down: "idleAnimationDown 1s steps(2) infinite",
    right: "idleAnimationRight 1s steps(2) infinite",
  };

  if (idleAnimations[direction]) {
    gameState.player.style.animation = idleAnimations[direction];
  }
}

function handleInteraction() {
  const gridX = gameState.position.x / gameState.gridSize;
  const gridY = gameState.position.y / gameState.gridSize;

  let targetX = gridX;
  let targetY = gridY;

  // Determine the tile in front of the player based on direction
  if (gameState.currentDirection === "up") {
    targetY -= 1;
  } else if (gameState.currentDirection === "down") {
    targetY += 1;
  } else if (gameState.currentDirection === "left") {
    targetX -= 1;
  } else if (gameState.currentDirection === "right") {
    targetX += 1;
  }

  // Ensure the target coordinates are within the grid bounds
  if (
    targetX >= 0 &&
    targetY >= 0 &&
    targetY < gameState.map.length &&
    targetX < gameState.map[0].length
  ) {
    const targetTile = gameState.map[targetY][targetX];

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
          gameState.isDialogTransitioning = true;
            showDialog(dialogBox, ["No"], (response) => {
              gameState.isDialogTransitioning = false;
            });
        } else if (response === "I am all goodies :)") {
          dialogText.textContent = "Alright, let me know if you change your mind.";
          gameState.isDialogTransitioning = true;
          showDialog(dialogBox, ["Continue"], (response) => {
            gameState.isDialogTransitioning = false;
          });
        }
      });
    } else if (targetTile === 3) {
      dialogName.textContent = "空姐";
      dialogText.textContent = "欢迎登机！我能为您提供什么帮助？";
      showDialog(dialogBox, ["我需要一个教程，请", "我没事"], (response) => {
        if (response === "我需要一个教程，请") {
          dialogText.textContent = "你可以使用 W、A、S、D 键来移动。使用 E 键与 NPC 互动，并探索这个平面中隐藏的秘密。你还有其他问题吗？";
          gameState.isDialogTransitioning = true;
            showDialog(dialogBox, ["不"], (response) => {
              gameState.isDialogTransitioning = false;
            });
        } else if (response === "我没事") {
          dialogText.textContent = "好的，如果你改变主意，请告诉我。";
          gameState.isDialogTransitioning = true;
          showDialog(dialogBox, ["好的"], (response) => {
            gameState.isDialogTransitioning = false;
          });
        }
      });
    } else if (targetTile === 201) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle A - About Me', 'Hi my name is Carlson and am a second year studying computer science at UNSW.', './assets/content/aisleA.jpg');
    } else if (targetTile === 202) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle B - Beliefs', 'I strongly believe that everyone\'s purpose is to help each other grow', './assets/content/aisleB.avif');
    } else if (targetTile === 203) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle C - Characteristics', 'Considerate, Dilligent, Easygoing, Funny, Honest', './assets/content/aisleC.png');
    } else if (targetTile === 204) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle D - Dreams', 'I want to create a language learning app (better than duolingo) that will actually help people learn languages and become fluent in them.', './assets/content/aisleD.jpg');
    } else if (targetTile === 205) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle E - Energy Sources', 'Chocolate, Kpop (good music in general), MEMES', './assets/content/aisleE.gif');
    } else if (targetTile === 206) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle F - Fears', 'I am afraid of bugs. Both in real life and in coding. Why do they have such weird looking legs TwT', './assets/content/aisleF.JPG');
    } else if (targetTile === 207) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle G - Gratitude', 'Grateful to my older brother to telling me to watch Harvard\'s CS50 before I was about to choose chemical engineering to study at UNSW', './assets/content/aisleG.avif');
    } else if (targetTile === 208) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle H - Hobbies', 'Language learning. I am currently learning Chinese (doing ARTS2450 and ARTS2451 this year!) and Korean. Would like to become a polyglot. Also like dancing.', './assets/content/aisleH.jpg');
    } else if (targetTile === 209) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle I - Incredible Puns', 'If I don\'t get arrays from my boss I will error 404', './assets/content/aisleI.jpg');
    } else if (targetTile === 210) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle J - Joke Time', '01101100 01100101 01110100 00100000 01101000 01101001 01101101 00100000 01100011 01101111 01101111 01101011', './assets/content/aisleJ.png');
    } else if (targetTile === 211) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle K - Kidding Time part 2', 'Yo computer science teaching mama so fat, she can flatten a binary tree in O(1). (this is not targeted at your mum)', './assets/content/aisleK.png');
    } else if (targetTile === 212) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle L - Laugh with me Part 3', 'I once went to a fortune teller for him that for the next 20 years I will be poor and lonely. Jokes on him. I had no money to pay him :p', './assets/content/aisleL.jpg');
    } else if (targetTile === 11) {
      gameProgress.region = 2; // Example: Change to region 2
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
          position: { x: 384, y: 128 }, // Starting position
          player: null, // Will be updated after generating the map
          isMoving: false, // Track if animation is in progress
          currentDirection: "down", // Default direction
          moveDuration: 0.3, // Movement duration in seconds
          idleTimeout: null, // Timer for inactivity
        };
    
        // Generate the new map
        generateMap(gameState2.map);
    
        // Update the global gameState
        Object.assign(gameState, gameState2);
    
        // Update the player reference
        gameState.player = document.querySelector(".player");
    
        // Update the player's position
        gameState.player.style.transform = `translate(${gameState.position.x}px, ${gameState.position.y}px) translateY(-260%) scale(1.5)`;
    
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
      gameProgress.region = 3; // Example: Change to region 2
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
    
        // Update the global gameState
        Object.assign(gameState, gameState2);
    
        // Update the player reference
        gameState.player = document.querySelector(".player");
    
        // Update the player's position
        gameState.player.style.transform = `translate(${gameState.position.x}px, ${gameState.position.y}px) translateY(-260%) scale(1.5)`;
    
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
      gameProgress.region = 1; // Example: Change to region 2
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
    
        // Update the global gameState
        Object.assign(gameState, gameState2);
    
        // Update the player reference
        gameState.player = document.querySelector(".player");
    
        // Update the player's position
        gameState.player.style.transform = `translate(${gameState.position.x}px, ${gameState.position.y}px) translateY(-260%) scale(1.5)`;
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
  }
}

document.addEventListener("keydown", handleDialogInput);
function handleDialogInput(event) {
  
  let selectedIndex = gameState.dialog.selectedIndex || 0;
  const responses = gameState.dialog.responses;

  if (event.key === "ArrowUp") {
    selectedIndex = (selectedIndex - 1 + responses.length) % responses.length;
    updateDialogSelection(selectedIndex);
  } else if (event.key === "ArrowDown") {
    selectedIndex = (selectedIndex + 1) % responses.length;
    updateDialogSelection(selectedIndex);
  } else if (event.key === "Enter") {
    const selectedResponse = responses[selectedIndex];
    if (gameState.dialog.onResponse) {
      gameState.dialog.onResponse(selectedResponse); // Trigger callback
    }
    if (!gameState.isDialogTransitioning) closeDialog(); // Only close if not transitioning
  }

  gameState.dialog.selectedIndex = selectedIndex; // Update the selected index
}

function updateDialogSelection(selectedIndex) {
  const dialogBox = document.getElementById("dialog-box");
  const responseList = dialogBox.querySelectorAll("#dialog-responses li");

  responseList.forEach((item, index) => {
    if (index === selectedIndex) {
      item.textContent = `> ${gameState.dialog.responses[index]}`; // Add arrow to selected
      item.classList.add("selected");
    } else {
      item.textContent = `  ${gameState.dialog.responses[index]}`; // Remove arrow from others
      item.classList.remove("selected");
    }
  });
}

function showDialog(dialogBox, responses = [], onResponse = null) {
  // Mark dialog as open
  gameState.isDialogOpen = true;
  gameState.dialog = { responses, onResponse, selectedIndex: 0 };

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
  gameState.isDialogOpen = false;
  gameState.dialog = null;
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

function showPopup(title, message, imagePath = null) {
  // Create the pop-up container
  const popup = document.createElement('div');
  popup.id = 'popup-box';

  // Create the title
  const popupTitle = document.createElement('div');
  popupTitle.classList.add('popup-title');
  popupTitle.textContent = title;
  popup.appendChild(popupTitle);

  // Create the content section
  const popupContent = document.createElement('div');
  popupContent.classList.add('popup-content');

  // Create the text section
  const popupText = document.createElement('div');
  popupText.classList.add('popup-text');
  popupText.textContent = message;
  popupContent.appendChild(popupText);

  // Create the image box or image element
  const popupImage = document.createElement('div');
  popupImage.classList.add('popup-image');

  if (imagePath) {
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = 'Image';
    popupImage.appendChild(img);
  } else {
    popupImage.textContent = 'PIC'; // Default placeholder if no image provided
  }

  popupContent.appendChild(popupImage);

  // Add the content section to the popup
  popup.appendChild(popupContent);

  // Create the X button
  const closeButton = document.createElement('div');
  closeButton.classList.add('popup-close');
  closeButton.textContent = 'X';
  closeButton.onclick = () => {
    document.body.removeChild(popup);
  };
  popup.appendChild(closeButton);

  // Add the pop-up to the body
  document.body.appendChild(popup);

  // Draggable functionality
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  popup.addEventListener('mousedown', (event) => {
  isDragging = true;

  popup.style.cursor = 'grabbing'; // Indicate dragging
  popup.style.transition = 'none'; // Disable transition for smooth drag

  // Calculate the offset between the popup's top-left corner and the mouse position
  const rect = popup.getBoundingClientRect();
  offsetX = event.clientX - rect.left;
  offsetY = event.clientY - rect.top;
  event.preventDefault(); // Prevent text selection while dragging
});

document.addEventListener('mousemove', (event) => {
  if (isDragging) {
    // Calculate new popup position based on mouse movement and offset
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    // Update the popup's position
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.transform = 'none';
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    popup.style.cursor = ''; // Reset cursor
    popup.style.transition = ''; // Re-enable transition after drag
  }
});
}

function calculateAisle(value) {
  const modulo = value % 100;
  if (modulo >= 1 && modulo <= 26) {
    return String.fromCharCode(64 + modulo); // ASCII: A=65, B=66, ...
  }
  return ""; 
}


function updateGameInfo() {
  document.getElementById("region-info").textContent = `Airplane Region: ${gameProgress.region}/${gameProgress.totalRegions}`;
  document.getElementById("secrets-info").textContent = `Secrets Discovered: ${gameProgress.secretsDiscovered.size}/${gameProgress.totalSecrets}`;
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

const plane = document.getElementById('traveling-plane');

// Function to set a random height
function setRandomHeight() {
  const randomTop = Math.floor(Math.random() * 80); // Random value between 0 and 80 (percentage of the viewport height)
  plane.style.top = `${randomTop}vh`; // Set the top position in viewport height units
}

// Set initial random height
setRandomHeight();

// Add an event listener to restart the height at the end of each animation cycle
plane.addEventListener('animationiteration', setRandomHeight);


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
        text: 'I\m filo lol',
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