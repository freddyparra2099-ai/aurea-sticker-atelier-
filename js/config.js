/* ÁUREA · configuración de integraciones
 *
 * Este archivo es el único que necesitas tocar para conectar la tienda
 * con servicios reales. No contiene secretos: las claves de Stripe viven
 * en las variables de entorno de Netlify.
 */
const SITE_CONFIG = {
  /* Formspree: crea un formulario en https://formspree.io y pega aquí su endpoint.
   * Ejemplo: "https://formspree.io/f/abcdwxyz". Si queda vacío, el boletín
   * funciona en modo demo y avisa de que no está conectado. */
  newsletterEndpoint: "",

  /* "demo" = checkout simulado (no cobra).
   * "live" = envía el carrito a Netlify y redirige a Stripe Checkout. */
  checkoutMode: "demo",

  /* Ruta de la función de Netlify que crea la sesión de pago. */
  checkoutEndpoint: "/.netlify/functions/checkout",

  /* Moneda de la tienda. */
  currency: "EUR"
};
