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

function readImageFile(file, callback) {
  const maxBytes = 2 * 1024 * 1024;
  if (file.size > maxBytes) {
    callback(new Error("La foto no puede superar 2 MB."));
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxSide = 1000;
      let width = img.width;
      let height = img.height;
      if (width > maxSide || height > maxSide) {
        if (width > height) {
          height = Math.round((height * maxSide) / width);
          width = maxSide;
        } else {
          width = Math.round((width * maxSide) / height);
          height = maxSide;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      callback(null, canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = event.target.result;
  };
  reader.onerror = () => callback(new Error("No se pudo leer la imagen."));
  reader.readAsDataURL(file);
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
    <div class="teaser-image-placeholder" style="display:flex;align-items:center;justify-content:center;width:min(100%,340px);aspect-ratio:1;background:radial-gradient(circle at 50% 45%, #FFE3E0 0%, #FFFDF5 55%, #D9F7F4 100%);border:2px solid #111111;border-radius:50%;color:#2C3E50;font-size:0.85rem;letter-spacing:0.2em;text-transform:uppercase;">
      SUBE TU FOTO
    </div>
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

const REVIEW_KEY = "aurea_reviews";

function getReviews() {
  try {
    const raw = localStorage.getItem(REVIEW_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveReview(review) {
  const reviews = getReviews();
  reviews.unshift(review);
  try {
    localStorage.setItem(REVIEW_KEY, JSON.stringify(reviews));
  } catch (err) {
    /* almacenamiento no disponible */
  }
  renderReviews();
}

function renderReviews() {
  const list = document.getElementById("reviewsList");
  if (!list) return;

  const reviews = getReviews();
  if (reviews.length === 0) {
    list.innerHTML = `<p class="empty-state" style="text-align:center;grid-column:1/-1">${t("reviews.empty")}</p>`;
    return;
  }

  list.innerHTML = reviews.map((r) => {
    const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
    const photo = r.photo
      ? `<img class="review-photo" src="${escapeHtml(r.photo)}" alt="Foto del sticker colocado por ${escapeHtml(r.name)}" loading="lazy">`
      : "";
    const reviewClass = r.photo ? "review review-with-photo" : "review";
    return `
      <article class="${reviewClass}">
        ${photo}
        <div class="stars" role="img" aria-label="${r.rating}/5">${stars}</div>
        <p class="review-quote">${escapeHtml(r.message)}</p>
        <div class="review-author">
          <span class="avatar" aria-hidden="true">${r.name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>${escapeHtml(r.name)}</strong>
            <span>${escapeHtml(r.email)}</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderCommunity() {
  const grid = document.getElementById("communityGrid");
  const wall = document.getElementById("communityWall");
  if (!grid || !wall) return;

  const reviews = getReviews();
  const withPhoto = reviews.filter((r) => r.photo);
  if (withPhoto.length === 0) {
    wall.hidden = true;
    return;
  }

  wall.hidden = false;
  grid.innerHTML = withPhoto.map((r) => {
    const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
    return `
      <article class="community-photo">
        <span class="photo-badge" data-i18n="reviews.verified"></span>
        <img src="${escapeHtml(r.photo)}" alt="Sticker de ${escapeHtml(r.name)} colocado" loading="lazy">
        <div class="photo-stars" role="img" aria-label="${r.rating}/5">${stars}</div>
        <div class="photo-author">
          ${escapeHtml(r.name)}
          <span>· ${escapeHtml(r.email.split("@")[0])}</span>
        </div>
      </article>
    `;
  }).join("");
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
  renderReviews();
  initShop();
  initNewsletter();

  const form = document.getElementById("reviewForm");
  const status = document.getElementById("reviewStatus");
  const photoInput = document.getElementById("reviewPhoto");
  const photoPreview = document.getElementById("reviewPhotoPreview");
  const photoImg = document.getElementById("reviewPhotoImg");
  let pendingPhoto = null;

  if (photoInput && photoPreview && photoImg) {
    photoInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (!file) return;
      readImageFile(file, (err, dataUrl) => {
        if (err) {
          status.textContent = err.message;
          status.hidden = false;
          status.className = "form-status is-error";
          setTimeout(() => { status.hidden = true; }, 4000);
          photoInput.value = "";
          return;
        }
        pendingPhoto = dataUrl;
        photoImg.src = dataUrl;
        photoPreview.hidden = false;
      });
    });
  }

  const photoRemove = form ? form.querySelector(".photo-remove") : null;
  if (photoRemove) {
    photoRemove.addEventListener("click", () => {
      pendingPhoto = null;
      if (photoInput) photoInput.value = "";
      if (photoPreview) photoPreview.hidden = true;
      if (photoImg) photoImg.src = "";
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const review = {
        name: formData.get("name").trim(),
        email: formData.get("email").trim(),
        rating: Number(formData.get("rating")),
        message: formData.get("message").trim(),
        photo: pendingPhoto || null,
        date: new Date().toISOString()
      };
      if (!review.name || !review.email || !review.message) return;
      saveReview(review);
      renderCommunity();
      form.reset();
      pendingPhoto = null;
      if (photoPreview) photoPreview.hidden = true;
      if (photoImg) photoImg.src = "";
      status.textContent = t("reviews.form.success");
      status.hidden = false;
      status.className = "form-status is-ok";
      setTimeout(() => { status.hidden = true; }, 4000);
    });
  }
});

document.addEventListener("langchange", () => {
  renderShop();
  renderTeaser();
  renderReviews();
  renderCommunity();
});
