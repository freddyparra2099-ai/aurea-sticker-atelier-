# Proyecto ÁUREA · Sticker Atelier

Tienda de pegatinas personalizables. Sitio **estático** (HTML, CSS y JavaScript clásico, sin dependencias ni build). No hay git.

## Antes de tocar código

Lee `capacidades/README.md`. Según la tarea, consulta:

- `capacidades/inventario-proyecto.md` → páginas, productos, reglas de negocio, almacenamiento y pendientes.
- `capacidades/funciones-proyecto.md` → funciones y constantes existentes (reutilízalas antes de duplicar lógica).
- `capacidades/capacidades-agente.md` → herramientas disponibles y sus límites.

## Convenciones

- Scripts clásicos en orden: `i18n.js` → `data.js` → `app.js` → script de la página.
- Todo texto visible va en `js/i18n.js`, en **español e inglés**. Usa `data-i18n`, `data-i18n-html`, `data-i18n-placeholder`, `data-i18n-aria` o `data-i18n-title`.
- Productos y precios: `js/data.js` (`PRODUCTS`, `SIZE_MULT`, `FINISH_ADD`, `priceFor`).
- No hay Python ni Node instalados. Para probar: abre `index.html` o usa un servidor temporal de PowerShell.
- Respeta el diseño existente, la accesibilidad y `prefers-reduced-motion`. No borres archivos sin investigarlos antes.

## Al terminar

- Verifica los cambios en el navegador si afectan a la interfaz.
- Si añades una función, una página o cambias una regla de negocio, actualiza la carpeta `capacidades/`.
