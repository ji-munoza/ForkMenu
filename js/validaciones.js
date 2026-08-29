// ==================================================================
// MÓDULO 1: BASE DE DATOS SIMULADA (MOCK)
// Como no tenemos un servidor real, guardamos los platos aquí para 
// que la página de detalles pueda leerlos dinámicamente.
// ==================================================================
const baseDeDatosProductos = [
    {
        id: "1",
        nombre: "Hamburguesa Clásica",
        precio: 8000,
        descripcion: "Carne 100% vacuno, queso cheddar, lechuga, tomate y nuestra salsa de la casa, servida en pan brioche.",
        imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "2",
        nombre: "Pizza Margarita",
        precio: 10000,
        descripcion: "Masa artesanal a la piedra, salsa de tomate natural, queso mozzarella fresco y hojas de albahaca.",
        imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "3",
        nombre: "Tiramisú",
        precio: 5500,
        descripcion: "Clásico postre italiano con capas de bizcocho bañadas en café espresso, crema de mascarpone y cacao.",
        imagen: "https://images.unsplash.com/photo-1746473079155-6e7c4b2c6c8f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: "4",
        nombre: "Limonada Natural",
        precio: 3000,
        descripcion: "Refrescante limonada preparada con limones recién exprimidos, un toque de menta y hielo frappé.",
        imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80"
    }
];

// ==================================================================
// MÓDULO 2: LÓGICA GLOBAL DEL CARRITO DE COMPRAS
// Se encarga de guardar, sumar y recordar los productos elegidos
// ==================================================================

// 1. Buscamos si ya hay un carrito guardado en la memoria del navegador. Si no, creamos uno vacío [].
let carrito = JSON.parse(localStorage.getItem('carritoForkMenu')) || [];

// 2. Función para guardar los cambios y actualizar toda la pantalla visualmente
function guardarYActualizarCarrito() {
    localStorage.setItem('carritoForkMenu', JSON.stringify(carrito));
    actualizarContadorSuperior();
    renderizarCarrito();         // Solo actuará si estamos en carrito.html
    renderizarResumenCheckout(); // Solo actuará si estamos en checkout.html
}

// 3. Actualiza el numerito que sale en la barra de navegación: "🛒 Cart (X)"
function actualizarContadorSuperior() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        // Sumamos las cantidades de todos los platos que llevamos
        const totalItems = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
        contador.innerText = `🛒 Cart (${totalItems})`;
    }
}

// 4. "Escuchamos" si el cliente hace clic en cualquier botón de "Añadir al carrito"
document.addEventListener('click', (e) => {
    // Verificamos si el elemento clickeado tiene la clase 'btn-agregar'
    if (e.target.classList.contains('btn-agregar')) {
        const id = e.target.getAttribute('data-id');
        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseFloat(e.target.getAttribute('data-precio'));

        // Revisamos si este plato ya estaba en el carrito
        const platoExistente = carrito.find(item => item.id === id);
        
        if (platoExistente) {
            platoExistente.cantidad += 1; // Si ya estaba, sumamos 1 a la cantidad
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 }); // Si es nuevo, lo agregamos a la lista
        }
        
        guardarYActualizarCarrito();
        alert(`¡Excelente! Se añadió ${nombre} al carrito.`);
    }
});

// ==================================================================
// MÓDULO 3: DIBUJAR VISTAS DINÁMICAS (Carrito, Checkout y Detalles)
// ==================================================================

// 1. Dibuja la lista de productos dentro de la página "carrito.html"
function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    const totalElemento = document.getElementById('total-carrito');
    
    if (!contenedor) return; // Si no estamos en la página del carrito, ignoramos esta función

    contenedor.innerHTML = ''; // Limpiamos el contenedor
    let totalPrecio = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; padding: 2rem;">Tu carrito está vacío 😢.</p>';
        if (totalElemento) totalElemento.innerText = '$0';
        return;
    }

    // Por cada producto en el carrito, creamos su tarjeta visual
    carrito.forEach((producto, index) => {
        totalPrecio += producto.precio * producto.cantidad;
        
        const articulo = document.createElement('article');
        articulo.classList.add('item-carrito');
        articulo.style.display = 'flex'; // Un poco de estilo rápido para alinear
        articulo.style.justifyContent = 'space-between';
        articulo.style.marginBottom = '1rem';
        
        articulo.innerHTML = `
            <div class="item-info">
                <h3 style="margin-bottom: 0;">${producto.nombre}</h3>
                <p style="color: var(--color-principal); font-weight: bold;">$${producto.precio.toLocaleString('es-CL')}</p>
            </div>
            <div class="item-cantidad" style="display: flex; align-items: center; gap: 10px;">
                <button type="button" class="btn-restar btn" data-index="${index}" style="padding: 5px 15px;">−</button>
                <span style="font-weight: bold; font-size: 1.2rem;">${producto.cantidad}</span>
                <button type="button" class="btn-sumar btn" data-index="${index}" style="padding: 5px 15px;">+</button>
            </div>
        `;
        contenedor.appendChild(articulo);
    });

    if (totalElemento) totalElemento.innerText = `$${totalPrecio.toLocaleString('es-CL')}`;
}

// 2. Dibuja el pequeño resumen de pago en "checkout.html"
function renderizarResumenCheckout() {
    const listaResumen = document.getElementById('resumen-items');
    const totalResumen = document.getElementById('resumen-total');
    
    if (!listaResumen) return;

    listaResumen.innerHTML = '';
    let totalPrecio = 0;

    carrito.forEach(producto => {
        totalPrecio += producto.precio * producto.cantidad;
        const li = document.createElement('li');
        li.innerText = `${producto.nombre} x${producto.cantidad} — $${(producto.precio * producto.cantidad).toLocaleString('es-CL')}`;
        listaResumen.appendChild(li);
    });

    if (totalResumen) totalResumen.innerText = `$${totalPrecio.toLocaleString('es-CL')}`;
}

// 3. Llena la página "detalle-producto.html" leyendo la URL
function cargarDetalleProducto() {
    const parametrosURL = new URLSearchParams(window.location.search);
    const idProductoURL = parametrosURL.get('id');

    if (idProductoURL && document.getElementById('detalle-nombre')) {
        const productoElegido = baseDeDatosProductos.find(plato => plato.id === idProductoURL);

        if (productoElegido) {
            document.getElementById('detalle-nombre').innerText = productoElegido.nombre;
            document.getElementById('breadcrumb-nombre').innerText = productoElegido.nombre;
            document.getElementById('detalle-precio').innerText = `$${productoElegido.precio.toLocaleString('es-CL')}`;
            document.getElementById('detalle-descripcion').innerText = productoElegido.descripcion;
            
            const imgEl = document.getElementById('detalle-imagen');
            imgEl.src = productoElegido.imagen;
            imgEl.alt = productoElegido.nombre;

            const btnAgregar = document.getElementById('detalle-btn-agregar');
            btnAgregar.setAttribute('data-id', productoElegido.id);
            btnAgregar.setAttribute('data-nombre', productoElegido.nombre);
            btnAgregar.setAttribute('data-precio', productoElegido.precio);
        } else {
            document.getElementById('detalle-nombre').innerText = "Producto no encontrado";
            document.getElementById('detalle-descripcion').innerText = "Lo sentimos, este plato ya no está disponible.";
        }
    }
}

// 4. Botones para sumar o restar cantidades dentro del carrito
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-sumar')) {
        const index = e.target.getAttribute('data-index');
        carrito[index].cantidad += 1;
        guardarYActualizarCarrito();
    }
    
    if (e.target.classList.contains('btn-restar')) {
        const index = e.target.getAttribute('data-index');
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
        } else {
            carrito.splice(index, 1); // Lo borra si llega a cero
        }
        guardarYActualizarCarrito();
    }
});

// ==================================================================
// MÓDULO 4: FILTROS Y BÚSQUEDA DE PRODUCTOS
// ==================================================================
const inputBuscador = document.getElementById('buscar-producto');
const botonesFiltro = document.querySelectorAll('.tab-categoria');
const productosGrilla = document.querySelectorAll('.grilla-productos .producto');

// Filtro por escritura (Buscador)
if (inputBuscador) {
    inputBuscador.addEventListener('input', (e) => {
        const textoBuscado = e.target.value.toLowerCase();
        
        productosGrilla.forEach(producto => {
            const nombrePlato = producto.querySelector('h3, h4').innerText.toLowerCase();
            if (nombrePlato.includes(textoBuscado)) {
                producto.style.display = 'flex';
            } else {
                producto.style.display = 'none';
            }
        });
    });
}

// Filtro por botones (Categorías)
if (botonesFiltro.length > 0) {
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            e.target.classList.add('activo');

            const categoriaElegida = e.target.getAttribute('data-categoria');

            productosGrilla.forEach(producto => {
                const categoriaProducto = producto.getAttribute('data-categoria');
                if (categoriaElegida === 'todas' || categoriaProducto === categoriaElegida) {
                    producto.style.display = 'flex';
                } else {
                    producto.style.display = 'none';
                }
            });
        });
    });
}

// ==================================================================
// MÓDULO 5: FORMULARIOS (Registro, Login, Regiones)
// ==================================================================
function validarCorreoPermitido(correo) {
    const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
    return dominios.some(dominio => correo.toLowerCase().endsWith(dominio));
}

function validarRUN(run) {
    const regex = /^[0-9]+[0-9kK]$/; 
    return regex.test(run) && run.length >= 7 && run.length <= 9;
}

const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
    const inputRun = document.getElementById('run');
    const inputPass = document.getElementById('contrasena');
    const inputConfPass = document.getElementById('confirmar-contrasena');
    const inputCorreo = document.getElementById('correo');

    inputRun.addEventListener('input', () => {
        const errorRun = document.getElementById('error-run');
        if (!validarRUN(inputRun.value)) {
            errorRun.innerText = "RUN inválido. Ingrese sin puntos ni guion.";
        } else {
            errorRun.innerText = "";
        }
    });

    inputCorreo.addEventListener('input', () => {
        const errorCorreo = document.getElementById('error-correo');
        if (!validarCorreoPermitido(inputCorreo.value)) {
            errorCorreo.innerText = "Use @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        } else {
            errorCorreo.innerText = "";
        }
    });

    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("¡Usuario registrado con éxito!");
        formRegistro.reset();
    });
}

// Selector dinámico de comunas
const selectRegion = document.getElementById('region');
const selectComuna = document.getElementById('comuna');
if (selectRegion && selectComuna) {
    const comunasPorRegion = {
        metropolitana: ["Santiago", "Puente Alto", "Maipú", "Providencia"],
        araucania: ["Temuco", "Villarrica", "Pucón", "Angol"],
        nuble: ["Chillán", "San Carlos", "Bulnes", "Quillón"],
        valparaiso: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
        bioBio: ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante"]

    };

    selectRegion.addEventListener('change', (e) => {
        const regionSeleccionada = e.target.value;
        selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
        if (comunasPorRegion[regionSeleccionada]) {
            comunasPorRegion[regionSeleccionada].forEach(comuna => {
                const opcion = document.createElement('option');
                opcion.value = comuna.toLowerCase();
                opcion.textContent = comuna;
                selectComuna.appendChild(opcion);
            });
        }
    });
}

// ==================================================================
// MÓDULO 6:  CHECKOUT (Mostrar/Ocultar Dirección)
// ==================================================================
const inputsModalidad = document.querySelectorAll('input[name="modalidad"]');
const campoDelivery = document.getElementById('campos-delivery');
const campoMesa = document.getElementById('campos-mesa');

if (inputsModalidad.length > 0) {
    inputsModalidad.forEach(input => {
        input.addEventListener('change', function() {
            if (campoDelivery) campoDelivery.style.display = 'none';
            if (campoMesa) campoMesa.style.display = 'none';

            if (this.value === 'delivery' && campoDelivery) {
                campoDelivery.style.display = 'block';
            } else if (this.value === 'mesa' && campoMesa) {
                campoMesa.style.display = 'block';
            }
        });
    });
}

// ==================================================================
// MÓDULO 7: INICIALIZADOR GENERAL
// Esto se ejecuta automáticamente cuando el usuario abre cualquier página
// ==================================================================
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorSuperior(); // Pone el número correcto en el menú
    renderizarCarrito();          // Pinta los productos en el carrito
    renderizarResumenCheckout();  // Pinta el ticket de compra en el checkout
    cargarDetalleProducto();      // Pinta la página de detalles según la URL
});