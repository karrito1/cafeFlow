import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TABLE_STATUS } from '../../utils/constants';
import { getTable, updateTable, deleteTable } from '../../api/tableApi';
import { useAuth } from '../../context/AuthContext';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTable = async () => {
      setLoading(true);
      try {
        const res = await getTable(id);
        if (res.ok) {
          setMesa(res.data);
        } else {
          setError(res.msg || 'Mesa no encontrada');
        }
      } catch {
        setError('Error al conectar con el servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchTable();
  }, [id]);

  const changeStatus = async (newStatus) => {
    try {
      const res = await updateTable(id, { status: newStatus });
      if (res.ok) {
        setMesa((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      // silent
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteTable(id);
      if (res.ok) {
        navigate('/tables');
      }
    } catch {
      // silent
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
            <div className="text-5xl mb-4 opacity-30">🔍</div>
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
              <button className="btn btn-primary">Nuevo Pedido</button>
              <button className="btn btn-outline">Ver Historial</button>
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
              {mesa.status === TABLE_STATUS.OCCUPIED && (
                <span className="badge badge-soft badge-error gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-error" />
                  En curso
                </span>
              )}
            </div>
            {mesa.status === TABLE_STATUS.OCCUPIED ? (
              <div className="py-8 text-center">
                <div className="text-3xl mb-2 opacity-30">☕</div>
                <p className="text-sm text-base-content/50">Pedido activo - consulta la sección de pedidos</p>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="text-3xl mb-2 opacity-30">🍽️</div>
                <p className="text-sm text-base-content/50">No hay pedido activo en esta mesa</p>
                <button className="btn btn-primary btn-sm mt-3">Crear Pedido</button>
              </div>
            )}
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowConfirm(false)}>
            <div className="card bg-base-100 w-full max-w-sm shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="card-body px-8 py-8 text-center">
                <div className="text-4xl mb-4">🗑️</div>
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
