const form = document.querySelector("#paymentForm");
const methods = [...document.querySelectorAll(".method")];
const cardFields = document.querySelector("#cardFields");
const meetupFields = document.querySelector("#meetupFields");
const payButtonText = document.querySelector("#payButtonText");
const toast = document.querySelector("#toast");

const params = new URLSearchParams(window.location.search);
const storedCheckout = JSON.parse(sessionStorage.getItem("ttuCheckout") || "{}");
const userListings = JSON.parse(localStorage.getItem("ttuUserListings") || "[]");
const catalog = [...userListings, ...products];
const cart = JSON.parse(localStorage.getItem("ttuCart") || "[]");
const fromCart = params.get("from") === "cart" && cart.length > 0;

function catalogItem(id) {
  return catalog.find((entry) => entry.id === Number(id));
}

function checkoutLines() {
  if (fromCart) {
    return cart.map((entry) => {
      const listing = catalogItem(entry.id) || entry;
      return {
        id: entry.id,
        title: entry.title || listing.detailTitle || listing.title,
        price: Number(entry.price),
        qty: Number(entry.qty),
        image: entry.image || listing.image,
        condition: entry.condition || listing.condition,
        seller: entry.seller || (listing.seller && listing.seller.name) || "TTU Student"
      };
    });
  }

  const checkoutId = Number(params.get("id") || storedCheckout.id || 1);
  const checkoutQty = Math.max(1, Number(params.get("qty") || storedCheckout.qty || 1));
  const listing = catalogItem(checkoutId) || products[0];
  return [{
    id: listing.id,
    title: listing.detailTitle || listing.title,
    price: Number(listing.price),
    qty: checkoutQty,
    image: listing.images && listing.images[0] ? listing.images[0].src : listing.image,
    condition: listing.condition,
    seller: listing.seller ? listing.seller.name : "TTU Student"
  }];
}

const lines = checkoutLines();
const checkoutTotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0).toFixed(2);
const firstLine = lines[0];

document.querySelector("#backLink").href = fromCart ? "cart.html" : `product.html?id=${firstLine.id}`;
document.querySelector("#editLink").href = fromCart ? "cart.html" : `product.html?id=${firstLine.id}`;
document.querySelector("#orderItems").innerHTML = lines
  .map((line) => `
    <div class="order-item">
      <img src="${line.image}" alt="${line.title}">
      <div>
        <h3>${line.title}</h3>
        <p>${line.condition} · Quantity ${line.qty}</p>
        <small>Seller: ${line.seller}</small>
      </div>
      <strong>$${(line.price * line.qty).toFixed(2)}</strong>
    </div>
  `)
  .join("");
document.querySelector("#subtotalAmount").textContent = `$${checkoutTotal}`;
document.querySelector("#totalAmount").textContent = `$${checkoutTotal}`;
payButtonText.textContent = `Pay $${checkoutTotal}`;

const fields = {
  cardName: document.querySelector("#cardName"),
  cardNumber: document.querySelector("#cardNumber"),
  expiry: document.querySelector("#expiry"),
  cvv: document.querySelector("#cvv"),
  zipCode: document.querySelector("#zipCode")
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 3000);
}

function selectedMethod() {
  return document.querySelector('input[name="paymentMethod"]:checked').value;
}

methods.forEach(method => {
  method.addEventListener("click", () => {
    methods.forEach(item => item.classList.remove("selected"));
    method.classList.add("selected");
    const isCard = selectedMethod() === "card";
    cardFields.classList.toggle("hidden", !isCard);
    meetupFields.classList.toggle("hidden", isCard);
    payButtonText.textContent = isCard ? `Pay $${checkoutTotal}` : "Confirm campus meetup";
  });
});

fields.cardNumber.addEventListener("input", event => {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
  event.target.value = digits.replace(/(.{4})/g, "$1 ").trim();
});

fields.expiry.addEventListener("input", event => {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
  event.target.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
});

fields.cvv.addEventListener("input", event => event.target.value = event.target.value.replace(/\D/g, ""));
fields.zipCode.addEventListener("input", event => event.target.value = event.target.value.replace(/\D/g, ""));

document.querySelector("#cvvToggle").addEventListener("click", event => {
  const hidden = fields.cvv.type === "password";
  fields.cvv.type = hidden ? "text" : "password";
  event.currentTarget.textContent = hidden ? "HIDE" : "SHOW";
});

function setError(name, message) {
  fields[name].classList.toggle("invalid", Boolean(message));
  document.querySelector(`#${name}Error`).textContent = message;
  return !message;
}

function validateCard() {
  const number = fields.cardNumber.value.replace(/\s/g, "");
  const expiryMatch = fields.expiry.value.match(/^(0[1-9]|1[0-2])\/\d{2}$/);
  return [
    setError("cardName", fields.cardName.value.trim().length < 2 ? "Enter the name shown on the card." : ""),
    setError("cardNumber", !/^\d{16}$/.test(number) ? "Enter a valid 16-digit card number." : ""),
    setError("expiry", !expiryMatch ? "Enter a valid date in MM/YY format." : ""),
    setError("cvv", !/^\d{3,4}$/.test(fields.cvv.value) ? "Enter a valid security code." : ""),
    setError("zipCode", !/^\d{5}$/.test(fields.zipCode.value) ? "Enter a valid 5-digit ZIP code." : "")
  ].every(Boolean);
}

document.querySelector("#expressButton").addEventListener("click", () => {
  showToast("Express checkout is ready to connect to a payment provider.");
});

form.addEventListener("submit", event => {
  event.preventDefault();
  const agreement = document.querySelector("#agreement");
  document.querySelector("#agreementError").textContent = agreement.checked ? "" : "Please accept the marketplace terms.";
  const detailsValid = selectedMethod() === "meetup" || validateCard();
  if (!agreement.checked || !detailsValid) return;
  showToast(selectedMethod() === "card" ? "Payment form is ready to connect to your backend." : "Campus meetup request confirmed.");
});
