import { showPopup, createModal } from './functions.js';
import { setRandomHeight, setupHelpButton } from './titleScreen.js';
import { calculateAisle } from './game.js';
import { GAME_CONTENTS, TITLE_PAGE_CONTENTS, PLAYER, GAME_STATS, MAP, TILES } from './constants.js';
import { isMobile, enableMobileInteraction, triggerKey } from './mobileFunction.js';

const game = {
  state : {
    map: MAP.REGION1,
    gridSize: PLAYER.SIZE,
    position: PLAYER.POSITION,
    player: document.querySelector('.player'),
    isMoving: false,
    currentDirection: PLAYER.STARTING_DIRECTION,
    moveDuration: PLAYER.SPEED,
    idleTimeout: null,
    language: 'EN'
  },
  progress: {
    region: GAME_STATS.STARTING_REGION,
    totalRegions: GAME_STATS.TOTAL_REGIONS,
    secretsDiscovered: new Set(),
    totalSecrets: GAME_STATS.TOTAL_SECRETS
  }
};

if (isMobile()) {
  enableMobileInteraction(game, handleInteraction, triggerKey);
}

function titleScreenMessage() {
  const dialogBox = document.getElementById('dialog-box');
  const dialogName = document.getElementById('dialog-name');
  const dialogText = document.getElementById('dialog-text');
  const dialogResponse = document.getElementById('dialog-responses');
  game.state.isDialogTransitioning = true;
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
  dialogText.style.fontSize = '4vH';
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

const helpButton = document.getElementById('help');
setupHelpButton(helpButton, createModal, TITLE_PAGE_CONTENTS.HELP_BUTTON);

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
      } else if (mapArray[i][j] === 5) {
        div.classList.add('globe');
      }

      plane.appendChild(div);
    }
  }
  game.state.player = document.querySelector('.player');
}

window.addEventListener('load', () => {
  generateMap(game.state.map);
});


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
    titleScreenMessage();
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

function discoverSecret(row) {
  const { language } = game.state;

  const { targetTile, title, content, image } = row;

  const localizedTitle = title[language] || title.EN;
  const localizedContent = content[language] || content.EN;

  if (!game.progress.secretsDiscovered.has(targetTile)) {
    game.progress.secretsDiscovered.add(targetTile);
    updateGameInfo();
  }

  showPopup(localizedTitle, localizedContent, image);
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
    if (targetTile === 2 || targetTile === 3) {
      const lang = game.state.language || 'EN';
      const translations = GAME_CONTENTS.DIALOGUE[lang];

      dialogName.textContent = translations.stewardess;
      dialogText.textContent = translations.welcome;

      showDialog(dialogBox, [translations.tutorialPrompt, translations.noHelpNeeded], (response) => {
        if (response === translations.tutorialPrompt) {
          dialogText.textContent = translations.tutorialResponse;
          game.state.isDialogTransitioning = true;
          showDialog(dialogBox, [translations.noResponse], (response) => {
            game.state.isDialogTransitioning = false;
          });
        } else if (response === translations.noHelpNeeded) {
          dialogText.textContent = translations.changeMindResponse;
          game.state.isDialogTransitioning = true;
          showDialog(dialogBox, [translations.continue], (response) => {
            game.state.isDialogTransitioning = false;
          });
        }
      });
    } if (targetTile === TILES.ROW.A) {
      discoverSecret(GAME_CONTENTS.ROWS.A);
    } else if (targetTile === TILES.ROW.B) {
      discoverSecret(GAME_CONTENTS.ROWS.B);
    } else if (targetTile === TILES.ROW.C) {
      discoverSecret(GAME_CONTENTS.ROWS.C);
    } else if (targetTile === TILES.ROW.D) {
      discoverSecret(GAME_CONTENTS.ROWS.D);
    } else if (targetTile === TILES.ROW.E) {
      discoverSecret(GAME_CONTENTS.ROWS.E);
    } else if (targetTile === TILES.ROW.F) {
      discoverSecret(GAME_CONTENTS.ROWS.F);
    } else if (targetTile === TILES.ROW.G) {
      discoverSecret(GAME_CONTENTS.ROWS.G);
    } else if (targetTile === TILES.ROW.H) {
      discoverSecret(GAME_CONTENTS.ROWS.H);
    } else if (targetTile === TILES.ROW.I) {
      discoverSecret(GAME_CONTENTS.ROWS.I);
    } else if (targetTile === TILES.ROW.J) {
      discoverSecret(GAME_CONTENTS.ROWS.J);
    } else if (targetTile === TILES.ROW.K) {
      discoverSecret(GAME_CONTENTS.ROWS.K);
    } else if (targetTile === TILES.ROW.L) {
      discoverSecret(GAME_CONTENTS.ROWS.L);
    } else if (targetTile === TILES.REGION2) {
      setupTransition(
        2,
        MAP.REGION2,
        'TRANSITIONING',
        PLAYER.REGION2_POSITION
      );
    } else if (targetTile === TILES.REGION3) {
      setupTransition(
        3,
        MAP.REGION3,
        'TRANSITIONING',
        PLAYER.REGION3_POSITION
      );
    } else if (targetTile === TILES.REGION1) {
      setupTransition(
        1,
        MAP.REGION1,
        'TRANSITIONING',
        PLAYER.REGION1_POSITION
      );
    } else if (targetTile === TILES.COCKPIT_DOOR) {
      if (!(game.progress.secretsDiscovered.size >= 12)) {
        showPopup('locked', 'come back when you have discovered at least 12 secrets');
      } else {
        setupTransition(
          0,
          MAP.COCKPIT,
          'Entering the cockpit...',
          PLAYER.COCKPIT_POSITION
        );
      }
    } if (targetTile === TILES.PILOT) {
      const lang = game.state.language || 'EN';
      const translations = GAME_CONTENTS.DIALOGUE[lang];

      dialogName.textContent = translations.pilot;
      dialogText.textContent = translations.pilotIntro;

      showDialog(dialogBox, [translations.continue], (response) => {
        if (response === translations.continue) {
          dialogText.textContent = translations.pilotEmail;
          game.state.isDialogTransitioning = true;

          showDialog(dialogBox, [translations.thanks], (response) => {
            game.state.isDialogTransitioning = false;
            showPopup(
              translations.congratulations,
              translations.foundCarlson,
              './assets/content/ending.gif'
            );
          });
        }
      });
    } else if (targetTile === TILES.GLOBE) {
      selectLanguage();
    }
  }
}

function selectLanguage() {
  const languageMenu = document.getElementById('language-menu');

  languageMenu.classList.remove('hidden');

  document.querySelectorAll('.language-options button').forEach((button) => {
    button.addEventListener('click', (event) => {
      const selectedLanguage = event.currentTarget.dataset.lang;
      game.state.language = selectedLanguage;

      languageMenu.classList.add('hidden');
    });
  });
}

function setupTransition(region, map, overlayTextKey, playerPosition) {
  const language = game.state.language || 'EN';
  const overlayText = GAME_CONTENTS.TRANSITIONING[language];

  game.progress.region = region;
  updateGameInfo();

  const overlay = document.getElementById('transition-overlay');
  const textElement = document.getElementById('transition-text');
  textElement.textContent = overlayText;

  overlay.classList.add('fade-in');

  setTimeout(() => {
    const gameState2 = {
      map: map,
      gridSize: PLAYER.SIZE,
      player: null,
      isMoving: false,
      moveDuration: PLAYER.SPEED,
      idleTimeout: null
    };
    const direction = game.state.currentDirection;
    game.state.position = { ...playerPosition[direction] };
    generateMap(gameState2.map);
    Object.assign(game.state, gameState2);
    game.state.player = document.querySelector('.player');
    game.state.player.style.transform = `translate(${game.state.position.x}px, ${game.state.position.y}px) translateY(-260%) scale(1.5)`;
    setIdleAnimation(direction);

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
  if (!game.state.isDialogOpen) {
    return;
  }

  const responses = game.state.dialog.responses;
  let selectedIndex = game.state.dialog.selectedIndex || 0;

  if (event.key === 'ArrowUp') {
    selectedIndex = (selectedIndex - 1 + responses.length) % responses.length;
    updateDialogSelection(selectedIndex);
  } else if (event.key === 'ArrowDown') {
    selectedIndex = (selectedIndex + 1) % responses.length
    updateDialogSelection(selectedIndex);
  } else if (event.key === 'Enter') {
    selectResponse(selectedIndex);
    return;
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

  dialogBox.setAttribute('tabindex', '-1');
  dialogBox.focus();
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

menuButton.addEventListener('click', () => {
  menuPopup.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
  if (!menuPopup.contains(event.target) && event.target !== menuButton) {
    menuPopup.classList.add('hidden');
  }
});
