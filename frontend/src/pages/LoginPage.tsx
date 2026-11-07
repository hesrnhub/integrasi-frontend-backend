import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toApiError } from '../api/errors';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../components/Toast';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useToast();
  const state = location.state as { from?: string; registered?: boolean } | null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (user) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFieldErrors({});
    try {
      const u = await login(email, password);
      notify(`Selamat datang, ${u.name}!`, 'success');
      navigate(state?.from ?? '/', { replace: true });
    } catch (err) {
      const apiErr = toApiError(err);
      setFieldErrors(apiErr.fieldErrors);
      setError(apiErr.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container auth-wrap">
      <div className="card auth-card">
        <h1>Masuk</h1>
        <p className="muted">Login untuk mengelola warung atau memberi ulasan.</p>
        {state?.registered && <div className="alert alert-success">Registrasi berhasil. Silakan login.</div>}
        {state?.from && <div className="alert alert-info">Anda perlu login untuk mengakses halaman tersebut.</div>}
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        <form className="form" onSubmit={submit} noValidate>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </label>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Memproses...' : 'Login'}</button>
        </form>
        <p className="muted center">Belum punya akun? <Link to="/register">Daftar</Link></p>
      </div>
    </div>
  );
}
