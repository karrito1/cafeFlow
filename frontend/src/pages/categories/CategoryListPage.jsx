import { useState, useEffect, useCallback } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/categoryApi';
import { FolderOpen, Trash2 } from 'lucide-react';

function CategoryModal({ isOpen, onClose, onSave, category }) {
  const [form, setForm] = useState({ name: '', description: '', order: '0' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || '',
        description: category.description || '',
        order: String(category.order ?? 0),
      });
    } else {
      setForm({ name: '', description: '', order: '0' });
    }
    setError('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setLoading(true);
    try {
      await onSave(form, category);
      onClose();
    } catch (err) {
      setError(err?.msg || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="card bg-base-100 w-full max-w-md shadow-2xl mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="card-body px-8 py-8">
          <h2 className="text-lg font-bold text-base-content mb-4">
            {category ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Nombre</span></label>
              <input className="input input-bordered" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
            </div>
            <div className="form-control">
              <input className="input input-bordered" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción (opcional)" />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Orden</span></label>
              <input type="number" className="input input-bordered" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
            </div>
            {error && <div className="alert alert-error py-2 text-sm">{error}</div>}
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      if (res.ok) setCategories(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async (form, category) => {
    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      order: Number(form.order) || 0,
    };
    if (category) {
      const res = await updateCategory(category._id, data);
      if (!res.ok) throw res;
    } else {
      const res = await createCategory(data);
      if (!res.ok) throw res;
    }
    await fetchData();
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
    setDeleting(null);
    await fetchData();
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
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content">Categorías</h1>
            <p className="text-sm text-base-content/60">{categories.length} categorías</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
            + Nueva
          </button>
        </div>

        {categories.length === 0 ? (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body items-center py-16 text-center">
              <FolderOpen size={48} className="mb-4 opacity-30 mx-auto" />
              <h3 className="text-lg font-semibold text-base-content">No hay categorías</h3>
              <p className="text-sm text-base-content/40">Crea tu primera categoría para organizar los productos</p>
              <button className="btn btn-primary mt-4" onClick={() => { setEditing(null); setModalOpen(true); }}>
                + Crear Categoría
              </button>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-base-content/60 text-sm">
                    <th>Orden</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-base-200">
                      <td className="text-sm text-base-content/60">{cat.order}</td>
                      <td className="font-medium text-base-content">{cat.name}</td>
                      <td className="text-sm text-base-content/60 max-w-xs truncate">{cat.description || '—'}</td>
                      <td className="text-right">
                        <button className="btn btn-ghost btn-xs" onClick={() => { setEditing(cat); setModalOpen(true); }}>Editar</button>
                        <button className="btn btn-ghost btn-xs text-error" onClick={() => setDeleting(cat)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <CategoryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          category={editing}
        />

        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleting(null)}>
            <div className="card bg-base-100 w-full max-w-sm shadow-2xl mx-4 text-center p-8" onClick={(e) => e.stopPropagation()}>
              <Trash2 size={40} className="mx-auto mb-4 text-error" />
              <h3 className="text-lg font-bold text-base-content">Eliminar Categoría</h3>
              <p className="text-sm text-base-content/60 mt-2">¿Eliminar "{deleting.name}"?</p>
              <div className="flex justify-center gap-3 mt-6">
                <button className="btn btn-ghost" onClick={() => setDeleting(null)}>Cancelar</button>
                <button className="btn btn-error" onClick={() => handleDelete(deleting._id)}>Eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryListPage;
