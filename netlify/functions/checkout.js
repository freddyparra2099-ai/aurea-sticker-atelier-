/* ÁUREA · creación de sesiones de Stripe Checkout
 *
 * Netlify Function (Node 18+). No necesita dependencias: usa fetch.
 *
 * Variables de entorno necesarias en Netlify:
 *   STRIPE_SECRET_KEY = sk_live_... o sk_test_...
 *   SITE_URL          = https://tudominio.com (opcional pero recomendado)
 *
 * El precio SIEMPRE se recalcula aquí. Nunca se confía en el importe que
 * envía el navegador.
 */

const STRIPE_API = "https://api.stripe.com/v1";

const CATALOG = {
  luna: { price: 650, es: "Luna Creciente", en: "Crescent Moon" },
  ojo: { price: 690, es: "Ojo Protector", en: "Guardian Eye" },
  rosa: { price: 590, es: "Rosa Eterna", en: "Eternal Rose" },
  mariposa: { price: 650, es: "Mariposa Áurea", en: "Golden Butterfly" },
  aurora: { price: 750, es: "Aurora", en: "Aurora" },
  onda: { price: 620, es: "Marea", en: "Tide" },
  corazon: { price: 550, es: "Corazón Cuadros", en: "Checkered Heart" },
  seta: { price: 590, es: "Seta Soñadora", en: "Dreamy Mushroom" },
  tipografia: { price: 490, es: "Stay Wild", en: "Stay Wild" }
};

const SIZE_MULT = { S: 0.8, M: 1, L: 1.7 };
const FINISH_ADD = { matte: 0, gloss: 50, holo: 150 };
const FINISH_LABEL = {
  matte: { es: "Mate", en: "Matte" },
  gloss: { es: "Brillo", en: "Gloss" },
  holo: { es: "Holográfico", en: "Holographic" }
};

const CUSTOM_BASE = 750;
const FREE_SHIPPING = 2500;
const SHIPPING = 395;
const PROMO_CODE = "AUREA10";
const PROMO_PERCENT = 10;
const MAX_LINES = 25;
const MAX_QTY = 99;
const ALLOWED_COUNTRIES = ["ES", "PT", "FR", "DE", "IT", "NL", "BE", "GB"];

function badRequest(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

function cleanText(value, maxLength) {
  return String(value == null ? "" : value)
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function priceFor(base, size, finish) {
  const mult = SIZE_MULT[size] || 1;
  const add = FINISH_ADD[finish] || 0;
  return Math.round(base * mult + add);
}

function buildLine(item, lang) {
  const options = item && item.options ? item.options : {};
  const size = SIZE_MULT[options.size] !== undefined ? options.size : "M";
  const finish = FINISH_ADD[options.finish] !== undefined ? options.finish : "matte";
  const qty = Math.max(1, Math.min(MAX_QTY, Math.floor(Number(item && item.qty) || 1)));
  const finishLabel = FINISH_LABEL[finish][lang];

  if (item && item.type === "custom") {
    const custom = item.custom || {};
    const text = cleanText(custom.text, 24) || (lang === "en" ? "Custom sticker" : "Pegatina personalizada");
    return {
      name: `${lang === "en" ? "Custom sticker" : "Pegatina personalizada"}: ${text} · ${size} · ${finishLabel}`,
      unit: priceFor(CUSTOM_BASE, size, finish),
      qty
    };
  }

  const id = item && item.id;
  const product = CATALOG[id];
  if (!product) {
    throw badRequest(`Producto desconocido: ${cleanText(id, 40) || "(sin id)"}`);
  }

  return {
    name: `${product[lang]} · ${size} · ${finishLabel}`,
    unit: priceFor(product.price, size, finish),
    qty
  };
}

async function stripeRequest(path, params, secret) {
  const response = await fetch(`${STRIPE_API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data && data.error && data.error.message ? data.error.message : `HTTP ${response.status}`;
    const error = new Error(detail);
    error.stripe = true;
    throw error;
  }
  return data;
}

function siteUrl(event) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, "");
  const host = event.headers.host;
  if (host) {
    const proto = (event.headers["x-forwarded-proto"] || "https").split(",")[0].trim();
    return `${proto}://${host}`;
  }
  return "http://localhost:8888";
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(body)
  };
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "Cache-Control": "no-store" } };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Método no permitido." });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    console.error("checkout: falta STRIPE_SECRET_KEY");
    return json(500, { error: "El pago no está configurado todavía." });
  }

  let payload;
  try {
    let raw = event.body || "{}";
    if (event.isBase64Encoded) raw = Buffer.from(raw, "base64").toString("utf8");
    if (raw.length > 20000) return json(413, { error: "Carrito demasiado grande." });
    payload = JSON.parse(raw);
  } catch (err) {
    return json(400, { error: "Petición no válida." });
  }

  const lang = payload.lang === "en" ? "en" : "es";
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (items.length === 0) return json(400, { error: "El carrito está vacío." });
  if (items.length > MAX_LINES) return json(400, { error: "Demasiados artículos en el carrito." });

  try {
    const lines = items.map((item) => buildLine(item, lang));
    const subtotal = lines.reduce((sum, line) => sum + line.unit * line.qty, 0);
    if (subtotal <= 0) throw badRequest("El importe del pedido no es válido.");

    const promo = payload.promo === true;
    const discount = promo ? Math.round((subtotal * PROMO_PERCENT) / 100) : 0;
    const afterDiscount = subtotal - discount;
    const shipping = afterDiscount >= FREE_SHIPPING ? 0 : SHIPPING;

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("payment_method_types[0]", "card");
    params.append("locale", lang);
    params.append("success_url", `${siteUrl(event)}/carrito.html?pago=ok&session={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${siteUrl(event)}/carrito.html?pago=cancelado`);
    params.append("billing_address_collection", "auto");
    params.append("phone_number_collection[enabled]", "true");
    ALLOWED_COUNTRIES.forEach((country, index) => {
      params.append(`shipping_address_collection[allowed_countries][${index}]`, country);
    });
    params.append("metadata[store]", "aurea");
    params.append("metadata[promo]", promo ? PROMO_CODE : "none");
    params.append("metadata[summary]", lines
      .map((line) => `${line.qty}x ${line.name}`)
      .join(" | ")
      .slice(0, 480));

    lines.forEach((line, index) => {
      params.append(`line_items[${index}][quantity]`, String(line.qty));
      params.append(`line_items[${index}][price_data][currency]`, "eur");
      params.append(`line_items[${index}][price_data][unit_amount]`, String(line.unit));
      params.append(`line_items[${index}][price_data][product_data][name]`, line.name);
    });

    if (shipping > 0) {
      const index = lines.length;
      params.append(`line_items[${index}][quantity]`, "1");
      params.append(`line_items[${index}][price_data][currency]`, "eur");
      params.append(`line_items[${index}][price_data][unit_amount]`, String(shipping));
      params.append(
        `line_items[${index}][price_data][product_data][name]`,
        lang === "en" ? "Shipping" : "Envío"
      );
    }

    if (discount > 0) {
      const couponParams = new URLSearchParams();
      couponParams.append("amount_off", String(discount));
      couponParams.append("currency", "eur");
      couponParams.append("duration", "once");
      couponParams.append("name", PROMO_CODE);
      const coupon = await stripeRequest("/coupons", couponParams, secret);
      params.append("discounts[0][coupon]", coupon.id);
    }

    const session = await stripeRequest("/checkout/sessions", params, secret);
    if (!session.url) throw new Error("Stripe no devolvió una URL de pago.");

    return json(200, { url: session.url, id: session.id });
  } catch (err) {
    console.error("checkout:", err.message);
    const status = err.status || (err.stripe ? 502 : 500);
    const message = status === 400
      ? err.message
      : lang === "en"
        ? "We couldn't start the payment. Please try again."
        : "No se pudo iniciar el pago. Inténtalo de nuevo.";
    return json(status, { error: message });
  }
};
