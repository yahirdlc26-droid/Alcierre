/* =====================================================================
   LÓGICA DEL SITIO (app.js)
   ---------------------------------------------------------------------
   Normalmente NO necesitas editar este archivo.
   Los textos, restaurantes y productos se cambian en js/datos.js
   Los colores se cambian en css/estilos.css
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Utilidades
     ------------------------------------------------------------------ */
  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => Array.from(raiz.querySelectorAll(sel));
  const IMAGEN_RESPALDO = "img/marca/sin-imagen.svg";
  const formatoPesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });
  const dinero = (n) => formatoPesos.format(n);

  function escapar(texto) {
    return String(texto ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  // Quita acentos y pasa a minúsculas para que la búsqueda sea flexible
  function normalizar(texto) {
    return String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }
  // Imagen con respaldo: si la foto no carga, se muestra una ilustración
  function imagen(src, alt, clase = "", carga = "lazy") {
    return `<img src="${escapar(src || IMAGEN_RESPALDO)}" alt="${escapar(alt)}" class="${clase}" loading="${carga}"
      onerror="this.onerror=null;this.src='${IMAGEN_RESPALDO}'">`;
  }
  const ICONOS = {
    ubicacion: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    reloj: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    calendario: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    info: '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
    bolsa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14l-1.5 10.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 7Z"/><path d="M9 7V6a3 3 0 0 1 6 0v1"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10"/></svg>',
  };

  /* ------------------------------------------------------------------
     Almacenamiento en el navegador (para que el carrito no se pierda)
     ------------------------------------------------------------------ */
  const CLAVES = { carrito: "alcierre_carrito_v1", vendidos: "alcierre_vendidos_v1", pedidos: "alcierre_pedidos_v1" };
  function leer(clave, valorInicial) {
    try {
      const v = localStorage.getItem(clave);
      return v ? JSON.parse(v) : valorInicial;
    } catch (e) { return valorInicial; }
  }
  function guardar(clave, valor) {
    try { localStorage.setItem(clave, JSON.stringify(valor)); } catch (e) { /* sin almacenamiento disponible */ }
  }
  function borrar(clave) {
    try { localStorage.removeItem(clave); } catch (e) { /* nada */ }
  }

  /* ------------------------------------------------------------------
     Datos y estado
     ------------------------------------------------------------------ */
  const restaurantePorId = Object.fromEntries(RESTAURANTES.map((r) => [r.id, r]));
  const productoPorId = Object.fromEntries(PRODUCTOS.map((p) => [p.id, p]));
  const productosDe = (idRest) => PRODUCTOS.filter((p) => p.restaurante === idRest);

  const estado = { busqueda: "", categoria: "Todas", modalidad: "todas", modalidadRestaurante: "todas" };
  let vendidos = leer(CLAVES.vendidos, {});   // unidades ya "compradas" en la demo
  let pedidos = leer(CLAVES.pedidos, []);
  let carrito = leer(CLAVES.carrito, { restaurante: null, items: {} });

  const disponibles = (p) => Math.max(0, (Number(p.disponibles) || 0) - (vendidos[p.id] || 0));
  const descuento = (p) => (p.precioOriginal > p.precio ? Math.round((1 - p.precio / p.precioOriginal) * 100) : 0);

  // Revisa el carrito guardado: quita productos que ya no existen y ajusta cantidades
  function sanearCarrito() {
    if (!carrito || typeof carrito !== "object" || typeof carrito.items !== "object" || carrito.items === null) {
      carrito = { restaurante: null, items: {} };
    }
    const limpio = {};
    for (const [id, cant] of Object.entries(carrito.items)) {
      const p = productoPorId[id];
      if (!p || p.restaurante !== carrito.restaurante) continue;
      const c = Math.min(Math.floor(Number(cant) || 0), disponibles(p));
      if (c > 0) limpio[id] = c;
    }
    carrito.items = limpio;
    if (!Object.keys(limpio).length || !restaurantePorId[carrito.restaurante]) carrito = { restaurante: null, items: {} };
    guardar(CLAVES.carrito, carrito);
  }

  function lineasCarrito() {
    return Object.entries(carrito.items).map(([id, cantidad]) => ({ p: productoPorId[id], cantidad }));
  }
  function totalesCarrito() {
    let total = 0, original = 0, piezas = 0;
    for (const { p, cantidad } of lineasCarrito()) {
      total += p.precio * cantidad;
      original += p.precioOriginal * cantidad;
      piezas += cantidad;
    }
    return { total, original, ahorro: original - total, piezas };
  }

  /* ------------------------------------------------------------------
     Avisos breves y ventana modal
     ------------------------------------------------------------------ */
  function avisar(mensaje, tipo = "info") {
    const div = document.createElement("div");
    div.className = `aviso aviso--${tipo}`;
    div.innerHTML = `<span>${mensaje}</span>`;
    const cont = $("#avisos");
    while (cont.children.length >= 2) cont.firstElementChild.remove(); // máximo 2 a la vez
    cont.appendChild(div);
    setTimeout(() => div.remove(), 3200);
  }

  let focoAntesDelModal = null;
  function abrirModal({ titulo, html, acciones }) {
    focoAntesDelModal = document.activeElement;
    $("#modal-titulo").textContent = titulo;
    $("#modal-texto").innerHTML = html;
    const cont = $("#modal-acciones");
    cont.innerHTML = "";
    acciones.forEach((a) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `boton ${a.clase || "boton--contorno"}`;
      b.textContent = a.texto;
      b.addEventListener("click", () => { cerrarModal(); if (a.accion) a.accion(); });
      cont.appendChild(b);
    });
    $("#modal").hidden = false;
    const ultimo = cont.lastElementChild;
    if (ultimo) ultimo.focus();
  }
  function cerrarModal() {
    $("#modal").hidden = true;
    if (focoAntesDelModal && document.contains(focoAntesDelModal)) focoAntesDelModal.focus();
  }

  /* ------------------------------------------------------------------
     Carrito: agregar, cambiar cantidad, eliminar
     ------------------------------------------------------------------ */
  function guardarCarrito() {
    if (!Object.keys(carrito.items).length) carrito.restaurante = null;
    guardar(CLAVES.carrito, carrito);
    actualizarContadores();
    renderCarrito();
    refrescarVistaActual();
  }

  function agregar(idProducto) {
    const p = productoPorId[idProducto];
    if (!p) return;
    const r = restaurantePorId[p.restaurante];
    const disp = disponibles(p);
    if (disp === 0) { avisar(`<strong>${escapar(p.nombre)}</strong> está agotado.`, "error"); return; }

    // Regla: un restaurante por pedido
    if (carrito.restaurante && carrito.restaurante !== p.restaurante && Object.keys(carrito.items).length) {
      const actual = restaurantePorId[carrito.restaurante];
      abrirModal({
        titulo: "Tu carrito es de otro restaurante",
        html: `<p>Para que la recolección sea sencilla, <strong>cada pedido se hace a un solo restaurante</strong> y se recoge en un solo lugar.</p>
               <p>Tu carrito tiene productos de <strong>${escapar(actual.nombre)}</strong>. Si continúas, se vaciará y se agregará
               <strong>${escapar(p.nombre)}</strong> de <strong>${escapar(r.nombre)}</strong>.</p>`,
        acciones: [
          { texto: "Conservar mi carrito", clase: "boton--contorno" },
          { texto: "Vaciar y agregar", clase: "boton--primario", accion: () => {
              carrito = { restaurante: p.restaurante, items: { [p.id]: 1 } };
              guardarCarrito();
              avisar(`Carrito nuevo de <strong>${escapar(r.nombre)}</strong>: agregaste ${escapar(p.nombre)}.`, "exito");
              saltarContador();
            } },
        ],
      });
      return;
    }

    const actual = carrito.items[p.id] || 0;
    if (actual >= disp) {
      avisar(`Solo hay ${disp} ${disp === 1 ? "unidad disponible" : "unidades disponibles"} de <strong>${escapar(p.nombre)}</strong> y ya están en tu carrito.`, "error");
      return;
    }
    carrito.restaurante = p.restaurante;
    carrito.items[p.id] = actual + 1;
    guardarCarrito();
    saltarContador();
    avisar(`Agregado al carrito: <strong>${escapar(p.nombre)}</strong>`, "exito");
  }

  function cambiarCantidad(idProducto, delta) {
    const p = productoPorId[idProducto];
    if (!p || !carrito.items[idProducto]) return;
    const nueva = carrito.items[idProducto] + delta;
    const disp = disponibles(p);
    if (nueva > disp) { avisar(`No hay más unidades disponibles de <strong>${escapar(p.nombre)}</strong> (máximo ${disp}).`, "error"); return; }
    if (nueva < 1) { eliminar(idProducto); return; }
    carrito.items[idProducto] = nueva;
    guardarCarrito();
  }

  function eliminar(idProducto) {
    const p = productoPorId[idProducto];
    delete carrito.items[idProducto];
    guardarCarrito();
    if (p) avisar(`Eliminaste <strong>${escapar(p.nombre)}</strong> del carrito.`, "info");
  }

  function vaciarCarrito(preguntar = true) {
    const hacer = () => { carrito = { restaurante: null, items: {} }; guardarCarrito(); avisar("Tu carrito está vacío.", "info"); };
    if (!preguntar) return hacer();
    abrirModal({
      titulo: "¿Vaciar el carrito?",
      html: "<p>Se quitarán todos los productos de tu carrito.</p>",
      acciones: [{ texto: "Cancelar" }, { texto: "Sí, vaciar", clase: "boton--primario", accion: hacer }],
    });
  }

  function actualizarContadores() {
    const { piezas } = totalesCarrito();
    $("#contador-carrito").textContent = piezas;
    $("#contador-movil").textContent = piezas;
    $("#abrir-carrito").setAttribute("aria-label", `Abrir carrito (${piezas} ${piezas === 1 ? "producto" : "productos"})`);
  }
  function saltarContador() {
    ["#contador-carrito", "#contador-movil"].forEach((s) => {
      const el = $(s); el.classList.remove("salto"); void el.offsetWidth; el.classList.add("salto");
    });
  }

  /* ------------------------------------------------------------------
     Panel del carrito
     ------------------------------------------------------------------ */
  let focoAntesDelCarrito = null;
  function abrirCarrito() {
    focoAntesDelCarrito = document.activeElement;
    renderCarrito();
    $("#capa-carrito").hidden = false;
    const panel = $("#carrito");
    panel.classList.add("abierto");
    panel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("#cerrar-carrito").focus(), 50);
  }
  function cerrarCarrito() {
    $("#capa-carrito").hidden = true;
    const panel = $("#carrito");
    panel.classList.remove("abierto");
    panel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (focoAntesDelCarrito && document.contains(focoAntesDelCarrito)) focoAntesDelCarrito.focus();
  }

  function htmlLineas(conControles) {
    return lineasCarrito().map(({ p, cantidad }) => {
      const disp = disponibles(p);
      const controles = conControles ? `
        <div class="linea__controles">
          <div class="cantidad" role="group" aria-label="Cantidad de ${escapar(p.nombre)}">
            <button type="button" data-menos="${p.id}" aria-label="Quitar uno" ${cantidad <= 1 ? "disabled" : ""}>−</button>
            <output aria-live="polite">${cantidad}</output>
            <button type="button" data-mas="${p.id}" aria-label="Agregar uno" ${cantidad >= disp ? "disabled" : ""}>+</button>
          </div>
          <button type="button" class="boton boton--peligro boton--chico" data-eliminar="${p.id}">Eliminar</button>
        </div>
        ${cantidad >= disp ? `<span class="linea__aviso">Tienes todas las unidades disponibles (${disp}).</span>` : ""}` : "";
      return `
        <div class="linea">
          ${imagen(p.imagen, p.nombre)}
          <div class="linea__info">
            <div class="linea__titulo">
              <strong>${escapar(p.nombre)}</strong>
              <span class="linea__subtotal">${dinero(p.precio * cantidad)}</span>
            </div>
            <span class="linea__meta">${p.tipo === "sorpresa" ? "Paquete sorpresa" : "Producto específico"} · ${dinero(p.precio)} c/u${conControles ? "" : ` · ${cantidad} ${cantidad === 1 ? "pieza" : "piezas"}`}</span>
            ${controles}
          </div>
        </div>`;
    }).join("");
  }

  function htmlTotales() {
    const t = totalesCarrito();
    return `
      <div class="totales">
        <div><span>Precio normal</span><span>${dinero(t.original)}</span></div>
        <div class="ahorro-total"><span>Tu ahorro</span><span>−${dinero(t.ahorro)}</span></div>
        <div class="total"><span>Total</span><span>${dinero(t.total)}</span></div>
      </div>`;
  }

  function renderCarrito() {
    const cuerpo = $("#carrito-cuerpo");
    const pie = $("#carrito-pie");
    if (!carrito.restaurante) {
      cuerpo.innerHTML = `
        <div class="carrito-vacio">
          ${ICONOS.bolsa}
          <h3>Tu carrito está vacío</h3>
          <p>Elige un restaurante y agrega un paquete sorpresa o un producto específico.</p>
          <button type="button" class="boton boton--primario" data-ir="#restaurantes">Explorar restaurantes</button>
        </div>`;
      pie.innerHTML = "";
      pie.hidden = true;
      return;
    }
    const r = restaurantePorId[carrito.restaurante];
    cuerpo.innerHTML = `
      <div class="carrito__restaurante">
        ${imagen(r.logo, "Logotipo de " + r.nombre)}
        <div>
          <strong>${escapar(r.nombre)}</strong>
          <span>Recolección hoy: ${escapar(r.horarioRecoleccion)}</span>
        </div>
      </div>
      ${htmlLineas(true)}
      <p class="nota" style="margin-top:14px">Solo puedes pedir a un restaurante por pedido. <button type="button" class="enlace" data-ir="#/restaurante/${r.id}">Ver más de ${escapar(r.nombre)}</button></p>`;
    pie.hidden = false;
    pie.innerHTML = `
      ${htmlTotales()}
      <div class="carrito__acciones">
        <button type="button" class="boton boton--primario boton--grande boton--bloque" data-ir="#/pedido">Continuar con el pedido</button>
        <button type="button" class="boton boton--peligro boton--bloque" id="vaciar-carrito">Vaciar carrito</button>
      </div>`;
  }

  /* ------------------------------------------------------------------
     Tarjetas
     ------------------------------------------------------------------ */
  function htmlTarjetaRestaurante(r) {
    const prods = productosDe(r.id);
    const sorpresas = prods.filter((p) => p.tipo === "sorpresa" && disponibles(p) > 0).length;
    const especificos = prods.filter((p) => p.tipo === "producto" && disponibles(p) > 0).length;
    const conStock = prods.filter((p) => disponibles(p) > 0);
    const desde = conStock.length ? Math.min(...conStock.map((p) => p.precio)) : null;
    return `
      <article class="tarjeta-restaurante">
        <a class="tarjeta-restaurante__imagen" href="#/restaurante/${r.id}" aria-label="Ver ${escapar(r.nombre)}">
          ${imagen(r.portada, "Portada de " + r.nombre)}
          <span class="tarjeta-restaurante__categoria">${escapar(r.categoria)}</span>
          ${imagen(r.logo, "Logotipo de " + r.nombre, "tarjeta-restaurante__logo")}
        </a>
        <div class="tarjeta-restaurante__cuerpo">
          <div class="tarjeta-restaurante__fila">
            <h3>${escapar(r.nombre)}</h3>
            ${r.calificacion ? `<span class="calificacion"><span class="estrella">★</span>${r.calificacion}${r.resenas ? `<span>(${r.resenas})</span>` : ""}</span>` : ""}
          </div>
          <div class="dato">${ICONOS.ubicacion}<span>${escapar(r.zona)}</span></div>
          <div class="dato">${ICONOS.reloj}<span>Recolección hoy: <strong>${escapar(r.horarioRecoleccion)}</strong></span></div>
          <div class="tarjeta-restaurante__modalidades">
            <span class="insignia insignia--sorpresa">${sorpresas} ${sorpresas === 1 ? "sorpresa" : "sorpresas"}</span>
            <span class="insignia insignia--producto">${especificos} ${especificos === 1 ? "producto" : "productos"}</span>
          </div>
          <div class="tarjeta-restaurante__pie">
            <span class="desde">${desde !== null ? `Desde <strong>${dinero(desde)}</strong>` : "Agotado por hoy"}</span>
            <a class="boton boton--azul boton--chico" href="#/restaurante/${r.id}">Ver restaurante</a>
          </div>
        </div>
      </article>`;
  }

  function htmlTarjetaProducto(p, mostrarRestaurante) {
    const r = restaurantePorId[p.restaurante];
    const disp = disponibles(p);
    const enCarrito = carrito.restaurante === p.restaurante ? carrito.items[p.id] || 0 : 0;
    const desc = descuento(p);
    const agotado = disp === 0;
    const esSorpresa = p.tipo === "sorpresa";

    let insigniaDisp;
    if (agotado) insigniaDisp = '<span class="insignia insignia--agotado">Agotado</span>';
    else if (disp <= 2) insigniaDisp = `<span class="insignia insignia--pocas">¡Quedan ${disp}!</span>`;
    else insigniaDisp = `<span class="insignia insignia--disp">${disp} disponibles</span>`;

    let boton;
    if (agotado) boton = '<button type="button" class="boton boton--bloque" disabled>Agotado por hoy</button>';
    else if (enCarrito >= disp) boton = `<button type="button" class="boton boton--bloque" disabled>Ya tienes todas en tu carrito (${enCarrito})</button>`;
    else boton = `<button type="button" class="boton boton--primario boton--bloque" data-agregar="${p.id}">Agregar al carrito${enCarrito ? ` · llevas ${enCarrito}` : ""}</button>`;

    return `
      <article class="tarjeta-producto ${esSorpresa ? "tarjeta-producto--sorpresa" : ""} ${agotado ? "tarjeta-producto--agotado" : ""}">
        <div class="tarjeta-producto__imagen">
          ${imagen(p.imagen, esSorpresa ? "Ejemplo de paquete sorpresa de " + r.nombre : p.nombre)}
          ${esSorpresa ? '<div class="tarjeta-producto__sorpresa-marca"><span>🎁 ¿Qué habrá hoy?</span></div>' : ""}
          <div class="tarjeta-producto__insignias">
            <span class="insignia ${esSorpresa ? "insignia--sorpresa" : "insignia--producto"}">${esSorpresa ? "Paquete sorpresa" : "Producto específico"}</span>
            ${desc ? `<span class="insignia insignia--descuento">−${desc}%</span>` : ""}
          </div>
        </div>
        <div class="tarjeta-producto__cuerpo">
          ${mostrarRestaurante ? `<a class="de-restaurante" href="#/restaurante/${r.id}">${imagen(r.logo, "")}${escapar(r.nombre)}</a>` : ""}
          <h3>${escapar(p.nombre)}</h3>
          <p class="tarjeta-producto__desc">${escapar(p.descripcion)}</p>
          ${esSorpresa && p.posibleContenido && p.posibleContenido.length ? `
            <div class="posible">
              <strong>Podría incluir</strong>
              <ul>${p.posibleContenido.map((c) => `<li>${escapar(c)}</li>`).join("")}</ul>
              <small>Son ejemplos: el contenido exacto depende de lo que sobre hoy.</small>
            </div>` : ""}
          ${p.etiquetas && p.etiquetas.length ? `<div class="etiquetas">${p.etiquetas.map((e) => `<span class="etiqueta">${escapar(e)}</span>`).join("")}</div>` : ""}
          <div class="tarjeta-producto__pie">
            <div class="precios">
              <span class="precio">${dinero(p.precio)}</span>
              ${desc ? `<span class="precio-original">${dinero(p.precioOriginal)}</span><span class="ahorro">Ahorras ${dinero(p.precioOriginal - p.precio)}</span>` : ""}
            </div>
            <div class="tarjeta-producto__datos">
              ${insigniaDisp}
              <span class="dato">${ICONOS.reloj}<span>Recoger hoy <strong>${escapar(p.recoleccion)}</strong></span></span>
            </div>
            ${boton}
          </div>
        </div>
      </article>`;
  }

  /* ------------------------------------------------------------------
     Vista de INICIO: textos, filtros, restaurantes y preguntas
     ------------------------------------------------------------------ */
  function obtenerTexto(ruta) {
    return ruta.split(".").reduce((obj, k) => (obj ? obj[k] : undefined), MARCA);
  }
  function renderTextosGenerales() {
    document.title = `${MARCA.nombre} · Comida rescatada a precio justo`;
    $$("[data-marca-nombre]").forEach((el) => {
      // En el logotipo, la última palabra del nombre va en naranja (como en el logo)
      if (el.dataset.marcaNombre === "logo") {
        const palabras = MARCA.nombre.trim().split(/\s+/);
        const ultima = palabras.pop();
        el.innerHTML = (palabras.length ? escapar(palabras.join(" ")) + " " : "") + `<span class="marca__acento">${escapar(ultima)}</span>`;
      } else {
        el.textContent = MARCA.nombre;
      }
    });
    $$("[data-marca-logo]").forEach((el) => {
      el.src = MARCA.logo;
      el.onerror = () => { el.onerror = null; el.src = "img/marca/logo.png"; };
    });
    $$("[data-texto]").forEach((el) => {
      const t = obtenerTexto(el.dataset.texto);
      if (t) el.textContent = t;
    });
    $("#hero-cifras").innerHTML = MARCA.inicio.cifras.map((c) => `<li><strong>${escapar(c.valor)}</strong><span>${escapar(c.texto)}</span></li>`).join("");
    $("#nota-cifras").textContent = MARCA.inicio.notaCifras || "";
    const correo = $("#pie-correo");
    correo.textContent = MARCA.correo;
    correo.href = "mailto:" + MARCA.correo;
    $("#pie-instagram").textContent = MARCA.instagram;
    $("#pie-ciudad").textContent = MARCA.ciudad;
    $("#pie-escuela").textContent = MARCA.escuela;
    $("#anio").textContent = new Date().getFullYear();
  }

  function renderCategorias() {
    const categorias = ["Todas", ...new Set(RESTAURANTES.map((r) => r.categoria))];
    $("#filtro-categorias").innerHTML = categorias
      .map((c) => `<button type="button" class="chip ${c === estado.categoria ? "activo" : ""}" data-categoria="${escapar(c)}" aria-pressed="${c === estado.categoria}">${escapar(c)}</button>`)
      .join("");
  }
  function marcarModalidad(contenedor, valor) {
    $$("button", contenedor).forEach((b) => {
      const activo = b.dataset.modalidad === valor;
      b.classList.toggle("activo", activo);
      b.setAttribute("aria-pressed", activo);
    });
  }

  function coincide(textos, palabras) {
    const todo = normalizar(textos.join(" "));
    return palabras.every((w) => todo.includes(w));
  }

  function renderRestaurantes() {
    const palabras = normalizar(estado.busqueda).split(/\s+/).filter(Boolean);
    const hayBusqueda = palabras.length > 0;
    const restaurantes = [];
    const productosEncontrados = [];

    for (const r of RESTAURANTES) {
      if (estado.categoria !== "Todas" && r.categoria !== estado.categoria) continue;
      const prods = productosDe(r.id).filter((p) => estado.modalidad === "todas" || p.tipo === estado.modalidad);
      if (estado.modalidad !== "todas" && !prods.length) continue;

      if (!hayBusqueda) { restaurantes.push(r); continue; }
      const coincideRest = coincide([r.nombre, r.categoria, r.zona, r.direccion, r.descripcion], palabras);
      const coincidenProds = prods.filter((p) =>
        coincide([p.nombre, p.descripcion, ...(p.posibleContenido || []), ...(p.etiquetas || []), p.tipo === "sorpresa" ? "paquete sorpresa" : "producto"], palabras)
      );
      if (coincideRest || coincidenProds.length) restaurantes.push(r);
      productosEncontrados.push(...coincidenProds);
    }

    $("#lista-restaurantes").innerHTML = restaurantes.map(htmlTarjetaRestaurante).join("");
    $("#lista-restaurantes").hidden = !restaurantes.length;

    const bloqueProd = $("#bloque-productos-encontrados");
    bloqueProd.hidden = !productosEncontrados.length;
    $("#lista-productos-encontrados").innerHTML = productosEncontrados.map((p) => htmlTarjetaProducto(p, true)).join("");

    // Resumen de la búsqueda / filtros activos
    const resumen = $("#resumen-busqueda");
    const filtrosActivos = hayBusqueda || estado.categoria !== "Todas" || estado.modalidad !== "todas";
    if (filtrosActivos && restaurantes.length) {
      const partes = [];
      partes.push(`<span><strong>${restaurantes.length}</strong> ${restaurantes.length === 1 ? "restaurante" : "restaurantes"}`);
      if (hayBusqueda) partes[0] += ` y <strong>${productosEncontrados.length}</strong> ${productosEncontrados.length === 1 ? "producto" : "productos"} para “${escapar(estado.busqueda)}”`;
      partes[0] += "</span>";
      partes.push('<button type="button" class="boton boton--suave boton--chico" data-limpiar>Quitar búsqueda y filtros</button>');
      resumen.innerHTML = partes.join("");
      resumen.hidden = false;
    } else {
      resumen.hidden = true;
    }

    const vacio = $("#sin-resultados");
    vacio.hidden = restaurantes.length > 0;
    if (!restaurantes.length) {
      $("#texto-sin-resultados").innerHTML = hayBusqueda
        ? `No hay restaurantes ni productos que coincidan con “<strong>${escapar(estado.busqueda)}</strong>” con los filtros elegidos. Prueba con otra palabra, como “hamburguesa”, “pollo”, “tortas” o “Centro”.`
        : "No hay restaurantes con esa combinación de filtros. Prueba con otra categoría o modalidad.";
    }
  }

  function limpiarFiltros() {
    estado.busqueda = "";
    estado.categoria = "Todas";
    estado.modalidad = "todas";
    $("#campo-buscar").value = "";
    renderCategorias();
    marcarModalidad($("#filtro-modalidad"), "todas");
    renderRestaurantes();
  }

  function renderPreguntas() {
    $("#lista-preguntas").innerHTML = PREGUNTAS.map(
      (q, i) => `<details class="pregunta" ${i === 0 ? "open" : ""}><summary>${escapar(q.pregunta)}</summary><p>${escapar(q.respuesta)}</p></details>`
    ).join("");
  }

  /* ------------------------------------------------------------------
     Vista de RESTAURANTE
     ------------------------------------------------------------------ */
  function renderRestaurante(id) {
    const r = restaurantePorId[id];
    const cont = $("#detalle-restaurante");
    if (!r) {
      cont.innerHTML = `<div class="contenedor seccion"><div class="vacio"><h3>No encontramos este restaurante</h3>
        <p>Es posible que el enlace sea incorrecto o que el restaurante ya no esté disponible.</p>
        <a class="boton boton--primario" href="#restaurantes">Ver todos los restaurantes</a></div></div>`;
      return;
    }
    const prods = productosDe(r.id);
    const sorpresas = prods.filter((p) => p.tipo === "sorpresa");
    const especificos = prods.filter((p) => p.tipo === "producto");
    const m = estado.modalidadRestaurante;
    const otroRest = carrito.restaurante && carrito.restaurante !== r.id ? restaurantePorId[carrito.restaurante] : null;
    const otros = RESTAURANTES.filter((x) => x.id !== r.id).slice(0, 3);

    const bloque = (lista, tipo) => {
      const sorp = tipo === "sorpresa";
      return `
        <section class="bloque-catalogo" aria-labelledby="bloque-${tipo}">
          <div class="bloque-catalogo__cabecera">
            <h3 id="bloque-${tipo}"><span class="punto punto--${tipo}"></span>${sorp ? "Paquetes sorpresa" : "Productos específicos"}</h3>
            <p>${sorp ? "Conoces el precio y el horario; el contenido exacto es sorpresa." : "Sabes exactamente qué estás comprando."}</p>
          </div>
          ${lista.length
            ? `<div class="rejilla rejilla--productos">${lista.map((p) => htmlTarjetaProducto(p, false)).join("")}</div>`
            : `<div class="vacio"><p>Hoy ${escapar(r.nombre)} no tiene ${sorp ? "paquetes sorpresa" : "productos específicos"}.</p></div>`}
        </section>`;
    };

    cont.innerHTML = `
      <div class="portada">
        ${imagen(r.portada, "Portada de " + r.nombre, "", "eager")}
        <a href="#restaurantes" class="boton boton--contorno-claro boton--chico portada__volver">← Todos los restaurantes</a>
      </div>
      <div class="contenedor">
        <div class="ficha">
          ${imagen(r.logo, "Logotipo de " + r.nombre, "ficha__logo", "eager")}
          <div>
            <span class="insignia insignia--producto">${escapar(r.categoria)}</span>
            <h1 style="margin-top:10px">${escapar(r.nombre)}</h1>
            ${r.calificacion ? `<span class="calificacion"><span class="estrella">★</span>${r.calificacion}${r.resenas ? `<span>(${r.resenas} reseñas)</span>` : ""}</span>` : ""}
            <p class="ficha__descripcion">${escapar(r.descripcion)}</p>
          </div>
          <div class="ficha__datos">
            <div class="dato">${ICONOS.ubicacion}<div><small>Dirección</small>${escapar(r.direccion)}</div></div>
            <div class="dato">${ICONOS.calendario}<div><small>Horario de atención</small>${escapar(r.horarioAtencion)}</div></div>
            <div class="dato">${ICONOS.reloj}<div><small>Recolección de pedidos</small><strong>Hoy, ${escapar(r.horarioRecoleccion)}</strong></div></div>
          </div>
        </div>

        <div class="aviso-un-restaurante">
          ${ICONOS.info}
          <div>${otroRest
            ? `Tu carrito tiene productos de <strong>${escapar(otroRest.nombre)}</strong>. Cada pedido es de un solo restaurante: si agregas algo de aquí, te preguntaremos si quieres vaciar tu carrito.`
            : `Todo lo que agregues se recoge en <strong>${escapar(r.nombre)}</strong>. Cada pedido es de un solo restaurante para que la recolección sea sencilla.`}</div>
        </div>

        <div class="catalogo">
          <div class="catalogo__barra">
            <h2>Lo que ofrece hoy</h2>
            <div class="segmentado" id="filtro-modalidad-restaurante" role="group" aria-label="Mostrar">
              <button type="button" data-modalidad="todas" class="${m === "todas" ? "activo" : ""}" aria-pressed="${m === "todas"}">Todo (${prods.length})</button>
              <button type="button" data-modalidad="sorpresa" class="${m === "sorpresa" ? "activo" : ""}" aria-pressed="${m === "sorpresa"}">Sorpresa (${sorpresas.length})</button>
              <button type="button" data-modalidad="producto" class="${m === "producto" ? "activo" : ""}" aria-pressed="${m === "producto"}">Específicos (${especificos.length})</button>
            </div>
          </div>
          ${m !== "producto" ? bloque(sorpresas, "sorpresa") : ""}
          ${m !== "sorpresa" ? bloque(especificos, "producto") : ""}
        </div>
      </div>
      <section class="otros">
        <div class="contenedor">
          <h2>Otros restaurantes</h2>
          <div class="rejilla rejilla--restaurantes">${otros.map(htmlTarjetaRestaurante).join("")}</div>
        </div>
      </section>`;
  }

  /* ------------------------------------------------------------------
     Vista de PEDIDO (formulario)
     ------------------------------------------------------------------ */
  function renderPedido() {
    const resumen = $("#resumen-pedido");
    const form = $("#form-pedido");
    if (!carrito.restaurante) {
      form.hidden = true;
      resumen.innerHTML = `
        <div class="carrito-vacio">
          ${ICONOS.bolsa}
          <h3>No hay productos en tu carrito</h3>
          <p>Para confirmar un pedido, primero agrega algo desde un restaurante.</p>
          <a class="boton boton--primario" href="#restaurantes">Explorar restaurantes</a>
        </div>`;
      $("#volver-desde-pedido").href = "#restaurantes";
      return;
    }
    form.hidden = false;
    const r = restaurantePorId[carrito.restaurante];
    $("#volver-desde-pedido").href = `#/restaurante/${r.id}`;
    resumen.innerHTML = `
      <h2>Resumen del pedido</h2>
      <div class="carrito__restaurante">
        ${imagen(r.logo, "Logotipo de " + r.nombre)}
        <div><strong>${escapar(r.nombre)}</strong><span>${escapar(r.zona)}</span></div>
      </div>
      ${htmlLineas(false)}
      <div class="resumen__recoleccion">
        <div><strong>Recoger hoy:</strong> ${escapar(r.horarioRecoleccion)}</div>
        <div><strong>Dirección:</strong> ${escapar(r.direccion)}</div>
      </div>
      ${htmlTotales()}
      <p class="nota">Pago simulado: en esta demostración no se realiza ningún cobro.</p>
      <button type="button" class="boton boton--contorno boton--bloque" data-abrir-carrito>Editar carrito</button>`;
  }

  function mostrarError(campo, mensaje) {
    const input = $(`#f-${campo}`);
    const error = $(`#e-${campo}`);
    error.textContent = mensaje || "";
    if (input) {
      input.classList.toggle("invalido", Boolean(mensaje));
      input.setAttribute("aria-invalid", mensaje ? "true" : "false");
      if (mensaje) input.setAttribute("aria-describedby", `e-${campo}`);
    }
  }

  function validarFormulario() {
    const nombre = $("#f-nombre").value.trim();
    const telefono = $("#f-telefono").value.replace(/[\s()-]/g, "");
    const correo = $("#f-correo").value.trim();
    const acepto = $("#f-acepto").checked;
    const errores = {};
    if (!nombre) errores.nombre = "Escribe tu nombre para identificar el pedido.";
    else if (nombre.length < 3) errores.nombre = "El nombre debe tener al menos 3 letras.";
    else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$/.test(nombre)) errores.nombre = "Usa solo letras y espacios.";
    if (!telefono) errores.telefono = "Escribe un teléfono de contacto.";
    else if (!/^\d{10}$/.test(telefono)) errores.telefono = "El teléfono debe tener exactamente 10 números (sin lada +52).";
    if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) errores.correo = "Revisa el correo; parece incompleto (ej. nombre@correo.com).";
    if (!acepto) errores.acepto = "Marca la casilla para confirmar que entiendes que es una demostración.";
    ["nombre", "telefono", "correo", "acepto"].forEach((c) => mostrarError(c, errores[c]));
    return { valido: !Object.keys(errores).length, errores, datos: { nombre, telefono, correo, notas: $("#f-notas").value.trim() } };
  }

  function generarFolio() {
    const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let f = "";
    for (let i = 0; i < 6; i++) f += letras[Math.floor(Math.random() * letras.length)];
    return "AC-" + f;
  }

  function confirmarPedido(e) {
    e.preventDefault();
    if (!carrito.restaurante) { avisar("Tu carrito está vacío.", "error"); return; }
    const { valido, errores, datos } = validarFormulario();
    if (!valido) {
      const primero = Object.keys(errores)[0];
      $(`#f-${primero}`).focus();
      avisar("Revisa los campos marcados en rojo.", "error");
      return;
    }
    // Verificar disponibilidad justo antes de confirmar
    for (const { p, cantidad } of lineasCarrito()) {
      if (cantidad > disponibles(p)) {
        sanearCarrito(); actualizarContadores(); renderPedido();
        avisar(`Cambió la disponibilidad de <strong>${escapar(p.nombre)}</strong>. Revisa tu pedido.`, "error");
        return;
      }
    }
    const r = restaurantePorId[carrito.restaurante];
    const t = totalesCarrito();
    const pedido = {
      folio: generarFolio(),
      fecha: new Date().toISOString(),
      restaurante: r.id,
      items: lineasCarrito().map(({ p, cantidad }) => ({ id: p.id, nombre: p.nombre, tipo: p.tipo, cantidad, precio: p.precio, recoleccion: p.recoleccion })),
      total: t.total,
      ahorro: t.ahorro,
      cliente: datos,
    };
    pedido.items.forEach((it) => { vendidos[it.id] = (vendidos[it.id] || 0) + it.cantidad; });
    pedidos.unshift(pedido);
    pedidos = pedidos.slice(0, 20);
    guardar(CLAVES.vendidos, vendidos);
    guardar(CLAVES.pedidos, pedidos);
    carrito = { restaurante: null, items: {} };
    guardar(CLAVES.carrito, carrito);
    actualizarContadores();
    renderCarrito();
    $("#form-pedido").reset();
    location.hash = `#/confirmacion/${pedido.folio}`;
  }

  /* ------------------------------------------------------------------
     Vista de CONFIRMACIÓN
     ------------------------------------------------------------------ */
  function renderConfirmacion(folio) {
    const cont = $("#detalle-confirmacion");
    const pedido = pedidos.find((p) => p.folio === folio);
    if (!pedido) {
      cont.innerHTML = `<div class="vacio"><h3>No encontramos ese pedido</h3>
        <p>Los pedidos de demostración solo se guardan en este navegador. Es posible que se haya reiniciado la demostración.</p>
        <a class="boton boton--primario" href="#restaurantes">Ver restaurantes</a></div>`;
      return;
    }
    const r = restaurantePorId[pedido.restaurante] || { nombre: "Restaurante", direccion: "", horarioRecoleccion: "", id: "" };
    const fecha = new Date(pedido.fecha).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
    cont.innerHTML = `
      <div class="confirmacion">
        <div class="confirmacion__icono">${ICONOS.check}</div>
        <span class="sello-demo">Pedido de demostración · no se realizó ningún cobro</span>
        <h1 class="titulo-pagina">¡Pedido confirmado, ${escapar(pedido.cliente.nombre.split(" ")[0])}!</h1>
        <p>Muestra este folio en el restaurante para recoger tu pedido:</p>
        <div class="folio">${escapar(pedido.folio)}</div>

        <div class="tarjeta">
          <div class="confirmacion__datos">
            <div><small>Restaurante</small>${escapar(r.nombre)}</div>
            <div><small>Recoger</small>${escapar(fecha)}, ${escapar(r.horarioRecoleccion)}</div>
            <div><small>Dirección</small>${escapar(r.direccion)}</div>
            <div><small>A nombre de</small>${escapar(pedido.cliente.nombre)} · ${escapar(pedido.cliente.telefono)}</div>
          </div>
          ${pedido.items.map((it) => `
            <div class="totales"><div><span>${it.cantidad} × ${escapar(it.nombre)} ${it.tipo === "sorpresa" ? "<small>(sorpresa)</small>" : ""}</span><span>${dinero(it.precio * it.cantidad)}</span></div></div>`).join("")}
          <div class="totales">
            <div class="ahorro-total"><span>Ahorraste</span><span>${dinero(pedido.ahorro)}</span></div>
            <div class="total"><span>Total (simulado)</span><span>${dinero(pedido.total)}</span></div>
          </div>
          ${pedido.cliente.notas ? `<p class="nota"><strong>Tus comentarios:</strong> ${escapar(pedido.cliente.notas)}</p>` : ""}
          <p class="nota" style="margin:0"><strong>¿Qué sigue?</strong> Llega dentro del horario, muestra tu folio y, si puedes, lleva una bolsa reutilizable. En una versión real recibirías esta confirmación por mensaje.</p>
        </div>

        <div class="confirmacion__acciones">
          <button type="button" class="boton boton--contorno" id="imprimir">Imprimir o guardar</button>
          ${r.id ? `<a class="boton boton--contorno" href="#/restaurante/${r.id}">Volver a ${escapar(r.nombre)}</a>` : ""}
          <a class="boton boton--primario" href="#restaurantes">Rescatar más comida</a>
        </div>
      </div>`;
  }

  /* ------------------------------------------------------------------
     Navegación entre vistas (usa la parte de la dirección después de #)
     ------------------------------------------------------------------ */
  let vistaActual = "inicio";
  let rutaActual = "";
  function mostrarVista(nombre) {
    vistaActual = nombre;
    ["inicio", "restaurante", "pedido", "confirmacion"].forEach((v) => ($(`#vista-${v}`).hidden = v !== nombre));
  }

  function enrutar() {
    const hash = decodeURIComponent(location.hash || "");
    cerrarMenu();
    if (!$("#modal").hidden) cerrarModal();
    $("#avisos").innerHTML = "";
    const anterior = rutaActual;
    rutaActual = hash;
    if (hash.startsWith("#/restaurante/")) {
      const id = hash.replace("#/restaurante/", "");
      if (!anterior.startsWith("#/restaurante/" + id)) estado.modalidadRestaurante = "todas";
      mostrarVista("restaurante");
      renderRestaurante(id);
      const r = restaurantePorId[id];
      document.title = r ? `${r.nombre} · ${MARCA.nombre}` : MARCA.nombre;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else if (hash === "#/pedido") {
      mostrarVista("pedido");
      renderPedido();
      document.title = `Confirmar pedido · ${MARCA.nombre}`;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else if (hash.startsWith("#/confirmacion/")) {
      mostrarVista("confirmacion");
      renderConfirmacion(hash.replace("#/confirmacion/", ""));
      document.title = `Pedido confirmado · ${MARCA.nombre}`;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    } else {
      const veniaDeOtra = vistaActual !== "inicio";
      mostrarVista("inicio");
      renderRestaurantes();
      document.title = `${MARCA.nombre} · Comida rescatada a precio justo`;
      const destino = hash && hash.length > 1 ? document.getElementById(hash.slice(1)) : null;
      if (destino) destino.scrollIntoView({ behavior: veniaDeOtra ? "instant" : "smooth" });
      else if (veniaDeOtra) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }

  function refrescarVistaActual() {
    if (vistaActual === "inicio") renderRestaurantes();
    else if (vistaActual === "restaurante") renderRestaurante(decodeURIComponent(location.hash).replace("#/restaurante/", ""));
    else if (vistaActual === "pedido") renderPedido();
  }

  function ir(destino) {
    cerrarCarrito();
    if (location.hash === destino) enrutar();
    else location.hash = destino;
  }

  /* ------------------------------------------------------------------
     Menú en celular
     ------------------------------------------------------------------ */
  function cerrarMenu() {
    $("#navegacion").classList.remove("abierta");
    $("#boton-menu").setAttribute("aria-expanded", "false");
    $("#boton-menu").setAttribute("aria-label", "Abrir menú");
  }

  /* ------------------------------------------------------------------
     Eventos
     ------------------------------------------------------------------ */
  function conectarEventos() {
    // Clics generales (botones creados dinámicamente)
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-agregar],[data-mas],[data-menos],[data-eliminar],[data-abrir-carrito],[data-ir],[data-limpiar],[data-categoria],#vaciar-carrito,#imprimir,#filtro-modalidad button,#filtro-modalidad-restaurante button");
      if (!t) return;
      if (t.dataset.agregar) agregar(t.dataset.agregar);
      else if (t.dataset.mas) cambiarCantidad(t.dataset.mas, +1);
      else if (t.dataset.menos) cambiarCantidad(t.dataset.menos, -1);
      else if (t.dataset.eliminar) eliminar(t.dataset.eliminar);
      else if (t.hasAttribute("data-abrir-carrito")) abrirCarrito();
      else if (t.dataset.ir) ir(t.dataset.ir);
      else if (t.hasAttribute("data-limpiar")) limpiarFiltros();
      else if (t.dataset.categoria) { estado.categoria = t.dataset.categoria; renderCategorias(); renderRestaurantes(); }
      else if (t.id === "vaciar-carrito") vaciarCarrito(true);
      else if (t.id === "imprimir") window.print();
      else if (t.closest("#filtro-modalidad")) { estado.modalidad = t.dataset.modalidad; marcarModalidad($("#filtro-modalidad"), estado.modalidad); renderRestaurantes(); }
      else if (t.closest("#filtro-modalidad-restaurante")) { estado.modalidadRestaurante = t.dataset.modalidad; refrescarVistaActual(); }
    });

    // Carrito
    $("#abrir-carrito").addEventListener("click", abrirCarrito);
    $("#cerrar-carrito").addEventListener("click", cerrarCarrito);
    $("#capa-carrito").addEventListener("click", cerrarCarrito);

    // Modal: clic fuera cierra
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") cerrarModal(); });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!$("#modal").hidden) cerrarModal();
      else if ($("#carrito").classList.contains("abierto")) cerrarCarrito();
      else cerrarMenu();
    });

    // Búsqueda
    const campo = $("#campo-buscar");
    let espera;
    campo.addEventListener("input", () => {
      clearTimeout(espera);
      espera = setTimeout(() => {
        estado.busqueda = campo.value;
        if (vistaActual !== "inicio") location.hash = "#restaurantes";
        else renderRestaurantes();
      }, 180);
    });
    $("#form-buscar").addEventListener("submit", (e) => {
      e.preventDefault();
      clearTimeout(espera);
      estado.busqueda = campo.value;
      campo.blur();
      if (location.hash !== "#restaurantes") location.hash = "#restaurantes";
      else { renderRestaurantes(); $("#restaurantes").scrollIntoView({ behavior: "smooth" }); }
    });
    $("#limpiar-filtros").addEventListener("click", limpiarFiltros);

    // Menú celular
    $("#boton-menu").addEventListener("click", () => {
      const nav = $("#navegacion");
      const abierto = nav.classList.toggle("abierta");
      $("#boton-menu").setAttribute("aria-expanded", abierto);
      $("#boton-menu").setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });
    // Si se hace clic en el enlace de la sección donde ya estamos, igual desplazarse
    $$('a[href^="#"]:not([href^="#/"])').forEach((a) => a.addEventListener("click", (e) => {
      if (location.hash === a.getAttribute("href")) { e.preventDefault(); enrutar(); }
    }));

    // Formulario de pedido
    $("#form-pedido").addEventListener("submit", confirmarPedido);
    ["nombre", "telefono", "correo"].forEach((c) => $(`#f-${c}`).addEventListener("input", () => mostrarError(c, "")));
    $("#f-acepto").addEventListener("change", () => mostrarError("acepto", ""));

    // Reiniciar demostración
    $("#reiniciar-demo").addEventListener("click", () => {
      abrirModal({
        titulo: "¿Reiniciar la demostración?",
        html: "<p>Se vaciará el carrito, se borrarán los pedidos de prueba y se restablecerán las unidades disponibles. Útil antes de presentar.</p>",
        acciones: [
          { texto: "Cancelar" },
          { texto: "Reiniciar", clase: "boton--primario", accion: () => {
              Object.values(CLAVES).forEach(borrar);
              vendidos = {}; pedidos = []; carrito = { restaurante: null, items: {} };
              actualizarContadores(); renderCarrito();
              avisar("Demostración reiniciada.", "exito");
              ir("#inicio");
            } },
        ],
      });
    });

    window.addEventListener("hashchange", enrutar);

    // Si el carrito cambia en otra pestaña, actualizar aquí también
    window.addEventListener("storage", (e) => {
      if (!Object.values(CLAVES).includes(e.key)) return;
      vendidos = leer(CLAVES.vendidos, {});
      pedidos = leer(CLAVES.pedidos, []);
      carrito = leer(CLAVES.carrito, { restaurante: null, items: {} });
      sanearCarrito(); actualizarContadores(); renderCarrito(); refrescarVistaActual();
    });
  }

  /* ------------------------------------------------------------------
     Revisión de datos: avisa en la consola si algo está mal escrito
     (abre la consola con F12 para verla)
     ------------------------------------------------------------------ */
  function revisarDatos() {
    const ids = new Set();
    PRODUCTOS.forEach((p) => {
      if (ids.has(p.id)) console.warn(`[datos.js] El id de producto "${p.id}" está repetido.`);
      ids.add(p.id);
      if (!restaurantePorId[p.restaurante]) console.warn(`[datos.js] El producto "${p.nombre}" tiene restaurante "${p.restaurante}", que no existe.`);
      if (typeof p.precio !== "number" || typeof p.precioOriginal !== "number") console.warn(`[datos.js] Revisa los precios de "${p.nombre}" (deben ser números sin $).`);
    });
  }

  /* ------------------------------------------------------------------
     Inicio
     ------------------------------------------------------------------ */
  revisarDatos();
  sanearCarrito();
  renderTextosGenerales();
  renderCategorias();
  renderPreguntas();
  actualizarContadores();
  renderCarrito();
  conectarEventos();
  enrutar();
})();
