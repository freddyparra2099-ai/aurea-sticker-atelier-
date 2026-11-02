/* ÁUREA · lógica compartida: carrito, formato, cabecera y vista previa */

const CART_KEY = "aurea_cart";
const FAV_KEY = "aurea_favorites";
const FREE_SHIPPING = 25;
const SHIPPING_COST = 3.95;

const STICKER_FONTS = {
  elegant: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  modern: "'Jost', 'Segoe UI', system-ui, sans-serif",
  classic: "Georgia, 'Times New Roman', serif"
};

const STICKER_COLORS = {
  gold: "#a8793f",
  ink: "#17131f",
  violet: "#5f4fd6",
  rose: "#a8576c",
  mint: "#357a6b"
};

function money(value) {
  return new Intl.NumberFormat(LANG === "es" ? "es-US" : "en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatSize(size) {
  return t("product.size" + size);
}

function formatFinish(finish) {
  return t("product." + finish);
}

/* ---------------- Carrito ---------------- */

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch (err) {
    /* almacenamiento no disponible */
  }
  updateCartBadge();
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll("[data-cart-badge]").forEach((badge) => {
    badge.textContent = count;
    badge.hidden = count === 0;
  });

  const cartBtn = document.querySelector(".cart-btn");
  if (cartBtn) {
    cartBtn.setAttribute("aria-label", count ? `${t("header.cart")} (${count})` : t("header.cart"));
  }
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find((entry) => entry.key === item.key);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  toast(t(item.type === "custom" ? "toast.customAdded" : "toast.added"));
}

function removeFromCart(index) {
  const cart = getCart();
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart(cart);
}

function setCartQty(index, qty) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].qty = Math.max(1, Math.min(99, qty));
  saveCart(cart);
}

function cartTotals(items, promo) {
  const subtotal = round2(items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0));
  const discount = promo ? round2(subtotal * 0.1) : 0;
  const after = round2(subtotal - discount);
  const shipping = items.length === 0 || after >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  return { subtotal, discount, shipping, total: round2(after + shipping) };
}

/* ---------------- Favoritos ---------------- */

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveFavorites(items) {
  try {
    localStorage.setItem(FAV_KEY, JSON.stringify(items));
  } catch (err) {
    /* almacenamiento no disponible */
  }
  updateFavBadge();
}

function favCount() {
  return getFavorites().length;
}

function isFavorite(key) {
  return getFavorites().includes(key);
}

function toggleFavorite(key) {
  const favs = getFavorites();
  const idx = favs.indexOf(key);
  if (idx >= 0) {
    favs.splice(idx, 1);
    saveFavorites(favs);
    toast(t("shop.favRemove"));
    return false;
  }
  favs.push(key);
  saveFavorites(favs);
  toast(t("shop.favAdd"));
  return true;
}

function updateFavBadge() {
  const count = favCount();
  document.querySelectorAll("[data-fav-badge]").forEach((badge) => {
    badge.textContent = count;
    badge.hidden = count === 0;
  });
}

/* ---------------- Avisos ---------------- */

let toastEl = null;
let toastTimer = null;

function toast(message) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    toastEl.setAttribute("aria-live", "polite");
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2400);
}

/* ---------------- Vista previa de pegatina ---------------- */

function stickerShape(shape) {
  if (shape === "square") {
    return '<rect x="24" y="24" width="252" height="252" rx="46" fill="#f7f1e6" stroke="#e8d8bb" stroke-width="3"/>';
  }
  if (shape === "heart") {
    return '<path d="M150 264C94 224 46 186 46 132c0-35 27-60 60-60 20 0 36 11 44 28 8-17 24-28 44-28 33 0 60 25 60 60 0 54-48 92-104 132z" fill="#f7f1e6" stroke="#e8d8bb" stroke-width="3" stroke-linejoin="round"/>';
  }
  if (shape === "star") {
    return '<path d="M150 14l34.1 89.1 95.2 4.9-74.1 59.9 24.7 92.1L150 208l-79.9 52 24.7-92.1L20.7 108l95.2-4.9z" fill="#f7f1e6" stroke="#e8d8bb" stroke-width="3" stroke-linejoin="round"/>';
  }
  return '<circle cx="150" cy="150" r="134" fill="#f7f1e6" stroke="#e8d8bb" stroke-width="3"/>';
}

function stickerLines(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const candidate = current ? current + " " + word : word;
    if (candidate.length <= 11 || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function buildStickerSVG(custom) {
  const data = custom || {};
  const lines = stickerLines(data.text);
  const display = lines.length ? lines : [t("custom.emptyPreview")];
  const isPlaceholder = lines.length === 0;
  const maxLen = Math.max(...display.map((line) => line.length), 1);
  const fontSize = Math.max(16, Math.min(44, 182 / (maxLen * 0.52)));
  const lineHeight = fontSize * 1.12;
  const startY = 150 - ((display.length - 1) * lineHeight) / 2;
  const color = isPlaceholder ? "#b6a993" : STICKER_COLORS[data.color] || STICKER_COLORS.gold;
  const font = STICKER_FONTS[data.font] || STICKER_FONTS.elegant;
  const label = data.text ? data.text : t("custom.name");

  let bgImage = "";
  if (data.image) {
    bgImage = `<image href="${escapeHtml(data.image)}" x="0" y="0" width="300" height="300" opacity="0.55" preserveAspectRatio="xMidYMid slice"/>`;
  }

  const text = display
    .map((line, index) => {
      const y = startY + index * lineHeight;
      return `<text x="150" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-family="${font}" font-size="${fontSize.toFixed(1)}" font-weight="600" letter-spacing="0.5" fill="${color}">${escapeHtml(line)}</text>`;
    })
    .join("");

  return `<svg class="sticker-svg" viewBox="0 0 300 300" role="img" aria-label="${escapeHtml(label)}">${bgImage}${stickerShape(data.shape)}${text}</svg>`;
}

/* ---------------- Tarjetas de producto ---------------- */

function productCard(product) {
  const name = product.name[LANG];
  const badgeText = product.badge
    ? t(product.badge === "new" ? "product.badgeNew" : "product.badgeTop")
    : "";
  const badge = badgeText ? `<span class="card-badge">${badgeText}</span>` : "";
  const mediaLabel = badgeText ? `${name} · ${badgeText}` : name;
  return `<article class="card" style="--accent:${product.accent}">
    <a class="card-media" href="producto.html?id=${product.id}" aria-label="${escapeHtml(mediaLabel)}">
      ${badge}
      <img src="${product.img}" alt="${escapeHtml(name)}" loading="lazy">
    </a>
    <div class="card-body">
      <span class="card-cat">${t("shop." + product.cat)}</span>
      <a class="card-name" href="producto.html?id=${product.id}">${escapeHtml(name)}</a>
      <div class="card-foot">
        <span class="card-price"><small>${t("shop.from")}</small> ${money(priceFor(product.price, "S", "matte"))}</span>
        <button class="card-add" type="button" data-add="${product.id}" aria-label="${t("shop.add")} · ${escapeHtml(name)}">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="card-fav" type="button" data-fav="${product.id}" aria-label="${isFavorite(`p:${product.id}:M:matte`) ? t("shop.favRemove") : t("shop.favAdd")}" aria-pressed="${isFavorite(`p:${product.id}:M:matte`)}">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78 19 19 0 0 0 2.16 2.16c1.04 1.04 2.4 1.6 3.77 1.6 1.37 0 2.73-.56 3.77-1.6a19 19 0 0 0 2.16-2.16 5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

/* ---------------- Cabecera ---------------- */

function initHeader() {
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    const syncLabel = () => {
      const code = LANG === "es" ? "EN" : "ES";
      const label = `${t("header.lang")} (${code})`;
      langBtn.textContent = code;
      langBtn.setAttribute("aria-label", label);
      langBtn.setAttribute("title", label);
    };
    syncLabel();
    langBtn.addEventListener("click", () => setLang(LANG === "es" ? "en" : "es"));
    document.addEventListener("langchange", syncLabel);
  }

  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  if (menuBtn && mobileNav) {
    const closeMenu = () => {
      mobileNav.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    };
    menuBtn.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  updateCartBadge();
  updateFavBadge();
  window.addEventListener("storage", (event) => {
    if (event.key === CART_KEY) updateCartBadge();
    if (event.key === FAV_KEY) updateFavBadge();
  });

  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-fav]");
    if (!btn) return;
    const key = btn.getAttribute("data-fav");
    const active = toggleFavorite(`p:${key}:M:matte`);
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
    btn.setAttribute("aria-label", active ? t("shop.favRemove") : t("shop.favAdd"));
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const payBadge = document.getElementById("paymentBadge");
  if (payBadge) {
    const syncPayment = () => {
      const live = typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.checkoutMode === "live";
      payBadge.textContent = t(live ? "footer.paymentLive" : "footer.demo");
    };
    syncPayment();
    document.addEventListener("langchange", syncPayment);
  }

  document.addEventListener("langchange", updateCartBadge);
}

document.addEventListener("DOMContentLoaded", () => {
  applyI18n();
  initHeader();
});
