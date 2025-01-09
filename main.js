const gameProgress = {
  region: 1, // Current airplane region
  totalRegions: 3, // Total regions
  secretsDiscovered: new Set(), // Set to track unique interactions
  totalSecrets: 17, // Total secrets
};

function generateMap(mapArray) {
  const plane = document.querySelector(".grid");

  // Clear the existing grid
  plane.innerHTML = "";

  // Iterate over the map array
  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      const div = document.createElement("div");

      // Determine the tile type based on the map value
      switch (true) { // Use true to enable conditional checks in cases
        case mapArray[i][j] === 1:
          div.classList.add("wall");
          break;
        case mapArray[i][j] === 2:
          div.classList.add("stewardess1");
          break;
        case mapArray[i][j] === 3:
          div.classList.add("stewardess2");
          break;
        case mapArray[i][j] === 8:
          div.classList.add("airplane_logo");
          break;
        case mapArray[i][j] === 9:
          div.classList.add("upper_door", "cockpit-text");
          div.textContent = "Cockpit";
          break;
        case mapArray[i][j] > 200 && mapArray[i][j] < 300: // Range condition
          div.classList.add("seat");
          break;
        case mapArray[i][j] === -1:
          div.classList.add("floor");
          break;
        case mapArray[i][j] < -100 && mapArray[i][j] > -200: // Range condition
        div.classList.add("aisle");
        const letter = calculateAisle(-mapArray[i][j]);
        if (letter) {
          div.textContent = letter;
        }
        break;
        case mapArray[i][j] === -21:
          div.classList.add("player");
          break;
          case mapArray[i][j] < 20 && mapArray[i][j] >= 10:
          div.classList.add("lower_door");
          break;
        default:
          div.classList.add("unknown"); // Handle unexpected values
      }

      // Append the div to the grid
      plane.appendChild(div);
    }
  }

  // Update the player reference in gameState
  gameState.player = document.querySelector(".player");
}



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

// Handle keydown for movement
document.addEventListener("keydown", async (event) => {
  if (gameState.isMoving) return; // Prevent interrupting an ongoing animation
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
      return; // Ignore other keys
  }

  if (canMoveTo(newX, newY)) {
    gameState.position.x = newX;
    gameState.position.y = newY;
    movePlayer();
  } else {
    setIdleAnimation(gameState.currentDirection);
  }
  
});

function movePlayer() {
  gameState.isMoving = true;

  // Clear any existing idle timeout
  if (gameState.idleTimeout) {
    clearTimeout(gameState.idleTimeout);
    gameState.idleTimeout = null;
  }

  // Set the animation based on direction
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
  switch (gameState.currentDirection) {
    case "up":
      targetY -= 1;
      break;
    case "down":
      targetY += 1;
      break;
    case "left":
      targetX -= 1;
      break;
    case "right":
      targetX += 1;
      break;
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
    }
    else if (targetTile === 204) {
      if (!gameProgress.secretsDiscovered.has(targetTile)) {
        gameProgress.secretsDiscovered.add(targetTile);
        updateGameInfo(); // Update the display
      }
      showPopup('Aisle D - Dreams', 'I want to create a language learning app (better than duolingo) that will actually help people learn languages and become fluent in them.', './assets/content/aisleD.jpg');
    } else if (targetTile === 11) {
      gameProgress.region = 2; // Example: Change to region 2
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
            [1, 1, 1, 1, 1, 1, 10, 1, 1],
            [-21, -1, -1, -1, -1, 2, -1, -1, 3],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [201, 201, -105, 201, 201, 201, -105, 201, 201],
            [202, 202, -106, 202, 202, 202, -106, 202, 202],
            [203, 203, -107, 203, 203, 203, -107, 203, 203],
            [204, 204, -108, 204, 204, 204, -108, 204, 204],
            [0, 0, 0, 0, 0, 0, 12, 0, 0],
          ],
          gridSize: 64, // Size of each grid cell
          position: { x: 64, y: 128 }, // Starting position
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
            [201, 201, -109, 201, 201, 201, -109, 201, 201],
            [202, 202, -110, 202, 202, 202, -110, 202, 202],
            [203, 203, -111, 203, 203, 203, -111, 203, 203],
            [204, 204, -112, 204, 204, 204, -112, 204, 204],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
          ],
          gridSize: 64, // Size of each grid cell
          position: { x: 64, y: 128 }, // Starting position
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
          position: { x: 64, y: 128 }, // Starting position
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
    }
  }
}

document.addEventListener("keydown", handleDialogInput);
function handleDialogInput(event) {
  
  let selectedIndex = gameState.dialog.selectedIndex || 0;
  const responses = gameState.dialog.responses;

  switch (event.key) {
    case "ArrowUp":
      selectedIndex = (selectedIndex - 1 + responses.length) % responses.length;
      updateDialogSelection(selectedIndex);
      break;
    case "ArrowDown":
      selectedIndex = (selectedIndex + 1) % responses.length;
      updateDialogSelection(selectedIndex);
      break;
    case "Enter":
      const selectedResponse = responses[selectedIndex];
      if (gameState.dialog.onResponse) {
        gameState.dialog.onResponse(selectedResponse); // Trigger callback
      }
      if (!gameState.isDialogTransitioning) closeDialog(); // Only close if not transitioning
      break;
    default:
      break;
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
