import type { Stall, User } from '../api/types';

// Aturan tampilan (UX) yang mencerminkan aturan backend.
// Penentu akhir tetap backend: jika berbeda, backend membalas 403.
export const canCreateStall = (u: User | null) => !!u && (u.role === 'owner' || u.role === 'admin');
export const canEditStall = (u: User | null, s: Stall) =>
  !!u && (u.role === 'admin' || (u.role === 'owner' && s.ownerId === u.id));
export const canDeleteStall = (u: User | null) => !!u && u.role === 'admin';
