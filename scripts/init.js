document.addEventListener("DOMContentLoaded", async () => {
  async function getGameInitData() {
    try {
      const response = await fetch("admin/get_game.php", { method: "POST" });
      const result = await response.json();

      if (!result.success) {
        alert("Server Error: Unable to load game data.");
        return;
      }
      const game = {
        boostSlot: result.boost_slot,
        highScore: result.high_score,
        bestWord: result.best_word,
        letters: result.letters,
        points: result.points,
        startedAt: result.started_at,
        gameId: result.game_id,
      };
      window.game = game;

      window.user = result.user || { guest: true, hintsUsed: 0 };

      if (result.user) {
        window.user.hintsUsed = result.user.last_hint;
      }

      if (!result.user && checkGuestUser(game.startedAt)) {
        return;
      } else if (result.user.win > 0) {
        displayPlayerStates();
        return;
      }

      for (let i = 0; i < window.user.hintsUsed; i++) {
        addHint(i);
      }

      initializeGame();
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  }

  // Show loading screen while waiting for data
  document.querySelector(".loading-screen").style.display = "flex";

  await getGameInitData();

  // Hide loading screen once data is ready
  document.querySelector(".loading-screen").style.display = "none";
});

// Guest Win Status
function checkGuestUser(gameStarted) {
  let guestData = localStorage.getItem("letterleyGuest");

  if (!guestData) {
    // First time player
    localStorage.setItem(
      "letterleyGuest",
      JSON.stringify({
        started: new Date().toISOString(),
        hintsUsed: 0,
      })
    );
    return false;
  }

  let guest = JSON.parse(guestData);

  let guestStarted;
  if (typeof guest.started === "string") {
    guestStarted = new Date(guest.started);
  } else {
    guestStarted = new Date(guest.started);
  }

  let gameStartTime =
    gameStarted instanceof Date ? gameStarted : new Date(gameStarted);

  if (guestStarted < gameStartTime) {
    // Reset guest data since their game is from an older period
    localStorage.removeItem("letterleyGuest");
    localStorage.setItem(
      "letterleyGuest",
      JSON.stringify({
        started: new Date().toISOString(),
        hintsUsed: 0,
      })
    );
    return false;
  }

  if (guest.won) {
    const gameContainer = document.querySelector("#game .container");
    gameContainer.innerHTML = `
            <div class="headline guest-win">
              <h2>🎉 Congratulations! 🎉</h2>
              <h3>You have found todays best word!</h3>
              <span class="btn-save">Save Your Win</span>
            </div>
          `;
    document.querySelector(".btn-save").addEventListener("click", () => {
      document.querySelector("#loginModal").style.display = "block";
    });

    // guest won, no need to initialize the game
    return true;
  } else {
    window.user.hintsUsed = guest.hintsUsed;
  }
  return false;
}

// Display Player States
function displayPlayerStates() {
  document.querySelector("#game").style.display = "none";
  document.querySelector("#gameScore").style.display = "block";
  const winRate = (window.user.total_win / window.user.total_played) * 100;
  const formattedRate = Number.isInteger(winRate)
    ? winRate.toString()
    : winRate.toFixed(2);
  formattedRate + "%";

  document.querySelector(".played-count .count").textContent =
    window.user.total_played;
  document.querySelector(".win-count .count").textContent = formattedRate;
  document.querySelector(".current-streak .count").textContent =
    window.user.current_streak;
  document.querySelector(".max-streak .count").textContent =
    window.user.max_streak;

  let maxUsedHint = 0;
  document.querySelectorAll(".hints-bar").forEach((bar, index) => {
    let hint_index = `hint_${index}`;
    bar.setAttribute("data-hints-used", window.user[hint_index]);

    maxUsedHint =
      maxUsedHint < window.user[hint_index]
        ? window.user[hint_index]
        : maxUsedHint;
  });

  calculateHintsBar(maxUsedHint);
}

function calculateHintsBar(maxUsedHint) {
  document.querySelectorAll(".hints-bar").forEach((bar, index) => {
    let hint_index = `hint_${index}`;
    // Last hint
    if (index === window.user.last_hint) {
      bar.closest("li").classList.add("active");
    }
    // Hint bar calculate
    setTimeout(() => {
      if (window.user[hint_index] === maxUsedHint) {
        bar.querySelector(".bar").style.width = "100%";
      } else {
        bar.querySelector(".bar").style.width = `${
          (window.user[hint_index] / maxUsedHint) * 100
        }%`;
      }
    }, 10);
  });
}

// Initiate Game
function initializeGame() {
  // Set Boost Slot
  document
    .querySelectorAll(`.word-assembly .slot`)
    [window.game.boostSlot - 1].setAttribute("boosted", true);

  // Set High Score
  document.querySelector(".highest-score").textContent = window.game.highScore;

  // Display Letters
  displayLetters();
}
