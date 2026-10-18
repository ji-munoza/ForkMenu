export const productosIniciales = [
  {
    id: "1",
    codigo: "FM-101",
    nombre: "Hamburguesa Clásica",
    precio: 8000,
    stock: 15,
    stockCritico: 3,
    categoria: "hamburguesas",
    descripcion: "Carne 100% vacuno premium, queso cheddar fundido, lechuga fresca, rodajas de tomate y salsa especial de la casa en suave pan brioche artesanal.",
    imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "2",
    codigo: "FM-102",
    nombre: "Pizza Margarita",
    precio: 10000,
    stock: 10,
    stockCritico: 2,
    categoria: "pizzas",
    descripcion: "Masa artesanal a la piedra fermentada 48 horas, salsa de tomates italianos, abundante queso mozzarella y hojas de albahaca fresca con aceite de oliva virgen.",
    imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "3",
    codigo: "FM-103",
    nombre: "Tiramisú Tradizionale",
    precio: 5500,
    stock: 8,
    stockCritico: 2,
    categoria: "postres",
    descripcion: "Clásico postre italiano con finas capas de bizcocho soletilla bañadas en café espresso tostado, suave crema de mascarpone y espolvoreado de cacao puro.",
    imagen: "https://images.unsplash.com/photo-1746473079155-6e7c4b2c6c8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "4",
    codigo: "FM-104",
    nombre: "Limonada Natural Menta-Jengibre",
    precio: 3000,
    stock: 25,
    stockCritico: 5,
    categoria: "bebidas",
    descripcion: "Refrescante limonada preparada con limones recién exprimidos, toques aromáticos de menta silvestre, jengibre y abundante hielo frappé.",
    imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "5",
    codigo: "FM-105",
    nombre: "Hamburguesa Doble Bacon & BBQ",
    precio: 9500,
    stock: 12,
    stockCritico: 3,
    categoria: "hamburguesas",
    descripcion: "Doble medallón de vacuno smash, doble queso cheddar, crujiente tocino ahumado, cebolla caramelizada y salsa barbacoa de la casa.",
    imagen: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "6",
    codigo: "FM-106",
    nombre: "Pizza Pepperoni Suprema",
    precio: 11500,
    stock: 9,
    stockCritico: 2,
    categoria: "pizzas",
    descripcion: "Crujiente masa a la piedra, salsa de tomate Pomodoro, mozzarella premium y doble porción de pepperoni artesanal doradito.",
    imagen: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80"
  }
];

export const usuariosIniciales = [
  {
    run: "11.111.111-1",
    nombre: "Administrador General",
    correo: "admin@forkmenu.cl",
    contrasena: "admin123",
    rol: "admin"
  },
  {
    run: "22.222.222-2",
    nombre: "Vendedor Demo",
    correo: "vendedor@forkmenu.cl",
    contrasena: "vendedor123",
    rol: "vendedor"
  },
  {
    run: "19.011.022-K",
    nombre: "Juan Pérez",
    correo: "juan.perez@duoc.cl",
    contrasena: "cliente123",
    rol: "cliente"
  }
];

export const cuponesDisponibles = {
  "FORK20": { codigo: "FORK20", tipo: "porcentaje", valor: 0.20, descripcion: "20% de descuento en el total" },
  "BIENVENIDA": { codigo: "BIENVENIDA", tipo: "fijo", valor: 3000, descripcion: "$3.000 de descuento de bienvenida" }
};

export const comunasPorRegion = {
  metropolitana: ["Santiago", "Puente Alto", "Maipú", "Providencia", "Las Condes", "Ñuñoa"],
  araucania: ["Temuco", "Villarrica", "Pucón", "Angol"],
  nuble: ["Chillán", "San Carlos", "Bulnes", "Quillón"],
  valparaiso: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Concón"],
  bioBio: ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante", "San Pedro de la Paz"]
};

export const nombresRegiones = {
  metropolitana: "Región Metropolitana",
  araucania: "Región de La Araucanía",
  nuble: "Región de Ñuble",
  valparaiso: "Región de Valparaíso",
  bioBio: "Región del Bío-Bío"
};

export const blogsIniciales = [
  {
    id: "1",
    slug: "secreto-masa-a-la-piedra",
    titulo: "El secreto detrás de nuestra Masa a la Piedra",
    resumen: "Descubre por qué nuestra Pizza Margarita tiene esa textura crujiente por fuera y suave por dentro. Un proceso de fermentación lenta de 48 horas marca toda la diferencia.",
    categoria: "Cocina y Tradición",
    fecha: "15 de Octubre, 2026",
    imagen: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    contenido: [
      "Hacer una buena pizza es fácil; hacer una pizza inolvidable requiere ciencia y paciencia. En ForkMenu, nuestra Pizza Margarita se ha convertido en la favorita de los fines de semana (representando el 38% de las ventas nocturnas). El secreto no está en agregar más ingredientes, sino en perfeccionar la base: nuestra masa.",
      "Utilizamos una combinación de harinas italianas Tipo 00 con alto contenido proteico e hidratación al 65%. La clave maestra reside en la fermentación en frío a 4°C durante un mínimo de 48 horas. Durante este lapso, las levaduras descomponen los azúcares complejos, logrando una masa ligera, sumamente digestiva y con alvéolos aireados inconfundibles.",
      "Finalmente, el horneado a 400°C sobre piedra refractaria sella la corteza en menos de 90 segundos, logrando un equilibrio crocante por fuera y suave como una nube por dentro."
    ]
  },
  {
    id: "2",
    slug: "origen-hamburguesa-clasica",
    titulo: "El origen de nuestra Hamburguesa Clásica",
    resumen: "Más que un plato, es una red de apoyo local. Descubre de dónde provienen nuestros ingredientes y cómo apoyamos a los agricultores de la región.",
    categoria: "Ingredientes & Comunidad",
    fecha: "28 de Septiembre, 2026",
    imagen: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&q=80",
    contenido: [
      "Cada ingrediente de nuestra Hamburguesa Clásica cuenta una historia. No creemos en ingredientes ultraprocesados ni en congelados industriales. Creemos en el trabajo conjunto con pequeños productores locales.",
      "La carne es 100% de vacuno criado con pastoreo libre en praderas del sur de Chile, con un blend exacto de 80% magro y 20% grasa para garantizar jugosidad sin excesos. Los tomates y lechugas hidropónicas provienen de huertos del Valle de Quillota cosechados el mismo día.",
      "Y el pan brioche artesanal se hornea fresco cada madrugada por panaderías de barrio aliadas, usando mantequilla de campo y huevos camperos."
    ]
  }
];
