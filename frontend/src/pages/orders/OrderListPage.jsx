import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../api/orderApi';
import { ORDER_STATUS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ClipboardList, Search } from 'lucide-react';

const statusConfig = {
  [ORDER_STATUS.ACTIVE]: { label: 'Activo', badge: 'badge-soft badge-info' },
  [ORDER_STATUS.CONFIRMED]: { label: 'Confirmado', badge: 'badge-soft badge-warning' },
  [ORDER_STATUS.PAID]: { label: 'Pagado', badge: 'badge-soft badge-success' },
  [ORDER_STATUS.CANCELLED]: { label: 'Cancelado', badge: 'badge-soft badge-error' },
};

function OrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      if (res.ok) setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filtered = orders.filter((o) => {
    const tableMatch = o.tableId?.tableNumber?.toString().includes(search) ||
      (o.tableId?.name || '').toLowerCase().includes(search.toLowerCase());
    const waiterMatch = (o.waiterId?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchSearch = !search || tableMatch || waiterMatch;
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-base-content">Pedidos</h1>
          <p className="text-sm text-base-content/60">{orders.length} pedidos</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input input-bordered w-full sm:max-w-xs"
            placeholder="Buscar por mesa o mesero…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="select select-bordered w-full sm:max-w-xs"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos los estados</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body items-center py-16 text-center">
              <ClipboardList size={48} className="mb-4 opacity-30 mx-auto" />
              <h3 className="text-lg font-semibold text-base-content">
                {orders.length === 0 ? 'No hay pedidos' : 'Sin resultados'}
              </h3>
              <p className="text-sm text-base-content/40">
                {orders.length === 0 ? 'Crea tu primer pedido' : 'Intenta con otros filtros'}
              </p>
              {orders.length === 0 && (
                <p className="text-sm text-base-content/40 mt-2">Crea un pedido desde la sección de mesas</p>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow-sm border border-base-200">
            <table className="table table-zebra">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-base-content/50">
                  <th>Mesa</th>
                  <th>Mesero</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const config = statusConfig[order.status] || statusConfig[ORDER_STATUS.ACTIVE];
                  return (
                    <tr key={order._id} className="hover cursor-pointer" onClick={() => navigate(`/orders/${order._id}`)}>
                      <td className="font-medium">
                        {order.tableId?.name || `Mesa ${order.tableId?.tableNumber || '—'}`}
                      </td>
                      <td className="text-sm text-base-content/70">{order.waiterId?.name || '—'}</td>
                      <td className="text-sm">{order.products?.length || 0} items</td>
                      <td className="font-semibold">{formatCurrency(order.total)}</td>
                      <td>
                        <span className={`badge ${config.badge} text-xs`}>{config.label}</span>
                      </td>
                      <td className="text-sm text-base-content/50">{formatDate(order.createdAt)}</td>
                      <td>
                        <button className="btn btn-ghost btn-xs" onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order._id}`); }}>
                          <Search size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderListPage;
