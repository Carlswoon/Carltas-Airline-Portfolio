const plane = document.querySelector(".grid");
// Number of rows and columns
const rows = 9;
const cols = 9;

// Generate the grid dynamically
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const div = document.createElement("div");
    if (i === 0 || i === 1) {
      div.classList.add("wall");
      if (i === 1 && j === 1) {
        div.classList.add("upper_door"); 
        div.classList.add("cockpit-text"); 
        div.textContent = "Cockpit";
      } else if (i === 1) {
        div.classList.add("wall-bottom"); // Add a specific class for i === 1
      }
    }
    if (i === 2 && j === 0) {
      div.classList.add("player"); 
    }
    if (i === 0 && j === 6) {
      div.classList.add("airplane_logo"); 
    }

    if (i === 8 && j === 6) {
      div.classList.add("lower_door"); 
    }

    if (i !== 0 && i !== 1 && i !== 2 && i !== 3 && i !== 8 && j !== 2 && j !== 6) {
      div.classList.add("seat"); 
    }

    if (i !== 0 && i !== 1 && i !== 2 && i !== 3 &&i !== 8 && (j === 2 || j === 6)) {
      div.classList.add("aisle");
      if (i === 4) div.textContent = "A";
      if (i === 5) div.textContent = "B";
      if (i === 6) div.textContent = "C";
      if (i === 7) div.textContent = "D";
    }

    if (i === 2 && j === 5) {
      div.classList.add("stewardess1"); 
    }

    if (i === 2 && j === 8) {
      div.classList.add("stewardess2"); 
    }

    plane.appendChild(div);
  }
}

const gameState = {
  map: [
    [0, 0, 0, 0, 0, 2, 0, 0, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 4, 0, 4, 4, 4, 0, 4, 4],
    [5, 5, 0, 5, 5, 5, 0, 5, 5],
    [6, 6, 0, 6, 6, 6, 0, 6, 6],
    [7, 7, 0, 7, 7, 7, 0, 7, 7],
  ],
  gridSize: 64, // Size of each grid cell
  position: { x: 0, y: 0 }, // Starting position (player starts at grid[2][0])
  player: document.querySelector(".player"),
  isMoving: false, // Track if animation is in progress
  currentDirection: "down", // Default direction
  moveDuration: 0.3, // Movement duration in seconds
  idleTimeout: null, // Timer for inactivity
};

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
    gameState.map[gridY][gridX] === 0
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
  gameState.player.style.transform = `translate(${gameState.position.x}px, ${gameState.position.y}px) translateY(-60%) scale(1.5)`;

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
    } else if (targetTile === 4) {
      showPopup('Aisle A - About Me', 'Hi my name is Carlson and am a second year studying computer science at UNSW.', './assets/content/aisleA.jpg');
    } else if (targetTile === 5) {
      showPopup('Aisle B - Beliefs', 'I strongly believe that everyone\'s purpose is to help each other grow', './assets/content/aisleB.avif');
    } else if (targetTile === 6) {
      showPopup('Aisle C - Characteristics', 'Considerate, Dilligent, Easygoing, Funny, Honest', './assets/content/aisleC.png');
    }
    else if (targetTile === 7) {
      showPopup('Aisle D - Dreams', 'I want to create a language learning app (better than duolingo) that will actually help people learn languages and become fluent in them.', './assets/content/aisleD.jpg');
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