import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  [TABLE_STATUS.AVAILABLE]: {
    label: 'Disponible',
    badge: 'badge-soft badge-success',
    border: 'border-success',
  },
  [TABLE_STATUS.OCCUPIED]: {
    label: 'Ocupada',
    badge: 'badge-soft badge-error',
    border: 'border-error',
  },
  [TABLE_STATUS.RESERVED]: {
    label: 'Reservada',
    badge: 'badge-soft badge-warning',
    border: 'border-warning',
  },
};

function NewTableModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({ numero: '', capacidad: '2', ubicacion: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.numero) {
      setError('El número de mesa es obligatorio');
      return;
    }
    if (mockMesas.some((m) => m.numero === Number(form.numero))) {
      setError('Ese número de mesa ya existe');
      return;
    }
    onCreated({
      _id: String(Date.now()),
      numero: Number(form.numero),
      capacidad: Number(form.capacidad) || 2,
      estado: TABLE_STATUS.AVAILABLE,
      ubicacion: form.ubicacion,
    });
    setForm({ numero: '', capacidad: '2', ubicacion: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="card bg-base-100 w-full max-w-md shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="card-body px-8 py-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-base-content">Nueva Mesa</h2>
            <button className="btn btn-ghost btn-sm btn-square text-base-content/50 hover:text-base-content" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content/80 font-medium">Número de mesa</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full text-base-content"
                placeholder="Ej: 13"
                value={form.numero}
                onChange={(e) => setForm({ ...form, numero: e.target.value })}
                autoFocus
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content/80 font-medium">Capacidad</span>
              </label>
              <select
                className="select select-bordered w-full text-base-content"
                value={form.capacidad}
                onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content/80 font-medium">Ubicación</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full text-base-content"
                placeholder="Ej: Terraza, Interior, Ventana..."
                value={form.ubicacion}
                onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
              />
            </div>
            {error && (
              <div role="alert" className="alert alert-error py-2.5 text-sm bg-red-50 border border-red-200 text-red-700 rounded-lg">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Crear Mesa</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function QuickStatusMenu({ mesaId, currentStatus, onStatusChange }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: TABLE_STATUS.AVAILABLE, label: 'Disponible' },
    { value: TABLE_STATUS.OCCUPIED, label: 'Ocupada' },
    { value: TABLE_STATUS.RESERVED, label: 'Reservada' },
  ];

  return (
    <div className="relative">
      <button
        className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-base-content/70"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="absolute right-0 z-20 mt-1 w-40 rounded-lg bg-base-100 shadow-lg ring-1 ring-black/5">
            {options
              .filter((o) => o.value !== currentStatus)
              .map((opt) => (
                <button
                  key={opt.value}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-base-content hover:bg-base-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(mesaId, opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function TableCard({ mesa, onStatusChange }) {
  const navigate = useNavigate();
  const style = statusStyle[mesa.estado] || statusStyle.available;

  return (
    <div
      className="card bg-base-100 shadow-sm border border-base-300 cursor-pointer hover:border-primary transition-colors"
      onClick={() => navigate(`/tables/${mesa._id}`)}
    >
      <div className="card-body items-center text-center p-4">
        <div className="absolute right-1 top-1" onClick={(e) => e.stopPropagation()}>
          <QuickStatusMenu mesaId={mesa._id} currentStatus={mesa.estado} onStatusChange={onStatusChange} />
        </div>

        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-base-200 text-lg font-bold text-base-content mb-1">
          {mesa.numero}
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-base-content/40">Mesa</span>

        <span className="text-sm text-base-content">{mesa.capacidad} {mesa.capacidad === 1 ? 'persona' : 'personas'}</span>

        <span className={`badge ${style.badge} text-xs`}>{style.label}</span>

        {mesa.ubicacion && (
          <span className="text-xs text-base-content/40">{mesa.ubicacion}</span>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, colorClass }) {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body p-4">
        <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
        <p className="text-sm text-base-content">{label}</p>
      </div>
    </div>
  );
}

function TableListPage() {
  const [mesas, setMesas] = useState(mockMesas);
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = (id, newStatus) => {
    setMesas((prev) =>
      prev.map((m) => (m._id === id ? { ...m, estado: newStatus } : m))
    );
  };

  const addMesa = (nueva) => {
    setMesas((prev) => [...prev, nueva]);
  };

  const counts = {
    total: mesas.length,
    available: mesas.filter((m) => m.estado === TABLE_STATUS.AVAILABLE).length,
    occupied: mesas.filter((m) => m.estado === TABLE_STATUS.OCCUPIED).length,
    reserved: mesas.filter((m) => m.estado === TABLE_STATUS.RESERVED).length,
  };

  return (
    <div data-theme="cafe" className="min-h-screen bg-base-200 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Mesas</h1>
            <p className="text-sm text-base-content">
              {counts.total} mesa{counts.total !== 1 ? 's' : ''} en el salón
            </p>
          </div>
          <button className="btn btn-primary shadow-sm" onClick={() => setShowModal(true)}>
            + Nueva Mesa
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total" value={counts.total} colorClass="text-base-content" />
          <StatCard label="Disponibles" value={counts.available} colorClass="text-success" />
          <StatCard label="Ocupadas" value={counts.occupied} colorClass="text-error" />
          <StatCard label="Reservadas" value={counts.reserved} colorClass="text-warning" />
        </div>

        {mesas.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mesas.map((mesa) => (
              <TableCard key={mesa._id} mesa={mesa} onStatusChange={handleStatusChange} />
            ))}
          </div>
        ) : (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body items-center py-16 text-center">
              <div className="text-5xl mb-4 opacity-30">🪑</div>
              <h3 className="text-lg font-semibold text-base-content">No hay mesas registradas</h3>
              <p className="text-sm text-base-content/40">Crea tu primera mesa para empezar</p>
              <button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}>
                + Crear Mesa
              </button>
            </div>
          </div>
        )}

        <NewTableModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreated={addMesa}
        />
      </div>
    </div>
  );
}

export default TableListPage;
