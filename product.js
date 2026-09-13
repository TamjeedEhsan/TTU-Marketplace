const thumbnailsContainer = document.querySelector("#thumbnailRow");
const mainImage = document.querySelector("#mainProductImage");
const imageCounter = document.querySelector("#imageCounter");
const quantityOutput = document.querySelector("#quantity");
const cartCount = document.querySelector("#cartCount");
const toast = document.querySelector("#toast");
const saveButton = document.querySelector("#saveButton");
const checkoutButton = document.querySelector("#checkoutButton");

const productId = Number(
  new URLSearchParams(window.location.search).get("id")
);

let item = null;
let quantity = 1;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2800);
}

function getDescriptionHtml(listing) {
  if (listing.description) {
    return `
      <p>${escapeHTML(listing.description)}</p>

      <ul>
        <li>Listed by a verified @ttu.edu student</li>
        <li>Campus pickup available</li>
        <li>Message the seller to set a time</li>
      </ul>
    `;
  }

  return `
    <p>
      ${escapeHTML(listing.title)} listed by a Texas Tech student
      on TTU Marketplace.
    </p>

    <p>
      Condition is ${escapeHTML(listing.condition)}.
      Available for pickup around ${escapeHTML(listing.location)}.
    </p>
  `;
}

function formatListingTime(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();

  const difference = now - created;
  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  return `${days}d ago`;
}

function getInitials(name) {
  if (!name) {
    return "TS";
  }

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function loadProduct() {
  if (!productId) {
    showNotFound();
    return;
  }

  const { data, error } = await supabaseClient
    .from("listings")
    .select(`
      *,
      profiles (
        full_name,
        major,
        classification
      )
    `)
    .eq("id", productId)
    .single();

  if (error || !data) {
    console.error("Could not load listing:", error);
    showNotFound();
    return;
  }

  item = {
    id: data.id,
    title: data.title,
    price: Number(data.price),
    category: data.category,
    condition: data.condition,
    location: data.location || "TTU",
    description: data.description || "",
    image: data.image_url || "assets/images/backpack.jpg",
    createdAt: data.created_at,
    time: formatListingTime(data.created_at),

    seller: {
      name: data.profiles?.full_name || "TTU Student",
      initials: getInitials(data.profiles?.full_name),
      meta:
        [
          data.profiles?.major,
          data.profiles?.classification
        ]
          .filter(Boolean)
          .join(" · ") || "Verified Red Raider"
    }
  };

  renderProduct();
}

function showNotFound() {
  document.querySelector("#productTitle").textContent =
    "Listing not found";

  document.querySelector("#listingMeta").textContent =
    "This item is no longer available.";

  document.querySelector("#descriptionCopy").innerHTML =
    "<p>Go back to the marketplace to browse other listings.</p>";

  document.querySelector("#productPrice").textContent = "";

  document.querySelector("#addToCart").disabled = true;
}

function renderProduct() {
  const seller = item.seller;

  document.title = `${item.title} | TTU Marketplace`;

  document.querySelector("#productTitle").textContent =
    item.title;

  document.querySelector("#productCategory").textContent =
    item.category.toUpperCase();

  document.querySelector("#productCondition").textContent =
    item.condition.toUpperCase();

  document.querySelector("#listingMeta").textContent =
    `Listed ${item.time} · ${item.location}`;

  document.querySelector("#productPrice").textContent =
    `$${item.price.toFixed(2)}`;

  document.querySelector("#retailNote").textContent = "";

  document.querySelector("#sellerAvatar").textContent =
    seller.initials;

  document.querySelector("#sellerName").innerHTML =
    `${escapeHTML(seller.name)} <b>✓</b>`;

  document.querySelector("#sellerMeta").textContent =
    seller.meta;

  document.querySelector("#descriptionCopy").innerHTML =
    getDescriptionHtml(item);

  mainImage.src = item.image;
  mainImage.alt = item.title;

  imageCounter.textContent = "1 / 1";

  thumbnailsContainer.innerHTML = `
    <button class="thumbnail active" type="button">
      <img
        src="${escapeHTML(item.image)}"
        alt="${escapeHTML(item.title)}"
      >
    </button>
  `;

  updateCheckoutLink();
  checkIfSaved();
}



function updateCheckoutLink() {
  if (!item) {
    return;
  }

  const checkout = {
    id: item.id,
    qty: quantity
  };

  sessionStorage.setItem(
    "ttuCheckout",
    JSON.stringify(checkout)
  );

  checkoutButton.href =
    `payment.html?id=${item.id}&qty=${quantity}`;
}

document
  .querySelector("#decreaseQuantity")
  .addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);

    quantityOutput.textContent = quantity;

    updateCheckoutLink();
  });

document
  .querySelector("#increaseQuantity")
  .addEventListener("click", () => {
    quantity = Math.min(5, quantity + 1);

    quantityOutput.textContent = quantity;

    updateCheckoutLink();
  });

function getCartCount() {
  return JSON.parse(
    localStorage.getItem("ttuCart") || "[]"
  ).reduce((sum, entry) => sum + entry.qty, 0);
}

if (cartCount) {
  cartCount.textContent = getCartCount();
}

document
  .querySelector("#addToCart")
  .addEventListener("click", async () => {
    if (!item) {
      return;
    }

    // Get the logged-in user
    const user = await getCurrentUser();

    if (!user) {
      showToast("Please log in to add items to your cart.");
      return;
    }

    // Check if this item is already in the user's cart
    const { data: existing, error: checkError } =
      await supabaseClient
        .from("cart")
        .select("*")
        .eq("user_id", user.id)
        .eq("listing_id", item.id)
        .maybeSingle();

    if (checkError) {
      console.error("Cart check error:", checkError);
      showToast("Could not add item to cart.");
      return;
    }

    // If already in cart, increase the quantity
    if (existing) {
      const newQuantity =
        Math.min(5, existing.quantity + quantity);

      const { error } = await supabaseClient
        .from("cart")
        .update({
          quantity: newQuantity
        })
        .eq("id", existing.id);

      if (error) {
        console.error("Cart update error:", error);
        showToast("Could not update cart.");
        return;
      }
    }

    // Otherwise create a new cart row
    else {
      const { error } = await supabaseClient
        .from("cart")
        .insert({
          user_id: user.id,
          listing_id: item.id,
          quantity: quantity
        });

      if (error) {
        console.error("Cart insert error:", error);
        showToast("Could not add item to cart.");
        return;
      }
    }

    // Go to the cart page
    window.location.href = "cart.html";
  });

checkoutButton.addEventListener("click", () => {
  if (!item) {
    return;
  }

  updateCheckoutLink();
});

document
  .querySelector("#messageButton")
  .addEventListener("click", () => {
    if (!item) {
      return;
    }

    showToast(
      `Opening a conversation with ${item.seller.name}…`
    );
  });

saveButton.addEventListener("click", async () => {
  if (!item) {
    return;
  }

  const user = await getCurrentUser();

  if (!user) {
    showToast("Please log in to save items.");
    return;
  }

  const isSaved = saveButton.classList.contains("saved");

  // Remove from saved items
  if (isSaved) {
    const { error } = await supabaseClient
      .from("saved_items")
      .delete()
      .eq("user_id", user.id)
      .eq("listing_id", item.id);

    if (error) {
      console.error("Remove saved item error:", error);
      showToast("Could not remove saved item.");
      return;
    }

    saveButton.classList.remove("saved");

    saveButton.setAttribute(
      "aria-label",
      "Save this item"
    );

    showToast("Item removed from saved listings.");
  }

  // Save item
  else {
    const { error } = await supabaseClient
      .from("saved_items")
      .insert({
        user_id: user.id,
        listing_id: item.id
      });

    if (error) {
      console.error("Save item error:", error);
      showToast("Could not save item.");
      return;
    }

    saveButton.classList.add("saved");

    saveButton.setAttribute(
      "aria-label",
      "Remove this item from saved listings"
    );

    showToast("Item saved.");
  }
});

async function checkIfSaved() {
  const user = await getCurrentUser();

  if (!user || !item) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("saved_items")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", item.id)
    .maybeSingle();

  if (error) {
    console.error("Saved item check error:", error);
    return;
  }

  if (data) {
    saveButton.classList.add("saved");

    saveButton.setAttribute(
      "aria-label",
      "Remove this item from saved listings"
    );
  } else {
    saveButton.classList.remove("saved");

    saveButton.setAttribute(
      "aria-label",
      "Save this item"
    );
  }
}

loadProduct();