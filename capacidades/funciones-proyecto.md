# Funciones del proyecto ÁUREA

Referencia de las funciones y constantes que ya existen en `js/`. Todas están en el ámbito global (scripts clásicos, sin módulos) y se cargan en este orden en cada página:

```html
<script src="js/i18n.js"></script>
<script src="js/data.js"></script>
<script src="js/app.js"></script>
<!-- + el script propio de la página -->
```

---

## `js/i18n.js` — idioma y traducciones

| Elemento | Firma | Qué hace |
| --- | --- | --- |
| `I18N` | `{ es: {...}, en: {...} }` | Diccionario completo de textos en español e inglés. |
| `LANG` | `"es"` \| `"en"` | Idioma activo; se lee de `localStorage` (`aurea_lang`) al cargar. |
| `t(key)` | `string` | Devuelve el texto traducido. Si falta en el idioma activo, cae a español; si tampoco existe, devuelve la clave. |
| `applyI18n(root?)` | `void` | Recorre `root` (o `document`) y aplica textos según `data-i18n`, `data-i18n-html`, `data-i18n-placeholder`, `data-i18n-aria` y `data-i18n-title`. También fija `<html lang>` y el `<title>`. |
| `setLang(lang)` | `void` | Cambia a `"es"` o `"en"`, guarda la preferencia y emite el evento `langchange` en `document`. |

**Atributos de traducción admitidos**

```html
<h1 data-i18n="hero.title">…</h1>
<p data-i18n-html="hero.lead">…</p>
<input data-i18n-placeholder="search.placeholder">
<button data-i18n-aria="header.menu">…</button>
<abbr data-i18n-title="brand.name">…</abbr>
```

---

## `js/data.js` — catálogo y precios

| Elemento | Detalle |
| --- | --- |
| `PRODUCTS` | Array de 9 productos. Campos: `id`, `cat`, `price`, `accent`, `img`, `badge`, `rating`, `reviews`, `name {es,en}`, `desc {es,en}`. |
| `CATEGORY_KEYS` | `["all", "celestial", "botanical", "abstract", "retro", "typography"]`. |
| `SIZE_MULT` | Multiplicador por tamaño: `S: 0.8`, `M: 1`, `L: 1.7`. |
| `FINISH_ADD` | Suplemento por acabado: `matte: 0`, `gloss: 0.5`, `holo: 1.5` (€). |
| `productById(id)` | Devuelve el producto o `null`. |
| `priceFor(base, size, finish)` | `round2(base * SIZE_MULT[size] + FINISH_ADD[finish])`. |

**Productos disponibles**

| `id` | Categoría | Precio base (M) |
| --- | --- | --- |
| `luna` | celestial | 6,50 € |
| `ojo` | celestial | 6,90 € |
| `rosa` | botanical | 5,90 € |
| `mariposa` | botanical | 6,50 € |
| `aurora` | abstract | 7,50 € |
| `onda` | abstract | 6,20 € |
| `corazon` | retro | 5,50 € |
| `seta` | retro | 5,90 € |
| `tipografia` | typography | 4,90 € |

---

## `js/app.js` — núcleo compartido

### Constantes

| Constante | Valor | Uso |
| --- | --- | --- |
| `CART_KEY` | `"aurea_cart"` | Clave del carrito en `localStorage`. |
| `FREE_SHIPPING` | `25` | Umbral de envío gratis (€). |
| `SHIPPING_COST` | `3.95` | Coste de envío (€). |
| `STICKER_FONTS` | `elegant`, `modern`, `classic` | Familias tipográficas del personalizador. |
| `STICKER_COLORS` | `gold`, `ink`, `violet`, `rose`, `mint` | Colores del personalizador (hex). |

### Formato y utilidades

| Firma | Qué hace |
| --- | --- |
| `money(value) → string` | Formatea en EUR según el idioma (`es-ES` / `en-GB`). |
| `round2(value) → number` | Redondea a dos decimales. |
| `escapeHtml(value) → string` | Escapa `& < > " '` antes de insertar HTML. |
| `formatSize(size) → string` | Traduce el tamaño (`product.sizeS/M/L`). |
| `formatFinish(finish) → string` | Traduce el acabado (`product.matte/gloss/holo`). |
| `toast(message) → void` | Aviso flotante de 2,4 s con `role="status"`. |

### Carrito

| Firma | Qué hace |
| --- | --- |
| `getCart() → Array` | Lee y parsea el carrito; devuelve `[]` si falla. |
| `saveCart(items) → void` | Guarda y actualiza el contador. |
| `cartCount() → number` | Suma de `qty`. |
| `updateCartBadge() → void` | Actualiza `[data-cart-badge]`; lo oculta si está vacío. |
| `addToCart(item) → void` | Suma cantidad si coincide `item.key`; si no, añade. Muestra aviso. |
| `removeFromCart(index) → void` | Elimina una línea por índice. |
| `setCartQty(index, qty) → void` | Fija cantidad entre 1 y 99. |
| `cartTotals(items, promo) → {subtotal, discount, shipping, total}` | Calcula totales; descuento del 10 % si `promo`; envío gratis desde $5. |
| `getFavorites() → Array` | Lee el array de favoritos desde `localStorage` (`aurea_favorites`). |
| `saveFavorites(items) → void` | Guarda favoritos y actualiza el badge. |
| `favCount() → number` | Número de favoritos. |
| `isFavorite(key) → boolean` | Indica si una clave está en favoritos. |
| `toggleFavorite(key) → boolean` | Añade o quita un favorito; devuelve el estado final. Muestra aviso. |
| `updateFavBadge() → void` | Actualiza `[data-fav-badge]`; lo oculta si está vacío. |

**Forma de un artículo del carrito**

```js
{
  key: "p:luna:M:matte",        // o "c:<texto>:<font>:<shape>:<color>:<size>:<finish>"
  type: "product" | "custom",
  id: "luna",                    // solo productos
  qty: 1,
  unitPrice: 6.5,
  options: { size: "M", finish: "matte" },
  custom: { text, font, shape, color } // solo personalizados
}
```

### Vista previa SVG

| Firma | Qué hace |
| --- | --- |
| `stickerShape(shape) → string` | Devuelve el SVG de la forma: `circle` (defecto), `square`, `heart`, `star`. |
| `stickerLines(text) → string[]` | Parte el texto en líneas de ≤ 11 caracteres, máx. 3. |
| `buildStickerSVG(custom) → string` | Genera el SVG 300×300 con forma, color, tipografía y texto; ajusta el tamaño de letra entre 16 y 44 px. Usa texto de relleno si está vacío. |

### Tarjetas y cabecera

| Firma | Qué hace |
| --- | --- |
| `productCard(product) → string` | HTML de una tarjeta con enlace a `producto.html?id=…`, categoría, precio «desde» (S/matte) y botón `data-add`. |
| `initHeader() → void` | Sombra al hacer scroll, botón de idioma, menú móvil (Escape para cerrar), contador y sincronización entre pestañas (`storage`), año del pie. |

Al cargar el documento se ejecutan `applyI18n()` e `initHeader()`.

---

## `js/home.js` — portada

| Firma | Qué hace |
| --- | --- |
| `shopState` | Estado de filtros: `{ cat: "all", q: "", sort: "featured" }`. |
| `visibleProducts() → Product[]` | Filtra por categoría y busca en nombre/descripción/categoría (ES y EN); ordena por precio si se pide. |
| `renderShop() → void` | Pinta `#productGrid` y muestra/oculta `#emptyState`. |
| `renderTeaser() → void` | Pinta `#teaserPreview` con la pegatina de ejemplo y chips de acabado. |
| `initShop() → void` | Conecta chips de categoría, buscador, orden y el botón «añadir» (delegación de eventos). |
| `initNewsletter() → void` | Valida `#newsletterForm` y muestra aviso de suscripción. |

Eventos: `DOMContentLoaded` (render + init) y `langchange` (vuelve a pintar).

| Función | Qué hace |
|---------|----------|
| `getReviews() → Array` | Lee las opiniones guardadas en `localStorage` (`aurea_reviews`). |
| `saveReview(review) → void` | Guarda una nueva opinión y vuelve a pintar la lista. |
| `renderReviews() → void` | Pinta las opiniones guardadas o muestra estado vacío. |

---

## `js/producto.js` — detalle de producto

| Firma | Qué hace |
| --- | --- |
| `params` | `URLSearchParams` de la URL. |
| `currentProduct` | Producto de `?id=`; si no existe, el primero del catálogo (y se muestra `#productNotice`). |
| `selectedSize` / `selectedFinish` / `selectedQty` | Selección actual; cantidad entre 1 y 20. |
| `formatRating(value) → string` | Un decimal según idioma. |
| `renderProduct() → void` | Rellena título de pestaña, imagen, insignia, categoría, nombre, migas, valoración, descripción, precio, cantidad y estados activos. |
| `renderRelated() → void` | Hasta 3 productos, priorizando la misma categoría. |
| `initProduct() → void` | Conecta tamaño, acabado, cantidad y botones de añadir (principal y relacionados). |

---

## `js/personalizador.js` — creador

| Elemento | Detalle |
| --- | --- |
| `CUSTOM_BASE_PRICE` | `7.5` € (precio base del personalizado en M). |
| `customState` | `{ text: "BONITA", font: "elegant", shape: "heart", color: "gold", size: "M", finish: "matte" }`. |
| `renderCustom()` | Regenera `#stickerPreview`, actualiza `#customPrice` y marca botones activos con `aria-pressed`. |
| `initCustomizer()` | Conecta texto, ideas rápidas, tipografía, forma, color, tamaño, acabado y `#customAdd`. |

Opciones: 3 tipografías, 4 formas, 5 colores, 3 tamaños y 3 acabados.

---

## `js/carrito.js` — carrito y checkout

| Elemento | Detalle |
| --- | --- |
| `PROMO_CODE` | `"AUREA10"`. |
| `promoActive` | Se restaura desde `sessionStorage` (`aurea_promo`). |
| `cartItemHTML(item, index)` | HTML de una línea; los personalizados muestran su miniatura SVG. |
| `renderCart()` | Pinta lista/vacío, subtotal, envío, descuento, total y barra de envío gratis. |
| `applyPromo()` | Valida el código, lo guarda y muestra aviso. |
| `initCartEvents()` | Conecta ±, eliminar, promo (botón y Enter), apertura/cierre del diálogo y envío del formulario. |

**Checkout de demostración**

- Exige formulario válido (`checkValidity`).
- Genera código `AUR-AA-NNNN` (año de 2 dígitos + 4 aleatorios).
- Vacía el carrito, desactiva la promo y vuelve a pintar.
- **No procesa pagos ni envía datos.**

---

## Eventos globales

| Evento | Quién lo emite | Quién lo escucha |
| --- | --- | --- |
| `DOMContentLoaded` | Navegador | Cada módulo inicializa su parte. |
| `langchange` | `setLang()` | `home.js`, `producto.js`, `personalizador.js`, `carrito.js` y la cabecera. |
| `storage` | Navegador (otra pestaña) | `initHeader()` para el contador. |
