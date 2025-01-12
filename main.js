import { showPopup } from './functions.js';
import { setRandomHeight } from './titleScreen.js';
import { calculateAisle } from './game.js';
import { GAME_CONTENTS, TITLE_PAGE_CONTENTS } from './contents.js';
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
      [0, 0, 0, 0, 0, 0, 11, 0, 0]
    ],
    gridSize: 64,
    position: { x: 0, y: 128 },
    player: document.querySelector('.player'),
    isMoving: false,
    currentDirection: 'down',
    moveDuration: 0.3,
    idleTimeout: null
  },
  progress: {
    region: 1,
    totalRegions: 3,
    secretsDiscovered: new Set(),
    totalSecrets: 15
  }
};

function isMobile() {
  return /Mobi|Android|iPad|iPhone/i.test(navigator.userAgent);
}

function titleScreenMessage() {
  const dialogBox = document.getElementById('dialog-box');
  const dialogName = document.getElementById('dialog-name');
  const dialogText = document.getElementById('dialog-text');
  const dialogResponse = document.getElementById('dialog-responses');

  const originalStyles = {
    dialogBox: {
      width: dialogBox.style.width,
      height: dialogBox.style.height,
      backgroundColor: dialogBox.style.backgroundColor
    },
    dialogName: {
      marginTop: dialogName.style.marginTop,
      marginLeft: dialogName.style.marginLeft
    },
    dialogText: {
      marginLeft: dialogText.style.marginLeft,
      fontSize: dialogText.style.fontSize
    },
    dialogResponse: {
      marginRight: dialogResponse.style.marginRight
    }
  };
  dialogBox.style.width = '100vW';
  dialogBox.style.height = '100vH';
  dialogBox.style.backgroundColor= 'rgba(0, 0, 0)';
  dialogName.style.marginTop = '10%';
  dialogName.style.marginLeft = '2%';
  dialogText.style.marginLeft = '2%';
  dialogResponse.style.marginRight = '3%';
  dialogText.style.fontSize = '25px';
  dialogName.textContent = 'Pilot';
  dialogText.textContent = TITLE_PAGE_CONTENTS.INTRO_MESSAGE;

  showDialog(
    dialogBox,
    TITLE_PAGE_CONTENTS.INTRO_MESSAGE_OPTION1,
    (response) => tutorialOptions(response)
  );

  function tutorialOptions(response) {
    const tutorialData = {
      'What is the start button?': {
        message: TITLE_PAGE_CONTENTS.INTRO_MESSAGE1,
        options: TITLE_PAGE_CONTENTS.INTRO_MESSAGE_OPTION_START
      },
      'What is the "Where was Carlson last seen" button?': {
        message: TITLE_PAGE_CONTENTS.INTRO_MESSAGE2,
        options: TITLE_PAGE_CONTENTS.INTRO_MESSAGE_OPTION_LAST_SEEN
      },
      'What is the "?" button?': {
        message: TITLE_PAGE_CONTENTS.INTRO_MESSAGE3,
        options: TITLE_PAGE_CONTENTS.INTRO_MESSAGE_OPTION_HELP
      },
      'Continue': {
        message: TITLE_PAGE_CONTENTS.INTRO_MESSAGE4,
        options: [],
        isEnd: true
      }
    };

    const currentTutorial = tutorialData[response];

    if (currentTutorial) {
      dialogText.textContent = currentTutorial.message;

      if (currentTutorial.isEnd) {
        game.state.isDialogTransitioning = false;
        restoreStyles();
      } else {
        showDialog(
          dialogBox,
          currentTutorial.options,
          (response) => tutorialOptions(response)
        );
        game.state.isDialogTransitioning = true;
      }
    }
  }

  function restoreStyles() {
    dialogBox.style.width = originalStyles.dialogBox.width;
    dialogBox.style.height = originalStyles.dialogBox.height;
    dialogBox.style.backgroundColor = originalStyles.dialogBox.backgroundColor;
    dialogName.style.marginTop = originalStyles.dialogName.marginTop;
    dialogName.style.marginLeft = originalStyles.dialogName.marginLeft;
    dialogText.style.marginLeft = originalStyles.dialogText.marginLeft;
    dialogResponse.style.marginRight = originalStyles.dialogResponse.marginRight;
    dialogText.style.fontSize = originalStyles.dialogText.fontSize;
  }
}

titleScreenMessage();

function generateMap(mapArray) {
  const plane = document.querySelector('.grid');

  plane.innerHTML = '';

  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      const div = document.createElement('div');

      if (mapArray[i][j] === 1) {
        div.classList.add('wall');
      } else if (mapArray[i][j] === 2) {
        div.classList.add('stewardess1');
      } else if (mapArray[i][j] === 3) {
        div.classList.add('stewardess2');
      } else if (mapArray[i][j] === 4) {
        div.classList.add('pilot');
      } else if (mapArray[i][j] === 8) {
        div.classList.add('airplane_logo');
      } else if (mapArray[i][j] === 9) {
        div.classList.add('upper_door', 'cockpit-text');
        div.textContent = 'Cockpit';
      } else if (mapArray[i][j] > 204 && mapArray[i][j] < 209) {
        div.classList.add('seat2');
      } else if (mapArray[i][j] > 200 && mapArray[i][j] < 300) {
        div.classList.add('seat');
      } else if (mapArray[i][j] === -1) {
        div.classList.add('floor');
      } else if (mapArray[i][j] < -100 && mapArray[i][j] > -200) {
        div.classList.add('aisle');
        const letter = calculateAisle(-mapArray[i][j]);
        if (letter) {div.textContent = letter;}
      } else if (mapArray[i][j] === -21) {
        div.classList.add('player');
      } else if (mapArray[i][j] < 20 && mapArray[i][j] >= 10) {
        div.classList.add('lower_door');
      }

      plane.appendChild(div);
    }
  }
  game.state.player = document.querySelector('.player');
}

generateMap(game.state.map);

function canMoveTo(newX, newY) {
  const gridX = newX / game.state.gridSize;
  const gridY = newY / game.state.gridSize;

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

  quitButton.addEventListener('click', () => {
    gameContainer.style.display = 'block';
    titlePage.classList.remove('hidden');
    gameContainer.classList.add('hidden');
  });
  startButton.addEventListener('click', () => {
    titlePage.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    gameContainer.style.display = 'block';
    isGameActive = true;
  });

  helpButton.addEventListener('click', () => {
    createModal(TITLE_PAGE_CONTENTS.HELP_BUTTON);
  });

  document.addEventListener('keydown', async(event) => {
    if (!isGameActive) return;
    if (game.state.isMoving) return;

    let newX = game.state.position.x;
    let newY = game.state.position.y;

    if (event.key.toLowerCase() === 'w') {
      newY -= game.state.gridSize;
      game.state.currentDirection = 'up';
    } else if (event.key.toLowerCase() === 'a') {
      newX -= game.state.gridSize;
      game.state.currentDirection = 'left';
    } else if (event.key.toLowerCase() === 's') {
      newY += game.state.gridSize;
      game.state.currentDirection = 'down';
    } else if (event.key.toLowerCase() === 'd') {
      newX += game.state.gridSize;
      game.state.currentDirection = 'right';
    } else if (event.key.toLowerCase() === 'e') {
      handleInteraction();
      return;
    } else {
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

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (event) => {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

document.addEventListener('touchend', (event) => {
  touchEndX = event.changedTouches[0].clientX;
  touchEndY = event.changedTouches[0].clientY;

  handleSwipe();
});

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 30) {
      triggerKey('d');
    } else if (deltaX < -30) {
      triggerKey('a');
    }
  } else {
    if (deltaY > 30) {
      triggerKey('s');
    } else if (deltaY < -30) {
      triggerKey('w');
    }
  }
}

function triggerKey(key) {
  const event = new KeyboardEvent('keydown', { key });
  document.dispatchEvent(event);
}

function movePlayer() {
  game.state.isMoving = true;

  if (game.state.idleTimeout) {
    clearTimeout(game.state.idleTimeout);
    game.state.idleTimeout = null;
  }

  switch (game.state.currentDirection) {
  case 'up':
    game.state.player.style.backgroundPosition = '0px -512px';
    game.state.player.style.animation = 'moveUp 0.3s steps(9) infinite';
    break;
  case 'left':
    game.state.player.style.backgroundPosition = '0px -576px';
    game.state.player.style.animation = 'moveLeft 0.3s steps(9) infinite';
    break;
  case 'down':
    game.state.player.style.backgroundPosition = '0px -640px';
    game.state.player.style.animation = 'moveDown 0.3s steps(9) infinite';
    break;
  case 'right':
    game.state.player.style.backgroundPosition = '0px -704px';
    game.state.player.style.animation = 'moveRight 0.3s steps(9) infinite';
    break;
  }

  game.state.player.style.transition = `transform ${game.state.moveDuration}s linear`;
  game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;


  setTimeout(() => {
    game.state.isMoving = false;

    game.state.idleTimeout = setTimeout(() => {
      setIdleAnimation(game.state.currentDirection);
    }, 50);
  }, game.state.moveDuration * 750);
}

function discoverSecret(targetTile, title, description, imagePath) {
  if (!game.progress.secretsDiscovered.has(targetTile)) {
    game.progress.secretsDiscovered.add(targetTile);
    updateGameInfo();
  }
  showPopup(title, description, imagePath);
}

function setIdleAnimation(direction) {
  const idleAnimations = {
    up: 'idleAnimationUp 1s steps(2) infinite',
    left: 'idleAnimationLeft 1s steps(2) infinite',
    down: 'idleAnimationDown 1s steps(2) infinite',
    right: 'idleAnimationRight 1s steps(2) infinite'
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

  if (game.state.currentDirection === 'up') {
    targetY -= 1;
  } else if (game.state.currentDirection === 'down') {
    targetY += 1;
  } else if (game.state.currentDirection === 'left') {
    targetX -= 1;
  } else if (game.state.currentDirection === 'right') {
    targetX += 1;
  }

  if (
    targetX >= 0 &&
    targetY >= 0 &&
    targetY < game.state.map.length &&
    targetX < game.state.map[0].length
  ) {
    const targetTile = game.state.map[targetY][targetX];

    const dialogBox = document.getElementById('dialog-box');
    const dialogName = document.getElementById('dialog-name');
    const dialogText = document.getElementById('dialog-text');
    if (targetTile === 2) {
      dialogName.textContent = 'Stewardess';
      dialogText.textContent = 'Welcome aboard! How can I assist you?';
      showDialog(dialogBox, ['I need a tutorial please', 'I am all goodies :)'], (response) => {
        if (response === 'I need a tutorial please') {
          dialogText.textContent = 'You can use W, A, S, D keys to move around. Use E key the interact with npc and the secrets hidden in this plane. Do you have anymore questions?';
          game.state.isDialogTransitioning = true;
          showDialog(dialogBox, ['No'], (response) => {
            game.state.isDialogTransitioning = false;
          });
        } else if (response === 'I am all goodies :)') {
          dialogText.textContent = 'Alright, let me know if you change your mind.';
          game.state.isDialogTransitioning = true;
          showDialog(dialogBox, ['Continue'], (response) => {
            game.state.isDialogTransitioning = false;
          });
        }
      });
    } else if (targetTile === 3) {
      dialogName.textContent = 'Stewardess';
      dialogText.textContent = 'Welcome aboard! How can I assist you?';
      showDialog(dialogBox, ['I need a tutorial please', 'I am all goodies :)'], (response) => {
        if (response === 'I need a tutorial please') {
          dialogText.textContent = 'You can use W, A, S, D keys to move around. Use E key the interact with npc and the secrets hidden in this plane. Do you have anymore questions?';
          game.state.isDialogTransitioning = true;
          showDialog(dialogBox, ['No'], (response) => {
            game.state.isDialogTransitioning = false;
          });
        } else if (response === 'I am all goodies :)') {
          dialogText.textContent = 'Alright, let me know if you change your mind.';
          game.state.isDialogTransitioning = true;
          showDialog(dialogBox, ['Continue'], (response) => {
            game.state.isDialogTransitioning = false;
          });
        }
      });
    } if (targetTile === 201) {
      discoverSecret(targetTile, 'Row A - About Me', 'Hi my name is Carlson and am a second year studying computer science at UNSW.', './assets/content/aisleA.jpg');
    } else if (targetTile === 202) {
      discoverSecret(targetTile, 'Row B - Beliefs', 'I strongly believe that everyone\'s purpose is to help each other grow', './assets/content/aisleB.avif');
    } else if (targetTile === 203) {
      discoverSecret(targetTile, 'Row C - Characteristics', 'Considerate, Dilligent, Easygoing, Funny, Honest', './assets/content/aisleC.png');
    } else if (targetTile === 204) {
      discoverSecret(targetTile, 'Row D - Dreams', 'I want to create a language learning app (better than duolingo) that will actually help people learn languages and become fluent in them.', './assets/content/aisleD.jpg');
    } else if (targetTile === 205) {
      discoverSecret(targetTile, 'Row E - Energy Sources', 'Chocolate, Kpop (good music in general), MEMES', './assets/content/aisleE.gif');
    } else if (targetTile === 206) {
      discoverSecret(targetTile, 'Row F - Fears', 'I am afraid of bugs. Both in real life and in coding. Why do they have such weird looking legs TwT', './assets/content/aisleF.JPG');
    } else if (targetTile === 207) {
      discoverSecret(targetTile, 'Row G - Gratitude', 'Grateful to my older brother to telling me to watch Harvard\'s CS50 before I was about to choose chemical engineering to study at UNSW', './assets/content/aisleG.avif');
    } else if (targetTile === 208) {
      discoverSecret(targetTile, 'Row H - Hobbies', 'Language learning. I am currently learning Chinese (doing ARTS2450 and ARTS2451 this year!) and Korean. Would like to become a polyglot. Also like dancing.', './assets/content/aisleH.jpg');
    } else if (targetTile === 209) {
      discoverSecret(targetTile, 'Row I - Incredible Puns', 'If I don\'t get arrays from my boss I will error 404', './assets/content/aisleI.jpg');
    } else if (targetTile === 210) {
      discoverSecret(targetTile, 'Row J - Joke Time', '01101100 01100101 01110100 00100000 01101000 01101001 01101101 00100000 01100011 01101111 01101111 01101011', './assets/content/aisleJ.png');
    } else if (targetTile === 211) {
      discoverSecret(targetTile, 'Row K - Kidding Time part 2', 'Yo computer science teaching mama so fat, she can flatten a binary tree in O(1). (this is not targeted at your mum)', './assets/content/aisleK.png');
    } else if (targetTile === 212) {
      discoverSecret(targetTile, 'Row L - Laugh with me Part 3', 'I once went to a fortune teller for him that for the next 20 years I will be poor and lonely. Jokes on him. I had no money to pay him :p', './assets/content/aisleL.jpg');
    } else if (targetTile === 11) {
      setupTransition(
        2,
        [
          [1, 1, 8, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 10, 1, 1],
          [-21, -1, -1, -1, -1, 2, -1, -1, 3],
          [-1, -1, -1, -1, -1, -1, -1, -1, -1],
          [205, 205, -105, 205, 205, 205, -105, 205, 205],
          [206, 206, -106, 206, 206, 206, -106, 206, 206],
          [207, 207, -107, 207, 207, 207, -107, 207, 207],
          [208, 208, -108, 208, 208, 208, -108, 208, 208],
          [0, 0, 0, 0, 0, 0, 12, 0, 0]
        ],
        GAME_CONTENTS.TRANSITIONING,
        { down: { x: 384, y: 128 }, up: { x: 384, y: 448 } }
      );
    } else if (targetTile === 12) {
      setupTransition(
        3,
        [
          [1, 1, 8, 1, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 1, 11, 1, 1],
          [-21, -1, -1, -1, -1, 2, -1, -1, 3],
          [-1, -1, -1, -1, -1, -1, -1, -1, -1],
          [209, 209, -109, 209, 209, 209, -109, 209, 209],
          [210, 210, -110, 210, 210, 210, -110, 210, 210],
          [211, 211, -111, 211, 211, 211, -111, 211, 211],
          [212, 212, -112, 212, 212, 212, -112, 212, 212],
          [0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        GAME_CONTENTS.TRANSITIONING,
        { down: { x: 384, y: 128 }, up: { x: 384, y: 128 } }
      );
    } else if (targetTile === 10) {
      setupTransition(
        1,
        [
          [1, 1, 1, 1, 1, 1, 8, 1, 1],
          [1, 9, 1, 1, 1, 1, 1, 1, 1],
          [-21, -1, -1, -1, -1, 2, -1, -1, 3],
          [-1, -1, -1, -1, -1, -1, -1, -1, -1],
          [201, 201, -101, 201, 201, 201, -101, 201, 201],
          [202, 202, -102, 202, 202, 202, -102, 202, 202],
          [203, 203, -103, 203, 203, 203, -103, 203, 203],
          [204, 204, -104, 204, 204, 204, -104, 204, 204],
          [0, 0, 0, 0, 0, 0, 11, 0, 0]
        ],
        GAME_CONTENTS.TRANSITIONING,
        { down: { x: 64, y: 128 }, up: { x: 384, y: 448 } }
      );
    } else if (targetTile === 9) {
      if (!(game.progress.secretsDiscovered.size >= 12)) {
        showPopup('locked', 'come back when you have discovered at least 12 secrets');
      } else {
        setupTransition(
          0,
          [
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1],
            [-21, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, 4],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1, -1, -1],
            [0, 10, 0, 0, 0, 0, 0, 0, 0]
          ],
          'Entering the cockpit...',
          { down: { x: 64, y: 448 }, up: { x: 64, y: 448 } }
        );
      }
    } if (targetTile === 4) {
      dialogName.textContent = 'Pilot Carlson';
      dialogText.textContent = 'ah you have finally found me! Now that you know all about me I guess I really don\'t have anything else to say...';
      showDialog(dialogBox, ['Continue'], (response) => {
        if (response === 'Continue') {
          dialogText.textContent = 'BUT! If you have anymore questions, here is my email address which you can contact me at: carlson280306@gmail.com';
          game.state.isDialogTransitioning = true;
          showDialog(dialogBox, ['Ok thanks '], (response) => {
            game.state.isDialogTransitioning = false;
            showPopup('CONGRATULATIONS', 'YOU HAVE FOUND CARLSON!', './assets/content/ending.gif');
          });
        }
      });
    }
  }
}

function setupTransition(region, map, overlayText, playerPosition) {
  game.progress.region = region;
  updateGameInfo();

  const overlay = document.getElementById('transition-overlay');
  const textElement = document.getElementById('transition-text');
  textElement.textContent = overlayText;

  overlay.classList.add('fade-in');

  setTimeout(() => {
    const gameState2 = {
      map: map,
      gridSize: 64,
      player: null,
      isMoving: false,
      moveDuration: 0.3,
      idleTimeout: null
    };
    const direction = game.state.currentDirection;

    if (direction === 'down') {
      game.state.position = playerPosition.down || { x: 64, y: 128 };
      generateMap(gameState2.map);
      Object.assign(game.state, gameState2);
      game.state.player = document.querySelector('.player');
      game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;
    } else {
      game.state.position = playerPosition.up || { x: 384, y: 448 };
      generateMap(gameState2.map);
      Object.assign(game.state, gameState2);
      game.state.player = document.querySelector('.player');
      game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;
      setIdleAnimation('up');
    }

    setTimeout(() => {
      overlay.classList.remove('fade-in');
      overlay.classList.add('fade-out');

      setTimeout(() => {
        overlay.classList.remove('fade-out');
      }, 800);
    }, 1000);
  }, 800);
}

document.addEventListener('keydown', handleDialogInput);

function handleDialogInput(event) {
  if (!game.state.isDialogOpen) {return;}

  let selectedIndex = game.state.dialog.selectedIndex || 0;
  const responses = game.state.dialog.responses;

  if (event.key === 'ArrowUp') {
    selectedIndex = (selectedIndex - 1 + responses.length) % responses.length;
    updateDialogSelection(selectedIndex);
  } else if (event.key === 'ArrowDown') {
    selectedIndex = (selectedIndex + 1) % responses.length;
    updateDialogSelection(selectedIndex);
  } else if (event.key === 'Enter') {
    const selectedResponse = responses[selectedIndex];
    if (game.state.dialog.onResponse) {
      game.state.dialog.onResponse(selectedResponse);
    }
    if (game.state.isDialogTransitioning) {selectedIndex = 0;}
    if (!game.state.isDialogTransitioning) {closeDialog();}
  }

  game.state.dialog.selectedIndex = selectedIndex;
}

function updateDialogSelection(selectedIndex) {
  const dialogBox = document.getElementById('dialog-box');
  const responseList = dialogBox.querySelectorAll('#dialog-responses li');

  responseList.forEach((item, index) => {
    if (index === selectedIndex) {
      item.textContent = `> ${game.state.dialog.responses[index]}`;
      item.classList.add('selected');
    } else {
      item.textContent = `  ${game.state.dialog.responses[index]}`;
      item.classList.remove('selected');
    }
  });
}

function showDialog(dialogBox, responses = [], onResponse = null) {
  game.state.isDialogOpen = true;
  game.state.dialog = { responses, onResponse, selectedIndex: 0 };

  dialogBox.classList.remove('hidden');

  let responseContainer = dialogBox.querySelector('#dialog-responses');
  if (!responseContainer) {
    responseContainer = document.createElement('div');
    responseContainer.id = 'dialog-responses';
    dialogBox.appendChild(responseContainer);
  }
  responseContainer.innerHTML = '';

  const responseList = document.createElement('ul');
  responseContainer.appendChild(responseList);

  responses.forEach((response, index) => {
    const listItem = document.createElement('li');
    if (!isMobile()) {
      listItem.textContent = `${index === 0 ? '> ' : '  '} ${response}`;
      listItem.className = index === 0 ? 'selected' : '';
    } else {
      listItem.textContent = response;
    }
    listItem.addEventListener('click', () => {
      selectResponse(index);
    });

    listItem.addEventListener('mouseenter', () => {
      updateDialogSelection(index);
    });
    responseList.appendChild(listItem);
  });
}

function selectResponse(selectedIndex) {
  const responses = game.state.dialog.responses;
  const selectedResponse = responses[selectedIndex];
  if (game.state.dialog.onResponse) {
    game.state.dialog.onResponse(selectedResponse);
  }
  if (game.state.isDialogTransitioning) {
    game.state.dialog.selectedIndex = 0;
  } else {
    closeDialog();
  }
}

function closeDialog() {
  const dialogBox = document.getElementById('dialog-box');
  dialogBox.classList.add('hidden');
  game.state.isDialogOpen = false;
  game.state.dialog = null;
}


function scaleGame() {
  const plane = document.querySelector('#plane');

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  if ((screenWidth <= 600 || screenHeight <= 600)) {
    plane.style.top = '50%';
    plane.style.left = '50%';
    plane.style.position = 'absolute';
    plane.style.transform = 'translate(-50%, -50%) scale(0.6)';
    plane.style.transformOrigin = 'center';
    return;
  } else if (screenWidth <= 800 || screenHeight <= 800) {
    plane.style.top = '50%';
    plane.style.left = '50%';
    plane.style.position = 'absolute';
    plane.style.transform = 'translate(-50%, -50%) scale(0.8)';
    plane.style.transformOrigin = 'center';
    return;
  }

  const planeWidth = plane.offsetWidth;
  const planeHeight = plane.offsetHeight;

  const scaleWidth = screenWidth * 0.8 / planeWidth;
  const scaleHeight = screenHeight * 0.8 / planeHeight;

  const scale = Math.min(scaleWidth, scaleHeight);

  plane.style.transform = `scale(${scale})`;
  plane.style.transformOrigin = 'center';
}

window.addEventListener('load', scaleGame);
window.addEventListener('resize', scaleGame);


function updateGameInfo() {
  document.getElementById('region-info').textContent = `Airplane Region: ${game.progress.region}/${game.progress.totalRegions}`;
  document.getElementById('secrets-info').textContent = `Secrets Discovered: ${game.progress.secretsDiscovered.size}/${game.progress.totalSecrets}`;
}


function createModal({ title, imageSrc, facts }) {
  const modal = document.createElement('div');
  modal.id = 'fact-sheet-modal';
  modal.className = 'hidden';

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

  modal.querySelector('.close-button').addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.remove();
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
      modal.remove();
    }
  });

  document.body.appendChild(modal);

  modal.classList.remove('hidden');
}

setRandomHeight();


const destinationsGrid = document.getElementById('destinations-grid');
const modal = document.getElementById('destinations-modal');
const closeModalButton = document.getElementById('close-modal');


document.getElementById('destinations-button').addEventListener('click', () => {
  modal.classList.remove('hidden');
});

closeModalButton.addEventListener('click', () => {
  modal.classList.add('hidden');
});

destinationsGrid.addEventListener('click', (e) => {
  const destinationItem = e.target.closest('.destination-item');
  if (destinationItem) {
    const country = destinationItem.dataset.country;
    const countryDetails = TITLE_PAGE_CONTENTS.COUNTRY_DETAILS;

    if (country === 'DANGER') {
      showPopup('lol', 'what');
    } else {
      const details = countryDetails[country];
      if (details) {
        createModal({
          title: details.title,
          imageSrc: details.image,
          facts: [
            details.text
          ]
        });
      }
    }
  }
});

const menuButton = document.getElementById('menu-button');
const menuPopup = document.getElementById('menu-popup');
const quitButton = document.getElementById('quit-button');
const helpButton = document.getElementById('help');
menuButton.addEventListener('click', () => {
  menuPopup.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
  if (!menuPopup.contains(event.target) && event.target !== menuButton) {
    menuPopup.classList.add('hidden');
  }
});


helpButton.addEventListener('click', () => {
  createModal(TITLE_PAGE_CONTENTS.HELP_BUTTON);
});
