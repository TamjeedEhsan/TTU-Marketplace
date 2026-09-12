const form = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("#passwordToggle");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 3000);
}

function setError(input, output, message) {
  input.classList.toggle("invalid", Boolean(message));
  output.textContent = message;
}

function validateEmail() {
  const email = emailInput.value.trim().toLowerCase();
  let message = "";

  if (!email) {
    message = "Please enter your TTU email.";
  } else if (!/^[^\s@]+@ttu\.edu$/.test(email)) {
    message = "Please use a valid @ttu.edu email address.";
  }

  setError(emailInput, emailError, message);
  return message === "";
}

function validatePassword() {
  const message = passwordInput.value ? "" : "Please enter your password.";
  setError(passwordInput, passwordError, message);
  return message === "";
}

passwordToggle.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  passwordToggle.classList.toggle("showing", isHidden);
  passwordToggle.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);

emailInput.addEventListener("input", () => {
  if (emailError.textContent) validateEmail();
});

passwordInput.addEventListener("input", () => {
  if (passwordError.textContent) validatePassword();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const emailIsValid = validateEmail();
  const passwordIsValid = validatePassword();

  if (!emailIsValid || !passwordIsValid) return;
  window.location.href = "listings.html";
});

document.querySelector("#googleButton").addEventListener("click", () => {
  showToast("Connect this button to TTU Google authentication.");
});

document.querySelector("#forgotLink").addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Connect this link to your password-reset page.");
});

document.querySelector("#createLink").addEventListener("click", (event) => {
  event.preventDefault();
  showToast("Connect this link to your account-creation page.");
});
