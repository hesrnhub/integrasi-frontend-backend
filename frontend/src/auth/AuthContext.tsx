import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { TOKEN_KEY, UNAUTHORIZED_EVENT } from '../api/client';
import type { User } from '../api/types';
import { useToast } from '../components/Toast';

interface AuthState {
  user: User | null;
  loading: boolean; // true selama sesi (token lama) sedang diperiksa lewat GET /auth/me
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem(TOKEN_KEY));
  const notify = useToast();

  // Saat aplikasi dibuka: jika ada token tersimpan, cek ke backend siapa penggunanya.
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    authApi
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  // Dipicu interceptor Axios ketika endpoint terlindungi membalas 401.
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      notify('Sesi berakhir. Silakan login kembali.', 'error');
    };
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [notify]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    localStorage.setItem(TOKEN_KEY, result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
