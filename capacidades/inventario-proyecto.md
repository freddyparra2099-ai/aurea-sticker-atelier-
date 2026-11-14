# Inventario del proyecto ÁUREA

Resumen funcional de la web: qué hay, cómo se conecta y qué falta. Complementa a [`funciones-proyecto.md`](funciones-proyecto.md).

## Ficha

| Dato | Valor |
| --- | --- |
| Nombre | ÁUREA · Sticker Atelier |
| Tipo | Sitio estático, sin dependencias ni backend |
| Tecnologías | HTML5, CSS3, JavaScript clásico (sin módulos ni build) |
| Idiomas | Español e inglés |
| Moneda | USD |
| Persistencia | `localStorage` + `sessionStorage` |
| Estado | Funcional como demo; checkout simulado |

## Páginas

| Página | Propósito | Módulos JS |
| --- | --- | --- |
| `index.html` | Portada: hero, catálogo con filtros/búsqueda/orden, teaser del personalizador, opiniones, FAQ y newsletter. | `i18n`, `data`, `app`, `home` |
| `producto.html?id=<id>` | Ficha de producto: tamaño, acabado, cantidad, relacionados y añadir al carrito. | `i18n`, `data`, `app`, `producto` |
| `personalizador.html` | Creación de pegatina con foto y texto arrastrables, 20 tipografías, color libre, tamaño 5–90 cm, 8 acabados, zoom y vista previa SVG recta. | `i18n`, `data`, `app`, `personalizador` |
| `carrito.html` | Carrito persistente, código promo, envío gratis y checkout modal de demostración. | `i18n`, `data`, `app`, `carrito` |

## Secciones de la portada

- **Hero** animado (respeta `prefers-reduced-motion`).
- **Tienda** (`#tienda`): 10 productos, 13 categorías (colección: personalizados, frases y acabados especiales, humor y memes, cultura pop, videojuegos; estética visual: minimalistas, estilo cómic, ciberpunk, Lo-Fi, gótico, kawaii, 80s y 90s, 2000), buscador, orden por precio y estado vacío.
- **Personaliza** (`#personaliza`): teaser con vista previa.
- **Opiniones** (`#opiniones`): formulario para dejar opinión con nombre, correo, valoración de estrellas (1–5), texto y foto opcional del producto colocado. Las reseñas con foto se muestran también en la galería «Fotos de la comunidad» (prueba social). Guarda en `aurea_reviews`.
- **Newsletter**: validación de email y aviso, sin envío real.
- **FAQ** (`#faq`).
- **Newsletter**: validación de email y aviso, sin envío real.

## Estructura de archivos

```
index.html
producto.html
personalizador.html
carrito.html
README.md
capacidades/                 Esta documentación

css/styles.css               Tokens de diseño + componentes

js/i18n.js                   Traducciones ES/EN
js/data.js                   Catálogo, multiplicadores y precios
js/app.js                    Carrito, formato, avisos, SVG y cabecera
js/home.js                   Catálogo, teaser y newsletter
js/producto.js               Ficha de producto
js/personalizador.js         Estado y vista previa del creador
js/carrito.js                Carrito, promo y checkout

assets/stickers/*.svg        9 ilustraciones vectoriales
```

## Reglas de negocio

| Regla | Valor | Dónde |
| --- | --- | --- |
| Tamaños de catálogo | S ×0,8 · M ×1 · L ×1,7 | `SIZE_MULT` |
| Tamaño personalizado | 5–90 cm; multiplicador `max(0.5, (cm / 8) ^ 1.15)` | `priceFor` |
| Acabados | Mate +$0 · Brillo +$0.50 · Satinado +$0.30 · Holo +$1.50 · Glitter +$1.20 · Metálico +$1.00 · Neón +$0.80 · Transparente +$0.20 | `FINISH_ADD` |
| Personalizado | Base $7.50 (8 cm) | `CUSTOM_BASE_PRICE` |
| Personalizado con foto | Imagen de fondo (data URL, máx. 5 MB, reducida a 1200 px) + texto opcional | `readImageFile`, `buildStickerSVG` |
| Posición de foto/texto | Arrastrable; zoom de foto 50–300 % y de texto 50–250 % | `personalizador.js` |
| Envío | $3.95; gratis desde $5 (tras descuento) | `cartTotals` |
| Promo | `AUREA10` → 10 % de descuento | `PROMO_CODE` |
| Cantidad en ficha | 1–20 | `producto.js` |
| Cantidad en carrito | 1–99 | `setCartQty` |
| Código de pedido | `AUR-AA-NNNN` | `carrito.js` |
| Favoritos | localStorage `aurea_favorites` | `app.js` |
| Opiniones de usuarios | Formulario para dejar opinión; guarda en `aurea_reviews` | `home.js` |

## Datos y almacenamiento

| Clave | Medio | Contenido |
| --- | --- | --- |
| `aurea_cart` | `localStorage` | Array JSON de artículos del carrito. |
| `aurea_lang` | `localStorage` | `"es"` o `"en"`. |
| `aurea_promo` | `sessionStorage` | `"1"` si la promo está activa. |
| `aurea_reviews` | `localStorage` | Array JSON de opiniones dejadas por usuarios. |

No hay cookies, analítica ni envío de datos a servidores.

## Modelo de producto

```js
{
  id: "luna",
  cat: "celestial",          // celestial | botanical | abstract | retro | typography
  price: 6.5,                // base en tamaño M
  accent: "#8b7bff",         // color del resplandor de la tarjeta
  img: "assets/stickers/luna.svg",           // sticker aislado (SVG)
  contextImg: "assets/context/luna-laptop.jpg", // foto de uso real (laptop, libreta, funda)
  badge: "top",              // "new" | "top" | null
  rating: 4.9,
  reviews: 214,
  name: { es: "Luna Creciente", en: "Crescent Moon" },
  desc: { es: "…", en: "…" }
}
```

## Accesibilidad y calidad

- Enlace «saltar al contenido», navegación por teclado y foco visible.
- `aria-label`, `aria-pressed`, `aria-expanded`, `role="status"` y `aria-live` en avisos.
- Textos alternativos en ilustraciones y botones.
- `prefers-reduced-motion` respetado.
- Diseño responsive con menú móvil.
- HTML/CSS/JS sin dependencias externas (solo Google Fonts).

## Cómo ampliar

### Añadir un producto

1. Copia un objeto en `PRODUCTS` (`js/data.js`) y ajusta `id`, `cat`, `price`, `img`, textos ES/EN.
2. Coloca el SVG en `assets/stickers/` con `viewBox="0 0 400 400"`.
3. No hace falta tocar HTML: el catálogo y los relacionados se generan solos.

### Añadir una categoría

1. Añade el chip en `index.html` con `data-cat="nueva"`.
2. Agrega `shop.nueva` en **ambos** idiomas de `js/i18n.js`.
3. Inclúyela en `CATEGORY_KEYS` (`js/data.js`).

### Añadir textos

Usa `data-i18n` en el HTML y la clave en `I18N.es` **y** `I18N.en`.

### Cambiar el estilo

Los tokens están en `:root` de `css/styles.css` (`--bg`, `--gold`, `--violet`, `--outline`, tipografías, etc.). La paleta activa es **Coral & Mint**: fondo `#FFFDF5`, coral `#FF6B6B`, menta `#4ECDC4`, texto `#2C3E50` y bordes negros `#111111` (`--outline`).

**Tokens de texto (contraste sobre fondo crema `#FFFDF5`):**

| Token | Valor | Contraste | Uso | WCAG |
|---|---|---|---|---|
| `--ink` | `#2C3E50` | ≈ 11:1 | Texto principal, precios, datos críticos | ✅ AAA |
| `--muted` / `--muted-2` | `#5A6B78` | ≈ 5.27:1 | Texto secundario, subtítulos, etiquetas | ✅ AA |
| `--muted-strong` | `#4A5A68` | ≈ 6.70:1 | Etiquetas de formulario, texto pequeño | ✅ AAA |
| `--gold-strong` | `#C0392B` | ≈ 5.09:1 | Enlaces, acentos de texto, estados | ✅ AAA |
| `--gold` | `#FF6B6B` | ≈ 2.70:1 | Solo decorativo (botones, fondos, iconos) | ❌ No como texto |
| `--violet/rose/mint` | `#4ECDC4` | ≈ 1.82:1 | Solo decorativo | ❌ No como texto |

**Regla:** nunca usar `--gold` o `--violet/rose/mint` como color de texto sobre el fondo crema; no alcanzan el mínimo 3:1 (texto grande) ni 4.5:1 (texto normal). Usar `--ink`, `--muted`, `--muted-strong` o `--gold-strong` según la jerarquía visual.

Todos los pesos `font-weight: 300` en texto corporal se cambiaron a `400` para mejorar legibilidad sin perder la elegancia minimalista.

### Previsualización en contexto

Cada producto puede tener una foto de uso real en `contextImg` (ej. sticker pegado en una laptop, libreta o funda de celular). En la tarjeta de la cuadrícula (`index.html`), al pasar el cursor (hover) la imagen cambia del sticker plano a la foto de contexto con una transición suave. En la vista de detalle (`producto.html`), un botón "Ver en contexto" (`galleryToggle`) alterna entre ambas vistas con `aria-pressed` para accesibilidad.

Las fotos de contexto van en `assets/context/` con nombres descriptivos (ej. `luna-laptop.jpg`, `rosa-notebook.jpg`).



## Tareas pendientes / límites conocidos

- [ ] Checkout real: hoy es una simulación (haría falta Stripe/PayPal y backend).
- [ ] Newsletter: no envía el correo a ningún servicio.
- [ ] Enlaces legales y redes sociales: marcadores `#`.
- [ ] Dominio y correo reales (`hola@aurea.studio` es de ejemplo).
- [ ] Sin tests automatizados ni linter.
- [ ] Sin imágenes de producto en mapa de bits: todo es SVG.
- [ ] Sin backend, base de datos ni cuentas de usuario.
- [ ] Publicación: Netlify Drop, GitHub Pages, Vercel o FTP (ver `README.md`).

## Publicación

El proyecto es estático: basta con subir la carpeta completa. Para probar en local, usar un servidor (Python, Node o PowerShell) y abrir `http://localhost:8000`; abrir `index.html` con doble clic también funciona.
