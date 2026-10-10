import React, { createContext, useContext, useState, useEffect } from 'react';
import { usuariosIniciales } from '../utils/dataInicial';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const guardado = localStorage.getItem('usuarioActivo');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

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

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('usuarioActivo', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('usuarioActivo');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('usuariosForkMenu', JSON.stringify(usersList));
  }, [usersList]);

  const login = (correo, contrasena) => {
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
    };

    setCurrentUser(activo);
    return { success: true, user: activo };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (datosUsuario) => {
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
  };

  const updateUserRole = (identificador, nuevoRol) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.correo === identificador || u.run === identificador) {
          return { ...u, rol: nuevoRol };
        }
        return u;
      })
    );
  };

  const deleteUser = (identificador) => {
    setUsersList((prev) =>
      prev.filter((u) => u.correo !== identificador && u.run !== identificador)
    );
  };

  const addUser = (nuevo) => {
    const emailNorm = (nuevo.correo || '').trim().toLowerCase();
    const existe = usersList.some((u) => u.correo.toLowerCase() === emailNorm || (nuevo.run && u.run === nuevo.run));
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
  };

  const isAdmin = currentUser?.rol === 'admin';
  const isVendedor = currentUser?.rol === 'vendedor';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        usersList,
        login,
        logout,
        register,
        updateUserRole,
        deleteUser,
        addUser,
        isAdmin,
        isVendedor,
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
