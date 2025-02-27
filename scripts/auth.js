document.addEventListener("DOMContentLoaded", function () {
  // retister
  document
    .querySelector("#registrationForm #submit")
    .addEventListener("click", (e) => {
      e.preventDefault();
      // Clear previous error messages
      const errorMessages = document.querySelectorAll(".error-message");
      errorMessages.forEach((message) => message.remove());

      // Get form values
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document
        .getElementById("emailAddress")
        .value.trim()
        .toLowerCase();
      const password = document.getElementById("password").value;
      const reEnterPassword = document.getElementById("reEnterPassword").value;

      // Regex patterns
      const nameRegex = /^[A-Za-z]{2,}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passworRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

      // Validation checks
      let isValid = true;

      if (!nameRegex.test(firstName)) {
        isValid = false;
        displayError(
          "firstName",
          "First name must contain only letters and be at least 2 characters."
        );
      } else if (!nameRegex.test(lastName)) {
        isValid = false;
        displayError(
          "lastName",
          "Last name must contain only letters and be at least 2 characters."
        );
      } else if (!emailRegex.test(email)) {
        isValid = false;
        displayError("emailAddress", "Please enter a valid email address.");
      } else if (!passworRegex.test(password)) {
        isValid = false;
        displayError(
          "password",
          "Minimum eight characters, at least one letter and one number."
        );
      } else if (password != reEnterPassword) {
        isValid = false;
        displayError("reEnterPassword", "Password needs to be matched!");
      }

      if (!isValid) return;

      // Prepare registration data
      const data = {
        action: "register",
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      };

      // Send registration data to the backend
      fetch("admin/register.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            const loginModal = document.querySelector("#loginModal");
            const target = document.querySelector("#registerModal");
            target.querySelector(
              ".container"
            ).innerHTML = `<div class="success-message">${result.message}</div>`;
            setTimeout(() => (target.style.animationName = "fadeOut"), 1000);
            setTimeout(() => {
              if (loginModal) {
                loginModal.style.display = "block";
                registerModal.style.display = "none";
              }
            }, 1300);
          } else {
            displayError(
              "reEnterPassword",
              result.message || "Registration failed. Please try again."
            );
          }
        })
        .catch((error) => {
          console.error("Error during registration:", error);
          displayError(
            "reEnterPassword",
            "An error occurred. Please try again."
          );
        });
    });

  // Login
  document
    .querySelector("#loginForm #loginSubmit")
    .addEventListener("click", (e) => {
      e.preventDefault();
      // Clear previous error messages
      const errorMessages = document.querySelectorAll(".error-message");
      errorMessages.forEach((message) => message.remove());

      // Get form values
      const email = document
        .getElementById("loginEmail")
        .value.trim()
        .toLowerCase();
      const password = document.getElementById("loginPassword").value;

      // Regex patterns
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validation checks
      let isValid = true;

      if (!emailRegex.test(email)) {
        isValid = false;
        displayError("loginEmail", "Please enter a valid email address.");
      } else if (password.length < 8) {
        isValid = false;
        displayError("loginPassword", "At least 8 characters.");
      }

      if (!isValid) return;

      const data = {
        action: "login",
        email: email,
        password: password,
      };

      fetch("admin/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            const target = document.querySelector("#loginModal");
            target.querySelector(
              ".container"
            ).innerHTML = `<div class="success-message">${result.message}</div>`;
            setTimeout(() => location.reload(), 500);
          } else {
            displayError("loginPassword", result.message || "Login failed.");
          }
        })
        .catch((error) => {
          console.error("Error during login:", error);
          displayError("loginForm", "An error occurred. Please try again.");
        });
    });
  // logout
  document.querySelectorAll(".btn-logout").forEach((btn) => {
    btn.addEventListener("click", () => {
      fetch("admin/logout.php", {
        method: "POST",
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            console.log(result.message);
            location.reload();
          }
        });
    });
  });
  // Function to display error message
  function displayError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.innerText = message;

    field.parentElement.appendChild(errorMessage);

    setTimeout(() => (errorMessage.style.animationName = "fadeOut"), 4000);
    setTimeout(() => errorMessage.remove(), 4300);
  }
});
