const signupForm = document.querySelector("#signupForm");
const signupMessage = document.querySelector("#signupMessage");

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const fullName =
        document.querySelector("#fullName").value.trim();

    const email =
        document.querySelector("#signupEmail")
            .value
            .trim()
            .toLowerCase();

    const password =
        document.querySelector("#signupPassword").value;


    // Frontend TTU email check
    if (!email.endsWith("@ttu.edu")) {

        signupMessage.textContent =
            "You must use a valid @ttu.edu email.";

        return;
    }


    signupMessage.textContent = "Creating account...";


    const { data, error } =
        await signUp(email, password, fullName);


    if (error) {

        signupMessage.textContent = error.message;

        return;
    }


  if (data.session) {
  signupMessage.textContent = "Account created successfully!";

  setTimeout(() => {
    window.location.href = "listings.html";
  }, 800);
} else {
  signupMessage.textContent =
    "Account created! Check your TTU email and confirm your account before logging in.";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
}

});