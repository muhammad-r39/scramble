document.addEventListener("DOMContentLoaded", () => {
  function getGameInitData() {
    const game = {
      boost: { slot: 2, by: 3 },
      highScore: 17,
      letters: ["A", "C", "C", "O", "U", "N", "T"],
      points: {
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
      },
    };

    return game;
  }

  window.game = getGameInitData();

  // Set Boost Slot
  document
    .querySelector(`.word-assembly [data-slot-id='${window.game.boost.slot}']`)
    .setAttribute("data-boost-by", window.game.boost.by);

  // Set High Score
  document.querySelector(".highest-score").textContent = window.game.highScore;

  // Start
  displayLetters();
});
