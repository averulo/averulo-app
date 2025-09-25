import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthCtx = {
  token: string | null;
  user: any | null;
  loading: boolean;
  signIn: (token: string, user: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  token: null, user: null, loading: true,
  signIn: async () => {}, signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string|null>(null);
  const [user, setUser] = useState<any|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem("authToken");
      const u = await AsyncStorage.getItem("authUser");
      if (t) setToken(t);
      if (u) setUser(JSON.parse(u));
      setLoading(false);
    })();
  }, []);

  const signIn = async (t: string, u: any) => {
    setToken(t); setUser(u);
    await AsyncStorage.setItem("authToken", t);
    await AsyncStorage.setItem("authUser", JSON.stringify(u));
  };

  const signOut = async () => {
    setToken(null); setUser(null);
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("authUser");
  };

  return <Ctx.Provider value={{ token, user, loading, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}