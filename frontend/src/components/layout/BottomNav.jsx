import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, ClipboardList, Sofa, Coffee, FileText, CreditCard,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard, ClipboardList, Sofa, Coffee, FileText, CreditCard,
};

const roleNav = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/orders', label: 'Pedidos', icon: 'ClipboardList' },
    { to: '/tables', label: 'Mesas', icon: 'Sofa' },
    { to: '/products', label: 'Productos', icon: 'Coffee' },
  ],
  barista: [
    { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/orders', label: 'Pedidos', icon: 'ClipboardList' },
    { to: '/tables', label: 'Mesas', icon: 'Sofa' },
    { to: '/menu', label: 'Menú', icon: 'FileText' },
  ],
  cashier: [
    { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { to: '/orders', label: 'Pedidos', icon: 'ClipboardList' },
    { to: '/payments', label: 'Pagos', icon: 'CreditCard' },
    { to: '/tables', label: 'Mesas', icon: 'Sofa' },
  ],
  waiter: [
    { to: '/tables', label: 'Mesas', icon: 'Sofa' },
    { to: '/orders', label: 'Pedidos', icon: 'ClipboardList' },
    { to: '/menu', label: 'Menú', icon: 'FileText' },
  ],
};

function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const links = roleNav[user?.role] || roleNav.waiter;

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-base-100 border-t border-base-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map((link) => {
          const active = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
          const Icon = iconMap[link.icon];
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg min-w-0 flex-1 transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-base-content/40 hover:text-base-content/60'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium leading-tight">{link.label}</span>
              {active && <span className="w-4 h-0.5 bg-primary rounded-full mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
