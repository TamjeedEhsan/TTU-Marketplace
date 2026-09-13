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

    slot.innerHTML = src
      ? `<img src="${escapeHTML(src)}" alt="Item photo ${index + 1}" />`
      : "";
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

  descriptionToggle.textContent = isHidden
    ? "− Remove description"
    : "+ Add description";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showError("");

  const title = document.getElementById("item-title").value.trim();
  const price = Number(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value.trim();

  const conditionInput =
    document.querySelector('input[name="condition"]:checked');

  const description =
    document.getElementById("description").value.trim();

  if (
    !title ||
    !category ||
    !location ||
    !conditionInput ||
    Number.isNaN(price) ||
    price < 0
  ) {
    showError("Please complete all required fields.");
    return;
  }

  const user = await getCurrentUser();

  if (!user) {
    showError("You must be logged in to list an item.");
    return;
  }

  const submitButton = form.querySelector(".list-btn");

  submitButton.disabled = true;
  submitButton.textContent = "Listing item...";

  let imageUrl = null;

  // Upload the first selected photo
  if (photoInput.files.length > 0) {
    const imageFile = photoInput.files[0];

    const fileExtension =
      imageFile.name.split(".").pop();

    const fileName =
      `${user.id}/${Date.now()}.${fileExtension}`;

    const { error: uploadError } =
      await supabaseClient.storage
        .from("listing-images")
        .upload(fileName, imageFile);

    if (uploadError) {
      console.error("Image upload error:", uploadError);

      showError("Could not upload image.");

      submitButton.disabled = false;
      submitButton.textContent = "List Item";

      return;
    }

    const { data: publicUrlData } =
      supabaseClient.storage
        .from("listing-images")
        .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;
  }

  // Save listing in database
  const { data, error } = await supabaseClient
    .from("listings")
    .insert({
      seller_id: user.id,
      title: title,
      description: description,
      price: price,
      category: category,
      condition: conditionInput.value,
      location: location,
      image_url: imageUrl,
      status: "active"
    })
    .select()
    .single();

  if (error) {
    console.error("Listing error:", error);

    showError(error.message);

    submitButton.disabled = false;
    submitButton.textContent = "List Item";

    return;
  }

  console.log("Listing created:", data);

  window.location.href = "listings.html";
});