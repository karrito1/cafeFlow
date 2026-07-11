import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TABLE_STATUS } from '../../utils/constants';
import { getTable, updateTable, deleteTable } from '../../api/tableApi';
import { getOrders } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { Search, Coffee, UtensilsCrossed, Trash2, Eye } from 'lucide-react';

const statusStyle = {
  [TABLE_STATUS.FREE]: { label: 'Disponible', badge: 'badge-soft badge-success' },
  [TABLE_STATUS.OCCUPIED]: { label: 'Ocupada', badge: 'badge-soft badge-error' },
  [TABLE_STATUS.PENDING_PAYMENT]: { label: 'Pendiente pago', badge: 'badge-soft badge-warning' },
};

function TableDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mesa, setMesa] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tableRes, ordersRes] = await Promise.all([
          getTable(id),
          getOrders(),
        ]);
        if (tableRes.ok) {
          setMesa(tableRes.data);
        } else {
          setError(tableRes.msg || 'Mesa no encontrada');
        }
        if (ordersRes.ok) {
          const order = ordersRes.data.find(
            (o) => o.tableId?._id === id && (o.status === 'active' || o.status === 'confirmed')
          );
          setActiveOrder(order || null);
        }
      } catch {
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const changeStatus = async (newStatus) => {
    try {
      const res = await updateTable(id, { status: newStatus });
      if (res.ok) {
        setMesa((prev) => ({ ...prev, status: newStatus }));
        toast.success('Estado actualizado');
      } else {
        toast.error(res.msg || 'Error al actualizar estado');
      }
    } catch {
      toast.error('Error al conectar con el servidor');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteTable(id);
      if (res.ok) {
        toast.success('Mesa eliminada');
        navigate('/tables');
      } else {
        toast.error(res.msg || 'Error al eliminar mesa');
      }
    } catch {
      toast.error('Error al conectar con el servidor');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error || !mesa) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="card bg-base-100 w-full max-w-md shadow-2xl">
          <div className="card-body items-center py-16 text-center">
            <Search size={48} className="mb-4 opacity-30 mx-auto" />
            <h2 className="text-xl font-bold text-base-content/60">Mesa no encontrada</h2>
            <p className="text-sm text-base-content/40 mt-1">{error || 'La mesa que buscas no existe.'}</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate('/tables')}>
              Volver a Mesas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const estilo = statusStyle[mesa.status] || statusStyle[TABLE_STATUS.FREE];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <button
          className="btn btn-ghost btn-sm gap-2 text-base-content/60 hover:text-base-content"
          onClick={() => navigate('/tables')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
          Volver a Mesas
        </button>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body px-8 py-8">
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-base-200 border border-base-300 text-2xl font-bold text-base-content shrink-0">
                {mesa.tableNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-base-content">Mesa {mesa.tableNumber}</h1>
                  <span className={`badge ${estilo.badge} text-sm`}>{estilo.label}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-base-content/60">
                  <span>Capacidad: <strong className="text-base-content">{mesa.capacity} {mesa.capacity === 1 ? 'persona' : 'personas'}</strong></span>
                  {mesa.name && <span>Ubicación: <strong className="text-base-content">{mesa.name}</strong></span>}
                </div>
              </div>
            </div>

            <hr className="my-6 border-base-200" />

            {user && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/40 mb-3">Cambiar Estado</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(statusStyle).map(([key, s]) => {
                    if (key === mesa.status) return null;
                    return (
                      <button
                        key={key}
                        className="btn btn-outline btn-sm"
                        onClick={() => changeStatus(key)}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body px-8 py-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/40 mb-4">Acciones</h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary" onClick={() => navigate(`/orders/new?tableId=${id}`)}>Nuevo Pedido</button>
              {user?.role === 'admin' && (
                <button className="btn btn-ghost text-error hover:bg-error/10 hover:text-error" onClick={() => setShowConfirm(true)}>Eliminar Mesa</button>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body px-8 py-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/40">Pedido Actual</h3>
              {activeOrder && (
                <span className="badge badge-soft badge-error gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-error" />
                  En curso
                </span>
              )}
            </div>
            {activeOrder ? (
              <div className="space-y-4">
                <div className="bg-base-200/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-base-content">
                      #{activeOrder._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(activeOrder.total)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {activeOrder.products?.slice(0, 3).map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-base-content/70">
                          x{p.quantity} {p.name}
                        </span>
                        <span className="text-base-content/50 text-xs">
                          {formatCurrency(p.price * p.quantity)}
                        </span>
                      </div>
                    ))}
                    {(activeOrder.products?.length || 0) > 3 && (
                      <p className="text-xs text-base-content/40 text-center pt-1">
                        +{activeOrder.products.length - 3} productos más
                      </p>
                    )}
                  </div>
                  <button
                    className="btn btn-primary btn-sm w-full mt-3"
                    onClick={() => navigate(`/orders/${activeOrder._id}`)}
                  >
                    <Eye size={14} /> Ver Pedido
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <UtensilsCrossed size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm text-base-content/50">No hay pedido activo en esta mesa</p>
                <button className="btn btn-primary btn-sm mt-3" onClick={() => navigate(`/orders/new?tableId=${id}`)}>Crear Pedido</button>
              </div>
            )}
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowConfirm(false)}>
            <div className="card bg-base-100 w-full max-w-sm shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="card-body px-8 py-8 text-center">
                <Trash2 size={40} className="mx-auto mb-4 text-error" />
                <h3 className="text-lg font-bold text-base-content">Eliminar Mesa</h3>
                <p className="text-sm text-base-content/60 mt-2">¿Estás seguro de eliminar la Mesa {mesa.tableNumber}?</p>
                <div className="flex justify-center gap-3 mt-6">
                  <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancelar</button>
                  <button className="btn btn-error" onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TableDetailPage;
