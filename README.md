# ÁUREA · Sticker Atelier
ÁUREA · Sticker Atelier es un proyecto de diseño y venta de pegatinas ilustradas. Sitio estático, bilingüe (ES/EN) y sin dependencias.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (ej. `aurea-sticker-atelier`).
2. Sube este proyecto al repositorio.
3. Ve a **Settings → Pages**.
4. En **Build and deployment → Branch**, selecciona la rama principal (main o master) y carpeta `/ (root)`.
5. Guarda. En breve tendrás tu sitio en `https://tu-usuario.github.io/aurea-sticker-atelier/`.

## Cómo editar después de publicar

Edita los archivos en tu computadora y vuelve a subirlos (o haz push al repositorio). GitHub Pages se actualizará automáticamente.

## Estructura

```
index.html              Portada y catálogo
producto.html           Detalle de producto
personalizador.html     Creador de pegatinas (con subida de foto)
carrito.html            Carrito y checkout demo

css/styles.css          Sistema de diseño
js/i18n.js              Traducciones ES/EN
js/data.js              Catálogo, precios y multiplicadores
js/app.js               Carrito, formato, avisos, SVG, favoritos
js/home.js              Filtros, buscador, newsletter
js/producto.js          Lógica de la ficha de producto
js/personalizador.js    Estado y vista previa del personalizador
js/carrito.js           Carrito, promo y checkout
js/config.js            Configuración de integraciones (Formspree, Stripe)

assets/stickers/*.svg   Ilustraciones vectoriales
capacidades/            Documentación del proyecto
```

## Código promocional de prueba

`AUREA10` → 10 % de descuento en el carrito.

## Notas

- El carrito, idioma y favoritos usan `localStorage`. El código promo usa `sessionStorage`.
- El checkout es una simulación (no cobra nada). Para pagos reales, configura Stripe en `js/config.js` y añade una función de Netlify si usas Netlify, o tu propio backend.
- No hay backend, base de datos ni cuentas de usuario.
