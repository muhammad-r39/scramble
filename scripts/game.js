let currentWord = "";

async function validateWord() {
  const scores = document.querySelector(".scores");
  const playerScore = document.querySelector(".player-score");

  if (!playerScore) {
    return false;
  }

  if (currentWord.length === 0) {
    return false;
  }

  scores.classList.add("processing");
  await new Promise((resolve) => setTimeout(resolve, 0));

  try {
    let response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${currentWord}`
    );

    if (!response.ok) {
      return false;
    }

    let data = await response.json();
    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.error("Error validating word:", error);
    return false;
  } finally {
    scores.classList.remove("processing");
  }
}

async function updatePlayerScore(score = playerScore) {
  const scores = document.querySelector(".scores");
  const playerScore = document.querySelector(".player-score");
  const progress = document.querySelector(".progress-bar .progress");

  if (score > 0) {
    scores.classList.add("invalid");
    if (await validateWord()) {
      scores.classList.remove("invalid");
    } else {
      scores.classList.add("invalid");
    }
  } else {
    scores.classList.remove("invalid");
  }

  playerScore.textContent = score;

  const progressPercent = (score * 100) / window.game.highScore;
  console.log(progressPercent);
  progress.style.width = `${progressPercent}%`;
}

// Calculate Points
function calculatePointsAndWord() {
  playerScore = 0;
  currentWord = "";

  document
    .querySelectorAll(".word-assembly .letter-wrapper")
    .forEach((letter) => {
      const point = parseInt(letter.querySelector(".point").textContent);
      currentWord += letter.querySelector(".letter").textContent.toLowerCase();

      const multiplier =
        letter.closest(".slot").getAttribute("data-boost-by") || 1;

      playerScore += point * parseInt(multiplier);

      updatePlayerScore();
    });
}

/*****************
 * Player Actions
 ****************/
// Drag
function addDragEvent(slot) {
  const letterWrapper = slot.querySelector(".letter-wrapper");

  // Desktop Dragging
  letterWrapper.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", e.target.getAttribute("data-letter-index"));
  });

  // Mobile Touch Dragging
  letterWrapper.addEventListener("touchstart", handleTouchStart);
  letterWrapper.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
  letterWrapper.addEventListener("touchend", handleTouchEnd);
}

// Touch Drag Variables
let activeDrag = null;
let initialX = 0,
  initialY = 0;

function handleTouchStart(e) {
  const touch = e.touches[0];
  activeDrag = e.target.closest(".letter-wrapper");

  if (activeDrag) {
    initialX = touch.clientX;
    initialY = touch.clientY;
    activeDrag.style.position = "absolute";
    activeDrag.style.zIndex = "1000";
  }
}

function handleTouchMove(e) {
  if (!activeDrag) return;

  e.preventDefault(); // Prevent page from scrolling

  const touch = e.touches[0];

  // Move the dragged element with the touch
  activeDrag.style.left = `${touch.clientX - initialX}px`;
  activeDrag.style.top = `${touch.clientY - initialY}px`;
}

function handleTouchEnd(e) {
  if (!activeDrag) return;

  // Find nearest empty slot
  let emptySlot = [
    ...document.querySelectorAll(".word-assembly .slot .slot-wrapper"),
  ].find((slot) => slot.children.length === 0);

  if (emptySlot) {
    emptySlot.appendChild(activeDrag);
  }

  // Reset styles
  activeDrag.style.position = "";
  activeDrag.style.zIndex = "";
  activeDrag.style.left = "";
  activeDrag.style.top = "";

  activeDrag = null;
  calculatePointsAndWord();
}

// Drop
function addDropEvent() {
  const wordAssembly = document.querySelector(".word-assembly");

  wordAssembly.removeEventListener("dragover", handleDragOver);
  wordAssembly.removeEventListener("drop", handleDrop);

  wordAssembly.addEventListener("dragover", handleDragOver);
  wordAssembly.addEventListener("drop", handleDrop);
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  e.preventDefault();
  let draggedSlotId = e.dataTransfer.getData("text");
  let draggedElement = document.querySelector(
    `[data-letter-index='${draggedSlotId}']`
  );

  placeLetterInEmptySlot(draggedElement);
}

// Place Letter
function placeLetterInEmptySlot(draggedElement) {
  let emptySlot = [
    ...document.querySelectorAll(".word-assembly .slot .slot-wrapper"),
  ].find((slot) => slot.children.length === 0);

  if (emptySlot) {
    emptySlot.appendChild(draggedElement);
  }
  calculatePointsAndWord();
}

// Display Letters
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
    addDragEvent(slot);
  });

  addDropEvent();
}
