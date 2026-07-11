import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Coffee, FolderOpen, ClipboardList, Sofa,
  CreditCard, User, Gift, Users, FileText, TrendingUp,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, Coffee, FolderOpen, ClipboardList, Sofa,
  CreditCard, User, Gift, Users, FileText, TrendingUp,
};

const roleLinks = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/products', label: 'Productos', icon: 'Coffee' },
    { to: '/categories', label: 'Categorías', icon: 'FolderOpen' },
    { to: '/orders', label: 'Pedidos', icon: 'ClipboardList' },
    { to: '/tables', label: 'Mesas', icon: 'Sofa' },
    { to: '/payments', label: 'Pagos', icon: 'CreditCard' },
    { to: '/customers', label: 'Clientes', icon: 'User' },
    { to: '/rewards', label: 'Recompensas', icon: 'Gift' },
    { to: '/users', label: 'Usuarios', icon: 'Users' },
    { to: '/menu', label: 'Menú digital', icon: 'FileText' },
    { to: '/reports/sales', label: 'Ventas', icon: 'TrendingUp' },
  ],
  barista: [
    { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/orders', label: 'Pedidos', icon: 'ClipboardList' },
    { to: '/tables', label: 'Mesas', icon: 'Sofa' },
    { to: '/menu', label: 'Menú digital', icon: 'FileText' },
  ],
  cashier: [
    { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/orders', label: 'Pedidos', icon: 'ClipboardList' },
    { to: '/tables', label: 'Mesas', icon: 'Sofa' },
    { to: '/payments', label: 'Pagos', icon: 'CreditCard' },
    { to: '/customers', label: 'Clientes', icon: 'User' },
    { to: '/reports/sales', label: 'Ventas', icon: 'TrendingUp' },
    { to: '/menu', label: 'Menú digital', icon: 'FileText' },
  ],
  waiter: [
    { to: '/orders', label: 'Pedidos', icon: 'ClipboardList' },
    { to: '/tables', label: 'Mesas', icon: 'Sofa' },
    { to: '/menu', label: 'Menú digital', icon: 'FileText' },
  ],
  customer: [
    { to: '/points', label: 'Mis Puntos', icon: 'Gift' },
    { to: '/menu', label: 'Menú', icon: 'FileText' },
  ],
};

function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const links = roleLinks[user?.role] || roleLinks.waiter;

  return (
    <aside className="w-56 bg-base-100 border-r border-base-200 min-h-screen p-3 shrink-0 hidden lg:block">
      <ul className="space-y-1">
        {links.map((link) => {
          const active = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
          const Icon = iconMap[link.icon];
          return (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
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
    </aside>
  );
}

export default Sidebar;
