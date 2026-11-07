import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { stallsApi } from '../api/stallsApi';
import { toApiError } from '../api/errors';
import type { PageMeta, Stall } from '../api/types';
import { useAuth } from '../auth/AuthContext';
import { canCreateStall } from '../auth/permissions';
import { EmptyState, ErrorState, Loading } from '../components/Feedback';
import { StallCard } from '../components/StallCard';

const LIMIT = 9;

export default function StallListPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const category = params.get('category') ?? '';
  const page = Number(params.get('page') ?? 1) || 1;

  const [searchInput, setSearchInput] = useState(search);
  const [categoryInput, setCategoryInput] = useState(category);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Filter disimpan di URL (?search=&category=&page=) lalu diteruskan sebagai query parameter.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    stallsApi
      .list({ search, category, page, limit: LIMIT })
      .then((res) => {
        if (cancelled) return;
        setStalls(res.data);
        setMeta(res.meta);
      })
      .catch((e) => !cancelled && setError(toApiError(e).message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [search, category, page, reloadKey]);

  const applyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams();
    if (searchInput.trim()) next.set('search', searchInput.trim());
    if (categoryInput.trim()) next.set('category', categoryInput.trim());
    setParams(next);
  };

  const reset = () => {
    setSearchInput('');
    setCategoryInput('');
    setParams(new URLSearchParams());
  };

  const goPage = (p: number) => {
    const next = new URLSearchParams(params);
    next.set('page', String(p));
    setParams(next);
  };

  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1;
  const filtered = !!(search || category);
  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return (
    <div className="container page">
      <div className="page-head">
        <div>
          <h1>Daftar Warung</h1>
          <p className="muted">Temukan warung favorit di kantin kampus.</p>
        </div>
        {canCreateStall(user) && <Link to="/stalls/new" className="btn btn-primary">+ Tambah warung</Link>}
      </div>

      <form className="filters" onSubmit={applyFilter}>
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Cari nama warung..." />
        <input value={categoryInput} onChange={(e) => setCategoryInput(e.target.value)} placeholder="Kategori (mis. Nasi)" />
        <button className="btn btn-primary">Cari</button>
        {filtered && <button type="button" className="btn" onClick={reset}>Reset</button>}
      </form>

      {loading ? (
        <Loading text="Memuat daftar warung..." />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : stalls.length === 0 ? (
        <EmptyState
          title={filtered ? 'Tidak ada hasil' : 'Belum ada warung'}
          hint={filtered ? 'Coba ubah kata kunci atau kategori.' : 'Data warung masih kosong.'}
          action={filtered ? <button className="btn" onClick={reset}>Reset filter</button> : undefined}
        />
      ) : (
        <>
          <div className="grid-cards">{stalls.map((s) => <StallCard key={s.id} stall={s} />)}</div>
          <div className="pagination">
            <button className="btn" disabled={page <= 1} onClick={() => goPage(page - 1)}>← Sebelumnya</button>
            <span className="muted">Halaman {page} dari {totalPages} · {meta?.total} warung</span>
            <button className="btn" disabled={page >= totalPages} onClick={() => goPage(page + 1)}>Berikutnya →</button>
          </div>
        </>
      )}
    </div>
  );
}
