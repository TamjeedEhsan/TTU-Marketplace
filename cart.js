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

function getCart() {
  return JSON.parse(localStorage.getItem("ttuCart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("ttuCart", JSON.stringify(cart));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 2600);
}

function money(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

function renderCart() {
  const cart = getCart();

  cartItems.innerHTML = cart
    .map((item) => `
      <article class="cart-item" data-id="${item.id}" data-price="${item.price}">
        <a class="product-image" href="product.html?id=${item.id}">
          <img src="${item.image}" alt="${item.title}">
        </a>
        <div class="product-info">
          <div class="product-tags">
            <span>${item.condition.toUpperCase()}</span>
            <small>${item.category.toUpperCase()}</small>
          </div>
          <a href="product.html?id=${item.id}"><h2>${item.title}</h2></a>
          <p>Seller: ${item.seller} <b>✓</b></p>
          <div class="pickup-line">
            <svg viewBox="0 0 24 24"><path d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.3"/></svg>
            TTU campus meetup
          </div>
          <div class="item-actions">
            <button class="save-item" type="button">♡ Save for later</button>
            <button class="remove-item" type="button">Remove</button>
          </div>
        </div>
        <div class="item-price-column">
          <strong class="line-price">${money(item.price * item.qty)}</strong>
          <div class="quantity-control" aria-label="${item.title} quantity">
            <button class="decrease" type="button" aria-label="Decrease quantity">−</button>
            <output class="quantity">${item.qty}</output>
            <button class="increase" type="button" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </article>
    `)
    .join("");

  updateCart();
}

function updateCart() {
  const cart = getCart();
  let count = 0;
  let amount = 0;

  cart.forEach((item) => {
    count += item.qty;
    amount += item.qty * item.price;
  });

  headerCartCount.textContent = count;
  summaryItemCount.textContent = count;
  itemHeading.textContent = `${count} item${count === 1 ? "" : "s"}`;
  subtotal.textContent = money(amount);
  total.textContent = money(amount);
  cartLayout.classList.toggle("hidden", cart.length === 0);
  emptyCart.classList.toggle("hidden", cart.length !== 0);

  if (cart.length === 1) {
    checkoutLink.href = `payment.html?id=${cart[0].id}&qty=${cart[0].qty}`;
  } else {
    checkoutLink.href = "payment.html?from=cart";
  }
}

cartItems.addEventListener("click", (event) => {
  const card = event.target.closest(".cart-item");
  if (!card) {
    return;
  }

  const cart = getCart();
  const id = Number(card.dataset.id);
  const entry = cart.find((item) => item.id === id);
  if (!entry) {
    return;
  }

  if (event.target.closest(".increase")) {
    entry.qty = Math.min(5, entry.qty + 1);
    saveCart(cart);
    renderCart();
  }

  if (event.target.closest(".decrease")) {
    entry.qty = Math.max(1, entry.qty - 1);
    saveCart(cart);
    renderCart();
  }

  if (event.target.closest(".remove-item")) {
    saveCart(cart.filter((item) => item.id !== id));
    renderCart();
    showToast("Item removed from your cart.");
  }

  if (event.target.closest(".save-item")) {
    const favorites = new Set(JSON.parse(localStorage.getItem("ttuFavorites") || "[]"));
    favorites.add(id);
    localStorage.setItem("ttuFavorites", JSON.stringify([...favorites]));
    saveCart(cart.filter((item) => item.id !== id));
    renderCart();
    showToast("Item moved to your saved listings.");
  }
});

renderCart();
