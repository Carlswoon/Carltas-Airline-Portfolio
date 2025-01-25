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
    popupImage.classList.remove('popup-image');
  }

  popupContent.appendChild(popupImage);

  popup.appendChild(popupContent);

  const closeButton = document.createElement('div');
  closeButton.classList.add('popup-close');
  closeButton.textContent = 'X';
  closeButton.onclick = () => {
    document.body.removeChild(popup);
  };
  popup.appendChild(closeButton);

  document.body.appendChild(popup);

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  popup.addEventListener('mousedown', (event) => {
    isDragging = true;

    popup.style.cursor = 'grabbing';
    popup.style.transition = 'none';

    const rect = popup.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
    event.preventDefault();
  });

  document.addEventListener('mousemove', (event) => {
    if (isDragging) {
      const x = event.clientX - offsetX;
      const y = event.clientY - offsetY;

      popup.style.left = `${x}px`;
      popup.style.top = `${y}px`;
      popup.style.transform = 'none';
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      popup.style.cursor = '';
      popup.style.transition = '';
    }
  });
}

export function createModal({ title, imageSrc, facts }) {
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
