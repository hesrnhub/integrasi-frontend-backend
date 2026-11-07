import { Link } from 'react-router-dom';
import { EmptyState } from '../components/Feedback';

export function ForbiddenPage() {
  return (
    <div className="container page">
      <EmptyState
        title="403 · Akses ditolak"
        hint="Role Anda tidak memiliki izin untuk membuka halaman ini."
        action={<Link className="btn" to="/">Kembali ke beranda</Link>}
      />
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="container page">
      <EmptyState
        title="404 · Halaman tidak ditemukan"
        hint="Alamat yang Anda buka tidak tersedia."
        action={<Link className="btn" to="/">Kembali ke beranda</Link>}
      />
    </div>
  );
}
