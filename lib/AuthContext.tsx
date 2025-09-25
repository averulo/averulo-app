// lib/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; email: string; role?: string; isVerified?: boolean };
type AuthState =
  | { status: "loading" }
  | { status: "signedOut" }
  | { status: "needsVerification"; token: string; user: User }
  | { status: "signedIn"; token: string; user: User };

type AuthCtx = {
  state: AuthState;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthCtx>(null as any);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" });

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return setState({ status: "signedOut" });
        // fetch /api/me to know verification status
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const user: User = await res.json();
        if (user?.isVerified) setState({ status: "signedIn", token, user });
        else setState({ status: "needsVerification", token, user });
      } catch {
        setState({ status: "signedOut" });
      }
    })();
  }, []);

  const signIn = async (token: string, user: User) => {
    await AsyncStorage.setItem("token", token);
    if (user?.isVerified) setState({ status: "signedIn", token, user });
    else setState({ status: "needsVerification", token, user });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setState({ status: "signedOut" });
  };

  const refreshMe = async (token: string) => {
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error();
    const user: User = await res.json();
    if (user?.isVerified) setState({ status: "signedIn", token, user });
    else setState({ status: "needsVerification", token, user });
  };

  const value = useMemo(() => ({ state, signIn, signOut, refreshMe }), [state]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
