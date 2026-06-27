import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleLinks = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/products', label: 'Productos', icon: '☕' },
    { to: '/categories', label: 'Categorías', icon: '📂' },
    { to: '/orders', label: 'Pedidos', icon: '📋' },
    { to: '/tables', label: 'Mesas', icon: '🪑' },
    { to: '/payments', label: 'Pagos', icon: '💳' },
    { to: '/customers', label: 'Clientes', icon: '👤' },
    { to: '/rewards', label: 'Recompensas', icon: '🎁' },
    { to: '/users', label: 'Usuarios', icon: '👥' },
    { to: '/menu', label: 'Menú digital', icon: '📄' },
    { to: '/reports/sales', label: 'Ventas', icon: '📈' },
    { to: '/reports/inventory', label: 'Inventario', icon: '📦' },
  ],
  barista: [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/orders', label: 'Pedidos', icon: '📋' },
    { to: '/tables', label: 'Mesas', icon: '🪑' },
    { to: '/menu', label: 'Menú digital', icon: '📄' },
  ],
  cashier: [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/orders', label: 'Pedidos', icon: '📋' },
    { to: '/tables', label: 'Mesas', icon: '🪑' },
    { to: '/payments', label: 'Pagos', icon: '💳' },
    { to: '/customers', label: 'Clientes', icon: '👤' },
    { to: '/reports/sales', label: 'Ventas', icon: '📈' },
    { to: '/menu', label: 'Menú digital', icon: '📄' },
  ],
  waiter: [
    { to: '/orders', label: 'Pedidos', icon: '📋' },
    { to: '/tables', label: 'Mesas', icon: '🪑' },
    { to: '/menu', label: 'Menú digital', icon: '📄' },
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
                <span className="text-base">{link.icon}</span>
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
