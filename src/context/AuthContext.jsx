import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuariosIniciales } from '../utils/dataInicial';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Carga la sesión guardada, si existe.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const guardado = localStorage.getItem('usuarioActivo');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  // Carga los usuarios guardados o usa los usuarios de ejemplo.
  const [usersList, setUsersList] = useState(() => {
    try {
      const guardados = localStorage.getItem('usuariosForkMenu');
      if (guardados) return JSON.parse(guardados);
      localStorage.setItem('usuariosForkMenu', JSON.stringify(usuariosIniciales));
      return usuariosIniciales;
    } catch {
      return usuariosIniciales;
    }
  });

  // Guarda o elimina la sesión cuando cambia.
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('usuarioActivo', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('usuarioActivo');
    }
  }, [currentUser]);

  // Guarda la lista cuando cambia.
  useEffect(() => {
    localStorage.setItem('usuariosForkMenu', JSON.stringify(usersList));
  }, [usersList]);

  // Busca al usuario con ese correo y contraseña e inicia su sesión.
  function iniciarSesion(correo, contrasena) {
    const emailNorm = (correo || '').trim().toLowerCase();
    const usuarioEncontrado = usersList.find(
      (u) => u.correo.toLowerCase() === emailNorm && u.contrasena === contrasena
    );

    if (!usuarioEncontrado) {
      return { success: false, error: 'Correo o contraseña incorrectos.' };
    }

    const activo = {
      run: usuarioEncontrado.run || '',
      nombre: usuarioEncontrado.nombre || 'Usuario',
      correo: usuarioEncontrado.correo,
      rol: usuarioEncontrado.rol || 'cliente',
      direccion: usuarioEncontrado.direccion || '',
      region: usuarioEncontrado.region || '',
      comuna: usuarioEncontrado.comuna || '',
    };

    setCurrentUser(activo);
    return { success: true, user: activo };
  }

  // Cierra la sesión.
  function cerrarSesion() {
    setCurrentUser(null);
  }

  // Registra una cuenta nueva.
  function registrarUsuario(datosUsuario) {
    const emailNorm = (datosUsuario.correo || '').trim().toLowerCase();
    const existe = usersList.some((u) => u.correo.toLowerCase() === emailNorm);
    if (existe) {
      return { success: false, error: 'Este correo electrónico ya se encuentra registrado.' };
    }

    const nuevo = {
      run: datosUsuario.run,
      nombre: `${datosUsuario.nombre} ${datosUsuario.apellidos}`.trim(),
      correo: emailNorm,
      contrasena: datosUsuario.contrasena,
      rol: datosUsuario.rol || 'cliente',
      region: datosUsuario.region,
      comuna: datosUsuario.comuna,
      direccion: datosUsuario.direccion,
    };

    setUsersList((prev) => [...prev, nuevo]);
    return { success: true, user: nuevo };
  }

  // Cambia el rol de un usuario.
  function actualizarRolUsuario(identificador, nuevoRol) {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.correo === identificador || u.run === identificador) {
          return { ...u, rol: nuevoRol };
        }
        return u;
      })
    );
  }

  // Elimina al usuario indicado por correo o RUN.
  function eliminarUsuario(identificador) {
    setUsersList((prev) =>
      prev.filter((u) => u.correo !== identificador && u.run !== identificador)
    );
  }

  // Agrega un usuario o actualiza sus datos desde el panel.
  function agregarUsuario(nuevo) {
    const emailNorm = (nuevo.correo || '').trim().toLowerCase();
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
      return { success: true, message: 'Usuario actualizado.' };
    }

    setUsersList((prev) => [...prev, { ...nuevo, correo: emailNorm }]);
    return { success: true, message: 'Usuario creado exitosamente.' };
  }

  // Indica si el usuario tiene permisos de administrador o vendedor.
  const isAdmin = currentUser?.rol === 'admin';
  const isVendedor = currentUser?.rol === 'vendedor';

  return (
    <AuthContext.Provider
      value={{
        // Nombres en español usados por la aplicación.
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

        // Los mismos datos y funciones también están disponibles en inglés.
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
