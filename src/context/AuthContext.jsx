import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getToken, setToken } from "../api/client.js";
import { login as apiLogin, me as apiMe, register as apiRegister } from "../services/appAuth.service.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const u = await apiMe();
      setUser(u || null);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async ({ phone, password }) => {
    const out = await apiLogin({ phone, password });
    if (out?.token) setToken(out.token);
    await refresh();
    return out;
  }, [refresh]);

  const register = useCallback(async (payload) => {
    const out = await apiRegister(payload);
    if (out?.token) setToken(out.token);
    await refresh();
    return out;
  }, [refresh]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh, isAuthed: Boolean(user) }),
    [user, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
