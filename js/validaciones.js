// ==================================================================
// MÓDULO 1: BASE DE DATOS Y PRODUCTOS EN LOCALSTORAGE
// ==================================================================
const productosIniciales = [
    { id: "1", codigo: "FM-101", nombre: "Hamburguesa Clásica", precio: 8000, stock: 15, stockCritico: 3, categoria: "hamburguesas", descripcion: "Carne 100% vacuno, queso cheddar, lechuga, tomate y salsa de la casa, en pan brioche.", imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" },
    { id: "2", codigo: "FM-102", nombre: "Pizza Margarita", precio: 10000, stock: 10, stockCritico: 2, categoria: "pizzas", descripcion: "Masa artesanal a la piedra, salsa de tomate natural, queso mozzarella y albahaca.", imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" },
    { id: "3", codigo: "FM-103", nombre: "Tiramisú", precio: 5500, stock: 8, stockCritico: 2, categoria: "postres", descripcion: "Clásico postre italiano con capas de bizcocho bañadas en café espresso, mascarpone y cacao.", imagen: "https://images.unsplash.com/photo-1746473079155-6e7c4b2c6c8f?auto=format&fit=crop&w=600&q=80" },
    { id: "4", codigo: "FM-104", nombre: "Limonada Natural", precio: 3000, stock: 25, stockCritico: 5, categoria: "bebidas", descripcion: "Refrescante limonada preparada con limones recién exprimidos, un toque de menta y hielo frappé.", imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" }
];

if (!localStorage.getItem('productosForkMenu')) {
    localStorage.setItem('productosForkMenu', JSON.stringify(productosIniciales));
}

function obtenerProductos() {
    return JSON.parse(localStorage.getItem('productosForkMenu')) || [];
}

function guardarProductos(productos) {
    localStorage.setItem('productosForkMenu', JSON.stringify(productos));
}

const usuariosIniciales = [
    {
        nombre: "Administrador",
        correo: "admin@forkmenu.cl",
        contrasena: "admin123",
        rol: "admin"
    }
];

if (!localStorage.getItem('usuariosForkMenu')) {
    localStorage.setItem('usuariosForkMenu', JSON.stringify(usuariosIniciales));
}

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
        const productos = obtenerProductos();
        const productoBD = productos.find(p => p.id === id);

        const platoEnCarrito = carrito.find(item => item.id === id);
        const cantidadEnCarrito = platoEnCarrito ? platoEnCarrito.cantidad : 0;

        // Verificar stock antes de agregar
        if (productoBD && (cantidadEnCarrito + 1) > productoBD.stock) {
            alert(`Stock insuficiente. Solo quedan ${productoBD.stock} unidades de ${productoBD.nombre}.`);
            return;
        }

        const nombre = e.target.getAttribute('data-nombre');
        const precio = parseFloat(e.target.getAttribute('data-precio'));

        if (platoEnCarrito) {
            platoEnCarrito.cantidad += 1;
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }
        
        guardarYActualizarCarrito();
        alert(`¡Excelente! Se añadió ${nombre} al carrito.`);
    }
});

// ==================================================================
// MÓDULO 3: DIBUJAR VISTAS DINÁMICAS (CARRITO Y DETALLE)
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
        const index = e.target.getAttribute('data-index');
        const item = carrito[index];
        const productos = obtenerProductos();
        const productoBD = productos.find(p => p.id === item.id);

        if (productoBD && item.cantidad + 1 > productoBD.stock) {
            alert(`No puedes agregar más. Stock disponible: ${productoBD.stock}`);
            return;
        }

        carrito[index].cantidad += 1;
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
        const productos = obtenerProductos();
        const productoElegido = productos.find(plato => plato.id === idProductoURL);
        if (productoElegido) {
            document.getElementById('detalle-nombre').innerText = productoElegido.nombre;
            document.getElementById('breadcrumb-nombre').innerText = productoElegido.nombre;
            document.getElementById('detalle-precio').innerText = `$${productoElegido.precio.toLocaleString('es-CL')}`;
            document.getElementById('detalle-descripcion').innerText = productoElegido.descripcion;
            document.getElementById('detalle-imagen').src = productoElegido.imagen;
            
            const btnAgregar = document.getElementById('detalle-btn-agregar');
            if (btnAgregar) {
                btnAgregar.setAttribute('data-id', productoElegido.id);
                btnAgregar.setAttribute('data-nombre', productoElegido.nombre);
                btnAgregar.setAttribute('data-precio', productoElegido.precio);
            }
        }
    }
}

// ==================================================================
// MÓDULO 4: FILTROS Y BÚSQUEDA EN TIENDA
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
// MÓDULO 5: VALIDACIÓN Y REGISTRO
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
// MÓDULO 6: CHECKOUT Y CREACIÓN DE PEDIDOS
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

let cuponAplicado = null; 
const cuponesDisponibles = {
    "FORK20": { tipo: "porcentaje", valor: 0.20 },
    "BIENVENIDA": { tipo: "fijo", valor: 3000 }
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
            document.getElementById('input-cupon').disabled = true;
            renderizarResumenCheckout();
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

        let productos = obtenerProductos();

        // 1. Descontar Stock de los productos
        for (const item of carrito) {
            const prod = productos.find(p => p.id === item.id);
            if (prod) {
                if (prod.stock < item.cantidad) {
                    alert(`No hay suficiente stock disponible para ${prod.nombre}. Stock actual: ${prod.stock}`);
                    return;
                }
                prod.stock -= item.cantidad;
            }
        }
        guardarProductos(productos);

        // 2. Recalcular Total
        let subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        let descuento = 0;
        if (cuponAplicado) {
            descuento = cuponAplicado.tipo === "porcentaje" ? (subtotal * cuponAplicado.valor) : cuponAplicado.valor;
            if (descuento > subtotal) descuento = subtotal;
        }
        const totalPagar = subtotal - descuento;

        // 3. Obtener Datos de Cliente y Modalidad
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        const clienteNombre = usuarioActivo ? usuarioActivo.nombre : "Cliente Anónimo";
        
        const modalidadSeleccionada = document.querySelector('input[name="modalidad"]:checked')?.value || 'retirar';
        let detalleModalidad = "Retiro en local";
        if (modalidadSeleccionada === 'delivery') {
            const dir = document.getElementById('direccion').value;
            detalleModalidad = `Delivery (${dir || 'Sin dirección'})`;
        } else if (modalidadSeleccionada === 'mesa') {
            const numMesa = document.getElementById('numero-mesa').value;
            detalleModalidad = `Mesa #${numMesa || '1'}`;
        }

        const codigoGenerado = 'FM-' + Math.floor(1000 + Math.random() * 9000);
        
        const nuevaOrden = {
            codigo: codigoGenerado,
            cliente: clienteNombre,
            modalidad: detalleModalidad,
            items: [...carrito],
            total: totalPagar,
            estado: "En preparación",
            fecha: new Date().toLocaleString()
        };

        // 4. Guardar orden individual y en el array global de pedidos para el Admin
        localStorage.setItem('ordenReciente', JSON.stringify(nuevaOrden));
        const pedidosTotales = JSON.parse(localStorage.getItem('pedidosForkMenu')) || [];
        pedidosTotales.push(nuevaOrden);
        localStorage.setItem('pedidosForkMenu', JSON.stringify(pedidosTotales));

        // 5. Vaciar Carrito y Redirigir
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
// MÓDULO 7: LOGIN Y SESIÓN
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
            const usuarioActivo = {
                nombre: usuarioValido.nombre,
                correo: usuarioValido.correo,
                rol: usuarioValido.rol || 'cliente'
            };
            localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));
            
            if (usuarioActivo.rol === 'admin') {
                alert("Bienvenido al Panel de Administración");
                window.location.href = 'pedidos.html';
            } else {
                window.location.href = '../index.html';
            }
        } else {
            alert("Error: El usuario no existe o la contraseña es incorrecta.");
        }
    });
}

function verificarSesion() {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    const contenedorAcciones = document.querySelector('.user-actions');
    
    if (usuarioActivo && contenedorAcciones) {
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

function cargarPerfilUsuario() {
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
    const nombrePerfil = document.getElementById('perfil-nombre');
    const correoPerfil = document.getElementById('perfil-correo');
    
    if (nombrePerfil && correoPerfil && usuarioActivo) {
        nombrePerfil.innerText = usuarioActivo.nombre;
        correoPerfil.innerText = usuarioActivo.correo;
    } else if (nombrePerfil && !usuarioActivo) {
        window.location.href = 'login.html';
    }
}

// ==================================================================
// MÓDULO 8: PANEL ADMIN - GESTIÓN DE PRODUCTOS Y STOCK
// ==================================================================
function renderizarProductosAdmin() {
    const tbody = document.getElementById('tabla-productos-body');
    if (!tbody) return;

    const productos = obtenerProductos();
    tbody.innerHTML = '';

    productos.forEach(p => {
        const esCritico = p.stock <= (p.stockCritico || 0);
        const tr = document.createElement('tr');
        if (esCritico) tr.style.backgroundColor = '#ffe6e6';

        tr.innerHTML = `
            <td>${p.codigo}</td>
            <td><strong>${p.nombre}</strong></td>
            <td>$${p.precio.toLocaleString('es-CL')}</td>
            <td>
                <input type="number" value="${p.stock}" min="0" style="width: 70px; padding: 5px;" id="stock-input-${p.id}">
                ${esCritico ? '<span style="color:red; font-weight:bold; margin-left: 5px;">⚠️ Stock Crítico</span>' : ''}
            </td>
            <td>${p.stockCritico || 0}</td>
            <td><span style="text-transform: capitalize;">${p.categoria}</span></td>
            <td>
                <button type="button" class="btn" style="padding: 5px 10px;" onclick="actualizarStockDirecto('${p.id}')">Guardar Stock</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.actualizarStockDirecto = function(id) {
    const input = document.getElementById(`stock-input-${id}`);
    if (!input) return;

    const nuevoStock = parseInt(input.value);
    if (isNaN(nuevoStock) || nuevoStock < 0) {
        alert("Ingresa una cantidad válida.");
        return;
    }

    let productos = obtenerProductos();
    productos = productos.map(p => p.id === id ? { ...p, stock: nuevoStock } : p);
    guardarProductos(productos);
    alert("Stock actualizado exitosamente.");
    renderizarProductosAdmin();
};

const formProducto = document.getElementById('form-producto');
if (formProducto) {
    formProducto.addEventListener('submit', (e) => {
        e.preventDefault();
        const codigo = document.getElementById('codigo-prod').value;
        const nombre = document.getElementById('nombre-prod').value;
        const precio = parseFloat(document.getElementById('precio-prod').value);
        const stock = parseInt(document.getElementById('stock-prod').value);
        const stockCritico = parseInt(document.getElementById('stock-critico').value) || 0;
        const categoria = document.getElementById('categoria-prod').value;

        let productos = obtenerProductos();
        const existe = productos.find(p => p.codigo === codigo);

        if (existe) {
            // Actualizar existente
            existe.nombre = nombre;
            existe.precio = precio;
            existe.stock = stock;
            existe.stockCritico = stockCritico;
            existe.categoria = categoria;
        } else {
            // Crear nuevo
            const nuevoProd = {
                id: String(Date.now()),
                codigo,
                nombre,
                precio,
                stock,
                stockCritico,
                categoria,
                descripcion: "Producto agregado desde panel admin",
                imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
            };
            productos.push(nuevoProd);
        }

        guardarProductos(productos);
        alert("Producto guardado correctamente.");
        formProducto.reset();
        renderizarProductosAdmin();
    });
}

// ==================================================================
// MÓDULO 9: PANEL ADMIN - GESTIÓN DE PEDIDOS
// ==================================================================
function renderizarPedidosAdmin() {
    const tbody = document.getElementById('tabla-pedidos-body');
    if (!tbody) return;

    const pedidos = JSON.parse(localStorage.getItem('pedidosForkMenu')) || [];
    tbody.innerHTML = '';

    if (pedidos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 1rem;">No hay pedidos registrados en el sistema.</td></tr>';
        return;
    }

    pedidos.forEach((ped, index) => {
        const tr = document.createElement('tr');
        const listaItems = ped.items ? ped.items.map(i => `${i.nombre} (x${i.cantidad})`).join('<br>') : 'Sin items';

        tr.innerHTML = `
            <td><strong>${ped.codigo}</strong></td>
            <td>${ped.cliente}</td>
            <td>${ped.modalidad}</td>
            <td>
                <select onchange="cambiarEstadoPedido(${index}, this.value)" style="padding: 5px;">
                    <option value="En preparación" ${ped.estado === 'En preparación' ? 'selected' : ''}>En preparación</option>
                    <option value="Listo para retiro" ${ped.estado === 'Listo para retiro' ? 'selected' : ''}>Listo para retiro</option>
                    <option value="En camino" ${ped.estado === 'En camino' ? 'selected' : ''}>En camino</option>
                    <option value="Entregado" ${ped.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                    <option value="Cancelado" ${ped.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
            <td>$${ped.total.toLocaleString('es-CL')}</td>
            <td style="font-size: 0.85rem;">${listaItems}</td>
        `;
        tbody.appendChild(tr);
    });
}

window.cambiarEstadoPedido = function(index, nuevoEstado) {
    let pedidos = JSON.parse(localStorage.getItem('pedidosForkMenu')) || [];
    pedidos[index].estado = nuevoEstado;
    localStorage.setItem('pedidosForkMenu', JSON.stringify(pedidos));
    alert(`El pedido ${pedidos[index].codigo} cambió a estado: "${nuevoEstado}"`);
};

// ==================================================================
// MÓDULO: SEGURIDAD Y PROTECCIÓN DE RUTAS ADMIN
// ==================================================================
function protegerRutasAdmin() {
    const esVistaAdmin = window.location.pathname.includes('pedidos.html') || 
                         window.location.pathname.includes('productos-admin.html') || 
                         window.location.pathname.includes('usuarios-admin.html');
    
    if (esVistaAdmin) {
        const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
        if (!usuarioActivo || usuarioActivo.rol !== 'admin') {
            alert("Acceso denegado: Debes iniciar sesión como Administrador.");
            window.location.href = 'login.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    protegerRutasAdmin(); // Se ejecuta en primer lugar para bloquear el render si no es admin
    verificarSesion(); 
    cargarPerfilUsuario(); 
    actualizarContadorSuperior(); 
    renderizarCarrito(); 
    renderizarResumenCheckout(); 
    cargarDetalleProducto(); 
    renderizarTicketConfirmacion(); 
    renderizarProductosAdmin();
    renderizarPedidosAdmin();
});