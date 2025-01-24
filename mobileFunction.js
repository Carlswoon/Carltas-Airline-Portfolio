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

    // Determine the region tapped for directional movement
    if (clickX < width * 0.3) {
      triggerKey('a'); // Left
      return; // Prevent further processing
    } else if (clickX > width * 0.7) {
      triggerKey('d'); // Right
      return;
    } else if (clickY < height * 0.3) {
      triggerKey('w'); // Up
      return;
    } else if (clickY > height * 0.7) {
      triggerKey('s'); // Down
      return;
    }

    // If not directional movement, handle interaction
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
