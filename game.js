document.addEventListener("DOMContentLoaded", () => {
  const letterScores = {
    A: 1,
    B: 3,
    C: 3,
    D: 2,
    E: 1,
    F: 4,
    G: 2,
    H: 4,
    I: 1,
    J: 8,
    K: 5,
    L: 1,
    M: 3,
    N: 1,
    O: 1,
    P: 3,
    Q: 10,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    V: 4,
    W: 4,
    X: 8,
    Y: 4,
    Z: 10,
  };

  const vowels = ["A", "E", "I", "O", "U"];
  const allLetters = Object.keys(letterScores);
  let generatedLetters = [];
  let startTime = Date.now();
  let playerScore = 0;
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

  function generateLetters() {
    let letters = [];
    let vowelCount = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < vowelCount; i++) {
      letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }

    while (letters.length < 7) {
      let randomLetter =
        allLetters[Math.floor(Math.random() * allLetters.length)];
      if (!vowels.includes(randomLetter)) {
        letters.push(randomLetter);
      }
    }

    generatedLetters = letters;
    generatedLetters.sort(() => Math.random() - 0.5);

    displayLetters();
    setBoostSlot();
  }

  // Display Letters
  function displayLetters() {
    const letterSlots = document.querySelectorAll(".letter-generator .slot");
    letterSlots.forEach((slot, index) => {
      let letter = generatedLetters[index];
      slot.innerHTML = `<div class="letter-wrapper" data-letter-index="${index}" draggable="true">
                          <span class="letter">${letter}</span>
                          <span class="point">${letterScores[letter]}</span>
                        </div>`;
      addDragEvent(slot);
    });
    addDropEvent();
  }

  // Boost Slot
  function setBoostSlot() {
    let randomSlotIndex = Math.floor(Math.random() * 7) + 1;
    let boostedSlot = document.querySelector(
      `.word-assembly [data-slot-id='${randomSlotIndex}']`
    );
    boostedSlot.setAttribute("data-boost-by", Math.random() < 0.5 ? 2 : 3);
  }

  // Calculate Points
  function calculatePointsAndWord() {
    playerScore = 0;
    currentWord = "";

    document
      .querySelectorAll(".word-assembly .letter-wrapper")
      .forEach((letter) => {
        const point = parseInt(letter.querySelector(".point").textContent);
        currentWord += letter
          .querySelector(".letter")
          .textContent.toLowerCase();

        const multiplier =
          letter.closest(".slot").getAttribute("data-boost-by") || 1;

        playerScore += point * parseInt(multiplier);

        updatePlayerScore();
      });
  }

  // Drag
  function addDragEvent(letterSlot) {
    letterSlot.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData(
        "text",
        e.target.getAttribute("data-letter-index")
      );
    });
  }

  // Drop
  function addDropEvent() {
    const wordAssembly = document.querySelector(".word-assembly");

    wordAssembly.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    wordAssembly.addEventListener("drop", (e) => {
      e.preventDefault();
      let draggedSlotId = e.dataTransfer.getData("text");
      let draggedElement = document.querySelector(
        `[data-letter-index='${draggedSlotId}']`
      );

      let emptySlot = [
        ...document.querySelectorAll(".word-assembly .slot .slot-wrapper"),
      ].find((wrapper) => wrapper.children.length === 0);

      if (emptySlot) {
        emptySlot.appendChild(draggedElement);
      }
      calculatePointsAndWord();
    });
  }

  generateLetters();

  // Shuffle
  document.getElementById("shuffle").addEventListener("click", () => {
    if (
      document.querySelectorAll(".letter-generator .letter-wrapper").length < 7
    ) {
      alert("You need to recall first.");
      return;
    }
    generatedLetters.sort(() => Math.random() - 0.5);
    displayLetters();
  });

  // Recall
  document.getElementById("recall").addEventListener("click", () => {
    document
      .querySelectorAll(".word-assembly .letter-wrapper")
      .forEach((letter) => {
        const index = letter.getAttribute("data-letter-index");
        document
          .querySelectorAll(".letter-generator .slot")
          [index].appendChild(letter);
      });
    currentWord = "";
    updatePlayerScore(0);
  });

  // Timer
  function updateTimer() {
    let elapsed = Math.floor((Date.now() - startTime) / 1000);
    hours = Math.floor(elapsed / 3600);
    minutes = Math.floor((elapsed - hours * 3600) / 60);
    seconds = elapsed - hours * 3600 - minutes * 60;

    timeString =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");

    document.querySelector(".time-count").textContent = timeString;
  }
  setInterval(updateTimer, 1000);
});
