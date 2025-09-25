// hooks/useAuth.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from '../lib/api'; // 👈 we already have this

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const restoreToken = async () => {
    const storedToken = await AsyncStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      try {
        const me = await getMe(storedToken);
        setUser(me);
      } catch (err) {
        console.warn("restoreToken failed:", err.message);
      }
    }
    setLoading(false);
  };

  const signIn = async (newToken) => {
    await AsyncStorage.setItem('auth_token', newToken);
    setToken(newToken);
    const me = await getMe(newToken);
    setUser(me);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!token) return;
    try {
      const me = await getMe(token);
      setUser(me);
    } catch (err) {
      console.warn("refreshUser failed:", err.message);
    }
  };

  useEffect(() => {
    restoreToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);