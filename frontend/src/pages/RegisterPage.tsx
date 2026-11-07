import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { toApiError } from '../api/errors';
import { useAuth } from '../auth/AuthContext';

export default function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (user) return <Navigate to="/" replace />;

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      await authApi.register(form);
      navigate('/login', { replace: true, state: { registered: true } });
    } catch (err) {
      const apiErr = toApiError(err);
      setFieldErrors(apiErr.fieldErrors); // pesan validasi backend tampil di bawah tiap input
      setError(apiErr.status === 400 ? 'Periksa kembali isian yang ditandai.' : apiErr.message);
    } finally {
      setBusy(false);
    }
  };

  const fe = (k: string) => fieldErrors[k] && <span className="field-error">{fieldErrors[k]}</span>;

  return (
    <div className="container auth-wrap">
      <div className="card auth-card">
        <h1>Buat akun</h1>
        <p className="muted">Akun baru otomatis berperan sebagai customer.</p>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <form className="form" onSubmit={submit} noValidate>
          <label><span>Nama</span><input value={form.name} onChange={set('name')} autoComplete="name" />{fe('name')}</label>
          <label><span>Email</span><input type="email" value={form.email} onChange={set('email')} autoComplete="email" />{fe('email')}</label>
          <label><span>Password</span><input type="password" value={form.password} onChange={set('password')} autoComplete="new-password" />{fe('password')}</label>
          {fe('body')}
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Memproses...' : 'Daftar'}</button>
        </form>
        <p className="muted center">Sudah punya akun? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
