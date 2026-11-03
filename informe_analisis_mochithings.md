# Informe de análisis — MochiThings · Categoría «Stickers»

**URL analizada:** https://shop.mochithings.com/stationery/stickers  
**Fecha del análisis:** 2 de noviembre de 2026  
**Mercado:** Estados Unidos · Precios en USD  
**Herramientas:** navegador integrado (Chromium) + PowerShell `Invoke-WebRequest` como alternativa a Firecrawl  
**Archivos generados:** `productos_mochithings.json`, `productos_mochithings.csv`, `resumen_categorias.md`

---

## 1. Resumen ejecutivo

- La categoría **Stickers** contiene **900 productos únicos**, distribuidos en **100 páginas de 9 productos**. La paginación visible es una **ventana deslizante de 7 páginas** con Previous/Next; llegar al final exige 99 clics o editar el parámetro `?page=`. Además, la paginación se genera con JavaScript: el HTML servido no incluye enlaces de página, lo que dificulta el rastreo sin JS.
- El catálogo es **muy homogéneo en precio**: mediana **$3.95**, media **$5.19**, mínimo **$0.95** y máximo **$35.95**. El **85,4 %** cuesta menos de $5 y el **52,4 %** se concentra exactamente en **$3.95**.
- Solo **18 productos (2,0 %)** están en oferta, con descuentos del **30 %** (14 productos) o **50 %** (4 productos); el descuento medio es del **34,5 %**.
- El **34,4 %** de los productos (310) ofrece **dos o más variantes** (estilo, color, número de hojas, tamaño); el máximo observado es de **33 variantes**.
- La tienda **no muestra valoraciones ni número de reseñas de producto**. El único indicador social es el número de personas que han marcado el producto como favorito: mediana **335**, máximo **10.312**, suma **509.905**.
- El análisis detallado (descripción, especificaciones, marca, colección, variantes, disponibilidad e imágenes) se completó para **87 productos (9,7 %)**: los 63 de las páginas 1–7, los 18 rebajados y 9 novedades. Los 813 restantes se documentan a nivel de listado.
- La estética dominante es la **papelería coreana kawaii**: ilustración vectorial plana, paletas pastel, bordes troquelados blancos, fotografía de estilo de vida con manos, pinzas y planners, y cabeceras de cartón kraft en las presentaciones.

---

## 2. Descripción de la categoría

### 2.1 Ubicación y navegación

La categoría cuelga de **Stationery → Stickers**:

```
Inicio / Stationery / Stickers
```

Menú principal observado: **Stationery**, **Organization**, **Home & Office**, **2026 Planners**, **Search**, **Help**, **Gift Cards**, **Account**, **Cart**.

Subcategorías propias de la categoría (menú lateral/superior):

| Subcategoría del sitio | URL | Productos contados |
|---|---|---:|
| Collections | `/stationery/stickers/collections` | 1 (página de aterrizaje, no listado) |
| Corner Stickers | `/stationery/stickers/corner-stickers` | 4 |
| Date Stickers | `/stationery/stickers/date-stickers` | 2 |
| Deco Stickers | `/stationery/stickers/deco-stickers` | 857 |
| Emoji Stickers | `/stationery/stickers/emoji-stickers` | 7 |
| Index Stickers | `/stationery/stickers/index-stickers` | 10 |
| Label Stickers | `/stationery/stickers/label-stickers` | 18 |
| Pocket Stickers | `/stationery/stickers/pocket-stickers` | 7 |

> **Importante:** «Deco Stickers» es una etiqueta muy amplia que cubre 857 de los 900 productos (95,2 %). Las subcategorías se solapan entre sí (la suma da 906), por lo que no deben interpretarse como una partición estanca del catálogo.

### 2.2 Ordenación y filtros

Opciones de ordenación disponibles:

- **Popular** (por defecto)
- **Newest**
- **Sale**
- **Price Low to High**
- **Price High to Low**

No existen filtros por precio, color, marca, tamaño, acabado ni valoración. La única navegación facetada es la lista de subcategorías.

### 2.3 Paginación

- **9 productos por página**.
- La paginación visible es una **ventana deslizante de 7 números** alrededor de la página actual, más **‹ Previous** y **Next ›**. Ejemplos observados: página 1 → 1–7; página 50 → 47–53; página 100 → 94–99 (la página actual no aparece como número).
- `?page=1` … `?page=100` devuelven productos; `?page=101` devuelve 0. Es decir, **hay 100 páginas reales (900 productos)**.
- La paginación se renderiza con JavaScript (Pagy): el HTML servido por `Invoke-WebRequest` **no contiene ningún enlace `page=`**, solo las tarjetas de la página actual. Esto limita el descubrimiento de la paginación por crawlers que no ejecutan JS.
- La ordenación «Newest» también alcanza 100 páginas; «Sale» solo tiene 2 páginas (18 productos).

---

## 3. Estructura de las páginas

### 3.1 Página de categoría

- Cabecera con migas de pan y selector de ordenación.
- Rejilla de **3 columnas** en escritorio (9 tarjetas por página).
- Cada tarjeta contiene:
  - imagen cuadrada del producto;
  - miniatura de las variantes (iconos circulares);
  - nombre;
  - precio en USD;
  - contador de favoritos («X people favorited»);
  - insignia de descuento cuando existe («30% Off», «50% Off»).
- Pie con dos tiendas físicas (Seattle Downtown y Tukwila Southcenter), enlaces de ayuda, políticas y redes sociales.

### 3.2 Página de producto

Estructura observada en las 87 fichas detalladas:

- Enlace a la **colección/marca** (por ejemplo, «The LanaLana Collection» → `/brands/lanalana`).
- Nombre (`h1`), precio, contador de favoritos.
- Carrusel de imágenes (fotos de producto y de estilo de vida).
- Pestañas: **Description**, **Gallery**, **Specifications**, **Inventory**.
- Lista de **variantes** con imagen, nombre, precio y botón «Add to Cart».
- Botón **Add to Favorites**.
- Información de recogida en tienda y estimación de entrega.
- Aviso: «Free US ground shipping for orders $100+».

La pestaña **Gallery** se carga de forma diferida mediante un `turbo-frame` (`/products/{id}/gallery.turbo_stream`); por eso las imágenes adicionales se extrajeron del carrusel y del JSON-LD.

### 3.3 Datos estructurados

Cada ficha incluye JSON-LD `schema.org/Product` con:

- `sku`, `mpn`, `name`, `image`, `description` (truncada a ~160 caracteres);
- `brand` = MochiThings;
- `offers.price`, `priceCurrency: USD`, `availability`, `priceValidUntil`.

No se detectó JSON-LD de `AggregateRating` ni de `Review`.

---

## 4. Metodología y cobertura

1. **Inspección inicial** de la URL con el navegador integrado y con `Invoke-WebRequest`.
2. **Verificación de `robots.txt`**: permite el rastreo general (`Allow: /`), solo prohíbe `/cable`. No se accedió a cuentas, carrito ni checkout.
3. **Descubrimiento de la paginación real** mediante sondeos de `?page=N` hasta obtener 0 resultados (100 páginas).
4. **Extracción del listado completo**: 100 páginas × 9 tarjetas = **900 productos**, deduplicados por ID.
5. **Extracción detallada** de 87 fichas: las 63 de las páginas 1–7 (catálogo visible), los 18 productos en oferta y 9 novedades. Se eliminaron 3 duplicados entre conjuntos.
6. **Conteo de subcategorías** recorriendo sus listados hasta la última página.
7. **Análisis visual** de 14 imágenes representativas descargadas y revisadas directamente.
8. **Control de calidad**: unicidad de IDs, campos vacíos, formato de URL, validación HTTP de una muestra y recuento de filas del CSV.

**Limitación de herramienta:** Firecrawl no está disponible en este entorno de OpenCode. Se utilizó el navegador integrado y PowerShell como alternativa compatible. No se realizaron compras ni se eludió ninguna protección.

---

## 5. Análisis de productos

### 5.1 Volumen y precios

| Métrica | Valor |
|---|---:|
| Productos únicos | **900** |
| Páginas de listado | **100** |
| Productos por página | **9** |
| Precio mínimo | **$0.95** |
| Precio máximo | **$35.95** |
| Precio medio | **$5.19** |
| Precio mediano | **$3.95** |
| Productos con precio | 900 (100 %) |

**Distribución por rango de precio:**

| Rango | Productos | % |
|---|---:|---:|
| Menos de $2 | 3 | 0,3 % |
| $2.00 – $2.99 | 114 | 12,7 % |
| $3.00 – $3.99 | 483 | 53,7 % |
| $4.00 – $4.99 | 167 | 18,6 % |
| $5.00 – $9.99 | 71 | 7,9 % |
| $10.00 o más | 62 | 6,9 % |

**Precios más frecuentes:**

| Precio | Productos |
|---:|---:|
| $3.95 | 472 |
| $4.95 | 164 |
| $2.95 | 113 |
| $7.95 | 30 |
| $8.95 | 14 |
| $5.95 | 11 |
| $9.95 | 10 |
| $15.95 | 9 |

El precio de **$3.95** actúa como ancla psicológica del catálogo: más de la mitad de los productos lo usan.

### 5.2 Productos más económicos y más caros

**Más económicos:**

| Producto | Precio | Tipo analítico |
|---|---:|---|
| Christmas Paper Point Sticker | $0.95 | Ilustraciones y otros |
| Robot Name Tag Sticker Set | $1.48 | Etiquetas y nombres |
| 2027 Calendar Sticker | $1.95 | Fechas y calendario |
| Date Label Sticker Set | $1.95 | Etiquetas y nombres |
| Celebration & Birthday 3D Deco Sticker | $1.98 | Deco stickers |

**Más caros:**

| Producto | Precio | Tipo analítico |
|---|---:|---|
| 50pcs Spiral Ring Label Clip Set | $35.95 | Etiquetas y nombres |
| Ardium Multi UV Roll Sticker | $29.95 | Ilustraciones y otros |
| 6pcs Vintage Removable Sticker Set | $29.95 | Ilustraciones y otros |
| 7pcs Basic 6 Ring A5 Binder Set | $29.95 | Ilustraciones y otros |
| 8pcs Afterglow Deco Sticker Set | $21.95 | Deco stickers |
| 10pcs Colorful Typography Sticker Set | $21.95 | Ilustraciones y otros |

Los extremos superiores corresponden a **kits, sets de varias hojas y productos de papelería adyacentes** (organizadores, binders), no a pegatinas individuales.

### 5.3 Descuentos

- **18 productos en oferta (2,0 % del catálogo).**
- **14** con **30 % Off** y **4** con **50 % Off**.
- Descuento medio: **34,5 %**.
- Precio medio de los productos rebajados: **$3.45**.

**Lógica de precios detectada:** en la página de categoría se muestra el **precio rebajado**, mientras que la ficha del producto muestra el **precio base**. Ejemplo: «Big Size Removable Sticker» aparece a **$12.47** en el listado y a **$24.95** en su ficha (50 % Off). Esta diferencia se ha reflejado en el JSON: `precio_actual` = precio rebajado y `precio_original` = precio base.

Ejemplos de ofertas:

| Producto | Precio actual | Precio original | Descuento |
|---|---:|---:|---|
| Big Size Removable Sticker | $12.47 | $24.95 | 50 % |
| Celebration & Birthday 3D Deco Sticker | $1.98 | $3.95 | 50 % |
| Robot Name Tag Sticker Set | $1.48 | $2.95 | 50 % |
| Planning Number Deco Sticker | $4.87 | $6.95 | 30 % |
| Star Ice Hologram Slim Sticker | $3.46 | $4.95 | 30 % |

### 5.4 Disponibilidad

En las 87 fichas detalladas:

- **78** con estado **In Stock** (listo para envío o recogida).
- **9** con «Unavailable at this location» en alguna tienda, pero con disponibilidad online (el JSON-LD sigue marcando `InStock`).
- **0** agotados.

La disponibilidad es **por tienda** (Seattle Downtown / Tukwila Southcenter) y puede variar entre variantes. Para los 813 productos no detallados, la disponibilidad queda a `null`.

### 5.5 Variantes

- **310 productos (34,4 %)** tienen **2 o más variantes**.
- **590 productos** se presentan como referencia única en el listado.
- Máximo observado: **33 variantes**.
- En las 87 fichas: 53 con 2+ variantes y 34 sin variantes.

Tipos de variante observados:

- **Estilo/acabado:** Removable, Transparent, Glossy, Hologram, Glitter, Pearl.
- **Color:** por ejemplo, 9 colores en «Basic Drop Chain Slim Sticker» (Glitter Yellow, Glitter Mint, Clear Gold, Pearl Silver…).
- **Presentación:** 2 sheets / 1 sheet, sets de 2, 3, 6, 12, 18, 48 piezas.
- **Tamaño:** petit, mini, slim, big size.

### 5.6 Favoritos (indicador social)

| Métrica | Valor |
|---|---:|
| Productos con al menos 1 favorito | 895 |
| Productos con 0 favoritos | 5 |
| Mediana | 335 |
| Máximo | 10.312 |
| Suma total | 509.905 |

**Top 12 por favoritos:**

| # | Producto | Favoritos | Precio |
|---:|---|---:|---:|
| 1 | Dailylike Daily Deco Sticker | 10.312 | $4.95 |
| 2 | Color Palette Deco Sticker | 8.679 | $4.95 |
| 3 | Dailylike Daily Deco Sticker v2 | 5.389 | $4.95 |
| 4 | Photo Pocket Sticker Set | 5.175 | $8.95 |
| 5 | Circle Deco Sticker Set | 4.480 | $2.95 |
| 6 | Cat's Day Deco Sticker | 4.034 | $3.95 |
| 7 | Dailylike Daily Deco Sticker v3 | 3.939 | $4.95 |
| 8 | Travel Petit Deco Sticker | 3.938 | $4.95 |
| 9 | Dot Sticker Set | 3.791 | $2.95 |
| 10 | Panda Deco Sticker | 3.721 | $3.95 |
| 11 | Memo Color Palette Sticker | 3.678 | $4.95 |
| 12 | Hello Seattle Sticker | 3.604 | $2.95 |

> **Advertencia:** «favoritos» no equivale a ventas, popularidad real ni valoración. Es una métrica de intención declarada por la propia web. No se afirma que estos sean los más vendidos.

### 5.7 Marcas y colecciones

En las 87 fichas detalladas se identificaron **14 marcas/colecciones**:

| Marca / colección | Productos en la muestra |
|---|---:|
| Suatelier | 27 |
| LanaLana | 21 |
| Love Me More | 10 |
| Petit World | 8 |
| Latech | 8 |
| Dailylike | 3 |
| Pleple | 2 |
| Appree | 2 |
| There's, Livework, By.Nacoo, Morning Glory, Ardium, Paperian | 1 cada una |

La marca se obtiene del atributo `data-telemetry--product-product-brand-param` y la colección del enlace `/brands/{slug}`. Para los 813 productos no detallados, ambos campos quedan a `null`.

---

## 6. Clasificación por tipo (analítica)

La web **no expone una subcategoría por producto** (solo la categoría global «Stickers»). Para poder analizar el catálogo se creó una **clasificación analítica basada en el nombre del producto**, aplicada a los 900 registros y marcada como tal en el campo `tipo_analitico`. No sustituye a la taxonomía del sitio.

| Tipo analítico | Productos | % | Precio medio | Ejemplos |
|---|---:|---:|---:|---|
| Deco stickers | 319 | 35,4 % | $4.11 | Travel Petit Deco Sticker; Seattle Scenery Deco Sticker; Petit Illustration Deco Sticker |
| Animales | 159 | 17,7 % | $4.63 | Jimothy Raccoon Sticker; Lana & Tuxedo Cat Sticker; Panda Deco Sticker |
| Ilustraciones y otros | 132 | 14,7 % | $7.76 | Hello Seattle Sticker; Korean Traditional Mother-of-Pearl Sticker; Masterpiece Mood Sticker Set |
| Botánico y flores | 100 | 11,1 % | $4.62 | Houseplant Deco Sticker; Little Plant Shop Deco Sticker; Fleur Deco Sticker |
| Comida y bebida | 49 | 5,4 % | $4.54 | Seattle Coffee Sticker; Mini Cherry Deco Sticker; Seattle Food Deco Sticker |
| Etiquetas y nombres | 30 | 3,3 % | $8.47 | 2pcs Simple Label Sticker Set; 48pcs Jeju Cat Label Sticker Set; Robot Name Tag Sticker Set |
| Letras y números | 26 | 2,9 % | $6.06 | Flower Letter Deco Sticker; 3D Fun Mix Alphabet Removable Sticker |
| Emojis | 25 | 2,8 % | $4.27 | Mini Mood Emoji Deco Sticker; Kawaii Cats Emoji Sticker; Veggie Emoji Deco Sticker |
| Slim / tiras decorativas | 18 | 2,0 % | $3.59 | Basic Drop Chain Slim Sticker; Ice Castle Slim Sticker; Chandelier Slim Sticker |
| Cintas decorativas (tape/washi) | 12 | 1,3 % | $13.95 | Cat & Duck Mini Deco Tape; Doodle Diary Kiss Cut Tape |
| Funcionales / planificación | 11 | 1,2 % | $5.50 | Black & White Index Sticker Set; Slim Schedule Sticky Note v2 |
| Bolsillo y foto | 5 | 0,6 % | $7.95 | Photo Pocket Sticker Set; Face Photo Petit Deco Sticker |
| Esquinas | 5 | 0,6 % | $4.15 | Writing Corner Deco Sticker; 3pcs Gold Foil Corner Sticker Set |
| Formas y geométricos | 3 | 0,3 % | $3.95 | 3pcs Hologram Shapes Sticker Set; Shape Deco Sticker Set v4 |
| Fechas y calendario | 2 | 0,2 % | $4.45 | 2027 Calendar Sticker; Diary Date Sticker Set |
| Sellos de cera | 2 | 0,2 % | $8.45 | 18pcs Sealing Wax Sticker Set; Wax Seal Pressed Flower Sticker |
| Personajes e ilustraciones | 1 | 0,1 % | $3.95 | Small Friends Removable Sticker |
| Salud y bienestar | 1 | 0,1 % | $2.95 | Mini Medicine Deco Sticker |

**Lectura:** el catálogo está dominado por **deco stickers** (35,4 %) y **animales** (17,7 %), seguidos de ilustraciones y botánica. Las categorías funcionales (índice, etiquetas, fechas) son minoritarias pero tienen **tickets medios más altos** (etiquetas $8.47, tape $13.95).

---

## 7. Análisis visual y de diseño

> Basado en la revisión directa de 14 imágenes representativas. No se infiere el estilo de los 900 productos, solo se describen patrones observados en la muestra.

### 7.1 Estilos de ilustración

1. **Vector plano kawaii** con contornos suaves y colores planos — «Hello Seattle» (LanaLana), «Houseplant Deco Sticker».
2. **Doodle de línea fina** con relleno parcial y lettering manuscrito — «Travel Petit Deco Sticker» (Mogoodi).
3. **Line art minimalista monocromo** — «Mini Mood Emoji Deco Sticker» (Suatelier), caras negras sobre fondo mostaza.
4. **Ilustración de personaje con paleta reducida** — «Jimothy Raccoon Sticker» (LanaLana), marrón/gris/crema.
5. **Ilustración tradicional coreana con efecto nácar** — «Korean Traditional Mother-of-Pearl Sticker» (Petit), tigre, urraca, loto, dragón y borlas sobre fondo negro.
6. **Patrón geométrico holográfico** — «3pcs Hologram Shapes Sticker Set», formas repetidas en rejilla.
7. **Fotografía de producto minimalista** — «Photo Pocket Sticker Set», sobres transparentes y etiquetas en blanco y negro.

### 7.2 Paletas predominantes

- **Pastel coreano:** menta, rosa empolvado, lavanda, amarillo mantequilla, crema.
- **Neutros cálidos:** beige, gris piedra, blanco roto, marrón.
- **Acentos saturados:** rojo, azul cobalto, verde hoja, amarillo mostaza.
- **Efectos especiales:** holográfico arcoíris, nácar iridiscente, glitter, foil dorado.
- **Fondos de contraste:** negro para líneas premium (nácar), mostaza para mini series, cuadros verdes para plantas.

### 7.3 Temáticas visuales

- **Animales:** gatos, perros, osos, mapaches, pandas, conejos, mascotas domésticas.
- **Botánica:** plantas de interior, flores, hojas, cerezos, tréboles.
- **Comida y café:** café de Seattle, donuts, hot dogs, frutas, verduras.
- **Viajes y ciudades:** Seattle (Space Needle, orca, monte Rainier), Tokio, Estados Unidos (Nueva York, Hollywood, ruta 66).
- **Vida cotidiana:** planners, escritorios, camping, librerías, farmacias.
- **Tradición coreana:** motivos de nácar, tigre, urraca, loto.
- **Papelería funcional:** paletas de color, índices, etiquetas, sellos de cera.

### 7.4 Tipografía y lettering

- **Sans redondeada** para nombres de marca y series («Suatelier», «Lanalana», «Mogoodi»).
- **Manuscrita/script** para subtítulos de colección («mini series», «Travel to USA»).
- **Mayúsculas espaciadas** para etiquetas funcionales («HOLOGRAM SHAPES 1», «COLOR PALETTE»).
- **Lettering ilustrado** integrado en la pegatina («SEATTLE», «WASHINGTON», «ALOHA!»).

### 7.5 Presentación y empaquetado

- **Fotografía de estilo de vida:** manos sosteniendo la hoja, pinzas colocando la pegatina, planners y cuadernos como contexto.
- **Fotografía flat lay:** hojas extendidas sobre fondo liso rosa, beige o cuadriculado.
- **Cabeceras de cartón kraft** con troquel para colgar en tienda y texto en negro.
- **Fundas transparentes** con etiqueta impresa y código de barras.
- **Hojas troqueladas** con borde blanco, a menudo 2 hojas por producto.
- **Numeración de serie** visible («no.1093», «no.105», «deco.01»).

### 7.6 URLs de las imágenes analizadas

1. https://assets-production.mochi.media/products/156823/photos/298147-hello-seattle-sticker-fd70f1.jpg
2. https://assets-production.mochi.media/products/135408/photos/260140-travel-petit-deco-sticker-346833.jpg
3. https://assets-production.mochi.media/products/118131/photos/223930-mini-mood-emoji-deco-sticker-c639d4.jpg
4. https://assets-production.mochi.media/products/86536/photos/178184-cat-s-day-deco-sticker-acf77a.jpg
5. https://assets-production.mochi.media/products/156851/photos/307223-houseplant-deco-sticker-ebb1d7.jpg
6. https://assets-production.mochi.media/products/141588/photos/277658-wax-seal-pressed-flower-sticker-0a8304.jpg
7. https://assets-production.mochi.media/products/154980/photos/294399-3pcs-hologram-shapes-sticker-set-051944.jpg
8. https://assets-production.mochi.media/products/128648/photos/245387-basic-drop-chain-slim-sticker-186e5c.jpg
9. https://assets-production.mochi.media/products/99489/photos/square_thumbnail_217346-photo-pocket-sticker-set-3cb7e9.jpg
10. https://assets-production.mochi.media/products/162232/photos/306652-18pcs-sealing-wax-sticker-set-aa4da3.jpg
11. https://assets-production.mochi.media/products/161726/photos/304706-korean-traditional-mother-of-pearl-sticker-04d989.jpg
12. https://assets-production.mochi.media/products/63936/photos/130419-dailylike-daily-deco-sticker-54e8a0.jpg
13. https://assets-production.mochi.media/products/89787/photos/square_thumbnail_184760-color-palette-deco-sticker-57f4c8.jpg
14. https://assets-production.mochi.media/products/163791/photos/310908-jimothy-raccoon-sticker-0b37f0.jpg

---

## 8. Observaciones comerciales

1. **Precio de impulso.** El 85,4 % del catálogo está por debajo de $5 y el 52,4 % exactamente en $3.95. Es una estructura de precios de compra por impulso, típica de papelería de regalo.
2. **Ancla única.** La concentración en $3.95 reduce la fricción de decisión, pero también limita el margen y la diferenciación por precio. Los sets y kits ($7.95–$35.95) son la vía de ticket alto.
3. **Descuentos escasos y controlados.** Solo el 2 % está rebajado, con dos escalones claros (30 % y 50 %). No hay promociones cruzadas visibles ni cupones en la categoría.
4. **Social proof basada en favoritos.** Al no haber reseñas, el contador de favoritos es el principal indicador de interés. Los productos con más favoritos son hojas deco, paletas de color y sets funcionales, no necesariamente los más caros.
5. **Curaduría de marcas.** La presencia de Suatelier, LanaLana, Love Me More, Petit World, Latech y Dailylike sugiere una selección editorial de papelería coreana y de autor, más que una marca blanca.
6. **Identidad local.** Los productos «Seattle» (Hello Seattle, Seattle Scenery, Seattle Coffee, Seattle Food) conectan la tienda con su comunidad y sus dos tiendas físicas.
7. **Catálogo profundo pero poco navegable.** 900 productos en 100 páginas, sin filtros y con una paginación de ventana deslizante que obliga a 99 clics para llegar al final. Además, los enlaces de paginación se generan con JavaScript y no aparecen en el HTML servido, lo que dificulta el rastreo. Es una oportunidad clara de mejora en UX y SEO.
8. **Ausencia de reseñas de producto.** No hay `AggregateRating` ni módulo de opiniones. La única prueba social es el número de favoritos y las «Store Reviews» externas. Esto limita la confianza en productos de precio alto.
9. **Variantes como palanca de surtido.** Un tercio del catálogo ofrece variantes de color/acabado; el máximo de 33 variantes indica productos «paraguas» que concentran muchas referencias.
10. **Envío y recogida.** El aviso de «Free US ground shipping for orders $100+» y la recogida en tienda aparecen en la ficha, no en la categoría. El umbral de $100 es alto para un ticket medio de $3.95–$5.

---

## 9. Limitaciones encontradas

- **Firecrawl no disponible.** El entorno de OpenCode no expone herramientas de Firecrawl (scrape/map/crawl). Se usó el navegador integrado y PowerShell `Invoke-WebRequest` como alternativa. No se pudo usar la API de Firecrawl ni su modo `extract`.
- **Cobertura detallada del 9,7 %.** Solo 87 de los 900 productos tienen descripción, especificaciones, marca, colección, disponibilidad e imágenes adicionales. Los 813 restantes tienen datos de listado (nombre, precio, descuento, favoritos, imagen, variantes) y `null` en los campos no disponibles.
- **Muestra no aleatoria.** Las 87 fichas corresponden a las 7 primeras páginas (orden «Popular»), a los 18 rebajados y a 9 novedades. La media de precio ($3.86) y de favoritos (1.209) de la muestra **no es extrapolable** al catálogo completo.
- **Sin valoraciones ni reseñas de producto.** La web no publica rating ni número de reseñas por producto; ambos campos quedan a `null`. No se inventaron datos.
- **Precio original solo en ofertas.** Para los productos sin descuento no se muestra un precio anterior; `precio_original` es `null`.
- **Galería diferida.** Las imágenes adicionales se obtuvieron del carrusel y del JSON-LD, no del `turbo-frame` de galería. Es posible que falten imágenes que solo aparecen en esa pestaña.
- **Subcategorías solapadas.** «Deco Stickers» cubre 857 productos y las subcategorías suman 906, por lo que los conteos no son una partición. No se recorrió la pertenencia individual de cada producto a cada subcategoría.
- **Disponibilidad variable por tienda.** El estado «Unavailable at this location» se refiere a una tienda concreta; el JSON-LD puede seguir indicando `InStock` online. Se normalizó a «In Stock» cuando el producto estaba disponible online.
- **Paginación dependiente de JavaScript.** El HTML servido no incluye los enlaces de paginación; estos se generan en el cliente. El descubrimiento de las 100 páginas se hizo sondeando `?page=N`, no siguiendo enlaces del HTML.
- **Instantánea temporal.** Precios, stock y favoritos se capturaron el 2 de noviembre de 2026 y pueden cambiar.
- **Sin acceso a cuentas, carrito ni checkout.** No se intentó comprar ni acceder a áreas privadas.

---

## 10. Control de calidad

| Comprobación | Resultado |
|---|---|
| Productos únicos | **900** |
| IDs duplicados | **0** |
| Nombres vacíos | **0** |
| Precios nulos | **0** |
| URLs con formato correcto | **900 / 900** |
| Muestra de URLs de producto verificadas (HTTP) | **8 / 8 → 200** |
| URL de variante verificada | **1 / 1 → 200** |
| Filas del CSV | **901** (cabecera + 900) |
| Fichas detalladas completas | **87 / 87** con descripción, specs, marca, colección, imágenes y disponibilidad |
| Registros incompletos | **813** (solo listado; documentado) |
| Productos agotados en la muestra | **0** |

**Páginas no rastreadas:** endpoints `gallery.turbo_stream` de cada producto, pertenencia individual a las 8 subcategorías, páginas de cuenta/carrito/checkout y reseñas externas de tienda.

---

## 11. Archivos generados

| Archivo | Contenido |
|---|---|
| `productos_mochithings.json` | 900 productos con todos los campos extraídos; `null`/`[]` cuando no hay dato |
| `productos_mochithings.csv` | Una fila por producto, columnas principales y variantes concatenadas |
| `informe_analisis_mochithings.md` | Este informe |
| `resumen_categorias.md` | Categorías del sitio y clasificación analítica con conteos y ejemplos |

### Campos del JSON

`id`, `nombre`, `descripcion`, `precio_actual`, `moneda`, `precio_original`, `descuento`, `disponibilidad`, `disponible`, `marca`, `coleccion`, `categoria`, `subcategoria`, `tipo_analitico`, `variantes`, `variantes_detalle`, `url_producto`, `imagen_principal`, `imagenes_adicionales`, `valoracion`, `numero_resenas`, `favoritos`, `sku`, `especificaciones`, `analizado_en_profundidad`, `pagina_listado`, `posicion_listado`.

> `categoria` = «Stickers» (categoría del sitio). `subcategoria` = `null` porque la web no la expone por producto. `tipo_analitico` = clasificación propia basada en el nombre, claramente identificada como analítica.

---

**Fin del informe.**
