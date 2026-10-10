/**
 * Formatea un RUN chileno al formato XX.XXX.XXX-X
 * @param {string} rut
 * @returns {string}
 */
export function formatearRUT(rut) {
  if (!rut) return '';
  const limpio = rut.toString().replace(/[^0-9kK]/gi, '').toUpperCase();
  if (limpio.length <= 1) return limpio;

  // Limitar a máximo 9 caracteres (cuerpo + DV)
  const recortado = limpio.length > 9 ? limpio.slice(0, 9) : limpio;
  const cuerpo = recortado.slice(0, -1);
  const dv = recortado.slice(-1);
  const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${cuerpoConPuntos}-${dv}`;
}

/**
 * Valida un RUT chileno usando el algoritmo Módulo 11
 * @param {string} rut
 * @returns {boolean}
 */
export function validarRUT(rut) {
  if (!rut) return false;
  const limpio = rut.toString().replace(/[^0-9kK]/gi, '').toUpperCase();
  if (limpio.length < 8 || limpio.length > 9) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvCalculado = '';
  if (dvEsperado === 11) dvCalculado = '0';
  else if (dvEsperado === 10) dvCalculado = 'K';
  else dvCalculado = dvEsperado.toString();

  return dv === dvCalculado;
}

/**
 * Valida si un correo electrónico pertenece a los dominios permitidos
 * @param {string} email
 * @returns {{ valido: boolean, mensaje: string }}
 */
export function validarEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valido: false, mensaje: 'El correo es obligatorio.' };
  }
  const emailNormalizado = email.trim().toLowerCase();
  const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
  
  const tieneDominioPermitido = dominiosPermitidos.some((dom) => emailNormalizado.endsWith(dom));
  const formatoBasico = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado);

  if (!formatoBasico || !tieneDominioPermitido) {
    return {
      valido: false,
      mensaje: 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'
    };
  }

  return { valido: true, mensaje: '' };
}

/**
 * Valida largo de la contraseña (de 4 a 10 caracteres según requerimientos)
 * @param {string} pass
 * @returns {{ valido: boolean, mensaje: string }}
 */
export function validarPassword(pass) {
  if (!pass || pass.length < 4 || pass.length > 10) {
    return {
      valido: false,
      mensaje: 'La contraseña debe tener entre 4 y 10 caracteres.'
    };
  }
  return { valido: true, mensaje: '' };
}

/**
 * Valida campos de texto según rango
 * @param {string} texto
 * @param {number} min
 * @param {number} max
 * @param {string} nombreCampo
 * @returns {{ valido: boolean, mensaje: string }}
 */
export function validarTexto(texto, min = 1, max = 100, nombreCampo = 'El campo') {
  const t = (texto || '').trim();
  if (t.length < min) {
    return { valido: false, mensaje: `${nombreCampo} es obligatorio (mínimo ${min} caracteres).` };
  }
  if (t.length > max) {
    return { valido: false, mensaje: `${nombreCampo} no puede superar los ${max} caracteres.` };
  }
  return { valido: true, mensaje: '' };
}

/**
 * Calcula el descuento aplicable a partir de un cupón
 * @param {number} subtotal
 * @param {{ tipo: string, valor: number } | null} cupon
 * @returns {number}
 */
export function calcularDescuento(subtotal, cupon) {
  if (!cupon || subtotal <= 0) return 0;
  let desc = 0;
  if (cupon.tipo === 'porcentaje') {
    desc = Math.round(subtotal * cupon.valor);
  } else if (cupon.tipo === 'fijo') {
    desc = cupon.valor;
  }
  if (desc > subtotal) desc = subtotal;
  return desc;
}

/**
 * Formatea un monto numérico a formato peso chileno CLP
 * @param {number} monto
 * @returns {string}
 */
export function formatearPrecio(monto) {
  const valor = Number(monto) || 0;
  return `$${valor.toLocaleString('es-CL')}`;
}
