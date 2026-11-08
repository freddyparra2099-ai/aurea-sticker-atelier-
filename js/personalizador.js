/* ÁUREA · personalizador en vivo */

const CUSTOM_BASE_PRICE = 7.5;

const customState = {
  text: "",
  font: "elegant",
  color: "#a8793f",
  size: 8,
  finish: "matte",
  image: null,
  imageId: null,
  imageScale: 1,
  imageX: 0,
  imageY: 0,
  textScale: 1,
  textX: 150,
  textY: 150
};

let dragState = null;
let imageRequestId = 0;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_SIDE = 1200;

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function readImageFile(file, callback) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const source = event.target.result;
    const image = new Image();
    image.onload = () => {
      const sourceWidth = image.naturalWidth || image.width || 300;
      const sourceHeight = image.naturalHeight || image.height || 300;
      const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(sourceWidth, sourceHeight));
      const width = Math.max(1, Math.round(sourceWidth * scale));
      const height = Math.max(1, Math.round(sourceHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        callback(source);
        return;
      }
      context.drawImage(image, 0, 0, width, height);
      const outputType =
        file.type === "image/png" || file.type === "image/webp" ? "image/png" : "image/jpeg";
      try {
        callback(canvas.toDataURL(outputType, 0.85));
      } catch (err) {
        callback(source);
      }
    };
    image.onerror = () => callback(source);
    image.src = source;
  };
  reader.readAsDataURL(file);
}

function renderPreview() {
  const preview = document.getElementById("stickerPreview");
  if (!preview) return;
  const svg = buildStickerSVG(customState);
  preview.innerHTML = svg || `<p class="preview-empty">${t("custom.emptyHint")}</p>`;
}

function applyPreviewTransforms() {
  const preview = document.getElementById("stickerPreview");
  if (!preview) return;
  const imageGroup = preview.querySelector('[data-drag="image"]');
  const textGroup = preview.querySelector('[data-drag="text"]');
  if (imageGroup) {
    imageGroup.setAttribute(
      "transform",
      `translate(${customState.imageX} ${customState.imageY}) scale(${customState.imageScale})`
    );
  }
  if (textGroup) {
    textGroup.setAttribute(
      "transform",
      `translate(${customState.textX} ${customState.textY}) scale(${customState.textScale})`
    );
  }
}

function renderCustom() {
  renderPreview();

  const price = document.getElementById("customPrice");
  if (price) {
    price.textContent = money(priceFor(CUSTOM_BASE_PRICE, customState.size, customState.finish));
  }

  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewImg = document.getElementById("imagePreviewImg");
  if (imagePreview && imagePreviewImg) {
    if (customState.image) {
      imagePreview.hidden = false;
      if (imagePreviewImg.getAttribute("src") !== customState.image) {
        imagePreviewImg.src = customState.image;
      }
    } else {
      imagePreview.hidden = true;
      if (imagePreviewImg.hasAttribute("src")) imagePreviewImg.removeAttribute("src");
    }
  }

  const colorInput = document.getElementById("customColor");
  if (colorInput) colorInput.value = customState.color;

  document.querySelectorAll("[data-font]").forEach((button) => {
    const active = button.getAttribute("data-font") === customState.font;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-color]").forEach((button) => {
    const active =
      String(button.getAttribute("data-color")).toLowerCase() === customState.color.toLowerCase();
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll("[data-finish]").forEach((button) => {
    const active = button.getAttribute("data-finish") === customState.finish;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const sizeInput = document.getElementById("customSize");
  const sizeValue = document.getElementById("customSizeValue");
  if (sizeInput) sizeInput.value = String(customState.size);
  if (sizeValue) sizeValue.textContent = `${customState.size} cm`;

  const imageZoom = document.getElementById("imageZoom");
  const imageZoomValue = document.getElementById("imageZoomValue");
  if (imageZoom) imageZoom.value = String(customState.imageScale);
  if (imageZoomValue) imageZoomValue.textContent = `${Math.round(customState.imageScale * 100)}%`;

  const textZoom = document.getElementById("textZoom");
  const textZoomValue = document.getElementById("textZoomValue");
  if (textZoom) textZoom.value = String(customState.textScale);
  if (textZoomValue) textZoomValue.textContent = `${Math.round(customState.textScale * 100)}%`;
}

function onPreviewPointerDown(event) {
  const stage = event.currentTarget;
  const svg = stage.querySelector(".sticker-svg");
  if (!svg) return;

  const target = event.target.closest("[data-drag]");
  let kind = target ? target.getAttribute("data-drag") : null;
  if (!kind) {
    if (customState.image) kind = "image";
    else if (customState.text.trim()) kind = "text";
  }

  if (kind === "image" && !customState.image) return;
  if (kind === "text" && !customState.text.trim()) return;
  if (!kind) return;

  const rect = svg.getBoundingClientRect();
  if (!rect.width) return;

  dragState = {
    kind,
    startX: event.clientX,
    startY: event.clientY,
    imageX: customState.imageX,
    imageY: customState.imageY,
    textX: customState.textX,
    textY: customState.textY,
    scale: 300 / rect.width
  };

  stage.classList.add("is-dragging");
  try {
    stage.setPointerCapture(event.pointerId);
  } catch (err) {
    /* captura no disponible */
  }
  event.preventDefault();
}

function onPreviewPointerMove(event) {
  if (!dragState) return;
  const dx = (event.clientX - dragState.startX) * dragState.scale;
  const dy = (event.clientY - dragState.startY) * dragState.scale;

  if (dragState.kind === "image") {
    customState.imageX = clampValue(dragState.imageX + dx, -300, 300);
    customState.imageY = clampValue(dragState.imageY + dy, -300, 300);
  } else {
    customState.textX = clampValue(dragState.textX + dx, 0, 300);
    customState.textY = clampValue(dragState.textY + dy, 0, 300);
  }

  applyPreviewTransforms();
  event.preventDefault();
}

function onPreviewPointerUp(event) {
  if (!dragState) return;
  dragState = null;
  const stage = event.currentTarget;
  stage.classList.remove("is-dragging");
  try {
    stage.releasePointerCapture(event.pointerId);
  } catch (err) {
    /* captura no disponible */
  }
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
      const requestId = ++imageRequestId;
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        toast(t("custom.imageNotImage"));
        event.target.value = "";
        return;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast(t("custom.imageTooLarge"));
        event.target.value = "";
        return;
      }
      readImageFile(file, (dataUrl) => {
        if (requestId !== imageRequestId) return;
        customState.image = dataUrl;
        customState.imageId = `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        customState.imageScale = 1;
        customState.imageX = 0;
        customState.imageY = 0;
        renderCustom();
      });
    });
  }

  if (imageRemove) {
    imageRemove.addEventListener("click", () => {
      imageRequestId += 1;
      customState.image = null;
      customState.imageId = null;
      customState.imageScale = 1;
      customState.imageX = 0;
      customState.imageY = 0;
      if (imageInput) imageInput.value = "";
      renderCustom();
    });
  }

  document.querySelectorAll("[data-font]").forEach((button) => {
    button.addEventListener("click", () => {
      customState.font = button.getAttribute("data-font");
      renderCustom();
    });
  });

  document.querySelectorAll("[data-color]").forEach((button) => {
    button.addEventListener("click", () => {
      customState.color = String(button.getAttribute("data-color")).toLowerCase();
      renderCustom();
    });
  });

  const colorInput = document.getElementById("customColor");
  if (colorInput) {
    colorInput.addEventListener("input", () => {
      customState.color = colorInput.value.toLowerCase();
      renderCustom();
    });
  }

  document.querySelectorAll("[data-finish]").forEach((button) => {
    button.addEventListener("click", () => {
      customState.finish = button.getAttribute("data-finish");
      renderCustom();
    });
  });

  const sizeInput = document.getElementById("customSize");
  if (sizeInput) {
    sizeInput.addEventListener("input", () => {
      customState.size = Number(sizeInput.value);
      const sizeValue = document.getElementById("customSizeValue");
      if (sizeValue) sizeValue.textContent = `${customState.size} cm`;
      const price = document.getElementById("customPrice");
      if (price) {
        price.textContent = money(priceFor(CUSTOM_BASE_PRICE, customState.size, customState.finish));
      }
    });
  }

  const imageZoom = document.getElementById("imageZoom");
  if (imageZoom) {
    imageZoom.addEventListener("input", () => {
      customState.imageScale = Number(imageZoom.value);
      const output = document.getElementById("imageZoomValue");
      if (output) output.textContent = `${Math.round(customState.imageScale * 100)}%`;
      applyPreviewTransforms();
    });
  }

  const textZoom = document.getElementById("textZoom");
  if (textZoom) {
    textZoom.addEventListener("input", () => {
      customState.textScale = Number(textZoom.value);
      const output = document.getElementById("textZoomValue");
      if (output) output.textContent = `${Math.round(customState.textScale * 100)}%`;
      applyPreviewTransforms();
    });
  }

  const resetPosition = document.getElementById("resetPosition");
  if (resetPosition) {
    resetPosition.addEventListener("click", () => {
      customState.imageScale = 1;
      customState.imageX = 0;
      customState.imageY = 0;
      customState.textScale = 1;
      customState.textX = 150;
      customState.textY = 150;
      renderCustom();
    });
  }

  const preview = document.getElementById("stickerPreview");
  if (preview) {
    preview.addEventListener("pointerdown", onPreviewPointerDown);
    preview.addEventListener("pointermove", onPreviewPointerMove);
    preview.addEventListener("pointerup", onPreviewPointerUp);
    preview.addEventListener("pointercancel", onPreviewPointerUp);
  }

  const addBtn = document.getElementById("customAdd");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const text = customState.text.trim();
      if (!text && !customState.image) {
        toast(t("custom.emptyAdd"));
        return;
      }

      const key = [
        "c",
        encodeURIComponent(text),
        customState.imageId || "0",
        customState.font,
        customState.color,
        customState.size,
        customState.finish,
        Math.round(customState.imageX),
        Math.round(customState.imageY),
        customState.imageScale.toFixed(2),
        Math.round(customState.textX),
        Math.round(customState.textY),
        customState.textScale.toFixed(2)
      ].join(":");

      addToCart({
        key,
        type: "custom",
        qty: 1,
        unitPrice: priceFor(CUSTOM_BASE_PRICE, customState.size, customState.finish),
        options: { size: customState.size, finish: customState.finish },
        custom: {
          text,
          font: customState.font,
          color: customState.color,
          image: customState.image || null,
          imageScale: customState.imageScale,
          imageX: customState.imageX,
          imageY: customState.imageY,
          textScale: customState.textScale,
          textX: customState.textX,
          textY: customState.textY
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
