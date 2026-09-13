const cartItems = document.querySelector("#cartItems");
const cartLayout = document.querySelector("#cartLayout");
const emptyCart = document.querySelector("#emptyCart");
const itemHeading = document.querySelector("#itemHeading");
const headerCartCount = document.querySelector("#headerCartCount");
const summaryItemCount = document.querySelector("#summaryItemCount");
const subtotal = document.querySelector("#subtotal");
const total = document.querySelector("#total");
const checkoutLink = document.querySelector("#checkoutLink");
const toast = document.querySelector("#toast");

let cart = [];
let currentUser = null;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2600);
}

function money(amount) {
  return `$${Number(amount).toFixed(2)}`;
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

async function loadCart() {
  currentUser = await requireAuth();

  if (!currentUser) {
    return;
  }

  const { data, error } = await supabaseClient
    .from("cart")
    .select(`
      id,
      quantity,
      listing_id,
      listings (
        id,
        title,
        price,
        condition,
        category,
        image_url,
        location,
        seller_id,
        profiles (
          full_name
        )
      )
    `)
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load cart:", error);
    showToast("Could not load your cart.");
    return;
  }

  cart = data
    .filter((entry) => entry.listings)
    .map((entry) => ({
      cartId: entry.id,
      id: entry.listings.id,
      title: entry.listings.title,
      price: Number(entry.listings.price),
      qty: entry.quantity,
      image:
        entry.listings.image_url ||
        "assets/images/backpack.jpg",
      condition: entry.listings.condition || "",
      category: entry.listings.category || "",
      location: entry.listings.location || "TTU",
      seller:
        entry.listings.profiles?.full_name ||
        "TTU Student",
      sellerInitials: getInitials(
        entry.listings.profiles?.full_name
      )
    }));

  renderCart();
}

function renderCart() {
  cartItems.innerHTML = cart
    .map(
      (item) => `
        <article
          class="cart-item"
          data-cart-id="${item.cartId}"
          data-id="${item.id}"
          data-price="${item.price}"
        >

          <a
            class="product-image"
            href="product.html?id=${item.id}"
          >
            <img
              src="${escapeHTML(item.image)}"
              alt="${escapeHTML(item.title)}"
            >
          </a>

          <div class="product-info">

            <div class="product-tags">
              <span>
                ${escapeHTML(item.condition).toUpperCase()}
              </span>

              <small>
                ${escapeHTML(item.category).toUpperCase()}
              </small>
            </div>

            <a href="product.html?id=${item.id}">
              <h2>${escapeHTML(item.title)}</h2>
            </a>

            <p>
              Seller:
              ${escapeHTML(item.seller)}
              <b>✓</b>
            </p>

            <div class="pickup-line">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z"
                />
                <circle cx="12" cy="9" r="2.3"/>
              </svg>

              ${escapeHTML(item.location)}
            </div>

            <div class="item-actions">
              <button
                class="save-item"
                type="button"
              >
                ♡ Save for later
              </button>

              <button
                class="remove-item"
                type="button"
              >
                Remove
              </button>
            </div>

          </div>

          <div class="item-price-column">

            <strong class="line-price">
              ${money(item.price * item.qty)}
            </strong>

            <div
              class="quantity-control"
              aria-label="${escapeHTML(item.title)} quantity"
            >

              <button
                class="decrease"
                type="button"
                aria-label="Decrease quantity"
              >
                −
              </button>

              <output class="quantity">
                ${item.qty}
              </output>

              <button
                class="increase"
                type="button"
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>
          </div>

        </article>
      `
    )
    .join("");

  updateCartSummary();
}

function updateCartSummary() {
  let count = 0;
  let amount = 0;

  cart.forEach((item) => {
    count += item.qty;
    amount += item.qty * item.price;
  });

  headerCartCount.textContent = count;
  summaryItemCount.textContent = count;

  itemHeading.textContent =
    `${count} item${count === 1 ? "" : "s"}`;

  subtotal.textContent = money(amount);
  total.textContent = money(amount);

  cartLayout.classList.toggle(
    "hidden",
    cart.length === 0
  );

  emptyCart.classList.toggle(
    "hidden",
    cart.length !== 0
  );

  if (cart.length === 1) {
    checkoutLink.href =
      `payment.html?id=${cart[0].id}&qty=${cart[0].qty}`;
  } else {
    checkoutLink.href =
      "payment.html?from=cart";
  }
}

async function updateQuantity(cartId, quantity) {
  const { error } = await supabaseClient
    .from("cart")
    .update({
      quantity: quantity
    })
    .eq("id", cartId)
    .eq("user_id", currentUser.id);

  if (error) {
    console.error("Quantity update error:", error);
    showToast("Could not update quantity.");
    return false;
  }

  return true;
}

async function removeFromCart(cartId) {
  const { error } = await supabaseClient
    .from("cart")
    .delete()
    .eq("id", cartId)
    .eq("user_id", currentUser.id);

  if (error) {
    console.error("Remove cart error:", error);
    showToast("Could not remove item.");
    return false;
  }

  return true;
}

cartItems.addEventListener("click", async (event) => {
  const card = event.target.closest(".cart-item");

  if (!card) {
    return;
  }

  const cartId = Number(card.dataset.cartId);

  const entry = cart.find(
    (item) => item.cartId === cartId
  );

  if (!entry) {
    return;
  }

  // Increase quantity
  if (event.target.closest(".increase")) {
    if (entry.qty >= 5) {
      showToast("Maximum quantity is 5.");
      return;
    }

    const newQuantity = entry.qty + 1;

    const success = await updateQuantity(
      entry.cartId,
      newQuantity
    );

    if (success) {
      entry.qty = newQuantity;
      renderCart();
    }

    return;
  }

  // Decrease quantity
  if (event.target.closest(".decrease")) {
    if (entry.qty <= 1) {
      return;
    }

    const newQuantity = entry.qty - 1;

    const success = await updateQuantity(
      entry.cartId,
      newQuantity
    );

    if (success) {
      entry.qty = newQuantity;
      renderCart();
    }

    return;
  }

  // Remove item
  if (event.target.closest(".remove-item")) {
    const success =
      await removeFromCart(entry.cartId);

    if (success) {
      cart = cart.filter(
        (item) => item.cartId !== entry.cartId
      );

      renderCart();

      showToast(
        "Item removed from your cart."
      );
    }

    return;
  }

// Save for later
if (event.target.closest(".save-item")) {

  // Check if this listing is already saved
  const { data: existingSaved, error: checkError } =
    await supabaseClient
      .from("saved_items")
      .select("id")
      .eq("user_id", currentUser.id)
      .eq("listing_id", entry.id)
      .maybeSingle();

  if (checkError) {
    console.error("Saved item check error:", checkError);
    showToast("Could not save item.");
    return;
  }

  // Only insert if it is not already saved
  if (!existingSaved) {
    const { error: saveError } =
      await supabaseClient
        .from("saved_items")
        .insert({
          user_id: currentUser.id,
          listing_id: entry.id
        });

    if (saveError) {
      console.error("Save item error:", saveError);
      showToast("Could not save item.");
      return;
    }
  }

  // Remove the item from the cart
  const success =
    await removeFromCart(entry.cartId);

  if (!success) {
    showToast(
      "Item was saved, but could not be removed from cart."
    );
    return;
  }

  // Remove it from the page
  cart = cart.filter(
    (item) => item.cartId !== entry.cartId
  );

  renderCart();

  showToast("Item moved to your saved listings.");

  return;
}
});

loadCart();