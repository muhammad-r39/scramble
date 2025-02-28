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
        window.user = result.user;
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

  /**
   * if null set current time
   * if time exist check if its after game starttime
   *
   */

  async function playerStartTime() {
    if (!window.user) {
      return new Date();
    }

    let lastActiveTime = window.user.last_active;

    if (!lastActiveTime) {
      // No time found
      lastActiveTime = await updatePlayerActiveTime(lastActiveTime);
    } else {
      if (lastActiveTime < window.game.startedAt) {
        // If not in current session
        lastActiveTime = await updatePlayerActiveTime(lastActiveTime);
      }
    }

    return lastActiveTime;
  }

  async function updatePlayerActiveTime(activeTime) {
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
    console.log(result);
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

  // Hide loading screen once data is ready
  document.querySelector(".loading-screen").style.display = "none";
});
