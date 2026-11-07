import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { stallsApi } from '../api/stallsApi';
import { toApiError } from '../api/errors';
import type { Stall } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { canDeleteStall, canEditStall } from '../auth/permissions';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState, ErrorState, Loading } from '../components/Feedback';
import { useToast } from '../components/Toast';

export default function StallDetailPage() {
  const { id } = useParams();
  const stallId = Number(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const notify = useToast();

  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ status: number | null; message: string } | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    stallsApi
      .get(stallId)
      .then((s) => !cancelled && setStall(s))
      .catch((e) => !cancelled && setError(toApiError(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [stallId, reloadKey]);

  const onDelete = async () => {
    setDeleting(true);
    try {
      await stallsApi.remove(stallId);
      notify('Warung berhasil dihapus.', 'success');
      navigate('/');
    } catch (e) {
      const err = toApiError(e);
      notify(err.status === 403 ? `Akses ditolak: ${err.message}` : err.message, 'error');
      setConfirming(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading text="Memuat detail warung..." />;
  if (error?.status === 404 || (error?.status === 400 && !Number.isInteger(stallId)))
    return <div className="container page"><EmptyState title="Warung tidak ditemukan" hint={error.message} action={<Link className="btn" to="/">Kembali ke daftar</Link>} /></div>;
  if (error) return <div className="container page"><ErrorState message={error.message} onRetry={() => setReloadKey((k) => k + 1)} /></div>;
  if (!stall) return null;

  return (
    <div className="container page narrow">
      <Link to="/" className="back">← Kembali</Link>
      <article className="card detail">
        <div className="stall-card-top">
          {stall.category && <span className="tag">{stall.category}</span>}
          {stall.isPopular && <span className="tag tag-accent">Populer</span>}
        </div>
        <h1>{stall.name}</h1>
        <p className="muted">{stall.location ?? 'Lokasi belum diisi'}</p>
        <div className="stats">
          <div><strong>★ {stall.avgRating.toFixed(1)}</strong><span>Rating rata-rata</span></div>
          <div><strong>{stall.reviewCount}</strong><span>Ulasan</span></div>
          <div><strong>#{stall.ownerId}</strong><span>ID pemilik</span></div>
        </div>
        <h3>Deskripsi</h3>
        <p>{stall.description || 'Belum ada deskripsi.'}</p>

        {(canEditStall(user, stall) || canDeleteStall(user)) && (
          <div className="actions">
            {canEditStall(user, stall) && <Link className="btn btn-primary" to={`/stalls/${stall.id}/edit`}>Ubah</Link>}
            {canDeleteStall(user) && <button className="btn btn-danger" onClick={() => setConfirming(true)}>Hapus</button>}
          </div>
        )}
      </article>

      {confirming && (
        <ConfirmDialog
          title="Hapus warung?"
          message={`"${stall.name}" akan dihapus permanen dari database.`}
          busy={deleting}
          onConfirm={onDelete}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
}
