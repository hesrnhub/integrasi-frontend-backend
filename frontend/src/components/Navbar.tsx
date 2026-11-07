import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { canCreateStall } from '../auth/permissions';
import { useToast } from './Toast';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const notify = useToast();

  const onLogout = () => {
    logout();
    notify('Anda telah logout.', 'info');
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">Review<span>Kantin</span></Link>
        <nav className="nav-links">
          <NavLink to="/" end>Warung</NavLink>
          {canCreateStall(user) && <NavLink to="/stalls/new">Tambah warung</NavLink>}
        </nav>
        <div className="nav-user">
          {user ? (
            <>
              <Link to="/profile" className="user-chip" title="Lihat profil">
                <span>{user.name}</span>
                <span className={`badge badge-${user.role}`}>{user.role}</span>
              </Link>
              <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Daftar</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
