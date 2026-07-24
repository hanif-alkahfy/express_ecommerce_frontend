import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refreshToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isRefreshing = useRef(false);

  useEffect(() => {
    const initAuth = async () => {
      const storedAccessToken = sessionStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        try {
          const response = await authService.getProfile();
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          if (error.response?.status === 401) {
            const refreshed = await tryRefreshToken(storedRefreshToken);
            if (!refreshed) {
              logout();
            }
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const tryRefreshToken = async (token) => {
    if (isRefreshing.current) return false;
    isRefreshing.current = true;

    try {
      const response = await authService.refreshToken(token);
      const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = response.data.data;

      sessionStorage.setItem('accessToken', newAccessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      setAccessToken(newAccessToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);
      setIsAuthenticated(true);

      isRefreshing.current = false;
      return true;
    } catch (error) {
      isRefreshing.current = false;
      return false;
    }
  };

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken, user: userData } = response.data.data;

    sessionStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    setUser(userData);
    setIsAuthenticated(true);

    return userData;
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      isAuthenticated, 
      isLoading, 
      login, 
      logout, 
      updateUser,
      tryRefreshToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
