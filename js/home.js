/* ÁUREA · portada: catálogo, personalizador teaser y newsletter */

const shopState = { cat: "all", q: "", sort: "featured" };

function visibleProducts() {
  const query = shopState.q.trim().toLowerCase();
  let list = PRODUCTS.filter((product) => {
    const matchesCat = shopState.cat === "all" || product.cat === shopState.cat;
    if (!matchesCat) return false;
    if (!query) return true;
    const haystack = [product.name.es, product.name.en, product.desc.es, product.desc.en, product.cat]
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });

  if (shopState.sort === "price-asc") {
    list = list.slice().sort((a, b) => a.price - b.price);
  } else if (shopState.sort === "price-desc") {
    list = list.slice().sort((a, b) => b.price - a.price);
  }

  return list;
}

function renderShop() {
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyState");
  if (!grid) return;

  const list = visibleProducts();
  grid.innerHTML = list.map(productCard).join("");
  if (empty) empty.hidden = list.length > 0;
}

function renderTeaser() {
  const preview = document.getElementById("teaserPreview");
  if (!preview) return;

  preview.innerHTML = `
    <span class="float-chip one">${t("product.matte")}</span>
    <span class="float-chip two">${t("product.holo")}</span>
    ${buildStickerSVG({ text: "BONITA", font: "elegant", shape: "heart", color: "gold" })}
  `;
}

function initShop() {
  const grid = document.getElementById("productGrid");
  const search = document.getElementById("searchInput");
  const sort = document.getElementById("sortSelect");
  const chips = document.querySelectorAll(".chip[data-cat]");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      shopState.cat = chip.getAttribute("data-cat");
      chips.forEach((other) => other.classList.toggle("is-active", other === chip));
      renderShop();
    });
  });

  if (search) {
    search.addEventListener("input", () => {
      shopState.q = search.value;
      renderShop();
    });
  }

  if (sort) {
    sort.addEventListener("change", () => {
      shopState.sort = sort.value;
      renderShop();
    });
  }

  if (grid) {
    grid.addEventListener("click", (event) => {
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

function initNewsletter() {
  const form = document.getElementById("newsletterForm");
  if (!form) return;

  const email = document.getElementById("newsletterEmail");
  const consent = document.getElementById("newsletterConsent");
  const status = document.getElementById("newsletterStatus");
  const button = form.querySelector('button[type="submit"]');

  const setStatus = (message, kind) => {
    if (!status) {
      if (message) toast(message);
      return;
    }
    status.textContent = message || "";
    status.hidden = !message;
    status.classList.remove("is-ok", "is-error", "is-warn");
    if (kind) status.classList.add("is-" + kind);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!email || !email.checkValidity()) {
      if (email) email.reportValidity();
      return;
    }
    if (consent && !consent.checked) {
      setStatus(t("newsletter.consentRequired"), "error");
      consent.focus();
      return;
    }

    const endpoint = (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.newsletterEndpoint) || "";
    if (!endpoint) {
      setStatus(t("newsletter.demo"), "warn");
      return;
    }

    const original = button ? button.textContent : "";
    if (button) {
      button.disabled = true;
      button.textContent = t("newsletter.sending");
    }
    setStatus("", null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email: email.value.trim(),
          consent: "yes",
          _subject: "ÁUREA · Newsletter"
        })
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      form.reset();
      if (consent) consent.checked = false;
      setStatus(t("newsletter.ok"), "ok");
    } catch (err) {
      setStatus(t("newsletter.error"), "error");
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = original;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderShop();
  renderTeaser();
  initShop();
  initNewsletter();
});

document.addEventListener("langchange", () => {
  renderShop();
  renderTeaser();
});
