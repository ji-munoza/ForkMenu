// ==================================================================
// MÓDULO 1: BASE DE DATOS SIMULADA (MOCK)
// ==================================================================
const baseDeDatosProductos = [
    { id: "1", nombre: "Hamburguesa Clásica", precio: 8000, descripcion: "Carne 100% vacuno, queso cheddar, lechuga, tomate y salsa de la casa, en pan brioche.", imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" },
    { id: "2", nombre: "Pizza Margarita", precio: 10000, descripcion: "Masa artesanal a la piedra, salsa de tomate natural, queso mozzarella y albahaca.", imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" },
    { id: "3", nombre: "Tiramisú", precio: 5500, descripcion: "Clásico postre italiano con capas de bizcocho bañadas en café espresso, mascarpone y cacao.", imagen: "https://images.unsplash.com/photo-1746473079155-6e7c4b2c6c8f?auto=format&fit=crop&w=600&q=80" },
    { id: "4", nombre: "Limonada Natural", precio: 3000, descripcion: "Refrescante limonada preparada con limones recién exprimidos, un toque de menta y hielo frappé.", imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" }
];

// ==================================================================
// MÓDULO 2: LÓGICA GLOBAL DEL CARRITO
// ==================================================================
let carrito = JSON.parse(localStorage.getItem('carritoForkMenu')) || [];

function guardarYActualizarCarrito() {
    localStorage.setItem('carritoForkMenu', JSON.stringify(carrito));
    actualizarContadorSuperior();
    renderizarCarrito();
    renderizarResumenCheckout();
}

function actualizarContadorSuperior() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contador.innerText = `🛒 Cart (${totalItems})`;
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-agregar')) {
        const id = e.target.getAttribute('data-id');
        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseFloat(e.target.getAttribute('data-precio'));
        const platoExistente = carrito.find(item => item.id === id);
        
        if (platoExistente) {
            platoExistente.cantidad += 1;
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }
        
        guardarYActualizarCarrito();
        alert(`¡Excelente! Se añadió ${nombre} al carrito.`);
    }
});

// ==================================================================
// MÓDULO 3: DIBUJAR VISTAS DINÁMICAS
// ==================================================================
function renderizarCarrito() {
    const contenedor = document.getElementById('lista-carrito');
    const totalEl = document.getElementById('total-carrito');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    let totalPrecio = 0;

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p style="text-align:center; padding: 2rem;">Tu carrito está vacío 😢.</p>';
        if (totalEl) totalEl.innerText = '$0';
        return;
    }

    carrito.forEach((producto, index) => {
        totalPrecio += producto.precio * producto.cantidad;
        const articulo = document.createElement('article');
        articulo.classList.add('item-carrito');
        articulo.style.display = 'flex';
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
    if (totalEl) totalEl.innerText = `$${totalPrecio.toLocaleString('es-CL')}`;
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-sumar')) {
        carrito[e.target.getAttribute('data-index')].cantidad += 1;
        guardarYActualizarCarrito();
    }
    if (e.target.classList.contains('btn-restar')) {
        const index = e.target.getAttribute('data-index');
        if (carrito[index].cantidad > 1) carrito[index].cantidad -= 1;
        else carrito.splice(index, 1);
        guardarYActualizarCarrito();
    }
});

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
            document.getElementById('detalle-imagen').src = productoElegido.imagen;
            
            const btnAgregar = document.getElementById('detalle-btn-agregar');
            btnAgregar.setAttribute('data-id', productoElegido.id);
            btnAgregar.setAttribute('data-nombre', productoElegido.nombre);
            btnAgregar.setAttribute('data-precio', productoElegido.precio);
        }
    }
}

// ==================================================================
// MÓDULO 4: FILTROS Y BÚSQUEDA
// ==================================================================
const inputBuscador = document.getElementById('buscar-producto');
const botonesFiltro = document.querySelectorAll('.tab-categoria');
const productosGrilla = document.querySelectorAll('.grilla-productos .producto');

if (inputBuscador) {
    inputBuscador.addEventListener('input', (e) => {
        const textoBuscado = e.target.value.toLowerCase();
        productosGrilla.forEach(producto => {
            const nombrePlato = producto.querySelector('h3, h4').innerText.toLowerCase();
            producto.style.display = nombrePlato.includes(textoBuscado) ? 'flex' : 'none';
        });
    });
}

if (botonesFiltro.length > 0) {
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            e.target.classList.add('activo');
            const categoriaElegida = e.target.getAttribute('data-categoria');
            productosGrilla.forEach(producto => {
                const categoriaProducto = producto.getAttribute('data-categoria');
                producto.style.display = (categoriaElegida === 'todas' || categoriaProducto === categoriaElegida) ? 'flex' : 'none';
            });
        });
    });
}

// ==================================================================
// MÓDULO 5: VALIDACIÓN Y FORMATO DEL REGISTRO (SIN TOCAR EL RUT)
// ==================================================================
function formatearRUT(rut) {
    const limpio = rut.replace(/[^0-9kK]/gi, '').toUpperCase();
    if (limpio.length <= 1) return limpio;
    
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${cuerpoConPuntos}-${dv}`;
}

const formRegistro = document.getElementById('form-registro');

if (formRegistro) {
    const inputRun = document.getElementById('run');
    const inputNombre = document.getElementById('nombre');
    const inputApellidos = document.getElementById('apellidos');
    const inputCorreo = document.getElementById('correo');
    const inputPass = document.getElementById('contrasena');
    const inputConfPass = document.getElementById('confirmar-contrasena');
    const selectRegion = document.getElementById('region');
    const selectComuna = document.getElementById('comuna');
    const inputDireccion = document.getElementById('direccion');

    inputRun.maxLength = 12;

    inputRun.addEventListener('input', (e) => {
        let valorLimpio = e.target.value.replace(/[^0-9kK]/gi, '').toUpperCase();
        if (valorLimpio.length > 9) valorLimpio = valorLimpio.slice(0, 9);
        e.target.value = formatearRUT(valorLimpio);
        
        const error = document.getElementById('error-run');
        if (valorLimpio.length < 8) error.innerText = "El RUN está incompleto.";
        else error.innerText = "";
    });

    inputNombre.addEventListener('input', (e) => {
        const error = document.getElementById('error-nombre');
        if (e.target.value.trim().length === 0 || e.target.value.length > 50) error.innerText = "Obligatorio (Máx 50 caracteres).";
        else error.innerText = "";
    });

    inputApellidos.addEventListener('input', (e) => {
        const error = document.getElementById('error-apellidos');
        if (e.target.value.trim().length === 0 || e.target.value.length > 100) error.innerText = "Obligatorio (Máx 100 caracteres).";
        else error.innerText = "";
    });

    inputCorreo.addEventListener('input', (e) => {
        const error = document.getElementById('error-correo');
        const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        const esValido = dominios.some(dominio => e.target.value.toLowerCase().endsWith(dominio));
        if (!esValido) error.innerText = "Solo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        else error.innerText = "";
    });

    inputPass.addEventListener('input', (e) => {
        const error = document.getElementById('error-contrasena');
        if (e.target.value.length < 4 || e.target.value.length > 10) error.innerText = "Debe tener entre 4 y 10 caracteres.";
        else error.innerText = "";
    });

    inputConfPass.addEventListener('input', (e) => {
        const error = document.getElementById('error-confirmar-contrasena');
        if (e.target.value !== inputPass.value) error.innerText = "Las contraseñas no coinciden.";
        else error.innerText = "";
    });

    inputDireccion.addEventListener('input', (e) => {
        const error = document.getElementById('error-direccion');
        if (e.target.value.trim().length === 0 || e.target.value.length > 300) error.innerText = "Obligatorio (Máx 300 caracteres).";
        else error.innerText = "";
    });

    const comunasPorRegion = {
        metropolitana: ["Santiago", "Puente Alto", "Maipú", "Providencia"],
        araucania: ["Temuco", "Villarrica", "Pucón", "Angol"],
        nuble: ["Chillán", "San Carlos", "Bulnes", "Quillón"],
        valparaiso: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
        bioBio: ["Concepción", "Talcahuano", "Los Ángeles", "Chiguayante"]
    };

    selectRegion.addEventListener('change', (e) => {
        const region = e.target.value;
        selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
        if (comunasPorRegion[region]) {
            comunasPorRegion[region].forEach(comuna => {
                const opt = document.createElement('option');
                opt.value = comuna.toLowerCase();
                opt.textContent = comuna;
                selectComuna.appendChild(opt);
            });
        }
    });

    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault(); 
        let errores = false;
        const dominios = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
        const correoValido = dominios.some(dominio => inputCorreo.value.toLowerCase().endsWith(dominio));
        const rutValidar = inputRun.value.replace(/[^0-9kK]/gi, '');

        if (rutValidar.length < 8 || rutValidar.length > 9) errores = true;
        if (inputNombre.value.trim().length === 0 || inputNombre.value.length > 50) errores = true;
        if (inputApellidos.value.trim().length === 0 || inputApellidos.value.length > 100) errores = true;
        if (!correoValido) errores = true;
        if (inputPass.value.length < 4 || inputPass.value.length > 10) errores = true;
        if (inputConfPass.value !== inputPass.value) errores = true;
        if (selectRegion.value === "") errores = true;
        if (selectComuna.value === "") errores = true;
        if (inputDireccion.value.trim().length === 0 || inputDireccion.value.length > 300) errores = true;

        if (errores) {
            alert("Error: Por favor corrige todos los campos antes de registrarte.");
        } else {
            const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosForkMenu')) || [];
            const correoExiste = usuariosGuardados.some(u => u.correo === inputCorreo.value.toLowerCase());
            
            if (correoExiste) {
                alert("Error: Este correo ya se encuentra registrado.");
            } else {
                const nuevoUsuario = {
                    nombre: inputNombre.value,
                    correo: inputCorreo.value.toLowerCase(),
                    contrasena: inputPass.value 
                };
                usuariosGuardados.push(nuevoUsuario);
                localStorage.setItem('usuariosForkMenu', JSON.stringify(usuariosGuardados));
                
                alert("Usuario registrado exitosamente"); 
                formRegistro.reset();
                window.location.href = 'login.html'; 
            }
        }
    });
}

// ==================================================================
// MÓDULO 6: CHECKOUT, CUPONES Y PROCESAMIENTO
// ==================================================================
const inputsModalidad = document.querySelectorAll('input[name="modalidad"]');
const campoDelivery = document.getElementById('campos-delivery');
const campoMesa = document.getElementById('campos-mesa');

if (inputsModalidad.length > 0) {
    inputsModalidad.forEach(input => {
        input.addEventListener('change', function() {
            if (campoDelivery) campoDelivery.style.display = 'none';
            if (campoMesa) campoMesa.style.display = 'none';
            if (this.value === 'delivery' && campoDelivery) campoDelivery.style.display = 'block';
            if (this.value === 'mesa' && campoMesa) campoMesa.style.display = 'block';
        });
    });
}

// Lógica de Cupones
let cuponAplicado = null; 
const cuponesDisponibles = {
    "FORK20": { tipo: "porcentaje", valor: 0.20 }, // 20% descuento
    "BIENVENIDA": { tipo: "fijo", valor: 3000 }    // $3.000 descuento
};

const btnAplicarCupon = document.getElementById('btn-aplicar-cupon');
if (btnAplicarCupon) {
    btnAplicarCupon.addEventListener('click', () => {
        const inputCupon = document.getElementById('input-cupon').value.toUpperCase().trim();
        const mensaje = document.getElementById('mensaje-cupon');

        if (cuponAplicado) {
            mensaje.innerText = "Ya tienes un cupón aplicado.";
            mensaje.style.color = "red";
            return;
        }

        if (cuponesDisponibles[inputCupon]) {
            cuponAplicado = cuponesDisponibles[inputCupon];
            mensaje.innerText = "¡Cupón aplicado exitosamente!";
            mensaje.style.color = "green";
            document.getElementById('input-cupon').disabled = true; // Bloquea el input para no usar 2
            renderizarResumenCheckout(); // Recalcula el total
        } else {
            mensaje.innerText = "El código ingresado no existe o expiró.";
            mensaje.style.color = "red";
        }
    });
}

function renderizarResumenCheckout() {
    const listaResumen = document.getElementById('resumen-items');
    const totalResumen = document.getElementById('resumen-total');
    if (!listaResumen) return;
    
    listaResumen.innerHTML = '';
    let subtotal = 0;

    carrito.forEach(producto => {
        subtotal += producto.precio * producto.cantidad;
        const li = document.createElement('li');
        li.innerText = `${producto.nombre} x${producto.cantidad} — $${(producto.precio * producto.cantidad).toLocaleString('es-CL')}`;
        listaResumen.appendChild(li);
    });

    let descuento = 0;
    if (cuponAplicado) {
        if (cuponAplicado.tipo === "porcentaje") {
            descuento = subtotal * cuponAplicado.valor;
        } else if (cuponAplicado.tipo === "fijo") {
            descuento = cuponAplicado.valor;
        }
        // Evitar que el descuento sea mayor a la compra
        if (descuento > subtotal) descuento = subtotal; 
    }

    const totalFinal = subtotal - descuento;

    if (totalResumen) {
        if (descuento > 0) {
            document.getElementById('linea-subtotal').style.display = 'block';
            document.getElementById('linea-descuento').style.display = 'block';
            document.getElementById('resumen-subtotal').innerText = `$${subtotal.toLocaleString('es-CL')}`;
            document.getElementById('resumen-descuento').innerText = `-$${descuento.toLocaleString('es-CL')}`;
        }
        totalResumen.innerText = `$${totalFinal.toLocaleString('es-CL')}`;
    }
}

const formCheckout = document.getElementById('form-checkout');
if (formCheckout) {
    formCheckout.addEventListener('submit', (e) => {
        e.preventDefault(); 
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        // Recalculamos el total final a cobrar
        let subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        let descuento = 0;
        if (cuponAplicado) {
            descuento = cuponAplicado.tipo === "porcentaje" ? (subtotal * cuponAplicado.valor) : cuponAplicado.valor;
            if (descuento > subtotal) descuento = subtotal;
        }
        const totalPagar = subtotal - descuento;

        const codigoGenerado = 'FM-' + Math.floor(Math.random() * 10000);
        
        localStorage.setItem('ordenReciente', JSON.stringify({ codigo: codigoGenerado, items: carrito, total: totalPagar }));
        carrito = [];
        localStorage.setItem('carritoForkMenu', JSON.stringify(carrito));
        window.location.href = 'confirmacion.html';
    });
}

function renderizarTicketConfirmacion() {
    const codigoEl = document.getElementById('codigo-pedido');
    const listaEl = document.getElementById('resumen-items-confirmacion');
    const totalEl = document.getElementById('total-confirmacion');

    if (codigoEl && listaEl && totalEl) {
        const ordenGuardada = JSON.parse(localStorage.getItem('ordenReciente'));
        if (ordenGuardada) {
            codigoEl.innerText = ordenGuardada.codigo;
            totalEl.innerText = `$${ordenGuardada.total.toLocaleString('es-CL')}`;
            listaEl.innerHTML = '';
            ordenGuardada.items.forEach(producto => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.padding = '10px 0';
                li.style.borderBottom = '1px solid var(--color-borde)';
                li.innerText = `${producto.nombre} x${producto.cantidad} — $${(producto.precio * producto.cantidad).toLocaleString('es-CL')}`;
                listaEl.appendChild(li);
            });
        }
    }
}

// ==================================================================
// MÓDULO 7: LOGIN Y CONTROL DE SESIÓN DINÁMICA
// ==================================================================
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const correoIngresado = document.getElementById('correo').value.toLowerCase();
        const passIngresada = document.getElementById('contrasena').value;
        const usuariosGuardados = JSON.parse(localStorage.getItem('usuariosForkMenu')) || [];
        
        const usuarioValido = usuariosGuardados.find(u => u.correo === correoIngresado && u.contrasena === passIngresada);
        
        if (usuarioValido) {
            localStorage.setItem('usuarioActivo', JSON.stringify({ nombre: usuarioValido.nombre, correo: usuarioValido.correo }));
            window.location.href = '../index.html';
        } else {
            alert("Error: El usuario no existe o la contraseña es incorrecta.");
        }
    });
}

function verificarSesion() {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    const contenedorAcciones = document.querySelector('.user-actions');
    
    if (usuarioActivo && contenedorAcciones) {
        // Detectamos si estamos en la raíz (index) o ya dentro de la carpeta vistas
        const rutaVistas = window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/') ? 'vistas/' : '';
        
        contenedorAcciones.innerHTML = `
            <a href="${rutaVistas}perfil.html" style="font-weight: bold; color: var(--color-principal); text-decoration: none;">👤 Hola, ${usuarioActivo.nombre}</a> | 
            <a href="#" id="btn-cerrar-sesion">Cerrar sesión</a>
            <a href="${rutaVistas}carrito.html" class="cart" id="contador-carrito">🛒 Cart (0)</a>
        `;
    }
}

document.addEventListener('click', (e) => {
    if (e.target.id === 'btn-cerrar-sesion') {
        e.preventDefault();
        localStorage.removeItem('usuarioActivo');
        window.location.reload();
    }
});

// ==================================================================
// MÓDULO 8: CARGAR DATOS EN EL PERFIL
// ==================================================================
function cargarPerfilUsuario() {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    const nombrePerfil = document.getElementById('perfil-nombre');
    const correoPerfil = document.getElementById('perfil-correo');
    
    // Si estamos en la vista del perfil y el usuario existe
    if (nombrePerfil && correoPerfil && usuarioActivo) {
        nombrePerfil.innerText = usuarioActivo.nombre;
        correoPerfil.innerText = usuarioActivo.correo;
    } else if (nombrePerfil && !usuarioActivo) {
        // Si alguien intenta entrar a perfil.html sin estar logeado, lo expulsamos al login
        window.location.href = 'login.html';
    }
}

// ==================================================================
// MÓDULO 9: INICIALIZADOR GENERAL
// ==================================================================
document.addEventListener('DOMContentLoaded', () => {
    verificarSesion(); 
    cargarPerfilUsuario(); // Módulo nuevo agregado al inicio
    actualizarContadorSuperior(); 
    renderizarCarrito();          
    renderizarResumenCheckout();  
    cargarDetalleProducto();      
    renderizarTicketConfirmacion(); 
});