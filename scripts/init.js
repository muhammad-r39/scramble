document.addEventListener("DOMContentLoaded", async () => {
  async function getGameInitData() {
    try {
      const response = await fetch("admin/get_game.php", { method: "POST" });
      const result = await response.json();

      if (result.success) {
        const game = {
          boost: result.boost,
          highScore: result.highScore,
          letters: result.letters,
          points: result.points,
          bestWord: result.bestWord,
          startedAt: result.started_at,
        };

        // Store in global scope
        window.leaderboard = result.leaderboard;
        window.user = result.user;

        if (!result.user) {
          checkGuestWinStatus(result.started_at);
          let guestData = localStorage.getItem("guestGameData");
          if (guestData) {
            guestData = JSON.parse(guestData);
            if (guestData.winTime) {
              return; // guest player won
            }
          }
        } else if (result.user.win > 0) {
          const gameContainer = document.querySelector("#game .container");
          gameContainer.innerHTML = `
            <div class="headline">
              <h2>🎉 Congratulations! 🎉</h2>
              <h3>You have won! You beat the game in: ${result.user.beat_time}</h3>
              <p>Please wait for next round to start!</p>
              <p class="next-round">00:00:00</p>
            </div>
          `;

          countdown(result.started_at);

          return;
        }

        window.game = game;

        window.game.startTime = new Date(await playerStartTime());

        // Initialize the game AFTER the data is fully loaded
        initializeGame();
      } else {
        alert("Server Error: Unable to load game data.");
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  }

  function displayGuestWinScreen(started_at, beat_time) {
    const gameContainer = document.querySelector("#game .container");
    gameContainer.innerHTML = `
            <div class="headline">
              <h2>🎉 Congratulations! 🎉</h2>
              <h3>You have won! You beat the game in: ${beat_time}</h3>
              <p>Please wait for next round to start!</p>
              <p class="next-round">00:00:00</p>
              <span class="btn-save">Save Your Win</span>
            </div>
          `;
    document.querySelector(".btn-save").addEventListener("click", () => {
      document.querySelector("#loginModal").style.display = "block";
    });
    countdown(started_at);
  }

  function checkGuestWinStatus(startedAt) {
    let guestData = localStorage.getItem("guestGameData");
    if (guestData) {
      guestData = JSON.parse(guestData);
      if (guestData.winTime) {
        // If the saved win data is outdated, remove it
        if (guestData.winTime < window.game.startedAt) {
          localStorage.removeItem("guestGameData");
        } else {
          // Guest has already won, display message
          displayGuestWinScreen(startedAt, guestData.beatTime);
          return true;
        }
      }
    }
  }

  async function playerStartTime() {
    if (!window.user) {
      // Check if a guest user's game data exists
      let guestData = localStorage.getItem("guestGameData");

      if (guestData) {
        guestData = JSON.parse(guestData);

        // Check if the saved time is older than the game reset time
        if (guestData.startTime < window.game.startedAt) {
          localStorage.removeItem("guestGameData"); // Remove expired data
        } else {
          return new Date(guestData.startTime); // Return saved time
        }
      }

      // No valid saved time, so store a new one
      let newStartTime = new Date();
      localStorage.setItem(
        "guestGameData",
        JSON.stringify({
          startTime: newStartTime.getTime(),
          expiresAt: newStartTime.getTime() + 24 * 60 * 60 * 1000, // 24-hour expiration
        })
      );

      return newStartTime;
    }

    // For logged-in users
    let lastActiveTime = window.user.last_active;

    if (!lastActiveTime || lastActiveTime < window.game.startedAt) {
      lastActiveTime = await updatePlayerActiveTime();
    }

    return lastActiveTime;
  }

  async function updatePlayerActiveTime() {
    const data = {
      action: "updatePlayerStartTime",
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
      return result.start_time;
    }
  }

  function initializeGame() {
    // Set Boost Slot
    document
      .querySelector(
        `.word-assembly [data-slot-id='${window.game.boost.slot}']`
      )
      .setAttribute("data-boost-by", window.game.boost.by);

    // Set High Score
    document.querySelector(".highest-score").textContent =
      window.game.highScore;

    // Display Letters
    displayLetters();
  }

  // Show loading screen while waiting for data
  document.querySelector(".loading-screen").style.display = "flex";

  await getGameInitData();

  const topPlayers = document.querySelector("#topPlayers tbody");

  const leaderboard = Object.entries(window.leaderboard);

  let topPlayerList = "";

  leaderboard.forEach((player, index) => {
    topPlayerList += `
    <tr>
      <td>${index + 1}</td>
      <td>${player[1].fullname}</td>
      <td>${player[1].time_taken}</td>
    </tr>`;
  });

  topPlayers.innerHTML = topPlayerList;
  // document.querySelector("#topPlayers tbody").innerHTML;

  // Hide loading screen once data is ready
  document.querySelector(".loading-screen").style.display = "none";
});
