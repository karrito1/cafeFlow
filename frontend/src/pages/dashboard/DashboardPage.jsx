import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProducts } from '../../api/productApi';
import { getOrders } from '../../api/orderApi';
import { getTables } from '../../api/tableApi';
import { getCustomers } from '../../api/customerApi';
import { formatCurrency } from '../../utils/formatters';
import { Coffee, ClipboardList, Sofa, User, LayoutDashboard } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';

const iconMap = { Coffee, ClipboardList, Sofa, LayoutDashboard };

const quickLinks = [
  { label: 'Nuevo Pedido', path: '/orders/new', icon: 'ClipboardList', color: 'btn-primary' },
  { label: 'Mesas', path: '/tables', icon: 'Sofa', color: 'btn-soft btn-primary' },
  { label: 'Productos', path: '/products', icon: 'Coffee', color: 'btn-soft btn-primary' },
];

function StatCard({ label, value, icon, loading, colorClass }) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-base-content/60 font-medium">{label}</p>
            {loading ? (
              <div className="skeleton h-8 w-16 mt-1"></div>
            ) : (
              <p className={`text-2xl font-bold mt-1 ${colorClass || 'text-base-content'}`}>{value}</p>
            )}
          </div>
          {icon}
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    tables: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, tablesRes, customersRes] = await Promise.all([
          getProducts(),
          getOrders(),
          getTables(),
          getCustomers(),
        ]);

        setStats({
          products: productsRes.ok ? productsRes.data.length : 0,
          orders: ordersRes.ok ? ordersRes.data.length : 0,
          tables: tablesRes.ok ? tablesRes.data.length : 0,
          customers: customersRes.ok ? customersRes.data.length : 0,
        });

        if (ordersRes.ok) {
          const sorted = [...ordersRes.data]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
          setRecentOrders(sorted);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statusBadge = {
    active: 'badge-soft badge-info',
    confirmed: 'badge-soft badge-primary',
    paid: 'badge-soft badge-success',
    cancelled: 'badge-soft badge-error',
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Bienvenido, {user?.name || 'Usuario'}
          </h1>
          <p className="text-sm text-base-content/60 mt-1">Resumen del día</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Productos" value={stats.products} loading={loading} colorClass="text-primary" icon={<Coffee size={32} className="opacity-40" />} />
          <StatCard label="Pedidos" value={stats.orders} loading={loading} colorClass="text-primary" icon={<ClipboardList size={32} className="opacity-40" />} />
          <StatCard label="Mesas" value={stats.tables} loading={loading} colorClass="text-primary" icon={<Sofa size={32} className="opacity-40" />} />
          <StatCard label="Clientes" value={stats.customers} loading={loading} colorClass="text-primary" icon={<User size={32} className="opacity-40" />} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`btn ${link.color} h-auto flex-col gap-1 py-4 shadow-sm border border-base-200`}
              >
                <Icon size={24} />
                <span className="text-xs font-medium">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-base-content">Pedidos Recientes</h2>
              <Link to="/orders" className="text-sm text-primary hover:link">
                Ver todos
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-12 w-full"></div>
                ))}
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="text-base-content/60 text-xs">
                      <th>Mesa</th>
                      <th>Mesero</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-base-200">
                        <td className="text-sm font-medium text-base-content">
                          Mesa {order.tableId?.tableNumber || '—'}
                        </td>
                        <td className="text-sm text-base-content/70">{order.waiterId?.name || '—'}</td>
                        <td className="text-sm text-base-content">{formatCurrency(order.total)}</td>
                        <td>
                          <span className={`badge ${statusBadge[order.status] || 'badge-soft'} text-xs`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="text-sm text-base-content/60">
                          {new Date(order.createdAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="No hay pedidos aún"
                action={<Link to="/orders/new" className="btn btn-primary btn-sm">Crear Primer Pedido</Link>}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
