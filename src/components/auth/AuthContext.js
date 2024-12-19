import React, { createContext, useContext, useState, useEffect } from 'react';
import { refresh } from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(' ');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
          const refreshToken = localStorage.getItem('refreshToken');
          const res = await refresh(refreshToken);

          if (res.status === 200) {
            const decoded = jwtDecode(res.data.access);

            loginG(decoded, res.data);
            setIsLoggedIn(true);
          } else {
            logout();
          }
        } else {
          setIsLoggedIn(true);
          setUser(decoded);
        }
      } catch (error) {
        logout();
      }
    };

    auth();
  }, []);

  // Login function
  const loginG = (userData, tokens) => {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);

    setUser(userData);
    setIsLoggedIn(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loginG, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
