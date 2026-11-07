import { useState, type FormEvent } from 'react';
import type { StallInput } from '../api/types';

interface Props {
  initial?: StallInput;
  submitText: string;
  busy: boolean;
  fieldErrors: Record<string, string>; // error validasi per field dari backend
  onSubmit: (data: StallInput) => void;
}

export function StallForm({ initial, submitText, busy, fieldErrors, onSubmit }: Props) {
  const [form, setForm] = useState<StallInput>({
    name: initial?.name ?? '',
    category: initial?.category ?? '',
    location: initial?.location ?? '',
    description: initial?.description ?? '',
  });

  const set = (key: keyof StallInput) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handle = (e: FormEvent) => {
    e.preventDefault();
    // Hanya kirim field yang diisi (backend memakai schema .strict()).
    const payload: StallInput = { name: form.name };
    if (form.category?.trim()) payload.category = form.category.trim();
    if (form.location?.trim()) payload.location = form.location.trim();
    if (form.description?.trim()) payload.description = form.description.trim();
    onSubmit(payload);
  };

  const err = (k: string) => fieldErrors[k] && <span className="field-error">{fieldErrors[k]}</span>;

  return (
    <form className="form" onSubmit={handle} noValidate>
      <label>
        <span>Nama warung *</span>
        <input value={form.name} onChange={set('name')} placeholder="mis. Warung Bu Tini" />
        {err('name')}
      </label>
      <div className="grid-2">
        <label>
          <span>Kategori</span>
          <input value={form.category} onChange={set('category')} placeholder="mis. Nasi" />
          {err('category')}
        </label>
        <label>
          <span>Lokasi</span>
          <input value={form.location} onChange={set('location')} placeholder="mis. Kantin FK" />
          {err('location')}
        </label>
      </div>
      <label>
        <span>Deskripsi</span>
        <textarea rows={4} value={form.description} onChange={set('description')} />
        {err('description')}
      </label>
      {err('body')}
      <button className="btn btn-primary" disabled={busy}>{busy ? 'Menyimpan...' : submitText}</button>
    </form>
  );
}
