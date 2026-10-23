# Al Cierre — Guía del proyecto

Página web de demostración para un proyecto escolar de emprendimiento. Conecta restaurantes con personas que quieren comprar comida a buen precio y reducir el desperdicio de alimentos.

Tiene dos formas de comprar:

- **Paquete sorpresa:** sabes el restaurante, el precio, una descripción general y el horario de recolección, pero no el contenido exacto.
- **Producto específico:** ves la foto, la descripción, el precio y cuántas unidades quedan.

> **Es una demostración.** No se cobra dinero ni se piden datos bancarios. El carrito y los pedidos de prueba se guardan solo en el navegador de quien usa la página.

El nombre y el logotipo de **Al Cierre** ya están integrados. Si algún día cambian, se modifican en un solo lugar (ver la sección 4).

---

## Índice

1. [Qué hay en cada carpeta](#1-qué-hay-en-cada-carpeta)
2. [Cómo abrirlo y probarlo](#2-cómo-abrirlo-y-probarlo)
3. [Qué puedes probar en la demostración](#3-qué-puedes-probar-en-la-demostración)
4. [Cómo cambiar textos, logotipos, fotos y productos](#4-cómo-cambiar-textos-logotipos-fotos-y-productos)
5. [Cómo subirlo a GitHub](#5-cómo-subirlo-a-github)
6. [Cómo publicarlo en Vercel y obtener un enlace público](#6-cómo-publicarlo-en-vercel-y-obtener-un-enlace-público)
7. [Cómo publicar tus cambios](#7-cómo-publicar-tus-cambios)
8. [Vista previa o página publicada: ¿cuál es la diferencia?](#8-vista-previa-o-página-publicada-cuál-es-la-diferencia)
9. [Problemas comunes](#9-problemas-comunes)
10. [Créditos de las fotografías](#10-créditos-de-las-fotografías)

---

## 1. Qué hay en cada carpeta

```
alcierre/
├── index.html            ← Estructura de la página (secciones y textos fijos)
├── favicon.png           ← Ícono de la pestaña del navegador (reloj del logo)
├── README.md             ← Esta guía
├── css/
│   └── estilos.css       ← COLORES, tipografía y diseño
├── js/
│   ├── datos.js          ← ★ RESTAURANTES, PRODUCTOS, PRECIOS, HORARIOS, PREGUNTAS
│   └── app.js            ← Funcionamiento (carrito, búsqueda…). Normalmente no se toca.
└── img/
    ├── marca/
    │   ├── logo.png            ← Ícono del logotipo (reloj), fondo transparente
    │   ├── logo-completo.png   ← Logotipo completo (reloj + "Al Cierre"), fondo transparente
    │   ├── logo-original.png   ← Archivo original que enviaste, sin cambios
    │   └── sin-imagen.svg      ← Se muestra si una foto no carga
    └── restaurantes/
        ├── pepes-burger/          ← Una carpeta por restaurante
        │   ├── logo.png
        │   ├── portada.jpg
        │   └── (imágenes de sus productos).jpg
        ├── trinken-bar/
        ├── toki-pollo/
        ├── the-lucky-ones/
        ├── tortas-el-buen-gusto/
        └── pollos-menys/
```

**Regla rápida:**

| Quiero cambiar…                                            | Archivo                         |
|------------------------------------------------------------|---------------------------------|
| Nombre del proyecto, eslogan, texto de inicio, correo      | `js/datos.js` → sección **1) MARCA** |
| Restaurantes (nombre, dirección, horarios, fotos)          | `js/datos.js` → sección **2) RESTAURANTES** |
| Productos y paquetes (precios, disponibles, fotos)         | `js/datos.js` → sección **3) PRODUCTOS** |
| Preguntas frecuentes                                       | `js/datos.js` → sección **4) PREGUNTAS** |
| Colores y tipografía                                       | `css/estilos.css` → primeras líneas (`:root`) |
| Textos de "Cómo funciona" y del pie de página              | `index.html`                    |
| Logotipo del proyecto                                      | `img/marca/logo.png` (o el nombre que pongas en `datos.js`) |

---

## 2. Cómo abrirlo y probarlo

No necesitas instalar nada.

**Opción A (la más fácil):**

1. Descarga y descomprime la carpeta `alcierre`.
2. Haz doble clic en `index.html`.
3. Se abre en tu navegador (Chrome, Edge, Firefox o Safari) y funciona completa.

**Opción B (recomendada para editar): Visual Studio Code**

1. Instala [Visual Studio Code](https://code.visualstudio.com/) (gratis).
2. Abre VS Code → **Archivo → Abrir carpeta…** → elige `alcierre`.
3. Instala la extensión **Live Server** (botón de cuadritos a la izquierda → busca "Live Server" → *Install*).
4. Haz clic derecho sobre `index.html` → **Open with Live Server**.
5. Cada vez que guardes un cambio (Ctrl + S), la página se actualiza sola.

**Para ver cómo se ve en celular:** en Chrome presiona `F12` y luego el ícono de celular/tableta (o `Ctrl + Shift + M`).

---

## 3. Qué puedes probar en la demostración

- **Buscar** desde el encabezado: prueba "hamburguesa", "pollo", "boneless", "Centro" o "sorpresa". Si no hay resultados, aparece un mensaje con un botón para limpiar la búsqueda.
- **Filtrar** por categoría (Pizzas, Italiana…) y por modalidad (Paquete sorpresa / Producto específico).
- **Abrir un restaurante** ("Ver restaurante"): portada, logotipo, descripción, dirección, horarios y su catálogo separado en *Paquetes sorpresa* y *Productos específicos*.
- **Agregar al carrito**, cambiar cantidades con **− / +** y **eliminar**. No te deja pasar de las unidades disponibles.
- **Un restaurante por pedido:** si tu carrito tiene productos de un restaurante y agregas algo de otro, aparece un aviso que te deja **conservar tu carrito** o **vaciarlo y agregar** el nuevo producto.
- **Recargar la página:** el carrito se conserva.
- **Confirmar pedido:** llena el formulario (nombre, teléfono de 10 dígitos, correo opcional). Si algo falta, se marca en rojo. Al confirmar recibes un **folio** de demostración (por ejemplo `AC-7KQ2MX`) y las unidades compradas se descuentan.
- **Reiniciar demostración** (en el pie de página): vacía el carrito, borra los pedidos de prueba y restablece las unidades disponibles. Úsalo antes de presentar.

---

## 4. Cómo cambiar textos, logotipos, fotos y productos

Abre los archivos con VS Code (o con el Bloc de notas). **Cambia solo lo que está entre comillas `"..."` y los números.** No borres comas, llaves `{ }` ni corchetes `[ ]`.

### 4.1 Nombre y logotipo del proyecto

En `js/datos.js`, al inicio:

```js
const MARCA = {
  nombre: "Al Cierre",                  // ← nombre del proyecto
  logo: "img/marca/logo.png",           // ← ícono del logotipo (el reloj)
  eslogan: "Lo mejor del día, al cierre y a mejor precio.",
  ...
```

- En el encabezado se ve el **reloj** (`logo.png`) junto al nombre escrito. La **última palabra** del nombre se pinta en naranja y las demás en verde, igual que en el logotipo ("Al" verde, "Cierre" naranja).
- El archivo `logo-completo.png` (reloj + nombre) queda listo para tus presentaciones, carteles o redes sociales.
- Ambos archivos tienen **fondo transparente** y se hicieron a partir de tu imagen original (`logo-original.png`).

**Si cambias el logotipo:**

1. Guarda la nueva imagen en `img/marca/` (de preferencia PNG cuadrado de 256×256 px o más, con fondo transparente).
2. Si se llama igual (`logo.png`), se reemplaza sola. Si tiene otro nombre, cambia la línea `logo:` en `datos.js`.
3. Para el ícono de la pestaña del navegador, reemplaza `favicon.png` (64×64 px).

El nombre también aparece en la línea `<title>` de `index.html` (es el título que se ve mientras carga la página).

### 4.2 Colores

En `css/estilos.css`, al inicio:

```css
--naranja: #DD6222;        /* Color principal (naranja del logotipo) */
--naranja-oscuro: #B54C14; /* Versión más oscura del principal */
--azul: #14213D;           /* Color secundario (azul marino) */
--verde-logo: #16352A;     /* Verde del logotipo (palabra "Al") */
--fondo: #FFF9F3;          /* Fondo general */
```

Cambia el código (`#DD6222`) por otro. Puedes elegir colores en <https://htmlcolorcodes.com/es/>. Si cambias el color principal, cambia también su versión oscura para que los botones se sigan leyendo bien.

### 4.3 Cambiar un restaurante

En `js/datos.js`, sección **2) RESTAURANTES**, cada restaurante es un bloque así:

```js
{
  id: "toki-pollo",                       // identificador único (sin espacios ni acentos)
  nombre: "Toki Pollo",
  categoria: "Pollo",                     // se usa para los filtros
  logo: "img/restaurantes/toki-pollo/logo.png",
  portada: "img/restaurantes/toki-pollo/portada.jpg",
  descripcion: "Pollo frito por pieza, nuggets y puré de papa…",
  direccion: "Av. 6a. Sur #800-A, Sur 1, 33000 Delicias, Chih.",
  zona: "Sur 1, Delicias",                // texto corto que sale en la tarjeta
  horarioAtencion: "Abierto de 12:00 a 16:00",
  horarioRecoleccion: "15:00 a 16:00",    // normalmente, la última hora antes de cerrar
},
```

Si tienes la calificación real del restaurante (por ejemplo, de Google), puedes agregar estas dos líneas y se mostrará con estrellas:

```js
  calificacion: 4.7,
  resenas: 85,
```

**Para reemplazar el logo o la portada de un restaurante real:**

1. Guarda la imagen dentro de su carpeta, por ejemplo `img/restaurantes/toki-pollo/portada.jpg`.
2. Si el nombre del archivo es distinto, cambia la ruta en `datos.js`: `portada: "img/restaurantes/toki-pollo/mi-foto.jpg",`
3. Tamaños recomendados: **portada 1600×700 px** (horizontal), **logo 400×400 px** (cuadrado). El logo se muestra dentro de un círculo: deja un margen para que no se corten las orillas.

> Truco: si guardas la nueva foto con **el mismo nombre** que la anterior (por ejemplo `portada.jpg`), no necesitas cambiar nada en `datos.js`.

**Para agregar un restaurante nuevo:**

1. Crea su carpeta: `img/restaurantes/mi-restaurante/` y guarda ahí su logo, portada y fotos.
2. Copia un bloque completo `{ ... },` de otro restaurante y pégalo debajo.
3. Cambia el `id` (por ejemplo `"mi-restaurante"`) y los demás datos.
4. La nueva categoría aparece sola en los filtros.

**Para quitar un restaurante:** borra su bloque `{ ... },` y también sus productos.

### 4.4 Cambiar o agregar productos

En `js/datos.js`, sección **3) PRODUCTOS**:

```js
{
  id: "tp-nuggets", restaurante: "toki-pollo", tipo: "producto",
  nombre: "Nuggets de pollo (10 piezas)",
  descripcion: "Nuggets dorados con catsup o aderezo.",
  imagen: "img/restaurantes/toki-pollo/nuggets.jpg",
  precioOriginal: 95, precio: 48, disponibles: 4, recoleccion: "15:00 a 16:00",
  etiquetas: [],
},
```

Qué significa cada dato:

| Dato | Para qué sirve |
|---|---|
| `id` | Identificador único. Sugerencia: iniciales del restaurante + nombre (`tp-nuggets`). |
| `restaurante` | **Debe ser igual al `id` del restaurante** (`toki-pollo`). Así se sabe a quién pertenece. |
| `tipo` | `"producto"` (específico) o `"sorpresa"` (paquete sorpresa). |
| `precioOriginal` | Precio normal, sin `$` ni comas. |
| `precio` | Precio con descuento que paga el cliente. |
| `disponibles` | Unidades de hoy (`0` = agotado). |
| `recoleccion` | Horario para recoger. |
| `etiquetas` | Opcional, por ejemplo `["Picante", "Para compartir"]`. |

Para un **paquete sorpresa**, usa `tipo: "sorpresa"` y agrega la lista de cosas que *podría* incluir:

```js
  posibleContenido: ["2 a 4 piezas de pollo frito", "Nuggets", "Puré de papa"],
```

La página calcula sola el **porcentaje de descuento** y el **ahorro**. Si un producto no tiene descuento, pon el mismo número en `precioOriginal` y en `precio`.

**Fotos de productos:** tamaño recomendado **800×600 px** (horizontal, JPG). Guárdalas en la carpeta del restaurante.

### 4.5 Preguntas frecuentes

En `js/datos.js`, sección **4) PREGUNTAS**. Cada pregunta es:

```js
{ pregunta: "¿…?", respuesta: "…" },
```

### 4.6 ¿Me equivoqué y la página dejó de funcionar?

Casi siempre es una coma o una comilla que falta. Para encontrarla:

1. Abre la página y presiona `F12` → pestaña **Console**.
2. Aparecerá un mensaje en rojo con el archivo y el **número de línea** del error.
3. Revisa esa línea en `datos.js`: cada línea termina en coma `,` y cada texto está entre comillas `"..."`.

La página también avisa en la consola (en amarillo) si un producto apunta a un restaurante que no existe, si un `id` está repetido o si un precio está mal escrito.

---

## 5. Cómo subirlo a GitHub

GitHub guarda tu proyecto en internet. Es gratis.

1. Crea una cuenta en <https://github.com> (si aún no tienes).
2. Arriba a la derecha haz clic en **+** → **New repository**.
3. En *Repository name* escribe, por ejemplo, `alcierre`. Déjalo en **Public**. No marques ninguna otra opción. Haz clic en **Create repository**.
4. En la página que aparece, haz clic en el enlace **"uploading an existing file"**.
5. Abre la carpeta `alcierre` en tu computadora, **selecciona todo su contenido** (`index.html`, `favicon.png`, `README.md` y las carpetas `css`, `js`, `img`) y **arrástralo** a la ventana de GitHub.
   - Importante: arrastra lo que está **dentro** de la carpeta, no la carpeta en sí, para que `index.html` quede en la raíz del repositorio.
6. Espera a que se carguen todos los archivos, escribe un mensaje como "Primera versión" y haz clic en **Commit changes**.

Al terminar, en tu repositorio debes ver `index.html` en la lista principal, junto a las carpetas `css`, `img` y `js`.

> Si prefieres una aplicación, puedes usar [GitHub Desktop](https://desktop.github.com/) (gratis): *File → Add local repository*, elige la carpeta y presiona *Publish repository*.

---

## 6. Cómo publicarlo en Vercel y obtener un enlace público

Vercel publica tu página gratis y te da un enlace para compartir.

1. Entra a <https://vercel.com> y haz clic en **Sign Up**. Elige el plan **Hobby** (gratis) y **Continue with GitHub**.
2. En tu panel, haz clic en **Add New… → Project**.
3. Busca tu repositorio `alcierre` y presiona **Import**. Si no aparece, haz clic en *Adjust GitHub App Permissions* y dale acceso.
4. En la configuración:
   - **Framework Preset:** `Other`
   - **Root Directory:** déjalo como está (`./`)
   - No cambies *Build* ni *Output*: no se necesitan.
5. Haz clic en **Deploy** y espera unos segundos.
6. Verás un mensaje de felicitación. Tu enlace público se verá así: `https://alcierre.vercel.app` (o parecido). **Ese enlace lo puedes compartir con tu escuela.**

Para cambiar el enlace: en el proyecto de Vercel ve a **Settings → Domains** y edita el nombre `….vercel.app` (debe estar libre).

---

## 7. Cómo publicar tus cambios

Vercel está conectado a GitHub: **cada vez que cambias un archivo en GitHub, Vercel publica la nueva versión sola** (tarda menos de un minuto).

**Cambiar un texto o precio desde GitHub (sin descargar nada):**

1. En tu repositorio, entra a `js` → `datos.js`.
2. Haz clic en el ícono del **lápiz** (Edit this file).
3. Haz tu cambio.
4. Presiona **Commit changes…** → **Commit changes**.
5. Espera un minuto y recarga tu enlace de Vercel.

**Subir fotos o logotipos nuevos:**

1. En GitHub, entra a la carpeta correspondiente (por ejemplo `img/restaurantes/forno-bella`).
2. **Add file → Upload files**, arrastra la imagen y presiona **Commit changes**.
   - Si la imagen se llama igual que una existente (por ejemplo `portada.jpg`), la reemplaza.
3. Si el nombre es nuevo, actualiza la ruta en `js/datos.js` (paso anterior).

**Si editas en tu computadora:** prueba primero con doble clic en `index.html` o con Live Server. Cuando todo esté bien, sube los archivos que cambiaste a GitHub (paso 5.4 y 5.5, en la carpeta correcta).

> Si ves la versión anterior, recarga con `Ctrl + F5` (o `Cmd + Shift + R` en Mac) para evitar la memoria del navegador.

---

## 8. Vista previa o página publicada: ¿cuál es la diferencia?

| | Vista previa | Página publicada (Vercel) |
|---|---|---|
| ¿Qué es? | Una copia para revisar el diseño: abrir `index.html` en tu computadora o un enlace privado de revisión | La página en internet con enlace propio (`https://….vercel.app`) |
| ¿Quién la ve? | Solo tú (o quien tenga acceso a tu cuenta) | Cualquier persona con el enlace |
| ¿Se actualiza sola? | No | Sí, cada vez que cambias algo en GitHub |
| ¿Sirve para presentar? | Para revisar | **Sí, este es el enlace que compartes** |

---

## 9. Problemas comunes

- **Una foto no se ve (aparece "Imagen no disponible"):** revisa que la ruta en `datos.js` sea exactamente igual al nombre del archivo, **incluyendo mayúsculas y la extensión** (`.jpg` y `.JPG` no son iguales en internet). Evita espacios y acentos en los nombres de archivo: usa `torta-de-lomo.jpg`.
- **En mi computadora sí se ve, pero en Vercel no:** casi siempre es por mayúsculas en el nombre del archivo o porque esa imagen no se subió a GitHub.
- **La página sale en blanco o sin restaurantes:** hay un error de escritura en `datos.js` (ver 4.6).
- **El carrito tiene productos viejos:** usa **Reiniciar demostración** en el pie de página.
- **Las letras se ven diferentes sin internet:** las tipografías (Outfit e Inter) se cargan desde Google Fonts; sin conexión se usa una tipografía del sistema. Todo lo demás funciona igual.

---

## 10. Créditos de las fotografías

- **Restaurantes:** Pepe's Burger, Trinken Bar, Toki Pollo, The Lucky Ones, Tortas El Buen Gusto y Pollos Meny's, en Delicias, Chihuahua. Sus logotipos, nombres y direcciones pertenecen a cada negocio y se usan solo para este proyecto escolar. Si vas a publicar el enlace fuera de la escuela, **pide permiso a cada restaurante**.
- **Productos, precios, disponibilidad y horarios de recolección:** son **ilustrativos**. Se calcularon a partir de los horarios de atención: la recolección es la última hora antes de cerrar. El horario de Pepe's Burger es de ejemplo. Confirma todo con cada restaurante.
- **Fotos de hamburguesas:** son fotos de referencia del proyecto de código abierto [Foodish](https://github.com/surhud004/Foodish). Ese proyecto aclara que los derechos pertenecen a sus autores originales (Kaggle y [Pixabay](https://pixabay.com/)). No son fotos de los restaurantes, así que conviene reemplazarlas.
- **Tarjetas con el logo y el nombre del platillo:** se generaron para el proyecto mientras llegan las fotos reales. Para cambiarlas, guarda la foto con el mismo nombre de archivo, por ejemplo `img/restaurantes/toki-pollo/nuggets.jpg`.
- **Logotipo de Al Cierre:** lo proporcionó el equipo del proyecto.
