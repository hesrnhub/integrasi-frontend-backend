import axios from 'axios';

export const TOKEN_KEY = 'kantin_token';
export const UNAUTHORIZED_EVENT = 'auth:unauthorized';

// Satu instance Axios untuk seluruh aplikasi. Base URL berasal dari .env.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: sisipkan JWT (Bearer) otomatis di setiap request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: 401 pada endpoint terlindungi berarti sesi habis/tidak valid.
// Endpoint auth dikecualikan agar salah password tidak dianggap sesi habis.
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/me'];
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? '';
    if (status === 401 && !AUTH_PATHS.some((p) => url.includes(p))) {
      localStorage.removeItem(TOKEN_KEY);
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);
