import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usuariosIniciales } from '../utils/dataInicial';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Carga la sesión del usuario guardada previamente en el navegador.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const guardado = localStorage.getItem('usuarioActivo');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  // Lista de usuarios registrados (utilizada en el panel de administración).
  const [usersList, setUsersList] = useState(() => {
    try {
      const guardados = localStorage.getItem('usuariosForkMenu');
      if (guardados) return JSON.parse(guardados);
      return usuariosIniciales;
    } catch {
      return usuariosIniciales;
    }
  });

  // Sincroniza la sesión activa con localStorage y almacena el token JWT correspondiente.
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('usuarioActivo', JSON.stringify(currentUser));
      if (currentUser.token) {
        localStorage.setItem('tokenForkMenu', currentUser.token);
      }
    } else {
      localStorage.removeItem('usuarioActivo');
      localStorage.removeItem('tokenForkMenu');
    }
  }, [currentUser]);

  // Si el usuario conectado es administrador, sincroniza la lista de usuarios desde MySQL.
  const cargarUsuariosDesdeBackend = useCallback(async () => {
    if (!currentUser || currentUser.rol !== 'admin') return;
    try {
      const lista = await authService.listarUsuarios();
      if (Array.isArray(lista) && lista.length > 0) {
        setUsersList(lista);
        localStorage.setItem('usuariosForkMenu', JSON.stringify(lista));
      }
    } catch (err) {
      console.warn('No fue posible sincronizar la lista de usuarios desde el backend:', err.message);
    }
  }, [currentUser]);

  useEffect(() => {
    cargarUsuariosDesdeBackend();
  }, [cargarUsuariosDesdeBackend]);

  // Inicia sesión verificando credenciales en el backend con JWT.
  async function iniciarSesion(correo, contrasena) {
    const emailNorm = (correo || '').trim().toLowerCase();

    try {
      const respuesta = await authService.login(emailNorm, contrasena);
      const usuarioApi = respuesta.usuario;

      const activo = {
        id: usuarioApi.id,
        run: usuarioApi.run || '',
        nombre: usuarioApi.nombre || 'Usuario',
        apellidos: usuarioApi.apellidos || '',
        correo: usuarioApi.correo,
        rol: (usuarioApi.rol || 'cliente').toLowerCase(),
        direccion: usuarioApi.direccion || '',
        region: usuarioApi.region || '',
        comuna: usuarioApi.comuna || '',
        token: respuesta.token,
      };

      setCurrentUser(activo);
      return { success: true, user: activo };
    } catch (error) {
      // Si el backend rechaza las credenciales (401 Bad Credentials)
      if (error.status === 401) {
        return { success: false, error: 'Correo o contraseña incorrectos.' };
      }

      // Si el servidor backend no responde (modo sin conexión o test aislado), se intenta respaldo local
      console.warn('Servidor no disponible, verificando en credenciales de respaldo local:', error.message);
      const usuarioEncontrado = usersList.find(
        (u) => u.correo.toLowerCase() === emailNorm && u.contrasena === contrasena
      );

      if (!usuarioEncontrado) {
        return {
          success: false,
          error: error.status ? error.message : 'No fue posible conectar con el servidor y las credenciales locales no coinciden.',
        };
      }

      const activoLocal = {
        run: usuarioEncontrado.run || '',
        nombre: usuarioEncontrado.nombre || 'Usuario',
        correo: usuarioEncontrado.correo,
        rol: (usuarioEncontrado.rol || 'cliente').toLowerCase(),
        direccion: usuarioEncontrado.direccion || '',
        region: usuarioEncontrado.region || '',
        comuna: usuarioEncontrado.comuna || '',
        token: 'token-modo-local-simulado',
      };

      setCurrentUser(activoLocal);
      return { success: true, user: activoLocal };
    }
  }

  // Cierra la sesión activa y elimina las credenciales locales.
  function cerrarSesion() {
    setCurrentUser(null);
  }

  // Registra un nuevo usuario en la base de datos de MySQL.
  async function registrarUsuario(datosUsuario) {
    const emailNorm = (datosUsuario.correo || '').trim().toLowerCase();

    try {
      const nuevoRegistrado = await authService.register(datosUsuario);
      setUsersList((prev) => [...prev, nuevoRegistrado]);
      return { success: true, user: nuevoRegistrado };
    } catch (error) {
      // Si el error proviene del backend (por ejemplo correo ya registrado o validación)
      if (error.status) {
        return { success: false, error: error.message };
      }

      // Respaldo en memoria local en caso de que el backend esté temporalmente apagado
      console.warn('Backend sin conexión, registrando cuenta en almacenamiento local:', error.message);
      const existe = usersList.some((u) => u.correo.toLowerCase() === emailNorm);
      if (existe) {
        return { success: false, error: 'Este correo electrónico ya se encuentra registrado.' };
      }

      const nuevoLocal = {
        run: datosUsuario.run,
        nombre: `${datosUsuario.nombre} ${datosUsuario.apellidos}`.trim(),
        correo: emailNorm,
        contrasena: datosUsuario.contrasena,
        rol: datosUsuario.rol || 'cliente',
        region: datosUsuario.region,
        comuna: datosUsuario.comuna,
        direccion: datosUsuario.direccion,
      };

      setUsersList((prev) => [...prev, nuevoLocal]);
      return { success: true, user: nuevoLocal };
    }
  }

  // Cambia el rol de un usuario tanto en la base de datos como en el estado local.
  async function actualizarRolUsuario(identificador, nuevoRol) {
    const usuario = usersList.find(
      (u) => u.correo === identificador || u.run === identificador || String(u.id) === String(identificador)
    );

    if (usuario && usuario.id) {
      try {
        await authService.actualizarRol(usuario.id, nuevoRol);
      } catch (err) {
        console.warn('No se pudo actualizar el rol en el backend, aplicando cambio en memoria local:', err.message);
      }
    }

    setUsersList((prev) =>
      prev.map((u) => {
        if (u.correo === identificador || u.run === identificador || String(u.id) === String(identificador)) {
          return { ...u, rol: nuevoRol };
        }
        return u;
      })
    );
  }

  // Elimina a un usuario por su identificador.
  async function eliminarUsuario(identificador) {
    const usuario = usersList.find(
      (u) => u.correo === identificador || u.run === identificador || String(u.id) === String(identificador)
    );

    const idAEliminar = usuario?.id || identificador;
    try {
      await authService.eliminarUsuario(idAEliminar);
    } catch (err) {
      console.warn('No se pudo eliminar el usuario en el backend, aplicando cambio en local:', err.message);
    }

    setUsersList((prev) =>
      prev.filter((u) => u.correo !== identificador && u.run !== identificador && String(u.id) !== String(identificador))
    );
  }

  // Agrega o actualiza un usuario desde el panel de administración.
  async function agregarUsuario(nuevo) {
    const emailNorm = (nuevo.correo || '').trim().toLowerCase();

    try {
      const guardado = await authService.agregarOActualizar(nuevo);
      setUsersList((prev) => {
        const existe = prev.some((u) => u.id === guardado.id || u.correo.toLowerCase() === emailNorm);
        if (existe) {
          return prev.map((u) => (u.id === guardado.id || u.correo.toLowerCase() === emailNorm ? guardado : u));
        }
        return [...prev, guardado];
      });
      return { success: true, message: 'Usuario registrado exitosamente en el servidor.' };
    } catch (err) {
      console.warn('No se pudo guardar el usuario en el backend, aplicando en modo local:', err.message);

      const existe = usersList.some(
        (u) => u.correo.toLowerCase() === emailNorm || (nuevo.run && u.run === nuevo.run)
      );

      if (existe) {
        setUsersList((prev) =>
          prev.map((u) => {
            if (u.correo.toLowerCase() === emailNorm || (nuevo.run && u.run === nuevo.run)) {
              return { ...u, ...nuevo, correo: emailNorm };
            }
            return u;
          })
        );
        return { success: true, message: 'Usuario actualizado (modo local).' };
      }

      setUsersList((prev) => [...prev, { ...nuevo, correo: emailNorm }]);
      return { success: true, message: 'Usuario creado exitosamente (modo local).' };
    }
  }

  // Banderas de privilegios
  const rolNormalizado = (currentUser?.rol || '').toLowerCase();
  const isAdmin = rolNormalizado === 'admin' || rolNormalizado === 'administrador';
  const isVendedor = rolNormalizado === 'vendedor';

  return (
    <AuthContext.Provider
      value={{
        // Nombres en español
        usuarioActual: currentUser,
        listaUsuarios: usersList,
        esAdmin: isAdmin,
        esVendedor: isVendedor,
        iniciarSesion,
        cerrarSesion,
        registrarUsuario,
        actualizarRolUsuario,
        eliminarUsuario,
        agregarUsuario,
        recargarUsuarios: cargarUsuariosDesdeBackend,

        // Compatibilidad con nombres en inglés
        currentUser,
        usersList,
        isAdmin,
        isVendedor,
        login: iniciarSesion,
        logout: cerrarSesion,
        register: registrarUsuario,
        updateUserRole: actualizarRolUsuario,
        deleteUser: eliminarUsuario,
        addUser: agregarUsuario,
        reloadUsers: cargarUsuariosDesdeBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}
