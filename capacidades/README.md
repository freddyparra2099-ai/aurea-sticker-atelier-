# Capacidades y funciones disponibles

Esta carpeta reúne, en un solo lugar, **qué se puede hacer** en este proyecto: por un lado las capacidades del agente que lo mantiene y, por otro, las funciones que ya existen en el código de **ÁUREA · Sticker Atelier**.

> Documento vivo. Actualizado por última vez: 06/11/2026.

## Contenido

| Archivo | Qué encontrarás |
| --- | --- |
| [`capacidades-agente.md`](capacidades-agente.md) | Herramientas del agente: archivos, terminal, web, navegador, OpenCode, subagentes, skills y sus límites. |
| [`funciones-proyecto.md`](funciones-proyecto.md) | Referencia de las funciones JavaScript del proyecto, archivo por archivo, con su propósito. |
| [`inventario-proyecto.md`](inventario-proyecto.md) | Páginas, módulos, datos, reglas de precio, almacenamiento y tareas pendientes. |

## Cómo leerlo

- **Si buscas qué puedo hacer yo** (el agente): empieza por `capacidades-agente.md`.
- **Si buscas qué hace la web** (ÁUREA): empieza por `inventario-proyecto.md` y baja a `funciones-proyecto.md` para el detalle técnico.
- **Si vas a modificar código**: revisa primero `funciones-proyecto.md` para reutilizar lo que ya existe en lugar de duplicarlo.

## Convenciones

- Las rutas son relativas a la raíz del proyecto (`Proyecto predeterminado/`).
- Los nombres de funciones coinciden **exactamente** con el código; si renombras una, actualiza esta carpeta.
- Los precios están en dólares (USD) y las reglas se toman de `js/data.js` y `js/app.js`.
- No se incluyen credenciales, rutas personales ni datos sensibles.

## Mantenimiento rápido

1. Al añadir una página o módulo, agrégalo a `inventario-proyecto.md`.
2. Al añadir una función pública (usada desde otra página), documéntala en `funciones-proyecto.md`.
3. Al cambiar una regla de negocio (envío, promo, multiplicadores), actualiza la sección «Reglas» de ambos archivos.
