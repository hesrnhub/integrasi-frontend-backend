import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { toApiError } from '../api/errors';
import type { User } from '../api/types';
import { ErrorState, Loading } from '../components/Feedback';

const ROLE_INFO: Record<User['role'], string> = {
  admin: 'Dapat membuat, mengubah, dan menghapus semua warung.',
  owner: 'Dapat membuat warung dan mengubah warung miliknya sendiri.',
  customer: 'Dapat melihat daftar dan detail warung.',
};

// Data diambil langsung dari GET /auth/me (bukan dari cache), sebagai bukti integrasi.
export default function ProfilePage() {
  const [me, setMe] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authApi.me().then(setMe).catch((e) => setError(toApiError(e).message));
  }, []);

  if (error) return <div className="container page"><ErrorState message={error} /></div>;
  if (!me) return <Loading text="Memuat profil..." />;

  return (
    <div className="container page narrow">
      <div className="card">
        <h1>Profil saya</h1>
        <dl className="kv">
          <dt>ID</dt><dd>{me.id}</dd>
          <dt>Nama</dt><dd>{me.name}</dd>
          <dt>Email</dt><dd>{me.email}</dd>
          <dt>Role</dt><dd><span className={`badge badge-${me.role}`}>{me.role}</span></dd>
        </dl>
        <p className="muted">{ROLE_INFO[me.role]}</p>
      </div>
    </div>
  );
}
