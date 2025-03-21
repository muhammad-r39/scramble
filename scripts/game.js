function displayLetters(shuffle = true) {
  if (shuffle) {
    window.game.letters.sort(() => Math.random() - 0.5);
  }

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

      const multiplier = letter.closest(".slot").hasAttribute("boosted")
        ? 3
        : 1;

      playerScore += point * parseInt(multiplier);

      updatePlayerScore();
    });
}

function sparkle() {
  if (document.querySelector(".sparkle-screen")) {
    return;
  }

  const registerModal = document.querySelector("#registerModal");

  const win = document.createElement("div");
  win.classList.add("sparkle-screen");

  if (window.user.guest) {
    win.innerHTML = `
    <div class="sparkle-container">
      <h2>🎉 Congratulations! 🎉</h2>
      <h3>You have found today's highest point word.</h3>
      <p>Login or register to save your progress.</p>
      <span class="btn-link btn-register">Register</span>
    </div>
  `;
  } else {
    // display player states
    win.innerHTML = `
    <div class="sparkle-container">
      <h2>🎉 Congratulations! 🎉</h2>
      <h3>You have found today's highest point word.</h3>
      <span class="btn-link btn-progress">See Progress</span>
    </div>
  `;
  }
  document.querySelector("body").appendChild(win);

  document.querySelectorAll(".btn-register").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (registerModal) {
        registerModal.style.display = "block";
      }
    });
  });

  document.querySelector(".btn-progress").addEventListener("click", () => {
    document.querySelector(".sparkle-screen").remove();
    location.reload();
    // displayPlayerStates();
  });

  // Add sparkle effect
  createSparkles();

  if (window.user.guest) {
    processGuestWin();
  } else {
    processLoggedUserWin();
  }
}

function processGuestWin() {
  let guestData = localStorage.getItem("letterleyGuest");
  let guestObj = {};

  if (guestData) {
    guestObj = JSON.parse(guestData);
  }

  guestObj.won = true;

  localStorage.setItem("letterleyGuest", JSON.stringify(guestObj));
}

async function processLoggedUserWin() {
  const data = {
    action: "updatePlayerWin",
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
    console.log(result);
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

// Shuffle
document.getElementById("shuffle").addEventListener("click", () => {
  document
    .querySelectorAll(".word-assembly .slot .letter-wrapper")
    .forEach((slot) => {
      slot.remove();
    });
  displayLetters();
  updatePlayerScore(0);
});

// Hint
document.getElementById("hint").addEventListener("click", () => {
  if (window.game.bestWord.length > window.user.hintsUsed) {
    updateHintsUse();
    addHint(window.user.hintsUsed);
    window.user.hintsUsed++;
  }
});

async function updateHintsUse() {
  if (window.user.guest) {
    // Guest User
    let guestData = localStorage.getItem("letterleyGuest");
    let guestObj = {};

    if (guestData) {
      guestObj = JSON.parse(guestData);
    }

    if (guestObj.hintsUsed < window.game.bestWord.length) {
      guestObj.hintsUsed++;
    }

    // Save the updated object back to localStorage
    localStorage.setItem("letterleyGuest", JSON.stringify(guestObj));
  } else {
    // Logged in User
    await processLoggedUserHintUse();
  }
}

async function processLoggedUserHintUse() {
  const data = {
    action: "updatePlayerHintUse",
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
    console.log(result);
  }
}

function addHint(index) {
  const hint = window.game.bestWord[index];

  const slot = document.querySelector(
    `.word-assembly .slot:nth-child(${index + 1})`
  );

  slot.setAttribute("data-hint", hint);
  slot.classList.add("has-hint");
}
