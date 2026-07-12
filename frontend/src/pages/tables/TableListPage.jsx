import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TABLE_STATUS } from '../../utils/constants';
import { getTables, createTable, updateTable, deleteTable } from '../../api/tableApi';
import { getCustomers } from '../../api/customerApi';
import { useAuth } from '../../context/AuthContext';
import { Sofa, User } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';

const statusStyle = {
  [TABLE_STATUS.FREE]: {
    label: 'Disponible',
    badge: 'badge-soft badge-success',
    border: 'border-success',
  },
  [TABLE_STATUS.OCCUPIED]: {
    label: 'Ocupada',
    badge: 'badge-soft badge-error',
    border: 'border-error',
  },
  [TABLE_STATUS.PENDING_PAYMENT]: {
    label: 'Pendiente pago',
    badge: 'badge-soft badge-warning',
    border: 'border-warning',
  },
};

function NewTableModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({ tableNumber: '', capacity: '4', name: '', currentCustomer: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchCustomers = async () => {
      setLoadingCustomers(true);
      try {
        const res = await getCustomers();
        if (res.ok) setCustomers(res.data);
      } catch {
        // silent
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.tableNumber) {
      setError('El número de mesa es obligatorio');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        tableNumber: Number(form.tableNumber),
        capacity: Number(form.capacity) || 4,
        name: form.name,
        currentCustomer: form.currentCustomer || null,
      };
      const res = await createTable(payload);
      if (res.ok) {
        onCreated(res.data);
        setForm({ tableNumber: '', capacity: '4', name: '', currentCustomer: '' });
        onClose();
      } else {
        setError(res.msg || 'Error al crear mesa');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
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
                value={form.tableNumber}
                onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                autoFocus
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content/80 font-medium">Capacidad</span>
              </label>
              <select
                className="select select-bordered w-full text-base-content"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
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
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Customer selector */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-base-content/80 font-medium flex items-center gap-1.5">
                  <User size={14} />
                  Cliente asignado
                </span>
                <span className="label-text-alt text-base-content/40">Opcional</span>
              </label>
              {loadingCustomers ? (
                <div className="flex items-center gap-2 text-sm text-base-content/40 py-2">
                  <span className="loading loading-spinner loading-xs" />
                  Cargando clientes...
                </div>
              ) : (
                <select
                  className="select select-bordered w-full text-base-content"
                  value={form.currentCustomer}
                  onChange={(e) => setForm({ ...form, currentCustomer: e.target.value })}
                >
                  <option value="">— Sin cliente asignado —</option>
                  {customers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {error && (
              <div role="alert" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                <span>{error}</span>
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Mesa'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function QuickStatusMenu({ mesaId, currentStatus, onStatusChange, isAdmin }) {
  const [open, setOpen] = useState(false);
  if (!isAdmin) return null;

  const options = [
    { value: TABLE_STATUS.FREE, label: 'Disponible' },
    { value: TABLE_STATUS.OCCUPIED, label: 'Ocupada' },
    { value: TABLE_STATUS.PENDING_PAYMENT, label: 'Pendiente pago' },
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
          <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg bg-base-100 shadow-lg ring-1 ring-black/5">
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

function TableCard({ mesa, onStatusChange, isAdmin }) {
  const navigate = useNavigate();
  const style = statusStyle[mesa.status] || statusStyle[TABLE_STATUS.FREE];

  return (
    <div
      className="card bg-base-100 shadow-sm border border-base-300 cursor-pointer hover:border-primary transition-colors"
      onClick={() => navigate(`/tables/${mesa._id}`)}
    >
      <div className="card-body items-center text-center p-4">
        <div className="absolute right-1 top-1" onClick={(e) => e.stopPropagation()}>
          <QuickStatusMenu mesaId={mesa._id} currentStatus={mesa.status} onStatusChange={onStatusChange} isAdmin={isAdmin} />
        </div>

        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-base-200 text-lg font-bold text-base-content mb-1">
          {mesa.tableNumber}
        </div>

        <span className="text-xs font-semibold uppercase tracking-wider text-base-content/40">Mesa</span>

        <span className="text-sm text-base-content">{mesa.capacity} {mesa.capacity === 1 ? 'persona' : 'personas'}</span>

        <span className={`badge ${style.badge} text-xs`}>{style.label}</span>

        {mesa.name && (
          <span className="text-xs text-base-content/40">{mesa.name}</span>
        )}

        {mesa.currentCustomer && (
          <div className="flex items-center gap-1 mt-1">
            <User size={11} className="text-primary/60" />
            <span className="text-[10px] text-primary/70 font-medium truncate max-w-[80px]">
              {mesa.currentCustomer.name}
            </span>
          </div>
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
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTables();
      if (res.ok) {
        setMesas(res.data);
      } else {
        setError(res.msg || 'Error al cargar mesas');
      }
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateTable(id, { status: newStatus });
      if (res.ok) {
        setMesas((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status: newStatus } : m))
        );
        toast.success('Estado actualizado');
      } else {
        toast.error(res.msg || 'Error al actualizar estado');
      }
    } catch {
      toast.error('Error al conectar con el servidor');
    }
  };

  const addMesa = (nueva) => {
    setMesas((prev) => [...prev, nueva]);
    toast.success('Mesa creada');
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteTable(id);
      if (res.ok) {
        setMesas((prev) => prev.filter((m) => m._id !== id));
        toast.success('Mesa eliminada');
      } else {
        toast.error(res.msg || 'Error al eliminar mesa');
      }
    } catch {
      toast.error('Error al conectar con el servidor');
    }
  };

  const counts = {
    total: mesas.length,
    free: mesas.filter((m) => m.status === TABLE_STATUS.FREE).length,
    occupied: mesas.filter((m) => m.status === TABLE_STATUS.OCCUPIED).length,
    pendingPayment: mesas.filter((m) => m.status === TABLE_STATUS.PENDING_PAYMENT).length,
  };

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Mesas</h1>
            <p className="text-sm text-base-content">
              {counts.total} mesa{counts.total !== 1 ? 's' : ''} en el salón
            </p>
          </div>
          {user?.role === 'admin' && (
            <button className="btn btn-primary shadow-sm" onClick={() => setShowModal(true)}>
              + Nueva Mesa
            </button>
          )}
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Total" value={counts.total} colorClass="text-base-content" />
          <StatCard label="Disponibles" value={counts.free} colorClass="text-success" />
          <StatCard label="Ocupadas" value={counts.occupied} colorClass="text-error" />
          <StatCard label="Pendientes pago" value={counts.pendingPayment} colorClass="text-warning" />
        </div>

        {mesas.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mesas.map((mesa) => (
              <TableCard key={mesa._id} mesa={mesa} onStatusChange={handleStatusChange} isAdmin={user?.role === 'admin'} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Sofa}
            title="No hay mesas registradas"
            description="Crea tu primera mesa para empezar"
            action={user?.role === 'admin' ? <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Crear Mesa</button> : null}
          />
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
