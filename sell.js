const form = document.getElementById("listing-form");
const photoInput = document.getElementById("photo-input");
const previewSlots = document.querySelectorAll(".preview-slot");
const descriptionToggle = document.getElementById("description-toggle");
const descriptionBox = document.getElementById("description-box");
const formError = document.getElementById("form-error");

let photoDataUrls = [];

function showError(message) {
  formError.hidden = !message;
  formError.textContent = message;
}

function renderPreviews() {
  previewSlots.forEach((slot, index) => {
    const src = photoDataUrls[index];
    slot.innerHTML = src ? `<img src="${escapeHTML(src)}" alt="Item photo ${index + 1}" />` : "";
  });
}

photoInput.addEventListener("change", () => {
  const files = Array.from(photoInput.files).slice(0, 5);
  photoDataUrls = [];

  if (!files.length) {
    renderPreviews();
    return;
  }

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      photoDataUrls.push(event.target.result);
      renderPreviews();
    };
    reader.readAsDataURL(file);
  });
});

descriptionToggle.addEventListener("click", () => {
  const isHidden = descriptionBox.hidden;
  descriptionBox.hidden = !isHidden;
  descriptionToggle.textContent = isHidden ? "− Remove description" : "+ Add description";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  showError("");

  const title = document.getElementById("item-title").value.trim();
  const price = Number(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value.trim();
  const conditionInput = document.querySelector('input[name="condition"]:checked');
  const description = document.getElementById("description").value.trim();

  if (!title || !category || !location || !conditionInput || Number.isNaN(price) || price < 0) {
    showError("Please complete all required fields.");
    return;
  }

  const saved = JSON.parse(localStorage.getItem("ttuUserListings") || "[]");
  const listing = {
    id: Date.now(),
    title,
    price,
    location,
    time: "Just now",
    hoursAgo: 0,
    category,
    condition: conditionInput.value,
    image: photoDataUrls[0] || "assets/images/backpack.jpg",
    description
  };

  localStorage.setItem("ttuUserListings", JSON.stringify([listing, ...saved]));
  window.location.href = "listings.html";
});
