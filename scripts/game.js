let currentWord = "";
let validScore = false;

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
    let response = await fetch("word-engine/output/words.json.php");

    if (!response.ok) {
      console.error("Failed to load dictionary");
      return false;
    }

    let words = await response.json();

    return words.hasOwnProperty(currentWord.toLowerCase());
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
    validScore = false;
    if (await validateWord()) {
      scores.classList.remove("invalid");
      validScore = true;
    } else {
      scores.classList.add("invalid");
      validScore = false;
    }
  } else {
    scores.classList.remove("invalid");
    validScore = true;
  }

  if (validScore) {
    playerScore.textContent = score;
    const progressPercent = (score * 100) / window.game.highScore;
    progress.style.width = `${progressPercent}%`;
  }

  if (validScore && score === window.game.highScore) {
    sparkle();
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

// Start Timer
let timerInterval = setInterval(updateTimer, 1000); // Store interval ID

function updateTimer() {
  let elapsed = Math.floor((Date.now() - window.user.started_at) / 1000);
  let hours = Math.floor(elapsed / 3600);
  let minutes = Math.floor((elapsed - hours * 3600) / 60);
  let seconds = elapsed - hours * 3600 - minutes * 60;

  let timeString =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  const timeCount = document.querySelector(".time-count");
  if (timeCount) timeCount.textContent = timeString;
}

function countdown(time) {
  const countDownDate = new Date(
    new Date(time).getTime() + 60 * 60 * 24 * 1000
  );

  // Update the count down every 1 second
  const x = setInterval(function () {
    const distance = countDownDate - new Date().getTime();
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.querySelectorAll(".next-round").forEach((target) => {
      target.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    });

    if (distance < 0) {
      clearInterval(x);
      // location.reload();
    }
  }, 1000);
}

// Win function with sparkle effect
function sparkle() {
  clearInterval(timerInterval); // Stop the timer

  const registerModal = document.querySelector("#registerModal");
  const beatTime = document.querySelector(".time-count").textContent;

  const win = document.createElement("div");
  win.classList.add("sparkle-screen");

  if (window.user.guest) {
    win.innerHTML = `
    <div class="sparkle-container">
      <h2>🎉 Congratulations! 🎉</h2>
      <h3>You have found today's highest point word.</h3>
      <p>Your beat time: <span class="beat-time">${beatTime}</span></p>
      <p>Login or register to save your place among the top.</p>
      <span class="btn-link btn-register">Register</span>
    </div>
  `;
  } else {
    win.classList.add("darker");
    win.innerHTML = `
            <div class="headline">
              <h2>🎉 Congratulations! 🎉</h2>
              <h3>You have won! You beat the game in: ${beatTime}</h3>
              <p>Please wait for next round to start!</p>
              <p class="next-round">00:00:00</p>
              <span class="btn btn-leaderboard" onclick="location.reload()">See Leaderboard</span>
            </div>
          `;
  }
  countdown(window.game.startedAt);
  document.querySelector("body").appendChild(win);

  document.querySelectorAll(".btn-register").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (registerModal) {
        registerModal.style.display = "block";
      }
    });
  });

  // Add sparkle effect
  createSparkles();

  if (window.user.guest) {
    console.log("guest");
    processGuestWin(beatTime);
  } else {
    processLoggedUser(beatTime);
  }
}

function processGuestWin(beatTime) {
  const score = window.game.highScore;
  localStorage.setItem(
    "guestGameData",
    JSON.stringify({
      score: score,
      beatTime: beatTime,
      startTime: window.game.startedAt,
    })
  );
}

async function processLoggedUser(beatTime) {
  const data = {
    action: "updatePlayerWin",
    beatTime: beatTime,
    score: window.game.highScore,
  };
  const response = await fetch("admin/update.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (result.success) {
    // console.log(result);
  }
}

// Sparkle effect function
function createSparkles() {
  const sparkleScreen = document.querySelector(".sparkle-screen");
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  for (let i = 0; i < 5; i++) {
    let sparkle = document.createElement("span");
    sparkle.innerHTML = `<img src="assets/star${
      Math.floor(Math.random() * 2) + 1
    }.webp" alt="sparkle">`;
    sparkle.classList.add("sparkle");
    sparkleScreen.appendChild(sparkle);

    // Random position
    let x = centerX + (Math.random() - 0.5) * (window.innerWidth * 0.6);
    let y = centerY + (Math.random() - 0.5) * (window.innerHeight * 0.6);

    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    // Animate movement
    let moveX = (Math.random() - 0.5) * 150;
    let moveY = (Math.random() - 0.5) * 150;

    sparkle.animate([
      { transform: "translate(0, 0)", opacity: 1 },
      { transform: `translate(${moveX}px, ${moveY}px)`, opacity: 0 },
    ]);

    if (!document.querySelector(".sparkle-bg")) {
      let sparkleBg = document.createElement("span");
      sparkleBg.innerHTML = `<img class="one" src="assets/sparkle.png" alt="sparkle">
                            <img class="two" src="assets/sparkle.png" alt="sparkle">`;
      sparkleBg.classList.add("sparkle-bg");
      sparkleScreen.appendChild(sparkleBg);

      setTimeout(() => sparkleBg.remove(), 5000);
    }

    // Remove after animation
    setTimeout(() => sparkle.remove(), 5000);
  }
}

/***************
 * Game Actions
 **************/

// Shuffle
document.getElementById("shuffle").addEventListener("click", () => {
  if (
    document.querySelectorAll(".letter-generator .letter-wrapper").length < 7
  ) {
    alert("You need to recall first.");
    return;
  }
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
