export function showPopup(title, message, imagePath = null) {
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