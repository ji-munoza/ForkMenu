import { api } from './api';

/**
 * Servicio de autenticación y gestión de usuarios contra la API REST de Spring Boot.
 * Administra el inicio de sesión con JWT, el registro de clientes y la gestión de roles.
 */
export const authService = {
  /**
   * Autentica al usuario con correo y contraseña, retornando el token JWT y los datos del perfil.
   */
  async login(correo, contrasena) {
    const respuesta = await api.post('/auth/login', {
      correo: (correo || '').trim().toLowerCase(),
      contrasena,
    });
    return respuesta;
  },

  /**
   * Registra un nuevo cliente en la base de datos de ForkMenu.
   */
  async register(datosUsuario) {
    const payload = {
      run: (datosUsuario.run || '').trim(),
      nombre: (datosUsuario.nombre || '').trim(),
      apellidos: (datosUsuario.apellidos || '').trim(),
      correo: (datosUsuario.correo || '').trim().toLowerCase(),
      contrasena: datosUsuario.contrasena,
      rol: datosUsuario.rol || 'cliente',
      region: datosUsuario.region || '',
      comuna: datosUsuario.comuna || '',
      direccion: datosUsuario.direccion || '',
    };
    return await api.post('/auth/register', payload);
  },

  /**
   * Consulta los datos del usuario en sesión actual usando el token JWT.
   */
  async obtenerPerfil() {
    return await api.get('/auth/me');
  },

  /**
   * Lista todos los usuarios registrados en el sistema (requiere rol ADMIN).
   */
  async listarUsuarios() {
    return await api.get('/usuarios');
  },

  /**
   * Actualiza el rol de un usuario existente (requiere rol ADMIN).
   */
  async actualizarRol(id, nuevoRol) {
    return await api.patch(`/usuarios/${id}/rol`, { rol: nuevoRol });
  },

  /**
   * Elimina un usuario por su ID numérico o por su RUN/correo.
   */
  async eliminarUsuario(identificador) {
    if (typeof identificador === 'number' || /^\d+$/.test(identificador)) {
      return await api.delete(`/usuarios/${identificador}`);
    }
    return await api.delete(`/usuarios/identificador/${encodeURIComponent(identificador)}`);
  },

  /**
   * Crea o actualiza un usuario desde el panel administrativo (requiere rol ADMIN).
   */
  async agregarOActualizar(datos) {
    return await api.post('/usuarios', datos);
  },
};
