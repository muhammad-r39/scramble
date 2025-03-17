function displayLetters() {
  window.game.letters.sort(() => Math.random() - 0.5);
  const letterSlots = document.querySelectorAll(".letter-generator .slot");

  letterSlots.forEach((slot, index) => {
    slot.innerHTML = "";
    const letter = game.letters[index];
    const letterWrapper = document.createElement("div");
    letterWrapper.classList.add("letter-wrapper");
    letterWrapper.setAttribute("data-letter-index", index);
    letterWrapper.setAttribute("draggable", "true");

    letterWrapper.innerHTML = `
      <span class="letter">${letter}</span>
      <span class="point">${game.points[letter]}</span>
    `;

    slot.appendChild(letterWrapper);
  });

  // Reinitialize drag and drop after generating letters
  if (window.reinitializeDragAndDrop) {
    window.reinitializeDragAndDrop();
  } else {
    // If drag and drop script hasn't loaded yet, set up a small delay
    setTimeout(() => {
      if (window.reinitializeDragAndDrop) {
        window.reinitializeDragAndDrop();
      }
    }, 100);
  }
}

// Shuffle
document.getElementById("shuffle").addEventListener("click", () => {
  displayLetters();
});
