/* ÁUREA · carrito y checkout de demostración */

const PROMO_CODE = "AUREA10";
let promoActive = false;

try {
  promoActive = sessionStorage.getItem("aurea_promo") === "1";
} catch (err) {
  promoActive = false;
}

function cartItemHTML(item, index) {
  let thumb = "";
  let title = "";
  let options = "";

  if (item.type === "custom") {
    thumb = buildStickerSVG(item.custom);
    title = escapeHtml(t("custom.name"));
    options = `<span class="cart-custom-text">“${escapeHtml(item.custom.text)}”</span> · ${formatSize(item.options.size)} · ${formatFinish(item.options.finish)}`;
  } else {
    const product = productById(item.id);
    if (!product) return "";
    const name = product.name[LANG];
    thumb = `<img src="${product.img}" alt="${escapeHtml(name)}">`;
    title = `<a href="producto.html?id=${product.id}">${escapeHtml(name)}</a>`;
    options = `${formatSize(item.options.size)} · ${formatFinish(item.options.finish)}`;
  }

  return `<article class="cart-item">
    <div class="cart-thumb">${thumb}</div>
    <div class="cart-info">
      <h2>${title}</h2>
      <p class="cart-opts">${options}</p>
      <button class="cart-remove" type="button" data-act="remove" data-index="${index}">${t("cart.remove")}</button>
    </div>
    <div class="cart-side">
      <span class="cart-line-price">${money(round2(item.unitPrice * item.qty))}</span>
      <div class="cart-qty" role="group" aria-label="${t("cart.qty")}">
        <button type="button" data-act="minus" data-index="${index}" aria-label="−">−</button>
        <span>${item.qty}</span>
        <button type="button" data-act="plus" data-index="${index}" aria-label="+">+</button>
      </div>
    </div>
  </article>`;
}

function renderCart() {
  const cart = getCart();
  const content = document.getElementById("cartContent");
  const empty = document.getElementById("cartEmpty");
  const list = document.getElementById("cartList");
  if (!content || !empty || !list) return;

  const hasItems = cart.length > 0;
  content.hidden = !hasItems;
  empty.hidden = hasItems;

  if (!hasItems) {
    updateCartBadge();
    return;
  }

  list.innerHTML = cart.map(cartItemHTML).join("");

  const totals = cartTotals(cart, promoActive);
  const subtotal = document.getElementById("subtotal");
  const shipping = document.getElementById("shipping");
  const total = document.getElementById("total");
  const discountRow = document.getElementById("discountRow");
  const discount = document.getElementById("discount");
  const freeShip = document.getElementById("freeShip");
  const promoInput = document.getElementById("promoInput");

  if (subtotal) subtotal.textContent = money(totals.subtotal);
  if (shipping) shipping.textContent = totals.shipping === 0 ? t("cart.free") : money(totals.shipping);
  if (total) total.textContent = money(totals.total);
  if (discountRow) discountRow.hidden = !promoActive;
  if (discount) discount.textContent = `−${money(totals.discount)}`;
  if (promoInput && promoActive) promoInput.value = PROMO_CODE;

  if (freeShip) {
    const afterDiscount = round2(totals.subtotal - totals.discount);
    if (afterDiscount >= FREE_SHIPPING) {
      freeShip.textContent = t("cart.freeShipOk");
      freeShip.classList.add("is-ok");
    } else {
      freeShip.textContent = t("cart.freeShipNote").replace("{x}", money(round2(FREE_SHIPPING - afterDiscount)));
      freeShip.classList.remove("is-ok");
    }
  }

  updateCartBadge();
}

function applyPromo() {
  const input = document.getElementById("promoInput");
  if (!input) return;
  if (input.value.trim().toUpperCase() === PROMO_CODE) {
    promoActive = true;
    try {
      sessionStorage.setItem("aurea_promo", "1");
    } catch (err) {
      /* ignorar */
    }
    toast(t("cart.promoOk"));
    renderCart();
  } else {
    toast(t("cart.promoBad"));
  }
}

async function startLiveCheckout(button) {
  const original = button.textContent;
  const config = typeof SITE_CONFIG !== "undefined" ? SITE_CONFIG : {};
  button.disabled = true;
  button.textContent = t("cart.redirecting");

  try {
    const response = await fetch(config.checkoutEndpoint || "/.netlify/functions/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: getCart(), promo: promoActive, lang: LANG })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.url) {
      throw new Error(data.error || "HTTP " + response.status);
    }
    window.location.assign(data.url);
  } catch (err) {
    toast(t("cart.payError"));
    button.disabled = false;
    button.textContent = original;
  }
}

let payState = "";

function renderPayBanner() {
  const banner = document.getElementById("payBanner");
  if (!banner || !payState) return;
  banner.classList.remove("is-ok", "is-warn");
  if (payState === "ok") {
    banner.textContent = t("cart.paySuccess");
    banner.classList.add("is-ok");
  } else {
    banner.textContent = t("cart.payCancel");
    banner.classList.add("is-warn");
  }
  banner.hidden = false;
}

function handlePaymentReturn() {
  const params = new URLSearchParams(window.location.search);
  const state = params.get("pago");
  if (state !== "ok" && state !== "cancelado") return;

  payState = state;
  if (state === "ok") {
    saveCart([]);
    promoActive = false;
    try {
      sessionStorage.removeItem("aurea_promo");
    } catch (err) {
      /* ignorar */
    }
  }

  const clean = window.location.pathname.split("/").pop() || "carrito.html";
  history.replaceState(null, "", clean);
  renderPayBanner();
}

function initCartEvents() {
  const list = document.getElementById("cartList");
  if (list) {
    list.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-act]");
      if (!button) return;
      const index = Number(button.getAttribute("data-index"));
      const action = button.getAttribute("data-act");
      const cart = getCart();
      if (!cart[index]) return;

      if (action === "remove") {
        removeFromCart(index);
        toast(t("toast.removed"));
        renderCart();
      } else if (action === "minus") {
        if (cart[index].qty > 1) {
          setCartQty(index, cart[index].qty - 1);
          renderCart();
        }
      } else if (action === "plus") {
        setCartQty(index, cart[index].qty + 1);
        renderCart();
      }
    });
  }

  const promoBtn = document.getElementById("promoBtn");
  if (promoBtn) promoBtn.addEventListener("click", applyPromo);

  const promoInput = document.getElementById("promoInput");
  if (promoInput) {
    promoInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        applyPromo();
      }
    });
  }

  const dialog = document.getElementById("checkoutDialog");
  const form = document.getElementById("checkoutForm");
  const success = document.getElementById("checkoutSuccess");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (checkoutBtn && dialog && form && success) {
    checkoutBtn.addEventListener("click", () => {
      if (getCart().length === 0) return;
      const live = typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.checkoutMode === "live";
      if (live) {
        startLiveCheckout(checkoutBtn);
        return;
      }
      form.hidden = false;
      success.classList.remove("is-visible");
      if (!dialog.open) dialog.showModal();
    });

    dialog.querySelectorAll("[data-close]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const year = new Date().getFullYear().toString().slice(2);
      const code = `AUR-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderCode = document.getElementById("orderCode");
      if (orderCode) orderCode.textContent = code;

      form.hidden = true;
      success.classList.add("is-visible");
      form.reset();

      saveCart([]);
      promoActive = false;
      try {
        sessionStorage.removeItem("aurea_promo");
      } catch (err) {
        /* ignorar */
      }
      renderCart();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handlePaymentReturn();
  renderCart();
  initCartEvents();
});

document.addEventListener("langchange", () => {
  renderCart();
  if (payState) renderPayBanner();
});
