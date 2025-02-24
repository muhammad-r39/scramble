let currentWord = "";

async function validateWord() {
  const playerScore = document.querySelector(".player-score");

  if (!playerScore) {
    return false;
  }

  if (currentWord.length === 0) {
    return false;
  }

  playerScore.classList.add("processing");
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
    playerScore.classList.remove("processing");
  }
}

async function updatePlayerScore(score = playerScore) {
  const playerScore = document.querySelector(".player-score");
  playerScore.textContent = score;

  if (score > 0) {
    playerScore.classList.add("invalid");
    if (await validateWord()) {
      playerScore.classList.remove("invalid");
    } else {
      playerScore.classList.add("invalid");
    }
  } else {
    playerScore.classList.remove("invalid");
  }
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

// Drag
function addDragEvent(slot) {
  const letterWrapper = slot.querySelector(".letter-wrapper");
  // Desktop Dragging
  letterWrapper.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", e.target.getAttribute("data-letter-index"));
  });
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
