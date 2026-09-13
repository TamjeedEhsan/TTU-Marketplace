const pinIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"></path>
    <circle cx="12" cy="10" r="2.2"></circle>
  </svg>
`;

const heartIcon = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 20s-7-4.4-9.2-8.2C1.2 9.2 2.2 6 5.2 5.3c1.8-.4 3.4.4 4.3 1.8C10.4 5.7 12 4.9 13.8 5.3c3 .7 4 3.9 2.4 6.5C19 15.6 12 20 12 20z"></path>
  </svg>
`;

const grid = document.getElementById("product-grid");
const countEl = document.getElementById("listing-count");
const emptyEl = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const locationSelect = document.getElementById("location-select");
const categoryButtons = document.querySelectorAll(".category-btn");
const conditionInputs = document.querySelectorAll('input[name="condition"]');
const gridViewBtn = document.getElementById("grid-view-btn");
const listViewBtn = document.getElementById("list-view-btn");
const filtersToggle = document.getElementById("filters-toggle");
const filters = document.getElementById("filters");

const favorites = new Set(JSON.parse(localStorage.getItem("ttuFavorites") || "[]"));

const state = {
  search: "",
  category: "all",
  minPrice: null,
  maxPrice: null,
  location: "all",
  conditions: [],
  sort: "newest"
};

function saveFavorites() {
  localStorage.setItem("ttuFavorites", JSON.stringify([...favorites]));
}

let products = [];

function getAllProducts() {
  return products;
}

async function loadListings() {
  const { data, error } = await supabaseClient
    .from("listings")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load listings:", error);
    emptyEl.textContent = "Could not load listings.";
    emptyEl.hidden = false;
    return;
  }

  products = data.map((item) => ({
    id: item.id,
    title: item.title,
    price: Number(item.price),
    category: item.category,
    condition: item.condition,
    location: item.location || "TTU",
    description: item.description || "",
    image: item.image_url || "assets/images/backpack.jpg",
    createdAt: item.created_at,
    time: formatListingTime(item.created_at)
  }));

  render();
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

function getFilteredProducts() {
  let list = getAllProducts().filter((item) => {
    const haystack = `${item.title} ${item.category}`.toLowerCase();
    const matchesSearch = haystack.includes(state.search);
    const matchesCategory = state.category === "all" || item.category === state.category;
    const matchesMin = state.minPrice === null || item.price >= state.minPrice;
    const matchesMax = state.maxPrice === null || item.price <= state.maxPrice;
    const matchesLocation = state.location === "all" || item.location === state.location;
    const matchesCondition =
      state.conditions.length === 0 || state.conditions.includes(item.condition);

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMin &&
      matchesMax &&
      matchesLocation &&
      matchesCondition
    );
  });

  if (state.sort === "price-asc") {
    list = list.slice().sort((a, b) => a.price - b.price);
  } else if (state.sort === "price-desc") {
    list = list.slice().sort((a, b) => b.price - a.price);
  } else {
    list = list
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return list;
}

function render() {
  const list = getFilteredProducts();
  countEl.textContent = `${list.length} listing${list.length === 1 ? "" : "s"}`;
  emptyEl.hidden = list.length > 0;
  grid.innerHTML = list
    .map((item) => {
      const saved = favorites.has(item.id);
      return `
    <a class="product-card" href="product.html?id=${Number(item.id)}">
  <div class="product-image">
    <img
      src="${escapeHTML(item.image)}"
      alt="${escapeHTML(item.title)}"
    />

    <button
      class="fav-btn${saved ? " is-active" : ""}"
      type="button"
      data-id="${Number(item.id)}"
      aria-label="Favorite ${escapeHTML(item.title)}"
    >
      ${heartIcon}
    </button>
  </div>

  <div class="product-body">
    <h3 class="product-title">${escapeHTML(item.title)}</h3>
    <p class="product-price">$${Number(item.price).toFixed(2)}</p>
    <p class="product-meta">
      ${pinIcon}
      <span>${escapeHTML(item.location)}</span>
    </p>
    <p class="product-time">${escapeHTML(item.time)}</p>
  </div>
</a>
      `;
    })
    .join("");
}

searchInput.addEventListener("input", () => {
  state.search = searchInput.value.trim().toLowerCase();
  render();
});

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    state.category = button.dataset.category;
    render();
  });
});

document.getElementById("apply-price").addEventListener("click", () => {
  const min = minPriceInput.value.trim();
  const max = maxPriceInput.value.trim();
  state.minPrice = min === "" ? null : Number(min);
  state.maxPrice = max === "" ? null : Number(max);
  render();
});

locationSelect.addEventListener("change", () => {
  state.location = locationSelect.value;
  render();
});

conditionInputs.forEach((input) => {
  input.addEventListener("change", () => {
    state.conditions = [...conditionInputs]
      .filter((box) => box.checked)
      .map((box) => box.value);
    render();
  });
});

sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  render();
});

gridViewBtn.addEventListener("click", () => {
  grid.classList.remove("is-list");
  gridViewBtn.classList.add("is-active");
  listViewBtn.classList.remove("is-active");
});

listViewBtn.addEventListener("click", () => {
  grid.classList.add("is-list");
  listViewBtn.classList.add("is-active");
  gridViewBtn.classList.remove("is-active");
});

filtersToggle.addEventListener("click", () => {
  filters.classList.toggle("is-open");
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest(".fav-btn");
  if (!button) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const id = Number(button.dataset.id);
  if (favorites.has(id)) {
    favorites.delete(id);
    button.classList.remove("is-active");
  } else {
    favorites.add(id);
    button.classList.add("is-active");
  }
  saveFavorites();
});

loadListings();
