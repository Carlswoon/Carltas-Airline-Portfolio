export function setRandomHeight() {
  const plane = document.getElementById('traveling-plane');
  const randomTop = Math.floor(Math.random() * 80);
  plane.style.top = `${randomTop}vh`;
  plane.addEventListener('animationiteration', setRandomHeight);
}


export function setupHelpButton(helpButton, createModal, helpContent) {
  helpButton.addEventListener('click', () => {
    createModal(helpContent);
  });
}