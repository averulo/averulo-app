// lib/auth.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type AuthCtx = {
  token: string | null;
  user: any | null;
  signIn: (t: string, u: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  // hydrate from storage once
  useEffect(() => {
    (async () => {
      try {
        const [t, u] = await Promise.all([
          AsyncStorage.getItem("token"),
          AsyncStorage.getItem("user"),
        ]);
        if (t) setToken(t);
        if (u) setUser(JSON.parse(u));
      } catch {}
    })();
  }, []);

  async function signIn(t: string, u: any) {
    setToken(t);
    setUser(u);
    await AsyncStorage.setItem("token", t);
    await AsyncStorage.setItem("user", JSON.stringify(u));
  }

  async function signOut() {
    setToken(null);
    setUser(null);
    await AsyncStorage.multiRemove(["token", "user"]);
  }

  return (
    <Ctx.Provider value={{ token, user, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}