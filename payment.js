const form = document.querySelector("#paymentForm");

const methods = [
  ...document.querySelectorAll(".method")
];

const cardFields =
  document.querySelector("#cardFields");

const meetupFields =
  document.querySelector("#meetupFields");

const payButtonText =
  document.querySelector("#payButtonText");

const toast =
  document.querySelector("#toast");

const params =
  new URLSearchParams(window.location.search);

const storedCheckout = JSON.parse(
  sessionStorage.getItem("ttuCheckout") || "{}"
);

const fields = {
  cardName: document.querySelector("#cardName"),
  cardNumber: document.querySelector("#cardNumber"),
  expiry: document.querySelector("#expiry"),
  cvv: document.querySelector("#cvv"),
  zipCode: document.querySelector("#zipCode")
};

let currentUser = null;
let lines = [];
let fromCart = false;
let checkoutTotal = 0;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 3000);
}

function selectedMethod() {
  return document.querySelector(
    'input[name="paymentMethod"]:checked'
  ).value;
}

function money(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

async function loadCheckout() {
  currentUser = await getCurrentUser();

  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  fromCart =
    params.get("from") === "cart";

  if (fromCart) {
    await loadCartCheckout();
  } else {
    await loadSingleCheckout();
  }

  renderCheckout();
}

async function loadCartCheckout() {
  const { data, error } =
    await supabaseClient
      .from("cart")
      .select(`
        quantity,
        listings (
          id,
          title,
          price,
          condition,
          image_url,
          location,
          status,
          seller_id,
          profiles (
            full_name
          )
        )
      `)
      .eq("user_id", currentUser.id)
      .order("created_at", {
        ascending: false
      });

  if (error) {
    console.error(
      "Cart checkout load error:",
      error
    );

    showToast(
      "Could not load your cart."
    );

    return;
  }

  lines = (data || [])
    .filter(
      (entry) =>
        entry.listings &&
        entry.listings.status === "active"
    )
    .map((entry) => ({
      id: entry.listings.id,
      title: entry.listings.title,
      price: Number(entry.listings.price),
      qty: Number(entry.quantity),
      image:
        entry.listings.image_url ||
        "assets/images/backpack.jpg",
      condition:
        entry.listings.condition || "",
      location:
        entry.listings.location || "TTU",
      seller:
        entry.listings.profiles?.full_name ||
        "TTU Student"
    }));
}

async function loadSingleCheckout() {
  const checkoutId = Number(
    params.get("id") ||
    storedCheckout.id
  );

  const checkoutQty = Math.max(
    1,
    Math.min(
      5,
      Number(
        params.get("qty") ||
        storedCheckout.qty ||
        1
      )
    )
  );

  if (!checkoutId) {
    showToast(
      "No listing selected for checkout."
    );

    return;
  }

  const { data, error } =
    await supabaseClient
      .from("listings")
      .select(`
        id,
        title,
        price,
        condition,
        image_url,
        location,
        status,
        seller_id,
        profiles (
          full_name
        )
      `)
      .eq("id", checkoutId)
      .single();

  if (
    error ||
    !data ||
    data.status !== "active"
  ) {
    console.error(
      "Listing checkout load error:",
      error
    );

    showToast(
      "This listing is no longer available."
    );

    return;
  }

  lines = [
    {
      id: data.id,
      title: data.title,
      price: Number(data.price),
      qty: checkoutQty,
      image:
        data.image_url ||
        "assets/images/backpack.jpg",
      condition:
        data.condition || "",
      location:
        data.location || "TTU",
      seller:
        data.profiles?.full_name ||
        "TTU Student"
    }
  ];
}

function renderCheckout() {
  if (lines.length === 0) {
    document.querySelector(
      "#orderItems"
    ).innerHTML = `
      <p>No items available for checkout.</p>
    `;

    document.querySelector(
      "#payButton"
    ).disabled = true;

    return;
  }

  checkoutTotal = lines.reduce(
    (sum, line) =>
      sum +
      line.price * line.qty,
    0
  );

  const firstLine = lines[0];

  document.querySelector(
    "#backLink"
  ).href =
    fromCart
      ? "cart.html"
      : `product.html?id=${firstLine.id}`;

  document.querySelector(
    "#editLink"
  ).href =
    fromCart
      ? "cart.html"
      : `product.html?id=${firstLine.id}`;

  document.querySelector(
    "#orderItems"
  ).innerHTML = lines
    .map(
      (line) => `
        <div class="order-item">

          <img
            src="${escapeHTML(line.image)}"
            alt="${escapeHTML(line.title)}"
          >

          <div>
            <h3>
              ${escapeHTML(line.title)}
            </h3>

            <p>
              ${escapeHTML(line.condition)}
              · Quantity ${line.qty}
            </p>

            <small>
              Seller:
              ${escapeHTML(line.seller)}
            </small>
          </div>

          <strong>
            ${money(
              line.price * line.qty
            )}
          </strong>

        </div>
      `
    )
    .join("");

  document.querySelector(
    "#subtotalAmount"
  ).textContent =
    money(checkoutTotal);

  document.querySelector(
    "#totalAmount"
  ).textContent =
    money(checkoutTotal);

  updatePayButtonText();
}

function updatePayButtonText() {
  const isCard =
    selectedMethod() === "card";

  payButtonText.textContent =
    isCard
      ? `Pay ${money(checkoutTotal)}`
      : "Confirm campus meetup";
}

methods.forEach((method) => {
  method.addEventListener(
    "click",
    () => {
      methods.forEach((item) =>
        item.classList.remove(
          "selected"
        )
      );

      method.classList.add(
        "selected"
      );

      const isCard =
        selectedMethod() === "card";

      cardFields.classList.toggle(
        "hidden",
        !isCard
      );

      meetupFields.classList.toggle(
        "hidden",
        isCard
      );

      updatePayButtonText();
    }
  );
});

fields.cardNumber.addEventListener(
  "input",
  (event) => {
    const digits =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 16);

    event.target.value =
      digits
        .replace(
          /(.{4})/g,
          "$1 "
        )
        .trim();
  }
);

fields.expiry.addEventListener(
  "input",
  (event) => {
    const digits =
      event.target.value
        .replace(/\D/g, "")
        .slice(0, 4);

    event.target.value =
      digits.length > 2
        ? `${digits.slice(
            0,
            2
          )}/${digits.slice(2)}`
        : digits;
  }
);

fields.cvv.addEventListener(
  "input",
  (event) => {
    event.target.value =
      event.target.value.replace(
        /\D/g,
        ""
      );
  }
);

fields.zipCode.addEventListener(
  "input",
  (event) => {
    event.target.value =
      event.target.value.replace(
        /\D/g,
        ""
      );
  }
);

document
  .querySelector("#cvvToggle")
  .addEventListener(
    "click",
    (event) => {
      const hidden =
        fields.cvv.type === "password";

      fields.cvv.type =
        hidden
          ? "text"
          : "password";

      event.currentTarget.textContent =
        hidden
          ? "HIDE"
          : "SHOW";
    }
  );

function setError(
  name,
  message
) {
  fields[name].classList.toggle(
    "invalid",
    Boolean(message)
  );

  document.querySelector(
    `#${name}Error`
  ).textContent =
    message;

  return !message;
}

function validateCard() {
  const number =
    fields.cardNumber.value.replace(
      /\s/g,
      ""
    );

  const expiryMatch =
    fields.expiry.value.match(
      /^(0[1-9]|1[0-2])\/\d{2}$/
    );

  return [
    setError(
      "cardName",
      fields.cardName.value.trim()
        .length < 2
        ? "Enter the name shown on the card."
        : ""
    ),

    setError(
      "cardNumber",
      !/^\d{16}$/.test(number)
        ? "Enter a valid 16-digit card number."
        : ""
    ),

    setError(
      "expiry",
      !expiryMatch
        ? "Enter a valid date in MM/YY format."
        : ""
    ),

    setError(
      "cvv",
      !/^\d{3,4}$/.test(
        fields.cvv.value
      )
        ? "Enter a valid security code."
        : ""
    ),

    setError(
      "zipCode",
      !/^\d{5}$/.test(
        fields.zipCode.value
      )
        ? "Enter a valid 5-digit ZIP code."
        : ""
    )
  ].every(Boolean);
}

document
  .querySelector(
    "#expressButton"
  )
  .addEventListener(
    "click",
    () => {
      showToast(
        "Express checkout is not enabled in this demo."
      );
    }
  );

async function completeOrder() {
  const payButton =
    document.querySelector(
      "#payButton"
    );

  payButton.disabled = true;

  payButtonText.textContent =
    "Processing...";

  for (const line of lines) {
    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "complete_purchase",
        {
          p_listing_id: line.id,
          p_quantity: line.qty
        }
      );

    if (error) {
      console.error(
        "Purchase error:",
        error
      );

      showToast(
        error.message ||
        "Could not complete purchase."
      );

      payButton.disabled = false;

      updatePayButtonText();

      return;
    }

    console.log(
      "Order created:",
      data
    );
  }

  sessionStorage.removeItem(
    "ttuCheckout"
  );

  showToast(
    selectedMethod() === "card"
      ? "Demo purchase completed!"
      : "Campus meetup request confirmed!"
  );

  setTimeout(() => {
    window.location.href =
      "profile.html";
  }, 900);
}

form.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    if (lines.length === 0) {
      showToast(
        "There are no items to checkout."
      );
      return;
    }

    const agreement =
      document.querySelector(
        "#agreement"
      );

    document.querySelector(
      "#agreementError"
    ).textContent =
      agreement.checked
        ? ""
        : "Please accept the marketplace terms.";

    const detailsValid =
      selectedMethod() === "meetup" ||
      validateCard();

    if (
      !agreement.checked ||
      !detailsValid
    ) {
      return;
    }

    await completeOrder();
  }
);

loadCheckout();