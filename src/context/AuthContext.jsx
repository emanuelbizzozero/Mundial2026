import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from './safeStorage';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on load
    const user = safeStorage.getItem('prode_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !user) {
        return { success: false, message: 'Usuario o contraseña incorrectos' };
      }
      
      if (user.role !== 'admin' && user.status === 'PENDIENTE') {
        return { success: false, message: 'Tu cuenta está pendiente de aprobación', status: 'PENDIENTE' };
      }
      if (user.role !== 'admin' && user.status === 'BLOQUEADO') {
        return { success: false, message: 'Tu cuenta ha sido bloqueada', status: 'BLOQUEADO' };
      }
      
      setCurrentUser(user);
      safeStorage.setItem('prode_user', JSON.stringify(user));
      return { success: true, user };
    } catch (err) {
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    safeStorage.removeItem('prode_user');
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
