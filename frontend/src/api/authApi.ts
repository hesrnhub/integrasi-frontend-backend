import { api } from './client';
import type { LoginResult, User } from './types';

export const authApi = {
  // POST /auth/register -> 201 { data: { user } }
  register: async (body: { name: string; email: string; password: string }) =>
    (await api.post<{ data: { user: User } }>('/auth/register', body)).data.data.user,

  // POST /auth/login -> 200 { data: { token, tokenType, expiresIn, user } }
  login: async (body: { email: string; password: string }) =>
    (await api.post<{ data: LoginResult }>('/auth/login', body)).data.data,

  // GET /auth/me -> 200 { data: user }
  me: async () => (await api.get<{ data: User }>('/auth/me')).data.data,
};
