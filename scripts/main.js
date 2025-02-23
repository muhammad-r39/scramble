document.addEventListener("DOMContentLoaded", () => {
  const btnLogin = document.querySelectorAll(".btn-login");
  const btnRegister = document.querySelectorAll(".btn-register");
  const loginModal = document.querySelector("#loginModal");
  const registerModal = document.querySelector("#registerModal");
  const cloeModal = document.querySelectorAll(".close-modal");

  if (btnLogin.length > 0) {
    btnLogin.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (loginModal) {
          loginModal.style.display = "block";
          registerModal.style.display = "none";
        }
      });
    });
  }

  if (btnRegister.length > 0) {
    btnRegister.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (registerModal) {
          registerModal.style.display = "block";
          loginModal.style.display = "none";
        }
      });
    });
  }

  if (cloeModal.length > 0) {
    cloeModal.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".modal").forEach((modal) => {
          modal.style.display = "none";
        });
      });
    });
  }
});
