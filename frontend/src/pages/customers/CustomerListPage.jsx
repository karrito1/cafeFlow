import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Users, Trash2, Plus, UserCheck, X, UserPlus } from 'lucide-react';
import { getCustomers, registerCustomer, deleteCustomer } from '../../api/customerApi';
import { useAuth } from '../../context/AuthContext';

const LEVEL_BADGE = {
  bronze: 'badge-warning',
  silver: 'badge-ghost',
  gold:   'badge-accent',
};

const LEVEL_LABEL = {
  bronze: 'Bronce',
  silver: 'Plata',
  gold:   'Oro',
};

/* ─── Modal: Nuevo Cliente ─── */
function NewCustomerModal({ isOpen, onClose, onCreated }) {
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving]   = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm({ name: '', email: '', phone: '', password: '' });
    setErrors({});
    setApiError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name     = 'El nombre es obligatorio';
    if (!form.email.trim())   e.email    = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Correo no válido';
    if (!form.password)       e.password = 'La contraseña es obligatoria';
    else if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const res = await registerCustomer(form);
      if (res.ok) {
        onCreated(res.data);
        onClose();
      } else {
        setApiError(res.msg || 'Error al crear cliente');
      }
    } catch {
      setApiError('Error al conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="card bg-base-100 w-full max-w-md shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="card-body px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-base-content">Nuevo Cliente</h2>
            <button className="btn btn-ghost btn-sm btn-square" onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {/* Nombre */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Nombre completo *</span></label>
              <input
                type="text" name="name" autoFocus
                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                placeholder="Ej: Juan Pérez"
                value={form.name} onChange={handleChange}
              />
              {errors.name && <p className="text-error text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Correo electrónico *</span></label>
              <input
                type="email" name="email"
                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                placeholder="correo@ejemplo.com"
                value={form.email} onChange={handleChange}
              />
              {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Teléfono */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Teléfono</span>
                <span className="label-text-alt text-base-content/40">Opcional</span>
              </label>
              <input
                type="tel" name="phone"
                className="input input-bordered w-full"
                placeholder="Ej: 3001234567"
                value={form.phone} onChange={handleChange}
              />
            </div>

            {/* Contraseña */}
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Contraseña *</span></label>
              <input
                type="password" name="password"
                className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                value={form.password} onChange={handleChange}
              />
              {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
            </div>

            {apiError && (
              <div role="alert" className="alert alert-error py-2 text-sm">
                <span>{apiError}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary gap-2" disabled={saving}>
                {saving
                  ? <><span className="loading loading-spinner loading-xs" /> Creando...</>
                  : <><UserPlus size={16} /> Crear Cliente</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal: Confirmar eliminación ─── */
function DeleteModal({ customer, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onCancel}>
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl mx-4 text-center p-8" onClick={(e) => e.stopPropagation()}>
        <Trash2 size={40} className="mx-auto mb-4 text-error" />
        <h3 className="text-lg font-bold text-base-content">Eliminar Cliente</h3>
        <p className="text-sm text-base-content/60 mt-2">
          ¿Eliminar a <strong>{customer.name}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-center gap-3 mt-6">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancelar</button>
          <button className="btn btn-error" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm" /> : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Página principal ─── */
function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [toDelete, setToDelete]   = useState(null);
  const [deleting, setDeleting]   = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
      if (res.ok) setCustomers(res.data);
      else {
        setError(res.msg || 'Error al cargar clientes');
        toast.error(res.msg || 'Error al cargar clientes');
      }
    } catch {
      setError('Error al conectar con el servidor');
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleCreated = (newCustomer) => {
    setCustomers((prev) => [{ ...newCustomer, assignedTable: null }, ...prev]);
    toast.success('Cliente creado');
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await deleteCustomer(toDelete._id);
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c._id !== toDelete._id));
        setToDelete(null);
        toast.success('Cliente eliminado');
      } else {
        setError(res.msg || 'Error al eliminar');
        toast.error(res.msg || 'Error al eliminar cliente');
      }
    } catch {
      setError('Error al conectar con el servidor');
      toast.error('Error al conectar con el servidor');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Clientes</h1>
            <p className="text-sm text-base-content/60">
              {customers.length} cliente{customers.length !== 1 ? 's' : ''} registrados
            </p>
          </div>
          {isAdmin && (
            <button className="btn btn-primary shadow-sm gap-2 self-start" onClick={() => setShowCreate(true)}>
              <Plus size={18} /> Nuevo Cliente
            </button>
          )}
        </div>

        {error && (
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {/* Tabla o estado vacío */}
        {customers.length === 0 ? (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body items-center py-16 text-center">
              <Users size={48} className="mb-4 opacity-30 mx-auto" />
              <h3 className="text-lg font-semibold text-base-content/60">No hay clientes registrados</h3>
              <p className="text-sm text-base-content/40">Registra el primer cliente para empezar</p>
              {isAdmin && (
                <button className="btn btn-primary mt-4 gap-2" onClick={() => setShowCreate(true)}>
                  <Plus size={18} /> Nuevo Cliente
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-sm border border-base-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="text-base-content/70 text-xs uppercase tracking-wider">
                    <th>Cliente</th>
                    <th>Contacto</th>
                    <th>Nivel</th>
                    <th className="text-center">Puntos</th>
                    <th>Mesa Asignada</th>
                    {isAdmin && <th className="text-right">Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-base-200/50 transition-colors">
                      {/* Avatar + nombre */}
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-base-content text-sm">{c.name}</span>
                        </div>
                      </td>
                      {/* Contacto */}
                      <td>
                        <p className="text-sm text-base-content/70">{c.email}</p>
                        {c.phone && <p className="text-xs text-base-content/40">{c.phone}</p>}
                      </td>
                      {/* Nivel */}
                      <td>
                        <span className={`badge badge-soft ${LEVEL_BADGE[c.level] || 'badge-ghost'} text-xs`}>
                          {LEVEL_LABEL[c.level] || c.level}
                        </span>
                      </td>
                      {/* Puntos */}
                      <td className="text-center">
                        <div>
                          <span className="font-semibold text-primary">{c.points ?? 0}</span>
                          <span className="text-xs text-base-content/40 ml-1">pts (actuales)</span>
                        </div>
                        <div className="text-[10px] text-base-content/40 mt-0.5">
                          {c.lifetimePoints ?? 0} pts históricos
                        </div>
                      </td>
                      {/* Mesa */}
                      <td>
                        {c.assignedTable ? (
                          <div className="flex items-center gap-1.5">
                            <UserCheck size={14} className="text-success" />
                            <span className="text-sm font-medium text-base-content">
                              Mesa {c.assignedTable.tableNumber}
                              {c.assignedTable.name && (
                                <span className="text-base-content/40 font-normal"> · {c.assignedTable.name}</span>
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-base-content/30 italic">Sin mesa</span>
                        )}
                      </td>
                      {/* Acciones */}
                      {isAdmin && (
                        <td className="text-right">
                          <button
                            className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-1"
                            onClick={() => setToDelete(c)}
                          >
                            <Trash2 size={14} /> Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <NewCustomerModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />

      {toDelete && (
        <DeleteModal
          customer={toDelete}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}

export default CustomerListPage;
