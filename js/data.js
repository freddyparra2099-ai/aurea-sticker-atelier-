/* Catálogo de ÁUREA. Los precios son la base del tamaño M (8 cm). */
const SIZE_MULT = { S: 0.8, M: 1, L: 1.7 };
const FINISH_ADD = { matte: 0, gloss: 0.5, holo: 1.5 };

const PRODUCTS = [
  {
    id: "luna",
    cat: "celestial",
    price: 6.5,
    accent: "#8b7bff",
    img: "assets/stickers/luna.svg",
    badge: "top",
    rating: 4.9,
    reviews: 214,
    name: { es: "Luna Creciente", en: "Crescent Moon" },
    desc: {
      es: "Una luna dorada para las que brillan de noche. Acabado de tinta metálica sobre fondo tinta.",
      en: "A golden moon for those who shine at night. Metallic ink finish on an ink-black ground."
    }
  },
  {
    id: "ojo",
    cat: "celestial",
    price: 6.9,
    accent: "#e3bd7d",
    img: "assets/stickers/ojo.svg",
    badge: "new",
    rating: 4.8,
    reviews: 96,
    name: { es: "Ojo Protector", en: "Guardian Eye" },
    desc: {
      es: "El amuleto de siempre, dibujado con líneas finas y un iris de oro. Para llevar suerte encima.",
      en: "The classic amulet, drawn with fine lines and a gold iris. Keep a little luck with you."
    }
  },
  {
    id: "rosa",
    cat: "botanical",
    price: 5.9,
    accent: "#c98b9a",
    img: "assets/stickers/rosa.svg",
    badge: null,
    rating: 4.9,
    reviews: 158,
    name: { es: "Rosa Eterna", en: "Eternal Rose" },
    desc: {
      es: "Una rosa de una sola línea, serena y atemporal. Queda preciosa en libretas y portátiles.",
      en: "A single-line rose, calm and timeless. Looks beautiful on notebooks and laptops."
    }
  },
  {
    id: "mariposa",
    cat: "botanical",
    price: 6.5,
    accent: "#e3bd7d",
    img: "assets/stickers/mariposa.svg",
    badge: "top",
    rating: 5.0,
    reviews: 302,
    name: { es: "Mariposa Áurea", en: "Golden Butterfly" },
    desc: {
      es: "Alas simétricas en oro y violeta. Nuestra ilustración más vendida, y con razón.",
      en: "Symmetrical wings in gold and violet. Our best-selling illustration, and for good reason."
    }
  },
  {
    id: "aurora",
    cat: "abstract",
    price: 7.5,
    accent: "#8b7bff",
    img: "assets/stickers/aurora.svg",
    badge: null,
    rating: 4.7,
    reviews: 74,
    name: { es: "Aurora", en: "Aurora" },
    desc: {
      es: "Arcos concéntricos que parecen moverse. Geometría suave para superficies grandes.",
      en: "Concentric arcs that seem to move. Soft geometry for larger surfaces."
    }
  },
  {
    id: "onda",
    cat: "abstract",
    price: 6.2,
    accent: "#7fc2ad",
    img: "assets/stickers/onda.svg",
    badge: null,
    rating: 4.8,
    reviews: 121,
    name: { es: "Marea", en: "Tide" },
    desc: {
      es: "Ondas tranquilas y una esfera de luz. Como mirar el mar desde la orilla.",
      en: "Quiet waves and a sphere of light. Like watching the sea from the shore."
    }
  },
  {
    id: "corazon",
    cat: "retro",
    price: 5.5,
    accent: "#c98b9a",
    img: "assets/stickers/corazon.svg",
    badge: "new",
    rating: 4.6,
    reviews: 63,
    name: { es: "Corazón Cuadros", en: "Checkered Heart" },
    desc: {
      es: "Un clásico de los noventa con acabado limpio. Amor en blanco y negro.",
      en: "A nineties classic with a clean finish. Love in black and white."
    }
  },
  {
    id: "seta",
    cat: "retro",
    price: 5.9,
    accent: "#d98b6a",
    img: "assets/stickers/seta.svg",
    badge: null,
    rating: 4.9,
    reviews: 187,
    name: { es: "Seta Soñadora", en: "Dreamy Mushroom" },
    desc: {
      es: "Una seta de cuento con sombrero rosa polvo. Pequeña, tierna y muy ponible.",
      en: "A storybook mushroom with a dusty rose cap. Small, sweet and very wearable."
    }
  },
  {
    id: "tipografia",
    cat: "typography",
    price: 4.9,
    accent: "#e3bd7d",
    img: "assets/stickers/tipografia.svg",
    badge: null,
    rating: 4.8,
    reviews: 145,
    name: { es: "Stay Wild", en: "Stay Wild" },
    desc: {
      es: "Letras serif y una estrella diminuta. Un recordatorio para no pedir permiso.",
      en: "Serif letters and a tiny star. A reminder not to ask for permission."
    }
  },
  {
    id: "linea",
    cat: "minimal",
    price: 5.5,
    accent: "#c69a58",
    img: "assets/stickers/linea.svg",
    badge: "new",
    rating: 4.9,
    reviews: 89,
    name: { es: "Línea Áurea", en: "Golden Line" },
    desc: {
      es: "Geometría minimal en dorado y violeta. Menos es más, y esto lo es todo.",
      en: "Minimal geometry in gold and violet. Less is more, and this is everything."
    }
  }
];

const CATEGORY_KEYS = ["all", "celestial", "botanical", "abstract", "retro", "typography", "minimal"];

function productById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function priceFor(base, size, finish) {
  const mult = SIZE_MULT[size] || 1;
  const add = FINISH_ADD[finish] || 0;
  return Math.round((base * mult + add) * 100) / 100;
}
