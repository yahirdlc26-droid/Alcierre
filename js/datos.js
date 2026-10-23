/* =====================================================================
   DATOS DEL PROYECTO  —  ESTE ES EL ARCHIVO QUE MÁS VAS A EDITAR
   =====================================================================
   Aquí cambias: nombre de la marca, textos principales, restaurantes,
   productos, precios, horarios, fotografías y preguntas frecuentes.

   Reglas sencillas para no romper nada:
   1. Cambia solo lo que está entre comillas "..." o los números.
   2. No borres las comas (,) al final de cada línea.
   3. Cada restaurante y cada producto necesita un "id" ÚNICO,
      en minúsculas y sin espacios (usa guiones: "mi-restaurante").
   4. Las rutas de imágenes empiezan con "img/..." (carpeta img del proyecto).
   5. Los precios van SIN signo de pesos y sin comas: 89 o 129.5
   Los colores se cambian en: css/estilos.css (primeras líneas).
   ===================================================================== */

/* ---------------------------------------------------------------
   1) MARCA Y TEXTOS GENERALES
   --------------------------------------------------------------- */
const MARCA = {
  nombre: "Al Cierre",                        // Nombre del proyecto (la última palabra se pinta en naranja)
  logo: "img/marca/logo.png",                 // Ícono del logotipo (reloj). Logo completo: img/marca/logo-completo.png
  eslogan: "Lo mejor del día, al cierre y a mejor precio.",
  ciudad: "Delicias, Chihuahua",
  correo: "hola@alcierre.mx",                 // Correo de ejemplo
  instagram: "@alcierre.mx",                  // Red social de ejemplo
  escuela: "Proyecto escolar de emprendimiento",

  // Sección de inicio (la parte grande de arriba)
  inicio: {
    etiqueta: "Comida rica antes de que cierren",
    titulo: "La comida que sobra hoy, en tu mesa a mitad de precio.",
    texto:
      "Conectamos restaurantes de tu zona con personas que quieren comer rico " +
      "y pagar menos. Compra un paquete sorpresa o elige un platillo específico, " +
      "recógelo en el horario indicado y ayuda a reducir el desperdicio de alimentos.",
    // Cifras de ejemplo para la presentación (puedes cambiarlas)
    cifras: [
      { valor: "6", texto: "restaurantes en Delicias" },
      { valor: "hasta 60%", texto: "de descuento" },
      { valor: "1,240 kg", texto: "de comida rescatada*" },
    ],
    notaCifras: "*Cifra ilustrativa para la demostración.",
  },
};

/* ---------------------------------------------------------------
   2) RESTAURANTES
   Para agregar uno nuevo: copia un bloque completo { ... },
   pégalo debajo, cambia el "id" y los datos.
   Opcional: puedes agregar  calificacion: 4.8, resenas: 120,
   solo si son datos reales del restaurante.
   Fotos: guarda las imágenes en img/restaurantes/<id-del-restaurante>/
   Tamaños recomendados: portada 1600x700 px, logo cuadrado 400x400 px.
   --------------------------------------------------------------- */
const RESTAURANTES = [
  {
    id: "pepes-burger",
    nombre: "Pepe's Burger",
    categoria: "Hamburguesas",
    logo: "img/restaurantes/pepes-burger/logo.png",
    portada: "img/restaurantes/pepes-burger/portada.jpg",
    descripcion:
      "Hamburguesas de res y de pollo acompañadas de papas fritas. Al cierre del día " +
      "ofrece sus hamburguesas a mitad de precio para que no se desperdicien.",
    direccion: "Av. Segunda Ote. 107, Oriente 1, 33000 Delicias, Chih.",
    zona: "Oriente 1, Delicias",
    horarioAtencion: "Abierto de 13:00 a 22:00",   // ← HORARIO DE EJEMPLO: confirmar con el restaurante
    horarioRecoleccion: "21:00 a 22:00",          // ← DE EJEMPLO: confirmar con el restaurante
  },
  {
    id: "trinken-bar",
    nombre: "Trinken Bar",
    categoria: "Bar y botanas",
    logo: "img/restaurantes/trinken-bar/logo.png",
    portada: "img/restaurantes/trinken-bar/portada.jpg",
    descripcion:
      "Bar de vinos y cócteles con cocina: hamburguesas, boneless, tiras de pollo y " +
      "ensaladas. En la última hora rescata la comida preparada del día.",
    direccion: "Calle Tercera Nte. 403, Nte 2, 33000 Delicias, Chih.",
    zona: "Norte 2, Delicias",
    horarioAtencion: "Abierto de 20:00 a 02:00",
    horarioRecoleccion: "01:00 a 02:00",
  },
  {
    id: "toki-pollo",
    nombre: "Toki Pollo",
    categoria: "Pollo",
    logo: "img/restaurantes/toki-pollo/logo.png",
    portada: "img/restaurantes/toki-pollo/portada.jpg",
    descripcion:
      "Pollo frito por pieza, nuggets y puré de papa. Lo que queda antes de cerrar " +
      "se ofrece en paquetes y piezas a precio de rescate.",
    direccion: "Av. 6a. Sur #800-A, Sur 1, 33000 Delicias, Chih.",
    zona: "Sur 1, Delicias",
    horarioAtencion: "Abierto de 12:00 a 16:00",
    horarioRecoleccion: "15:00 a 16:00",
  },
  {
    id: "the-lucky-ones",
    nombre: "The Lucky Ones",
    categoria: "Hamburguesas",
    logo: "img/restaurantes/the-lucky-ones/logo.png",
    portada: "img/restaurantes/the-lucky-ones/portada.jpg",
    descripcion:
      "Hamburguesas de res, boneless, papas fritas y nachos con queso para la noche. " +
      "Antes del cierre ofrece lo que quedó listo a mitad de precio.",
    direccion: "Calle 2a. Nte. 378, Nte 2, 33000 Delicias, Chih.",
    zona: "Norte 2, Delicias",
    horarioAtencion: "Abierto de 21:00 a 00:30",
    horarioRecoleccion: "23:30 a 00:30",
  },
  {
    id: "tortas-el-buen-gusto",
    nombre: "Tortas El Buen Gusto",
    categoria: "Tortas",
    logo: "img/restaurantes/tortas-el-buen-gusto/logo.png",
    portada: "img/restaurantes/tortas-el-buen-gusto/portada.jpg",
    descripcion:
      "Tortería tradicional desde 1967: tortas de lomo, tortas de jamón y hamburguesas " +
      "de res. Al final de la noche vende lo que sobra a precio de rescate.",
    direccion: "Calle Primera Nte. 15, Centro, 33000 Delicias, Chih.",
    zona: "Centro, Delicias",
    horarioAtencion: "Abierto de 20:00 a 23:00",
    horarioRecoleccion: "22:00 a 23:00",
  },
  {
    id: "pollos-menys",
    nombre: "Pollos Meny's",
    categoria: "Pollo",
    logo: "img/restaurantes/pollos-menys/logo.png",
    portada: "img/restaurantes/pollos-menys/portada.jpg",
    descripcion:
      "Pollo asado y papa asada, con calidad y sabor. En la última hora rescata el " +
      "pollo que ya está listo para que no se desperdicie.",
    direccion: "Av. 2a. Pte. 213, Poniente, 33000 Delicias, Chih.",
    zona: "Poniente, Delicias",
    horarioAtencion: "Abierto de 15:00 a 18:00",
    horarioRecoleccion: "17:00 a 18:00",
  },
];

/* ---------------------------------------------------------------
   3) PRODUCTOS
   Cada producto pertenece a UN restaurante mediante "restaurante"
   (debe ser igual al "id" del restaurante).

   tipo: "sorpresa"  → paquete sorpresa (contenido no exacto)
         "producto"  → producto específico (se sabe qué es)
   precioOriginal: precio normal (si no hay descuento, pon el mismo que precio)
   precio:         precio que paga el cliente
   disponibles:    unidades disponibles hoy (0 = agotado)
   recoleccion:    horario para recoger
   posibleContenido: SOLO para sorpresas; ejemplos de lo que PODRÍA incluir
   etiquetas: palabras cortas opcionales, por ejemplo "Picante"

   NOTA: los precios son ILUSTRATIVOS (aprox. la mitad del precio normal).
   Confírmalos con cada restaurante.
   --------------------------------------------------------------- */
const PRODUCTOS = [
  /* ---------- Pepe's Burger ---------- */
  {
    id: "pb-sorpresa", restaurante: "pepes-burger", tipo: "sorpresa",
    nombre: "Bolsa sorpresa Pepe's",
    descripcion: "Lo que quede al cierre: una hamburguesa del día con su acompañamiento.",
    imagen: "img/restaurantes/pepes-burger/sorpresa.jpg",
    precioOriginal: 160, precio: 65, disponibles: 5, recoleccion: "21:00 a 22:00",
    posibleContenido: ["Hamburguesa de res o de pollo", "Papas fritas", "Aderezos de la casa"],
    etiquetas: [],
  },
  {
    id: "pb-res", restaurante: "pepes-burger", tipo: "producto",
    nombre: "Hamburguesa de res con papas",
    descripcion: "Carne de res a la plancha, queso, verduras frescas y orden de papas fritas.",
    imagen: "img/restaurantes/pepes-burger/hamburguesa-res.jpg",
    precioOriginal: 140, precio: 70, disponibles: 4, recoleccion: "21:00 a 22:00",
    etiquetas: ["Incluye papas"],
  },
  {
    id: "pb-pollo", restaurante: "pepes-burger", tipo: "producto",
    nombre: "Hamburguesa de pollo con papas",
    descripcion: "Pechuga de pollo empanizada, lechuga, jitomate y papas fritas.",
    imagen: "img/restaurantes/pepes-burger/hamburguesa-pollo.jpg",
    precioOriginal: 135, precio: 68, disponibles: 3, recoleccion: "21:00 a 22:00",
    etiquetas: ["Incluye papas"],
  },
  {
    id: "pb-doble", restaurante: "pepes-burger", tipo: "producto",
    nombre: "Hamburguesa doble de res",
    descripcion: "Doble carne de res con doble queso y papas fritas.",
    imagen: "img/restaurantes/pepes-burger/hamburguesa-doble.jpg",
    precioOriginal: 170, precio: 85, disponibles: 2, recoleccion: "21:00 a 22:00",
    etiquetas: ["Incluye papas"],
  },
  {
    id: "pb-papas", restaurante: "pepes-burger", tipo: "producto",
    nombre: "Orden de papas fritas",
    descripcion: "Papas fritas crujientes con catsup.",
    imagen: "img/restaurantes/pepes-burger/papas-fritas.jpg",
    precioOriginal: 60, precio: 30, disponibles: 6, recoleccion: "21:00 a 22:00",
    etiquetas: [],
  },

  /* ---------- Trinken Bar ---------- */
  {
    id: "tb-sorpresa", restaurante: "trinken-bar", tipo: "sorpresa",
    nombre: "Caja sorpresa Trinken",
    descripcion: "Una selección de la cocina del bar preparada esta noche. Alcanza para 1 o 2 personas.",
    imagen: "img/restaurantes/trinken-bar/sorpresa.jpg",
    precioOriginal: 240, precio: 95, disponibles: 4, recoleccion: "01:00 a 02:00",
    posibleContenido: ["Boneless o tiras de pollo", "Hamburguesa", "Ensalada o papas"],
    etiquetas: [],
  },
  {
    id: "tb-hamburguesa", restaurante: "trinken-bar", tipo: "producto",
    nombre: "Hamburguesa Trinken",
    descripcion: "Hamburguesa de res con queso, verduras y aderezo de la casa.",
    imagen: "img/restaurantes/trinken-bar/hamburguesa.jpg",
    precioOriginal: 150, precio: 75, disponibles: 3, recoleccion: "01:00 a 02:00",
    etiquetas: [],
  },
  {
    id: "tb-boneless", restaurante: "trinken-bar", tipo: "producto",
    nombre: "Boneless (10 piezas)",
    descripcion: "Trozos de pollo empanizado con salsa a elegir: búfalo, BBQ o mango habanero.",
    imagen: "img/restaurantes/trinken-bar/boneless.jpg",
    precioOriginal: 160, precio: 80, disponibles: 3, recoleccion: "01:00 a 02:00",
    etiquetas: ["Picante"],
  },
  {
    id: "tb-tiras", restaurante: "trinken-bar", tipo: "producto",
    nombre: "Tiras de pollo con papas",
    descripcion: "Tiras de pechuga empanizada con papas fritas y aderezo ranch.",
    imagen: "img/restaurantes/trinken-bar/tiras-pollo.jpg",
    precioOriginal: 140, precio: 70, disponibles: 2, recoleccion: "01:00 a 02:00",
    etiquetas: [],
  },
  {
    id: "tb-ensalada", restaurante: "trinken-bar", tipo: "producto",
    nombre: "Ensalada de pollo",
    descripcion: "Lechuga, jitomate, pepino, crutones y pollo a la plancha.",
    imagen: "img/restaurantes/trinken-bar/ensalada.jpg",
    precioOriginal: 130, precio: 65, disponibles: 2, recoleccion: "01:00 a 02:00",
    etiquetas: [],
  },

  /* ---------- Toki Pollo ---------- */
  {
    id: "tp-sorpresa", restaurante: "toki-pollo", tipo: "sorpresa",
    nombre: "Bolsa sorpresa Toki",
    descripcion: "Pollo frito y complementos que quedaron listos antes de cerrar.",
    imagen: "img/restaurantes/toki-pollo/sorpresa.jpg",
    precioOriginal: 190, precio: 75, disponibles: 5, recoleccion: "15:00 a 16:00",
    posibleContenido: ["2 a 4 piezas de pollo frito", "Nuggets", "Puré de papa"],
    etiquetas: [],
  },
  {
    id: "tp-pieza", restaurante: "toki-pollo", tipo: "producto",
    nombre: "Pieza de pollo frito",
    descripcion: "Una pieza de pollo empanizado y crujiente (pierna, muslo o pechuga, según haya).",
    imagen: "img/restaurantes/toki-pollo/pieza-pollo.jpg",
    precioOriginal: 38, precio: 19, disponibles: 10, recoleccion: "15:00 a 16:00",
    etiquetas: ["Por pieza"],
  },
  {
    id: "tp-paquete", restaurante: "toki-pollo", tipo: "producto",
    nombre: "Paquete 4 piezas con puré",
    descripcion: "Cuatro piezas de pollo frito con una orden de puré de papa.",
    imagen: "img/restaurantes/toki-pollo/paquete-4.jpg",
    precioOriginal: 180, precio: 90, disponibles: 2, recoleccion: "15:00 a 16:00",
    etiquetas: ["Para compartir"],
  },
  {
    id: "tp-nuggets", restaurante: "toki-pollo", tipo: "producto",
    nombre: "Nuggets de pollo (10 piezas)",
    descripcion: "Nuggets dorados con catsup o aderezo.",
    imagen: "img/restaurantes/toki-pollo/nuggets.jpg",
    precioOriginal: 95, precio: 48, disponibles: 4, recoleccion: "15:00 a 16:00",
    etiquetas: [],
  },
  {
    id: "tp-pure", restaurante: "toki-pollo", tipo: "producto",
    nombre: "Puré de papa",
    descripcion: "Orden de puré de papa cremoso con gravy.",
    imagen: "img/restaurantes/toki-pollo/pure.jpg",
    precioOriginal: 40, precio: 20, disponibles: 0, recoleccion: "15:00 a 16:00",
    etiquetas: [],
  },

  /* ---------- The Lucky Ones ---------- */
  {
    id: "lo-sorpresa", restaurante: "the-lucky-ones", tipo: "sorpresa",
    nombre: "Bolsa sorpresa Lucky",
    descripcion: "Una selección de lo que se preparó esta noche. ¡Para los afortunados!",
    imagen: "img/restaurantes/the-lucky-ones/sorpresa.jpg",
    precioOriginal: 220, precio: 89, disponibles: 4, recoleccion: "23:30 a 00:30",
    posibleContenido: ["Hamburguesa de res o boneless", "Papas fritas", "Nachos con queso"],
    etiquetas: [],
  },
  {
    id: "lo-hamburguesa", restaurante: "the-lucky-ones", tipo: "producto",
    nombre: "Hamburguesa de res",
    descripcion: "Carne de res a la parrilla, queso amarillo, lechuga, jitomate y cebolla.",
    imagen: "img/restaurantes/the-lucky-ones/hamburguesa-res.jpg",
    precioOriginal: 150, precio: 75, disponibles: 3, recoleccion: "23:30 a 00:30",
    etiquetas: [],
  },
  {
    id: "lo-boneless", restaurante: "the-lucky-ones", tipo: "producto",
    nombre: "Boneless (8 piezas)",
    descripcion: "Pollo empanizado sin hueso bañado en salsa, con apio y aderezo.",
    imagen: "img/restaurantes/the-lucky-ones/boneless.jpg",
    precioOriginal: 150, precio: 75, disponibles: 2, recoleccion: "23:30 a 00:30",
    etiquetas: ["Picante"],
  },
  {
    id: "lo-papas", restaurante: "the-lucky-ones", tipo: "producto",
    nombre: "Papas fritas",
    descripcion: "Orden grande de papas fritas sazonadas.",
    imagen: "img/restaurantes/the-lucky-ones/papas-fritas.jpg",
    precioOriginal: 65, precio: 32, disponibles: 5, recoleccion: "23:30 a 00:30",
    etiquetas: [],
  },
  {
    id: "lo-nachos", restaurante: "the-lucky-ones", tipo: "producto",
    nombre: "Nachos con queso",
    descripcion: "Totopos con queso amarillo derretido y jalapeños.",
    imagen: "img/restaurantes/the-lucky-ones/nachos.jpg",
    precioOriginal: 90, precio: 45, disponibles: 4, recoleccion: "23:30 a 00:30",
    etiquetas: ["Para compartir"],
  },

  /* ---------- Tortas El Buen Gusto ---------- */
  {
    id: "bg-sorpresa", restaurante: "tortas-el-buen-gusto", tipo: "sorpresa",
    nombre: "Bolsa sorpresa El Buen Gusto",
    descripcion: "Tortas y hamburguesas que quedaron al final de la noche.",
    imagen: "img/restaurantes/tortas-el-buen-gusto/sorpresa.jpg",
    precioOriginal: 170, precio: 65, disponibles: 5, recoleccion: "22:00 a 23:00",
    posibleContenido: ["Torta de lomo o de jamón", "Hamburguesa de res", "Chiles o salsa"],
    etiquetas: [],
  },
  {
    id: "bg-lomo", restaurante: "tortas-el-buen-gusto", tipo: "producto",
    nombre: "Torta de lomo",
    descripcion: "Pan telera, lomo de cerdo, frijoles, aguacate, jitomate y chiles.",
    imagen: "img/restaurantes/tortas-el-buen-gusto/torta-lomo.jpg",
    precioOriginal: 90, precio: 45, disponibles: 6, recoleccion: "22:00 a 23:00",
    etiquetas: ["La más pedida"],
  },
  {
    id: "bg-jamon", restaurante: "tortas-el-buen-gusto", tipo: "producto",
    nombre: "Torta de jamón",
    descripcion: "Pan telera, jamón, queso, frijoles, aguacate y jitomate.",
    imagen: "img/restaurantes/tortas-el-buen-gusto/torta-jamon.jpg",
    precioOriginal: 75, precio: 38, disponibles: 5, recoleccion: "22:00 a 23:00",
    etiquetas: [],
  },
  {
    id: "bg-hamburguesa", restaurante: "tortas-el-buen-gusto", tipo: "producto",
    nombre: "Hamburguesa de res",
    descripcion: "Hamburguesa sencilla de res con queso y verduras.",
    imagen: "img/restaurantes/tortas-el-buen-gusto/hamburguesa-res.jpg",
    precioOriginal: 85, precio: 43, disponibles: 3, recoleccion: "22:00 a 23:00",
    etiquetas: [],
  },

  /* ---------- Pollos Meny's ---------- */
  {
    id: "pm-sorpresa", restaurante: "pollos-menys", tipo: "sorpresa",
    nombre: "Bolsa sorpresa Meny's",
    descripcion: "Pollo asado y acompañamientos que quedaron listos en la última hora.",
    imagen: "img/restaurantes/pollos-menys/sorpresa.jpg",
    precioOriginal: 200, precio: 79, disponibles: 4, recoleccion: "17:00 a 18:00",
    posibleContenido: ["Medio pollo o piezas de pollo asado", "Papa asada", "Tortillas y salsa"],
    etiquetas: [],
  },
  {
    id: "pm-entero", restaurante: "pollos-menys", tipo: "producto",
    nombre: "Pollo asado entero",
    descripcion: "Pollo entero asado al carbón con tortillas y salsa.",
    imagen: "img/restaurantes/pollos-menys/pollo-entero.jpg",
    precioOriginal: 250, precio: 125, disponibles: 3, recoleccion: "17:00 a 18:00",
    etiquetas: ["Para compartir"],
  },
  {
    id: "pm-medio", restaurante: "pollos-menys", tipo: "producto",
    nombre: "Medio pollo asado",
    descripcion: "Medio pollo asado al carbón con tortillas y salsa.",
    imagen: "img/restaurantes/pollos-menys/medio-pollo.jpg",
    precioOriginal: 140, precio: 70, disponibles: 4, recoleccion: "17:00 a 18:00",
    etiquetas: [],
  },
  {
    id: "pm-papa", restaurante: "pollos-menys", tipo: "producto",
    nombre: "Papa asada",
    descripcion: "Papa asada con mantequilla, queso y crema.",
    imagen: "img/restaurantes/pollos-menys/papa-asada.jpg",
    precioOriginal: 45, precio: 23, disponibles: 6, recoleccion: "17:00 a 18:00",
    etiquetas: [],
  },
  {
    id: "pm-familiar", restaurante: "pollos-menys", tipo: "producto",
    nombre: "Paquete familiar",
    descripcion: "Pollo asado entero con 2 papas asadas, tortillas y salsa.",
    imagen: "img/restaurantes/pollos-menys/paquete-familiar.jpg",
    precioOriginal: 330, precio: 165, disponibles: 1, recoleccion: "17:00 a 18:00",
    etiquetas: ["Para compartir"],
  },
];

/* ---------------------------------------------------------------
   4) PREGUNTAS FRECUENTES
   --------------------------------------------------------------- */
const PREGUNTAS = [
  {
    pregunta: "¿Qué es un paquete sorpresa?",
    respuesta:
      "Es una bolsa o caja con alimentos que el restaurante preparó ese día y no vendió. " +
      "Sabes de qué restaurante es, cuánto cuesta, una descripción general y a qué hora recogerlo, " +
      "pero el contenido exacto cambia cada día. Mostramos ejemplos de lo que podría incluir, sin prometer productos específicos.",
  },
  {
    pregunta: "¿En qué se diferencia de un producto específico?",
    respuesta:
      "En un producto específico ves exactamente qué compras: su foto, descripción, precio y cuántas unidades quedan. " +
      "Es ideal si ya sabes qué se te antoja.",
  },
  {
    pregunta: "¿La comida es segura?",
    respuesta:
      "Sí. Son alimentos en buen estado que se prepararon el mismo día; simplemente no se vendieron. " +
      "Cada restaurante es responsable de su manejo e higiene. Te recomendamos consumirlos el mismo día o refrigerarlos.",
  },
  {
    pregunta: "¿Por qué solo puedo comprar a un restaurante por pedido?",
    respuesta:
      "Para que la recolección sea sencilla: cada pedido se recoge en un solo lugar y en un solo horario. " +
      "Si quieres comprar en otro restaurante, termina tu pedido actual o vacía tu carrito y empieza uno nuevo.",
  },
  {
    pregunta: "¿Cómo pago?",
    respuesta:
      "En esta demostración escolar no se cobra dinero ni se piden datos bancarios. " +
      "En una versión real, el pago podría hacerse en línea o al recoger en el restaurante.",
  },
  {
    pregunta: "¿Qué pasa si no llego en el horario de recolección?",
    respuesta:
      "El restaurante guarda tu pedido solo durante el horario indicado. Si no llegas, el pedido podría " +
      "darse a otra persona o donarse, para que la comida no se desperdicie.",
  },
  {
    pregunta: "Tengo un restaurante, ¿cómo me uno?",
    respuesta:
      "Escríbenos a nuestro correo de contacto. Registramos tu restaurante, definimos contigo tus paquetes, " +
      "productos y horarios de recolección, y empiezas a recuperar ingresos por la comida que antes se desperdiciaba.",
  },
];
