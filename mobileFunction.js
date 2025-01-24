export function isMobile() {
  return /Mobi|Android|iPad|iPhone/i.test(navigator.userAgent);
}

export function enableMobileInteraction(game, handleInteraction, triggerKey) {
  const gameContainer = document.getElementById('game-container');

  gameContainer.addEventListener('click', (event) => {
    const rect = gameContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    if (clickX < width * 0.3) {
      triggerKey('a');
      return;
    } else if (clickX > width * 0.7) {
      triggerKey('d');
      return;
    } else if (clickY < height * 0.3) {
      triggerKey('w');
      return;
    } else if (clickY > height * 0.7) {
      triggerKey('s');
      return;
    }

    const gridSize = game.state.gridSize;
    const targetX = Math.floor(clickX / gridSize);
    const targetY = Math.floor(clickY / gridSize);

    handleInteraction(targetX, targetY);
  });
}

export function triggerKey(key) {
  const event = new KeyboardEvent('keydown', { key });
  document.dispatchEvent(event);
}
