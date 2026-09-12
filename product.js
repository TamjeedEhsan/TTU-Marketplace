const thumbnailsContainer = document.querySelector("#thumbnailRow");
const mainImage = document.querySelector("#mainProductImage");
const imageCounter = document.querySelector("#imageCounter");
const quantityOutput = document.querySelector("#quantity");
const cartCount = document.querySelector("#cartCount");
const toast = document.querySelector("#toast");
const saveButton = document.querySelector("#saveButton");

const productId = Number(new URLSearchParams(window.location.search).get("id") || 1);
const userListings = JSON.parse(localStorage.getItem("ttuUserListings") || "[]");
const favorites = new Set(JSON.parse(localStorage.getItem("ttuFavorites") || "[]"));
const item = [...userListings, ...products].find((entry) => entry.id === productId);

let quantity = 1;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

function getImages(listing) {
  if (listing.images && listing.images.length) {
    return listing.images;
  }

  return [{ src: listing.image, alt: listing.title }];
}

function getDescriptionHtml(listing) {
  if (listing.aboutHtml) {
    return listing.aboutHtml;
  }

  const paragraphs = listing.description
    ? [`<p>${listing.description}</p>`]
    : [
        `<p>${listing.title} listed by a Texas Tech student on TTU Marketplace.</p>`,
        `<p>Condition is ${listing.condition}. Available for pickup around ${listing.location}.</p>`
      ];

  const extras = listing.highlights
    ? `<ul>${listing.highlights.map((line) => `<li>${line}</li>`).join("")}</ul>`
    : `<ul>
        <li>Listed by a verified @ttu.edu student</li>
        <li>Campus pickup available</li>
        <li>Message the seller to set a time</li>
      </ul>`;

  return paragraphs.join("") + extras;
}

if (!item) {
  document.querySelector("#productTitle").textContent = "Listing not found";
  document.querySelector("#listingMeta").textContent = "This item is no longer available.";
  document.querySelector("#descriptionCopy").innerHTML = "<p>Go back to the marketplace to browse other listings.</p>";
  document.querySelector("#productPrice").textContent = "";
} else {
  const images = getImages(item);
  const seller = item.seller || {
    initials: "TS",
    name: "TTU Student",
    meta: "Verified Red Raider"
  };

  document.title = `${item.title} | TTU Marketplace`;
  document.querySelector("#productTitle").textContent = item.detailTitle || item.title;
  document.querySelector("#productCategory").textContent = item.category.toUpperCase();
  document.querySelector("#productCondition").textContent = item.condition.toUpperCase();
  document.querySelector("#listingMeta").textContent = `Listed ${item.time} · ${item.location}`;
  document.querySelector("#productPrice").textContent = `$${item.price}`;
  document.querySelector("#retailNote").textContent = item.retailNote || "";
  document.querySelector("#sellerAvatar").textContent = seller.initials;
  document.querySelector("#sellerName").innerHTML = `${seller.name} <b>✓</b>`;
  document.querySelector("#sellerMeta").textContent = seller.meta;
  document.querySelector("#descriptionCopy").innerHTML = getDescriptionHtml(item);

  mainImage.src = images[0].src;
  mainImage.alt = images[0].alt;
  imageCounter.textContent = `1 / ${images.length}`;

  thumbnailsContainer.innerHTML = images
    .map((image, index) => `
      <button class="thumbnail${index === 0 ? " active" : ""}" type="button" data-image="${image.src}" data-alt="${image.alt}">
        <img src="${image.src}" alt="${image.alt}">
      </button>
    `)
    .join("");

  if (favorites.has(item.id)) {
    saveButton.classList.add("saved");
    saveButton.setAttribute("aria-label", "Remove this item from saved listings");
  }
}

const thumbnails = [...document.querySelectorAll(".thumbnail")];

thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", () => {
    thumbnails.forEach((entry) => entry.classList.remove("active"));
    thumbnail.classList.add("active");
    mainImage.classList.add("changing");

    setTimeout(() => {
      mainImage.src = thumbnail.dataset.image;
      mainImage.alt = thumbnail.dataset.alt;
      imageCounter.textContent = `${index + 1} / ${thumbnails.length}`;
      mainImage.classList.remove("changing");
    }, 120);
  });
});

const checkoutButton = document.querySelector("#checkoutButton");

function updateCheckoutLink() {
  if (!item || !checkoutButton) {
    return;
  }

  const checkout = { id: item.id, qty: quantity };
  sessionStorage.setItem("ttuCheckout", JSON.stringify(checkout));
  checkoutButton.href = `payment.html?id=${item.id}&qty=${quantity}`;
}

updateCheckoutLink();

checkoutButton.addEventListener("click", (event) => {
  if (!item) {
    return;
  }

  updateCheckoutLink();

  if (checkoutButton.tagName !== "A") {
    event.preventDefault();
    window.location.href = `payment.html?id=${item.id}&qty=${quantity}`;
  }
});

document.querySelector("#decreaseQuantity").addEventListener("click", () => {
  quantity = Math.max(1, quantity - 1);
  quantityOutput.textContent = quantity;
  updateCheckoutLink();
});

document.querySelector("#increaseQuantity").addEventListener("click", () => {
  quantity = Math.min(5, quantity + 1);
  quantityOutput.textContent = quantity;
  updateCheckoutLink();
});

function getCartCount() {
  return JSON.parse(localStorage.getItem("ttuCart") || "[]").reduce((sum, entry) => sum + entry.qty, 0);
}

if (cartCount) {
  cartCount.textContent = getCartCount();
}

document.querySelector("#addToCart").addEventListener("click", () => {
  if (!item) {
    return;
  }

  const cart = JSON.parse(localStorage.getItem("ttuCart") || "[]");
  const existing = cart.find((entry) => entry.id === item.id);
  const image = item.images && item.images[0] ? item.images[0].src : item.image;
  const seller = item.seller ? item.seller.name : "TTU Student";

  if (existing) {
    existing.qty = Math.min(5, existing.qty + quantity);
  } else {
    cart.push({
      id: item.id,
      title: item.detailTitle || item.title,
      price: item.price,
      qty: quantity,
      image,
      condition: item.condition,
      category: item.category,
      seller
    });
  }

  localStorage.setItem("ttuCart", JSON.stringify(cart));
  window.location.href = "cart.html";
});

document.querySelector("#messageButton").addEventListener("click", () => {
  const sellerName = item && item.seller ? item.seller.name : "the seller";
  showToast(`Opening a conversation with ${sellerName}…`);
});

saveButton.addEventListener("click", (event) => {
  if (!item) {
    return;
  }

  const button = event.currentTarget;
  const isSaved = button.classList.toggle("saved");

  if (isSaved) {
    favorites.add(item.id);
  } else {
    favorites.delete(item.id);
  }

  localStorage.setItem("ttuFavorites", JSON.stringify([...favorites]));
  button.setAttribute("aria-label", isSaved ? "Remove this item from saved listings" : "Save this item");
  showToast(isSaved ? "Item saved." : "Item removed from saved listings.");
});
