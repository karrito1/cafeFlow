import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getOrder, updateOrder } from '../../api/orderApi';
import { ORDER_STATUS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { Search, Coffee, ArrowLeft } from 'lucide-react';
import StatusBadge, { ORDER_STATUS_BADGES } from '../../components/ui/StatusBadge';

const nextStatus = {
  [ORDER_STATUS.ACTIVE]: ORDER_STATUS.CONFIRMED,
  [ORDER_STATUS.CONFIRMED]: ORDER_STATUS.PAID,
};

const MILK_LABELS = { whole: 'Entera', 'lactose-free': 'Sin lactosa', 'plant-based': 'Vegetal', none: 'Sin leche' };
const TEMP_LABELS = { hot: 'Caliente', cold: 'Fría' };

function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await getOrder(id);
        if (res.ok) {
          setOrder(res.data);
        } else {
          setError(res.msg || 'Pedido no encontrado');
        }
      } catch {
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const changeStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await updateOrder(id, { status: newStatus });
      if (res.ok) {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        const pts = res.data?.earnedPoints || 0;
        const msg = pts > 0
          ? `Pedido pagado. +${pts} punto(s) agregado(s)`
          : `Pedido marcado como ${ORDER_STATUS_BADGES[newStatus]?.label || newStatus}`;
        toast.success(msg);
      } else {
        toast.error(res.msg || 'Error al actualizar estado');
      }
    } catch {
      toast.error('Error al conectar con el servidor');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="card bg-base-100 w-full max-w-md shadow-2xl">
          <div className="card-body items-center py-16 text-center">
            <Search size={48} className="mb-4 opacity-30 mx-auto" />
            <h2 className="text-xl font-bold text-base-content/60">Pedido no encontrado</h2>
            <p className="text-sm text-base-content/40 mt-1">{error || 'El pedido no existe.'}</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate('/orders')}>
              Volver a Pedidos
            </button>
          </div>
        </div>
      </div>
    );
  }

  const badge = ORDER_STATUS_BADGES[order.status] || ORDER_STATUS_BADGES.active;
  const canAdvance = nextStatus[order.status];
  const canCancel = order.status !== ORDER_STATUS.PAID && order.status !== ORDER_STATUS.CANCELLED;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft size={16} />
          Volver a Pedidos
        </button>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body px-8 py-8">
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-base-200 border border-base-300 shrink-0">
                <Coffee size={28} className="text-base-content/40" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-base-content">
                    Pedido #{order._id.slice(-6).toUpperCase()}
                  </h1>
                  <StatusBadge {...badge} size="text-sm" />
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-base-content/60">
                  <span>Mesa: <strong className="text-base-content">{order.tableId?.name || `Mesa ${order.tableId?.tableNumber || '—'}`}</strong></span>
                  <span>Mesero: <strong className="text-base-content">{order.waiterId?.name || '—'}</strong></span>
                  <span>Fecha: <strong className="text-base-content">{formatDate(order.createdAt)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body px-8 py-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/40 mb-4">Productos</h3>
            <div className="space-y-3">
              {order.products?.map((p, i) => {
                const cust = p.customization || {};
                return (
                  <div key={i} className="flex items-start gap-4 bg-base-200/30 rounded-lg p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-base-content">{p.name}</h4>
                        <span className="font-semibold text-primary">{formatCurrency(p.price * p.quantity)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-xs text-base-content/50">
                        <span>x{p.quantity}</span>
                        {cust.size && <span>· {cust.size}</span>}
                        {cust.milk && <span>· {MILK_LABELS[cust.milk] || cust.milk}</span>}
                        {cust.temperature && <span>· {TEMP_LABELS[cust.temperature] || cust.temperature}</span>}
                      </div>
                      {p.note && (
                        <p className="text-xs text-base-content/40 mt-1 italic">"{p.note}"</p>
                      )}
                      <p className="text-xs text-base-content/30 mt-0.5">{formatCurrency(p.price)} c/u</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <hr className="my-6 border-base-200" />
            <div className="space-y-1 text-sm ml-auto w-full max-w-xs">
              <div className="flex justify-between text-base-content/60">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {(order.discount || 0) > 0 && (
                <div className="flex justify-between text-success font-medium">
                  <span>Descuento Fidelidad</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base-content/60">
                <span>IVA 19%</span>
                <span>{formatCurrency(order.taxes)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-base-content pt-1 border-t border-base-200">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {user && (
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body px-8 py-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/40 mb-4">Acciones</h3>
              <div className="flex flex-wrap gap-3">
                {canAdvance && (
                  <button
                    className="btn btn-primary"
                    disabled={updating}
                    onClick={() => changeStatus(canAdvance)}
                  >
                    {updating ? (
                      <><span className="loading loading-spinner loading-xs"></span> Actualizando...</>
                    ) : (
                      `Marcar como ${ORDER_STATUS_BADGES[canAdvance].label}`
                    )}
                  </button>
                )}
                {canCancel && (
                  <button
                    className="btn btn-ghost text-error hover:bg-error/10 hover:text-error"
                    disabled={updating}
                    onClick={() => changeStatus(ORDER_STATUS.CANCELLED)}
                  >
                    Cancelar Pedido
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetailPage;
