import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { stallsApi } from '../api/stallsApi';
import { toApiError } from '../api/errors';
import type { Stall, StallInput } from '../api/types';
import { ErrorState, Loading } from '../components/Feedback';
import { StallForm } from '../components/StallForm';
import { useToast } from '../components/Toast';

// Satu halaman untuk tambah (/stalls/new) dan ubah (/stalls/:id/edit).
// Halaman hanya dibatasi per role. Aturan "owner hanya warung miliknya" ditegakkan backend (403).
export default function StallFormPage() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const notify = useToast();

  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isEdit) return;
    stallsApi
      .get(Number(id))
      .then(setStall)
      .catch((e) => setLoadError(toApiError(e).message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const submit = async (data: StallInput) => {
    setSaving(true);
    setFormError(null);
    setFieldErrors({});
    try {
      const saved = isEdit ? await stallsApi.update(Number(id), data) : await stallsApi.create(data);
      notify(isEdit ? 'Warung berhasil diperbarui.' : 'Warung berhasil ditambahkan.', 'success');
      navigate(`/stalls/${saved.id}`);
    } catch (e) {
      const err = toApiError(e);
      setFieldErrors(err.fieldErrors);
      if (err.status === 403) setFormError(`Akses ditolak (403): ${err.message}`);
      else if (err.status === 400) setFormError('Periksa kembali isian yang ditandai.');
      else setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading text="Memuat data warung..." />;
  if (loadError) return <div className="container page"><ErrorState message={loadError} /></div>;

  return (
    <div className="container page narrow">
      <Link to={isEdit ? `/stalls/${id}` : '/'} className="back">← Batal</Link>
      <div className="card">
        <h1>{isEdit ? 'Ubah warung' : 'Tambah warung'}</h1>
        {formError && <div className="alert alert-error" role="alert">{formError}</div>}
        <StallForm
          initial={
            stall
              ? {
                  name: stall.name,
                  category: stall.category ?? '',
                  location: stall.location ?? '',
                  description: stall.description ?? '',
                }
              : undefined
          }
          submitText={isEdit ? 'Simpan perubahan' : 'Tambah warung'}
          busy={saving}
          fieldErrors={fieldErrors}
          onSubmit={submit}
        />
      </div>
    </div>
  );
}
