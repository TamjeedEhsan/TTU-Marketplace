const $ = (selector, root = document) =>
  root.querySelector(selector);

const $$ = (selector, root = document) =>
  [...root.querySelectorAll(selector)];

const modal = $("#detailsModal");
const toast = $("#toast");

const listedContainer =
  $("#listed-items .item-list");

const purchasedContainer =
  $("#purchased-items .item-list");

const savedContainer =
  $("#saved-items .item-list");

function ensureSalesSection() {
  let section = $("#sales-items");

  if (!section) {
    const purchasedSection = $("#purchased-items");

    if (!purchasedSection) {
      return null;
    }

    purchasedSection.insertAdjacentHTML(
      "afterend",
      `
        <section class="profile-section" id="sales-items">
          <div class="section-heading">
            <div>
              <h2>Sales</h2>
              <p>Orders for items you have sold through TTU Marketplace.</p>
            </div>
          </div>

          <div class="item-list"></div>
        </section>
      `
    );

    section = $("#sales-items");
  }

  return $("#sales-items .item-list");
}

const salesContainer = ensureSalesSection();

let currentUser = null;
let profile = null;
let userListings = [];
let savedItems = [];
let purchases = [];
let sales = [];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("visible");
  }, 2800);
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

function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric"
    }
  );
}

function formatMemberSince(date) {
  if (!date) {
    return "TTU Marketplace member";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric"
    }
  );
}

async function loadProfile() {
  currentUser = await getCurrentUser();

  if (!currentUser) {
    window.location.href = "index.html";
    return;
  }

  const { data, error } =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

  if (error) {
    console.error(
      "Profile load error:",
      error
    );

    showToast(
      "Could not load your profile."
    );

    return;
  }

  profile = data;

  renderProfile();
}

function renderProfile() {
  const name =
    profile.full_name ||
    "TTU Student";

  const initials =
    getInitials(name);

  $(".profile-card h1").textContent =
    name;

  $(".profile-card .email").textContent =
    profile.email ||
    currentUser.email;

  $(".profile-card .profile-meta").innerHTML =
    `
      ${escapeHTML(profile.major || "Major not added")}
      <span>|</span>
      ${escapeHTML(profile.classification || "Classification not added")}
    `;

  $(".profile-card .member").textContent =
    `▣  Member since ${formatMemberSince(profile.created_at)}`;

  $(".avatar-large").textContent =
    initials;

  $(".avatar-mini").textContent =
    initials;

  $(".profile-chip span:nth-child(2)")
    .textContent = name.toUpperCase();
}

async function loadListings() {
  const { data, error } =
    await supabaseClient
      .from("listings")
      .select("*")
      .eq("seller_id", currentUser.id)
      .order(
        "created_at",
        { ascending: false }
      );

  if (error) {
    console.error(
      "Listings load error:",
      error
    );

    return;
  }

  userListings = data || [];

  renderListings();
  updateStats();
}

function renderListings() {
  if (userListings.length === 0) {
    listedContainer.innerHTML = `
      <p>
        You have not listed any items yet.
      </p>
    `;

    return;
  }

  listedContainer.innerHTML =
    userListings
      .map((item) => {
        const sold =
          item.status === "sold";

        return `
          <article
            class="item-row searchable"
            data-id="${item.id}"
            data-search="${escapeHTML(
              `${item.title} ${item.category || ""}`
            )}"
          >

            <img
              src="${escapeHTML(
                item.image_url ||
                "assets/images/backpack.jpg"
              )}"
              alt="${escapeHTML(item.title)}"
            >

            <div class="item-main">

              <h3>
                ${escapeHTML(item.title)}
              </h3>

              <strong>
                ${money(item.price)}
              </strong>

              <p>
                ▣ Listed
                ${formatDate(item.created_at)}
              </p>

            </div>

            <span
              class="status ${
                sold
                  ? "status-sold"
                  : "status-active"
              }"
            >
              ${sold ? "Sold" : "Active"}
            </span>

            <div class="item-actions">

              <a
                class="small-btn"
                href="product.html?id=${item.id}"
              >
                View
              </a>

              ${
                sold
                  ? `
                    <button
                      class="small-btn disabled-btn"
                      type="button"
                      disabled
                    >
                      ✓ Sold
                    </button>
                  `
                  : `
                    <button
                      class="small-btn mark-sold"
                      type="button"
                    >
                      ✓ Mark as Sold
                    </button>
                  `
              }

            </div>

          </article>
        `;
      })
      .join("");
}

async function loadSavedItems() {
  const { data, error } =
    await supabaseClient
      .from("saved_items")
      .select(`
        id,
        listing_id,
        listings (
          id,
          title,
          price,
          image_url,
          status,
          category,
          seller_id,
          profiles (
            full_name
          )
        )
      `)
      .eq("user_id", currentUser.id)
      .order(
        "created_at",
        { ascending: false }
      );

  if (error) {
    console.error(
      "Saved items error:",
      error
    );

    return;
  }

  savedItems =
    (data || []).filter(
      (entry) => entry.listings
    );

  renderSavedItems();
  updateStats();
}

function renderSavedItems() {
  if (savedItems.length === 0) {
    savedContainer.innerHTML = `
      <p>
        You have not saved any items yet.
      </p>
    `;

    return;
  }

  savedContainer.innerHTML =
    savedItems
      .map((entry) => {
        const item =
          entry.listings;

        const seller =
          item.profiles?.full_name ||
          "TTU Student";

        return `
          <article
            class="item-row searchable"
            data-saved-id="${entry.id}"
            data-listing-id="${item.id}"
            data-search="${escapeHTML(
              `${item.title} ${item.category || ""} ${seller}`
            )}"
          >

            <img
              src="${escapeHTML(
                item.image_url ||
                "assets/images/backpack.jpg"
              )}"
              alt="${escapeHTML(item.title)}"
            >

            <div class="item-main">

              <h3>
                ${escapeHTML(item.title)}
              </h3>

              <strong>
                ${money(item.price)}
              </strong>

              <p>
                Listed by:
                ${escapeHTML(seller)}
              </p>

            </div>

            <span
              class="status ${
                item.status === "sold"
                  ? "status-sold"
                  : "status-active"
              }"
            >
              ${
                item.status === "sold"
                  ? "Sold"
                  : "Active"
              }
            </span>

            <div class="item-actions">

              <a
                class="small-btn"
                href="product.html?id=${item.id}"
              >
                View Listing
              </a>

              <button
                class="heart-btn saved"
                type="button"
                aria-label="Remove saved item"
              >
                ♥
              </button>

            </div>

          </article>
        `;
      })
      .join("");
}

async function loadPurchases() {
  const { data, error } =
    await supabaseClient
      .from("orders")
      .select(`
        id,
        amount,
        order_status,
        created_at,
        listings (
          id,
          title,
          image_url,
          seller_id,
          profiles (
            full_name
          )
        )
      `)
      .eq("buyer_id", currentUser.id)
      .order(
        "created_at",
        { ascending: false }
      );

  if (error) {
    console.error(
      "Purchases load error:",
      error
    );

    purchases = [];
    renderPurchases();
    updateStats();
    return;
  }

  purchases = data || [];

  renderPurchases();
  updateStats();
}

function renderPurchases() {
  if (purchases.length === 0) {
    purchasedContainer.innerHTML = `
      <p>
        You have not purchased any items yet.
      </p>
    `;

    return;
  }

  purchasedContainer.innerHTML =
    purchases
      .map((order) => {
        const item =
          order.listings;

        if (!item) {
          return "";
        }

        const seller =
          item.profiles?.full_name ||
          "TTU Student";

        return `
          <article
            class="item-row searchable"
            data-search="${escapeHTML(
              `${item.title} ${seller}`
            )}"
          >

            <img
              src="${escapeHTML(
                item.image_url ||
                "assets/images/backpack.jpg"
              )}"
              alt="${escapeHTML(item.title)}"
            >

            <div class="item-main">

              <h3>
                ${escapeHTML(item.title)}
              </h3>

              <strong>
                ${money(order.amount)}
              </strong>

              <p>
                ▣ Purchased
                ${formatDate(order.created_at)}
                &nbsp; | &nbsp;
                Seller:
                ${escapeHTML(seller)}
              </p>

            </div>

            <span class="status status-complete">
              ${escapeHTML(
                order.order_status || "Pending"
              )}
            </span>

            <div class="item-actions">

              <button
                class="small-btn view-details"
                type="button"
                data-item="${escapeHTML(item.title)}"
                data-status="${escapeHTML(
                  order.order_status || "Pending"
                )}"
                data-seller="${escapeHTML(seller)}"
              >
                View Details
              </button>

            </div>

          </article>
        `;
      })
      .join("");
}

async function loadSales() {
  if (!salesContainer) {
    return;
  }

  const { data, error } =
    await supabaseClient
      .from("orders")
      .select(`
        id,
        buyer_id,
        amount,
        quantity,
        order_status,
        created_at,
        listings (
          id,
          title,
          image_url
        )
      `)
      .eq("seller_id", currentUser.id)
      .order(
        "created_at",
        { ascending: false }
      );

  if (error) {
    console.error(
      "Sales load error:",
      error
    );

    sales = [];
    renderSales();
    return;
  }

  const orders = data || [];

  const buyerIds =
    [...new Set(
      orders
        .map((order) => order.buyer_id)
        .filter(Boolean)
    )];

  let buyerNames = {};

  if (buyerIds.length > 0) {
    const {
      data: buyers,
      error: buyerError
    } =
      await supabaseClient
        .from("profiles")
        .select("id, full_name")
        .in("id", buyerIds);

    if (buyerError) {
      console.error(
        "Buyer profile load error:",
        buyerError
      );
    } else {
      buyerNames = Object.fromEntries(
        (buyers || []).map((buyer) => [
          buyer.id,
          buyer.full_name || "TTU Student"
        ])
      );
    }
  }

  sales = orders.map((order) => ({
    ...order,

    buyer_name:
      buyerNames[order.buyer_id] ||
      "TTU Student"
  }));

  renderSales();
}


function getOrderStatusLabel(status) {

  if (status === "ready") {
    return "Ready for Meetup";
  }

  if (status === "completed") {
    return "Completed";
  }

  return "Pending";
}


function renderSales() {

  if (!salesContainer) {
    return;
  }

  if (sales.length === 0) {

    salesContainer.innerHTML = `
      <p>
        You do not have any sales yet.
      </p>
    `;

    return;
  }

  salesContainer.innerHTML =
    sales
      .map((order) => {

        const item = order.listings;

        if (!item) {
          return "";
        }

        const status =
          order.order_status || "pending";

        let actionButton = "";

        if (status === "pending") {

          actionButton = `
            <button
              class="small-btn update-order-status"
              type="button"
              data-order-id="${order.id}"
              data-next-status="ready"
            >
              Ready for Meetup
            </button>
          `;

        } else if (status === "ready") {

          actionButton = `
            <button
              class="small-btn update-order-status"
              type="button"
              data-order-id="${order.id}"
              data-next-status="completed"
            >
              Mark Completed
            </button>
          `;
        }

        return `
          <article
            class="item-row searchable"
            data-order-id="${order.id}"
            data-search="${escapeHTML(
              `${item.title} ${order.buyer_name} ${status}`
            )}"
          >

            <img
              src="${escapeHTML(
                item.image_url ||
                "assets/images/backpack.jpg"
              )}"
              alt="${escapeHTML(item.title)}"
            >

            <div class="item-main">

              <h3>
                ${escapeHTML(item.title)}
              </h3>

              <strong>
                ${money(order.amount)}
              </strong>

              <p>
                Buyer:
                ${escapeHTML(order.buyer_name)}
                &nbsp; | &nbsp;
                ${formatDate(order.created_at)}
              </p>

            </div>

            <span class="status status-complete">

              ${escapeHTML(
                getOrderStatusLabel(status)
              )}

            </span>

            <div class="item-actions">

              ${actionButton}

            </div>

          </article>
        `;
      })
      .join("");
}


async function updateOrderStatus(
  orderId,
  nextStatus
) {

  const { error } =
    await supabaseClient
      .from("orders")
      .update({
        order_status: nextStatus
      })
      .eq("id", orderId)
      .eq(
        "seller_id",
        currentUser.id
      );

  if (error) {

    console.error(
      "Order status update error:",
      error
    );

    showToast(
      "Could not update the order status."
    );

    return;
  }

  const order =
    sales.find(
      (entry) =>
        entry.id === orderId
    );

  if (order) {
    order.order_status =
      nextStatus;
  }

  renderSales();

  showToast(
    nextStatus === "ready"
      ? "Order is ready for meetup."
      : "Order marked as completed."
  );
}


if (salesContainer) {

  salesContainer.addEventListener(
    "click",
    async (event) => {

      const button =
        event.target.closest(
          ".update-order-status"
        );

      if (!button) {
        return;
      }

      const orderId =
        Number(
          button.dataset.orderId
        );

      const nextStatus =
        button.dataset.nextStatus;

      button.disabled = true;

      await updateOrderStatus(
        orderId,
        nextStatus
      );
    }
  );
}

function updateStats() {
  const listed =
    userListings.length;

  const sold =
    userListings.filter(
      (item) => item.status === "sold"
    ).length;

  const active =
    userListings.filter(
      (item) => item.status === "active"
    ).length;

  const purchased =
    purchases.length;

  const saved =
    savedItems.length;

  const stats =
    $$(".stats-card .stat strong");

  if (stats[0]) {
    stats[0].textContent = listed;
  }

  if ($("#soldStat")) {
    $("#soldStat").textContent = sold;
  }

  if (stats[2]) {
    stats[2].textContent = purchased;
  }

  if ($("#activeStat")) {
    $("#activeStat").textContent = active;
  }

  if ($("#savedStat")) {
    $("#savedStat").textContent = saved;
  }
}

listedContainer.addEventListener(
  "click",
  async (event) => {
    const button =
      event.target.closest(".mark-sold");

    if (!button) {
      return;
    }

    const row =
      button.closest(".item-row");

    const listingId =
      Number(row.dataset.id);

    const { error } =
      await supabaseClient
        .from("listings")
        .update({
          status: "sold"
        })
        .eq("id", listingId)
        .eq(
          "seller_id",
          currentUser.id
        );

    if (error) {
      console.error(
        "Mark sold error:",
        error
      );

      showToast(
        "Could not mark listing as sold."
      );

      return;
    }

    const listing =
      userListings.find(
        (item) =>
          item.id === listingId
      );

    if (listing) {
      listing.status = "sold";
    }

    renderListings();
    updateStats();

    showToast(
      "Listing marked as sold."
    );
  }
);

savedContainer.addEventListener(
  "click",
  async (event) => {
    const button =
      event.target.closest(".heart-btn");

    if (!button) {
      return;
    }

    const row =
      button.closest(".item-row");

    const savedId =
      Number(row.dataset.savedId);

    const { error } =
      await supabaseClient
        .from("saved_items")
        .delete()
        .eq("id", savedId)
        .eq(
          "user_id",
          currentUser.id
        );

    if (error) {
      console.error(
        "Unsave error:",
        error
      );

      showToast(
        "Could not remove saved item."
      );

      return;
    }

    savedItems =
      savedItems.filter(
        (entry) =>
          entry.id !== savedId
      );

    renderSavedItems();
    updateStats();

    showToast(
      "Item removed from saved listings."
    );
  }
);

purchasedContainer.addEventListener(
  "click",
  (event) => {
    const button =
      event.target.closest(".view-details");

    if (!button) {
      return;
    }

    $("#modalItem").textContent =
      button.dataset.item;

    $("#modalSeller").textContent =
      `Seller: ${button.dataset.seller} • Order status: ${button.dataset.status}`;

    modal.classList.add("open");
  }
);

$(".modal-close").addEventListener(
  "click",
  () => {
    modal.classList.remove("open");
  }
);

modal.addEventListener(
  "click",
  (event) => {
    if (event.target === modal) {
      modal.classList.remove("open");
    }
  }
);

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape") {
      modal.classList.remove("open");
    }
  }
);

$("#editProfileBtn").addEventListener(
  "click",
  () => {
    showToast(
      "Edit Profile will be connected next."
    );
  }
);

$("#searchInput").addEventListener(
  "input",
  (event) => {
    const query =
      event.target.value
        .trim()
        .toLowerCase();

    $$(".searchable").forEach(
      (row) => {
        const haystack =
          `${
            row.dataset.search || ""
          } ${row.textContent}`
            .toLowerCase();

        row.classList.toggle(
          "hidden-by-search",
          Boolean(query) &&
          !haystack.includes(query)
        );
      }
    );
  }
);

async function initializeProfile() {
  await loadProfile();

  if (!currentUser) {
    return;
  }

  await Promise.all([
    loadListings(),
    loadSavedItems(),
    loadPurchases(),
    loadSales()
  ]);
}

$(".profile-chip").addEventListener("click", async () => {
  const confirmed = confirm("Do you want to log out?");

  if (!confirmed) {
    return;
  }

  await logOut();
});

initializeProfile();