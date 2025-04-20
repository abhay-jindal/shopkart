import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';

import { jwtDecode } from 'jwt-decode' // import dependency

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const fetchUser = () => {
      try {
            const token = Cookies.get('token');
            if (!token) return null;

            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp && decodedToken.exp < currentTime) {
              logout(); // Clear the cookie and redirect
              return null;
            }

            return decodedToken;
      } catch (err) {
        return null
      }
    };
    
  const [user, setUser] = useState(fetchUser());


  const login = (token, type) => {
    Cookies.set('token', token);
    Cookies.set('type', type);
    const user = jwtDecode(token);
    setUser(user);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    window.location.href = '/';       // Reload and redirect to home
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
