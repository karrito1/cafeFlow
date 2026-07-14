import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';

const waiterLinks = [
  { to: '/tables', label: 'Mesas' },
  { to: '/orders', label: 'Pedidos' },
  { to: '/menu', label: 'Menú' },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isWaiter = user?.role === 'waiter';
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar bg-base-100 border-b border-base-200 px-4 shadow-sm">
      <div className="flex-1 flex items-center gap-2">
        {user?.role === 'admin' && <HamburgerMenu />}
        <span className="text-xl font-bold text-primary">CafeFlow</span>
        {isWaiter && (
          <div className="hidden lg:flex gap-1 ml-4">
            {waiterLinks.map((link) => {
              const active = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-base-content/60 hover:bg-base-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex-none flex items-center gap-3">
        {user && (
          <>
            <span className="text-sm text-base-content/70 hidden sm:block">
              {user.name}
            </span>
            <span className="badge badge-soft badge-primary text-xs hidden sm:block">
              {user.role}
            </span>
            <button className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content" onClick={() => setShowLogoutModal(true)}>
              Salir
            </button>
          </>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowLogoutModal(false)} />
          <div className="relative bg-base-100 rounded-xl shadow-xl p-6 w-80 text-center">
            <h3 className="font-bold text-lg mb-2">¿Cerrar sesión?</h3>
            <p className="text-base-content/70 mb-6">¿Estás seguro que deseas salir?</p>
            <div className="flex justify-end gap-2">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowLogoutModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-error btn-sm" onClick={handleLogout}>
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
