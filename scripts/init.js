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
          startTime: result.start_time,
        };

        // Store in global scope
        window.game = game;

        // Initialize the game AFTER the data is fully loaded
        initializeGame();
      } else {
        alert("Server Error: Unable to load game data.");
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
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
