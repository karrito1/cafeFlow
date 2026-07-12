import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu, X, FolderOpen, CreditCard, User, Gift, Users, FileText,
} from 'lucide-react';

const iconMap = { FolderOpen, CreditCard, User, Gift, Users, FileText };

const extraLinks = {
  admin: [
    { to: '/categories', label: 'Categorías', icon: 'FolderOpen' },
    { to: '/payments', label: 'Pagos', icon: 'CreditCard' },
    { to: '/customers', label: 'Clientes', icon: 'User' },
    { to: '/rewards', label: 'Recompensas', icon: 'Gift' },
    { to: '/users', label: 'Usuarios', icon: 'Users' },
    { to: '/menu', label: 'Menú digital', icon: 'FileText' },
  ],
};

function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const links = extraLinks[user?.role];

  if (!links) return null;

  return (
    <>
      <button
        className="btn btn-ghost btn-sm btn-square lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-base-100 shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-base-200">
              <span className="font-bold text-primary">Más opciones</span>
              <button className="btn btn-ghost btn-sm btn-square" onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <ul className="flex-1 p-3 space-y-1">
              {links.map((link) => {
                const active = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
                const Icon = iconMap[link.icon];
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                        active
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                      }`}
                    >
                      <Icon size={18} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default HamburgerMenu;
