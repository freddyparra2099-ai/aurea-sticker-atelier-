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
| `personalizador.html` | Creación de pegatina con vista previa SVG en vivo y precio dinámico. | `i18n`, `data`, `app`, `personalizador` |
| `carrito.html` | Carrito persistente, código promo, envío gratis y checkout modal de demostración. | `i18n`, `data`, `app`, `carrito` |

## Secciones de la portada

- **Hero** animado (respeta `prefers-reduced-motion`).
- **Tienda** (`#tienda`): 9 productos, 5 categorías, buscador, orden por precio y estado vacío.
- **Personaliza** (`#personaliza`): teaser con vista previa.
- **Opiniones** (`#opiniones`).
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
| Tamaños | S ×0,8 · M ×1 · L ×1,7 | `SIZE_MULT` |
| Acabados | Mate +$0 · Brillo +$0.50 · Holo +$1.50 | `FINISH_ADD` |
| Personalizado | Base $7.50 (tamaño M) | `CUSTOM_BASE_PRICE` |
| Personalizado con foto | Imagen de fondo en el sticker (data URL) | `buildStickerSVG` |
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
  img: "assets/stickers/luna.svg",
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
