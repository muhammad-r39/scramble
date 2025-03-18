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
      };

      window.user = result.user || { guest: true, hintsCount: 0 };

      if (!result.user && checkGuestUser(game.startedAt)) {
        return;
      } else if (result.user.win > 0) {
        displayPlayerStates();
        return;
      }

      window.game = game;

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
    localStorage.setItem(
      "letterleyGuest",
      JSON.stringify({
        started: new Date(),
      })
    );
    return false;
  }

  let guest = JSON.parse(guestData);

  if (guest.started < gameStarted) {
    localStorage.removeItem("letterleyGuest");
    localStorage.setItem(
      "letterleyGuest",
      JSON.stringify({
        started: new Date(),
      })
    );
    return false;
  }

  if (guest.won) {
    const gameContainer = document.querySelector("#game .container");
    gameContainer.innerHTML = `
            <div class="headline">
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
    console.log(guest);
    for (let i = 0; i < guest.hints; i++) {}
  }
  return false;
}

// Display Player States
function displayPlayerStates() {
  console.log("display player states");
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
