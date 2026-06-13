import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TABLE_STATUS } from '../../utils/constants';

const mockMesas = [
  { _id: '1', numero: 1, capacidad: 2, estado: TABLE_STATUS.AVAILABLE, ubicacion: 'Ventana' },
  { _id: '2', numero: 2, capacidad: 4, estado: TABLE_STATUS.OCCUPIED, ubicacion: 'Centro' },
  { _id: '3', numero: 3, capacidad: 6, estado: TABLE_STATUS.RESERVED, ubicacion: 'Terraza' },
  { _id: '4', numero: 4, capacidad: 2, estado: TABLE_STATUS.AVAILABLE, ubicacion: 'Barra' },
  { _id: '5', numero: 5, capacidad: 4, estado: TABLE_STATUS.OCCUPIED, ubicacion: 'Interior' },
  { _id: '6', numero: 6, capacidad: 8, estado: TABLE_STATUS.AVAILABLE, ubicacion: 'VIP' },
  { _id: '7', numero: 7, capacidad: 2, estado: TABLE_STATUS.RESERVED, ubicacion: 'Ventana' },
  { _id: '8', numero: 8, capacidad: 4, estado: TABLE_STATUS.OCCUPIED, ubicacion: 'Terraza' },
  { _id: '9', numero: 9, capacidad: 4, estado: TABLE_STATUS.AVAILABLE, ubicacion: 'Centro' },
  { _id: '10', numero: 10, capacidad: 2, estado: TABLE_STATUS.AVAILABLE, ubicacion: 'Barra' },
  { _id: '11', numero: 11, capacidad: 6, estado: TABLE_STATUS.OCCUPIED, ubicacion: 'Interior' },
  { _id: '12', numero: 12, capacidad: 3, estado: TABLE_STATUS.AVAILABLE, ubicacion: 'Ventana' },
];

const statusStyle = {
  [TABLE_STATUS.AVAILABLE]: { label: 'Disponible', badge: 'badge-soft badge-success' },
  [TABLE_STATUS.OCCUPIED]: { label: 'Ocupada', badge: 'badge-soft badge-error' },
  [TABLE_STATUS.RESERVED]: { label: 'Reservada', badge: 'badge-soft badge-warning' },
};

function TableDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mesa, setMesa] = useState(() => mockMesas.find((m) => m._id === id) || null);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!mesa) {
    return (
      <div data-theme="cafe" className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="card bg-base-100 w-full max-w-md shadow-2xl">
          <div className="card-body items-center py-16 text-center">
            <div className="text-5xl mb-4 opacity-30">🔍</div>
            <h2 className="text-xl font-bold text-base-content/60">Mesa no encontrada</h2>
            <p className="text-sm text-base-content/40 mt-1">La mesa que buscas no existe.</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate('/tables')}>
              Volver a Mesas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const estilo = statusStyle[mesa.estado] || statusStyle.available;

  const changeStatus = (newStatus) => {
    setMesa((prev) => ({ ...prev, estado: newStatus }));
  };

  return (
    <div data-theme="cafe" className="min-h-screen bg-base-200 p-4 md:p-6 lg:p-8">
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
                {mesa.numero}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-base-content">Mesa {mesa.numero}</h1>
                  <span className={`badge ${estilo.badge} text-sm`}>{estilo.label}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-base-content/60">
                  <span>Capacidad: <strong className="text-base-content">{mesa.capacidad} {mesa.capacidad === 1 ? 'persona' : 'personas'}</strong></span>
                  {mesa.ubicacion && <span>Ubicación: <strong className="text-base-content">{mesa.ubicacion}</strong></span>}
                </div>
              </div>
            </div>

            <hr className="my-6 border-base-200" />

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/40 mb-3">Cambiar Estado</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusStyle).map(([key, s]) => {
                  if (key === mesa.estado) return null;
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
          </div>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body px-8 py-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/40 mb-4">Acciones</h3>
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary">Nuevo Pedido</button>
              <button className="btn btn-outline">Ver Historial</button>
              <button className="btn btn-ghost text-error hover:bg-error/10 hover:text-error" onClick={() => setShowConfirm(true)}>Eliminar Mesa</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body px-8 py-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/40">Pedido Actual</h3>
              {mesa.estado === TABLE_STATUS.OCCUPIED && (
                <span className="badge badge-soft badge-error gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-error" />
                  En curso
                </span>
              )}
            </div>
            {mesa.estado === TABLE_STATUS.OCCUPIED ? (
              <div className="space-y-3">
                {[
                  { producto: 'Café Latte', cantidad: 2, precio: 8500 },
                  { producto: 'Croissant', cantidad: 1, precio: 6500 },
                  { producto: 'Jugo de Naranja', cantidad: 2, precio: 7500 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-base-200 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-base-200 text-xs font-bold text-base-content">
                        {item.cantidad}
                      </span>
                      <span className="text-sm text-base-content">{item.producto}</span>
                    </div>
                    <span className="text-sm text-base-content/60">
                      ${(item.precio * item.cantidad).toLocaleString('es-CO')}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-bold text-base-content">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${(8500 * 2 + 6500 + 7500 * 2).toLocaleString('es-CO')}
                  </span>
                </div>
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
                <p className="text-sm text-base-content/60 mt-2">¿Estás seguro de eliminar la Mesa {mesa.numero}?</p>
                <div className="flex justify-center gap-3 mt-6">
                  <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancelar</button>
                  <button className="btn btn-error" onClick={() => { setShowConfirm(false); navigate('/tables'); }}>Eliminar</button>
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
