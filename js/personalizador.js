/* ÁUREA · personalizador en vivo */

const CUSTOM_BASE_PRICE = 7.5;

const customState = {
  text: "",
  font: "elegant",
  shape: "heart",
  color: "gold",
  size: "M",
  finish: "matte",
  image: null
};

function renderCustom() {
  const preview = document.getElementById("stickerPreview");
  if (preview) {
    preview.innerHTML = buildStickerSVG(customState);
  }

  const price = document.getElementById("customPrice");
  if (price) {
    price.textContent = money(priceFor(CUSTOM_BASE_PRICE, customState.size, customState.finish));
  }

  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewImg = document.getElementById("imagePreviewImg");
  if (imagePreview && imagePreviewImg) {
    if (customState.image) {
      imagePreview.hidden = false;
      imagePreviewImg.src = customState.image;
    } else {
      imagePreview.hidden = true;
      imagePreviewImg.src = "";
    }
  }

  document.querySelectorAll("[data-font]").forEach((button) => {
    const active = button.getAttribute("data-font") === customState.font;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-shape]").forEach((button) => {
    const active = button.getAttribute("data-shape") === customState.shape;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-color]").forEach((button) => {
    const active = button.getAttribute("data-color") === customState.color;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-size]").forEach((button) => {
    const active = button.getAttribute("data-size") === customState.size;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-finish]").forEach((button) => {
    const active = button.getAttribute("data-finish") === customState.finish;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function initCustomizer() {
  const input = document.getElementById("customText");
  if (input) {
    input.value = customState.text;
    input.addEventListener("input", () => {
      customState.text = input.value;
      renderCustom();
    });
  }

  const imageInput = document.getElementById("customImage");
  const imageRemove = document.getElementById("imageRemove");

  if (imageInput) {
    imageInput.addEventListener("change", (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast(t("custom.imageNotImage"));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        customState.image = e.target.result;
        customState.text = ""; // limpiar texto si hay imagen
        if (input) input.value = "";
        renderCustom();
      };
      reader.readAsDataURL(file);
    });
  }

  if (imageRemove) {
    imageRemove.addEventListener("click", () => {
      customState.image = null;
      if (imageInput) imageInput.value = "";
      renderCustom();
    });
  }

  document.querySelectorAll("[data-idea]").forEach((button) => {
    button.addEventListener("click", () => {
      customState.text = button.getAttribute("data-idea");
      if (input) input.value = customState.text;
      renderCustom();
    });
  });

  document.querySelectorAll("[data-font]").forEach((button) => {
    button.addEventListener("click", () => {
      customState.font = button.getAttribute("data-font");
      renderCustom();
    });
  });

  document.querySelectorAll("[data-shape]").forEach((button) => {
    button.addEventListener("click", () => {
      customState.shape = button.getAttribute("data-shape");
      renderCustom();
    });
  });

  document.querySelectorAll("[data-color]").forEach((button) => {
    button.addEventListener("click", () => {
      customState.color = button.getAttribute("data-color");
      renderCustom();
    });
  });

  document.querySelectorAll("[data-size]").forEach((button) => {
    button.addEventListener("click", () => {
      customState.size = button.getAttribute("data-size");
      renderCustom();
    });
  });

  document.querySelectorAll("[data-finish]").forEach((button) => {
    button.addEventListener("click", () => {
      customState.finish = button.getAttribute("data-finish");
      renderCustom();
    });
  });

  const addBtn = document.getElementById("customAdd");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const text = customState.text.trim() || t("custom.emptyPreview");
      addToCart({
        key: `c:${encodeURIComponent(text || customState.image ? "imagen" : "")}:${customState.font}:${customState.shape}:${customState.color}:${customState.size}:${customState.finish}`,
        type: "custom",
        qty: 1,
        unitPrice: priceFor(CUSTOM_BASE_PRICE, customState.size, customState.finish),
        options: { size: customState.size, finish: customState.finish },
        custom: {
          text: text,
          font: customState.font,
          shape: customState.shape,
          color: customState.color,
          image: customState.image || null
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderCustom();
  initCustomizer();
});

document.addEventListener("langchange", () => {
  renderCustom();
});
