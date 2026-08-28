/* =========================================================
   MÓDULO 1: DATOS — catálogo único de productos
   Esta es la única fuente de verdad: de aquí se arma el listado
   de productos, el detalle de cada uno y lo que se guarda en el carrito.
   ========================================================= */
const productos = [
    {
        id: 'p1',
        nombre: 'Hamburguesa Clásica',
        precio: 8000,
        categoria: 'hamburguesas',
        descripcion: 'Carne 100% vacuno, queso cheddar, lechuga, tomate y nuestra salsa de la casa, servida en pan brioche.'
    },
    {
        id: 'p2',
        nombre: 'Pizza Margarita',
        precio: 10000,
        categoria: 'pizzas',
        descripcion: 'Salsa de tomate, mozzarella fresca y albahaca sobre masa artesanal horneada en horno de piedra.'
    },
    {
        id: 'p3',
        nombre: 'Tiramisú',
        precio: 5500,
        categoria: 'postres',
        descripcion: 'Clásico postre italiano con capas de café, mascarpone y cacao amargo.'
    },
    {
        id: 'p4',
        nombre: 'Limonada Natural',
        precio: 3000,
        categoria: 'bebidas',
        descripcion: 'Limonada preparada al momento con limones frescos, sin azúcar añadida.'
    }
];

function formatearPrecio(numero) {
    return `$${numero.toLocaleString('es-CL')}`;
}

/* =========================================================
   MÓDULO 2: CARRITO DE COMPRAS Y LOCALSTORAGE
   ========================================================= */
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carritoForkMenu')) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carritoForkMenu', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (!contador) return;
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acumulado, item) => acumulado + item.cantidad, 0);
    contador.innerText = `🛒 Cart (${totalItems})`;
}

function agregarAlCarrito(id, nombre, precio) {
    const carrito = obtenerCarrito();
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    guardarCarrito(carrito);
    alert(`¡${nombre} se añadió al carrito!`);
}

// Un solo listener para toda la página: atrapa cualquier botón con
// data-accion="agregar-carrito", venga de productos.html o de detalle-producto.html
document.addEventListener('click', function (e) {
    if (e.target.matches('[data-accion="agregar-carrito"]')) {
        const id = e.target.getAttribute('data-id');
        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseFloat(e.target.getAttribute('data-precio'));
        agregarAlCarrito(id, nombre, precio);
    }

    // Botones + y - dentro del carrito
    if (e.target.matches('[data-accion="sumar"], [data-accion="restar"]')) {
        const id = e.target.getAttribute('data-id');
        const carrito = obtenerCarrito();
        const item = carrito.find(p => p.id === id);
        if (!item) return;

        if (e.target.getAttribute('data-accion') === 'sumar') {
            item.cantidad += 1;
        } else {
            item.cantidad -= 1;
            if (item.cantidad <= 0) {
                carrito.splice(carrito.indexOf(item), 1);
            }
        }

        guardarCarrito(carrito);
        renderizarCarrito();
    }
});

/* =========================================================
   MÓDULO 3: RENDERIZADO DEL CATÁLOGO (productos.html)
   Incluye búsqueda y filtro por categoría, sin recargar la página.
   ========================================================= */
function crearTarjetaProducto(producto) {
    const article = document.createElement('article');
    article.className = 'producto';
    article.setAttribute('data-categoria', producto.categoria);
    article.innerHTML = `
        <a href="detalle-producto.html?id=${producto.id}">
            <div class="img-placeholder">[Imagen del producto]</div>
            <h3>${producto.nombre}</h3>
        </a>
        <p class="precio">${formatearPrecio(producto.precio)}</p>
        <button type="button" data-accion="agregar-carrito"
                data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">
            Añadir al carrito
        </button>
    `;
    return article;
}

function renderizarProductos(lista) {
    const grilla = document.getElementById('grilla-productos');
    if (!grilla) return;

    grilla.innerHTML = '';
    if (lista.length === 0) {
        grilla.innerHTML = '<p>No se encontraron productos con ese criterio.</p>';
        return;
    }
    lista.forEach(producto => grilla.appendChild(crearTarjetaProducto(producto)));
}

function filtrarProductos() {
    const buscador = document.getElementById('buscar-producto');
    const tabActiva = document.querySelector('.tab-categoria.activo');
    const texto = buscador ? buscador.value.trim().toLowerCase() : '';
    const categoria = tabActiva ? tabActiva.getAttribute('data-categoria') : 'todas';

    const filtrados = productos.filter(producto => {
        const coincideCategoria = categoria === 'todas' || producto.categoria === categoria;
        const coincideBusqueda = producto.nombre.toLowerCase().includes(texto);
        return coincideCategoria && coincideBusqueda;
    });

    renderizarProductos(filtrados);
}

function inicializarCatalogo() {
    const grilla = document.getElementById('grilla-productos');
    if (!grilla) return; // No estamos en productos.html

    renderizarProductos(productos);

    const buscador = document.getElementById('buscar-producto');
    if (buscador) buscador.addEventListener('input', filtrarProductos);

    document.querySelectorAll('.tab-categoria').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.tab-categoria').forEach(t => t.classList.remove('activo'));
            this.classList.add('activo');
            filtrarProductos();
        });
    });
}

/* =========================================================
   MÓDULO 4: DETALLE DE PRODUCTO DINÁMICO (detalle-producto.html)
   Lee el id del producto desde la URL (?id=p2) y llena la página
   con los datos reales de ese producto.
   ========================================================= */
function cargarDetalleProducto() {
    const nombreEl = document.getElementById('detalle-nombre');
    if (!nombreEl) return; // No estamos en detalle-producto.html

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');
    const producto = productos.find(p => p.id === id) || productos[0];

    nombreEl.innerText = producto.nombre;
    document.getElementById('detalle-precio').innerText = formatearPrecio(producto.precio);
    document.getElementById('detalle-descripcion').innerText = producto.descripcion;

    const breadcrumb = document.getElementById('breadcrumb-producto');
    if (breadcrumb) breadcrumb.innerText = producto.nombre;

    const botonAgregar = document.getElementById('btn-agregar-detalle');
    if (botonAgregar) {
        botonAgregar.setAttribute('data-id', producto.id);
        botonAgregar.setAttribute('data-nombre', producto.nombre);
        botonAgregar.setAttribute('data-precio', producto.precio);
    }
}

/* =========================================================
   MÓDULO 5: RENDERIZADO DEL CARRITO (carrito.html)
   ========================================================= */
function crearFilaCarrito(item) {
    const article = document.createElement('article');
    article.className = 'item-carrito';
    article.innerHTML = `
        <div class="img-placeholder">[Imagen]</div>
        <div class="item-info">
            <h3>${item.nombre}</h3>
            <p>${formatearPrecio(item.precio)}</p>
        </div>
        <div class="item-cantidad">
            <button type="button" data-accion="restar" data-id="${item.id}">−</button>
            <input type="number" value="${item.cantidad}" min="1" readonly>
            <button type="button" data-accion="sumar" data-id="${item.id}">+</button>
        </div>
    `;
    return article;
}

function renderizarCarrito() {
    const lista = document.getElementById('lista-carrito');
    if (!lista) return; // No estamos en carrito.html

    const carrito = obtenerCarrito();
    lista.innerHTML = '';

    if (carrito.length === 0) {
        lista.innerHTML = '<p>Tu carrito está vacío.</p>';
    } else {
        carrito.forEach(item => lista.appendChild(crearFilaCarrito(item)));
    }

    const total = carrito.reduce((acumulado, item) => acumulado + item.precio * item.cantidad, 0);
    const totalEl = document.getElementById('total-carrito');
    if (totalEl) totalEl.innerText = formatearPrecio(total);
}

/* =========================================================
   MÓDULO 6: VALIDACIÓN DE FORMULARIOS EN TIEMPO REAL
   Cada función valida UN campo y escribe su propio mensaje de error.
   Se reutilizan tanto mientras el usuario escribe (evento "input")
   como al enviar el formulario (evento "submit").
   ========================================================= */
function mostrarError(idError, mensaje) {
    const el = document.getElementById(idError);
    if (el) el.innerText = mensaje;
}

function validarTexto(input, idError, max, opcional = false) {
    if (!opcional && input.value.trim() === '') {
        mostrarError(idError, 'Este campo es obligatorio.');
        return false;
    }
    if (input.value.length > max) {
        mostrarError(idError, `Máximo ${max} caracteres.`);
        return false;
    }
    mostrarError(idError, '');
    return true;
}

function validarCorreoPermitido(input, idError) {
    const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    const esValido = dominiosValidos.some(dominio => input.value.endsWith(dominio));
    if (!esValido) {
        mostrarError(idError, 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com');
        return false;
    }
    mostrarError(idError, '');
    return true;
}

function validarContrasena(input, idError) {
    if (input.value.length < 4 || input.value.length > 10) {
        mostrarError(idError, 'La contraseña debe tener entre 4 y 10 caracteres.');
        return false;
    }
    mostrarError(idError, '');
    return true;
}

function validarConfirmarContrasena(inputPass, inputConfirmar, idError) {
    if (inputConfirmar.value !== inputPass.value) {
        mostrarError(idError, 'Las contraseñas no coinciden.');
        return false;
    }
    mostrarError(idError, '');
    return true;
}

// Cálculo del dígito verificador de un RUN chileno (algoritmo módulo 11)
function calcularDigitoVerificador(rutSinDv) {
    let suma = 0;
    let multiplicador = 2;
    for (let i = rutSinDv.length - 1; i >= 0; i--) {
        suma += parseInt(rutSinDv[i], 10) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = 11 - (suma % 11);
    if (resto === 11) return '0';
    if (resto === 10) return 'K';
    return String(resto);
}

function validarRun(input, idError) {
    const valor = input.value.trim().toUpperCase();

    // Sin puntos ni guión, cuerpo numérico + un dígito verificador (0-9 o K)
    if (!/^[0-9]{6,8}[0-9K]$/.test(valor)) {
        mostrarError(idError, 'El RUN debe ir sin puntos ni guión, y terminar en un número o K.');
        return false;
    }

    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1);

    if (calcularDigitoVerificador(cuerpo) !== dv) {
        mostrarError(idError, 'El dígito verificador no coincide con el RUN ingresado.');
        return false;
    }

    mostrarError(idError, '');
    return true;
}

// Atajo para no repetir el mismo patrón "input" en cada campo
function activarValidacionEnVivo(input, validador) {
    if (input) input.addEventListener('input', validador);
}

function inicializarValidaciones() {
    // --- Login ---
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        const correoInput = document.getElementById('correo');
        const passInput = document.getElementById('contrasena');

        activarValidacionEnVivo(correoInput, () => validarCorreoPermitido(correoInput, 'error-correo'));
        activarValidacionEnVivo(passInput, () => validarContrasena(passInput, 'error-contrasena'));

        formLogin.addEventListener('submit', function (e) {
            e.preventDefault();
            const ok = [
                validarCorreoPermitido(correoInput, 'error-correo'),
                validarContrasena(passInput, 'error-contrasena')
            ].every(Boolean);

            if (ok) {
                alert('¡Inicio de sesión exitoso!');
                formLogin.reset();
            }
        });
    }

    // --- Contacto ---
    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        const nombreInput = document.getElementById('nombre');
        const correoInput = document.getElementById('correo');
        const mensajeInput = document.getElementById('mensaje');

        activarValidacionEnVivo(nombreInput, () => validarTexto(nombreInput, 'error-nombre', 100));
        activarValidacionEnVivo(correoInput, () => validarCorreoPermitido(correoInput, 'error-correo'));
        activarValidacionEnVivo(mensajeInput, () => validarTexto(mensajeInput, 'error-mensaje', 500));

        formContacto.addEventListener('submit', function (e) {
            e.preventDefault();
            const ok = [
                validarTexto(nombreInput, 'error-nombre', 100),
                validarCorreoPermitido(correoInput, 'error-correo'),
                validarTexto(mensajeInput, 'error-mensaje', 500)
            ].every(Boolean);

            if (ok) {
                alert('¡Mensaje enviado con éxito!');
                formContacto.reset();
            }
        });
    }

    // --- Registro ---
    const formRegistro = document.getElementById('form-registro');
    if (formRegistro) {
        const runInput = document.getElementById('run');
        const nombreInput = document.getElementById('nombre');
        const apellidosInput = document.getElementById('apellidos');
        const correoInput = document.getElementById('correo');
        const passInput = document.getElementById('contrasena');
        const confirmarInput = document.getElementById('confirmar-contrasena');
        const direccionInput = document.getElementById('direccion');

        activarValidacionEnVivo(runInput, () => validarRun(runInput, 'error-run'));
        activarValidacionEnVivo(nombreInput, () => validarTexto(nombreInput, 'error-nombre', 50));
        activarValidacionEnVivo(apellidosInput, () => validarTexto(apellidosInput, 'error-apellidos', 100));
        activarValidacionEnVivo(correoInput, () => validarCorreoPermitido(correoInput, 'error-correo'));
        activarValidacionEnVivo(passInput, () => validarContrasena(passInput, 'error-contrasena'));
        activarValidacionEnVivo(confirmarInput, () => validarConfirmarContrasena(passInput, confirmarInput, 'error-confirmar-contrasena'));
        activarValidacionEnVivo(direccionInput, () => validarTexto(direccionInput, 'error-direccion', 300));

        formRegistro.addEventListener('submit', function (e) {
            e.preventDefault();
            const ok = [
                validarRun(runInput, 'error-run'),
                validarTexto(nombreInput, 'error-nombre', 50),
                validarTexto(apellidosInput, 'error-apellidos', 100),
                validarCorreoPermitido(correoInput, 'error-correo'),
                validarContrasena(passInput, 'error-contrasena'),
                validarConfirmarContrasena(passInput, confirmarInput, 'error-confirmar-contrasena'),
                validarTexto(direccionInput, 'error-direccion', 300)
            ].every(Boolean);

            if (ok) {
                alert('¡Registro exitoso!');
                formRegistro.reset();
            }
        });
    }
}

/* =========================================================
   MÓDULO 7: REGIÓN → COMUNA (registro.html)
   ========================================================= */
const comunasPorRegion = {
    metropolitana: ['Santiago', 'Providencia', 'Ñuñoa', 'Maipú'],
    araucania: ['Temuco', 'Villarrica', 'Angol'],
    nuble: ['Chillán', 'San Carlos', 'Bulnes']
};

function actualizarComunas() {
    const selectRegion = document.getElementById('region');
    const selectComuna = document.getElementById('comuna');
    if (!selectRegion || !selectComuna) return;

    const comunas = comunasPorRegion[selectRegion.value] || [];
    selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

    comunas.forEach(comuna => {
        const opcion = document.createElement('option');
        opcion.value = comuna.toLowerCase();
        opcion.innerText = comuna;
        selectComuna.appendChild(opcion);
    });
}

function inicializarRegionComuna() {
    const selectRegion = document.getElementById('region');
    if (selectRegion) selectRegion.addEventListener('change', actualizarComunas);
}

/* =========================================================
   MÓDULO 8: CHECKOUT — mostrar campos según la modalidad elegida
   ========================================================= */
function inicializarCheckout() {
    const inputsModalidad = document.querySelectorAll('input[name="modalidad"]');
    if (inputsModalidad.length === 0) return; // No estamos en checkout.html

    const campoDelivery = document.getElementById('campos-delivery');
    const campoMesa = document.getElementById('campos-mesa');
    const campoRetiro = document.getElementById('campos-retiro');

    function ocultarTodos() {
        if (campoDelivery) campoDelivery.style.display = 'none';
        if (campoMesa) campoMesa.style.display = 'none';
        if (campoRetiro) campoRetiro.style.display = 'none';
    }

    inputsModalidad.forEach(input => {
        input.addEventListener('change', function () {
            ocultarTodos();
            if (this.value === 'delivery' && campoDelivery) campoDelivery.style.display = 'block';
            if (this.value === 'mesa' && campoMesa) campoMesa.style.display = 'block';
            if (this.value === 'retiro' && campoRetiro) campoRetiro.style.display = 'block';
        });
    });

    // Al cargar la página, ninguna modalidad está elegida aún: los tres van ocultos
    ocultarTodos();
}

/* =========================================================
   PUNTO DE ENTRADA: se ejecuta una vez cargada la página,
   cada función revisa si le corresponde actuar en esta vista.
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
    actualizarContadorCarrito();
    inicializarCatalogo();
    cargarDetalleProducto();
    renderizarCarrito();
    inicializarValidaciones();
    inicializarRegionComuna();
    inicializarCheckout();
});