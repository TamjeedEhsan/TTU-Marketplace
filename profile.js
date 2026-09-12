const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const modal = $("#detailsModal");
const toast = $("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

$$(".view-details").forEach((button) => {
  button.addEventListener("click", () => {
    $("#modalItem").textContent = button.dataset.item;
    $("#modalSeller").textContent = `Seller: ${button.dataset.seller} • Order status: ${button.dataset.status}`;
    modal.classList.add("open");
  });
});

$(".modal-close").addEventListener("click", () => modal.classList.remove("open"));

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.classList.remove("open");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") modal.classList.remove("open");
});

$("#editProfileBtn").addEventListener("click", () => {
  showToast("Edit Profile is ready to connect to your account settings.");
});

$$(".edit-item").forEach((button) => {
  button.addEventListener("click", () => {
    const title = button.closest(".item-row").querySelector("h3").textContent;
    showToast(`Edit listing is ready to connect for “${title}.”`);
  });
});

$$(".mark-sold").forEach((button) => {
  button.addEventListener("click", () => {
    const row = button.closest(".item-row");
    const status = row.querySelector(".status");
    status.textContent = "Sold";
    status.className = "status status-sold";
    button.textContent = "✓  Sold";
    button.disabled = true;
    button.classList.add("disabled-btn");
    $("#soldStat").textContent = Number($("#soldStat").textContent) + 1;
    $("#activeStat").textContent = Math.max(0, Number($("#activeStat").textContent) - 1);
  });
});

$$(".heart-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const saved = button.classList.toggle("saved");
    button.textContent = saved ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(saved));
    let count = Number($("#savedStat").textContent);
    $("#savedStat").textContent = saved ? count + 1 : Math.max(0, count - 1);
  });
});

$("#searchInput").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  $$(".searchable").forEach((row) => {
    const haystack = `${row.dataset.search} ${row.textContent}`.toLowerCase();
    row.classList.toggle("hidden-by-search", Boolean(query) && !haystack.includes(query));
  });
});
