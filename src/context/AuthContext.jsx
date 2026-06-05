import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on load
    const user = localStorage.getItem('prode_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = (username, password, usersDB) => {
    const user = usersDB.find(u => u.username === username && u.password === password);
    if (!user) {
      return { success: false, message: 'Usuario o contraseña incorrectos' };
    }
    
    // According to rules:
    // Only ACTIVO can enter. Wait, Admin can enter too.
    // Pendiente and Bloqueado cannot enter.
    if (user.role !== 'admin' && user.status === 'PENDIENTE') {
      return { success: false, message: 'Tu cuenta está pendiente de aprobación', status: 'PENDIENTE' };
    }
    if (user.role !== 'admin' && user.status === 'BLOQUEADO') {
      return { success: false, message: 'Tu cuenta ha sido bloqueada', status: 'BLOQUEADO' };
    }
    
    setCurrentUser(user);
    localStorage.setItem('prode_user', JSON.stringify(user));
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('prode_user');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
