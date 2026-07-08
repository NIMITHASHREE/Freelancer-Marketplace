import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Restore session from localStorage on page refresh
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');
    const name  = localStorage.getItem('fullName');
    const id    = localStorage.getItem('userId');
    if (token) setUser({ token, role, fullName: name, userId: Number(id) });
  }, []);

  const login = (data) => {
    localStorage.setItem('token',    data.token);
    localStorage.setItem('role',     data.role);
    localStorage.setItem('fullName', data.fullName);
    localStorage.setItem('userId',   data.userId);
    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
