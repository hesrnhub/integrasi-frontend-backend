import { api } from './client';
import type { PageMeta, Stall, StallInput, StallQuery } from './types';

export const stallsApi = {
  // GET /stalls?search=&category=&page=&limit=  (query parameter)
  list: async (query: StallQuery) => {
    const params: Record<string, string | number> = {};
    if (query.search) params.search = query.search;
    if (query.category) params.category = query.category;
    if (query.page) params.page = query.page;
    if (query.limit) params.limit = query.limit;
    const res = await api.get<{ data: Stall[]; meta: PageMeta }>('/stalls', { params });
    return res.data;
  },

  // GET /stalls/:id  (path parameter)
  get: async (id: number) => (await api.get<{ data: Stall }>(`/stalls/${id}`)).data.data,

  // POST /stalls  (request body)
  create: async (body: StallInput) => (await api.post<{ data: Stall }>('/stalls', body)).data.data,

  // PUT /stalls/:id
  update: async (id: number, body: StallInput) =>
    (await api.put<{ data: Stall }>(`/stalls/${id}`, body)).data.data,

  // DELETE /stalls/:id -> backend membalas 200 dengan data warung yang dihapus
  remove: async (id: number) => (await api.delete<{ data: Stall }>(`/stalls/${id}`)).data.data,
};
