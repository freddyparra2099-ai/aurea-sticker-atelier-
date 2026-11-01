/* ÁUREA · detalle de producto */

const params = new URLSearchParams(window.location.search);
const requestedProduct = productById(params.get("id"));
const currentProduct = requestedProduct || PRODUCTS[0];

let selectedSize = "M";
let selectedFinish = "matte";
let selectedQty = 1;

function formatRating(value) {
  return new Intl.NumberFormat(LANG === "es" ? "es-ES" : "en-GB", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value);
}

function renderProduct() {
  const product = currentProduct;
  const name = product.name[LANG];

  document.title = `${name} · ÁUREA`;

  const notice = document.getElementById("productNotice");
  if (notice) {
    notice.hidden = !(params.has("id") && !requestedProduct);
  }

  const gallery = document.getElementById("gallery");
  if (gallery) gallery.style.setProperty("--accent", product.accent);

  const img = document.getElementById("productImg");
  if (img) {
    img.src = product.img;
    img.alt = name;
  }

  const badge = document.getElementById("productBadge");
  if (badge) {
    if (product.badge) {
      badge.hidden = false;
      badge.textContent = t(product.badge === "new" ? "product.badgeNew" : "product.badgeTop");
    } else {
      badge.hidden = true;
    }
  }

  const cat = document.getElementById("productCat");
  if (cat) cat.textContent = t("shop." + product.cat);

  const title = document.getElementById("productName");
  if (title) title.textContent = name;

  const crumb = document.getElementById("breadcrumbName");
  if (crumb) crumb.textContent = name;

  const rating = document.getElementById("ratingText");
  if (rating) {
    rating.textContent = `${formatRating(product.rating)} · ${product.reviews} ${t("product.rating")}`;
  }

  const desc = document.getElementById("productDesc");
  if (desc) desc.textContent = product.desc[LANG];

  const price = document.getElementById("productPrice");
  if (price) price.textContent = money(priceFor(product.price, selectedSize, selectedFinish));

  const qtyValue = document.getElementById("qtyValue");
  if (qtyValue) qtyValue.textContent = selectedQty;

  document.querySelectorAll("[data-size]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-size") === selectedSize);
  });
  document.querySelectorAll("[data-finish]").forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute("data-finish") === selectedFinish);
  });

  const favBtn = document.getElementById("productFav");
  if (favBtn) {
    const key = `p:${currentProduct.id}:M:matte`;
    const active = isFavorite(key);
    favBtn.setAttribute("data-fav", currentProduct.id);
    favBtn.classList.toggle("is-active", active);
    favBtn.setAttribute("aria-pressed", String(active));
    favBtn.setAttribute("aria-label", active ? t("shop.favRemove") : t("shop.favAdd"));
  }
}

function renderRelated() {
  const grid = document.getElementById("relatedGrid");
  if (!grid) return;

  const related = PRODUCTS
    .filter((product) => product.id !== currentProduct.id)
    .sort((a, b) => Number(b.cat === currentProduct.cat) - Number(a.cat === currentProduct.cat))
    .slice(0, 3);

  grid.innerHTML = related.map(productCard).join("");
}

function initProduct() {
  document.querySelectorAll("[data-size]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedSize = button.getAttribute("data-size");
      renderProduct();
    });
  });

  document.querySelectorAll("[data-finish]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedFinish = button.getAttribute("data-finish");
      renderProduct();
    });
  });

  const minus = document.getElementById("qtyMinus");
  const plus = document.getElementById("qtyPlus");
  if (minus) {
    minus.addEventListener("click", () => {
      selectedQty = Math.max(1, selectedQty - 1);
      renderProduct();
    });
  }
  if (plus) {
    plus.addEventListener("click", () => {
      selectedQty = Math.min(20, selectedQty + 1);
      renderProduct();
    });
  }

  const addBtn = document.getElementById("addBtn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      addToCart({
        key: `p:${currentProduct.id}:${selectedSize}:${selectedFinish}`,
        type: "product",
        id: currentProduct.id,
        qty: selectedQty,
        unitPrice: priceFor(currentProduct.price, selectedSize, selectedFinish),
        options: { size: selectedSize, finish: selectedFinish }
      });
    });
  }

  const relatedGrid = document.getElementById("relatedGrid");
  if (relatedGrid) {
    relatedGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add]");
      if (!button) return;
      const product = productById(button.getAttribute("data-add"));
      if (!product) return;
      addToCart({
        key: `p:${product.id}:M:matte`,
        type: "product",
        id: product.id,
        qty: 1,
        unitPrice: priceFor(product.price, "M", "matte"),
        options: { size: "M", finish: "matte" }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProduct();
  renderRelated();
  initProduct();
});

document.addEventListener("langchange", () => {
  renderProduct();
  renderRelated();
  const favBtn = document.getElementById("productFav");
  if (favBtn && favBtn.getAttribute("data-fav")) {
    const key = `p:${favBtn.getAttribute("data-fav")}:M:matte`;
    const active = isFavorite(key);
    favBtn.setAttribute("aria-label", active ? t("shop.favRemove") : t("shop.favAdd"));
    favBtn.setAttribute("aria-pressed", String(active));
  }
});
