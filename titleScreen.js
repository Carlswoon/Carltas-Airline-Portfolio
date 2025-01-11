// Function to set a random height
export function setRandomHeight() {
    const plane = document.getElementById('traveling-plane');
    const randomTop = Math.floor(Math.random() * 80); // Random value between 0 and 80 (percentage of the viewport height)
    plane.style.top = `${randomTop}vh`; // Set the top position in viewport height units
    plane.addEventListener('animationiteration', setRandomHeight);
  }